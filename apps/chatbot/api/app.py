import os
import uvicorn
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from services.intent_service import IntentService
from services.rag_service import RAGService
from services.academic_rag_service import AcademicRAGService
from services.gpa_service import GPAService
from core.memory_manager import MemoryService
from services.llm_service import LLMService
from services.recommendation_service import RecommendationService
from utils.course_matcher import CourseMatcherService
from core.orchestrator import OrchestratorService
from core.access_control import AccessControl
from database.mock_data import DataService
from data.load_pdfs import build_vectordb

from config import (
    EMBEDDING_MODEL,
    LLM_MODEL_NAME,
    INTENT_LLM_MODEL_NAME,
    CHROMA_DIR,
)

# =========================
# 🚀 APP CONFIGURATION
# =========================
app = FastAPI(title="UNIQ Chatbot API")

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

# =========================
# ⚙️ SYSTEM INITIALIZATION
# =========================
data_service = DataService()
access_control = AccessControl(data_service=data_service)

llm_service = LLMService(model_name=LLM_MODEL_NAME, temperature=0)
intent_llm_service = LLMService(model_name=INTENT_LLM_MODEL_NAME, temperature=0)
gpa_service = GPAService()
memory_service = MemoryService(llm=llm_service.llm)
rag_service = RAGService(model_name=EMBEDDING_MODEL)
academic_rag_service = None

intent_service = IntentService(
    intent_llm=intent_llm_service.llm,
    llm_model=llm_service.llm,
    intents=["course_rec", "gpa_calc", "gpa_plan", "general_query"],
)

course_matcher = CourseMatcherService(
    courses_catalog=data_service.COURSES_CATALOG,
    llm=llm_service.llm,
)
data_service.register_matcher(course_matcher)

recommendation_service = RecommendationService(
    gpa_service=gpa_service,
    matcher=course_matcher,
)


def chroma_is_valid(path: str) -> bool:
    if not os.path.exists(path):
        return False
    try:
        files = os.listdir(path)
    except Exception:
        return False
    if len(files) == 0:
        return False
    return any("chroma.sqlite3" in f or "index" in f for f in files)


@app.on_event("startup")
def startup_event():
    global academic_rag_service

    if not chroma_is_valid(CHROMA_DIR):
        build_vectordb(force_rebuild=True)

    vectordb, ensemble_retriever = build_vectordb(force_rebuild=False)

    academic_rag_service = AcademicRAGService(
        llm_service=llm_service,
        vectordb=vectordb,
        ensemble_retriever=ensemble_retriever,
    )

    app.state.orchestrator = OrchestratorService(
        intent_service=intent_service,
        rag_service=rag_service,
        academic_rag_service=academic_rag_service,
        gpa_service=gpa_service,
        memory_service=memory_service,
        llm_service=llm_service,
        course_matcher=course_matcher,
        recommendation_service=recommendation_service,
        ui_service=None,
        data_service=data_service,
        access_control=access_control,
    )

    print("🚀 UNIQ Chatbot ready!")


# =========================
# 📝 REQUEST MODELS
# =========================
class ChatRequest(BaseModel):
    user_id:         str
    user_status:     str                        # "student" أو "guest"
    student_data:    Optional[Dict[str, Any]] = None
    courses_catalog: Optional[Dict[str, Any]] = None
    query:           str


class GPAPlanRequest(BaseModel):
    current_gpa:      float
    target_gpa:       float
    completed_hours:  int
    remaining_hours:  int


class Subject(BaseModel):
    credit_hours: int
    grade:        str


class GPACalcRequest(BaseModel):
    subjects: List[Subject]


# =========================
# 🛣️ ENDPOINTS
# =========================
@app.get("/")
def health_check():
    return {"status": "online", "system": "UNIQ AI Assistant"}


@app.post("/chat")
async def chat(req: ChatRequest, background_tasks: BackgroundTasks):
    try:
        if req.user_status == "student" and req.student_data:
            data_service.set_student_data(req.user_id, req.student_data)

        if req.courses_catalog:
            data_service.set_courses_catalog(req.courses_catalog)

        # ✅ الـ orchestrator بياخد user_id و query بس
        answer, intent, confidence = app.state.orchestrator.generate_uniq_response(
            user_id=req.user_id,
            query=req.query,
        )

        background_tasks.add_task(memory_service.cleanup_sessions)

        return {
            "answer":     answer,
            "intent":     intent,
            "confidence": round(confidence, 2),
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "answer":       "عذراً، واجهت مشكلة تقنية بسيطة.",
            "intent":       "error",
            "error_detail": str(e),
        }


@app.post("/calculate-gpa")
def api_calculate_gpa(req: GPACalcRequest):
    try:
        result = gpa_service.calculate_gpa([s.dict() for s in req.subjects])
        return {"gpa": result}
    except Exception as e:
        return {"error": str(e)}


@app.post("/plan-gpa")
def api_plan_gpa(req: GPAPlanRequest):
    try:
        rem_list = [3] * (req.remaining_hours // 3)
        if req.remaining_hours % 3:
            rem_list.append(req.remaining_hours % 3)
        result = gpa_service.calculate_balanced_gpa(
            current_gpa=req.current_gpa,
            completed_hours=req.completed_hours,
            remaining_hours_list=rem_list,
            target_gpa=req.target_gpa,
        )
        return result
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)