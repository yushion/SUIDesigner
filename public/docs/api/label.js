window.__apiDocs = window.__apiDocs || {};
window.__apiDocs['label'] = [
  {sig:'获取文本标签的内容', desc:'<span class="desctile"><span class="status-badge">ƒ :</span>label.getText(targetId)</b></span>',params:[{n:'targetId',t:'string',d:'标签控件 ID'}],ret:'string — 文本内容',exApi:"var text = webviewBridge.api.label.getText('label_1');\nconsole.log(text);",exCmd:'{\n  "command": "label.getText",\n  "targetId": "label_1"\n}'},
  {sig:'设置文本标签的内容', desc:'<span class="desctile"><span class="status-badge">ƒ :</span>label.setText(targetId, text)</b></span>支持图标占位符。',params:[{n:'targetId',t:'string',d:'标签控件 ID'},{n:'text',t:'string',d:'文本内容'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.label.setText('label_1', '[INFO] 数据加载完成');",exCmd:'{\n  "command": "label.setText",\n  "targetId": "label_1",\n  "text": "数据加载完成"\n}'}
];
