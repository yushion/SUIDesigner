import { readFileSync, writeFileSync } from 'fs'

let content = readFileSync('public/webviewBridge_api_doc.html', 'utf-8')

// 从 addDoc 数据中统计每命名空间的 API 数量
const nsCounts = {}
const addDocMatches = [...content.matchAll(/addDoc\('([^']+)'/g)]
for (const match of addDocMatches) {
  const ns = match[1]
  const idx = content.indexOf("addDoc('" + ns + "'")
  let endIdx = content.indexOf("addDoc('", idx + 10)
  if (endIdx < 0) endIdx = content.length
  const slice = content.substring(idx, endIdx)
  nsCounts[ns] = (slice.match(/sig:'/g) || []).length
}

// 更新侧边栏 badge 数字
for (const [ns, count] of Object.entries(nsCounts)) {
  // 匹配: showSection('xxx',...) ... <span class="badge">NN</span>
  const regex = new RegExp(
    `(showSection\\('${ns.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^)]*\\)[^<]*<span class="badge">)\\d+(</span>)`,
    'g'
  )
  content = content.replace(regex, `$1${count}$2`)
}

// 更新 commands badge (20)
content = content.replace(
  /(showSection\('commands'[^)]*\)[^<]*<span class="badge">)\d+(<\/span>)/g,
  `$120$2`
)

// 读取 commandsData 并写入文件后统计
const cmdStart = content.indexOf('var commandsData')
const cmdEnd = content.indexOf('];', cmdStart)
if (cmdStart >= 0 && cmdEnd >= 0) {
  const slice = content.substring(cmdStart, cmdEnd + 2)
  const cmdCount = (slice.match(/\{cmd:'/g) || []).length
  console.log('commands badge 更新为:', cmdCount)
}

writeFileSync('public/webviewBridge_api_doc.html', content, 'utf-8')
console.log('✅ 侧边栏 badge 数字已更新')
for (const [ns, count] of Object.entries(nsCounts).sort()) {
  console.log(`  ${ns}: ${count}`)
}
