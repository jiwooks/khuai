# 1) 프론트엔드 빌드
FROM node:20-alpine AS web
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) FastAPI 서버가 API와 빌드된 화면을 함께 제공
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend/ backend/
COPY --from=web /app/frontend/dist frontend/dist
WORKDIR /app/backend
ENV DATABASE_URL=sqlite:////app/backend/gwailitda.db
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
