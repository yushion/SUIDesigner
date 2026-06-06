/**
 * @file RadioGroupWidget.vue
 * @description 单选组控件 - WinUI 3 风格
 */
<template>
  <div
    class="ui-widget radiogroup-widget"
    :class="[layoutClass, { selected: isSelected }]"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
  >
    <label v-for="(opt, i) in widget.options || ['选项1', '选项2']" :key="i">
      <input
        type="radio"
        :name="widget.name || widget.id"
        :value="opt"
        :checked="i === (widget.selectedIndex || 0)"
        @mousedown.prevent
        @click.prevent
        tabindex="-1"
      />{{ opt }}
    </label>
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

const widgetStyle = computed(() => widgetBaseStyle(props.widget))

const layoutClass = computed(() => {
  return props.widget.layout === 'horizontal' ? 'layout-horizontal' : 'layout-vertical'
})
</script>

<style scoped>
.radiogroup-widget {
  position: absolute;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
}

.radiogroup-widget.layout-vertical {
  flex-direction: column;
}

.radiogroup-widget.layout-horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.radiogroup-widget label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.radiogroup-widget label input[type="radio"] {
  margin: 0;
  cursor: pointer;
  accent-color: #0078d4;
  width: 16px;
  height: 16px;
  pointer-events: none;
}


</style>