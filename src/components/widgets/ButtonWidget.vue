/**
 * @file ButtonWidget.vue
 * @description 按钮控件 - WinUI 3 风格
 */
<template>
  <button
    class="ui-widget btn-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
  >{{ widget.text || '按钮' }}</button>
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

const widgetStyle = computed(() => widgetButtonStyle(props.widget))
</script>

<style scoped>
.btn-widget {
  position: absolute;
  cursor: move;
  user-select: none;
  outline: none;
  box-sizing: border-box;
}


</style>