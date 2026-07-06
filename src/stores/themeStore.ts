/**
 * @file stores/themeStore.ts
 * @description 主题状态管理 - 快照式主题切换
 *
 * 核心设计：
 * - "默认风格" = 无主题覆盖，控件保持 JSON 配置的原始样式
 * - 从默认切换到其他主题时，先保存当前所有控件的完整快照
 * - 切回默认时，从快照精确还原，确保"撤销主题效果"
 *
 * 流程：
 * 1. 默认 → Mica：保存快照，应用 Mica 覆盖
 * 2. Mica → Acrylic：直接应用 Acrylic 覆盖（不更新快照）
 * 3. Acrylic → 默认：从快照还原（回到步骤1前的状态）
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { allThemes, themesById, getDefaultTheme, type Theme } from '@/config/themes'
import { useWidgetStore } from './widgetStore'
import { generateWidgetCSS } from '@/utils/cssParser'
import { generateWidgetCSS as generateWidgetCSSFromConfig } from '@/utils/cssGenerator'
import { getWidgetDefaultConfig } from '@/config/mergeDefaults'

export const useThemeStore = defineStore('theme', () => {
  /** 当前激活的主题 ID */
  const currentThemeId = ref<string>(getDefaultTheme().id)

  /** 主题变更版本号（每次切换主题时递增，供 CanvasArea 监听强制重渲染） */
  const themeVersion = ref(0)

  /** 是否正在应用主题（防止循环更新） */
  let _applyingTheme = false

  /** 从"默认风格"切换到其他主题前的控件快照（widgetId → { style, styleData }） */
  let _themeSnapshot: {
    canvas: Record<string, any>
    widgets: Record<string, { style: Record<string, any>; styleData: any }>
  } | null = null

  /**
   * 应用主题
   * - 'default' = 恢复快照（而不是应用另一套模板）
   * - 其他主题 = 保存快照（如果当前是默认）、然后覆盖控件样式
   */
  function applyTheme(themeId: string) {
    if (_applyingTheme) return
    const theme = themesById[themeId]
    if (!theme) {
      console.warn(`[themeStore] 未知主题ID: ${themeId}`)
      return
    }

    _applyingTheme = true
    console.info(`[themeStore] 应用主题: ${theme.name} (${theme.id}) mode=${theme.mode}`)

    try {
      const widgetStore = useWidgetStore()
      const root = document.documentElement

      // ── 切回默认风格：恢复快照 ──
      if (themeId === 'default') {
        applyDefaultThemeCSSVars(theme, root)
        if (_themeSnapshot) {
          restoreSnapshot(widgetStore)
        } else {
          // 初始加载无快照：仅应用 global 样式到画布
          applyCanvasGlobal(widgetStore, theme)
        }
        widgetStore.canvas.bodyBackground = widgetStore.canvas.bodyBackground || { enabled: false, imageUrl: '', imageSize: 'cover', imageRepeat: 'no-repeat', imagePosition: 'center' }
        widgetStore.canvas.bodyBackground.enabled = false
        currentThemeId.value = 'default'
        themeVersion.value++
        widgetStore.saveState()
        console.info(`[themeStore] 已恢复默认风格`)
        return
      }

      // ── 从默认切出：保存快照 ──
      if (currentThemeId.value === 'default') {
        saveSnapshot(widgetStore)
        console.info(`[themeStore] 已保存默认风格快照 (${Object.keys(_themeSnapshot?.widgets || {}).length}个控件)`)
      }

      // ── 应用目标主题 ──
      setThemeCSSVars(theme, root)
      applyCanvasGlobal(widgetStore, theme)

      // 背景图
      if (!widgetStore.canvas.bodyBackground) {
        widgetStore.canvas.bodyBackground = { enabled: false, imageUrl: '', imageSize: 'cover', imageRepeat: 'no-repeat', imagePosition: 'center' }
      }
      if (theme.global.bodyBackgroundImage && theme.global.bodyBackgroundImage !== 'none') {
        widgetStore.canvas.bodyBackground.enabled = true
        widgetStore.canvas.bodyBackground.imageUrl = theme.global.bodyBackgroundImage
      }

      // 覆盖控件样式
      console.info(`[themeStore] 应用主题覆盖: ${themeId} (${widgetStore.widgets.length}个控件)`)
      applyThemeOverrides(widgetStore, theme)

      currentThemeId.value = themeId
      themeVersion.value++
      widgetStore.saveState()
      console.info(`[themeStore] 主题应用完成: ${theme.name}`)
    } catch (err) {
      console.error(`[themeStore] 应用主题失败: ${themeId}`, err)
    } finally {
      _applyingTheme = false
    }
  }

  /** 设置主题 CSS 变量到根元素 */
  function setThemeCSSVars(theme: Theme, root: HTMLElement) {
    if (theme.global.canvasBackgroundColor) root.style.setProperty('--canvas-bg-color', theme.global.canvasBackgroundColor)
    if (theme.global.canvasBackdropFilter) root.style.setProperty('--canvas-blur', theme.global.canvasBackdropFilter)
    if (theme.global.textColor) root.style.setProperty('--text-color', theme.global.textColor)
    if (theme.global.accentColor) root.style.setProperty('--accent-color', theme.global.accentColor)
    if (theme.global.glassBlur) root.style.setProperty('--glass-blur', theme.global.glassBlur)
    if (theme.global.canvasBorderColor) root.style.setProperty('--canvas-border-color', theme.global.canvasBorderColor)
  }

  /** 仅应用默认主题的 CSS 变量（不覆盖控件） */
  function applyDefaultThemeCSSVars(theme: Theme, root: HTMLElement) {
    setThemeCSSVars(theme, root)
  }

  /** 应用 global 样式到画布对象 */
  function applyCanvasGlobal(widgetStore: any, theme: Theme) {
    const g = theme.global
    const canvasUpdates: Record<string, any> = {}
    if (g.canvasBackgroundColor) canvasUpdates.backgroundColor = g.canvasBackgroundColor
    if (g.canvasBackdropFilter) { canvasUpdates.canvasBackdropFilter = g.canvasBackdropFilter; canvasUpdates.glassEffect = g.canvasBackdropFilter !== 'none' }
    if (g.canvasBorderColor) canvasUpdates.borderColor = g.canvasBorderColor
    if (g.canvasOpacity !== undefined) canvasUpdates.opacity = g.canvasOpacity
    canvasUpdates.titleBarBgColor = g.titleBarBgColor || g.canvasBackgroundColor || '#ffffff'
    canvasUpdates.titleBarOpacity = g.titleBarOpacity !== undefined ? g.titleBarOpacity : (theme.mode === 'dark' ? 0.9 : 1)
    canvasUpdates.titleBarTextColor = g.titleBarTextColor || g.textColor || '#1e1e1e'
    if (Object.keys(canvasUpdates).length > 0) widgetStore.updateCanvas(canvasUpdates)
  }

  /** 保存当前所有控件样式快照 */
  function saveSnapshot(widgetStore: any) {
    const snapshotWidgets: Record<string, { style: Record<string, any>; styleData: any }> = {}
    const allWidgets = widgetStore.widgets as any[]
    _collectAllForSnapshot(allWidgets, snapshotWidgets)

    _themeSnapshot = {
      canvas: {
        backgroundColor: widgetStore.canvas.backgroundColor,
        borderColor: widgetStore.canvas.borderColor,
        opacity: widgetStore.canvas.opacity,
        glassEffect: widgetStore.canvas.glassEffect,
        titleBarBgColor: widgetStore.canvas.titleBarBgColor,
        titleBarOpacity: widgetStore.canvas.titleBarOpacity,
        titleBarTextColor: widgetStore.canvas.titleBarTextColor,
        canvasBackdropFilter: widgetStore.canvas.canvasBackdropFilter,
      },
      widgets: snapshotWidgets
    }
  }

  /** 递归收集控件样式快照 */
  function _collectAllForSnapshot(widgets: any[], out: Record<string, { style: Record<string, any>; styleData: any }>) {
    for (const w of widgets) {
      if (!w) continue
      out[w.id] = {
        style: { ...w.style },
        styleData: w.styleData ? JSON.parse(JSON.stringify(w.styleData)) : undefined
      }
      if (w.children && w.children.length > 0) {
        _collectAllForSnapshot(w.children, out)
      }
    }
  }

  /** 从快照恢复控件样式和画布样式 */
  function restoreSnapshot(widgetStore: any) {
    const snap = _themeSnapshot!
    // 恢复画布
    const s = snap.canvas
    if (s.backgroundColor !== undefined) widgetStore.canvas.backgroundColor = s.backgroundColor
    if (s.borderColor !== undefined) widgetStore.canvas.borderColor = s.borderColor
    if (s.opacity !== undefined) widgetStore.canvas.opacity = s.opacity
    if (s.glassEffect !== undefined) widgetStore.canvas.glassEffect = s.glassEffect
    if (s.titleBarBgColor !== undefined) widgetStore.canvas.titleBarBgColor = s.titleBarBgColor
    if (s.titleBarOpacity !== undefined) widgetStore.canvas.titleBarOpacity = s.titleBarOpacity
    if (s.titleBarTextColor !== undefined) widgetStore.canvas.titleBarTextColor = s.titleBarTextColor
    if (s.canvasBackdropFilter !== undefined) widgetStore.canvas.canvasBackdropFilter = s.canvasBackdropFilter

    // 递归恢复控件
    const counts = { restored: 0, regenerated: 0 }
    _restoreWidgets(widgetStore.widgets, snap.widgets, counts)
    console.info(`[themeStore] 快照恢复: ${counts.restored}个从快照, ${counts.regenerated}个从JSON重建`)
  }

  /** 递归恢复控件样式 */
  function _restoreWidgets(
    widgets: any[],
    snapWidgets: Record<string, { style: Record<string, any>; styleData: any }>,
    counts: { restored: number; regenerated: number }
  ) {
    for (const w of widgets) {
      if (!w) continue
      const snap = snapWidgets[w.id]
      if (snap) {
        Object.assign(w.style, snap.style)
        if (snap.styleData) w.styleData = JSON.parse(JSON.stringify(snap.styleData))
        _rebuildWidgetCSS(w)
        counts.restored++
      } else {
        // 控件在应用主题后新建 → 用 JSON 配置重建默认样式（保留位置尺寸）
        _resetWidgetToJSONDefaults(w)
        counts.regenerated++
      }
      if (w.children && w.children.length > 0) {
        _restoreWidgets(w.children, snapWidgets, counts)
      }
    }
  }

  /** 根据 widget.styleData 重新生成 customCSS */
  function _rebuildWidgetCSS(widget: any) {
    const jsonConfig = getWidgetDefaultConfig(widget.type)
    widget.customCSS = (jsonConfig && widget.styleData)
      ? generateWidgetCSSFromConfig(widget, jsonConfig)
      : generateWidgetCSS(widget)
  }

  /** 将控件样式重置为 JSON 默认值（保留位置尺寸） */
  function _resetWidgetToJSONDefaults(widget: any) {
    const jsonConfig = getWidgetDefaultConfig(widget.type)
    if (!jsonConfig) return
    const defaultBase = jsonConfig.defaultStyleData.base
    const { left, top, width, height, zIndex } = widget.style
    Object.assign(widget.style, defaultBase)
    Object.assign(widget.style, { left, top, width, height, zIndex })
    widget.styleData = JSON.parse(JSON.stringify(jsonConfig.defaultStyleData))
    widget.styleData.base.left = left
    widget.styleData.base.top = top
    widget.styleData.base.width = width
    widget.styleData.base.height = height
    widget.styleData.base.zIndex = zIndex
    widget.customCSS = generateWidgetCSSFromConfig(widget, jsonConfig)
  }

  /** 应用主题覆盖（合并主题样式到控件和画布） */
  function applyThemeOverrides(widgetStore: any, theme: Theme) {
    const themeComponents = theme.components
    const g = theme.global

    if (g) {
      if (g.canvasBackgroundColor) widgetStore.canvas.backgroundColor = g.canvasBackgroundColor
      if (g.canvasBorderColor) widgetStore.canvas.borderColor = g.canvasBorderColor
      if (g.canvasOpacity !== undefined) widgetStore.canvas.opacity = g.canvasOpacity
      if (g.glassBlur !== undefined) {
        widgetStore.canvas.glassEffect = true
      }
    }

    const widgets = widgetStore.widgets
    if (!widgets || widgets.length === 0) {
      console.info(`[themeStore] 无控件需要应用主题样式`)
      return
    }

    const count = widgets.length
    for (let i = 0; i < count; i++) {
      const widget = widgets[i]
      if (!widget) continue

      const compBase = themeComponents[widget.type]
      if (!compBase) continue

      try {
        for (const [key, value] of Object.entries(compBase)) {
          if (value !== undefined && value !== null) {
            ;(widget.style as any)[key] = value
            if (widget.styleData) {
              widget.styleData.base[key] = value
            }
          }
        }

        // 主题子元素属性 → sub selector 映射（确保导出 CSS 能输出子元素样式）
        if (widget.type === 'dataGrid' && widget.styleData) {
          if (!widget.styleData.sub) widget.styleData.sub = {}
          const dgs = (compBase as any)
          // headerBg / gridHeaderBg → .dataGrid_header
          if (dgs.gridHeaderBg || dgs.headerBg) {
            const k = '.dataGrid_header'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = dgs.gridHeaderBg || dgs.headerBg
          }
          // gridEvenRowBg → .dataGrid_row:nth-child(even)
          if (dgs.gridEvenRowBg) {
            const k = '.dataGrid_row:nth-child(even)'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = dgs.gridEvenRowBg
          }
          // gridHoverBg / rowHoverBg → .dataGrid_row:hover
          if (dgs.gridHoverBg || dgs.rowHoverBg) {
            const k = '.dataGrid_row:hover'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = dgs.gridHoverBg || dgs.rowHoverBg
          }
          // gridFocusedBg / rowSelectedBg → .dataGrid_row.dataGrid_row-focused
          if (dgs.gridFocusedBg || dgs.rowSelectedBg) {
            const k = '.dataGrid_row.dataGrid_row-focused'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = dgs.gridFocusedBg || dgs.rowSelectedBg
          }
        }

        // tabsContainer 子元素 → sub selector 映射
        if (widget.type === 'tabsContainer' && widget.styleData) {
          if (!widget.styleData.sub) widget.styleData.sub = {}
          const tabsSub = (compBase as any)
          if (tabsSub.tabHeaderBg) {
            const k = '.tabsContainer_headerBar'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = tabsSub.tabHeaderBg
          }
          if (tabsSub.tabBtnBg) {
            const k = '.tabsContainer_headerBar_btn'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = tabsSub.tabBtnBg
          }
          if (tabsSub.tabActiveBg) {
            const k = '.tabsContainer_headerBar_btn.active'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = tabsSub.tabActiveBg
          }
        }

        // listBox 子元素 → sub selector 映射
        if (widget.type === 'listBox' && widget.styleData) {
          if (!widget.styleData.sub) widget.styleData.sub = {}
          const lbs = (compBase as any)
          if (lbs.itemHoverBg) {
            const k = '.listBox_item:hover'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = lbs.itemHoverBg
          }
          if (lbs.itemSelectedBg) {
            const k = '.listBox_item.item-selected'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = lbs.itemSelectedBg
          }
          if (lbs.itemSelectedColor) {
            const k = '.listBox_item.item-selected'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['color'] = lbs.itemSelectedColor
          }
          if (lbs.itemColor) {
            const k = '.listBox_item'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['color'] = lbs.itemColor
          }
        }

        // treeView 子元素 → sub selector 映射
        if (widget.type === 'treeView' && widget.styleData) {
          if (!widget.styleData.sub) widget.styleData.sub = {}
          const tvs = (compBase as any)
          if (tvs.itemHoverBg) {
            const k = '.tree-node-content:hover'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = tvs.itemHoverBg
          }
          if (tvs.itemSelectedBg) {
            const k = '.tree-node.selected > .tree-node-content'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = tvs.itemSelectedBg
          }
          if (tvs.itemSelectedColor) {
            const k = '.tree-node.selected > .tree-node-content'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['color'] = tvs.itemSelectedColor
          }
          if (tvs.treeToggleColor) {
            const k = '.tree-toggle'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['color'] = tvs.treeToggleColor
          }
        }

        // cardBox 子元素 → sub selector 映射
        if (widget.type === 'cardBox' && widget.styleData) {
          if (!widget.styleData.sub) widget.styleData.sub = {}
          const cbs = (compBase as any)
          if (cbs.headerColor) {
            const k = '.cardBox_header'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['background-color'] = cbs.headerColor
          }
          if (cbs.headerTitleColor) {
            const k = '.cardBox_header_title'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['color'] = cbs.headerTitleColor
          }
          if (cbs.collapseBtnColor) {
            const k = '.cardBox_collapse_btn'; if (!(widget.styleData.sub as any)[k]) (widget.styleData.sub as any)[k] = {}; (widget.styleData.sub as any)[k]['color'] = cbs.collapseBtnColor
          }
        }

        const jsonConfig = getWidgetDefaultConfig(widget.type)
        if (jsonConfig && widget.styleData) {
          widget.customCSS = generateWidgetCSSFromConfig(widget, jsonConfig)
        } else {
          widget.customCSS = generateWidgetCSS(widget)
        }
      } catch (e) {
        console.error(`[themeStore] 更新控件样式失败: ${widget.type}#${widget.id}`, e)
      }
    }
    console.info(`[themeStore] 控件样式已更新: ${theme.name} (${count}个控件)`)
  }

  /**
 * 初始化主题：始终使用默认风格。
 * 主题是设计区控件样式的一次性应用，不持久化。
 * 无论用户之前应用了什么主题、保存后再次导入，都恢复为“默认风格”。
 */
function initTheme() {
  applyTheme(getDefaultTheme().id)
}

  /** 切换主题并返回新的 mode */
  function toggleMode(): 'light' | 'dark' {
    const current = themesById[currentThemeId.value]
    const targetMode = current?.mode === 'light' ? 'dark' : 'light'
    // 找同系列的另一模式
    const baseId = current?.id.replace('-light', '').replace('-dark', '')
    const targetId = `${baseId}-${targetMode}`
    if (themesById[targetId]) {
      applyTheme(targetId)
      return targetMode
    }
    // 找不到同系列，使用默认
    const fallback = targetMode === 'dark' ? 'mica-dark' : 'mica-light'
    applyTheme(fallback)
    return targetMode
  }

  return {
    currentThemeId,
    themeVersion,
    applyTheme,
    initTheme,
    toggleMode
  }
})

export { allThemes, themesById, getDefaultTheme }
export type { Theme }