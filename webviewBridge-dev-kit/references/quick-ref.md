# webviewBridge 快速参考卡

## 控件 data-ctrl-type 速查
| 控件 | data-ctrl-type | 标签 |
|------|---------------|------|
| 按钮 | button | `<button>` |
| 图标按钮 | iconButton | `<button>` |
| 输入框 | inputText | `<input type="text">` |
| 密码框 | inputText | `<input type="password">` |
| 文本域 | textarea | `<textarea>` |
| 复选框 | checkbox | `<label><input type="checkbox"><span>` |
| 开关 | **switchToggle** | `<label><input type="checkbox"><span class="slider">` |
| 下拉框 | comboBox | `<select>` |
| 超链接 | hyperLink | `<a>` |
| 标签 | label | `<span>` |
| 图片框 | imageBox | `<div class="imageBox">` |
| 进度条 | progressBar | `<div class="progressBar_container">` |
| 日期选择 | datetimePicker | `<input type="datetime-local">` |
| 分割线 | divider | `<div>` |
| 列表 | listBox | `<div class="listBox">` |
| 表格 | dataGrid | `<div class="dataGrid_container">` |
| 树形 | treeView | `<div class="treeView_node">` |
| 标签页 | tabsContainer | `<div class="tabsContainer">` |
| 卡片 | cardBox | `<div class="cardBox">` |
| 日志 | logOutput | `<div class="logOutput_container">` |
| 右键菜单 | contextMenu | `<div>` (设计态占位) |
| 气泡框 | tooltip | `<div>` (设计态占位) |
| 信息框 | messageBox | `<div>` (设计态占位) |
| 输入弹窗 | inputBox | `<div>` (设计态占位) |
| 单选框组 | radioGroup | `<div class="radioGroup_container">` |

## 子元素 data-ctrl-type
| 父控件 | 子元素 class | data-ctrl-type |
|--------|-------------|---------------|
| listBox | .listBox_item | listBox_item |
| dataGrid | .dataGrid_cell | dataGrid_cell |
| dataGrid | input.dataGrid_row_check | dataGrid_row_checkbox |
| treeView | .treeView_toggle | treeview_node_toggle |
| treeView | .treeView_label | treeview_node_text |
| tabsContainer | button.headerBar_btn | tabsContainer_headerBar_btn |
| cardBox | .cardBox_body | cardBox_body |
| logOutput | .logOutput_line | logOutput_item |
| radioGroup | input[type=radio] | radio |
| messageBox | .mb-btn | messageBox_yes / messageBox_no |
| inputBox | .ib-input | inputBox_text |

## HTML 骨架（最小模板）
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden}
.pageContainer{position:relative;overflow:hidden;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
[data-drag-type]{app-region:no-drag;-webkit-app-region:no-drag}
/* 标题栏按钮拖拽：不用 data-drag-type，用 data-ctrl-type 选择器 */
.pageContainer [data-ctrl-type^="titlebar_"]{app-region:no-drag;-webkit-app-region:no-drag}
.pageContainer [data-ctrl-type="titlebar_max"] span{app-region:drag;-webkit-app-region:drag}
.titlebar_rightBtn{width:35px;height:32px;border:none;background:transparent;cursor:default;display:flex;align-items:center;justify-content:center}
.titlebar_rightBtn:hover{background:rgba(0,0,0,0.06)}
.titlebar_rightBtn_close:hover{background:#e81123;color:#fff}
/* 保护 Font Awesome 图标字体 */
.pageContainer i[class*="fa-"]{font-family:"Font Awesome 6 Free"!important;font-weight:900}
</style>
</head>
<body>
<div class="pageContainer" id="pageContainer" data-ctrl-type="pageContainer" data-name="canvas"
     style="position:relative;width:100%;height:100%;padding-top:40px;display:flex;flex-direction:column;overflow:hidden;app-region:drag;-webkit-app-region:drag;">

  <!-- 标题栏 -->
  <div class="titlebar" id="titlebar" data-name="标题栏"
       style="position:absolute;top:0;left:0;right:0;height:40px;background:#F8F8F8;border-bottom:1px solid rgba(0,0,0,0.08);app-region:drag;display:flex;align-items:center;">
    <div class="titlebar_left">...</div>
    <div class="titlebar_center">...</div>
    <div class="titlebar_right">
      <button id="titlebar_min" data-ctrl-type="titlebar_min" class="titlebar_rightBtn">─</button>
      <button id="titlebar_max" data-ctrl-type="titlebar_max" class="titlebar_rightBtn">
        <span style="display:flex;">□</span>
      </button>
      <button id="titlebar_close" data-ctrl-type="titlebar_close" class="titlebar_rightBtn titlebar_rightBtn_close">✕</button>
    </div>
  </div>

  <!-- 控件放这里 -->

</div>
<script src="webviewBridge.js"></script>
</body>
</html>
```
⚠️ 先将 `webviewBridge.js` 复制到 `output/` 目录，再在此目录中创建页面文件。

## fv2_packer 打包速查

```sh
# 自动命名（入口名.app.fv2）
fv2_packer.exe D:\output\myapp.html
fv2_packer.exe D:\output myapp.html

# 指定输出名
fv2_packer.exe D:\output myapp.html myapp   # → myapp.fv2

# 不加密 / 指定 token
fv2_packer.exe D:\output\myapp.html --no-encrypt
fv2_packer.exe D:\output\myapp.html --token=X4FE85
```

