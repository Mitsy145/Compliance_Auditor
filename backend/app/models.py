from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class AuditRecord(Base):
    __tablename__ = "audit_records"

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String, nullable=False)
    standard = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    gaps = Column(Text, nullable=False)
    action_plan = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InterviewRecord(Base):
    __tablename__ = "interview_records"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(Integer, nullable=False)
    questions = Column(Text, nullable=False)
    answers = Column(Text, nullable=True)
    scores = Column(Text, nullable=True)
    total_score = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())