"""자영업자 파트 API (담당: 박보경)."""
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models as m
from ..database import get_db
from ..schemas import OrderCreate, ReviewCreate, SubscriptionCreate, SubscriptionUpdate
from ..serializers import order_out, subscription_out
from ..services.forecast import store_forecast
from ..services.matching import match_order
from ..services.menu import menu_ideas

router = APIRouter(prefix="/api", tags=["store"])
FREE_SHIPPING = 100_000
SHIPPING_FEE = 4_000


def get_store(db: Session, store_id: str) -> m.Store:
    s = db.get(m.Store, store_id)
    if not s:
        raise HTTPException(404, "매장을 찾을 수 없어요")
    return s


def get_order(db: Session, code: str) -> m.Order:
    o = db.query(m.Order).filter(m.Order.code == code).first()
    if not o:
        raise HTTPException(404, "주문을 찾을 수 없어요")
    return o


@router.get("/stores/{store_id}")
def store_detail(store_id: str, db: Session = Depends(get_db)):
    s = get_store(db, store_id)
    return {"id": s.id, "name": s.name, "type": s.type, "location": s.location, "icon": s.icon}


@router.get("/stores/{store_id}/home")
def home(store_id: str, db: Session = Depends(get_db)):
    get_store(db, store_id)
    orders = [order_out(o) for o in db.query(m.Order).filter(m.Order.store_id == store_id).order_by(m.Order.created_at.desc())]
    saved = sum(o["saving"] for o in orders)
    spent = sum(o["total"] for o in orders)
    active = next((o for o in orders if o["step"] < len(m.ORDER_STEPS) - 1), None)
    return {
        "saved": saved,
        "saving_rate": saved / (spent + saved) if spent else 0,
        "active_order": active,
        "recommendations": store_forecast(db, store_id)[:5],
        "subscription_count": db.query(m.Subscription).filter(m.Subscription.store_id == store_id).count(),
        "max_discount_pct": max(round((1 - f.price / f.market_price) * 100) for f in db.query(m.Fruit)),
    }


# ---------- AI 발주 추천 ----------
@router.get("/stores/{store_id}/forecast")
def forecast(store_id: str, db: Session = Depends(get_db)):
    get_store(db, store_id)
    return store_forecast(db, store_id)


# ---------- AI 메뉴 제안 ----------
@router.get("/stores/{store_id}/menu-ideas")
def menu(store_id: str, db: Session = Depends(get_db)):
    return menu_ideas(db, get_store(db, store_id))


# ---------- 정기 발주 ----------
@router.get("/stores/{store_id}/subscriptions")
def list_subs(store_id: str, db: Session = Depends(get_db)):
    subs = [subscription_out(s) for s in db.query(m.Subscription).filter(m.Subscription.store_id == store_id)]
    return {"items": subs, "monthly_kg": round(sum(s["monthly_kg"] for s in subs), 1)}


@router.post("/stores/{store_id}/subscriptions", status_code=201)
def create_sub(store_id: str, body: SubscriptionCreate, db: Session = Depends(get_db)):
    get_store(db, store_id)
    if not db.get(m.Fruit, body.fruit_id):
        raise HTTPException(400, "없는 과일이에요")
    if db.query(m.Subscription).filter_by(store_id=store_id, fruit_id=body.fruit_id).first():
        raise HTTPException(409, "이미 정기 발주 중인 과일이에요")
    s = m.Subscription(store_id=store_id, fruit_id=body.fruit_id, boxes=body.boxes,
                       days=",".join(str(d) for d in sorted(set(body.days)) if 0 <= d <= 6) or "2")
    db.add(s)
    db.commit()
    return subscription_out(s)


@router.patch("/subscriptions/{sub_id}")
def update_sub(sub_id: int, body: SubscriptionUpdate, db: Session = Depends(get_db)):
    s = db.get(m.Subscription, sub_id)
    if not s:
        raise HTTPException(404, "정기 발주를 찾을 수 없어요")
    if body.boxes is not None:
        s.boxes = body.boxes
    if body.days is not None:
        days = sorted({d for d in body.days if 0 <= d <= 6})
        if not days:
            raise HTTPException(400, "요일을 하나 이상 골라 주세요")
        s.days = ",".join(map(str, days))
    db.commit()
    return subscription_out(s)


@router.delete("/subscriptions/{sub_id}", status_code=204)
def delete_sub(sub_id: int, db: Session = Depends(get_db)):
    s = db.get(m.Subscription, sub_id)
    if s:
        db.delete(s)
        db.commit()


# ---------- 주문 ----------
@router.get("/stores/{store_id}/orders")
def list_orders(store_id: str, db: Session = Depends(get_db)):
    return [order_out(o) for o in db.query(m.Order).filter(m.Order.store_id == store_id).order_by(m.Order.created_at.desc())]


@router.post("/stores/{store_id}/orders", status_code=201)
def create_order(store_id: str, body: OrderCreate, db: Session = Depends(get_db)):
    get_store(db, store_id)
    now = datetime.now()
    seq = db.query(m.Order).count() + 131
    order = m.Order(code=f"GI-{now:%m%d}-{seq:04d}", store_id=store_id, slot=body.slot, pay_method=body.pay_method, created_at=now)
    total = 0
    merged: dict[str, int] = {}
    for it in body.items:
        merged[it.fruit_id] = merged.get(it.fruit_id, 0) + it.boxes
    for fid, boxes in merged.items():
        f = db.get(m.Fruit, fid)
        if not f:
            raise HTTPException(400, f"없는 과일이에요: {fid}")
        order.items.append(m.OrderItem(fruit_id=fid, boxes=boxes, unit_kg=f.unit_kg, price=f.price, market_price=f.market_price))
        total += f.price * f.unit_kg * boxes
    order.shipping_fee = 0 if total >= FREE_SHIPPING else SHIPPING_FEE
    order.events.append(m.OrderEvent(step=0, at=now))
    db.add(order)
    db.flush()
    match_order(db, order)  # AI 농가 매칭 → 농가에 출하 요청 생성
    order.step = 1
    order.events.append(m.OrderEvent(step=1, at=datetime.now()))
    db.commit()
    return order_out(order)


@router.get("/orders/{code}")
def order_detail(code: str, db: Session = Depends(get_db)):
    return order_out(get_order(db, code))


@router.post("/orders/{code}/advance")
def advance(code: str, db: Session = Depends(get_db)):
    """데모용: 주문을 다음 단계로 진행."""
    o = get_order(db, code)
    if o.step < len(m.ORDER_STEPS) - 1:
        o.step += 1
        o.events.append(m.OrderEvent(step=o.step, at=datetime.now()))
        db.commit()
    return order_out(o)


@router.post("/orders/{code}/review", status_code=201)
def review(code: str, body: ReviewCreate, db: Session = Depends(get_db)):
    """품질 평가 → 농가 평점에 반영되어 다음 매칭 점수에 영향."""
    o = get_order(db, code)
    if o.step < len(m.ORDER_STEPS) - 1:
        raise HTTPException(400, "도착한 주문만 평가할 수 있어요")
    if o.review:
        raise HTTPException(409, "이미 평가한 주문이에요")
    o.review = m.Review(**body.model_dump())
    avg = (body.taste + body.freshness + body.size) / 3
    for farm in {it.farm for it in o.items if it.farm}:
        farm.rating = round((farm.rating * farm.rating_count + avg) / (farm.rating_count + 1), 2)
        farm.rating_count += 1
    db.commit()
    return order_out(o)
