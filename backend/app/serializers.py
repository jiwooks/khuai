from datetime import datetime

from sqlalchemy.orm import Session

from . import models as m
from .services.matching import candidates, public

SEASON_LABEL = {"peak": "제철 절정", "rising": "출하 증가", "falling": "끝물"}


def hours_since(t: datetime) -> int:
    return max(0, round((datetime.now() - t).total_seconds() / 3600))


def fruit_out(db: Session, f: m.Fruit, with_candidates: bool = False) -> dict:
    cands = candidates(db, f.id)
    top = cands[0] if cands else None
    out = {
        "id": f.id, "name": f.name, "grade": f.grade, "unit_kg": f.unit_kg,
        "price": f.price, "market_price": f.market_price,
        "discount_pct": round((1 - f.price / f.market_price) * 100),
        "season": f.season, "season_label": SEASON_LABEL[f.season],
        "ugly": f.ugly, "tint": f.tint,
        "farm": top["farm"] if top else None,
        "region": top["region"] if top else None,
        "harvested_hours": hours_since(top["_supply"].harvested_at) if top else None,
        "rating": top["rating"] if top else None,
        "deals": top["deals"] if top else 0,
    }
    if with_candidates:
        out["candidates"] = [public(c) for c in cands]
    return out


def order_out(o: m.Order) -> dict:
    items, total, market_total, kg = [], 0, 0, 0.0
    for it in o.items:
        item_kg = it.boxes * it.unit_kg
        amount = round(it.price * item_kg)
        total += amount
        market_total += round(it.market_price * item_kg)
        kg += item_kg
        items.append({
            "fruit_id": it.fruit_id, "name": it.fruit.name, "tint": it.fruit.tint,
            "boxes": it.boxes, "unit_kg": it.unit_kg, "price": it.price, "amount": amount,
            "match_score": it.match_score,
            "farm": {"name": it.farm.name, "region": it.farm.region, "distance_km": it.farm.distance_km,
                     "rating": it.farm.rating} if it.farm else None,
        })
    at = {e.step: e.at for e in o.events}
    timeline = [{
        "label": label, "desc": desc,
        "at": at[i].isoformat() if i in at else None,
        "done": i < o.step or o.step == len(m.ORDER_STEPS) - 1,
        "current": i == o.step and o.step < len(m.ORDER_STEPS) - 1,
    } for i, (label, desc) in enumerate(m.ORDER_STEPS)]
    return {
        "code": o.code, "store_id": o.store_id, "step": o.step, "step_label": m.ORDER_STEPS[o.step][0],
        "slot": o.slot, "pay_method": o.pay_method, "created_at": o.created_at.isoformat(),
        "items": items, "kg": kg, "total": total, "market_total": market_total,
        "saving": market_total - total, "shipping_fee": o.shipping_fee,
        "timeline": timeline, "reviewed": o.review is not None,
    }


def subscription_out(s: m.Subscription) -> dict:
    days = [int(d) for d in s.days.split(",") if d != ""]
    return {
        "id": s.id, "fruit_id": s.fruit_id, "name": s.fruit.name, "tint": s.fruit.tint,
        "unit_kg": s.fruit.unit_kg, "boxes": s.boxes, "days": days,
        "monthly_kg": round(s.fruit.unit_kg * s.boxes * len(days) * 4.3, 1),
    }
