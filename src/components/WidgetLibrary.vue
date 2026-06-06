/**
 * @file WidgetLibrary.vue
 * @description 左侧控件库 - 折叠面板分类控件列表 + 底部保存/导入按钮
 */
<template>
  <div class="widget-library">
    <h3 class="library-title">控件库</h3>
    <div class="widget-list">
      <el-collapse v-model="activeCategories">
        <el-collapse-item
          v-for="cat in categories"
          :key="cat.key"
          :name="cat.key"
        >
          <template #title>
            <span class="category-title">{{ cat.label }}</span>
            <span class="category-count">{{ cat.items.length }}</span>
          </template>
          <div
            v-for="item in cat.items"
            :key="item.type"
            class="widget-item"
            :class="{ 'widget-item-active': (item.type === 'messageBox' && store.messageBoxPanelVisible) || (item.type === 'inputBox' && store.inputBoxPanelVisible) }"
            draggable="true"
            @click="onWidgetClick(item.type)"
            @dragstart="onDragStart($event, item.type)"
          >
            <span class="widget-icon">{{ item.icon }}</span>
            <span class="widget-text">{{ item.label }}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-action-bar">
      <el-button class="btn-save" @click="handleSave">
        💾 保存设计
      </el-button>
      <el-button class="btn-import" @click="handleImport">
        📂 导入设计
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { WidgetType } from '@/types/index'
import { getWidgetLibraryItems } from '@/config/widgetRegistry'
import { useWidgetStore } from '@/stores/widgetStore'
import { ElMessage } from 'element-plus'

const store = useWidgetStore()

/** 控件库条目列表（从注册中心懒加载） */
const widgetItems = computed(() =>
  getWidgetLibraryItems().map(item => ({
    type: item.type as WidgetType,
    label: item.label,
    icon: item.icon
  }))
)

/** 内置控件类型列表（用于排除自定义控件） */
const BUILTIN_TYPES = new Set([
  'button', 'input', 'checkbox', 'toggle', 'comboBox', 'label', 'divider',
  'hyperlink', 'radioGroup', 'progressBar', 'datetimePicker',
  'iconButton', 'imageBox',
  'listBox', 'treeView', 'textarea', 'dataGrid', 'logOutput',
  'tabsContainer', 'cardBox',
  'contextMenu', 'tooltip', 'messageBox', 'inputBox'
])

/** 控件分类定义 */
const categories = computed(() => [
  {
    key: 'common',
    label: '常用控件',
    items: widgetItems.value.filter(
      (item) => ['button', 'input', 'checkbox', 'toggle', 'comboBox', 'label', 'divider',
                 'hyperlink', 'radioGroup', 'progressBar', 'datetimePicker', 
                 'iconButton', 'imageBox'].includes(item.type)
    )
  },
  {
    key: 'data',
    label: '数据控件',
    items: widgetItems.value.filter(
      (item) => item.type === 'listBox' || item.type === 'treeView' || item.type === 'textarea' || item.type === 'dataGrid' || item.type === 'logOutput'
    )
  },
  {
    key: 'container',
    label: '容器控件',
    items: widgetItems.value.filter(
      (item) => item.type === 'tabsContainer' || item.type === 'cardBox'
    )
  },
  {
    key: 'silent',
    label: '静默控件',
    items: widgetItems.value.filter(
      (item) => item.type === 'contextMenu' || item.type === 'tooltip' || item.type === 'messageBox' || item.type === 'inputBox'
    )
  },
  {
    key: 'custom',
    label: '自定义控件',
    items: widgetItems.value.filter((item) => !BUILTIN_TYPES.has(item.type))
  }
])

/** 默认展开所有分类 */
const activeCategories = ref<string[]>(['common', 'data', 'container', 'silent', 'custom'])

/** 拖拽开始 - 设置拖拽数据 */
function onDragStart(event: DragEvent, type: WidgetType) {
  if (!event.dataTransfer) return
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('text/plain', type)
}

/** 控件库点击 - 信息框等静默控件点击切换属性面板 */
function onWidgetClick(type: WidgetType) {
  if (type === 'messageBox') {
    store.selectedIds = []
    store.inputBoxPanelVisible = false
    store.messageBoxPanelVisible = !store.messageBoxPanelVisible
  } else if (type === 'inputBox') {
    store.selectedIds = []
    store.messageBoxPanelVisible = false
    store.inputBoxPanelVisible = !store.inputBoxPanelVisible
  }
}

/** 保存设计到 JSON 文件 */
function handleSave() {
  try {
    const data = {
      canvas: { ...store.canvas },
      widgets: store.serializeWidgets(),
      messageBoxConfig: { ...store.messageBoxConfig },
      inputBoxConfig: { ...store.inputBoxConfig }
    }
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ui_design.json'
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 300)
    ElMessage.success('保存成功')
  } catch (err) {
    ElMessage.error('保存失败')
    console.error(err)
  }
}

/** 导入设计文件 */
function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        store.clearAll()
        if (data.canvas) {
          store.updateCanvas(data.canvas)
        }
        if (data.widgets) {
          data.widgets.forEach((w: any) => {
            store.widgets.push(store.deserializeWidget(w))
          })
        }
        if (data.messageBoxConfig) {
          Object.assign(store.messageBoxConfig, data.messageBoxConfig)
        }
        if (data.inputBoxConfig) {
          Object.assign(store.inputBoxConfig, data.inputBoxConfig)
        }
        store.initHistory()
        store.selectCanvas()
        ElMessage.success('导入成功')
      } catch (err) {
        ElMessage.error('导入失败：文件格式错误')
        console.error(err)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}
</script>

<style scoped>
.widget-library {
  width: 185px;
  background-color: #ffffff;
  border-right: 1px solid #e5e6eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.library-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d2129;
  padding: 14px 16px 10px 16px;
  margin: 0;
  border-bottom: 2px solid #165dff;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.widget-list {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

/* ===== 折叠面板整体 ===== */
.widget-list :deep(.el-collapse) {
  border: none;
  --el-collapse-content-font-size: 13px;
}

.widget-list :deep(.el-collapse-item) {
  margin: 0;
}

/* ===== 折叠面板头部 ===== */
.widget-list :deep(.el-collapse-item__header) {
  height: 25px;
  line-height: 25px;
  font-size: 13px;
  color: #1d2129;
  background: transparent;
  padding: 0 14px;
  border: none;
  font-weight: 500;
  letter-spacing: 0.3px;
  transition: color 0.2s;
}

.widget-list :deep(.el-collapse-item__header:hover) {
  color: #165dff;
}

/* ===== 折叠箭头图标 ===== */
.widget-list :deep(.el-collapse-item__arrow) {
  font-size: 11px;
  color: #86909c;
  margin-right: 8px;
  transition: transform 0.25s ease, color 0.2s;
}

.widget-list :deep(.el-collapse-item__header:hover .el-collapse-item__arrow) {
  color: #165dff;
}

/* ===== 折叠面板内容区 ===== */
.widget-list :deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}

.widget-list :deep(.el-collapse-item__content) {
  padding: 2px 14px 10px 14px;
  color: #4e5969;
}

/* ===== 分类标题文字 ===== */
.category-title {
  display: inline-block;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
  transition: border-color 0.25s ease;
}

.widget-list :deep(.el-collapse-item__header:hover) .category-title {
  border-bottom-color: #165dff;
}

/* ===== 分类控件计数 ===== */
.category-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  margin-left: 6px;
  font-size: 11px;
  font-weight: 400;
  color: #86909c;
  background: #f2f3f5;
  border-radius: 9px;
  padding: 0 5px;
  vertical-align: middle;
}

/* ===== 分类间分隔线 ===== */
.widget-list :deep(.el-collapse-item:not(:last-child)) {
  padding-bottom: 4px;
}

/* ===== 控件条目 ===== */
.widget-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background-color: #f1f1f1;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s ease;
  user-select: none;
  margin-bottom: 4px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #000;
}

.widget-item:hover {
  background-color: #e0e0e0;
  border-color: #dddddd;
  box-shadow: 0 1px 4px rgba(165, 165, 165, 0.08);
  transform: scale(1.1);
}

.widget-item:active {
  cursor: grabbing;
  transform: scale(0.97);
}

.widget-item-active {
  background-color: #e8f4fc !important;
  border-color: #1890ff !important;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  cursor: pointer;
}

.widget-icon {
  font-size: 15px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
  opacity: 0.85;
}

.widget-text {
  font-size: 12px;
  color: #4e5969;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== 底部操作栏 ===== */
.bottom-action-bar {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background: #f7f8fa;
  border-top: 1px solid #e5e6eb;
}

.bottom-action-bar :deep(.el-button) {
  margin-left: 0;
  font-size: 12px;
  height: 32px;
  border-radius: 6px;
  letter-spacing: 0.3px;
}

.btn-save {
  background-color: #165dff !important;
  border-color: #165dff !important;
  color: #fff !important;
  width: 100%;
  margin-left: 0 !important;
}

.btn-save:hover {
  background-color: #4080ff !important;
  border-color: #4080ff !important;
}

.btn-import {
  background-color: #00b42a !important;
  border-color: #00b42a !important;
  color: #fff !important;
  width: 100%;
  margin-left: 0 !important;
}

.btn-import:hover {
  background-color: #23c343 !important;
  border-color: #23c343 !important;
}
</style>