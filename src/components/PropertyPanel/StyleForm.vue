/**
 * @file components/PropertyPanel/StyleForm.vue
 * @description 可视化样式表单 - 替代 Monaco CSS 编辑器
 *
 * 提供控件的所有视觉样式属性的可视化编辑控件（颜色选择器、滑块、下拉框等），
 * 每个控件通过 @input 实时更新 store 中的 widget.style，触发画布重绘。
 *
 * 包含的编辑项：
 *   - 位置: left, top (px 数字输入)
 *   - 尺寸: width, height (px 数字输入, ≥20)
 *   - 背景色: backgroundColor (ColorPicker + 透明度)
 *   - 文字色: color (ColorPicker)
 *   - 字号: fontSize (滑块 8-72 + 数字输入)
 *   - 字体: fontFamily (下拉选择)
 *   - 圆角: borderRadius (滑块 0-50)
 *   - 透明度: opacity (滑块 0-1, 步长0.01)
 *   - 边框宽度: borderWidth (数字 0-10)
 *   - 边框颜色: borderColor (ColorPicker)
 *   - 内边距: padding (数字 0-50)
 *   - zIndex: (只读显示)
 */
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import type { Widget } from '@/types/index'
import ColorPicker from './ColorPicker.vue'

const props = defineProps<{
  widget: Widget
}>()

const store = useWidgetStore()

const style = computed(() => props.widget.styleData?.base || {})

const defaultZone = computed(() => props.widget.type === 'tabsContainer' || props.widget.type === 'cardBox')

function onStyleChange(key: string, event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement
  let value: any = target.value

  if (key === 'fontSize' || key === 'borderRadius' || key === 'borderWidth' || key === 'padding') {
    value = parseFloat(value)
  }

  store.updateWidgetStyle(props.widget.id, { [key]: value })
}

function onColorChange(key: string, value: string) {
  store.updateWidgetStyle(props.widget.id, { [key]: value })
}

function onOpacityInput(event: Event) {
  const target = event.target as HTMLInputElement
  store.updateWidgetStyle(props.widget.id, { opacity: parseFloat(target.value) })
}

const shadowX = ref(0)
const shadowY = ref(2)
const shadowBlur = ref(5)
const shadowSpread = ref(0)
const shadowColor = ref('rgba(0,0,0,0.3)')

watch(() => props.widget.styleData?.base?.boxShadow, (val) => {
  if (!val || typeof val !== 'string') return
  const match = val.match(/([\d.-]+)px\s+([\d.-]+)px\s+([\d.-]+)px\s+([\d.-]+)px\s+(.+)/)
  if (match) {
    shadowX.value = parseFloat(match[1])
    shadowY.value = parseFloat(match[2])
    shadowBlur.value = parseFloat(match[3])
    shadowSpread.value = parseFloat(match[4])
    shadowColor.value = match[5].trim()
  }
}, { immediate: true })

const computedShadow = computed(() =>
  `${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px ${shadowSpread.value}px ${shadowColor.value}`
)

function onShadowChange(event: Event, part?: string) {
  const target = event.target as HTMLInputElement
  const val = parseFloat(target.value) || 0
  if (part === 'y') shadowY.value = val
  else if (part === 'blur') shadowBlur.value = val
  else if (part === 'spread') shadowSpread.value = val
  else shadowX.value = val
  store.updateWidgetStyle(props.widget.id, { boxShadow: computedShadow.value })
}

function onShadowColorChange(value: string) {
  shadowColor.value = value
  store.updateWidgetStyle(props.widget.id, { boxShadow: computedShadow.value })
}
</script>

<template>
  <div class="style-form">
    <div class="sf-section-title">位置与尺寸</div>
    <div class="sf-row">
      <div class="sf-field">
        <label>X (left)</label>
        <input
          type="number"
          :value="Math.round(style.left ?? 0)"
          @input="onStyleChange('left', $event)"
          class="sf-num"
        />
      </div>
      <div class="sf-field">
        <label>Y (top)</label>
        <input
          type="number"
          :value="Math.round(style.top ?? 0)"
          @input="onStyleChange('top', $event)"
          class="sf-num"
        />
      </div>
    </div>
    <div class="sf-row">
      <div class="sf-field">
        <label>宽 (width)</label>
        <input
          type="number"
          :value="Math.round(style.width ?? 100)"
          @input="onStyleChange('width', $event)"
          class="sf-num"
          min="20"
        />
      </div>
      <div class="sf-field">
        <label>高 (height)</label>
        <input
          type="number"
          :value="Math.round(style.height ?? 30)"
          @input="onStyleChange('height', $event)"
          class="sf-num"
          min="20"
        />
      </div>
    </div>

    <div class="sf-section-title">颜色</div>
    <ColorPicker
      :model-value="style.backgroundColor || '#ffffff'"
      @update:model-value="onColorChange('backgroundColor', $event)"
      label="背景色"
      :show-alpha="true"
    />
    <ColorPicker
      :model-value="style.color || '#333333'"
      @update:model-value="onColorChange('color', $event)"
      label="文字色"
      :show-alpha="false"
    />

    <div class="sf-section-title">字体</div>
    <div class="sf-field">
      <label>字号 ({{ Math.round(style.fontSize ?? 13) }}px)</label>
      <div class="sf-range-row">
        <input
          type="range"
          :value="Math.round(style.fontSize ?? 13)"
          @input="onStyleChange('fontSize', $event)"
          min="8"
          max="72"
          step="1"
          class="sf-range"
        />
        <input
          type="number"
          :value="Math.round(style.fontSize ?? 13)"
          @input="onStyleChange('fontSize', $event)"
          min="8"
          max="72"
          class="sf-num-sm"
        />
      </div>
    </div>
    <div class="sf-field">
      <label>字体</label>
      <select :value="style.fontFamily || ''" @change="onStyleChange('fontFamily', $event)" class="sf-select">
        <option value="">{{ '默认' }}</option>
        <option value="'Segoe UI', sans-serif">Segoe UI</option>
        <option value="微软雅黑, sans-serif">微软雅黑</option>
        <option value="Arial, sans-serif">Arial</option>
        <option value="SimHei, sans-serif">SimHei</option>
        <option value="'Consolas', monospace">Consolas</option>
      </select>
    </div>
    <div class="sf-section-title">文字对齐</div>
    <div class="sf-row" style="padding: 6px 0;">
      <select
        :value="style.textAlign || 'left'"
        @change="onStyleChange('textAlign', $event)"
        class="sf-select"
      >
        <option value="left">左对齐</option>
        <option value="center">居中对齐</option>
        <option value="right">右对齐</option>
      </select>
    </div>

    <div class="sf-section-title">字体粗细</div>
    <div class="sf-row" style="padding: 6px 0;">
      <select
        :value="style.fontWeight || 'normal'"
        @change="onStyleChange('fontWeight', $event)"
        class="sf-select"
      >
        <option value="normal">正常 (normal)</option>
        <option value="bold">粗体 (bold)</option>
        <option value="100">100 - Thin</option>
        <option value="200">200 - Extra Light</option>
        <option value="300">300 - Light</option>
        <option value="400">400 - Normal</option>
        <option value="500">500 - Medium</option>
        <option value="600">600 - Semi Bold</option>
        <option value="700">700 - Bold</option>
        <option value="800">800 - Extra Bold</option>
        <option value="900">900 - Black</option>
      </select>
    </div>

    <div class="sf-section-title">文字装饰</div>
    <div class="sf-row" style="padding: 6px 0;">
      <select
        :value="style.textDecoration || 'none'"
        @change="onStyleChange('textDecoration', $event)"
        class="sf-select"
      >
        <option value="none">无</option>
        <option value="underline">下划线</option>
        <option value="line-through">删除线</option>
        <option value="overline">上划线</option>
      </select>
    </div>

    <div class="sf-section-title">边框与外观</div>
    <div class="sf-field">
      <label>圆角 ({{ Math.round(style.borderRadius ?? 0) }}px)</label>
      <div class="sf-range-row">
        <input
          type="range"
          :value="Math.round(style.borderRadius ?? 0)"
          @input="onStyleChange('borderRadius', $event)"
          min="0"
          max="50"
          step="1"
          class="sf-range"
        />
        <input
          type="number"
          :value="Math.round(style.borderRadius ?? 0)"
          @input="onStyleChange('borderRadius', $event)"
          min="0"
          max="50"
          class="sf-num-sm"
        />
      </div>
    </div>
    <div class="sf-row">
      <div class="sf-field">
        <label>边框宽度</label>
        <input
          type="number"
          :value="Math.round(style.borderWidth ?? 0)"
          @input="onStyleChange('borderWidth', $event)"
          min="0"
          max="10"
          class="sf-num"
        />
      </div>
      <div class="sf-field">
        <label>内边距</label>
        <input
          type="number"
          :value="Math.round(style.padding ?? 4)"
          @input="onStyleChange('padding', $event)"
          min="0"
          max="50"
          class="sf-num"
        />
      </div>
    </div>
    <ColorPicker
      :model-value="style.borderColor || '#d9d9d9'"
      @update:model-value="onColorChange('borderColor', $event)"
      label="边框色"
      :show-alpha="true"
    />
    <div class="sf-row">
      <div class="sf-field sf-field-full">
        <label>边框样式</label>
        <select
          :value="style.borderStyle || 'solid'"
          @change="onStyleChange('borderStyle', $event)"
          class="sf-select"
        >
          <option value="solid">实线 (solid)</option>
          <option value="dashed">虚线 (dashed)</option>
          <option value="dotted">点线 (dotted)</option>
          <option value="none">无</option>
        </select>
      </div>
    </div>

    <div class="sf-section-title">阴影</div>
    <div class="sf-row">
      <div class="sf-field">
        <label>X偏移</label>
        <input type="number" :value="shadowX" @change="onShadowChange($event)" class="sf-num" style="width:50px" />
      </div>
      <div class="sf-field">
        <label>Y偏移</label>
        <input type="number" :value="shadowY" @change="onShadowChange($event, 'y')" class="sf-num" style="width:50px" />
      </div>
      <div class="sf-field">
        <label>模糊</label>
        <input type="number" :value="shadowBlur" @change="onShadowChange($event, 'blur')" class="sf-num" style="width:50px" min="0" />
      </div>
    </div>
    <div class="sf-row">
      <div class="sf-field">
        <label>扩展</label>
        <input type="number" :value="shadowSpread" @change="onShadowChange($event, 'spread')" class="sf-num" style="width:50px" />
      </div>
      <div class="sf-field">
        <label>阴影色</label>
        <ColorPicker :model-value="shadowColor" @update:model-value="onShadowColorChange" />
      </div>
    </div>
    <div style="margin:6px 0;padding:8px;background:#f5f5f5;border-radius:4px;text-align:center;font-size:11px;color:#888;">
      预览: {{ computedShadow }}
    </div>

    <div class="sf-section-title">其他</div>
    <div class="sf-field">
      <label>透明度 ({{ ((style.opacity ?? 1) * 100).toFixed(0) }}%)</label>
      <div class="sf-range-row">
        <input
          type="range"
          :value="(style.opacity ?? 1).toFixed(2)"
          @input="onOpacityInput"
          min="0"
          max="1"
          step="0.01"
          class="sf-range"
        />
      </div>
    </div>
    <div class="sf-field">
      <label>层级 (z-index)</label>
      <input
        type="number"
        :value="style.zIndex ?? 0"
        readonly
        disabled
        class="sf-num sf-readonly"
      />
    </div>
  </div>
</template>

<style scoped>
.style-form { padding: 0; }
.sf-section-title {
  font-size: 12px; font-weight: 600; color: #409eff;
  margin: 12px 0 6px; padding-bottom: 4px;
  border-bottom: 1px solid #e8e8e8;
}
.sf-row { display: flex; gap: 8px; }
.sf-field { flex: 1; margin-bottom: 6px; min-width: 0; }
.sf-field label {
  display: block; font-size: 11px; color: #888; margin-bottom: 2px;
}
.sf-num {
  width: 100%; height: 28px; padding: 2px 6px;
  border: 1px solid #d9d9d9; border-radius: 4px;
  font-size: 12px; color: #333; outline: none; box-sizing: border-box;
}
.sf-num:focus { border-color: #409eff; }
.sf-num-sm {
  width: 52px; height: 26px; padding: 2px 4px;
  border: 1px solid #d9d9d9; border-radius: 4px;
  font-size: 11px; color: #333; outline: none; text-align: center; flex-shrink: 0;
}
.sf-num-sm:focus { border-color: #409eff; }
.sf-readonly { background: #f5f5f5; color: #999; cursor: not-allowed; }
.sf-range-row { display: flex; align-items: center; gap: 6px; }
.sf-range { flex: 1; height: 4px; accent-color: #409eff; }
.sf-select {
  width: 100%; height: 28px; padding: 2px 6px;
  border: 1px solid #d9d9d9; border-radius: 4px;
  font-size: 12px; color: #333; outline: none; background: #fff;
}
.sf-select:focus { border-color: #409eff; }
.sf-field-full {
  flex: 1;
}
</style>