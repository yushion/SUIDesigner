/**
 * @file CustomWidget.vue
 * @description 自定义控件通用渲染器 — 通过 v-html 渲染第三方控件模板
 *
 * 支持 {{propName}} 模板变量替换，变量来源于 widget 对象的同名属性。
 */
<template>
  <div
    class="ui-widget custom-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="containerStyle"
    @click.stop
  >
    <div class="custom-widget-content" v-html="renderedHTML"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '@/types/index'
import { widgetBaseStyle } from '@/utils/widgetStyleUtils'
import { getCustomWidgetConfig } from '@/config/customWidgetAPI'

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

/** 容器定位样式 */
const containerStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  const s = props.widget.style as any
  return {
    ...base,
    color: s.color || undefined,
    fontFamily: s.fontFamily || undefined,
    fontSize: s.fontSize ? s.fontSize + 'px' : undefined,
  } as any
})

/** 渲染后的 HTML（模板变量替换） */
const renderedHTML = computed(() => {
  const config = getCustomWidgetConfig(props.widget.type)
  if (!config) return `<div style="padding:8px;color:#999;">未知控件: ${props.widget.type}</div>`

  let html = config.htmlTemplate

  // 模板变量替换：{{propName}} → widget[propName]
  html = html.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = (props.widget as any)[key]
    if (value === undefined || value === null) return ''
    // 不做 HTML 转义，允许模板包含 HTML 标签
    return String(value)
  })

  return html
})
</script>

<style scoped>
.custom-widget {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
}

.custom-widget-content {
  width: 100%;
  height: 100%;
}
</style>
