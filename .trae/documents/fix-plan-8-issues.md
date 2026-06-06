# 修复计划：8项控件与交互问题

> **日期**: 2026-06-04  
> **涉及文件**: webviewBridge.js, ssrRenderer.ts, CanvasArea.vue, widgetStore.ts, TreeViewWidget.vue, PropertyPanel.vue, htmlExporter.ts, DataGridWidget.vue

---

## 问题1：树形框箭头方向错误（API触发 vs 手动点击）

### 现状分析
- 在 `public/webviewBridge.js` 第 780-796 行，点击事件处理中直接操作 DOM 切换箭头文字（▶/▼）和 class（expanded/collapsed）
- 在 `src/utils/ssrRenderer.ts` 第 249-263 行，树形框导出 HTML 的箭头由 `node.expanded` 决定初始状态
- 在 `webviewBridge.js` 第 3793-3821 行，`expandNode`/`collapseNode`/`toggleNode` API 也操作箭头文字
- 问题：webviewBridge.js 是桥接文件，不应包含箭头渲染逻辑。JS 直接操作 DOM 可能被页面 CSS 覆盖，导致箭头方向错误

### 修复方案
1. **删除 webviewBridge.js 第 780-796 行**（treeview_node_toggle 点击事件处理中的箭头文字和 class 操作），改为只发送 `send('nodeToggle', ...)` 通知宿主
2. **删除 webviewBridge.js 的 `expandNode`/`collapseNode`/`expandAll`/`collapseAll` 中的箭头文字操作**（`toggle.textContent = '▶'` / `'▼'`），改为只切换 class 和控制 display
3. **在 ssrRenderer.ts 中**：树节点渲染时，箭头文字由 `node.expanded` 决定（`'▼'` 或 `'▶'`），同时给 `.tree-toggle` 添加对应的 CSS class（`expanded` / `collapsed`）
4. **在 webviewBridge.js 的 `expandNode`/`collapseNode` 中**：切换 expanded/collapsed class，CSS 通过 `::before` 伪元素或 `content` 属性控制箭头方向，不再直接写 `textContent`
5. 确保箭头方向由 CSS 控制，而非 JS 直接设置文字内容

### 涉及文件
- `public/webviewBridge.js`：删除第 780-796 行，修改 expandNode/collapseNode/expandAll/collapseAll
- `src/utils/ssrRenderer.ts`：确保 tree-toggle 的 class 和文字由 node.expanded 决定

---

## 问题2：树形框 "始终显示高亮" 点击内部空白处高亮消失

### 现状分析
- 在 `webviewBridge.js` 第 798-816 行，点击树形框内部时：
  - 先清除所有 `.tree-node-content.selected`（第 808-810 行）
  - 再给被点击的节点添加 `.selected`（第 812-813 行）
- 当点击树形框内部空白处（非任何节点）时，`e.target.closest('.tree-node-content')` 返回 null，所以不会添加新选中，但旧的选中已被清除
- 没有检查 `data-always-show-selection` 属性

### 修复方案
在 `webviewBridge.js` 第 808-813 行，修改逻辑：
1. 检查树形框的 `data-always-show-selection` 属性
2. 如果 `alwaysShowSelection` 为 true 且没有点击到具体节点，则不清除已有选中
3. 如果点击到了具体节点，正常切换选中

### 涉及文件
- `public/webviewBridge.js`：修改第 808-813 行逻辑

---

## 问题3：标签页容器 "显示标签头" 属性变更不在预览中生效

### 现状分析
- `PropertyPanel.vue` 第 2529-2533 行：`onHideTabHeaderChange` 通过 `store.updateWidget()` 更新 `hideTabHeader` 属性
- `TabsContainer.vue` 第 107 行：使用 `--tab-header-display` CSS 变量控制标签头显示/隐藏
- `ssrRenderer.ts` 第 228、236 行：使用 `(widget as any).hideTabHeader` 控制是否渲染标签头 HTML
- 问题：`store.updateWidget()` 更新的是 Pinia store 中的 widget 对象，但 SSR 渲染时可能读取的是序列化后的数据，`hideTabHeader` 属性可能丢失

### 修复方案
1. 在 `ssrRenderer.ts` 第 228 行，确保 `hideTabHeader` 属性被正确读取
2. 检查 `widget` 类型定义是否包含 `hideTabHeader` 属性（当前使用 `as any`）
3. 在 `types/index.ts` 中为 `Widget` 接口添加 `hideTabHeader?: boolean` 属性

### 涉及文件
- `src/utils/ssrRenderer.ts`：确保 hideTabHeader 读取正确
- `src/types/index.ts`：添加 hideTabHeader 属性

---

## 问题4：标签页容器 selectTab API 无效

### 现状分析
- `webviewBridge.js` 第 4691-4698 行：`selectTab` 函数找到按钮和面板，移除所有 active class，添加 active class
- 问题：`_deactivateAll`（第 4680-4688 行）只移除 active class，不处理 `display` 样式
- `ssrRenderer.ts` 第 233 行：面板初始 `display` 由内联样式 `style="display:block"` 或 `style="display:none"` 控制
- 切换后，旧面板仍保持 `display:block`，新面板可能还是 `display:none`，导致视觉上未切换

### 修复方案
修改 `webviewBridge.js` 的 `selectTab` 函数（第 4691-4698 行）：
1. 在 `_deactivateAll` 中，将所有面板的 `style.display` 设为 `'none'`
2. 在 `selectTab` 中，将选中面板的 `style.display` 设为 `'block'`
3. 或者在 `_deactivateAll` 中同时处理 class 和 display

### 涉及文件
- `public/webviewBridge.js`：修改 `_deactivateAll` 和 `selectTab`

---

## 问题5：多项表格列名（data-col-key）API 无效

### 现状分析
- `webviewBridge.js` 的 `dataGrid` API 通过 `data-col-key` 属性查找列
- `_getColumns`（第 4120-4128 行）从 `.data-grid-header-cell` 读取 `data-col-key`
- `setCellValue`（第 4194-4201 行）通过 `.data-grid-cell[data-col-key="..."]` 查找单元格
- `addRow`（第 4157-4178 行）通过 `_getColumns` 获取列定义，`_makeRowHtml` 使用 `rowData.cells[columns[j].field]` 获取值
- `ssrRenderer.ts` 第 268、272 行：header 和 data cell 都设置了 `data-col-key`
- 问题排查方向：
  - `_getRows` 返回的是 `NodeList`（通过 `querySelectorAll`），但 `_getRow` 使用数组索引访问，确认正确
  - `_getColumns` 返回 `{ field, index }`，`_makeRowHtml` 使用 `columns[j].width`（undefined，默认 100）
  - 可能问题：`addRow` 调用时 `_getColumns` 返回空数组？需要检查 `.data-grid-header` 是否能被正确找到

### 修复方案
1. 在 `ssrRenderer.ts` 第 268 行：确保 header cell 的 `data-col-key` 与 `widget.columns[].field` 一致
2. 检查 `_getColumns` 中的选择器：`.data-grid-header-cell:not(.data-grid-checkbox)` 是否匹配正确的元素
3. 在 `_makeRowHtml` 中添加调试：如果 columns 为空，新建行也应该有基本结构
4. 确保 `findTarget` 能找到 dataGrid 元素（通过 id 或 data-ctrl-id）

### 涉及文件
- `public/webviewBridge.js`：检查 `_getColumns` 和 `_makeRowHtml` 逻辑
- `src/utils/ssrRenderer.ts`：确保 data-col-key 设置正确

---

## 问题6：8个控制点位置计算错误（无头标签页容器中）

### 现状分析
- `CanvasArea.vue` 第 311-316 行：`getHandleTargetRect()` 使用 `store.getAbsolutePosition()` 计算绝对位置
- `widgetStore.ts` 第 165-189 行：`getAbsolutePosition()` 递归累加父容器位置，对 tabsContainer 子控件会额外加上 `getTabHeaderHeight(parent.id)`
- 问题：当标签页容器隐藏标签头（`hideTabHeader = true`）时，`getTabHeaderHeight` 仍返回缓存的头部高度（非零），导致控制点位置向下偏移约一个标签头高度
- 子控件在隐藏标签头时，其 `style.top` 是相对于内容区顶部（即容器顶部），不需要额外加头部高度

### 修复方案
1. **方案A（推荐-用户建议）**：在 `CanvasArea.vue` 的 `getHandleTargetRect()` 中，改用 DOM 实际位置计算，而非通过 `getAbsolutePosition()` 计算。通过 `document.getElementById(widget.id).getBoundingClientRect()` 获取相对画布的位置，确保位置始终正确
2. **方案B（更精确）**：在 `widgetStore.ts` 的 `getAbsolutePosition()` 中，检查 `parent.hideTabHeader` 是否为 true，如果是则不添加 headerHeight
3. 同时修复 `CanvasArea.vue` 第 466-467 行，拖拽子控件时也需检查 `hideTabHeader`

### 涉及文件
- `src/components/CanvasArea.vue`：修改 `getHandleTargetRect()` 使用 DOM 实际位置
- `src/stores/widgetStore.ts`：修改 `getAbsolutePosition()` 检查 hideTabHeader

---

## 问题7：右键菜单和气泡框的子样式编辑器

### 现状分析
- `PropertyPanel.vue` 中有两个子样式编辑器：
  - 右键菜单：`ctxMenuCSS` ref（第 2600 行），存储在 `ctxActiveTab === 'css'` 时编辑
  - 气泡框：`tooltipCSS` ref（第 1360 行），存储在 `ttActiveTab === 'css'` 时编辑
- 问题：
  - 子样式编辑器的内容目前保存到 `widget.customCSS`（第 2608、2842 行），这会覆盖通过 `cssGenerator` 生成的设计区样式
  - 导出时，`collectContextMenuConfigs` 和 `collectTooltipConfigs` 使用 `w.customCSS`（第 1100、1128 行），但 `customCSS` 是设计区占位符的样式，不是弹出菜单/气泡框的样式
  - 子样式编辑器预览按钮（`ctxMenuPreview`、`tooltipPreview`）正确使用了 `ctxMenuCSS`/`tooltipCSS`，但导出时未使用这些值

### 修复方案
1. **在 `types/index.ts` 中**：为 Widget 添加 `contextMenuCSS?: string` 和 `tooltipCSS?: string` 属性
2. **在 `PropertyPanel.vue` 中**：
   - 将 `ctxMenuCSS` 保存到 `widget.contextMenuCSS`（而非 `widget.customCSS`）
   - 将 `tooltipCSS` 保存到 `widget.tooltipCSS`（而非 `widget.customCSS`）
   - `widget.customCSS` 保留用于设计区占位符样式（由 cssGenerator 生成）
3. **在 `htmlExporter.ts` 中**：
   - `collectContextMenuConfigs` 使用 `w.contextMenuCSS || ''`（而非 `w.customCSS`）
   - `collectTooltipConfigs` 使用 `w.tooltipCSS || ''`（而非 `w.customCSS`）
4. **预览按钮**：`ctxMenuPreview` 和 `tooltipPreview` 已经正确使用本地 ref，检查是否还需要关联到导出时的样式应用

### 涉及文件
- `src/types/index.ts`：添加 contextMenuCSS、tooltipCSS 属性
- `src/components/PropertyPanel.vue`：修改 CSS 存储目标
- `src/utils/htmlExporter.ts`：修改 collectContextMenuConfigs、collectTooltipConfigs

---

## 问题8：气泡框在预览页中样式丢失

### 现状分析
- `webviewBridge.js` 第 1693-1706 行：`createTooltipElement()` 创建 `.tt-wrapper`、`.tt-content`、`.tt-arrow` 三个元素
- `.tt-wrapper` 设置了 `position:fixed;z-index:999999;pointer-events:none;` 内联样式
- 但 `.tt-content` 和 `.tt-arrow` 没有设置任何内联样式
- 在 `webviewBridge.js` 中没有任何全局 CSS 定义 `.tt-content`、`.tt-arrow`、`.tt-wrapper` 的默认样式
- 唯一的样式来源是 `config.customCSS`（第 1803-1807 行），即子样式编辑器的 CSS
- 如果用户没有在子样式编辑器中编写 CSS，气泡框将没有任何视觉样式（透明背景、无文字颜色、无箭头三角形等）

### 修复方案
1. **在 `webviewBridge.js` 的 `createTooltipElement` 中**：为 `.tt-content` 和 `.tt-arrow` 添加默认内联样式
   - `.tt-content`：`background:#333;color:#fff;padding:8px 12px;border-radius:6px;font-size:13px;line-height:1.5;max-width:300px;word-wrap:break-word;box-shadow:0 4px 12px rgba(0,0,0,0.25);`
   - `.tt-arrow`：`position:absolute;width:0;height:0;border:6px solid transparent;`
2. **在 `calcTooltipPosition` 中**：根据箭头方向设置对应的 border-color
   - top: `border-top-color:#333`
   - bottom: `border-bottom-color:#333`
   - left: `border-left-color:#333`
   - right: `border-right-color:#333`
3. **在 `htmlExporter.ts` 中**：导出时内联默认气泡框 CSS，确保即使没有子样式编辑器 CSS，气泡框也有基本外观

### 涉及文件
- `public/webviewBridge.js`：修改 `createTooltipElement` 和 `calcTooltipPosition`
- `src/utils/htmlExporter.ts`：添加默认气泡框样式

---

## 实施顺序

1. 问题7（子样式编辑器）→ 问题1（树形框箭头）→ 问题2（树形框高亮）→ 问题3（标签头显示）→ 问题4（selectTab）→ 问题5（dataGrid列名）→ 问题6（控制点位置）→ 问题8（气泡框样式）

## 验证方式

1. 树形框：通过 API 展开/折叠节点，箭头方向正确；手动点击箭头，方向正确
2. 树形框：设置始终显示高亮，点击树形框内部空白处，高亮不消失
3. 标签页：切换"显示标签头"属性，预览页中标签头正确显示/隐藏
4. 标签页：通过 `tabContainer.selectTab` API 切换标签页，面板正确切换
5. 多项表格：通过 `dataGrid.addRow`、`dataGrid.setCellValue` 等 API 操作，单元格数据正确显示
6. 控制点：选中无头标签页容器中的子控件，8个控制点位置正确
7. 子样式编辑器：编辑的 CSS 只影响弹出菜单/气泡框，不影响设计区占位符
8. 气泡框：预览页中气泡框有完整的默认样式（背景色、文字色、箭头、圆角等）