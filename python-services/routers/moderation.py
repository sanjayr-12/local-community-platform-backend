from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.moderation_service import classify_text

router = APIRouter()


class ModerateRequest(BaseModel):
    text: str


@router.post("/moderate")
def moderate_text(body: ModerateRequest):
    if not body.text.strip():
        raise HTTPException(status_code=422, detail="text must not be empty")
    result = classify_text(body.text)
    return result
