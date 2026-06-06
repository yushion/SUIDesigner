/**
 * @file ListBoxWidget.vue
 * @description 列表框控件 - WINUI 3 风格，支持复选框、双击编辑
 */
<template>
  <div
    class="ui-widget list-box-widget"
    :class="{ selected: isSelected, disabled: widget.disabled }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="containerStyle"
    @click.stop
  >
    <div class="list-box-scroll">
      <div
        v-for="(item, index) in widget.items || []"
        :key="item.id || index"
        :data-item-index="index"
        class="list-item"
        :class="{ 'item-selected': selectedIndices[index] }"
        @click="onItemClick(index, $event)"
        @dblclick="onItemDblClick(index)"
      >
        <input
          v-if="widget.showCheckbox"
          type="checkbox"
          class="list-item-checkbox"
          :checked="item.selected || false"
          @click.stop
          @change="onCheckboxChange(index, $event)"
        />
        <span
          v-if="editingIndex !== index"
          class="list-item-text"
        >{{ item.text }}</span>
        <input
          v-if="editingIndex === index"
          ref="editInputRef"
          v-model="editText"
          class="list-item-edit-input"
          @keydown.enter="saveEdit(index)"
          @keydown.escape="cancelEdit"
          @blur="saveEdit(index)"
          @click.stop
        />
      </div>
      <div v-if="!widget.items || widget.items.length === 0" class="list-empty">
        暂无数据
      </div>
    </div>
    <div v-if="widget.disabled" class="disabled-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import type { Widget } from '@/types/index'
import { widgetBaseStyle } from '@/utils/widgetStyleUtils'

const store = useWidgetStore()

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

/** 当前正在编辑的项索引，-1 表示不在编辑 */
const editingIndex = ref(-1)
/** 编辑中的文本 */
const editText = ref('')
/** 控件内选中的索引集合（非复选框，是项高亮） */
const selectedIndices = ref<Record<number, boolean>>({})
/** 编辑输入框引用 */
const editInputRef = ref<HTMLInputElement | null>(null)

const containerStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  const s = props.widget.style as any
  return {
    ...base,
    color: s.itemColor || s.color || undefined,
    fontFamily: s.fontFamily || undefined,
    '--list-item-selected-bg': s.itemSelectedBg || '#e6f4ff',
    '--list-item-border-bottom': s.listItemBorderBottom || '1px solid #f0f0f0',
    '--list-item-hover-bg': s.listItemHoverBg || '#f5f5f5',
  } as any
})

/**
 * 单击列表项：始终单选高亮（复选框独立处理多选）
 */
function onItemClick(index: number, event: MouseEvent) {
  if (!props.widget.items) return
  selectedIndices.value = { [index]: true }
}

/**
 * 双击列表项：进入编辑模式
 */
function onItemDblClick(index: number) {
  if (!props.widget.editable || !props.widget.items) return
  editingIndex.value = index
  editText.value = props.widget.items[index].text || ''
  nextTick(() => {
    const el = (document.querySelector(`[data-widget-id="${props.widget.id}"] .list-item-edit-input`) as HTMLInputElement)
    if (el) { el.focus(); el.select() }
  })
}

/**
 * 保存编辑
 */
function saveEdit(index: number) {
  if (editingIndex.value === -1) return
  if (!props.widget.items) return
  const newText = editText.value.trim()
  if (newText) {
    props.widget.items[index].text = newText
    store.saveState()
  }
  editingIndex.value = -1
  editText.value = ''
}

/**
 * 取消编辑
 */
function cancelEdit() {
  editingIndex.value = -1
  editText.value = ''
}

/**
 * 复选框变更
 */
function onCheckboxChange(index: number, event: Event) {
  if (!props.widget.items) return
  const checked = (event.target as HTMLInputElement).checked
  props.widget.items[index].selected = checked
  store.saveState()
}
</script>

<style scoped>
.list-box-widget {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.list-box-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.list-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
  cursor: pointer;
  user-select: none;
  border-bottom: var(--list-item-border-bottom, 1px solid #f0f0f0);
  gap: 8px;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: var(--list-item-hover-bg, #f5f5f5);
}

.list-item.item-selected {
  background-color: var(--list-item-selected-bg, #e6f4ff);
}

.list-item-checkbox {
  margin: 0;
  flex-shrink: 0;
}

.list-item-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-item-edit-input {
  flex: 1;
  height: 24px;
  border: 1px solid #1890ff;
  border-radius: 3px;
  padding: 0 6px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.list-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
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


</style>