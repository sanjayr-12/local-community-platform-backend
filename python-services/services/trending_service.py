import json
from datetime import datetime, timedelta
from keybert import KeyBERT
from db.database import get_cursor

_kw_model = None


def load_model():
    global _kw_model
    print("[trending] Loading KeyBERT (all-MiniLM-L6-v2)…")
    _kw_model = KeyBERT(model="all-MiniLM-L6-v2")
    print("[trending] KeyBERT ready.")


def compute_trending_for_all_districts():
    """
    Scheduled job: runs every hour.
    Fetches posts from the last 24h per district, extracts top keywords,
    and upserts results into the trending_topics table.
    """
    if _kw_model is None:
        print("[trending] Model not loaded yet, skipping run.")
        return

    cutoff = datetime.utcnow() - timedelta(hours=24)

    with get_cursor() as cursor:
        # Get all distinct districts that have recent posts
        cursor.execute(
            """
            SELECT DISTINCT state_district_tag as district
            FROM posts
            WHERE created_at >= %s AND state_district_tag IS NOT NULL
            """,
            (cutoff,),
        )
        districts = [row["district"] for row in cursor.fetchall()]

    for district in districts:
        keywords = _extract_keywords_for_district(district, cutoff)
        if not keywords:
            continue

        with get_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO trending_topics (district, keywords, computed_at)
                VALUES (%s, %s, NOW())
                """,
                (district, json.dumps(keywords)),
            )

    print(f"[trending] Computed trending for {len(districts)} district(s).")


def _extract_keywords_for_district(district: str, cutoff: datetime) -> list[str]:
    """Fetch posts for a district and extract top keywords with KeyBERT."""
    with get_cursor() as cursor:
        cursor.execute(
            """
            SELECT content FROM posts
            WHERE state_district_tag = %s AND created_at >= %s
            """,
            (district, cutoff),
        )
        rows = cursor.fetchall()

    if not rows:
        return []

    # Combine all post content into one document for topic extraction
    combined_text = " ".join(row["content"] for row in rows)

    # KeyBERT extracts top N keyword phrases (1-2 word n-grams)
    keyword_pairs = _kw_model.extract_keywords(
        combined_text,
        keyphrase_ngram_range=(1, 2),
        stop_words="english",
        top_n=5,
        use_mmr=True,   # max marginal relevance for diversity
        diversity=0.5,
    )
    return [kw for kw, _score in keyword_pairs]


def get_trending_from_db(district: str) -> dict | None:
    """Read the latest cached trending entry for a district."""
    with get_cursor() as cursor:
        cursor.execute(
            """
            SELECT district, keywords, computed_at
            FROM trending_topics
            WHERE district = %s
            ORDER BY computed_at DESC
            LIMIT 1
            """,
            (district,),
        )
        row = cursor.fetchone()

    if not row:
        return None

    return {
        "district": row["district"],
        "keywords": row["keywords"],
        "computed_at": row["computed_at"].isoformat() if row["computed_at"] else None,
    }


def compute_on_demand(district: str) -> list[str]:
    """
    Compute trending keywords on-demand for a single district
    (used when no cached result exists in DB).
    """
    cutoff = datetime.utcnow() - timedelta(hours=24)
    return _extract_keywords_for_district(district, cutoff)
