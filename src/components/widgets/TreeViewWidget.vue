/**
 * @file TreeViewWidget.vue
 * @description 树形控件 - WINUI 3 风格，支持递归展开/折叠、双击编辑
 */
<template>
  <div
    class="ui-widget tree-view-widget"
    :class="{ selected: isSelected, disabled: widget.disabled }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="containerStyle"
    @click.stop
  >
    <div class="tree-scroll">
      <TreeNodeItem
        v-for="node in widget.treeNodes || []"
        :key="node.id"
        :node="node"
        :level="0"
        :widget="widget"
        :selected-node-id="selectedNodeId"
        :editing-node-id="editingNodeId"
        :edit-text="editText"
        :indent-width="20"
        :show-checkbox="widget.treeShowCheckbox === true"
        @toggle="onToggleNode"
        @select="onSelectNode"
        @start-edit="onStartEdit"
        @save-edit="onSaveEdit"
        @cancel-edit="onCancelEdit"
        @update-edit-text="editText = $event"
        @node-check="onNodeCheck"
      />
      <div v-if="!widget.treeNodes || widget.treeNodes.length === 0" class="tree-empty">
        暂无数据
      </div>
    </div>
    <div v-if="widget.disabled" class="disabled-overlay"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import type { Widget, TreeNode } from '@/types/index'
import { widgetBaseStyle } from '@/utils/widgetStyleUtils'

const store = useWidgetStore()

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

/** 当前选中的节点ID */
const selectedNodeId = ref<string | null>(null)
/** 正在编辑的节点ID */
const editingNodeId = ref<string | null>(null)
/** 编辑中的文本 */
const editText = ref('')

/** 容器样式 */
const containerStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  const s = props.widget.style as any
  return {
    ...base,
    color: s.color || undefined,
    fontFamily: s.fontFamily || undefined,
    fontSize: s.fontSize ? s.fontSize + 'px' : undefined,
    '--tree-selected-bg': s.treeSelectedBg || '#e0edff',
    '--tree-toggle-color': s.treeToggleColor || '#666',
    '--tree-row-hover-bg': s.treeRowHoverBg || '#f3f3f3',
  } as any
})

/**
 * 递归查找并切换节点的展开状态
 */
function findAndToggleNode(nodes: TreeNode[], nodeId: string): boolean {
  for (const node of nodes) {
    if (node.id === nodeId) {
      node.expanded = !node.expanded
      return true
    }
    if (node.children && node.children.length > 0) {
      if (findAndToggleNode(node.children, nodeId)) return true
    }
  }
  return false
}

/**
 * 递归查找节点
 */
function findNodeById(nodes: TreeNode[], nodeId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, nodeId)
      if (found) return found
    }
  }
  return null
}

/**
 * 切换节点展开/折叠
 */
function onToggleNode(nodeId: string) {
  if (!props.widget.treeNodes) return
  findAndToggleNode(props.widget.treeNodes, nodeId)
  store.saveState()
}

/**
 * 选中节点
 */
function onSelectNode(nodeId: string) {
  selectedNodeId.value = nodeId
}

/**
 * 开始编辑节点
 */
function onStartEdit(nodeId: string, text: string) {
  if (!props.widget.treeEditable) return
  editingNodeId.value = nodeId
  editText.value = text
}

/**
 * 保存节点编辑
 */
function onSaveEdit(nodeId: string) {
  if (editingNodeId.value !== nodeId) return
  const newText = editText.value.trim()
  if (newText && props.widget.treeNodes) {
    const node = findNodeById(props.widget.treeNodes, nodeId)
    if (node) {
      node.text = newText
      store.saveState()
    }
  }
  editingNodeId.value = null
  editText.value = ''
}

/**
 * 取消节点编辑
 */
function onCancelEdit() {
  editingNodeId.value = null
  editText.value = ''
}

/**
 * 递归设置节点及其所有子节点的勾选状态
 */
function setCheckedRecursive(nodes: TreeNode[], nodeId: string, checked: boolean): boolean {
  for (const node of nodes) {
    if (node.id === nodeId) {
      node.checked = checked
      if (node.children) {
        node.children.forEach(child => setAllCheckedRecursive(child, checked))
      }
      return true
    }
    if (node.children && node.children.length > 0) {
      if (setCheckedRecursive(node.children, nodeId, checked)) return true
    }
  }
  return false
}

/**
 * 递归设置节点及其所有子节点为指定勾选状态（不查找，直接设置）
 */
function setAllCheckedRecursive(node: TreeNode, checked: boolean) {
  node.checked = checked
  if (node.children) {
    node.children.forEach(child => setAllCheckedRecursive(child, checked))
  }
}

/**
 * 节点复选框变更（级联勾选）
 */
function onNodeCheck(nodeId: string, checked: boolean) {
  if (!props.widget.treeNodes) return
  setCheckedRecursive(props.widget.treeNodes, nodeId, checked)
  store.saveState()
}
</script>

<script lang="ts">
import { defineComponent, h, PropType } from 'vue'

/**
 * 递归树节点组件
 * 渲染单个树节点及其展开后的子节点
 */
export const TreeNodeItem = defineComponent({
  name: 'TreeNodeItem',
  props: {
    node: { type: Object as PropType<TreeNode>, required: true },
    level: { type: Number, default: 0 },
    widget: { type: Object as PropType<Widget>, required: true },
    selectedNodeId: { type: String as PropType<string | null>, default: null },
    editingNodeId: { type: String as PropType<string | null>, default: null },
    editText: { type: String, default: '' },
    indentWidth: { type: Number, default: 20 },
    showCheckbox: { type: Boolean, default: false }
  },
  emits: ['toggle', 'select', 'startEdit', 'saveEdit', 'cancelEdit', 'updateEditText', 'nodeCheck'],
  setup(props, { emit }) {
    return () => {
      const hasChildren = props.node.children && props.node.children.length > 0
      const isExpanded = props.node.expanded && hasChildren
      const isSelected = props.selectedNodeId === props.node.id
      const isEditing = props.editingNodeId === props.node.id
      const indentPx = props.level * props.indentWidth

      const rowChildren = []

      if (props.showCheckbox) {
        rowChildren.push(h('span', {
          class: 'tree-checkbox-v',
          style: { width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }
        }, [
          h('input', {
            type: 'checkbox',
            class: 'tree-node-check-v',
            checked: props.node.checked || false,
            style: { margin: '0', width: '14px', height: '14px', cursor: 'pointer', accentColor: '#1890ff' },
            onClick(event: MouseEvent) { event.stopPropagation() },
            onChange(event: Event) {
              emit('nodeCheck', props.node.id, (event.target as HTMLInputElement).checked)
            }
          })
        ]))
      }

      if (hasChildren) {
        rowChildren.push(h('span', {
          class: 'tree-toggle' + (isExpanded ? ' expanded' : ''),
          style: { width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', cursor: 'pointer', fontSize: '10px', color: (props.widget.style as any).treeToggleColor || '#666' },
          onClick(event: MouseEvent) {
            event.stopPropagation()
            emit('toggle', props.node.id)
          }
        }, '▶'))
      } else {
        rowChildren.push(h('span', {
          class: 'tree-toggle-placeholder',
          style: { width: '16px', height: '16px', display: 'inline-block', flexShrink: '0' }
        }))
      }

      if (props.widget.treeShowIcon) {
        rowChildren.push(h('span', {
          class: 'tree-icon',
          style: { width: '16px', height: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', marginLeft: '2px', fontSize: '13px' }
        }, props.node.icon || (hasChildren ? (isExpanded ? '📂' : '📁') : '📄')))
      }

      const textStyle: Record<string, string> = {
        flex: '1',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        marginLeft: (props.widget.treeShowIcon ? '2px' : '4px')
      }

      if (isEditing) {
        rowChildren.push(h('input', {
          class: 'tree-edit-input',
          value: props.editText,
          style: {
            flex: '1',
            height: '22px',
            border: '1px solid #1890ff',
            borderRadius: '3px',
            padding: '0 4px',
            fontSize: '13px',
            fontFamily: 'inherit',
            outline: 'none',
            boxShadow: '0 0 0 2px rgba(24, 144, 255, 0.2)',
            marginLeft: '2px'
          },
          onClick(event: MouseEvent) { event.stopPropagation() },
          onInput(event: Event) {
            emit('updateEditText', (event.target as HTMLInputElement).value)
          },
          onKeydown(event: KeyboardEvent) {
            if (event.key === 'Enter') {
              emit('saveEdit', props.node.id)
            } else if (event.key === 'Escape') {
              emit('cancelEdit')
            }
          },
          onBlur() {
            emit('saveEdit', props.node.id)
          }
        }))
      } else {
        rowChildren.push(h('span', {
          class: 'tree-node-text',
          style: textStyle
        }, props.node.text))
      }

      const row = h('div', {
        class: 'tree-node-row' + (isSelected ? ' selected' : ''),
        style: { paddingLeft: (indentPx + 4) + 'px' },
        onClick() {
          emit('select', props.node.id)
        },
        onDblclick() {
          emit('startEdit', props.node.id, props.node.text)
        }
      }, rowChildren)

      const wrapperChildren = [row]

      if (isExpanded) {
        const childNodes = props.node.children!.map(child =>
          h(TreeNodeItem, {
            key: child.id,
            node: child,
            level: props.level + 1,
            widget: props.widget,
            selectedNodeId: props.selectedNodeId,
            editingNodeId: props.editingNodeId,
            editText: props.editText,
            indentWidth: props.indentWidth,
            showCheckbox: props.showCheckbox,
            onToggle(nodeId: string) { emit('toggle', nodeId) },
            onSelect(nodeId: string) { emit('select', nodeId) },
            onStartEdit(nodeId: string, text: string) { emit('startEdit', nodeId, text) },
            onSaveEdit(nodeId: string) { emit('saveEdit', nodeId) },
            onCancelEdit() { emit('cancelEdit') },
            onUpdateEditText(val: string) { emit('updateEditText', val) },
            onNodeCheck(nodeId: string, checked: boolean) { emit('nodeCheck', nodeId, checked) }
          })
        )
        wrapperChildren.push(h('div', { class: 'tree-node-children' }, childNodes))
      }

      return h('div', { class: 'tree-node-wrapper' }, wrapperChildren)
    }
  }
})
</script>

<style scoped>
.tree-view-widget {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tree-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.tree-node-wrapper {
  user-select: none;
}

.tree-node-row {
  display: flex;
  align-items: center;
  height: 28px;
  padding-right: 8px;
  cursor: pointer;
  transition: background-color 0.08s ease;
  border-radius: 4px;
  margin: 1px 4px;
}

.tree-node-row:hover {
  background-color: var(--tree-row-hover-bg, #f3f3f3);
}

.tree-node-row.selected {
  background-color: var(--tree-selected-bg, #e0edff);
}

.tree-toggle {
  transition: transform 0.15s ease;
  border-radius: 4px;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tree-toggle:hover {
  background-color: #e0e0e0;
  color: #333;
}

.tree-toggle.expanded {
  color: #333;
}

.tree-node-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.tree-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 13px;
}

.disabled-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}


</style>