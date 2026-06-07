import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Playground — Klyxe',
  description: 'Compare two AI models side-by-side with your own prompt. Test quality, speed, and reasoning across multiple providers.',
  openGraph: {
    title: 'AI Playground — Klyxe',
    description: 'Compare two AI models side-by-side with your own prompt. Test quality, speed, and reasoning.',
  },
};

export default function PlaygroundPage() {
  return (
    <>
      <Script src="/style-spacing.css" strategy="afterInteractive" />
      <Script src="/style.css" strategy="afterInteractive" />
      <Script src="/animations.css" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js" strategy="afterInteractive" />

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />

      <div className="hero">
        <div className="hero-inner">
          <h1 className="hero-headline">Playground</h1>
          <p className="hero-sub">Compare two models side-by-side with your own prompt</p>
        </div>
      </div>

      <main className="container">
        {/* API Key */}
        <div className="pg-key-banner reveal">
          <div className="pg-key-banner-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11 1a4 4 0 0 1 0 8 4 4 0 0 1-3.87-3H2.5L1 7.5 2.5 9l1-1 1 1 1.5-1.5H7.13A4 4 0 0 1 11 1z" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="11" cy="5" r="1" fill="#fff"/></svg>
          </div>
          <div className="pg-key-banner-text">
            <div className="pg-key-banner-title">OpenRouter API Key</div>
            <div className="pg-key-banner-sub">Free key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">openrouter.ai/keys</a> &middot; stored locally, never sent to our servers</div>
          </div>
          <div className="pg-key-input-wrap">
            <input type="password" className="pg-key-input" id="api-key" placeholder="sk-or-v1-&hellip;" autoComplete="off" spellCheck="false" />
            <button className="pg-key-toggle" id="key-toggle-btn" title="Show/hide key">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 8C2.5 4.5 5 3 8 3s5.5 1.5 7 5c-1.5 3.5-4 5-7 5s-5.5-1.5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
            </button>
          </div>
          <span className="pg-key-saved" id="key-saved">&check; saved</span>
        </div>

        {/* Prompt Controls */}
        <div className="pg-controls reveal">
          <div className="pg-controls-header">
            <div className="pg-controls-title">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 3h12M2 7h8M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Your Prompt
            </div>
            <button className="pg-sys-toggle" id="sys-toggle-btn">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              System prompt
            </button>
          </div>
          <div className="pg-controls-body">
            <div className="pg-sys-wrap" id="sys-wrap">
              <div className="pg-sys-label">System prompt</div>
              <textarea className="pg-sys-input" id="sys-prompt" placeholder="You are a helpful assistant&hellip;" rows={3}></textarea>
            </div>
            <div className="pg-prompt-label">Message</div>
            <div className="pg-prompt-wrap">
              <textarea className="pg-prompt" id="user-prompt" placeholder="Ask anything — write code, explain a concept, translate text&hellip;" rows={4}></textarea>
            </div>
            <div className="pg-action-row">
              <button className="pg-send-btn" id="send-btn">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 8L2 2l2.5 6L2 14l12-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" opacity="0.85"/></svg>
                Send to both models
              </button>
              <button className="pg-clear-btn" id="clear-btn">Clear</button>
              <span className="pg-shortcut-hint">Enter &mdash; send &middot; Ctrl+Enter &mdash; new line</span>
              <span className="pg-token-count" id="token-count">~0 tokens</span>
            </div>
            <div className="pg-params-row">
              <div className="pg-param-group">
                <div className="pg-param-label">Temperature <span className="pg-param-val" id="temp-val">0.7</span></div>
                <input type="range" className="pg-param-slider" id="temp-slider" min="0" max="2" step="0.05" defaultValue="0.7" />
              </div>
              <div className="pg-param-group">
                <div className="pg-param-label">Max tokens <span className="pg-param-val" id="maxtok-val">2048</span></div>
                <input type="range" className="pg-param-slider" id="maxtok-slider" min="128" max="8192" step="128" defaultValue="2048" />
              </div>
            </div>
            <div className="pg-export-row">
              <button className="pg-export-btn" id="export-btn">Export JSON</button>
              <button className="pg-export-btn" id="diff-toggle-btn">Diff view</button>
            </div>
            <div id="pg-global-error"></div>
          </div>
        </div>

        {/* Side by Side Panels */}
        <div className="pg-layout">
          <div className="pg-panel reveal" id="panel-left">
            <div className="pg-panel-header">
              <span className="pg-panel-label left">Model A</span>
              <div className="pg-panel-select-wrap">
                <label htmlFor="model-left">Select model</label>
                <select id="model-left"></select>
              </div>
              <div className="pg-status-dot" id="status-left" title="Provider status"></div>
              <span className="pg-model-badge" id="badge-left"></span>
            </div>
            <div className="pg-response empty" id="response-left">Select a model above and send a prompt to see the response here</div>
            <div className="pg-response-meta" id="meta-left" style={{ display: 'none' }}>
              <div className="pg-meta-item"><span className="pg-meta-key">Time</span><span className="pg-meta-val" id="time-left">&ndash;</span></div>
              <div className="pg-meta-item"><span className="pg-meta-key ttft">TTFT</span><span className="pg-meta-val ttft" id="ttft-left">&ndash;</span></div>
              <div className="pg-meta-item"><span className="pg-meta-key">Tokens</span><span className="pg-meta-val" id="tokens-left">&ndash;</span></div>
              <div className="pg-meta-item"><span className="pg-meta-key">tok/s</span><span className="pg-meta-val" id="tps-left">&ndash;</span></div>
            </div>
            <div className="pg-tag-row" id="tags-left" style={{ display: 'none' }}>
              <button className="pg-tag-btn" data-side="left" data-tag="hallucination">&#9888; Галлюцинация</button>
              <button className="pg-tag-btn" data-side="left" data-tag="truncated">&#10002; Прерван</button>
              <button className="pg-tag-btn" data-side="left" data-tag="formatting">&#10022; Форматирование</button>
            </div>
          </div>
          <div className="pg-panel reveal" id="panel-right">
            <div className="pg-panel-header">
              <span className="pg-panel-label right">Model B</span>
              <div className="pg-panel-select-wrap">
                <label htmlFor="model-right">Select model</label>
                <select id="model-right"></select>
              </div>
              <div className="pg-status-dot" id="status-right" title="Provider status"></div>
              <span className="pg-model-badge" id="badge-right"></span>
            </div>
            <div className="pg-response empty" id="response-right">Select a model above and send a prompt to see the response here</div>
            <div className="pg-response-meta" id="meta-right" style={{ display: 'none' }}>
              <div className="pg-meta-item"><span className="pg-meta-key">Time</span><span className="pg-meta-val" id="time-right">&ndash;</span></div>
              <div className="pg-meta-item"><span className="pg-meta-key ttft">TTFT</span><span className="pg-meta-val ttft" id="ttft-right">&ndash;</span></div>
              <div className="pg-meta-item"><span className="pg-meta-key">Tokens</span><span className="pg-meta-val" id="tokens-right">&ndash;</span></div>
              <div className="pg-meta-item"><span className="pg-meta-key">tok/s</span><span className="pg-meta-val" id="tps-right">&ndash;</span></div>
            </div>
            <div className="pg-tag-row" id="tags-right" style={{ display: 'none' }}>
              <button className="pg-tag-btn" data-side="right" data-tag="hallucination">&#9888; Галлюцинация</button>
              <button className="pg-tag-btn" data-side="right" data-tag="truncated">&#10002; Прерван</button>
              <button className="pg-tag-btn" data-side="right" data-tag="formatting">&#10022; Форматирование</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-links">
          <a href="https://skillichse.github.io/Klyxe/" target="_blank" rel="noopener" className="footer-link">GitHub</a>
          <a href="/about" className="footer-link">About</a>
          <a href="/news" className="footer-link">News</a>
        </div>
        <div className="footer-copy">Open source &middot; Updated daily via GitHub Actions &middot; All models are free to use</div>
      </footer>

      <style>{`
        .pg-key-banner { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; margin-bottom: 14px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .pg-key-banner-icon { width: 32px; height: 32px; border-radius: 8px; background: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; opacity: 0.9; }
        .pg-key-banner-text { flex: 1; min-width: 160px; }
        .pg-key-banner-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
        .pg-key-banner-sub { font-size: 12px; color: var(--text-secondary); line-height: 1.4; }
        .pg-key-banner-sub a { color: var(--accent); text-decoration: none; }
        .pg-key-banner-sub a:hover { text-decoration: underline; }
        .pg-key-input-wrap { position: relative; display: flex; align-items: center; }
        .pg-key-input { background: var(--bg); border: 2px solid var(--border); border-radius: 8px; color: var(--text-primary); font-size: 13px; font-family: var(--font-mono); padding: 8px 36px 8px 12px; width: 220px; outline: none; transition: border-color 0.15s; }
        .pg-key-input::placeholder { color: var(--text-tertiary); }
        .pg-key-input:focus { border-color: #f87171; }
        .pg-key-input.has-key:focus { border-color: #4ade80; }
        .pg-key-toggle { position: absolute; right: 10px; background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: 0; display: flex; align-items: center; }
        .pg-key-toggle:hover { color: var(--text-secondary); }
        .pg-key-saved { font-size: 12px; color: #4ade80; font-family: var(--font-mono); font-weight: 600; opacity: 0; transition: opacity 0.3s; white-space: nowrap; }
        .pg-key-saved.show { opacity: 1; }
        .pg-controls { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 14px; }
        .pg-controls-header { padding: 12px 18px; border-bottom: 1px solid var(--border-subtle); background: var(--surface-raised); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .pg-controls-title { font-size: 13px; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 8px; }
        .pg-controls-title svg { color: var(--accent); }
        .pg-controls-body { padding: 16px 18px; }
        .pg-sys-toggle { background: var(--bg); border: 1px solid var(--border); border-radius: 6px; color: var(--text-secondary); font-size: 12px; font-family: var(--font-sans); font-weight: 500; cursor: pointer; padding: 5px 10px; transition: border-color 0.15s, color 0.15s; display: flex; align-items: center; gap: 5px; }
        .pg-sys-toggle:hover { border-color: var(--border-strong); color: var(--text-primary); }
        .pg-sys-wrap { display: none; margin-bottom: 12px; }
        .pg-sys-wrap.open { display: block; }
        .pg-sys-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-tertiary); margin-bottom: 6px; }
        .pg-sys-input { width: 100%; box-sizing: border-box; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; color: var(--text-primary); font-size: 13px; font-family: var(--font-mono); padding: 10px 12px; resize: vertical; min-height: 64px; outline: none; line-height: 1.5; transition: border-color 0.15s; }
        .pg-sys-input:focus { border-color: var(--accent); }
        .pg-prompt-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-tertiary); margin-bottom: 6px; }
        .pg-prompt-wrap { position: relative; margin-bottom: 14px; }
        .pg-prompt { width: 100%; box-sizing: border-box; background: var(--bg); border: 2px solid var(--border); border-radius: 10px; color: var(--text-primary); font-size: 14px; font-family: var(--font-sans); padding: 12px 14px; resize: vertical; min-height: 100px; outline: none; transition: border-color 0.15s; line-height: 1.55; }
        .pg-prompt:focus { border-color: var(--accent); }
        .pg-action-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .pg-send-btn { background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 10px 24px; font-size: 14px; font-weight: 600; font-family: var(--font-sans); cursor: pointer; transition: opacity 0.15s, transform 0.1s; display: flex; align-items: center; gap: 8px; }
        .pg-send-btn:hover { opacity: 0.88; }
        .pg-send-btn:active { transform: scale(0.97); }
        .pg-send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .pg-clear-btn { background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--text-secondary); padding: 10px 16px; font-size: 13px; font-family: var(--font-sans); cursor: pointer; transition: border-color 0.15s, color 0.15s; }
        .pg-clear-btn:hover { border-color: var(--border-strong); color: var(--text-primary); }
        .pg-shortcut-hint { font-size: 11px; color: var(--text-tertiary); font-family: var(--font-mono); margin-left: 2px; }
        .pg-token-count { font-size: 12px; font-family: var(--font-mono); color: var(--text-tertiary); margin-left: auto; background: var(--bg); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 4px 9px; }
        .pg-params-row { display: flex; gap: 18px; margin-top: 12px; flex-wrap: wrap; align-items: flex-end; }
        .pg-param-group { display: flex; flex-direction: column; gap: 5px; min-width: 140px; }
        .pg-param-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-tertiary); display: flex; justify-content: space-between; align-items: center; }
        .pg-param-val { font-family: var(--font-mono); color: var(--accent); font-size: 11px; }
        .pg-param-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 4px; background: var(--border); border-radius: 2px; outline: none; cursor: pointer; }
        .pg-param-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: var(--accent); border-radius: 50%; cursor: pointer; }
        .pg-export-row { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
        .pg-export-btn { background: transparent; border: 1px solid var(--border); border-radius: 6px; color: var(--text-secondary); font-size: 12px; font-family: var(--font-sans); padding: 6px 13px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
        .pg-export-btn:hover { border-color: var(--accent); color: var(--accent); }
        .pg-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
        @media (max-width: 768px) { .pg-layout { grid-template-columns: 1fr; } }
        .pg-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
        .pg-panel-header { padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; gap: 10px; background: var(--surface-raised); }
        .pg-panel-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 3px 7px; border-radius: 4px; flex-shrink: 0; }
        .pg-panel-label.left { background: rgba(99,102,241,0.15); color: #818cf8; }
        .pg-panel-label.right { background: rgba(16,185,129,0.15); color: #34d399; }
        .pg-panel-select-wrap { flex: 1; min-width: 0; }
        .pg-panel-select-wrap label { display: block; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-tertiary); margin-bottom: 3px; }
        .pg-panel-header select { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); padding: 6px 10px; font-size: 13px; font-weight: 500; font-family: var(--font-sans); cursor: pointer; outline: none; transition: border-color 0.15s; }
        .pg-panel-header select:focus { border-color: var(--accent); }
        .pg-model-badge { font-size: 10px; font-family: var(--font-mono); color: var(--text-tertiary); background: var(--bg); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 2px 6px; white-space: nowrap; flex-shrink: 0; }
        .pg-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: #6b7280; }
        .pg-status-dot.ok { background: #4ade80; box-shadow: 0 0 5px rgba(74,222,128,0.5); }
        .pg-status-dot.slow { background: #f59e0b; box-shadow: 0 0 5px rgba(245,158,11,0.4); }
        .pg-status-dot.err { background: #f87171; box-shadow: 0 0 5px rgba(248,113,113,0.5); }
        .pg-response { flex: 1; padding: 16px; min-height: 300px; max-height: 520px; overflow-y: auto; font-size: 14px; line-height: 1.7; color: var(--text-primary); white-space: pre-wrap; word-break: break-word; }
        .pg-response.empty { color: var(--text-tertiary); font-style: italic; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 13px; }
        .pg-response-meta { padding: 8px 16px; border-top: 1px solid var(--border-subtle); display: flex; gap: 0; background: var(--surface-raised); }
        .pg-meta-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 4px 0; }
        .pg-meta-item+.pg-meta-item { border-left: 1px solid var(--border-subtle); }
        .pg-meta-key { font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-tertiary); font-family: var(--font-mono); margin-bottom: 1px; }
        .pg-meta-val { font-size: 14px; font-weight: 600; color: var(--text-primary); font-family: var(--font-mono); }
        .pg-meta-key.ttft { color: #f59e0b; }
        .pg-meta-val.ttft { color: #f59e0b; }
        .pg-tag-row { display: flex; gap: 6px; padding: 6px 16px 8px; flex-wrap: wrap; border-top: 1px solid var(--border-subtle); background: var(--surface-raised); }
        .pg-tag-btn { background: transparent; border: 1px solid var(--border); border-radius: 5px; color: var(--text-tertiary); font-size: 11px; font-family: var(--font-mono); padding: 3px 8px; cursor: pointer; transition: all 0.15s; }
        .pg-tag-btn:hover { border-color: #f87171; color: #f87171; }
        .pg-tag-btn.active { background: rgba(248,113,113,0.12); border-color: #f87171; color: #f87171; }
        .pg-response.rendered { white-space: normal; }
        .pg-response.rendered p { margin: 0 0 0.8em; }
        .pg-response.rendered p:last-child { margin-bottom: 0; }
        .pg-response.rendered h1,.pg-response.rendered h2,.pg-response.rendered h3 { font-weight: 700; margin: 1em 0 0.4em; line-height: 1.3; }
        .pg-response.rendered h1 { font-size: 1.2em; }
        .pg-response.rendered h2 { font-size: 1.1em; }
        .pg-response.rendered h3 { font-size: 1em; }
        .pg-response.rendered ul,.pg-response.rendered ol { padding-left: 1.5em; margin: 0.5em 0; }
        .pg-response.rendered li { margin-bottom: 0.25em; }
        .pg-response.rendered pre { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; overflow-x: auto; margin: 0.8em 0; position: relative; }
        .pg-response.rendered pre code { font-family: var(--font-mono); font-size: 13px; line-height: 1.55; background: none; padding: 0; color: var(--text-primary); }
        .pg-response.rendered code { font-family: var(--font-mono); font-size: 0.9em; background: var(--bg); border: 1px solid var(--border-subtle); border-radius: 4px; padding: 1px 5px; }
        .pg-response.rendered pre code { border: none; }
        .pg-error { color: #f87171; font-size: 13px; padding: 10px 14px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 8px; margin-top: 10px; display: flex; align-items: center; gap: 8px; }
        .stream-cursor { display: inline-block; width: 2px; height: 1em; background: var(--accent); border-radius: 1px; vertical-align: text-bottom; animation: blink 0.9s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .pg-spinner { width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pg-diff-add { background: rgba(74,222,128,0.13); border-radius: 2px; }
        .pg-diff-del { background: rgba(248,113,113,0.13); border-radius: 2px; text-decoration: line-through; }
      `}</style>

      <Script id="playground-logic" strategy="afterInteractive">{`
var MODELS=[
  {id:'nvidia/nemotron-3-super-120b-a12b:free',label:'Nemotron 3 Super 120B',provider:'Nvidia',size:'120B'},
  {id:'nvidia/nemotron-3-nano-30b-a3b:free',label:'Nemotron 3 Nano 30B',provider:'Nvidia',size:'30B'},
  {id:'nvidia/nemotron-nano-9b-v2:free',label:'Nemotron Nano 9B',provider:'Nvidia',size:'9B'},
  {id:'openai/gpt-oss-120b:free',label:'GPT OSS 120B',provider:'OpenAI',size:'120B'},
  {id:'openai/gpt-oss-20b:free',label:'GPT OSS 20B',provider:'OpenAI',size:'20B'},
  {id:'google/gemma-4-31b-it:free',label:'Gemma 4 31B',provider:'Google',size:'31B'},
  {id:'google/gemma-4-26b-a4b-it:free',label:'Gemma 4 26B MoE',provider:'Google',size:'26B'},
  {id:'google/gemini-2.0-flash-exp:free',label:'Gemini 2.0 Flash',provider:'Google',size:''},
  {id:'meta-llama/llama-3.3-70b-instruct:free',label:'Llama 3.3 70B',provider:'Meta',size:'70B'},
  {id:'qwen/qwen3-coder:free',label:'Qwen3 Coder 480B',provider:'Alibaba',size:'480B'},
  {id:'qwen/qwen3-next-80b-a3b-instruct:free',label:'Qwen3 Next 80B',provider:'Alibaba',size:'80B'},
  {id:'qwen/qwen-2.5-72b-instruct:free',label:'Qwen 2.5 72B',provider:'Alibaba',size:'72B'},
  {id:'arcee-ai/trinity-large-preview:free',label:'Trinity Large 400B',provider:'Arcee',size:'400B'},
  {id:'z-ai/glm-4.5-air:free',label:'GLM 4.5 Air',provider:'Z.ai',size:''},
  {id:'minimax/minimax-m2.5:free',label:'MiniMax M2.5',provider:'MiniMax',size:''},
  {id:'deepseek/deepseek-r1:free',label:'DeepSeek R1',provider:'DeepSeek',size:'671B'},
  {id:'deepseek/deepseek-chat-v3-0324:free',label:'DeepSeek V3',provider:'DeepSeek',size:''},
];
var MODELS_FALLBACK=MODELS.slice();
var sessionLog=[];
var abortLeft=null,abortRight=null;
var diffActive=false;

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function saveKey(val){
  localStorage.setItem('or_api_key',val.trim());
  var el=document.getElementById('key-saved');el.classList.add('show');setTimeout(function(){el.classList.remove('show');},1800);
  var inp=document.getElementById('api-key');inp.classList.toggle('has-key',val.trim().length>0);
}
function toggleKeyVisibility(){var inp=document.getElementById('api-key');inp.type=inp.type==='password'?'text':'password';}
function loadKey(){var k=sessionStorage.getItem('or_api_key')||localStorage.getItem('or_api_key')||'';var inp=document.getElementById('api-key');if(inp&&k)inp.value=k;}
function updateTokenCount(text){var est=Math.round(text.split(/\\s+/).filter(Boolean).length*1.3);var el=document.getElementById('token-count');if(el)el.textContent='~'+est+' tokens';}
function toggleSysPrompt(){var wrap=document.getElementById('sys-wrap');var btn=document.getElementById('sys-toggle-btn');var open=wrap.classList.toggle('open');btn.innerHTML=open?'<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg> System prompt':'<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg> System prompt';}
function clearAll(){
  if(abortLeft){abortLeft.abort();abortLeft=null;}if(abortRight){abortRight.abort();abortRight=null;}
  ['left','right'].forEach(function(side){
    var r=document.getElementById('response-'+side);r.innerHTML='';r.textContent='Choose a model and send a prompt';r.classList.add('empty');r.classList.remove('rendered');
    document.getElementById('meta-'+side).style.display='none';document.getElementById('tags-'+side).style.display='none';
  });
  document.getElementById('pg-global-error').innerHTML='';document.getElementById('user-prompt').value='';document.getElementById('token-count').textContent='~0 tokens';
  setSendState(false);diffActive=false;var db=document.getElementById('diff-toggle-btn');if(db)db.classList.remove('active');
}
function setSendState(loading){var btn=document.getElementById('send-btn');btn.disabled=loading;btn.innerHTML=loading?'<div class="pg-spinner"></div> Sending…':'<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M14 8L2 2l2.5 6L2 14l12-6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="currentColor" opacity="0.85"/></svg> Send to both models';}
function populateSelects(){
  var opts=MODELS.map(function(m){return '<option value="'+m.id+'">'+m.label+(m.size?' · '+m.size:'')+' ('+m.provider+')</option>';}).join('');
  document.getElementById('model-left').innerHTML=opts;document.getElementById('model-right').innerHTML=opts;
}
function updateBadge(side){var sel=document.getElementById('model-'+side);var m=MODELS.find(function(x){return x.id===sel.value;});var badge=document.getElementById('badge-'+side);if(m)badge.textContent=m.provider;}
function updateStatusDot(side,state){var dot=document.getElementById('status-'+side);if(!dot)return;dot.className='pg-status-dot'+(state?' '+state:'');}
function onModelChange(side){updateBadge(side);updateStatusDot(side,null);}
async function fetchFreeModels(){try{var res=await fetch('https://openrouter.ai/api/v1/models');if(!res.ok)return;var data=await res.json();var free=(data.data||[]).filter(function(m){return m.id.endsWith(':free')&&m.context_length>0;}).map(function(m){var parts=m.id.split('/');var pslug=parts[0]||'';var pmap={'meta-llama':'Meta','google':'Google','mistralai':'Mistral','qwen':'Alibaba','deepseek':'DeepSeek','microsoft':'Microsoft','nvidia':'Nvidia','anthropic':'Anthropic','openai':'OpenAI','nousresearch':'Nous','cohere':'Cohere','01-ai':'01.AI','huggingfaceh4':'HuggingFace','openchat':'OpenChat'};var provider=pmap[pslug]||pslug;var label=m.name||parts[1]||m.id;return{id:m.id,label:label,provider:provider,size:''};}).sort(function(a,b){return a.label.localeCompare(b.label);});if(free.length>0){MODELS=free;populateSelects();['left','right'].forEach(function(side){var sel=document.getElementById('model-'+side);if(!sel)return;var preferred=side==='left'?'meta-llama/llama-3.3-70b-instruct:free':'google/gemma-4-31b-it:free';var match=MODELS.find(function(m){return m.id===preferred;})||MODELS[side==='left'?0:Math.min(4,MODELS.length-1)];if(match)sel.value=match.id;updateBadge(side);});}}catch(e){console.warn('Could not fetch OpenRouter model list, using fallback.',e);}}
async function sendPrompt(){
  var apiKey=document.getElementById('api-key').value.trim();var prompt=document.getElementById('user-prompt').value.trim();var sysPrompt=document.getElementById('sys-prompt').value.trim();var errorEl=document.getElementById('pg-global-error');errorEl.innerHTML='';
  if(!apiKey){errorEl.innerHTML='<div class="pg-error">Enter your OpenRouter API key →</div>';document.getElementById('api-key').focus();return;}
  if(!prompt){errorEl.innerHTML='<div class="pg-error">Type a prompt first.</div>';document.getElementById('user-prompt').focus();return;}
  if(abortLeft){abortLeft.abort();abortLeft=null;}if(abortRight){abortRight.abort();abortRight=null;}
  var modelLeft=document.getElementById('model-left').value;var modelRight=document.getElementById('model-right').value;
  setSendState(true);
  ['left','right'].forEach(function(side){var r=document.getElementById('response-'+side);r.innerHTML='';r.classList.remove('empty','rendered');document.getElementById('meta-'+side).style.display='none';document.getElementById('tags-'+side).style.display='none';updateStatusDot(side,null);});
  abortLeft=new AbortController();abortRight=new AbortController();var messages=[];if(sysPrompt)messages.push({role:'system',content:sysPrompt});messages.push({role:'user',content:prompt});
  var temperature=parseFloat(document.getElementById('temp-slider').value);var maxTokens=parseInt(document.getElementById('maxtok-slider').value);
  await Promise.allSettled([streamResponse('left',modelLeft,messages,apiKey,abortLeft.signal,temperature,maxTokens),streamResponse('right',modelRight,messages,apiKey,abortRight.signal,temperature,maxTokens)]);
  abortLeft=null;abortRight=null;setSendState(false);
}
async function streamResponse(side,modelId,messages,apiKey,signal,temperature,maxTokens){
  var respEl=document.getElementById('response-'+side);var metaEl=document.getElementById('meta-'+side);var cursor=document.createElement('span');cursor.className='stream-cursor';
  var t0=performance.now();var completionTokens=0;var text='';var lastDomUpdate=0;var ttft=null;var firstChunk=true;
  try{
    var res=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+apiKey,'HTTP-Referer':window.location.origin,'X-Title':'Klyxe Playground'},body:JSON.stringify({model:modelId,messages:messages,stream:true,stream_options:{include_usage:true},max_tokens:maxTokens,temperature:temperature}),signal:signal});
    if(!res.ok){var errMsg='HTTP '+res.status;try{var errData=await res.json();errMsg=errData?.error?.message||errMsg;}catch(e){}if(res.status===429)errMsg='429 Too Many Requests — подожди немного и попробуй снова.';updateStatusDot(side,'err');throw new Error(errMsg);}
    respEl.textContent='';respEl.appendChild(cursor);var reader=res.body.getReader();var decoder=new TextDecoder();var buf='';
    while(true){var result=await reader.read();if(result.done)break;buf+=decoder.decode(result.value,{stream:true});var lines=buf.split('\\n');buf=lines.pop();for(var li=0;li<lines.length;li++){var trimmed=lines[li].trim();if(!trimmed.startsWith('data:'))continue;var raw=trimmed.slice(5).trim();if(raw==='[DONE]')continue;try{var chunk=JSON.parse(raw);if(chunk.usage&&chunk.usage.completion_tokens)completionTokens=chunk.usage.completion_tokens;var delta=chunk.choices?.[0]?.delta?.content;if(delta){if(firstChunk){ttft=performance.now()-t0;firstChunk=false;updateStatusDot(side,ttft<800?'ok':ttft<3000?'slow':'err');}text+=delta;var now=performance.now();if(now-lastDomUpdate>16){respEl.textContent=text;respEl.appendChild(cursor);lastDomUpdate=now;}}}catch(e){}}}
    cursor.remove();renderMarkdown(side,text);
  }catch(err){cursor.remove();if(err.name==='AbortError'){renderMarkdown(side,text?text+'\\n\\n*[Stopped]*':'*[Stopped]*');}else{respEl.classList.remove('rendered');respEl.textContent='[Error] '+err.message;respEl.classList.add('empty');}showStats(side,t0,completionTokens,text,ttft);return;}
  if(!text){respEl.textContent='[No response]';respEl.classList.add('empty');}
  showStats(side,t0,completionTokens,text,ttft);sessionLog.push({timestamp:new Date().toISOString(),side:side,model:modelId,prompt:document.getElementById('user-prompt').value.trim(),response:text,ttft_ms:ttft?Math.round(ttft):null,tags:[]});
}
function renderMarkdown(side,text){var respEl=document.getElementById('response-'+side);if(!text)return;if(window.marked){respEl.classList.add('rendered');respEl.innerHTML=window.DOMPurify?DOMPurify.sanitize(marked.parse(text)):marked.parse(text);respEl.querySelectorAll('pre').forEach(function(pre){var btn=document.createElement('button');btn.className='pg-code-copy';btn.textContent='copy';btn.onclick=function(){navigator.clipboard.writeText(pre.querySelector('code')?.textContent||'');btn.textContent='✓';setTimeout(function(){btn.textContent='copy';},1500);};pre.style.position='relative';pre.appendChild(btn);});if(window.hljs){respEl.querySelectorAll('pre code').forEach(function(block){hljs.highlightElement(block);});}}else{respEl.textContent=text;}}
function showStats(side,t0,completionTokens,text,ttft){var elapsed=(performance.now()-t0)/1000;var tokens=completionTokens>0?completionTokens:Math.round(text.split(/\\s+/).filter(Boolean).length*1.3);var tps=tokens>0&&elapsed>0?(tokens/elapsed).toFixed(1):'–';document.getElementById('time-'+side).textContent=elapsed.toFixed(2)+'s';document.getElementById('tokens-'+side).textContent=tokens;document.getElementById('tps-'+side).textContent=tps;document.getElementById('ttft-'+side).textContent=ttft?(ttft/1000).toFixed(2)+'s':'–';document.getElementById('meta-'+side).style.display='flex';document.getElementById('tags-'+side).style.display='flex';}
function toggleTag(side,tag){var btns=document.querySelectorAll('#tags-'+side+' .pg-tag-btn');var tagMap={hallucination:0,truncated:1,formatting:2};var btn=btns[tagMap[tag]];if(!btn)return;btn.classList.toggle('active');}
function toggleDiff(){diffActive=!diffActive;var btn=document.getElementById('diff-toggle-btn');btn.classList.toggle('active',diffActive);if(diffActive)applyDiff();else{var le=[...sessionLog].reverse().find(function(e){return e.side==='left';});var re=[...sessionLog].reverse().find(function(e){return e.side==='right';});if(le)renderMarkdown('left',le.response);if(re)renderMarkdown('right',re.response);}}
function applyDiff(){var l=document.getElementById('response-left');var r=document.getElementById('response-right');var lt=l.innerText||l.textContent;var rt=r.innerText||r.textContent;var lw=lt.split(/\\s+/);var rw=rt.split(/\\s+/);var lcs=buildLCS(lw,rw);l.innerHTML=diffHighlight(lw,lcs,'left');r.innerHTML=diffHighlight(rw,lcs,'right');l.classList.add('rendered');r.classList.add('rendered');}
function buildLCS(a,b){var m=Math.min(a.length,200),n=Math.min(b.length,200);var dp=Array.from({length:m+1},function(){return new Uint16Array(n+1);});for(var i=1;i<=m;i++)for(var j=1;j<=n;j++)dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);var lcs=[];var i=m,j=n;while(i>0&&j>0){if(a[i-1]===b[j-1]){lcs.unshift(a[i-1]);i--;j--;}else if(dp[i-1][j]>dp[i][j-1])i--;else j--;}return new Set(lcs);}
function diffHighlight(words,lcs,side){return words.map(function(w){var e=w.replace(/</g,'&lt;').replace(/>/g,'&gt;');if(lcs.has(w))return e;var cls=side==='left'?'pg-diff-del':'pg-diff-add';return '<mark class="'+cls+'">'+e+'</mark>';}).join(' ');}
function exportJSON(){if(!sessionLog.length){alert('No data to export yet. Send a prompt first.');return;}var blob=new Blob([JSON.stringify(sessionLog,null,2)],{type:'application/json'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='klyxe-playground-'+Date.now()+'.json';a.click();URL.revokeObjectURL(url);}
function init(){
  populateSelects();loadKey();
  document.getElementById('model-left').value=MODELS[0].id;document.getElementById('model-right').value=MODELS[5].id;
  updateBadge('left');updateBadge('right');fetchFreeModels();
  var promptEl=document.getElementById('user-prompt');
  promptEl.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey){e.preventDefault();var btn=document.getElementById('send-btn');if(!btn.disabled)sendPrompt();}if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();var start=this.selectionStart;var end=this.selectionEnd;this.value=this.value.slice(0,start)+'\\n'+this.value.slice(end);this.selectionStart=this.selectionEnd=start+1;updateTokenCount(this.value);}});
  document.getElementById('api-key').addEventListener('input',function(){saveKey(this.value);});
  document.getElementById('key-toggle-btn').addEventListener('click',toggleKeyVisibility);
  document.getElementById('sys-toggle-btn').addEventListener('click',toggleSysPrompt);
  document.getElementById('user-prompt').addEventListener('input',function(){updateTokenCount(this.value);});
  document.getElementById('send-btn').addEventListener('click',sendPrompt);
  document.getElementById('clear-btn').addEventListener('click',clearAll);
  document.getElementById('export-btn').addEventListener('click',exportJSON);
  document.getElementById('diff-toggle-btn').addEventListener('click',toggleDiff);
  document.getElementById('model-left').addEventListener('change',function(){onModelChange('left');});
  document.getElementById('model-right').addEventListener('change',function(){onModelChange('right');});
  document.getElementById('temp-slider').addEventListener('input',function(){document.getElementById('temp-val').textContent=parseFloat(this.value).toFixed(2);});
  document.getElementById('maxtok-slider').addEventListener('input',function(){document.getElementById('maxtok-val').textContent=parseInt(this.value);});
  ['left','right'].forEach(function(side){document.querySelectorAll('#tags-'+side+' .pg-tag-btn').forEach(function(btn){btn.addEventListener('click',function(){toggleTag(side,this.dataset.tag);});});});
}
init();
      `}</Script>
    </>
  );
}
