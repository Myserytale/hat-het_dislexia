import React, { useState, useEffect } from 'react';
import AudioPlayer from '../components/AudioPlayer';

export default function ExamMode({ onExamSubmitted }) {
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [studentName, setStudentName] = useState('Elev');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(180 * 60); // 180 mins with accommodation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exams/simulare-en-romana-model-1')
      .then(res => res.json())
      .then(data => {
        setExam(data);
        setTimeLeftSeconds(data.accommodated_duration_minutes * 60);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeftSeconds]);

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleEssayChange = (questionId, text) => {
    setAnswers(prev => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = async () => {
    if (!window.confirm("Ești sigur că dorești să predai lucrarea? Simularea se va încheia și vei primi raportul detaliat.")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_id: exam.id,
          student_name: studentName,
          answers: answers
        })
      });

      if (!response.ok) throw new Error("Eroare la trimiterea simulării");
      const resultData = await response.json();
      onExamSubmitted(resultData);
    } catch (err) {
      alert("A apărut o eroare la salvarea simulării. Te rugăm să reîncerci.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="card" style={{ textAlign: 'center', padding: '40px' }}>Se pregătește simularea de examen... ⏳</div>;
  }

  if (!exam) {
    return <div className="card">Nu a fost găsită nicio simulare de examen activă.</div>;
  }

  const essayAnswer = answers['q8'] || '';
  const wordCount = essayAnswer.trim() ? essayAnswer.trim().split(/\s+/).length : 0;

  return (
    <div>
      {/* Exam Accommodations Banner */}
      <div className="card" style={{ borderLeft: '6px solid #10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '16px 20px' }}>
        <div>
          <span className="badge" style={{ backgroundColor: '#DCFCE7', color: '#166534', marginBottom: '4px' }}>
            🎓 Mod de Examen Oficial
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{exam.title}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Forme de sprijin active: Timp suplimentar (+60 min) • Suport audio pentru cerințe • Fără explicații adiționale
          </p>
        </div>

        {/* Live Timer */}
        <div style={{
          backgroundColor: timeLeftSeconds < 600 ? '#FEE2E2' : 'var(--bg-primary)',
          padding: '10px 18px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block' }}>
            TIMP RĂMAS (ADAPTAT)
          </span>
          <strong style={{ fontSize: '1.4rem', fontFamily: 'monospace', color: timeLeftSeconds < 600 ? '#DC2626' : 'var(--text-main)' }}>
            ⏱️ {formatTimer(timeLeftSeconds)}
          </strong>
        </div>
      </div>

      {/* Reading Text Support */}
      {exam.reading_text && (
        <div className="card" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{exam.reading_text.title}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {exam.reading_text.author} {exam.reading_text.source && `• ${exam.reading_text.source}`}
              </span>
            </div>
            <AudioPlayer text={exam.reading_text.audio_text} label="Ascultă fragmentul integral" />
          </div>

          <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-color)' }}>
            {exam.reading_text.paragraphs.map((p, pIdx) => (
              <p key={pIdx} style={{ fontSize: '1.02rem', lineHeight: 1.9, marginBottom: '14px', textIndent: '20px' }}>
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Questions list */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>
          Cerințe de rezolvat:
        </h3>

        {exam.questions.map((q) => (
          <div key={q.id} className="card" style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <span className="badge">{q.section} • {q.points} puncte</span>
              <AudioPlayer text={q.audio_prompt || q.prompt} label="Ascultă cerința" />
            </div>

            <p style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.7, marginBottom: '14px' }}>
              {q.prompt}
            </p>

            {/* Multiple choice options */}
            {q.type === 'multiple_choice' && q.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, oIdx) => {
                  const isSelected = answers[q.id] === opt;
                  return (
                    <label
                      key={oIdx}
                      className={`option-label ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(q.id, opt)}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={isSelected}
                        onChange={() => handleSelectOption(q.id, opt)}
                      />
                      <span style={{ fontSize: '1rem' }}>{opt}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Essay textarea */}
            {q.type === 'essay' && (
              <div>
                <textarea
                  rows={9}
                  placeholder="Scrie aici compunerea ta narativă (respectă Introducerea, Cuprinsul și Încheierea)..."
                  value={essayAnswer}
                  onChange={(e) => handleEssayChange(q.id, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '2px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: wordCount >= 150 ? '#16A34A' : '#D97706', fontWeight: 700 }}>
                    Contor cuvinte: {wordCount} / minim 150 {wordCount >= 150 ? '✓ (Ai atins limita!)' : '(Mai ai nevoie de cuvinte)'}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Structură recomandată: 3 alineate clare
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="card" style={{ textAlign: 'center', padding: '24px', marginTop: '30px', borderTop: '4px solid #10B981' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '14px', fontSize: '0.95rem' }}>
          Verifică dacă ai răspuns la toate întrebările înainte de trimitere.
        </p>
        <button
          className="btn btn-primary"
          style={{ padding: '16px 36px', fontSize: '1.15rem', backgroundColor: '#10B981' }}
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Se evaluează lucrarea... ⏳" : "✓ Predă lucrarea și vezi rezultatele"}
        </button>
      </div>
    </div>
  );
}
