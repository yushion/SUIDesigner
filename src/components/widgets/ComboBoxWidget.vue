/**
 * @file ComboBoxWidget.vue
 * @description 组合框控件 - WinUI 3 风格
 */
<template>
  <select
    class="ui-widget combo-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop.prevent="$emit('select', $event)"
    @mousedown.prevent
    @keydown.prevent
    @change.prevent
    tabindex="-1"
  >
    <option v-for="(opt, i) in widget.options || ['选项1', '选项2', '选项3']" :key="i" :value="opt" :selected="i === (widget.selectedIndex || 0)">
      {{ opt }}
    </option>
  </select>
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
.combo-widget {
  position: absolute;
  outline: none;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
  appearance: none;
  -webkit-appearance: none;
}


</style>