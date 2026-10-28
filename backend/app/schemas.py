from pydantic import BaseModel, Field


class CartItem(BaseModel):
    fruit_id: str
    boxes: int = Field(ge=1, le=200)


class OrderCreate(BaseModel):
    items: list[CartItem] = Field(min_length=1)
    slot: str = Field("am", pattern="^(am|pm)$")
    pay_method: str = Field("month", pattern="^(month|card)$")


class SubscriptionCreate(BaseModel):
    fruit_id: str
    boxes: int = Field(1, ge=1, le=100)
    days: list[int] = Field(default_factory=lambda: [2, 5])


class SubscriptionUpdate(BaseModel):
    boxes: int | None = Field(None, ge=1, le=100)
    days: list[int] | None = None


class ReviewCreate(BaseModel):
    taste: int = Field(ge=1, le=5)
    freshness: int = Field(ge=1, le=5)
    size: int = Field(ge=1, le=5)
    comment: str = ""


class ShipmentStatusUpdate(BaseModel):
    status: str = Field(pattern="^(accepted|shipped)$")


class SupplyUpdate(BaseModel):
    weekly_capacity_kg: float | None = Field(None, ge=0)
    available_kg: float | None = Field(None, ge=0)
