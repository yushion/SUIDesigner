/**
 * @file ImageBoxWidget.vue
 * @description 图片框控件 - 支持 object-fit 多种缩放模式
 */
<template>
  <div
    class="ui-widget image-box-widget"
    :class="{ selected: isSelected, 'has-error': imgError, disabled: widget.disabled }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="containerStyle"
    @click.stop="$emit('select', $event)"
  >
    <img
      v-if="widget.src && !imgError"
      :src="widget.src"
      :style="imgStyle"
      loading="lazy"
      draggable="false"
      @dragstart.prevent
      @error="imgError = true"
      @load="imgError = false"
      alt=""
      class="image-box-img"
    />
    <div v-if="!widget.src || imgError" class="image-placeholder">
      <span v-if="!widget.src" class="placeholder-icon">🖼</span>
      <span v-if="imgError" class="error-icon">⚠</span>
    </div>
    <div v-if="widget.disabled" class="disabled-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Widget } from '@/types/index'
import { widgetBaseStyle } from '@/utils/widgetStyleUtils'

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

const imgError = ref(false)

const fitMap: Record<string, string> = {
  fill: 'fill',
  contain: 'contain',
  cover: 'cover',
  'none-top-left': 'none',
  'none-center': 'none'
}

const positionMap: Record<string, string> = {
  fill: 'center',
  contain: 'center',
  cover: 'center',
  'none-top-left': 'top left',
  'none-center': 'center'
}

const containerStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  return {
    ...base,
    backgroundColor: props.widget.transparentBg ? 'transparent' : (props.widget.style.backgroundColor || undefined),
  } as any
})

const imgStyle = computed(() => ({
  objectFit: fitMap[props.widget.fit || 'cover'] || 'cover',
  objectPosition: props.widget.objectPosition || positionMap[props.widget.fit || 'cover'] || 'center',
  width: '100%',
  height: '100%',
  display: 'block'
} as any))
</script>

<style scoped>
.image-box-widget {
  position: absolute;
  overflow: hidden;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
}

.image-box-img {
  display: block;
}

.image-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.placeholder-icon {
  font-size: 32px;
  opacity: 0.3;
}

.error-icon {
  font-size: 28px;
  opacity: 0.5;
  color: #ff4d4f;
}

.disabled-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.image-box-widget.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>