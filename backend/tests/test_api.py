import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.seed_data import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    seed_database()

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_get_lessons():
    response = client.get("/api/lessons")
    assert response.status_code == 200
    lessons = response.json()
    assert len(lessons) >= 4
    categories = [l["category"] for l in lessons]
    assert "Morfologie" in categories
    assert "Fonetică" in categories

def test_get_lesson_detail():
    response = client.get("/api/lessons/substantivul-si-cazurile")
    assert response.status_code == 200
    lesson = response.json()
    assert lesson["id"] == "substantivul-si-cazurile"
    assert len(lesson["chunks"]) >= 3
    assert lesson["visual_scheme"] is not None

def test_get_exam():
    response = client.get("/api/exams/simulare-en-romana-model-1")
    assert response.status_code == 200
    exam = response.json()
    assert exam["id"] == "simulare-en-romana-model-1"
    assert len(exam["questions"]) >= 5
    # Ensure correct answers are hidden during exam mode
    for q in exam["questions"]:
        assert q["correct_answer"] is None

def test_submit_exam():
    payload = {
        "exam_id": "simulare-en-romana-model-1",
        "student_name": "Elev Test",
        "answers": {
            "q1": "B. Cățelușul Patrocle",
            "q2": "B. Spre seară (apusul soarelui)",
            "q3": "B. Epitet",
            "q4": "A. Diftong",
            "q5": "C. Nominativ (cine pășea?)",
            "q6": "A. soare, noapte",  # Intentionally wrong to test mistake feedback
            "q7": "C. Neutru",
            "q8": "Într-o zi minunată de primăvară am pornit cu câinele meu Max spre marginea codrului. " * 15 # 150+ words
        }
    }
    response = client.post("/api/exams/submit", json=payload)
    assert response.status_code == 200
    result = response.json()
    assert result["total_score"] > 50.0
    assert result["mistakes_count"] >= 1
    # Check that mistake points back to phonetics lesson
    mistake_topics = [m["topic"] for m in result["mistakes"]]
    assert "Fonetica - Hiatul" in mistake_topics
    rec_ids = [r["lesson_id"] for r in result["recommendations"]]
    assert "fonetica-diftong-triftong-hiat" in rec_ids

def test_ai_tutor_socratic():
    # Test anti-cheating / Socratic response
    res1 = client.post("/api/ai/chat", json={"message": "Dă-mi răspunsul direct la exercițiul 3"})
    assert res1.status_code == 200
    data1 = res1.json()
    assert "nu să îți dau răspunsul direct" in data1["reply"]

    # Test grammar help
    res2 = client.post("/api/ai/chat", json={"message": "Cum recunosc cazul genitiv?"})
    assert res2.status_code == 200
    data2 = res2.json()
    assert "Genitiv" in data2["reply"]

def test_preferences():
    # Update preference
    new_pref = {
        "font_family": "Lexend",
        "font_size": 22,
        "letter_spacing": 0.1,
        "line_height": 2.0,
        "color_theme": "pastel-mint",
        "reading_ruler_enabled": True,
        "tts_speed": 0.85,
        "syllable_highlight": True,
        "extra_time_minutes": 60
    }
    put_res = client.put("/api/preferences", json=new_pref)
    assert put_res.status_code == 200
    assert put_res.json()["font_family"] == "Lexend"

    # Get preference
    get_res = client.get("/api/preferences")
    assert get_res.status_code == 200
    assert get_res.json()["font_family"] == "Lexend"
