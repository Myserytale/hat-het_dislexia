from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.entities import ExamModel, ExamResultModel
from app.schemas.schemas import ExamSummary, ExamDetail, ExamSubmissionRequest, ExamResultResponse
from app.services.exam_service import ExamService

router = APIRouter(prefix="/exams", tags=["Examene & Simulări"])

@router.get("", response_model=List[ExamSummary])
def list_exams(db: Session = Depends(get_db)):
    """Returnează lista simulărilor de Evaluare Națională disponibile."""
    exams = db.query(ExamModel).all()
    return exams

@router.get("/{exam_id}", response_model=ExamDetail)
def get_exam(exam_id: str, db: Session = Depends(get_db)):
    """Returnează subiectele simulării pregătite pentru elev."""
    exam = db.query(ExamModel).filter(ExamModel.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Simularea cerută nu a fost găsită")
    
    # Hide correct answers from student payload during active exam mode
    safe_questions = []
    for q in exam.questions:
        q_copy = dict(q)
        q_copy["correct_answer"] = None
        safe_questions.append(q_copy)
        
    return ExamDetail(
        id=exam.id,
        title=exam.title,
        year=exam.year,
        description=exam.description,
        standard_duration_minutes=exam.standard_duration_minutes,
        accommodated_duration_minutes=exam.accommodated_duration_minutes,
        reading_text=exam.reading_text,
        questions=safe_questions
    )

@router.post("/submit", response_model=ExamResultResponse)
def submit_exam(submission: ExamSubmissionRequest, db: Session = Depends(get_db)):
    """Evaluează simularea și generează raportul de greșeli și lecții recomandate."""
    try:
        result = ExamService.evaluate_submission(db, submission)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/results/{result_id}", response_model=ExamResultResponse)
def get_exam_result(result_id: str, db: Session = Depends(get_db)):
    """Preia rezultatele unei simulări anterioare."""
    record = db.query(ExamResultModel).filter(ExamResultModel.id == result_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Rezultatul nu a fost găsit")
    
    return ExamResultResponse(
        result_id=record.id,
        exam_id=record.exam_id,
        student_name=record.student_name,
        total_score=record.total_score,
        max_score=record.max_score,
        passed=record.total_score >= 50.0,
        mistakes_count=len(record.mistakes),
        mistakes=record.mistakes,
        recommendations=record.recommendations,
        feedback_message="Raport salvat din simularea anterioară."
    )
