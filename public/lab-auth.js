// lab-auth.js - authentication module for lab page
// provides user state management and session checking

(function() {
  'use strict';

  const labauth = {
    user: null,
    supabase: null,
    listeners: [],

    init() {
      this.supabase = window._supabaseLib ? window._supabaseLib.createClient : null;
      this.checkSession();
      this.setupAuthListener();
    },

    async checkSession() {
      if (!window._supabaseClient) {
        setTimeout(() => this.checkSession(), 500);
        return;
      }

      const { data: { session } } = await window._supabaseClient.auth.getSession();
      this.user = session?.user || null;
      this.notifyListeners();
    },

    setupAuthListener() {
      if (!window._supabaseClient) return;

      window._supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          this.user = session?.user || null;
        } else if (event === 'SIGNED_OUT') {
          this.user = null;
        }
        this.notifyListeners();
      });
    },

    isLoggedIn() {
      return !!this.user;
    },

    getUser() {
      return this.user;
    },

    onAuthChange(callback) {
      this.listeners.push(callback);
    },

    notifyListeners() {
      this.listeners.forEach(cb => cb(this.user));
    },

    redirectToAuth() {
      window.location.href = 'auth.html?redirect=' + encodeURIComponent(window.location.href);
    }
  };

  window.labauth = labauth;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => labauth.init());
  } else {
    labauth.init();
  }
})();
