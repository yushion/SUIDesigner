/**
 * 交换 webviewBridge_api_doc.html 中所有 API 条目的 sig 和 desc 值
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'webviewBridge_api_doc.html');
let content = fs.readFileSync(filePath, 'utf-8');

// 匹配 {sig:'ApiName: <b class="apiname">CODE</b>', desc:'<span class="desctile">TITLE</span>
// 转换为 {sig:'TITLE', desc:'<span class="desctile">ApiName: <b class="apiname">CODE</b></span>
const pattern = /\{sig:'(ApiName: <b class="apiname">[^<]*<\/b>)',\s*desc:'<span class="desctile">([^<]*)<\/span>/g;

let count = 0;
const result = content.replace(pattern, (match, code, title) => {
  count++;
  return `{sig:'${title}', desc:'<span class="desctile">${code}</span>`;
});

console.log(`Done! ${count} entries swapped.`);
fs.writeFileSync(filePath, result, 'utf-8');
