window.__apiDocs = window.__apiDocs || {};
window.__apiDocs['button'] = [
  {sig:'获取按钮的文本内容', desc:'<span class="desctile"><span class="status-badge">ƒ :</span>button.getText(targetId)</b></span>',params:[{n:'targetId',t:'string',d:'按钮控件 ID'}],ret:'string — 按钮文本',exApi:"var text = webviewBridge.api.button.getText('button_1');\nconsole.log('按钮文本:', text);",exCmd:'{\n  "command": "button.getText",\n  "targetId": "button_1"\n}'},
  {sig:'设置按钮的文本内容', desc:'<span class="desctile"><span class="status-badge">ƒ :</span>button.setText(targetId, text)</b></span>支持图标占位符。',params:[{n:'targetId',t:'string',d:'按钮控件 ID'},{n:'text',t:'string',d:'要设置的文本'}],ret:'boolean — 是否成功',exApi:"// 设置按钮文本\nwebviewBridge.api.button.setText('button_1', '提交');\n\n// 使用图标占位符\nwebviewBridge.api.button.setText('button_1', '[OK] 确认提交');",exCmd:'{\n  "command": "button.setText",\n  "targetId": "button_1",\n  "text": "提交"\n}'}
];
