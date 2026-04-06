// One-click setup: extract + patch + install
const { execSync } = require('child_process');
const path = require('path');

console.log('=== Harmony Code Setup ===\n');

console.log('[1/3] Extracting cli.js from Claude Code...');
try {
  execSync('node ' + path.join(__dirname, 'scripts', 'extract.js'), { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}

console.log('\n[2/3] Applying branding patches...');
try {
  execSync('node ' + path.join(__dirname, 'scripts', 'patch.js'), { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}

console.log('\n[3/3] Installing globally...');
try {
  execSync('npm install -g .', { stdio: 'inherit', cwd: __dirname });
} catch (e) {
  process.exit(1);
}

console.log('\n=== Setup Complete ===');
console.log('Run "harmony" to start!');
