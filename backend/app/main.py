from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.routers import audit, interview, dashboard
import os

# Create all tables
Base.metadata.create_all(bind=engine)

# Create uploads dir
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="Compliance Auditor API",
    description="AI-powered compliance checking for any space",
    version="1.0.0"
)

# CORS — allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads as static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(audit.router)
app.include_router(interview.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"message": "Compliance Auditor API is running!"}


@app.get("/health")
def health():
    return {"status": "ok"}