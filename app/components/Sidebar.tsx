'use client';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const SECTIONS = [
  {
    label: 'Data', id: 'sec-data',
    links: [
      { href: '/rankings', label: 'Rankings', icon: '<rect x="2" y="10" width="3" height="4" rx="1"/><rect x="6.5" y="7" width="3" height="7" rx="1"/><rect x="11" y="4" width="3" height="10" rx="1"/>' },
      { href: '/trends',   label: 'Trends',   icon: '<path d="M2 12L6 8L9 10L14 5" stroke-linecap="round" stroke-linejoin="round"/>' },
      { href: '/providers',label: 'Providers',icon: '<circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c-2 1.5-3 3.5-3 6s1 4.5 3 6" fill="none"/>' },
      { href: '/search',   label: 'Search',   icon: '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L13 13" stroke-linecap="round"/>' },
    ],
  },
  {
    label: 'Tools', id: 'sec-tools',
    links: [
      { href: '/chat',       label: 'Chat',       icon: '<path d="M13 3H3a1 1 0 00-1 1v7a1 1 0 001 1h2v2.5l3-2.5h5a1 1 0 001-1V4a1 1 0 00-1-1z" fill="none" stroke-linejoin="round"/>' },
      { href: '/playground', label: 'Playground', icon: '<rect x="2" y="3" width="12" height="9" rx="2"/><path d="M5 7l2 2-2 2M9 11h2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
      { href: '/model',      label: 'Model',      icon: '<circle cx="8" cy="6" r="2.5"/><path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" fill="none" stroke-linecap="round"/>' },
    ],
  },
  {
    label: 'Learn', id: 'sec-learn',
    links: [
      { href: '/lab',  label: 'Lab',  icon: '<path d="M6 2v5L3 12a1 1 0 00.9 1.5h8.2A1 1 0 0013 12L10 7V2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 2h6" stroke-linecap="round"/>' },
      { href: '/news', label: 'News', icon: '<rect x="2" y="3" width="12" height="10" rx="2"/><path d="M5 7h6M5 10h4" stroke-linecap="round"/>' },
    ],
  },
];

const BASE_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">';

function icon(inner: string) {
  return BASE_ICON + inner + '</svg>';
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = (localStorage.getItem('theme') || 'dark') as 'dark' | 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);

    const stored: Record<string, boolean> = {};
    SECTIONS.forEach((s) => { stored[s.id] = true; });
    setOpenSections(stored);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const page = pathname === '/' ? 'index.html' : pathname.slice(1) || 'index.html';
  const isActive = (href: string) => {
    const file = href === '/rankings' ? 'rankings.html' : href.slice(1) + '.html';
    return file === page ? ' active' : '';
  };

  return (
    <aside
      className={'left-sidebar' + (isExpanded ? ' expanded' : '')}
      id="left-sidebar"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <a href="/" className="sidebar-logo-header">
        <img src="/media/L_logo.png" alt="Klyxe" className="sidebar-logo-img" />
        <span className="sidebar-logo-text">Klyxe</span>
      </a>

      <nav className="sidebar-nav">
        {SECTIONS.map((sec) => (
          <div key={sec.id} className={'sidebar-section' + (openSections[sec.id] ? ' open' : '')} id={sec.id}>
            <div
              className="sidebar-section-header"
              onClick={() => toggleSection(sec.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') toggleSection(sec.id); }}
            >
              <span>{sec.label}</span>
              <svg className="chevron" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="sidebar-items">
              {sec.links.map((l) => (
                <a key={l.href} href={l.href} className={'sidebar-link' + isActive(l.href)}>
                  {icon(l.icon)}
                  <span className="link-label">{l.label}</span>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div className="sidebar-footer-links">
          <a href="/about" className={'sidebar-link' + (page === 'about.html' ? ' active' : '')}>
            {icon('<circle cx="8" cy="8" r="6"/><path d="M8 7v5M8 5v.5" fill="none" stroke-linecap="round"/>')}
            <span className="link-label">About</span>
          </a>
        </div>

        <div className="sidebar-theme">
          <span className="theme-switch-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
          <label className="theme-switch" aria-label="Toggle theme">
            <input type="checkbox" checked={theme === 'light'} onChange={toggleTheme} />
            <span className="theme-switch-track"></span>
            <span className="theme-switch-thumb"></span>
          </label>
        </div>

        <a href="/auth" className={'sidebar-signup-btn' + (page === 'auth.html' ? ' active' : '')}>
          {icon('<circle cx="8" cy="6" r="2.5"/><path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" fill="none" stroke-linecap="round"/>')}
          <span className="link-label">Sign Up</span>
        </a>
      </nav>
    </aside>
  );
}
