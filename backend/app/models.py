"""DB 모델.

공용: Fruit, Farm, FarmSupply
자영업자 파트: Store, UsageHistory, Order, OrderItem, OrderEvent, Subscription, Review
생산자 파트(팀원): ShipmentRequest — 주문이 매칭되면 농가에 생기는 출하 요청
"""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base

# 주문 단계 (자영업자 앱 타임라인과 동일)
ORDER_STEPS = [
    ("주문 접수", "결제 확인"),
    ("AI 농가 매칭", "품목·수량·거리·평점으로 배정"),
    ("수확·선별", "산지에서 당일 선별"),
    ("산지 출고", "냉장 차량 상차"),
    ("배송 중", "매장으로 직송"),
    ("도착", "매장 검수 완료"),
]


class Fruit(Base):
    __tablename__ = "fruits"
    id: Mapped[str] = mapped_column(String, primary_key=True)  # 예: "apple"
    name: Mapped[str] = mapped_column(String)
    grade: Mapped[str] = mapped_column(String)  # 특 / 상 / B급
    unit_kg: Mapped[float] = mapped_column(Float)  # 박스 단위
    price: Mapped[int] = mapped_column(Integer)  # 과일잇다 kg당 가격
    market_price: Mapped[int] = mapped_column(Integer)  # 도매시장 경유 소매가 (kg당)
    season: Mapped[str] = mapped_column(String)  # peak / rising / falling
    ugly: Mapped[bool] = mapped_column(Boolean, default=False)
    tint: Mapped[str] = mapped_column(String, default="#EEF5EE")  # 카드 배경색


class Farm(Base):
    __tablename__ = "farms"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    region: Mapped[str] = mapped_column(String)
    distance_km: Mapped[int] = mapped_column(Integer)  # 수도권 배송지까지 거리
    rating: Mapped[float] = mapped_column(Float, default=4.5)
    rating_count: Mapped[int] = mapped_column(Integer, default=0)
    deals: Mapped[int] = mapped_column(Integer, default=0)
    supplies: Mapped[list["FarmSupply"]] = relationship(back_populates="farm")


class FarmSupply(Base):
    """농가가 이번 주 출하할 수 있는 품목과 물량 (생산자 앱에서 등록)."""

    __tablename__ = "farm_supplies"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    farm_id: Mapped[int] = mapped_column(ForeignKey("farms.id"))
    fruit_id: Mapped[str] = mapped_column(ForeignKey("fruits.id"))
    weekly_capacity_kg: Mapped[float] = mapped_column(Float)
    available_kg: Mapped[float] = mapped_column(Float)
    harvested_at: Mapped[datetime] = mapped_column(DateTime)
    farm: Mapped[Farm] = relationship(back_populates="supplies")
    fruit: Mapped[Fruit] = relationship()


class Store(Base):
    __tablename__ = "stores"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    type: Mapped[str] = mapped_column(String)  # 카페 / 디저트 / 과일가게 / 주스바
    location: Mapped[str] = mapped_column(String)
    icon: Mapped[str] = mapped_column(String)


class UsageHistory(Base):
    """매장별 주간 과일 사용량 (AI 수요예측 입력). week 0 = 8주 전, 7 = 지난주."""

    __tablename__ = "usage_history"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    store_id: Mapped[str] = mapped_column(ForeignKey("stores.id"))
    fruit_id: Mapped[str] = mapped_column(ForeignKey("fruits.id"))
    week: Mapped[int] = mapped_column(Integer)
    kg: Mapped[float] = mapped_column(Float)


class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String, unique=True, index=True)
    store_id: Mapped[str] = mapped_column(ForeignKey("stores.id"))
    step: Mapped[int] = mapped_column(Integer, default=0)
    slot: Mapped[str] = mapped_column(String, default="am")  # am / pm
    pay_method: Mapped[str] = mapped_column(String, default="month")  # month / card
    shipping_fee: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    events: Mapped[list["OrderEvent"]] = relationship(back_populates="order", cascade="all, delete-orphan", order_by="OrderEvent.step")
    review: Mapped["Review | None"] = relationship(back_populates="order", uselist=False)


class OrderItem(Base):
    __tablename__ = "order_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    fruit_id: Mapped[str] = mapped_column(ForeignKey("fruits.id"))
    boxes: Mapped[int] = mapped_column(Integer)
    unit_kg: Mapped[float] = mapped_column(Float)
    price: Mapped[int] = mapped_column(Integer)  # 주문 시점 kg당 가격
    market_price: Mapped[int] = mapped_column(Integer)
    farm_id: Mapped[int | None] = mapped_column(ForeignKey("farms.id"), nullable=True)
    match_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    order: Mapped[Order] = relationship(back_populates="items")
    fruit: Mapped[Fruit] = relationship()
    farm: Mapped[Farm | None] = relationship()


class OrderEvent(Base):
    __tablename__ = "order_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    step: Mapped[int] = mapped_column(Integer)
    at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    order: Mapped[Order] = relationship(back_populates="events")


class Subscription(Base):
    __tablename__ = "subscriptions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    store_id: Mapped[str] = mapped_column(ForeignKey("stores.id"))
    fruit_id: Mapped[str] = mapped_column(ForeignKey("fruits.id"))
    boxes: Mapped[int] = mapped_column(Integer, default=1)
    days: Mapped[str] = mapped_column(String, default="2,5")  # 0=일 ... 6=토
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    fruit: Mapped[Fruit] = relationship()


class Review(Base):
    __tablename__ = "reviews"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), unique=True)
    taste: Mapped[int] = mapped_column(Integer)
    freshness: Mapped[int] = mapped_column(Integer)
    size: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str] = mapped_column(String, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    order: Mapped[Order] = relationship(back_populates="review")


class ShipmentRequest(Base):
    """[생산자 파트 연결 지점] 매칭된 주문 품목마다 농가에 생기는 출하 요청."""

    __tablename__ = "shipment_requests"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_item_id: Mapped[int] = mapped_column(ForeignKey("order_items.id"))
    farm_id: Mapped[int] = mapped_column(ForeignKey("farms.id"))
    kg: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String, default="requested")  # requested / accepted / shipped
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    order_item: Mapped[OrderItem] = relationship()
    farm: Mapped[Farm] = relationship()
