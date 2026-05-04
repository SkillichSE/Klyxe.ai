'use client';

import { useState, useEffect } from 'react';

export default function Sidebar() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      width: '240px',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      background: 'var(--bg-secondary, #1a1a1a)'
    }}>
      <a href="/" style={{
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--text-primary)',
        textDecoration: 'none',
        marginBottom: '32px'
      }}>
        Klyxe
      </a>

      <nav style={{ flex: 1 }}>
        {/* Navigation items can be added here */}
      </nav>

      <button
        onClick={toggleTheme}
        style={{
          padding: '10px 16px',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
    </aside>
  );
}
