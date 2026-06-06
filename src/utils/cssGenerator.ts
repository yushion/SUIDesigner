/**
 * @file utils/cssGenerator.ts
 * @description 通用 CSS 生成器 —— 从 JSON 配置 + 运行时 styleData 生成 CSS 字符串
 *
 * 新 mappedProps 格式：{ selector, base, pseudo } —— 直接定义子元素静态默认样式。
 * #id 主元素样式完全由 defaultStyleData.base + pseudo + structuralCSS + computedProps 覆盖。
 */

import type { Widget, WidgetStyleData, WidgetJSONConfig, MappedProp, ComputedProp } from '@/types/index'
import { camelToKebab } from '@/utils/cssParser'

/** 开发模式：记录 selector 已使用的警告集 */
const warnedSelectors = new Set<string>()

/** 合法的 CSS 属性名集合（camelCase），用于过滤非 CSS 属性（如 headerColor、lineStyle 等） */
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
  'appearance', 'WebkitAppearance', 'MozAppearance',
])

/** 生成定位声明块（position + left + top + width + height + box-sizing） */
function posDecl(styleData: WidgetStyleData): string {
  const b = styleData.base
  return [
    `  position: absolute;`,
    `  left: ${b.left ?? 0}px;`,
    `  top: ${b.top ?? 0}px;`,
    `  width: ${b.width ?? 0}px;`,
    `  height: ${b.height ?? 0}px;`,
    `  box-sizing: border-box;`
  ].join('\n')
}

/** 计算模板变量值 */
function resolveTemplateVars(widget: Widget, template: string): string {
  const h = widget.style.height || 24
  const halfH = Math.round(h / 2)
  const s = widget.style as any
  return template
    .replace(/\{\{halfH\}\}/g, String(halfH))
    .replace(/\{\{height\}\}/g, String(s.height || 0))
    .replace(/\{\{width\}\}/g, String(s.width || 0))
    .replace(/\{\{progressValue\}\}/g, String(widget.progressValue ?? 0))
    .replace(/\{\{headerHeight\}\}/g, String(widget.headerHeight ?? 32))
    .replace(/\{\{tabCount\}\}/g, String(widget.tabs?.length ?? 0))
    .replace(/\{\{layout\}\}/g, String(widget.layout || 'vertical'))
    .replace(/\{\{flexDirection\}\}/g, widget.layout === 'horizontal' ? 'row' : 'column')
    .replace(/\{\{fit\}\}/g, String(widget.fit || 'cover'))
    .replace(/\{\{objPos\}\}/g, String(widget.objectPosition || 'center'))
    .replace(/\{\{headerPadding\}\}/g, String(s.headerPadding || '0 12px'))
    .replace(/\{\{headerColor\}\}/g, String(s.headerColor || '#f5f5f5'))
    .replace(/\{\{headerTitleColor\}\}/g, String(s.headerTitleColor || '#1E1F22'))
    .replace(/\{\{borderColor\}\}/g, String(s.borderColor || '#D0D0D0'))
    .replace(/\{\{lineStyle\}\}/g, String(s.lineStyle || 'solid'))
    .replace(/\{\{borderStyle\}\}/g, String(s.borderStyle || 'solid'))
}

/** 渲染单个计算属性 */
function renderComputedProp(widget: Widget, cp: ComputedProp): string {
  const resolved = resolveTemplateVars(widget, cp.template)
  return `  ${cp.cssProp}: ${resolved};`
}

/** 构建单条 CSS 规则块 */
function buildRuleBlock(selector: string, declarations: string[]): string {
  if (declarations.length === 0) return ''
  return `${selector} {\n${declarations.join('\n')}\n}`
}

/** 将选择器自动作用域到控件 ID 下，防止全局污染 */
function resolveSelector(sel: string, id: string): string {
  if (sel === '#id') return `#${id}`
  if (sel.startsWith('#')) return sel.replace(/#id/g, `#${id}`)
  if (sel.startsWith(':') || sel.startsWith('::')) return `#${id}${sel}`
  return `#${id} ${sel}`
}

/**
 * 生成单个控件的完整 CSS 字符串
 *
 * @param widget  - 控件实例（含 styleData）
 * @param config  - 控件类型 JSON 配置
 * @returns        完整的 CSS 字符串
 */
export function generateWidgetCSS(widget: Widget, config: WidgetJSONConfig): string {
  const sd: WidgetStyleData = widget.styleData || { base: {}, sub: {}, pseudo: {} }
  const id = widget.id
  const name = widget.name || id
  const parts: string[] = []

  // ======== 1. 主 #id 规则块 ========
  const mainDecls: string[] = []

  // 1a. 定位声明块
  mainDecls.push(posDecl(sd))

  // 1b. 结构 CSS（静态，从 JSON 配置读取，非 #id 选择器已在下面处理）
  const mainStructural = config.structuralCSS?.['#id'] || []
  for (const decl of mainStructural) {
    mainDecls.push(`  ${decl};`)
  }

  // 1c. 从 styleData.base 直接提取所有属性（camelCase → kebab-case CSS），过滤非 CSS 属性
  for (const [key, value] of Object.entries(sd.base)) {
    if (
      key === 'subStyles' || key === 'pseudoStyles' ||
      key === 'left' || key === 'top' || key === 'width' || key === 'height' || key === 'zIndex' ||
      value === undefined || value === null ||
      !VALID_CSS_PROPS.has(key)
    ) {
      continue
    }
    // 图片框透明底色：跳过 backgroundColor
    if (key === 'backgroundColor' && (widget as any).transparentBg) {
      continue
    }
    const cssKey = camelToKebab(key)
    if (cssKey) {
      const unit = typeof value === 'number' && !['opacity', 'zIndex', 'fontWeight', 'flex', 'order', 'flexGrow', 'flexShrink'].includes(key)
        ? 'px' : ''
      mainDecls.push(`  ${cssKey}: ${value}${unit};`)
    }
  }

  // 图片框透明底色：显式设置 background-color: transparent
  if ((widget as any).transparentBg) {
    mainDecls.push(`  background-color: transparent;`)
  }

  // 1d. 计算属性（模板变量替换，放在 styleData.base 之后以便覆盖静态值）
  const mainComputed = config.computedProps.filter(cp => cp.selector === '#id')
  for (const cp of mainComputed) {
    mainDecls.push(renderComputedProp(widget, cp))
  }

  parts.push(`/* ${name} - 基础样式 */\n${buildRuleBlock(`#${id}`, mainDecls)}`)

  // ======== 2. 结构 CSS（非 #id 选择器） ========
  if (config.structuralCSS) {
    for (const [sel, decls] of Object.entries(config.structuralCSS)) {
      if (sel === '#id') continue
      const resolvedDecls = decls.map(d => `  ${d};`)
      const resolvedSel = resolveSelector(sel, id)
      parts.push(`\n/* ${name} - ${sel} */\n${buildRuleBlock(resolvedSel, resolvedDecls)}`)
    }
  }

  // ======== 3. mappedProps 子元素样式（新格式：base + pseudo） ========
  // 构建用户子样式映射：resolvedSelector → CSS declarations
  // 用于合并到 mappedProps 的同一规则块中，避免重复输出
  const userSubDecls = new Map<string, Record<string, string>>()
  for (const [subSel, props] of Object.entries(sd.sub)) {
    const resolvedKey = subSel.startsWith('#') ? subSel : `#${id} ${subSel}`
    userSubDecls.set(resolvedKey, props as Record<string, string>)
  }
  // 记录已被 mappedProps 覆盖的选择器（合并到同一规则中，不再单独输出）
  const handledSubKeys = new Set<string>()
  for (const mp of config.mappedProps) {
    const sel = mp.selector
    const resolvedSel = resolveSelector(sel, id)

    // 检查用户是否有该选择器的自定义子样式
    const userOverrides = userSubDecls.get(resolvedSel)
    if (userOverrides) handledSubKeys.add(resolvedSel)

    // 3a. 子元素 base 样式 + 用户自定义覆盖（用 Map 去重，后覆盖前）
    const mergedDecls: string[] = []
    const mergedMap = new Map<string, string>()
    // 先写入 mappedProps 默认值
    for (const [key, value] of Object.entries(mp.base)) {
      if (value === undefined || value === null) continue
      const cssKey = camelToKebab(key)
      if (cssKey) mergedMap.set(cssKey, String(value))
    }
    // 再叠加用户自定义属性（覆盖同名默认值）
    if (userOverrides) {
      for (const [cssKey, cssValue] of Object.entries(userOverrides)) {
        const kebabKey = camelToKebab(cssKey)
        if (kebabKey) mergedMap.set(kebabKey, String(cssValue))
      }
    }
    for (const [cssKey, cssValue] of mergedMap) {
      mergedDecls.push(`  ${cssKey}: ${cssValue};`)
    }

    if (mergedDecls.length > 0) {
      parts.push(`\n/* ${name} - ${sel} */\n${buildRuleBlock(resolvedSel, mergedDecls)}`)
    }

    // 3b. 子元素计算属性（同一 selector）
    const selComputed = config.computedProps.filter(cp => cp.selector === sel)
    const compDecls: string[] = []
    for (const cp of selComputed) {
      compDecls.push(renderComputedProp(widget, cp))
    }
    if (compDecls.length > 0) {
      if (mergedDecls.length === 0) {
        parts.push(`\n/* ${name} - ${sel} */\n${buildRuleBlock(resolvedSel, compDecls)}`)
      } else {
        const combined = [...mergedDecls, ...compDecls]
        parts[parts.length - 1] = `\n/* ${name} - ${sel} */\n${buildRuleBlock(resolvedSel, combined)}`
      }
    }

    // 3c. 子元素伪类样式
    for (const [pseudo, props] of Object.entries(mp.pseudo)) {
      const pseudoDecls: string[] = []
      for (const [key, value] of Object.entries(props)) {
        if (value === undefined || value === null) continue
        const cssKey = camelToKebab(key)
        if (cssKey) {
          pseudoDecls.push(`  ${cssKey}: ${value};`)
        }
      }
      if (pseudoDecls.length > 0) {
        const pseudoSelector = `${resolvedSel}${pseudo}`
        parts.push(`\n/* ${name} - ${sel}${pseudo} */\n${buildRuleBlock(pseudoSelector, pseudoDecls)}`)
      }
    }
  }

  // ======== 4b. 无 mappedProps 的计算属性 ========
  const mpSelectors = new Set(config.mappedProps.map(mp => mp.selector))
  for (const cp of config.computedProps) {
    if (cp.selector === '#id' || mpSelectors.has(cp.selector)) continue
    const resolvedSel = resolveSelector(cp.selector, id)
    const decl = renderComputedProp(widget, cp)
    parts.push(`\n/* ${name} - ${cp.selector} (computed) */\n${buildRuleBlock(resolvedSel, [decl])}`)
  }

  // ======== 4. 剩余用户子样式（未被 mappedProps 覆盖的） ========
  for (const [subSel, props] of Object.entries(sd.sub)) {
    const resolvedKey = subSel.startsWith('#') ? subSel : `#${id} ${subSel}`
    if (handledSubKeys.has(resolvedKey)) continue // 已在 mappedProps 中合并输出，跳过

    const subDecls: string[] = []
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === null) continue
      const cssKey = camelToKebab(key)
      if (cssKey) {
        subDecls.push(`  ${cssKey}: ${value};`)
      }
    }
    if (subDecls.length > 0) {
      const selector = subSel.startsWith('#') ? subSel : `#${id} ${subSel}`
      parts.push(`\n/* ${name} - ${subSel} */\n${buildRuleBlock(selector, subDecls)}`)
    }
  }

  // ======== 5. 主元素伪类样式（从 styleData.pseudo） ========
  for (const [pseudo, props] of Object.entries(sd.pseudo)) {
    const pseudoDecls: string[] = []
    for (const [key, value] of Object.entries(props)) {
      if (value === undefined || value === null) continue
      const cssKey = camelToKebab(key)
      if (cssKey) {
        pseudoDecls.push(`  ${cssKey}: ${value};`)
      }
    }
    if (pseudoDecls.length > 0) {
      const selector = `#${id}${pseudo}`
      parts.push(`\n/* ${name} - ${pseudo} */\n${buildRuleBlock(selector, pseudoDecls)}`)
    }
  }

  validateSelectors(widget, config)

  return parts.join('\n') + '\n'
}

/**
 * 开发模式：校验 selector 一致性
 * 检查 mappedProps/computedProps 中的 selector 是否在 structuralCSS 或 styleData 中有对应
 */
function validateSelectors(widget: Widget, config: WidgetJSONConfig) {
  if (!import.meta.env.DEV) return
  const allSelectors = new Set<string>()
  for (const mp of config.mappedProps) allSelectors.add(mp.selector)
  for (const cp of config.computedProps) allSelectors.add(cp.selector)
  const structuralKeys = new Set(Object.keys(config.structuralCSS || {}))
  for (const sel of allSelectors) {
    if (sel === '#id') continue
    if (sel.startsWith(':') || sel.startsWith('::')) continue
    if (structuralKeys.has(sel)) continue
    const warnKey = `${widget.type}:${sel}`
    if (warnedSelectors.has(warnKey)) continue
    warnedSelectors.add(warnKey)
    console.warn(
      `[cssGenerator] 控件 "${widget.type}" 的 selector "${sel}" 在 mappedProps/computedProps 中定义，` +
      `但未在 structuralCSS 中找到对应声明。请确认 ${widget.type}.json 中的 selector 与 Vue 组件 DOM 类名一致。`
    )
  }
}

/**
 * 批量生成所有控件的 CSS
 */
export function generateAllWidgetCSS(widgets: Widget[], configs: Record<string, WidgetJSONConfig>): string {
  return widgets
    .filter(w => configs[w.type])
    .map(w => generateWidgetCSS(w, configs[w.type]))
    .join('\n')
}

/**
 * 生成画布 CSS（从 canvas 配置）
 * 注意：画布 CSS 涉及 .page-container 等选择器，与控件模式不同，保留原有逻辑
 */
export function generateCanvasCSS(canvasCSS: string): string {
  return canvasCSS
}