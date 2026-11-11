from sqlalchemy import Column, String, Integer, Float, Boolean, Text, JSON
from app.core.database import Base

class LessonModel(Base):
    __tablename__ = "lessons"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False, index=True)  # Morfologie, Fonetică, Literatură etc.
    difficulty = Column(String, default="Standard")
    order = Column(Integer, default=1)
    summary = Column(Text, nullable=False)
    audio_summary = Column(Text, nullable=True)
    
    # JSON structured chunks for dyslexia bite-sized reading
    chunks = Column(JSON, nullable=False, default=list)
    
    # JSON mindmap or scheme nodes & edges
    visual_scheme = Column(JSON, nullable=True, default=dict)
    
    # Tag list for searching & recommendations
    tags = Column(JSON, default=list)

class ExamModel(Base):
    __tablename__ = "exams"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    year = Column(Integer, default=2025)
    description = Column(Text, nullable=True)
    
    standard_duration_minutes = Column(Integer, default=120)
    accommodated_duration_minutes = Column(Integer, default=180)  # +60 min CES/Dislexie
    
    # Reading text metadata: title, author, paragraphs, full audio text
    reading_text = Column(JSON, nullable=False)
    
    # List of questions with correct answers, rubrics, points, and lesson mapping
    questions = Column(JSON, nullable=False, default=list)

class ExamResultModel(Base):
    __tablename__ = "exam_results"

    id = Column(String, primary_key=True, index=True)
    exam_id = Column(String, index=True, nullable=False)
    student_name = Column(String, default="Elev")
    
    total_score = Column(Float, default=10.0)  # out of 100 (includes 10 ex officio)
    max_score = Column(Float, default=100.0)
    
    user_answers = Column(JSON, nullable=False, default=dict)
    mistakes = Column(JSON, nullable=False, default=list)
    recommendations = Column(JSON, nullable=False, default=list)
    created_at = Column(String, nullable=False)

class UserPreferenceModel(Base):
    __tablename__ = "user_preferences"

    id = Column(String, primary_key=True, default="default")
    font_family = Column(String, default="OpenDyslexic")  # OpenDyslexic, Lexend, Atkinson, Sans
    font_size = Column(Integer, default=19)  # px
    letter_spacing = Column(Float, default=0.08)  # em
    line_height = Column(Float, default=1.85)
    color_theme = Column(String, default="pastel-cream")  # pastel-cream, pastel-mint, pastel-peach, pastel-sky
    reading_ruler_enabled = Column(Boolean, default=True)
    tts_speed = Column(Float, default=0.9)
    syllable_highlight = Column(Boolean, default=False)
    extra_time_minutes = Column(Integer, default=60)
