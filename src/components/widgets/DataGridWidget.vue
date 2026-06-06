/**
 * @file DataGridWidget.vue
 * @description 多项表格控件 - 支持多列、可编辑单元格、行复选框、动态增删行列
 */
<template>
  <div
    class="ui-widget data-grid-widget"
    :class="{ selected: isSelected, disabled: widget.disabled }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="containerStyle"
    @click.stop
  >
    <div class="dg-header">
      <div
        v-if="showCheckboxCol"
        class="dg-header-cell dg-checkbox-col"
        :style="{ width: '36px', minWidth: '36px' }"
      >
        <input type="checkbox" @change="onHeaderCheck" />
      </div>
      <div
        v-for="col in widget.columns"
        :key="col.field"
        class="dg-header-cell"
        :style="getColStyle(col)"
        :title="col.header"
      >
        {{ col.header }}
      </div>
    </div>
    <div class="dg-body">
      <div
        v-for="(row, ri) in gridRows"
        :key="row.id"
        class="dg-row"
        :class="{ 'dg-row-focused': widget.alwaysShowSelection && selectedRowIndex === ri }"
        @click.stop="onRowClick(ri)"
      >
        <div
          v-if="showCheckboxCol"
          class="dg-cell dg-checkbox-col"
          :style="{ width: '36px', minWidth: '36px' }"
        >
          <input type="checkbox" :checked="row.selected" @change="onRowCheck(ri, $event)" />
        </div>
        <div
          v-for="col in widget.columns"
          :key="col.field"
          class="dg-cell"
          :class="{ 'dg-cell-editable': isCellEditable(col) }"
          :style="getColStyle(col)"
          :title="getCellText(row, col)"
          @dblclick.stop="onCellDblClick(ri, col)"
        >
          <template v-if="editingCell && editingCell.ri === ri && editingCell.col.field === col.field">
            <input
              ref="cellInput"
              v-model="editValue"
              class="dg-cell-input"
              @blur="commitEdit"
              @keydown.enter="commitEdit"
              @keydown.escape="cancelEdit"
              @click.stop
            />
          </template>
          <template v-else>
            {{ getCellText(row, col) }}
          </template>
        </div>
      </div>
    </div>
    <div v-if="widget.disabled" class="disabled-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import type { Widget, TableColumn, TableRow } from '@/types/index'
import { widgetBaseStyle } from '@/utils/widgetStyleUtils'

const store = useWidgetStore()

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

/** 将 rows 转为 TableRow[] 类型（dataGrid专用） */
const gridRows = computed<TableRow[]>(() => {
  const r = props.widget.rows
  if (Array.isArray(r)) return r as TableRow[]
  return []
})

/** 编辑状态 */
const editingCell = ref<{ ri: number; col: TableColumn } | null>(null)
const editValue = ref('')
const cellInput = ref<any>(null)

/** 当前高亮行索引（独立于复选框状态，参考 ListBox 的 selectedIndices） */
const selectedRowIndex = ref<number | null>(null)

/** 容器定位样式 */
const containerStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  const s = props.widget.style as any
  return {
    ...base,
    color: s.color || undefined,
    fontFamily: s.fontFamily || undefined,
    '--grid-header-bg': s.gridHeaderBg || '#f0f0f0',
    '--grid-header-border-bottom': s.gridHeaderBorderBottom || '1px solid #d9d9d9',
    '--grid-header-cell-border-right': s.gridHeaderCellBorderRight || '1px solid #d9d9d9',
    '--grid-row-border-bottom': s.gridRowBorderBottom || '1px solid #e8e8e8',
    '--grid-cell-border-right': s.gridCellBorderRight || '1px solid #e8e8e8',
    '--grid-even-row-bg': s.gridEvenRowBg || '#fafafa',
    '--grid-hover-bg': s.gridHoverBg || '#e6f7ff',
    '--grid-focused-bg': s.gridFocusedBg || '#d6e4ff',
  } as any
})

/** 是否显示复选框列 */
const showCheckboxCol = computed(() => {
  return props.widget.showRowCheckbox !== false
})

/** 获取列宽样式 */
function getColStyle(col: TableColumn) {
  const w = col.width || 100
  return { width: w + 'px', minWidth: w + 'px' }
}

/** 获取单元格显示文本 */
function getCellText(row: any, col: TableColumn) {
  const val = row.cells?.[col.field]
  return val !== undefined && val !== null ? String(val) : ''
}

/** 判断单元格是否可编辑 */
function isCellEditable(col: TableColumn): boolean {
  if (props.widget.editable) return true
  return col.editable === true
}

/** 表头复选框切换 */
function onHeaderCheck(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  gridRows.value.forEach(r => (r.selected = checked))
}

/** 行复选框切换 */
function onRowCheck(ri: number, e: Event) {
  if (gridRows.value[ri]) {
    gridRows.value[ri].selected = (e.target as HTMLInputElement).checked
  }
}

/** 行点击 - 始终高亮选中行（独立于复选框状态，参考 ListBox） */
function onRowClick(ri: number) {
  selectedRowIndex.value = ri
}

/** 单元格双击进入编辑模式 */
function onCellDblClick(ri: number, col: TableColumn) {
  if (!isCellEditable(col)) return
  editingCell.value = { ri, col }
  const row = gridRows.value[ri]
  editValue.value = row ? getCellText(row, col) : ''
  nextTick(() => {
    if (cellInput.value) {
      const el = Array.isArray(cellInput.value) ? cellInput.value[0] : cellInput.value
      if (el && el.focus) { el.focus(); el.select() }
    }
  })
}

/** 提交编辑 */
function commitEdit() {
  if (!editingCell.value) return
  const { ri, col } = editingCell.value
  if (gridRows.value[ri]) {
    gridRows.value[ri].cells[col.field] = editValue.value
  }
  editingCell.value = null
}

/** 取消编辑 */
function cancelEdit() {
  editingCell.value = null
}
</script>

<style scoped>
.ui-widget { box-sizing: border-box; }

.data-grid-widget {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.data-grid-widget.selected { outline: 2px solid #1890ff; outline-offset: -2px; }
.data-grid-widget.disabled { opacity: 0.6; pointer-events: none; }

.dg-header {
  display: flex;
  background: var(--grid-header-bg, #f0f0f0);
  border-bottom: var(--grid-header-border-bottom, 1px solid #d9d9d9);
  flex-shrink: 0;
}

.dg-header-cell {
  padding: 6px 8px;
  font-weight: 600;
  border-right: var(--grid-header-cell-border-right, 1px solid #d9d9d9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  flex-shrink: 0;
}

.dg-checkbox-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dg-checkbox-col input[type="checkbox"] {
  margin: 0;
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.dg-body {
  flex: 1;
  overflow-y: auto;
}

.dg-row {
  display: flex;
  border-bottom: var(--grid-row-border-bottom, 1px solid #e8e8e8);
}

.dg-row:nth-child(even) {
  background: var(--grid-even-row-bg, #fafafa);
}

.dg-row:hover {
  background: var(--grid-hover-bg, #e6f7ff);
}

.dg-row-focused {
  background: var(--grid-focused-bg, #d6e4ff) !important;
}

.dg-cell {
  padding: 5px 8px;
  border-right: var(--grid-cell-border-right, 1px solid #e8e8e8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
  flex-shrink: 0;
  cursor: default;
}

.dg-cell-editable {
  cursor: text;
}

.dg-cell-input {
  width: 100%;
  height: 100%;
  border: 1px solid #1890ff;
  outline: none;
  padding: 2px 4px;
  font-family: inherit;
  background: #fff;
  box-sizing: border-box;
  margin: -2px -4px;
}

.disabled-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.3);
  pointer-events: all;
  z-index: 10;
}
</style>