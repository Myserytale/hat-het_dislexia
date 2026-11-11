from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Lesson Schemas
class QuickQuiz(BaseModel):
    question: str
    options: List[str]
    correct_index: int
    hint: str
    explanation: str

class LessonChunk(BaseModel):
    chunk_index: int
    title: str
    content: str
    audio_text: str
    highlight_keywords: List[str] = []
    visual_clue: Optional[str] = None
    quick_quiz: Optional[QuickQuiz] = None

class VisualSchemeNode(BaseModel):
    id: str
    label: str
    color: str
    description: Optional[str] = None

class VisualSchemeEdge(BaseModel):
    from_node: str
    to_node: str
    relation: str

class VisualScheme(BaseModel):
    title: str
    nodes: List[VisualSchemeNode] = []
    edges: List[VisualSchemeEdge] = []

class LessonBase(BaseModel):
    id: str
    title: str
    category: str
    difficulty: str = "Standard"
    order: int = 1
    summary: str
    audio_summary: Optional[str] = None
    tags: List[str] = []

class LessonDetail(LessonBase):
    chunks: List[LessonChunk]
    visual_scheme: Optional[VisualScheme] = None

# Exam Schemas
class ReadingText(BaseModel):
    title: str
    author: Optional[str] = None
    source: Optional[str] = None
    paragraphs: List[str]
    audio_text: str

class ExamQuestion(BaseModel):
    id: str
    section: str  # "Subiectul I - A", "Subiectul I - B", "Subiectul II"
    order: int
    points: float
    prompt: str
    type: str  # "multiple_choice", "short_answer", "essay"
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None  # kept secret from client in exam mode
    rubric_explanation: str
    related_lesson_id: str
    topic: str
    audio_prompt: Optional[str] = None

class ExamSummary(BaseModel):
    id: str
    title: str
    year: int
    description: Optional[str] = None
    standard_duration_minutes: int = 120
    accommodated_duration_minutes: int = 180

class ExamDetail(ExamSummary):
    reading_text: ReadingText
    questions: List[ExamQuestion]

# Exam Submission & Results
class ExamSubmissionRequest(BaseModel):
    exam_id: str
    student_name: str = "Elev"
    answers: Dict[str, str]  # question_id -> user answer string

class MistakeItem(BaseModel):
    question_id: str
    section: str
    prompt: str
    user_answer: str
    correct_answer: str
    points_lost: float
    rubric_explanation: str
    related_lesson_id: str
    topic: str
    encouraging_tip: str

class RecommendedLesson(BaseModel):
    lesson_id: str
    title: str
    category: str
    reason: str

class ExamResultResponse(BaseModel):
    result_id: str
    exam_id: str
    student_name: str
    total_score: float
    max_score: float = 100.0
    passed: bool
    mistakes_count: int
    mistakes: List[MistakeItem]
    recommendations: List[RecommendedLesson]
    feedback_message: str

# Accessibility Preferences
class UserPreferences(BaseModel):
    font_family: str = "OpenDyslexic"
    font_size: int = 19
    letter_spacing: float = 0.08
    line_height: float = 1.85
    color_theme: str = "pastel-cream"
    reading_ruler_enabled: bool = True
    tts_speed: float = 0.9
    syllable_highlight: bool = False
    extra_time_minutes: int = 60

# AI Assistant
class AIAssistantRequest(BaseModel):
    message: str
    context_type: str = "lesson"  # "lesson", "essay_planning", "grammar_help"
    context_id: Optional[str] = None
    current_topic: Optional[str] = None

class AIAssistantResponse(BaseModel):
    reply: str
    guiding_questions: List[str] = []
    encouragement: str
