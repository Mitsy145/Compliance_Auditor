from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditRecord
from app.services.gemini_service import analyze_image
import aiofiles
import os
import uuid

router = APIRouter(prefix="/audit", tags=["audit"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")


@router.post("/analyze")
async def analyze_room(
    file: UploadFile = File(...),
    standard: str = Form(...),
    db: Session = Depends(get_db)
):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    # Save uploaded image
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        await f.write(content)

    # Analyze with Gemini
    try:
        result = analyze_image(file_path, standard)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    # Save to DB
    import json
    record = AuditRecord(
        image_path=file_path,
        standard=standard,
        score=result["score"],
        gaps=json.dumps(result["gaps"]),
        action_plan=json.dumps(result["action_plan"])
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "standard": record.standard,
        "score": record.score,
        "gaps": result["gaps"],
        "action_plan": result["action_plan"],
        "created_at": record.created_at
    }