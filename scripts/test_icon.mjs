function _isIconChar(cp) {
  if (cp >= 0x2600 && cp <= 0x26FF) return true;
  if (cp >= 0x2700 && cp <= 0x27BF) return true;
  if (cp >= 0x2B00 && cp <= 0x2BFF) return true;
  if (cp >= 0x25A0 && cp <= 0x25FF) return true;
  if (cp >= 0x20A0 && cp <= 0x20CF) return true;
  if (cp >= 0x2100 && cp <= 0x214F) return true;
  if (cp >= 0x2190 && cp <= 0x21FF) return true;
  if (cp >= 0x2200 && cp <= 0x22FF) return true;
  if (cp >= 0x2300 && cp <= 0x23FF) return true;
  if (cp >= 0x2500 && cp <= 0x257F) return true;
  if (cp >= 0x2000 && cp <= 0x206F) return true;
  if (cp >= 0xFF01 && cp <= 0xFF5E) return true;
  if (cp >= 0xFFE0 && cp <= 0xFFE6) return true;
  return false;
}

const tests = ['✕', '✅', '✗', '❌', '中', '文', 'α', 'абв', '①②③', '⬆', '⭐'];
console.log('=== 图标类 ===');
tests.forEach(function(t) {
  const cp = t.codePointAt(0);
  if (_isIconChar(cp)) console.log(`  ${t}  U+${cp.toString(16).toUpperCase()}  → 图标 ✓`);
});
console.log('\n=== 文字类 ===');
tests.forEach(function(t) {
  const cp = t.codePointAt(0);
  if (!_isIconChar(cp)) console.log(`  ${t}  U+${cp.toString(16).toUpperCase()}  → 文字 ✓`);
});
