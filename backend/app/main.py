import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from . import models  # noqa: F401  (테이블 등록)
from .database import Base, SessionLocal, engine
from .routers import catalog, farmer, store
from .seed import seed

app = FastAPI(title="과일잇다 API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(engine)
with SessionLocal() as db:
    seed(db)

app.include_router(catalog.router)
app.include_router(store.router)
app.include_router(farmer.router)


@app.get("/api/health")
def health():
    return {"ok": True}


# 배포 시: 빌드된 프론트엔드(frontend/dist)를 같은 서버에서 제공
DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if DIST.exists():
    app.mount("/assets", StaticFiles(directory=DIST / "assets"), name="assets")

    @app.get("/{path:path}", include_in_schema=False)
    def spa(path: str):
        file = DIST / path
        return FileResponse(file if path and file.is_file() else DIST / "index.html")
