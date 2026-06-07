import { readFileSync } from 'fs'

const content = readFileSync('public/webviewBridge_api_doc.html', 'utf-8')

// 检查 commands 和 iconmap
console.log('addDoc commands:', content.indexOf("addDoc('commands'"))
console.log('addDoc iconmap:', content.indexOf("addDoc('iconmap'"))

// 检查 iconMapData
const icmIdx = content.indexOf('iconMapData')
console.log('iconMapData 位置:', icmIdx)
if (icmIdx >= 0) {
  // 找到 iconMapData 整个变量定义区域
  const slice = content.substring(icmIdx, icmIdx + 500)
  console.log('iconMapData 附近:', slice.substring(0, 300))
}

// 检查 commands section 的 HTML
const cmdSecIdx = content.indexOf('id="section-commands"')
console.log('commands section HTML:', cmdSecIdx)
if (cmdSecIdx >= 0) {
  const slice = content.substring(cmdSecIdx, cmdSecIdx + 200)
  console.log(slice)
}

// 检查 iconmap section 的 HTML
const icmSecIdx = content.indexOf('id="section-iconmap"')
console.log('iconmap section HTML:', icmSecIdx)
if (icmSecIdx >= 0) {
  const slice = content.substring(icmSecIdx, icmSecIdx + 200)
  console.log(slice)
}

// 查找 commands 数据定义
const cmdDataIdx = content.indexOf("apiDocs['commands']")
console.log("\napiDocs['commands']:", cmdDataIdx)
if (cmdDataIdx >= 0) {
  const slice = content.substring(cmdDataIdx, cmdDataIdx + 300)
  console.log(slice)
}

// 查找 iconmap 数据定义
const icmDataIdx = content.indexOf("apiDocs['iconmap']")
console.log("apiDocs['iconmap']:", icmDataIdx)
if (icmDataIdx >= 0) {
  const slice = content.substring(icmDataIdx, icmDataIdx + 300)
  console.log(slice)
}
