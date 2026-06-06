/**
 * @file DividerWidget.vue
 * @description 分割线控件 — 以 border-top 绘制线条，支持实线/虚线/点线/双线
 */
<template>
  <div
    class="ui-widget divider-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '@/types/index'

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

const widgetStyle = computed(() => ({
  left: props.widget.style.left + 'px',
  top: props.widget.style.top + 'px',
  width: props.widget.style.width + 'px',
  height: props.widget.style.height + 'px',
  zIndex: props.widget.style.zIndex ?? 1,
  borderTopWidth: props.widget.style.height + 'px',
  borderTopStyle: (props.widget.style.lineStyle || 'solid') as string,
  borderTopColor: props.widget.style.borderColor || '#D0D0D0',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottom: 'none',
  opacity: props.widget.style.opacity,
  filter: props.widget.disabled ? 'grayscale(1)' : undefined
} as any))
</script>

<style scoped>
.divider-widget {
  position: absolute;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
}
</style>