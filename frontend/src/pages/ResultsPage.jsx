import React from 'react';

export default function ResultsPage({ result, onGoToLesson, onRestartExam }) {
  if (!result) return null;

  return (
    <div>
      {/* Score Header Card */}
      <div className="card" style={{ textAlign: 'center', padding: '32px 20px', borderTop: '6px solid var(--primary-accent)' }}>
        <span style={{ fontSize: '3rem' }}>
          {result.total_score >= 80 ? '🎉' : result.total_score >= 50 ? '👏' : '🌱'}
        </span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', marginBottom: '6px' }}>
          Rezultatul Simulării Tale
        </h2>
        
        <div style={{ margin: '18px auto', display: 'inline-block', backgroundColor: 'var(--primary-accent-light)', padding: '12px 28px', borderRadius: '20px' }}>
          <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)' }}>
            {result.total_score}
          </span>
          <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}> / {result.max_score} puncte</span>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {result.feedback_message}
        </p>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge">10 puncte din oficiu incluse</span>
          <span className="badge" style={{ backgroundColor: result.passed ? '#DCFCE7' : '#FEE2E2' }}>
            {result.passed ? '✓ Punctaj de promovare atins' : 'Mai ai nevoie de puțin exercițiu'}
          </span>
        </div>
      </div>

      {/* Recommended Lessons (Ce ai de repetat) */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="card" style={{ borderLeft: '6px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.6rem' }}>🎯</span>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Ce ai de repetat (Recomandări Țintite)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Apasă pe oricare lecție de mai jos pentru a o relua pe bucăți mici, fără presiune.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '14px' }}>
            {result.recommendations.map((rec, rIdx) => (
              <div 
                key={rIdx} 
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span className="badge" style={{ marginBottom: '8px' }}>{rec.category}</span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>{rec.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {rec.reason}
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px' }}
                  onClick={() => onGoToLesson(rec.lesson_id)}
                >
                  📘 Revizuiește această lecție ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Mistakes Feedback */}
      {result.mistakes && result.mistakes.length > 0 ? (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span> Analiza cerințelor unde ai pierdut puncte:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {result.mistakes.map((m, mIdx) => (
              <div
                key={mIdx}
                style={{
                  padding: '16px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <span className="badge">{m.section} • {m.topic}</span>
                  <span style={{ fontSize: '0.85rem', color: '#DC2626', fontWeight: 700 }}>
                    -{m.points_lost} puncte
                  </span>
                </div>

                <p style={{ fontSize: '0.98rem', fontWeight: 600, marginBottom: '10px' }}>
                  {m.prompt}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '0.9rem', marginBottom: '10px' }}>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                    <strong>Răspunsul tău:</strong> {m.user_answer}
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: '#DCFCE7', color: '#166534' }}>
                    <strong>Răspuns corect / Așteptat:</strong> {m.correct_answer}
                  </div>
                </div>

                <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '8px' }}>
                  <strong>Explicație barem:</strong> {m.rubric_explanation}
                </div>

                <div style={{ fontSize: '0.85rem', color: '#15803D', fontStyle: 'italic', marginTop: '6px' }}>
                  💡 {m.encouraging_tip}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '24px', backgroundColor: '#DCFCE7' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#166534', fontWeight: 800 }}>
            🌟 Felicitări! Nu ai făcut nicio greșeală la întrebările grilă!
          </h3>
        </div>
      )}

      {/* Bottom actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
        <button className="btn btn-secondary" onClick={onRestartExam}>
          🔄 Încearcă o nouă simulare
        </button>
      </div>
    </div>
  );
}
