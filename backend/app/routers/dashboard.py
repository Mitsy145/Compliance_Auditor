from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditRecord
import json

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    records = db.query(AuditRecord).order_by(AuditRecord.created_at.desc()).all()

    history = []
    for r in records:
        history.append({
            "id": r.id,
            "standard": r.standard,
            "score": r.score,
            "gaps_count": len(json.loads(r.gaps)),
            "created_at": r.created_at
        })

    return {"history": history}


@router.get("/record/{audit_id}")
def get_record(audit_id: int, db: Session = Depends(get_db)):
    record = db.query(AuditRecord).filter(AuditRecord.id == audit_id).first()
    if not record:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Record not found")

    return {
        "id": record.id,
        "standard": record.standard,
        "score": record.score,
        "gaps": json.loads(record.gaps),
        "action_plan": json.loads(record.action_plan),
        "created_at": record.created_at
    }