from fastapi import APIRouter
from app.api.lessons import router as lessons_router
from app.api.exams import router as exams_router
from app.api.preferences import router as preferences_router
from app.api.ai_assistant import router as ai_router

api_router = APIRouter()
api_router.include_router(lessons_router)
api_router.include_router(exams_router)
api_router.include_router(preferences_router)
api_router.include_router(ai_router)
