





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


const ARTICLES = [
  {
    id: 1,
    tag: 'On-device · No API',
    title: 'Digit Recognizer — Model Parameter Visualization',
    desc: 'Draw a digit 0–9 and watch a browser-side model show per-class confidence and feature activations in real time.',
    author: { name: 'Klyxe Lab', avatar: 'KL' },
    difficulty: 'junior',
    readMin: 4,
    interactive: true,
    cover: null,
    coverGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)',
    coverPattern: 'neural',
  },
  {
    id: 2,
    tag: 'On-device · VAE · Generative',
    title: 'Client-side VAE Latent Space Decoder',
    desc: 'Click or drag a point on the 2-D latent map — the VAE decoder instantly generates digit images. Fine-tune with z₁/z₂ sliders.',
    author: { name: 'Klyxe Lab', avatar: 'KL' },
    difficulty: 'middle',
    readMin: 7,
    interactive: true,
    cover: null,
    coverGradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    coverPattern: 'latent',
  },
  {
    id: 3,
    tag: 'API · Three.js · Embeddings · 3D',
    title: 'Semantically Similar Words in 3-D',
    desc: 'Enter a word — the system finds semantically close terms and plots them in 3-D space. Drag to rotate.',
    author: { name: 'Klyxe Lab', avatar: 'KL' },
    difficulty: 'middle',
    readMin: 6,
    interactive: true,
    cover: null,
    coverGradient: 'linear-gradient(135deg, #0d1b2a 0%, #1b4332 50%, #00d4ff22 100%)',
    coverPattern: 'graph3d',
  },
  {
    id: 4,
    tag: 'API · Temperature · Anthropic',
    title: 'Temperature Parameter — Live Visualization',
    desc: 'One prompt, three responses at different temperatures. See how the temperature setting affects randomness and creativity.',
    author: { name: 'Klyxe Lab', avatar: 'KL' },
    difficulty: 'junior',
    readMin: 5,
    interactive: true,
    cover: null,
    coverGradient: 'linear-gradient(135deg, #1a0533 0%, #6d28d9 60%, #f59e0b44 100%)',
    coverPattern: 'wave',
  },
  {
    id: 5,
    tag: 'API · Tokens · Analytics · Charts',
    title: 'Real-time API Token Usage Tracker',
    desc: 'Send requests and monitor input/output token consumption. Cumulative bar chart and per-request history table.',
    author: { name: 'Klyxe Lab', avatar: 'KL' },
    difficulty: 'middle',
    readMin: 8,
    interactive: true,
    cover: null,
    coverGradient: 'linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #14b8a6 100%)',
    coverPattern: 'bars',
  },
  {
    id: 6,
    tag: 'API · HumanEval · Multi-model · Benchmark',
    title: 'HumanEval Benchmark — Multi-model Comparison',
    desc: 'Pick a HumanEval task and models — all receive the same prompt in parallel. Compare generated code and test results side by side.',
    author: { name: 'Klyxe Lab', avatar: 'KL' },
    difficulty: 'senior',
    readMin: 12,
    interactive: true,
    cover: null,
    coverGradient: 'linear-gradient(135deg, #1a0a00 0%, #92400e 60%, #f97316 100%)',
    coverPattern: 'code',
  },
];


const COVER_PATTERNS = {
  neural(id) {
    const nodes = Array.from({length: 12}, (_, i) => ({
      x: 20 + Math.sin(i * 2.1) * 130 + 150,
      y: 20 + Math.cos(i * 1.7) * 50 + 60,
    }));
    const lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < 100) lines.push(`<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="rgba(14,165,233,0.25)" stroke-width="1"/>`);
      }
    }
    return `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
      ${lines.join('')}
      ${nodes.map(n => `<circle cx="${n.x}" cy="${n.y}" r="3" fill="rgba(14,165,233,0.6)"/>`).join('')}
      <circle cx="160" cy="70" r="8" fill="none" stroke="rgba(14,165,233,0.5)" stroke-width="1.5"/>
    </svg>`;
  },
  latent(_) {
    const pts = Array.from({length: 40}, (_, i) => ({
      x: 20 + (i % 8) * 36 + Math.sin(i) * 8,
      y: 20 + Math.floor(i / 8) * 24 + Math.cos(i * 1.3) * 6,
      c: `hsl(${200 + i * 5}, 70%, 60%)`,
    }));
    return `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="lg${_}" cx="50%" cy="50%"><stop offset="0%" stop-color="#a855f7" stop-opacity="0.4"/><stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="160" cy="70" rx="120" ry="55" fill="url(#lg${_})"/>
      ${pts.map(p => `<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="${p.c}" opacity="0.7"/>`).join('')}
      <circle cx="160" cy="70" r="5" fill="#c4b5fd"/>
      <line x1="155" y1="70" x2="165" y2="70" stroke="#c4b5fd" stroke-width="1.5"/>
      <line x1="160" y1="65" x2="160" y2="75" stroke="#c4b5fd" stroke-width="1.5"/>
    </svg>`;
  },
  graph3d(_) {
    const cube = [
      [60,40],[120,40],[180,40],[240,40],
      [80,80],[140,80],[200,80],
      [100,110],[160,110],
    ];
    const edges = [[0,1],[1,2],[2,3],[4,5],[5,6],[7,8],[0,4],[1,5],[2,6],[4,7],[5,8]];
    return `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
      ${edges.map(([a,b]) => `<line x1="${cube[a][0]}" y1="${cube[a][1]}" x2="${cube[b][0]}" y2="${cube[b][1]}" stroke="rgba(0,212,255,0.3)" stroke-width="1"/>`).join('')}
      ${cube.map(([x,y], i) => `<circle cx="${x}" cy="${y}" r="${i===4?6:3}" fill="${i===4?'#00d4ff':'rgba(0,212,255,0.7)'}" />`).join('')}
      <text x="141" y="84" font-size="8" fill="#00d4ff" font-family="monospace" opacity="0.8">word</text>
    </svg>`;
  },
  wave(_) {
    const paths = [0.2, 0.5, 0.9].map((amp, i) => {
      const pts = Array.from({length: 32}, (_, j) => {
        const x = (j / 31) * 300 + 10;
        const y = 70 + Math.sin(j * 0.4 + i) * (20 * amp) + Math.sin(j * 0.8) * 8 * amp;
        return `${j===0?'M':'L'}${x},${y}`;
      }).join(' ');
      const colors = ['#f59e0b','#a855f7','#3b82f6'];
      return `<path d="${pts}" fill="none" stroke="${colors[i]}" stroke-width="${1.5 - i*0.3}" opacity="${0.4 + amp * 0.4}"/>`;
    });
    return `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">${paths.join('')}</svg>`;
  },
  bars(_) {
    const data = [30,55,42,70,58,85,63,90,72,95,80,100];
    return `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
      ${data.map((v, i) => {
        const h = v * 0.9;
        const x = 18 + i * 24;
        const y = 120 - h;
        const hue = 160 + (v / 100) * 40;
        return `<rect x="${x}" y="${y}" width="16" height="${h}" rx="3" fill="rgba(20,184,166,${0.3 + v/150})" stroke="rgba(20,184,166,0.4)" stroke-width="0.5"/>`;
      }).join('')}
      <line x1="10" y1="120" x2="310" y2="120" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
    </svg>`;
  },
  code(_) {
    const lines = [
      { y: 25, w: 140, indent: 0, c: '#f97316' },
      { y: 42, w: 100, indent: 16, c: '#fb923c' },
      { y: 59, w: 180, indent: 32, c: '#fbbf24' },
      { y: 76, w: 120, indent: 32, c: '#86efac' },
      { y: 93, w: 160, indent: 32, c: '#67e8f9' },
      { y: 110, w: 80, indent: 16, c: '#fb923c' },
    ];
    return `<svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="300" height="120" rx="8" fill="rgba(0,0,0,0.3)" stroke="rgba(249,115,22,0.2)" stroke-width="1"/>
      ${lines.map(l => `<rect x="${20+l.indent}" y="${l.y}" width="${l.w}" height="6" rx="3" fill="${l.c}" opacity="0.6"/>`).join('')}
      <circle cx="25" cy="18" r="3" fill="#ef4444" opacity="0.7"/>
      <circle cx="37" cy="18" r="3" fill="#f59e0b" opacity="0.7"/>
      <circle cx="49" cy="18" r="3" fill="#22c55e" opacity="0.7"/>
    </svg>`;
  },
};


const DIFFICULTY = {
  junior: { label: 'Junior', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
  middle: { label: 'Middle', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
  senior: { label: 'Senior', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' },
};

async function getAllArticles() {
  const published = await window.KlyxeArticleStore?.getPublishedArticles?.() || [];
  return [...ARTICLES, ...published];
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
  grid.innerHTML = articles.map((a, idx) => {
    const diff = DIFFICULTY[a.difficulty] || DIFFICULTY.middle;
    const patternSvg = COVER_PATTERNS[a.coverPattern]?.(a.id) || '';
    const coverStyle = a.cover
      ? `background-image:url("${a.cover}");background-size:cover;background-position:center;`
      : `background:${a.coverGradient || 'linear-gradient(135deg, rgba(31,41,55,0.9), rgba(15,23,42,0.95))'};`;
    const author = a.author || { name: 'Klyxe Lab', avatar: 'KL' };

    return `
      <a href="/articles.html?article=${a.id}" class="lab-card-link">
        <article class="lab-card" style="animation-delay:${idx * 60}ms;">
          <div class="lab-card-cover">
            <div class="lab-card-cover-bg" style="${coverStyle}width:100%;height:100%;position:absolute;inset:0;"></div>
            ${patternSvg}
            <div class="lab-card-cover-overlay"></div>
            <div class="lab-card-id">${String(a.id).padStart(2, '0')}</div>
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
