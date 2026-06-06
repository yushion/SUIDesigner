
var apiDocs = {};
var iconMapData = [];

function addDoc(ns, methods) { apiDocs[ns] = methods; }

// ==================== 通用 API ====================
addDoc('general', [
  {sig:'setValue(targetId, value)', desc:'<span class="desctile">设置控件值</span>对 INPUT/TEXTAREA/SELECT 使用 .value，其他使用 setOriginalText（支持图标占位符）。',params:[{n:'targetId',t:'string',d:'目标控件 ID'},{n:'value',t:'string',d:'要设置的值'}],ret:'boolean — 是否成功',exApi:"// 设置输入框的值\nwebviewBridge.api.setValue('input_1', 'Hello World');\n\n// 设置按钮文本（支持图标占位符）\nwebviewBridge.api.setValue('button_1', '[OK] 确认');",exCmd:'{\n  "command": "setValue",\n  "targetId": "input_1",\n  "value": "Hello World"\n}'},
  {sig:'getValue(targetId)', desc:'<span class="desctile">获取控件值</span>INPUT/TEXTAREA/SELECT 返回 .value，否则返回原始文本（含 emoji）。',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'string — 控件当前值',exApi:"// 获取输入框内容\nvar val = webviewBridge.api.getValue('input_1');\nconsole.log(val);",exCmd:'{\n  "command": "getValue",\n  "targetId": "input_1"\n}'},
  {sig:'setChecked(targetId, checked)', desc:'<span class="desctile">设置复选框/单选框的选中状态</span>自动查找后代 input[type="checkbox"] 或 input[type="radio"]。',params:[{n:'targetId',t:'string',d:'目标控件 ID'},{n:'checked',t:'boolean',d:'true=选中, false=取消'}],ret:'boolean — 是否成功',exApi:"// 勾选复选框\nwebviewBridge.api.setChecked('checkbox_1', true);\n\n// 取消勾选\nwebviewBridge.api.setChecked('checkbox_1', false);",exCmd:'{\n  "command": "setChecked",\n  "targetId": "checkbox_1",\n  "checked": true\n}'},
  {sig:'getChecked(targetId)', desc:'<span class="desctile">获取复选框/单选框当前是否选中</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'boolean — 是否选中',exApi:"var isChecked = webviewBridge.api.getChecked('checkbox_1');\nif (isChecked) {\n  console.log('已选中');\n}",exCmd:'{\n  "command": "getChecked",\n  "targetId": "checkbox_1"\n}'},
  {sig:'setEnabled(targetId, enabled)', desc:'<span class="desctile">启用或禁用控件</span>禁用后控件显示灰色不可交互样式。',params:[{n:'targetId',t:'string',d:'目标控件 ID'},{n:'enabled',t:'boolean',d:'true=启用, false=禁用'}],ret:'boolean — 是否成功',exApi:"// 禁用按钮\nwebviewBridge.api.setEnabled('button_1', false);\n\n// 启用按钮\nwebviewBridge.api.setEnabled('button_1', true);",exCmd:'{\n  "command": "setEnabled",\n  "targetId": "button_1"\n}'},
  {sig:'isEnabled(targetId)', desc:'<span class="desctile">检查控件当前是否处于启用状态</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'boolean — 是否启用',exApi:"if (webviewBridge.api.isEnabled('button_1')) {\n  console.log('按钮可用');\n}",exCmd:'{\n  "command": "isEnabled",\n  "targetId": "button_1"\n}'},
  {sig:'show(targetId)', desc:'<span class="desctile">显示控件（设置 display 为默认值）</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'boolean — 是否成功',exApi:"// 显示隐藏的按钮\nwebviewBridge.api.show('button_1');",exCmd:'{\n  "command": "show",\n  "targetId": "button_1"\n}'},
  {sig:'hide(targetId)', desc:'<span class="desctile">隐藏控件（设置 display:none）</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'boolean — 是否成功',exApi:"// 隐藏按钮\nwebviewBridge.api.hide('button_1');",exCmd:'{\n  "command": "hide",\n  "targetId": "button_1"\n}'},
  {sig:'toggle(targetId)', desc:'<span class="desctile">切换控件显示/隐藏状态</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'boolean — 是否成功',exApi:"// 切换可见性\nwebviewBridge.api.toggle('panel_1');",exCmd:'{\n  "command": "toggle",\n  "targetId": "panel_1"\n}'},
  {sig:'isVisible(targetId)', desc:'<span class="desctile">检查控件当前是否可见</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'boolean — 是否可见',exApi:"if (webviewBridge.api.isVisible('panel_1')) {\n  console.log('面板可见');\n}",exCmd:'{\n  "command": "isVisible",\n  "targetId": "panel_1"\n}'},
  {sig:'focus(targetId)', desc:'<span class="desctile">使控件获得焦点</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'boolean — 是否成功',exApi:"// 让输入框获得焦点\nwebviewBridge.api.focus('input_1');",exCmd:'{\n  "command": "focus",\n  "targetId": "input_1"\n}'},
  {sig:'setStyle(targetId, styleObj)', desc:'<span class="desctile">批量设置控件 CSS 样式</span>styleObj 为键值对对象，逐个设置 el.style[key]。',params:[{n:'targetId',t:'string',d:'目标控件 ID'},{n:'styleObj',t:'object',d:'CSS 样式键值对，如 {color:"red",fontSize:"16px"}'}],ret:'boolean — 是否成功',exApi:"// 修改控件样式\nwebviewBridge.api.setStyle('label_1', {\n  color: 'red',\n  fontSize: '18px',\n  fontWeight: 'bold'\n});",exCmd:'{\n  "command": "setStyle",\n  "targetId": "label_1",\n  "style": { "color": "red", "fontSize": "18px" }\n}'},
  {sig:'setBlockContextMenu(block)', desc:'<span class="desctile">设置是否阻止【系统右键菜单】弹出</span>block=true 时禁用右键菜单。',params:[{n:'block',t:'boolean',d:'true=阻止右键菜单, false=允许'}],ret:'boolean — 当前设置值',exApi:"// 阻止右键菜单\nwebviewBridge.api.setBlockContextMenu(true);",exCmd:'{\n  "command": "setBlockContextMenu",\n  "block": true\n}'},
  {sig:'getBlockContextMenu()', desc:'<span class="desctile">获取当前【系统右键菜单】阻止状态</span>',params:[],ret:'boolean — 是否阻止右键菜单',exApi:"var blocked = webviewBridge.api.getBlockContextMenu();\nconsole.log('右键菜单阻止:', blocked);",exCmd:'{}'},
  {sig:'getWindowSize()', desc:'<span class="desctile">获取设计画布尺寸</span>优先获取 .page-container 的尺寸，若无则 fallback 到 document.body 的尺寸。',params:[],ret:'{width:number, height:number}',exApi:"var size = webviewBridge.api.getWindowSize();\nconsole.log('画布:', size.width, 'x', size.height);",exCmd:'{}'},
  {sig:'testReturn()', desc:'<span class="desctile">测试方法，固定返回 "test_success"，用于验证 API 通信是否正常</span>',params:[],ret:'string — "test_success"',exApi:"var result = webviewBridge.api.testReturn();\nconsole.log(result); // 'test_success'",exCmd:'{}'},
  {sig:'move(targetId, x, y)', desc:'<span class="desctile">移动控件到指定坐标（设置 left/top，单位为 px）</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'},{n:'x',t:'number',d:'X 坐标 (px)'},{n:'y',t:'number',d:'Y 坐标 (px)'}],ret:'boolean — 是否成功',exApi:"// 移动按钮到 (100, 200)\nwebviewBridge.api.move('button_1', 100, 200);",exCmd:'{\n  "command": "move",\n  "targetId": "button_1",\n  "x": 100,\n  "y": 200\n}'},
  {sig:'setSize(targetId, width, height)', desc:'<span class="desctile">设置控件尺寸（设置 width/height，单位为 px）</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'},{n:'width',t:'number',d:'宽度 (px)'},{n:'height',t:'number',d:'高度 (px)'}],ret:'boolean — 是否成功',exApi:"// 设置按钮大小为 120×40\nwebviewBridge.api.setSize('button_1', 120, 40);",exCmd:'{\n  "command": "setSize",\n  "targetId": "button_1",\n  "width": 120,\n  "height": 40\n}'},
  {sig:'getPosition(targetId)', desc:'<span class="desctile">获取控件相对于 .page-container 的偏移坐标</span>通过 getBoundingClientRect 差值计算，若容器不存在则返回视口坐标。',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'{x:number, y:number}',exApi:"var pos = webviewBridge.api.getPosition('button_1');\nconsole.log('位置:', pos.x, pos.y);",exCmd:'{\n  "command": "getPosition",\n  "targetId": "button_1"\n}'},
  {sig:'getSize(targetId)', desc:'<span class="desctile">获取控件当前尺寸（基于 offsetWidth/offsetHeight）</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'{width:number, height:number}',exApi:"var sz = webviewBridge.api.getSize('button_1');\nconsole.log('尺寸:', sz.width, 'x', sz.height);",exCmd:'{\n  "command": "getSize",\n  "targetId": "button_1"\n}'},
  {sig:'bringToFront(targetId)', desc:'<span class="desctile">将控件置于最顶层（zIndex=9999）</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'boolean — 是否成功',exApi:"// 将按钮置顶\nwebviewBridge.api.bringToFront('button_1');",exCmd:'{\n  "command": "bringToFront",\n  "targetId": "button_1"\n}'},
  {sig:'sendToBack(targetId)', desc:'<span class="desctile">将控件置于底层（zIndex=0）</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'}],ret:'boolean — 是否成功',exApi:"// 将按钮置底\nwebviewBridge.api.sendToBack('button_1');",exCmd:'{\n  "command": "sendToBack",\n  "targetId": "button_1"\n}'},
  {sig:'setZIndex(targetId, zIndex)', desc:'<span class="desctile">设置控件的 z-index 层级</span>',params:[{n:'targetId',t:'string',d:'目标控件 ID'},{n:'zIndex',t:'number|string',d:'z-index 值'}],ret:'boolean — 是否成功',exApi:"// 设置 z-index 为 100\nwebviewBridge.api.setZIndex('button_1', 100);",exCmd:'{\n  "command": "setZIndex",\n  "targetId": "button_1",\n  "zIndex": 100\n}'}
]);

addDoc('tooltip', [
  {sig:'tooltip.show(targetId, mouseEvent)', desc:'<span class="desctile">显示气泡提示框</span>根据 targetId 找到对应提示框配置并弹出。若 mouseEvent 为鼠标事件对象，提示框定位在鼠标附近；为 null 则在绑定目标控件旁显示。支持纯文本/HTML 内容、延迟显示/隐藏、位置自适应。',params:[{n:'targetId',t:'string',d:'提示框控件 ID'},{n:'mouseEvent',t:'object|MouseEvent|optional',d:'鼠标事件对象（可选），用于定位提示框'}],ret:'boolean — 是否成功',exApi:"// 示例1：在 click 事件回调中手动显示提示框\nwebviewBridge.api.tooltip.show('tooltip_1', mouseEvent);\n\n// 示例2：在固定坐标显示（如按钮下方）\nvar btn = document.getElementById('button_1');\nvar rect = btn.getBoundingClientRect();\nwebviewBridge.api.tooltip.show('tooltip_1', {\n  clientX: rect.left + rect.width / 2,\n  clientY: rect.bottom + 5\n});\n\n// 示例3：配合右键菜单 callback，对高亮项显示提示框\n/* 在 PropertyPanel 回调区：\n  case \'contextMenu\':\n    var item = webviewBridge.api.listBox.getHighlightedItem(data.targetId);\n    if (item) {\n      webviewBridge.api.tooltip.updateConfig(data.targetId + \'_tip\', {\n        content: \'点击了: \' + item.text\n      });\n      webviewBridge.api.tooltip.show(data.targetId + \'_tip\', { clientX: 500, clientY: 300 });\n    }\n    break;\n*/",exCmd:'{\n  "command": "tooltip.show",\n  "targetId": "tooltip_1",\n  "mouseEvent": {"clientX": 300, "clientY": 200}\n}'},
  {sig:'tooltip.hide()', desc:'<span class="desctile">关闭当前显示的气泡提示框</span>立即隐藏，同时取消未触发的 showTimer/hideTimer。',params:[],ret:'boolean — 始终返回 true',exApi:"// 关闭当前显示的提示框\nwebviewBridge.api.tooltip.hide();\n\n// 典型场景：点击页面的确认按钮后关闭提示框\nwebviewBridge.api.button.onClick('confirm_btn', function() {\n  webviewBridge.api.tooltip.hide();\n});",exCmd:'{\n  "command": "tooltip.hide"\n}'},
  {sig:'tooltip.isVisible()', desc:'<span class="desctile">检查气泡提示框是否正在显示</span>',params:[],ret:'boolean — true=当前有提示框可见',exApi:"// 切换提示框显示/隐藏\nif (webviewBridge.api.tooltip.isVisible()) {\n  webviewBridge.api.tooltip.hide();\n} else {\n  webviewBridge.api.tooltip.show('tooltip_1', null);\n}\n\n// 条件判断\nif (webviewBridge.api.tooltip.isVisible()) {\n  console.log('提示框正在显示，跳过重复弹出');\n}",exCmd:'{\n  "command": "tooltip.isVisible"\n}'},
  {sig:'tooltip.updateConfig(targetId, config)', desc:'<span class="desctile">动态更新提示框配置</span>替换指定提示框的内容、位置、延迟等。更新后在下次 show/触发时立即生效。可用于实现"悬停不同项显示不同内容"的动态提示框。',params:[{n:'targetId',t:'string',d:'提示框控件 ID'},{n:'config',t:'object',d:'配置对象 { content, position, allowHTML, showDelay, hideDelay, customCSS } — 未提供的字段保持原值不变'}],ret:'boolean — 是否找到并更新',exApi:"// 示例1：基础更新\nwebviewBridge.api.tooltip.updateConfig('tooltip_1', {\n  content: '操作已成功完成',\n  position: 'top',\n  showDelay: 200\n});\n\n// 示例2：使用 HTML 内容 + 自定义样式\nwebviewBridge.api.tooltip.updateConfig('tooltip_1', {\n  content: '<b>警告：</b>数据即将过期<br/><small>请在24小时内更新</small>',\n  allowHTML: true,\n  position: 'right',\n  customCSS: '.tt-content { background: #2d2d2d; border: 1px solid #ff6b6b; }'\n});\n\n// 示例3：配合树形框，悬停不同节点显示不同内容\nwebviewBridge.api.treeView.onNodeHover('treeView_1', function(nodeData) {\n  webviewBridge.api.tooltip.updateConfig('tree_tip', {\n    content: '节点: ' + nodeData.text + '<br/>ID: ' + nodeData.id + '<br/>子节点数: ' + (nodeData.children ? nodeData.children.length : 0),\n    allowHTML: true\n  });\n  webviewBridge.api.tooltip.show('tree_tip', null);\n});",exCmd:'{\n  "command": "tooltip.updateConfig",\n  "targetId": "tooltip_1",\n  "config": {\n    "content": "操作已成功完成",\n    "position": "top",\n    "allowHTML": false,\n    "showDelay": 200\n  }\n}'},
  {sig:'tooltip.getConfig(targetId)', desc:'<span class="desctile">获取提示框的完整运行时配置</span>返回内容、位置、HTML开关、延迟参数和自定义样式。可用于调试或备份当前配置。',params:[{n:'targetId',t:'string',d:'提示框控件 ID'}],ret:'object|null — 配置对象 { content, position, allowHTML, showDelay, hideDelay, customCSS }，未找到返回 null',exApi:"// 获取并查看配置\nvar cfg = webviewBridge.api.tooltip.getConfig('tooltip_1');\nif (cfg) {\n  console.log('当前内容:', cfg.content);\n  console.log('当前位置:', cfg.position);\n  console.log('显示延迟:', cfg.showDelay, 'ms');\n  console.log('隐藏延迟:', cfg.hideDelay, 'ms');\n  console.log('HTML模式:', cfg.allowHTML ? '开启' : '关闭');\n  console.log('自定义样式:', cfg.customCSS);\n}\n\n// 备份配置后修改，实现'临时切换'效果\nvar saved = webviewBridge.api.tooltip.getConfig('tooltip_1');\nwebviewBridge.api.tooltip.updateConfig('tooltip_1', { content: '正在加载...', position: 'bottom' });\n// ... 异步操作完成后恢复\nsetTimeout(function() {\n  webviewBridge.api.tooltip.updateConfig('tooltip_1', saved);\n  webviewBridge.api.tooltip.hide();\n}, 3000);",exCmd:'{\n  "command": "tooltip.getConfig",\n  "targetId": "tooltip_1"\n}'}
]);

addDoc('messagebox', [
  {sig:'messageBox.show(id, overrides, requestId)', desc:'<span class="desctile">弹出信息提示框对话框</span>合并预定义配置和 overrides 参数。若已存在对话框，先关闭旧对话框再创建。按钮点击或关闭时自动向宿主发送 messageBoxResult 消息。支持 requestId 参数用于宿主异步回调匹配。',params:[{n:'id',t:'string',d:'信息提示框控件 ID'},{n:'overrides',t:'object|optional',d:'覆盖配置对象，可选字段: title, message, icon, buttons, defaultButton, width, showMask, closeOnMask, draggable, customCSS'},{n:'requestId',t:'string|optional',d:'宿主请求 ID，原样包含在回调消息中用于异步匹配'}],ret:'boolean — 是否成功',exApi:"// 示例1：无 requestId，弹出默认配置的提示框\nwebviewBridge.api.messageBox.show('msg_info');\n\n// 示例2：弹出带自定义内容的确认框，带 requestId 匹配异步回调\nwebviewBridge.api.messageBox.show('msg_confirm', {\n  title: '确认删除',\n  message: '确定要删除选中的记录吗？此操作不可撤销。',\n  icon: 'warning',\n  buttons: 'yesNo'\n}, 'req_123');\n\n// 宿主收到的回调消息：\n// { action: 'messageBoxResult', data: { result: 'yes', requestId: 'req_123' } }\n\n// 示例3：弹出错误提示框，无蒙版、不可拖动\nwebviewBridge.api.messageBox.show('msg_error', {\n  title: '操作失败',\n  message: '文件保存失败，请检查磁盘空间。',\n  icon: 'error',\n  showMask: false,\n  draggable: false\n});\n\n// 示例4：弹出信息提示框，HTML 消息 + 自定义样式\nwebviewBridge.api.messageBox.show('msg_html', {\n  title: '更新提示',\n  message: '<b>版本 2.0</b> 已发布<br/><ul><li>新增提示框控件</li><li>修复若干问题</li></ul>',\n  icon: 'info',\n  buttons: 'ok',\n  customCSS: '.mb-dialog { border: 2px solid #40a9ff; }'\n});",exCmd:'{\n  "command": "messageBox.show",\n  "id": "msg_confirm",\n  "overrides": {\n    "title": "确认删除",\n    "message": "确定要删除选中的记录吗？",\n    "icon": "warning",\n    "buttons": "yesNo"\n  },\n  "requestId": "req_123"\n}'},
  {sig:'messageBox.close()', desc:'<span class="desctile">关闭当前显示的信息提示框</span>立即移除对话框 DOM 元素并清理自定义样式。',params:[],ret:'boolean — 始终返回 true',exApi:"// 手动关闭对话框\nwebviewBridge.api.messageBox.close();\n\n// 定时自动关闭\nsetTimeout(function() {\n  webviewBridge.api.messageBox.close();\n}, 5000);",exCmd:'{\n  "command": "messageBox.close"\n}'},
  {sig:'messageBox.isVisible()', desc:'<span class="desctile">检查信息提示框是否正在显示</span>',params:[],ret:'boolean — true=对话框可见',exApi:"// 防止重复弹出\nif (!webviewBridge.api.messageBox.isVisible()) {\n  webviewBridge.api.messageBox.show('msg_info');\n}",exCmd:'{\n  "command": "messageBox.isVisible"\n}'},
  {sig:'messageBox.getConfig(id)', desc:'<span class="desctile">获取信息提示框的完整配置</span>返回预定义配置对象，包含标题、消息、图标、按钮等所有字段。',params:[{n:'id',t:'string',d:'信息提示框控件 ID'}],ret:'object|null — 配置对象，未找到返回 null',exApi:"// 获取并查看配置\nvar config = webviewBridge.api.messageBox.getConfig('msg_alert');\nif (config) {\n  console.log('标题:', config.title);\n  console.log('按钮组合:', config.buttons);\n  console.log('图标:', config.icon);\n  console.log('宽度:', config.width);\n}",exCmd:'{\n  "command": "messageBox.getConfig",\n  "id": "msg_alert"\n}'},
  {sig:'messageBox.updateConfig(id, overrides)', desc:'<span class="desctile">动态更新预定义配置</span>下次调用 show() 时生效（已显示的对话框不受影响）。',params:[{n:'id',t:'string',d:'信息提示框控件 ID'},{n:'overrides',t:'object',d:'要更新的字段对象，未提供的字段保持原值'}],ret:'boolean — 是否找到并更新',exApi:"// 动态修改提示框的默认配置\nwebviewBridge.api.messageBox.updateConfig('msg_info', {\n  title: '新标题',\n  icon: 'error',\n  width: 500\n});\n\n// 修改后下次 show() 将使用新配置\nwebviewBridge.api.messageBox.show('msg_info');",exCmd:'{\n  "command": "messageBox.updateConfig",\n  "id": "msg_info",\n  "overrides": {\n    "title": "新标题",\n    "icon": "error",\n    "width": 500\n  }\n}'}
]);

addDoc('icon-helpers', [
  {sig:'icon.parse(text)', desc:'<span class="desctile">将文本中的图标占位符（[NAME] 或 {NAME}）替换为对应 emoji</span>',params:[{n:'text',t:'string',d:'包含占位符的文本，如 "[OK] 操作成功"'},{n:'返回值',t:'string',d:'替换后的文本，如 "✅ 操作成功"'}],ret:'string — 替换后的文本',exApi:"// 解析图标占位符\nvar html = webviewBridge.api.icon.parse('[OK] 保存成功 [USER] 管理员');\n// 结果: '✅ 保存成功 👤 管理员'\ndocument.getElementById('label_1').innerHTML = html;",exCmd:'{\n  "command": "iconParse",\n  "text": "[OK] 保存成功"\n}'},
  {sig:'icon.toText(html)', desc:'<span class="desctile">将包含 emoji 的 HTML 文本转换回图标占位符格式</span>',params:[{n:'html',t:'string',d:'包含 emoji 的 HTML 字符串'},{n:'返回值',t:'string',d:'转换后的占位符文本'}],ret:'string — 占位符文本',exApi:"// 将 emoji 转回占位符\nvar text = webviewBridge.api.icon.toText('✅ 保存成功 👤 管理员');\n// 结果: '[OK] 保存成功 [USER] 管理员'",exCmd:'{\n  "command": "iconToText",\n  "html": "✅ 保存成功"\n}'}
]);

addDoc('messages', [
  {sig:'sendMessage(action, tagName, type, id, data)', desc:'<span class="desctile">直接向 WebView2 宿主发送消息（调用 chrome.webview.postMessage）</span>',params:[{n:'action',t:'string',d:'动作名称'},{n:'tagName',t:'string',d:'标签名'},{n:'type',t:'string',d:'类型'},{n:'id',t:'string',d:'控件 ID'},{n:'data',t:'any',d:'附加数据'}],ret:'void',exApi:"// 发送自定义消息给宿主\nwebviewBridge.api.sendMessage('customAction', 'button', 'click', 'button_1', {\n  extra: 'data'\n});",exCmd:'{} // sendMessage 不走命令分发，直接调用 API'},
  {sig:'showNotification(options)', desc:'<span class="desctile">通过宿主显示系统通知（调用 chrome.webview.postMessage 转发）</span>',params:[{n:'options',t:'object',d:'{title, text, text2, image, button1, button2}'}],ret:'boolean — 是否成功',exApi:"// 显示通知\nwebviewBridge.api.showNotification({\n  title: '操作完成',\n  text: '文件已成功保存',\n  image: 'info'\n});",exCmd:'{\n  "command": "showNotification",\n  "title": "操作完成",\n  "text": "文件已成功保存"\n}'},
  {sig:'addMessageListener(callback)', desc:'<span class="desctile">添加消息监听器，当宿主向页面发送消息时触发回调</span>',params:[{n:'callback',t:'function',d:'回调函数，接收 message 事件对象'}],ret:'boolean — 是否成功',exApi:"// 添加消息监听\nwebviewBridge.api.addMessageListener(function(event) {\n  console.log('收到宿主消息:', event.data);\n});",exCmd:'{} // 消息监听通过 API 注册，不走命令分发'},
  {sig:'removeMessageListener(callback)', desc:'<span class="desctile">移除之前添加的消息监听器</span>需传入与 addMessageListener 相同的函数引用。',params:[{n:'callback',t:'function',d:'要移除的回调函数引用'}],ret:'boolean — 是否成功',exApi:"// 移除消息监听\nvar handler = function(e) { console.log(e.data); };\nwebviewBridge.api.addMessageListener(handler);\n// ...稍后移除\nwebviewBridge.api.removeMessageListener(handler);",exCmd:'{} // 消息监听通过 API 注册，不走命令分发'},
  {sig:'setBlockContextMenu(block)', desc:'<span class="desctile">（同通用 API）设置是否阻止右键菜单</span>阻止后控件右击不弹出系统菜单。',params:[{n:'block',t:'boolean',d:'true=阻止'}],ret:'boolean',exApi:'webviewBridge.api.setBlockContextMenu(true);',exCmd:'{\n  "command": "setBlockContextMenu",\n  "block": true\n}'},
  {sig:'getBlockContextMenu()', desc:'<span class="desctile">（同通用 API）获取右键菜单阻止状态</span>',params:[],ret:'boolean',exApi:'console.log(webviewBridge.api.getBlockContextMenu());',exCmd:'{}'}
]);

// ==================== 基础控件 ====================
addDoc('button', [
  {sig:'button.getText(targetId)', desc:'<span class="desctile">获取按钮的文本内容</span>',params:[{n:'targetId',t:'string',d:'按钮控件 ID'}],ret:'string — 按钮文本',exApi:"var text = webviewBridge.api.button.getText('button_1');\nconsole.log('按钮文本:', text);",exCmd:'{\n  "command": "button.getText",\n  "targetId": "button_1"\n}'},
  {sig:'button.setText(targetId, text)', desc:'<span class="desctile">设置按钮的文本内容</span>支持图标占位符。',params:[{n:'targetId',t:'string',d:'按钮控件 ID'},{n:'text',t:'string',d:'要设置的文本'}],ret:'boolean — 是否成功',exApi:"// 设置按钮文本\nwebviewBridge.api.button.setText('button_1', '提交');\n\n// 使用图标占位符\nwebviewBridge.api.button.setText('button_1', '[OK] 确认提交');",exCmd:'{\n  "command": "button.setText",\n  "targetId": "button_1",\n  "text": "提交"\n}'}
]);

addDoc('input', [
  {sig:'input.getValue(targetId)', desc:'<span class="desctile">获取输入框当前内容</span>',params:[{n:'targetId',t:'string',d:'输入框控件 ID'}],ret:'string — 输入框值',exApi:"var val = webviewBridge.api.input.getValue('input_1');\nconsole.log('输入内容:', val);",exCmd:'{\n  "command": "input.getValue",\n  "targetId": "input_1"\n}'},
  {sig:'input.setValue(targetId, value)', desc:'<span class="desctile">设置输入框的值</span>',params:[{n:'targetId',t:'string',d:'输入框控件 ID'},{n:'value',t:'string',d:'要设置的值'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.input.setValue('input_1', 'Hello World');",exCmd:'{\n  "command": "input.setValue",\n  "targetId": "input_1",\n  "value": "Hello World"\n}'},
  {sig:'input.getPlaceholder(targetId)', desc:'<span class="desctile">获取输入框的占位提示文本</span>',params:[{n:'targetId',t:'string',d:'输入框控件 ID'}],ret:'string — placeholder 文本',exApi:"var ph = webviewBridge.api.input.getPlaceholder('input_1');\nconsole.log('提示文本:', ph);",exCmd:'{\n  "command": "input.getPlaceholder",\n  "targetId": "input_1"\n}'},
  {sig:'input.setPlaceholder(targetId, placeholder)', desc:'<span class="desctile">设置输入框的占位提示文本</span>',params:[{n:'targetId',t:'string',d:'输入框控件 ID'},{n:'placeholder',t:'string',d:'提示文本'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.input.setPlaceholder('input_1', '请输入用户名');",exCmd:'{\n  "command": "input.setPlaceholder",\n  "targetId": "input_1",\n  "placeholder": "请输入用户名"\n}'},
  {sig:'input.setType(targetId, type)', desc:'<span class="desctile">修改输入框的 type 属性（如 text、password、email、number 等）</span>',params:[{n:'targetId',t:'string',d:'输入框控件 ID'},{n:'type',t:'string',d:'HTML input type 值'}],ret:'boolean — 是否成功',exApi:"// 切换为密码框\nwebviewBridge.api.input.setType('input_1', 'password');\n\n// 切换为数字框\nwebviewBridge.api.input.setType('input2', 'number');",exCmd:'{\n  "command": "input.setType",\n  "targetId": "input_1",\n  "type": "password"\n}'}
]);

addDoc('textarea', [
  {sig:'textarea.getValue(targetId)', desc:'<span class="desctile">获取多行文本框当前内容</span>',params:[{n:'targetId',t:'string',d:'文本域控件 ID'}],ret:'string — 文本内容',exApi:"var val = webviewBridge.api.textarea.getValue('textarea_1');\nconsole.log(val);",exCmd:'{\n  "command": "textarea.getValue",\n  "targetId": "textarea_1"\n}'},
  {sig:'textarea.setValue(targetId, value)', desc:'<span class="desctile">设置多行文本框内容</span>',params:[{n:'targetId',t:'string',d:'文本域控件 ID'},{n:'value',t:'string',d:'要设置的内容'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.textarea.setValue('textarea_1', '第一行\\n第二行');",exCmd:'{\n  "command": "textarea.setValue",\n  "targetId": "textarea_1",\n  "value": "第一行\\n第二行"\n}'},
  {sig:'textarea.getPlaceholder(targetId)', desc:'<span class="desctile">获取文本域的占位提示文本</span>',params:[{n:'targetId',t:'string',d:'文本域控件 ID'}],ret:'string — placeholder 文本',exApi:"var ph = webviewBridge.api.textarea.getPlaceholder('textarea_1');",exCmd:'{\n  "command": "textarea.getPlaceholder",\n  "targetId": "textarea_1"\n}'},
  {sig:'textarea.setPlaceholder(targetId, placeholder)', desc:'<span class="desctile">设置文本域的占位提示文本</span>',params:[{n:'targetId',t:'string',d:'文本域控件 ID'},{n:'placeholder',t:'string',d:'提示文本'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.textarea.setPlaceholder('textarea_1', '请输入描述...');",exCmd:'{\n  "command": "textarea.setPlaceholder",\n  "targetId": "textarea_1",\n  "placeholder": "请输入描述..."\n}'},
  {sig:'textarea.setRows(targetId, rows)', desc:'<span class="desctile">设置文本域的行数（rows 属性），控制可见高度</span>',params:[{n:'targetId',t:'string',d:'文本域控件 ID'},{n:'rows',t:'number',d:'行数'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.textarea.setRows('textarea_1', 10);",exCmd:'{\n  "command": "textarea.setRows",\n  "targetId": "textarea_1",\n  "rows": 10\n}'}
]);

addDoc('checkbox', [
  {sig:'checkbox.getChecked(targetId)', desc:'<span class="desctile">获取复选框是否选中</span>',params:[{n:'targetId',t:'string',d:'复选框控件 ID'}],ret:'boolean — 选中状态',exApi:"var checked = webviewBridge.api.checkbox.getChecked('checkbox_1');\nif (checked) console.log('已勾选');",exCmd:'{\n  "command": "checkbox.getChecked",\n  "targetId": "checkbox_1"\n}'},
  {sig:'checkbox.setChecked(targetId, checked)', desc:'<span class="desctile">设置复选框选中状态</span>',params:[{n:'targetId',t:'string',d:'复选框控件 ID'},{n:'checked',t:'boolean',d:'true=选中'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.checkbox.setChecked('checkbox_1', true);",exCmd:'{\n  "command": "checkbox.setChecked",\n  "targetId": "checkbox_1",\n  "checked": true\n}'},
  {sig:'checkbox.getLabel(targetId)', desc:'<span class="desctile">获取复选框的标签文本</span>',params:[{n:'targetId',t:'string',d:'复选框控件 ID'}],ret:'string — 标签文本',exApi:"var label = webviewBridge.api.checkbox.getLabel('checkbox_1');\nconsole.log(label);",exCmd:'{\n  "command": "checkbox.getLabel",\n  "targetId": "checkbox_1"\n}'},
  {sig:'checkbox.setLabel(targetId, text)', desc:'<span class="desctile">设置复选框的标签文本</span>',params:[{n:'targetId',t:'string',d:'复选框控件 ID'},{n:'text',t:'string',d:'标签文本'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.checkbox.setLabel('checkbox_1', '同意用户协议');",exCmd:'{\n  "command": "checkbox.setLabel",\n  "targetId": "checkbox_1",\n  "text": "同意用户协议"\n}'}
]);

addDoc('toggle-ctrl', [
  {sig:'switchToggle.getChecked(targetId)', desc:'<span class="desctile">获取开关控件的开关状态</span>',params:[{n:'targetId',t:'string',d:'开关控件 ID'}],ret:'boolean — true=开, false=关',exApi:"var isOn = webviewBridge.api.switchToggle.getChecked('toggle_1');\nconsole.log('开关状态:', isOn);",exCmd:'{\n  "command": "switchToggle.getChecked",\n  "targetId": "toggle_1"\n}'},
  {sig:'switchToggle.setChecked(targetId, checked)', desc:'<span class="desctile">设置开关控件的开关状态</span>',params:[{n:'targetId',t:'string',d:'开关控件 ID'},{n:'checked',t:'boolean',d:'true=开, false=关'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.switchToggle.setChecked('toggle_1', true);",exCmd:'{\n  "command": "switchToggle.setChecked",\n  "targetId": "toggle_1",\n  "checked": true\n}'}
]);

addDoc('combobox', [
  {sig:'comboBox.getValue(targetId)', desc:'<span class="desctile">获取下拉框当前选中项的 value 值</span>',params:[{n:'targetId',t:'string',d:'组合框控件 ID'}],ret:'string — 选中项的 value',exApi:"var val = webviewBridge.api.comboBox.getValue('comboBox_1');\nconsole.log('选中值:', val);",exCmd:'{\n  "command": "comboBox.getValue",\n  "targetId": "comboBox_1"\n}'},
  {sig:'comboBox.setValue(targetId, value)', desc:'<span class="desctile">按 value 设置下拉框选中项</span>',params:[{n:'targetId',t:'string',d:'组合框控件 ID'},{n:'value',t:'string',d:'要选中的 value'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.comboBox.setValue('comboBox_1', 'opt2');",exCmd:'{\n  "command": "comboBox.setValue",\n  "targetId": "comboBox_1",\n  "value": "opt2"\n}'},
  {sig:'comboBox.getText(targetId)', desc:'<span class="desctile">获取下拉框当前选中项的显示文本</span>',params:[{n:'targetId',t:'string',d:'组合框控件 ID'}],ret:'string — 选中项文本',exApi:"var txt = webviewBridge.api.comboBox.getText('comboBox_1');\nconsole.log('显示文本:', txt);",exCmd:'{\n  "command": "comboBox.getText",\n  "targetId": "comboBox_1"\n}'},
  {sig:'comboBox.getIndex(targetId)', desc:'<span class="desctile">获取下拉框当前选中项的索引（从 0 开始）</span>未选中时返回 -1。',params:[{n:'targetId',t:'string',d:'组合框控件 ID'}],ret:'number — 索引，-1 表示未选中',exApi:"var idx = webviewBridge.api.comboBox.getIndex('comboBox_1');\nif (idx >= 0) console.log('选中第', idx, '项');",exCmd:'{\n  "command": "comboBox.getIndex",\n  "targetId": "comboBox_1"\n}'},
  {sig:'comboBox.setIndex(targetId, index)', desc:'<span class="desctile">按索引设置下拉框选中项</span>',params:[{n:'targetId',t:'string',d:'组合框控件 ID'},{n:'index',t:'number',d:'要选中的索引（从 0 开始）'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.comboBox.setIndex('comboBox_1', 2);",exCmd:'{\n  "command": "comboBox.setIndex",\n  "targetId": "comboBox_1",\n  "index": 2\n}'},
  {sig:'comboBox.addItem(targetId, text, value)', desc:'<span class="desctile">向下拉框动态添加一个选项</span>value 默认等于 text。',params:[{n:'targetId',t:'string',d:'组合框控件 ID'},{n:'text',t:'string',d:'显示文本'},{n:'value',t:'string',d:'（可选）选项值，默认等于 text'}],ret:'boolean — 是否成功',exApi:"// 添加选项（value 同 text）\nwebviewBridge.api.comboBox.addItem('comboBox_1', '新选项');\n\n// 添加选项（指定 value）\nwebviewBridge.api.comboBox.addItem('comboBox_1', '北京', 'beijing');",exCmd:'{\n  "command": "comboBox.addItem",\n  "targetId": "comboBox_1",\n  "text": "新选项",\n  "value": "new_opt"\n}'},
  {sig:'comboBox.removeItem(targetId, index)', desc:'<span class="desctile">按索引删除下拉框中的一个选项</span>',params:[{n:'targetId',t:'string',d:'组合框控件 ID'},{n:'index',t:'number',d:'要删除的索引'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.comboBox.removeItem('comboBox_1', 0);",exCmd:'{\n  "command": "comboBox.removeItem",\n  "targetId": "comboBox_1",\n  "index": 0\n}'},
  {sig:'comboBox.clearItems(targetId)', desc:'<span class="desctile">清空下拉框所有选项</span>',params:[{n:'targetId',t:'string',d:'组合框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.comboBox.clearItems('comboBox_1');",exCmd:'{\n  "command": "comboBox.clearItems",\n  "targetId": "comboBox_1"\n}'},
  {sig:'comboBox.getItemCount(targetId)', desc:'<span class="desctile">获取下拉框选项总数</span>',params:[{n:'targetId',t:'string',d:'组合框控件 ID'}],ret:'number — 选项数量',exApi:"var count = webviewBridge.api.comboBox.getItemCount('comboBox_1');\nconsole.log('选项数:', count);",exCmd:'{\n  "command": "comboBox.getItemCount",\n  "targetId": "comboBox_1"\n}'}
]);

addDoc('label', [
  {sig:'label.getText(targetId)', desc:'<span class="desctile">获取文本标签的内容</span>',params:[{n:'targetId',t:'string',d:'标签控件 ID'}],ret:'string — 文本内容',exApi:"var text = webviewBridge.api.label.getText('label_1');\nconsole.log(text);",exCmd:'{\n  "command": "label.getText",\n  "targetId": "label_1"\n}'},
  {sig:'label.setText(targetId, text)', desc:'<span class="desctile">设置文本标签的内容</span>支持图标占位符。',params:[{n:'targetId',t:'string',d:'标签控件 ID'},{n:'text',t:'string',d:'文本内容'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.label.setText('label_1', '[INFO] 数据加载完成');",exCmd:'{\n  "command": "label.setText",\n  "targetId": "label_1",\n  "text": "数据加载完成"\n}'}
]);

addDoc('hyperlink', [
  {sig:'hyperlink.getText(targetId)', desc:'<span class="desctile">获取超链接的显示文本</span>',params:[{n:'targetId',t:'string',d:'超链接控件 ID'}],ret:'string — 链接文本',exApi:"var text = webviewBridge.api.hyperlink.getText('hyperlink_1');\nconsole.log(text);",exCmd:'{\n  "command": "hyperlink.getText",\n  "targetId": "hyperlink_1"\n}'},
  {sig:'hyperlink.setText(targetId, text)', desc:'<span class="desctile">设置超链接的显示文本</span>',params:[{n:'targetId',t:'string',d:'超链接控件 ID'},{n:'text',t:'string',d:'链接文本'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.hyperlink.setText('hyperlink_1', '访问官网');",exCmd:'{\n  "command": "hyperlink.setText",\n  "targetId": "hyperlink_1",\n  "text": "访问官网"\n}'},
  {sig:'hyperlink.getHref(targetId)', desc:'<span class="desctile">获取超链接的 href 地址</span>',params:[{n:'targetId',t:'string',d:'超链接控件 ID'}],ret:'string — URL 地址',exApi:"var url = webviewBridge.api.hyperlink.getHref('hyperlink_1');\nconsole.log('链接地址:', url);",exCmd:'{\n  "command": "hyperlink.getHref",\n  "targetId": "hyperlink_1"\n}'},
  {sig:'hyperlink.setHref(targetId, url)', desc:'<span class="desctile">设置超链接的 href 地址</span>',params:[{n:'targetId',t:'string',d:'超链接控件 ID'},{n:'url',t:'string',d:'URL 地址'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.hyperlink.setHref('hyperlink_1', 'https://example.com');",exCmd:'{\n  "command": "hyperlink.setHref",\n  "targetId": "hyperlink_1",\n  "url": "https://example.com"\n}'}
]);

addDoc('radiogroup', [
  {sig:'radioGroup.getValue(groupName)', desc:'<span class="desctile">获取单选组当前选中的值</span>通过 ID 或 data-name 查找组容器。',params:[{n:'groupName',t:'string',d:'单选组容器 ID 或 data-name'}],ret:'string — 选中项 value',exApi:"var val = webviewBridge.api.radioGroup.getValue('radioGroup_1');\nconsole.log('选中值:', val);",exCmd:'{\n  "command": "radioGroup.getValue",\n  "groupName": "radioGroup_1"\n}'},
  {sig:'radioGroup.setValue(groupName, value)', desc:'<span class="desctile">按 value 设置单选组的选中项</span>',params:[{n:'groupName',t:'string',d:'单选组容器 ID 或 data-name'},{n:'value',t:'string',d:'要选中的 value'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.radioGroup.setValue('radioGroup_1', 'opt2');",exCmd:'{\n  "command": "radioGroup.setValue",\n  "groupName": "radioGroup_1",\n  "value": "opt2"\n}'},
  {sig:'radioGroup.getIndex(groupName)', desc:'<span class="desctile">获取单选组当前选中项的索引</span>未选中返回 -1。',params:[{n:'groupName',t:'string',d:'单选组容器 ID 或 data-name'}],ret:'number — 索引，-1 表示未选中',exApi:"var idx = webviewBridge.api.radioGroup.getIndex('radioGroup_1');\nconsole.log('索引:', idx);",exCmd:'{\n  "command": "radioGroup.getIndex",\n  "groupName": "radioGroup_1"\n}'},
  {sig:'radioGroup.setIndex(groupName, index)', desc:'<span class="desctile">按索引设置单选组的选中项</span>',params:[{n:'groupName',t:'string',d:'单选组容器 ID 或 data-name'},{n:'index',t:'number',d:'索引（从 0 开始）'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.radioGroup.setIndex('radioGroup_1', 0);",exCmd:'{\n  "command": "radioGroup.setIndex",\n  "groupName": "radioGroup_1",\n  "index": 0\n}'},
  {sig:'radioGroup.addOption(groupName, text, value)', desc:'<span class="desctile">向单选组动态添加一个选项</span>生成 class="radiogroup-item" 的 label 元素，自动继承 disabled 状态。',params:[{n:'groupName',t:'string',d:'单选组容器 ID 或 data-name'},{n:'text',t:'string',d:'显示文本'},{n:'value',t:'string',d:'（可选）选项值，默认等于 text'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.radioGroup.addOption('radioGroup_1', '选项C', 'optC');",exCmd:'{\n  "command": "radioGroup.addOption",\n  "groupName": "radioGroup_1",\n  "text": "选项C",\n  "value": "optC"\n}'},
  {sig:'radioGroup.removeOption(groupName, valueOrIndex)', desc:'<span class="desctile">删除单选组中指定选项</span>支持按 value 字符串或数字索引删除。',params:[{n:'groupName',t:'string',d:'单选组容器 ID 或 data-name'},{n:'valueOrIndex',t:'string|number',d:'选项的 value 值或索引'}],ret:'boolean — 是否成功',exApi:"// 按值删除\nwebviewBridge.api.radioGroup.removeOption('radioGroup_1', 'optC');\n\n// 按索引删除\nwebviewBridge.api.radioGroup.removeOption('radioGroup_1', 2);",exCmd:'{\n  "command": "radioGroup.removeOption",\n  "groupName": "radioGroup_1",\n  "valueOrIndex": "optC"\n}'}
]);

// ==================== 进阶控件 ====================
addDoc('progressbar', [
  {sig:'progressBar.getValue(targetId)', desc:'<span class="desctile">获取进度条当前值（0-100）</span>',params:[{n:'targetId',t:'string',d:'进度条控件 ID'}],ret:'number — 当前进度值 (0-100)',exApi:"var val = webviewBridge.api.progressBar.getValue('progressBar_1');\nconsole.log('进度:', val + '%');",exCmd:'{\n  "command": "progressBar.getValue",\n  "targetId": "progressBar_1"\n}'},
  {sig:'progressBar.setValue(targetId, value)', desc:'<span class="desctile">设置进度条的值，自动限制在 0-100 范围内</span>',params:[{n:'targetId',t:'string',d:'进度条控件 ID'},{n:'value',t:'number',d:'进度值 (0-100)'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.progressBar.setValue('progressBar_1', 75);",exCmd:'{\n  "command": "progressBar.setValue",\n  "targetId": "progressBar_1",\n  "value": 75\n}'},
  {sig:'progressBar.increment(targetId, delta)', desc:'<span class="desctile">增加进度条的值</span>delta 默认为 1。',params:[{n:'targetId',t:'string',d:'进度条控件 ID'},{n:'delta',t:'number',d:'（可选）增加量，默认 1'}],ret:'boolean — 是否成功',exApi:"// 增加 5\nwebviewBridge.api.progressBar.increment('progressBar_1', 5);",exCmd:'{\n  "command": "progressBar.increment",\n  "targetId": "progressBar_1",\n  "delta": 5\n}'},
  {sig:'progressBar.decrement(targetId, delta)', desc:'<span class="desctile">减少进度条的值</span>delta 默认为 1。不会低于 0。',params:[{n:'targetId',t:'string',d:'进度条控件 ID'},{n:'delta',t:'number',d:'（可选）减少量，默认 1'}],ret:'boolean — 是否成功',exApi:"// 减少 3\nwebviewBridge.api.progressBar.decrement('progressBar_1', 3);",exCmd:'{\n  "command": "progressBar.decrement",\n  "targetId": "progressBar_1",\n  "delta": 3\n}'},
  {sig:'progressBar.enableClick(targetId)', desc:'<span class="desctile">启用"点击修改进度"功能</span>启用后用户可点击进度条位置来更改进度值。',params:[{n:'targetId',t:'string',d:'进度条控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.progressBar.enableClick('progressBar_1');",exCmd:'{\n  "command": "progressBar.enableClick",\n  "targetId": "progressBar_1"\n}'},
  {sig:'progressBar.disableClick(targetId)', desc:'<span class="desctile">禁用"点击修改进度"功能</span>',params:[{n:'targetId',t:'string',d:'进度条控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.progressBar.disableClick('progressBar_1');",exCmd:'{\n  "command": "progressBar.disableClick",\n  "targetId": "progressBar_1"\n}'},
  {sig:'progressBar.setRange(targetId, min, max)', desc:'<span class="desctile"><span class="status-badge status-pending">🚧 待实现</span> 设置进度条的最小/最大值</span>当前版本为占位函数，无实际操作。',params:[{n:'targetId',t:'string',d:'进度条控件 ID'},{n:'min',t:'number',d:'最小值'},{n:'max',t:'number',d:'最大值'}],ret:'boolean',exApi:"// 当前为占位实现\nwebviewBridge.api.progressBar.setRange('progressBar_1', 0, 1000);",exCmd:'{\n  "command": "progressBar.setRange",\n  "targetId": "progressBar_1",\n  "min": 0,\n  "max": 1000\n}'}
]);

addDoc('datetimepicker', [
  {sig:'dateTimePicker.getValue(targetId)', desc:'<span class="desctile">获取日期时间选择器的当前值</span>',params:[{n:'targetId',t:'string',d:'时间选择器控件 ID'}],ret:'string — 日期时间字符串',exApi:"var dt = webviewBridge.api.dateTimePicker.getValue('datetimePicker_1');\nconsole.log('选择的时间:', dt);",exCmd:'{\n  "command": "dateTimePicker.getValue",\n  "targetId": "datetimePicker_1"\n}'},
  {sig:'dateTimePicker.setValue(targetId, datetime)', desc:'<span class="desctile">设置日期时间选择器的值</span>',params:[{n:'targetId',t:'string',d:'时间选择器控件 ID'},{n:'datetime',t:'string',d:'日期时间字符串，如 "2025-01-15T10:30"'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dateTimePicker.setValue('datetimePicker_1', '2025-06-15T14:30');",exCmd:'{\n  "command": "dateTimePicker.setValue",\n  "targetId": "datetimePicker_1",\n  "datetime": "2025-06-15T14:30"\n}'}
]);

addDoc('iconbutton', [
  {sig:'iconButton.getText(targetId)', desc:'<span class="desctile">获取图标按钮的文本内容</span>优先查找内部的 span 元素，若不存在则取按钮中非图标子元素的纯文本。',params:[{n:'targetId',t:'string',d:'图标按钮控件 ID'}],ret:'string — 按钮文本',exApi:"var text = webviewBridge.api.iconButton.getText('iconButton_1');\nconsole.log(text);",exCmd:'{\n  "command": "iconButton.getText",\n  "targetId": "iconButton_1"\n}'},
  {sig:'iconButton.setText(targetId, text)', desc:'<span class="desctile">设置图标按钮的文本内容</span>更新 span 元素的文本，若不存在则自动创建 span 并插入到图标后面。',params:[{n:'targetId',t:'string',d:'图标按钮控件 ID'},{n:'text',t:'string',d:'按钮文本'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.iconButton.setText('iconButton_1', '[SAVE] 保存');",exCmd:'{\n  "command": "iconButton.setText",\n  "targetId": "iconButton_1",\n  "text": "保存"\n}'},
  {sig:'iconButton.getIconHtml(targetId)', desc:'<span class="desctile">获取图标元素的 outerHTML</span>优先查找 i、svg、img 等图标元素（第一个非 SPAN 子元素），返回其 outerHTML。',params:[{n:'targetId',t:'string',d:'图标按钮控件 ID'}],ret:'string — 图标 HTML',exApi:"var icon = webviewBridge.api.iconButton.getIconHtml('iconButton_1');\nconsole.log('图标:', icon);",exCmd:'{\n  "command": "iconButton.getIconHtml",\n  "targetId": "iconButton_1"\n}'},
  {sig:'iconButton.setIconHtml(targetId, html)', desc:'<span class="desctile">设置图标按钮的图标</span>移除旧图标元素，在 span 前面插入新的图标 HTML（支持 SVG/emoji/占位符）。',params:[{n:'targetId',t:'string',d:'图标按钮控件 ID'},{n:'html',t:'string',d:'图标 HTML'}],ret:'boolean — 是否成功',exApi:"// 设置 emoji 图标\nwebviewBridge.api.iconButton.setIconHtml('iconButton_1', '\\u{1F4BE}');\n\n// 设置  SVG 图标\nwebviewBridge.api.iconButton.setIconHtml('iconButton_1', '<svg>...</svg>');",exCmd:'{\n  "command": "iconButton.setIconHtml",\n  "targetId": "iconButton_1",\n  "html": "💾"\n}'}
]);

addDoc('imagebox', [
  {sig:'imageBox.getSrc(targetId)', desc:'<span class="desctile">获取图片框的图片源地址</span>若无 img 元素则返回空字符串。',params:[{n:'targetId',t:'string',d:'图片框控件 ID'}],ret:'string — 图片 URL',exApi:"var src = webviewBridge.api.imageBox.getSrc('imageBox_1');\nconsole.log('图片地址:', src);",exCmd:'{\n  "command": "imageBox.getSrc",\n  "targetId": "imageBox_1"\n}'},
  {sig:'imageBox.setSrc(targetId, url)', desc:'<span class="desctile">设置图片框的图片源地址</span>若无 img 元素则自动创建一个并设置默认样式。',params:[{n:'targetId',t:'string',d:'图片框控件 ID'},{n:'url',t:'string',d:'图片 URL'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.imageBox.setSrc('imageBox_1', 'https://example.com/photo.jpg');",exCmd:'{\n  "command": "imageBox.setSrc",\n  "targetId": "imageBox_1",\n  "url": "https://example.com/photo.jpg"\n}'},
  {sig:'imageBox.getFit(targetId)', desc:'<span class="desctile">获取图片的填充模式</span>从 data-fit 属性或 style.objectFit 读取，默认为 "cover"。若 img 不存在返回空。',params:[{n:'targetId',t:'string',d:'图片框控件 ID'}],ret:'string — fill|contain|cover|none|scale-down',exApi:"var fit = webviewBridge.api.imageBox.getFit('imageBox_1');\nconsole.log('填充模式:', fit);",exCmd:'{\n  "command": "imageBox.getFit",\n  "targetId": "imageBox_1"\n}'},
  {sig:'imageBox.setFit(targetId, fitMode)', desc:'<span class="desctile">设置图片的填充模式</span>若无 img 元素则自动创建。支持 fill、contain、cover、none-top-left、none-center。',params:[{n:'targetId',t:'string',d:'图片框控件 ID'},{n:'fitMode',t:'string',d:'fill | contain | cover | none-top-left | none-center'}],ret:'boolean — 是否成功',exApi:"// 设置填充模式\nwebviewBridge.api.imageBox.setFit('imageBox_1', 'contain');\n\n// 完整覆盖\nwebviewBridge.api.imageBox.setFit('imageBox_1', 'cover');",exCmd:'{\n  "command": "imageBox.setFit",\n  "targetId": "imageBox_1",\n  "fitMode": "contain"\n}'}
]);

addDoc('logbox', [
  {sig:'logBox.addLog(targetId, text, color)', desc:'<span class="desctile">向日志框添加一条日志</span>可指定颜色，默认为黑色。',params:[{n:'targetId',t:'string',d:'日志框控件 ID'},{n:'text',t:'string',d:'日志文本'},{n:'color',t:'string',d:'（可选）文本颜色，默认 #000000'}],ret:'boolean — 是否成功',exApi:"// 普通日志\nwebviewBridge.api.logBox.addLog('logOutput_1', '服务启动成功');\n\n// 彩色日志\nwebviewBridge.api.logBox.addLog('logOutput_1', '错误：连接失败', '#ff0000');\nwebviewBridge.api.logBox.addLog('logOutput_1', '警告：磁盘空间不足', '#ff8800');",exCmd:'{\n  "command": "logBox.addLog",\n  "targetId": "logOutput_1",\n  "text": "错误：连接失败",\n  "color": "#ff0000"\n}'},
  {sig:'logBox.clearLog(targetId)', desc:'<span class="desctile">清空日志框所有日志</span>',params:[{n:'targetId',t:'string',d:'日志框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.logBox.clearLog('logOutput_1');",exCmd:'{\n  "command": "logBox.clearLog",\n  "targetId": "logOutput_1"\n}'},
  {sig:'logBox.getLogCount(targetId)', desc:'<span class="desctile">获取日志框中的日志条数</span>',params:[{n:'targetId',t:'string',d:'日志框控件 ID'}],ret:'number — 日志条数',exApi:"var count = webviewBridge.api.logBox.getLogCount('logOutput_1');\nconsole.log('日志数:', count);",exCmd:'{\n  "command": "logBox.getLogCount",\n  "targetId": "logOutput_1"\n}'}
]);

// ==================== 容器控件 ====================
addDoc('listBox', [
  {sig:'listBox.addItem(targetId, text)', desc:'<span class="desctile">向列表框添加一个文本项</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'text',t:'string',d:'列表项文本'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.addItem('listBox_1', '新项目');",exCmd:'{\n  "command": "listBox.addItem",\n  "targetId": "listBox_1",\n  "text": "新项目"\n}'},
  {sig:'listBox.addItemWithHtml(targetId, html)', desc:'<span class="desctile">向列表框添加一个 HTML 格式的列表项</span>支持图标等富文本。若控件启用了复选框模式，自动保留复选框结构。',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'html',t:'string',d:'列表项 HTML 字符串'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.addItemWithHtml('listBox_1', '<b>粗体</b> <span style=\"color:red\">红色</span>');",exCmd:'{\n  "command": "listBox.addItemWithHtml",\n  "targetId": "listBox_1",\n  "html": "<b>粗体</b>"\n}'},
  {sig:'listBox.removeItem(targetId, index)', desc:'<span class="desctile">按索引删除列表框中指定项</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'index',t:'number',d:'要删除的项索引'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.removeItem('listBox_1', 0);",exCmd:'{\n  "command": "listBox.removeItem",\n  "targetId": "listBox_1",\n  "index": 0\n}'},
  {sig:'listBox.clearItems(targetId)', desc:'<span class="desctile">清空列表框所有项目</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.clearItems('listBox_1');",exCmd:'{\n  "command": "listBox.clearItems",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.getItemCount(targetId)', desc:'<span class="desctile">获取列表框项目总数</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'number — 项目数量',exApi:"var count = webviewBridge.api.listBox.getItemCount('listBox_1');\nconsole.log('项数:', count);",exCmd:'{\n  "command": "listBox.getItemCount",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.setItemText(targetId, index, text)', desc:'<span class="desctile">设置列表框中指定项的文本</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'index',t:'number',d:'项索引'},{n:'text',t:'string',d:'新文本'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.setItemText('listBox_1', 2, '修改后的文本');",exCmd:'{\n  "command": "listBox.setItemText",\n  "targetId": "listBox_1",\n  "index": 2,\n  "text": "修改后的文本"\n}'},
  {sig:'listBox.getItemText(targetId, index)', desc:'<span class="desctile">获取列表框中指定项的文本</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'index',t:'number',d:'项索引'}],ret:'string — 项文本',exApi:"var text = webviewBridge.api.listBox.getItemText('listBox_1', 1);\nconsole.log('第2项:', text);",exCmd:'{\n  "command": "listBox.getItemText",\n  "targetId": "listBox_1",\n  "index": 1\n}'},
  {sig:'listBox.setItemChecked(targetId, index, checked)', desc:'<span class="desctile">设置列表框中指定项的勾选状态（需列表支持复选框）</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'index',t:'number',d:'项索引'},{n:'checked',t:'boolean',d:'true=勾选'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.setItemChecked('listBox_1', 0, true);",exCmd:'{\n  "command": "listBox.setItemChecked",\n  "targetId": "listBox_1",\n  "index": 0,\n  "checked": true\n}'},
  {sig:'listBox.getItemChecked(targetId, index)', desc:'<span class="desctile">获取列表框中指定项的勾选状态</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'index',t:'number',d:'项索引'}],ret:'boolean — 是否勾选',exApi:"if (webviewBridge.api.listBox.getItemChecked('listBox_1', 0)) {\n  console.log('第1项已勾选');\n}",exCmd:'{\n  "command": "listBox.getItemChecked",\n  "targetId": "listBox_1",\n  "index": 0\n}'},
  {sig:'listBox.selectAll(targetId)', desc:'<span class="desctile">全选列表框中所有带复选框的项</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.selectAll('listBox_1');",exCmd:'{\n  "command": "listBox.selectAll",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.toggleAll(targetId)', desc:'<span class="desctile">反选列表框中所有带复选框的项</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.toggleAll('listBox_1');",exCmd:'{\n  "command": "listBox.toggleAll",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.deleteSelected(targetId)', desc:'<span class="desctile">删除列表框中所有已勾选的项</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.deleteSelected('listBox_1');",exCmd:'{\n  "command": "listBox.deleteSelected",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.selectItem(targetId, index)', desc:'<span class="desctile">视觉高亮指定索引的项（添加 item-selected 类名，不改变复选框状态）</span>先清除所有项的 item-selected 再设置目标项。与设计区 ListBoxManager 一致。',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'index',t:'number',d:'项索引'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.selectItem('listBox_1', 2);",exCmd:'{\n  "command": "listBox.selectItem",\n  "targetId": "listBox_1",\n  "index": 2\n}'},
  {sig:'listBox.deselectItem(targetId, index)', desc:'<span class="desctile">取消指定项的视觉高亮（移除 item-selected 类名）</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'index',t:'number',d:'项索引'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.deselectItem('listBox_1', 2);",exCmd:'{\n  "command": "listBox.deselectItem",\n  "targetId": "listBox_1",\n  "index": 2\n}'},
  {sig:'listBox.getSelectedItemId(targetId)', desc:'<span class="desctile">获取第一个选中项的索引</span>无选中项返回 -1。',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'number — 选中项索引，-1 表示无',exApi:"var idx = webviewBridge.api.listBox.getSelectedItemId('listBox_1');\nif (idx >= 0) console.log('选中项:', idx);",exCmd:'{\n  "command": "listBox.getSelectedItemId",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.getHighlightedItem(targetId)', desc:'<span class="desctile">获取当前高亮的列表项（单击或右键选中）</span>返回高亮项的索引、文本和 DOM 引用。无高亮项返回 null。与右键菜单配合使用，先右键高亮再通过该 API 获取。',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'object|null — { index, text, element } 或 null',exApi:"var item = webviewBridge.api.listBox.getHighlightedItem('listBox_1');\nif (item) {\n  console.log('高亮项索引:', item.index);\n  console.log('高亮项文本:', item.text);\n}",exCmd:'{\n  "command": "listBox.getHighlightedItem",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.setAlwaysShowSelection(targetId, enabled)', desc:'<span class="desctile">设置是否始终显示选中高亮</span>设置容器 data-always-show-selection 属性，控制失去焦点时是否保留高亮。',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'enabled',t:'boolean',d:'true=始终显示'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.setAlwaysShowSelection('listBox_1', true);",exCmd:'{\n  "command": "listBox.setAlwaysShowSelection",\n  "targetId": "listBox_1",\n  "enabled": true\n}'},
  {sig:'listBox.getAlwaysShowSelection(targetId)', desc:'<span class="desctile">获取是否始终显示选中高亮</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'boolean — 是否始终显示',exApi:"var show = webviewBridge.api.listBox.getAlwaysShowSelection('listBox_1');\nconsole.log('始终显示:', show);",exCmd:'{\n  "command": "listBox.getAlwaysShowSelection",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.showCheckbox(targetId, show)', desc:'<span class="desctile">显示/隐藏列表项前的复选框列</span>设置 data-show-checkbox 属性。DOM 中无复选框时自动为每个 .list-item 动态创建；已存在则控制 display 显隐。后续 addItem 会根据该属性自动生成复选框。',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'show',t:'boolean',d:'true=显示, false=隐藏'}],ret:'boolean — 是否成功',exApi:"// 显示复选框（无则自动创建）\nwebviewBridge.api.listBox.showCheckbox('listBox_1', true);\n\n// 隐藏复选框\nwebviewBridge.api.listBox.showCheckbox('listBox_1', false);",exCmd:'{\n  "command": "listBox.showCheckbox",\n  "targetId": "listBox_1",\n  "show": true\n}'},
  {sig:'listBox.enableDblClickEdit(targetId)', desc:'<span class="desctile">启用列表框的双击编辑功能</span>启用后双击列表项可内联编辑文本。',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.enableDblClickEdit('listBox_1');",exCmd:'{\n  "command": "listBox.enableDblClickEdit",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.disableDblClickEdit(targetId)', desc:'<span class="desctile">禁用列表框的双击编辑功能</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.disableDblClickEdit('listBox_1');",exCmd:'{\n  "command": "listBox.disableDblClickEdit",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.setItemChecked(targetId, index, checked)', desc:'<span class="desctile">设置指定列表项的勾选状态</span>通过 data-item-index 定位复选框。',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'index',t:'number',d:'列表项索引（从 0 开始）'},{n:'checked',t:'boolean',d:'true=勾选'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.setItemChecked('listBox_1', 0, true);",exCmd:'{\n  "command": "listBox.setItemChecked",\n  "targetId": "listBox_1",\n  "index": 0,\n  "checked": true\n}'},
  {sig:'listBox.isItemChecked(targetId, index)', desc:'<span class="desctile">获取指定列表项的勾选状态</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'},{n:'index',t:'number',d:'列表项索引'}],ret:'boolean — 是否勾选',exApi:"if (webviewBridge.api.listBox.isItemChecked('listBox_1', 2)) {\n  console.log('第 3 项已勾选');\n}",exCmd:'{\n  "command": "listBox.isItemChecked",\n  "targetId": "listBox_1",\n  "index": 2\n}'},
  {sig:'listBox.getCheckedItems(targetId)', desc:'<span class="desctile">获取所有已勾选列表项的索引数组</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'number[] — 已勾选项索引数组',exApi:"var checked = webviewBridge.api.listBox.getCheckedItems('listBox_1');\nconsole.log('已勾选索引:', checked);",exCmd:'{\n  "command": "listBox.getCheckedItems",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.checkAll(targetId)', desc:'<span class="desctile">全选列表框所有项的复选框</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.checkAll('listBox_1');",exCmd:'{\n  "command": "listBox.checkAll",\n  "targetId": "listBox_1"\n}'},
  {sig:'listBox.uncheckAll(targetId)', desc:'<span class="desctile">取消全选列表框所有项的复选框</span>',params:[{n:'targetId',t:'string',d:'列表框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.listBox.uncheckAll('listBox_1');",exCmd:'{\n  "command": "listBox.uncheckAll",\n  "targetId": "listBox_1"\n}'}
]);

addDoc('treeview', [
  {sig:'treeView.addNode(targetId, parentNodeId, newNode)', desc:'<span class="desctile">向树形框添加子节点</span>若指定父节点，则作为其子节点添加；父节点会自动展开并切换图标为文件夹。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'parentNodeId',t:'string|null',d:'父节点 ID，null 添加到根级'},{n:'newNode',t:'object',d:'{id?, text, children?, expanded?}'}],ret:'boolean — 是否成功',exApi:"// 添加根节点\nwebviewBridge.api.treeView.addNode('treeView_1', null, {\n  text: '新文件夹',\n  children: []\n});\n\n// 添加子节点\nwebviewBridge.api.treeView.addNode('treeView_1', 'node_1', {\n  text: '子文件'\n});",exCmd:'{\n  "command": "treeView.addNode",\n  "targetId": "treeView_1",\n  "parentNodeId": null,\n  "newNode": { "text": "新节点" }\n}'},
  {sig:'treeView.removeNode(targetId, nodeId)', desc:'<span class="desctile">从树形框中移除指定节点（及其所有子节点）</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'要删除的节点 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.removeNode('treeView_1', 'node_2');",exCmd:'{\n  "command": "treeView.removeNode",\n  "targetId": "treeView_1",\n  "nodeId": "node_2"\n}'},
  {sig:'treeView.updateNode(targetId, nodeId, newText)', desc:'<span class="desctile">更新树节点的文本内容</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'},{n:'newText',t:'string',d:'新文本'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.updateNode('treeView_1', 'node_1', '重命名后的节点');",exCmd:'{\n  "command": "treeView.updateNode",\n  "targetId": "treeView_1",\n  "nodeId": "node_1",\n  "newText": "重命名后的节点"\n}'},
  {sig:'treeView.getNodeText(targetId, nodeId)', desc:'<span class="desctile">获取树节点的文本内容</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'}],ret:'string — 节点文本',exApi:"var text = webviewBridge.api.treeView.getNodeText('treeView_1', 'node_1');\nconsole.log(text);",exCmd:'{\n  "command": "treeView.getNodeText",\n  "targetId": "treeView_1",\n  "nodeId": "node_1"\n}'},
  {sig:'treeView.expandNode(targetId, nodeId)', desc:'<span class="desctile">展开树节点，显示其子节点</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.expandNode('treeView_1', 'node_1');",exCmd:'{\n  "command": "treeView.expandNode",\n  "targetId": "treeView_1",\n  "nodeId": "node_1"\n}'},
  {sig:'treeView.collapseNode(targetId, nodeId)', desc:'<span class="desctile">折叠树节点，隐藏其子节点</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.collapseNode('treeView_1', 'node_1');",exCmd:'{\n  "command": "treeView.collapseNode",\n  "targetId": "treeView_1",\n  "nodeId": "node_1"\n}'},
  {sig:'treeView.expandAll(targetId)', desc:'<span class="desctile">展开树形框所有节点</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.expandAll('treeView_1');",exCmd:'{\n  "command": "treeView.expandAll",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.collapseAll(targetId)', desc:'<span class="desctile">折叠树形框所有节点</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.collapseAll('treeView_1');",exCmd:'{\n  "command": "treeView.collapseAll",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.selectNode(targetId, nodeId)', desc:'<span class="desctile">选中指定树节点（添加 visual 高亮样式）</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.selectNode('treeView_1', 'node_2');",exCmd:'{\n  "command": "treeView.selectNode",\n  "targetId": "treeView_1",\n  "nodeId": "node_2"\n}'},
  {sig:'treeView.getSelectedNode(targetId)', desc:'<span class="desctile">获取当前选中的树节点 ID</span>无选中时返回空字符串。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'string — 选中节点 ID，空字符串表示无',exApi:"var nodeId = webviewBridge.api.treeView.getSelectedNode('treeView_1');\nif (nodeId) console.log('选中:', nodeId);",exCmd:'{\n  "command": "treeView.getSelectedNode",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.getHighlightedNode(targetId)', desc:'<span class="desctile">获取当前高亮的树节点（单击或右键选中）</span>返回节点 ID、文本和 DOM 引用。无高亮节点返回 null。与右键菜单配合使用，先右键高亮再通过该 API 获取。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'object|null — { nodeId, text, element } 或 null',exApi:"var node = webviewBridge.api.treeView.getHighlightedNode('treeView_1');\nif (node) {\n  console.log('高亮节点ID:', node.nodeId);\n  console.log('高亮节点文本:', node.text);\n}",exCmd:'{\n  "command": "treeView.getHighlightedNode",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.deselectNode(targetId, nodeId)', desc:'<span class="desctile">取消指定树节点的选中高亮</span>移除该节点的 .tree-node-content .selected 类名。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.deselectNode('treeView_1', 'node_2');",exCmd:'{\n  "command": "treeView.deselectNode",\n  "targetId": "treeView_1",\n  "nodeId": "node_2"\n}'},
  {sig:'treeView.clearSelection(targetId)', desc:'<span class="desctile">清除树形框当前的选中高亮</span>移除 .tree-node-content 上的 .selected 类名。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.clearSelection('treeView_1');",exCmd:'{\n  "command": "treeView.clearSelection",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.setAlwaysShowSelection(targetId, enabled)', desc:'<span class="desctile">设置是否始终显示选中高亮</span>设置容器 data-always-show-selection 属性，控制点击其他控件时是否保留当前选中高亮。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'enabled',t:'boolean',d:'true=始终显示'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.setAlwaysShowSelection('treeView_1', true);",exCmd:'{\n  "command": "treeView.setAlwaysShowSelection",\n  "targetId": "treeView_1",\n  "enabled": true\n}'},
  {sig:'treeView.getAlwaysShowSelection(targetId)', desc:'<span class="desctile">获取是否始终显示选中高亮</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — 是否始终显示',exApi:"var show = webviewBridge.api.treeView.getAlwaysShowSelection('treeView_1');\nconsole.log('始终显示:', show);",exCmd:'{\n  "command": "treeView.getAlwaysShowSelection",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.enableNodeEdit(targetId, nodeId)', desc:'<span class="desctile">启用指定节点的内联编辑（设置 contenteditable="true"）</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.enableNodeEdit('treeView_1', 'node_1');",exCmd:'{\n  "command": "treeView.enableNodeEdit",\n  "targetId": "treeView_1",\n  "nodeId": "node_1"\n}'},
  {sig:'treeView.disableNodeEdit(targetId, nodeId)', desc:'<span class="desctile">禁用指定节点的内联编辑（移除 contenteditable）</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.disableNodeEdit('treeView_1', 'node_1');",exCmd:'{\n  "command": "treeView.disableNodeEdit",\n  "targetId": "treeView_1",\n  "nodeId": "node_1"\n}'},
  {sig:'treeView.enableAllEdit(targetId)', desc:'<span class="desctile">启用整个树形框的编辑功能</span>设置容器 data-editable="true"，同时给所有 .tree-label 设置 contenteditable="true"。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.enableAllEdit('treeView_1');",exCmd:'{\n  "command": "treeView.enableAllEdit",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.disableAllEdit(targetId)', desc:'<span class="desctile">禁用整个树形框的编辑功能</span>设置容器 data-editable="false"，同时移除所有 .tree-label 的 contenteditable 属性。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.disableAllEdit('treeView_1');",exCmd:'{\n  "command": "treeView.disableAllEdit",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.isAllEditEnabled(targetId)', desc:'<span class="desctile">获取整个树形框的编辑功能状态</span>读取容器 data-editable 属性值。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — true=已启用',exApi:"if (webviewBridge.api.treeView.isAllEditEnabled('treeView_1')) {\n  console.log('编辑已启用');\n}",exCmd:'{\n  "command": "treeView.isAllEditEnabled",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.getNodeLevel(targetId, nodeId)', desc:'<span class="desctile">获取树节点的层级深度（根节点为 0）</span>未找到返回 -1。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'}],ret:'number — 层级，-1 表示未找到',exApi:"var lvl = webviewBridge.api.treeView.getNodeLevel('treeView_1', 'node_2');\nconsole.log('层级:', lvl);",exCmd:'{\n  "command": "treeView.getNodeLevel",\n  "targetId": "treeView_1",\n  "nodeId": "node_2"\n}'},
  {sig:'treeView.clearTree(targetId)', desc:'<span class="desctile">清空整个树形框（所有节点）</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.clearTree('treeView_1');",exCmd:'{\n  "command": "treeView.clearTree",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.showCheckbox(targetId, show)', desc:'<span class="desctile">显示/隐藏树形框节点的复选框</span>设置 data-show-checkbox 属性。DOM 中无复选框时自动为每个 .tree-node-content 动态创建；已存在则控制显隐。后续 addNode 会根据该属性自动生成复选框。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'show',t:'boolean',d:'true=显示, false=隐藏'}],ret:'boolean — 是否成功',exApi:"// 显示复选框（无则自动创建）\nwebviewBridge.api.treeView.showCheckbox('treeView_1', true);\n\n// 隐藏复选框\nwebviewBridge.api.treeView.showCheckbox('treeView_1', false);",exCmd:'{\n  "command": "treeView.showCheckbox",\n  "targetId": "treeView_1",\n  "show": true\n}'},
  {sig:'treeView.isCheckboxVisible(targetId)', desc:'<span class="desctile">获取树形框的复选框显示状态</span>读取容器 data-show-checkbox 属性值。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — true=显示',exApi:"if (webviewBridge.api.treeView.isCheckboxVisible('treeView_1')) {\n  console.log('复选框已显示');\n}",exCmd:'{\n  "command": "treeView.isCheckboxVisible",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.getCheckedNodes(targetId)', desc:'<span class="desctile">获取所有已勾选节点的 ID 数组</span>返回已勾选复选框的节点 ID 列表。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'string[] — 已勾选节点 ID 数组',exApi:"var checkedIds = webviewBridge.api.treeView.getCheckedNodes('treeView_1');\nconsole.log('已勾选节点:', checkedIds);",exCmd:'{\n  "command": "treeView.getCheckedNodes",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.setNodeChecked(targetId, nodeId, checked)', desc:'<span class="desctile">设置指定树节点的勾选状态（级联勾选）</span>勾选父节点时自动级联勾选其所有子节点；取消勾选时亦然。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'},{n:'checked',t:'boolean',d:'true=勾选（级联子节点）'}],ret:'boolean — 是否成功',exApi:"// 勾选父节点，所有子节点自动勾选\nwebviewBridge.api.treeView.setNodeChecked('treeView_1', 'node_1', true);",exCmd:'{\n  "command": "treeView.setNodeChecked",\n  "targetId": "treeView_1",\n  "nodeId": "node_1",\n  "checked": true\n}'},
  {sig:'treeView.isNodeChecked(targetId, nodeId)', desc:'<span class="desctile">获取指定树节点的勾选状态</span>',params:[{n:'targetId',t:'string',d:'树形框控件 ID'},{n:'nodeId',t:'string',d:'节点 ID'}],ret:'boolean — 是否勾选',exApi:"if (webviewBridge.api.treeView.isNodeChecked('treeView_1', 'node_2')) {\n  console.log('node_2 已勾选');\n}",exCmd:'{\n  "command": "treeView.isNodeChecked",\n  "targetId": "treeView_1",\n  "nodeId": "node_2"\n}'},
  {sig:'treeView.checkAll(targetId)', desc:'<span class="desctile">全选树形框所有节点的复选框</span>将所有可见节点的复选框设为勾选状态。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.checkAll('treeView_1');",exCmd:'{\n  "command": "treeView.checkAll",\n  "targetId": "treeView_1"\n}'},
  {sig:'treeView.uncheckAll(targetId)', desc:'<span class="desctile">取消全选树形框所有节点的复选框</span>将所有可见节点的复选框设为未勾选状态。',params:[{n:'targetId',t:'string',d:'树形框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.treeView.uncheckAll('treeView_1');",exCmd:'{\n  "command": "treeView.uncheckAll",\n  "targetId": "treeView_1"\n}'}
]);

addDoc('datagrid', [
  {sig:'dataGrid.addRow(targetId, rowData, insertIndex)', desc:'<span class="desctile">向数据表格添加一行</span>rowData 包含 cells 对象（key-value 对应列名和值）。单元格文本中的图标占位符（如 [OK]）自动解析为 emoji 显示，原始占位符保存在 data-original-text 属性中。可指定插入位置。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowData',t:'object',d:'{id?, cells:{colKey:value,...}}'},{n:'insertIndex',t:'number',d:'（可选）插入位置，默认末尾'}],ret:'boolean — 是否成功',exApi:"// 在末尾添加行（支持图标占位符）\nwebviewBridge.api.dataGrid.addRow('dataGrid_1', {\n  cells: { name: '张三', status: '[OK]完成', age: '28' }\n});\n\n// 在索引 2 处插入\nwebviewBridge.api.dataGrid.addRow('dataGrid_1', {\n  id: 'row_new',\n  cells: { name: '李四', age: '32' }\n}, 2);",exCmd:'{\n  "command": "dataGrid.addRow",\n  "targetId": "dataGrid_1",\n  "rowData": { "cells": { "name": "张三", "status": "[OK]完成", "age": "28" } }\n}'},
  {sig:'dataGrid.removeRow(targetId, rowIndex)', desc:'<span class="desctile">按索引删除数据表格的一行</span>自动重新索引。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.removeRow('dataGrid_1', 0);",exCmd:'{\n  "command": "dataGrid.removeRow",\n  "targetId": "dataGrid_1",\n  "rowIndex": 0\n}'},
  {sig:'dataGrid.getRowCount(targetId)', desc:'<span class="desctile">获取数据表格的总行数</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'number — 行数',exApi:"var count = webviewBridge.api.dataGrid.getRowCount('dataGrid_1');\nconsole.log('行数:', count);",exCmd:'{\n  "command": "dataGrid.getRowCount",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.setCellValue(targetId, rowIndex, columnKey, value)', desc:'<span class="desctile">按列名设置指定单元格的值</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'},{n:'columnKey',t:'string',d:'列名（data-col-key）'},{n:'value',t:'string',d:'单元格值'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.setCellValue('dataGrid_1', 0, 'name', '王五');",exCmd:'{\n  "command": "dataGrid.setCellValue",\n  "targetId": "dataGrid_1",\n  "rowIndex": 0,\n  "columnKey": "name",\n  "value": "王五"\n}'},
  {sig:'dataGrid.getCellValue(targetId, rowIndex, columnKey)', desc:'<span class="desctile">按列名获取指定单元格的值</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'},{n:'columnKey',t:'string',d:'列名'}],ret:'string — 单元格值',exApi:"var name = webviewBridge.api.dataGrid.getCellValue('dataGrid_1', 0, 'name');\nconsole.log('姓名:', name);",exCmd:'{\n  "command": "dataGrid.getCellValue",\n  "targetId": "dataGrid_1",\n  "rowIndex": 0,\n  "columnKey": "name"\n}'},
  {sig:'dataGrid.setCellValueByIndex(targetId, rowIndex, colIndex, value)', desc:'<span class="desctile">按列索引设置单元格值（从第 0 列数据列开始，跳过复选框列）</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'},{n:'colIndex',t:'number',d:'列索引（跳过复选框列）'},{n:'value',t:'string',d:'单元格值'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.setCellValueByIndex('dataGrid_1', 1, 0, '赵六');",exCmd:'{\n  "command": "dataGrid.setCellValueByIndex",\n  "targetId": "dataGrid_1",\n  "rowIndex": 1,\n  "colIndex": 0,\n  "value": "赵六"\n}'},
  {sig:'dataGrid.getCellValueByIndex(targetId, rowIndex, colIndex)', desc:'<span class="desctile">按列索引获取单元格值</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'},{n:'colIndex',t:'number',d:'列索引'}],ret:'string — 单元格值',exApi:"var val = webviewBridge.api.dataGrid.getCellValueByIndex('dataGrid_1', 0, 1);\nconsole.log(val);",exCmd:'{\n  "command": "dataGrid.getCellValueByIndex",\n  "targetId": "dataGrid_1",\n  "rowIndex": 0,\n  "colIndex": 1\n}'},
  {sig:'dataGrid.setRowData(targetId, rowIndex, rowData)', desc:'<span class="desctile">批量设置一整行的数据</span>rowData.cells 中的每个 key 对应一列。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'},{n:'rowData',t:'object',d:'{cells:{colKey:value,...}}'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.setRowData('dataGrid_1', 0, {\n  cells: { name: '孙七', age: '25', email: 'sun@test.com' }\n});",exCmd:'{\n  "command": "dataGrid.setRowData",\n  "targetId": "dataGrid_1",\n  "rowIndex": 0,\n  "rowData": { "cells": { "name": "孙七" } }\n}'},
  {sig:'dataGrid.getRowData(targetId, rowIndex)', desc:'<span class="desctile">获取一整行的数据</span>返回包含 id、cells 对象和 selected 状态。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'}],ret:'{id, cells, selected} | null',exApi:"var row = webviewBridge.api.dataGrid.getRowData('dataGrid_1', 0);\nif (row) {\n  console.log('ID:', row.id);\n  console.log('数据:', row.cells);\n  console.log('选中:', row.selected);\n}",exCmd:'{\n  "command": "dataGrid.getRowData",\n  "targetId": "dataGrid_1",\n  "rowIndex": 0\n}'},
  {sig:'dataGrid.clearRows(targetId)', desc:'<span class="desctile">清空数据表格所有行</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.clearRows('dataGrid_1');",exCmd:'{\n  "command": "dataGrid.clearRows",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.setRowChecked(targetId, rowIndex, checked)', desc:'<span class="desctile">设置指定行的勾选状态（勾选时自动添加 focused 样式）</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'},{n:'checked',t:'boolean',d:'true=勾选'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.setRowChecked('dataGrid_1', 0, true);",exCmd:'{\n  "command": "dataGrid.setRowChecked",\n  "targetId": "dataGrid_1",\n  "rowIndex": 0,\n  "checked": true\n}'},
  {sig:'dataGrid.getRowChecked(targetId, rowIndex)', desc:'<span class="desctile">获取指定行的勾选状态</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'}],ret:'boolean — 是否勾选',exApi:"if (webviewBridge.api.dataGrid.getRowChecked('dataGrid_1', 0)) {\n  console.log('第1行已选中');\n}",exCmd:'{\n  "command": "dataGrid.getRowChecked",\n  "targetId": "dataGrid_1",\n  "rowIndex": 0\n}'},
  {sig:'dataGrid.selectAllRows(targetId)', desc:'<span class="desctile">全选数据表格所有行（同步更新表头全选框）</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.selectAllRows('dataGrid_1');",exCmd:'{\n  "command": "dataGrid.selectAllRows",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.toggleAllRows(targetId)', desc:'<span class="desctile">反选数据表格所有行（全选→全不选，部分→全选）</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.toggleAllRows('dataGrid_1');",exCmd:'{\n  "command": "dataGrid.toggleAllRows",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.getSelectedRows(targetId)', desc:'<span class="desctile">获取所有已勾选行的索引数组</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'number[] — 选中行索引数组',exApi:"var selected = webviewBridge.api.dataGrid.getSelectedRows('dataGrid_1');\nconsole.log('选中行:', selected); // [0, 2, 5]",exCmd:'{\n  "command": "dataGrid.getSelectedRows",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.getSelectedRowCount(targetId)', desc:'<span class="desctile">获取已勾选行的数量</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'number — 选中行数',exApi:"var count = webviewBridge.api.dataGrid.getSelectedRowCount('dataGrid_1');\nconsole.log('选中数:', count);",exCmd:'{\n  "command": "dataGrid.getSelectedRowCount",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.getHighlightedRow(targetId)', desc:'<span class="desctile">获取当前高亮的行（单击或右键选中）</span>返回高亮行的索引、各单元格文本数组和 DOM 引用。无高亮行返回 null。与右键菜单配合使用，先右键高亮再通过该 API 获取。',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'object|null — { index, cells, element } 或 null',exApi:"var row = webviewBridge.api.dataGrid.getHighlightedRow('dataGrid_1');\nif (row) {\n  console.log('高亮行索引:', row.index);\n  console.log('高亮行数据:', row.cells);\n}",exCmd:'{\n  "command": "dataGrid.getHighlightedRow",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.selectRow(targetId, rowIndex)', desc:'<span class="desctile">视觉高亮指定行（添加 .data-grid-row-focused 类，不改变复选框状态）</span>先清除所有行的高亮再设置目标行。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.selectRow('dataGrid_1', 2);",exCmd:'{\n  "command": "dataGrid.selectRow",\n  "targetId": "dataGrid_1",\n  "rowIndex": 2\n}'},
  {sig:'dataGrid.deselectRow(targetId, rowIndex)', desc:'<span class="desctile">取消指定行的视觉高亮（移除 .data-grid-row-focused 类）</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.deselectRow('dataGrid_1', 2);",exCmd:'{\n  "command": "dataGrid.deselectRow",\n  "targetId": "dataGrid_1",\n  "rowIndex": 2\n}'},
  {sig:'dataGrid.deleteSelectedRows(targetId)', desc:'<span class="desctile">删除所有已勾选的行（从后往前删，确保索引正确）</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.deleteSelectedRows('dataGrid_1');",exCmd:'{\n  "command": "dataGrid.deleteSelectedRows",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.enableCellEdit(targetId, colIndex)', desc:'<span class="desctile">启用指定列所有单元格的编辑功能（按列索引）</span>设置该列表头和所有数据单元格的 data-editable="true"。索引从 0 开始，不包含复选框列。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'colIndex',t:'number',d:'列索引（从 0 开始，跳过复选框列）'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.enableCellEdit('dataGrid_1', 0);",exCmd:'{\n  "command": "dataGrid.enableCellEdit",\n  "targetId": "dataGrid_1",\n  "colIndex": 0\n}'},
  {sig:'dataGrid.disableCellEdit(targetId, colIndex)', desc:'<span class="desctile">禁用指定列的单元格编辑功能（按列索引）</span>设置该列表头和所有数据单元格的 data-editable="false"，双击时自身属性检查不通过从而阻止编辑。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'colIndex',t:'number',d:'列索引（从 0 开始，跳过复选框列）'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.disableCellEdit('dataGrid_1', 0);",exCmd:'{\n  "command": "dataGrid.disableCellEdit",\n  "targetId": "dataGrid_1",\n  "colIndex": 0\n}'},
  {sig:'dataGrid.isCellEditable(targetId, colIndex)', desc:'<span class="desctile">检查指定列是否启用了单元格编辑功能（按列索引）</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'colIndex',t:'number',d:'列索引（从 0 开始，跳过复选框列）'}],ret:'boolean — 是否可编辑',exApi:"if (webviewBridge.api.dataGrid.isCellEditable('dataGrid_1', 0)) {\n  console.log('第1列可编辑');\n}",exCmd:'{\n  "command": "dataGrid.isCellEditable",\n  "targetId": "dataGrid_1",\n  "colIndex": 0\n}'},
  {sig:'dataGrid.enableGlobalEdit(targetId)', desc:'<span class="desctile">启用整个表格的全局编辑功能</span>生成页面中委托给 DataTableManager.setEditable() 控制原功能，设计时设置容器 data-editable="true"。适用于需要整体开关编辑的场景。',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.enableGlobalEdit('dataGrid_1');",exCmd:'{\n  "command": "dataGrid.enableGlobalEdit",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.disableGlobalEdit(targetId)', desc:'<span class="desctile">禁用整个表格的全局编辑功能</span>生成页面中委托给 DataTableManager.setEditable() 关闭原功能，设计时设置容器 data-editable="false"。',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.disableGlobalEdit('dataGrid_1');",exCmd:'{\n  "command": "dataGrid.disableGlobalEdit",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.isGlobalEditEnabled(targetId)', desc:'<span class="desctile">检查表格全局编辑是否启用</span>生成页面中读取 DataTableManager 内部 editable 状态，设计时读取容器 data-editable 属性。',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否已启用全局编辑',exApi:"if (webviewBridge.api.dataGrid.isGlobalEditEnabled('dataGrid_1')) {\n  console.log('表格全局可编辑');\n}",exCmd:'{\n  "command": "dataGrid.isGlobalEditEnabled",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.setAlwaysShowSelection(targetId, enabled)', desc:'<span class="desctile">设置是否始终显示选中高亮</span>设置容器 data-always-show-selection 属性，控制失去焦点时是否保留高亮。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'enabled',t:'boolean',d:'true=始终显示'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.setAlwaysShowSelection('dataGrid_1', true);",exCmd:'{\n  "command": "dataGrid.setAlwaysShowSelection",\n  "targetId": "dataGrid_1",\n  "enabled": true\n}'},
  {sig:'dataGrid.getAlwaysShowSelection(targetId)', desc:'<span class="desctile">获取是否始终显示选中高亮</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否始终显示',exApi:"var show = webviewBridge.api.dataGrid.getAlwaysShowSelection('dataGrid_1');\nconsole.log('始终显示:', show);",exCmd:'{\n  "command": "dataGrid.getAlwaysShowSelection",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.showRowCheckbox(targetId, show)', desc:'<span class="desctile">显示/隐藏行复选框列</span>设置 data-show-checkbox 属性，同步更新 DataTableManager 内部状态。DOM 中无复选框时自动动态创建表头全选框和每行复选框；已存在则控制 display 显隐。后续 addRow 会根据该属性自动生成复选框。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'show',t:'boolean',d:'true=显示, false=隐藏'}],ret:'boolean — 是否成功',exApi:"// 显示行复选框（无则自动创建）\nwebviewBridge.api.dataGrid.showRowCheckbox('dataGrid_1', true);\n\n// 隐藏行复选框\nwebviewBridge.api.dataGrid.showRowCheckbox('dataGrid_1', false);",exCmd:'{\n  "command": "dataGrid.showRowCheckbox",\n  "targetId": "dataGrid_1",\n  "show": true\n}'},
  {sig:'dataGrid.setRowChecked(targetId, rowIndex, checked)', desc:'<span class="desctile">设置指定行的勾选状态</span>通过行索引定位行复选框。',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引（从 0 开始，跳过复选框列）'},{n:'checked',t:'boolean',d:'true=勾选'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.setRowChecked('dataGrid_1', 0, true);",exCmd:'{\n  "command": "dataGrid.setRowChecked",\n  "targetId": "dataGrid_1",\n  "rowIndex": 0,\n  "checked": true\n}'},
  {sig:'dataGrid.isRowChecked(targetId, rowIndex)', desc:'<span class="desctile">获取指定行的勾选状态</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'},{n:'rowIndex',t:'number',d:'行索引'}],ret:'boolean — 是否勾选',exApi:"if (webviewBridge.api.dataGrid.isRowChecked('dataGrid_1', 2)) {\n  console.log('第 3 行已勾选');\n}",exCmd:'{\n  "command": "dataGrid.isRowChecked",\n  "targetId": "dataGrid_1",\n  "rowIndex": 2\n}'},
  {sig:'dataGrid.getCheckedRows(targetId)', desc:'<span class="desctile">获取所有已勾选行的索引数组</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'number[] — 已勾选行索引数组',exApi:"var checked = webviewBridge.api.dataGrid.getCheckedRows('dataGrid_1');\nconsole.log('已勾选行:', checked);",exCmd:'{\n  "command": "dataGrid.getCheckedRows",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.checkAll(targetId)', desc:'<span class="desctile">全选数据表格所有行的复选框</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.checkAll('dataGrid_1');",exCmd:'{\n  "command": "dataGrid.checkAll",\n  "targetId": "dataGrid_1"\n}'},
  {sig:'dataGrid.uncheckAll(targetId)', desc:'<span class="desctile">取消全选数据表格所有行的复选框</span>',params:[{n:'targetId',t:'string',d:'表格控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dataGrid.uncheckAll('dataGrid_1');",exCmd:'{\n  "command": "dataGrid.uncheckAll",\n  "targetId": "dataGrid_1"\n}'}
]);

addDoc('cardbox', [
  {sig:'cardBox.getCardTitle(targetId)', desc:'<span class="desctile">获取卡片框的标题文本</span>',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'}],ret:'string — 标题文本',exApi:"var title = webviewBridge.api.cardBox.getCardTitle('cardBox_1');\nconsole.log('标题:', title);",exCmd:'{\n  "command": "cardBox.getCardTitle",\n  "targetId": "cardBox_1"\n}'},
  {sig:'cardBox.setCardTitle(targetId, title)', desc:'<span class="desctile">设置卡片框的标题文本</span>',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'},{n:'title',t:'string',d:'新标题'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.cardBox.setCardTitle('cardBox_1', '用户信息');",exCmd:'{\n  "command": "cardBox.setCardTitle",\n  "targetId": "cardBox_1",\n  "title": "用户信息"\n}'},
  {sig:'cardBox.showCardHeader(targetId)', desc:'<span class="desctile">显示卡片头部区域</span>',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.cardBox.showCardHeader('cardBox_1');",exCmd:'{\n  "command": "cardBox.showCardHeader",\n  "targetId": "cardBox_1"\n}'},
  {sig:'cardBox.hideCardHeader(targetId)', desc:'<span class="desctile">隐藏卡片头部区域（标题栏和折叠按钮）</span>',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.cardBox.hideCardHeader('cardBox_1');",exCmd:'{\n  "command": "cardBox.hideCardHeader",\n  "targetId": "cardBox_1"\n}'},
  {sig:'cardBox.isCardHeaderVisible(targetId)', desc:'<span class="desctile">检查卡片头部是否可见</span>',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'}],ret:'boolean — 是否可见',exApi:"if (webviewBridge.api.cardBox.isCardHeaderVisible('cardBox_1')) {\n  console.log('头部可见');\n}",exCmd:'{\n  "command": "cardBox.isCardHeaderVisible",\n  "targetId": "cardBox_1"\n}'},
  {sig:'cardBox.collapseCard(targetId)', desc:'<span class="desctile">折叠卡片（仅 data-collapsible="true" 时生效）</span>折叠时箭头变为右箭头。',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.cardBox.collapseCard('cardBox_1');",exCmd:'{\n  "command": "cardBox.collapseCard",\n  "targetId": "cardBox_1"\n}'},
  {sig:'cardBox.expandCard(targetId)', desc:'<span class="desctile">展开卡片（仅 data-collapsible="true" 时生效）</span>展开时箭头变为下箭头。',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.cardBox.expandCard('cardBox_1');",exCmd:'{\n  "command": "cardBox.expandCard",\n  "targetId": "cardBox_1"\n}'},
  {sig:'cardBox.isCardCollapsed(targetId)', desc:'<span class="desctile">检查卡片当前是否处于折叠状态</span>',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'}],ret:'boolean — true=已折叠',exApi:"if (webviewBridge.api.cardBox.isCardCollapsed('cardBox_1')) {\n  webviewBridge.api.cardBox.expandCard('cardBox_1');\n}",exCmd:'{\n  "command": "cardBox.isCardCollapsed",\n  "targetId": "cardBox_1"\n}'},
  {sig:'cardBox.showCollapseButton(targetId, show)', desc:'<span class="desctile">显示/隐藏卡片框的折叠箭头按钮</span>通过控制 .card-collapse-btn 的 display 属性实现。若按钮不存在返回 false。',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'},{n:'show',t:'boolean',d:'true=显示, false=隐藏'}],ret:'boolean — 是否成功',exApi:"// 隐藏折叠箭头\nwebviewBridge.api.cardBox.showCollapseButton('cardBox_1', false);\n\n// 显示折叠箭头\nwebviewBridge.api.cardBox.showCollapseButton('cardBox_1', true);",exCmd:'{\n  "command": "cardBox.showCollapseButton",\n  "targetId": "cardBox_1",\n  "show": true\n}'},
  {sig:'cardBox.isCollapseButtonVisible(targetId)', desc:'<span class="desctile">检查折叠箭头按钮是否可见</span>',params:[{n:'targetId',t:'string',d:'卡片框控件 ID'}],ret:'boolean — true=可见',exApi:"var visible = webviewBridge.api.cardBox.isCollapseButtonVisible('cardBox_1');\nconsole.log('折叠箭头可见:', visible);",exCmd:'{\n  "command": "cardBox.isCollapseButtonVisible",\n  "targetId": "cardBox_1"\n}'}
]);

addDoc('tabcontainer', [
  {sig:'tabContainer.selectTab(targetId, tabId)', desc:'<span class="desctile">切换到指定标签页（同时激活按钮和内容面板）</span>',params:[{n:'targetId',t:'string',d:'标签页容器 ID'},{n:'tabId',t:'string',d:'标签名称（data-tab-name）'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.tabContainer.selectTab('tabsContainer_1', 'tab2');",exCmd:'{\n  "command": "tabContainer.selectTab",\n  "targetId": "tabsContainer_1",\n  "tabId": "tab2"\n}'},
  {sig:'tabContainer.getActiveTab(targetId)', desc:'<span class="desctile">获取当前激活的标签页名称（data-tab-name）</span>无激活标签返回空字符串。',params:[{n:'targetId',t:'string',d:'标签页容器 ID'}],ret:'string — 激活标签名称',exApi:"var active = webviewBridge.api.tabContainer.getActiveTab('tabsContainer_1');\nconsole.log('当前标签:', active);",exCmd:'{\n  "command": "tabContainer.getActiveTab",\n  "targetId": "tabsContainer_1"\n}'},
  {sig:'tabContainer.getActiveTabIndex(targetId)', desc:'<span class="desctile">获取当前激活标签页的索引（从 0 开始）</span>无激活标签返回 -1。',params:[{n:'targetId',t:'string',d:'标签页容器 ID'}],ret:'number — 索引，-1 表示无',exApi:"var idx = webviewBridge.api.tabContainer.getActiveTabIndex('tabsContainer_1');\nconsole.log('索引:', idx);",exCmd:'{\n  "command": "tabContainer.getActiveTabIndex",\n  "targetId": "tabsContainer_1"\n}'},
  {sig:'tabContainer.addTab(targetId, tabId, tabTitle)', desc:'<span class="desctile">动态添加一个新标签页（自动创建按钮和空面板）</span>如果 tabId 已存在则跳过。',params:[{n:'targetId',t:'string',d:'标签页容器 ID'},{n:'tabId',t:'string',d:'（可选）标签名称，默认自动生成'},{n:'tabTitle',t:'string',d:'（可选）标签标题，默认"标签N"'}],ret:'boolean — 是否成功',exApi:"// 添加标签（自动 ID）\nwebviewBridge.api.tabContainer.addTab('tabsContainer_1');\n\n// 指定 ID 和标题\nwebviewBridge.api.tabContainer.addTab('tabsContainer_1', 'settings', '设置');",exCmd:'{\n  "command": "tabContainer.addTab",\n  "targetId": "tabsContainer_1",\n  "tabId": "settings",\n  "tabTitle": "设置"\n}'},
  {sig:'tabContainer.removeTab(targetId, tabId)', desc:'<span class="desctile">移除指定标签页（同时移除按钮和面板）</span>若移除的是当前激活标签，自动激活第一个剩余标签。',params:[{n:'targetId',t:'string',d:'标签页容器 ID'},{n:'tabId',t:'string',d:'要移除的标签名称'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.tabContainer.removeTab('tabsContainer_1', 'tab2');",exCmd:'{\n  "command": "tabContainer.removeTab",\n  "targetId": "tabsContainer_1",\n  "tabId": "tab2"\n}'},
  {sig:'tabContainer.renameTab(targetId, tabId, newTitle)', desc:'<span class="desctile">重命名指定标签页的按钮标题（不改变 tabId）</span>',params:[{n:'targetId',t:'string',d:'标签页容器 ID'},{n:'tabId',t:'string',d:'标签名称'},{n:'newTitle',t:'string',d:'新标题文本'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.tabContainer.renameTab('tabsContainer_1', 'tab1', '首页');",exCmd:'{\n  "command": "tabContainer.renameTab",\n  "targetId": "tabsContainer_1",\n  "tabId": "tab1",\n  "newTitle": "首页"\n}'},
  {sig:'tabContainer.getTabCount(targetId)', desc:'<span class="desctile">获取标签页总数</span>',params:[{n:'targetId',t:'string',d:'标签页容器 ID'}],ret:'number — 标签数量',exApi:"var count = webviewBridge.api.tabContainer.getTabCount('tabsContainer_1');\nconsole.log('标签数:', count);",exCmd:'{\n  "command": "tabContainer.getTabCount",\n  "targetId": "tabsContainer_1"\n}'}
]);

addDoc('contextmenu', [
  {sig:'contextMenu.show(targetId, mouseEvent)', desc:'<span class="desctile">显示右键菜单</span>根据 targetId 找到对应菜单配置，在指定鼠标事件位置弹出菜单。若 mouseEvent 为 null，则在屏幕中央显示。',params:[{n:'targetId',t:'string',d:'右键菜单控件 ID'},{n:'mouseEvent',t:'object|MouseEvent',d:'鼠标事件对象（可选，默认 {clientX:100, clientY:100}），用于定位菜单'}],ret:'boolean — 是否成功',exApi:"// 在鼠标事件位置显示菜单\nwebviewBridge.api.contextMenu.show('contextMenu_1', event);\n\n// 在固定位置显示\nwebviewBridge.api.contextMenu.show('contextMenu_1', { clientX: 200, clientY: 300 });",exCmd:'{\n  "command": "contextMenu.show",\n  "targetId": "contextMenu_1",\n  "mouseEvent": {"clientX": 200, "clientY": 300}\n}'},
  {sig:'contextMenu.hide()', desc:'<span class="desctile">关闭当前显示的右键菜单</span>',params:[],ret:'boolean — 始终返回 true',exApi:"webviewBridge.api.contextMenu.hide();",exCmd:'{\n  "command": "contextMenu.hide"\n}'},
  {sig:'contextMenu.isVisible()', desc:'<span class="desctile">检查右键菜单是否正在显示</span>',params:[],ret:'boolean — true=菜单可见',exApi:"if (webviewBridge.api.contextMenu.isVisible()) {\n  console.log('菜单正在显示');\n}",exCmd:'{\n  "command": "contextMenu.isVisible"\n}'},
  {sig:'contextMenu.updateItems(targetId, items)', desc:'<span class="desctile">动态更新右键菜单的菜单项</span>替换指定菜单的 items 配置。支持多层级子菜单（children 嵌套）和图标占位符（如 💾）。注意：这只更新配置数据，如需在已显示的菜单上生效，请先关闭再重新打开。',params:[{n:'targetId',t:'string',d:'右键菜单控件 ID'},{n:'items',t:'Array<ContextMenuItem>',d:'菜单项数组，每项包含 id、text、type（normal/separator）、icon、children 字段'}],ret:'boolean — 是否找到并更新',exApi:"var newItems = [\n  { id: 'save', text: '💾 保存', type: 'normal' },\n  { id: 'export', text: '📤 导出', type: 'normal', children: [\n    { id: 'exp_pdf', text: '📄 导出PDF', type: 'normal' },\n    { id: 'exp_excel', text: '📊 导出Excel', type: 'normal' },\n    { id: 'exp_sep', text: '', type: 'separator' },\n    { id: 'exp_more', text: '📁 更多格式', type: 'normal', children: [\n      { id: 'exp_csv', text: '📋 导出CSV', type: 'normal' },\n      { id: 'exp_json', text: '📦 导出JSON', type: 'normal' }\n    ]}\n  ]},\n  { id: 's1', text: '', type: 'separator' },\n  { id: 'exit', text: '🚪 退出', type: 'normal' }\n];\nwebviewBridge.api.contextMenu.updateItems('contextMenu_1', newItems);",exCmd:'{\n  "command": "contextMenu.updateItems",\n  "targetId": "contextMenu_1",\n  "items": [\n    {"id": "save", "text": "💾 保存", "type": "normal"},\n    {"id": "export", "text": "📤 导出", "type": "normal", "children": [\n      {"id": "exp_pdf", "text": "📄 导出PDF", "type": "normal"},\n      {"id": "exp_excel", "text": "📊 导出Excel", "type": "normal"},\n      {"id": "exp_sep", "text": "", "type": "separator"},\n      {"id": "exp_more", "text": "📁 更多格式", "type": "normal", "children": [\n        {"id": "exp_csv", "text": "📋 导出CSV", "type": "normal"},\n        {"id": "exp_json", "text": "📦 导出JSON", "type": "normal"}\n      ]}\n    ]},\n    {"id": "s1", "text": "", "type": "separator"},\n    {"id": "exit", "text": "🚪 退出", "type": "normal"}\n  ]\n}'},
  {sig:'contextMenu.getItems(targetId)', desc:'<span class="desctile">获取右键菜单的所有菜单项配置</span>',params:[{n:'targetId',t:'string',d:'右键菜单控件 ID'}],ret:'Array|null — 菜单项数组，未找到返回 null',exApi:"var items = webviewBridge.api.contextMenu.getItems('contextMenu_1');\nif (items) {\n  console.log('菜单项数量:', items.length);\n}",exCmd:'{\n  "command": "contextMenu.getItems",\n  "targetId": "contextMenu_1"\n}'}
]);

// ==================== 图标占位符映射表 ====================
iconMapData = [
  ['OK','✅'],['YES','✅'],['CHECK','✅'],['TRUE','✅'],
  ['ERROR','❌'],['FAIL','❌'],['FALSE','❌'],['NO','❌'],['CROSS','❌'],
  ['WARN','⚠️'],['WARNING','⚠️'],
  ['INFO','ℹ️'],['INFORMATION','ℹ️'],
  ['SUCCESS','🎉'],['PARTY','🎉'],
  ['WIN','🏆'],['TROPHY','🏆'],['AWARD','🏆'],
  ['FOLDER','📁'],['DIRECTORY','📁'],['FOLDER_OPEN','📂'],['FILE_OPEN','📂'],
  ['FILE','📄'],['DOC','📄'],['FILE_NEW','📄'],
  ['IMG','🖼️'],['IMAGE','🖼️'],['PICTURE','🖼️'],
  ['DOCUMENT','📝'],['DOCS','📝'],
  ['DOWNLOAD','⬇️'],['DOWN','⬇️'],
  ['UPLOAD','⬆️'],['UP','⬆️'],
  ['EDIT','✏️'],['EDITING','✏️'],['FILE_EDIT','✏️'],
  ['DELETE','🗑️'],['REMOVE','🗑️'],['TRASH','🗑️'],['FILE_DELETE','🗑️'],
  ['ADD','➕'],['NEW','➕'],['PLUS','➕'],
  ['SEARCH','🔍'],['FIND','🔍'],
  ['SETTINGS','⚙️'],['CONFIG','⚙️'],['GEAR','⚙️'],
  ['USER','👤'],['PERSON','👤'],['USERS','👥'],
  ['CLOCK','🕐'],['TIME','🕐'],['TIMER','🕐'],
  ['CALENDAR','📅'],['DATE','📅'],
  ['LINK','🔗'],['URL','🔗'],['CONNECT','🔗'],
  ['EMAIL','📧'],['MAIL','📧'],
  ['PHONE','📞'],['CALL','📞'],
  ['STAR','⭐'],['FAVORITE','⭐'],['FAV','⭐'],['STAR2','⭐'],
  ['LOCK','🔒'],['SECURE','🔒'],
  ['UNLOCK','🔓'],
  ['HIDDEN','👁️'],['EYE','👁️'],
  ['VISIBLE','👁️‍🗨️'],
  ['QUESTION','❓'],['HELP','❓'],
  ['HOME','🏠'],['HOUSE','🏠'],
  ['BACK','🔙'],['RETURN','🔙'],
  ['FORWARD','🔜'],['NEXT','➡️'],
  ['PREV','⬅️'],['PREVIOUS','⬅️'],
  ['FIRST','⏮️'],['LAST','⏭️'],
  ['PLAY','▶️'],['PAUSE','⏸️'],['STOP','⏹️'],['RECORD','⏺️'],
  ['POWER','🔘'],['ON','🔋'],['OFF','🔌'],
  ['LOADING','⏳'],['WAIT','⏳'],
  ['LOAD','📦'],['PACKAGE','📦'],
  ['SAVE','💾'],['DISK','💾'],['FLOPPY','💾'],['FILE_SAVE','💾'],
  ['COPY','📋'],['CLONE','📑'],
  ['CUT','✂️'],['PASTE','📄'],
  ['REFRESH','🔄'],['RELOAD','🔄'],['SYNC','🔄'],
  ['DISCONNECT','⛓️'],
  ['NETWORK','🌐'],['WEB','🌐'],['INTERNET','🌐'],
  ['SERVER','🖥️'],
  ['COMPUTER','💻'],['LAPTOP','💻'],
  ['MOBILE','📱'],['PHONE2','📱'],['TABLET','📱'],
  ['KEYBOARD','⌨️'],['MOUSE','🖱️'],['PRINTER','🖨️'],
  ['SCAN','📷'],['CAMERA','📷'],
  ['VIDEO','🎥'],['MOVIE','🎬'],
  ['AUDIO','🎵'],['MUSIC','🎵'],
  ['SOUND','🔊'],['MUTE','🔇'],['VOLUME','🔉'],
  ['BOOK','📖'],['BOOKMARK','🔖'],['LIBRARY','📚'],['ARCHIVE','🗄️'],
  ['LOVE','❤️'],
  ['LIKE','👍'],['THUMBS_UP','👍'],['GOOD','👍'],
  ['THUMBS_DOWN','👎'],['BAD','👎'],
  ['COOL','😎'],['FUNNY','😄'],['SAD','😢'],['CRY','😭'],['ANGRY','😡'],
  ['HOT','🔥'],['FIRE','🔥'],['COLD','❄️'],['SNOW','🌨️'],['SUN','☀️'],['MOON','🌙'],
  ['GOLD','🥇'],['SILVER','🥈'],['BRONZE','🥉'],['MEDAL','🏅'],['RIBBON','🎗️'],
  ['TICKET','🎫'],
  ['GIFT','🎁'],['PRESENT','🎁'],
  ['PARTY2','🎊'],['BALLOON','🎈'],['CAKE','🎂'],
  ['CANDLE','🕯️'],['COOKIE','🍪'],['CANDY','🍬'],
  ['COFFEE','☕'],['TEA','🍵'],['BEER','🍺'],['WINE','🍷'],
  ['FOOD','🍔'],['BURGER','🍔'],['PIZZA','🍕'],['CAKE2','🍰'],
  ['FRUIT','🍎'],['APPLE','🍎'],['BANANA','🍌'],['GRAPE','🍇'],
  ['WATER','💧'],['DRINK','🥤']
];

// ==================== 命令分发处理 ====================
var commandsData = [
  {cmd:'setValue',desc:'设置控件值',maps:'targetId → targetId, value → value',ex:'{"command":"setValue","targetId":"input_1","value":"Hello"}'},
  {cmd:'setChecked',desc:'设置勾选状态',maps:'targetId → targetId, checked → checked',ex:'{"command":"setChecked","targetId":"checkbox_1","checked":true}'},
  {cmd:'setDisabled',desc:'禁用控件',maps:'targetId → api.setEnabled(targetId, false)',ex:'{"command":"setDisabled","targetId":"button_1"}'},
  {cmd:'setEnabled',desc:'启用控件',maps:'targetId → api.setEnabled(targetId, true)',ex:'{"command":"setEnabled","targetId":"button_1"}'},
  {cmd:'show',desc:'显示控件',maps:'targetId → targetId',ex:'{"command":"show","targetId":"panel_1"}'},
  {cmd:'hide',desc:'隐藏控件',maps:'targetId → targetId',ex:'{"command":"hide","targetId":"panel_1"}'},
  {cmd:'toggle',desc:'切换可见性',maps:'targetId → targetId',ex:'{"command":"toggle","targetId":"panel_1"}'},
  {cmd:'focus',desc:'使控件获得焦点',maps:'targetId → targetId',ex:'{"command":"focus","targetId":"input_1"}'},
  {cmd:'setStyle',desc:'批量设置样式',maps:'targetId, style/css → targetId, 样式对象',ex:'{"command":"setStyle","targetId":"label_1","style":{"color":"red"}}'},
  {cmd:'setBlockContextMenu',desc:'阻止/允许右键菜单',maps:'block → block',ex:'{"command":"setBlockContextMenu","block":true}'},
  {cmd:'showNotification',desc:'显示系统通知',maps:'title,text,text2,image,button1,button2 → options对象',ex:'{"command":"showNotification","title":"提示","text":"操作完成"}'},
  {cmd:'iconParse',desc:'图标占位符转 emoji',maps:'targetId + text → 对元素 innerHTML 调用 parse',ex:'{"command":"iconParse","targetId":"label_1","text":"[OK] 成功"}'},
  {cmd:'iconToText',desc:'emoji 转图标占位符',maps:'targetId + html → 对元素 innerHTML 调用 toText',ex:'{"command":"iconToText","targetId":"label_1","html":"✅ 成功"}'}
];

// ==================== 页面渲染 ====================
function buildSections(){
  var container = document.getElementById('sections');
  var html = '';
  var order = ['general','icon-helpers','messages',
    'button','input','textarea','checkbox','toggle-ctrl','combobox','label','hyperlink','radiogroup',
    'progressbar','datetimepicker','iconbutton','imagebox','logbox',
    'listBox','treeview','datagrid','cardbox','tabcontainer','contextmenu','tooltip','messagebox',
    'iconmap','commands'];
  var titles = {
    'general':'通用控件操作','icon-helpers':'图标辅助','messages':'消息与通知',
    'button':'按钮 Button','input':'编辑框 Input','textarea':'文本域 Textarea',
    'checkbox':'复选框 CheckBox','toggle-ctrl':'开关 Toggle','combobox':'组合框 ComboBox',
    'label':'文本标签 Label','hyperlink':'超链接 Hyperlink','radiogroup':'单选框 RadioGroup',
    'progressbar':'进度条 ProgressBar','datetimepicker':'时间框 DateTimePicker',
    'iconbutton':'图标按钮 IconButton','imagebox':'图片框 ImageBox','logbox':'日志框 LogBox',
    'listBox':'列表框 listBox','treeview':'树形框 TreeView','datagrid':'多项表格 DataGrid',
    'cardbox':'卡片框 CardBox','tabcontainer':'标签页 TabContainer','contextmenu':'右键菜单 ContextMenu',
    'tooltip':'气泡提示框 Tooltip',
    'messagebox':'信息提示框 MessageBox',
    'iconmap':'图标占位符映射表','commands':'命令分发处理'
  };

  for(var i=0;i<order.length;i++){
    var key = order[i];
    html += '<div class="section" id="section-'+key+'">';
    html += '<h2>'+titles[key]+' <span class="ctrl-badge">webviewBridge.api</span></h2>';

    if(key==='iconmap'){
      html += '<p style="margin-bottom:14px;color:#555">IconManager 支持的图标占位符与 emoji 对应关系。在文本中使用 <code>[NAME]</code> 或 <code>{NAME}</code> 格式即可自动转换。共 <strong>'+iconMapData.length+'</strong> 个映射。</p>';
      html += '<input type="text" class="search-box" placeholder="搜索图标..." oninput="filterIcons(this.value)" style="max-width:320px;">';
      html += '<div class="table-wrap"><table class="data-table icon-table" id="iconTable"><thead><tr><th>Emoji</th><th>占位符</th><th>别名</th></tr></thead><tbody id="iconTbody">';
      var iconRows='';
      var seenEmoji={};
      for(var j=0;j<iconMapData.length;j++){
        var row=iconMapData[j];
        var emojiKey=row[1];
        if(seenEmoji[emojiKey]){
          seenEmoji[emojiKey]+=', '+row[0];
        }else{
          seenEmoji[emojiKey]=row[0];
        }
      }
      var emojiKeys=Object.keys(seenEmoji);
      for(var k=0;k<emojiKeys.length;k++){
        var ek=emojiKeys[k];
        var aliases=seenEmoji[ek];
        var mainAlias=aliases.split(', ')[0];
        iconRows+='<tr  data-search="'+aliases.toLowerCase()+' '+ek+'"><td><code>'+ek+'</code></td><td>['+mainAlias+']</td><td style="font-size:12px;color:#888;;text-align:center;line-height:30px">'+aliases+'</td></tr>';
      }
      html+=iconRows+'</tbody></table></div>';

    }else if(key==='commands'){
      html += '<p style="margin-bottom:14px;color:#555">通过 <code>window.chrome.webview.postMessage(JSON)</code> 发送命令，由 <code>dispatchCommand</code> 统一处理。接收字段为 <code>command</code> 或 <code>cmd</code>。</p>';
      html += '<div class="table-wrap"><table class="data-table"><thead><tr><th>命令名</th><th>功能</th><th>参数映射</th><th>示例</th></tr></thead><tbody>';
      for(var c=0;c<commandsData.length;c++){
        var cmd=commandsData[c];
        html+='<tr><td><code>'+cmd.cmd+'</code></td><td>'+cmd.desc+'</td><td style="font-size:12px">'+cmd.maps+'</td><td><div class="code-block" style="margin:0"><div class="code-block-header"><span class="lang-label">JSON</span><button class="copy-btn" onclick="copyCode(this,\''+cmd.ex.replace(/'/g,"\\'").replace(/\n/g,'\\n')+'\')">复制</button></div><pre><code>'+cmd.ex.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</code></pre></div></td></tr>';
      }
      html+='</tbody></table></div>';

    }else if(apiDocs[key]){
      var methods = apiDocs[key];
      html += '<p style="color:#888;font-size:12px;margin-bottom:8px">共 <strong style="color:#30b59e;font-size:13px;margin-bottom:8px;font-weight: normal;">'+methods.length+'</strong> 个方法</p>';
      for(var m=0;m<methods.length;m++){
        var method=methods[m];
        html+='<div class="api-item">';
        html+='<div class="api-signature">'+method.sig+'</div>';
        html+='<div style="padding:20px;"><div class="api-desc">'+method.desc+'</div>';
        if(method.params.length>0){
          html+='<div class="api-params"><table><thead><tr><th>参数名</th><th>类型</th><th>说明</th></tr></thead><tbody>';
          for(var p=0;p<method.params.length;p++){
            var par=method.params[p];
            html+='<tr><td><code>'+par.n+'</code></td><td><code>'+par.t+'</code></td><td>'+par.d+'</td></tr>';
          }
          html+='</tbody></table></div>';
        }
        html+='<div class="api-returns"><strong>返回值：</strong> <code>'+method.ret+'</code></div>';
        html+='<div class="tab-bar">';
        html+='<button class="tab-btn active" onclick="switchTab(this,\'api\')">API 调用示例</button>';
        html+='<button class="tab-btn" onclick="switchTab(this,\'cmd\')">命令分发示例</button>';
        html+='</div>';
        html+='<div class="tab-content active" data-tab="api">';
        html+='<div class="code-block"><div class="code-block-header"><span class="lang-label">JavaScript</span><button class="copy-btn" onclick="copyCode(this,\''+method.exApi.replace(/'/g,"\\'").replace(/\n/g,'\\n')+'\')">复制</button></div><pre><code class="language-javascript">'+method.exApi.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</code></pre></div>';
        html+='</div>';
        html+='<div class="tab-content" data-tab="cmd">';
        html+='<div class="code-block"><div class="code-block-header"><span class="lang-label">JSON (postMessage)</span><button class="copy-btn" onclick="copyCode(this,\''+method.exCmd.replace(/'/g,"\\'").replace(/\n/g,'\\n')+'\')">复制</button></div><pre><code class="language-json">'+method.exCmd.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</code></pre></div>';
        html+='</div></div>';
        html+='</div>';
      }
    }
    html+='</div>';
  }
  container.innerHTML=html;
}

function showSection(key,linkEl){
  document.getElementById('intro').style.display='none';
  var all=document.querySelectorAll('.section');
  for(var i=0;i<all.length;i++) all[i].classList.remove('active');
  var sec=document.getElementById('section-'+key);
  if(sec) sec.classList.add('active');
  var links=document.querySelectorAll('.sidebar a');
  for(var j=0;j<links.length;j++) links[j].classList.remove('active');
  if(linkEl) linkEl.classList.add('active');
  setTimeout(function(){ if(window.hljs) hljs.highlightAll(); },50);
}

function switchTab(btn,tabName){
  var item=btn.closest('.api-item');
  var btns=item.querySelectorAll('.tab-btn');
  for(var i=0;i<btns.length;i++) btns[i].classList.remove('active');
  btn.classList.add('active');
  var tabs=item.querySelectorAll('.tab-content');
  for(var j=0;j<tabs.length;j++){
    if(tabs[j].getAttribute('data-tab')===tabName){
      tabs[j].classList.add('active');
    }else{
      tabs[j].classList.remove('active');
    }
  }
}

function copyCode(btn,code){
  code=code.replace(/\\'/g,"'").replace(/\\n/g,'\n');
  navigator.clipboard.writeText(code).then(function(){
    btn.textContent='已复制';
    btn.classList.add('copied');
    setTimeout(function(){
      btn.textContent='复制';
      btn.classList.remove('copied');
    },1500);
  }).catch(function(){
    var ta=document.createElement('textarea');
    ta.value=code;
    ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent='已复制';
    btn.classList.add('copied');
    setTimeout(function(){
      btn.textContent='复制';
      btn.classList.remove('copied');
    },1500);
  });
}

function filterNav(query){
  var items=document.querySelectorAll('.sidebar .nav-item');
  var groups=document.querySelectorAll('.sidebar .nav-group');
  var q=query.toLowerCase();
  for(var i=0;i<items.length;i++){
    var a=items[i].querySelector('a');
    var text=(a.textContent||'').toLowerCase();
    if(q===''||text.indexOf(q)>=0){
      items[i].style.display='';
    }else{
      items[i].style.display='none';
    }
  }
}

function filterIcons(query){
  var rows=document.querySelectorAll('#iconTbody tr');
  var q=query.toLowerCase();
  for(var i=0;i<rows.length;i++){
    var ds=rows[i].getAttribute('data-search')||'';
    rows[i].style.display=(q===''||ds.indexOf(q)>=0)?'':'none';
  }
}

function toggleSidebar(){
  var sb=document.getElementById('sidebar');
  var ov=document.getElementById('overlay');
  sb.classList.toggle('open');
  ov.classList.toggle('show');
}

document.addEventListener('DOMContentLoaded',function(){
  buildSections();
  if(window.hljs) hljs.highlightAll();
  document.getElementById('section-iconmap').classList.add('active');
  document.getElementById('intro').style.display='none';
  var iconLink=document.querySelector('.sidebar a[href="#iconmap"]');
  if(iconLink) iconLink.classList.add('active');
});
