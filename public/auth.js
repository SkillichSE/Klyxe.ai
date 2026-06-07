// klyxe authentication with supabase
// handles email password and github oauth sign in

// global variables
let _supabaseClient = null;

// dom elements (only on auth page)
const authError = document.getElementById('auth-error');
const authSuccess = document.getElementById('auth-success');
const authForms = document.getElementById('auth-forms');
const userInfo = document.getElementById('user-info');
const userAvatar = document.getElementById('user-avatar');
const userEmail = document.getElementById('user-email');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const signinBtn = document.getElementById('signin-btn');
const signupBtn = document.getElementById('signup-btn');
const githubBtn = document.getElementById('github-btn');
const logoutBtn = document.getElementById('logout-btn');

// check if we're on auth page
const isAuthPage = !!document.getElementById('auth-forms');

const AUTH_REDIRECT_URL = (() => {
  const pathname = window.location.pathname;
  return `${window.location.origin}/auth`;
})();

// ui helpers
function showError(msg) {
  if (authError) {
    authError.textContent = msg;
    authError.classList.add('visible');
  }
  if (authSuccess) authSuccess.classList.remove('visible');
  console.error('Auth error:', msg);
}

function showSuccess(msg) {
  if (authSuccess) {
    authSuccess.textContent = msg;
    authSuccess.classList.add('visible');
  }
  if (authError) authError.classList.remove('visible');
}

function clearMessages() {
  if (authError) authError.classList.remove('visible');
  if (authSuccess) authSuccess.classList.remove('visible');
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.innerHTML = loading ? '<span class="loading-spinner"></span>' : btn.dataset.originalText;
}

function showLoggedIn(user) {
  if (authForms) authForms.style.display = 'none';
  if (userInfo) userInfo.classList.add('visible');

  const initial = user.email ? user.email[0].toUpperCase() : 'U';
  if (userAvatar) userAvatar.textContent = initial;
  if (userEmail) userEmail.textContent = user.email || user.user_metadata?.user_name || 'Signed in';

  updateSidebarForAuth(true);
}

function showLoggedOut() {
  if (authForms) authForms.style.display = 'block';
  if (userInfo) userInfo.classList.remove('visible');
  updateSidebarForAuth(false);
}

function updateSidebarForAuth(isLoggedIn) {
  const sidebarLinks = document.querySelectorAll('.sidebar-footer-links a');
  sidebarLinks.forEach(link => {
    if (link.href.includes('/auth')) {
      const label = link.querySelector('.link-label');
      if (label) {
        label.textContent = isLoggedIn ? 'Account' : 'Sign In';
      }
    }
  });

  const signupSideBtn = document.querySelector('.sidebar-signup-btn .link-label');
  if (signupSideBtn) {
    signupSideBtn.textContent = isLoggedIn ? 'Account' : 'Sign Up';
  }
}

// tab switching
function setupTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const forms = document.querySelectorAll('.auth-form');
      forms.forEach(f => f.classList.remove('active'));
      const formEl = document.getElementById(`${target}-form`);
      if (formEl) formEl.classList.add('active');

      clearMessages();
    });
  });
}

// save original button text
function saveButtonText() {
  if (signinBtn) signinBtn.dataset.originalText = signinBtn.textContent;
  if (signupBtn) signupBtn.dataset.originalText = signupBtn.textContent;
  if (githubBtn) githubBtn.dataset.originalText = githubBtn.innerHTML;
  if (logoutBtn) logoutBtn.dataset.originalText = logoutBtn.textContent;
}

// setup form handlers
function setupFormHandlers() {
  // email password sign in
  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessages();

      if (!_supabaseClient) {
        showError('Auth not initialized. Check console for errors.');
        return;
      }

      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;

      setLoading(signinBtn, true);

      try {
        const { data, error } = await _supabaseClient.auth.signInWithPassword({ email, password });

        setLoading(signinBtn, false);

        if (error) {
          showError(error.message);
          return;
        }

        showSuccess('Signed in successfully!');
        showLoggedIn(data.user);
      } catch (err) {
        setLoading(signinBtn, false);
        showError('Sign in failed: ' + err.message);
      }
    });
  }

  // email password sign up
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessages();

      if (!_supabaseClient) {
        showError('Auth not initialized. Check console for errors.');
        return;
      }

      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      setLoading(signupBtn, true);

      try {
        const { data, error } = await _supabaseClient.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: AUTH_REDIRECT_URL,
          },
        });

        setLoading(signupBtn, false);

        if (error) {
          showError(error.message);
          return;
        }

        if (data.user && data.user.identities && data.user.identities.length === 0) {
          showError('An account with this email already exists. Please sign in.');
          return;
        }

        showSuccess('Check your email to confirm your account!');
      } catch (err) {
        setLoading(signupBtn, false);
        showError('Sign up failed: ' + err.message);
      }
    });
  }

  // github oauth sign in
  if (githubBtn) {
    githubBtn.addEventListener('click', async () => {
      clearMessages();

      if (!_supabaseClient) {
        showError('Auth not initialized. Check console for errors.');
        return;
      }

      githubBtn.disabled = true;
      githubBtn.innerHTML = '<span class="loading-spinner"></span> GitHub';

      try {
        const { error } = await _supabaseClient.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: AUTH_REDIRECT_URL,
          },
        });

        if (error) {
          showError(error.message);
          githubBtn.disabled = false;
          githubBtn.innerHTML = githubBtn.dataset.originalText;
        }
        // if successful, user is redirected to github
      } catch (err) {
        showError('GitHub sign in failed: ' + err.message);
        githubBtn.disabled = false;
        githubBtn.innerHTML = githubBtn.dataset.originalText;
      }
    });
  } else {
    console.error('GitHub button element not found in DOM');
  }

  // sign out
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const { error } = await _supabaseClient.auth.signOut();

      if (error) {
        showError(error.message);
        return;
      }

      clearMessages();
      showLoggedOut();
      showSuccess('Signed out successfully');
    });
  }
}

// fetch config from /api/config (Next.js route)
async function initializeAuth() {
  try {
    console.log('Starting auth initialization...');

    let config = null;
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        config = await response.json();
        console.log('Config fetched from /api/config');
      } else {
        console.warn(`/api/config returned ${response.status}`);
      }
    } catch (fetchError) {
      console.warn('Could not fetch /api/config:', fetchError);
    }

    // fallback to local config.js if available
    if ((!config?.SUPABASE_URL || !config?.SUPABASE_ANON_KEY) && typeof CONFIG !== 'undefined') {
      config = CONFIG;
      console.log('Using local config.js fallback');
    }

    const SUPABASE_URL = config?.SUPABASE_URL;
    const SUPABASE_ANON_KEY = config?.SUPABASE_ANON_KEY;
    console.log('SUPABASE_URL exists:', !!SUPABASE_URL, 'SUPABASE_ANON_KEY exists:', !!SUPABASE_ANON_KEY);

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase credentials are missing. Make sure /api/config returns SUPABASE_URL and SUPABASE_ANON_KEY.');
    }

    if (!window._supabaseLib) {
      throw new Error('Supabase library not loaded');
    }
    console.log('_supabaseLib exists, creating client...');

    _supabaseClient = window._supabaseLib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window._supabaseClient = _supabaseClient;
    console.log('✓ Supabase client initialized, window._supabaseClient set:', !!window._supabaseClient);

    _supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        showLoggedIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        showLoggedOut();
      }
    });

    checkSession();
  } catch (e) {
    console.error('❌ Auth initialization failed:', e);
    showError('Authentication failed: ' + e.message);
  }
}

// check session on load and handle oauth callback
async function checkSession() {
  if (!_supabaseClient) return;

  const { data: { session }, error } = await _supabaseClient.auth.getSession();

  if (error) {
    console.error('Error checking session:', error);
    return;
  }

  if (session?.user) {
    showLoggedIn(session.user);
  } else {
    showLoggedOut();
  }
}

// initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // auth page specific setup
  if (isAuthPage) {
    setupTabs();
    saveButtonText();
    setupFormHandlers();
  }

  // init supabase on all pages
  if (window._supabaseLib) {
    initializeAuth();
  } else {
    console.error('Supabase library not found on window');
    if (isAuthPage) showError('Supabase library failed to load');
  }
});