import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AudioPlayer({ text, label = "Ascultă textul" }) {
  const { preferences } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Stop speech when component unmounts or text changes
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Browserul tău nu suportă sinteza vocală directă.");
      return;
    }

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ro-RO';
    utterance.rate = preferences.tts_speed || 0.9;
    utterance.pitch = 1.0;

    // Pick a Romanian voice if available
    const voices = window.speechSynthesis.getVoices();
    const roVoice = voices.find(v => v.lang.startsWith('ro'));
    if (roVoice) {
      utterance.voice = roVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const pause = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
      {!isPlaying && !isPaused ? (
        <button className="btn btn-soft" onClick={speak} title="Citește cu voce tare textul">
          🔊 {label}
        </button>
      ) : isPlaying ? (
        <>
          <button className="btn btn-soft" onClick={pause} title="Pune pauză">
            ⏸️ Pauză
          </button>
          <button className="btn btn-secondary" onClick={stop} title="Oprește redarea">
            ⏹️ Stop
          </button>
        </>
      ) : (
        <>
          <button className="btn btn-soft" onClick={speak} title="Continuă citirea">
            ▶️ Continuă
          </button>
          <button className="btn btn-secondary" onClick={stop} title="Oprește redarea">
            ⏹️ Stop
          </button>
        </>
      )}
    </div>
  );
}
