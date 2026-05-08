// klyxe authentication with supabase
// handles email password and github oauth sign in

console.log('Auth loading...');
console.log('CONFIG available:', typeof CONFIG !== 'undefined');
if (typeof CONFIG !== 'undefined') {
  console.log('CONFIG.SUPABASE_URL:', CONFIG.SUPABASE_URL ? 'SET' : 'EMPTY');
  console.log('CONFIG.SUPABASE_ANON_KEY:', CONFIG.SUPABASE_ANON_KEY ? 'SET' : 'EMPTY');
}

// supabase configuration loaded from config.js (gitignored)
// copy config.template.js to config.js and fill in your credentials
const SUPABASE_URL = typeof CONFIG !== 'undefined' ? CONFIG.SUPABASE_URL : 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = typeof CONFIG !== 'undefined' ? CONFIG.SUPABASE_ANON_KEY : 'your-anon-key';

console.log('Final SUPABASE_URL:', SUPABASE_URL ? 'SET' : 'EMPTY');
console.log('Final SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'SET' : 'EMPTY');

// initialize supabase client
let supabase;
try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase client initialized');
} catch (e) {
  console.error('Supabase init failed:', e);
}

// dom elements
const els = {
  error: document.getElementById('auth-error'),
  success: document.getElementById('auth-success'),
  authForms: document.getElementById('auth-forms'),
  userInfo: document.getElementById('user-info'),
  userAvatar: document.getElementById('user-avatar'),
  userEmail: document.getElementById('user-email'),
  tabs: document.querySelectorAll('.auth-tab'),
  forms: document.querySelectorAll('.auth-form'),
  signinForm: document.getElementById('signin-form'),
  signupForm: document.getElementById('signup-form'),
  signinBtn: document.getElementById('signin-btn'),
  signupBtn: document.getElementById('signup-btn'),
  githubBtn: document.getElementById('github-btn'),
  logoutBtn: document.getElementById('logout-btn'),
};

// ui helpers
function showError(msg) {
  els.error.textContent = msg;
  els.error.classList.add('visible');
  els.success.classList.remove('visible');
}

function showSuccess(msg) {
  els.success.textContent = msg;
  els.success.classList.add('visible');
  els.error.classList.remove('visible');
}

function clearMessages() {
  els.error.classList.remove('visible');
  els.success.classList.remove('visible');
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.innerHTML = loading ? '<span class="loading-spinner"></span>' : btn.dataset.originalText;
}

function showLoggedIn(user) {
  els.authForms.style.display = 'none';
  els.userInfo.classList.add('visible');
  
  // set avatar initial
  const initial = user.email ? user.email[0].toUpperCase() : 'U';
  els.userAvatar.textContent = initial;
  els.userEmail.textContent = user.email || user.user_metadata?.user_name || 'Signed in';
  
  // update sidebar link
  updateSidebarForAuth(true);
}

function showLoggedOut() {
  els.authForms.style.display = 'block';
  els.userInfo.classList.remove('visible');
  updateSidebarForAuth(false);
}

function updateSidebarForAuth(isLoggedIn) {
  // find the sign in link in sidebar and update text
  const sidebarLinks = document.querySelectorAll('.sidebar-footer-links a');
  sidebarLinks.forEach(link => {
    if (link.href.includes('auth.html')) {
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
els.tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    
    // update tabs
    els.tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // update forms
    els.forms.forEach(f => f.classList.remove('active'));
    document.getElementById(`${target}-form`).classList.add('active');
    
    clearMessages();
  });
});

// save original button text for loading states
els.signinBtn.dataset.originalText = els.signinBtn.textContent;
els.signupBtn.dataset.originalText = els.signupBtn.textContent;

// email password sign in
els.signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearMessages();
  
  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  
  setLoading(els.signinBtn, true);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  setLoading(els.signinBtn, false);
  
  if (error) {
    showError(error.message);
    return;
  }
  
  showSuccess('Signed in successfully!');
  showLoggedIn(data.user);
});

// email password sign up
els.signupForm.addEventListener('submit', async (e) => {
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
  
  setLoading(els.signupBtn, true);
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth.html`,
      },
    });
    
    setLoading(els.signupBtn, false);
    
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
    setLoading(els.signupBtn, false);
    showError('Sign up failed: ' + err.message);
  }
});

// github oauth sign in
els.githubBtn.addEventListener('click', async () => {
  console.log('GitHub sign in clicked');
  clearMessages();
  
  if (!supabase) {
    showError('Auth not initialized. Check console for errors.');
    return;
  }
  
  els.githubBtn.disabled = true;
  els.githubBtn.innerHTML = '<span class="loading-spinner"></span> GitHub';
  
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth.html`,
      },
    });
    
    if (error) {
      console.error('GitHub auth error:', error);
      showError(error.message);
      els.githubBtn.disabled = false;
      els.githubBtn.innerHTML = `
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
    els.githubBtn.disabled = false;
  }
});

// sign out
els.logoutBtn.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    showError(error.message);
    return;
  }
  
  clearMessages();
  showLoggedOut();
  showSuccess('Signed out successfully');
});

// check session on load and handle oauth callback
async function checkSession() {
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

// listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    showLoggedIn(session.user);
  } else if (event === 'SIGNED_OUT') {
    showLoggedOut();
  }
});

// initialize
checkSession();
