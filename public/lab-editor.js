// lab-editor.js - markdown editor component
// handles text input and formatting toolbar actions

(function() {
  'use strict';

  const labeleditor = {
    textarea: null,
    toolbar: null,
    initialized: false,

    init() {
      this.textarea = document.getElementById('lab-editor-textarea');
      this.toolbar = document.getElementById('lab-editor-toolbar');

      if (!this.textarea) return;

      this.addEventListeners();
      this.initialized = true;
    },

    addEventListeners() {
      // input event for live preview
      this.textarea.addEventListener('input', () => {
        this.updatePreview();
      });

      // keyboard shortcuts
      this.textarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
          switch (e.key.toLowerCase()) {
            case 'b':
              e.preventDefault();
              this.applyFormat('bold');
              break;
            case 'i':
              e.preventDefault();
              this.applyFormat('italic');
              break;
          }
        }

        // tab key handling
        if (e.key === 'tab') {
          e.preventDefault();
          this.insertText('  ');
        }
      });
    },

    applyFormat(type) {
      if (!this.textarea) return;

      const start = this.textarea.selectionStart;
      const end = this.textarea.selectionEnd;
      const text = this.textarea.value;
      const selected = text.substring(start, end);

      let replacement = '';
      let cursoroffset = 0;

      switch (type) {
        case 'bold':
          if (selected.startsWith('**') && selected.endsWith('**')) {
            replacement = selected.slice(2, -2);
            cursoroffset = -2;
          } else {
            replacement = `**${selected || 'bold text'}**`;
            cursoroffset = 2;
          }
          break;

        case 'italic':
          if (selected.startsWith('*') && selected.endsWith('*') && !selected.startsWith('**')) {
            replacement = selected.slice(1, -1);
            cursoroffset = -1;
          } else {
            replacement = `*${selected || 'italic text'}*`;
            cursoroffset = 1;
          }
          break;

        case 'h1':
          replacement = `# ${selected || 'heading'}`;
          cursoroffset = 2;
          break;

        case 'h2':
          replacement = `## ${selected || 'heading'}`;
          cursoroffset = 3;
          break;

        case 'h3':
          replacement = `### ${selected || 'heading'}`;
          cursoroffset = 4;
          break;

        case 'quote':
          replacement = `> ${selected || 'quote'}`;
          cursoroffset = 2;
          break;

        case 'list':
          if (selected.includes('\n')) {
            replacement = selected.split('\n').map(line => `- ${line}`).join('\n');
          } else {
            replacement = `- ${selected || 'list item'}`;
          }
          cursoroffset = 2;
          break;

        case 'orderedlist':
          if (selected.includes('\n')) {
            replacement = selected.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
          } else {
            replacement = `1. ${selected || 'list item'}`;
          }
          cursoroffset = 3;
          break;

        case 'code':
          if (selected.includes('\n')) {
            replacement = '```\n' + selected + '\n```';
            cursoroffset = 4;
          } else {
            replacement = '`' + (selected || 'code') + '`';
            cursoroffset = 1;
          }
          break;

        case 'link':
          replacement = `[${selected || 'link text'}](url)`;
          cursoroffset = 1;
          break;

        case 'image':
          replacement = `![${selected || 'alt text'}](image-url)`;
          cursoroffset = 2;
          break;

        default:
          return;
      }

      this.insertText(replacement, start, end);

      // set cursor position
      const newcursorpos = selected ? start + replacement.length : start + cursoroffset;
      this.textarea.setSelectionRange(newcursorpos, newcursorpos);
      this.textarea.focus();

      this.updatePreview();
    },

    insertText(text, start, end) {
      if (!this.textarea) return;

      const value = this.textarea.value;
      const selstart = start ?? this.textarea.selectionStart;
      const selend = end ?? this.textarea.selectionEnd;

      this.textarea.value = value.substring(0, selstart) + text + value.substring(selend);
    },

    updatePreview() {
      if (!this.textarea || !window.labpreview) return;

      const markdown = this.textarea.value;
      window.labpreview.render(markdown);
    },

    getValue() {
      return this.textarea?.value || '';
    },

    setValue(text) {
      if (this.textarea) {
        this.textarea.value = text;
        this.updatePreview();
      }
    },

    clear() {
      this.setValue('');
    }
  };

  window.labeleditor = labeleditor;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => labeleditor.init());
  } else {
    labeleditor.init();
  }
})();
