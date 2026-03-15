import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from dotenv import load_dotenv
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from routers import moderation as moderation_router
from routers import trending as trending_router
from services import moderation_service, trending_service

load_dotenv()

scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Load ML models at startup (runs once).
    Start the background scheduler.
    """
    moderation_service.load_model()
    trending_service.load_model()

    # Run trending computation once on startup, then every hour
    trending_service.compute_trending_for_all_districts()
    scheduler.add_job(
        trending_service.compute_trending_for_all_districts,
        trigger="interval",
        hours=1,
        id="compute_trending",
        replace_existing=True,
    )
    scheduler.start()
    print("[main] Scheduler started — trending recomputes every hour.")

    yield

    scheduler.shutdown()
    print("[main] Scheduler stopped.")


app = FastAPI(
    title="Local Community Platform — ML Service",
    description="Content moderation and trending topics for the community platform.",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(moderation_router.router, prefix="/api", tags=["Moderation"])
app.include_router(trending_router.router, prefix="/api", tags=["Trending"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
