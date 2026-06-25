# 重写第五步到第八步的示例内容
# 核心：简化HTML，去掉繁琐CSS，突出"识别机制 + 上报数据 + 常用API"

with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

print(f"读取文件，长度: {len(html)} 字符")

# ========== 找到替换范围 ==========
start_marker = '<h4>第五步：基础控件开发示例</h4>'
end_marker = '    <!-- 三、AI 提示词模板 -->'

start_idx = html.find(start_marker)
end_idx = html.find(end_marker)

print(f"第五步起始位置: {start_idx}")
print(f"AI提示词模板前位置: {end_idx}")
print(f"待替换内容长度: {end_idx - start_idx} 字符")

if start_idx == -1 or end_idx == -1:
    print("ERROR: 找不到标记位置")
    exit(1)

# ========== 生成新内容 ==========

new_content = '''<h4>第五步：基础控件开发示例</h4>
      <p>以下示例<strong>只展示核心HTML结构</strong>，重点说明 webviewBridge.js 如何识别控件、上报什么数据。样式可根据需求自行编写。</p>
      <div class="tip-box">
        <strong>核心要点：</strong>每个控件必须有唯一 <code>id</code>，用标准HTML标签即可被自动识别。<code>data-name</code> 建议设置，不设置会自动从 label/placeholder/文本 推断。
      </div>

      <!-- 5.1 按钮 -->
      <h4 style="margin-top:16px">5.1 按钮(Button)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td><code>&lt;button id="btn_submit" data-name="提交按钮"&gt;提交&lt;/button&gt;</code></td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 &lt;button&gt; 标签识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>button</code></td></tr>
        <tr><td><strong>customname来源</strong></td><td>data-name → 按钮文本 → id</td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">点击后上报的事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "click",
  "targetId": "btn_submit",
  "ctrlType": "button",
  "customname": "提交按钮",   <span style="color:#2e7d32">← 来自 data-name</span>
  "basictype": "按钮",       <span style="color:#2e7d32">← 自动映射中文</span>
  "source": "native",       <span style="color:#2e7d32">← Layer 5 原生标签</span>
  "data": { "value": "提交", "x": 150, "y": 80 }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.button.setText('btn_submit', '保存')</code> — 设置文本<br/>
        <code>webviewBridge.api.button.getText('btn_submit')</code> — 获取文本<br/>
        <code>webviewBridge.api.button.setEnabled('btn_submit', false)</code> — 禁用
      </div>

      <!-- 5.2 输入框 -->
      <h4 style="margin-top:16px">5.2 输入框(Input)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td><code>&lt;input id="inp_username" type="text" placeholder="请输入用户名"&gt;</code></td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 &lt;input type="text"&gt; 识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>inputText</code></td></tr>
        <tr><td><strong>customname来源</strong></td><td>data-name → placeholder → 关联label文字 → id</td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">输入内容后上报的事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "change",
  "targetId": "inp_username",
  "ctrlType": "inputText",
  "customname": "请输入用户名", <span style="color:#2e7d32">← 来自 placeholder</span>
  "basictype": "输入框",
  "source": "native",
  "data": { "value": "张三" }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.input.setValue('inp_username', '张三')</code> — 设置值<br/>
        <code>webviewBridge.api.input.getValue('inp_username')</code> — 获取值<br/>
        <code>webviewBridge.api.input.setPlaceholder('inp_username', '请输入')</code> — 设置提示
      </div>

      <!-- 5.3 文本域 -->
      <h4 style="margin-top:16px">5.3 文本域(Textarea)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td><code>&lt;textarea id="txt_remark" placeholder="备注" rows="4"&gt;&lt;/textarea&gt;</code></td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 &lt;textarea&gt; 标签识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>textarea</code></td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">上报事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "change",
  "targetId": "txt_remark",
  "ctrlType": "textarea",
  "customname": "备注",       <span style="color:#2e7d32">← 来自 placeholder</span>
  "basictype": "文本域",
  "source": "native",
  "data": { "value": "这是备注内容" }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.textarea.setValue('txt_remark', '内容')</code> — 设置内容<br/>
        <code>webviewBridge.api.textarea.getValue('txt_remark')</code> — 获取内容<br/>
        <code>webviewBridge.api.textarea.setRows('txt_remark', 8)</code> — 设置行数
      </div>

      <!-- 5.4 复选框 -->
      <h4 style="margin-top:16px">5.4 复选框(Checkbox)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td><code>&lt;label&gt;&lt;input id="chk_agree" type="checkbox"&gt; 同意协议&lt;/label&gt;</code></td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 input[type=checkbox] 识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>checkbox</code></td></tr>
        <tr><td><strong>customname来源</strong></td><td>data-name → label文字 → 后续文本 → id</td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">点击后上报的事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "click",
  "targetId": "chk_agree",
  "ctrlType": "checkbox",
  "customname": "同意协议",   <span style="color:#2e7d32">← 来自 label 文字</span>
  "basictype": "复选框",
  "source": "native",
  "data": { "checked": true, "value": "on" }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.checkbox.setChecked('chk_agree', true)</code> — 设置选中<br/>
        <code>webviewBridge.api.checkbox.getChecked('chk_agree')</code> — 获取选中状态<br/>
        <code>webviewBridge.api.checkbox.toggle('chk_agree')</code> — 切换状态
      </div>

      <!-- 5.5 单选框 -->
      <h4 style="margin-top:16px">5.5 单选框(Radio)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td>
<pre style="margin:0;font-size:12px">&lt;input id="rdo_male" type="radio" name="gender"&gt; 男
&lt;input id="rdo_female" type="radio" name="gender"&gt; 女</pre>
        </td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 input[type=radio] 识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>radio</code></td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">上报事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "click",
  "targetId": "rdo_male",
  "ctrlType": "radio",
  "customname": "男",         <span style="color:#2e7d32">← 来自后续文本</span>
  "basictype": "单选框",
  "source": "native",
  "data": { "checked": true, "groupName": "gender" }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.radioGroup.setChecked('rdo_male')</code> — 选中某项<br/>
        <code>webviewBridge.api.radioGroup.getSelected('gender')</code> — 获取选中项ID
      </div>

      <!-- 5.6 下拉框 -->
      <h4 style="margin-top:16px">5.6 组合框(ComboBox)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td>
<pre style="margin:0;font-size:12px">&lt;select id="sel_city"&gt;
  &lt;option value="bj"&gt;北京&lt;/option&gt;
  &lt;option value="sh"&gt;上海&lt;/option&gt;
&lt;/select&gt;</pre>
        </td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 &lt;select&gt; 标签识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>comboBox</code></td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">选择后上报的事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "change",
  "targetId": "sel_city",
  "ctrlType": "comboBox",
  "customname": "sel_city",    <span style="color:#e67e22">← 无label时用id，建议设 data-name</span>
  "basictype": "组合框",
  "source": "native",
  "data": { "value": "bj", "text": "北京", "index": 0 }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.comboBox.setValue('sel_city', 'bj')</code> — 设置选中值<br/>
        <code>webviewBridge.api.comboBox.getValue('sel_city')</code> — 获取选中值<br/>
        <code>webviewBridge.api.comboBox.addItem('sel_city', '广州', 'gz')</code> — 添加选项
      </div>

      <!-- 5.7 超链接 -->
      <h4 style="margin-top:16px">5.7 超链接(HyperLink)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td><code>&lt;a href="#" id="link_help"&gt;帮助文档&lt;/a&gt;</code></td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 &lt;a&gt; 标签识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>hyperLink</code></td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">点击后上报的事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "click",
  "targetId": "link_help",
  "ctrlType": "hyperLink",
  "customname": "帮助文档",   <span style="color:#2e7d32">← 来自链接文本</span>
  "basictype": "超链接",
  "source": "native",
  "data": { "href": "#", "text": "帮助文档" }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.hyperLink.setText('link_help', '查看帮助')</code> — 设置文字<br/>
        <code>webviewBridge.api.hyperLink.setUrl('link_help', 'https://...')</code> — 设置链接
      </div>

      <!-- 5.8 文本标签 -->
      <h4 style="margin-top:16px">5.8 文本标签(Label)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td><code>&lt;span id="lbl_status" data-name="状态"&gt;就绪&lt;/span&gt;</code></td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 &lt;span&gt; 标签识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>label</code></td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">上报事件数据（点击标签）</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "click",
  "targetId": "lbl_status",
  "ctrlType": "label",
  "customname": "状态",       <span style="color:#2e7d32">← 来自 data-name</span>
  "basictype": "文本标签",
  "source": "native",
  "data": { "text": "就绪" }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.label.setText('lbl_status', '加载中...')</code> — 设置文本<br/>
        <code>webviewBridge.api.label.getText('lbl_status')</code> — 获取文本
      </div>

      <h4 style="margin-top:20px">第六步：进阶控件开发示例</h4>
      <p>进阶控件有的需要特定CSS class约定（Layer 3），有的用原生标签即可。</p>

      <!-- 6.1 进度条 -->
      <h4 style="margin-top:16px">6.1 进度条(ProgressBar)</h4>
      <p><strong>方式一</strong>（推荐）：用CSS class约定，结构识别更准确：</p>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">HTML — CSS class 约定写法</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>&lt;div id="progress_load" class="progressBar" data-editable="true" data-name="加载进度"&gt;
  &lt;div class="progressBar_fill" style="width:60%"&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre></div>
      <p><strong>方式二</strong>：原生 range 输入：</p>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">HTML — 原生 input 写法</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>&lt;input id="progress_load" type="range" min="0" max="100" value="60"&gt;</code></pre></div>
      <table>
        <tr><td style="width:160px"><strong>识别层级</strong></td><td>Layer 3（css）class约定 / Layer 5（native）原生input</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>progressBar</code></td></tr>
        <tr><td><strong>可编辑</strong></td><td><code>data-editable="true"</code> 时可点击调整进度</td></tr>
      </table>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.progressBar.setValue('progress_load', 80)</code> — 设置进度<br/>
        <code>webviewBridge.api.progressBar.getValue('progress_load')</code> — 获取进度
      </div>

      <!-- 6.2 日期时间选择器 -->
      <h4 style="margin-top:16px">6.2 日期时间选择器(DateTimePicker)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td><code>&lt;input id="dt_date" type="date" data-name="选择日期"&gt;</code></td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 input[type=date/datetime-local] 识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>datetimePicker</code></td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">选择后上报的事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "change",
  "targetId": "dt_date",
  "ctrlType": "datetimePicker",
  "customname": "选择日期",
  "basictype": "日期选择器",
  "source": "native",
  "data": { "value": "2025-06-15" }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.dateTimePicker.setValue('dt_date', '2025-12-31')</code> — 设置日期<br/>
        <code>webviewBridge.api.dateTimePicker.getValue('dt_date')</code> — 获取日期
      </div>

      <!-- 6.3 开关 -->
      <h4 style="margin-top:16px">6.3 开关(SwitchToggle)</h4>
      <div class="warn-box">
        <strong>注意：</strong>开关需要显式声明 <code>data-ctrl-type="switchToggle"</code>（Layer 1），因为原生 checkbox 和开关在HTML上无法区分。
      </div>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td>
<pre style="margin:0;font-size:12px">&lt;label id="sw_enable" data-ctrl-type="switchToggle" data-name="启用开关"&gt;
  &lt;input type="checkbox"&gt; 启用功能
&lt;/label&gt;</pre>
        </td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 1（explicit）— 通过 data-ctrl-type 识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>switchToggle</code></td></tr>
      </table>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.switchToggle.setOn('sw_enable', true)</code> — 打开<br/>
        <code>webviewBridge.api.switchToggle.isOn('sw_enable')</code> — 获取状态
      </div>

      <!-- 6.4 图片框 -->
      <h4 style="margin-top:16px">6.4 图片框(ImageBox)</h4>
      <table>
        <tr><td style="width:160px"><strong>HTML写法</strong></td><td><code>&lt;img id="img_avatar" src="avatar.png" alt="用户头像"&gt;</code></td></tr>
        <tr><td><strong>识别层级</strong></td><td>Layer 5（native）— 通过 &lt;img&gt; 标签识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>imageBox</code></td></tr>
        <tr><td><strong>customname来源</strong></td><td>data-name → alt → title → id</td></tr>
      </table>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.imageBox.setSrc('img_avatar', 'new.png')</code> — 设置图片<br/>
        <code>webviewBridge.api.imageBox.getSrc('img_avatar')</code> — 获取图片地址
      </div>

      <!-- 6.5 日志输出框 -->
      <h4 style="margin-top:16px">6.5 日志输出框(LogOutput)</h4>
      <p>需要用 <code>logOutput</code> class 约定来识别（Layer 3）：</p>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">HTML — CSS class 约定写法</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>&lt;div id="log_main" class="logOutput" data-name="运行日志"&gt;
  &lt;div&gt;[INFO] 系统启动&lt;/div&gt;
  &lt;div&gt;[INFO] 初始化完成&lt;/div&gt;
&lt;/div&gt;</code></pre></div>
      <table>
        <tr><td style="width:160px"><strong>识别层级</strong></td><td>Layer 3（css）— 通过 logOutput class 识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>logOutput</code></td></tr>
      </table>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.logOutput.addLog('log_main', '[OK] 操作成功')</code> — 追加日志<br/>
        <code>webviewBridge.api.logOutput.clear('log_main')</code> — 清空日志
      </div>

      <h4 style="margin-top:20px">第七步：容器控件开发示例</h4>
      <p>复杂控件（列表、表格、树形、标签页、卡片）推荐用 <strong>CSS class 约定</strong>（Layer 3）或 <strong>DOM结构推断</strong>（Layer 4）来识别，这样不需要硬编码 <code>data-ctrl-type</code>。</p>

      <!-- 7.1 列表框 -->
      <h4 style="margin-top:16px">7.1 列表框(ListBox)</h4>
      <p><strong>推荐写法</strong>：用原生 &lt;ul&gt;/&lt;li&gt;，自动结构识别（Layer 4）：</p>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">HTML — 原生 ul/li 写法</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>&lt;ul id="list_tasks" class="listBox" data-name="任务列表"&gt;
  &lt;li data-item-id="1"&gt;任务一&lt;/li&gt;
  &lt;li data-item-id="2"&gt;任务二&lt;/li&gt;
  &lt;li data-item-id="3"&gt;任务三&lt;/li&gt;
&lt;/ul&gt;</code></pre></div>
      <table>
        <tr><td style="width:160px"><strong>识别层级</strong></td><td>Layer 3（css class）+ Layer 4（结构推断）</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>listBox</code></td></tr>
        <tr><td><strong>itemIndex</strong></td><td>自动从 li 的位置计算，不需要 data-item-index</td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">点击列表项后上报的事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "click",
  "targetId": "list_tasks",
  "ctrlType": "listBox",
  "customname": "任务列表",
  "basictype": "列表框",
  "source": "css",              <span style="color:#2e7d32">← Layer 3 CSS class</span>
  "data": {
    "itemIndex": 1,             <span style="color:#2e7d32">← 自动计算</span>
    "itemId": "2",
    "text": "任务二"
  }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.listBox.addItem('list_tasks', '新任务')</code> — 添加项<br/>
        <code>webviewBridge.api.listBox.removeItem('list_tasks', 0)</code> — 删除第1项<br/>
        <code>webviewBridge.api.listBox.getItemText('list_tasks', 0)</code> — 获取项文本<br/>
        <code>webviewBridge.api.listBox.clearItems('list_tasks')</code> — 清空
      </div>

      <!-- 7.2 数据表格 -->
      <h4 style="margin-top:16px">7.2 数据表格(DataGrid)</h4>
      <p><strong>推荐写法</strong>：用原生 &lt;table&gt;，自动结构识别（Layer 4）：</p>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">HTML — 原生 table 写法</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>&lt;table id="grid_users" class="dataGrid" data-name="用户表"&gt;
  &lt;thead&gt;
    &lt;tr&gt;
      &lt;th data-col-key="name"&gt;姓名&lt;/th&gt;
      &lt;th data-col-key="age"&gt;年龄&lt;/th&gt;
      &lt;th data-col-key="city"&gt;城市&lt;/th&gt;
    &lt;/tr&gt;
  &lt;/thead&gt;
  &lt;tbody&gt;
    &lt;tr data-row-index="0"&gt;
      &lt;td data-col-key="name"&gt;张三&lt;/td&gt;
      &lt;td data-col-key="age"&gt;25&lt;/td&gt;
      &lt;td data-col-key="city"&gt;北京&lt;/td&gt;
    &lt;/tr&gt;
  &lt;/tbody&gt;
&lt;/table&gt;</code></pre></div>
      <table>
        <tr><td style="width:160px"><strong>识别层级</strong></td><td>Layer 3（css class）+ Layer 4（结构推断）</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>dataGrid</code></td></tr>
        <tr><td><strong>rowIndex / colKey</strong></td><td>自动从 tr/td 位置和 th 的 data-col-key 推断</td></tr>
        <tr><td><strong>colName</strong></td><td>自动从 th 的文本或 data-col-name 推断</td></tr>
      </table>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">点击单元格后上报的事件数据</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>{
  "action": "click",
  "targetId": "grid_users",
  "ctrlType": "dataGrid",
  "customname": "用户表",
  "basictype": "数据表格",
  "source": "css",
  "data": {
    "rowIndex": 0,             <span style="color:#2e7d32">← 自动计算行索引</span>
    "colKey": "age",           <span style="color:#2e7d32">← 来自 th 的 data-col-key</span>
    "colName": "年龄",         <span style="color:#2e7d32">← 自动从 th 文本推断</span>
    "value": "25"
  }
}</code></pre></div>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.dataGrid.setCellValue('grid_users', 0, 'name', '李四')</code> — 设置单元格<br/>
        <code>webviewBridge.api.dataGrid.getCellValue('grid_users', 0, 'name')</code> — 获取单元格<br/>
        <code>webviewBridge.api.dataGrid.addRow('grid_users', ['王五','30','上海'])</code> — 添加行<br/>
        <code>webviewBridge.api.dataGrid.getRowCount('grid_users')</code> — 获取行数
      </div>

      <!-- 7.3 树形框 -->
      <h4 style="margin-top:16px">7.3 树形框(TreeView)</h4>
      <p>使用约定的CSS class结构（Layer 3）：</p>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">HTML — CSS class 约定写法</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>&lt;div id="tree_files" class="treeView" data-name="文件树"&gt;
  &lt;div class="treeView_node" data-node-id="1"&gt;
    &lt;span class="treeView_toggle"&gt;▾&lt;/span&gt;
    &lt;span class="treeView_label"&gt;文件夹A&lt;/span&gt;
    &lt;div class="treeView_children"&gt;
      &lt;div class="treeView_node" data-node-id="1-1"&gt;
        &lt;span class="treeView_label"&gt;文件1.txt&lt;/span&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre></div>
      <table>
        <tr><td style="width:160px"><strong>识别层级</strong></td><td>Layer 3（css）— 通过 treeView class 识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>treeView</code></td></tr>
      </table>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.treeView.addNode('tree_files', '1', '子节点')</code> — 添加节点<br/>
        <code>webviewBridge.api.treeView.getSelected('tree_files')</code> — 获取选中节点
      </div>

      <!-- 7.4 标签页 -->
      <h4 style="margin-top:16px">7.4 标签页(TabContainer)</h4>
      <p>使用约定的CSS class结构（Layer 3）：</p>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">HTML — CSS class 约定写法</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>&lt;div id="tabs_main" class="tabsContainer" data-name="主标签页"&gt;
  &lt;div class="tabsContainer_headerBar"&gt;
    &lt;div class="tabsContainer_headerBar_btn" data-tab-id="tab1"&gt;标签1&lt;/div&gt;
    &lt;div class="tabsContainer_headerBar_btn" data-tab-id="tab2"&gt;标签2&lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="tabsContainer_contentWrapper"&gt;
    &lt;div data-tab-id="tab1"&gt;内容1&lt;/div&gt;
    &lt;div data-tab-id="tab2"&gt;内容2&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre></div>
      <table>
        <tr><td style="width:160px"><strong>识别层级</strong></td><td>Layer 3（css）— 通过 tabsContainer class 识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>tabContainer</code></td></tr>
      </table>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.tabContainer.setActiveTab('tabs_main', 'tab2')</code> — 切换标签<br/>
        <code>webviewBridge.api.tabContainer.getActiveTab('tabs_main')</code> — 获取当前标签
      </div>

      <!-- 7.5 卡片框 -->
      <h4 style="margin-top:16px">7.5 卡片框(CardBox)</h4>
      <p>使用约定的CSS class结构（Layer 3）：</p>
      <div class="code-block" style="margin:8px 0"><div class="code-block-header"><span class="lang-label">HTML — CSS class 约定写法</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div><pre><code>&lt;div id="card_info" class="cardBox" data-name="信息卡片"&gt;
  &lt;div class="cardBox_header"&gt;
    &lt;span class="cardBox_header_title"&gt;基本信息&lt;/span&gt;
    &lt;span class="cardBox_collapse_btn"&gt;−&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="cardBox_body"&gt;
    卡片内容...
  &lt;/div&gt;
&lt;/div&gt;</code></pre></div>
      <table>
        <tr><td style="width:160px"><strong>识别层级</strong></td><td>Layer 3（css）— 通过 cardBox class 识别</td></tr>
        <tr><td><strong>ctrlType</strong></td><td><code>cardBox</code></td></tr>
      </table>
      <div class="info-box">
        <strong>常用API：</strong>
        <code>webviewBridge.api.cardBox.setTitle('card_info', '新标题')</code> — 设置标题<br/>
        <code>webviewBridge.api.cardBox.setCollapsed('card_info', true)</code> — 折叠/展开
      </div>

      <h4 style="margin-top:20px">第八步：CSS样式约定速查</h4>
      <p>需要特定CSS class才能被Layer 3识别的控件汇总：</p>
      <table>
        <thead><tr><th>控件</th><th>容器class</th><th>子元素class</th><th>说明</th></tr></thead>
        <tbody>
          <tr><td>列表框</td><td><code>listBox</code></td><td>原生 &lt;li&gt; 即可</td><td>推荐用 ul/li + class</td></tr>
          <tr><td>数据表格</td><td><code>dataGrid</code></td><td>原生 th/td 即可</td><td>推荐用 table + class</td></tr>
          <tr><td>树形框</td><td><code>treeView</code></td><td><code>treeView_node</code> / <code>treeView_label</code> / <code>treeView_toggle</code> / <code>treeView_children</code></td><td>需完整结构</td></tr>
          <tr><td>标签页</td><td><code>tabsContainer</code></td><td><code>tabsContainer_headerBar</code> / <code>tabsContainer_headerBar_btn</code> / <code>tabsContainer_contentWrapper</code></td><td>需完整结构</td></tr>
          <tr><td>卡片框</td><td><code>cardBox</code></td><td><code>cardBox_header</code> / <code>cardBox_header_title</code> / <code>cardBox_collapse_btn</code> / <code>cardBox_body</code></td><td>需完整结构</td></tr>
          <tr><td>进度条</td><td><code>progressBar</code></td><td><code>progressBar_fill</code></td><td>可选，也可用原生 range</td></tr>
          <tr><td>日志框</td><td><code>logOutput</code></td><td>内部用 &lt;div&gt; 包裹每一行</td><td>每一行自动识别</td></tr>
        </tbody>
      </table>
      <div class="tip-box">
        <strong>💡 提示：</strong>基础控件（按钮、输入框、复选框等）完全不需要任何特殊class，用原生HTML标签就行。只有复杂容器控件才需要约定class来辅助识别。
      </div>

    </div>

    '''

# ========== 替换 ==========
html_new = html[:start_idx] + new_content + html[end_idx:]

print(f"替换后总长度: {len(html_new)} 字符")
print(f"减少了 {end_idx - start_idx - len(new_content)} 字符")

# 保存 dev-guide.html
with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.html', 'w', encoding='utf-8') as f:
    f.write(html_new)
print("✓ dev-guide.html 已更新")

# 同步更新 dev-guide.js
js_content = 'window.__devGuideHTML = "' + html_new.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n') + '";'
with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("✓ dev-guide.js 已更新")

print("\n✅ 完成！示例已简化：")
print("  - 去掉了繁琐的CSS样式代码")
print("  - 突出识别层级、ctrlType、customname来源")
print("  - 每个控件都有上报事件数据示例")
print("  - 常用API简洁列出")
print("  - 复杂控件突出CSS class约定")