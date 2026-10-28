"""데모 데이터. DB가 비어 있을 때 서버 시작 시 한 번 들어갑니다. 모든 수치는 가상 데이터입니다."""
import random
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from . import models as m

FRUITS = [
    # id, 이름, 등급, 박스kg, 가격/kg, 도매경유가/kg, 시즌, B급, 카드색
    ("apple", "홍로 사과", "특", 5, 6900, 9800, "peak", False, "#FDE3DF"),
    ("pear", "신고 배", "특", 7.5, 5400, 7600, "peak", False, "#F6F2D2"),
    ("shine", "샤인머스캣", "상", 2, 14000, 19500, "falling", False, "#E8F4D4"),
    ("persim", "단감", "특", 5, 4800, 6900, "rising", False, "#FDE8D4"),
    ("tang", "조생 귤", "상", 5, 4200, 6100, "rising", False, "#FEEBD3"),
    ("kiwi", "골드키위", "특", 3, 9800, 13500, "rising", False, "#F4F0D0"),
    ("fig", "무화과", "상", 2, 11000, 16000, "falling", False, "#F4E1EA"),
    ("yuzu", "유자", "상", 3, 8500, 12000, "rising", False, "#FBF3CC"),
    ("uapple", "못난이 사과", "B급", 10, 3900, 5500, "peak", True, "#F8E6E2"),
    ("utang", "못난이 귤", "B급", 10, 2600, 4000, "rising", True, "#FBEEDD"),
]

FARMS = [
    # 농가, 지역, 거리km, 평점, 거래수, [(품목, 주간 생산량kg, 수확 몇 시간 전)]
    ("소백 햇살농원", "경북 영주", 180, 4.8, 132, [("apple", 900, 20), ("uapple", 600, 20)]),
    ("풍기 사과마을", "경북 영주", 190, 4.6, 87, [("apple", 700, 26)]),
    ("영산강 배농원", "전남 나주", 290, 4.7, 98, [("pear", 800, 26)]),
    ("안성 배나무집", "경기 안성", 70, 4.5, 54, [("pear", 600, 30)]),
    ("직지 포도원", "경북 김천", 200, 4.9, 211, [("shine", 300, 18)]),
    ("영동 포도마을", "충북 영동", 170, 4.7, 76, [("shine", 250, 24)]),
    ("진영 단감마을", "경남 김해", 330, 4.6, 64, [("persim", 700, 22)]),
    ("창원 북면 감농원", "경남 창원", 340, 4.4, 31, [("persim", 400, 28)]),
    ("효돈 귤밭", "제주 서귀포", 470, 4.8, 175, [("tang", 1200, 30), ("utang", 900, 30)]),
    ("남원 감귤농장", "제주 서귀포", 480, 4.6, 92, [("tang", 800, 34), ("utang", 500, 34)]),
    ("땅끝 키위농장", "전남 해남", 350, 4.7, 88, [("kiwi", 400, 24)]),
    ("보성 키위원", "전남 보성", 330, 4.5, 40, [("kiwi", 250, 30)]),
    ("삼호 무화과농원", "전남 영암", 320, 4.9, 57, [("fig", 200, 16)]),
    ("신안 무화과섬", "전남 신안", 360, 4.6, 22, [("fig", 150, 20)]),
    ("팔영산 유자원", "전남 고흥", 360, 4.6, 41, [("yuzu", 300, 28)]),
    ("완도 유자밭", "전남 완도", 390, 4.5, 18, [("yuzu", 200, 32)]),
]

STORES = [
    # id, 이름, 업종, 위치, 아이콘, {품목: 주간 기본 사용량kg}
    ("cafe", "카페 온기", "카페", "수원 영통구", "온", {"tang": 6, "kiwi": 4, "shine": 3, "apple": 4, "yuzu": 3, "fig": 2}),
    ("dessert", "달다방 파티스리", "디저트", "용인 수지구", "달", {"fig": 5, "shine": 6, "persim": 3, "apple": 5, "kiwi": 3, "pear": 2}),
    ("shop", "싱싱청과", "과일가게", "화성 동탄", "싱", {"apple": 40, "pear": 35, "tang": 45, "persim": 30, "shine": 15, "kiwi": 12}),
    ("juice", "착즙공방", "주스바", "성남 분당구", "착", {"uapple": 30, "utang": 25, "kiwi": 8, "pear": 10, "apple": 6}),
]


def season_mult(season: str, week: int) -> float:
    t = week / 7
    if season == "rising":
        return 0.6 + 0.55 * t
    if season == "falling":
        return 1.3 - 0.55 * t
    return 0.9 + 0.15 * __import__("math").sin(t * 3)


def seed(db: Session) -> None:
    if db.query(m.Fruit).count():
        return
    now = datetime.now()
    fruits = {}
    for fid, name, grade, unit, price, market, season, ugly, tint in FRUITS:
        fruits[fid] = m.Fruit(id=fid, name=name, grade=grade, unit_kg=unit, price=price, market_price=market,
                              season=season, ugly=ugly, tint=tint)
        db.add(fruits[fid])

    for name, region, km, rating, deals, supplies in FARMS:
        farm = m.Farm(name=name, region=region, distance_km=km, rating=rating, rating_count=deals, deals=deals)
        db.add(farm)
        for fid, cap, hrs in supplies:
            db.add(m.FarmSupply(farm=farm, fruit_id=fid, weekly_capacity_kg=cap, available_kg=cap * 0.85,
                                harvested_at=now - timedelta(hours=hrs)))

    for sid, name, typ, loc, icon, usage in STORES:
        db.add(m.Store(id=sid, name=name, type=typ, location=loc, icon=icon))
        for fid, base in usage.items():
            rnd = random.Random(sid + fid)
            for w in range(8):
                kg = max(0.0, base * season_mult(fruits[fid].season, w) * (1 + (rnd.random() - 0.5) * 0.3))
                db.add(m.UsageHistory(store_id=sid, fruit_id=fid, week=w, kg=round(kg, 2)))
    db.flush()

    # 진행 상황이 다른 데모 주문들
    from .services.matching import match_order  # 순환 import 방지

    demo_orders = [
        ("GI-1027-0412", "cafe", {"tang": 2, "kiwi": 1}, [-30, -29.8, -24, -14, -9, -6]),
        ("GI-1028-0107", "cafe", {"apple": 1, "shine": 2, "yuzu": 1}, [-7, -6.8, -3, -0.5]),
        ("GI-1028-0093", "shop", {"apple": 8, "pear": 5, "tang": 9}, [-9, -8.7, -5, -2, -0.4]),
        ("GI-1028-0121", "dessert", {"fig": 3, "shine": 3}, [-4, -3.8, -1]),
        ("GI-1028-0130", "juice", {"uapple": 3, "utang": 3}, [-2, -1.9]),
    ]
    for code, sid, items, hours in demo_orders:
        order = m.Order(code=code, store_id=sid, step=len(hours) - 1, created_at=now + timedelta(hours=hours[0]))
        for fid, boxes in items.items():
            f = fruits[fid]
            order.items.append(m.OrderItem(fruit_id=fid, boxes=boxes, unit_kg=f.unit_kg, price=f.price, market_price=f.market_price))
        for step, h in enumerate(hours):
            order.events.append(m.OrderEvent(step=step, at=now + timedelta(hours=h)))
        db.add(order)
        db.flush()
        match_order(db, order)

    db.add(m.Subscription(store_id="cafe", fruit_id="tang", boxes=1, days="1,4"))
    db.add(m.Subscription(store_id="shop", fruit_id="apple", boxes=4, days="1,3,5"))
    db.commit()
