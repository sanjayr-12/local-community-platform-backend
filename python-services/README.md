# Python ML Service

FastAPI microservice providing content moderation and trending topics for the Local Community Platform.

## Features

| Endpoint | Description |
|---|---|
| `POST /api/moderate` | Toxicity scoring via `unitary/toxic-bert` |
| `GET /api/trending/{district}` | Location-based trending keywords via KeyBERT |
| `GET /health` | Health check |

## Setup

```bash
# 1. Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# 2. Install dependencies (first run downloads ~1.5GB of model weights)
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Run the service
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | *(required)* | PostgreSQL connection string (same DB as Deno service) |
| `MODERATION_THRESHOLD` | `0.5` | Toxicity score threshold (0.0–1.0). Posts above this are flagged. |
| `ML_SERVICE_PORT` | `8000` | Port for uvicorn |

## API Examples

### Content Moderation

```bash
curl -X POST http://localhost:8000/api/moderate \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this neighborhood!"}'

# Response:
# {
#   "is_toxic": false,
#   "toxicity_score": 0.02,
#   "labels": {"toxic": 0.02, "obscene": 0.01, ...}
# }
```

### Trending Topics

```bash
curl http://localhost:8000/api/trending/Coimbatore

# Response:
# {
#   "district": "Coimbatore",
#   "keywords": ["water supply", "power cut", "rain", "road repair", "event"],
#   "computed_at": "2026-03-14T17:00:00"
# }
```

## Architecture

```
python-services/
├── main.py                   # FastAPI app + APScheduler (hourly trending job)
├── requirements.txt
├── .env.example
├── db/
│   └── database.py           # psycopg2 connection helper
├── routers/
│   ├── moderation.py         # POST /api/moderate
│   └── trending.py           # GET  /api/trending/{district}
└── services/
    ├── moderation_service.py  # toxic-bert inference
    └── trending_service.py    # KeyBERT keyword extraction + DB caching
```

## Notes

- Models are loaded **once at startup** — not per-request. Cold start ~20s.
- Moderation is **fail-open**: if the ML service is unreachable, the Deno backend allows posts through.
- Trending data is **cached in the `trending_topics` DB table** and recomputed every hour.
- On-demand computation is triggered for districts with no cached entry.
