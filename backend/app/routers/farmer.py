"""생산자 파트 API (담당: 팀원).

자영업자 주문이 매칭되면 ShipmentRequest가 생깁니다. 아래는 연결에 필요한 최소 API이며,
생산자 앱 기능(출하 등록, 정산, 수요 예측 보기 등)은 이 파일에서 확장하면 됩니다.
"""
from collections import defaultdict
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models as m
from ..database import get_db
from ..schemas import ShipmentStatusUpdate, SupplyUpdate

router = APIRouter(prefix="/api/farmer", tags=["farmer"])


@router.get("/farms")
def farms(db: Session = Depends(get_db)):
    return [{"id": f.id, "name": f.name, "region": f.region, "rating": f.rating, "deals": f.deals,
             "supplies": [{"id": s.id, "fruit_id": s.fruit_id, "fruit": s.fruit.name,
                           "weekly_capacity_kg": s.weekly_capacity_kg, "available_kg": round(s.available_kg, 1)}
                          for s in f.supplies]}
            for f in db.query(m.Farm).all()]


@router.get("/farms/{farm_id}/requests")
def requests(farm_id: int, db: Session = Depends(get_db)):
    rows = (db.query(m.ShipmentRequest).filter(m.ShipmentRequest.farm_id == farm_id)
            .order_by(m.ShipmentRequest.created_at.desc()).all())
    return [{"id": r.id, "status": r.status, "kg": r.kg, "fruit": r.order_item.fruit.name,
             "order_code": r.order_item.order.code, "store_id": r.order_item.order.store_id,
             "created_at": r.created_at.isoformat()} for r in rows]


@router.patch("/requests/{req_id}")
def update_request(req_id: int, body: ShipmentStatusUpdate, db: Session = Depends(get_db)):
    """농가가 출하 요청을 수락(accepted)하거나 출고(shipped)하면 자영업자 주문 단계도 같이 움직입니다."""
    r = db.get(m.ShipmentRequest, req_id)
    if not r:
        raise HTTPException(404, "출하 요청을 찾을 수 없어요")
    r.status = body.status
    order = r.order_item.order
    reqs = db.query(m.ShipmentRequest).join(m.OrderItem).filter(m.OrderItem.order_id == order.id).all()
    target = 3 if all(x.status == "shipped" for x in reqs) else 2 if all(x.status in ("accepted", "shipped") for x in reqs) else None
    if target and order.step < target:
        for step in range(order.step + 1, target + 1):
            order.events.append(m.OrderEvent(step=step, at=datetime.now()))
        order.step = target
    db.commit()
    return {"id": r.id, "status": r.status, "order_step": order.step}


@router.patch("/supplies/{supply_id}")
def update_supply(supply_id: int, body: SupplyUpdate, db: Session = Depends(get_db)):
    s = db.get(m.FarmSupply, supply_id)
    if not s:
        raise HTTPException(404, "공급 정보를 찾을 수 없어요")
    if body.weekly_capacity_kg is not None:
        s.weekly_capacity_kg = body.weekly_capacity_kg
    if body.available_kg is not None:
        s.available_kg = body.available_kg
    db.commit()
    return {"id": s.id, "weekly_capacity_kg": s.weekly_capacity_kg, "available_kg": s.available_kg}


@router.get("/demand")
def demand(db: Session = Depends(get_db)):
    """품목별 다음 주 예상 수요(전체 매장 합계) — 농가 출하 계획용."""
    from ..services.forecast import store_forecast

    total: dict[str, float] = defaultdict(float)
    for s in db.query(m.Store).all():
        for r in store_forecast(db, s.id):
            total[r["fruit_id"]] += r["forecast_kg"]
    return [{"fruit_id": k, "forecast_kg": round(v, 1)} for k, v in sorted(total.items(), key=lambda x: -x[1])]
