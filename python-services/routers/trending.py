from fastapi import APIRouter, HTTPException, BackgroundTasks
from services.trending_service import get_trending_from_db, compute_on_demand

router = APIRouter()


@router.get("/trending/{district}")
def get_trending(district: str, background_tasks: BackgroundTasks):
    """
    Returns trending keywords for a district.
    - First tries the DB cache (written by the hourly scheduler).
    - If no cache found, computes on-demand and returns the result.
    """
    cached = get_trending_from_db(district)
    if cached:
        return cached

    # Compute on-demand (may take a few seconds first time)
    keywords = compute_on_demand(district)
    if not keywords:
        raise HTTPException(
            status_code=404,
            detail=f"No posts found for district '{district}' in the last 24 hours",
        )

    return {
        "district": district,
        "keywords": keywords,
        "computed_at": None,  # freshly computed, not yet persisted
    }
