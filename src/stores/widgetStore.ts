/**
 * @file stores/widgetStore.ts
 * @description Pinia 全局状态管理 - 画布配置、控件列表、多选、zIndex、撤销重做、父子容器
 */
import { defineStore } from 'pinia'
import { ref, reactive, computed, nextTick } from 'vue'
import type { Widget, CanvasConfig, WidgetType, WidgetStyle, TabDef, MessageBoxConfig, InputBoxConfig } from '@/types/index'
import { getWidgetLibraryItems } from '@/config/widgetRegistry'
import { getDefaultCanvasConfig, getDefaultMessageBoxConfig, getDefaultInputBoxConfig, DEFAULT_CANVAS_CSS } from '@/config/globalComponentsConfig'
import { parseWidgetCSS, mergeStyleToCSS, parseCanvasCSS, mergeCanvasCSS, parseWidgetCSSEnhanced, mergeStyleToCSSEnhanced, camelToKebab, parseDeclarations } from '@/utils/cssParser'
import { generateWidgetCSS as generateWidgetCSSFromConfig } from '@/utils/cssGenerator'
import { getWidgetDefaultConfig } from '@/config/mergeDefaults'
import { getChildSelectorMap } from '@/config/widgetRegistry'
import type { WidgetStyleData } from '@/types/index'

export const useWidgetStore = defineStore('widget', () => {
  // 合法的 CSS 属性名集合（camelCase），用于过滤非 CSS 属性
const VALID_CSS_PROPS = new Set([
  'left', 'top', 'right', 'bottom', 'width', 'height', 'zIndex', 'position', 'boxSizing',
  'display', 'flexDirection', 'flexWrap', 'alignItems', 'justifyContent', 'gap', 'flex', 'order', 'flexGrow', 'flexShrink',
  'overflow', 'overflowX', 'overflowY', 'whiteSpace', 'userSelect', 'visibility',
  'margin', 'padding', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'borderColor', 'borderWidth', 'borderStyle', 'borderRadius',
  'borderTopColor', 'borderTopWidth', 'borderTopStyle',
  'borderRightColor', 'borderRightWidth', 'borderRightStyle',
  'borderBottomColor', 'borderBottomWidth', 'borderBottomStyle',
  'borderLeftColor', 'borderLeftWidth', 'borderLeftStyle',
  'backgroundColor', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat',
  'color', 'fontSize', 'fontWeight', 'fontFamily', 'fontStyle',
  'textAlign', 'textDecoration', 'textOverflow', 'lineHeight', 'letterSpacing', 'wordBreak',
  'opacity', 'boxShadow', 'cursor', 'filter', 'transition', 'transform', 'transformOrigin', 'pointerEvents',
  'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
  'objectFit', 'objectPosition', 'resize', 'outline', 'outlineOffset',
  'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
  'background', 'listStyle', 'verticalAlign', 'content', 'clip',
])

  /** 正在被 CSS 编辑器编辑的控件ID集合（防止 CSS编辑器 ↔ 属性面板 循环触发） */
  const _cssEditingWidgets = new Set<string>()
  /** 在 CSS 编辑器编辑期间被丢弃的样式变更队列（widgetId → props），编辑结束后自动应用 */
  const _pendingStyleQueue: Record<string, Partial<WidgetStyle>> = {}

  /** rAF 限流缓存（widgetId → 累积的变更属性 + frameId），每帧最多1次 DOM 更新 */
  const _styleFrameMap = new Map<string, { props: Record<string, any>, frameId: number | null }>()

  /** 样式更新防抖缓存（widgetId → 累积的变更属性），用于 CSS 重建延迟 */
  const _styleDebounceMap = new Map<string, { props: Record<string, any>, timer: ReturnType<typeof setTimeout> | null }>()
  const STYLE_DEBOUNCE_MS = 250

  /** saveState 防抖：避免高频输入时频繁序列化导致页面崩溃 */
  let _saveDebounceTimer: ReturnType<typeof setTimeout> | null = null
  const SAVE_DEBOUNCE_MS = 300

  /** 原子操作：同时设置 widget.style 和 widget.styleData.base 的单个属性 */
  function setWidgetStyleProp(widget: Widget, key: string, value: any) {
    ;(widget.style as any)[key] = value
    if (widget.styleData) {
      widget.styleData.base[key] = value
    }
  }

  /** 画布配置（从 globalComponentsConfig 工厂函数获取） */
  const canvasConfig = getDefaultCanvasConfig()
  const canvas = reactive<CanvasConfig>({ ...canvasConfig })

  /** 全局信息提示框配置（从 globalComponentsConfig 工厂函数获取） */
  const messageBoxConfig = reactive<MessageBoxConfig>({ ...getDefaultMessageBoxConfig() })

  /** 是否显示信息框属性面板 */
  const messageBoxPanelVisible = ref(false)

  /** 全局输入框配置（从 globalComponentsConfig 工厂函数获取） */
  const inputBoxConfig = reactive<InputBoxConfig>({ ...getDefaultInputBoxConfig() })

  /** 是否显示输入框属性面板 */
  const inputBoxPanelVisible = ref(false)

  /** 是否显示属性面板（用户可折叠隐藏） */
  const propertyPanelVisible = ref(true)

  /** 右键菜单弹出菜单的默认CSS（全局持久化） */
  const contextMenuDefaultCSS = ref('')
  /** 气泡框弹出气泡的默认CSS（全局持久化） */
  const tooltipDefaultCSS = ref('')

  /** 控件列表（顶层） */
  const widgets = reactive<Widget[]>([])

  /** 多选控件ID数组 */
  const selectedIds = ref<string[]>([])

  /** 历史记录栈 */
  const history = ref<string[]>([])
  const historyIndex = ref<number>(-1)
  const maxHistory = 50

  /** zIndex计数器 */
  const zIndexCounter = ref<number>(1)

  /** 控制点位置重算信号（方向键/属性面板移动控件后触发） */
  const _handleTick = ref(0)

  /** 标签页容器头部高度缓存（widgetId → 实际测量的px高度） */
  const tabHeaderHeights = reactive<Record<string, number>>({})

  /** 收集所有控件ID（含子控件） */
  function collectAllIds(list: Widget[]): string[] {
    const ids: string[] = []
    for (const w of list) {
      ids.push(w.id)
      if (w.children && w.children.length > 0) {
        ids.push(...collectAllIds(w.children))
      }
    }
    return ids
  }

  /** 计算属性：当前单个选中控件 */
  const selectedWidget = computed<Widget | null>(() => {
    if (selectedIds.value.length === 0) return null
    return findWidgetById(selectedIds.value[0])
  })

  /** 计算属性：是否选中画布 */
  const isCanvasSelected = computed<boolean>(() => selectedIds.value.length === 0)

  /** 计算属性：选中控件列表 */
  const selectedWidgets = computed<Widget[]>(() => {
    return selectedIds.value.map(id => findWidgetById(id)).filter(Boolean) as Widget[]
  })

  /** 计算属性：最大zIndex（含子控件） */
  const maxZIndex = computed(() => {
    const allIds = collectAllIds(widgets)
    if (allIds.length === 0) return 1
    const allWidgets = allIds.map(id => findWidgetById(id)).filter(Boolean) as Widget[]
    return Math.max(...allWidgets.map(w => w.style.zIndex || 1), 1)
  })

  /** 递归查找控件 */
  function findWidgetById(id: string, list?: Widget[]): Widget | null {
    const searchList = list || widgets
    for (const w of searchList) {
      if (w.id === id) return w
      if (w.children && w.children.length > 0) {
        const found = findWidgetById(id, w.children)
        if (found) return found
      }
    }
    return null
  }

  /** 查找控件的直接父容器 */
  function findParentWidget(childId: string): Widget | null {
    const child = findWidgetById(childId)
    if (!child || !child.parentId) return null
    return findWidgetById(child.parentId)
  }

  /** 设置标签页容器的实际头部高度（由 TabsContainer DOM 测量后调用） */
  function setTabHeaderHeight(widgetId: string, height: number) {
    tabHeaderHeights[widgetId] = height
  }

  /** 获取标签页容器的头部高度（优先取实测值，回退到基于尺寸的估算值） */
  function getTabHeaderHeight(widgetId: string): number {
    if (tabHeaderHeights[widgetId] !== undefined) {
      return tabHeaderHeights[widgetId]
    }
    const widget = findWidgetById(widgetId)
    if (widget && widget.type === 'tabsContainer') {
      return widget.style.height - Math.max(50, widget.style.height - 42)
    }
    return 31
  }

  /** 计算控件在画布上的绝对位置 */
  function getAbsolutePosition(widgetId: string): { left: number; top: number } {
    const widget = findWidgetById(widgetId)
    if (!widget) return { left: 0, top: 0 }

    let absLeft = widget.style.left
    let absTop = widget.style.top
    let currentId = widget.parentId

    while (currentId) {
      const parent = findWidgetById(currentId)
      if (!parent) break
      absLeft += parent.style.left
      absTop += parent.style.top
      if (parent.type === 'tabsContainer' && currentId === widget.parentId) {
        if (parent.hideTabHeader !== true) {
          absTop += getTabHeaderHeight(parent.id)
        }
      }
      if (parent.type === 'cardBox' && widget.parentId === parent.id) {
        if (parent.showHeader !== false) {
          absTop += 32
        }
      }
      currentId = parent.parentId
    }

    return { left: absLeft, top: absTop }
  }

  /** 生成唯一控件ID（填补空缺编号，而非总是取 max+1） */
  function generateUniqueId(type: WidgetType, baseId?: string): string {
    if (baseId) {
      const exists = findWidgetById(baseId)
      if (!exists) return baseId
    }
    const allIds = collectAllIds(widgets)
    const regex = new RegExp(`^${type}_(\\d+)$`)
    const usedNums: number[] = []
    allIds.forEach(id => {
      const match = id.match(regex)
      if (match) {
        usedNums.push(parseInt(match[1], 10))
      }
    })
    usedNums.sort((a, b) => a - b)

    let nextNum = 1
    for (const num of usedNums) {
      if (num === nextNum) {
        nextNum++
      } else if (num > nextNum) {
        break
      }
    }
    return `${type}_${nextNum}`
  }

  /** 生成唯一节点ID */
  let _nodeIdCounter = 0
  function generateNodeId(): string {
    return 'node_' + (++_nodeIdCounter)
  }

  /** 分配新zIndex */
  function nextZIndex(): number {
    return ++zIndexCounter.value
  }

  /** 触发控制点位置重算（方向键/属性面板移动控件后调用） */
  function tickHandles() {
    _handleTick.value++
  }

  /** 创建控件默认属性（从 JSON 配置统一初始化，widgetsDefaultConfig 仅作 label/icon 兜底） */
  function createDefaultWidget(type: WidgetType, x: number, y: number, themeMode?: 'light' | 'dark'): Widget {
    const jsonConfig = getWidgetDefaultConfig(type)
    if (!jsonConfig) {
      const tsConfig = getWidgetLibraryItems().find(it => it.type === type)
      if (!tsConfig) throw new Error(`Unknown widget type: ${type}`)
      // 极端情况：JSON 配置缺失，用 label 构造最小 widget
      const id = generateUniqueId(type)
      const suffixMatch = id.match(/_(\d+)$/)
      const suffix = suffixMatch ? suffixMatch[1] : id
      return {
        id, type,
        name: `${tsConfig.label}_${suffix}`,
        style: { left: x, top: y, width: 100, height: 30, zIndex: nextZIndex() },
        disabled: false, visible: true
      } as Widget
    }

    const id = generateUniqueId(type)

    // 根据主题模式选择对应的视觉样式预设
    const themeBase = themeMode === 'dark'
      ? jsonConfig.defaultStyleDark?.base
      : themeMode === 'light'
        ? jsonConfig.defaultStyleLight?.base
        : undefined

    // defaultStyleData.base 已包含 structuralCSS 属性（已迁移合并），直接作为基础样式
    const baseStyle = { ...jsonConfig.defaultStyleData.base, ...(themeBase || {}) }
    // 过滤 transition 防止拖拽延迟卡顿（base 中不应该有 transition）
    delete (baseStyle as any).transition
    delete (baseStyle as any).transitionDelay
    delete (baseStyle as any).transitionDuration
    delete (baseStyle as any).transitionProperty
    delete (baseStyle as any).transitionTimingFunction

    const style: WidgetStyle = {
      ...baseStyle,
      left: x,
      top: y,
      zIndex: nextZIndex()
    } as WidgetStyle

    // 深克隆默认业务属性，避免引用共享
    const defaultProps = JSON.parse(JSON.stringify(jsonConfig.defaultProps))

    // 控件ID名默认用中文名+ID数值序号，如"按钮_1"
    const suffixMatch = id.match(/_(\d+)$/)
    const suffix = suffixMatch ? suffixMatch[1] : id

    const base: Widget = {
      id,
      type,
      name: `${jsonConfig.label}_${suffix}`,
      style,
      ...defaultProps
    }

    // 下拉框类型属性：数组首项作为初始值，避免模板渲染时 String(Array) 变成逗号拼接
    for (const key of Object.keys(defaultProps)) {
      const val = (base as any)[key]
      if (Array.isArray(val)) {
        (base as any)[key] = val[0]
      }
    }

    // 处理需要动态ID的特殊控件
    if (type === 'treeView' && base.treeNodes) {
      const replaceIds = (nodes: any[]) => {
        for (const node of nodes) {
          node.id = generateNodeId()
          if (node.children) replaceIds(node.children)
        }
      }
      replaceIds(base.treeNodes)
    }
    if (type === 'dataGrid' && Array.isArray(base.rows)) {
      base.rows = (base.rows as any[]).map((row: any, idx: number) => ({
        ...row,
        id: id + '_row_' + (idx + 1)
      }))
    }
    if (type === 'datetimePicker') {
      base.value = new Date().toISOString().slice(0, 10) + 'T00:00'
    }

    // 初始化 styleData（从 JSON 配置深拷贝默认样式数据，已包含 structuralCSS 属性）
    base.styleData = JSON.parse(JSON.stringify(jsonConfig.defaultStyleData)) as WidgetStyleData
    // 过滤 transition 防止拖拽延迟（styleData.base 中的 transition 会写入 customCSS）
    delete (base.styleData.base as any).transition
    delete (base.styleData.base as any).transitionDelay
    delete (base.styleData.base as any).transitionDuration
    delete (base.styleData.base as any).transitionProperty
    delete (base.styleData.base as any).transitionTimingFunction
    // 确保 visible 默认为 true（防止自定义控件因未设 visible 导致预览/导出跳过）
    if (base.visible === undefined) base.visible = true
    // 同步初始 left/top/width/height 到 styleData.base
    base.styleData.base.left = x
    base.styleData.base.top = y
    base.styleData.base.width = style.width
    base.styleData.base.height = style.height
    base.styleData.base.zIndex = style.zIndex
    // 使用 JSON 配置方案生成 customCSS
    base.customCSS = generateWidgetCSSFromConfig(base, jsonConfig)

    // 初始化子样式（contextMenu / tooltip 的弹出菜单/气泡框样式）
    // 优先使用全局持久化的默认CSS，其次从 structuralCSS 生成
    if (type === 'contextMenu' || type === 'tooltip') {
      let useGlobalDefault = false
      if (type === 'contextMenu' && contextMenuDefaultCSS.value) {
        ;(base as any).contextMenuCSS = contextMenuDefaultCSS.value
        useGlobalDefault = true
      } else if (type === 'tooltip' && tooltipDefaultCSS.value) {
        ;(base as any).tooltipCSS = tooltipDefaultCSS.value
        useGlobalDefault = true
      }
      if (!useGlobalDefault) {
        const css = jsonConfig.structuralCSS
        if (css && Object.keys(css).length > 0) {
          const lines: string[] = []
          for (const [sel, decls] of Object.entries(css)) {
            lines.push(`${sel} {`)
            for (const d of decls) {
              lines.push(`  ${d};`)
            }
            lines.push('}')
          }
          const defaultPopupCSS = lines.join('\n')
          if (type === 'contextMenu') {
            ;(base as any).contextMenuCSS = defaultPopupCSS
          } else {
            ;(base as any).tooltipCSS = defaultPopupCSS
          }
        }
      }
    }

    console.info(`[createDefaultWidget] 初始化 | id=${base.id} type=${type} name=${base.name} theme=${themeMode || 'default'} | style=`, base.style, `| customCSS长度=${base.customCSS?.length || 0}`)
    return base
  }

  /** 添加控件到画布（顶层） */
  function addWidget(type: WidgetType, x: number, y: number): Widget {
    const widget = createDefaultWidget(type, x, y)
    widgets.push(widget)
    return widget
  }

  /** 添加子控件到指定父容器的指定标签页 */
  function addWidgetAsChild(parentId: string, type: WidgetType, x: number, y: number, tabIndex: number): Widget | null {
    const parent = findWidgetById(parentId)
    if (!parent) return null

    const widget = createDefaultWidget(type, x, y)
    widget.parentId = parentId
    widget.parentTabIndex = tabIndex

    if (!parent.children) parent.children = []
    parent.children.push(widget)
    return widget
  }

  /**
   * 添加子控件到卡片框容器
   */
  function addWidgetToCardContainer(parentId: string, type: WidgetType, x: number, y: number): Widget | null {
    const parent = findWidgetById(parentId)
    if (!parent || parent.type !== 'cardBox') return null

    const widget = createDefaultWidget(type, x, y)
    widget.parentId = parentId

    if (!parent.children) parent.children = []
    parent.children.push(widget)
    return widget
  }

  /** 批量添加控件（用于粘贴） */
  function addWidgets(newWidgets: Widget[]) {
    newWidgets.forEach(w => widgets.push(w))
  }

  /** 更新控件属性 */
  function updateWidget(widgetId: string, updates: Partial<Widget>) {
    const widget = findWidgetById(widgetId)
    if (!widget) return
    if (updates.style) {
      widget.style = { ...widget.style, ...updates.style }
      delete (updates as any).style
    }
    Object.assign(widget, updates)
  }

  /** 更新控件样式（从属性面板/StyleForm触发）
   * - rAF 限流：每帧最多1次 DOM 更新，合并帧内多次调用为一次 Object.assign
   * - 防抖延迟执行 CSS 重建（parseWidgetCSSEnhanced + mergeStyleToCSSEnhanced）
   * - 在防抖窗口内的连续变更会累积覆盖，窗口关闭后一次性重建 CSS
   */
  function updateWidgetStyle(widgetId: string, styleProps: Partial<WidgetStyle>) {
    if (_cssEditingWidgets.has(widgetId)) {
      // CSS编辑器正在编辑此控件，将样式变更入队，编辑结束后自动应用
      _pendingStyleQueue[widgetId] = Object.assign(_pendingStyleQueue[widgetId] || {}, styleProps)
      return
    }
    const widget = findWidgetById(widgetId)
    if (!widget) return

    // ======== 立即层：rAF 限流，每帧最多1次 DOM 更新 ========
    let frameData = _styleFrameMap.get(widgetId)
    if (frameData) {
      Object.assign(frameData.props, styleProps)
      if (frameData.frameId !== null) cancelAnimationFrame(frameData.frameId)
    } else {
      frameData = { props: { ...styleProps }, frameId: null }
      _styleFrameMap.set(widgetId, frameData)
    }

    frameData.frameId = requestAnimationFrame(() => {
      _styleFrameMap.delete(widgetId)
      const merged = frameData!.props
      Object.assign(widget.style, merged)
      if (widget.styleData) {
        for (const [key, value] of Object.entries(merged)) {
          if (value !== undefined && key !== 'subStyles' && key !== 'pseudoStyles') {
            widget.styleData.base[key] = value
          }
        }
      }
    })

    // ======== 防抖层：CSS 重建延迟执行 ========
    let debounced = _styleDebounceMap.get(widgetId)
    if (debounced) {
      Object.assign(debounced.props, styleProps)
      if (debounced.timer) clearTimeout(debounced.timer)
    } else {
      debounced = { props: { ...styleProps }, timer: null }
      _styleDebounceMap.set(widgetId, debounced)
    }

    debounced.timer = setTimeout(() => {
      _styleDebounceMap.delete(widgetId)
      _regenerateCustomCSS(widgetId)
    }, STYLE_DEBOUNCE_MS)
  }

  /**
   * 执行 CSS 重建（解析 → 合并 → 写回 customCSS）
   * 在防抖窗口关闭后调用，此时 widget.style/styleData 已包含所有累积变更
   */
  function _regenerateCustomCSS(widgetId: string) {
    const widget = findWidgetById(widgetId)
    if (!widget) return

    const currentCSS = widget.customCSS || ''
    const enhanced = currentCSS
      ? parseWidgetCSSEnhanced(currentCSS, widgetId, widget.type)
      : { baseProps: {}, subStyles: {}, pseudoStyles: {} }

    const mergedSubStyles: Record<string, string> = { ...(enhanced.subStyles || {}) }
    const mergedPseudoStyles: Record<string, string> = { ...(enhanced.pseudoStyles || {}) }

    const writeStyleObjToCSS = (selector: string, props: Record<string, any>): string => {
      const decls = Object.entries(props)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `  ${camelToKebab(k)}: ${typeof v === 'number' && v !== 0 ? v + 'px' : String(v)};`)
        .join('\n')
      return `${selector} {\n${decls}\n}`
    }

    if (widget.style.subStyles) {
      for (const [sel, props] of Object.entries(widget.style.subStyles)) {
        if (typeof props === 'object' && props !== null && !mergedSubStyles[sel]) {
          mergedSubStyles[sel] = writeStyleObjToCSS(sel, props)
        }
      }
    }

    if (widget.style.pseudoStyles) {
      for (const [sel, props] of Object.entries(widget.style.pseudoStyles)) {
        if (typeof props === 'object' && props !== null && !mergedPseudoStyles[sel]) {
          mergedPseudoStyles[sel] = writeStyleObjToCSS(sel, props)
        }
      }
    }

    // 过滤掉 subStyles / pseudoStyles 以及非 CSS 属性，避免无效声明污染 CSS
  const baseProps: Record<string, any> = {}
  const rawStyle = widget.style as unknown as Record<string, any>
  for (const [k, v] of Object.entries(rawStyle)) {
    if (k !== 'subStyles' && k !== 'pseudoStyles' && v !== undefined && v !== null && VALID_CSS_PROPS.has(k)) {
      baseProps[k] = v
    }
  }

  widget.customCSS = mergeStyleToCSSEnhanced(
    currentCSS,
    widgetId,
    baseProps,
    mergedSubStyles,
    mergedPseudoStyles
  )
    console.info(`[updateWidgetStyle] 防抖CSS重建完成 | id=${widgetId} | 保留子样式=${Object.keys(mergedSubStyles).length}个 伪类=${Object.keys(mergedPseudoStyles).length}个`)
  }

  /**
   * 左对齐 - 以主选控件为标准，所有选中控件的 left 对齐到主选控件的 left
   */
  function alignLeft() {
    if (selectedIds.value.length < 2) return
    const primary = findWidgetById(selectedIds.value[0])
    if (!primary) return
    const targetLeft = primary.style.left
    selectedIds.value.forEach(id => {
      if (id === selectedIds.value[0]) return
      const w = findWidgetById(id)
      if (w) updateWidgetStyle(id, { left: targetLeft })
    })
    saveState()
  }

  /**
   * 添加日志行到指定日志控件
   */
  function addLog(widgetId: string, text: string, color: string) {
    const w = findWidgetById(widgetId)
    if (!w || w.type !== 'logOutput') return
    if (!w.logs) w.logs = []
    w.logs.push({ text, color: color || '#000000' })
    saveState()
  }

  /**
   * 删除日志控件的指定行
   */
  function removeLog(widgetId: string, index: number) {
    const w = findWidgetById(widgetId)
    if (!w || w.type !== 'logOutput' || !w.logs) return
    if (index < 0 || index >= w.logs.length) return
    w.logs.splice(index, 1)
    saveState()
  }

  /**
   * 清空日志控件的所有日志行
   */
  function clearLogs(widgetId: string) {
    const w = findWidgetById(widgetId)
    if (!w || w.type !== 'logOutput') return
    w.logs = []
    saveState()
  }

  /**
   * 右对齐 - 以主选控件为标准，所有选中控件的 right 对齐到主选控件的 right
   */
  function alignRight() {
    if (selectedIds.value.length < 2) return
    const primary = findWidgetById(selectedIds.value[0])
    if (!primary) return
    const targetRight = primary.style.left + primary.style.width
    selectedIds.value.forEach(id => {
      if (id === selectedIds.value[0]) return
      const w = findWidgetById(id)
      if (w) updateWidgetStyle(id, { left: targetRight - w.style.width })
    })
    saveState()
  }

  /**
   * 等宽 - 以主选控件为标准，所有选中控件的 width 设置为主选控件的 width
   */
  function equalWidth() {
    if (selectedIds.value.length < 2) return
    const primary = findWidgetById(selectedIds.value[0])
    if (!primary) return
    const targetWidth = primary.style.width
    selectedIds.value.forEach(id => {
      if (id === selectedIds.value[0]) return
      const w = findWidgetById(id)
      if (w) updateWidgetStyle(id, { width: targetWidth })
    })
    saveState()
  }

  /**
   * 等高 - 以主选控件为标准，所有选中控件的 height 设置为主选控件的 height
   */
  function equalHeight() {
    if (selectedIds.value.length < 2) return
    const primary = findWidgetById(selectedIds.value[0])
    if (!primary) return
    const targetHeight = primary.style.height
    selectedIds.value.forEach(id => {
      if (id === selectedIds.value[0]) return
      const w = findWidgetById(id)
      if (w) updateWidgetStyle(id, { height: targetHeight })
    })
    saveState()
  }

  /**
   * 上对齐 - 以主选控件为标准，所有选中控件的 top 对齐到主选控件的 top
   */
  function alignTop() {
    if (selectedIds.value.length < 2) return
    const primary = findWidgetById(selectedIds.value[0])
    if (!primary) return
    const targetTop = primary.style.top
    selectedIds.value.forEach(id => {
      if (id === selectedIds.value[0]) return
      const w = findWidgetById(id)
      if (w) {
        setWidgetStyleProp(w, 'top', targetTop)
      }
    })
    saveState()
  }

  /**
   * 下对齐 - 以主选控件为标准，所有选中控件的 bottom 对齐到主选控件的 bottom
   */
  function alignBottom() {
    if (selectedIds.value.length < 2) return
    const primary = findWidgetById(selectedIds.value[0])
    if (!primary) return
    const targetBottom = primary.style.top + primary.style.height
    selectedIds.value.forEach(id => {
      if (id === selectedIds.value[0]) return
      const w = findWidgetById(id)
      if (w) {
        setWidgetStyleProp(w, 'top', targetBottom - w.style.height)
      }
    })
    saveState()
  }

  /**
   * 等宽高 - 以主选控件为标准，所有选中控件的 width 和 height 设为主选控件的值
   */
  function equalWidthHeight() {
    if (selectedIds.value.length < 2) return
    const primary = findWidgetById(selectedIds.value[0])
    if (!primary) return
    const targetWidth = primary.style.width
    const targetHeight = primary.style.height
    selectedIds.value.forEach(id => {
      if (id === selectedIds.value[0]) return
      const w = findWidgetById(id)
      if (w) {
        setWidgetStyleProp(w, 'width', targetWidth)
        setWidgetStyleProp(w, 'height', targetHeight)
      }
    })
    saveState()
  }

  /**
   * 更新控件 customCSS（从高级模式/CSS编辑器触发）
   * - 保存用户输入的原始 CSS
   * - 解析 CSS 提取样式到 widget.style（包括子选择器和伪类）
   * - _cssEditingWidgets 标志位防止与 updateWidgetStyle 循环触发
   */
  function updateWidgetCustomCSS(widgetId: string, cssText: string) {
    const widget = findWidgetById(widgetId)
    if (!widget) return

    console.info(`[updateWidgetCustomCSS] CSS编辑器→解析CSS | id=${widgetId} type=${widget.type} | CSS长度=${cssText.length}`)

    // 设置标志位，阻止 updateWidgetStyle 在 style 变更时重复生成
    _cssEditingWidgets.add(widgetId)

    // 取消该控件挂起的 rAF 帧（用户正在手动编辑 CSS）
    const pendingFrame = _styleFrameMap.get(widgetId)
    if (pendingFrame?.frameId !== null && pendingFrame?.frameId !== undefined) {
      cancelAnimationFrame(pendingFrame.frameId)
      _styleFrameMap.delete(widgetId)
    }

    // 取消该控件挂起的防抖 CSS 重建（用户正在手动编辑 CSS）
    const pendingDebounce = _styleDebounceMap.get(widgetId)
    if (pendingDebounce?.timer) {
      clearTimeout(pendingDebounce.timer)
      _styleDebounceMap.delete(widgetId)
    }

    // 保存用户输入的原始 CSS
    widget.customCSS = cssText

    // 增强版解析：提取 baseProps + subStyles + pseudoStyles
    const enhanced = parseWidgetCSSEnhanced(cssText, widgetId, widget.type)
    console.info(`[updateWidgetCustomCSS] CSS解析结果 | id=${widgetId} | baseProps:`, enhanced.baseProps, `| subStyles=${Object.keys(enhanced.subStyles).length}个 | pseudoStyles=${Object.keys(enhanced.pseudoStyles).length}个`)

    // 将主属性合并到 style
    for (const [key, value] of Object.entries(enhanced.baseProps)) {
      if (value !== undefined && value !== null) {
        (widget.style as any)[key] = value
      }
    }

    // 将子选择器样式和伪类样式存储到 style 扩展字段
    if (Object.keys(enhanced.subStyles).length > 0) {
      ;(widget.style as any).subStyles = enhanced.subStyles
    }
    if (Object.keys(enhanced.pseudoStyles).length > 0) {
      ;(widget.style as any).pseudoStyles = enhanced.pseudoStyles
    }

    // 同步到 styleData（JSON数据源）
    if (widget.styleData) {
      for (const [key, value] of Object.entries(enhanced.baseProps)) {
        if (value !== undefined && value !== null) {
          widget.styleData.base[key] = value
        }
      }
      for (const [sel, decls] of Object.entries(enhanced.subStyles)) {
        widget.styleData.sub[sel] = parseDeclarations(decls)
      }
      for (const [sel, props] of Object.entries(enhanced.pseudoStyles)) {
        const pseudoName = sel.replace(new RegExp(`^#${widgetId}`), '')
        widget.styleData.pseudo[pseudoName] = parseDeclarations(props)
      }
    }

    // 将子选择器 CSS 属性映射回 widget.style 的具名属性（如 tabHeaderBg、gridHeaderBg）
    // 供设计时各组件的 containerStyle computed → CSS 变量注入使用
    const childMap = getChildSelectorMap(widget.type)
    if (childMap) {
      const idPrefix = '#' + widgetId
      for (const [sel, decls] of Object.entries(enhanced.subStyles)) {
        if (!sel.startsWith(idPrefix)) continue
        const suffix = sel.slice(idPrefix.length)
        const propMap = childMap[suffix]
        if (propMap) {
          const parsedDecls = parseDeclarations(decls)
          for (const [cssKey, cssValue] of Object.entries(parsedDecls)) {
            const mappedKey = propMap[cssKey]
            if (mappedKey) {
              (widget.style as any)[mappedKey] = cssValue
            }
          }
        }
      }
    }

    console.info(`[updateWidgetCustomCSS] customCSS→style同步完成 | id=${widgetId} | baseProps=${Object.keys(enhanced.baseProps).length}个 subStyles=${Object.keys(enhanced.subStyles).length}个 pseudoStyles=${Object.keys(enhanced.pseudoStyles).length}个`)

    // 清除该控件之前挂起的队列（CSS 编辑器的变更已通过上面解析同步到 style，旧队列无需应用）
    delete _pendingStyleQueue[widgetId]

    // 用 nextTick 延迟清除编辑标志，确保 Vue 响应式更新已完成
    nextTick(() => {
      _cssEditingWidgets.delete(widgetId)
      // 应用 CSS 编辑器编辑期间入队的样式变更（例如用户快速切换到属性面板做的修改）
      if (_pendingStyleQueue[widgetId] && Object.keys(_pendingStyleQueue[widgetId]).length > 0) {
        const queued = _pendingStyleQueue[widgetId]
        delete _pendingStyleQueue[widgetId]
        updateWidgetStyle(widgetId, queued)
      }
    })
  }

  /** 批量更新控件位置 */
  function updateWidgetPositions(updates: { id: string; left: number; top: number }[]) {
    updates.forEach(({ id, left, top }) => {
      const widget = findWidgetById(id)
      if (widget) {
        setWidgetStyleProp(widget, 'left', left)
        setWidgetStyleProp(widget, 'top', top)
      }
    })
  }

  /** 递归收集控件及其所有后代ID */
  function collectDescendantIds(widget: Widget): string[] {
    const ids = [widget.id]
    if (widget.children && widget.children.length > 0) {
      widget.children.forEach(child => {
        ids.push(...collectDescendantIds(child))
      })
    }
    return ids
  }

  /** 从指定列表中移除控件（递归从根部找） */
  function removeWidgetFromList(list: Widget[], widgetId: string): boolean {
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].id === widgetId) {
        list.splice(i, 1)
        return true
      }
      if (list[i].children && list[i].children!.length > 0) {
        if (removeWidgetFromList(list[i].children!, widgetId)) return true
      }
    }
    return false
  }

  /** 删除单个控件（含所有后代） */
  function removeWidget(widgetId: string) {
    removeWidgetFromList(widgets, widgetId)
  }

  /** 批量删除控件（含所有后代） */
  function removeWidgets(ids: string[]) {
    ids.forEach(id => removeWidget(id))
    selectedIds.value = selectedIds.value.filter(id => {
      const w = findWidgetById(id)
      return w !== null
    })
  }

  /** 设置选中 */
  function setSelection(ids: string[]) {
    selectedIds.value = [...ids]
    if (ids.length > 0) {
      messageBoxPanelVisible.value = false
      inputBoxPanelVisible.value = false
    }
  }

  /** 追加选中 */
  function addToSelection(ids: string[]) {
    const toAdd = ids.filter(id => !selectedIds.value.includes(id))
    selectedIds.value = [...selectedIds.value, ...toAdd]
  }

  /** 单击选中单个控件 */
  function selectWidget(widgetId: string) {
    selectedIds.value = [widgetId]
    messageBoxPanelVisible.value = false
    inputBoxPanelVisible.value = false
  }

  /** 清空选中 */
  function selectCanvas() {
    selectedIds.value = []
    messageBoxPanelVisible.value = false
    inputBoxPanelVisible.value = false
  }

  /** 更新画布配置 */
  function updateCanvas(partial: Partial<CanvasConfig>) {
    Object.assign(canvas, partial)
  }

  /** 更新画布自定义 CSS（样式编辑器 → 画布属性同步） */
  function updateCanvasCustomCSS(cssText: string) {
    canvas.customCSS = cssText
    // 使用结构化 CSS 解析替代正则，与 parseWidgetCSS 同架构
    const props = parseCanvasCSS(cssText)
    if (props.width !== undefined) canvas.width = props.width
    if (props.height !== undefined) canvas.height = props.height
    if (props.backgroundColor !== undefined) canvas.backgroundColor = props.backgroundColor
    if (props.borderColor !== undefined) canvas.borderColor = props.borderColor
    if (props.borderWidth !== undefined) canvas.borderWidth = props.borderWidth
    if (props.borderRadius !== undefined) canvas.borderRadius = props.borderRadius
    if (props.opacity !== undefined) canvas.opacity = props.opacity
    if (props.titleBarBgColor !== undefined) canvas.titleBarBgColor = props.titleBarBgColor
    if (props.titleBarOpacity !== undefined) canvas.titleBarOpacity = props.titleBarOpacity
    if (props.titleBarTextColor !== undefined) canvas.titleBarTextColor = props.titleBarTextColor
  }

  /** 同步单个画布属性到 customCSS（属性面板 → CSS 编辑器） */
  function syncCanvasPropToCSS(prop: string, value: any) {
    // 使用 mergeCanvasCSS 结构化合并，与 mergeStyleToCSS 同架构
    canvas.customCSS = mergeCanvasCSS(canvas.customCSS, { [prop]: value })
  }

  // ================================================================
  // Z轴层级管理
  // ================================================================

  function bringToFront(widgetId: string) {
    const widget = findWidgetById(widgetId)
    if (!widget) return
    const maxZ = maxZIndex.value
    setWidgetStyleProp(widget, 'zIndex', maxZ + 1)
    zIndexCounter.value = maxZ + 1
  }

  function sendToBack(widgetId: string) {
    const widget = findWidgetById(widgetId)
    if (!widget) return
    const minZ = Math.min(...collectAllIds(widgets).map(id => {
      const w = findWidgetById(id); return w ? (w.style.zIndex || 1) : 1
    }), 1)
    setWidgetStyleProp(widget, 'zIndex', minZ - 1)
  }

  function bringForward(widgetId: string) {
    const widget = findWidgetById(widgetId)
    if (!widget) return
    const currentZ = widget.style.zIndex || 0
    const allW = collectAllIds(widgets).map(id => findWidgetById(id)).filter(Boolean) as Widget[]
    const higher = allW.filter(w => w.id !== widgetId && (w.style.zIndex || 0) > currentZ)
      .sort((a, b) => (a.style.zIndex || 0) - (b.style.zIndex || 0))
    if (higher.length > 0) {
      const next = higher[0]
      const tempZ = next.style.zIndex || 0
      setWidgetStyleProp(next, 'zIndex', currentZ)
      setWidgetStyleProp(widget, 'zIndex', tempZ)
    } else {
      setWidgetStyleProp(widget, 'zIndex', currentZ + 1)
      zIndexCounter.value = Math.max(zIndexCounter.value, currentZ + 1)
    }
  }

  function sendBackward(widgetId: string) {
    const widget = findWidgetById(widgetId)
    if (!widget) return
    const currentZ = widget.style.zIndex || 0
    const allW = collectAllIds(widgets).map(id => findWidgetById(id)).filter(Boolean) as Widget[]
    const lower = allW.filter(w => w.id !== widgetId && (w.style.zIndex || 0) < currentZ)
      .sort((a, b) => (b.style.zIndex || 0) - (a.style.zIndex || 0))
    if (lower.length > 0) {
      const prev = lower[0]
      const tempZ = prev.style.zIndex || 0
      setWidgetStyleProp(prev, 'zIndex', currentZ)
      setWidgetStyleProp(widget, 'zIndex', tempZ)
    } else {
      setWidgetStyleProp(widget, 'zIndex', currentZ - 1)
    }
  }

  function bringSelectedToFront() {
    selectedIds.value.forEach(id => bringToFront(id))
  }

  function sendSelectedToBack() {
    selectedIds.value.forEach(id => sendToBack(id))
  }

  function bringSelectedForward() {
    selectedIds.value.forEach(id => bringForward(id))
  }

  function sendSelectedBackward() {
    selectedIds.value.forEach(id => sendBackward(id))
  }

  // ================================================================
  // 标签页管理
  // ================================================================

  /** 添加标签页 */
  function addTab(widgetId: string, title: string) {
    const widget = findWidgetById(widgetId)
    if (!widget || widget.type !== 'tabsContainer') return
    if (!widget.tabs) widget.tabs = []
    const newName = 'tab' + (widget.tabs.length + 1)
    widget.tabs.push({ name: newName, title })
  }

  /** 删除标签页（同时删除该标签页下所有子控件） */
  function removeTab(widgetId: string, tabIndex: number) {
    const widget = findWidgetById(widgetId)
    if (!widget || widget.type !== 'tabsContainer' || !widget.tabs) return
    if (widget.tabs.length <= 1) return

    const tabName = widget.tabs[tabIndex].name
    widget.tabs.splice(tabIndex, 1)

    if (widget.children) {
      widget.children = widget.children.filter(child => child.parentTabIndex !== tabIndex)
      widget.children.forEach(child => {
        if (child.parentTabIndex !== undefined && child.parentTabIndex > tabIndex) {
          child.parentTabIndex--
        }
      })
    }

    if (widget.activeTab === tabName) {
      widget.activeTab = widget.tabs[0].name
    }
  }

  /** 更新标签页标题 */
  function updateTabTitle(widgetId: string, tabIndex: number, title: string) {
    const widget = findWidgetById(widgetId)
    if (!widget || !widget.tabs || tabIndex >= widget.tabs.length) return
    widget.tabs[tabIndex].title = title
  }

  // ================================================================
  // 序列化与历史记录
  // ================================================================

  /** 递归深拷贝树节点 */
  function deepCloneNodes(nodes: any[]): any[] {
    return nodes.map(n => ({
      id: n.id,
      text: n.text,
      icon: n.icon,
      expanded: n.expanded,
      children: n.children ? deepCloneNodes(n.children) : undefined
    }))
  }

  /** 递归序列化控件 */
  function serializeWidget(w: Widget): any {
    const data: any = {
      id: w.id,
      type: w.type,
      name: w.name,
      text: w.text,
      labelText: w.labelText,
      value: w.value,
      placeholder: w.placeholder,
      options: w.options ? [...w.options] : undefined,
      selectedIndex: w.selectedIndex,
      layout: w.layout,
      href: w.href,
      showUnderline: w.showUnderline,
      checked: w.checked,
      rows: w.rows,
      inputType: w.inputType,
      customCSS: w.customCSS,
      disabled: w.disabled,
      visible: w.visible,
      progressValue: w.progressValue,
      showProgressText: w.showProgressText,
      draggable: w.draggable,
      logs: w.logs ? w.logs.map(l => ({ ...l })) : undefined,
      iconName: w.iconName,
      iconPosition: w.iconPosition,
      iconHtml: w.iconHtml,
      src: w.src,
      fit: w.fit,
      objectPosition: w.objectPosition,
      transparentBg: w.transparentBg,
      showHeader: w.showHeader,
      headerTitle: w.headerTitle,
      headerColor: w.headerColor,
      collapsible: w.collapsible,
      collapsed: w.collapsed,
      headerHeight: w.headerHeight,
      items: w.items ? w.items.map(i => ({ id: i.id, text: i.text, selected: i.selected })) : undefined,
      showCheckbox: w.showCheckbox,
      multiSelect: w.multiSelect,
      editable: w.editable,
      treeNodes: w.treeNodes ? deepCloneNodes(w.treeNodes) : undefined,
      treeEditable: w.treeEditable,
      treeShowIcon: w.treeShowIcon,
      treeShowCheckbox: w.treeShowCheckbox,
      treeAlwaysShowSelection: w.treeAlwaysShowSelection,
      parentId: w.parentId,
      parentTabIndex: w.parentTabIndex,
      columns: w.columns ? w.columns.map(c => ({ ...c })) : undefined,
      showRowCheckbox: w.showRowCheckbox,
      alwaysShowSelection: w.alwaysShowSelection,
      allowAddRow: w.allowAddRow,
      allowDeleteRow: w.allowDeleteRow,
      contextMenuTargetId: w.contextMenuTargetId,
      contextMenuTrigger: w.contextMenuTrigger,
      contextMenuItems: w.contextMenuItems ? w.contextMenuItems.map(item => {
        const copy: any = { id: item.id, text: item.text, type: item.type, icon: item.icon }
        if (item.children) copy.children = item.children.map(c => ({ id: c.id, text: c.text, type: c.type, icon: c.icon, children: c.children }))
        return copy
      }) : undefined,
      contextMenuCSS: w.contextMenuCSS,
      tooltipTargetId: w.tooltipTargetId,
      tooltipTrigger: w.tooltipTrigger,
      tooltipContent: w.tooltipContent,
      tooltipAllowHTML: w.tooltipAllowHTML,
      tooltipPosition: w.tooltipPosition,
      tooltipShowDelay: w.tooltipShowDelay,
      tooltipHideDelay: w.tooltipHideDelay,
      tooltipCSS: w.tooltipCSS,
      style: { ...w.style }
    }
    if (w.styleData) {
      data.styleData = JSON.parse(JSON.stringify(w.styleData))
    }

    // 自定义控件业务属性：保存 Widget 接口之外的额外属性
    const KNOWN_KEYS = new Set(Object.keys(data))
    const extraProps: Record<string, any> = {}
    for (const key of Object.keys(w)) {
      if (!KNOWN_KEYS.has(key) && key !== 'children' && key !== 'tabs' && key !== 'style' && key !== 'styleData') {
        extraProps[key] = (w as any)[key]
      }
    }
    if (Object.keys(extraProps).length > 0) {
      data._extraProps = extraProps
    }

    if (w.tabs) {
      data.tabs = w.tabs.map(t => ({ ...t }))
      data.activeTab = w.activeTab
      data.hideTabHeader = w.hideTabHeader
    }
    if (w.children && w.children.length > 0) {
      data.children = w.children.map(c => serializeWidget(c))
    }

    return data
  }

  function serializeWidgets(): any[] {
    return widgets.map(w => serializeWidget(w))
  }

  /** 递归反序列化 */
  function deserializeWidget(data: any): Widget {
    const widget: Widget = {
      id: data.id,
      type: data.type,
      name: data.name,
      style: data.style || {},
      styleData: data.styleData || undefined,
      text: data.text,
      labelText: data.labelText,
      placeholder: data.placeholder,
      value: data.value,
      options: data.options,
      selectedIndex: data.selectedIndex,
      layout: data.layout,
      href: data.href,
      showUnderline: data.showUnderline,
      checked: data.checked,
      rows: data.rows,
      inputType: data.inputType,
      customCSS: data.customCSS || '',
      disabled: data.disabled || false,
      visible: data.visible !== false,
      progressValue: data.progressValue,
      showProgressText: data.showProgressText !== false,
      draggable: data.draggable || false,
      logs: data.logs,
      iconName: data.iconName,
      iconPosition: data.iconPosition,
      iconHtml: data.iconHtml,
      src: data.src,
      fit: data.fit,
      objectPosition: data.objectPosition,
      transparentBg: data.transparentBg,
      showHeader: data.showHeader,
      headerTitle: data.headerTitle,
      headerColor: data.headerColor,
      collapsible: data.collapsible,
      collapsed: data.collapsed,
      headerHeight: data.headerHeight,
      items: data.items ? data.items.map((i: any) => ({ id: i.id || '', text: i.text || '', selected: !!i.selected })) : undefined,
      showCheckbox: data.showCheckbox,
      multiSelect: data.multiSelect,
      editable: data.editable,
      treeNodes: data.treeNodes,
      treeEditable: data.treeEditable,
      treeShowIcon: data.treeShowIcon,
      parentId: data.parentId,
      parentTabIndex: data.parentTabIndex,
      columns: data.columns,
      showRowCheckbox: data.showRowCheckbox,
      alwaysShowSelection: data.alwaysShowSelection,
      allowAddRow: data.allowAddRow,
      allowDeleteRow: data.allowDeleteRow,
      contextMenuTargetId: data.contextMenuTargetId,
      contextMenuTrigger: data.contextMenuTrigger,
      contextMenuItems: data.contextMenuItems,
      contextMenuCSS: data.contextMenuCSS,
      tooltipTargetId: data.tooltipTargetId,
      tooltipTrigger: data.tooltipTrigger,
      tooltipContent: data.tooltipContent,
      tooltipAllowHTML: data.tooltipAllowHTML,
      tooltipPosition: data.tooltipPosition,
      tooltipShowDelay: data.tooltipShowDelay,
      tooltipHideDelay: data.tooltipHideDelay,
      tooltipCSS: data.tooltipCSS,
      tabs: data.tabs,
      activeTab: data.activeTab
    }

    if (data.children && data.children.length > 0) {
      widget.children = data.children.map((c: any) => deserializeWidget(c))
    } else {
      widget.children = []
    }

    if (!widget.customCSS && widget.styleData) {
      const jsonConfig = getWidgetDefaultConfig(widget.type)
      if (jsonConfig) {
        widget.customCSS = generateWidgetCSSFromConfig(widget, jsonConfig)
      }
    }

    // 恢复自定义控件业务属性（序列化时保存在 _extraProps 中）
    if (data._extraProps) {
      for (const [key, value] of Object.entries(data._extraProps)) {
        (widget as any)[key] = value
      }
    }

    return widget
  }

  function saveState() {
    const stateData = {
      canvas: { ...canvas },
      widgets: serializeWidgets(),
      messageBoxConfig: { ...messageBoxConfig },
      inputBoxConfig: { ...inputBoxConfig }
    }
    const stateStr = JSON.stringify(stateData)

    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push(stateStr)
    if (history.value.length > maxHistory) {
      history.value.shift()
    }
    historyIndex.value = history.value.length - 1
  }

  /** 防抖版 saveState：高频调用时只执行最后一次，避免序列化开销导致页面崩溃 */
  function debouncedSaveState() {
    if (_saveDebounceTimer) clearTimeout(_saveDebounceTimer)
    _saveDebounceTimer = setTimeout(() => {
      _saveDebounceTimer = null
      saveState()
    }, SAVE_DEBOUNCE_MS)
  }

  function undo() {
    if (historyIndex.value > 0) {
      historyIndex.value--
      restoreState(history.value[historyIndex.value])
    }
  }

  function redo() {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      restoreState(history.value[historyIndex.value])
    }
  }

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  function restoreState(stateStr: string) {
    const state = JSON.parse(stateStr)
    Object.assign(canvas, state.canvas)
    // 向后兼容：旧项目文件不含 customCSS，设置默认值
    if (!canvas.customCSS) {
      canvas.customCSS = DEFAULT_CANVAS_CSS
    }
    widgets.length = 0
    if (state.widgets) {
      state.widgets.forEach((wData: any) => {
        widgets.push(deserializeWidget(wData))
      })
    }
    if (state.messageBoxConfig) {
      Object.assign(messageBoxConfig, state.messageBoxConfig)
    }
    if (state.inputBoxConfig) {
      Object.assign(inputBoxConfig, state.inputBoxConfig)
    }
    const allIds = collectAllIds(widgets)
    zIndexCounter.value = Math.max(0, ...allIds.map(id => {
      const w = findWidgetById(id); return w ? (w.style.zIndex || 0) : 0
    }), 1)
    selectedIds.value = selectedIds.value.filter(id => findWidgetById(id) !== null)
  }

  function initHistory() {
    history.value = []
    historyIndex.value = -1
    saveState()
  }

  function clearAll() {
    widgets.length = 0
    const defaultCanvas = getDefaultCanvasConfig()
    Object.assign(canvas, defaultCanvas)
    Object.assign(messageBoxConfig, getDefaultMessageBoxConfig())
    Object.assign(inputBoxConfig, getDefaultInputBoxConfig())
    selectedIds.value = []
    zIndexCounter.value = 1
  }

  return {
    canvas,
    widgets,
    selectedIds,
    selectedWidget,
    selectedWidgets,
    isCanvasSelected,
    messageBoxConfig,
    messageBoxPanelVisible,
    inputBoxConfig,
    inputBoxPanelVisible,
    propertyPanelVisible,
    contextMenuDefaultCSS,
    tooltipDefaultCSS,
    maxZIndex,
    history,
    historyIndex,
    canUndo,
    canRedo,
    zIndexCounter,
    _handleTick,
    tickHandles,
    findWidgetById,
    findParentWidget,
    setTabHeaderHeight,
    getTabHeaderHeight,
    setWidgetStyleProp,
    getAbsolutePosition,
    generateUniqueId,
    generateNodeId,
    deepCloneNodes,
    nextZIndex,
    createDefaultWidget,
    addWidget,
    addWidgetAsChild,
    addWidgetToCardContainer,
    addWidgets,
    updateWidget,
    updateWidgetStyle,
    updateWidgetCustomCSS,
    updateWidgetPositions,
    removeWidget,
    removeWidgets,
    alignLeft,
    alignRight,
    alignTop,
    alignBottom,
    equalWidth,
    equalHeight,
    equalWidthHeight,
    addLog,
    removeLog,
    clearLogs,
    setSelection,
    addToSelection,
    selectWidget,
    selectCanvas,
    updateCanvas,
    updateCanvasCustomCSS,
    syncCanvasPropToCSS,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    bringSelectedToFront,
    sendSelectedToBack,
    bringSelectedForward,
    sendSelectedBackward,
    addTab,
    removeTab,
    updateTabTitle,
    serializeWidget,
    serializeWidgets,
    deserializeWidget,
    restoreState,
    saveState,
    debouncedSaveState,
    undo,
    redo,
    initHistory,
    clearAll
  }
})