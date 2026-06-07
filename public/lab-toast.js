// lab-toast.js - notification component for lab page
// displays toast messages at bottom center

(function() {
  'use strict';

  const labtoast = {
    container: null,

    init() {
      this.createContainer();
    },

    createContainer() {
      if (document.getElementById('lab-toast-container')) return;

      const div = document.createElement('div');
      div.id = 'lab-toast-container';
      div.className = 'lab-toast-container';
      document.body.appendChild(div);
      this.container = div;
    },

    show(message, type = 'info', duration = 3000) {
      if (!this.container) this.init();

      const toast = document.createElement('div');
      toast.className = `lab-toast lab-toast-${type}`;
      toast.innerHTML = `
        <span class="lab-toast-message">${message}</span>
        <button class="lab-toast-close" aria-label="close">&times;</button>
      `;

      const closebtn = toast.querySelector('.lab-toast-close');
      closebtn.addEventListener('click', () => this.hide(toast));

      this.container.appendChild(toast);

      // trigger animation
      requestAnimationFrame(() => {
        toast.classList.add('lab-toast-visible');
      });

      // auto hide
      if (duration > 0) {
        setTimeout(() => this.hide(toast), duration);
      }

      return toast;
    },

    hide(toastelement) {
      toastelement.classList.remove('lab-toast-visible');
      toastelement.classList.add('lab-toast-hiding');

      setTimeout(() => {
        if (toastelement.parentNode) {
          toastelement.parentNode.removeChild(toastelement);
        }
      }, 300);
    },

    success(message, duration) {
      return this.show(message, 'success', duration);
    },

    error(message, duration) {
      return this.show(message, 'error', duration);
    },

    warning(message, duration) {
      return this.show(message, 'warning', duration);
    }
  };

  window.labtoast = labtoast;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => labtoast.init());
  } else {
    labtoast.init();
  }
})();
