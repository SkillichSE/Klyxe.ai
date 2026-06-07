// lab-write.js - fixed write button with auth integration
// bottom right fixed button that opens article editor

(function() {
  'use strict';

  const labwrite = {
    button: null,
    modal: null,
    overlay: null,

    init() {
      this.createButton();
      this.createModal();
      this.addEventListeners();
    },

    createButton() {
      if (document.getElementById('lab-write-btn')) return;

      const btn = document.createElement('button');
      btn.id = 'lab-write-btn';
      btn.className = 'lab-write-btn';
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="m12.2 2.5l1.3 1.3m-9.5 9.5l-2 2 2.8-.7 8.5-8.5-2.8-2.8-8.5 8.5-.7 2.8z" 
                stroke="currentcolor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>write</span>
      `;
      btn.setAttribute('aria-label', 'write article');

      document.body.appendChild(btn);
      this.button = btn;
    },

    createModal() {
      if (document.getElementById('lab-editor-modal')) return;

      const overlay = document.createElement('div');
      overlay.id = 'lab-editor-overlay';
      overlay.className = 'lab-editor-overlay';

      const modal = document.createElement('div');
      modal.id = 'lab-editor-modal';
      modal.className = 'lab-editor-modal';
      modal.innerHTML = `
        <div class="lab-editor-header">
          <h3 class="lab-editor-title">new article</h3>
          <button class="lab-editor-close" aria-label="close editor">&times;</button>
        </div>
        <div class="lab-editor-body">
          <div class="lab-editor-left">
            <div class="lab-editor-toolbar" id="lab-editor-toolbar"></div>
            <textarea class="lab-editor-textarea" id="lab-editor-textarea" 
                      placeholder="write your article in markdown..."></textarea>
          </div>
          <div class="lab-editor-right">
            <div class="lab-preview-header">preview</div>
            <div class="lab-preview-content" id="lab-preview-content"></div>
          </div>
        </div>
        <div class="lab-editor-footer">
          <button class="lab-btn lab-btn-secondary" id="lab-editor-cancel">cancel</button>
          <button class="lab-btn" id="lab-editor-save">save article</button>
        </div>
      `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      this.overlay = overlay;
      this.modal = modal;

      // initialize toolbar
      this.createToolbar();
    },

    createToolbar() {
      const toolbar = document.getElementById('lab-editor-toolbar');
      if (!toolbar) return;

      const tools = [
        { icon: 'b', label: 'bold', action: 'bold', shortcut: 'ctrl+b' },
        { icon: 'i', label: 'italic', action: 'italic', shortcut: 'ctrl+i' },
        { icon: 'h1', label: 'heading 1', action: 'h1', shortcut: '' },
        { icon: 'h2', label: 'heading 2', action: 'h2', shortcut: '' },
        { icon: '"', label: 'quote', action: 'quote', shortcut: '' },
        { icon: '-', label: 'list', action: 'list', shortcut: '' },
        { icon: '1.', label: 'numbered list', action: 'orderedlist', shortcut: '' },
        { icon: '```', label: 'code', action: 'code', shortcut: '' },
        { icon: 'link', label: 'link', action: 'link', shortcut: '' },
        { icon: 'img', label: 'image', action: 'image', shortcut: '' }
      ];

      toolbar.innerHTML = tools.map(tool => `
        <button class="lab-toolbar-btn" data-action="${tool.action}" 
                title="${tool.label}${tool.shortcut ? ' (' + tool.shortcut + ')' : ''}">
          <span>${tool.icon}</span>
        </button>
      `).join('');
    },

    addEventListeners() {
      // write button click
      if (this.button) {
        this.button.addEventListener('click', () => this.handleWriteClick());
      }

      // close button
      const closebtn = this.modal?.querySelector('.lab-editor-close');
      if (closebtn) {
        closebtn.addEventListener('click', () => this.closeModal());
      }

      // cancel button
      const cancelbtn = document.getElementById('lab-editor-cancel');
      if (cancelbtn) {
        cancelbtn.addEventListener('click', () => this.closeModal());
      }

      // overlay click
      if (this.overlay) {
        this.overlay.addEventListener('click', (e) => {
          if (e.target === this.overlay) this.closeModal();
        });
      }

      // toolbar buttons
      const toolbar = document.getElementById('lab-editor-toolbar');
      if (toolbar) {
        toolbar.addEventListener('click', (e) => {
          const btn = e.target.closest('.lab-toolbar-btn');
          if (btn) {
            e.preventDefault();
            const action = btn.dataset.action;
            if (action && window.labeleditor) {
              window.labeleditor.applyFormat(action);
            }
          }
        });
      }

      // keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.closeModal();
        }
      });
    },

    handleWriteClick() {
      // check if user is logged in
      if (!window.labauth || !window.labauth.isLoggedIn()) {
        this.showSignInToast();
        return;
      }

      // navigate to standalone editor page
      window.location.href = '/lab-write.html';
    },

    showSignInToast() {
      if (window.labtoast) {
        const toast = window.labtoast.warning('please sign in to write articles', 4000);

        // add sign in button to toast
        setTimeout(() => {
          const toastel = document.querySelector('.lab-toast-warning');
          if (toastel && !toastel.querySelector('.lab-toast-action')) {
            const actionbtn = document.createElement('button');
            actionbtn.className = 'lab-toast-action';
            actionbtn.textContent = 'sign in';
            actionbtn.addEventListener('click', () => {
              window.labauth.redirectToAuth();
            });

            const msgspan = toastel.querySelector('.lab-toast-message');
            if (msgspan) {
              msgspan.appendChild(actionbtn);
            }
          }
        }, 50);
      }
    },

    openModal() {
      if (!this.overlay || !this.modal) return;

      this.overlay.classList.add('lab-editor-open');
      document.body.classList.add('lab-editor-body-lock');

      // focus textarea
      const textarea = document.getElementById('lab-editor-textarea');
      if (textarea) {
        setTimeout(() => textarea.focus(), 100);
      }

      // initialize editor if needed
      if (window.labeleditor && !window.labeleditor.initialized) {
        window.labeleditor.init();
      }
    },

    closeModal() {
      if (!this.overlay) return;

      this.overlay.classList.remove('lab-editor-open');
      document.body.classList.remove('lab-editor-body-lock');
    },

    isOpen() {
      return this.overlay?.classList.contains('lab-editor-open');
    }
  };

  window.labwrite = labwrite;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => labwrite.init());
  } else {
    labwrite.init();
  }
})();
