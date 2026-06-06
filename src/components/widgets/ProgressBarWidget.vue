/**
 * @file ProgressBarWidget.vue
 * @description 进度条控件 - WinUI 3 风格，支持可交互（仅点击）、进度文本隐藏、颜色自定义
 * 拖拽圆圈为纯视觉样式（独立于fill层外），交互由导出HTML的 PROGRESS_RUNTIME 处理
 */
<template>
  <div
    class="ui-widget progress-bar-widget"
    :class="{ selected: isSelected, interactive: isInteractive }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop="onClick"
  >
    <div class="progress-track"></div>
    <div class="progress-fill" :style="fillStyle"></div>
    <div
      v-if="hasThumb"
      class="progress-thumb"
      :style="{ left: `calc(${progressPercent}% - 10px)`, borderColor: barColor }"
    ></div>
    <span v-if="showText" class="progress-text" :style="textStyle">{{ progressPercent }}%</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '@/types/index'
import { widgetBaseStyle } from '@/utils/widgetStyleUtils'

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

const emit = defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

const progressPercent = computed(() => {
  const val = props.widget.progressValue ?? 0
  return Math.max(0, Math.min(100, val))
})

const barColor = computed(() => {
  return (props.widget.style as any).barColor || '#0078D4'
})

const showText = computed(() => {
  return props.widget.showProgressText !== false
})

const isInteractive = computed(() => {
  return !!(props.widget as any).editable
})

const hasThumb = computed(() => {
  return !!(props.widget as any).draggable
})

const widgetStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  return { ...base, overflow: 'visible' }
})

const fillStyle = computed(() => ({
  width: progressPercent.value + '%',
  backgroundColor: barColor.value,
  background: barColor.value,
}))

const textStyle = computed(() => {
  const s = props.widget.style as any
  return { color: s.valueColor }
})

function onClick(e: MouseEvent) {
  if (!isInteractive.value) {
    emit('select', e)
    return
  }
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
  ;(props.widget as any).progressValue = Math.round(pct)
}
</script>

<style scoped>
.progress-bar-widget {
  position: absolute;
  overflow: visible;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
}
.progress-bar-widget.interactive {
  cursor: pointer;
}

.progress-track {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  transition: width 0.15s;
  border-radius: inherit;
  overflow: visible;
}

/* 圆圈独立于fill层，绝对定位于bar-widget，不受fill裁剪 */
.progress-thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #0078D4;
  box-shadow: 0 1px 6px rgba(0,0,0,0.3);
  z-index: 3;
  pointer-events: none;
}

.progress-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: inherit;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  white-space: nowrap;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
