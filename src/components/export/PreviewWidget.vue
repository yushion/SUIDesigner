<!--
  PreviewWidget.vue - 纯展示组件，渲染单个控件
  使用与设计区相同的 widget.style 生成内联样式
  仅用于 SSR 导出预览，无交互逻辑
-->
<template>
  <div
    v-if="widget.visible"
    :id="widget.id"
    :style="widgetInlineStyle"
    :data-type="widget.type"
    :data-ctrl-type="widget.type"
    :data-name="widget.name || widget.text || widget.id"
  >
    <template v-if="widget.type === 'button'">
      {{ widget.text || '按钮' }}
    </template>
    <template v-else-if="widget.type === 'input'">
      <input
        class="pw-input"
        type="text"
        :value="widget.value || ''"
        :placeholder="widget.placeholder || '请输入...'"
        :style="innerInputStyle"
        :disabled="widget.disabled"
      />
    </template>
    <template v-else-if="widget.type === 'checkbox'">
      <label class="cb-wrap" :style="checkboxLabelStyle">
        <input
          type="checkbox"
          :checked="widget.checked"
          :disabled="widget.disabled"
          :style="checkboxInputStyle"
        />
        <span>{{ widget.labelText || '选项' }}</span>
      </label>
    </template>
    <template v-else-if="widget.type === 'toggle'">
      <span class="tg-track" :style="toggleTrackStyle">
        <span class="tg-knob" :style="toggleKnobStyle"></span>
      </span>
    </template>
    <template v-else-if="widget.type === 'comboBox'">
      <select
        class="pw-select"
        :style="comboBoxSelectStyle"
        :disabled="widget.disabled"
      >
        <option
          v-for="(opt, i) in (widget.options || ['选项1', '选项2', '选项3'])"
          :key="i"
          :value="opt"
          :selected="i === (widget.selectedIndex ?? 0)"
        >{{ opt }}</option>
      </select>
    </template>
    <template v-else-if="widget.type === 'label'">
      {{ widget.text || '标签' }}
    </template>
    <template v-else-if="widget.type === 'divider'">
      <hr :style="dividerLineStyle" />
    </template>
    <template v-else-if="widget.type === 'hyperlink'">
      <a class="hl-text" href="javascript:void(0)" :data-href="widget.href || '#'" :style="hyperlinkTextStyle">{{ widget.text || '超链接' }}</a>
    </template>
    <template v-else-if="widget.type === 'textarea'">
      <textarea
        class="pw-textarea"
        :value="widget.value || ''"
        :placeholder="widget.placeholder || ''"
        :style="innerInputStyle"
        :disabled="widget.disabled"
      ></textarea>
    </template>
    <template v-else-if="widget.type === 'radioGroup'">
      <label
        v-for="(opt, i) in (widget.options || ['选项1', '选项2'])"
        :key="i"
        class="rg-item"
        :style="radioLabelStyle"
      >
        <input
          type="radio"
          :name="'rg-' + widget.id"
          :value="opt"
          :checked="i === (widget.selectedIndex ?? 0)"
          :disabled="widget.disabled"
          :style="radioInputStyle"
        />
        <span>{{ opt }}</span>
      </label>
    </template>
    <template v-else-if="widget.type === 'tabsContainer'">
      <div v-if="!widget.hideTabHeader" class="tab-header-bar" :style="tabHeaderBarStyle">
        <span
          v-for="(tab, i) in (widget.tabs || [{ name: 'tab1', title: '标签1' }])"
          :key="i"
          class="tab-header-btn"
          data-ctrl-type="tab_btn"
          :data-tab-name="tab.name"
          :class="{ active: tab.name === (widget.activeTab || (widget.tabs?.[0]?.name || 'tab1')) }"
          :style="tabBtnStyle(i)"
        >{{ tab.title || tab.name }}</span>
      </div>
      <div class="tab-content-wrapper">
        <div
          v-for="(tab, i) in (widget.tabs || [{ name: 'tab1', title: '标签1' }])"
          :key="i"
          class="tab-pane"
          :data-tab-name="tab.name"
          :class="{ active: tab.name === (widget.activeTab || (widget.tabs?.[0]?.name || 'tab1')) }"
        >
          <PreviewWidget
            v-for="child in tabChildren(i)"
            :key="child.id"
            :widget="child"
          />
        </div>
      </div>
    </template>
    <template v-else-if="widget.type === 'progressBar'">
      <span class="progress-fill" :style="progressFillStyle"></span>
      <span class="progress-text" :style="progressTextStyle">{{ widget.progressValue ?? 0 }}%</span>
    </template>
    <template v-else-if="widget.type === 'datetimePicker'">
      <input
        class="pw-input"
        type="date"
        :value="widget.value || ''"
        :style="innerInputStyle"
        :disabled="widget.disabled"
      />
    </template>
    <template v-else-if="widget.type === 'logOutput'">
      <span
        v-for="(log, i) in (widget.logs || [])"
        :key="i"
        class="log-line"
        :style="{ color: log.color || '#333' }"
      >{{ log.text }}</span>
    </template>
    <template v-else-if="widget.type === 'iconButton'">
      <span v-if="widget.iconHtml && widget.iconPosition !== 'right'" v-html="safeIcon"></span>
      <span v-else-if="widget.iconName && widget.iconPosition !== 'right'" class="ib-icon">
        <i :class="widget.iconName.includes(' ') ? widget.iconName : 'fas ' + widget.iconName"></i>
      </span>
      <span v-if="widget.text && widget.iconPosition !== 'icon-only'" class="ib-text">{{ widget.text }}</span>
      <span v-if="widget.iconHtml && widget.iconPosition === 'right'" v-html="safeIcon"></span>
      <span v-else-if="widget.iconName && widget.iconPosition === 'right'" class="ib-icon">
        <i :class="widget.iconName.includes(' ') ? widget.iconName : 'fas ' + widget.iconName"></i>
      </span>
    </template>
    <template v-else-if="widget.type === 'imageBox'">
      <img v-if="widget.src" :src="widget.src" :style="imageStyle" alt="" />
    </template>
    <template v-else-if="widget.type === 'cardBox'">
      <div v-if="widget.showHeader !== false" class="card-header" :style="cardHeaderStyle">
        <span class="card-header-title" :style="cardTitleStyle">{{ widget.headerTitle || '卡片标题' }}</span>
      </div>
      <div class="card-body" :style="cardBodyStyle">
        <PreviewWidget
          v-for="child in (widget.children || [])"
          :key="child.id"
          :widget="child"
        />
      </div>
    </template>
    <template v-else-if="widget.type === 'listBox'">
      <div class="list-box-scroll" :style="listScrollStyle">
        <template v-if="(widget.items || []).length === 0">
          <span class="list-empty">暂无数据</span>
        </template>
        <span
          v-for="(item, i) in (widget.items || [])"
          :key="i"
          class="list-item"
          :class="{ 'item-selected': item.selected }"
          :style="listItemStyle"
        >
          <span v-if="widget.showCheckbox" class="list-item-check">☐</span>
          <span class="list-item-text">{{ item.text }}</span>
        </span>
      </div>
    </template>
    <template v-else-if="widget.type === 'treeView'">
      <div v-for="(node, ni) in (widget.treeNodes || [{ id: 'node1', label: '节点1', icon: '　' }])" :key="ni">
        <div class="tree-node" :data-node-id="node.id" :style="{ paddingLeft: ((node.level || 0) * 16) + 'px' }">
          <div class="tree-node-content">
            <span class="tree-toggle" :class="(node.children && node.children.length > 0) ? (node.isExpanded ? 'expanded' : 'collapsed') : 'empty'">{{ (node.children && node.children.length > 0) ? (node.isExpanded ? '▼' : '▶') : '' }}</span>
            <span class="tree-icon" :style="{ marginRight: '4px' }">{{ node.icon || '　' }}</span>
            <span class="tree-label">{{ node.label || node.name || '节点' }}</span>
          </div>
          <div v-if="node.children && node.children.length > 0" class="tree-children" :style="{ display: node.isExpanded ? 'block' : 'none' }">
            <div v-for="(child, ci) in node.children" :key="ni + '_' + ci" class="tree-node" :data-node-id="child.id" :style="{ paddingLeft: ((node.level || 0) + 1) * 16 + 'px' }">
              <div class="tree-node-content">
                <span class="tree-toggle" :class="(child.children && child.children.length > 0) ? (child.isExpanded ? 'expanded' : 'collapsed') : 'empty'">{{ (child.children && child.children.length > 0) ? (child.isExpanded ? '▼' : '▶') : '' }}</span>
                <span class="tree-icon" :style="{ marginRight: '4px' }">{{ child.icon || '　' }}</span>
                <span class="tree-label">{{ child.label || child.name || '子节点' }}</span>
              </div>
              <div v-if="child.children && child.children.length > 0" class="tree-children" :style="{ display: child.isExpanded ? 'block' : 'none' }">
                <div v-for="(gc, gi) in child.children" :key="ni + '_' + ci + '_' + gi" class="tree-node" :data-node-id="gc.id" :style="{ paddingLeft: ((node.level || 0) + 2) * 16 + 'px' }">
                  <div class="tree-node-content">
                    <span class="tree-toggle" :class="(gc.children && gc.children.length > 0) ? (gc.isExpanded ? 'expanded' : 'collapsed') : 'empty'">{{ (gc.children && gc.children.length > 0) ? (gc.isExpanded ? '▼' : '▶') : '' }}</span>
                    <span class="tree-icon" :style="{ marginRight: '4px' }">{{ gc.icon || '　' }}</span>
                    <span class="tree-label">{{ gc.label || gc.name || '三级节点' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="widget.type === 'dataGrid'">
      <div class="data-grid-header" :style="gridHeaderStyle">
        <span
          v-for="col in (widget.columns || [])"
          :key="col.field"
          class="data-grid-header-cell"
          :data-col-key="col.field"
          :style="{ width: (col.width || 100) + 'px' }"
        >{{ col.header }}</span>
      </div>
      <div class="data-grid-body">
        <div
          v-for="(row, ri) in (Array.isArray(widget.rows) ? widget.rows : [])"
          :key="ri"
          class="data-grid-row"
          :data-row-index="ri"
        >
          <span
            v-for="col in (widget.columns || [])"
            :key="col.field"
            class="data-grid-cell"
            :data-col-key="col.field"
            :style="{ width: (col.width || 100) + 'px' }"
          >{{ row.cells?.[col.field] ?? '' }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '@/types/index'

const props = defineProps<{
  widget: Widget
}>()

const style = computed(() => props.widget.style)

const safeIcon = computed(() => {
  const html = props.widget.iconHtml
  if (html && html.trim()) return html.replace(/<script[\s\S]*?<\/script>/gi, '')
  return ''
})

const widgetInlineStyle = computed<any>(() => {
  const s = style.value
  const st: Record<string, string | number> = {
    position: 'absolute',
    boxSizing: 'border-box',
    left: (s.left ?? 0) + 'px',
    top: (s.top ?? 0) + 'px',
    width: (s.width ?? 0) + 'px',
    height: (s.height ?? 0) + 'px',
    zIndex: s.zIndex ?? 1
  }

  if (s.backgroundColor) st.backgroundColor = s.backgroundColor
  if (s.color) st.color = s.color
  if (s.fontSize !== undefined) st.fontSize = s.fontSize + 'px'
  if (s.fontFamily) st.fontFamily = s.fontFamily
  if (s.fontWeight) st.fontWeight = s.fontWeight
  if (s.textAlign) st.textAlign = s.textAlign
  if (s.textDecoration) st.textDecoration = s.textDecoration
  if (s.borderColor) st.borderColor = s.borderColor
  if (s.borderWidth !== undefined) st.borderWidth = s.borderWidth + 'px'
  if (s.borderStyle) st.borderStyle = s.borderStyle
  if (s.borderRadius !== undefined) st.borderRadius = s.borderRadius + 'px'
  if (s.padding !== undefined) st.padding = s.padding + 'px'
  if (s.margin !== undefined) st.margin = s.margin + 'px'
  if (s.opacity !== undefined) st.opacity = s.opacity
  if (s.boxShadow) st.boxShadow = s.boxShadow
  if (s.cursor) st.cursor = s.cursor

  if (!props.widget.visible) st.display = 'none'
  if (props.widget.disabled) st.opacity = 0.6

  switch (props.widget.type) {
    case 'button':
      st.display = 'inline-flex'
      st.alignItems = 'center'
      st.justifyContent = 'center'
      st.border = 'none'
      st.cursor = 'pointer'
      st.whiteSpace = 'nowrap'
      st.userSelect = 'none'
      if (!s.backgroundColor) st.backgroundColor = '#0078d4'
      if (!s.color) st.color = '#ffffff'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.borderRadius) st.borderRadius = '4px'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      break
    case 'input':
      if (!s.borderColor) st.border = '1px solid #ddd'
      if (!s.borderRadius) st.borderRadius = '4px'
      if (!s.backgroundColor) st.backgroundColor = '#fff'
      if (!s.color) st.color = '#333'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      st.display = 'flex'
      st.alignItems = 'center'
      st.overflow = 'hidden'
      break
    case 'checkbox':
      st.display = 'inline-flex'
      st.alignItems = 'center'
      st.gap = '6px'
      if (!s.fontSize) st.fontSize = '14px'
      if (!s.color) st.color = '#333'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      st.cursor = 'pointer'
      st.userSelect = 'none'
      break
    case 'toggle':
      st.display = 'inline-block'
      st.cursor = 'pointer'
      st.userSelect = 'none'
      break
    case 'comboBox':
      st.display = 'flex'
      st.alignItems = 'center'
      st.justifyContent = 'space-between'
      st.userSelect = 'none'
      if (!s.borderColor) st.border = '1px solid #ddd'
      if (!s.borderRadius) st.borderRadius = '3px'
      if (!s.backgroundColor) st.backgroundColor = '#fff'
      if (!s.color) st.color = '#1E1F22'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      st.overflow = 'hidden'
      break
    case 'label':
      st.overflow = 'hidden'
      st.whiteSpace = 'nowrap'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.color) st.color = '#1E1F22'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      break
    case 'divider':
      st.display = 'flex'
      st.alignItems = 'center'
      break
    case 'hyperlink':
      if (!s.color) st.color = '#0078d4'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      st.cursor = 'pointer'
      st.overflow = 'hidden'
      st.userSelect = 'none'
      break
    case 'textarea':
      if (!s.borderColor) st.border = '1px solid #ddd'
      if (!s.borderRadius) st.borderRadius = '4px'
      if (!s.backgroundColor) st.backgroundColor = '#fff'
      if (!s.color) st.color = '#333'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      st.overflow = 'hidden'
      break
    case 'radioGroup':
      st.display = 'flex'
      st.flexDirection = props.widget.layout === 'horizontal' ? 'row' : 'column'
      st.gap = '4px'
      st.userSelect = 'none'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      if (props.widget.layout === 'horizontal') st.flexWrap = 'wrap'
      break
    case 'tabsContainer':
      st.display = 'flex'
      st.flexDirection = 'column'
      st.userSelect = 'none'
      if (!s.borderColor) st.border = '1px solid #d9d9d9'
      if (!s.borderRadius) st.borderRadius = '4px'
      st.overflow = 'hidden'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      if (!s.backgroundColor) st.backgroundColor = '#fff'
      break
    case 'progressBar':
      if (!s.backgroundColor) st.backgroundColor = '#E0E0E0'
      if (!s.borderRadius) st.borderRadius = '24px'
      st.overflow = 'hidden'
      st.position = 'absolute'
      break
    case 'datetimePicker':
      st.display = 'flex'
      st.alignItems = 'center'
      if (!s.borderColor) st.border = '1px solid #ddd'
      if (!s.borderRadius) st.borderRadius = '4px'
      if (!s.backgroundColor) st.backgroundColor = '#fff'
      if (!s.color) st.color = '#333'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      break
    case 'logOutput':
      if (!s.backgroundColor) st.backgroundColor = '#f8f8f8'
      if (!s.borderColor) st.border = '1px solid #ddd'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.color) st.color = '#333'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      st.overflowX = 'auto'
      st.overflowY = 'auto'
      st.whiteSpace = 'nowrap'
      break
    case 'iconButton':
      st.display = 'inline-flex'
      st.alignItems = 'center'
      st.justifyContent = 'center'
      st.gap = '6px'
      st.border = 'none'
      st.cursor = 'pointer'
      st.whiteSpace = 'nowrap'
      st.userSelect = 'none'
      if (!s.backgroundColor) st.backgroundColor = '#0078d4'
      if (!s.color) st.color = '#ffffff'
      if (!s.fontSize) st.fontSize = '13px'
      if (!s.borderRadius) st.borderRadius = '4px'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      break
    case 'imageBox':
      st.overflow = 'hidden'
      break
    case 'cardBox':
      if (!s.borderColor) st.border = '1px solid #d9d9d9'
      if (!s.borderRadius) st.borderRadius = '6px'
      st.overflow = 'hidden'
      st.display = 'flex'
      st.flexDirection = 'column'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      if (!s.boxShadow) st.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
      break
    case 'listBox':
      if (!s.borderColor) st.border = '1px solid #d9d9d9'
      if (!s.borderRadius) st.borderRadius = '6px'
      st.overflow = 'hidden'
      st.display = 'flex'
      st.flexDirection = 'column'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      break
    case 'treeView':
      if (!s.borderColor) st.border = '1px solid #d9d9d9'
      if (!s.borderRadius) st.borderRadius = '6px'
      st.overflow = 'hidden'
      if (!s.backgroundColor) st.backgroundColor = '#ffffff'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      break
    case 'dataGrid':
      st.display = 'flex'
      st.flexDirection = 'column'
      st.userSelect = 'none'
      if (!s.borderColor) st.border = '1px solid #d9d9d9'
      if (!s.borderRadius) st.borderRadius = '4px'
      st.overflow = 'hidden'
      if (!s.backgroundColor) st.backgroundColor = '#fff'
      if (!s.fontFamily) st.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      break
  }

  return st
})

const comboDisplayText = computed(() => {
  const opts = props.widget.options || ['选项1', '选项2', '选项3']
  const idx = props.widget.selectedIndex ?? 0
  return opts[idx] || opts[0] || ''
})

const checkboxBoxStyle = computed<any>(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  border: '1px solid #999',
  borderRadius: '2px',
  fontSize: '12px',
  color: props.widget.checked ? '#0078d4' : 'transparent',
  backgroundColor: props.widget.checked ? '#fff' : 'transparent',
  flexShrink: 0
}))

const toggleTrackStyle = computed<any>(() => {
  const h = style.value.height || 24
  const halfH = Math.round(h / 2)
  const trackColor = (style.value as any).trackColor || '#cccccc'
  const activeTrackColor = (style.value as any).activeTrackColor || '#0078d4'
  return {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: props.widget.checked ? activeTrackColor : trackColor,
    borderRadius: halfH + 'px',
    transition: 'background-color 0.3s'
  }
})

const toggleKnobStyle = computed<any>(() => {
  const h = style.value.height || 24
  const knobColor = (style.value as any).knobColor || '#ffffff'
  return {
    position: 'absolute',
    height: 'calc(100% - 4px)',
    width: 'calc(50% - 4px)',
    left: props.widget.checked ? 'calc(50% + 2px)' : '2px',
    bottom: '2px',
    backgroundColor: knobColor,
    borderRadius: '50%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    transition: 'left 0.3s'
  }
})

const dividerLineStyle = computed(() => {
  const ls = (style.value as any).lineStyle || 'solid'
  const bc = style.value.borderColor || '#D0D0D0'
  return {
    width: '100%',
    border: 'none',
    borderTop: `${style.value.height}px ${ls} ${bc}`,
    margin: 0
  }
})

const hyperlinkTextStyle = computed(() => ({
  textDecoration: props.widget.showUnderline !== false ? 'underline' : 'none'
}))

const radioStyle = computed(() => {
  return (i: number) => ({
    display: 'inline-block',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid ' + (i === (props.widget.selectedIndex ?? 0) ? '#0078d4' : '#999'),
    backgroundColor: i === (props.widget.selectedIndex ?? 0) ? '#0078d4' : 'transparent',
    flexShrink: 0
  })
})

const tabHeaderBarStyle = computed(() => {
  const tabHeaderBg = (style.value as any).tabHeaderBg || '#f5f5f5'
  return {
    display: 'flex',
    flexShrink: 0,
    background: tabHeaderBg,
    borderBottom: '1px solid #d9d9d9'
  }
})

const tabBtnStyle = computed(() => {
  const tabBtnBg = (style.value as any).tabBtnBg || '#f5f5f5'
  const tabActiveBg = (style.value as any).tabActiveBg || '#ffffff'
  const tabActiveBorderColor = (style.value as any).tabActiveBorderColor || '#1890ff'
  return (i: number) => {
    const tabs = props.widget.tabs || [{ name: 'tab1', title: '标签1' }]
    const activeName = props.widget.activeTab || tabs[0]?.name || 'tab1'
    const isActive = tabs[i]?.name === activeName
    return {
      padding: '0 12px',
      height: '34px',
      lineHeight: '34px',
      border: 'none',
      borderRight: '1px solid #d9d9d9',
      cursor: 'pointer',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      background: isActive ? tabActiveBg : tabBtnBg,
      color: 'inherit',
      borderBottom: isActive ? `2px solid ${tabActiveBorderColor}` : 'none',
      flexShrink: 0
    }
  }
})

function tabChildren(tabIndex: number) {
  return (props.widget.children || []).filter(c => c.parentTabIndex === tabIndex)
}

const progressFillStyle = computed<any>(() => {
  const pct = props.widget.progressValue ?? 0
  const barColor = (style.value as any).barColor || '#0078D4'
  return {
    position: 'absolute',
    left: '0',
    top: '0',
    height: '100%',
    width: pct + '%',
    background: barColor,
    borderRadius: (style.value.borderRadius || 24) + 'px',
    transition: 'width 0.2s'
  }
})

const progressTextStyle = computed<any>(() => {
  const valueColor = (style.value as any).valueColor || '#ffffff'
  return {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: 'inherit',
    color: valueColor,
    textShadow: '0 0 2px rgba(0, 0, 0, 0.5)',
    pointerEvents: 'none'
  }
})

const imageStyle = computed<any>(() => {
  const fit = props.widget.fit || 'cover'
  return {
    width: '100%',
    height: '100%',
    objectFit: fit,
    objectPosition: props.widget.objectPosition || 'center',
    display: 'block'
  }
})

const cardHeaderStyle = computed(() => {
  const cardHeaderBg = (style.value as any).headerColor || '#f5f5f5'
  return {
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    height: '32px',
    backgroundColor: cardHeaderBg,
    borderBottom: '1px solid #e8e8e8',
    flexShrink: 0
  }
})

const cardTitleStyle = computed<any>(() => {
  const cardHeaderTitleColor = (style.value as any).headerTitleColor || '#333333'
  return {
    flex: 1,
    minWidth: 0,
    fontSize: (style.value.fontSize || 13) + 'px',
    fontWeight: 600,
    color: cardHeaderTitleColor,
    fontFamily: style.value.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: style.value.textAlign || 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})

const cardBodyStyle = computed(() => ({
  position: 'relative' as const,
  width: '100%',
  height: props.widget.showHeader !== false ? 'calc(100% - 32px)' : '100%',
  overflow: 'hidden'
}))

const listScrollStyle = computed(() => ({
  flex: 1,
  overflowY: 'auto' as const,
  overflowX: 'hidden' as const
}))

const listItemStyle = computed(() => {
  const itemFontSize = (style.value.fontSize || 13) + 'px'
  const itemColor = (style.value as any).itemColor || style.value.color || '#333333'
  return {
    display: 'flex',
    alignItems: 'center',
    height: '32px',
    padding: '0 10px',
    cursor: 'pointer',
    fontSize: itemFontSize,
    color: itemColor,
    borderBottom: '1px solid #f0f0f0',
    gap: '8px'
  }
})

const treeNodeStyle = computed<any>(() => {
  const treeFontSize = (style.value.fontSize || 13) + 'px'
  return {
    display: 'flex',
    alignItems: 'center',
    padding: '3px 10px',
    cursor: 'pointer',
    fontSize: treeFontSize,
    gap: '4px',
    userSelect: 'none'
  }
})

const gridHeaderStyle = computed(() => {
  const gridHeaderBg = (style.value as any).gridHeaderBg || '#f0f0f0'
  return {
    display: 'flex',
    background: gridHeaderBg,
    borderBottom: '1px solid #d9d9d9',
    flexShrink: 0
  }
})

// ======== 真实表单元素样式 ========
const innerInputStyle = computed<any>(() => {
  const s = style.value
  return {
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: s.color || '#333',
    fontSize: (s.fontSize || 13) + 'px',
    fontFamily: s.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '0 8px',
    boxSizing: 'border-box',
    resize: 'none'
  }
})

const comboBoxSelectStyle = computed<any>(() => {
  const s = style.value
  return {
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    background: 'transparent',
    backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '12px',
    paddingRight: '28px',
    color: s.color || '#333',
    fontSize: (s.fontSize || 13) + 'px',
    fontFamily: s.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '0 28px 0 8px',
    boxSizing: 'border-box'
  }
})

const checkboxLabelStyle = computed<any>(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: (style.value.fontSize || 14) + 'px',
  color: style.value.color || '#333',
  fontFamily: style.value.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  userSelect: 'none'
}))

const checkboxInputStyle = computed<any>(() => ({
  width: '16px',
  height: '16px',
  cursor: 'pointer',
  flexShrink: 0,
  margin: 0
}))

const radioLabelStyle = computed<any>(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  fontSize: (style.value.fontSize || 13) + 'px',
  fontFamily: style.value.fontFamily || "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  userSelect: 'none'
}))

const radioInputStyle = computed<any>(() => ({
  width: '16px',
  height: '16px',
  cursor: 'pointer',
  flexShrink: 0,
  margin: 0
}))
</script>