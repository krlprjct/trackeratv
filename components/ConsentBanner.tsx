// ConsentBanner.tsx
import { useState, useEffect, useRef } from 'react';

const ConsentBanner = () => {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const val = localStorage.getItem('cookie_accepted');
      if (!val) {
        const t = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  // Защита от адблокера: проверяем видимость и принудительно восстанавливаем
  useEffect(() => {
    if (!show || !ref.current) return;
    const el = ref.current;
    const check = () => {
      const cs = window.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') {
        el.style.setProperty('display', 'flex', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
        el.style.setProperty('opacity', '1', 'important');
      }
    };
    check();
    const interval = setInterval(check, 500);
    return () => clearInterval(interval);
  }, [show]);

  const accept = () => {
    try { localStorage.setItem('cookie_accepted', 'true'); } catch {}
    setShow(false);
  };

  const decline = () => {
    try { localStorage.setItem('cookie_accepted', 'false'); } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '0px',
        left: '0px',
        right: '0px',
        zIndex: 2147483647,
        backgroundColor: '#1f2937'
        ,
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        boxShadow: '0 -2px 20px rgba(0,0,0,0.15)',
      }}
    >
      <p style={{ margin: 0, fontSize: '13px', color: '#d1d5db', flex: 1, minWidth: '180px', lineHeight: '1.4' }}>
        Мы используем cookies для аналитики и улучшения сайта.{' '}
        <a href="/privacy" style={{ color: '#f87171', textDecoration: 'underline' }}>
          Политика конфиденциальности
        </a>
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: '7px 14px',
            border: '1px solid #4b5563',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: '#9ca3af',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Отклонить
        </button>
        <button
          onClick={accept}
          style={{
            padding: '7px 14px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 600,
          }}
        >
          Принять
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
