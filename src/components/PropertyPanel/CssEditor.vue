/**
 * @file CssEditor.vue
 * @description Monaco Editor CSS 编辑器组件 - 带防抖、CSS语法高亮、双向绑定、最大化功能，最大化时标题栏可拖拽移动面板
 */
<template>
  <div v-if="maximized" class="css-editor-backdrop"></div>
  <div ref="wrapperRef" class="css-editor-wrapper" :class="{ maximized: maximized }">
    <div class="css-editor-panel">
      <div class="css-editor-header">
        <span class="css-editor-title">CSS 样式源码</span>
        <div class="css-editor-header-right">
          <span class="css-editor-hint">{{ hint }}</span>
          <button v-if="maximizable" class="css-editor-maximize-btn" @click="toggleMaximize" :title="maximized ? '还原' : '最大化'">
            {{ maximized ? '✕' : '⛶' }}
          </button>
        </div>
      </div>
      <div ref="editorContainer" class="css-editor-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import type { editor as MonacoEditor } from '@/utils/monacoSetup'
import * as monaco from 'monaco-editor'
// CSS 语言支持由 vite-plugin-monaco-editor 的 languageWorkers: ['css'] 自动注册
import { useResizable } from '@/composables/useResizable'

const props = defineProps<{
  widgetId?: string
  modelValue: string
  hint?: string
  maximizable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const editorContainer = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const maximized = ref(false)

// 边缘拖拽调整最大化面板尺寸（仅在最大化时启用）
useResizable(wrapperRef, { enabled: maximized, minWidth: 300, minHeight: 250 })

let editor: MonacoEditor.IStandaloneCodeEditor | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let isUpdatingFromProp = false

// ----- 拖拽最大化面板相关变量 -----
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let dragStartLeft = 0
let dragStartTop = 0
let ignoreBackdropClick = false          // 防止拖拽结束后误触发遮罩关闭
let backdropClickHandler: ((e: MouseEvent) => void) | null = null  // 捕获阶段防误触处理器

// ----- 辅助函数：限制面板在视口内 -----
function constrainPanelBounds() {
  if (!wrapperRef.value || !maximized.value) return
  const rect = wrapperRef.value.getBoundingClientRect()
  const left = rect.left
  const top = rect.top
  const width = rect.width
  const height = rect.height
  const viewWidth = window.innerWidth
  const viewHeight = window.innerHeight

  let newLeft = left
  let newTop = top
  if (newLeft < 0) newLeft = 0
  if (newLeft + width > viewWidth) newLeft = Math.max(0, viewWidth - width)
  if (newTop < 0) newTop = 0
  if (newTop + height > viewHeight) newTop = Math.max(0, viewHeight - height)

  if (newLeft !== left || newTop !== top) {
    wrapperRef.value.style.left = `${newLeft}px`
    wrapperRef.value.style.top = `${newTop}px`
  }
}

// 窗口大小变化时重新约束位置
function onWindowResize() {
  if (maximized.value && !isDragging) {
    constrainPanelBounds()
  }
}

// ----- 拖拽核心逻辑 -----
function startDrag(e: MouseEvent) {
  // 仅在最大化状态下启用拖拽
  if (!maximized.value) return
  // 确保目标不是最大化按钮及内部元素，避免拖拽时误触按钮
  const target = e.target as HTMLElement
  const maximizeBtn = wrapperRef.value?.querySelector('.css-editor-maximize-btn')
  if (maximizeBtn && maximizeBtn.contains(target)) return

  e.preventDefault()
  e.stopPropagation()

  const wrapper = wrapperRef.value
  if (!wrapper) return

  // 获取当前实际位置（视口坐标）
  const rect = wrapper.getBoundingClientRect()
  // 将固定定位方式从 “left:50% + transform” 转换为具体的 left/top 像素值
  const computedStyle = window.getComputedStyle(wrapper)
  const hasTransform = computedStyle.transform !== 'none' && computedStyle.transform !== 'matrix(1, 0, 0, 1, 0, 0)'
  if (hasTransform || computedStyle.left === '50%') {
    // 覆盖原有样式，使用绝对像素位置
    wrapper.style.left = `${rect.left}px`
    wrapper.style.top = `${rect.top}px`
    wrapper.style.transform = 'none'
  }

  dragStartX = e.clientX
  dragStartY = e.clientY
  dragStartLeft = rect.left
  dragStartTop = rect.top
  isDragging = true

  // 添加全局移动和释放监听
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', stopDrag)
  document.body.style.userSelect = 'none'
  wrapper.style.cursor = 'grabbing'
}

function onDragMove(e: MouseEvent) {
  if (!isDragging || !wrapperRef.value) return
  e.preventDefault()

  const deltaX = e.clientX - dragStartX
  const deltaY = e.clientY - dragStartY
  let newLeft = dragStartLeft + deltaX
  let newTop = dragStartTop + deltaY

  // 边界限制
  const wrapper = wrapperRef.value
  const width = wrapper.offsetWidth
  const height = wrapper.offsetHeight
  const viewWidth = window.innerWidth
  const viewHeight = window.innerHeight

  newLeft = Math.min(Math.max(newLeft, 0), viewWidth - width)
  newTop = Math.min(Math.max(newTop, 0), viewHeight - height)

  wrapper.style.left = `${newLeft}px`
  wrapper.style.top = `${newTop}px`
}

function stopDrag() {
  if (!isDragging) return
  isDragging = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', stopDrag)
  document.body.style.userSelect = ''
  if (wrapperRef.value) {
    wrapperRef.value.style.cursor = ''
  }

  // 设置防误触标志，避免拖拽结束后立即点击遮罩关闭面板
  ignoreBackdropClick = true
  setTimeout(() => {
    ignoreBackdropClick = false
  }, 200)
}

// ----- 覆盖 toggleMaximize，添加拖拽状态重置与内联样式清除 -----
const originalToggleMaximize = toggleMaximize
async function toggleMaximize() {
  // 如果刚刚拖拽结束，忽略本次遮罩点击（防止误关闭）
  if (ignoreBackdropClick) {
    ignoreBackdropClick = false
    return
  }

  // 切换前，如果当前是最大化状态且存在拖拽遗留的内联样式，将其清除恢复默认样式
  // 同时清除 useResizable 拖拽调整大小遗留的 width/height inline 样式
  if (maximized.value && wrapperRef.value) {
    wrapperRef.value.style.left = ''
    wrapperRef.value.style.top = ''
    wrapperRef.value.style.transform = ''
    wrapperRef.value.style.width = ''
    wrapperRef.value.style.height = ''
  }

  // 调用原始的逻辑（最大化/还原切换）
  if (!maximized.value) {
    // 最大化：提交当前内容后切换
    if (editor) {
      const value = editor.getValue()
      emit('update:modelValue', value)
      emit('change', value)
    }
    maximized.value = true
    await nextTick()
    // 最大化完成后确保没有内联样式干扰（清除可能遗留的拖拽样式和 resize 遗留的 width/height）
    if (wrapperRef.value) {
      wrapperRef.value.style.left = ''
      wrapperRef.value.style.top = ''
      wrapperRef.value.style.transform = ''
      wrapperRef.value.style.width = ''
      wrapperRef.value.style.height = ''
    }
    if (editor) editor.layout()
  } else {
    // 还原：提交内容 → 销毁 Monaco → 切换正常流 → 在新尺寸容器中重建 Monaco
    if (editor) {
      const value = editor.getValue()
      emit('update:modelValue', value)
      emit('change', value)
      editor.dispose()
      editor = null
    }
    maximized.value = false
    // 还原后清除内联样式（包括 useResizable 设置的 width/height，确保流式布局 flex:1 正常生效）
    if (wrapperRef.value) {
      wrapperRef.value.style.left = ''
      wrapperRef.value.style.top = ''
      wrapperRef.value.style.transform = ''
      wrapperRef.value.style.width = ''
      wrapperRef.value.style.height = ''
    }
    await nextTick()
    if (editorContainer.value) {
      initEditor()
    }
  }
}

/**
 * 初始化 Monaco Editor
 */
function initEditor() {
  if (!editorContainer.value) return

  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue || '',
    language: 'css',
    theme: 'vs',
    fontSize: 13,
    lineNumbers: 'on',
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    tabSize: 2,
    folding: true,
    lineDecorationsWidth: 8,
    lineNumbersMinChars: 2,
    glyphMargin: false,
    padding: { top: 8, bottom: 8 },
    suggest: {
      showWords: false
    }
  })

  editor!.onDidChangeModelContent(() => {
    if (isUpdatingFromProp) return
    handleContentChange()
  })
}

/**
 * 处理内容变更（防抖 300ms）
 */
function handleContentChange() {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    if (!editor) return
    const value = editor.getValue()
    emit('update:modelValue', value)
    emit('change', value)
  }, 300)
}

/**
 * 更新编辑器内容
 */
function updateEditorContent(value: string) {
  if (!editor) return
  const currentValue = editor.getValue()
  if (currentValue !== value) {
    isUpdatingFromProp = true
    editor.setValue(value)
    setTimeout(() => {
      isUpdatingFromProp = false
    }, 0)
  }
}

/** 监听 modelValue 变化 */
watch(() => props.modelValue, (newVal) => {
  updateEditorContent(newVal)
})

/** 监听 widgetId 变化，重置光标位置 */
watch(() => props.widgetId, () => {
  if (editor && props.widgetId) {
    editor.setPosition({ lineNumber: 1, column: 1 })
    editor.focus()
  }
})

// 遮罩层防误触：全局捕获阶段阻止拖拽刚刚结束时触发的遮罩点击
function setupBackdropGuard() {
  backdropClickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (ignoreBackdropClick && target.classList?.contains('css-editor-backdrop')) {
      e.stopImmediatePropagation()
      e.preventDefault()
      ignoreBackdropClick = false
    }
  }
  document.addEventListener('click', backdropClickHandler, true)
}

function removeBackdropGuard() {
  if (backdropClickHandler) {
    document.removeEventListener('click', backdropClickHandler, true)
    backdropClickHandler = null
  }
}

onMounted(() => {
  nextTick(() => {
    initEditor()
    // 为标题栏添加拖拽监听
    const header = wrapperRef.value?.querySelector('.css-editor-header')
    if (header) {
      header.addEventListener('mousedown', startDrag as EventListener)
    }
    setupBackdropGuard()
    window.addEventListener('resize', onWindowResize)
  })
})

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
  if (editor) {
    editor.dispose()
    editor = null
  }
  const header = wrapperRef.value?.querySelector('.css-editor-header')
  if (header) {
    header.removeEventListener('mousedown', startDrag as EventListener)
  }
  window.removeEventListener('resize', onWindowResize)
  removeBackdropGuard()
  // 清理拖拽事件残留监听
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.css-editor-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 250px;
  position: relative;
}

.css-editor-wrapper.maximized {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);  /* 完全居中 */
  width: 55vw;        /* 宽度使用视口宽度百分比 */
  height: 90vh;       /* 高度使用视口高度百分比 */
  z-index: 99999;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  background: #fff;
}

.css-editor-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 99998;
}

.css-editor-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.css-editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  background-color: #efefef;
  border-radius: 5px 5px 0 0;
  border-left: 3px solid #e6a23c;
  flex-shrink: 0;
  cursor: grab;  /* 提示可拖拽 */
  user-select: none;
}

.css-editor-header:active {
  cursor: grabbing;
}

.css-editor-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.css-editor-title {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.css-editor-hint {
  font-size: 11px;
  color: #999;
}

.css-editor-maximize-btn {
  width: 25px;
  height: 25px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  padding-bottom: 2px;
  font-weight: 600;
}

.css-editor-maximize-btn:hover {
  background:rgb(255, 29, 29);
  color: #ffffff;
}
.css-editor-maximize-btn:active {
  background:rgb(206, 0, 0);
}

.css-editor-container {
  flex: 1;
  min-height: 200px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  border-top: none;
}

.css-editor-wrapper.maximized .css-editor-container {
  min-height: 0;
}
</style>