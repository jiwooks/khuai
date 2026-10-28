"""AI 제철 메뉴 제안: 업종별 메뉴 틀 + 이번 주 과일 가격·시즌으로 메뉴와 원가를 계산합니다."""
from sqlalchemy.orm import Session

from .. import models as m

# 업종별 (메뉴 종류, 1개당 과일 사용량 g, 제안 판매가, 설명)
TEMPLATES = {
    "카페": [("에이드", 180, 6500, "탄산수·시럽 베이스, 과육 슬라이스 토핑"),
            ("요거트 스무디", 150, 6800, "플레인 요거트와 1:1 블렌딩"),
            ("과일 티", 120, 5800, "청을 3일 숙성해 핫/아이스")],
    "디저트": [("타르트", 140, 7500, "커스터드 위 생과일 올리기"),
            ("파르페", 120, 8900, "그래놀라·생크림 레이어"),
            ("생크림 조각 케이크", 90, 7200, "시트 사이 과육 샌드")],
    "과일가게": [("컷과일 컵", 250, 5900, "당일 손질, 냉장 진열"),
             ("제철 선물 바구니", 1800, 39000, "2~3종 혼합, 리본 포장"),
             ("실속 봉지", 1500, 9900, "크기 섞음 묶음 판매")],
    "주스바": [("착즙 주스", 350, 6500, "원물 100% 착즙"),
            ("블렌딩 클렌즈", 300, 7500, "두 과일 혼합 착즙"),
            ("과일 젤라또", 120, 5500, "착즙 후 남은 과육 활용")],
}
OTHER_COST_RATIO = 0.18  # 과일 외 재료·포장비 비율 (가정)


def discount(f: m.Fruit) -> int:
    return round((1 - f.price / f.market_price) * 100)


def josa(word: str, pair: str = "은는") -> str:
    """받침 유무에 맞는 조사 (예: 유자는, 사과는, 귤은)."""
    ch = word[-1]
    has = "가" <= ch <= "힣" and (ord(ch) - 0xAC00) % 28 != 0
    return word + (pair[0] if has else pair[1])


def short(name: str) -> str:
    return name.replace("못난이 ", "")


def menu_ideas(db: Session, store: m.Store) -> list[dict]:
    used = {u.fruit_id for u in db.query(m.UsageHistory.fruit_id).filter(m.UsageHistory.store_id == store.id).distinct()}
    fruits = db.query(m.Fruit).all()
    pool = [f for f in fruits if (f.season != "falling" or store.type == "디저트") and (store.type == "주스바" or not f.ugly)]
    pool.sort(key=lambda f: discount(f) + (10 if f.season == "rising" else 0) + (5 if f.id in used else 0), reverse=True)

    ideas = []
    for i, (kind, grams, price, note) in enumerate(TEMPLATES.get(store.type, TEMPLATES["카페"])):
        f1 = pool[i % len(pool)]
        f2 = pool[(i + 3) % len(pool)] if i == 1 else None
        g1, g2 = (grams * 0.6, grams * 0.4) if f2 else (grams, 0)
        fruit_cost = g1 / 1000 * f1.price + (g2 / 1000 * f2.price if f2 else 0)
        market_cost = g1 / 1000 * f1.market_price + (g2 / 1000 * f2.market_price if f2 else 0)
        cost = fruit_cost + price * OTHER_COST_RATIO
        state = " 출하가 늘어 단가가 내려가는 중" if f1.season == "rising" else " 제철 절정"
        ideas.append({
            "name": f"{short(f1.name)}{'·' + short(f2.name) if f2 else ''} {kind}",
            "fruit_ids": [f.id for f in (f1, f2) if f],
            "note": note,
            "price": price,
            "cost": round(cost),
            "margin_pct": round((1 - cost / price) * 100),
            "saving_per_unit": round(market_cost - fruit_cost),
            "reason": f"{josa(f1.name)}{state}이고 도매 경유가보다 {discount(f1)}% 저렴해요.",
        })
    return ideas
