---
name: webview-page-dev
description: >
  基于 webviewBridge.js 框架开发 WebView2 页面的专家技能。
  当用户需要创建符合 webviewBridge 规范的 HTML 页面、生成具有 Win11 窗口风格的软件界面。
  或需要了解 webviewBridge 控件规范和 API 时，应使用此技能。
---

# webviewBridge 页面开发专家

你精通 webviewBridge 桥接机制，了解所有控件的 data 属性规范、子 DOM 结构、以及 Win11 毛玻璃主题兼容要求。

## 知识库文件索引

| 文件 | 内容 | 何时用 |
|------|------|--------|
| `dev-guide.html` | 完整开发文档：控件规范、模板、属性表、主题指南 | **首先打开**了解全局 |
| `public/webviewBridge_api_doc.html` | 所有 API 方法文档 | 需要查 API 参数/返回值时 |
| `references/example.html` | 完整可运行的示例页面 | 参照实际的 HTML/CSS/JS 写法 |
| `references/quick-ref.md` | 控件 data-ctrl-type 速查表 + HTML 骨架 | 快速对照 |
| `public/docs/api/{控件名}.js` | 单个控件的 API 详情 | 需要某个控件的方法参数 |
| `.cursorrules` | 硬性约束清单 | 生成后逐条自检 |

---

## 核心工作流

### 第一步：快速了解规范
1. 打开 `dev-guide.html`，浏览 §1~§4：
   - 每个控件必须有什么属性（id、data-ctrl-type、data-drag-type）
   - 各控件的 data-ctrl-type 值
   - 复杂控件的完整子 DOM 结构
2. 打开 `references/quick-ref.md`，记下常用 data-ctrl-type
3. 打开 `references/example.html`，看一个完整页面从头到尾是怎么写的

### 第二步：生成页面（按此顺序）

```
1. <!DOCTYPE html> → <head>（meta + Font Awesome + <style>）
2. CSS：全局 reset + [data-drag-type] no-drag + 标题栏 + 毛玻璃
3. <body> → .pageContainer#pageContainer
4. 标题栏 .titlebar（含三按钮：min/max/close）
5. 布局：侧边栏 + 内容区
6. 逐个添加控件（每个对照下方检查清单）
7. <script src="webviewBridge.js"></script>
```

**每个控件生成检查清单**：
- [ ] 根元素有唯一 `id`
- [ ] 根元素有正确的 `data-ctrl-type`
- [ ] 可交互 → 有 `data-drag-type`
- [ ] 推荐：`data-name`（中文名）、`data-type`（小写类型名）
- [ ] 复杂控件 → 完整子 DOM 结构（见下方模板）
- [ ] `<button>` 子元素 → CSS 有 `color:inherit; font-size:inherit; font-family:inherit`

### 第三步：对照 Rules 自检
逐条检查 `.cursorrules` 的 20 条规则和「严禁事项」。

---

## 控件属性三件套

**基础控件**：
```html
<!-- 按钮 -->
<button id="btn_1" data-ctrl-type="button" data-drag-type="button" data-type="button" data-name="确认">确定</button>

<!-- 输入框 -->
<input id="inp_1" data-ctrl-type="inputText" data-drag-type="inputText" data-type="input" data-name="用户名" placeholder="请输入" />

<!-- 开关（注意：data-ctrl-type 必须用 switchToggle） -->
<label id="sw_1" data-ctrl-type="switchToggle" data-drag-type="switchToggle" data-type="toggle" data-name="开关">
  <input type="checkbox"><span class="slider"></span>
</label>

<!-- 超链接（注意：href 放 data-href，避免页面跳转） -->
<a id="link_1" data-ctrl-type="hyperLink" data-drag-type="hyperLink" data-type="hyperLink" data-name="链接" data-href="https://example.com">链接</a>
```

**布局容器不设 data-drag-type**：
```html
<div class="sidebar">  <!-- 纯容器，无 data-drag-type -->
<div class="content">  <!-- 纯容器，无 data-drag-type -->
```

---

## 复杂控件完整模板

### ListBox（列表框）
```html
<div id="list_1" data-ctrl-type="listBox" data-drag-type="listBox" data-type="listBox" data-name="列表"
     data-listBox-items='[{"id":"1","text":"列表项 1","selected":false},{"id":"2","text":"列表项 2","selected":false}]'
     data-editable="false" data-always-show-selection="false"
     style="width:200px;height:200px;border:1px solid #d9d9d9;border-radius:6px;overflow:hidden;">
  <div class="listBox_scroll" style="flex:1;overflow-y:auto;">
    <div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="0"
         style="display:flex;align-items:center;height:32px;padding:0 12px;cursor:pointer;">
      <span class="listBox_item_text">列表项 1</span>
    </div>
    <div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="1"
         style="display:flex;align-items:center;height:32px;padding:0 12px;cursor:pointer;">
      <span class="listBox_item_text">列表项 2</span>
    </div>
  </div>
</div>
```
⚠️ `data-listBox-items` 外层用单引号，JSON 内部键值用双引号

### DataGrid（多项表格）
```html
<div id="grid_1" data-ctrl-type="dataGrid" data-drag-type="dataGrid" data-type="dataGrid" data-name="表格"
     data-columns='[{"field":"name","header":"姓名"},{"field":"age","header":"年龄"}]'
     data-rows='[{"id":"row1","cells":{"name":"张三","age":"28"}},{"id":"row2","cells":{"name":"李四","age":"32"}}]'
     data-show-checkbox="true" data-editable="false" data-always-show-selection="false"
     style="width:500px;height:300px;display:flex;flex-direction:column;border:1px solid #d9d9d9;border-radius:6px;overflow:hidden;">
  <!-- 表头 -->
  <div class="dataGrid_header" style="display:flex;border-bottom:1px solid #d9d9d9;background:#f0f0f0;">
    <div class="dataGrid_header_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
      <input type="checkbox" class="dataGrid_select_all">
    </div>
    <div class="dataGrid_header_cell" data-col-key="name" data-col-name="姓名" data-ctrl-type="dataGrid_cell"
         style="flex:1;min-width:80px;padding:6px 10px;font-weight:600;">姓名</div>
    <div class="dataGrid_header_cell" data-col-key="age" data-col-name="年龄" data-ctrl-type="dataGrid_cell"
         style="flex:1;min-width:80px;padding:6px 10px;font-weight:600;">年龄</div>
  </div>
  <!-- 表体 -->
  <div class="dataGrid_body" style="flex:1;overflow-y:auto;">
    <div class="dataGrid_row" data-row-index="0" data-row-id="row1"
         style="display:flex;border-bottom:1px solid #e8e8e8;">
      <div class="dataGrid_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
        <input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox">
      </div>
      <div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="name" data-col-name="姓名"
           style="flex:1;min-width:80px;padding:6px 10px;" title="张三">张三</div>
      <div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="age" data-col-name="年龄"
           style="flex:1;min-width:80px;padding:6px 10px;" title="28">28</div>
    </div>
    <div class="dataGrid_row" data-row-index="1" data-row-id="row2"
         style="display:flex;border-bottom:1px solid #e8e8e8;">
      <div class="dataGrid_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
        <input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox">
      </div>
      <div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="name" data-col-name="姓名"
           style="flex:1;min-width:80px;padding:6px 10px;" title="李四">李四</div>
      <div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="age" data-col-name="年龄"
           style="flex:1;min-width:80px;padding:6px 10px;" title="32">32</div>
    </div>
  </div>
</div>
```
⚠️ 禁止 `<table>` 标签。每行和表头的列宽必须精确一致（flex 布局中 same `flex:1` 或 same `width`）

### TreeView（树形框）
```html
<div id="tree_1" data-ctrl-type="treeView" data-drag-type="treeView" data-type="treeView" data-name="树形"
     data-tree-id="tree_1" data-editable="false" data-show-icon="true" data-always-show-selection="true"
     style="width:220px;height:280px;border:1px solid #d9d9d9;border-radius:6px;overflow:auto;">
  <!-- 根节点（展开状态：expanded） -->
  <div class="treeView_node" data-node-id="node_1" data-level="0">
    <div class="treeView_node_content" style="display:flex;align-items:center;padding:4px 8px;cursor:pointer;">
      <span class="treeView_toggle expanded" data-ctrl-type="treeview_node_toggle" style="width:16px;">▶</span>
      <span class="treeView_icon folder" style="margin:0 4px;">📁</span>
      <span class="treeView_label" data-ctrl-type="treeview_node_text">根节点</span>
    </div>
    <div class="treeView_children">
      <!-- 子节点（叶子：empty；折叠：collapsed） -->
      <div class="treeView_node" data-node-id="node_2" data-level="1">
        <div class="treeView_node_content" style="display:flex;align-items:center;padding:4px 8px;cursor:pointer;">
          <span class="treeView_toggle empty" data-ctrl-type="treeview_node_toggle" style="width:16px;visibility:hidden;">▶</span>
          <span class="treeView_icon file" style="margin:0 4px;">📄</span>
          <span class="treeView_label" data-ctrl-type="treeview_node_text">子节点 1</span>
        </div>
      </div>
    </div>
  </div>
</div>
```
⚠️ toggle 状态类：`expanded`（展开）、`collapsed`（折叠）、`empty`（叶子）
⚠️ 每层 `data-level` 递增

### TabsContainer（标签页）
```html
<div id="tabs_1" data-ctrl-type="tabsContainer" data-drag-type="tabsContainer" data-type="tabsContainer" data-name="标签页"
     class="tabsContainer" style="width:300px;height:200px;display:flex;flex-direction:column;border:1px solid #d9d9d9;border-radius:6px;overflow:hidden;">
  <div class="tabsContainer_headerBar" style="display:flex;height:32px;border-bottom:1px solid #d9d9d9;">
    <button class="tabsContainer_headerBar_btn active" data-ctrl-type="tabsContainer_headerBar_btn" data-tab-name="tab1"
            style="color:inherit;font-size:inherit;font-family:inherit;border:none;background:transparent;cursor:pointer;padding:0 12px;">标签1</button>
    <button class="tabsContainer_headerBar_btn" data-ctrl-type="tabsContainer_headerBar_btn" data-tab-name="tab2"
            style="color:inherit;font-size:inherit;font-family:inherit;border:none;background:transparent;cursor:pointer;padding:0 12px;">标签2</button>
  </div>
  <div class="tabsContainer_contentWrapper" style="flex:1;position:relative;overflow:hidden;">
    <div class="tabsContainer_contentWrapper_panel active" data-tab-name="tab1" data-parent="tabs_1" data-tab="0"
         style="position:absolute;top:0;left:0;width:100%;height:100%;padding:8px;">内容 1</div>
    <div class="tabsContainer_contentWrapper_panel" data-tab-name="tab2" data-parent="tabs_1" data-tab="1"
         style="position:absolute;top:0;left:0;width:100%;height:100%;display:none;padding:8px;">内容 2</div>
  </div>
</div>
```
⚠️ panel 必须设 `data-parent`（容器 id）和 `data-tab`（数字索引）
⚠️ `<button>` 的 CSS 必须有 `color:inherit; font-size:inherit; font-family:inherit`

### CardBox（卡片框）
```html
<div id="card_1" data-ctrl-type="cardBox" data-drag-type="cardBox" data-type="cardBox" data-name="卡片"
     data-collapsible="true" data-collapsed="false" class="cardBox"
     style="width:260px;height:180px;display:flex;flex-direction:column;border:1px solid #e0e0e0;border-radius:4px;overflow:hidden;">
  <div class="cardBox_header" style="display:flex;align-items:center;justify-content:space-between;height:32px;padding:0 12px;background:#f5f5f5;">
    <span class="cardBox_header_title" style="font-weight:600;">卡片标题</span>
    <span class="cardBox_collapse_btn" style="cursor:pointer;color:inherit;font-size:inherit;">
      <svg width="12" height="12"><path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
    </span>
  </div>
  <div class="cardBox_body" data-ctrl-type="cardBox_body" style="flex:1;padding:12px;">内容</div>
</div>
```

### ProgressBar（进度条）
```html
<div id="prg_1" data-ctrl-type="progressBar" data-drag-type="progressBar" data-type="progressBar" data-name="进度"
     data-editable="true" class="progressBar_container"
     style="width:250px;height:10px;position:relative;overflow:visible;border-radius:12px;">
  <div class="progressBar_track" style="width:100%;height:100%;background:#E0E0E0;border-radius:inherit;"></div>
  <div class="progressBar_fill" style="position:absolute;top:0;left:0;width:60%;height:100%;background:#0078D4;border-radius:inherit;"></div>
  <span class="progressBar_text" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:10px;color:#fff;">60%</span>
</div>
```

### RadioGroup（单选框组）
```html
<div id="rg_1" data-ctrl-type="radioGroup" data-drag-type="radioGroup" data-type="radioGroup" data-name="单选框组"
     class="radioGroup_container" style="width:120px;display:flex;flex-direction:column;gap:4px;">
  <label class="radioGroup_item"><input type="radio" data-ctrl-type="radio" name="rg_1" value="选项1" checked> 选项1</label>
  <label class="radioGroup_item"><input type="radio" data-ctrl-type="radio" name="rg_1" value="选项2"> 选项2</label>
</div>
```
⚠️ 同组 radio 的 `name` 必须一致

### LogOutput（日志框）
```html
<div id="log_1" data-ctrl-type="logOutput" data-drag-type="logOutput" data-type="logOutput" data-name="日志"
     class="logOutput_container" style="width:300px;height:150px;border:1px solid #ddd;border-radius:4px;overflow:auto;padding:8px;">
  <div class="logOutput_line" data-ctrl-type="logOutput_item" style="color:#333;">[INFO] 系统已启动</div>
</div>
```

---

## Win11 毛玻璃主题规则

### 规则 1：button 子元素 inherit（最重要！）
浏览器 UA 样式表有 `button { color: buttontext }`，会阻断 CSS 继承。必须显式覆盖：
```css
.tabsContainer_headerBar_btn,
.cardBox_collapse_btn {
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  border: none;
  background: none;
  cursor: pointer;
}
```

### 规则 2：背景色策略
- **不透明模式**（默认）：用 hex 值，如 `#ffffff`、`#0078d4`
- **毛玻璃模式**：用 rgba 半透明，如 `rgba(255,255,255,0.15)`、`rgba(0,120,212,0.8)`
- **不要混用**：同一控件要么全 hex 要么全 rgba

### 规则 3：容器毛玻璃
```css
.pageContainer {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

### 规则 4：可继承属性不写死在子元素
`color`、`font-size`、`font-family`、`font-weight` 等应从父容器继承：
- ❌ `.my-item { color: #333; font-size: 13px; }`
- ✅ `.my-item { color: inherit; font-size: inherit; }`

---

## 常见错误对照

| 错误 | 后果 | 正确 |
|------|------|------|
| 开关 `data-ctrl-type="checkbox"` | 无法区分开关/复选框 | `"switchToggle"` |
| 表格用 `<table>` | 兼容性/布局问题 | div + flex |
| `<button>` 不设 `color:inherit` | 浏览器 UA 覆盖颜色 | 显式 inherit |
| 子元素写死 `fontSize:13` | 改容器字号不生效 | inherit 或不写 |
| 侧边栏加 `data-drag-type` | 空白区不能拖窗口 | 纯布局不加 |
| 最大化按钮 span 无 `app-region:drag` | Win11 Snap 失效 | span 必须设 |
| panel 缺 `data-parent` | 拖入控件不归属容器 | 必设 data-parent |

---

## 完整页面骨架（最小可运行模板）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>页面标题</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:transparent}

.pageContainer{position:relative;overflow:hidden;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
[data-drag-type]{app-region:no-drag;-webkit-app-region:no-drag}

.titlebar{position:absolute;top:0;left:0;right:0;height:40px;display:flex;align-items:center;app-region:drag;-webkit-app-region:drag}
.titlebar_rightBtn{width:35px;height:32px;border:none;background:transparent;cursor:default;border-radius:4px;display:flex;align-items:center;justify-content:center}
.titlebar_rightBtn:hover{background:rgba(0,0,0,0.06)}
.titlebar_rightBtn_close:hover{background:#e81123;color:#fff}

/* button 子元素覆盖浏览器 UA */
.tabsContainer_headerBar_btn,.cardBox_collapse_btn{color:inherit;font-size:inherit;font-family:inherit;border:none;background:none;cursor:pointer}
</style>
</head>
<body>
<div class="pageContainer" id="pageContainer" data-ctrl-type="pageContainer" data-name="canvas"
     data-original-width="1065" data-original-height="695"
     style="position:relative;width:100%;height:100%;padding-top:40px;display:flex;flex-direction:column;app-region:drag;-webkit-app-region:drag;">

  <div class="titlebar" id="titlebar" data-name="标题栏"
       style="background:#F8F8F8;border-bottom:1px solid rgba(0,0,0,0.08);">
    <div class="titlebar_left" style="display:flex;align-items:center;padding-left:12px;">
      <span id="titlebar_icon" data-ctrl-type="titlebar_left_icon" data-drag-type="titlebar_left_icon" data-name="图标">
        <i class="fas fa-star"></i>
      </span>
    </div>
    <div class="titlebar_center" style="flex:1;display:flex;align-items:center;">
      <span id="titlebar_title" data-ctrl-type="titlebar_title" data-drag-type="titlebar_title" data-name="标题"
            style="font-size:13px;font-weight:600;">我的应用</span>
    </div>
    <div class="titlebar_right" style="display:flex;align-items:center;padding-right:4px;">
      <button id="titlebar_min" data-ctrl-type="titlebar_min" data-drag-type="titlebar_min" data-name="最小化" class="titlebar_rightBtn">─</button>
      <button id="titlebar_max" data-ctrl-type="titlebar_max" data-drag-type="titlebar_max" data-name="最大化" class="titlebar_rightBtn">
        <span style="app-region:drag;-webkit-app-region:drag;width:18px;height:18px;display:flex;align-items:center;justify-content:center;">□</span>
      </button>
      <button id="titlebar_close" data-ctrl-type="titlebar_close" data-drag-type="titlebar_close" data-name="关闭" class="titlebar_rightBtn titlebar_rightBtn_close">✕</button>
    </div>
  </div>

  <!-- 控件放这里 -->

</div>
<script src="webviewBridge.js"></script>
</body>
</html>
```

---

## 调试流程

1. 检查所有控件是否有 `id` 和 `data-ctrl-type`
2. 检查可交互控件是否有 `data-drag-type`
3. 对照 `references/example.html` 确认 HTML 结构
4. 打开浏览器控制台查看 webviewBridge 日志
