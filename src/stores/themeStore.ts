/**
 * @file stores/themeStore.ts
 * @description 主题状态管理 - 管理当前激活主题、主题切换、持久化
 *
 * 主题切换流程：
 * 1. 从 themes.ts 获取目标主题对象
 * 2. 将 global 样式写入 CSS 变量（document.documentElement.style）
 * 3. 遍历所有控件，将主题的 components[widget.type] 深度合并到 widget.style
 * 4. 调用 widgetStore.saveState() 保存历史
 * 5. 将当前主题 ID 保存到 localStorage
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

  /**
   * 应用主题
   * @param themeId 主题 ID，如 'mica-dark'
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

      // 1. 设置 CSS 变量到根元素
      const root = document.documentElement
      if (theme.global.canvasBackgroundColor) root.style.setProperty('--canvas-bg-color', theme.global.canvasBackgroundColor)
      if (theme.global.canvasBackdropFilter) root.style.setProperty('--canvas-blur', theme.global.canvasBackdropFilter)
      if (theme.global.textColor) root.style.setProperty('--text-color', theme.global.textColor)
      if (theme.global.accentColor) root.style.setProperty('--accent-color', theme.global.accentColor)
      if (theme.global.glassBlur) root.style.setProperty('--glass-blur', theme.global.glassBlur)
      if (theme.global.canvasBorderColor) root.style.setProperty('--canvas-border-color', theme.global.canvasBorderColor)

      // 更新画布视觉样式（背景色、磨砂、边框、透明度）
      const canvasUpdates: Record<string, any> = {}
      if (theme.global.canvasBackgroundColor) canvasUpdates.backgroundColor = theme.global.canvasBackgroundColor
      if (theme.global.canvasBackdropFilter) canvasUpdates.canvasBackdropFilter = theme.global.canvasBackdropFilter
      if (theme.global.canvasBorderColor) canvasUpdates.borderColor = theme.global.canvasBorderColor
      if (theme.global.canvasOpacity !== undefined) canvasUpdates.opacity = theme.global.canvasOpacity
      if (theme.global.canvasBackdropFilter && theme.global.canvasBackdropFilter !== 'none') {
        canvasUpdates.glassEffect = true
      }
      if (theme.global.titleBarBgColor) {
        canvasUpdates.titleBarBgColor = theme.global.titleBarBgColor
      } else {
        canvasUpdates.titleBarBgColor = theme.global.canvasBackgroundColor || '#ffffff'
      }
      if (theme.global.titleBarOpacity !== undefined) {
        canvasUpdates.titleBarOpacity = theme.global.titleBarOpacity
      } else {
        canvasUpdates.titleBarOpacity = theme.mode === 'dark' ? 0.9 : 1
      }
      if (theme.global.titleBarTextColor) {
        canvasUpdates.titleBarTextColor = theme.global.titleBarTextColor
      } else {
        canvasUpdates.titleBarTextColor = theme.global.textColor || '#1e1e1e'
      }
      if (Object.keys(canvasUpdates).length > 0) {
        widgetStore.updateCanvas(canvasUpdates)
      }

      // Sync body background from theme
      const hasBgImage = theme.global.bodyBackgroundImage && theme.global.bodyBackgroundImage !== 'none'
      const isDefaultTheme = themeId === 'default'

      if (!widgetStore.canvas.bodyBackground) {
        widgetStore.canvas.bodyBackground = {
          enabled: false, imageUrl: '', imageSize: 'cover',
          imageRepeat: 'no-repeat', imagePosition: 'center'
        }
      }

      if (isDefaultTheme) {
        widgetStore.canvas.bodyBackground.enabled = false
      } else if (hasBgImage) {
        widgetStore.canvas.bodyBackground.enabled = true
        widgetStore.canvas.bodyBackground.imageUrl = theme.global.bodyBackgroundImage!
      }

      // 2. 始终应用主题覆盖到当前控件（保留控件，只改样式）
      console.info(`[themeStore] 应用主题覆盖: ${themeId} (${widgetStore.widgets.length}个控件)`)
      applyThemeOverrides(widgetStore, theme)

      // 3. 更新当前主题 ID（仅会话级别，不持久化）
      currentThemeId.value = themeId

      // 递增版本号，通知 CanvasArea 强制重渲染
      themeVersion.value++

      widgetStore.saveState()
      console.info(`[themeStore] 主题应用完成: ${theme.name}`)
    } catch (err) {
      console.error(`[themeStore] 应用主题失败: ${themeId}`, err)
    } finally {
      _applyingTheme = false
    }
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
  currentThemeId.value = getDefaultTheme().id
  console.info(`[themeStore] 初始化主题: ${currentThemeId.value}（默认风格）`)
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