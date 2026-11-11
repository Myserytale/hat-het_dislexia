import uuid
from datetime import datetime, timezone
from typing import List, Dict, Tuple
from sqlalchemy.orm import Session
from app.models.entities import ExamModel, ExamResultModel, LessonModel
from app.schemas.schemas import ExamSubmissionRequest, ExamResultResponse, MistakeItem, RecommendedLesson

class ExamService:
    @staticmethod
    def evaluate_submission(db: Session, submission: ExamSubmissionRequest) -> ExamResultResponse:
        exam = db.query(ExamModel).filter(ExamModel.id == submission.exam_id).first()
        if not exam:
            raise ValueError(f"Examenul cu ID-ul {submission.exam_id} nu a fost găsit.")

        questions = exam.questions
        user_answers = submission.answers
        
        # Romanian EN exam always has 10 points ex-officio
        total_score = 10.0
        mistakes: List[MistakeItem] = []
        missed_lesson_ids = set()
        
        for q in questions:
            qid = q.get("id")
            q_type = q.get("type")
            q_points = float(q.get("points", 6.0))
            correct_ans = q.get("correct_answer", "")
            user_ans = user_answers.get(qid, "").strip()
            
            if q_type == "multiple_choice":
                # Compare answers
                is_correct = False
                if user_ans and (user_ans == correct_ans or user_ans[0] == correct_ans[0]):
                    is_correct = True
                    total_score += q_points
                else:
                    points_lost = q_points
                    rel_lesson = q.get("related_lesson_id", "")
                    if rel_lesson:
                        missed_lesson_ids.add(rel_lesson)
                        
                    tip = f"Nu te descuraja! Reține secretul: {q.get('rubric_explanation')}"
                    mistakes.append(MistakeItem(
                        question_id=qid,
                        section=q.get("section", "Subiectul I"),
                        prompt=q.get("prompt", ""),
                        user_answer=user_ans if user_ans else "(Necompletat)",
                        correct_answer=correct_ans,
                        points_lost=points_lost,
                        rubric_explanation=q.get("rubric_explanation", ""),
                        related_lesson_id=rel_lesson,
                        topic=q.get("topic", "Gramatică"),
                        encouraging_tip=tip
                    ))
            
            elif q_type == "essay":
                # Subiectul II: Essay evaluation
                word_count = len(user_ans.split()) if user_ans else 0
                
                if word_count >= 150:
                    # Full marks for content & length adherence in mock
                    awarded = q_points
                    total_score += awarded
                elif word_count >= 80:
                    awarded = q_points * 0.7  # Partial credit
                    total_score += awarded
                    rel_lesson = q.get("related_lesson_id", "")
                    if rel_lesson:
                        missed_lesson_ids.add(rel_lesson)
                    mistakes.append(MistakeItem(
                        question_id=qid,
                        section=q.get("section", "Subiectul II"),
                        prompt=q.get("prompt", ""),
                        user_answer=f"Text de {word_count} cuvinte (sub limita de 150)",
                        correct_answer="Minimum 150 cuvinte cu structură clară",
                        points_lost=q_points - awarded,
                        rubric_explanation="Compunerea ta are idei bune, dar a avut sub 150 de cuvinte. La examen, limita minimă aduce punctajul maxim de redactare!",
                        related_lesson_id=rel_lesson,
                        topic=q.get("topic", "Redactare narativă"),
                        encouraging_tip="Data viitoare adaugă o scurtă descriere a vremii sau a emoțiilor tale pentru a trece ușor de 150 de cuvinte!"
                    ))
                else:
                    awarded = 4.0 if word_count > 10 else 0.0
                    total_score += awarded
                    rel_lesson = q.get("related_lesson_id", "")
                    if rel_lesson:
                        missed_lesson_ids.add(rel_lesson)
                    mistakes.append(MistakeItem(
                        question_id=qid,
                        section=q.get("section", "Subiectul II"),
                        prompt=q.get("prompt", ""),
                        user_answer=user_ans[:50] + "..." if user_ans else "(Necompletat)",
                        correct_answer="Minimum 150 de cuvinte cu Introducere, Cuprins și Încheiere",
                        points_lost=q_points - awarded,
                        rubric_explanation="Compunerea are nevoie de mai multă dezvoltare și respectarea celor trei părți: introducere, cuprins, încheiere.",
                        related_lesson_id=rel_lesson,
                        topic=q.get("topic", "Redactare narativă"),
                        encouraging_tip="Folosește schema vizuală din lecția de compunere: Cine? Unde? Când? -> Aventura -> Cum s-a încheiat."
                    ))

        # Clamp score between 10 and 100
        total_score = min(100.0, max(10.0, round(total_score, 1)))
        
        # Build recommended lessons
        recommendations: List[RecommendedLesson] = []
        for l_id in missed_lesson_ids:
            lesson_obj = db.query(LessonModel).filter(LessonModel.id == l_id).first()
            if lesson_obj:
                recommendations.append(RecommendedLesson(
                    lesson_id=lesson_obj.id,
                    title=lesson_obj.title,
                    category=lesson_obj.category,
                    reason=f"Exersează conceptele din această lecție pentru a-ți asigura punctajul complet la subiectele similare."
                ))
                
        # If no mistakes, recommend revision of literature or fun lessons
        if not recommendations:
            any_lesson = db.query(LessonModel).first()
            if any_lesson:
                recommendations.append(RecommendedLesson(
                    lesson_id=any_lesson.id,
                    title=any_lesson.title,
                    category=any_lesson.category,
                    reason="Felicitări pentru un scor excelent! Poți continua să aprofundezi lecțiile pentru relaxare."
                ))

        # Generate friendly feedback message
        if total_score >= 85:
            feedback = "Excelent! Ai demonstrat o stăpânire deosebită a cerințelor de examen. Ai un ritm grozav de învățare!"
        elif total_score >= 70:
            feedback = "Foarte bine! Te afli pe drumul cel bun. Cu puțin exercițiu la capitolele recomandate mai jos, vei lua o notă de top!"
        elif total_score >= 50:
            feedback = "Bun efort! Este un punct de plecare curajos. Fiecare greșeală este o oportunitate de a învăța mai bine pas cu pas."
        else:
            feedback = "Important este că ai terminat simularea! Nu uita: ai la dispoziție lecțiile pe bucăți mici și schemele vizuale pentru a recupera."

        # Save result
        result_id = str(uuid.uuid4())[:8]
        result_record = ExamResultModel(
            id=result_id,
            exam_id=submission.exam_id,
            student_name=submission.student_name,
            total_score=total_score,
            max_score=100.0,
            user_answers=submission.answers,
            mistakes=[m.model_dump() for m in mistakes],
            recommendations=[r.model_dump() for r in recommendations],
            created_at=datetime.now(timezone.utc).isoformat()
        )
        db.add(result_record)
        db.commit()

        return ExamResultResponse(
            result_id=result_id,
            exam_id=submission.exam_id,
            student_name=submission.student_name,
            total_score=total_score,
            max_score=100.0,
            passed=total_score >= 50.0,
            mistakes_count=len(mistakes),
            mistakes=mistakes,
            recommendations=recommendations,
            feedback_message=feedback
        )
