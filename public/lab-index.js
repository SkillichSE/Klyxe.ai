const themeToggle = document.getElementById('theme-toggle');
const themeLabel  = document.getElementById('theme-label');

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  const l = t === 'light';
  if (themeToggle) themeToggle.checked = l;
  if (themeLabel) themeLabel.textContent = l ? 'Light' : 'Dark';
}
applyTheme(localStorage.getItem('theme') || 'dark');
if (themeToggle) {
  themeToggle.addEventListener('change', () =>
    applyTheme(themeToggle.checked ? 'light' : 'dark'));
}

window.addEventListener('scroll', () => {
  const bar = document.getElementById('app-bar');
  if (bar) bar.classList.toggle('scrolled', window.scrollY > 0);
});

(function () {
  const sidebar   = document.getElementById('left-sidebar');
  const overlay   = document.getElementById('sidebar-overlay');
  const mobileBtn = document.getElementById('sidebar-mobile-toggle');
  const open  = () => { sidebar?.classList.add('open');    overlay?.classList.add('open'); };
  const close = () => { sidebar?.classList.remove('open'); overlay?.classList.remove('open'); };
  mobileBtn?.addEventListener('click', open);
  overlay?.addEventListener('click', close);
  function check() {
    const isMobile = window.innerWidth <= 768;
    if (mobileBtn) mobileBtn.style.display = isMobile ? 'flex' : 'none';
    if (!isMobile) close();
  }
  check();
  window.addEventListener('resize', check);
})();

const DIFFICULTY = {
  junior: { label: 'Junior', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
  middle: { label: 'Middle', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
  senior: { label: 'Senior', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' },
};

async function getAllArticles() {
  return await window.KlyxeArticleStore?.getPublishedArticles?.() || [];
}

(function injectStyles() {
  if (document.getElementById('lab-cards-styles')) return;
  const style = document.createElement('style');
  style.id = 'lab-cards-styles';
  style.textContent = `
    .lab-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
      padding: 32px 0 64px;
    }

    .lab-card-link {
      text-decoration: none;
      display: block;
    }

    .lab-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
      cursor: pointer;
      position: relative;
    }

    .lab-card:hover {
      border-color: rgba(59,130,246,0.4);
      transform: translateY(-3px);
      box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(59,130,246,0.1);
    }

    .lab-card-cover {
      width: 100%;
      height: 140px;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }

    .lab-card-cover-bg {
      position: absolute;
      inset: 0;
      transition: transform 0.4s ease;
      background-size: cover;
      background-position: center;
    }

    .lab-card:hover .lab-card-cover-bg {
      transform: scale(1.04);
    }

    .lab-card-cover svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .lab-card-cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 40%, rgba(11,14,20,0.7) 100%);
    }

    .lab-card-id {
      position: absolute;
      top: 10px;
      left: 12px;
      font-family: var(--font-mono);
      font-size: 10px;
      color: rgba(255,255,255,0.5);
      background: rgba(0,0,0,0.4);
      padding: 2px 8px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      letter-spacing: 0.05em;
    }

    .lab-card-body {
      padding: 16px 18px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .lab-card-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .lab-card-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .lab-card-desc {
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .lab-card-author {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-top: 1px solid var(--border-subtle);
    }

    .lab-card-avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #a855f7);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-mono);
      font-size: 8px;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }

    .lab-card-author-name {
      font-size: 11.5px;
      color: var(--text-secondary);
      flex: 1;
    }

    .lab-card-footer {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 18px 14px;
      flex-wrap: wrap;
    }

    .lab-card-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 9px;
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 500;
      border: 1px solid;
      letter-spacing: 0.02em;
    }

    .lab-card-badge-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: currentColor;
    }

    .lab-card-badge-read {
      background: rgba(255,255,255,0.04);
      border-color: rgba(255,255,255,0.08);
      color: var(--text-tertiary);
    }

    .lab-card-badge-interactive {
      background: rgba(0,212,255,0.07);
      border-color: rgba(0,212,255,0.2);
      color: #00d4ff;
    }

    .lab-card:hover .lab-card-badge-interactive {
      background: rgba(0,212,255,0.12);
    }

    .lab-cards-empty {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 80px 20px;
      color: var(--text-tertiary);
      font-family: var(--font-mono);
      font-size: 13px;
      text-align: center;
    }

    .lab-cards-empty svg {
      opacity: 0.3;
    }

    .lab-cards-grid {
      opacity: 1;
    }
    .lab-card {
      opacity: 0;
      transform: translateY(16px);
      animation: cardReveal 0.4s ease forwards;
    }
    @keyframes cardReveal {
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

async function renderCards() {
  const grid = document.getElementById('lab-cards');
  if (!grid) return;

  const articles = await getAllArticles();

  if (articles.length === 0) {
    grid.innerHTML = `
      <div class="lab-cards-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>No articles yet. Be the first to write one.</span>
      </div>
    `;
    return;
  }

  grid.innerHTML = articles.map((a, idx) => {
    const diff = DIFFICULTY[a.difficulty] || DIFFICULTY.middle;
    const coverStyle = a.cover
      ? `background-image:url("${a.cover}");background-size:cover;background-position:center;`
      : `background:${a.coverGradient || 'linear-gradient(135deg, rgba(31,41,55,0.9), rgba(15,23,42,0.95))'};`;
    const author = a.author || { name: 'Anonymous', avatar: 'A' };
    const displayId = a.id ? String(a.id).slice(0, 8) : String(idx + 1).padStart(2, '0');

    return `
      <a href="/articles.html?article=${a.id}" class="lab-card-link">
        <article class="lab-card" style="animation-delay:${idx * 60}ms;">
          <div class="lab-card-cover">
            <div class="lab-card-cover-bg" style="${coverStyle}width:100%;height:100%;position:absolute;inset:0;"></div>
            <div class="lab-card-cover-overlay"></div>
            <div class="lab-card-id">${displayId}</div>
          </div>

          <div class="lab-card-body">
            <div class="lab-card-tag">${a.tag}</div>
            <div class="lab-card-title">${a.title}</div>
            <div class="lab-card-desc">${a.desc}</div>
          </div>

          <div class="lab-card-author">
            <div class="lab-card-avatar">${author.avatar}</div>
            <span class="lab-card-author-name">${author.name}</span>
          </div>

          <div class="lab-card-footer">
            <span class="lab-card-badge" style="background:${diff.bg};border-color:${diff.border};color:${diff.color};">
              <span class="lab-card-badge-dot"></span>
              ${diff.label}
            </span>
            <span class="lab-card-badge lab-card-badge-read">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 5v3.5l2 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              ${a.readMin} min read
            </span>
            ${a.interactive ? `
            <span class="lab-card-badge lab-card-badge-interactive">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h2l2-4 2 8 2-4 2 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Interactive
            </span>` : ''}
          </div>
        </article>
      </a>
    `;
  }).join('');
}

renderCards().catch((error) => console.warn('Failed to render article cards', error));