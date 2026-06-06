<!--
  PreviewCanvas.vue - SSR 预览画布组件
  渲染画布容器（含标题栏）和所有控件
  Props 驱动，无交互逻辑，专供 SSR 渲染
  外层 div 会被 htmlExporter 剥离，内部内容注入 page-container
-->
<template>
  <div class="ssr-canvas-content">
    <div
      v-if="canvasConfig.showTitleBar"
      class="canvas-titlebar"
      :style="titleBarStyle"
    >
      <div class="tb-left" :style="titleBarCellStyle">
        <span class="tb-icon" :style="titleBarIconStyle" v-html="titleBarSafeIcon"></span>
      </div>
      <div class="tb-center" :style="titleBarCenterStyle">
        <span class="tb-title" :style="titleBarTitleStyle">{{ canvasConfig.titleBarTitle || '我的应用' }}</span>
      </div>
      <div class="tb-right" :style="titleBarCellStyle">
        <button
          id="titlebar_min"
          class="tb-btn tb-btn-min"
          data-ctrl-type="titlebar_min"
          data-name="最小化"
          :style="titleBarBtnStyle"
          title="最小化"
        >
          <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
        </button>
        <button
          id="titlebar_max"
          class="tb-btn tb-btn-max"
          :class="{ 'tb-btn-disabled': canvasConfig.canvasFixedSize }"
          data-ctrl-type="titlebar_max"
          data-name="最大化"
          :style="canvasConfig.canvasFixedSize ? titleBarBtnDisabledStyle : titleBarBtnStyle"
          :disabled="canvasConfig.canvasFixedSize"
          title="最大化"
        >
          <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        </button>
        <button
          id="titlebar_close"
          class="tb-btn tb-btn-close"
          data-ctrl-type="titlebar_close"
          data-name="关闭"
          :style="titleBarCloseBtnStyle"
          title="关闭"
        >
          <svg width="10" height="10" viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2"/></svg>
        </button>
      </div>
    </div>

    <PreviewWidget
      v-for="widget in widgets"
      :key="widget.id"
      :widget="widget"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CanvasConfig, Widget } from '@/types/index'
import PreviewWidget from './PreviewWidget.vue'

const props = defineProps<{
  canvasConfig: CanvasConfig
  widgets: Widget[]
}>()

const esc = (s: string): string => {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const titleBarSafeIcon = computed(() => {
  const html = props.canvasConfig.titleBarIconHtml
  if (html && html.trim()) return html.replace(/<script[\s\S]*?<\/script>/gi, '')
  const name = props.canvasConfig.titleBarIconName || 'fa-star'
  const cls = name.includes(' ') ? name : `fas ${name}`
  return `<i class="${cls}"></i>`
})



const titleBarStyle = computed(() => ({
  display: 'flex' as const,
  alignItems: 'center' as const,
  position: 'absolute' as const,
  top: '0' as const,
  left: '0' as const,
  right: '0' as const,
  height: '40px' as const,
  backgroundColor: props.canvasConfig.titleBarBgColor,
  opacity: (props.canvasConfig.titleBarOpacity ?? 1) * (props.canvasConfig.masterOpacity ?? 1),
  userSelect: 'none' as const,
  zIndex: 10
}))

const titleBarCellStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  height: '40px'
}))

const titleBarIconStyle = computed(() => ({
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  color: props.canvasConfig.titleBarTextColor,
  flexShrink: 0
}))

const titleBarTitleStyle = computed(() => ({
  fontSize: '13px',
  fontWeight: 600,
  color: props.canvasConfig.titleBarTextColor,
  userSelect: 'none' as const,
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis' as const,
  whiteSpace: 'nowrap' as const
}))

const titleBarCenterStyle = computed(() => {
  const alignMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' }
  return {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    flex: 1,
    justifyContent: alignMap[props.canvasConfig.titleBarAlign] || 'flex-start'
  }
})

const titleBarBtnStyle = computed(() => ({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  color: props.canvasConfig.titleBarBtnColor || '#333',
  cursor: 'default',
  borderRadius: '4px',
  flexShrink: 0
}))

/** 最大化按钮禁用时的样式 */
const titleBarBtnDisabledStyle = computed(() => ({
  ...titleBarBtnStyle.value,
  opacity: 0.4,
  cursor: 'not-allowed',
  pointerEvents: 'none'
}))

const titleBarCloseBtnStyle = computed(() => ({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  color: props.canvasConfig.titleBarBtnColor || '#333',
  cursor: 'default',
  borderRadius: '4px',
  flexShrink: 0
}))
</script>