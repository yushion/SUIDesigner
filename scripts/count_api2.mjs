import { readFileSync } from 'fs'

const content = readFileSync('public/webviewBridge_api_doc.html', 'utf-8')

// 图标映射 - 查找 icon_map 或 iconMap
const iconMapIdx = content.indexOf('icon_map')
const iconMapIdx2 = content.indexOf('ICON_MAP')
console.log('icon_map 位置:', iconMapIdx)
console.log('ICON_MAP 位置:', iconMapIdx2)

if (iconMapIdx >= 0) {
  const slice = content.substring(iconMapIdx, iconMapIdx + 200)
  console.log('icon_map 附近:', slice)
}
if (iconMapIdx2 >= 0) {
  const slice = content.substring(iconMapIdx2, iconMapIdx2 + 200)
  console.log('ICON_MAP 附近:', slice)
}

// 命令处理器
const cmdIdx = content.indexOf('commandHandlers')
const cmdIdx2 = content.indexOf('command_handler')
console.log('\ncommandHandlers 位置:', cmdIdx)
console.log('command_handler 位置:', cmdIdx2)

if (cmdIdx >= 0) {
  const slice = content.substring(cmdIdx, cmdIdx + 200)
  console.log('commandHandlers 附近:', slice)
}

// 查找图标数据: 可能是 JSON 对象形式
const iconPattern = content.match(/'([^']+)':\s*'([^']+)'/g)
if (iconPattern) {
  console.log('\n发现键值对模式 (可能是图标映射):', iconPattern.length, '个')
  console.log('示例:', iconPattern.slice(0, 3))
}

// 查找 function 定义在数据块中
const funcPattern = content.match(/function\s*\(/g)
console.log('\nfunction 定义:', funcPattern ? funcPattern.length : 0, '个')
