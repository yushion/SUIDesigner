/**
 * @file utils/cssParser.ts
 * @description CSS 解析与合并工具 - 解析 customCSS、提取样式属性、合并新样式
 */

import { getChildSelectorMap } from '@/config/widgetRegistry'

/** 解析后的 CSS 规则 */
export interface ParsedRule {
  selector: string
  properties: Record<string, string>
  rawText: string
}

/** 样式映射：camelCase → kebab-case 转换 */
export function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

/** kebab-case → camelCase 转换 */
function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase())
}

/** 将样式对象转为 CSS 声明块（如 "color: red;\nbackground: blue;"） */
export function stylePropsToCSS(style: Record<string, any>): string {
  const lines: string[] = []
  for (const key of Object.keys(style)) {
    const value = style[key]
    if (value === undefined || value === null || value === '') continue
    const cssKey = camelToKebab(key)
    let cssValue = String(value)
    if (typeof value === 'number' && isNaN(Number(cssValue)) === false) {
      const numericKeys = [
        'width', 'height', 'font-size', 'border-radius', 'border-width',
        'padding', 'margin', 'opacity', 'min-width', 'min-height',
        'left', 'top', 'z-index'
      ]
      const needPx = [
        'width', 'height', 'font-size', 'border-radius', 'border-width',
        'padding', 'margin', 'min-width', 'min-height',
        'left', 'top'
      ]
      if (needPx.includes(cssKey) && value !== 0) {
        cssValue = value + 'px'
      }
    }
    lines.push(`  ${cssKey}: ${cssValue};`)
  }
  return lines.join('\n')
}

/**
 * 解析 CSS 文本，提取所有规则块
 * 支持嵌套 {}（如 @media），通过大括号计数来正确解析
 */
export function parseAllRules(cssText: string): ParsedRule[] {
  const rules: ParsedRule[] = []
  if (!cssText || !cssText.trim()) return rules

  let i = 0
  const len = cssText.length

  while (i < len) {
    // 跳过空白字符
    while (i < len && (cssText[i] === ' ' || cssText[i] === '\n' || cssText[i] === '\r' || cssText[i] === '\t')) {
      i++
    }
    if (i >= len) break

    // 跳过注释
    if (cssText[i] === '/' && cssText[i + 1] === '*') {
      const end = cssText.indexOf('*/', i + 2)
      i = end === -1 ? len : end + 2
      continue
    }

    // 寻找选择器开始
    const braceStart = cssText.indexOf('{', i)
    if (braceStart === -1) break

    // 提取选择器（{} 之前的部分），移除注释
    let selector = cssText.substring(i, braceStart).trim()
    selector = selector.replace(/\/\*[\s\S]*?\*\//g, '').trim()
    // 处理 @media 等包含自身大括号的 at-rule
    const atRuleBrace = selector.lastIndexOf('{')
    if (atRuleBrace !== -1) {
      // 这是 @media 内部的情况，暂不处理复杂嵌套
      // 跳过选择器中可能包含的内部大括号
    }
    selector = selector.replace(/\s+/g, ' ').trim()

    // 查找匹配的 }
    let depth = 0
    let j = braceStart
    while (j < len) {
      if (cssText[j] === '{') depth++
      else if (cssText[j] === '}') {
        depth--
        if (depth === 0) break
      }
      j++
    }

    if (depth !== 0 || j >= len) break

    // 提取声明块内容
    const blockContent = cssText.substring(braceStart + 1, j).trim()
    const rawText = cssText.substring(i, j + 1)
    const properties = parseDeclarations(blockContent)

    if (selector) {
      rules.push({ selector, properties, rawText })
    }

    i = j + 1
  }

  return rules
}

/**
 * 解析 CSS 声明块内容，提取属性键值对
 * 类似 "color: red; background: blue;" → { color: 'red', background: 'blue' }
 */
export function parseDeclarations(blockContent: string): Record<string, string> {
  const props: Record<string, string> = {}
  if (!blockContent) return props

  // 移除块内注释
  const cleaned = blockContent.replace(/\/\*[\s\S]*?\*\//g, '')

  // 按分号分割声明
  const declarations = cleaned.split(';')
  for (const decl of declarations) {
    const trimmed = decl.trim()
    if (!trimmed) continue

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmed.substring(0, colonIdx).trim().toLowerCase()
    const value = trimmed.substring(colonIdx + 1).trim()
    if (key && value) {
      props[key] = value
    }
  }

  return props
}

/** CSS 简写属性 → 系统内部 camelCase 属性名映射 */
const CSS_PROPERTY_ALIAS: Record<string, string> = {
  'background': 'backgroundColor',
}

/** 子选择器 CSS 属性 → widget.style 属性映射（按控件类型） */
export const CHILD_SELECTOR_MAP: Record<string, Record<string, Record<string, string>>> = {
  progressBar: {
    ' .progress-fill': {
      'background-color': 'barColor',
      'background': 'barColor',
    },
    ' .progress-text': {
      'color': 'valueColor',
    },
  },
  toggle: {
    ' .slider': {
      'background-color': 'trackColor',
      'background': 'trackColor',
    },
    ' .slider::before': {
      'background-color': 'knobColor',
      'background': 'knobColor',
    },
    ' input:checked + .slider': {
      'background-color': 'activeTrackColor',
      'background': 'activeTrackColor',
    },
  },
  tabsContainer: {
    ' .tab-header-bar': {
      'background-color': 'tabHeaderBg',
      'background': 'tabHeaderBg',
      'border-bottom': 'tabHeaderBorderBottom',
      'border-bottom-color': 'tabHeaderBorderBottom',
      'border-bottom-width': 'tabHeaderBorderBottom',
      'border-bottom-style': 'tabHeaderBorderBottom',
    },
    ' .tab-header-btn': {
      'background-color': 'tabBtnBg',
      'background': 'tabBtnBg',
      'border-right': 'tabItemBorderRight',
      'border-right-color': 'tabItemBorderRight',
      'border-right-width': 'tabItemBorderRight',
      'border-right-style': 'tabItemBorderRight',
    },
    ' .tab-header-btn.active': {
      'background-color': 'tabActiveBg',
      'background': 'tabActiveBg',
      'border-bottom-color': 'tabActiveBorderColor',
    },
  },
  cardBox: {
    ' .card-header': {
      'background-color': 'headerColor',
      'background': 'headerColor',
    },
    ' .card-header-title': {
      'color': 'headerTitleColor',
    },
    ' .card-collapse-btn': {
      'color': 'collapseBtnColor',
    },
  },
  listBox: {
    ' .list-item': {
      'color': 'itemColor',
      'border-bottom': 'listItemBorderBottom',
      'border-bottom-color': 'listItemBorderBottom',
      'border-bottom-width': 'listItemBorderBottom',
      'border-bottom-style': 'listItemBorderBottom',
    },
    ' .list-item:hover': {
      'background-color': 'listItemHoverBg',
      'background': 'listItemHoverBg',
    },
    ' .list-item.item-selected': {
      'background-color': 'itemSelectedBg',
      'background': 'itemSelectedBg',
    },
  },
  treeView: {
    ' .tree-node.selected > .tree-node-content': {
      'background-color': 'treeSelectedBg',
      'background': 'treeSelectedBg',
    },
    ' .tree-node-row:hover': {
      'background-color': 'treeRowHoverBg',
      'background': 'treeRowHoverBg',
    },
    ' .tree-toggle': {
      'color': 'treeToggleColor',
    },
  },
  dataGrid: {
    ' .data-grid-header': {
      'background-color': 'gridHeaderBg',
      'background': 'gridHeaderBg',
      'border-bottom': 'gridHeaderBorderBottom',
      'border-bottom-color': 'gridHeaderBorderBottom',
      'border-bottom-width': 'gridHeaderBorderBottom',
      'border-bottom-style': 'gridHeaderBorderBottom',
    },
    ' .data-grid-header-cell': {
      'border-right': 'gridHeaderCellBorderRight',
      'border-right-color': 'gridHeaderCellBorderRight',
      'border-right-width': 'gridHeaderCellBorderRight',
      'border-right-style': 'gridHeaderCellBorderRight',
    },
    ' .data-grid-row': {
      'border-bottom': 'gridRowBorderBottom',
      'border-bottom-color': 'gridRowBorderBottom',
      'border-bottom-width': 'gridRowBorderBottom',
      'border-bottom-style': 'gridRowBorderBottom',
    },
    ' .data-grid-row:nth-child(even)': {
      'background-color': 'gridEvenRowBg',
      'background': 'gridEvenRowBg',
    },
    ' .data-grid-row:hover': {
      'background-color': 'gridHoverBg',
      'background': 'gridHoverBg',
    },
    ' .data-grid-row-focused': {
      'background-color': 'gridFocusedBg',
      'background': 'gridFocusedBg',
    },
    ' .data-grid-cell': {
      'border-right': 'gridCellBorderRight',
      'border-right-color': 'gridCellBorderRight',
      'border-right-width': 'gridCellBorderRight',
      'border-right-style': 'gridCellBorderRight',
    },
  },
}

/**
 * 从 CSS 文本中提取指定控件 ID 的样式（含子选择器映射）
 * @param cssText  完整的 CSS 文本
 * @param widgetId 控件 ID
 * @param widgetType 控件类型（可选，用于子选择器映射）
 */
export function parseWidgetCSS(cssText: string, widgetId: string, widgetType?: string): Record<string, any> {
  const result: Record<string, any> = {}
  if (!cssText || !widgetId) return result

  const rules = parseAllRules(cssText)
  const targetSelector = '#' + widgetId

  for (const rule of rules) {
    const selectors = rule.selector.split(',').map(s => s.trim())

    for (const sel of selectors) {
      // 精确匹配 #widgetId（允许前后有空白）
      if (sel === targetSelector) {
        // 提取属性并转为 camelCase
        for (const [key, value] of Object.entries(rule.properties)) {
          let camelKey = kebabToCamel(key)
          camelKey = CSS_PROPERTY_ALIAS[camelKey] || camelKey
          result[camelKey] = convertCSSValue(camelKey, value)
        }
      }
    }
  }

  if (widgetType) {
    // 从统一注册中心获取子选择器映射（优先）或使用本地 CHILD_SELECTOR_MAP 回退
    const childMap = getChildSelectorMap(widgetType) || CHILD_SELECTOR_MAP[widgetType]
    if (childMap) {
      for (const rule of rules) {
        const selectors = rule.selector.split(',').map(s => s.trim())
        for (const sel of selectors) {
          if (sel.startsWith(targetSelector) && sel !== targetSelector) {
            const suffix = sel.slice(targetSelector.length)
            const propMap = childMap[suffix]
            if (propMap) {
              for (const [cssKey, value] of Object.entries(rule.properties)) {
                const mappedKey = propMap[cssKey]
                if (mappedKey) {
                  result[mappedKey] = convertCSSValue(mappedKey, value)
                }
              }
            }
          }
        }
      }
    }
  }

  return result
}

/**
 * 检查选择器是否直接匹配控件ID（不含伪类/伪元素/子选择器）
 */
export function isDirectWidgetSelector(selector: string, widgetId: string): boolean {
  const norm = selector.trim()
  return norm === '#' + widgetId || norm.startsWith('#' + widgetId + ',') ||
    norm.split(',').some(s => s.trim() === '#' + widgetId)
}

/**
 * 将 CSS 值转换为适当的类型（数字转为 number）
 */
function convertCSSValue(key: string, value: string): any {
  const numericKeys = [
    'fontSize', 'borderRadius', 'borderWidth', 'padding', 'margin',
    'width', 'height', 'left', 'top', 'opacity', 'zIndex',
    'minWidth', 'minHeight'
  ]

  if (numericKeys.includes(key)) {
    const pxMatch = value.match(/^([\d.]+)px$/i)
    if (pxMatch) return parseFloat(pxMatch[1])
    const num = parseFloat(value)
    if (!isNaN(num) && String(num) === value.trim()) return num
  }

  return value
}

/**
 * 将新的样式声明合并到 customCSS 字符串中
 * - 如果已有 #widgetId 块，则替换其中的同名属性
 * - 如果没有，则在末尾追加新的 #widgetId 块
 * - 保留伪类（:hover, :active, :focus 等）、伪元素（::before, ::after）
 * - 保留 @media、@keyframes 等 at-rule 块
 * - 保留其他选择器的规则块
 */
export function mergeStyleToCSS(
  cssText: string,
  widgetId: string,
  styleProps: Record<string, any>
): string {
  const targetSelector = '#' + widgetId

  if (!cssText || !cssText.trim()) {
    // 无现有 CSS，直接创建
    const cssBody = stylePropsToCSS(styleProps)
    return `${targetSelector} {\n${cssBody}\n}\n`
  }

  const styleMap: Record<string, string> = {}
  for (const [key, value] of Object.entries(styleProps)) {
    if (value !== undefined && value !== null && value !== '') {
      const cssKey = camelToKebab(key)
      let cssValue = String(value)
      const numericKeys = [
        'width', 'height', 'font-size', 'border-radius', 'border-width',
        'padding', 'margin', 'min-width', 'min-height'
      ]
      if (numericKeys.includes(cssKey) && typeof value === 'number' && value !== 0) {
        cssValue = value + 'px'
      } else if (cssKey === 'z-index' && typeof value === 'number' && value !== 0) {
        cssValue = String(value)
      } else if (cssKey === 'opacity') {
        // opacity 是 0-1 的无单位值，0 也有效（完全透明）
      }
      styleMap[cssKey] = cssValue
    }
  }

  const rules = parseAllRules(cssText)
  let found = false
  const resultParts: string[] = []

  for (const rule of rules) {
    const selectors = rule.selector.split(',').map(s => s.trim())

    // 检查是否包含直接匹配的选择器
    const hasDirect = selectors.some(s => s === targetSelector)

    if (hasDirect && selectors.length === 1) {
      // 纯 #widgetId 块：合并属性
      found = true
      const mergedProps = { ...rule.properties }

      for (const [cssKey, cssValue] of Object.entries(styleMap)) {
        mergedProps[cssKey] = cssValue
      }

      const mergedDecls = Object.entries(mergedProps)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n')

      resultParts.push(`${targetSelector} {\n${mergedDecls}\n}`)
    } else if (hasDirect && selectors.length > 1) {
      // 组合选择器如 "#widgetId, .other"：拆分为独立块处理
      found = true
      const directIdx = selectors.indexOf(targetSelector)

      // 非 widgetId 的选择器保留原块
      const otherSelectors = selectors.filter((_, idx) => idx !== directIdx)
      const directRule = `  ${stylePropsToCSS(styleProps)}`
      resultParts.push(`${targetSelector} {\n${directRule}\n}`)

      if (otherSelectors.length > 0) {
        resultParts.push(`${otherSelectors.join(', ')} {\n  ${stylePropsToCSS(rule.properties)}\n}`)
      }
    } else {
      // 其他规则块原样保留
      resultParts.push(rule.rawText)
    }
  }

  if (!found) {
    // 不存在该选择器，追加
    const cssBody = stylePropsToCSS(styleProps)
    resultParts.push(`${targetSelector} {\n${cssBody}\n}`)
  }

  return resultParts.join('\n\n').replace(/\n{3,}/g, '\n\n')
}

/**
 * 从 customCSS 中移除指定属性
 */
export function removeStyleFromCSS(
  cssText: string,
  widgetId: string,
  propertyKeys: string[]
): string {
  const targetSelector = '#' + widgetId
  const rules = parseAllRules(cssText)
  const resultParts: string[] = []
  const kebabKeys = propertyKeys.map(camelToKebab)

  for (const rule of rules) {
    const selectors = rule.selector.split(',').map(s => s.trim())
    const hasDirect = selectors.some(s => s === targetSelector)

    if (hasDirect && selectors.length === 1) {
      const filteredProps: Record<string, string> = {}
      for (const [key, value] of Object.entries(rule.properties)) {
        if (!kebabKeys.includes(key)) {
          filteredProps[key] = value
        }
      }

      if (Object.keys(filteredProps).length > 0) {
        const decls = Object.entries(filteredProps)
          .map(([k, v]) => `  ${k}: ${v};`)
          .join('\n')
        resultParts.push(`${targetSelector} {\n${decls}\n}`)
      }
    } else {
      resultParts.push(rule.rawText)
    }
  }

  return resultParts.join('\n\n').replace(/\n{3,}/g, '\n\n')
}

// ================================================================
// 画布 CSS 解析与合并（与 mergeStyleToCSS / parseWidgetCSS 同架构）
// ================================================================

/** 画布属性 → CSS 规则映射 */
interface CanvasPropertyMapping {
  canvasProp: string       // camelCase 属性名，如 'backgroundColor'
  selector: string         // CSS 选择器，如 '.page-container'
  cssProp: string          // CSS 属性名，如 'background-color'
  isNumeric: boolean       // 是否需要 px 后缀
  isFloat: boolean         // 是否保留为浮点数（不 strip px）
}

const CANVAS_PROP_MAP: CanvasPropertyMapping[] = [
  { canvasProp: 'width',             selector: '.page-container',             cssProp: 'width',            isNumeric: true,  isFloat: false },
  { canvasProp: 'height',            selector: '.page-container',             cssProp: 'height',           isNumeric: true,  isFloat: false },
  { canvasProp: 'backgroundColor',   selector: '.page-container',             cssProp: '--canvas-bg-color', isNumeric: false, isFloat: false },
  { canvasProp: 'borderColor',       selector: '.page-container',             cssProp: 'border-color',     isNumeric: false, isFloat: false },
  { canvasProp: 'borderWidth',       selector: '.page-container',             cssProp: 'border-width',     isNumeric: true,  isFloat: false },
  { canvasProp: 'borderRadius',      selector: '.page-container',             cssProp: 'border-radius',    isNumeric: true,  isFloat: false },
  { canvasProp: 'opacity',           selector: '.page-container',             cssProp: '--canvas-opacity', isNumeric: false, isFloat: true  },
  { canvasProp: 'titleBarBgColor',   selector: '.canvas-titlebar',            cssProp: 'background-color', isNumeric: false, isFloat: false },
  { canvasProp: 'titleBarOpacity',   selector: '.canvas-titlebar',            cssProp: 'opacity',          isNumeric: false, isFloat: true  },
  { canvasProp: 'titleBarTextColor', selector: '.canvas-titlebar .tb-title',  cssProp: 'color',            isNumeric: false, isFloat: false },
]

/**
 * 解析画布 CSS 文本，提取画布属性
 * 与 parseWidgetCSS 同架构：parseAllRules → 结构化提取 → camelCase 属性对象
 */
export function parseCanvasCSS(cssText: string): Record<string, any> {
  const result: Record<string, any> = {}
  if (!cssText || !cssText.trim()) return result

  const rules = parseAllRules(cssText)

  for (const rule of rules) {
    const sel = rule.selector.trim()

    for (const mapping of CANVAS_PROP_MAP) {
      if (sel !== mapping.selector) continue
      const rawVal = rule.properties[mapping.cssProp]
      if (rawVal === undefined) continue

      if (mapping.isNumeric || mapping.isFloat) {
        const pxMatch = rawVal.match(/^([\d.]+)px$/i)
        if (pxMatch) {
          result[mapping.canvasProp] = parseFloat(pxMatch[1])
        } else {
          const num = parseFloat(rawVal)
          if (!isNaN(num)) result[mapping.canvasProp] = num
        }
      } else {
        result[mapping.canvasProp] = rawVal
      }
    }
  }

  return result
}

/**
 * 将画布属性合并到 CSS 文本中
 * 与 mergeStyleToCSS 同架构：parseAllRules → 定位对应块 → 合并属性 → 重建 CSS
 * 彻底替代脆弱的正则替换方式，避免分号累积等 Bug
 */
export function mergeCanvasCSS(
  cssText: string,
  canvasProps: Record<string, any>
): string {
  if (!cssText || !cssText.trim()) return cssText

  // 构建每个选择器需要合并的属性映射
  const mergeMap: Record<string, Record<string, string>> = {}
  for (const mapping of CANVAS_PROP_MAP) {
    const val = canvasProps[mapping.canvasProp]
    if (val === undefined || val === null || val === '') continue
    let cssVal: string
    if (mapping.isNumeric && !mapping.isFloat && typeof val === 'number') {
      cssVal = val + 'px'
    } else {
      cssVal = String(val)
    }
    if (!mergeMap[mapping.selector]) mergeMap[mapping.selector] = {}
    mergeMap[mapping.selector][mapping.cssProp] = cssVal
  }

  if (Object.keys(mergeMap).length === 0) return cssText

  const rules = parseAllRules(cssText)
  const resultParts: string[] = []

  for (const rule of rules) {
    const sel = rule.selector.trim()
    const toMerge = mergeMap[sel]

    if (toMerge) {
      // 找到目标块：合并属性后重建
      const mergedProps = { ...rule.properties, ...toMerge }
      const decls = Object.entries(mergedProps)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n')
      const cleanSelector = rule.selector.replace(/\s+/g, ' ').trim()
      resultParts.push(`${cleanSelector} {\n${decls}\n}`)
      // 标记已处理
      delete mergeMap[sel]
    } else {
      // 不相关的块原样保留
      resultParts.push(rule.rawText)
    }
  }

  // 追加未找到选择器的新块
  for (const [selector, props] of Object.entries(mergeMap)) {
    if (Object.keys(props).length === 0) continue
    const decls = Object.entries(props)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')
    resultParts.push(`${selector} {\n${decls}\n}`)
  }

  return resultParts.join('\n\n').replace(/\n{3,}/g, '\n\n')
}

/**
 * 伪类/伪元素后缀列表
 */
const PSEUDO_SUFFIXES = [
  ':hover', ':active', ':focus', ':visited', ':checked', ':disabled',
  ':first-child', ':last-child', ':nth-child', ':not',
  '::before', '::after', '::placeholder', '::selection'
]

/**
 * 增强版控件 CSS 解析 —— 分离 baseProps、subStyles、pseudoStyles
 * 返回：
 * - baseProps: 主元素 #widgetId 的属性（camelCase → value）
 * - subStyles: 子选择器样式，key 为完整选择器，value 为 CSS 声明文本
 * - pseudoStyles: 伪类/伪元素样式，key 为伪类后缀，value 为 CSS 声明文本
 */
export function parseWidgetCSSEnhanced(
  cssText: string,
  widgetId: string,
  widgetType?: string
): { baseProps: Record<string, any>; subStyles: Record<string, string>; pseudoStyles: Record<string, string> } {
  const result = {
    baseProps: {} as Record<string, any>,
    subStyles: {} as Record<string, string>,
    pseudoStyles: {} as Record<string, string>
  }

  if (!cssText || !widgetId) return result

  const rules = parseAllRules(cssText)
  const targetSelector = '#' + widgetId

  for (const rule of rules) {
    const selectors = rule.selector.split(',').map(s => s.trim())

    for (const sel of selectors) {
      // 精确匹配主元素
      if (sel === targetSelector) {
        for (const [key, value] of Object.entries(rule.properties)) {
          let camelKey = kebabToCamel(key)
          camelKey = CSS_PROPERTY_ALIAS[camelKey] || camelKey
          result.baseProps[camelKey] = convertCSSValue(camelKey, value)
        }
        continue
      }

      // 检查是否是主元素的伪类/伪元素
      const isPseudo = PSEUDO_SUFFIXES.some(p => sel.startsWith(targetSelector + p) || sel === targetSelector + p)
      if (isPseudo) {
        const pseudoKey = sel.slice(targetSelector.length)
        const decls = Object.entries(rule.properties)
          .map(([k, v]) => `  ${k}: ${v};`)
          .join('\n')
        result.pseudoStyles[pseudoKey] = decls
        continue
      }

      // 检查是否是子选择器（#widgetId 后跟空格或 > 的子元素选择器）
      if (sel.startsWith(targetSelector + ' ') || sel.startsWith(targetSelector + '>')) {
        const subSelector = sel
        const decls = Object.entries(rule.properties)
          .map(([k, v]) => `  ${k}: ${v};`)
          .join('\n')
        // 合并同一选择器的多组声明（structuralCSS + mappedProps 会生成重复选择器）
        if (result.subStyles[subSelector]) {
          result.subStyles[subSelector] += '\n' + decls
        } else {
          result.subStyles[subSelector] = decls
        }
      }
    }
  }

  return result
}

/**
 * 增强版样式合并 —— 将 baseProps、subStyles、pseudoStyles 合并到 CSS 文本中
 * @param cssText 原始 CSS 文本
 * @param widgetId 控件 ID
 * @param baseProps 主元素属性（camelCase key → value）
 * @param subStyles 子选择器样式（完整选择器 → CSS 声明文本）
 * @param pseudoStyles 伪类样式（伪类后缀 → CSS 声明文本）
 */
export function mergeStyleToCSSEnhanced(
  cssText: string,
  widgetId: string,
  baseProps: Record<string, any>,
  subStyles: Record<string, string>,
  pseudoStyles: Record<string, string>
): string {
  const targetSelector = '#' + widgetId

  // 构建 baseProps 的 kebab-case 映射
  const baseStyleMap: Record<string, string> = {}
  for (const [key, value] of Object.entries(baseProps)) {
    if (value !== undefined && value !== null && value !== '') {
      const cssKey = camelToKebab(key)
      let cssValue = String(value)
      const numericKeys = [
        'width', 'height', 'font-size', 'border-radius', 'border-width',
        'padding', 'margin', 'min-width', 'min-height'
      ]
      if (numericKeys.includes(cssKey) && typeof value === 'number' && value !== 0) {
        cssValue = value + 'px'
      } else if (cssKey === 'z-index' && typeof value === 'number' && value !== 0) {
        cssValue = String(value)
      }
      baseStyleMap[cssKey] = cssValue
    }
  }

  if (!cssText || !cssText.trim()) {
    // 无现有 CSS，从零创建
    const parts: string[] = []

    // 主元素
    if (Object.keys(baseStyleMap).length > 0) {
      const decls = Object.entries(baseStyleMap)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n')
      parts.push(`${targetSelector} {\n${decls}\n}`)
    }

    // 子样式
    for (const [sel, cssBlock] of Object.entries(subStyles)) {
      parts.push(`${sel} {\n${cssBlock}\n}`)
    }

    // 伪类样式
    for (const [pseudo, cssBlock] of Object.entries(pseudoStyles)) {
      parts.push(`${targetSelector}${pseudo} {\n${cssBlock}\n}`)
    }

    return parts.join('\n\n')
  }

  const rules = parseAllRules(cssText)
  const resultParts: string[] = []

  // 跟踪已处理的子样式和伪类样式
  const handledSubSelectors = new Set<string>()
  const handledPseudoSelectors = new Set<string>()
  let baseFound = false

  for (const rule of rules) {
    const selectors = rule.selector.split(',').map(s => s.trim())

    // 检查是否是纯主元素块
    if (selectors.length === 1 && selectors[0] === targetSelector) {
      baseFound = true
      const mergedProps = { ...rule.properties }
      for (const [cssKey, cssValue] of Object.entries(baseStyleMap)) {
        mergedProps[cssKey] = cssValue
      }
      const decls = Object.entries(mergedProps)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n')
      resultParts.push(`${targetSelector} {\n${decls}\n}`)
      continue
    }

    // 检查是否是伪类块
    const pseudoMatch = selectors.find(s => {
      return PSEUDO_SUFFIXES.some(p => s === targetSelector + p || s.startsWith(targetSelector + p))
    })
    if (pseudoMatch && selectors.length === 1) {
      const pseudoKey = pseudoMatch.slice(targetSelector.length)
      // 已处理过该伪类 → 跳过（删除旧重复块，下面追加统一输出）
      if (handledPseudoSelectors.has(pseudoKey)) {
        continue
      }
      if (pseudoStyles[pseudoKey]) {
        handledPseudoSelectors.add(pseudoKey)
        const decls = pseudoStyles[pseudoKey]
        resultParts.push(`${pseudoMatch} {\n${decls}\n}`)
      } else {
        resultParts.push(rule.rawText)
      }
      continue
    }

    // 检查是否是子选择器块
    const subMatch = selectors.find(s =>
      s.startsWith(targetSelector + ' ') || s.startsWith(targetSelector + '>')
    )
    if (subMatch && selectors.length === 1) {
      // 已处理过该子选择器 → 跳过（删除旧重复块，下面追加统一输出）
      if (handledSubSelectors.has(subMatch)) {
        continue
      }
      if (subStyles[subMatch]) {
        handledSubSelectors.add(subMatch)
        const decls = subStyles[subMatch]
        resultParts.push(`${subMatch} {\n${decls}\n}`)
      } else {
        resultParts.push(rule.rawText)
      }
      continue
    }

    // 其他块原样保留
    resultParts.push(rule.rawText)
  }

  // 追加未处理的主元素
  if (!baseFound && Object.keys(baseStyleMap).length > 0) {
    const decls = Object.entries(baseStyleMap)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n')
    resultParts.push(`${targetSelector} {\n${decls}\n}`)
  }

  // 追加未处理的子样式
  for (const [sel, cssBlock] of Object.entries(subStyles)) {
    if (!handledSubSelectors.has(sel)) {
      resultParts.push(`${sel} {\n${cssBlock}\n}`)
    }
  }

  // 追加未处理的伪类样式
  for (const [pseudo, cssBlock] of Object.entries(pseudoStyles)) {
    if (!handledPseudoSelectors.has(pseudo)) {
      resultParts.push(`${targetSelector}${pseudo} {\n${cssBlock}\n}`)
    }
  }

  return resultParts.join('\n\n').replace(/\n{3,}/g, '\n\n')
}

/**
 * 从控件 style 对象生成 CSS 字符串（无 JSON 配置时的 fallback）
 */
export function generateWidgetCSS(widget: { id: string; style: Record<string, any> }): string {
  const targetSelector = '#' + widget.id
  const style = widget.style || {}

  const baseProps: Record<string, any> = {}
  for (const [key, value] of Object.entries(style)) {
    if (key !== 'subStyles' && key !== 'pseudoStyles' && value !== undefined && value !== null && value !== '') {
      baseProps[key] = value
    }
  }

  const parts: string[] = []

  if (Object.keys(baseProps).length > 0) {
    const decls = Object.entries(baseProps)
      .map(([k, v]) => {
        const cssKey = camelToKebab(k)
        let cssValue = String(v)
        if (typeof v === 'number' && v !== 0) {
          cssValue = v + 'px'
        }
        return `  ${cssKey}: ${cssValue};`
      })
      .join('\n')
    parts.push(`${targetSelector} {\n${decls}\n}`)
  }

  return parts.join('\n\n')
}