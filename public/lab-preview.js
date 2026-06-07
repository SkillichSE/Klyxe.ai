// lab-preview.js - live markdown preview renderer
// converts markdown to html and displays it

(function() {
  'use strict';

  const labpreview = {
    container: null,
    initialized: false,

    // simple markdown parser
    parser: {
      parse(text) {
        if (!text) return '';

        let html = text;

        // escape html
        html = this.escapeHtml(html);

        // code blocks (must be before inline code)
        html = html.replace(/```([\s\s]*?)```/g, (match, code) => {
          return `<pre><code>${code.trim()}</code></pre>`;
        });

        // inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // headings
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // strikethrough
        html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

        // blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // unordered lists
        html = html.replace(/^\- (.*$)/gim, '<ul><li>$1</li></ul>');

        // ordered lists
        html = html.replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>');

        // fix consecutive list items
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        html = html.replace(/<\/ol>\s*<ol>/g, '');

        // links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

        // horizontal rule
        html = html.replace(/^---$/gim, '<hr>');

        // line breaks and paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');

        // wrap in paragraph if not already wrapped
        if (!html.startsWith('<')) {
          html = `<p>${html}</p>`;
        }

        return html;
      },

      escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
    },

    init() {
      this.container = document.getElementById('lab-preview-content');
      if (this.container) {
        this.initialized = true;
      }
    },

    render(markdown) {
      if (!this.container) {
        this.init();
      }

      if (!this.container) return;

      const html = this.parser.parse(markdown);
      this.container.innerHTML = html;

      // add styling classes
      this.addClasses();
    },

    addClasses() {
      if (!this.container) return;

      // add classes to elements for styling
      this.container.querySelectorAll('pre').forEach(el => {
        el.classList.add('lab-preview-code-block');
      });

      this.container.querySelectorAll('code').forEach(el => {
        if (!el.parentElement.matches('pre')) {
          el.classList.add('lab-preview-inline-code');
        }
      });

      this.container.querySelectorAll('blockquote').forEach(el => {
        el.classList.add('lab-preview-quote');
      });

      this.container.querySelectorAll('h1, h2, h3').forEach(el => {
        el.classList.add('lab-preview-heading');
      });

      this.container.querySelectorAll('ul, ol').forEach(el => {
        el.classList.add('lab-preview-list');
      });

      this.container.querySelectorAll('a').forEach(el => {
        el.classList.add('lab-preview-link');
      });

      this.container.querySelectorAll('img').forEach(el => {
        el.classList.add('lab-preview-image');
        el.onerror = () => {
          el.style.display = 'none';
        };
      });
    },

    clear() {
      if (this.container) {
        this.container.innerHTML = '';
      }
    }
  };

  window.labpreview = labpreview;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => labpreview.init());
  } else {
    labpreview.init();
  }
})();
