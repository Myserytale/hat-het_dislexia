import React from 'react';

export default function Home({ onSelectMode }) {
  return (
    <div>
      <div style={{ textAlign: 'center', margin: '20px 0 32px 0' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
          Învață în ritmul tău pentru Evaluarea Națională! 🌟
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          O aplicație prietenoasă, adaptată special pentru elevii cu dislexie: fără aglomerație pe ecran,
          culori pastelate odihnitoare, texte citite cu voce tare și explicații pas cu pas.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Modul de Învățare */}
        <div className="card" style={{ borderTop: '6px solid #3B82F6', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '2.4rem' }}>📘</span>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>1. Modul de Învățare</h3>
              <span className="badge">Lecții • Scheme • Audio</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px', flex: 1 }}>
            Parcurge materia de Limba Română împărțită pe bucăți mici, ușor de urmărit.
            Ascultă textele cu voce tare, memorează regulile cu ajutorul schemelor vizuale și întreabă-l pe Lumi, asistentul AI, oricând te blochezi.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px', fontSize: '0.9rem' }}>
            <li style={{ marginBottom: '6px' }}>✓ <strong>Texte pe bucăți mici</strong> (fără oboseală vizuală)</li>
            <li style={{ marginBottom: '6px' }}>✓ <strong>Materiale audio</strong> pentru fiecare noțiune</li>
            <li style={{ marginBottom: '6px' }}>✓ <strong>Scheme mentale pastelate</strong></li>
            <li style={{ marginBottom: '6px' }}>✓ <strong>Asistent AI ghidat</strong> (fără rezolvări pe tavă)</li>
          </ul>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
            onClick={() => onSelectMode('learning')}
          >
            Deschide Modul de Învățare ➔
          </button>
        </div>

        {/* Modul de Examen */}
        <div className="card" style={{ borderTop: '6px solid #10B981', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '2.4rem' }}>🎓</span>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>2. Modul de Examen</h3>
              <span className="badge" style={{ backgroundColor: '#DCFCE7' }}>Simulare EN • Bareme Reale</span>
            </div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px', flex: 1 }}>
            Rezolvă subiecte în condiții fidele examenului național. Ai la dispoziție exclusiv adaptările CES oficiale aprobate, fără indicii sau explicații ajutătoare în timpul testului.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px', fontSize: '0.9rem' }}>
            <li style={{ marginBottom: '6px' }}>✓ <strong>Timp de lucru adaptat</strong> (+60 min suplimentar)</li>
            <li style={{ marginBottom: '6px' }}>✓ <strong>Citire audio a cerințelor</strong> (asistență aprobată)</li>
            <li style={{ marginBottom: '6px' }}>✓ <strong>Condiții reale</strong> (fără indicii suplimentare)</li>
            <li style={{ marginBottom: '6px' }}>✓ <strong>Raport detaliat de erori</strong> și lecții de reluat</li>
          </ul>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem', backgroundColor: '#10B981' }}
            onClick={() => onSelectMode('exam')}
          >
            Intră în Modul de Examen ➔
          </button>
        </div>
      </div>

      {/* Accommodations Highlight */}
      <div className="card" style={{ marginTop: '24px', backgroundColor: 'var(--primary-accent-light)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
          ✨ Adaptat 100% pentru nevoile tale:
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>
          Poți schimba oricând fontul (Lexend, Atkinson, OpenDyslexic), dimensiunea literelor, culorile fundalului sau rigla de citire din bara de sus.
        </p>
      </div>
    </div>
  );
}
