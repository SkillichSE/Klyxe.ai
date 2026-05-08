// generate config.js from Vercel env vars
const fs = require('fs');
const path = require('path');

const config = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
};

const configContent = `// Auto-generated from env vars
const CONFIG = {
  SUPABASE_URL: '${config.SUPABASE_URL}',
  SUPABASE_ANON_KEY: '${config.SUPABASE_ANON_KEY}'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
`;

fs.writeFileSync(path.join(__dirname, 'public', 'config.js'), configContent);
console.log('config.js generated successfully');
