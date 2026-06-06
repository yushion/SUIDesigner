/**
 * @file config/customWidgetAPI.ts
 * @description 第三方自定义控件 API — 纯配置式（JSON + HTML 模板，无需写 Vue 组件）
 *
 * 使用方式：
 *   import { registerCustomWidget } from '@/config/customWidgetAPI'
 *
 *   registerCustomWidget({
 *     type: 'myWidget',
 *     label: '我的控件',
 *     icon: '⭐',
 *     jsonConfig: { ... },
 *     htmlTemplate: '<div class="my-widget">{{title}}</div>',
 *     cssString: '.my-widget { color: red; }',
 *   })
 */

import { registerWidget } from './widgetRegistry'
import type { WidgetJSONConfig } from '@/types/index'
import type { Widget } from '@/types/index'
import CustomWidget from '@/components/widgets/CustomWidget.vue'

/** 自定义控件注册配置 */
export interface CustomWidgetConfig {
  /** 唯一控件类型标识（如 "myWidget"，不能与内置控件重名） */
  type: string
  /** 控件库展示名称 */
  label: string
  /** 图标字符 */
  icon: string
  /** 控件 JSON 配置（与 widgetDefaults/*.json 格式一致） */
  jsonConfig: WidgetJSONConfig
  /** HTML 模板字符串，支持 {{propName}} 变量替换 */
  htmlTemplate: string
  /** 可选：注入到导出页面的自定义 CSS */
  cssString?: string
}

// ---- 内部存储 ----

const _customConfigs = new Map<string, CustomWidgetConfig>()

// ---- 公开 API ----

/**
 * 注册一个自定义控件
 *
 * 控件会在设计区通过 v-html 渲染 HTML 模板，在导出/预览时直接输出模板。
 * `{{propName}}` 会替换为控件的对应属性值。
 */
export function registerCustomWidget(config: CustomWidgetConfig): void {
  const { type, label, icon, jsonConfig, htmlTemplate, cssString } = config

  if (!type || !label) {
    console.error('[customWidgetAPI] 注册失败：type 和 label 不能为空')
    return
  }

  _customConfigs.set(type, config)

  // 注册到统一注册中心
  registerWidget({
    type,
    label,
    icon,
    jsonConfig,
    vueComponent: CustomWidget,
    htmlExporter: (widget: Widget) => renderCustomWidgetHTML(type, widget),
  })
}

/** 获取自定义控件配置 */
export function getCustomWidgetConfig(type: string): CustomWidgetConfig | undefined {
  return _customConfigs.get(type)
}

/** 是否已注册指定类型的自定义控件 */
export function isCustomWidget(type: string): boolean {
  return _customConfigs.has(type)
}

/** 获取所有已注册的自定义控件 CSS（注入到导出页面） */
export function getAllCustomWidgetCSS(): string {
  let css = ''
  for (const config of _customConfigs.values()) {
    if (config.cssString) {
      css += `/* ${config.type} - ${config.label} */\n${config.cssString}\n`
    }
  }
  return css
}

// ---- 内部工具 ----

/** 渲染 HTML 模板 → 替换 {{prop}} 为控件属性值 */
export function renderCustomWidgetHTML(type: string, widget: Widget): string {
  const config = _customConfigs.get(type)
  if (!config) return `<div data-error="unknown type: ${type}">Unknown Widget</div>`

  let html = config.htmlTemplate

  // 模板变量替换：{{propName}} → widget[propName]
  html = html.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = (widget as any)[key]
    if (value === undefined || value === null) return ''
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  })

  // 注入 data 属性
  const attrs = `id="${widget.id}" data-type="${type}" data-ctrl-type="${type}" data-ctrl-id="${widget.id}" data-name="${widget.name || widget.id}"`
  const style = `position:absolute;left:${widget.style.left}px;top:${widget.style.top}px;width:${widget.style.width}px;height:${widget.style.height}px;z-index:${widget.style.zIndex || 1};box-sizing:border-box;`

  return `<div ${attrs} style="${style}">${html}</div>`
}
