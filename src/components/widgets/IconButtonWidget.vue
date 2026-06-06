/**
 * @file IconButtonWidget.vue
 * @description 图标按钮控件 - 支持 Font Awesome 字体图标 + 自定义 HTML 图标
 */
<template>
  <button
    class="ui-widget icon-btn-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
    :disabled="widget.disabled"
  >
    <span v-if="widget.iconPosition !== 'right' || !widget.text" class="icon-wrapper" v-html="safeIconHtml"></span>
    <span v-if="widget.text && widget.iconPosition !== 'icon-only'" class="btn-text">{{ widget.text }}</span>
    <span v-if="widget.iconPosition === 'right' && widget.text" class="icon-wrapper" v-html="safeIconHtml"></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '@/types/index'
import { widgetButtonStyle } from '@/utils/widgetStyleUtils'

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

const safeIconHtml = computed(() => {
  const html = props.widget.iconHtml
  if (html && html.trim()) {
    return html.replace(/<script[\s\S]*?<\/script>/gi, '')
  }
  const name = props.widget.iconName || 'fa-star'
  const cls = name.includes(' ') ? name : `fas ${name}`
  return `<i class="${cls}"></i>`
})

const widgetStyle = computed(() => widgetButtonStyle(props.widget))
</script>

<style scoped>
.icon-btn-widget {
  position: absolute;
  cursor: move;
  user-select: none;
  outline: none;
  box-sizing: border-box;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper :deep(i) {
  font-size: inherit;
  line-height: 1;
}

.icon-wrapper :deep(img) {
  max-width: 20px;
  height: auto;
  vertical-align: middle;
}

.icon-wrapper :deep(svg) {
  max-width: 20px;
  height: auto;
  vertical-align: middle;
}

.btn-text {
  pointer-events: none;
}
</style>