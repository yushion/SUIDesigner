/**
 * @file ContextMenuWidget.vue
 * @description 右键菜单控件 - 设计区显示虚线边框，仅静态菜单配置，运行时通过 send 通知宿主
 */
<template>
  <div
    class="ui-widget context-menu-widget"
    :class="{ selected: isSelected, disabled: widget.disabled }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="containerStyle"
    @click.stop="$emit('select', $event)"
  >
    <div class="cm-label">
      <span>{{ displayText }}</span>
    </div>
    <div class="cm-hint">右键菜单: <span class="hint-tips">{{ triggerLabel }}</span></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Widget } from '@/types/index'
import { widgetBaseStyle } from '@/utils/widgetStyleUtils'

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

defineEmits<{
  (e: 'select', event: MouseEvent): void
}>()

const triggerMap: Record<string, string> = {
  contextmenu: '右键',
  click: '单击',
  dblclick: '双击',
  mouseenter: '悬停'
}

const triggerLabel = computed(() => {
  return triggerMap[props.widget.contextMenuTrigger || 'contextmenu'] || '右键'
})

const displayText = computed(() => {
  const targetId = props.widget.contextMenuTargetId
  if (!targetId) return '🔓未绑定'
  return '🔒' + targetId
})

const containerStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  return {
    ...base,
    backgroundColor: props.widget.style.backgroundColor || undefined,
  } as any
})
</script>

<style scoped>
.context-menu-widget {
  position: absolute;
  cursor: move;
  user-select: none;
  box-sizing: border-box;
  border: 2px dashed #b0b0b0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  overflow: hidden;
}

.cm-label {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.cm-hint {
  font-size: 11px;
  color: #999;
}

.cm-hint .hint-tips{
  color: #0f667b;
}

</style>