/**
 * @file config/widgetRegistry.ts
 * @description 控件统一注册中心 —— 所有控件类型相关配置的单一真相源
 *
 * 代替原来的 7 处硬编码注册表：
 *   - WidgetType 联合类型
 *   - widgetsDefaultConfig（库面板元数据）
 *   - allWidgetDefaults（JSON 配置）
 *   - widgetComponentMap（画布渲染组件）
 *   - childComponentMap ×2（TabsContainer / CardBoxWidget）
 *   - htmlExporter switch/case
 *   - cssParser CHILD_SELECTOR_MAP
 */

import type { WidgetJSONConfig } from '@/types/index'
import type { Widget } from '@/types/index'

/** 子选择器 CSS 属性到 widget.style 属性的映射 */
export type ChildSelectorMap = Record<string, Record<string, string>>

/** 控件注册项 */
export interface WidgetRegistration {
  type: string
  label: string
  icon: string
  jsonConfig: WidgetJSONConfig
  /** 设计区渲染用的 Vue 组件 */
  vueComponent?: any
  /** 导出/预览 HTML 生成函数 */
  htmlExporter?: (widget: Widget) => string
  /** 子选择器 CSS 属性映射表 */
  childSelectorMap?: ChildSelectorMap
}

// ---- 内部存储 ----

const _meta = new Map<string, { label: string; icon: string }>()
const _configs = new Map<string, WidgetJSONConfig>()
const _components = new Map<string, any>()
const _exporters = new Map<string, (widget: Widget) => string>()
const _childSelectorMaps = new Map<string, ChildSelectorMap>()

// ---- 注册 API ----

/** 注册一个控件类型（内置控件在 registerAllWidgets.ts 中调用） */
export function registerWidget(reg: WidgetRegistration): void {
  _meta.set(reg.type, { label: reg.label, icon: reg.icon })
  _configs.set(reg.type, reg.jsonConfig)
  if (reg.vueComponent) {
    _components.set(reg.type, reg.vueComponent)
  }
  if (reg.htmlExporter) {
    _exporters.set(reg.type, reg.htmlExporter)
  }
  if (reg.childSelectorMap) {
    _childSelectorMaps.set(reg.type, reg.childSelectorMap)
  }
}

// ---- 查询 API ----

/** 获取控件库面板展示条目列表 */
export function getWidgetLibraryItems(): Array<{ type: string; label: string; icon: string }> {
  const items: Array<{ type: string; label: string; icon: string }> = []
  for (const [type, meta] of _meta.entries()) {
    items.push({ type, label: meta.label, icon: meta.icon })
  }
  return items
}

/** 获取控件 JSON 配置 */
export function getWidgetJSONConfig(type: string): WidgetJSONConfig | undefined {
  return _configs.get(type)
}

/** 获取所有控件 JSON 配置（供 cssGenerator 批量使用） */
export function getAllWidgetJSONConfigs(): Record<string, WidgetJSONConfig> {
  const result: Record<string, WidgetJSONConfig> = {}
  for (const [type, config] of _configs.entries()) {
    result[type] = config
  }
  return result
}

/** 获取控件 Vue 渲染组件 */
export function getWidgetComponent(type: string): any {
  return _components.get(type) || 'div'
}

/** 获取控件导出 HTML 函数 */
export function getWidgetExporter(type: string): ((widget: Widget) => string) | undefined {
  return _exporters.get(type)
}

/** 获取控件子选择器 CSS 属性映射表 */
export function getChildSelectorMap(type: string): ChildSelectorMap | undefined {
  return _childSelectorMaps.get(type)
}

/** 检查控件类型是否已注册 */
export function isWidgetRegistered(type: string): boolean {
  return _meta.has(type)
}
