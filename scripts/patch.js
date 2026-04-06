// Apply Harmony Code branding patches to cli.js
const fs = require('fs');
const path = require('path');

const CLI = path.join(__dirname, '..', 'cli.js');

if (!fs.existsSync(CLI)) {
  console.error('ERROR: cli.js not found. Run "node scripts/extract.js" first.');
  process.exit(1);
}

let c = fs.readFileSync(CLI, 'utf-8');
console.log(`Read ${(c.length / 1024 / 1024).toFixed(1)}MB from cli.js`);

let changes = 0;

function replaceAll(old, newStr, desc) {
  const count = c.split(old).length - 1;
  if (count > 0) {
    c = c.split(old).join(newStr);
    console.log(`  [OK] ${desc} (${count}x)`);
    changes++;
    return count;
  }
  console.log(`  [SKIP] ${desc} (not found)`);
  return 0;
}

// ── Colors ──
console.log('\n\u2728 Patching colors...');
replaceAll('clawd_body:"rgb(215,119,87)"', 'clawd_body:"rgb(199,0,11)"', 'clawd_body \u2192 Huawei red');
replaceAll('claude:"rgb(215,119,87)"', 'claude:"rgb(199,0,11)"', 'claude \u2192 Huawei red');
replaceAll('claudeShimmer:"rgb(245,149,117)"', 'claudeShimmer:"rgb(230,50,50)"', 'claudeShimmer \u2192 bright red');
replaceAll('claudeShimmer:"rgb(235,159,127)"', 'claudeShimmer:"rgb(230,50,50)"', 'claudeShimmer alt \u2192 bright red');
replaceAll('clawd_body:"ansi:redBright"', 'clawd_body:"ansi:red"', 'clawd_body ansi \u2192 red');

// ── Text ──
console.log('\n\u2728 Patching text...');
replaceAll('return"Welcome back!"', 'return"\u9065\u9065\u9886\u5148\uff0c\u4e2d\u534e\u6709\u4e3a"', 'welcome (no name)');
replaceAll('return`Welcome back ${q}!`', 'return`\u9065\u9065\u9886\u5148\uff0c${q}\uff0c\u4e2d\u534e\u6709\u4e3a`', 'welcome (with name)');
replaceAll('b7("claude",o)("Claude Code")', 'b7("claude",o)("Harmony Code")', 'border title z6');
replaceAll('b7("claude",o)(" Claude Code ")', 'b7("claude",o)(" Harmony Code ")', 'border title _6');
replaceAll('return"Claude Enterprise"', 'return"\u534e\u4e3a\u4f01\u4e1a\u7248"', 'billing Enterprise');
replaceAll('return"Claude Team"', 'return"\u534e\u4e3a\u56e2\u961f\u7248"', 'billing Team');
replaceAll('return"Claude Max"', 'return"Harmony Max"', 'billing Max');
replaceAll('return"Claude Pro"', 'return"Harmony Pro"', 'billing Pro');
replaceAll('return"Claude API"', 'return"\u56fd\u4ea7\u81ea\u4e3b\u7814\u53d1 \u00b7 \u9e3f\u8499\u751f\u6001"', 'billing API');
replaceAll('"API Usage Billing"', '"\u56fd\u4ea7\u81ea\u4e3b\u7814\u53d1 \u00b7 \u9e3f\u8499\u751f\u6001"', 'API Billing title');
replaceAll('API Usage Billing (Anthropic Console)', '\u56fd\u4ea7\u81ea\u4e3b\u7814\u53d1 \u00b7 \u9e3f\u8499\u751f\u6001', 'API Billing Console');
replaceAll('Claude uses ${process.env.CLAUDE_CODE_TMUX_PREFIX}', 'Harmony \u4f7f\u7528 ${process.env.CLAUDE_CODE_TMUX_PREFIX}', 'tmux message');
replaceAll("What's new", '\u6700\u65b0\u52a8\u6001', 'feeds title');
replaceAll('Check the Claude Code changelog for updates', '\u67e5\u770b Harmony Code \u66f4\u65b0\u65e5\u5fd7', 'feeds footer');
replaceAll('/release-notes for more', '/release-notes \u67e5\u770b\u66f4\u591a', 'feeds link');

// ── Logo ──
console.log('\n\u2728 Patching logo...');

const COMPACT = [
  '          101      101',
  '         10101     10101',
  '         10101    101010',
  '   101    101010  101010   101',
  '  01010   101010  101010  10101',
  '  0101010  10101  1010   101010',
  '   101010   1010  1010  1010101',
  '101  101010  101  10  10101   10',
  '10101   1010  10  10 1010  10101',
  '  1010101   10       1  10101010',
  '   10101010           101010101',
];

const maxW = Math.max(...COMPACT.map(r => r.length));
const paddedRows = COMPACT.map(r => r.padEnd(maxW));

function rowToJS(row) {
  const parts = [];
  let i = 0;
  while (i < row.length) {
    if (row[i] === ' ') {
      let j = i + 1;
      while (j < row.length && row[j] === ' ') j++;
      parts.push(`pz.createElement(T,{color:"clawd_background"},"${' '.repeat(j - i)}")`);
      i = j;
    } else {
      let j = i + 1;
      while (j < row.length && row[j] !== ' ') j++;
      parts.push(`pz.createElement(T,{color:"clawd_body",bold:!0},"${row.substring(i, j)}")`);
      i = j;
    }
  }
  return `pz.createElement(T,null,${parts.join(',')})`;
}

const logoInner = paddedRows.map(r => rowToJS(r)).join(',');

function replaceFn(name, signature, newBody) {
  const marker = `function ${name}(${signature}){`;
  const start = c.indexOf(marker);
  if (start === -1) {
    console.log(`  [ERROR] ${name} not found!`);
    return false;
  }
  let brace = 0, end = start;
  for (let i = start; i < c.length; i++) {
    if (c[i] === '{') brace++;
    else if (c[i] === '}') { brace--; if (brace === 0) { end = i + 1; break; } }
  }
  const replacement = `function ${name}(${signature}){${newBody}}`;
  c = c.substring(0, start) + replacement + c.substring(end);
  console.log(`  [OK] ${name} (${end - start} \u2192 ${replacement.length} chars)`);
  changes++;
  return true;
}

const logoBody = `let A=K6(1),z;if(A[0]===Symbol.for("react.memo_cache_sentinel"))z=pz.createElement(u,{flexDirection:"column",alignItems:"center"},${logoInner}),A[0]=z;else z=A[0];return z`;

replaceFn('wM6', 'q', logoBody);
replaceFn('XyY', 'q', logoBody);

// ── Height ──
console.log('\n\u2728 Patching layout constraints...');
replaceAll('justifyContent:"space-between",alignItems:"center",minHeight:9', 'justifyContent:"space-between",alignItems:"center",minHeight:13', 'minHeight 9\u219213');
replaceAll('VyY=3;', 'VyY=11;', 'mascot height 3\u219211');

// ── Write ──
fs.writeFileSync(CLI, c, 'utf-8');
console.log(`\n\u2705 Done! ${changes} patches applied.`);
console.log(`   Output: ${(c.length / 1024 / 1024).toFixed(1)}MB`);

// Verify
if (c.includes('function wM6(q){let A=K6(1)')) {
  console.log('   \u2714 wM6 logo OK');
}
if (c.includes('function XyY(q){let A=K6(1)')) {
  console.log('   \u2714 XyY logo OK');
}
if (c.includes('rgb(199,0,11)')) {
  console.log('   \u2714 Huawei red OK');
}
