import Script from 'next/script';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat — Klyxe',
  description: 'Chat with AI models using your documents as context. Upload PDFs, code, and text files for RAG-powered conversations.',
  openGraph: {
    title: 'AI Chat with RAG — Klyxe',
    description: 'Upload documents and chat with AI models using retrieval-augmented generation. Supports PDF, DOCX, code files, and more.',
  },
};

export default function ChatPage() {
  return (
    <>
      <Script src="/style-spacing.css" strategy="afterInteractive" />
      <Script src="/style.css" strategy="afterInteractive" />
      <Script src="/animations.css" strategy="afterInteractive" />
      <Script src="/chat.css" strategy="afterInteractive" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/marked/5.1.2/marked.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js" strategy="afterInteractive" />
      <Script src="/sidebar.js" strategy="afterInteractive" />
      <Script src="/chat-engine.js" strategy="afterInteractive" />
      <Script src="/chat-local-db.js" strategy="afterInteractive" />
      <Script src="/chat-ui.js" strategy="afterInteractive" />
      <Script src="/chat-settings.js" strategy="afterInteractive" />
      <Script src="/chat-api.js" strategy="afterInteractive" />
      <Script src="/chat-rag.js" strategy="afterInteractive" />
      <Script src="/chat-sources.js" strategy="afterInteractive" />
      <Script src="/chat-studio.js" strategy="afterInteractive" />
      <Script src="/chat-core.js" strategy="afterInteractive" />
      <Script src="/chat-prompts.js" strategy="afterInteractive" />
      <Script src="/chat-sessions.js" strategy="afterInteractive" />
      <Script src="/chat.js" strategy="afterInteractive" />

      {/* Settings Scrim + Drawer */}
      <div className="settings-scrim" id="settings-scrim"></div>
      <div className="settings-drawer" id="settings-drawer">
        <div className="settings-header">
          <span className="settings-title">Settings</span>
          <button className="settings-close" id="settings-close-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="settings-body">
          <div className="settings-group">
            <div className="settings-group-label">Global Defaults</div>
            <div className="settings-group-subtle">these defaults are used when provider-specific values are not set</div>
            <div className="settings-field">
              <div className="settings-field-label">API Type</div>
              <div className="key-type-tabs">
                <button className="key-type-tab active" id="type-openrouter" data-type="openrouter">OpenRouter</button>
                <button className="key-type-tab" id="type-openai" data-type="openai">OpenAI</button>
                <button className="key-type-tab" id="type-custom" data-type="custom">Custom</button>
              </div>
            </div>
            <div className="settings-field" id="custom-base-url-field" style={{ display: 'none' }}>
              <div className="settings-field-label">Base URL</div>
              <input type="text" className="settings-input" id="custom-base-url" placeholder="https://api.example.com/v1" />
              <div className="settings-field-hint">openai compatible endpoint with /chat/completions</div>
            </div>
            <div className="settings-field">
              <div className="settings-field-label">API Key</div>
              <div className="key-input-row">
                <input type="password" className="settings-input" id="api-key-input" placeholder="sk-&hellip;" autoComplete="off" spellCheck="false" />
                <button className="key-vis-btn" id="key-vis-btn" title="Toggle visibility">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M1 8C2.5 4.5 5 3 8 3s5.5 1.5 7 5c-1.5 3.5-4 5-7 5s-5.5-1.5-7-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3"/></svg>
                </button>
              </div>
              <div className="settings-field-hint" id="key-hint">stored only in your browser</div>
            </div>
            <div className="settings-field" id="model-fetch-field">
              <button className="settings-btn primary" id="refresh-models-btn">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13 8A5 5 0 103 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13 5v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Refresh model list
              </button>
            </div>
          </div>
          <div className="settings-group">
            <div className="settings-group-label">Generation Defaults</div>
            <div className="settings-group-subtle">applies to the active model request</div>
            <div className="settings-field">
              <div className="settings-field-label">Temperature</div>
              <div className="settings-slider-row">
                <input type="range" className="settings-slider" id="temp-slider" min="0" max="2" step="0.05" defaultValue="0.7" />
                <span className="settings-slider-val" id="temp-display">0.70</span>
              </div>
            </div>
            <div className="settings-field">
              <div className="settings-field-label">Max tokens</div>
              <div className="settings-slider-row">
                <input type="range" className="settings-slider" id="maxtok-slider" min="128" max="8192" step="128" defaultValue="2048" />
                <span className="settings-slider-val" id="maxtok-display">2048</span>
              </div>
            </div>
          </div>
          <div className="settings-group">
            <div className="settings-group-label">Evaluation</div>
            <div className="validation-toggle-row" id="validation-row">
              <div className="pt-left">
                <div className="pt-name">Validation mode</div>
                <div className="pt-hint">Check AI responses with a second model call</div>
              </div>
              <span className="pt-badge" id="validation-badge">OFF</span>
            </div>
          </div>
          <div className="settings-group providers-group">
            <div className="settings-group-label">Providers</div>
            <div className="settings-group-subtle">each provider can have its own url key and default model</div>
            <div className="providers-list" id="providers-list-el" style={{ maxHeight: '200px', overflowY: 'auto', padding: 0 }}></div>
            <button className="add-provider-btn" id="add-provider-btn">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              Add Provider
            </button>
          </div>
          <div className="settings-group">
            <div className="settings-group-label">Session</div>
            <button className="settings-btn" id="export-json-btn">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Export session JSON
            </button>
            <div className="settings-danger-zone">
              <button className="settings-btn danger" id="clear-all-btn">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Clear saved key &amp; settings
              </button>
              <div className="settings-field-hint">destructive action you must type CLEAR</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Prompt Drawer */}
      <div className="sys-modal-scrim" id="sys-drawer">
        <div className="sys-modal">
          <div className="sys-modal-header">
            <span className="sys-modal-title">System Prompt</span>
            <div className="sys-vars-hint">
              <span className="sys-var-chip" data-var="{{sources}}">{`{{sources}}`}</span>
              <span className="sys-var-chip" data-var="{{language}}">{`{{language}}`}</span>
              <span className="sys-var-chip" data-var="{{today}}">{`{{today}}`}</span>
              <span className="sys-var-chip" data-var="{{notebook_name}}">{`{{notebook_name}}`}</span>
            </div>
            <button className="tb-btn" id="prompt-library-btn">Library</button>
            <button className="settings-close" id="sys-drawer-close">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          <textarea className="sys-modal-textarea" id="sys-drawer-text" placeholder="You are a helpful assistant. Answer using {{sources}}. Today is {{today}}."></textarea>
          <div className="sys-modal-footer">
            <span id="sys-drawer-tokens" className="sys-token-count">~0 tokens</span>
            <div style={{ flex: 1 }}></div>
            <button className="tb-btn" id="clear-sys-btn">Reset</button>
            <button className="tb-btn active" id="save-sys-btn">Save</button>
          </div>
        </div>
      </div>

      {/* Prompt Library Modal */}
      <div className="prompt-lib-modal" id="prompt-lib-modal">
        <div className="prompt-lib-box">
          <div className="prompt-lib-header">
            <span className="prompt-lib-title">Prompt Library</span>
            <button className="settings-close" id="prompt-lib-close">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="prompt-lib-list" id="prompt-lib-list"></div>
        </div>
      </div>

      {/* Provider Modal */}
      <div className="prov-modal-scrim" id="prov-modal-scrim">
        <div className="prov-modal">
          <div className="prov-modal-header">
            <span className="prov-modal-title" id="prov-modal-title">Add Provider</span>
            <button className="settings-close" id="prov-modal-close">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="prov-modal-body">
            <input type="hidden" id="prov-edit-id" />
            <div className="prov-field"><label>Provider Name</label><input id="prov-name" placeholder="e.g. OpenRouter, Groq, Local Ollama" /></div>
            <div className="prov-field"><label>Base URL</label><input id="prov-url" placeholder="https://openrouter.ai/api/v1" /></div>
            <div className="prov-field"><label>API Key</label><input id="prov-key" type="password" placeholder="sk-or-&hellip;" /></div>
            <div className="prov-field"><label>Default Model</label><input id="prov-model" placeholder="openai/gpt-4o-mini" /></div>
          </div>
          <div className="prov-modal-footer">
            <button className="prov-cancel-btn" id="prov-cancel-btn">Cancel</button>
            <button className="prov-save-btn" id="prov-save-btn">Save</button>
          </div>
        </div>
      </div>

      {/* File Input */}
      <input type="file" id="file-input" accept=".pdf,.docx,.txt,.md,.csv,.py,.ts,.tsx,.js,.jsx,.json,.yaml,.yml,.xml,.html,.css,.java,.go,.rs,.c,.cpp,.h,.hpp,.sh,.sql,.log" multiple style={{ display: 'none' }} />

      {/* Main Workspace */}
      <div className="sidebar-main workspace" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: 'calc(100vh - 60px)' }}>
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar__left">
            <button className="icon-btn" id="sources-toggle" title="Toggle sources">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="5" height="10" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M10 5h4M10 8h3M10 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.35, flexShrink: 0 }}><path d="M2 3h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3z" stroke="currentColor" strokeWidth="1.4"/><path d="M5 3V1.5M11 3V1.5M2 6h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <span className="notebook-title" id="notebook-title" title="Double-click to rename">Untitled notebook</span>
          </div>
          <div className="topbar__center"></div>
          <div className="topbar__right">
            <button className="key-status-pill" id="key-status-pill" title="API settings">
              <div className="key-dot" id="key-dot"></div>
              <span id="key-pill-label">Configure API</span>
            </button>
          </div>
        </div>

        <div className="workspace-inner">
          {/* Sources Panel */}
          <div className="sources-panel" id="sources-panel">
            <div className="sources-section">
              <div className="section-header">
                <span className="section-label">SOURCES <span className="section-count" id="sources-count">(0)</span></span>
                <button className="add-source-btn" id="add-source-btn">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  Add
                </button>
              </div>
              <div id="docs-list-el" className="docs-list">
                <div className="docs-empty-hint">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3, margin: '0 auto 8px', display: 'block' }}><path d="M4 4h10l4 4v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 4v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  Add your first source to start chatting
                </div>
              </div>
              <div className="upload-drop-zone" id="drop-zone">&uarr; Drop PDF, DOCX, TXT, MD, CSV, PY, TS and other text files here</div>
              <div className="url-fetch-row">
                <input className="url-fetch-input" id="url-fetch-input" placeholder="Paste a URL&hellip;" type="url" />
                <button className="url-fetch-btn" id="url-fetch-btn">Fetch</button>
              </div>
              <div className="ctx-budget-bar"><div className="ctx-budget-fill" id="ctx-budget-fill" style={{ width: '0%' }}></div></div>
              <span className="ctx-budget-label" id="ctx-budget-label">~0k / 16k tokens</span>
            </div>
            <div className="section-divider"></div>
            <div className="sessions-section">
              <div className="section-header">
                <span className="section-label">SESSIONS</span>
                <input className="sessions-search-input" id="chat-search-input" placeholder="search  &lrm;&#8984;K" />
              </div>
              <div className="sessions-list">
                <div id="chat-hist-items"></div>
              </div>
              <button className="new-chat-btn" id="new-chat-btn">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                New Chat
              </button>
            </div>
          </div>

          {/* Chat Main */}
          <div className="chat-main">
            <div className="responses-area" id="responses-area">
              <div className="resp-col" id="resp-col-main" style={{ borderRight: 'none' }}>
                <div id="rag-empty-state" className="empty-state">
                  <div>
                    <div className="empty-state__title">What would you like to explore?</div>
                    <div className="empty-state__hint">Add a source on the left, or try one of these:</div>
                  </div>
                  <div className="suggestion-grid">
                    <button className="suggestion-card" data-suggestion="summarize">
                      <div className="suggestion-card__label">Summarize</div>
                      <div className="suggestion-card__text">What are the main ideas in this document?</div>
                    </button>
                    <button className="suggestion-card" data-suggestion="keyfacts">
                      <div className="suggestion-card__label">Key facts</div>
                      <div className="suggestion-card__text">List the most important facts and figures.</div>
                    </button>
                    <button className="suggestion-card" data-suggestion="clarify">
                      <div className="suggestion-card__label">Clarify</div>
                      <div className="suggestion-card__text">Explain this topic in simple terms with examples.</div>
                    </button>
                    <button className="suggestion-card" data-suggestion="deepdive">
                      <div className="suggestion-card__label">Deep dive</div>
                      <div className="suggestion-card__text">Explain the methodology in detail.</div>
                    </button>
                  </div>
                </div>
                <div className="rag-messages" id="rag-messages" style={{ display: 'none' }}></div>
              </div>
            </div>

            <div className="input-area">
              <div id="input-error" className="input-error hidden">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#f87171" strokeWidth="1.4"/><path d="M8 5v4M8 11v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <div className="input-error-body">
                  <span id="input-error-text"></span>
                  <div id="input-error-meta" className="input-error-meta hidden">
                    <span id="input-error-cooldown-label"></span>
                    <button className="input-error-details-btn" id="input-error-details-btn">Details</button>
                  </div>
                  <div id="input-error-progress" className="input-error-progress hidden"><div id="input-error-progress-fill"></div></div>
                  <div id="input-error-details" className="input-error-details hidden"></div>
                </div>
              </div>

              <div className="rag-status-bar" id="rag-status-bar">
                <div className="rag-mode-switcher">
                  <button className="rag-mode-btn" id="rag-mode-only" data-mode="sources">Sources</button>
                  <button className="rag-mode-btn active" id="rag-mode-hybrid" data-mode="hybrid">Hybrid</button>
                  <button className="rag-mode-btn" id="rag-mode-model" data-mode="model">Model</button>
                </div>
                <span id="rag-token-status">~0 tokens</span>
                <span>&middot;</span>
                <span id="rag-cost-status">$0.0000</span>
                <div className="rag-sources-indicator" id="rag-sources-indicator"></div>
              </div>

              <div className="input-toolbar">
                <button className="tb-btn" id="sys-toggle-btn">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  System
                </button>
                <span className="model-context-hint" title="active model for current response">Model</span>
                <select className="model-select-compact" id="model-select" title="Select the model used for the next response"></select>
                <button className="studio-toggle-btn" id="studio-btn">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M8 1l2 4h4l-3 2.5 1 4L8 9l-4 2.5 1-4L2 5h4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" opacity="0.7"/></svg>
                  Studio
                </button>
                <span className="tb-spacer"></span>
                <span className="validation-badge" id="validation-status" style={{ display: 'none' }}>
                  <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M8 1l2 4h4l-3 2.5 1 4L8 9l-4 2.5 1-4L2 5h4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" opacity="0.6"/></svg>
                  Validation ON
                </span>
                <span className="tb-token-count" id="token-count">~0 tokens</span>
              </div>

              <div className="msg-row">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <textarea className="msg-textarea" id="main-prompt" placeholder="Ask anything about your documents&hellip;" rows={2}></textarea>
                </div>
                <button className="send-btn" id="send-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 8L2 2l2.5 6L2 14l12-6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" opacity="0.85"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="right-panel hidden" id="right-panel">
            <div className="right-panel__header">
              <button className="right-panel__tab active" data-tab="preview">Preview</button>
              <button className="right-panel__tab" data-tab="notes">Notes</button>
              <button className="right-panel__tab" data-tab="studio">Studio</button>
              <button className="right-panel__close" id="right-panel-close">&times;</button>
            </div>
            <div className="right-panel__content">
              <div className="rp-panel active" id="rp-preview" style={{ overflowY: 'auto' }}>
                <div className="docs-empty-hint rp-viewer-empty-hint" id="rp-viewer-empty">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25, margin: '0 auto 8px', display: 'block' }}><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 8h10M7 12h8M7 16h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  Click a citation<br />to view the source
                </div>
                <div id="rp-viewer-content" className="hidden">
                  <div className="rp-viewer-header">
                    <span className="rp-viewer-name" id="viewer-doc-name"></span>
                    <span className="rp-viewer-info" id="viewer-chunk-info"></span>
                  </div>
                  <div className="doc-viewer-content" id="viewer-text"></div>
                </div>
              </div>
              <div className="rp-panel" id="rp-notes">
                <div className="rp-notes-header">
                  <span className="rp-notes-label">Notes</span>
                  <span className="rp-notes-auto">auto-saved</span>
                </div>
                <textarea className="notebook-textarea" id="nb-quick" placeholder="Jot down notes, save quotes from responses&hellip;"></textarea>
              </div>
              <div className="rp-panel" id="rp-studio">
                <div className="studio-content">
                  <div className="studio-cards" id="studio-cards-grid">
                    <div className="studio-card" data-tool="flashcards"><div className="studio-card-icon">&squaref;</div><div className="studio-card-name">Flashcards</div><div className="studio-card-desc">Anki export</div></div>
                    <div className="studio-card" data-tool="quiz"><div className="studio-card-icon">?</div><div className="studio-card-name">Quiz</div><div className="studio-card-desc">MCQ + open</div></div>
                    <div className="studio-card" data-tool="mindmap"><div className="studio-card-icon">&cir;</div><div className="studio-card-name">Mindmap</div><div className="studio-card-desc">Concept map</div></div>
                    <div className="studio-card" data-tool="report"><div className="studio-card-icon">&square;</div><div className="studio-card-name">Report</div><div className="studio-card-desc">Full summary</div></div>
                    <div className="studio-card" data-tool="podcast"><div className="studio-card-icon">&cir;</div><div className="studio-card-name">Podcast</div><div className="studio-card-desc">Dialogue script</div></div>
                    <div className="studio-card" data-tool="faq"><div className="studio-card-icon">i</div><div className="studio-card-name">FAQ</div><div className="studio-card-desc">Q&amp;A list</div></div>
                  </div>
                  <div className="studio-gen-form" id="studio-gen-form" style={{ display: 'none' }}>
                    <div className="studio-form-title">
                      <button className="studio-form-back" id="studio-form-back">&larr;</button>
                      <span className="studio-form-title-text" id="studio-form-title-text">Quiz</span>
                    </div>
                    <div className="studio-field" id="studio-count-field"><label>Count</label><input type="number" id="studio-count" defaultValue={5} min="1" max="30" /></div>
                    <div className="studio-field" id="studio-type-field"><label>Type</label><select id="studio-type"><option value="mcq">Multiple Choice (MCQ)</option><option value="truefalse">True / False</option><option value="open">Open-ended</option></select></div>
                    <div className="studio-field"><label>Focus (optional)</label><input type="text" id="studio-focus" placeholder="e.g. key concepts, methods&hellip;" /></div>
                    <button className="studio-gen-btn" id="studio-gen-btn">Generate</button>
                  </div>
                  <div className="studio-result" id="studio-result" style={{ display: 'none' }}>
                    <div className="studio-result-box" id="studio-result-box"></div>
                    <div className="studio-result-actions">
                      <button className="studio-result-btn" id="studio-copy-btn">Copy</button>
                      <button className="studio-result-btn" id="studio-nb-btn">+ Notebook</button>
                      <button className="studio-result-btn" id="studio-regen-btn">Regen</button>
                    </div>
                  </div>
                  <div className="studio-nb-empty hidden" id="studio-nb-empty">No saved snippets yet.<br />Click <strong>+ Notebook</strong> to save.</div>
                  <div className="studio-nb-list" id="studio-nb-list"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
