"""공용 API: 과일 카탈로그, 매장 목록."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models as m
from ..database import get_db
from ..serializers import fruit_out

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/fruits")
def list_fruits(q: str = "", filter: str = "all", store_id: str | None = None, db: Session = Depends(get_db)):
    fruits = db.query(m.Fruit).all()
    used = set()
    if filter == "mine" and store_id:
        used = {u.fruit_id for u in db.query(m.UsageHistory.fruit_id).filter(m.UsageHistory.store_id == store_id).distinct()}
    out = []
    for f in fruits:
        if filter == "ugly" and not f.ugly:
            continue
        if filter == "rising" and (f.season != "rising" or f.ugly):
            continue
        if filter == "mine" and f.id not in used:
            continue
        item = fruit_out(db, f)
        if q and q not in f"{f.name}{item['farm'] or ''}{item['region'] or ''}":
            continue
        out.append(item)
    return out


@router.get("/fruits/{fruit_id}")
def get_fruit(fruit_id: str, db: Session = Depends(get_db)):
    f = db.get(m.Fruit, fruit_id)
    if not f:
        raise HTTPException(404, "과일을 찾을 수 없어요")
    out = fruit_out(db, f, with_candidates=True)
    others = [x for x in db.query(m.Fruit).all() if x.id != f.id and not x.ugly and x.season != "falling"][:3]
    out["also"] = [fruit_out(db, x) for x in others]
    return out


@router.get("/stores")
def list_stores(db: Session = Depends(get_db)):
    return [{"id": s.id, "name": s.name, "type": s.type, "location": s.location, "icon": s.icon}
            for s in db.query(m.Store).all()]
