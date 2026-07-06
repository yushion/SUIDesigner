window.__apiDocs = window.__apiDocs || {};
window.__apiDocs['datetimepicker'] = [
  {sig:'获取日期时间选择器的当前值', desc:'<span class="desctile"><span class="status-badge">ƒ :</span>dateTimePicker.getValue(targetId)</b></span>',params:[{n:'targetId',t:'string',d:'时间选择器控件 ID'}],ret:'string — 日期时间字符串',exApi:"var dt = webviewBridge.api.dateTimePicker.getValue('datetimePicker_1');\nconsole.log('选择的时间:', dt);",exCmd:'{\n  "command": "dateTimePicker.getValue",\n  "targetId": "datetimePicker_1"\n}'},
  {sig:'设置日期时间选择器的值', desc:'<span class="desctile"><span class="status-badge">ƒ :</span>dateTimePicker.setValue(targetId, datetime)</b></span>',params:[{n:'targetId',t:'string',d:'时间选择器控件 ID'},{n:'datetime',t:'string',d:'日期时间字符串，如 "2025-01-15T10:30"'}],ret:'boolean — 是否成功',exApi:"webviewBridge.api.dateTimePicker.setValue('datetimePicker_1', '2025-06-15T14:30');",exCmd:'{\n  "command": "dateTimePicker.setValue",\n  "targetId": "datetimePicker_1",\n  "datetime": "2025-06-15T14:30"\n}'}
];
