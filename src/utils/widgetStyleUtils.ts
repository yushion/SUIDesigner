/**
 * @file utils/widgetStyleUtils.ts
 * @description 控件 :style 内联样式生成工具 —— 统一管理定位 + 视觉属性
 *
 * 所有 fallback 值都由 widgetDefaults JSON + cssGenerator 处理，
 * 此处仅绑定 widget.style 中已有的值，不提供任何硬编码 fallback。
 */

import type { Widget } from '@/types/index'

/**
 * 基础定位 + 通用视觉样式（适用于所有简单控件）
 * 不包含 justifyContent/textDecoration 等特殊属性
 */
export function widgetBaseStyle(widget: Widget) {
  const s = widget.style as any
  return {
    left: s.left + 'px',
    top: s.top + 'px',
    width: s.width + 'px',
    height: s.height + 'px',
    zIndex: s.zIndex ?? 1,
    fontSize: s.fontSize ? s.fontSize + 'px' : undefined,
    padding: s.padding ? s.padding + 'px' : undefined,
    textAlign: s.textAlign || undefined,
    backgroundColor: s.backgroundColor || undefined,
    color: s.color || undefined,
    borderColor: s.borderColor || undefined,
    borderWidth: s.borderWidth !== undefined ? s.borderWidth + 'px' : undefined,
    borderStyle: s.borderStyle || undefined,
    borderRadius: s.borderRadius !== undefined ? s.borderRadius + 'px' : undefined,
    opacity: s.opacity,
    filter: widget.disabled ? 'grayscale(1)' : undefined,
  }
}

/**
 * 基础定位 + justifyContent（适用于按钮类控件）
 */
export function widgetButtonStyle(widget: Widget) {
  const s = widget.style as any
  const base = widgetBaseStyle(widget)
  return {
    ...base,
    justifyContent: s.textAlign === 'left' ? 'flex-start'
      : s.textAlign === 'right' ? 'flex-end'
      : s.textAlign || undefined,
  }
}

/**
 * 基础定位 + textDecoration（适用于超链接控件）
 */
export function widgetHyperlinkStyle(widget: Widget) {
  const base = widgetBaseStyle(widget)
  return {
    ...base,
    textDecoration: (widget as any).showUnderline !== false ? 'underline' : 'none',
  }
}
