/**
 * @file components/PropertyPanel/ColorPicker.vue
 * @description 颜色选择器封装组件，支持透明度滑块（输出 rgba 或 hex+alpha）
 *
 * 用于可视化样式表单中的背景色、文字色、边框色等颜色编辑。
 * 支持两种输出模式：
 *   - 'rgba': 输出 rgba(r, g, b, a) 格式
 *   - 'hex':   输出 #RRGGBB 格式（不含透明度时）
 */
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  /** 当前颜色值，支持 #RRGGBB / #RRGGBBAA / rgba() 格式 */
  modelValue: string
  /** 是否启用透明度滑块 */
  showAlpha?: boolean
  /** 输出模式：'rgba' 或 'hex' */
  outputMode?: 'rgba' | 'hex'
  /** 左侧标签文字 */
  label?: string
}>(), {
  showAlpha: true,
  outputMode: 'rgba',
  label: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const hexValue = computed({
  get: () => {
    const val = props.modelValue || '#ffffff'
    if (val.startsWith('rgba')) {
      const m = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
      if (m) {
        const r = parseInt(m[1]).toString(16).padStart(2, '0')
        const g = parseInt(m[2]).toString(16).padStart(2, '0')
        const b = parseInt(m[3]).toString(16).padStart(2, '0')
        return `#${r}${g}${b}`
      }
    }
    if (val.startsWith('#') && val.length >= 7) {
      return val.substring(0, 7)
    }
    return '#ffffff'
  },
  set: (v: string) => {
    if (props.showAlpha) {
      const a = alphaValue.value
      const r = parseInt(v.substring(1, 3), 16)
      const g = parseInt(v.substring(3, 5), 16)
      const b = parseInt(v.substring(5, 7), 16)
      emit('update:modelValue', `rgba(${r}, ${g}, ${b}, ${a})`)
    } else {
      emit('update:modelValue', v)
    }
  }
})

const alphaValue = computed({
  get: () => {
    const val = props.modelValue || '#ffffff'
    if (val.startsWith('rgba')) {
      const m = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
      if (m && m[4]) return parseFloat(m[4])
    }
    return 1
  },
  set: (a: number) => {
    const h = hexValue.value
    const r = parseInt(h.substring(1, 3), 16)
    const g = parseInt(h.substring(3, 5), 16)
    const b = parseInt(h.substring(5, 7), 16)
    emit('update:modelValue', `rgba(${r}, ${g}, ${b}, ${a})`)
  }
})
</script>

<template>
  <div class="color-picker">
    <label v-if="label" class="cp-label">{{ label }}</label>
    <div class="cp-row">
      <input
        type="color"
        :value="hexValue"
        @change="hexValue = ($event.target as HTMLInputElement).value"
        class="cp-input"
      />
      <input
        type="text"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="cp-text"
        placeholder="#ffffff 或 rgba(...)"
      />
    </div>
    <div v-if="showAlpha" class="cp-alpha-row">
      <span class="cp-alpha-label">透明度</span>
      <input
        type="range"
        :value="alphaValue * 100"
        @change="alphaValue = Number(($event.target as HTMLInputElement).value) / 100"
        min="0"
        max="100"
        step="1"
        class="cp-alpha-slider"
      />
      <span class="cp-alpha-val">{{ Math.round(alphaValue * 100) }}%</span>
    </div>
  </div>
</template>

<style scoped>
.color-picker { margin-bottom: 6px; }
.cp-label { display: block; font-size: 12px; color: #666; margin-bottom: 3px; }
.cp-row { display: flex; align-items: center; gap: 6px; }
.cp-input {
  width: 32px; height: 28px; padding: 1px;
  border: 1px solid #d9d9d9; border-radius: 4px; cursor: pointer; flex-shrink: 0;
}
.cp-text {
  flex: 1; height: 26px; padding: 2px 6px;
  border: 1px solid #d9d9d9; border-radius: 4px;
  font-size: 11px; color: #333; outline: none; min-width: 0;
}
.cp-text:focus { border-color: #409eff; }
.cp-alpha-row { display: flex; align-items: center; gap: 6px; margin-top: 3px; }
.cp-alpha-label { font-size: 11px; color: #999; flex-shrink: 0; }
.cp-alpha-slider { flex: 1; height: 4px; accent-color: #409eff; }
.cp-alpha-val { font-size: 11px; color: #666; width: 32px; text-align: right; flex-shrink: 0; }
</style>