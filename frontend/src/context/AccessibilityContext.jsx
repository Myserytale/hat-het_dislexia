import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('dyslexia_preferences');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      font_family: 'Lexend',
      font_size: 19,
      letter_spacing: 0.08,
      line_height: 1.85,
      color_theme: 'pastel-cream',
      reading_ruler_enabled: true,
      tts_speed: 0.9,
      syllable_highlight: false,
      extra_time_minutes: 60
    };
  });

  // Apply theme & font to body
  useEffect(() => {
    document.body.className = `theme-${preferences.color_theme}`;
    document.documentElement.style.setProperty('--font-size', `${preferences.font_size}px`);
    document.documentElement.style.setProperty('--letter-spacing', `${preferences.letter_spacing}em`);
    document.documentElement.style.setProperty('--line-height', preferences.line_height);

    if (preferences.font_family === 'Lexend') {
      document.documentElement.style.setProperty('--font-family', "'Lexend', sans-serif");
    } else if (preferences.font_family === 'Atkinson') {
      document.documentElement.style.setProperty('--font-family', "'Atkinson Hyperlegible', sans-serif");
    } else if (preferences.font_family === 'OpenDyslexic') {
      document.documentElement.style.setProperty('--font-family', "'OpenDyslexic', 'Lexend', sans-serif");
    } else {
      document.documentElement.style.setProperty('--font-family', "system-ui, sans-serif");
    }

    localStorage.setItem('dyslexia_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = (key, value) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      // Sync with backend API in background
      fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      }).catch(() => {});
      return updated;
    });
  };

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreference, setPreferences }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
