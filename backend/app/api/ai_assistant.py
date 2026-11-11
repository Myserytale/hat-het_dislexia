from fastapi import APIRouter
from app.schemas.schemas import AIAssistantRequest, AIAssistantResponse
from app.services.ai_tutor import AITutorService

router = APIRouter(prefix="/ai", tags=["Asistent AI Ghidat"])

@router.post("/chat", response_model=AIAssistantResponse)
def chat_with_tutor(request: AIAssistantRequest):
    """
    Răspunde întrebărilor elevului în mod socratic:
    - Explică simplu conceptele
    - Ajută la structurarea ideilor pentru compunere
    - Nu oferă niciodată direct răspunsul la test
    """
    return AITutorService.answer_query(request)
