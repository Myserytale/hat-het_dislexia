import React from 'react';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '2px solid var(--border-color)'
    }}>
      <div 
        onClick={() => setActiveTab('home')} 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <span style={{ fontSize: '2rem' }}>📖</span>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Hát-Hét Dislexia
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
            Evaluarea Națională • Limba și Literatura Română
          </p>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '8px' }}>
        <button
          className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('home')}
        >
          🏠 Acasă
        </button>
        <button
          className={`btn ${activeTab === 'learning' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('learning')}
        >
          📘 Modul de Învățare
        </button>
        <button
          className={`btn ${activeTab === 'exam' || activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('exam')}
        >
          🎓 Modul de Examen
        </button>
      </nav>
    </header>
  );
}
