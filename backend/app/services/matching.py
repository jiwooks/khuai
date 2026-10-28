"""AI 농가 매칭.

점수(100점) = 신선도(거리) 40 + 농가 평점 35 + 공급 여력 25
필요 물량을 낼 수 있는 농가 중 점수가 가장 높은 곳에 배정하고, 농가에는 출하 요청을 만듭니다.
"""
from sqlalchemy.orm import Session

from .. import models as m

MAX_KM = 700


def score(supply: m.FarmSupply) -> int:
    farm = supply.farm
    freshness = 40 * max(0.0, 1 - farm.distance_km / MAX_KM)
    quality = 35 * (farm.rating / 5)
    capacity = 25 * (supply.available_kg / supply.weekly_capacity_kg if supply.weekly_capacity_kg else 0)
    return round(freshness + quality + capacity)


def candidates(db: Session, fruit_id: str, need_kg: float = 0) -> list[dict]:
    supplies = db.query(m.FarmSupply).filter(m.FarmSupply.fruit_id == fruit_id).all()
    out = []
    for s in supplies:
        out.append({
            "farm_id": s.farm.id,
            "farm": s.farm.name,
            "region": s.farm.region,
            "distance_km": s.farm.distance_km,
            "rating": s.farm.rating,
            "deals": s.farm.deals,
            "available_kg": round(s.available_kg, 1),
            "capacity_ratio": round(s.available_kg / s.weekly_capacity_kg, 2) if s.weekly_capacity_kg else 0,
            "harvested_at": s.harvested_at.isoformat(),
            "can_supply": s.available_kg >= need_kg,
            "score": score(s),
            "_supply": s,
        })
    out.sort(key=lambda c: (c["can_supply"], c["score"]), reverse=True)
    return out


def public(c: dict) -> dict:
    return {k: v for k, v in c.items() if not k.startswith("_")}


def match_order(db: Session, order: m.Order) -> None:
    """주문의 각 품목에 농가를 배정하고 출하 요청을 만듭니다."""
    for item in order.items:
        need = item.boxes * item.unit_kg
        cands = candidates(db, item.fruit_id, need)
        if not cands:
            continue
        best = cands[0]
        supply: m.FarmSupply = best["_supply"]
        item.farm_id = supply.farm_id
        item.match_score = best["score"]
        supply.available_kg = max(0.0, supply.available_kg - need)
        db.add(m.ShipmentRequest(order_item=item, farm_id=supply.farm_id, kg=need))
    db.flush()
