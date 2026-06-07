import { readFileSync } from 'fs'

const content = readFileSync('public/webviewBridge_api_doc.html', 'utf-8')

// 统计命名空间: 侧边栏中 showSection 的唯一section名
const sectionMatches = [...content.matchAll(/showSection\('([^']+)'/g)]
const namespaceSet = new Set(sectionMatches.map(m => m[1]))

// 统计 API 方法: sig: 出现次数
const sigCount = (content.match(/sig:'/g) || []).length

// 统计图标映射: 查找 ICON_MAP 中的条目
const iconMapStart = content.indexOf('ICON_MAP')
let iconCount = 0
if (iconMapStart >= 0) {
  const slice = content.substring(iconMapStart, iconMapStart + 50000)
  // 查找 name:'xxx' 模式
  iconCount = (slice.match(/name:'/g) || []).length
}

// 统计命令处理器: commandHandlers 中的函数
const cmdHandlerStart = content.indexOf('static commandHandlers')
let cmdCount = 0
if (cmdHandlerStart >= 0) {
  const slice = content.substring(cmdHandlerStart, cmdHandlerStart + 30000)
  cmdCount = (slice.match(/:\s*function/g) || []).length
}

console.log('命名空间:', namespaceSet.size)
console.log('API 方法:', sigCount)
console.log('图标映射:', iconCount)
console.log('命令处理器:', cmdCount)

// 同时也看看有多少个 section div
const sectionDivs = (content.match(/id="section-/g) || []).length
console.log('Section ID数:', sectionDivs)

// 列出所有命名空间
console.log('\n命名空间列表:', [...namespaceSet].sort().join(', '))
