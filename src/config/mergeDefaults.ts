/**
 * @file config/mergeDefaults.ts
 * @description 控件 JSON 配置查询（向后兼容层）—— 委托给统一注册中心 widgetRegistry
 */

import type { WidgetJSONConfig } from '@/types/index'
import { getWidgetJSONConfig } from './widgetRegistry'

/** 获取控件 JSON 配置 */
export function getWidgetDefaultConfig(type: string): WidgetJSONConfig | undefined {
  return getWidgetJSONConfig(type)
}