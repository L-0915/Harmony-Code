// Extract cli.js from locally installed Claude Code
const fs = require('fs');
const path = require('path');

// Find cli.js in npm global install
const possiblePaths = [
  path.join(process.env.APPDATA || '', 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming', 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  path.join(process.env.HOME || '', '.npm-global', 'lib', 'node_modules', '@anthropic-ai', 'claude-code', 'cli.js'),
  '/usr/local/lib/node_modules/@anthropic-ai/claude-code/cli.js',
  '/usr/lib/node_modules/@anthropic-ai/claude-code/cli.js',
];

let srcPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    srcPath = p;
    break;
  }
}

if (!srcPath) {
  console.error('ERROR: Claude Code cli.js not found.');
  console.error('Please install Claude Code first: npm install -g @anthropic-ai/claude-code');
  process.exit(1);
}

const srcDir = path.dirname(srcPath);
const destDir = path.join(__dirname, '..');

// Copy cli.js
fs.copyFileSync(srcPath, path.join(destDir, 'cli.js'));
const sizeMB = (fs.statSync(srcPath).size / 1024 / 1024).toFixed(1);
console.log(`OK: Copied cli.js (${sizeMB}MB)`);

// Copy wasm files needed at runtime
const wasmFiles = ['resvg.wasm', 'tree-sitter.wasm', 'tree-sitter-bash.wasm'];
for (const f of wasmFiles) {
  const src = path.join(srcDir, f);
  const dest = path.join(destDir, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    const kb = (fs.statSync(src).size / 1024).toFixed(0);
    console.log(`OK: Copied ${f} (${kb}KB)`);
  } else {
    console.log(`SKIP: ${f} not found (may not be needed)`);
  }
}
