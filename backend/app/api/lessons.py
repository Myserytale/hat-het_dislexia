from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.entities import LessonModel
from app.schemas.schemas import LessonBase, LessonDetail

router = APIRouter(prefix="/lessons", tags=["Lecții"])

@router.get("", response_model=List[LessonBase])
def get_all_lessons(category: str = None, db: Session = Depends(get_db)):
    """Returnează lista tuturor lecțiilor organizate pe categorii."""
    query = db.query(LessonModel).order_by(LessonModel.order.asc())
    if category:
        query = query.filter(LessonModel.category == category)
    lessons = query.all()
    return lessons

@router.get("/{lesson_id}", response_model=LessonDetail)
def get_lesson_by_id(lesson_id: str, db: Session = Depends(get_db)):
    """Returnează o lecție completă cu fragmente (chunks) și schemă vizuală."""
    lesson = db.query(LessonModel).filter(LessonModel.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lecția nu a fost găsită")
    return lesson
