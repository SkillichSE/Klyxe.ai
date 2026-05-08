// copy this file to config.js and fill in your Supabase credentials
// config.js is gitignored and will not be committed
const CONFIG = {
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key'
};

// for CommonJS compatibility if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
