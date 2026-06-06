# 重写 htmlExporter.ts 导出逻辑

## 摘要

当前导出方案使用 Vue SSR（PreviewCanvas.vue + PreviewWidget.vue）渲染控件，导致：
- 所有控件被 `<div>` 包裹，破坏了 webviewBridge.js 期望的原生 HTML 元素结构
- 内联样式泛滥，CSS 臃肿混乱
- SSR 与 CSS 生成两条路径导致样式不一致
- 预览控件无法与桥接 JS 交互

需要重写为原项目的方案：每个控件类型生成原生 HTML 元素（`<button>`、`<input>`、`<select>` 等），CSS 全部集中在 `#id` 选择器中，零内联样式。

## 当前状态分析

### 原项目（D:\phpstudy_pro\WWW\_UIDesigner\src\utils\htmlExporter.ts）
- 每个控件类型有独立的 `genXxx(widget)` 函数生成原生 HTML
- `dataAttrs()` 统一生成 `id`、`data-type`、`data-ctrl-type`、`data-name` 等属性
- `widgetTypeToCtrlType()` 映射控件类型 → webviewBridge.js 期望的 `data-ctrl-type` 值
- CSS 全部在 `genWidgetCompleteCSS(widget)` 生成 `#id { ... }` 块
- `parseCustomCSS()` 解析自定义 CSS 为 baseProps 和子规则
- `BASE_STYLES` 仅含页面级全局样式
- 内置运行时脚本（BRIDGE_SCRIPT、LISTBOX_RUNTIME、TREE_RUNTIME、DATATABLE_RUNTIME）
- 标题栏按钮内联颜色（来自 canvas 配置），其余样式用 CSS 类

### 当前项目（d:\phpstudy_pro\WWW\__UIDesigner\src\utils\htmlExporter.ts）
- 使用 `renderPreviewCanvas()` SSR 渲染 → PreviewCanvas.vue + PreviewWidget.vue
- PreviewWidget 将所有控件包裹在 `<div>` 中，内联样式来自 `widgetInlineStyle`
- CSS 通过 `collectAllCSS()` → `genWidgetCompleteCSS()` 生成
- 两条路径（SSR 内联 + CSS 样式表）导致样式冲突
- `mergeDeduplicateCSS` 和 `prettyFormatHTML` 有已知 bug

### webviewBridge.js 依赖
- 通过 `data-ctrl-type` 属性识别控件类型（如 `button`、`input_text`、`combobox`、`listbox_item` 等）
- 通过 `id` 属性定位控件
- 通过 `data-name` 获取控件名称
- 期望控件是原生 HTML 元素（用于 `closest()` 查找、`tagName` 判断等）

## 改动方案

### 文件：`src/utils/htmlExporter.ts` — 完全重写

以原项目 `htmlExporter.ts` 为蓝本，完全重写，保留以下改进：

1. **`titleBarBtnColor`** — 标题栏按钮颜色使用独立属性而非 `titleBarTextColor`
2. **`bodyBackground` 无颜色** — 导出的 body 背景仅根据 `bodyBackground.imageUrl` 判断
3. **`user-select: none`** — 操作型控件添加此属性
4. **预览窗口智能更新** — 保留 `previewWindowRef` 复用逻辑
5. **`fetchBridgeContent` / `downloadRuntimeJS`** — 保留

#### 重写内容：

**A. 工具函数**
- `esc()` — HTML 转义
- `widgetTypeToCtrlType()` — 26 个控件类型映射（原项目完整版）
- `dataAttrs()` — 生成所有 `data-*` 属性

**B. CSS 生成（genWidgetCompleteCSS）**
- 定位/尺寸/盒模型（`position: absolute; left/top/width/height/z-index`）
- 默认视觉样式（按控件类型 switch）
- 样式面板属性合并（`visualMap` → `setLineProp`）
- 自定义 CSS 解析（`parseCustomCSS`）
- 子选择器/伪类（按控件类型 switch）
- 添加 `user-select: none` 到操作型控件

**C. HTML 生成（各 genXxx 函数）**
- `genButton` → `<button id="..." data-ctrl-type="button" ...>text</button>`
- `genInput` → `<input type="text" id="..." ... />`
- `genCheckbox` → `<label id="..." ...><input type="checkbox" ... /><span>text</span></label>`
- `genToggle` → `<label id="..." ...><input type="checkbox" ... /><span class="toggle-slider"></span></label>`
- `genComboBox` → `<select id="..." ...><option>...</option></select>`
- `genLabel` → `<span id="..." ...>text</span>`
- `genDivider` → `<div id="..." ...></div>`
- `genHyperlink` → `<a id="..." ... href="javascript:void(0)" data-href="...">text</a>`
- `genDateTimePicker` → `<input type="datetime-local" id="..." ... />`
- `genTextarea` → `<textarea id="..." ...>value</textarea>`
- `genRadioGroup` → `<div id="..." class="radiogroup-container"><label class="radiogroup-item"><input type="radio" ... />text</label></div>`
- `genProgressBar` → `<div id="..." class="progress-bar-container"><div class="progress-fill" style="width:X%"></div><span class="progress-text">X%</span></div>`
- `genCanvas` → `<div id="..." class="canvas-box">...</div>`
- `genLogOutput` → `<div id="..." class="log-output-container"><div class="log-line" style="color:...">text</div></div>`
- `genIconButton` → `<button id="..." ...><i class="fas fa-star"></i><span>text</span></button>`
- `genImageBox` → `<div id="..." class="image-box"><img src="..." /></div>`
- `genCardBox` → 包含 header + collapse-btn + card-body + children
- `genListBox` → 包含 list-box-scroll + list-item + checkbox
- `genTreeView` → 递归生成 tree-node + tree-node-content + tree-toggle + tree-icon + tree-label
- `genDataGrid` → 包含 data-grid-header + data-grid-body + rows
- `genTabsContainer` → 包含 tab-header-bar + tab-header-btn + tab-content-wrapper + tab-pane + children

**D. 运行时脚本**
- `BRIDGE_SCRIPT` — 标签页切换 + 卡片框折叠
- `LISTBOX_RUNTIME` — 列表框增删改
- `TREE_RUNTIME_SCRIPT` — 树形框交互（从 ui-runtime.ts import）
- `DATATABLE_RUNTIME_SCRIPT` — 多项表格交互（从 ui-runtime.ts import）
- `TREE_INIT_SCRIPT` — 树形框初始化
- `DATA_GRID_INIT_SCRIPT` — 多项表格初始化

**E. 全局基础样式（BASE_STYLES）**
- 保留原项目的完整 BASE_STYLES（含所有控件子选择器样式）
- 添加 `[data-ctrl-type] { app-region: no-drag }` 排除拖拽区域
- 标题栏按钮样式（含 hover/active/disabled）
- 右键菜单样式
- 毛玻璃效果

**F. 主导出函数（generateCompleteHTML）**
- 参数：canvas, widgets, title, bridgeMode, bridgeContent, messageBoxConfig, inputBoxConfig
- 遍历 widgets 调用 `generateWidgetHTML` 生成 DOM
- 收集 contextMenu/tooltip 配置
- 生成完整 HTML 字符串（含 CSS、DOM、脚本）

**G. 保留函数**
- `fetchBridgeContent()` — 获取 webviewBridge.js 内容
- `downloadHTML()` — 下载 HTML 文件
- `previewHTML()` — 预览窗口管理（含智能更新）
- `isPreviewOpen()` / `closePreview()` — 预览窗口状态
- `downloadRuntimeJS()` — 下载运行时 JS

### 文件：`src/utils/ssrExporter.ts` — 标记废弃

SSR 导出不再使用，保留文件但移除导出逻辑引用。App.vue 中调用 `generateCompleteHTML` 不再需要 SSR 依赖。

### 文件：`src/components/App.vue` — 更新导出调用

移除 `renderPreviewCanvas` 的 import，直接使用 `generateCompleteHTML`（它现在自己生成 DOM）。

## 假设与决策

1. **widgetToCtrlType 映射**：使用原项目的完整 26 个控件类型映射
2. **data-* 属性**：使用原项目的 `dataAttrs()` 逻辑，包含 `data-columns`、`data-rows`、`data-show-checkbox`、`data-allow-add`、`data-allow-delete`、`data-editable`、`data-always-show-selection` 等
3. **CSS 子选择器**：使用原项目完整版（toggle-slider、radiogroup-item、tab-header-btn、card-collapse-btn、list-item、tree-node、data-grid-row 等）
4. **运行时脚本**：使用原项目的完整脚本（BRIDGE_SCRIPT、LISTBOX_RUNTIME、TREEVIEW_RUNTIME + TREE_INIT_SCRIPT、DATA_GRID_INIT_SCRIPT）
5. **保留改进**：titleBarBtnColor、bodyBackground 无颜色、user-select:none、预览窗口智能更新

## 验证

1. `npm run build` 通过（vue-tsc + vite build）
2. 导出 HTML 中控件使用原生 HTML 元素（`<button>`、`<input>` 等），无 div 包裹
3. 导出 HTML 中控件无内联样式（除标题栏按钮颜色、进度条宽度等少量必要属性）
4. 所有 CSS 集中在 `#id { ... }` 选择器中
5. 所有控件包含正确的 `data-ctrl-type` 属性
6. 预览窗口可正常打开和更新