from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditRecord, InterviewRecord
from app.services.gemini_service import generate_interview_questions, score_answer
from app.schemas import AnswerSubmission
import json

router = APIRouter(prefix="/interview", tags=["interview"])


@router.get("/generate/{audit_id}")
def generate_interview(audit_id: int, db: Session = Depends(get_db)):
    # Get audit record
    audit = db.query(AuditRecord).filter(AuditRecord.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=404, detail="Audit not found")

    gaps = json.loads(audit.gaps)

    # Generate questions via Gemini
    try:
        questions = generate_interview_questions(audit.standard, gaps)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")

    # Save interview record
    record = InterviewRecord(
        audit_id=audit_id,
        questions=json.dumps(questions),
        answers=json.dumps([]),
        scores=json.dumps([])
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "audit_id": audit_id,
        "questions": questions
    }


@router.post("/submit")
def submit_answers(submission: AnswerSubmission, db: Session = Depends(get_db)):
    # Get interview record
    interview = db.query(InterviewRecord).filter(
        InterviewRecord.id == submission.interview_id
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    audit = db.query(AuditRecord).filter(
        AuditRecord.id == interview.audit_id
    ).first()

    questions = json.loads(interview.questions)

    # Score each answer
    results = []
    total = 0

    for i, answer in enumerate(submission.answers):
        if i >= len(questions):
            break
        q = questions[i]["question"]
        try:
            scored = score_answer(q, answer, audit.standard)
        except Exception:
            scored = {"score": 0, "feedback": "Could not evaluate answer"}

        results.append({
            "question": q,
            "answer": answer,
            "score": scored["score"],
            "feedback": scored["feedback"]
        })
        total += scored["score"]

    total_score = round((total / (len(results) * 10)) * 100, 1) if results else 0

    # Update interview record
    interview.answers = json.dumps(submission.answers)
    interview.scores = json.dumps(results)
    interview.total_score = total_score
    db.commit()

    return {
        "total_score": total_score,
        "results": results
    }