import time
from collections import defaultdict

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.core.config import settings
from app.db import Base, engine
from app.routes.auth import router as auth_router
from app.routes.chat import router as chat_router
from app.routes.notebooks import router as notebooks_router
from app.routes.sources import router as sources_router
from app.routes.studio import router as studio_router


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.rpm = requests_per_minute
        self._windows: dict[str, list[float]] = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Skip health endpoint
        if request.url.path == "/health":
            return await call_next(request)

        client = request.client.host if request.client else "unknown"
        now = time.time()
        window = self._windows[client]
        # Purge requests older than 60s
        cutoff = now - 60
        while window and window[0] < cutoff:
            window.pop(0)

        if len(window) >= self.rpm:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Try again in 60 seconds."},
                headers={"Retry-After": "60"},
            )

        window.append(now)
        return await call_next(request)


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware, requests_per_minute=120)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok", "env": settings.environment}


app.include_router(auth_router)
app.include_router(notebooks_router)
app.include_router(sources_router)
app.include_router(chat_router)
app.include_router(studio_router)
