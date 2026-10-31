const fs = require('fs');
const code = fs.readFileSync('src/components/JourneyTracker.jsx', 'utf8');
try {
  require('@babel/parser').parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log('PARSE OK - No syntax errors');
} catch (e) {
  console.log('PARSE ERROR:', e.message);
  process.exit(1);
}
