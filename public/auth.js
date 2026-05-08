// klyxe authentication with supabase
// handles email password and github oauth sign in

console.log('Auth loading...');

// global variables
let supabase = null;

// dom elements
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

const AUTH_REDIRECT_URL = `${window.location.origin}/auth/`;

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

  // set avatar initial
  const initial = user.email ? user.email[0].toUpperCase() : 'U';
  if (userAvatar) userAvatar.textContent = initial;
  if (userEmail) userEmail.textContent = user.email || user.user_metadata?.user_name || 'Signed in';

  // update sidebar link
  updateSidebarForAuth(true);
}

function showLoggedOut() {
  if (authForms) authForms.style.display = 'block';
  if (userInfo) userInfo.classList.remove('visible');
  updateSidebarForAuth(false);
}

function updateSidebarForAuth(isLoggedIn) {
  // find the sign in link in sidebar and update text
  const sidebarLinks = document.querySelectorAll('.sidebar-footer-links a');
  sidebarLinks.forEach(link => {
    if (link.href.includes('/auth')) {
      const label = link.querySelector('.link-label');
      if (label) {
        label.textContent = isLoggedIn ? 'Account' : 'Sign In';
      }
    }
  });

  // update sign up button text
  const signupBtn = document.querySelector('.sidebar-signup-btn .link-label');
  if (signupBtn) {
    signupBtn.textContent = isLoggedIn ? 'Account' : 'Sign Up';
  }
}

// tab switching
function setupTabs() {
  const tabs = document.querySelectorAll('.auth-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      // update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // update forms
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

      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;

      setLoading(signinBtn, true);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

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
      console.log('Sign up clicked');

      if (!supabase) {
        showError('Auth not initialized. Check console for errors.');
        return;
      }

      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      console.log('Signing up with email:', email);

      setLoading(signupBtn, true);

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: AUTH_REDIRECT_URL,
          },
        });

        setLoading(signupBtn, false);

        if (error) {
          console.error('Sign up error:', error);
          showError(error.message);
          return;
        }

        if (data.user && data.user.identities && data.user.identities.length === 0) {
          showError('An account with this email already exists. Please sign in.');
          return;
        }

        showSuccess('Check your email to confirm your account!');
      } catch (err) {
        console.error('Sign up exception:', err);
        setLoading(signupBtn, false);
        showError('Sign up failed: ' + err.message);
      }
    });
  }

  // github oauth sign in
  if (githubBtn) {
    githubBtn.addEventListener('click', async () => {
      console.log('GitHub sign in clicked');
      clearMessages();

      if (!supabase) {
        showError('Auth not initialized. Check console for errors.');
        return;
      }

      githubBtn.disabled = true;
      githubBtn.innerHTML = '<span class="loading-spinner"></span> GitHub';

      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: AUTH_REDIRECT_URL,
          },
        });

        if (error) {
          console.error('GitHub auth error:', error);
          showError(error.message);
          githubBtn.disabled = false;
          githubBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          `;
        }
        // if successful user is redirected to github
      } catch (err) {
        console.error('GitHub auth exception:', err);
        showError('GitHub sign in failed: ' + err.message);
        githubBtn.disabled = false;
      }
    });
  }

  // sign out
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const { error } = await supabase.auth.signOut();

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

// fetch config from API or local fallback
async function initializeAuth() {
  try {
    console.log('Starting auth initialization...');

    let config = null;
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        config = await response.json();
        console.log('Config fetched from /api/config:', { url: !!config?.SUPABASE_URL, key: !!config?.SUPABASE_ANON_KEY });
      } else {
        console.warn(`/api/config returned ${response.status}. Falling back to local config.js if available.`);
      }
    } catch (fetchError) {
      console.warn('Could not fetch /api/config. Falling back to local config.js if available.', fetchError);
    }

    if ((!config?.SUPABASE_URL || !config?.SUPABASE_ANON_KEY) && typeof CONFIG !== 'undefined') {
      config = CONFIG;
      console.log('Config loaded from local config.js:', { url: !!config?.SUPABASE_URL, key: !!config?.SUPABASE_ANON_KEY });
    }

    const SUPABASE_URL = config?.SUPABASE_URL;
    const SUPABASE_ANON_KEY = config?.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase credentials are missing. Set NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY or create public/config.js.');
    }

    if (!window.supabase) {
      throw new Error('Supabase library not loaded');
    }

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✓ Supabase client initialized successfully');

    // setup handlers after successful init
    setupFormHandlers();
    supabase.auth.onAuthStateChange((event, session) => {
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
  if (!supabase) return;

  const { data: { session }, error } = await supabase.auth.getSession();

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
  console.log('DOM Content Loaded');

  // Set up tabs and buttons immediately (they don't need supabase)
  setupTabs();
  saveButtonText();

  // Initialize auth when supabase is available
  if (window.supabase) {
    console.log('Supabase library detected, initializing auth...');
    initializeAuth();
  } else {
    console.error('Supabase library not found');
    showError('Supabase library failed to load');
  }
});