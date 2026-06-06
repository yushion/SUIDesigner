/**
 * @file TooltipWidget.vue
 * @description 气泡提示框控件 - 设计区显示虚线边框，运行时通过 webviewBridge 动态显示
 */
<template>
  <div
    class="ui-widget tooltip-widget"
    :class="{ selected: isSelected, disabled: widget.disabled }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="containerStyle"
    @click.stop="$emit('select', $event)"
  >
    <div class="tt-label">
      <span>{{ displayText }}</span>
    </div>
    <div class="tt-hint">提示框: <span class="hint-tips">{{ triggerLabel }}</span></div>
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

defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

const triggerMap: Record<string, string> = {
  hover: '悬停',
  click: '单击',
  focus: '聚焦'
}

const triggerLabel = computed(() => {
  return triggerMap[props.widget.tooltipTrigger || 'hover'] || '悬停'
})

const displayText = computed(() => {
  const targetId = props.widget.tooltipTargetId
  if (!targetId) return '🔓未绑定'
  return '🔒' + targetId
})

const containerStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  return {
    ...base,
    backgroundColor: props.widget.style.backgroundColor || undefined,
  }
})
</script>

<style scoped>
.tooltip-widget {
  position: absolute;
  overflow: hidden;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
      display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    overflow: hidden;
}

.tt-label {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.tt-hint {
  font-size: 11px;
  color: #999;
}

.tt-hint .hint-tips {
  color: #0f667b;
}
</style>