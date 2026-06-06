/**
 * @file config/widgetsDefaultConfig.ts
 * @description 控件库元数据（向后兼容层）—— 委托给统一注册中心 widgetRegistry
 */

import type { WidgetType } from '@/types/index'
import { getWidgetLibraryItems } from './widgetRegistry'

/** 控件库条目元数据 */
export interface WidgetLibraryMeta {
  label: string
  icon: string
}

/** 控件库条目映射（委托给 widgetRegistry） */
export const widgetsDefaultConfig: Record<string, WidgetLibraryMeta> = (() => {
  const result: Record<string, WidgetLibraryMeta> = {}
  for (const item of getWidgetLibraryItems()) {
    result[item.type] = { label: item.label, icon: item.icon }
  }
  return result
})()