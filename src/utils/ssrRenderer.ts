/**
 * @file utils/ssrRenderer.ts
 * @description SSR 统一渲染引擎
 *
 * 目标：让设计器画布、预览、导出三个场景使用同一套渲染逻辑。
 *
 * 当前实现（阶段三 - 统一渲染）：
 *   - renderCanvasToString() 作为顶层入口，输出完整画布 HTML（含控件+标题栏+样式）
 *   - renderWidgetToString() 为24种控件生成统一 DOM 结构
 *   - buildInlineStyle() 将 WidgetStyle 转为内联 style 属性
 *   - 通过 htmlExporter 的 genWidgetCompleteCSS 生成 CSS，此处生成 DOM
 *
 * 后续阶段（需重构 CanvasArea 为 props 驱动）：
 *   - 创建 ExportCanvas.vue（props 接收数据，不含交互逻辑）
 *   - 引入 @vue/server-renderer 的 createSSRApp + renderToString
 *   - 完全替代 renderWidgetToString 的直接 HTML 拼接
 */

import type { CanvasConfig, Widget, MessageBoxConfig, InputBoxConfig, TableRow } from '@/types/index'

/**
 * SSR 渲染入口 - 将画布和控件渲染为完整画布区域 HTML
 *
 * @param canvasConfig 画布配置
 * @param widgets 控件列表（含子控件）
 * @param messageBoxConfig 信息框配置
 * @param inputBoxConfig 输入框配置
 * @returns 完整画布区域 HTML 字符串（含标题栏）
 */
export async function renderCanvasToString(
  canvasConfig: CanvasConfig,
  widgets: Widget[],
  messageBoxConfig: MessageBoxConfig,
  inputBoxConfig: InputBoxConfig
): Promise<string> {
  const parts: string[] = []

  // 标题栏
  if (canvasConfig.showTitleBar) {
    parts.push(renderTitleBar(canvasConfig))
  }

  // 控件
  const flatWidgets = flattenWidgets(widgets)
  for (const widget of flatWidgets) {
    if (!widget.visible) continue
    parts.push(renderWidgetToString(widget))
  }

  const widgetHTML = parts.join('\n')

  const canvasStyleAttrs = [
    `position:relative`,
    `width:${canvasConfig.width}px`,
    `height:${canvasConfig.height}px`,
    `background-color:${canvasConfig.backgroundColor || '#ffffff'}`,
    `border:${canvasConfig.borderWidth || 0}px solid ${canvasConfig.borderColor || 'transparent'}`,
    `border-radius:${canvasConfig.borderRadius || 0}px`,
    `overflow:hidden`,
    `opacity:${canvasConfig.masterOpacity ?? 1}`,
    `box-sizing:border-box`,
  ]

  if (canvasConfig.glassEffect) {
    const backdropFilter = (canvasConfig as any).canvasBackdropFilter || 'blur(10px)'
    canvasStyleAttrs.push(`backdrop-filter:${backdropFilter}`)
    canvasStyleAttrs.push(`-webkit-backdrop-filter:${backdropFilter}`)
  }

  return `<div class="page-container" style="${canvasStyleAttrs.join(';')}">${widgetHTML}</div>`
}

/**
 * 渲染标题栏 HTML
 */
function renderTitleBar(config: CanvasConfig): string {
  const barStyle = [
    `display:flex`,
    `align-items:center`,
    `height:32px`,
    `background:${config.titleBarBgColor || '#f3f3f3'}`,
    `opacity:${config.titleBarOpacity ?? 1}`,
    `padding:0 8px`,
    `user-select:none`,
    `position:relative`,
    `z-index:1`,
  ].join(';')

  const titleStyle = [
    `font-size:12px`,
    `color:${config.titleBarTextColor || '#333'}`,
    `text-align:${config.titleBarAlign || 'center'}`,
    `flex:1`,
  ].join(';')

  return `<div class="canvas-titlebar" style="${barStyle}">
    <div class="tb-left"><span class="tb-icon">${config.titleBarIconHtml || config.titleBarIconName || ''}</span></div>
    <div class="tb-center" style="${titleStyle}"><span class="tb-title">${config.titleBarTitle || '我的应用'}</span></div>
    <div class="tb-right">
      <button class="tb-btn"><svg width="10" height="1"><rect width="10" height="1"/></svg></button>
      <button class="tb-btn"><svg width="10" height="10"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></button>
      <button class="tb-btn tb-btn-close"><svg width="10" height="10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2"/></svg></button>
    </div>
  </div>`
}

/**
 * 展平控件列表（含容器子控件）
 */
function flattenWidgets(widgets: Widget[]): Widget[] {
  const result: Widget[] = []
  for (const w of widgets) {
    result.push(w)
    if (w.children && w.children.length > 0) {
      result.push(...flattenWidgets(w.children))
    }
  }
  return result
}

/**
 * 将单个控件渲染为 HTML 字符串（SSR 兼容）
 *
 * 返回带有 id、data-widget-type、data-ctrl-type 等属性的纯静态 HTML
 */
function renderWidgetToString(widget: Widget): string {
  const { id, type } = widget
  const style = widget.styleData?.base || widget.style
  const widgetStyle = buildInlineStyle(style)
  const baseAttrs = `id="${id}" data-widget-type="${type}" data-ctrl-type="${widgetTypeToCtrlType(type)}" data-name="${widget.name || ''}"`
  const styleAttr = `style="${widgetStyle}"`

  switch (type) {
    case 'button':
      return `<button ${baseAttrs} ${styleAttr} title="${sanitizeAttr(widget.text || '')}">${widget.text || '按钮'}</button>`

    case 'input':
      return `<input ${baseAttrs} ${styleAttr} type="${widget.inputType || 'text'}" placeholder="${sanitizeAttr(widget.placeholder || '')}" value="${sanitizeAttr(widget.value || '')}" />`

    case 'checkbox':
      return `<label ${baseAttrs} ${styleAttr}><input type="checkbox" ${widget.checked ? 'checked' : ''} /><span>${widget.labelText || ''}</span></label>`

    case 'toggle':
      return `<label ${baseAttrs} ${styleAttr}><input type="checkbox" ${widget.checked ? 'checked' : ''} /><span class="slider"></span></label>`

    case 'label':
      return `<span ${baseAttrs} ${styleAttr}>${widget.text || ''}</span>`

    case 'divider': {
      const dividerLineStyle = (style as any).lineStyle || 'solid'
      const dividerBorderColor = (style as any).borderColor || '#D0D0D0'
      const dividerHeight = style.height || 1
      return `<div ${baseAttrs} ${styleAttr}><hr style="width:100%;border:none;border-top:${dividerHeight}px ${dividerLineStyle} ${dividerBorderColor};margin:0;" /></div>`
    }

    case 'hyperlink': {
      const href = sanitizeAttr(widget.href || '#')
      const text = widget.text || '链接'
      // 根据 showUnderline 构建 style，避免 styleData.base 中的 textDecoration 默认值覆盖用户设置
      const linkStyle = { ...style, textDecoration: widget.showUnderline !== false ? 'underline' : 'none' }
      const linkStyleStr = buildInlineStyle(linkStyle)
      return `<a ${baseAttrs} style="${linkStyleStr}" href="javascript:void(0)" data-href="${href}">${text}</a>`
    }

    case 'textarea':
      return `<textarea ${baseAttrs} ${styleAttr} placeholder="${sanitizeAttr(widget.placeholder || '')}">${sanitizeAttr(widget.value || '')}</textarea>`

    case 'comboBox': {
      const opts = (widget.options || []).map((o: string) =>
        `<option value="${sanitizeAttr(o)}">${o}</option>`
      ).join('')
      return `<select ${baseAttrs} ${styleAttr}>${opts}</select>`
    }

    case 'radioGroup': {
      const layout = widget.layout || 'vertical'
      const flexDir = layout === 'horizontal' ? 'display:flex;gap:8px;' : ''
      const radios = (widget.options || []).map((opt: string, i: number) =>
        `<label class="radiogroup-item"><input type="radio" name="${id}" ${i === widget.selectedIndex ? 'checked' : ''} ${widget.disabled ? 'disabled' : ''} />${opt}</label>`
      ).join('')
      return `<div ${baseAttrs} ${styleAttr}><div style="${flexDir}">${radios}</div></div>`
    }

    case 'progressBar': {
      const pct = widget.progressValue ?? 50
      const barColor = (style as any).barColor || '#0078d4'
      const barRadius = style.borderRadius || 0
      const showText = widget.showProgressText !== false
      const isDraggable = !!(widget as any).draggable
      const thumbHtml = isDraggable ? `<div class="progress-thumb" style="position:absolute;left:calc(${pct}% - 11px);top:50%;transform:translateY(-50%);width:22px;height:22px;border-radius:50%;background:#fff;border:2px solid ${barColor};box-shadow:0 1px 6px rgba(0,0,0,0.3);z-index:3;cursor:pointer;"></div>` : ''
      const textHtml = showText ? `<span class="progress-text" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:inherit;pointer-events:none;white-space:nowrap;">${pct}%</span>` : ''
      const draggableAttr = isDraggable ? ` data-draggable="true"` : ''
      return `<div ${baseAttrs} ${styleAttr}${draggableAttr} class="progress-bar-container" style="overflow:visible;"><div class="progress-fill" style="width:${pct}%;height:100%;background:${barColor};border-radius:${barRadius}px;transition:width 0.15s;"></div>${thumbHtml}${textHtml}</div>`
    }

    case 'datetimePicker':
      return `<input ${baseAttrs} ${styleAttr} type="datetime-local" value="${sanitizeAttr(widget.value || '')}" />`

    case 'logOutput': {
      const logLines = (widget.logs || []).map((l: any) =>
        `<div class="log-line" style="padding:2px 4px;color:${l.color || '#333'};font-size:12px;border-bottom:1px solid #eee;">${sanitizeAttr(l.text)}</div>`
      ).join('')
      return `<div ${baseAttrs} ${styleAttr} style="overflow-y:auto;">${logLines}</div>`
    }

    case 'iconButton': {
      const iconHtml = widget.iconHtml || ''
      const iconName = widget.iconName || ''
      const position = widget.iconPosition || 'left'
      const text = widget.text || ''
      const iconEl = iconHtml
        ? `<span class="icon-custom">${iconHtml}</span>`
        : (iconName ? `<i class="${iconName}"></i>` : '')
      const textEl = text ? `<span>${text}</span>` : ''
      const inner = position === 'right' ? `${textEl}${iconEl}` : `${iconEl}${textEl}`
      return `<button ${baseAttrs} ${styleAttr}>${inner}</button>`
    }

    case 'imageBox': {
      const fit = widget.fit || 'cover'
      return `<div ${baseAttrs} ${styleAttr}><img src="${sanitizeAttr(widget.src || '')}" style="width:100%;height:100%;object-fit:${fit};object-position:${widget.objectPosition || 'center'};" alt="" /></div>`
    }

    case 'cardBox': {
      const hdrColor = (widget.style as any).headerColor || widget.headerColor || (style as any).headerColor || '#f5f5f5'
      const hdrTitleColor = (widget.style as any).headerTitleColor || (widget as any).headerTitleColor || (style as any).headerTitleColor || '#1E1F22'
      const hdrTitle = widget.headerTitle || ''
      const hdrFontSize = style.fontSize || 13
      return `<div ${baseAttrs} ${styleAttr}>
        <div class="card-header" style="display:flex;align-items:center;padding:0 12px;height:32px;background:${hdrColor};user-select:none;border-bottom:1px solid #e8e8e8;">
          <span class="card-header-title" style="font-size:${hdrFontSize}px;font-weight:600;color:${hdrTitleColor};">${sanitizeAttr(hdrTitle)}</span>
        </div>
        <div class="card-body" style="position:relative;overflow:hidden;"></div>
      </div>`
    }

    case 'tabsContainer': {
      const tabs = widget.tabs || []
      const hideHeader = widget.hideTabHeader === true
      const tabHeaders = tabs.map((t: any, idx: number) =>
        `<button class="tab-header-btn${(t.name === widget.activeTab || (!widget.activeTab && idx === 0)) ? ' active' : ''}" data-ctrl-type="tab_btn" data-tab-name="${sanitizeAttr(t.name)}" style="padding:6px 16px;border:none;background:transparent;cursor:pointer;font-size:13px;">${sanitizeAttr(t.title || t.name)}</button>`
      ).join('')
      const tabPanes = tabs.map((t: any, idx: number) =>
        `<div class="tab-pane${(t.name === widget.activeTab || (!widget.activeTab && idx === 0)) ? ' active' : ''}" data-tab-name="${sanitizeAttr(t.name)}" style="display:${(t.name === widget.activeTab || (!widget.activeTab && idx === 0)) ? 'block' : 'none'};"></div>`
      ).join('')
      return `<div ${baseAttrs} ${styleAttr}>
        ${hideHeader ? '' : `<div class="tab-header-bar" style="display:flex;border-bottom:1px solid #e5e5e5;">${tabHeaders}</div>`}
        <div class="tab-content-wrapper" style="position:relative;overflow:hidden;">${tabPanes}</div>
      </div>`
    }

    case 'listBox': {
      const items = widget.items || []
      const listItems = items.map((item: any) =>
        `<div class="list-item${item.selected ? ' item-selected' : ''}" style="padding:6px 10px;cursor:pointer;display:flex;align-items:center;gap:6px;">${widget.showCheckbox ? '<input type="checkbox" class="list-item-checkbox" />' : ''}<span class="list-item-text">${sanitizeAttr(item.text || '')}</span></div>`
      ).join('')
      return `<div ${baseAttrs} ${styleAttr}><div class="list-box-scroll" style="overflow-y:auto;height:100%;">${listItems || '<div class="list-empty" style="padding:20px;text-align:center;color:#999;">暂无数据</div>'}</div></div>`
    }

    case 'treeView': {
      const renderNodes = (nodes: any[]): string => {
        return nodes.map(node => `
          <div class="tree-node" style="padding-left:16px;">
            <div class="tree-node-content${node.selected ? ' selected' : ''}" style="display:flex;align-items:center;gap:4px;padding:4px 6px;cursor:pointer;">
              <span class="tree-toggle ${node.children?.length ? 'expanded' : 'empty'}" style="width:16px;text-align:center;"></span>
              ${widget.treeShowCheckbox ? '<input type="checkbox" class="tree-checkbox" />' : ''}
              <span class="tree-icon">${node.icon || ''}</span>
              <span class="tree-label">${sanitizeAttr(node.text)}</span>
            </div>
            ${node.children?.length ? `<div class="tree-children">${renderNodes(node.children)}</div>` : ''}
          </div>
        `).join('')
      }
      return `<div ${baseAttrs} ${styleAttr} style="overflow-y:auto;">${renderNodes(widget.treeNodes || [])}</div>`
    }

    case 'dataGrid': {
      const cols = widget.columns || []
      const hdrCells = cols.map((c, i) => `<div class="data-grid-header-cell" data-col-key="${sanitizeAttr(c.field || 'col' + (i + 1))}" style="flex:1;padding:6px 8px;font-weight:600;border-right:1px solid #e0e0e0;">${sanitizeAttr(c.header || '')}</div>`).join('')
      const rows = ((widget.rows || []) as TableRow[]).map((row: any, idx: number) => {
        const cells = cols.map((c, j) => {
          const val = (row.cells && row.cells[c.field] !== undefined) ? String(row.cells[c.field]) : ''
          return `<div class="data-grid-cell" data-col-key="${sanitizeAttr(c.field || 'col' + (j + 1))}" style="flex:1;padding:4px 8px;border-right:1px solid #eee;">${sanitizeAttr(val)}</div>`
        }).join('')
        return `<div class="data-grid-row" style="display:flex;border-bottom:1px solid #eee;">${cells}</div>`
      }).join('')
      return `<div ${baseAttrs} ${styleAttr} style="overflow-y:auto;">
        <div class="data-grid-header" style="display:flex;background:#fafafa;border-bottom:2px solid #e0e0e0;">${hdrCells}</div>
        <div class="data-grid-body">${rows}</div>
      </div>`
    }

    case 'contextMenu':
      return `<!-- 右键菜单（静默控件，由事件触发显示） --><div ${baseAttrs} ${styleAttr}></div>`

    case 'tooltip':
      return `<!-- 气泡框（静默控件，由事件触发显示） --><div ${baseAttrs} ${styleAttr}></div>`

    case 'messageBox':
      return `<!-- 信息提示框（全局控件，通过 messageBoxConfig 配置） --><div ${baseAttrs} ${styleAttr}></div>`

    case 'inputBox':
      return `<!-- 输入框（全局控件，通过 inputBoxConfig 配置） --><div ${baseAttrs} ${styleAttr}></div>`

    default:
      return `<div ${baseAttrs} ${styleAttr}></div>`
  }
}

/**
 * 将 WidgetStyle 转换为内联 style 属性字符串
 */
function buildInlineStyle(style: Record<string, any>): string {
  const props: string[] = []

  if (style.left !== undefined) props.push(`left:${style.left}px`)
  if (style.top !== undefined) props.push(`top:${style.top}px`)
  if (style.width !== undefined) props.push(`width:${style.width}px`)
  if (style.height !== undefined) props.push(`height:${style.height}px`)
  if (style.zIndex !== undefined) props.push(`z-index:${style.zIndex}`)
  if (style.backgroundColor) props.push(`background-color:${style.backgroundColor}`)
  if (style.color) props.push(`color:${style.color}`)
  if (style.fontSize !== undefined) props.push(`font-size:${style.fontSize}px`)
  if (style.fontFamily) props.push(`font-family:${style.fontFamily}`)
  if (style.fontWeight) props.push(`font-weight:${style.fontWeight}`)
  if (style.textAlign) props.push(`text-align:${style.textAlign}`)
  if (style.textDecoration) props.push(`text-decoration:${style.textDecoration}`)
  if (style.borderColor) props.push(`border-color:${style.borderColor}`)
  if (style.borderWidth !== undefined) props.push(`border-width:${style.borderWidth}px`)
  if (style.borderStyle) props.push(`border-style:${style.borderStyle}`)
  if (style.borderRadius !== undefined) props.push(`border-radius:${style.borderRadius}px`)
  if (style.padding !== undefined) props.push(`padding:${style.padding}px`)
  if (style.margin !== undefined) props.push(`margin:${style.margin}px`)
  if (style.opacity !== undefined) props.push(`opacity:${style.opacity}`)
  if (style.boxShadow) props.push(`box-shadow:${style.boxShadow}`)
  if (style.cursor) props.push(`cursor:${style.cursor}`)
  if (style.minWidth !== undefined) props.push(`min-width:${style.minWidth}px`)
  if (style.minHeight !== undefined) props.push(`min-height:${style.minHeight}px`)

  props.push('box-sizing:border-box')
  props.push('position:absolute')

  if (style.visible === false) props.push('display:none')

  return props.join(';')
}

/**
 * WidgetType → data-ctrl-type 映射
 */
function widgetTypeToCtrlType(type: string): string {
  const map: Record<string, string> = {
    button: 'button',
    input: 'input_text',
    checkbox: 'checkbox',
    toggle: 'switch_toggle',
    comboBox: 'combobox',
    label: 'label',
    divider: 'divider',
    hyperlink: 'hyperlink',
    textarea: 'textarea',
    radioGroup: 'radio_group',
    progressBar: 'progress_bar',
    datetimePicker: 'datetime_picker',
    logOutput: 'logbox',
    iconButton: 'icon_button',
    imageBox: 'imagebox',
    cardBox: 'cardbox',
    tabsContainer: 'tab_container',
    listBox: 'listbox',
    treeView: 'treeview',
    dataGrid: 'datagrid',
    contextMenu: 'context_menu',
    tooltip: 'tooltip',
    messageBox: 'message_box',
    inputBox: 'input_box',
  }
  return map[type] || type
}

/**
 * HTML 属性值防注入转义
 */
function sanitizeAttr(val: string): string {
  return String(val).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}