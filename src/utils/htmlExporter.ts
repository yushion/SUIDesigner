﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿/**
 * @file utils/htmlExporter.ts
 * @description HTML 导出工具 - 所有样式使用唯一 #widgetId 选择器，无全局标签/类选择器干扰
 */
import type { Widget, CanvasConfig, WidgetStyle, TableRow, MessageBoxConfig, InputBoxConfig } from '@/types/index'
import { TREE_RUNTIME_SCRIPT, DATATABLE_RUNTIME_SCRIPT } from './ui-runtime'
import { getWidgetJSONConfig, getWidgetExporter } from '@/config/widgetRegistry'
import { getAllCustomWidgetCSS } from '@/config/customWidgetAPI'
import { generateWidgetCSS } from './cssGenerator'

// ================================================================
// 工具函数
// ================================================================

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * 将控件类型映射为 data-ctrl-type 值（供 webviewBridge.js 事件委托识别）
 */
function widgetTypeToCtrlType(type: string): string {
  const map: Record<string, string> = {
    'button': 'button',
    'input': 'input_text',
    'checkbox': 'checkbox',
    'toggle': 'switch_toggle',
    'comboBox': 'combobox',
    'label': 'label',
    'divider': 'divider',
    'hyperlink': 'hyperlink',
    'textarea': 'textarea',
    'radioGroup': 'radio_group',
    'progressBar': 'progress_bar',
    'datetimePicker': 'datetime_picker',
    'logOutput': 'logbox',
    'iconButton': 'icon_button',
    'tabsContainer': 'tab_container',
    'cardBox': 'cardbox',
    'listBox': 'listbox',
    'treeView': 'treeview',
    'dataGrid': 'datagrid',
    'imageBox': 'image_box',
    'contextMenu': 'context_menu',
    'canvas': 'canvas'
  }
  return map[type] || type
}

function dataAttrs(widget: Widget): string {
  let attrs = `id="${esc(widget.id)}" data-type="${esc(widget.type)}" data-ctrl-type="${widgetTypeToCtrlType(widget.type)}" data-ctrl-id="${esc(widget.id)}" data-name="${esc(widget.name || widget.id)}"`
  if (widget.parentId) attrs += ` data-parent="${esc(widget.parentId)}"`
  if (widget.parentTabIndex !== undefined) attrs += ` data-tab="${widget.parentTabIndex}"`
  if (widget.columns) attrs += ` data-columns='${JSON.stringify(widget.columns)}'`
  if (widget.rows) attrs += ` data-rows='${JSON.stringify(widget.rows)}'`
  if (widget.showRowCheckbox !== undefined) attrs += ` data-show-checkbox="${widget.showRowCheckbox}"`
  if (widget.allowAddRow !== undefined) attrs += ` data-allow-add="${widget.allowAddRow}"`
  if (widget.allowDeleteRow !== undefined) attrs += ` data-allow-delete="${widget.allowDeleteRow}"`
  if (widget.editable !== undefined) attrs += ` data-editable="${widget.editable}"`
  if (widget.alwaysShowSelection !== undefined) attrs += ` data-always-show-selection="${widget.alwaysShowSelection}"`
  return attrs
}

// ================================================================
// 每个控件生成完整独立的 #id { ... } 定位 + 尺寸 + 默认视觉 + 样式面板属性
// 不再依赖全局标签/类选择器，彻底消除跨控件样式干扰
// ================================================================

/**
 * 为每个控件生成完整的 CSS，仅两步：
 *   1. widget.style 视觉属性 → CSS 属性（和设计区 :style 绑定一致）
 *   2. customCSS 解析 → baseProps 覆盖主块 + pseudo/sub 规则追加
 * 不再硬编码任何默认值、伪类或结构样式。
 */
function genWidgetCompleteCSS(widget: Widget): string {
  const config = getWidgetJSONConfig(widget.type)
  if (!config) {
    // 兜底：没有 JSON 配置的控件类型，使用简化版 CSS
    const style = widget.style
    const id = widget.id
    let css = `#${id} {\n`
    css += `  position: absolute;\n`
    css += `  left: ${style.left}px;\n`
    css += `  top: ${style.top}px;\n`
    css += `  width: ${style.width}px;\n`
    css += `  height: ${style.height}px;\n`
    css += `  z-index: ${style.zIndex || 1};\n`
    css += `  box-sizing: border-box;\n`
    if (style.backgroundColor) css += `  background-color: ${style.backgroundColor};\n`
    if (style.color) css += `  color: ${style.color};\n`
    if (style.fontSize) css += `  font-size: ${style.fontSize}px;\n`
    css += `}\n`
    return css
  }
  return generateWidgetCSS(widget, config)
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

interface ParsedCustomCSS {
  baseProps: Map<string, string>
  rules: Map<string, string>
}

function parseCustomCSS(customCSS: string, widgetId: string): ParsedCustomCSS {
  const baseProps = new Map<string, string>()
  const rules = new Map<string, string>()

  if (!customCSS || !customCSS.trim()) return { baseProps, rules }

  const escapedId = escapeRegex(widgetId)
  const blockRegex = new RegExp(`#${escapedId}([^{]*?)\\s*\\{([^}]*)\\}`, 'g')
  const skipProps = ['position', 'left', 'top', 'width', 'height', 'z-index', 'box-sizing']

  let match
  while ((match = blockRegex.exec(customCSS)) !== null) {
    const selector = match[1].trimEnd()
    const body = match[2].trim()

    if (!selector) {
      body.split(';').forEach(decl => {
        const trimmed = decl.trim()
        if (!trimmed) return
        const colonIdx = trimmed.indexOf(':')
        if (colonIdx <= 0) return
        const prop = trimmed.substring(0, colonIdx).trim()
        const val = trimmed.substring(colonIdx + 1).trim()
        if (!skipProps.includes(prop)) {
          baseProps.set(prop, val)
        }
      })
    } else {
      rules.set(selector, `#${widgetId}${selector} { ${body} }`)
    }
  }

  return { baseProps, rules }
}

// ================================================================
// 各控件 DOM 生成（纯 HTML，无内联 style）
// ================================================================

function genButton(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const text = esc(widget.text || '按钮')
  const disabled = widget.disabled ? ' disabled' : ''
  return `<button ${dAttrs}${disabled}>${text}</button>`
}

function genInput(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const placeholder = esc(widget.placeholder || '')
  const value = esc(widget.value || '')
  const iType = widget.inputType || 'text'
  const disabled = widget.disabled ? ' disabled' : ''
  return `<input type="${iType}" ${dAttrs} placeholder="${placeholder}" value="${value}"${disabled} />`
}

function genCheckbox(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const text = esc(widget.labelText || '选项')
  const checked = widget.checked ? ' checked' : ''
  const disabled = widget.disabled ? ' disabled' : ''
  return `<label ${dAttrs}><input type="checkbox"${checked}${disabled} /><span>${text}</span></label>`
}

function genToggle(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const checked = widget.checked ? ' checked' : ''
  const disabled = widget.disabled ? ' disabled' : ''
  return `<label ${dAttrs} style="display:inline-flex;align-items:center;"><input type="checkbox"${checked}${disabled} /><span class="slider"></span></label>`
}

function genComboBox(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const disabled = widget.disabled ? ' disabled' : ''
  const options = widget.options || ['选项1', '选项2', '选项3']
  const selIdx = widget.selectedIndex || 0
  const optsHTML = options.map((opt, i) =>
    `<option value="${esc(opt)}"${i === selIdx ? ' selected' : ''}>${esc(opt)}</option>`
  ).join('')
  return `<select ${dAttrs}${disabled}>${optsHTML}</select>`
}

function genLabel(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const text = esc(widget.text || '标签')
  return `<span ${dAttrs}>${text}</span>`
}

function genDivider(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  return `<div ${dAttrs}></div>`
}

function genHyperlink(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const text = esc(widget.text || '超链接')
  // 禁止浏览器跳转：href 使用 javascript:void(0)，实际链接存为 data-href
  // 点击事件由 webviewBridge.js 拦截并发送给宿主处理
  const href = 'javascript:void(0)'
  const dataHref = esc(widget.href || '#')
  const disabledAttr = widget.disabled ? ' disabled' : ''
  return `<a ${dAttrs} href="${href}" data-href="${dataHref}"${disabledAttr}>${text}</a>`
}

function genDateTimePicker(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const value = esc(widget.value || '')
  const disabled = widget.disabled ? ' disabled' : ''
  return `<input type="datetime-local" ${dAttrs} value="${value}"${disabled} />`
}

function genTextarea(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const placeholder = esc(widget.placeholder || '')
  const value = esc(widget.value || '')
  const rows = widget.rows || 4
  const disabled = widget.disabled ? ' disabled' : ''
  return `<textarea ${dAttrs} placeholder="${placeholder}" rows="${rows}"${disabled}>${value}</textarea>`
}

function genRadioGroup(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const radioName = esc(widget.name || widget.id)
  const options = widget.options || ['选项1', '选项2']
  const selIdx = widget.selectedIndex || 0
  const layoutClass = widget.layout === 'horizontal' ? ' radiogroup-h' : ''
  const disabledAttr = widget.disabled ? ' disabled' : ''
  const optsHTML = options.map((opt, i) =>
    `<label class="radiogroup-item"${disabledAttr}><input type="radio" data-ctrl-type="radio" name="${radioName}" value="${esc(opt)}"${i === selIdx ? ' checked' : ''}${disabledAttr} />${esc(opt)}</label>`
  ).join('')
  return `<div ${dAttrs} class="radiogroup-container${layoutClass}">${optsHTML}</div>`
}

function genProgressBar(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const pct = widget.progressValue ?? 0
  const barColor = (widget.style as any).barColor || '#0078D4'
  const showText = widget.showProgressText !== false
  const isDraggable = !!(widget as any).draggable
  const thumbHtml = isDraggable
    ? `<div class="progress-thumb" style="position:absolute;left:calc(${pct}% - 11px);top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:#fff;border:2px solid ${barColor};box-shadow:0 1px 6px rgba(0,0,0,0.3);z-index:0;cursor:pointer;"></div>`
    : ''
  const textHtml = showText ? `<span class="progress-text" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:inherit;pointer-events:none;white-space:nowrap;">${pct}%</span>` : ''
  const draggableAttr = isDraggable ? ` data-draggable="true"` : ''
  return `<div ${dAttrs} class="progress-bar-container" style="overflow:visible;"${draggableAttr}><div class="progress-track"></div><div class="progress-fill" style="width:${pct}%;height:100%;background:${barColor};border-radius:inherit;transition:width 0.15s;"></div>${thumbHtml}${textHtml}</div>`
}

function genCanvas(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const disabledClass = widget.disabled ? ' disabled' : ''
  const disabledOverlay = widget.disabled ? '<div class="disabled-overlay"></div>' : ''
  return `<div ${dAttrs} class="canvas-box${disabledClass}">${disabledOverlay}</div>`
}

function genLogOutput(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const logs = widget.logs || []
  const lines = logs.map(l =>
    `<div class="log-line" data-ctrl-type="log_item" style="color:${esc(l.color || '#000000')}">${esc(l.text)}</div>`
  ).join('\n')
  return `<div ${dAttrs} class="log-output-container">${lines}</div>`
}

function genIconButton(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const disabled = widget.disabled ? ' disabled' : ''
  const text = widget.text || ''
  const pos = widget.iconPosition || 'left'
  const iconHtml = widget.iconHtml || `<i class="fas ${esc(widget.iconName || 'fa-star')}"></i>`
  const sanitizedIcon = iconHtml.replace(/<script[\s\S]*?<\/script>/gi, '')
  let html = ''
  if (pos !== 'right' || !text) {
    html += sanitizedIcon
  }
  if (text && pos !== 'icon-only') {
    html += `<span>${esc(text)}</span>`
  }
  if (pos === 'right' && text) {
    html += sanitizedIcon
  }
  return `<button ${dAttrs}${disabled}>${html}</button>`
}

function genImageBox(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const src = esc(widget.src || '')
  const disabledClass = widget.disabled ? ' disabled' : ''
  const disabledOverlay = widget.disabled ? '<div class="disabled-overlay"></div>' : ''
  return `<div ${dAttrs} class="image-box${disabledClass}">${src ? `<img src="${src}" loading="lazy" alt="" />` : ''}${disabledOverlay}</div>`
}

/**
 * 生成卡片框 HTML
 */
function genCardBox(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const showHeader = widget.showHeader !== false
  const disabledData = widget.disabled ? ' data-disabled="true" class="disabled"' : ''
  const collapseAttr = widget.collapsible ? ` data-collapsible="true" data-collapsed="${widget.collapsed ? 'true' : 'false'}"` : ''
  const collapsedClass = (widget.collapsible && widget.collapsed) ? ' collapsed' : ''
  const downArrowSVG = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const rightArrowSVG = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M4.5 3L7.5 6L4.5 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  const collapseBtn = (showHeader && widget.collapsible)
    ? `<span class="card-collapse-btn">${widget.collapsed ? rightArrowSVG : downArrowSVG}</span>`
    : ''
  const headerHTML = showHeader
    ? `<div class="card-header"><span class="card-header-title">${esc(widget.headerTitle || '卡片标题')}</span>${collapseBtn}</div>`
    : ''
  const childrenHTML = (widget.children || []).map(c => generateWidgetHTML(c)).join('\n')
  return `<div ${dAttrs}${disabledData}${collapseAttr} class="card-box${collapsedClass}">${headerHTML}<div class="card-body" data-ctrl-type="cardbox_body">${childrenHTML}</div></div>`
}

/**
 * 生成列表框 HTML（含数据属性供运行时库使用）
 */
function genListBox(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const items = widget.items || []
  const itemsJSON = JSON.stringify(items).replace(/'/g, '&#39;')
  const editable = widget.editable ? ' data-editable="true"' : ''
  const showCb = widget.showCheckbox ? ' data-show-checkbox="true"' : ''
  const alwaysShow = widget.alwaysShowSelection !== false ? ' data-always-show-selection="true"' : ''
  const disabledData = widget.disabled ? ' data-disabled="true" class="disabled"' : ''
  const itemsHTML = items.map((item, idx) => {
    const cb = widget.showCheckbox
      ? `<input type="checkbox" class="list-item-checkbox" data-ctrl-type="listbox_item_checkbox"${item.selected ? ' checked' : ''} data-item-index="${idx}" />`
      : ''
    return `<div class="list-item" data-ctrl-type="listbox_item" data-item-index="${idx}">${cb}<span class="list-item-text">${esc(item.text)}</span></div>`
  }).join('\n')
  if (items.length === 0) {
    return `<div ${dAttrs} data-listbox-items='${itemsJSON}'${editable}${showCb}${alwaysShow}${disabledData}><div class="list-box-scroll"><div class="list-empty">暂无数据</div></div>${widget.disabled ? '<div class="disabled-overlay"></div>' : ''}</div>`
  }
  return `<div ${dAttrs} data-listbox-items='${itemsJSON}'${editable}${showCb}${alwaysShow}${disabledData}><div class="list-box-scroll">${itemsHTML}</div>${widget.disabled ? '<div class="disabled-overlay"></div>' : ''}</div>`
}

/**
 * 生成树形框 HTML（含数据属性供运行时库使用）
 */
function genTreeView(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const editable = ' data-editable="' + (widget.treeEditable ? 'true' : 'false') + '"'
  const showIcon = widget.treeShowIcon !== false ? ' data-show-icon="true"' : ''
  const showCheckbox = widget.treeShowCheckbox === true ? ' data-show-checkbox="true"' : ''
  const alwaysShow = widget.treeAlwaysShowSelection !== false ? ' data-always-show-selection="true"' : ''
  const disabledData = widget.disabled ? ' data-disabled="true" class="disabled"' : ''
  const treeId = widget.id

  function genTreeNode(node: any, level: number): string {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = node.expanded === true
    const toggleClass = hasChildren ? (isExpanded ? ' expanded' : ' collapsed') : ' empty'
    const iconClass = hasChildren ? ' folder' : ' file'

    const nodeId = node.id || ''
    const nodeChecked = node.checked ? ' checked' : ''

    let childrenHTML = ''
    if (hasChildren) {
      childrenHTML = '<div class="tree-children">' + node.children.map((child: any) => genTreeNode(child, level + 1)).join('') + '</div>'
    }

    return `<div class="tree-node" data-node-id="${esc(nodeId)}" data-level="${level}">
      <div class="tree-node-content">
        ${widget.treeShowCheckbox ? '<span class="tree-checkbox"><input type="checkbox" class="tree-node-check" data-ctrl-type="treeview_node_checkbox"' + nodeChecked + '></span>' : ''}
        <span class="tree-toggle${toggleClass}" data-ctrl-type="treeview_node_toggle"></span>
        <span class="tree-icon${iconClass}">${hasChildren ? '📁' : '📄'}</span>
        <span class="tree-label" data-ctrl-type="treeview_node_text">${esc(node.text || '')}</span>
        <span class="tree-edit-input" style="display:none"></span>
      </div>
      ${childrenHTML}
    </div>`
  }

  const nodes = widget.treeNodes || []
  const nodesHTML = nodes.map((node: any) => genTreeNode(node, 0)).join('')

  return `<div ${dAttrs} data-type="treeView" data-tree-id="${esc(treeId)}"${editable}${showIcon}${showCheckbox}${alwaysShow}${disabledData}>${nodesHTML}</div>`
}

/**
 * 生成多项表格控件的 HTML
 */
function genDataGrid(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const columns = widget.columns || []
  const rows: TableRow[] = Array.isArray(widget.rows) ? widget.rows : []
  const showCheckbox = widget.showRowCheckbox !== false

  let headerHTML = ''
  if (showCheckbox) {
    headerHTML += `<div class="data-grid-header-cell data-grid-checkbox" style="width:36px;min-width:36px;flex-shrink:0"><input type="checkbox" class="data-grid-select-all"></div>`
  }
  columns.forEach(col => {
    const w = col.width || 100
    headerHTML += `<div class="data-grid-header-cell" data-col-key="${esc(col.field)}" data-ctrl-type="datagrid_cell" data-col-name="${esc(col.header)}" style="width:${w}px;min-width:${w}px;flex-shrink:0">${esc(col.header || col.field)}</div>`
  })

  let bodyHTML = ''
  rows.forEach((row, ri) => {
    const rowClass = row.selected ? 'data-grid-row data-grid-row-focused' : 'data-grid-row'
    bodyHTML += `<div class="${rowClass.trim()}" data-row-index="${ri}" data-row-id="${esc(row.id)}">`
    if (showCheckbox) {
      const checked = row.selected ? ' checked' : ''
      bodyHTML += `<div class="data-grid-cell data-grid-checkbox" style="width:36px;min-width:36px;flex-shrink:0"><input type="checkbox" class="data-grid-row-check" data-ctrl-type="datagrid_row_checkbox"${checked}></div>`
    }
    columns.forEach(col => {
      const w = col.width || 100
      const val = row.cells ? (row.cells[col.field] !== undefined && row.cells[col.field] !== null ? String(row.cells[col.field]) : '') : ''
      bodyHTML += `<div class="data-grid-cell" data-ctrl-type="datagrid_cell" data-col-key="${esc(col.field)}" data-col-name="${esc(col.header)}" style="width:${w}px;min-width:${w}px;flex-shrink:0" title="${esc(val)}">${esc(val)}</div>`
    })
    bodyHTML += `</div>`
  })

  return (
    `<div ${dAttrs} class="data-grid-container">` +
    `<div class="data-grid-header">${headerHTML}</div>` +
    `<div class="data-grid-body">${bodyHTML}</div>` +
    `</div>`
  )
}

function genTabsContainer(widget: Widget): string {
  const dAttrs = dataAttrs(widget)
  const tabs = widget.tabs || []
  const activeName = widget.activeTab || (tabs[0]?.name || 'tab1')
  const disabledData = widget.disabled ? ' data-disabled="true"' : ''
  const hideHeader = widget.hideTabHeader === true

  const tabHeaders = tabs.map((tab) => {
    const activeClass = tab.name === activeName ? ' active' : ''
    return `<button class="tab-header-btn${activeClass}" data-ctrl-type="tab_btn" data-tab-name="${esc(tab.name)}">${esc(tab.title)}</button>`
  }).join('')

  const tabPanes = tabs.map((tab, idx) => {
    const activeClass = tab.name === activeName ? ' active' : ''
    const childWidgets = (widget.children || []).filter(c => c.parentTabIndex === idx)
    const childrenDOM = childWidgets.map(c => generateWidgetHTML(c)).join('\n')
    return `<div class="tab-content-panel${activeClass}" data-tab-name="${esc(tab.name)}" data-parent="${esc(widget.id)}" data-tab="${idx}">${childrenDOM}</div>`
  }).join('\n')

  return (
    `<div ${dAttrs} class="tabs-container"${disabledData}>` +
    (hideHeader ? `<div class="tab-header-bar" style="display:none">${tabHeaders}</div>` : `<div class="tab-header-bar">${tabHeaders}</div>`) +
    `<div class="tab-content-wrapper">${tabPanes}</div>` +
    `</div>`
  )
}

// ================================================================
// 类型分发 + 递归生成
// ================================================================

function generateWidgetHTML(widget: Widget): string {
  if (!widget.visible) return ''

  switch (widget.type as string) {
    case 'button':        return genButton(widget)
    case 'input':         return genInput(widget)
    case 'checkbox':      return genCheckbox(widget)
    case 'toggle':        return genToggle(widget)
    case 'comboBox':      return genComboBox(widget)
    case 'label':         return genLabel(widget)
    case 'divider':       return genDivider(widget)
    case 'hyperlink':     return genHyperlink(widget)
    case 'textarea':      return genTextarea(widget)
    case 'radioGroup':    return genRadioGroup(widget)
    case 'tabsContainer': return genTabsContainer(widget)
    case 'progressBar':  return genProgressBar(widget)
    case 'datetimePicker': return genDateTimePicker(widget)
    case 'logOutput':   return genLogOutput(widget)
    case 'iconButton':  return genIconButton(widget)
    case 'imageBox':    return genImageBox(widget)
    case 'canvas':      return genCanvas(widget)
    case 'cardBox':     return genCardBox(widget)
    case 'listBox':     return genListBox(widget)
    case 'treeView':    return genTreeView(widget)
    case 'dataGrid':    return genDataGrid(widget)
    case 'contextMenu': return ''
    case 'tooltip': return ''
    default: {
      const exporter = getWidgetExporter(widget.type)
      if (exporter) return exporter(widget)
      return ''
    }
  }
}

/** HTML 导出函数映射表（供 widgetRegistry 统一注册） */
export const widgetHTMLGenerators: Record<string, (widget: Widget) => string> = {
  button: genButton,
  input: genInput,
  checkbox: genCheckbox,
  toggle: genToggle,
  comboBox: genComboBox,
  label: genLabel,
  divider: genDivider,
  hyperlink: genHyperlink,
  textarea: genTextarea,
  radioGroup: genRadioGroup,
  tabsContainer: genTabsContainer,
  progressBar: genProgressBar,
  datetimePicker: genDateTimePicker,
  logOutput: genLogOutput,
  iconButton: genIconButton,
  imageBox: genImageBox,
  cardBox: genCardBox,
  listBox: genListBox,
  treeView: genTreeView,
  dataGrid: genDataGrid,
}

/**
 * 递归收集所有控件（含子控件）的完整 CSS
 * 每个控件独立生成完整的 #id { ... } 块，互不干扰
 */
function collectAllCSS(widgets: Widget[]): string {
  let css = ''

  function collect(w: Widget) {
    css += genWidgetCompleteCSS(w) + '\n'

    if (w.children) {
      w.children.forEach(c => collect(c))
    }
  }

  widgets.forEach(w => collect(w))
  return css
}

// ================================================================
// UI 交互运行时脚本 — 标签页切换 / 卡片框折叠
// ================================================================

const BRIDGE_SCRIPT = `
(function() {
  'use strict';

  document.addEventListener('click', function(e) {
    var tabBtn = e.target.closest('.tab-header-btn');
    if (tabBtn) {
      var container = tabBtn.closest('.tabs-container');
      if (!container) return;

      if (container.getAttribute('data-disabled') === 'true') return;

      var tabName = tabBtn.getAttribute('data-tab-name');
      var allBtns = container.querySelectorAll('.tab-header-btn');
      allBtns.forEach(function(b) { b.classList.remove('active'); });
      tabBtn.classList.add('active');

      var allPanes = container.querySelectorAll('.tab-content-panel');
      allPanes.forEach(function(p) { p.classList.remove('active'); });
      var activePane = container.querySelector('.tab-content-panel[data-tab-name="' + tabName + '"]');
      if (activePane) activePane.classList.add('active');
      return;
    }

    var collapseBtn = e.target.closest('.card-collapse-btn');
    if (collapseBtn) {
      var card = collapseBtn.closest('.card-box');
      if (!card) return;
      var isCollapsed = card.getAttribute('data-collapsed') === 'true';
      var downArrow = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var rightArrow = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M4.5 3L7.5 6L4.5 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      if (isCollapsed) {
        card.setAttribute('data-collapsed', 'false');
        card.classList.remove('collapsed');
        collapseBtn.innerHTML = downArrow;
      } else {
        card.setAttribute('data-collapsed', 'true');
        card.classList.add('collapsed');
        collapseBtn.innerHTML = rightArrow;
      }
      return;
    }
  });
})();
`

/**
 * 进度条运行时交互 — 点击/拖拽修改进度
 */
const PROGRESS_RUNTIME = `
(function() {
  'use strict';
  function updateProgress(bar, pct) {
    var fill = bar.querySelector('.progress-fill');
    var txt = bar.querySelector('.progress-text');
    var thumb = bar.querySelector('.progress-thumb');
    if (fill) fill.style.width = pct + '%';
    if (txt) txt.textContent = pct + '%';
    if (thumb) thumb.style.left = 'calc(' + pct + '% - 11px)';
  }
  document.addEventListener('mousedown', function(e) {
    var bar = e.target.closest('[data-ctrl-type="progress_bar"]');
    if (!bar) return;
    var fill = bar.querySelector('.progress-fill');
    if (!fill) return;
    var isEditable = bar.getAttribute('data-editable') === 'true';
    var isDraggable = bar.getAttribute('data-draggable') === 'true';
    var thumb = bar.querySelector('.progress-thumb');
    if (!isEditable) return;

    function calcPct(clientX) {
      var rect = bar.getBoundingClientRect();
      return Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    }

    if (isDraggable && thumb && thumb.contains(e.target)) {
      var barRect = bar.getBoundingClientRect();
      function onMove(ev) {
        ev.preventDefault();
        var dx = ev.clientX - barRect.left;
        var pct = Math.max(0, Math.min(100, Math.round((dx / barRect.width) * 100)));
        updateProgress(bar, pct);
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.userSelect = '';
        if (thumb) thumb.style.cursor = 'pointer';
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.body.style.userSelect = 'none';
      thumb.style.cursor = 'grabbing';
      return;
    }

    // 点击修改
    var pct = calcPct(e.clientX);
    updateProgress(bar, pct);
  });
})();
`

/**
 * ListBoxManager 运行时库 — 为导出的列表框提供动态增删/编辑功能
 */
const LISTBOX_RUNTIME = `
(function() {
  var ListBoxManager = {
    itemsCache: {},

    init: function() {
      var listBoxes = document.querySelectorAll('[data-listbox-items]');
      for (var i = 0; i < listBoxes.length; i++) {
        var el = listBoxes[i];
        var id = el.id;
        if (!id) continue;
        try {
          var items = JSON.parse(el.getAttribute('data-listbox-items') || '[]');
          ListBoxManager.itemsCache[id] = items;
        } catch(e) { ListBoxManager.itemsCache[id] = []; }
        ListBoxManager._bindEvents(el);
        ListBoxManager._bindBlur(el);
      }
    },

    _bindBlur: function(el) {
      document.addEventListener('mousedown', function(e) {
        if (el.getAttribute('data-always-show-selection') === 'true') return;
        if (!el.contains(e.target)) {
          var allItems = el.querySelectorAll('.list-item');
          for (var ai = 0; ai < allItems.length; ai++) {
            allItems[ai].classList.remove('item-selected');
          }
        }
      });
    },

    _render: function(listBoxEl) {
      var id = listBoxEl.id;
      var items = ListBoxManager.itemsCache[id] || [];
      var showCheckbox = listBoxEl.getAttribute('data-show-checkbox') === 'true';
      var scroll = listBoxEl.querySelector('.list-box-scroll');
      if (!scroll) return;
      if (items.length === 0) {
        scroll.innerHTML = '<div class="list-empty">暂无数据</div>';
        return;
      }
      var html = '';
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var cb = showCheckbox ? '<input type="checkbox" class="list-item-checkbox" data-ctrl-type="listbox_item_checkbox"' + (item.selected ? ' checked' : '') + ' data-item-index="' + i + '" />' : '';
        html += '<div class="list-item" data-ctrl-type="listbox_item" data-item-index="' + i + '">' + cb + '<span class="list-item-text">' + ListBoxManager._escHtml(item.text) + '</span></div>';
      }
      scroll.innerHTML = html;
      ListBoxManager._bindEvents(listBoxEl);
    },

    _escHtml: function(str) {
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    _bindEvents: function(el) {
      var items = el.querySelectorAll('.list-item');
      for (var i = 0; i < items.length; i++) {
        (function(itemEl) {
          itemEl.onclick = function(e) {
            if (e.target.tagName === 'INPUT') return;
            var listBox = itemEl.closest('[data-listbox-items]');
            if (!listBox || listBox.getAttribute('data-disabled') === 'true') return;
            var allItems = listBox.querySelectorAll('.list-item');
            for (var ai = 0; ai < allItems.length; ai++) {
              allItems[ai].classList.remove('item-selected');
            }
            itemEl.classList.add('item-selected');
          };
          itemEl.ondblclick = function(e) {
            var listBox = itemEl.closest('[data-listbox-items]');
            if (!listBox || listBox.getAttribute('data-editable') !== 'true') return;
            if (listBox.getAttribute('data-disabled') === 'true') return;
            ListBoxManager._startEdit(listBox, itemEl);
          };
          var cb = itemEl.querySelector('.list-item-checkbox');
          if (cb) {
            cb.onchange = function(e) {
              var listBox = cb.closest('[data-listbox-items]');
              if (!listBox) return;
              var idx = parseInt(cb.getAttribute('data-item-index') || '0');
              var cache = ListBoxManager.itemsCache[listBox.id];
              if (cache && cache[idx]) cache[idx].selected = cb.checked;
            };
          }
        })(items[i]);
      }
    },

    _startEdit: function(listBox, itemEl) {
      var idx = parseInt(itemEl.getAttribute('data-item-index') || '0');
      var cache = ListBoxManager.itemsCache[listBox.id];
      if (!cache || !cache[idx]) return;
      var textSpan = itemEl.querySelector('.list-item-text');
      if (!textSpan) return;
      var oldText = cache[idx].text;
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'list-item-edit-input';
      input.value = oldText;
      // 逐项设置样式，确保生效
      input.style.border = '1px solid #1890ff';
      input.style.borderRadius = '3px';
      input.style.background = '#fff';
      input.style.outline = 'none';
      input.style.boxShadow = 'none';
      input.style.flex = '1';
      input.style.height = '100%';
      input.style.padding = '0 6px';
      input.style.fontSize = 'inherit';
      input.style.fontFamily = 'inherit';
      textSpan.replaceWith(input);
      input.focus();
      input.select();
      var save = function() {
        var newText = input.value.trim();
        if (newText && newText !== oldText) {
          cache[idx].text = newText;
          ListBoxManager._updateDataAttr(listBox);
        }
        var span = document.createElement('span');
        span.className = 'list-item-text';
        span.textContent = cache[idx].text;
        input.replaceWith(span);
      };
      input.onblur = save;
      input.onkeydown = function(e) {
        if (e.key === 'Enter') { input.blur(); }
        if (e.key === 'Escape') { input.value = oldText; input.blur(); }
      };
    },

    _updateDataAttr: function(listBox) {
      var id = listBox.id;
      var cache = ListBoxManager.itemsCache[id];
      if (!cache) return;
      listBox.setAttribute('data-listbox-items', JSON.stringify(cache));
    },

    add: function(listBoxId, text) {
      var el = document.getElementById(listBoxId);
      var cache = ListBoxManager.itemsCache[listBoxId];
      if (!el || !cache) return false;
      cache.push({ id: '', text: String(text) });
      ListBoxManager._updateDataAttr(el);
      ListBoxManager._render(el);
      return true;
    },

    remove: function(listBoxId, index) {
      var el = document.getElementById(listBoxId);
      var cache = ListBoxManager.itemsCache[listBoxId];
      if (!el || !cache || index < 0 || index >= cache.length) return false;
      cache.splice(index, 1);
      ListBoxManager._updateDataAttr(el);
      ListBoxManager._render(el);
      return true;
    },

    setItemText: function(listBoxId, index, text) {
      var el = document.getElementById(listBoxId);
      var cache = ListBoxManager.itemsCache[listBoxId];
      if (!el || !cache || index < 0 || index >= cache.length) return false;
      cache[index].text = String(text);
      ListBoxManager._updateDataAttr(el);
      ListBoxManager._render(el);
      return true;
    },

    setCheckbox: function(listBoxId, index, checked) {
      var el = document.getElementById(listBoxId);
      var cache = ListBoxManager.itemsCache[listBoxId];
      if (!el || !cache || index < 0 || index >= cache.length) return false;
      cache[index].selected = !!checked;
      var itemEl = el.querySelector('[data-item-index="' + index + '"]');
      if (itemEl) {
        var cb = itemEl.querySelector('.list-item-checkbox');
        if (cb) cb.checked = !!checked;
      }
      ListBoxManager._updateDataAttr(el);
      return true;
    },

    getChecked: function(listBoxId, index) {
      var cache = ListBoxManager.itemsCache[listBoxId];
      if (!cache || index < 0 || index >= cache.length) return false;
      return !!cache[index].selected;
    },

    getItems: function(listBoxId) {
      return ListBoxManager.itemsCache[listBoxId] || [];
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { ListBoxManager.init(); });
  } else {
    ListBoxManager.init();
  }

  window.ListBoxManager = ListBoxManager;
})();
`

/**
 * TreeManager 运行时库 — 为导出的树形框提供展开/折叠/选择/编辑功能
 */
const TREEVIEW_RUNTIME = `
(function() {
  var TreeManager = {
    trees: {},

    init: function(options) {
      var id = options.id;
      var data = options.data;
      var editable = options.editable;
      var tree = { data: data, editable: editable, el: document.getElementById(id) };
      TreeManager.trees[id] = tree;
      TreeManager._bindEvents(tree);
    },

    _bindEvents: function(tree) {
      if (!tree.el) return;

      tree.el.addEventListener('click', function(e) {
        var toggle = e.target.closest('.tree-toggle');
        if (toggle && !toggle.classList.contains('empty')) {
          e.stopPropagation();
          var nodeEl = toggle.closest('.tree-node');
          var childrenEl = nodeEl.querySelector(':scope > .tree-children');
          var isExpanded = toggle.classList.contains('expanded');
          if (isExpanded) {
            toggle.classList.remove('expanded');
            toggle.classList.add('collapsed');
            if (childrenEl) childrenEl.style.display = 'none';
          } else {
            toggle.classList.remove('collapsed');
            toggle.classList.add('expanded');
            if (childrenEl) childrenEl.style.display = '';
          }
          return;
        }
        var content = e.target.closest('.tree-node-content');
        if (content) {
          var nodeEl = content.closest('.tree-node');
          var allNodes = tree.el.querySelectorAll('.tree-node.selected');
          allNodes.forEach(function(n) { n.classList.remove('selected'); });
          nodeEl.classList.add('selected');
        }
      });

      tree.el.addEventListener('dblclick', function(e) {
        if (!tree.editable) return;
        var label = e.target.closest('.tree-label');
        if (!label) return;
        var nodeEl = label.closest('.tree-node');
        // 如果已经存在编辑框，不重复创建
        if (nodeEl.querySelector('.tree-edit-input')) return;

        var oldText = label.textContent;

        // 动态创建输入框
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'tree-edit-input';
        input.value = oldText;
        // 内联样式，防止横向滚动条
        input.style.cssText = 'flex: 1 1 0%; height: 22px; border: 1px solid rgb(24, 144, 255); border-radius: 3px; padding: 0px 4px; font-size: 13px; font-family: inherit; outline: none; box-shadow: rgba(24, 144, 255, 0.2) 0px 0px 0px 2px; margin-left: 2px;';

        // 隐藏 label，插入输入框
        label.style.display = 'none';
        label.parentNode.insertBefore(input, label.nextSibling);
        input.focus();
        input.select();

        var save = function() {
          var newText = input.value.trim();
          if (!newText) newText = oldText;
          label.textContent = newText;
          label.style.display = '';
          input.remove();
        };

        input.addEventListener('blur', save);
        input.addEventListener('keydown', function(ev) {
          if (ev.key === 'Enter') {
            ev.preventDefault();
            input.blur();
          }
          if (ev.key === 'Escape') {
            input.value = oldText;
            input.blur();
          }
        });
      });
    },

    getTree: function(id) {
      return TreeManager.trees[id] || null;
    }
  };

  window.TreeManager = TreeManager;
})();
`;

/**
 * 树形框初始化脚本 — 在 TreeManager 运行时库加载后执行
 */
const TREE_INIT_SCRIPT = `
(function() {
  var treeViewEls = document.querySelectorAll('[data-type="treeView"]');
  treeViewEls.forEach(function(el) {
    var treeId = el.getAttribute('data-tree-id');
    if (treeId && typeof TreeManager !== 'undefined') {
      function buildNodesFromDOM(parentEl) {
        var nodes = [];
        var childNodes = parentEl.querySelectorAll(':scope > .tree-node');
        childNodes.forEach(function(nodeEl) {
          var contentEl = nodeEl.querySelector(':scope > .tree-node-content');
          var labelEl = contentEl ? contentEl.querySelector('.tree-label') : null;
          var childrenEl = nodeEl.querySelector(':scope > .tree-children');
          var toggleEl = contentEl ? contentEl.querySelector('.tree-toggle') : null;
          var checkboxEl = contentEl ? contentEl.querySelector('.tree-node-check') : null;
          var isExpanded = toggleEl && toggleEl.classList.contains('expanded');
          var node = {
            id: nodeEl.getAttribute('data-node-id'),
            text: labelEl ? labelEl.textContent : '',
            expanded: isExpanded,
            checked: checkboxEl ? checkboxEl.checked : false,
            children: []
          };
          if (childrenEl) {
            var childNodesData = buildNodesFromDOM(childrenEl);
            if (childNodesData.length > 0) {
              node.children = childNodesData;
            }
          }
          nodes.push(node);
        });
        return nodes;
      }
      var data = buildNodesFromDOM(el);
      var editable = el.getAttribute('data-editable') === 'true';
      var showIcon = el.getAttribute('data-show-icon') !== 'false';
      var showCheckbox = el.getAttribute('data-show-checkbox') === 'true';
      TreeManager.init({ id: treeId, data: data, editable: editable, showIcon: showIcon, showCheckbox: showCheckbox });
    }
  });
})();
`

/**
 * 多项表格初始化脚本 — 在 DataTableManager 运行时库加载后执行
 */
const DATA_GRID_INIT_SCRIPT = `
(function(){
  document.querySelectorAll('.data-grid-container').forEach(function(container){
    var id = container.getAttribute('data-id') || container.id;
    var columns = JSON.parse(container.getAttribute('data-columns') || '[]');
    var rows = JSON.parse(container.getAttribute('data-rows') || '[]');
    var showCheckbox = container.getAttribute('data-show-checkbox') !== 'false';
    var allowAdd = container.getAttribute('data-allow-add') === 'true';
    var allowDelete = container.getAttribute('data-allow-delete') === 'true';
    var editable = container.getAttribute('data-editable') === 'true';
    var alwaysShowSelection = container.getAttribute('data-always-show-selection') === 'true';
    if (window.DataTableManager && typeof window.DataTableManager.init === 'function'){
      window.DataTableManager.init(id, { columns: columns, rows: rows, showCheckbox: showCheckbox, allowAdd: allowAdd, allowDelete: allowDelete, editable: editable, alwaysShowSelection: alwaysShowSelection });
    }
  });
})();
`

// ================================================================
// 全局基础样式 — 仅保留页面级和真正全局的样式
// 所有控件样式均已移入每个控件的 #id { ... } 块中
// ================================================================

const BASE_STYLES = `
* { margin:0;padding:0;box-sizing:border-box }
html,body { width:100%;height:100%;overflow:hidden;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:transparent }
body { display:flex }

.page-container {
  position:relative;
  overflow:hidden;
  backdrop-filter: blur(24px) !important;
}
.page-container::before {
  content:'';
  position:absolute;
  inset:0;
  z-index:0;
  pointer-events:none;
  background-color: var(--canvas-bg-color);
  opacity: var(--canvas-opacity);
  border-radius: inherit;
}
.page-container.show-shadow {
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

/* 排除所有控件和弹出框的拖拽区域，确保控件可交互 */
.page-container [data-ctrl-type] {
  app-region: no-drag;
}

/* 画布标题栏 */
.canvas-titlebar {
  position:absolute;top:0;left:0;right:0;
  display:flex;align-items:center;height:40px;user-select:none;z-index:10;
}
.canvas-titlebar .tb-left {
  width:40px;display:flex;align-items:center;justify-content:center;flex-shrink:0;
}
.canvas-titlebar .tb-center {
  flex:1;display:flex;align-items:center;min-width:0;
}
.canvas-titlebar .tb-right {
  display:flex;align-items:center;justify-content:flex-end;gap:2px;padding-right:4px;flex-shrink:0;
}
.canvas-titlebar .tb-icon {
  width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:18px;
}
.canvas-titlebar .tb-title {
  font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
.canvas-titlebar .tb-btn {
  width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:none;background:transparent;cursor:default;border-radius:4px;flex-shrink:0;
}
.canvas-titlebar .tb-btn:hover { background:rgba(0,0,0,0.06) }
.canvas-titlebar .tb-btn-min:hover,.tb-btn-max:hover { filter: brightness(1.2)}
.canvas-titlebar .tb-btn-close:hover { background:#e81123;color:#fff }
.canvas-titlebar .tb-btn-min:active,.tb-btn-max:active,.tb-btn-close:active {filter: brightness(0.7);}
.canvas-titlebar .tb-btn-disabled { opacity:0.4;cursor:not-allowed;pointer-events:none; }
.canvas-titlebar .tb-btn-disabled:hover { background:transparent }

/* 毛玻璃效果 */
.page-container.glass-effect {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  --shadow-blur: 10px;
}

/* 所有控件的基础定位（具体 left/top/width/height 在各 #id 块中） */
[data-type] {
  position:absolute;
  box-sizing:border-box;
}

/* 树形框箭头方向（由CSS控制，避免JS覆盖） */
.tree-toggle.expanded::before { content: '▼'; }
.tree-toggle.collapsed::before { content: '▶'; }
.tree-toggle.empty { visibility: hidden; }

/* 右键菜单默认样式 */
.ctx-menu-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99998;
}
.ctx-menu {
  position: fixed;
  z-index: 99999;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.15);
  padding: 4px 0;
  min-width: 160px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
  color: #333333;
}
.ctx-menu-item {
  padding: 7px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  position: relative;
}
.ctx-menu-item:hover {
  background: #e8f4ff;
}
.ctx-menu-item.disabled {
  color: #ccc;
  cursor: not-allowed;
}
.ctx-menu-item.disabled:hover {
  background: transparent;
}
.ctx-menu-separator {
  height: 1px;
  background: #e8e8e8;
  margin: 4px 12px;
}
.ctx-menu-item-icon {
  font-size: 14px;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}
.ctx-menu-item-text {
  flex: 1;
}
.ctx-menu-item-arrow {
  font-size: 10px;
  color: #999;
  margin-left: 24px;
  flex-shrink: 0;
}
.ctx-sub-menu {
  position: absolute;
  left: 100%;
  top: -4px;
  z-index: 100000;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.15);
  padding: 4px 0;
  min-width: 160px;
  display: none;
}
.ctx-sub-menu.left {
  left: auto;
  right: 100%;
}
.ctx-menu-item:hover > .ctx-sub-menu {
  display: block;
}

/* 气泡框默认样式 */
.tt-content {
  background: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  line-height: 1.5;
  max-width: 300px;
  word-wrap: break-word;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}
.tt-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}
.tt-arrow.bottom { border-top-color: #333; }
.tt-arrow.top { border-bottom-color: #333; }
.tt-arrow.right { border-left-color: #333; }
.tt-arrow.left { border-right-color: #333; }
/* 当箭头指向下方时（即 tooltip 在目标上方），箭头应位于 wrapper 底部中央 */
.tt-arrow.bottom {
  bottom: -12px;        /* 6px 边框高度 + 6px 留白，使箭头完全外露 */
  left: 50%;
  transform: translateX(-50%);
  border-top-color: #333;
}

/* 当箭头指向上方时（即 tooltip 在目标下方），箭头应位于 wrapper 顶部中央 */
.tt-arrow.top {
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: #333;
}

/* 当箭头指向右侧时（即 tooltip 在目标左侧），箭头应位于 wrapper 右侧中央 */
.tt-arrow.right {
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #333;
}

/* 当箭头指向左侧时（即 tooltip 在目标右侧），箭头应位于 wrapper 左侧中央 */
.tt-arrow.left {
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #333;
}
`

// ================================================================
// 子样式 CSS 收集（右键菜单 + 气泡框的自定义弹出样式）
// ================================================================

/** 收集所有子样式 CSS 供导出时注入 <style> */
function collectPopupCustomCSS(widgets: Widget[]): string {
  const parts: string[] = []
  function collect(list: Widget[]) {
    for (const w of list) {
      if (w.type === 'contextMenu' && w.contextMenuCSS) {
        parts.push(`/* ${w.id} - contextMenu popup */\n${w.contextMenuCSS}`)
      }
      if (w.type === 'tooltip' && w.tooltipCSS) {
        parts.push(`/* ${w.id} - tooltip popup */\n${w.tooltipCSS}`)
      }
      if (w.children) collect(w.children)
    }
  }
  collect(widgets)
  return parts.join('\n\n')
}

// ================================================================
// 右键菜单配置收集
// ================================================================

function collectContextMenuConfigs(widgets: Widget[]): any[] {
  const configs: any[] = []

  function collect(list: Widget[]) {
    for (const w of list) {
      if (w.type === 'contextMenu' && w.visible !== false) {
        configs.push({
          id: w.id,
          targetId: w.contextMenuTargetId || '',
          trigger: w.contextMenuTrigger || 'contextmenu',
          items: w.contextMenuItems || [],
          customCSS: w.contextMenuCSS || ''
        })
      }
      if (w.children) {
        collect(w.children)
      }
    }
  }

  collect(widgets)
  return configs
}

function collectTooltipConfigs(widgets: Widget[]): any[] {
  const configs: any[] = []

  function collect(list: Widget[]) {
    for (const w of list) {
      if (w.type === 'tooltip' && w.visible !== false) {
        configs.push({
          id: w.id,
          targetId: w.tooltipTargetId || '',
          trigger: w.tooltipTrigger || 'hover',
          position: w.tooltipPosition || 'auto',
          content: w.tooltipContent || '',
          allowHTML: w.tooltipAllowHTML || false,
          showDelay: w.tooltipShowDelay ?? 200,
          hideDelay: w.tooltipHideDelay ?? 100,
          customCSS: w.tooltipCSS || ''
        })
      }
      if (w.children) {
        collect(w.children)
      }
    }
  }

  collect(widgets)
  return configs
}

// ================================================================
// 主导出函数
// ================================================================

/**
 * 计算页面容器宽度
 */
function genPageContainerWidth(canvas: CanvasConfig): string {
  if (canvas.showShadow && canvas.canvasFixedSize) {
    // 固定宽高 + 阴影：宽高各加 10px 以容纳阴影
    return canvas.width + 'px'
  }
  if (canvas.showShadow && !canvas.canvasFixedSize) {
    // 不固定宽高 + 阴影：用 position absolute 撑满，不设固定宽度
    return '100%'
  }
  if (!canvas.showShadow && canvas.canvasFixedSize) {
    // 无阴影 + 固定宽高：精确宽高
    return canvas.width + 'px'
  }
  return '100%'
}

/**
 * 计算页面容器高度
 */
function genPageContainerHeight(canvas: CanvasConfig): string {
  if (canvas.showShadow && canvas.canvasFixedSize) {
    return canvas.height + 'px'
  }
  if (canvas.showShadow && !canvas.canvasFixedSize) {
    return '100%'
  }
  if (!canvas.showShadow && canvas.canvasFixedSize) {
    return canvas.height + 'px'
  }
  return '100%'
}

/**
 * 计算页面容器定位方式
 */
function genPageContainerPosition(canvas: CanvasConfig): string {
  var addStyle = '';
  if(canvas.showShadow){
    addStyle = 'margin:5px;';
    if (!canvas.canvasFixedSize) {
      return addStyle + 'position:absolute;top:5px;left:5px;right:5px;bottom:5px;'
    }
	return addStyle;
  }
  // 其他情况：用 margin 居中
  return ''
}

/**
 * 生成画布标题栏 HTML
 */
/** 生成最小化/最大化按钮 HTML（根据 disableMinimize + canvasFixedSize 联动） */
function genMinMaxButtons(canvas: CanvasConfig, btnColor: string): string {
  const hideBoth = !!(canvas.disableMinimize && canvas.canvasFixedSize)
  const minOnly = !!(canvas.disableMinimize && !canvas.canvasFixedSize)

  let html = ''
  if (!hideBoth) {
    html += `<button class="tb-btn tb-btn-min${minOnly ? ' tb-btn-disabled' : ''}" id="titlebar_min" data-ctrl-type="titlebar_min" data-name="最小化" style="color:${btnColor};${minOnly ? 'opacity:0.35;cursor:not-allowed;pointer-events:none;' : ''}" title="最小化"${minOnly ? ' disabled' : ''}>`
    html += `<svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor"/></svg></button>`
    html += `<button class="tb-btn tb-btn-max${canvas.canvasFixedSize ? ' tb-btn-disabled' : ''}" id="titlebar_max" data-ctrl-type="titlebar_max" data-name="最大化" style="color:${btnColor};${canvas.canvasFixedSize ? 'opacity:0.4;cursor:not-allowed;pointer-events:none;' : ''}" title="最大化"${canvas.canvasFixedSize ? ' disabled' : ''}>`
    html += `<svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></button>`
  }
  return html
}

function genCanvasTitleBarHTML(canvas: CanvasConfig): string {
  const alignMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' }
  const titleAlign = alignMap[canvas.titleBarAlign] || 'flex-start'
  
  const btnColor = canvas.titleBarBtnColor || '#333'
  
  // 图标 HTML
  let iconHTML = ''
  if (canvas.titleBarIconHtml && canvas.titleBarIconHtml.trim()) {
    iconHTML = canvas.titleBarIconHtml.replace(/<script[\s\S]*?<\/script>/gi, '')
  } else {
    const iconName = canvas.titleBarIconName || 'fa-star'
    const cls = iconName.includes(' ') ? iconName : `fas ${iconName}`
    iconHTML = `<i class="${cls}"></i>`
  }

  return `
<div class="canvas-titlebar" id="titlebar" data-name="标题栏" style="
  position:absolute;top:0;left:0;right:0;height:40px;
  background-color:${canvas.titleBarBgColor};
  opacity:${canvas.titleBarOpacity ?? 1};
  border-bottom:1px solid rgba(0,0,0,0.08);
  app-region: drag;
">
  <div class="tb-left"  data-ctrl-type="titlebar_icon">
    <span class="tb-icon" id="titlebar_icon" data-name="图标" style="color:${canvas.titleBarTextColor};">${iconHTML}</span>
  </div>
  <div class="tb-center" style="justify-content:${titleAlign};">
    <span class="tb-title" id="titlebar_title" data-name="标题" data-ctrl-type="titlebar_title" style="color:${canvas.titleBarTextColor}">${esc(canvas.titleBarTitle || '我的应用')}</span>
  </div>
  <div class="tb-right">
    ${genMinMaxButtons(canvas, btnColor)}
    <button class="tb-btn tb-btn-close" id="titlebar_close" data-ctrl-type="titlebar_close" data-name="关闭" style="color:${btnColor};" title="关闭">
      <svg width="10" height="10" viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2"/></svg>
    </button>
  </div>
</div>`
}

/**
 * 生成 Body 背景 CSS（仅在启用且有背景图时生效）
 */
function genBodyBackgroundCSS(canvas: CanvasConfig): string {
  const bg = canvas.bodyBackground
  if (!bg || !bg.enabled) return ''
  const styles: string[] = []
  styles.push(`body {`)
  if (bg.imageUrl) {
    styles.push(`  background-image: url(${bg.imageUrl});`)
    styles.push(`  background-size: ${bg.imageSize || 'cover'};`)
    styles.push(`  background-repeat: ${bg.imageRepeat || 'no-repeat'};`)
    styles.push(`  background-position: ${bg.imagePosition || 'center'};`)
  } else {
    styles.push(`  background-color: transparent;`)
  }
  styles.push(`  margin: 0;`)
  styles.push(`  padding: 0;`)
  styles.push(`  min-height: 100vh;`)
  styles.push(`}`)
  return '\n' + styles.join('\n') + '\n'
}

/**
 * 生成完整的导出 HTML 字符串（每控件独立 CSS，零全局干扰）
 * @param bridgeMode - 'noBridge': 外链 webviewBridge.js（不下载文件）; 'external': 外链并下载; 'inline': 内联脚本内容
 * @param bridgeContent - bridgeMode='inline' 时传入 webviewBridge.js 的完整内容
 */
export function generateCompleteHTML(
  canvas: CanvasConfig,
  widgets: Widget[],
  title: string = 'UI Designer Export',
  bridgeMode: 'noBridge' | 'external' | 'inline' = 'noBridge',
  bridgeContent: string = '',
  messageBoxConfig?: MessageBoxConfig,
  inputBoxConfig?: InputBoxConfig
): string {
  const domParts: string[] = []

  for (const widget of widgets) {
    const html = generateWidgetHTML(widget)
    if (html) domParts.push(html)
  }

  const allCSS = collectAllCSS(widgets)
  const popupCustomCSS = collectPopupCustomCSS(widgets)
  const customWidgetCSS = getAllCustomWidgetCSS()

  const contextMenuConfigs = collectContextMenuConfigs(widgets)
  const contextMenuScript = contextMenuConfigs.length > 0
    ? `<script>
window.__contextMenus = ${JSON.stringify(contextMenuConfigs)};
<\/script>`
    : ''

  const tooltipConfigs = collectTooltipConfigs(widgets)
  const tooltipScript = tooltipConfigs.length > 0
    ? `<script>
window.__tooltips = ${JSON.stringify(tooltipConfigs)};
<\/script>`
    : ''

  const messageBoxScript = messageBoxConfig
    ? `<script>
window.__messageBoxConfig = ${JSON.stringify(messageBoxConfig)};
<\/script>`
    : ''

  const inputBoxScript = inputBoxConfig
    ? `<script>
window.__inputBoxConfig = ${JSON.stringify(inputBoxConfig)};
<\/script>`
    : ''

  // ui-runtime 始终内联（UI交互脚本）
  const runtimeScript = `<script>
${BRIDGE_SCRIPT}
${PROGRESS_RUNTIME}
${LISTBOX_RUNTIME}
${TREE_RUNTIME_SCRIPT}
${DATATABLE_RUNTIME_SCRIPT}
${TREE_INIT_SCRIPT}
${DATA_GRID_INIT_SCRIPT}
<\/script>`

  // webviewBridge.js 根据模式：外链（含/不含下载） / 内联
  let bridgeTag = ''
  if (bridgeMode === 'noBridge' || bridgeMode === 'external') {
    bridgeTag = `<script src="./webviewBridge.js"></script>`
  } else if (bridgeMode === 'inline' && bridgeContent) {
    bridgeTag = `<script>\n${bridgeContent}\n<\/script>`
  }

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
<style data-preview-id="main">
/* === 全局基础样式 === */
${BASE_STYLES}

/* === 弹出菜单/气泡框自定义样式（覆盖 BASE_STYLES 默认值） === */
${popupCustomCSS || '/* 无自定义弹出样式 */'}

/* === 第三方自定义控件样式 === */
${customWidgetCSS || '/* 无自定义控件样式 */'}

/* === Body 背景 === */
${genBodyBackgroundCSS(canvas)}

/* === 页面容器 === */
.page-container {
  width: ${genPageContainerWidth(canvas)};
  height: ${genPageContainerHeight(canvas)};
  background-color: transparent;
  border: ${canvas.borderWidth}px solid ${canvas.borderColor};
  border-radius: ${canvas.borderRadius}px;
  ${canvas.canvasDraggable ? 'app-region: drag;' : ''}
  ${genPageContainerPosition(canvas)}
  box-shadow: 3px 5px 10px rgba(0, 0, 0, 0.1)
}

/* === 画布自定义样式 === */
${canvas.customCSS || ''}

/* === 页面容器 CSS 变量（放在 customCSS 之后，确保不被覆盖） === */
.page-container {
  --canvas-bg-color: ${canvas.backgroundColor};
  --canvas-opacity: ${canvas.opacity ?? 1};
}

/* === 控件独立样式（每控件完整 #id { ... }，互不干扰） === */
${allCSS}
</style>
</head>
<body${(canvas.showShadow || canvas.canvasFixedSize) ? ' style="align-items:center;justify-content:center"' : ''}>
<div class="page-container${canvas.showShadow ? ' show-shadow' : ''}${canvas.glassEffect ? ' glass-effect' : ''}" id="page_container" data-ctrl-type="page" data-name="canvas" data-original-width="${canvas.width}" data-original-height="${canvas.height}">
${canvas.showTitleBar ? genCanvasTitleBarHTML(canvas) : ''}
${domParts.join('\n')}
</div>

${runtimeScript}
${contextMenuScript}
${tooltipScript}
${messageBoxScript}
${inputBoxScript}
${bridgeTag}
</body>
</html>`
}

/**
 * 获取 webviewBridge.js 的完整内容（用于内联模式）
 */
export async function fetchBridgeContent(): Promise<string> {
  try {
    const response = await fetch('/webviewBridge.js')
    if (!response.ok) {
      console.error('[Export] 无法获取 webviewBridge.js:', response.status)
      return ''
    }
    return await response.text()
  } catch (err) {
    console.error('[Export] 获取 webviewBridge.js 失败:', err)
    return ''
  }
}

/**
 * 下载 HTML 文件
 */
export function downloadHTML(htmlString: string, filename: string = 'export.html') {
  const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** 保持对预览窗口的引用，用于实时更新 */
let previewWindowRef: Window | null = null

/**
 * 在新窗口预览 HTML
 * 使用 about:blank + document.write 确保无导航竞态，已打开则刷新内容并切换过去。
 */
export function previewHTML(htmlString: string) {
  // 已有预览窗口且未关闭 → 刷新内容并切换过去
  if (previewWindowRef && !previewWindowRef.closed) {
    previewWindowRef.document.open()
    previewWindowRef.document.write(htmlString)
    previewWindowRef.document.close()
    previewWindowRef.focus()
    return
  }

  // 首次打开新窗口
  const previewWindow = window.open('about:blank', '_blank')
  if (!previewWindow) {
    alert('请允许弹出窗口以预览')
    return
  }

  previewWindow.document.open()
  previewWindow.document.write(htmlString)
  previewWindow.document.close()

  previewWindow.addEventListener('beforeunload', () => {
    previewWindowRef = null
  })

  previewWindowRef = previewWindow
}

/** 检查预览窗口是否打开 */
export function isPreviewOpen(): boolean {
  return previewWindowRef !== null && !previewWindowRef.closed
}

/** 关闭预览窗口 */
export function closePreview() {
  if (previewWindowRef && !previewWindowRef.closed) {
    previewWindowRef.close()
  }
  previewWindowRef = null
}

/**
 * 下载 public 目录下的 JS 文件
 */
export async function downloadRuntimeJS(filename: string = 'webviewBridge.js'): Promise<boolean> {
  try {
    const response = await fetch(`/${filename}`)
    if (!response.ok) {
      console.error(`[Export] 无法获取 ${filename}:`, response.status)
      return false
    }
    const content = await response.text()
    const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  } catch (err) {
    console.error('[Export] 下载 ui-runtime.js 失败:', err)
    return false
  }
}