/**
 * @file ToggleWidget.vue
 * @description 开关控件 - WinUI 3 风格
 */
<template>
  <label
    class="ui-widget toggle-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="widgetStyle"
    @click.stop="$emit('select', $event)"
  >
    <input type="checkbox" :checked="widget.checked" @mousedown.prevent @click.prevent tabindex="-1" />
    <span class="slider" :style="sliderStyle"></span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '@/types/index'

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

const widgetStyle = computed(() => {
  const halfH = Math.round(props.widget.style.height / 2)
  return {
    left: props.widget.style.left + 'px',
    top: props.widget.style.top + 'px',
    width: props.widget.style.width + 'px',
    height: props.widget.style.height + 'px',
    zIndex: props.widget.style.zIndex ?? 1,
    borderRadius: halfH + 'px',
    opacity: props.widget.style.opacity,
    filter: props.widget.disabled ? 'grayscale(1)' : undefined
  }
})

const sliderStyle = computed(() => {
  const s = props.widget.style as any
  const halfH = Math.round(props.widget.style.height / 2)
  return {
    '--track-color': s.trackColor || '#cccccc',
    '--active-track-color': s.activeTrackColor || '#0078d4',
    '--knob-color': s.knobColor || '#ffffff',
    borderRadius: halfH + 'px',
  } as Record<string, string>
})
</script>

<style scoped>
.toggle-widget {
  position: absolute;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
}

.toggle-widget input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  z-index: 1;
  cursor: pointer;
  pointer-events: none;
}

.toggle-widget .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--track-color, #cccccc);
  transition: 0.3s;
  border-radius: 26px;
}

.toggle-widget .slider::before {
  content: '';
  position: absolute;
  height: calc(100% - 4px);
  width: calc(50% - 4px);
  left: 2px;
  bottom: 2px;
  background-color: var(--knob-color, #ffffff);
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.toggle-widget input:checked + .slider {
  background-color: var(--active-track-color, #0078d4);
}

.toggle-widget input:checked + .slider::before {
  transform: translateX(100%);
}


</style>