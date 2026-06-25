# 读取备份文件，在原基础上更新为五层智能识别机制 + 智能辅助数据 + 更新AI提示词
import re

# 读取备份文件
with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.html.backup', 'r', encoding='utf-8') as f:
    html = f.read()

print(f"读取备份文件成功，长度: {len(html)} 字符")

# ============ 修改1: 将三层检测更新为五层智能识别 ============

# 更新 info-box 中的三层检测说明
old_info1 = '''<div class="info-box">
        <strong>🆕 原生标签自动识别：</strong>现在 <code>webviewBridge.js</code> 已内置三层控件检测（显式声明 → CSS 类名 → 原生标签推断）。纯 HTML 标签如 <code>&lt;button&gt;</code>、<code>&lt;input type="checkbox"&gt;</code> 无需任何 <code>data-ctrl-type</code> 属性即可被自动识别并上报事件。</div>'''

new_info1 = '''<div class="info-box">
        <strong>🆕 五层智能识别：</strong>现在 <code>webviewBridge.js</code> 已内置<strong>五层智能识别机制</strong>（显式声明 → ARIA语义 → CSS类名 → DOM结构推断 → 原生标签）。纯 HTML 标签如 <code>&lt;button&gt;</code>、<code>&lt;input type="checkbox"&gt;</code> 无需任何 <code>data-ctrl-type</code> 属性即可被自动识别并上报事件。智能辅助数据（customname/basictype）会自动从 label、placeholder、文本内容等推断填充。</div>'''

if old_info1 in html:
    html = html.replace(old_info1, new_info1)
    print("✓ 更新了 info-box 中的识别机制说明")
else:
    print("✗ 未找到 info-box 原文，尝试其他方式...")

# ============ 修改2: 更新第二步添加控件的方式表 ============

old_table1 = '''<table>
        <thead><tr><th style="width:120px">方式</th><th>适用场景</th><th>难度</th><th>示例</th></tr></thead>
        <tbody>
          <tr>
            <td><span class="tag tag-new">v2 推荐</span><br/>标准 HTML</td>
            <td>简单控件（按钮、输入框、复选框…）</td>
            <td>★☆☆</td>
            <td><code>&lt;button id="btn1"&gt;点击&lt;/button&gt;</code></td>
          </tr>
          <tr>
            <td><span class="tag tag-new">v2 新增</span><br/>声明式容器</td>
            <td>复杂控件（列表、表格、树形…）</td>
            <td>★★☆</td>
            <td><code>&lt;div data-ctrl="listBox" id="list1" data-items='["A","B"]'&gt;&lt;/div&gt;</code></td>
          </tr>
          <tr>
            <td><span class="tag tag-old">v1 兼容</span><br/>显式声明</td>
            <td>已有项目、需要精确控制</td>
            <td>★★★</td>
            <td><code>&lt;button id="btn1" data-ctrl-type="button" data-type="button" data-name="按钮_1"&gt;点击&lt;/button&gt;</code></td>
          </tr>
        </tbody>
      </table>'''

new_table1 = '''<table>
        <thead><tr><th style="width:120px">方式</th><th>适用场景</th><th>难度</th><th>识别层级</th><th>示例</th></tr></thead>
        <tbody>
          <tr>
            <td><span class="tag tag-new">首选</span><br/>标准 HTML</td>
            <td>简单控件（按钮、输入框、复选框…）</td>
            <td>★☆☆</td>
            <td>Layer 5 原生标签</td>
            <td><code>&lt;button id="btn1"&gt;点击&lt;/button&gt;</code></td>
          </tr>
          <tr>
            <td><span class="tag tag-new">推荐</span><br/>CSS class 约定</td>
            <td>复杂控件（列表、表格、树形…）</td>
            <td>★★☆</td>
            <td>Layer 3 CSS类名</td>
            <td><code>&lt;ul class="listBox" id="list1"&gt;&lt;li&gt;A&lt;/li&gt;&lt;/ul&gt;</code></td>
          </tr>
          <tr>
            <td><span class="tag tag-new">语义化</span><br/>ARIA role</td>
            <td>无障碍友好、语义化页面</td>
            <td>★★☆</td>
            <td>Layer 2 ARIA语义</td>
            <td><code>&lt;div role="button" id="btn1"&gt;点击&lt;/div&gt;</code></td>
          </tr>
          <tr>
            <td><span class="tag tag-old">兼容</span><br/>显式声明</td>
            <td>已有项目、需要精确控制</td>
            <td>★★★</td>
            <td>Layer 1 显式声明</td>
            <td><code>&lt;button id="btn1" data-ctrl-type="button" data-name="按钮_1"&gt;点击&lt;/button&gt;</code></td>
          </tr>
        </tbody>
      </table>'''

if old_table1 in html:
    html = html.replace(old_table1, new_table1)
    print("✓ 更新了添加控件方式表")
else:
    print("✗ 未找到添加控件方式表")

# ============ 修改3: 在第4步后添加五层智能识别详解 ============
# 在"第四步：测试验证"之后，"第五步：基础控件开发示例"之前插入

old_step4 = '''      <h4>第四步：测试验证</h4>
      <ul>
        <li>在 WebView2 中加载页面，点击控件查看事件上报日志</li>
        <li>使用宿主发送命令验证控件响应</li>
        <li>检查浏览器控制台是否有报错</li>
      </ul>

      <h4>第五步：基础控件开发示例</h4>'''

new_step4 = '''      <h4>第四步：测试验证</h4>
      <ul>
        <li>在 WebView2 中加载页面，点击控件查看事件上报日志</li>
        <li>使用宿主发送命令验证控件响应</li>
        <li>检查浏览器控制台是否有报错</li>
      </ul>

      <h4>第四点五：五层智能识别机制详解</h4>
      <p>webviewBridge.js 使用<strong>五层智能识别</strong>自动判断控件类型，优先级从高到低：</p>
      <table>
        <thead><tr><th>层级</th><th>识别方式</th><th>source值</th><th>说明</th><th>示例</th></tr></thead>
        <tbody>
          <tr>
            <td><strong style="color:#e74c3c;">Layer 1</strong></td>
            <td><code>data-ctrl-type</code> 属性</td>
            <td><code>explicit</code></td>
            <td>显式声明，最高优先级，向后兼容</td>
            <td><code>&lt;div data-ctrl-type="listBox"&gt;</code></td>
          </tr>
          <tr>
            <td><strong style="color:#e67e22;">Layer 2</strong></td>
            <td>ARIA <code>role</code> 属性</td>
            <td><code>aria</code></td>
            <td>Web 标准语义化识别，无障碍友好</td>
            <td><code>&lt;div role="button"&gt;</code></td>
          </tr>
          <tr>
            <td><strong style="color:#f1c40f;">Layer 3</strong></td>
            <td>CSS class 约定命名</td>
            <td><code>css</code></td>
            <td>特定 class 识别复杂控件及子元素</td>
            <td><code>&lt;div class="listBox_item"&gt;</code></td>
          </tr>
          <tr>
            <td><strong style="color:#2ecc71;">Layer 4</strong></td>
            <td>DOM 结构特征推断</td>
            <td><code>structure</code></td>
            <td>智能识别 ul/li、table/tr/td 等结构</td>
            <td><code>&lt;ul&gt;&lt;li&gt;...&lt;/li&gt;&lt;/ul&gt;</code></td>
          </tr>
          <tr>
            <td><strong style="color:#3498db;">Layer 5</strong></td>
            <td>原生 HTML 标签</td>
            <td><code>native</code></td>
            <td>兜底推断，零配置即用</td>
            <td><code>&lt;button&gt;</code> → button</td>
          </tr>
        </tbody>
      </table>
      <div class="tip-box">
        <strong>💡 推荐做法：</strong>基础控件用原生标签（Layer 5），复杂控件用 CSS class 约定（Layer 3），特殊情况才用 <code>data-ctrl-type</code>（Layer 1）。层级越低，开发越简单，越符合 Web 标准。
      </div>

      <h4>智能辅助数据自动填充</h4>
      <p>即使<strong>不设置</strong> <code>data-name</code> 和 <code>data-type</code>，桥接脚本也会<strong>自动推断</strong>，让上报消息更直观：</p>
      <table>
        <thead><tr><th>字段</th><th>推断优先级（从高到低）</th></tr></thead>
        <tbody>
          <tr>
            <td><code>customname</code><br/>（控件中文名）</td>
            <td>data-name → aria-label → 关联label文字 → placeholder → 元素文本 → title/alt → id</td>
          </tr>
          <tr>
            <td><code>basictype</code><br/>（基础类型中文名）</td>
            <td>data-type → 自动从 ctrlType 映射中文名称（如 button→"按钮"）</td>
          </tr>
        </tbody>
      </table>
      <div class="info-box">
        <strong>✅ 最佳实践：</strong>建议给重要控件手动设置 <code>data-name</code>，这样宿主端显示的名称最准确。不设置也能用，脚本会自动猜。
      </div>

      <h4>第五步：基础控件开发示例</h4>'''

if old_step4 in html:
    html = html.replace(old_step4, new_step4)
    print("✓ 插入了五层智能识别详解和智能辅助数据说明")
else:
    print("✗ 未找到第四步/第五步位置")

# ============ 修改4: 更新 source 溯源表（三层 → 五层） ============

old_source_table = '''<h4>5.4 source 溯源标记 — 三层检测优先级</h4>
      <p>每个事件消息中携带 <code>source</code> 字段，标识控件是如何被检测到的：</p>
      <table>
        <thead><tr><th>source 值</th><th>优先级</th><th>含义</th><th>示例场景</th></tr></thead>
        <tbody>
          <tr><td><code>explicit</code></td><td>🏆 最高</td><td>通过 data-ctrl-type 显式声明</td><td>设计器导出的控件</td></tr>
          <tr><td><code>css</code></td><td>🥈 中等</td><td>通过 CSS class 名称检测</td><td>复杂控件子元素（tree-toggle 等）</td></tr>
          <tr><td><code>native</code></td><td>🥉 兜底</td><td>通过原生 HTML 标签自动推断</td><td>&lt;button&gt;、&lt;input type="text"&gt; 等</td></tr>
          <tr><td colspan="4"><strong>宿主端可根据 source 判断控件的可信度：</strong>explicit = 设计器生成，css = 子元素自动匹配，native = 纯 HTML 自动推断。</td></tr>
        </tbody>
      </table>'''

new_source_table = '''<h4>5.4 source 溯源标记 — 五层智能识别</h4>
      <p>每个事件消息中携带 <code>source</code> 字段，标识控件是通过哪一层识别到的：</p>
      <table>
        <thead><tr><th>source 值</th><th>层级</th><th>含义</th><th>示例场景</th></tr></thead>
        <tbody>
          <tr><td><code>explicit</code></td><td>Layer 1</td><td>通过 data-ctrl-type 显式声明</td><td>设计器导出的控件，最高优先级</td></tr>
          <tr><td><code>aria</code></td><td>Layer 2</td><td>通过 ARIA role 语义化识别</td><td>role="button"、role="checkbox" 等</td></tr>
          <tr><td><code>css</code></td><td>Layer 3</td><td>通过 CSS class 名称检测</td><td>复杂控件子元素（listBox_item、dataGrid_cell 等）</td></tr>
          <tr><td><code>structure</code></td><td>Layer 4</td><td>通过 DOM 结构特征推断</td><td>ul/li 列表、table/tr/td 表格等</td></tr>
          <tr><td><code>native</code></td><td>Layer 5</td><td>通过原生 HTML 标签自动推断</td><td>&lt;button&gt;、&lt;input type="text"&gt; 等</td></tr>
          <tr><td colspan="4"><strong>宿主端可根据 source 判断控件的可信度：</strong>explicit > aria > css > structure > native，层级越低越符合 Web 标准。</td></tr>
        </tbody>
      </table>'''

if old_source_table in html:
    html = html.replace(old_source_table, new_source_table)
    print("✓ 更新了 source 溯源表")
else:
    print("✗ 未找到 source 溯源表")

# ============ 修改5: 更新AI提示词模板D（通用万能提示词） ============
# 在模板D中加入五层智能识别和智能辅助数据内容

old_prompt_d = '''      <h4>模板 D：通用万能提示词</h4>
      <div class="prompt-box" id="prompt-d">请生成一个可在 WebView2 中运行的 HTML 页面。

<b>核心规则（必须严格遵守）：</b>
1. 页面通过 webviewBridge.js 桥接脚本与宿主程序（易语言）通信。
2. <b>每个可交互控件必须设置唯一的 id 属性</b>（格式：英文名_序号，如 button_1、input_name）。
3. 所有控件交互事件会自动上报给宿主，无需手动写事件监听。
4. <b>简单控件使用标准 HTML 标签即可，无需 data-* 属性。</b>桥接脚本会自动识别：
   - &lt;button&gt; → 按钮
   - &lt;input type="text"&gt; → 输入框
   - &lt;input type="checkbox"&gt; → 复选框
   - &lt;input type="radio"&gt; → 单选框
   - &lt;select&gt; → 下拉框
   - &lt;textarea&gt; → 文本域
   - &lt;a href="#"&gt; → 超链接
   - &lt;input type="range"&gt; → 进度条
   - &lt;input type="datetime-local"&gt; → 日期时间选择器
5. <b>复杂控件使用声明式配置：</b>
   - 列表框：data-ctrl="listBox" + data-items='["..." ]'
   - 表格：data-ctrl="dataGrid" + data-columns='[...]' + data-rows='[...]'
   - 树形框：data-ctrl="treeView" + data-tree='[{...}]'
   - 标签页：data-ctrl="tabs" + data-tabs='[{...}]'
6. 必须通过 &lt;script src="webviewBridge.js"&gt;&lt;/script&gt; 引入桥接脚本。
7. 样式使用内联 &lt;style&gt; 标签，所有文字使用中文。
8. 输出完整可运行的 HTML 文件。

请根据上述规则，生成用户需要的页面。<button class="copy-prompt" onclick="copyPrompt('prompt-d')">复制提示词</button></div>'''

new_prompt_d = '''      <h4>模板 D：通用万能提示词</h4>
      <div class="prompt-box" id="prompt-d">你是一个 webviewBridge.js 前端开发专家，请生成一个可在 WebView2 中运行的 HTML 页面。

<b>核心规则（必须严格遵守）：</b>
1. 页面通过 webviewBridge.js 桥接脚本与宿主程序（易语言）通信。
2. <b>每个可交互控件必须设置唯一的 id 属性</b>（格式：英文名_序号，如 button_1、input_name）。
3. 所有控件交互事件会自动上报给宿主，无需手动写事件监听。

<b>五层智能识别机制（优先级从高到低）：</b>
- Layer 1: data-ctrl-type 属性（显式声明，最高优先级，兼容旧版）
- Layer 2: ARIA role 属性（Web标准语义化，无障碍友好）
- Layer 3: CSS class 约定命名（复杂控件及子元素识别）
- Layer 4: DOM 结构特征推断（智能识别 ul/li、table 等）
- Layer 5: 原生 HTML 标签（兜底，零配置即用）

<b>智能辅助数据自动填充：</b>
- customname（控件中文名）：自动从 data-name > aria-label > label > placeholder > text > title > alt > id 推断
- basictype（基础类型）：自动从 data-type > ctrlType中文映射 推断
- 建议给重要控件设置 data-name，不设置也能自动猜

<b>基础控件（推荐用原生 HTML 标签，Layer 5）：</b>
   - &lt;button id="xxx"&gt; → button 按钮
   - &lt;input type="text" id="xxx"&gt; → inputText 输入框
   - &lt;input type="password" id="xxx"&gt; → inputText 密码框
   - &lt;input type="checkbox" id="xxx"&gt; → checkbox 复选框
   - &lt;input type="radio" id="xxx" name="group"&gt; → radio 单选框
   - &lt;select id="xxx"&gt; → comboBox 组合框
   - &lt;textarea id="xxx"&gt; → textarea 文本域
   - &lt;a href="#" id="xxx"&gt; → hyperLink 超链接
   - &lt;img id="xxx" alt="..."&gt; → imageBox 图片框
   - &lt;span id="xxx"&gt; → label 文本标签

<b>复杂控件（推荐用 CSS class 约定结构，Layer 3）：</b>
- 列表框：&lt;ul id="list_xxx" class="listBox"&gt;&lt;li data-item-id="1"&gt;项1&lt;/li&gt;&lt;/ul&gt;
- 数据表格：&lt;table id="grid_xxx" class="dataGrid"&gt;&lt;thead&gt;&lt;th data-col-key="col1"&gt;列名&lt;/th&gt;&lt;/thead&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;值&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;
- 树形框：使用 treeView / treeView_node / treeView_label / treeView_toggle / treeView_children class
- 标签页：使用 tabsContainer / tabsContainer_headerBar / tabsContainer_headerBar_btn / tabsContainer_contentWrapper class
- 卡片框：使用 cardBox / cardBox_header / cardBox_header_title / cardBox_collapse_btn / cardBox_body class
- 进度条：使用 progressBar / progressBar_fill class，配合 data-editable="true"
- 日志框：使用 logOutput class，内部用 &lt;div&gt; 包裹每一行

<b>页面容器规范：</b>
页面最外层必须有：&lt;div class="pageContainer" data-original-width="800" data-original-height="600" style="position:relative;"&gt;...&lt;/div&gt;

<b>命名规范：</b>
- id: 英文小写+下划线，见名知意，如 btn_submit、input_username
- 建议前缀: btn_/input_/chk_/combo_/list_/grid_/tree_/tabs_/card_/progress_/lbl_

<b>其他要求：</b>
5. 必须通过 &lt;script src="webviewBridge.js"&gt;&lt;/script&gt; 引入桥接脚本。
6. 样式使用内联 &lt;style&gt; 标签，所有文字使用中文。
7. 输出完整可运行的 HTML 文件。

请根据上述规则，生成用户需要的页面。<button class="copy-prompt" onclick="copyPrompt('prompt-d')">复制提示词</button></div>'''

if old_prompt_d in html:
    html = html.replace(old_prompt_d, new_prompt_d)
    print("✓ 更新了AI提示词模板D")
else:
    print("✗ 未找到提示词模板D")

# ============ 修改6: 更新自动识别演示中的三层检测说明 ============

old_demo_info = '''<div class="info-box">
        <strong>三层检测逻辑：</strong>桥接脚本按 <code>explicit</code>（data-ctrl-type 显式声明）→ <code>css</code>（CSS 类名匹配）→ <code>native</code>（HTML 标签推断）优先级检测。<code>source</code> 字段让宿主知道控件是设计器生成的还是纯 HTML 自动推断的，便于做不同处理。</div>'''

new_demo_info = '''<div class="info-box">
        <strong>五层智能识别：</strong>桥接脚本按 <code>explicit</code>（显式声明）→ <code>aria</code>（ARIA语义）→ <code>css</code>（CSS类名）→ <code>structure</code>（DOM结构）→ <code>native</code>（原生标签）优先级检测。<code>source</code> 字段让宿主知道控件是通过哪一层识别的，便于做不同处理。同时 <code>customname</code> 和 <code>basictype</code> 会自动推断填充。</div>'''

if old_demo_info in html:
    html = html.replace(old_demo_info, new_demo_info)
    print("✓ 更新了自动识别演示的说明")
else:
    print("✗ 未找到自动识别演示说明")

# ============ 修改7: 更新控件类型速查表 ============

old_quick_table = '''<h4>4.3 控件类型速查表</h4>
      <table>
        <thead><tr><th>控件名称</th><th>最简单写法（v2）</th><th>兼容写法（v1）</th><th>ctrlType 值</th></tr></thead>
        <tbody>
          <tr><td>按钮</td><td><code>&lt;button id="btn1"&gt;文字&lt;/button&gt;</code></td><td>加 data-ctrl-type="button"</td><td>button</td></tr>
          <tr><td>输入框</td><td><code>&lt;input type="text" id="inp1"&gt;</code></td><td>加 data-ctrl-type="inputText"</td><td>inputText</td></tr>
          <tr><td>密码框</td><td><code>&lt;input type="password" id="pwd1"&gt;</code></td><td>加 data-ctrl-type="inputText"</td><td>inputText</td></tr>
          <tr><td>文本域</td><td><code>&lt;textarea id="txt1"&gt;&lt;/textarea&gt;</code></td><td>加 data-ctrl-type="textarea"</td><td>textarea</td></tr>
          <tr><td>复选框</td><td><code>&lt;label&gt;&lt;input type="checkbox" id="chk1"&gt;文字&lt;/label&gt;</code></td><td>加 data-ctrl-type="checkbox"</td><td>checkbox</td></tr>
          <tr><td>单选框</td><td><code>&lt;input type="radio" id="rdo1" name="g1"&gt;</code></td><td>加 data-ctrl-type="radio"</td><td>radio</td></tr>
          <tr><td>下拉框</td><td><code>&lt;select id="sel1"&gt;&lt;option&gt;...&lt;/option&gt;&lt;/select&gt;</code></td><td>加 data-ctrl-type="comboBox"</td><td>comboBox</td></tr>
          <tr><td>超链接</td><td><code>&lt;a href="#" id="link1"&gt;文字&lt;/a&gt;</code></td><td>加 data-ctrl-type="hyperLink"</td><td>hyperLink</td></tr>
          <tr><td>进度条</td><td><code>&lt;input type="range" id="prg1"&gt;</code></td><td>加 data-ctrl-type="progressBar"</td><td>progressBar</td></tr>
          <tr><td>日期选择</td><td><code>&lt;input type="date" id="dt1"&gt;</code></td><td>加 data-ctrl-type="datetimePicker"</td><td>datetimePicker</td></tr>
          <tr><td>开关</td><td><code>&lt;label id="sw1"&gt;&lt;input type="checkbox"&gt;文字&lt;/label&gt;</code></td><td>加 data-ctrl-type="switchToggle"</td><td>switchToggle</td></tr>
          <tr><td>文本标签</td><td><code>&lt;span id="lbl1"&gt;文字&lt;/span&gt;</code></td><td>加 data-ctrl-type="label"</td><td>label</td></tr>
        </tbody>
      </table>'''

new_quick_table = '''<h4>4.3 控件类型速查表</h4>
      <table>
        <thead><tr><th>控件名称</th><th>推荐写法（原生HTML）</th><th>识别层级</th><th>ctrlType 值</th><th>customname来源</th></tr></thead>
        <tbody>
          <tr><td>按钮</td><td><code>&lt;button id="btn1"&gt;文字&lt;/button&gt;</code></td><td>Layer 5 native</td><td>button</td><td>按钮文字</td></tr>
          <tr><td>输入框</td><td><code>&lt;input type="text" id="inp1" placeholder="提示"&gt;</code></td><td>Layer 5 native</td><td>inputText</td><td>placeholder / label</td></tr>
          <tr><td>密码框</td><td><code>&lt;input type="password" id="pwd1"&gt;</code></td><td>Layer 5 native</td><td>inputText</td><td>label文字</td></tr>
          <tr><td>文本域</td><td><code>&lt;textarea id="txt1" placeholder="提示"&gt;&lt;/textarea&gt;</code></td><td>Layer 5 native</td><td>textarea</td><td>placeholder / label</td></tr>
          <tr><td>复选框</td><td><code>&lt;label&gt;&lt;input type="checkbox" id="chk1"&gt;文字&lt;/label&gt;</code></td><td>Layer 5 native</td><td>checkbox</td><td>label文字 / 后续文本</td></tr>
          <tr><td>单选框</td><td><code>&lt;input type="radio" id="rdo1" name="g1"&gt;</code></td><td>Layer 5 native</td><td>radio</td><td>label文字 / 后续文本</td></tr>
          <tr><td>组合框</td><td><code>&lt;select id="sel1"&gt;&lt;option&gt;...&lt;/option&gt;&lt;/select&gt;</code></td><td>Layer 5 native</td><td>comboBox</td><td>label文字 / 选中项文字</td></tr>
          <tr><td>超链接</td><td><code>&lt;a href="#" id="link1"&gt;文字&lt;/a&gt;</code></td><td>Layer 5 native</td><td>hyperLink</td><td>链接文字</td></tr>
          <tr><td>图片框</td><td><code>&lt;img id="img1" alt="描述"&gt;</code></td><td>Layer 5 native</td><td>imageBox</td><td>alt / title</td></tr>
          <tr><td>进度条</td><td><code>&lt;input type="range" id="prg1"&gt;</code></td><td>Layer 5 native</td><td>progressBar</td><td>label文字</td></tr>
          <tr><td>日期选择</td><td><code>&lt;input type="date" id="dt1"&gt;</code></td><td>Layer 5 native</td><td>datetimePicker</td><td>label文字</td></tr>
          <tr><td>开关</td><td><code>&lt;label id="sw1"&gt;&lt;input type="checkbox"&gt;文字&lt;/label&gt;</code></td><td>Layer 1 explicit</td><td>switchToggle</td><td>label文字</td></tr>
          <tr><td>文本标签</td><td><code>&lt;span id="lbl1"&gt;文字&lt;/span&gt;</code></td><td>Layer 5 native</td><td>label</td><td>元素文本</td></tr>
        </tbody>
      </table>'''

if old_quick_table in html:
    html = html.replace(old_quick_table, new_quick_table)
    print("✓ 更新了控件类型速查表")
else:
    print("✗ 未找到控件类型速查表")

# ============ 修改8: 更新属性规范表 ============

old_attr_table = '''<h4>4.1 属性规范</h4>
      <table>
        <thead><tr><th>属性</th><th>必填</th><th>说明</th><th>示例</th></tr></thead>
        <tbody>
          <tr><td><code>id</code></td><td><span class="tag tag-required">必填</span></td><td>控件唯一标识，宿主通过此 ID 发送命令和接收事件</td><td><code>id="btnSave"</code></td></tr>
          <tr><td><code>data-ctrl-type</code></td><td><span class="tag tag-optional">可选</span></td><td>精确控件类型，v1 旧方案使用，v2 中简单控件可省略</td><td><code>data-ctrl-type="button"</code></td></tr>
          <tr><td><code>data-type</code></td><td><span class="tag tag-optional">可选</span></td><td>基础控件类型，用于 CSS 样式定位</td><td><code>data-type="button"</code></td></tr>
          <tr><td><code>data-name</code></td><td><span class="tag tag-optional">可选</span></td><td>控件中文名称，显示在事件日志中便于识别</td><td><code>data-name="保存按钮"</code></td></tr>
          <tr><td><code>data-drag-type</code></td><td><span class="tag tag-optional">可选</span></td><td>拖拽类型标记，CSS 用于 WebView2 拖拽功能</td><td><code>data-drag-type="iconButton"</code></td></tr>
          <tr><td><code>data-ctrl-id</code></td><td><span class="tag tag-optional">已废弃</span></td><td>等同于 id，无需单独设置</td><td>—</td></tr>
          <tr><td><code>data-ctrl</code></td><td><span class="tag tag-new">v2新增</span></td><td>复杂控件容器声明：listbox / dataGrid / treeView / tabs</td><td><code>data-ctrl="listBox"</code></td></tr>
        </tbody>
      </table>'''

new_attr_table = '''<h4>4.1 属性规范</h4>
      <table>
        <thead><tr><th>属性</th><th>必填</th><th>说明</th><th>示例</th></tr></thead>
        <tbody>
          <tr><td><code>id</code></td><td><span class="tag tag-required">必填</span></td><td>控件唯一标识，宿主通过此 ID 发送命令和接收事件</td><td><code>id="btnSave"</code></td></tr>
          <tr><td><code>data-name</code></td><td><span class="tag tag-optional">推荐</span></td><td>控件中文名称，显示在事件日志中。不设置会自动从 label/placeholder/文本推断</td><td><code>data-name="保存按钮"</code></td></tr>
          <tr><td><code>data-type</code></td><td><span class="tag tag-optional">可选</span></td><td>基础类型中文名。不设置会自动从 ctrlType 映射中文名称</td><td><code>data-type="按钮"</code></td></tr>
          <tr><td><code>data-ctrl-type</code></td><td><span class="tag tag-optional">可选</span></td><td>显式指定控件类型（Layer 1，最高优先级）。简单控件用原生标签即可，无需设置</td><td><code>data-ctrl-type="button"</code></td></tr>
          <tr><td><code>aria-label</code></td><td><span class="tag tag-optional">可选</span></td><td>无障碍标签，同时会被用作 customname（Layer 2）</td><td><code>aria-label="保存"</code></td></tr>
          <tr><td><code>role</code></td><td><span class="tag tag-optional">可选</span></td><td>ARIA 语义化角色，用于控件识别（Layer 2）</td><td><code>role="button"</code></td></tr>
          <tr><td><code>data-drag-type</code></td><td><span class="tag tag-optional">可选</span></td><td>拖拽类型标记，CSS 用于 WebView2 拖拽功能</td><td><code>data-drag-type="iconButton"</code></td></tr>
          <tr><td><code>data-editable</code></td><td><span class="tag tag-optional">可选</span></td><td>是否可编辑（如进度条可点击调整）</td><td><code>data-editable="true"</code></td></tr>
        </tbody>
      </table>'''

if old_attr_table in html:
    html = html.replace(old_attr_table, new_attr_table)
    print("✓ 更新了属性规范表")
else:
    print("✗ 未找到属性规范表")

# ============ 保存更新后的文件 ============

# 转义为JavaScript字符串
js_content = 'window.__devGuideHTML = "' + html.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n') + '";'

with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"\n✓ 文件已保存，新长度: {len(html)} 字符")
print("✓ dev-guide.js 更新完成")