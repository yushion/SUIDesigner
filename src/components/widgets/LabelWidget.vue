/**
 * @file LabelWidget.vue
 * @description 文本标签控件 - WinUI 3 风格
 */
<template>
  <span
    class="ui-widget label-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
  >{{ widget.text || '标签' }}</span>
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
.label-widget {
  position: absolute;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
}


</style>