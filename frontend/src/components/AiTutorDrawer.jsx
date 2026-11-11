import React, { useState } from 'react';

export default function AiTutorDrawer({ currentTopic, contextType = "lesson" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Salut! Sunt Lumi, asistentul tău de învățare. 🦉 Spune-mi ce concept nu îți este clar sau dacă ai nevoie de o schemă de idei pentru compunere!'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context_type: contextType,
          current_topic: currentTopic
        })
      });

      if (!response.ok) throw new Error('Eroare asistent');

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply,
          guidelines: data.guiding_questions,
          encouragement: data.encouragement
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sunt aici alături de tine! Amintește-ți regula de bază: ia lucrurile pe rând, pas cu pas.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          className="ai-floating-btn"
          onClick={() => setIsOpen(true)}
          title="Deschide asistentul AI Lumi pentru explicații suplimentare"
        >
          🦉 Asistent AI Lumi
        </button>
      )}

      {isOpen && (
        <div className="ai-drawer">
          <div className="ai-header">
            <span>🦉 Asistentul Lumi</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'inherit' }}
            >
              ✕
            </button>
          </div>

          <div className="ai-body">
            {messages.map((m, idx) => (
              <div key={idx} className={`chat-bubble ${m.sender}`}>
                <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                {m.guidelines && m.guidelines.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '0.85rem', opacity: 0.9 }}>
                    <strong>Întrebări ajutătoare:</strong>
                    <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                      {m.guidelines.map((g, gi) => (
                        <li key={gi}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {m.encouragement && (
                  <div style={{ marginTop: '6px', fontStyle: 'italic', fontSize: '0.82rem', color: '#166534' }}>
                    💡 {m.encouragement}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble ai">
                <em>Lumi se gândește la cea mai simplă explicație... ✨</em>
              </div>
            )}
          </div>

          {/* Quick suggestions */}
          <div style={{ padding: '8px 12px', background: 'var(--bg-primary)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 8px', whiteSpace: 'nowrap' }}
              onClick={() => sendMessage("Cum recunosc substantivul?")}
            >
              💡 Substantiv?
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 8px', whiteSpace: 'nowrap' }}
              onClick={() => sendMessage("Cum fac planul pentru compunere?")}
            >
              📝 Plan compunere?
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '4px 8px', whiteSpace: 'nowrap' }}
              onClick={() => sendMessage("Cum deosebesc diftongul de hiat?")}
            >
              🟡 Diftong vs Hiat?
            </button>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            style={{ padding: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder="Întreabă-l pe Lumi..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                fontFamily: 'inherit'
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px' }}>
              Trimite
            </button>
          </form>
        </div>
      )}
    </>
  );
}
