import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function ReadingRuler() {
  const { preferences } = useAccessibility();
  const [topPos, setTopPos] = useState(200);

  useEffect(() => {
    if (!preferences.reading_ruler_enabled) return;

    const handleMouseMove = (e) => {
      setTopPos(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [preferences.reading_ruler_enabled]);

  if (!preferences.reading_ruler_enabled) return null;

  return (
    <div 
      className="reading-ruler-overlay" 
      style={{ top: `${topPos}px` }}
      aria-hidden="true"
    />
  );
}
