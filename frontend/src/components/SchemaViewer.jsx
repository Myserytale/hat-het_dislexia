import React from 'react';

export default function SchemaViewer({ scheme }) {
  if (!scheme || !scheme.nodes || scheme.nodes.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
      <h4 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🗺️ Schemă Vizuală: {scheme.title}
      </h4>

      {/* Nodes visual grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {scheme.nodes.map((node) => (
          <div
            key={node.id}
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              backgroundColor: node.color || '#FDE68A',
              color: '#1F2937',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            <strong style={{ display: 'block', fontSize: '0.95rem' }}>{node.label}</strong>
            {node.description && (
              <span style={{ fontSize: '0.82rem', marginTop: '4px', display: 'block', opacity: 0.9 }}>
                {node.description}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Relations */}
      {scheme.edges && scheme.edges.length > 0 && (
        <div style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <strong>Legături cheie: </strong>
          {scheme.edges.map((edge, i) => (
            <span key={i} style={{ display: 'inline-block', marginRight: '12px', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
              {edge.from_node} ➔ <em>{edge.relation}</em> ➔ {edge.to_node}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
