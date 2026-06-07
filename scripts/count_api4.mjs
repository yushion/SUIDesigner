import { readFileSync } from 'fs'

const content = readFileSync('public/webviewBridge_api_doc.html', 'utf-8')

// 1. 统计命名空间 - 从 addDoc 调用中提取
const addDocMatches = [...content.matchAll(/addDoc\('([^']+)'/g)]
const nsSet = new Set(addDocMatches.map(m => m[1]))
let totalSigs = 0
for (const ns of nsSet) {
  // 找到这个addDoc调用的范围
  const nsIdx = content.indexOf("addDoc('" + ns + "'")
  if (nsIdx < 0) continue
  // 找到下一个 addDoc 或文件结尾
  let endIdx = content.indexOf("addDoc('", nsIdx + 10)
  if (endIdx < 0) endIdx = content.length
  const slice = content.substring(nsIdx, endIdx)
  const count = (slice.match(/sig:'/g) || []).length
  totalSigs += count
  console.log(`  ${ns}: ${count}`)
}

// 2. 图标映射 - iconMapData
const iconMapStart = content.indexOf('iconMapData.push')
let iconCount = 0
if (iconMapStart >= 0) {
  // 统计所有 iconMapData.push 之后的 {name:,char:} 条目
  const pushCount = (content.match(/iconMapData\.push\(/g) || []).length
  console.log('\n  iconMapData.push 调用次数:', pushCount)

  // 统计 { name: 或 name: 的条目数
  iconCount = (content.match(/name:'[^']*'/g) || []).length
  console.log('  图标条目 (name:):', iconCount)
}

// 3. 命令处理器 - commands namespace
const cmdNsIdx = content.indexOf("addDoc('commands'")
let cmdCount = 0
if (cmdNsIdx >= 0) {
  let endIdx = content.indexOf("addDoc('", cmdNsIdx + 10)
  if (endIdx < 0) endIdx = content.length
  const slice = content.substring(cmdNsIdx, endIdx)
  cmdCount = (slice.match(/sig:'/g) || []).length
  console.log('  命令处理器:', cmdCount)
}

console.log('\n=== 最终统计 ===')
console.log('命名空间:', nsSet.size)
console.log('API 方法:', totalSigs)
console.log('图标映射:', iconCount)
console.log('命令处理器:', cmdCount)
