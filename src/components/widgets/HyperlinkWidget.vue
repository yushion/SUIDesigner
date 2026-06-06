/**
 * @file HyperlinkWidget.vue
 * @description 超链接控件 - WinUI 3 风格
 */
<template>
  <a
    class="ui-widget hyperlink-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    href="javascript:void(0)"
    :data-href="widget.href || '#'"
    :style="widgetStyle"
    draggable="false"
    @dragstart.prevent
    @click.prevent.stop="$emit('select', $event)"
  >{{ widget.text || '超链接' }}</a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '@/types/index'
import { widgetHyperlinkStyle } from '@/utils/widgetStyleUtils'

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

const widgetStyle = computed(() => widgetHyperlinkStyle(props.widget))
</script>

<style scoped>
.hyperlink-widget {
  position: absolute;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
}


</style>