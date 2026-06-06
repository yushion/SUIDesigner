/**
 * @file CheckboxWidget.vue
 * @description 复选框控件 - WinUI 3 风格
 */
<template>
  <label
    class="ui-widget checkbox-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
  >
    <input type="checkbox" :checked="widget.checked" @mousedown.prevent @click.prevent tabindex="-1" />
    <span>{{ widget.labelText || '选项' }}</span>
  </label>
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
.checkbox-widget {
  position: absolute;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
}

.checkbox-widget input[type="checkbox"] {
  margin-right: 6px;
  cursor: pointer;
  pointer-events: none;
}


</style>