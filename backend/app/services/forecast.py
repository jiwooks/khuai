"""AI 발주 추천: 매장의 8주 사용량에 Holt 선형 지수평활을 적용해 다음 주 필요량을 예측합니다."""
from collections import defaultdict

from sqlalchemy.orm import Session

from .. import models as m

SEASON_NOTE = {
    "rising": "출하가 늘어 값이 내려가는 시기예요.",
    "falling": "끝물이라 물량이 줄어요. 미리 확보하세요.",
    "peak": "제철 절정이라 품질과 가격이 안정적이에요.",
}


def holt(xs: list[float], alpha: float = 0.55, beta: float = 0.35) -> dict:
    level, trend, err = xs[0], xs[1] - xs[0], 0.0
    for x in xs[1:]:
        pred = level + trend
        err += abs(x - pred)
        new_level = alpha * x + (1 - alpha) * (level + trend)
        trend = beta * (new_level - level) + (1 - beta) * trend
        level = new_level
    f = max(0.0, level + trend)
    mae = err / (len(xs) - 1)
    return {"forecast": f, "low": max(0.0, f - mae), "high": f + mae}


def store_forecast(db: Session, store_id: str) -> list[dict]:
    rows = (db.query(m.UsageHistory).filter(m.UsageHistory.store_id == store_id)
            .order_by(m.UsageHistory.week).all())
    series: dict[str, list[float]] = defaultdict(list)
    for r in rows:
        series[r.fruit_id].append(r.kg)
    fruits = {f.id: f for f in db.query(m.Fruit).filter(m.Fruit.id.in_(series.keys()))}
    out = []
    for fid, hist in series.items():
        if len(hist) < 2:
            continue
        f = fruits[fid]
        h = holt(hist)
        last4 = sum(hist[-4:]) / min(4, len(hist))
        boxes = max(1, round(h["forecast"] / f.unit_kg))
        change = (h["forecast"] / last4 - 1) * 100 if last4 else 0
        out.append({
            "fruit_id": fid,
            "history": [round(x, 2) for x in hist],
            "forecast_kg": round(h["forecast"], 1),
            "low_kg": round(h["low"], 1),
            "high_kg": round(h["high"], 1),
            "last4_avg_kg": round(last4, 1),
            "change_pct": round(change),
            "boxes": boxes,
            "reason": f"최근 4주 평균 {last4:.1f}kg 대비 {change:+.0f}%. {SEASON_NOTE[f.season]} "
                      f"→ {f.unit_kg:g}kg × {boxes}박스 추천",
        })
    out.sort(key=lambda r: r["forecast_kg"] * fruits[r["fruit_id"]].price, reverse=True)
    return out
