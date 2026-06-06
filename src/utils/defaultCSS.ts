/**
 * @file utils/defaultCSS.ts
 * @description 为每种控件类型生成完整的默认 customCSS 源码模板
 */
import type { Widget } from '@/types/index'
import { generateWidgetCSS } from '@/utils/cssGenerator'
import { getWidgetDefaultConfig } from '@/config/mergeDefaults'

/**
 * 将控件样式属性转换为 CSS 声明块（不含选择器和花括号）
 */
function styleToDeclarations(widget: Widget): string {
  const s = widget.style
  const lines: string[] = []
  lines.push(`  position: absolute;`)
  lines.push(`  left: ${s.left}px;`)
  lines.push(`  top: ${s.top}px;`)
  lines.push(`  width: ${s.width}px;`)
  lines.push(`  height: ${s.height}px;`)
  lines.push(`  box-sizing: border-box;`)
  return lines.join('\n')
}

/**
 * 根据控件类型生成完整的默认 customCSS 源码
 * 从 JSON 配置方案生成
 */
export function generateDefaultCustomCSS(widget: Widget): string {
  const jsonConfig = getWidgetDefaultConfig(widget.type)
  if (jsonConfig && widget.styleData) {
    return generateWidgetCSS(widget, jsonConfig)
  }

  return `/* ${widget.name || widget.id} - 基础样式 */
#${widget.id} {
${styleToDeclarations(widget)}
}
`
}