import React from 'react';
import toast from 'react-hot-toast';

const DURATION_MS = 10_000;

export function showOkToast(message, type = 'success', opts = {}) {
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
    gap: 10,
    minWidth: 260,
    maxWidth: 420,
    background: '#fff',
    color: '#111',
    borderRadius: 12,
    padding: '14px 16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    textAlign: 'center',
    pointerEvents: 'auto',
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
    margin: '2px auto 0',
  };

  const onEnter = (el) => { el.style.backgroundColor = colors.hover; };
  const onLeave = (el) => { el.style.backgroundColor = colors.bg; };

  return toast.custom(
    (t) => (
      <div style={cardStyle} role="status" aria-live="polite">
        <div>{message}</div>
        <div
          role="button"
          tabIndex={0}
          style={okStyle}
          onMouseEnter={(e) => onEnter(e.currentTarget)}
          onMouseLeave={(e) => onLeave(e.currentTarget)}
          onClick={() => toast.remove(t.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') toast.remove(t.id);
          }}
        >
          OK
        </div>
      </div>
    ),
    {
      duration: DURATION_MS,
      position: opts.position || 'top-center',
      id: opts.id,
    }
  );
}

export function showConfirmToast(
  message,
  opts = { confirmLabel: 'Excluir', cancelLabel: 'Cancelar' }
) {
  const cardStyle = {
    display: 'grid',
    gap: 12,
    minWidth: 280,
    maxWidth: 460,
    background: '#fff',
    color: '#111',
    borderRadius: 12,
    padding: '14px 16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    pointerEvents: 'auto',
    textAlign: 'center',
  };

  const rowStyle = {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const baseBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 18px',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    transition: 'background-color .15s ease',
    outline: 'none',
  };

  const red = { bg: '#dc2626', hover: '#b91c1c' };   // Cancelar
  const green = { bg: '#16a34a', hover: '#15803d' }; // Excluir/Confirmar

  return new Promise((resolve) => {
    let hasResolved = false;

    const resolveOnce = (value, toastId) => {
      if (hasResolved) return;
      hasResolved = true;
      resolve(value);
      toast.remove(toastId);
    };

    toast.custom(
      (t) => (
        <div
          style={cardStyle}
          role="alertdialog"
          aria-live="assertive"
          aria-modal="true"
        >
          <div>{message}</div>
          <div style={rowStyle}>
            <button
              style={{ ...baseBtn, backgroundColor: red.bg }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = red.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = red.bg;
              }}
              onClick={() => resolveOnce(false, t.id)}
            >
              {opts.cancelLabel || 'Cancelar'}
            </button>

            <button
              style={{ ...baseBtn, backgroundColor: green.bg }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = green.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = green.bg;
              }}
              onClick={() => resolveOnce(true, t.id)}
            >
              {opts.confirmLabel || 'Excluir'}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity, // não fecha sozinho
        position: (opts && opts.position) || 'top-center',
        id: opts?.id,
      }
    );
  });
}


