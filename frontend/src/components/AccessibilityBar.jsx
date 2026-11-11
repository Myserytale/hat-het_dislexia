import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AccessibilityBar() {
  const { preferences, updatePreference } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accessibility-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.2rem' }}>👁️</span>
        <strong style={{ fontSize: '0.95rem' }}>Adaptare vizuală:</strong>
        <span className="badge">Temă: {preferences.color_theme.replace('pastel-', '')}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Font size adjustment */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px' }}
            onClick={() => updatePreference('font_size', Math.max(16, preferences.font_size - 1))}
            title="Micșorează fontul"
          >
            A-
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
            {preferences.font_size}px
          </span>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px' }}
            onClick={() => updatePreference('font_size', Math.min(26, preferences.font_size + 1))}
            title="Mărește fontul"
          >
            A+
          </button>
        </div>

        {/* Ruler toggle */}
        <button
          className={`btn ${preferences.reading_ruler_enabled ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '6px 14px' }}
          onClick={() => updatePreference('reading_ruler_enabled', !preferences.reading_ruler_enabled)}
          title="Activează sau dezactivează rigla de citire care te ajută să nu sari rânduri"
        >
          📏 Riglă {preferences.reading_ruler_enabled ? 'Activă' : 'Oprită'}
        </button>

        {/* Settings modal toggle */}
        <button
          className="btn btn-soft"
          style={{ padding: '6px 14px' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          ⚙️ Culori & Font
        </button>
      </div>

      {isOpen && (
        <div style={{
          width: '100%',
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              🎨 Paletă Pastel:
            </label>
            <select
              value={preferences.color_theme}
              onChange={(e) => updatePreference('color_theme', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontFamily: 'inherit' }}
            >
              <option value="pastel-cream">🌾 Crem Cald (Odihnitor)</option>
              <option value="pastel-mint">🌿 Verde Mentă (Clar)</option>
              <option value="pastel-peach">🍑 Piersică Pal (Cald)</option>
              <option value="pastel-sky">☁️ Albastru Cer (Liniștit)</option>
              <option value="pastel-dark">🌙 Mod Noapte Odihnitor</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              🔤 Font prietenos cu dislexia:
            </label>
            <select
              value={preferences.font_family}
              onChange={(e) => updatePreference('font_family', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontFamily: 'inherit' }}
            >
              <option value="Lexend">Lexend (Recomandat)</option>
              <option value="Atkinson">Atkinson Hyperlegible</option>
              <option value="OpenDyslexic">OpenDyslexic</option>
              <option value="System">Standard Sistem</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              🔊 Viteză citire audio:
            </label>
            <select
              value={preferences.tts_speed}
              onChange={(e) => updatePreference('tts_speed', parseFloat(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', fontFamily: 'inherit' }}
            >
              <option value="0.75">Lent (0.75x)</option>
              <option value="0.9">Optim Dislexie (0.9x)</option>
              <option value="1.0">Normal (1.0x)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
