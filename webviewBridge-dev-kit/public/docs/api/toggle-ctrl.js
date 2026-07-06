window.__apiDocs = window.__apiDocs || {};
window.__apiDocs['toggle-ctrl'] = [
  {sig:'获取开关控件的开关状态', desc:'<span class="desctile"><span class="status-badge">ƒ :</span>switchToggle.getChecked(targetId)</b></span>',params:[{n:'targetId',t:'string',d:'开关控件 ID'}],ret:'boolean — true=开, false=关',exApi:"var isOn = webviewBridge.api.switchToggle.getChecked('toggle_1');\nconsole.log('开关状态:', isOn);",exCmd:'{\n  "command": "switchToggle.getChecked",\n  "targetId": "toggle_1"\n}'},
  {sig:'设置开关控件的开关状态', desc:'<span class="desctile"><span class="status-badge">ƒ :</span>switchToggle.setChecked(targetId, checked)</b></span>',params:[{n:'targetId',t:'string',d:'开关控件 ID'},{n:'checked',t:'boolean',d:'true=开, false=关'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.switchToggle.setChecked('toggle_1', true);",exCmd:'{\n  "command": "switchToggle.setChecked",\n  "targetId": "toggle_1",\n  "checked": true\n}'}
];
