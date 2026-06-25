# 全面更新4个AI提示词模板
# 让它们更准确，体现五层智能识别、CSS class约定、pageContainer等新规范

with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.html', 'r', encoding='utf-8') as f:
    html = f.read()

print(f"读取文件，长度: {len(html)} 字符")

# ========== 模板 A：简单表单页 ==========
old_a_start = '<h4>模板 A：生成简单表单页</h4>'
old_a_end = '<h4>模板 B：生成数据表格页</h4>'

new_a = '''<h4>模板 A：生成简单表单页</h4>
      <div class="prompt-box" id="prompt-a">你是 webviewBridge.js 前端开发专家，请生成一个可在 WebView2 中运行的 HTML 表单页面，用于用户信息录入。

<b>核心规则（必须严格遵守）：</b>
1. 页面通过 webviewBridge.js 桥接脚本与宿主程序（易语言）通信。
2. <b>每个可交互控件必须设置唯一的 id 属性</b>，见名知意，推荐前缀：btn_/inp_/chk_/rdo_/sel_/txt_
3. 所有控件交互事件会自动上报给宿主，无需手动写事件监听。
4. <b>基础控件用原生 HTML 标签即可</b>，桥接脚本会自动识别（Layer 5）：
   - &lt;button id="xxx"&gt; → button 按钮
   - &lt;input type="text" id="xxx"&gt; → inputText 输入框
   - &lt;input type="password" id="xxx"&gt; → inputText 密码框
   - &lt;input type="checkbox" id="xxx"&gt; → checkbox 复选框
   - &lt;input type="radio" id="xxx" name="group"&gt; → radio 单选框
   - &lt;select id="xxx"&gt; → comboBox 组合框
   - &lt;textarea id="xxx"&gt; → textarea 文本域
5. <b>建议给重要控件设置 data-name="中文名"</b>，不设置也会自动从 label/placeholder/文本推断
6. 页面最外层必须有：&lt;div class="pageContainer" data-original-width="800" data-original-height="600" style="position:relative;"&gt;...&lt;/div&gt;

<b>控件列表：</b>
  1. 用户名字段：文本输入框，id: inp_username，placeholder: 请输入用户名
  2. 密码字段：密码输入框，id: inp_password，placeholder: 请输入密码
  3. 性别：单选框组，name: gender，id: rdo_male / rdo_female，选项：男/女
  4. 城市：下拉选择框，id: sel_city，选项：北京/上海/广州/深圳
  5. 备注：多行文本域，id: txt_remark，placeholder: 请输入备注
  6. 同意条款：复选框，id: chk_agree，文字：我已阅读并同意用户协议
  7. 提交按钮，id: btn_submit
  8. 取消按钮，id: btn_cancel

<b>输出要求：</b>
  - 必须通过 &lt;script src="webviewBridge.js"&gt;&lt;/script&gt; 引入桥接脚本
  - 样式使用内联 &lt;style&gt; 标签，布局美观
  - 所有文字使用中文
  - 输出完整可运行的 HTML 文件<button class="copy-prompt" onclick="copyPrompt('prompt-a')">复制提示词</button></div>

      '''

# ========== 模板 B：数据表格页 ==========
old_b_start = '<h4>模板 B：生成数据表格页</h4>'
old_b_end = '<h4>模板 C：生成带导航的复杂页面</h4>'

new_b = '''<h4>模板 B：生成数据表格页</h4>
      <div class="prompt-box" id="prompt-b">你是 webviewBridge.js 前端开发专家，请生成一个可在 WebView2 中运行的数据管理 HTML 页面。

<b>核心规则（必须严格遵守）：</b>
1. 页面通过 webviewBridge.js 桥接脚本与宿主程序（易语言）通信。
2. <b>每个可交互控件必须设置唯一的 id 属性</b>，见名知意。
3. 所有控件交互事件会自动上报给宿主，无需手动写事件监听。
4. <b>数据表格用原生 &lt;table&gt; + class="dataGrid"</b>（Layer 3 + Layer 4 识别）：
   - 表头 &lt;th&gt; 设置 data-col-key="列标识"，列名自动从 th 文本推断
   - 行索引 rowIndex 自动根据 tr 位置计算，无需设置 data-row-index
   - 列号 colKey 自动从 th 的 data-col-key 推断
5. 建议给表格设置 data-name="中文名"，不设置也会从 id 推断
6. 页面最外层必须有：&lt;div class="pageContainer" data-original-width="900" data-original-height="600" style="position:relative;"&gt;...&lt;/div&gt;

<b>页面布局：</b>
  - 顶部工具栏：搜索输入框(id: inp_search) + 搜索按钮(id: btn_search) + 添加按钮(id: btn_add) + 删除按钮(id: btn_delete) + 刷新按钮(id: btn_refresh)
  - 主体区域：数据表格(id: grid_users)

<b>表格结构示例（参考写法，按实际数据生成）：</b>
  &lt;table id="grid_users" class="dataGrid" data-name="用户表"&gt;
    &lt;thead&gt;
      &lt;tr&gt;
        &lt;th data-col-key="name"&gt;姓名&lt;/th&gt;
        &lt;th data-col-key="age"&gt;年龄&lt;/th&gt;
        &lt;th data-col-key="city"&gt;城市&lt;/th&gt;
        &lt;th data-col-key="status"&gt;状态&lt;/th&gt;
      &lt;/tr&gt;
    &lt;/thead&gt;
    &lt;tbody&gt;
      &lt;tr&gt;&lt;td&gt;张三&lt;/td&gt;&lt;td&gt;25&lt;/td&gt;&lt;td&gt;北京&lt;/td&gt;&lt;td&gt;启用&lt;/td&gt;&lt;/tr&gt;
      &lt;tr&gt;&lt;td&gt;李四&lt;/td&gt;&lt;td&gt;30&lt;/td&gt;&lt;td&gt;上海&lt;/td&gt;&lt;td&gt;禁用&lt;/td&gt;&lt;/tr&gt;
    &lt;/tbody&gt;
  &lt;/table&gt;

<b>示例数据（3-5行）：</b>
  姓名、年龄、城市、状态 四个字段

<b>输出要求：</b>
  - 必须通过 &lt;script src="webviewBridge.js"&gt;&lt;/script&gt; 引入桥接脚本
  - 样式使用内联 &lt;style&gt; 标签，表格美观带边框斑马纹
  - 所有文字使用中文
  - 输出完整可运行的 HTML 文件<button class="copy-prompt" onclick="copyPrompt('prompt-b')">复制提示词</button></div>

      '''

# ========== 模板 C：带导航的复杂页面 ==========
old_c_start = '<h4>模板 C：生成带导航的复杂页面</h4>'
old_c_end = '<h4>模板 D：通用万能提示词</h4>'

new_c = '''<h4>模板 C：生成带导航的复杂页面</h4>
      <div class="prompt-box" id="prompt-c">你是 webviewBridge.js 前端开发专家，请生成一个可在 WebView2 中运行的复杂 HTML 页面，使用标签页切换不同功能模块。

<b>核心规则（必须严格遵守）：</b>
1. 页面通过 webviewBridge.js 桥接脚本与宿主程序（易语言）通信。
2. <b>每个可交互控件必须设置唯一的 id 属性</b>，见名知意。
3. 所有控件交互事件会自动上报给宿主，无需手动写事件监听。
4. <b>标签页用 CSS class 约定结构</b>（Layer 3 识别）：
   - 容器: class="tabsContainer"
   - 头部: class="tabsContainer_headerBar"
   - 标签按钮: class="tabsContainer_headerBar_btn" + data-tab-id="标识"
   - 内容容器: class="tabsContainer_contentWrapper"
   - 内容面板: data-tab-id="标识"（与按钮对应）
5. <b>列表框用原生 &lt;ul&gt;/&lt;li&gt; + class="listBox"</b>（Layer 3 + Layer 4 识别）：
   - 容器: &lt;ul class="listBox" id="xxx"&gt;
   - 列表项: &lt;li data-item-id="1"&gt;文字&lt;/li&gt;
   - itemIndex 自动根据位置计算
6. 建议给重要控件设置 data-name="中文名"
7. 页面最外层必须有：&lt;div class="pageContainer" data-original-width="800" data-original-height="600" style="position:relative;"&gt;...&lt;/div&gt;

<b>页面布局：</b>
  - 顶部：页面标题
  - 主体：标签页容器（id: tabs_main），3个标签页

<b>标签页1 - 基本设置：</b>
  用户名输入框(id: inp_username)、开关(id: sw_enable, data-name="启用开关")、城市下拉框(id: sel_city)、保存按钮(id: btn_save)

<b>标签页2 - 数据列表：</b>
  列表框(id: list_data, class="listBox", data-name="数据列表")展示3-5条示例数据
  文本输入框(id: inp_newitem) + 添加按钮(id: btn_additem) 用于新增列表项

<b>标签页3 - 关于：</b>
  展示软件版本、作者、官网超链接(id: link_official)等信息

<b>标签页结构示例（参考写法）：</b>
  &lt;div id="tabs_main" class="tabsContainer" data-name="主标签页"&gt;
    &lt;div class="tabsContainer_headerBar"&gt;
      &lt;div class="tabsContainer_headerBar_btn" data-tab-id="tab1"&gt;基本设置&lt;/div&gt;
      &lt;div class="tabsContainer_headerBar_btn" data-tab-id="tab2"&gt;数据列表&lt;/div&gt;
      &lt;div class="tabsContainer_headerBar_btn" data-tab-id="tab3"&gt;关于&lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="tabsContainer_contentWrapper"&gt;
      &lt;div data-tab-id="tab1"&gt;内容1&lt;/div&gt;
      &lt;div data-tab-id="tab2"&gt;内容2&lt;/div&gt;
      &lt;div data-tab-id="tab3"&gt;内容3&lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;

<b>输出要求：</b>
  - 必须通过 &lt;script src="webviewBridge.js"&gt;&lt;/script&gt; 引入桥接脚本
  - 样式使用内联 &lt;style&gt; 标签，标签页切换有基础JS实现（可选）
  - 所有文字使用中文
  - 输出完整可运行的 HTML 文件<button class="copy-prompt" onclick="copyPrompt('prompt-c')">复制提示词</button></div>

      '''

# ========== 模板 D：通用万能提示词（优化版） ==========
old_d_start = '<h4>模板 D：通用万能提示词</h4>'
old_d_end = '    </div>\n\n    <!-- 四、控件开发规则 -->'

new_d = '''<h4>模板 D：通用万能提示词</h4>
      <div class="prompt-box" id="prompt-d">你是 webviewBridge.js 前端开发专家，请生成一个可在 WebView2 中运行的完整 HTML 页面。

<b>【身份定位】</b>
你是精通 webviewBridge.js 桥接机制的前端开发专家，擅长用最简洁的 HTML 结构实现与宿主程序（易语言）的完整交互。

<b>【核心规则 — 必须100%严格遵守】</b>
1. 页面通过 webviewBridge.js 与宿主程序通信，脚本已存在，只需引入。
2. <b>每个可交互控件必须设置唯一 id</b>，命名规范：英文小写+下划线，见名知意。
   推荐前缀：btn_(按钮) / inp_(输入) / chk_(复选) / rdo_(单选) / sel_(下拉) / txt_(文本域) /
           list_(列表) / grid_(表格) / tree_(树形) / tabs_(标签页) / card_(卡片) /
           progress_(进度) / lbl_(标签) / link_(链接) / img_(图片) / sw_(开关)
3. <b>绝对不要手动写任何事件监听</b>（onclick/onchange等），所有交互由桥接脚本自动捕获上报。
4. 必须引入：&lt;script src="webviewBridge.js"&gt;&lt;/script&gt;
5. 页面最外层必须有 pageContainer 容器：
   &lt;div class="pageContainer" data-original-width="页面宽度" data-original-height="页面高度" style="position:relative;"&gt;...&lt;/div&gt;

<b>【五层智能识别机制】</b>
控件类型自动识别，优先级从高到低：
- Layer 1: data-ctrl-type 属性（显式声明，最高优先级，兼容旧版，简单控件不要用）
- Layer 2: ARIA role 属性（语义化识别，无障碍友好）
- Layer 3: CSS class 约定命名（复杂容器控件推荐用）
- Layer 4: DOM 结构特征推断（ul/li、table等自动识别）
- Layer 5: 原生 HTML 标签（基础控件推荐用，零配置）

<b>【智能辅助数据 — 自动填充】</b>
- customname（控件中文名）：自动从 data-name → aria-label → 关联label → placeholder → 元素文本 → title/alt → id 推断
  💡 建议：重要控件手动设置 data-name="中文名"，最准确
- basictype（基础类型中文名）：自动从 data-type → ctrlType中文映射 推断
- source（识别来源）：自动标记是哪一层识别到的

<b>【基础控件 — 推荐用原生标签（Layer 5）】</b>
   &lt;button id="xxx" data-name="显示名"&gt;文字&lt;/button&gt;           → button 按钮
   &lt;input type="text" id="xxx" placeholder="提示"&gt;              → inputText 输入框
   &lt;input type="password" id="xxx"&gt;                              → inputText 密码框
   &lt;input type="checkbox" id="xxx"&gt; 文字                         → checkbox 复选框
   &lt;input type="radio" id="xxx" name="组名"&gt; 文字               → radio 单选框
   &lt;select id="xxx"&gt;&lt;option value="v"&gt;文字&lt;/option&gt;&lt;/select&gt; → comboBox 组合框
   &lt;textarea id="xxx" placeholder="提示" rows="4"&gt;&lt;/textarea&gt;   → textarea 文本域
   &lt;a href="#" id="xxx"&gt;文字&lt;/a&gt;                                 → hyperLink 超链接
   &lt;img id="xxx" src="url" alt="描述"&gt;                           → imageBox 图片框
   &lt;span id="xxx"&gt;文字&lt;/span&gt;                                    → label 文本标签
   &lt;input type="range" id="xxx" min="0" max="100"&gt;              → progressBar 进度条
   &lt;input type="date" id="xxx"&gt;                                  → datetimePicker 日期

<b>【复杂控件 — 推荐用 CSS class 约定（Layer 3）】</b>

▸ 列表框 listBox（也支持原生 ul/li 结构推断）：
  &lt;ul id="list_xxx" class="listBox" data-name="列表名"&gt;
    &lt;li data-item-id="1"&gt;项1&lt;/li&gt;
    &lt;li data-item-id="2"&gt;项2&lt;/li&gt;
  &lt;/ul&gt;
  👉 itemIndex 自动计算，无需手动设置

▸ 数据表格 dataGrid（也支持原生 table 结构推断）：
  &lt;table id="grid_xxx" class="dataGrid" data-name="表格名"&gt;
    &lt;thead&gt;&lt;tr&gt;
      &lt;th data-col-key="col1"&gt;列名1&lt;/th&gt;
      &lt;th data-col-key="col2"&gt;列名2&lt;/th&gt;
    &lt;/tr&gt;&lt;/thead&gt;
    &lt;tbody&gt;
      &lt;tr&gt;&lt;td&gt;值1&lt;/td&gt;&lt;td&gt;值2&lt;/td&gt;&lt;/tr&gt;
    &lt;/tbody&gt;
  &lt;/table&gt;
  👉 rowIndex / colKey / colName 全部自动推断

▸ 树形框 treeView：
  容器 class="treeView"
  节点 class="treeView_node" data-node-id="xxx"
  标签 class="treeView_label"
  展开按钮 class="treeView_toggle"
  子容器 class="treeView_children"

▸ 标签页 tabsContainer：
  容器 class="tabsContainer"
  头部 class="tabsContainer_headerBar"
  标签按钮 class="tabsContainer_headerBar_btn" data-tab-id="xxx"
  内容区 class="tabsContainer_contentWrapper"
  内容面板 data-tab-id="xxx"（与按钮对应）

▸ 卡片框 cardBox：
  容器 class="cardBox"
  头部 class="cardBox_header"
  标题 class="cardBox_header_title"
  折叠按钮 class="cardBox_collapse_btn"
  内容区 class="cardBox_body"

▸ 进度条 progressBar（可选，也可用原生range）：
  &lt;div id="xxx" class="progressBar" data-editable="true"&gt;
    &lt;div class="progressBar_fill" style="width:60%"&gt;&lt;/div&gt;
  &lt;/div&gt;

▸ 日志框 logOutput：
  &lt;div id="xxx" class="logOutput" data-name="日志"&gt;
    &lt;div&gt;[INFO] 日志内容&lt;/div&gt;
  &lt;/div&gt;

<b>【⚠️ 特殊提醒 — 开关控件】</b>
开关 switchToggle 必须显式声明 data-ctrl-type="switchToggle"（因为原生 checkbox 和开关HTML无法区分）：
  &lt;label id="sw_xxx" data-ctrl-type="switchToggle" data-name="开关名"&gt;
    &lt;input type="checkbox"&gt; 文字
  &lt;/label&gt;

<b>【宿主与页面的交互方式】</b>
- 事件上报：用户操作控件时，桥接脚本自动 postMessage 给宿主，包含 targetId/ctrlType/customname/source/data 等字段
- 命令执行：宿主通过 PostWebMessageAsJson 发送命令，格式：{ "command": "控件id.方法名", "value": 值, "needResult": true }
- 直接调用：页面内 JS 可通过 webviewBridge.api.模块名.方法名(id, ...args) 直接调用

<b>【输出要求】</b>
- 完整可运行的 HTML 文件
- 样式使用内联 &lt;style&gt; 标签，界面美观
- 所有文字使用中文
- 代码结构清晰，缩进规范

请根据用户需求，严格按照上述规则生成页面。<button class="copy-prompt" onclick="copyPrompt('prompt-d')">复制提示词</button></div>
    </div>

    '''

# ========== 执行替换 ==========

# 替换模板A
idx_a_start = html.find(old_a_start)
idx_a_end = html.find(old_b_start)
if idx_a_start > 0 and idx_a_end > 0:
    html = html[:idx_a_start] + new_a + html[idx_a_end:]
    print("✓ 模板A 已更新")
else:
    print("✗ 模板A 未找到位置")
    print(f"  start: {idx_a_start}, end: {idx_a_end}")

# 替换模板B（需要重新找位置，因为html已经变了）
idx_b_start = html.find(old_b_start)
idx_b_end = html.find(old_c_start)
if idx_b_start > 0 and idx_b_end > 0:
    html = html[:idx_b_start] + new_b + html[idx_b_end:]
    print("✓ 模板B 已更新")
else:
    print("✗ 模板B 未找到位置")
    print(f"  start: {idx_b_start}, end: {idx_b_end}")

# 替换模板C
idx_c_start = html.find(old_c_start)
idx_c_end = html.find(old_d_start)
if idx_c_start > 0 and idx_c_end > 0:
    html = html[:idx_c_start] + new_c + html[idx_c_end:]
    print("✓ 模板C 已更新")
else:
    print("✗ 模板C 未找到位置")
    print(f"  start: {idx_c_start}, end: {idx_c_end}")

# 替换模板D
idx_d_start = html.find(old_d_start)
idx_d_end = html.find(old_d_end)
if idx_d_start > 0 and idx_d_end > 0:
    html = html[:idx_d_start] + new_d + html[idx_d_end:]
    print("✓ 模板D 已更新")
else:
    print("✗ 模板D 未找到位置")
    print(f"  start: {idx_d_start}, end: {idx_d_end}")

print(f"\n替换后总长度: {len(html)} 字符")

# 保存
with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("✓ dev-guide.html 已更新")

# 同步更新 dev-guide.js
js_content = 'window.__devGuideHTML = "' + html.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n') + '";'
with open('d:/phpstudy_pro/WWW/SUIDesigner/public/docs/data/dev-guide.js', 'w', encoding='utf-8') as f:
    f.write(js_content)
print("✓ dev-guide.js 已更新")

print("\n✅ 全部4个AI提示词模板已更新完成！")