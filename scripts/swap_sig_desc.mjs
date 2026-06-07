/**
 * 交换 webviewBridge_api_doc 中 sig 值和 desc 中 desctile 的内容
 * 
 * 原始: sig:'ApiName: <b>...</b>', desc:'<span class="desctile">设置控件值</span>...'
 * 目标: sig:'设置控件值', desc:'<span class="desctile">ApiName: <b>...</b></span>...'
 */
import { readFileSync, writeFileSync } from 'fs'

const filePath = process.argv[2]
if (!filePath) {
  console.error('用法: node swap_sig_desc.mjs <文件路径>')
  process.exit(1)
}

let content = readFileSync(filePath, 'utf-8')

/**
 * 正则说明:
 *   sig:'([^']*)'                  → 匹配 sig 的值（非贪婪）
 *   ,\s*desc:'                     → 匹配 , desc:'
 *   (<span class="desctile">)      → 捕获 desctile 开标签
 *   ([^<]*)                        → 捕获 desctile 内的标题文字
 *   (<\/span>)                      → 捕获 desctile 闭标签
 *   ([^']*)                        → 捕获 desc 剩余内容
 *   '                               → 结束引号
 */
const regex = /sig:'([^']*)',\s*desc:'(<span class="desctile">)([^<]*)(<\/span>)([^']*)'/g

let count = 0

content = content.replace(regex, (match, sigValue, spanOpen, titleText, spanClose, descRest) => {
  count++
  // 交换：sig 取原来的 title，desc 的 desctile 内放入原来的 sig
  return `sig:'${titleText}', desc:'${spanOpen}${sigValue}${spanClose}${descRest}'`
})

writeFileSync(filePath, content, 'utf-8')
console.log(`✅ 完成！共交换 ${count} 处 sig/desc 值`)
