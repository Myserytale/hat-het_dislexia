import React, { useState, useEffect } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import SchemaViewer from '../components/SchemaViewer';
import AiTutorDrawer from '../components/AiTutorDrawer';

export default function LearningMode({ preselectedLessonId, onSelectLesson }) {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all lessons
  useEffect(() => {
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        setLessons(data);
        if (preselectedLessonId) {
          loadLesson(preselectedLessonId);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [preselectedLessonId]);

  const loadLesson = (id) => {
    setLoading(true);
    fetch(`/api/lessons/${id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedLesson(data);
        setCurrentChunkIndex(0);
        setSelectedQuizAnswer(null);
        setQuizSubmitted(false);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleNextChunk = () => {
    if (selectedLesson && currentChunkIndex < selectedLesson.chunks.length - 1) {
      setCurrentChunkIndex(prev => prev + 1);
      setSelectedQuizAnswer(null);
      setQuizSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChunk = () => {
    if (currentChunkIndex > 0) {
      setCurrentChunkIndex(prev => prev - 1);
      setSelectedQuizAnswer(null);
      setQuizSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="card" style={{ textAlign: 'center', padding: '40px' }}>Se încarcă lecțiile... ⏳</div>;
  }

  // 1. LESSON DETAIL VIEW
  if (selectedLesson) {
    const chunk = selectedLesson.chunks[currentChunkIndex];
    const totalChunks = selectedLesson.chunks.length;
    const progressPercent = ((currentChunkIndex + 1) / totalChunks) * 100;

    return (
      <div>
        {/* Navigation bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button className="btn btn-secondary" onClick={() => setSelectedLesson(null)}>
            ⬅️ Înapoi la toate lecțiile
          </button>
          <span className="badge">{selectedLesson.category}</span>
        </div>

        {/* Lesson Title & Progress */}
        <div className="card">
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
            {selectedLesson.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '14px' }}>
            {selectedLesson.summary}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '90px' }}>
              Pasul {currentChunkIndex + 1} din {totalChunks}
            </span>
            <div className="progress-bar-bg" style={{ flex: 1 }}>
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Current Chunk Content Card */}
        {chunk && (
          <div className="card chunk-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {chunk.title}
              </h3>
              <AudioPlayer text={chunk.audio_text || chunk.content} label="Ascultă explicația" />
            </div>

            {/* Visual clue if present */}
            {chunk.visual_clue && (
              <div style={{
                background: 'var(--primary-accent-light)',
                padding: '10px 16px',
                borderRadius: '12px',
                marginBottom: '16px',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-block'
              }}>
                {chunk.visual_clue}
              </div>
            )}

            {/* Chunk text with whitespace preserved and formatted */}
            <div style={{ whiteSpace: 'pre-line', fontSize: '1.05rem', lineHeight: 1.9, marginBottom: '20px' }}>
              {chunk.content}
            </div>

            {/* Keywords */}
            {chunk.highlight_keywords && chunk.highlight_keywords.length > 0 && (
              <div style={{ margin: '14px 0', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Cuvinte-cheie:</span>
                {chunk.highlight_keywords.map((kw, i) => (
                  <span key={i} className="keyword-tag">{kw}</span>
                ))}
              </div>
            )}

            {/* Quick Mini Quiz for chunk */}
            {chunk.quick_quiz && (
              <div style={{ marginTop: '24px', padding: '18px', backgroundColor: 'var(--bg-primary)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎯</span> Verificare rapidă: {chunk.quick_quiz.question}
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {chunk.quick_quiz.options.map((opt, optIdx) => {
                    let className = 'option-label';
                    if (selectedQuizAnswer === optIdx) {
                      className += ' selected';
                    }
                    if (quizSubmitted) {
                      if (optIdx === chunk.quick_quiz.correct_index) {
                        className += ' correct';
                      }
                    }
                    return (
                      <label key={optIdx} className={className} style={{
                        borderColor: quizSubmitted && optIdx === chunk.quick_quiz.correct_index ? '#10B981' : undefined,
                        backgroundColor: quizSubmitted && optIdx === chunk.quick_quiz.correct_index ? '#DCFCE7' : undefined
                      }}>
                        <input
                          type="radio"
                          name={`quiz-${chunk.chunk_index}`}
                          checked={selectedQuizAnswer === optIdx}
                          onChange={() => {
                            if (!quizSubmitted) setSelectedQuizAnswer(optIdx);
                          }}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>

                {!quizSubmitted ? (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '10px' }}
                    disabled={selectedQuizAnswer === null}
                    onClick={() => setQuizSubmitted(true)}
                  >
                    Verifică răspunsul
                  </button>
                ) : (
                  <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', backgroundColor: selectedQuizAnswer === chunk.quick_quiz.correct_index ? '#DCFCE7' : '#FEF3C7' }}>
                    <strong>
                      {selectedQuizAnswer === chunk.quick_quiz.correct_index ? '✨ Corect! Excelent!' : '💡 Indiciu:'}
                    </strong>{' '}
                    {chunk.quick_quiz.explanation}
                  </div>
                )}
              </div>
            )}

            {/* Stepper buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <button
                className="btn btn-secondary"
                disabled={currentChunkIndex === 0}
                onClick={handlePrevChunk}
              >
                ⬅️ Pasul anterior
              </button>

              {currentChunkIndex < totalChunks - 1 ? (
                <button className="btn btn-primary" onClick={handleNextChunk}>
                  Pasul următor ➔
                </button>
              ) : (
                <button className="btn btn-primary" style={{ backgroundColor: '#10B981' }} onClick={() => setSelectedLesson(null)}>
                  ✓ Ai finalizat lecția!
                </button>
              )}
            </div>
          </div>
        )}

        {/* Visual Mindmap Scheme */}
        {selectedLesson.visual_scheme && (
          <SchemaViewer scheme={selectedLesson.visual_scheme} />
        )}

        {/* AI Tutor Assistant Drawer */}
        <AiTutorDrawer currentTopic={selectedLesson.title} contextType="lesson" />
      </div>
    );
  }

  // 2. LESSONS CATALOG VIEW
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
          📘 Lecții pentru Evaluarea Națională
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Alege un capitol pentru a-l parcurge în pași mici, cu explicații audio și scheme vizuale.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
        {lessons.map((lesson) => (
          <div 
            key={lesson.id} 
            className="card" 
            style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.15s ease' }}
            onClick={() => loadLesson(lesson.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="badge">{lesson.category}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lesson.difficulty}</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>
              {lesson.title}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', flex: 1, marginBottom: '16px' }}>
              {lesson.summary}
            </p>

            <button className="btn btn-soft" style={{ width: '100%' }}>
              Deschide lecția ➔
            </button>
          </div>
        ))}
      </div>

      {/* AI Tutor Assistant Drawer */}
      <AiTutorDrawer contextType="lesson" />
    </div>
  );
}
