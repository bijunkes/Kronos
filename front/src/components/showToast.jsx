// showToast para janelinhas de avisos
import React from 'react';
import toast from 'react-hot-toast';

export function showOkToast(message, type = 'success') {
  const palette = {
    success: { bg: '#16a34a', hover: '#15803d' },
    error:   { bg: '#dc2626', hover: '#b91c1c' },
    info:    { bg: '#2563eb', hover: '#1d4ed8' },
  };
  const colors = palette[type] || palette.info;

  const cardStyle = {
    display: 'grid',
    gridAutoRows: 'auto',
    justifyItems: 'center',
    alignItems: 'center',
    gap: 12,
    minWidth: 260,
    maxWidth: 420,
    background: '#fff',
    color: '#111',
    borderRadius: 12,
    padding: '16px 20px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    textAlign: 'center',
  };

  const okStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 18px',
    borderRadius: 8,
    backgroundColor: colors.bg,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'background-color .15s ease',
    margin: '0 auto',
  };

  const onEnter = (el) => { el.style.backgroundColor = colors.hover; };
  const onLeave = (el) => { el.style.backgroundColor = colors.bg; };

  toast.custom(
    (t) => (
      <div style={cardStyle}>
        <div>{message}</div>
        <div
          role="button"
          tabIndex={0}
          style={okStyle}
          onMouseEnter={(e) => onEnter(e.currentTarget)}
          onMouseLeave={(e) => onLeave(e.currentTarget)}
          onClick={() => toast.remove(t.id)}   // remove instantâneo
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') toast.remove(t.id);
          }}
        >
          OK
        </div>
      </div>
    ),
    { duration: Infinity, position: 'top-center' }
  );
}
