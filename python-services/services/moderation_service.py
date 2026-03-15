import os
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch

MODERATION_THRESHOLD = float(os.getenv("MODERATION_THRESHOLD", "0.5"))

# ── Model is loaded once at process startup (see main.py lifespan) ──
_classifier = None
_all_labels = [
    "toxic", "severe_toxic", "obscene", "threat", "insult", "identity_hate"
]


def load_model():
    global _classifier
    print("[moderation] Loading toxic-bert model…")
    tokenizer = AutoTokenizer.from_pretrained("unitary/toxic-bert")
    model = AutoModelForSequenceClassification.from_pretrained("unitary/toxic-bert")
    model.eval()
    _classifier = pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer,
        top_k=None,       # return scores for all labels
        device=-1,        # CPU; change to 0 for GPU
        truncation=True,
        max_length=512,
    )
    print("[moderation] toxic-bert ready.")


def classify_text(text: str) -> dict:
    """
    Returns:
        {
            "is_toxic": bool,
            "toxicity_score": float,   # score of the 'toxic' label
            "labels": { label: score, … }
        }
    """
    if _classifier is None:
        raise RuntimeError("Moderation model not loaded")

    results = _classifier(text)[0]  # list of {"label": …, "score": …}
    label_scores = {r["label"]: round(r["score"], 4) for r in results}

    toxic_score = label_scores.get("toxic", 0.0)
    is_toxic = toxic_score >= MODERATION_THRESHOLD

    return {
        "is_toxic": is_toxic,
        "toxicity_score": toxic_score,
        "labels": label_scores,
    }
