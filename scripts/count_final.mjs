import { readFileSync } from 'fs'

const content = readFileSync('public/webviewBridge_api_doc.html', 'utf-8')

// 统计 addDoc 调用的命名空间
const addDocMatches = [...content.matchAll(/addDoc\('([^']+)'/g)]
const nsSet = new Set(addDocMatches.map(m => m[1]))

// 统计所有 API (sig:)
const totalSigs = (content.match(/sig:'/g) || []).length

// 统计每命名空间的方法数
const nsCounts = {}
for (const ns of nsSet) {
  const idx = content.indexOf("addDoc('" + ns + "'")
  let endIdx = content.indexOf("addDoc('", idx + 10)
  if (endIdx < 0) endIdx = content.length
  const slice = content.substring(idx, endIdx)
  nsCounts[ns] = (slice.match(/sig:'/g) || []).length
}

// 统计 commandsData
const cmdStart = content.indexOf('var commandsData')
const cmdEnd = content.indexOf('];', cmdStart)
let cmdCount = 0
if (cmdStart >= 0 && cmdEnd >= 0) {
  const slice = content.substring(cmdStart, cmdEnd + 2)
  cmdCount = (slice.match(/\{cmd:'/g) || []).length
}

// 统计 iconMapData
const iconStart = content.indexOf('iconMapData = [];')
const iconVal = content.substring(iconStart, iconStart + 50)
console.log('iconMapData:', iconVal)
// iconMapData 是空数组

console.log('=== 重新统计 ===')
console.log('命名空间:', nsSet.size)
console.log('API 方法:', totalSigs)
console.log('命令处理器 (commandsData):', cmdCount)
console.log('图标映射 (iconMapData):', 0, '(空数组，数据未加载)')
console.log('\n各命名空间详情:')
let checkSum = 0
for (const [ns, count] of Object.entries(nsCounts).sort()) {
  console.log(`  ${ns}: ${count}`)
  checkSum += count
}
console.log(`  合计: ${checkSum}`)
