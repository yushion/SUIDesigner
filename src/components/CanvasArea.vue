/**
 * @file CanvasArea.vue
 * @description 中间画布区域 - 框选、多选移动、控制点拉伸、对齐辅助线、右键菜单、拖放创建
 */
<template>
  <div class="canvas-wrapper">
    <!-- 画布 -->
    <div
      ref="canvasRef"
      class="canvas"
      :class="{ 'no-grid': !props.showGrid }"
      :style="canvasStyle"
      @dragenter.prevent
      @dragover.prevent="onDragOver"
      @drop.prevent="onDrop"
      @mousedown="onCanvasMouseDown"
      @mouseenter="setCanvasFocused(true)"
      @mouseleave="setCanvasFocused(false)"
      @contextmenu.prevent="onContextMenu"
    >
      <!-- 画布标题栏 -->
      <div
        v-if="store.canvas.showTitleBar"
        class="canvas-titlebar"
        :style="titleBarStyle"
      >
        <!-- 左侧：Logo/图标 -->
        <div class="tb-left" :style="titleBarCellStyle">
          <span class="tb-icon" v-html="titleBarSafeIcon" :style="titleBarIconStyle"></span>
        </div>
        <!-- 中间：标题文字 -->
        <div class="tb-center" :style="titleBarCenterStyle">
          <span class="tb-title" :style="titleBarTitleStyle">{{ store.canvas.titleBarTitle || '我的应用' }}</span>
        </div>
        <!-- 右侧：窗口控制按钮 -->
        <div class="tb-right" :style="titleBarCellStyle">
          <!-- 最小化按钮：禁止最小化时根据固定宽高决定隐藏还是禁用 -->
          <button
            v-if="!(store.canvas.disableMinimize && store.canvas.canvasFixedSize)"
            class="tb-btn"
            :style="{ ...titleBarBtnStyle, ...(store.canvas.disableMinimize ? { opacity: 0.35, cursor: 'not-allowed', pointerEvents: 'none' } : {}) }"
            :title="store.canvas.disableMinimize ? '已禁止最小化' : '最小化'"
          >
            <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg>
          </button>
          <!-- 最大化按钮：禁止最小化+固定宽高时隐藏 -->
          <button
            v-if="!(store.canvas.disableMinimize && store.canvas.canvasFixedSize)"
            class="tb-btn"
            :style="titleBarBtnStyle"
            title="最大化"
          >
            <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
          </button>
          <button class="tb-btn tb-btn-close" :style="titleBarCloseBtnStyle" title="关闭">
            <svg width="10" height="10" viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2"/></svg>
          </button>
        </div>
      </div>

      <!-- 渲染所有控件 -->
      <component
        v-for="widget in store.widgets"
        :key="widget.id + '-' + renderKey"
        :is="getWidgetComponent(widget.type)"
        :widget="widget"
        :is-selected="store.selectedIds.includes(widget.id)"
      />

      <!-- 框选矩形 -->
      <div
        v-if="boxSelect.active"
        class="box-selection"
        :style="boxSelectStyle"
      />

      <!-- 对齐辅助线 -->
      <div v-for="(line, i) in alignLines" :key="'al-' + i"
        class="align-line"
        :class="line.orientation"
        :style="line.style"
      />

      <!-- 8个拉伸控制点 -->
      <template v-if="showHandles">
        <!-- 主控信息浮标 -->
        <div
          v-if="store.selectedWidget"
          class="widget-info-badge"
          :style="infoBadgeStyle"
        ><span class="info-label">x:{{ primaryLeft }}</span>&thinsp;<span class="info-label">y:{{ primaryTop }}</span>&thinsp;<span class="info-label">f:{{ primaryZIndex }}</span>&thinsp;</div>
        <div v-for="h in handleDefs" :key="h.dir"
          class="resize-handle"
          :class="'resize-' + h.dir"
          :style="h.style"
          @mousedown.prevent.stop="onHandleMouseDown($event, h.dir)"
        />
      </template>
    </div>

    <!-- 右键上下文菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
    >
      <div class="menu-item" @click="onMenuAction('copy')">复制 Ctrl+C</div>
      <div class="menu-item" @click="onMenuAction('cut')">剪切 Ctrl+X</div>
      <div class="menu-item" @click="onMenuAction('paste')">粘贴 Ctrl+V</div>
      <div class="menu-separator" />
      <div class="menu-item" @click="onMenuAction('delete')">删除 Delete</div>
      <div class="menu-separator" />
      <div class="menu-item" @click="onMenuAction('bringToFront')">置顶</div>
      <div class="menu-item" @click="onMenuAction('sendToBack')">置底</div>
      <div class="menu-item" @click="onMenuAction('bringForward')">上移一层</div>
      <div class="menu-item" @click="onMenuAction('sendBackward')">下移一层</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import { useThemeStore } from '@/stores/themeStore'
import { useKeyboard } from '@/composables/useKeyboard'
import { setCanvasFocused } from '@/composables/useKeyboard'
import type { WidgetType, Widget } from '@/types/index'
import { getWidgetComponent as getWidgetFromRegistry, isWidgetRegistered } from '@/config/widgetRegistry'
import { getAllCustomWidgetCSS } from '@/config/customWidgetAPI'

const store = useWidgetStore()
const themeStore = useThemeStore()
const { copySelectedToClipboard, cutSelectedToClipboard, pasteFromClipboard } = useKeyboard()

const props = defineProps<{
  showGrid: boolean
}>()

const canvasRef = ref<HTMLElement | null>(null)

/** 渲染版本号 - 控件数量或主题变化时强制重新渲染 */
const renderKey = ref(0)

watch(
  () => store.widgets.length,
  () => { renderKey.value++ }
)

watch(
  () => themeStore.themeVersion,
  () => { renderKey.value++ }
)

/** 画布内联样式（背景色和透明度交给 ::before 伪元素处理） */
const canvasStyle = computed(() => ({
  '--canvas-bg-color': store.canvas.backgroundColor,
  '--canvas-opacity': String((store.canvas.opacity ?? 1) * (store.canvas.masterOpacity ?? 1)),
  width: store.canvas.width + 'px',
  height: store.canvas.height + 'px',
  backgroundColor: 'transparent',
  backdropFilter: (store.canvas as any).canvasBackdropFilter || 'none',
  WebkitBackdropFilter: (store.canvas as any).canvasBackdropFilter || 'none',
  borderColor: store.canvas.borderColor,
  borderWidth: store.canvas.borderWidth + 'px',
  borderRadius: store.canvas.borderRadius + 'px'
}))

/** 标题栏图标 HTML — 安全处理（过滤 script 标签） */
const titleBarSafeIcon = computed(() => {
  const html = store.canvas.titleBarIconHtml
  if (html && html.trim()) return html.replace(/<script[\s\S]*?<\/script>/gi, '')
  const name = store.canvas.titleBarIconName || 'fa-star'
  const cls = name.includes(' ') ? name : `fas ${name}`
  return `<i class="${cls}"></i>`
})

/** 标题栏整体样式（绝对定位，脱离正常流，不干扰控件及控制点坐标计算） */
const titleBarStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute' as any,
  top: '0',
  left: '0',
  right: '0',
  height: '40px',
  backgroundColor: store.canvas.titleBarBgColor,
  opacity: (store.canvas.titleBarOpacity ?? 1) * (store.canvas.masterOpacity ?? 1),
  userSelect: 'none' as any,
  zIndex: 10
}))

/** 标题栏左侧/中间/右侧单元格通用样式 */
const titleBarCellStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  height: '40px'
}))

/** 标题栏图标样式 */
const titleBarIconStyle = computed(() => ({
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  color: store.canvas.titleBarTextColor,
  flexShrink: 0
}))

/** 标题栏文字样式 */
const titleBarTitleStyle = computed(() => ({
  fontSize: '13px',
  fontWeight: 600 as any,
  color: store.canvas.titleBarTextColor,
  userSelect: 'none' as any,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}))

/** 标题栏中间对齐方式 */
const titleBarCenterStyle = computed(() => {
  const alignMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' }
  return {
    ...titleBarCellStyle.value,
    justifyContent: alignMap[store.canvas.titleBarAlign] || 'flex-start'
  }
})

/** 标题栏按钮通用样式（固定颜色，不随标题颜色联动） */
const titleBarBtnStyle = computed(() => ({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  color: store.canvas.titleBarBtnColor || '#333',
  cursor: 'default',
  borderRadius: '4px',
  flexShrink: 0
}))

/** 标题栏关闭按钮样式（悬停红色） */
const titleBarCloseBtnStyle = computed(() => ({
  ...titleBarBtnStyle.value,
  borderRadius: '4px'
}))

/** 获取控件对应组件（委托给 widgetRegistry） */
function getWidgetComponent(type: WidgetType) {
  return getWidgetFromRegistry(type)
}

// ================================================================
// 控制点拉伸
// ================================================================
const HANDLE_SIZE = 8
const HANDLE_OFFSET = 4

/** 8个控制点方向 */
const handleDirections = ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'] as const
type HandleDir = typeof handleDirections[number]

/** 是否显示控制点 */
const showHandles = computed(() => {
  return store.isCanvasSelected || store.selectedWidget !== null
})

/** 获取控制点定位的矩形（使用DOM实际位置，避免计算误差） */
function getHandleTargetRect(): { left: number; top: number; width: number; height: number } {
  if (store.selectedWidget) {
    const s = store.selectedWidget.style
    // 拖拽中通过 dragTick 触发重算，方向键/属性面板通过 _handleTick 触发重算
    void dragTick.value
    void store._handleTick
    // 优先使用DOM实际位置，避免在标签页容器等场景下计算错误
    var widgetEl = document.getElementById(store.selectedWidget.id)
    if (widgetEl && canvasRef.value) {
      var canvasRect = canvasRef.value.getBoundingClientRect()
      var widgetRect = widgetEl.getBoundingClientRect()
      return {
        left: widgetRect.left - canvasRect.left,
        top: widgetRect.top - canvasRect.top,
        width: s.width,
        height: s.height
      }
    }
    // fallback: 使用计算位置
    const abs = store.getAbsolutePosition(store.selectedWidget.id)
    return { left: abs.left, top: abs.top, width: s.width, height: s.height }
  }
  return { left: 0, top: 0, width: store.canvas.width, height: store.canvas.height }
}

/** 控制点定义列表 */
const handleDefs = computed(() => {
  const rect = getHandleTargetRect()
  const { left, top, width, height } = rect

  const positions: Record<HandleDir, { x: number; y: number; cursor: string }> = {
    n:  { x: left + width / 2 - HANDLE_OFFSET, y: top - HANDLE_OFFSET,                  cursor: 'n-resize' },
    s:  { x: left + width / 2 - HANDLE_OFFSET, y: top + height - HANDLE_OFFSET,          cursor: 's-resize' },
    e:  { x: left + width - HANDLE_OFFSET,     y: top + height / 2 - HANDLE_OFFSET,      cursor: 'e-resize' },
    w:  { x: left - HANDLE_OFFSET,             y: top + height / 2 - HANDLE_OFFSET,      cursor: 'w-resize' },
    nw: { x: left - HANDLE_OFFSET,             y: top - HANDLE_OFFSET,                   cursor: 'nw-resize' },
    ne: { x: left + width - HANDLE_OFFSET,     y: top - HANDLE_OFFSET,                   cursor: 'ne-resize' },
    sw: { x: left - HANDLE_OFFSET,             y: top + height - HANDLE_OFFSET,          cursor: 'sw-resize' },
    se: { x: left + width - HANDLE_OFFSET,     y: top + height - HANDLE_OFFSET,          cursor: 'se-resize' }
  }

  return handleDirections.map(dir => ({
    dir,
    style: {
      left: positions[dir].x + 'px',
      top: positions[dir].y + 'px',
      cursor: positions[dir].cursor
    }
  }))
})

/** 主控信息浮标：zIndex / left / top */
const primaryLeft = computed(() => {
  if (!store.selectedWidget) return 0
  return Math.round(store.selectedWidget.style.left)
})

const primaryTop = computed(() => {
  if (!store.selectedWidget) return 0
  return Math.round(store.selectedWidget.style.top)
})

const primaryZIndex = computed(() => {
  if (!store.selectedWidget) return 1
  return store.selectedWidget.style.zIndex ?? 1
})

const infoBadgeStyle = computed(() => {
  const rect = getHandleTargetRect()
  return {
    left: rect.left + 'px',
    top: (rect.top - 22) + 'px',
    width: rect.width + 'px'
  }
})

const GRID_SIZE = 5

function snapToGrid(value: number): number {
  if (!props.showGrid) return value
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

/** 拉伸状态 */
const resizeState = ref({
  active: false,
  direction: '' as string,
  startX: 0,
  startY: 0,
  origLeft: 0,
  origTop: 0,
  origWidth: 0,
  origHeight: 0
})

/** rAF 限流：拉伸 */
let _resizeRAFId: number | null = null
let _resizeLatestEvent: { clientX: number, clientY: number } | null = null

/** 控制点 mousedown - 开始拉伸 */
function onHandleMouseDown(e: MouseEvent, dir: HandleDir) {
  const rect = getHandleTargetRect()

  resizeState.value = {
    active: true,
    direction: dir,
    startX: e.clientX,
    startY: e.clientY,
    origLeft: rect.left,
    origTop: rect.top,
    origWidth: rect.width,
    origHeight: rect.height
  }

  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
}

/** 拉伸移动（rAF 限流，每帧最多1次） */
function onResizeMove(e: MouseEvent) {
  if (!resizeState.value.active) return
  _resizeLatestEvent = { clientX: e.clientX, clientY: e.clientY }

  if (_resizeRAFId !== null) return
  _resizeRAFId = requestAnimationFrame(() => {
    _resizeRAFId = null
    if (!_resizeLatestEvent) return
    const { clientX, clientY } = _resizeLatestEvent
    _resizeLatestEvent = null

    const { direction, startX, startY, origLeft, origTop, origWidth, origHeight } = resizeState.value
    const dx = clientX - startX
    const dy = clientY - startY

    let newWidth = origWidth
    let newHeight = origHeight
    let newLeft = origLeft
    let newTop = origTop

    if (direction.includes('e')) newWidth = Math.max(20, origWidth + dx)
    if (direction.includes('s')) newHeight = Math.max(20, origHeight + dy)
    if (direction.includes('w')) {
      newWidth = Math.max(20, origWidth - dx)
      newLeft = origLeft + (origWidth - newWidth)
    }
    if (direction.includes('n')) {
      newHeight = Math.max(20, origHeight - dy)
      newTop = origTop + (origHeight - newHeight)
    }

    if (props.showGrid) {
      newWidth = snapToGrid(newWidth)
      newHeight = snapToGrid(newHeight)
      newLeft = snapToGrid(newLeft)
      newTop = snapToGrid(newTop)
    }

    if (store.isCanvasSelected) {
      store.canvas.width = Math.max(200, newWidth)
      store.canvas.height = Math.max(150, newHeight)
    } else if (store.selectedWidget) {
      const widget = store.findWidgetById(store.selectedIds[0])
      if (widget) {
        if (widget.parentId) {
          const parentAbs = store.getAbsolutePosition(widget.parentId)
          const parent = store.findWidgetById(widget.parentId)
          widget.style.left = newLeft - parentAbs.left
          widget.style.top = newTop - parentAbs.top
          if (widget.styleData) {
            widget.styleData.base.left = widget.style.left
            widget.styleData.base.top = widget.style.top
          }
          if (parent && parent.type === 'tabsContainer') {
            widget.style.top -= store.getTabHeaderHeight(parent.id)
          }
        } else {
          widget.style.left = newLeft
          widget.style.top = newTop
          if (widget.styleData) {
            widget.styleData.base.left = newLeft
            widget.styleData.base.top = newTop
          }
        }
        widget.style.width = newWidth
        widget.style.height = newHeight
        if (widget.styleData) {
          widget.styleData.base.width = newWidth
          widget.styleData.base.height = newHeight
        }
      }
    }
  })
}

/** 拉伸结束 */
function onResizeEnd() {
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)

  if (_resizeRAFId !== null) {
    cancelAnimationFrame(_resizeRAFId)
    _resizeRAFId = null
  }
  _resizeLatestEvent = null

  // 拉伸后同步尺寸和位置到 customCSS
  if (store.selectedWidget && !store.isCanvasSelected) {
    const widget = store.findWidgetById(store.selectedIds[0])
    if (widget) {
      store.updateWidgetStyle(widget.id, {
        left: widget.style.left,
        top: widget.style.top,
        width: widget.style.width,
        height: widget.style.height
      })
    }
  }

  resizeState.value.active = false
  store.saveState()
}

// ================================================================
// 框选
// ================================================================
const boxSelect = ref({
  active: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  priorPrimaryId: null as string | null,
  shiftKey: false
})

const boxSelectStyle = computed(() => {
  const bs = boxSelect.value
  const left = Math.min(bs.startX, bs.currentX)
  const top = Math.min(bs.startY, bs.currentY)
  const width = Math.abs(bs.currentX - bs.startX)
  const height = Math.abs(bs.currentY - bs.startY)
  return { left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px' }
})

// ================================================================
// 拖拽移动
// ================================================================
const dragState = ref({
  active: false,
  draggingWidgetId: '' as string,
  startMouseX: 0,
  startMouseY: 0,
  startPositions: [] as { id: string; left: number; top: number }[]
})

const DRAG_THRESHOLD = 3

/** rAF 限流：拖拽 */
let _dragRAFId: number | null = null
let _dragLatestEvent: { clientX: number, clientY: number } | null = null

/** 拖拽中每帧递增，触发 handleDefs 重新计算 */
const dragTick = ref(0)

// ================================================================
// 对齐辅助线
// ================================================================
interface AlignLine {
  orientation: 'horizontal' | 'vertical'
  style: Record<string, string>
}

const alignLines = ref<AlignLine[]>([])

/** 对齐阈值 */
const ALIGN_THRESHOLD = 5

// ================================================================
// 右键菜单
// ================================================================
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  widgetId: '' as string
})

// ================================================================
// 事件处理
// ================================================================

/** 判断是否是控件元素 */
function isWidgetElement(target: HTMLElement): boolean {
  return target.classList.contains('ui-widget') ||
    !!target.closest('.ui-widget')
}

/** 判断是否是控制点元素 */
function isHandleElement(target: HTMLElement): boolean {
  return target.classList.contains('resize-handle')
}

/** 获取控件ID */
function getWidgetIdFromElement(el: HTMLElement): string | null {
  const widgetEl = el.classList.contains('ui-widget') ? el : el.closest('.ui-widget')
  if (!widgetEl) return null
  return widgetEl.getAttribute('data-widget-id')
}

/** 画布鼠标按下 */
function onCanvasMouseDown(e: MouseEvent) {
  contextMenu.value.visible = false

  const target = e.target as HTMLElement

  // 排除控制点点击
  if (isHandleElement(target) || target.closest('.resize-handle')) {
    return
  }

  // 判断是否点击在控件上
  if (isWidgetElement(target)) {
    const widgetId = getWidgetIdFromElement(target)
    if (widgetId) {
      if (e.shiftKey) {
        if (store.selectedIds.includes(widgetId)) {
          store.setSelection(store.selectedIds.filter(id => id !== widgetId))
        } else {
          store.addToSelection([widgetId])
        }
      } else {
        if (!store.selectedIds.includes(widgetId)) {
          store.selectWidget(widgetId)
        }
      }
      // 待定拖拽：仅当鼠标移动超过阈值时才启动实际拖拽
      pendingDragWidget(widgetId, e.clientX, e.clientY)
    }
    return
  }

  // 点击在画布空白区域 → 开始框选
  const priorPrimaryId = store.selectedIds[0] || null
  if (!e.shiftKey) {
    store.selectCanvas()
  }

  const rect = canvasRef.value!.getBoundingClientRect()
  boxSelect.value = {
    active: true,
    startX: e.clientX - rect.left,
    startY: e.clientY - rect.top,
    currentX: e.clientX - rect.left,
    currentY: e.clientY - rect.top,
    priorPrimaryId,
    shiftKey: e.shiftKey
  }

  document.addEventListener('mousemove', onBoxSelectMove)
  document.addEventListener('mouseup', onBoxSelectEnd)
}

/** 框选移动 */
function onBoxSelectMove(e: MouseEvent) {
  if (!boxSelect.value.active || !canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  boxSelect.value.currentX = Math.max(0, Math.min(e.clientX - rect.left, store.canvas.width))
  boxSelect.value.currentY = Math.max(0, Math.min(e.clientY - rect.top, store.canvas.height))
}

/** 框选结束 */
function onBoxSelectEnd(_e: MouseEvent) {
  document.removeEventListener('mousemove', onBoxSelectMove)
  document.removeEventListener('mouseup', onBoxSelectEnd)

  if (!boxSelect.value.active) return
  boxSelect.value.active = false

  const bs = boxSelect.value
  const selRect = {
    left: Math.min(bs.startX, bs.currentX),
    top: Math.min(bs.startY, bs.currentY),
    right: Math.max(bs.startX, bs.currentX),
    bottom: Math.max(bs.startY, bs.currentY)
  }

  const width = selRect.right - selRect.left
  const height = selRect.bottom - selRect.top

  if (width < 3 && height < 3) return

  let intersectingIds = store.widgets
    .filter(w => rectsIntersect(selRect, getWidgetRect(w)))
    .map(w => w.id)

  if (intersectingIds.length === 0) return

  if (bs.priorPrimaryId && intersectingIds.includes(bs.priorPrimaryId)) {
    intersectingIds = [bs.priorPrimaryId, ...intersectingIds.filter(id => id !== bs.priorPrimaryId)]
  }

  if (bs.shiftKey) {
    store.addToSelection(intersectingIds)
  } else {
    store.setSelection(intersectingIds)
  }
}

/** 获取控件的矩形 */
function getWidgetRect(w: Widget) {
  return {
    left: w.style.left,
    top: w.style.top,
    right: w.style.left + w.style.width,
    bottom: w.style.top + w.style.height
  }
}

/** 矩形相交检测 */
function rectsIntersect(a: any, b: any): boolean {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom)
}

// ================================================================
// 控件拖拽
// ================================================================

/** 待定拖拽：鼠标移动超过阈值后才启动实际拖拽 */
function pendingDragWidget(widgetId: string, clientX: number, clientY: number) {
  const onMove = (ev: MouseEvent) => {
    if (Math.abs(ev.clientX - clientX) >= DRAG_THRESHOLD || Math.abs(ev.clientY - clientY) >= DRAG_THRESHOLD) {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      startDrag(widgetId, clientX, clientY)
      onWidgetDragMove(ev)
    }
  }

  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

/** 开始拖拽 */
function startDrag(widgetId: string, clientX: number, clientY: number) {
  const widget = store.findWidgetById(widgetId)
  if (!widget) return

  const ids = store.selectedIds.includes(widgetId) ? [...store.selectedIds] : [widgetId]

  dragState.value = {
    active: true,
    draggingWidgetId: widgetId,
    startMouseX: clientX,
    startMouseY: clientY,
    startPositions: ids.map(id => {
      const w = store.findWidgetById(id)
      return w ? { id, left: w.style.left, top: w.style.top } : { id, left: 0, top: 0 }
    })
  }

  document.addEventListener('mousemove', onWidgetDragMove)
  document.addEventListener('mouseup', onWidgetDragEnd)
}

/** 拖拽移动（rAF 限流，每帧最多1次） */
function onWidgetDragMove(e: MouseEvent) {
  if (!dragState.value.active) return
  _dragLatestEvent = { clientX: e.clientX, clientY: e.clientY }

  if (_dragRAFId !== null) return
  _dragRAFId = requestAnimationFrame(() => {
    _dragRAFId = null
    if (!_dragLatestEvent) return
    const { clientX, clientY } = _dragLatestEvent
    _dragLatestEvent = null

    const dx = clientX - dragState.value.startMouseX
    const dy = clientY - dragState.value.startMouseY

    dragState.value.startPositions.forEach(pos => {
      const widget = store.findWidgetById(pos.id)
      if (widget) {
        widget.style.left = pos.left + dx
        widget.style.top = pos.top + dy
        if (widget.styleData) {
          widget.styleData.base.left = widget.style.left
          widget.styleData.base.top = widget.style.top
        }
      }
    })

    computeAlignLines()
    dragTick.value++
  })
}

/** 拖拽结束 */
function onWidgetDragEnd(_e: MouseEvent) {
  document.removeEventListener('mousemove', onWidgetDragMove)
  document.removeEventListener('mouseup', onWidgetDragEnd)

  if (_dragRAFId !== null) {
    cancelAnimationFrame(_dragRAFId)
    _dragRAFId = null
  }
  _dragLatestEvent = null

  dragState.value.active = false
  alignLines.value = []

  // 拖拽后同步位置到 customCSS
  for (const pos of dragState.value.startPositions) {
    const widget = store.findWidgetById(pos.id)
    if (widget) {
      store.updateWidgetStyle(pos.id, { left: widget.style.left, top: widget.style.top })
    }
  }

  store.saveState()
}

// ================================================================
// 对齐辅助线计算
// ================================================================

function computeAlignLines() {
  const lines: AlignLine[] = []
  if (dragState.value.startPositions.length === 0 || !canvasRef.value) {
    alignLines.value = lines
    return
  }

  const movingRects = dragState.value.startPositions.map(pos => {
    const w = store.widgets.find(w => w.id === pos.id)
    if (!w) return null
    return {
      id: pos.id,
      left: w.style.left, top: w.style.top,
      right: w.style.left + w.style.width,
      bottom: w.style.top + w.style.height,
      centerX: w.style.left + w.style.width / 2,
      centerY: w.style.top + w.style.height / 2
    }
  }).filter(Boolean) as any[]

  if (movingRects.length === 0) return

  const staticRects = store.widgets
    .filter(w => w && !store.selectedIds.includes(w.id))
    .map(w => ({
      left: w.style.left, top: w.style.top,
      right: w.style.left + w.style.width,
      bottom: w.style.top + w.style.height,
      centerX: w.style.left + w.style.width / 2,
      centerY: w.style.top + w.style.height / 2
    }))

  const mr = movingRects[0]

  for (const sr of staticRects) {
    if (Math.abs(mr.left - sr.left) < ALIGN_THRESHOLD) {
      lines.push({ orientation: 'vertical', style: { left: sr.left + 'px' } })
    }
    if (Math.abs(mr.right - sr.right) < ALIGN_THRESHOLD) {
      lines.push({ orientation: 'vertical', style: { left: sr.right + 'px' } })
    }
    if (Math.abs(mr.centerX - sr.centerX) < ALIGN_THRESHOLD) {
      lines.push({ orientation: 'vertical', style: { left: sr.centerX + 'px' } })
    }
    if (Math.abs(mr.top - sr.top) < ALIGN_THRESHOLD) {
      lines.push({ orientation: 'horizontal', style: { top: sr.top + 'px' } })
    }
    if (Math.abs(mr.bottom - sr.bottom) < ALIGN_THRESHOLD) {
      lines.push({ orientation: 'horizontal', style: { top: sr.bottom + 'px' } })
    }
    if (Math.abs(mr.centerY - sr.centerY) < ALIGN_THRESHOLD) {
      lines.push({ orientation: 'horizontal', style: { top: sr.centerY + 'px' } })
    }
  }

  const deduped: AlignLine[] = []
  const seen = new Set<string>()
  for (const line of lines) {
    const key = line.orientation + '_' + JSON.stringify(line.style)
    if (!seen.has(key)) {
      seen.add(key)
      deduped.push(line)
    }
  }

  alignLines.value = deduped
}

// ================================================================
// 右键菜单
// ================================================================

function onContextMenu(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (isHandleElement(target)) return

  if (isWidgetElement(target)) {
    const widgetId = getWidgetIdFromElement(target)
    if (widgetId && !store.selectedIds.includes(widgetId)) {
      store.selectWidget(widgetId)
    }
  }

  contextMenu.value = {
    visible: true,
    x: e.clientX,
    y: e.clientY,
    widgetId: ''
  }
}

function onMenuAction(action: string) {
  contextMenu.value.visible = false

  switch (action) {
    case 'copy':
      copySelectedToClipboard()
      break
    case 'cut':
      cutSelectedToClipboard()
      break
    case 'paste':
      pasteFromClipboard()
      break
    case 'delete':
      if (store.selectedIds.length > 0) {
        store.removeWidgets([...store.selectedIds])
        store.saveState()
      }
      break
    case 'bringToFront':
      store.bringSelectedToFront()
      store.saveState()
      break
    case 'sendToBack':
      store.sendSelectedToBack()
      store.saveState()
      break
    case 'bringForward':
      store.bringSelectedForward()
      store.saveState()
      break
    case 'sendBackward':
      store.sendSelectedBackward()
      store.saveState()
      break
  }
}

function onDocMouseDown(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.context-menu')) {
    contextMenu.value.visible = false
  }
}

// ================================================================
// 拖放创建控件（从控件库拖入）
// ================================================================

function onDragOver(event: DragEvent) {
  if (!event.dataTransfer) return
  event.dataTransfer.dropEffect = 'copy'
}

function onDrop(event: DragEvent) {
  if (!event.dataTransfer || !canvasRef.value) return
  const type = event.dataTransfer.getData('text/plain') as WidgetType

  if (type === 'messageBox') {
    store.selectedIds = []
    store.inputBoxPanelVisible = false
    store.messageBoxPanelVisible = true
    store.saveState()
    return
  }

  if (type === 'inputBox') {
    store.selectedIds = []
    store.messageBoxPanelVisible = false
    store.inputBoxPanelVisible = true
    store.saveState()
    return
  }

  if (!type || !isWidgetRegistered(type)) return

  // 检查是否拖放到标签页容器的内容区域
  const target = event.target as HTMLElement
  const tabContent = target.closest('[data-container-type="tab-content"]') as HTMLElement | null

  if (tabContent) {
    const parentId = tabContent.getAttribute('data-parent-id')
    const tabIndex = parseInt(tabContent.getAttribute('data-tab-index') || '0', 10)

    if (parentId) {
      const tabRect = tabContent.getBoundingClientRect()
      const x = event.clientX - tabRect.left
      const y = event.clientY - tabRect.top

      const widget = store.addWidgetAsChild(parentId, type, Math.round(x), Math.round(y), tabIndex)
      if (widget) {
        store.setSelection([widget.id])
        store.saveState()
      }
      return
    }
  }

  // 检查是否拖放到卡片框容器
  const cardBody = target.closest('[data-container-type="card-body"]') as HTMLElement | null
  if (cardBody) {
    const parentId = cardBody.getAttribute('data-parent-id')
    if (parentId) {
      const bodyRect = cardBody.getBoundingClientRect()
      const x = event.clientX - bodyRect.left
      const y = event.clientY - bodyRect.top
      const widget = store.addWidgetToCardContainer(parentId, type, Math.round(x), Math.round(y))
      if (widget) {
        store.setSelection([widget.id])
        store.saveState()
      }
      return
    }
  }

  // 默认：添加到画布顶层
  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const widget = store.addWidget(type, Math.round(x), Math.round(y))
  store.setSelection([widget.id])
  store.saveState()
}

// ================================================================
// 控件 & 画布 CSS 注入 - 将 customCSS 变为真实 <style> 标签插入 DOM
// 这是 CSS 编辑器 ↔ 设计区实时联动的核心链路
// ================================================================

const widgetCSSStyleEl = ref<HTMLStyleElement | null>(null)

/** 递归收集所有控件（含容器嵌套子控件）的 customCSS */
function collectAllCustomCSS(list: Widget[]): string {
  let css = ''
  for (const w of list) {
    if (w.customCSS) css += w.customCSS + '\n'
    if (w.children && w.children.length > 0) {
      css += collectAllCustomCSS(w.children)
    }
  }
  return css
}

/** 汇总控件 + 画布 + 自定义控件的 customCSS，注入到 DOM 中实现设计区实时效果 */
const allWidgetCSS = computed(() => {
  const widgetCSS = collectAllCustomCSS(store.widgets)
  const canvasCSS = store.canvas.customCSS || ''
  const customWidgetCSS = getAllCustomWidgetCSS()
  return widgetCSS + '\n' + canvasCSS + '\n' + customWidgetCSS
})

watch(allWidgetCSS, (css) => {
  if (!widgetCSSStyleEl.value) {
    widgetCSSStyleEl.value = document.createElement('style')
    widgetCSSStyleEl.value.setAttribute('data-source', 'custom-css')
    document.head.appendChild(widgetCSSStyleEl.value)
  }
  widgetCSSStyleEl.value.textContent = css
}, { immediate: true })

// ================================================================
// 生命周期
// ================================================================

onMounted(() => {
  store.initHistory()
  document.addEventListener('mousedown', onDocMouseDown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocMouseDown)
  widgetCSSStyleEl.value?.remove()
})
</script>

<style scoped>
.canvas-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.canvas {
  position: relative;
  background-color: transparent;
  background-image: none;
  border: 0px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  overflow: hidden;
  min-height: 100px;
}

/* 画布背景层（独立透明度，不影响标题栏和控件） */
.canvas::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-color: var(--canvas-bg-color);
  background-image: radial-gradient(circle, #a6a1f7 1px, transparent 1px);
  background-size: 5px 5px;
  opacity: var(--canvas-opacity);
  border-radius: inherit;
}

.canvas.no-grid::before {
  background-image: none;
}

.canvas.no-grid {
  background-image: none;
}

.canvas:hover {
  border-color: #e5e5e5;
}

/* ===== 画布标题栏（绝对定位，脱离正常流） ===== */
.canvas-titlebar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  user-select: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.tb-left {
  width: 40px;
  justify-content: center;
  flex-shrink: 0;
}

.tb-center {
  flex: 1;
  justify-content: center;
  min-width: 0;
}

.tb-right {
  width: auto;
  justify-content: flex-end;
  gap: 2px;
  padding-right: 4px;
  flex-shrink: 0;
}

.tb-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tb-icon :deep(i) {
  font-size: 18px;
}

.tb-title {
  user-select: none;
}

.tb-btn:hover {
  background: rgba(0, 0, 0, 0.06);
}

.tb-btn-close:hover {
  background: #e81123 !important;
  color: #fff !important;
}

/* 框选矩形 */
.box-selection {
  position: absolute;
  border: 2px solid #1890ff;
  background-color: rgba(24, 144, 255, 0.15);
  z-index: 1000;
  pointer-events: none;
  border-radius: 2px;
}

/* 对齐辅助线 */
.align-line {
  position: absolute;
  background-color: #ff4d4f;
  z-index: 999;
  pointer-events: none;
}

.align-line.vertical {
  width: 1px;
  top: 0;
  bottom: 0;
}

.align-line.horizontal {
  height: 1px;
  left: 0;
  right: 0;
}

/* 拉伸控制点 */
.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #1890ff;
  border: 1px solid #ffffff;
  border-radius: 1px;
  z-index: 100;
}

.resize-nw { cursor: nw-resize; }
.resize-ne { cursor: ne-resize; }
.resize-sw { cursor: sw-resize; }
.resize-se { cursor: se-resize; }
.resize-n  { cursor: n-resize; }
.resize-s  { cursor: s-resize; }
.resize-e  { cursor: e-resize; }
.resize-w  { cursor: w-resize; }

/* 主控信息浮标 */
.widget-info-badge {
  position: absolute;
  height: 18px;
  line-height: 18px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: center;
  z-index: 2001;
  pointer-events: none;
  white-space: nowrap;
}

.widget-info-badge .info-label {
  display: inline-block;
  background: rgba(0, 0, 0, 0.3);
  color: #f8fcff;
  font-size: 11px;
  font-weight: 600;
  padding: 0 4px;
  border-radius: 2px;
  line-height: 14px;
}

/* 右键菜单 */
.context-menu {
  position: fixed;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  z-index: 10000;
  min-width: 160px;
  font-size: 13px;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.15s;
  user-select: none;
}

.menu-item:hover {
  background-color: #e6f7ff;
  color: #1890ff;
}

.menu-separator {
  height: 1px;
  background-color: #f0f0f0;
  margin: 4px 0;
}
</style>