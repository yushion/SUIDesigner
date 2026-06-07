/**
 * @file useKeyboard.ts
 * @description 全局快捷键监听
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import { generateDefaultCustomCSS } from '@/utils/defaultCSS'
import { getWidgetLibraryItems } from '@/config/widgetRegistry'
import type { WidgetType, Widget } from '@/types'

/** 剪贴板存储（模块级别，跨组件共享） */
let clipboard: any[] | null = null
let clipboardType: 'copy' | 'cut' | null = null

/** 画布焦点状态（仅鼠标在画布区时允许方向键微调） */
let canvasFocused = false

export { clipboard, clipboardType }

/** 设置画布焦点状态 */
export function setCanvasFocused(value: boolean) {
  canvasFocused = value
}

/** 获取画布焦点状态 */
export function isCanvasFocused(): boolean {
  return canvasFocused
}

export function useKeyboard() {
  const store = useWidgetStore()

  function isInputFocused(): boolean {
    const el = document.activeElement as HTMLElement | null
    if (!el) return false
    const tag = el.tagName?.toLowerCase()
    if (['input', 'textarea', 'select'].includes(tag || '')) return true
    if (el.isContentEditable) return true
    if (el.closest('.monaco-editor')) return true
    return false
  }

  function handleKeydown(e: KeyboardEvent) {
    if (isInputFocused()) return

    const ctrl = e.ctrlKey || e.metaKey

    if (ctrl && e.key === 'z') {
      e.preventDefault()
      store.undo()
      return
    }

    if (ctrl && e.key === 'y') {
      e.preventDefault()
      store.redo()
      return
    }

    if (ctrl && e.key === 'c') {
      e.preventDefault()
      copySelectedToClipboard()
      return
    }

    if (ctrl && e.key === 'x') {
      e.preventDefault()
      cutSelectedToClipboard()
      return
    }

    if (ctrl && e.key === 'v') {
      e.preventDefault()
      pasteFromClipboard()
      return
    }

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      deleteSelected()
      return
    }

    // 方向键微调控件位置（仅画布区鼠标悬停时有效，防止影响属性面板编辑）
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (!canvasFocused || store.selectedIds.length === 0) return
      e.preventDefault()
      const step = e.shiftKey ? 10 : 1
      const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0
      const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0

      store.selectedIds.forEach(id => {
        const widget = store.findWidgetById(id)
        if (widget) {
          widget.style.left += dx
          widget.style.top += dy
        }
      })
      // 触发控制点重算（方向键修改后需要重新读取 DOM 位置）
      store.tickHandles()
      store.saveState()
      return
    }
  }

  /**
   * 深克隆控件数据到剪贴板（递归查找含容器子控件，保留除 id/parentId/children 外的全部属性）
   */
  function copySelectedToClipboard() {
    if (store.selectedIds.length === 0) return
    const selected = store.selectedIds
      .map(id => store.findWidgetById(id))
      .filter(Boolean) as Widget[]
    clipboard = selected.map(w => {
      const clone = JSON.parse(JSON.stringify(w))
      delete clone.id
      delete clone.parentId
      delete clone.parentTabIndex
      delete clone.children
      return clone
    })
    clipboardType = 'copy'
  }

  function cutSelectedToClipboard() {
    copySelectedToClipboard()
    clipboardType = 'cut'
    const ids = [...store.selectedIds]
    store.removeWidgets(ids)
    store.selectCanvas()
    store.saveState()
  }

  /**
   * 粘贴剪贴板中的控件
   * - 如果当前选中了标签页容器，则粘贴为容器的子控件（按激活标签页）
   * - 如果当前选中了卡片框容器，则粘贴为容器的子控件
   * - 否则粘贴到画布顶层（偏移 10px）
   */
  function pasteFromClipboard() {
    if (!clipboard || clipboard.length === 0) return

    // 检查是否粘贴到容器内（标签页容器 / 卡片框）
    const selectedWidget = store.selectedWidget
    let parentId: string | undefined
    let parentTabIndex: number | undefined

    if (selectedWidget && (selectedWidget.type === 'tabsContainer' || selectedWidget.type === 'cardBox')) {
      parentId = selectedWidget.id
      if (selectedWidget.type === 'tabsContainer') {
        const activeTabName = selectedWidget.activeTab || (selectedWidget.tabs && selectedWidget.tabs.length > 0 ? selectedWidget.tabs[0].name : undefined)
        if (selectedWidget.tabs && activeTabName) {
          const idx = selectedWidget.tabs.findIndex((t: any) => t.name === activeTabName)
          parentTabIndex = idx >= 0 ? idx : 0
        } else {
          parentTabIndex = 0
        }
      }
    }

    const offset = clipboardType === 'cut' ? 0 : 10
    const newIds: string[] = []

    clipboard.forEach(item => {
      const newId = store.generateUniqueId(item.type)
      const config = getWidgetLibraryItems().find(it => it.type === item.type)
      const suffixMatch = newId.match(/_(\d+)$/)
      const suffix = suffixMatch ? suffixMatch[1] : newId
      const displayName = config ? `${config.label}_${suffix}` : newId
      const newWidget: any = {
        ...item,
        id: newId,
        name: displayName,
        style: {
          ...item.style,
          left: parentId ? offset : ((item.style.left || 0) + offset),
          top: parentId ? offset : ((item.style.top || 0) + offset),
          zIndex: store.nextZIndex()
        }
      }
      // 过滤 transition 相关属性，防止粘贴后拖拽延迟卡顿
      delete (newWidget.style as any).transition
      delete (newWidget.style as any).transitionDelay
      delete (newWidget.style as any).transitionDuration
      delete (newWidget.style as any).transitionProperty
      delete (newWidget.style as any).transitionTimingFunction
      if (newWidget.styleData?.base) {
        delete newWidget.styleData.base.transition
        delete newWidget.styleData.base.transitionDelay
        delete newWidget.styleData.base.transitionDuration
        delete newWidget.styleData.base.transitionProperty
        delete newWidget.styleData.base.transitionTimingFunction
      }

      // 粘贴到标签页容器内
      if (parentId) {
        newWidget.parentId = parentId
        newWidget.parentTabIndex = parentTabIndex
        if (!selectedWidget!.children) selectedWidget!.children = []
        selectedWidget!.children.push(newWidget)
      } else {
        // 粘贴到画布顶层
        store.widgets.push(newWidget as any)
      }

      // 重新生成 customCSS（使用新控件 ID）
      newWidget.customCSS = generateDefaultCustomCSS(newWidget)
      newIds.push(newId)
    })

    if (clipboardType === 'cut') {
      clipboard = null
      clipboardType = null
    }

    store.setSelection(newIds)
    store.saveState()
  }

  function deleteSelected() {
    if (store.selectedIds.length === 0) return
    store.removeWidgets([...store.selectedIds])
    store.selectCanvas()
    store.saveState()
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    copySelectedToClipboard,
    cutSelectedToClipboard,
    pasteFromClipboard,
    deleteSelected,
    clipboard,
    clipboardType
  }
}