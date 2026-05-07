// lex-sidebar web component — single source of truth for all pages
// usage: <lex-sidebar></lex-sidebar>
// active link is detected automatically via window.location.pathname

const SIDEBAR_LINKS = [
  {
    section: 'Data', id: 'sec-data',
    links: [
      { href: 'index.html',     label: 'Rankings',  icon: '<rect x="2" y="10" width="3" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="6.5" y="7" width="3" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="4" width="3" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>' },
      { href: 'trends.html',    label: 'Trends',    icon: '<path d="M2 12L6 8L9 10L14 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' },
      { href: 'providers.html', label: 'Providers', icon: '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M2 8h12M8 2c-2 1.5-3 3.5-3 6s1 4.5 3 6" stroke="currentColor" stroke-width="1.2" fill="none"/>' },
      { href: 'search.html',    label: 'Search',    icon: '<circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 10.5L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { href: 'uptime.html',    label: 'Uptime',    icon: '<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
    ]
  },
  {
    section: 'Tools', id: 'sec-tools',
    links: [
      { href: 'chat.html',       label: 'Chat',             icon: '<path d="M13 3H3a1 1 0 00-1 1v7a1 1 0 001 1h2v2.5l3-2.5h5a1 1 0 001-1V4a1 1 0 00-1-1z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>' },
      { href: 'playground.html', label: 'Playground',       icon: '<rect x="2" y="3" width="12" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 7l2 2-2 2M9 11h2" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' },
      { href: 'model.html',      label: 'Model',            icon: '<circle cx="8" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>' },
    ]
  },
  {
    section: 'Learn', id: 'sec-learn',
    links: [
      { href: 'lab.html',  label: 'Lab',  icon: '<path d="M6 2v5L3 12a1 1 0 00.9 1.5h8.2A1 1 0 0013 12L10 7V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 2h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { href: 'news.html', label: 'News', icon: '<rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 7h6M5 10h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
    ]
  },
];

const CHEVRON = `<svg class="chevron" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function icon(inner) {
  return `<svg width="14" height="14" viewBox="0 0 16 16" fill="none">${inner}</svg>`;
}

function currentPage() {
  const p = window.location.pathname;
  const file = p.substring(p.lastIndexOf('/') + 1) || 'index.html';
  // github pages trailing slash -> index.html
  return file === '' ? 'index.html' : file;
}

class LexSidebar extends HTMLElement {
  connectedCallback() {
    this.className = 'left-sidebar';
    this.id = 'left-sidebar';
    const page = currentPage();

    let html = '<nav class="sidebar-nav">';

    for (const { section, id, links } of SIDEBAR_LINKS) {
      const items = links.map(({ href, label, icon: ic }) => {
        const active = href === page ? ' active' : '';
        return `<a href="${href}" class="sidebar-link${active}">${icon(ic)}<span class="link-label">${label}</span></a>`;
      }).join('\n');

      html += `
      <div class="sidebar-section open" id="${id}">
        <div class="sidebar-section-header" onclick="toggleSection('${id}')"><span>${section}</span>${CHEVRON}</div>
        <div class="sidebar-items">
          ${items}
        </div>
      </div>`;
    }

    const aboutActive = page === 'about.html' ? ' active' : '';
    html += `
      <div class="sidebar-footer-links">
        <a href="about.html" class="sidebar-link${aboutActive}">
          ${icon('<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/><path d="M8 7v5M8 5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>')}
          <span class="link-label">About</span>
        </a>
      </div>
    `;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isLight = savedTheme === 'light';
    html += `
      <div class="sidebar-theme">
        <span class="theme-switch-label">${isLight ? 'Light' : 'Dark'}</span>
        <label class="theme-switch" aria-label="Toggle theme">
          <input type="checkbox" id="sidebar-theme-toggle" ${isLight ? 'checked' : ''}>
          <span class="theme-switch-track"></span>
          <span class="theme-switch-thumb"></span>
        </label>
      </div>
    `;

    html += '</nav>';

    this.innerHTML = html;

    // Theme toggle handler
    const toggle = this.querySelector('#sidebar-theme-toggle');
    const label = this.querySelector('.theme-switch-label');
    if (toggle) {
      toggle.addEventListener('change', () => {
        const newTheme = toggle.checked ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (label) label.textContent = toggle.checked ? 'Light' : 'Dark';
      });
    }
  }
}

// Global toggle function for sections
window.toggleSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
};

// Sidebar hover expand/collapse
const initSidebarHover = () => {
  const sidebar = document.getElementById('left-sidebar');
  if (!sidebar) return;

  const isMobile = () => window.innerWidth <= 768;
  let enterTimer, leaveTimer;

  sidebar.addEventListener('mouseenter', () => {
    if (isMobile()) return;
    clearTimeout(leaveTimer);
    enterTimer = setTimeout(() => sidebar.classList.add('expanded'), 80);
  });

  sidebar.addEventListener('mouseleave', () => {
    if (isMobile()) return;
    clearTimeout(enterTimer);
    leaveTimer = setTimeout(() => sidebar.classList.remove('expanded'), 150);
  });
};

// Init after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSidebarHover);
} else {
  initSidebarHover();
}

customElements.define('lex-sidebar', LexSidebar);