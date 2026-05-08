// generate config.js from Vercel env vars
const fs = require('fs');
const path = require('path');

console.log('Generating config.js...');
console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));

const config = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
};

console.log('Config values:', { URL: config.SUPABASE_URL ? 'SET' : 'EMPTY', KEY: config.SUPABASE_ANON_KEY ? 'SET' : 'EMPTY' });

const configContent = `// Auto-generated from env vars
const CONFIG = {
  SUPABASE_URL: '${config.SUPABASE_URL}',
  SUPABASE_ANON_KEY: '${config.SUPABASE_ANON_KEY}'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
`;

const outputPath = path.join(__dirname, 'public', 'config.js');
fs.writeFileSync(outputPath, configContent);
console.log('config.js generated at:', outputPath);
console.log('File exists:', fs.existsSync(outputPath));
