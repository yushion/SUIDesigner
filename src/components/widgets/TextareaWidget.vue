/**
 * @file TextareaWidget.vue
 * @description 多行文本框控件 - WinUI 3 风格
 */
<template>
  <textarea
    class="ui-widget textarea-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :placeholder="widget.placeholder || '请输入...'"
    :rows="textareaRows"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
    @mousedown.prevent
    readonly
  >{{ widget.value || '' }}</textarea>
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

const textareaRows = computed(() => {
  const r = props.widget.rows
  if (typeof r === 'number') return r
  return 4
})

const widgetStyle = computed(() => widgetBaseStyle(props.widget))
</script>

<style scoped>
.textarea-widget {
  position: absolute;
  outline: none;
  cursor: move;
  user-select: none;
  resize: none;
  box-sizing: border-box;
}


</style>