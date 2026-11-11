import React, { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Header from './components/Header';
import AccessibilityBar from './components/AccessibilityBar';
import ReadingRuler from './components/ReadingRuler';
import Home from './pages/Home';
import LearningMode from './pages/LearningMode';
import ExamMode from './pages/ExamMode';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [targetLessonId, setTargetLessonId] = useState(null);
  const [examResult, setExamResult] = useState(null);

  const handleSelectMode = (mode) => {
    setActiveTab(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExamSubmitted = (resultData) => {
    setExamResult(resultData);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToLesson = (lessonId) => {
    setTargetLessonId(lessonId);
    setActiveTab('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartExam = () => {
    setExamResult(null);
    setActiveTab('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AccessibilityProvider>
      <ReadingRuler />
      <div className="app-container">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <AccessibilityBar />

        <main>
          {activeTab === 'home' && (
            <Home onSelectMode={handleSelectMode} />
          )}

          {activeTab === 'learning' && (
            <LearningMode 
              preselectedLessonId={targetLessonId} 
              onSelectLesson={(id) => setTargetLessonId(id)}
            />
          )}

          {activeTab === 'exam' && (
            <ExamMode onExamSubmitted={handleExamSubmitted} />
          )}

          {activeTab === 'results' && (
            <ResultsPage
              result={examResult}
              onGoToLesson={handleGoToLesson}
              onRestartExam={handleRestartExam}
            />
          )}
        </main>

        <footer style={{
          marginTop: '60px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--text-muted)'
        }}>
          <p>
            <strong>Hát-Hét Dislexia</strong> — Aplicație dedicată pregătirii pentru Evaluarea Națională (Limba Română).
          </p>
          <p style={{ marginTop: '4px', fontSize: '0.78rem' }}>
            Dezvoltat cu grijă pentru neurodiversitate & accesibilitate educațională.
          </p>
        </footer>
      </div>
    </AccessibilityProvider>
  );
}
