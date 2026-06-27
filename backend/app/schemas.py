from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AuditResponse(BaseModel):
    id: int
    standard: str
    score: float
    gaps: List[str]
    action_plan: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class InterviewQuestion(BaseModel):
    question: str
    context: str

class InterviewResponse(BaseModel):
    id: int
    audit_id: int
    questions: List[InterviewQuestion]

class AnswerSubmission(BaseModel):
    interview_id: int
    answers: List[str]

class AnswerScore(BaseModel):
    question: str
    answer: str
    score: float
    feedback: str

class InterviewResult(BaseModel):
    total_score: float
    results: List[AnswerScore]

class DashboardRecord(BaseModel):
    id: int
    standard: str
    score: float
    created_at: datetime

    class Config:
        from_attributes = True