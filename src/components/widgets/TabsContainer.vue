/**
 * @file TabsContainer.vue
 * @description 标签页容器控件 - 使用 el-tabs，支持子控件渲染和标签页管理
 */
<template>
  <div
    ref="containerRef"
    class="ui-widget tabs-container-widget"
    :class="{ selected: isSelected }"
    :id="widget.id"
    :data-widget-id="widget.id"
    :style="containerStyle"
    @click.stop
  >
    <el-tabs
      v-model="activeTabName"
      type="card"
      class="tabs-container-tabs"
      @tab-click="onTabClick"
    >
      <el-tab-pane
        v-for="(tab, index) in widget.tabs"
        :key="tab.name"
        :label="tab.title"
        :name="tab.name"
      >
        <div
          class="tab-content-area"
          :data-container-type="'tab-content'"
          :data-parent-id="widget.id"
          :data-tab-index="index"
          :style="{ minHeight: tabContentHeight + 'px' }"
        >
          <span v-if="childrenInTab(index).length === 0" class="tab-drop-hint">
            拖放控件到此处
          </span>
          <component
            v-for="child in childrenInTab(index)"
            :key="child.id"
            :is="getWidgetComponent(child.type)"
            :widget="child"
            :is-selected="store.selectedIds.includes(child.id)"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import type { Widget, WidgetType } from '@/types/index'
import { widgetBaseStyle } from '@/utils/widgetStyleUtils'
import { getWidgetComponent as getWidgetFromRegistry } from '@/config/widgetRegistry'

const store = useWidgetStore()

const props = defineProps<{
  widget: Widget
  isSelected: boolean
}>()

const containerRef = ref<HTMLElement | null>(null)

const containerStyle = computed(() => {
  const base = widgetBaseStyle(props.widget)
  const s = props.widget.style as any
  return {
    ...base,
    fontFamily: s.fontFamily || undefined,
    color: s.color || undefined,
    '--tab-header-bg': s.tabHeaderBg || '#f5f5f5',
    '--tab-btn-bg': s.tabBtnBg || '#f5f5f5',
    '--tab-active-bg': s.tabActiveBg || '#ffffff',
    '--tab-active-border-color': s.tabActiveBorderColor || '#1890ff',
    '--tab-header-display': props.widget.hideTabHeader ? 'none' : 'flex',
    '--tab-header-border-bottom': s.tabHeaderBorderBottom || '1px solid #d9d9d9',
    '--tab-item-border-right': s.tabItemBorderRight || '1px solid #d9d9d9',
  } as any
})

/** 计算标签页内容区最小高度（容器高度 - tabs头实测高度） */
const tabContentHeight = computed(() => {
  const store = useWidgetStore()
  const headerH = store.getTabHeaderHeight(props.widget.id)
  return Math.max(50, props.widget.style.height - headerH)
})

/** 获取控件组件（委托给 widgetRegistry） */
function getWidgetComponent(type: WidgetType): any {
  return getWidgetFromRegistry(type)
}

const activeTabName = ref(props.widget.activeTab || (props.widget.tabs && props.widget.tabs[0]?.name) || 'tab1')

watch(activeTabName, (val) => {
  props.widget.activeTab = val
})

watch(() => props.widget.activeTab, (val) => {
  if (val && val !== activeTabName.value) {
    activeTabName.value = val
  }
})

/** 获取指定标签页的子控件 */
function childrenInTab(tabIndex: number): Widget[] {
  if (!props.widget.children) return []
  return props.widget.children.filter(c => c.parentTabIndex === tabIndex)
}

function onTabClick() {
  // 点击标签页头切换到对应标签页
}

/** 测量标签页头部实际高度并存入 store */
function measureHeaderHeight() {
  if (!containerRef.value) return
  const tabContent = containerRef.value.querySelector('.tab-content-area') as HTMLElement | null
  if (!tabContent) return
  const containerRect = containerRef.value.getBoundingClientRect()
  const contentRect = tabContent.getBoundingClientRect()
  const headerHeight = contentRect.top - containerRect.top
  if (headerHeight > 0) {
    const rounded = Math.round(headerHeight)
    props.widget.headerHeight = rounded
    store.setTabHeaderHeight(props.widget.id, rounded)
  }
}

onMounted(() => {
  nextTick(() => {
    measureHeaderHeight()
  })
})

watch(() => props.widget.style.height, () => {
  nextTick(() => {
    measureHeaderHeight()
  })
})

watch(() => props.widget.tabs?.length, () => {
  nextTick(() => {
    measureHeaderHeight()
  })
})
</script>

<style scoped>
.tabs-container-widget {
  position: absolute;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tabs-container-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs-container-tabs :deep(.el-tabs__header) {
  margin: 0;
  height: 32px;
  background-color: var(--tab-header-bg, #f5f5f5);
  border-bottom: var(--tab-header-border-bottom, 1px solid #d9d9d9);
  flex-shrink: 0;
  display: var(--tab-header-display, flex);
}

.tabs-container-tabs :deep(.el-tabs__nav) {
  border: none;
}

.tabs-container-tabs :deep(.el-tabs__nav-wrap) {
  padding: 0;
}

.tabs-container-tabs :deep(.el-tabs__item) {
  font-size: inherit;
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
  border: none;
  border-right: var(--tab-item-border-right, 1px solid #d9d9d9);
  background-color: var(--tab-btn-bg, #f5f5f5);
  color: inherit;
}

.tabs-container-tabs :deep(.el-tabs__item.is-active) {
  background-color: var(--tab-active-bg, #ffffff);
  color: inherit;
  border-bottom: 2px solid var(--tab-active-border-color, #1890ff);
}

.tabs-container-tabs :deep(.el-tabs__content) {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

.tabs-container-tabs :deep(.el-tab-pane) {
  height: 100%;
}

.tab-content-area {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: default;
}

.tab-drop-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ccc;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
}

.tabs-container-widget :deep(.ui-widget) {
  cursor: move;
  box-sizing: border-box;
}
</style>