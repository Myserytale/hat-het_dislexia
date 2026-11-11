from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import UserPreferenceModel
from app.schemas.schemas import UserPreferences

router = APIRouter(prefix="/preferences", tags=["Preferințe Accesibilitate"])

@router.get("", response_model=UserPreferences)
def get_preferences(db: Session = Depends(get_db)):
    """Preia setările de accesibilitate ale elevului (font, culori pastelate, riglă, viteză audio)."""
    pref = db.query(UserPreferenceModel).filter(UserPreferenceModel.id == "default").first()
    if not pref:
        pref = UserPreferenceModel(id="default")
        db.add(pref)
        db.commit()
        db.refresh(pref)
    return UserPreferences(
        font_family=pref.font_family,
        font_size=pref.font_size,
        letter_spacing=pref.letter_spacing,
        line_height=pref.line_height,
        color_theme=pref.color_theme,
        reading_ruler_enabled=pref.reading_ruler_enabled,
        tts_speed=pref.tts_speed,
        syllable_highlight=pref.syllable_highlight,
        extra_time_minutes=pref.extra_time_minutes
    )

@router.put("", response_model=UserPreferences)
def update_preferences(data: UserPreferences, db: Session = Depends(get_db)):
    """Salvează noile preferințe de vizualizare și adaptare."""
    pref = db.query(UserPreferenceModel).filter(UserPreferenceModel.id == "default").first()
    if not pref:
        pref = UserPreferenceModel(id="default")
        db.add(pref)
    
    pref.font_family = data.font_family
    pref.font_size = data.font_size
    pref.letter_spacing = data.letter_spacing
    pref.line_height = data.line_height
    pref.color_theme = data.color_theme
    pref.reading_ruler_enabled = data.reading_ruler_enabled
    pref.tts_speed = data.tts_speed
    pref.syllable_highlight = data.syllable_highlight
    pref.extra_time_minutes = data.extra_time_minutes
    
    db.commit()
    db.refresh(pref)
    return data
