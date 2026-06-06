/**
 * @file CardBoxWidget.vue
 * @description 卡片框容器控件 - 带可选标题栏，可包含任意子控件
 */
<template>
  <div
    class="ui-widget card-box-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="containerStyle"
    @click.stop
  >
    <div
      v-if="widget.showHeader !== false"
      class="card-header"
      :style="{ backgroundColor: (widget.style as any).headerColor || widget.headerColor || '#f5f5f5' }"
    >
      <span class="card-header-title" :style="headerTitleStyle">{{ widget.headerTitle || '卡片标题' }}</span>
      <span
        v-if="widget.collapsible"
        class="card-collapse-btn"
        :style="collapseBtnStyle"
        @mousedown.stop
        @click.stop="toggleCollapse"
      >
        <svg v-if="widget.collapsed" width="12" height="12" viewBox="0 0 12 12">
          <path d="M4.5 3L7.5 6L4.5 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 12 12">
          <path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <div
      v-show="!isCollapsed"
      class="card-body"
      :data-container-type="'card-body'"
      :data-parent-id="widget.id"
      :style="{ height: bodyHeight }"
    >
      <span v-if="!widget.children || widget.children.length === 0" class="card-drop-hint">
        拖放控件到此处
      </span>
      <component
        v-for="child in widget.children || []"
        :key="child.id"
        :is="getWidgetComponent(child.type)"
        :widget="child"
        :is-selected="store.selectedIds.includes(child.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import { widgetBaseStyle } from '@/utils/widgetStyleUtils'
import type { Widget, WidgetType } from '@/types/index'
import { getWidgetComponent as getWidgetFromRegistry } from '@/config/widgetRegistry'

const store = useWidgetStore()

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

const containerStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  return {
    ...base,
    height: isCollapsed.value ? '32px' : (props.widget.style.height + 'px'),
  } as any
})

const isCollapsed = computed(() => {
  return !!(props.widget.collapsible && props.widget.collapsed)
})

const bodyHeight = computed(() => {
  if (props.widget.showHeader === false) return '100%'
  return `calc(100% - 32px)`
})

const headerTitleStyle = computed(() => {
  const s = props.widget.style as any
  return {
    fontSize: s.fontSize ? s.fontSize + 'px' : undefined,
    fontFamily: s.fontFamily || undefined,
    color: s.headerTitleColor || s.color || '#333',
    textAlign: (s.textAlign || undefined) as any
  }
})

const collapseBtnStyle = computed(() => {
  const s = props.widget.style as any
  return {
    color: s.collapseBtnColor || '#888'
  }
})

/** 获取控件组件（委托给 widgetRegistry） */
function getWidgetComponent(type: WidgetType): any {
  return getWidgetFromRegistry(type)
}

function toggleCollapse() {
  store.updateWidget(props.widget.id, { collapsed: !props.widget.collapsed } as any)
  store.saveState()
}
</script>

<style scoped>
.card-box-widget {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
}

.card-box-widget:hover:not(.selected) {
  border-color: #b0b0b0;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 32px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  user-select: none;
}

.card-header-title {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-collapse-btn {
  margin-left: auto;
  cursor: pointer;
  color: #888;
  padding: 0 4px;
  user-select: none;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.card-collapse-btn:hover {
  color: #333;
}

.card-body {
  position: relative;
  width: 100%;
  overflow: hidden;
  cursor: default;
  flex: 1;
}

.card-drop-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ccc;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
}

.card-box-widget :deep(.ui-widget) {
  cursor: move;
  box-sizing: border-box;
}
</style>