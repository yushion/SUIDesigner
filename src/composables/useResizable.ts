/**
 * @file useResizable.ts
 * @description 通用边缘拖拽调整宽高的 Vue Composable
 *
 * 使用方式：
 *   import { useResizable } from '@/composables/useResizable'
 *   const targetRef = ref<HTMLElement | null>(null)
 *   useResizable(targetRef, { minWidth: 300, minHeight: 200 })
 *
 * 特点：
 *   - 零 DOM 侵入：不添加额外元素，纯 JS 检测边缘 + 动态 cursor
 *   - 8 方向调整：n / s / e / w / ne / nw / se / sw
 *   - 支持 fixed / absolute / 普通流 定位
 *   - 最小/最大宽高约束
 *   - 自动清理事件监听
 */

import { ref, watch, onUnmounted, type Ref } from 'vue'

/** 调整方向 */
type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

interface ResizableOptions {
  /** 边缘检测阈值（px），默认 6 */
  edgeThreshold?: number
  /** 最小宽度（px），默认 200 */
  minWidth?: number
  /** 最小高度（px），默认 150 */
  minHeight?: number
  /** 最大宽度（px），默认 Infinity */
  maxWidth?: number
  /** 最大高度（px），默认 Infinity */
  maxHeight?: number
  /** 动态开关（Ref<boolean>），默认总是启用 */
  enabled?: Ref<boolean>
}

export function useResizable(
  targetRef: Ref<HTMLElement | null>,
  options: ResizableOptions = {}
) {
  const {
    edgeThreshold = 6,
    minWidth = 200,
    minHeight = 150,
    maxWidth = Infinity,
    maxHeight = Infinity,
    enabled
  } = options

  /** 是否正在拖拽调整 */
  const isResizing = ref(false)

  // ---- 内部状态 ----
  let resizeDir: ResizeDirection | null = null
  let startX = 0
  let startY = 0
  let startWidth = 0
  let startHeight = 0
  let startLeft = 0
  let startTop = 0
  let activeTarget: HTMLElement | null = null

  // ---- 辅助函数 ----

  /** 检测鼠标位于元素哪个边缘（返回 null 表示不在边缘） */
  function detectEdge(el: HTMLElement, clientX: number, clientY: number): ResizeDirection | null {
    const rect = el.getBoundingClientRect()
    const t = edgeThreshold

    const atTop = clientY - rect.top <= t
    const atBottom = rect.bottom - clientY <= t
    const atLeft = clientX - rect.left <= t
    const atRight = rect.right - clientX <= t

    if (atTop && atLeft) return 'nw'
    if (atTop && atRight) return 'ne'
    if (atBottom && atLeft) return 'sw'
    if (atBottom && atRight) return 'se'
    if (atTop) return 'n'
    if (atBottom) return 's'
    if (atLeft) return 'w'
    if (atRight) return 'e'
    return null
  }

  /** 根据方向返回对应的 CSS cursor */
  function cursorForDir(dir: ResizeDirection): string {
    const map: Record<ResizeDirection, string> = {
      n: 'n-resize',
      s: 's-resize',
      e: 'e-resize',
      w: 'w-resize',
      ne: 'ne-resize',
      nw: 'nw-resize',
      se: 'se-resize',
      sw: 'sw-resize'
    }
    return map[dir]
  }

  /** 判断元素是否使用固定/绝对定位（需要调整 left/top） */
  function isPositioned(el: HTMLElement): boolean {
    const pos = window.getComputedStyle(el).position
    return pos === 'fixed' || pos === 'absolute'
  }

  // ---- 事件处理器 ----

  function onMouseMove(e: MouseEvent) {
    if (!targetRef.value) return
    if (enabled && !enabled.value) {
      targetRef.value.style.cursor = ''
      return
    }

    // 调整中则不更新 cursor
    if (isResizing.value) return

    const dir = detectEdge(targetRef.value, e.clientX, e.clientY)
    targetRef.value.style.cursor = dir ? cursorForDir(dir) : ''
  }

  function onMouseDown(e: MouseEvent) {
    if (!targetRef.value) return
    if (enabled && !enabled.value) return

    // 排除标题栏等内部可点击区域（可选：仅当 target 本身被点击，非子元素时调整）
    // 这里不做限制：在边缘区域按下即开始调整

    const dir = detectEdge(targetRef.value, e.clientX, e.clientY)
    if (!dir) return

    e.preventDefault()
    e.stopPropagation()

    const el = targetRef.value
    const rect = el.getBoundingClientRect()

    resizeDir = dir
    startX = e.clientX
    startY = e.clientY
    startWidth = rect.width
    startHeight = rect.height
    startLeft = rect.left
    startTop = rect.top
    activeTarget = el
    isResizing.value = true

    // 固定/绝对定位元素先转换为像素定位
    if (isPositioned(el)) {
      const style = window.getComputedStyle(el)
      if (style.left !== 'auto') el.style.left = `${rect.left}px`
      if (style.top !== 'auto') el.style.top = `${rect.top}px`
      el.style.width = `${rect.width}px`
      el.style.height = `${rect.height}px`
      el.style.right = 'auto'
      el.style.bottom = 'auto'

      // 清除 transform 居中偏移
      if (style.transform && style.transform !== 'none') {
        el.style.transform = 'none'
      }
    }

    el.style.cursor = cursorForDir(dir)

    document.addEventListener('mousemove', onResizeMove)
    document.addEventListener('mouseup', onResizeEnd)
    document.body.style.userSelect = 'none'
  }

  function onResizeMove(e: MouseEvent) {
    if (!isResizing.value || !resizeDir || !activeTarget) return

    const dx = e.clientX - startX
    const dy = e.clientY - startY
    let newW = startWidth
    let newH = startHeight
    let newL = startLeft
    let newT = startTop
    const positioned = isPositioned(activeTarget)

    // 宽度方向
    if (resizeDir.includes('e')) {
      newW = startWidth + dx
    }
    if (resizeDir.includes('w')) {
      newW = startWidth - dx
      if (positioned) newL = startLeft + dx
    }

    // 高度方向
    if (resizeDir.includes('s')) {
      newH = startHeight + dy
    }
    if (resizeDir.includes('n')) {
      newH = startHeight - dy
      if (positioned) newT = startTop + dy
    }

    // 边界约束
    newW = Math.max(minWidth, Math.min(maxWidth, newW))
    newH = Math.max(minHeight, Math.min(maxHeight, newH))

    // 应用尺寸
    activeTarget.style.width = `${newW}px`
    activeTarget.style.height = `${newH}px`

    // 固定/绝对定位元素同步更新位置
    if (positioned) {
      activeTarget.style.left = `${newL}px`
      activeTarget.style.top = `${newT}px`
    }
  }

  function onResizeEnd() {
    isResizing.value = false
    resizeDir = null
    activeTarget = null

    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
    document.body.style.userSelect = ''
  }

  // ---- 生命周期 ----

  /** 绑定/解绑事件：挂载到 targetRef 所在 document */
  function bind() {
    const el = targetRef.value
    if (!el) return
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mousedown', onMouseDown)
  }

  function unbind() {
    const el = targetRef.value
    if (el) {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mousedown', onMouseDown)
      el.style.cursor = ''
    }
    // 清理残留的全局监听
    document.removeEventListener('mousemove', onResizeMove)
    document.removeEventListener('mouseup', onResizeEnd)
    document.body.style.userSelect = ''
  }

  // 当 targetRef 变化时重新绑定
  watch(targetRef, (newEl, oldEl) => {
    if (oldEl) {
      oldEl.removeEventListener('mousemove', onMouseMove)
      oldEl.removeEventListener('mousedown', onMouseDown)
      oldEl.style.cursor = ''
    }
    if (newEl) {
      bind()
    }
  })

  // 启用/禁用开关
  if (enabled) {
    watch(enabled, (val) => {
      const el = targetRef.value
      if (el && !val) {
        el.style.cursor = ''
      }
    })
  }

  onUnmounted(() => {
    unbind()
  })

  return {
    /** 是否正在拖拽调整尺寸 */
    isResizing,
    /** 手动清理（通常不需要调用，onUnmounted 自动处理） */
    cleanup: unbind
  }
}