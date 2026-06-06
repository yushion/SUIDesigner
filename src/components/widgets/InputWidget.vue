/**
 * @file InputWidget.vue
 * @description 单行编辑框控件 - WinUI 3 风格
 */
<template>
  <input
    class="ui-widget input-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :type="widget.inputType || 'text'"
    :placeholder="widget.placeholder || '请输入...'"
    :value="widget.value || ''"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
    @mousedown.prevent
    readonly
  />
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

const widgetStyle = computed(() => widgetBaseStyle(props.widget))
</script>

<style scoped>
.input-widget {
  position: absolute;
  outline: none;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
}


</style>