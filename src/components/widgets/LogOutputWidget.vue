/**
 * @file LogOutputWidget.vue
 * @description 日志输出控件 - 只读多行日志展示，超出自滚动
 */
<template>
  <div
    class="ui-widget log-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
    @mousedown.prevent
  >
    <div
      v-for="(log, idx) in widget.logs || []"
      :key="idx"
      class="log-line"
      :style="{ color: log.color || '#000000' }"
    >{{ log.text }}</div>
    <div v-if="!(widget.logs || []).length" class="log-line log-empty">（无日志）</div>
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
</script>

<style scoped>
.log-widget {
  position: absolute;
  overflow-x: auto;
  overflow-y: auto;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
  white-space: nowrap;
}

.log-line {
  font-size: inherit;
  line-height: 1.5;
  padding: 2px 5px;
  min-height: 1.2em;
}

.log-empty {
  color: #999;
  font-style: italic;
}
</style>