import { readFileSync } from 'fs'

const content = readFileSync('public/webviewBridge_api_doc.html', 'utf-8')

// 统计命名空间（侧边栏showSection调用的唯一section名）
const sectionMatches = [...content.matchAll(/showSection\('([^']+)'/g)]
const nsSet = new Set(sectionMatches.map(m => m[1]))

// 统计API方法 (sig: 出现次数)
const sigCount = (content.match(/sig:'/g) || []).length

// 统计每个section下的API数量
const sections = {}
for (const ns of nsSet) {
  const sectionIdx = content.indexOf('id="section-' + ns + '"')
  if (sectionIdx < 0) continue
  let endIdx = content.indexOf('id="section-', sectionIdx + 10)
  if (endIdx < 0) endIdx = content.length
  const slice = content.substring(sectionIdx, endIdx)
  const count = (slice.match(/sig:'/g) || []).length
  sections[ns] = count
}

// 图标映射 section 中的键值对
const iconmapIdx = content.indexOf('id="section-iconmap"')
let iconMapEntries = 0
if (iconmapIdx >= 0) {
  let endIdx = content.indexOf('id="section-', iconmapIdx + 10)
  if (endIdx < 0) endIdx = content.length
  const slice = content.substring(iconmapIdx, endIdx)
  // 统计 <tr> 行数（排除表头）
  const rows = [...slice.matchAll(/<tr>/g)]
  iconMapEntries = rows.length > 1 ? rows.length - 1 : 0
  console.log('图标映射表行数:', rows.length)
}

// 命令处理器 section  
const commandsIdx = content.indexOf('id="section-commands"')
let cmdHandlerCount = 0
if (commandsIdx >= 0) {
  let endIdx = content.indexOf('id="section-', commandsIdx + 10)
  if (endIdx < 0) endIdx = content.length
  const slice = content.substring(commandsIdx, endIdx)
  cmdHandlerCount = (slice.match(/sig:'/g) || []).length
}

console.log('\n=== 统计结果 ===')
console.log('命名空间:', nsSet.size)
console.log('API 方法:', sigCount)
console.log('图标映射:', iconMapEntries)
console.log('命令处理器:', cmdHandlerCount)
console.log('\n各命名空间API数量:')
for (const [ns, count] of Object.entries(sections).sort()) {
  console.log(`  ${ns}: ${count}`)
}
