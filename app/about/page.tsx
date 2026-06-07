import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Klyxe',
  description: 'How Klyxe works — daily automated benchmarks of AI models. Real code execution, verified answers, no human grading.',
  openGraph: {
    title: 'How Klyxe Works — AI Benchmark',
    description: 'Daily automated benchmarks of AI models — no human grading, no sponsorships. Every score comes from code that actually runs.',
  },
};

export default function AboutPage() {
  return (
    <>
      <Script src="/style-spacing.css" strategy="afterInteractive" />
      <Script src="/style.css" strategy="afterInteractive" />
      <Script src="/animations.css" strategy="afterInteractive" />

      <style>{`
        .section { margin-bottom: 48px; }
        .section-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
        .section-title .icon { font-size: 1.2rem; }
        .section-subtitle { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 20px; line-height: 1.5; }
        .weight-badge { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em; padding: 3px 9px; border-radius: 999px; background: var(--accent-dim); color: var(--accent); margin-left: auto; flex-shrink: 0; }
        .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-bottom: 40px; }
        .cat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; }
        .cat-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .cat-icon { font-size: 1.4rem; }
        .cat-name { font-size: 0.9rem; font-weight: 600; }
        .cat-weight { margin-left: auto; font-size: 0.75rem; font-weight: 700; color: var(--accent); background: var(--accent-dim); padding: 2px 8px; border-radius: 999px; }
        .cat-desc { color: var(--text-secondary); font-size: 0.8rem; line-height: 1.5; margin-bottom: 12px; }
        .cat-tests { display: flex; flex-wrap: wrap; gap: 5px; }
        .test-chip { font-size: 0.7rem; padding: 2px 8px; border-radius: 999px; background: var(--surface-raised); border: 1px solid var(--border-subtle); color: var(--text-tertiary); }
        .tier-table-wrap { overflow-x: auto; border-radius: var(--radius-md); border: 1px solid var(--border); }
        table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
        th { text-align: left; padding: 10px 16px; border-bottom: 1px solid var(--border); color: var(--text-tertiary); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; background: var(--surface); }
        td { padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); color: var(--text-secondary); vertical-align: top; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: var(--accent-hover); }
        .td-tier { font-weight: 600; color: var(--text-primary); white-space: nowrap; }
        .td-badge { display: inline-block; font-size: 0.7rem; padding: 1px 7px; border-radius: 999px; font-weight: 600; }
        .badge-small { background: rgba(16,185,129,0.12); color: #34d399; }
        .badge-medium { background: rgba(99,102,241,0.12); color: #a5b4fc; }
        .badge-large { background: rgba(245,158,11,0.12); color: #fbbf24; }
        .code-block { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px 20px; font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.7; color: var(--text-secondary); overflow-x: auto; }
        .code-block .hl { color: var(--accent); }
        .code-block .str { color: #34d399; }
        .code-block .num { color: #fbbf24; }
        .code-block .comment { color: var(--text-tertiary); }
        .api-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media (max-width: 640px) { .api-grid { grid-template-columns: 1fr; } }
        .endpoint-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px 20px; }
        .endpoint-url { font-family: var(--font-mono); font-size: 0.78rem; color: var(--accent); margin-bottom: 6px; word-break: break-all; }
        .endpoint-desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }
        .endpoint-size { font-size: 0.7rem; color: var(--text-tertiary); margin-top: 4px; }
        .steps { display: flex; flex-direction: column; gap: 0; }
        .step { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border-subtle); }
        .step:last-child { border-bottom: none; }
        .step-num { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-dim); color: var(--accent); font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
        .step-body strong { color: var(--text-primary); font-size: 0.875rem; }
        .step-body p { color: var(--text-secondary); font-size: 0.8rem; line-height: 1.5; margin-top: 3px; }
        .divider { border: none; border-top: 1px solid var(--border); margin: 40px 0; }
        .oss-box { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 24px 28px; display: flex; align-items: center; gap: 20px; }
        .oss-box p { color: var(--text-secondary); font-size: 0.875rem; line-height: 1.6; margin-bottom: 12px; }
        .btn-outline { display: inline-block; padding: 9px 20px; border: 1px solid var(--border-strong); border-radius: var(--radius-md); text-decoration: none; font-size: 0.85rem; font-weight: 500; color: var(--text-primary); transition: background 0.15s; }
        .btn-outline:hover { background: var(--accent-hover); }
      `}</style>

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1 className="page-hero-title">How Klyxe Works</h1>
          <p className="page-hero-sub">Daily automated benchmarks of AI models — no human grading, no sponsorships. Every score comes from code that actually runs, logic puzzles with known answers, and strict formatting checks.</p>
        </div>
      </div>

      <main className="container">
        {/* SCORE FORMULA */}
        <div className="section">
          <div className="section-title"><span className="icon">📐</span> Quality Score Formula</div>
          <div className="section-subtitle">One final number — <strong>Quality Score 0–100</strong> — is a weighted average of four categories. Speed is measured separately and never affects quality.</div>

          <div className="categories-grid">
            <div className="cat-card">
              <div className="cat-card-header"><span className="cat-icon">💻</span><span className="cat-name">Code</span><span className="cat-weight">35%</span></div>
              <p className="cat-desc">Model writes a Python function. We <strong>actually execute it</strong> with test inputs and compare outputs to expected values. Syntax error or wrong logic = 0. No partial credit for broken code.</p>
              <div className="cat-tests">
                <span className="test-chip">fibonacci</span><span className="test-chip">palindrome</span><span className="test-chip">is_prime</span>
                <span className="test-chip">bubble_sort</span><span className="test-chip">count_vowels</span><span className="test-chip">binary_search</span>
                <span className="test-chip">flatten</span><span className="test-chip">longest_common_prefix</span>
              </div>
            </div>
            <div className="cat-card">
              <div className="cat-card-header"><span className="cat-icon">🧠</span><span className="cat-name">Reasoning</span><span className="cat-weight">30%</span></div>
              <p className="cat-desc">Logic puzzles, probability traps, and multi-step deduction — each with a single correct answer. We check if the model&apos;s response contains the right answer string.</p>
              <div className="cat-tests">
                <span className="test-chip">syllogism</span><span className="test-chip">river crossing</span><span className="test-chip">coin flip</span>
                <span className="test-chip">knights &amp; knaves</span><span className="test-chip">base rate / Bayes</span>
                <span className="test-chip">scheduling constraints</span><span className="test-chip">word problem</span><span className="test-chip">counting trap</span>
              </div>
            </div>
            <div className="cat-card">
              <div className="cat-card-header"><span className="cat-icon">📋</span><span className="cat-name">Instruction Following</span><span className="cat-weight">20%</span></div>
              <p className="cat-desc">Can the model follow exact formatting rules? We ask for JSON with specific keys, numbered lists of exact length, and precise sentence counts. We parse the output programmatically.</p>
              <div className="cat-tests">
                <span className="test-chip">JSON 3 keys</span><span className="test-chip">JSON nested</span><span className="test-chip">numbered list &times;5</span><span className="test-chip">sentence count &times;3</span>
              </div>
            </div>
            <div className="cat-card">
              <div className="cat-card-header"><span className="cat-icon">🌍</span><span className="cat-name">Translation</span><span className="cat-weight">15%</span></div>
              <p className="cat-desc">English &harr; Russian &harr; Spanish. We check for the correct writing system (Cyrillic ratio for Russian) and expected vocabulary keywords. No LLM judge — purely deterministic checks.</p>
              <div className="cat-tests">
                <span className="test-chip">EN &rarr; RU</span><span className="test-chip">RU &rarr; EN</span><span className="test-chip">EN &rarr; ES</span>
              </div>
            </div>
          </div>

          <div className="code-block">
            <span className="comment"># quality_score formula (benchmark.py)</span><br />
            quality = (<br />
            &nbsp;&nbsp;avg_code &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="hl">* 0.35</span>  <span className="comment">+  # 35% — real execution</span><br />
            &nbsp;&nbsp;reasoning_score &nbsp;<span className="hl">* 0.30</span>  <span className="comment">+  # 30% — logic &amp; math</span><br />
            &nbsp;&nbsp;avg_instruction &nbsp;<span className="hl">* 0.20</span>  <span className="comment">+  # 20% — format compliance</span><br />
            &nbsp;&nbsp;avg_translation &nbsp;<span className="hl">* 0.15</span>  &nbsp;&nbsp;&nbsp;<span className="comment">   # 15% — language accuracy</span><br />
            )
          </div>
        </div>

        <hr className="divider" />

        {/* TIER SYSTEM */}
        <div className="section">
          <div className="section-title"><span className="icon">📊</span> Tiered Testing — Difficulty Scales with Size</div>
          <div className="section-subtitle">Small models get easier tasks — basic recursion, simple logic. Large models get harder ones — algorithmic problems, Bayesian traps, multi-step constraints. This makes scores <strong>meaningful within each tier</strong> and prevents small models from looking better than they are by acing trivial tasks.</div>

          <div className="tier-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Tier</th><th>Size</th><th>Code tests</th><th>Reasoning tests</th><th>Instruction tests</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="td-tier"><span className="td-badge badge-small">Small</span></td>
                  <td>&le;10B</td>
                  <td>fibonacci, palindrome</td>
                  <td>syllogism, speed math, counting</td>
                  <td>JSON (3 keys), list &times;5</td>
                </tr>
                <tr>
                  <td className="td-tier"><span className="td-badge badge-medium">Medium</span></td>
                  <td>11–50B</td>
                  <td>+ is_prime, bubble_sort, count_vowels</td>
                  <td>+ river crossing, coin flip, word problem, deduction</td>
                  <td>+ sentence count &times;3</td>
                </tr>
                <tr>
                  <td className="td-tier"><span className="td-badge badge-large">Large</span></td>
                  <td>50B+</td>
                  <td>+ binary_search, flatten, longest_common_prefix</td>
                  <td>+ knights &amp; knaves, Bayes base rate, scheduling</td>
                  <td>+ JSON nested (name/scores/active)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            Rankings are normalized <em>within</em> each tier — a Small #1 is the best among small models, not globally. Models with unknown size fall back to the Medium tier.
          </p>
        </div>

        <hr className="divider" />

        {/* HOW IT WORKS */}
        <div className="section">
          <div className="section-title"><span className="icon">⚙️</span> How It Runs</div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-body">
                <strong>Daily at 03:00 UTC — GitHub Actions triggers the benchmark</strong>
                <p>Fully automated, no human involvement. The workflow runs <code>benchmark.py</code> against all configured models.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-body">
                <strong>Each model runs its tier&apos;s test suite</strong>
                <p>Small models run 2 code + 3 reasoning tests. Large models run 4 code + 6 reasoning tests. Python functions are executed in a sandbox via subprocess. All results are deterministic.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-body">
                <strong>Scores computed, JSON files written</strong>
                <p>Results saved to <code>docs/data/results/YYYY-MM-DD.json</code> (full proof), <code>leaderboard.json</code> (ranked list), and <code>summary.json</code> (lightweight integration endpoint).</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <div className="step-body">
                <strong>Git commit &rarr; GitHub Pages redeploys automatically</strong>
                <p>The updated JSON files are committed and pushed. GitHub Pages picks up the changes within minutes.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <div className="step-body">
                <strong>Speed measured separately, never mixed into quality</strong>
                <p>Three speed prompts (short / medium / long) measure raw tokens/second. A model can score 100/100 on quality and rank last on speed — or vice versa.</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* PUBLIC API */}
        <div className="section">
          <div className="section-title"><span className="icon">🔌</span> Public API — Use in Your Projects</div>
          <div className="section-subtitle">All data is available as plain JSON over HTTPS with CORS. No auth, no rate limits. Fetch rankings, embed a leaderboard, or pipe scores into your own tooling.</div>

          <div className="api-grid">
            <div className="endpoint-card">
              <div className="endpoint-url">data/results/summary.json</div>
              <div className="endpoint-desc"><strong>Recommended for integrations.</strong> One entry per model — id, name, provider, tier, quality score, speed, per-category scores. ~6 KB, updated daily.</div>
              <div className="endpoint-size">~6 KB &middot; updated daily</div>
            </div>
            <div className="endpoint-card">
              <div className="endpoint-url">data/results/leaderboard.json</div>
              <div className="endpoint-desc">Quality-ranked list with rank, score, speed, tier, and status for every model. Same data as the main Rankings page.</div>
              <div className="endpoint-size">~6 KB &middot; updated daily</div>
            </div>
            <div className="endpoint-card">
              <div className="endpoint-url">data/results/leaderboard_speed.json</div>
              <div className="endpoint-desc">Same structure, ranked by tokens/second instead of quality score.</div>
              <div className="endpoint-size">~6 KB &middot; updated daily</div>
            </div>
            <div className="endpoint-card">
              <div className="endpoint-url">data/results/YYYY-MM-DD.json</div>
              <div className="endpoint-desc">Full daily snapshot with raw test outputs, execution logs, and per-case results. Use this to audit scores or build custom analysis.</div>
              <div className="endpoint-size">~165 KB &middot; one file per day</div>
            </div>
          </div>

          <div className="code-block" style={{ marginTop: '20px' }}>
            <span className="comment">// Minimal example — fetch top 5 models</span><br />
            <span className="hl">const</span> res = <span className="hl">await</span> fetch(<span className="str">&apos;https://skillichse.github.io/Klyxe/data/results/summary.json&apos;</span>);<br />
            <span className="hl">const</span> &#123; models &#125; = <span className="hl">await</span> res.json();<br />
            <span className="hl">const</span> top5 = models.slice(<span className="num">0</span>, <span className="num">5</span>);<br /><br />
            top5.forEach(m =&gt; &#123;<br />
            &nbsp;&nbsp;console.log(<span className="str">`#$&#123;m.rank&#125; $&#123;m.name&#125; — quality: $&#123;m.quality&#125;, speed: $&#123;m.speed&#125; tok/s`</span>);<br />
            &#125;);
          </div>

          <div className="code-block" style={{ marginTop: '12px' }}>
            <span className="comment"># Python example</span><br />
            <span className="hl">import</span> requests<br />
            data = requests.get(<span className="str">&apos;https://skillichse.github.io/Klyxe/data/results/summary.json&apos;</span>).json()<br />
            <span className="hl">for</span> m <span className="hl">in</span> data[<span className="str">&apos;models&apos;</span>][:5]:<br />
            &nbsp;&nbsp;<span className="hl">print</span>(<span className="str">f&quot;#&#123;m[&apos;rank&apos;]&#125; &#123;m[&apos;name&apos;]&#125; — &#123;m[&apos;quality&apos;]&#125;/100 quality, &#123;m[&apos;speed&apos;]&#125; tok/s&quot;</span>)
          </div>
        </div>

        <hr className="divider" />

        {/* OPEN SOURCE */}
        <div className="oss-box">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>Open Source</div>
            <p>All benchmark code, scoring logic, and raw result data is public. No hidden weights, no paid placements, no LLM-as-judge black boxes. Every score can be reproduced by running <code>benchmark.py</code> yourself.</p>
            <a href="https://github.com/SkillichSE/Klyxe/" target="_blank" rel="noopener" className="btn-outline">View on GitHub &rarr;</a>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-links">
          <a href="https://skillichse.github.io/Klyxe/" className="footer-link">GitHub</a>
          <a href="/about" className="footer-link">About</a>
          <a href="/news" className="footer-link">News</a>
        </div>
        <div className="footer-copy">Open source &middot; Updated daily via GitHub Actions</div>
      </footer>
    </>
  );
}
