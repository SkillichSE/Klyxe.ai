// Klyxe index page - optimized bundle
const compareMap = new Map();
let allResults = [];
let activeTier = 'all';

const scalePct = (val) => val <= 0 ? 0 : 50 + (val / 100) * 50;

const rankMeta = (i) => {
  const cls = i < 3 ? ['gold','silver','bronze'][i] : 'other';
  const label = i < 3 ? ['#1','#2','#3'][i] : `#${i+1}`;
  return { cls, label };
};

const cardClass = (i) => i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : '';

const scoreRow = (label, val, fillClass, tip) => {
  const w = scalePct(val);
  return `<div class="score-row">
    <span class="score-label">${label}</span>
    <span class="score-bar-wrap">
      <div class="score-bar-fill ${fillClass}" style="width:0%" data-w="${w}"></div>
      <span class="score-tooltip">${tip}</span>
    </span>
    <span class="score-val">${Math.round(val)}</span>
  </div>`;
};

const animateBars = (container) => {
  if (!container) return;
  container.querySelectorAll('.score-bar-fill[data-w]').forEach((bar, i) => {
    setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 80 + i * 25);
  });
};

window.toggleCompare = (btn) => {
  const m = JSON.parse(decodeURIComponent(escape(atob(btn.dataset.model))));
  const key = m.model_id || m.model_name;
  if (compareMap.has(key)) {
    compareMap.delete(key);
  } else if (compareMap.size < 4) {
    compareMap.set(key, m);
  }
  const sel = compareMap.has(key);
  document.querySelectorAll(`.cmp-chip[data-key="${CSS.escape(key)}"]`).forEach(b => {
    b.classList.toggle('selected', sel);
    b.textContent = sel ? 'Selected' : '+ Compare';
  });
  const n = compareMap.size;
  document.getElementById('compare-bar').classList.toggle('visible', n > 0);
  document.getElementById('compare-count').textContent = `${n} model${n !== 1 ? 's' : ''} selected`;
};

const renderCard = (m, i) => {
  const q = m.quality_score || 0;
  const c = m.tests?.code?.avg_score || 0;
  const rs = m.tests?.reasoning?.score || 0;
  const ins = m.tests?.instruction?.avg_score || 0;
  const tr = m.tests?.translation?.avg_score || 0;
  const key = m.model_id || m.model_name;
  const sel = compareMap.has(key);
  const enc = btoa(unescape(encodeURIComponent(JSON.stringify(m))));
  const rm = rankMeta(i);
  const url = `model.html?id=${encodeURIComponent(m.model_id)}`;

  return `<div class="model-card ${cardClass(i)}" onclick="if(!event.target.closest('button'))location.href='${url}'">
    <div class="card-header">
      <div class="card-title-wrap">
        <div class="card-model-name">${m.model_name}</div>
        <div class="card-model-meta">${m.provider} · ${m.size}</div>
      </div>
      <div class="card-right">
        <span class="rank-num ${rm.cls}">${rm.label}</span>
        <button class="cmp-chip ${sel ? 'selected' : ''}" data-key="${key}" data-model="${enc}" onclick="toggleCompare(this)">${sel ? 'Selected' : '+ Compare'}</button>
      </div>
    </div>
    <div class="score-block">
      ${scoreRow('HumanEval', c, 'fill-code', `HumanEval ${c.toFixed(1)}/100`)}
      ${scoreRow('GSM8K', rs, 'fill-reason', `GSM8K ${rs.toFixed(1)}/100`)}
      ${scoreRow('MMLU', ins, 'fill-mmlu', `MMLU ${ins.toFixed(1)}/100`)}
      ${scoreRow('Translate', tr, 'fill-trans', `Translation ${tr.toFixed(1)}/100`)}
    </div>
    <div class="card-score-footer">
      <span class="score-footer-label">Quality score</span>
      <span class="score-footer-val">${Math.round(q)}<span>/100</span></span>
      <span style="margin-left:auto;font-size:12px;color:var(--text-secondary);font-family:var(--font-mono);">${m.raw_speed > 0 ? Math.round(m.raw_speed) + ' tok/s' : ''}</span>
    </div>
    <div style="padding:10px 0 2px;border-top:1px solid var(--color-outline-var);margin-top:4px;">
      <a href="${url}" class="card-breakdown-link">View full test breakdown →</a>
    </div>
  </div>`;
};

const emptyState = (tier) => `<div style="padding:32px;text-align:center;color:var(--color-on-surface-var);background:var(--color-surf-cont-low);border-radius:16px;">No ${tier} models tested yet</div>`;

const sortList = (list, key) => [...list].sort((a, b) => {
  const va = key === 'quality' ? (b.quality_score||0) - (a.quality_score||0) :
             key === 'speed' ? (b.raw_speed||0) - (a.raw_speed||0) :
             key === 'code' ? (b.tests?.code?.avg_score||0) - (a.tests?.code?.avg_score||0) :
             key === 'reasoning' ? (b.tests?.reasoning?.score||0) - (a.tests?.reasoning?.score||0) : 0;
  return va;
});

const buildSortRow = (el, list, renderFn) => {
  const defs = [
    { key: 'quality', label: 'Score' },
    { key: 'speed', label: 'Speed' },
    { key: 'code', label: 'Code' },
    { key: 'reasoning', label: 'Logic' },
  ];
  let active = 'quality';
  el.innerHTML = defs.map(d => `<button class="sort-chip ${d.key === active ? 'active' : ''}" data-key="${d.key}">${d.label}</button>`).join('');
  el.querySelectorAll('.sort-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      el.querySelectorAll('.sort-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      active = btn.dataset.key;
      renderFn(sortList(list, active));
    });
  });
};

const buildQualityBoard = (results) => {
  const groups = { large: [], medium: [], small: [] };
  sortList(results, 'quality').forEach(m => {
    const cat = m.size_category || 'unknown';
    if (groups[cat]) groups[cat].push(m);
  });

  ['large', 'medium', 'small'].forEach(tier => {
    const board = document.getElementById(`quality-board-${tier}`);
    const sortEl = document.getElementById(`sort-quality-${tier}`);
    if (!board) return;
    const list = groups[tier] || [];
    const render = (items) => {
      board.innerHTML = items.length ? items.map((m, i) => renderCard(m, i)).join('') : emptyState(tier);
    };
    render(list);
    if (sortEl && list.length > 1) buildSortRow(sortEl, list, render);
  });
};

const applyTierFilter = (tier) => {
  activeTier = tier;
  document.querySelectorAll('.category-section').forEach(sec => {
    sec.style.display = (tier === 'all' || tier === sec.dataset.tier) ? '' : 'none';
  });
  document.querySelectorAll('.size-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.size === tier);
  });
};

// Lazy load Chart.js only when needed
let chartLoaded = false;
const loadChart = async () => {
  if (chartLoaded) return;
  await import('https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js');
  chartLoaded = true;
};

window.openCompare = async () => {
  const models = [...compareMap.values()];
  if (!models.length) return;

  await loadChart();
  const radarGrid = document.getElementById('radar-grid');
  radarGrid.innerHTML = '';
  document.getElementById('dialog-scrim').classList.add('open');

  const LABELS = ['HumanEval', 'GSM8K', 'MMLU', 'Translation'];
  const COLORS = ['#1a73e8', '#1e8e3e', '#9334ea', '#e37400'];
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';

  models.forEach((m, idx) => {
    const data = [
      m.tests?.code?.avg_score || 0,
      m.tests?.reasoning?.score || 0,
      m.tests?.instruction?.avg_score || 0,
      m.tests?.translation?.avg_score || 0,
    ];
    const card = document.createElement('div');
    card.className = 'radar-card';
    card.innerHTML = `<div class="radar-card-name">${m.model_name}</div><div class="radar-card-meta">${m.provider} · ${m.size}</div><canvas id="rc-${idx}" width="210" height="180"></canvas>`;
    radarGrid.appendChild(card);

    new Chart(document.getElementById(`rc-${idx}`), {
      type: 'radar',
      data: {
        labels: LABELS,
        datasets: [{ data, backgroundColor: COLORS[idx] + '20', borderColor: COLORS[idx], borderWidth: 2, pointBackgroundColor: COLORS[idx], pointRadius: 3 }],
      },
      options: {
        scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)' }, pointLabels: { color: dark ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.45)', font: { size: 10, family: 'Roboto' } } } },
        plugins: { legend: { display: false } },
        responsive: false,
      },
    });
  });

  const rows = [
    ['Provider', m => m.provider, false],
    ['Size', m => m.size, false],
    ['Context', m => m.context || 'N/A', false],
    ['HumanEval', m => (m.tests?.code?.avg_score || 0).toFixed(1), true],
    ['GSM8K', m => (m.tests?.reasoning?.score || 0).toFixed(1), true],
    ['MMLU', m => (m.tests?.instruction?.avg_score || 0).toFixed(1), true],
    ['Translation', m => (m.tests?.translation?.avg_score || 0).toFixed(1), true],
    ['Quality', m => (m.quality_score || 0).toFixed(1), true],
    ['Speed tok/s', m => Math.round(m.raw_speed || 0), true],
  ];

  let html = `<thead><tr><th>Metric</th>${models.map(m => `<th>${m.model_name}</th>`).join('')}</tr></thead><tbody>`;
  rows.forEach(([label, fn, numeric]) => {
    const vals = models.map(m => fn(m));
    let best = -1;
    if (numeric && models.length > 1) {
      best = vals.map(v => parseFloat(v)).reduce((bi, v, i, a) => v > a[bi] ? i : bi, 0);
    }
    html += `<tr><td class="row-label">${label}</td>${vals.map((v, i) => `<td class="${i === best ? 'best' : ''}">${v}</td>`).join('')}</tr>`;
  });
  document.getElementById('cmp-table').innerHTML = html + '</tbody>';
};

// Main init
document.addEventListener('DOMContentLoaded', async () => {
  // Size filter handlers
  document.querySelectorAll('.size-chip').forEach(chip => {
    chip.addEventListener('click', () => applyTierFilter(chip.dataset.size));
  });

  // Compare bar handlers
  document.getElementById('compare-go')?.addEventListener('click', openCompare);
  document.getElementById('compare-clear')?.addEventListener('click', () => {
    compareMap.clear();
    document.querySelectorAll('.cmp-chip').forEach(b => { b.classList.remove('selected'); b.textContent = '+ Compare'; });
    document.getElementById('compare-bar').classList.remove('visible');
    document.getElementById('compare-count').textContent = '0 selected';
  });
  document.getElementById('dialog-close')?.addEventListener('click', () => document.getElementById('dialog-scrim').classList.remove('open'));
  document.getElementById('dialog-scrim')?.addEventListener('click', e => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('open'); });

  // Load data
  try {
    const today = new Date().toISOString().split('T')[0];
    let data;
    const r = await fetch(`data/results/${today}.json`);
    if (r.ok) {
      const results = await r.json();
      const firstTs = results[0]?.timestamp || new Date().toISOString();
      data = { date: today, timestamp: firstTs, results };
    } else {
      const r2 = await fetch('data/results/latest.json');
      if (!r2.ok) throw new Error(`HTTP ${r2.status}`);
      data = await r2.json();
    }

    allResults = (data.results || []).map(m => ({
      ...m,
      quality_score: m.quality_score ?? m.overall_score ?? 0,
      raw_speed: m.raw_speed ?? m.tests?.speed?.avg_tokens_per_sec ?? 0,
      size_category: m.size_category ?? 'unknown',
    })).filter(m => m.quality_score > 0 || m.raw_speed > 0);

    const ts = new Date(data.timestamp);
    document.getElementById('last-update').innerHTML = `<span class="live-dot"></span>last updated ${ts.toLocaleString()}`;

    if (!allResults.length) {
      document.getElementById('hero-sub-text').textContent = 'No results yet — benchmark is running';
      return;
    }

    const byQ = [...allResults].sort((a, b) => (b.quality_score||0) - (a.quality_score||0));

    const tierLeaders = {};
    ['large','medium','small'].forEach(t => {
      const t_models = byQ.filter(m => m.size_category === t);
      if (t_models[0]) tierLeaders[t] = t_models[0].model_name;
    });
    const parts = Object.entries(tierLeaders).map(([t,n]) => `<em>${n}</em> leads ${t}`).join(' · ');
    if (parts) {
      document.getElementById('hero-headline').innerHTML = parts;
      document.title = `${byQ[0].model_name} #1 today — Klyxe`;
    }
    document.getElementById('hero-sub-text').textContent = `${allResults.length} free models benchmarked · real code execution · verified answers`;

    const s = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    s('stat-models', allResults.length);
    s('stat-fastest', Math.round(Math.max(...allResults.map(r => r.raw_speed||0))));
    s('stat-quality', Math.round(Math.max(...allResults.map(r => r.quality_score||0))));

    buildQualityBoard(allResults);
    applyTierFilter('all');

    // Animate bars after render
    setTimeout(() => {
      ['large','medium','small'].forEach(t => animateBars(document.getElementById(`quality-board-${t}`)));
    }, 200);

    // Load news
    try {
      const news = await fetch('data/results/news.json').then(r => r.json());
      const el = document.getElementById('news-preview');
      if (el && news.items) {
        el.innerHTML = news.items.slice(0, 3).map(item => `<div class="news-item">
          <div class="news-date">${new Date(item.date).toLocaleDateString()}</div>
          <h3 class="news-title"><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></h3>
          <p class="news-summary">${item.summary}</p>
          <span class="news-source">${item.source}</span>
        </div>`).join('');
      }
    } catch (e) {}

  } catch (err) {
    console.error('Klyxe error:', err);
    document.querySelector('main.container').innerHTML = `<div style="text-align:center;padding:64px;"><h2>Could not load results</h2><code style="font-size:12px;color:var(--color-on-surface-var);">${err.message}</code></div>`;
  }
});

// Intersection Observer for reveals
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .section-title').forEach(el => io.observe(el));
})();
