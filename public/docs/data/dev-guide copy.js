window.__devGuideHTML = `
<div class="section-header">
  <h2>🚀 快速开发指南（设计器完美匹配版）</h2>
  <div class="h2-meta">
    <span class="ctrl-badge">必读</span>
  </div>
</div>

<style>
  /* 此样式块仅用于本指南内部，不影响业务页面 */
  .dev-step { background:#fff;padding:20px; margin-bottom:16px; border:1px solid #c8d6e5;border-radius:8px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.07);}
  .dev-step h3 { border-bottom:2px solid #409EFF; padding-bottom:8px; margin-bottom:12px; color:#1a1a2e; font-size:17px; }
  .dev-step h3 .step-num { display:inline-block; background:#409EFF; color:#fff; width:28px; height:28px; line-height:28px; text-align:center; border-radius:50%; margin-right:8px; font-size:14px; }
  .dev-step h4 { font-size:14px; color:#333; margin:14px 0 6px; }
  .dev-step ul, .dev-step ol { padding-left:24px; margin:6px 0; }
  .dev-step li { margin:4px 0; font-size:13px; color:#555; }
  .dev-step .tip-box { background:#fff8e1; border-left:4px solid #ffc107; padding:10px 14px; margin:10px 0; border-radius:0 4px 4px 0; font-size:13px; }
  .dev-step .info-box { background:#e3f2fd; border-left:4px solid #2196F3; padding:10px 14px; margin:10px 0; border-radius:0 4px 4px 0; font-size:13px; }
  .dev-step .warn-box { background:#fce4ec; border-left:4px solid #f44336; padding:10px 14px; margin:10px 0; border-radius:0 4px 4px 0; font-size:13px; }
  .dev-step table { width:100%; border-collapse:collapse; font-size:13px; margin:10px 0; }
  .dev-step table th { background:#f5f5f5; padding:8px 12px; text-align:left; border:1px solid #e0e0e0; font-weight:600; font-size:12px; }
  .dev-step table td { padding:8px 12px; border:1px solid #e8eaed; }
  .dev-step code { background:#f0f4f8; padding:2px 6px; border-radius:3px; font-size:13px; color:#409EFF; }
  .dev-step pre { margin:0; }
  .tag { display:inline-block; padding:2px 8px; border-radius:4px; font-size:11px; margin-right:4px; font-weight:600; }
  .tag-required { background:#fce4ec; color:#c62828; }
  .tag-optional { background:#e3f2fd; color:#1565c0; }
  .tag-recommend { background:#e8f5e9; color:#2e7d32; }
  .checklist { display:flex; flex-wrap:wrap; gap:8px; margin:10px 0; }
  .checklist .check-item { background:#f5f5f5; padding:4px 10px; border-radius:4px; font-size:12px; color:#555; }
  .checklist .check-item::before { content:'✅ '; color:#aaa; }
  .checklist .check-item.done::before { content:'✅ '; }
  .code-block { background:transparent; border-radius:6px; margin:4px 0; overflow:hidden; box-shadow: 0px 4px 11px -5px rgba(0, 0, 0, 0.41);}
  .code-block-header { display:flex; justify-content:space-between; align-items:center; padding:6px 14px; background:linear-gradient(90deg, #cecfd1 0%, #dcdddf 0%, #f5f5f5 100%); border-bottom:1px solid #e9e9e9; }
  .code-block-header .lang-label { color:#4d6e00; font-size:12px; font-weight:600; }
  .code-block-header .copy-btn { background:#555; border:1px solid #777; color:#fff; padding:2px 10px; border-radius:3px; cursor:pointer; font-size:11px; }
  .code-block-header .copy-btn:hover { background:#777; }
  .code-block-header .copied { background:#28a745; color:#fff}
  .code-block-header .copied:hover { background:#777; color:#fff}
  .code-block pre { margin:0; padding:14px; color:#d4d4d4; font-size:12px; line-height:1.6; white-space:pre-wrap; word-break:break-all; overflow-x:auto; }
  .prompt-box { background:#1e1e1e; color:#d4d4d4; border-radius:6px; padding:0 14px; margin:10px 0; font-size:12px; line-height:1.6; position:relative; white-space:pre-wrap; word-break:break-all; box-shadow: 0px 10px 25px -1px rgba(0, 0, 0, 0.29);}
  .prompt-box .copy-prompt { position:absolute; top:8px; right:8px; background:#555; border:1px solid #777; color:#fff; padding:2px 10px; border-radius:3px; cursor:pointer; font-size:11px; }
  .prompt-box .copy-prompt:hover { background:#777; }
  .prompt-box .copied{ background:#28a745; color:#fff}
  .prompt-box .copied:hover { background:#28a745; color:#fff}
</style>

<!-- ==================== 1. 快速开始（3 步上手） ==================== -->
<div class="dev-step">
  <h3><span class="step-num">1</span> 快速开始（3 步上手）</h3>

  <h4>第 1 步：引入桥接脚本</h4>
  <p>在页面 <code>&lt;body&gt;</code> 末尾引入：</p>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;script src="webviewBridge.js"&gt;&lt;/script&gt;</code></pre>
  </div>

  <h4>第 2 步：创建页面容器</h4>
  <p>页面容器需设置 <code>app-region: drag</code> 使整个窗口可拖拽。</p>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML + CSS</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div class="pageContainer glass-effect" id="pageContainer"
     data-ctrl-type="pageContainer"
     data-name="canvas"
     data-original-width="1065"
     data-original-height="695"
     style="position:relative; app-region: drag; -webkit-app-region: drag;"&gt;
  &lt;!-- 所有控件放在这里 --&gt;
&lt;/div&gt;

&lt;style&gt;
  /* ⚠️ 只有【可交互控件】才需要 data-drag-type（按钮、输入框、菜单项等） */
  /* 纯布局容器（侧边栏、内容区、卡片容器等）【不需要】添加 data-drag-type */
  [data-drag-type] { app-region: no-drag; -webkit-app-region: no-drag; }
  /* 最大化按钮内部 span 允许拖拽（支持 Windows 11 Snap Layout） */
  [data-ctrl-type="titlebar_max"] span { app-region: drag; -webkit-app-region: drag; }
&lt;/style&gt;</code></pre>
  </div>

  <div class="info-box">
    <strong>🪟 Windows 11 贴靠布局（Snap Layout）兼容说明</strong><br/>
    在 Windows 11 中，鼠标悬停最大化按钮时会弹出贴靠布局菜单。要触发此功能，<strong>最大化按钮所在的区域必须被系统识别为“标题栏可拖拽区域”</strong>。
    <ul style="margin:8px 0 0 20px;line-height:1.8;">
      <li><strong>按钮自身</strong>：必须设为 <code>app-region: no-drag</code>（保证点击响应）。</li>
      <li><strong>按钮内部的 <code>&lt;span&gt;</code>（或 <code>&lt;div&gt;</code>）</strong>：必须设为 <code>app-region: drag</code>，让系统认为该区域属于标题栏，从而激活悬停时的贴靠布局。</li>
      <li><strong>固定宽高 18px</strong>：与 Windows 11 默认标题栏按钮尺寸一致，确保悬停热区准确。</li>
    </ul>
    <div style="margin-top:8px;padding:8px;background:#f5f5f5;border-radius:4px;font-size:12px;color:#333;">
      <strong>正确示例：</strong><br/>
      <code>&lt;button id="titlebar_max" data-ctrl-type="titlebar_max"&gt;<br/>
      &nbsp;&nbsp;&lt;span style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;"&gt;☐&lt;/span&gt;<br/>
      &lt;/button&gt;</code><br/>
      <code>/* CSS */</code><br/>
      <code>[data-ctrl-type="titlebar_max"] { app-region: no-drag; }</code><br/>
      <code>[data-ctrl-type="titlebar_max"] span { app-region: drag; }</code>
    </div>
    <p style="margin-top:6px;"><strong>⚠️ 如果缺少此设置</strong>，最大化按钮在 Windows 11 中悬停时将不会弹出贴靠布局菜单，影响用户体验。</p>
  </div>

  <h4>第 3 步：控件属性规范（重要！细节看下面第 4 步）</h4>
  <ul>
    <li><strong>每个控件必须设置<code>id</code>（唯一标识）、<code>data-ctrl-type</code>（控件类型）、<code>data-name</code>（中文名，推荐），与桥接脚本配合使用。</strong></li>
    <li><strong>每个可交互控件必须设置<code>data-drag-type</code>（防拖拽标记）</strong></li>
    <li><strong>纯布局容器不需要添加 <code>data-drag-type</code>，它们应保持可拖拽，让用户能通过拖拽空白区域移动窗口。</strong></li>
  </ul>
  <h4>第 4 步：添加控件</h4>
  <p>所有控件模板都已包含 <strong>完整属性</strong>，直接复制使用即可。</p>

  <!-- ========== 修改点 ①：核心原则（区分可交互控件与布局容器） ========== -->
  <div class="warn-box">
    <strong>⚠️ 核心原则（必须遵守）：</strong>
    <ul style="margin:6px 0 0 20px;">
      <li><strong>可交互控件</strong>（按钮、输入框、下拉框、菜单项等）必须设置 <strong>4 个必要属性</strong>：<code>id</code>（唯一）、<code>data-ctrl-type</code>（控件类型）、<code>data-drag-type</code>（防拖拽标记）、<code>data-name</code>（中文名，推荐）。</li>
      <li><strong>纯布局容器</strong>（侧边栏 <code>.sidebar</code>、内容区 <code>.main-content</code>、卡片容器 <code>.card-panel</code> 等）<strong>不需要</strong>添加 <code>data-drag-type</code>，它们应保持可拖拽，让用户能通过拖拽空白区域移动窗口。</li>
      <li><strong>判断规则：用户能“点击”或“输入”的元素 → 需要 <code>data-drag-type</code>；仅用于“承载/布局”的元素 → 不需要。</strong></li>
      <li><strong>对于标准原生标签</strong>（如 <code>&lt;button&gt;</code>、<code>&lt;input&gt;</code>、<code>&lt;select&gt;</code>），<code>data-ctrl-type</code> 可以省略（脚本会自动识别）。</li>
      <li><strong>但对于自定义标签或布局元素</strong>（如导航菜单项 <code>&lt;div class="nav-item"&gt;</code>、自定义按钮等），<strong>必须显式添加 <code>data-ctrl-type</code></strong>（通常设为 <code>button</code> 或 <code>listBox_item</code>），否则事件会被错误地归并到父容器。</li>
      <li><strong>不要依赖自动推断</strong>，对于自定义元素，显式填写所有属性可确保 100% 上报正确。</li>
      <li>开关（SwitchToggle）必须使用 <code>data-ctrl-type="switchToggle"</code>。</li>
    </ul>
  </div>

  <!-- ========== 修改点 ②：新增判断规则速查表 ========== -->
  <div class="tip-box">
    <strong>📋 快速判断：哪些元素需要 <code>data-drag-type</code>？</strong>
    <table style="margin-top:6px;font-size:12px;">
      <thead>
        <tr><th style="width:45%;">元素类型</th><th style="width:20%;">需要 data-drag-type</th><th style="width:35%;">示例</th></tr>
      </thead>
      <tbody>
        <tr><td>按钮、输入框、下拉框、复选框、单选框、开关、超链接</td><td style="color:#2e7d32;font-weight:600;">✅ 是</td><td><code>&lt;button&gt;</code>、<code>&lt;input&gt;</code>、<code>&lt;select&gt;</code></td></tr>
        <tr><td>导航菜单项、自定义按钮、列表项、树节点（可点击部分）</td><td style="color:#2e7d32;font-weight:600;">✅ 是</td><td><code>&lt;div class="nav-item"&gt;</code>、<code>.listBox_item</code></td></tr>
        <tr><td>侧边栏、内容区、卡片容器、标签页容器、弹窗背景</td><td style="color:#c62828;font-weight:600;">❌ 否</td><td><code>.sidebar</code>、<code>.main-content</code>等控件</td></tr>
        <tr><td>页面容器本身（<code>#pageContainer</code>）</td><td style="color:#c62828;font-weight:600;">❌ 否</td><td><code>#pageContainer</code>（已由 <code>app-region: drag</code> 控制）</td></tr>
      </tbody>
    </table>
    <p style="margin-top:6px;">记忆口诀：<strong>"能点能输入"</strong>就需要，<strong>"纯放东西"</strong>不需要。</p>
  </div>
</div>

<!-- ==================== 2. 图标占位符处理 ==================== -->
<div class="dev-step">
  <h3><span class="step-num">2</span> 图标占位符处理（IconManager）</h3>
  <p>桥接脚本内置了 <strong>图标管理器（IconManager）</strong>，支持将 <code>[OK]</code>、<code>{ERROR}</code> 等占位符自动转换为对应的 Emoji 图标。</p>
  <ul>
    <li><strong>解析（页面显示）</strong>：<code>IconManager.parse(text)</code> 将占位符转为图标，通常无需手动调用，脚本会自动处理。</li>
    <li><strong>转义（上报数据）</strong>：<code>IconManager.toText(html)</code> 将图标转为占位符或 <code>[U+XXXX]</code>，所有事件上报和 API 返回值均会自动执行此操作。</li>
  </ul>
  <div class="tip-box">
    <strong>💡 开发建议：</strong>在控件文本中直接使用占位符，如 <code>&lt;button&gt;[OK] 确定&lt;/button&gt;</code>，即可显示为“✅ 确定”。无需额外处理，桥接脚本会自动完成双向转换。
  </div>
</div>

<!-- ==================== 3. 基础控件完整模板 ==================== -->
<div class="dev-step">
  <h3><span class="step-num">3</span> 基础控件完整模板</h3>
  <p>以下每个模板都包含 <strong>全部必要属性</strong>，直接复制到页面中即可。</p>

  <!-- ========== 修改点 ③：表格上方增加 data-drag-type 适用范围说明 ========== -->
  <div class="info-box">
    <strong>📌 关于 <code>data-drag-type</code> 的适用范围：</strong><br/>
    下表列出的 <strong>所有控件都是可交互控件</strong>（用户可点击或输入），因此每个模板都包含 <code>data-drag-type</code> 属性。<br/>
    <strong>纯布局容器</strong>（如侧边栏 <code>.sidebar</code>、内容区 <code>.main-content</code>、卡片容器 <code>.card-panel</code>）<strong>不要添加</strong> <code>data-drag-type</code>，以保持窗口拖拽能力。
  </div>

  <table>
    <thead>
      <tr><th style="width:120px;">控件</th><th style="width:45%;">完整 HTML 模板</th><th style="width:30%;">说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>按钮</strong></td>
        <td><code>&lt;button id="btn_xxx" data-ctrl-type="button" data-name="按钮名" data-drag-type="button"&gt;文字&lt;/button&gt;</code></td>
        <td>点击上报 <code>click</code>，<code>data.value</code> = 按钮文字</td>
      </tr>
      <tr>
        <td><strong>导航菜单项</strong></td>
        <td><code>&lt;div id="nav_xxx" class="nav-item" data-ctrl-type="button" data-drag-type="button" data-name="仪表盘"&gt;仪表盘&lt;/div&gt;</code></td>
        <td><strong>自定义元素必须显式设置</strong>，否则上报会被父容器捕获。</td>
      </tr>
      <tr>
        <td><strong>输入框</strong></td>
        <td><code>&lt;input id="inp_xxx" type="text" data-ctrl-type="inputText" data-name="输入框名" data-drag-type="inputText" placeholder="提示""&gt;</code></td>
        <td>输入/失焦上报 <code>change</code>，<code>data.value</code> = 当前值</td>
      </tr>
      <tr>
        <td><strong>密码框</strong></td>
        <td><code>&lt;input id="pwd_xxx" type="password" data-ctrl-type="inputText" data-name="密码框" data-drag-type="inputText" placeholder="请输入密码"&gt;</code></td>
        <td>同输入框，类型为 password</td>
      </tr>
      <tr>
        <td><strong>文本域</strong></td>
        <td><code>&lt;textarea id="txt_xxx" data-ctrl-type="textarea" data-name="文本域" data-drag-type="textarea" rows="4" placeholder="请输入"&gt;&lt;/textarea&gt;</code></td>
        <td>多行文本，上报 <code>change</code></td>
      </tr>
      <tr>
        <td><strong>复选框</strong></td>
        <td><code>&lt;label id="chk_xxx" data-ctrl-type="checkbox" data-name="复选框" data-drag-type="checkbox"&gt;&lt;span&gt;选项文字&lt;/span&gt;&lt;/label&gt;</code></td>
        <td><code>data.checked</code> = true/false</td>
      </tr>
      <tr>
        <td><strong>单选框</strong></td>
        <td><code>&lt;input id="rdo_xxx" type="radio" name="group" data-ctrl-type="radio" data-name="单选框" data-drag-type="radio" value="val"&gt;</code></td>
        <td><code>data.groupName</code> + <code>data.checked</code></td>
      </tr>
      <tr>
        <td><strong>开关</strong></td>
        <td><code>&lt;label id="sw_xxx" data-ctrl-type="switchToggle" data-name="开关" data-drag-type="switchToggle"&gt;&lt;input type="checkbox" /&gt;&lt;span class="slider"&gt;&lt;/span&gt;&lt;/label&gt;</code></td>
        <td><strong>必须</strong>用 <code>switchToggle</code>，checkbox 无法区分</td>
      </tr>
      <tr>
        <td><strong>下拉框</strong></td>
        <td><code>&lt;select id="sel_xxx" data-ctrl-type="comboBox" data-name="下拉框" data-drag-type="comboBox"&gt;&lt;option value="v"&gt;选项&lt;/option&gt;&lt;/select&gt;</code></td>
        <td><code>data.value</code> = 选中值，<code>data.index</code> = 索引</td>
      </tr>
      <tr>
        <td><strong>超链接</strong></td>
        <td><code>&lt;a id="link_xxx" data-ctrl-type="hyperLink" data-name="链接" data-drag-type="hyperLink" data-href="https://..."&gt;链接文字&lt;/a&gt;</code></td>
        <td>点击上报 <code>click</code>，不跳转页面</td>
      </tr>
      <tr>
        <td><strong>文本标签</strong></td>
        <td><code>&lt;span id="lbl_xxx" data-ctrl-type="label" data-name="标签" data-drag-type="label" &gt;文字&lt;/span&gt;</code></td>
        <td>点击上报 <code>click</code>，<code>data.text</code> = 内容</td>
      </tr>
      <tr>
        <td><strong>图片框</strong></td>
        <td><code>&lt;div id="img_xxx" data-ctrl-type="imageBox" data-name="图片" data-drag-type="imageBox"&gt;&lt;img src="url" alt="描述" /&gt;&lt;/div&gt;</code></td>
        <td><strong>必须包含 <code>&lt;img&gt;</code> 标签</strong>，<code>customname</code> 优先取 <code>data-name</code> → alt</td>
      </tr>
      <tr>
        <td><strong>进度条</strong></td>
        <td><code>&lt;input id="prg_xxx" type="range" data-ctrl-type="progressBar" data-name="进度条" data-drag-type="progressBar" min="0" max="100" value="50"&gt;</code></td>
        <td>原生 range 即进度条，上报 <code>data.value</code></td>
      </tr>
      <tr>
        <td><strong>日期选择</strong></td>
        <td><code>&lt;input id="dt_xxx" type="date" data-ctrl-type="datetimePicker" data-name="日期选择" data-drag-type="datetimePicker"&gt;</code></td>
        <td>type="date" / "datetime-local"</td>
      </tr>
      <tr>
        <td><strong>分割线</strong></td>
        <td><code>&lt;div id="divider_xxx" data-ctrl-type="divider" data-name="分割线" data-drag-type="divider" style="border-top:1px solid #D0D0D0;"&gt;&lt;/div&gt;</code></td>
        <td>纯样式控件，无交互事件</td>
      </tr>
    </tbody>
  </table>

  <div class="tip-box">
    <strong>💡 快速记忆口诀：</strong>“<strong>id</strong> 唯一不能少，<strong>ctrl-type</strong> 定类型，<strong>drag-type</strong> 防拖拽，<strong>data-name</strong> 写中文。”
  </div>
</div>

<!-- ==================== 4. 复杂控件完整模板（含完整类名） ==================== -->
<div class="dev-step">
  <h3><span class="step-num">4</span> 复杂控件完整模板</h3>
  <p>以下模板展示了每个复杂控件的 <strong>完整 DOM 结构</strong>，包括设计器导出的标准类名（含 <code>_container</code> 后缀）和必需的数据属性。</p>

  <div class="warn-box">
    <strong>⚠️ 类名说明：</strong>设计器导出的容器类名统一使用 <code>_container</code> 后缀（如 <code>dataGrid_container</code>、<code>logOutput_container</code>、<code>progressBar_container</code>），这与桥接脚本的 CSS 层级识别完全兼容，建议沿用此规范。
  </div>

  <h4>4.1 标题栏（TitleBar） — 完整结构</h4>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div class="titlebar" id="titlebar" data-name="标题栏" style="position:absolute;top:0;left:0;right:0;height:40px;background:#F8F8F8;border-bottom:1px solid rgba(0,0,0,0.08);app-region: drag;-webkit-app-region: drag;"&gt;
  &lt;div class="titlebar_left"&gt;
    &lt;span class="titlebar_left_icon" id="titlebar_left_icon" data-ctrl-type="titlebar_left_icon" data-drag-type="titlebar_left_icon" data-name="图标" style="color:#333;"&gt;&lt;i class="fas fa-star"&gt;&lt;/i&gt;&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="titlebar_center" style="justify-content:flex-start;"&gt;
    &lt;span class="titlebar_center_title" id="titlebar_title" data-ctrl-type="titlebar_title" data-drag-type="titlebar_title" data-name="标题" style="color:#333;font-weight:600;"&gt;我的应用&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="titlebar_right"&gt;
    &lt;button id="titlebar_min" data-ctrl-type="titlebar_min" data-drag-type="titlebar_min" style="color:#333;" class="titlebar_rightBtn" title="最小化"&gt;
      &lt;svg width="12" height="1" viewBox="0 0 10 1"&gt;&lt;rect width="10" height="1" fill="currentColor"/&gt;&lt;/svg&gt;
    &lt;/button&gt;
    &lt;button id="titlebar_max" data-ctrl-type="titlebar_max" data-drag-type="titlebar_max" style="color:#333;" class="titlebar_rightBtn" title="最大化"&gt;
      &lt;span style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;"&gt;
        &lt;svg width="12" height="12" viewBox="0 0 10 10" shape-rendering="crispEdges"&gt;
          &lt;rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1"/&gt;
        &lt;/svg&gt;
      &lt;/span&gt;
    &lt;/button&gt;
    &lt;button id="titlebar_close" data-ctrl-type="titlebar_close" data-drag-type="titlebar_close" style="color:#333;" class="titlebar_rightBtn titlebar_rightBtn_close" title="关闭"&gt;
      &lt;svg width="12" height="12" viewBox="0 0 10 10"&gt;
        &lt;line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1"/&gt;
        &lt;line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1"/&gt;
      &lt;/svg&gt;
    &lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;

&lt;style&gt;
  .titlebar_rightBtn {
    width:35px; height:32px; border:none; background:transparent; cursor:default; border-radius:4px; display:flex; align-items:center; justify-content:center;
  }
  .titlebar_rightBtn:hover { background:rgba(0,0,0,0.06); }
  .titlebar_rightBtn_close:hover { background:#e81123; color:#fff; }
  .titlebar_left_icon, .titlebar_center_title { app-region: no-drag; -webkit-app-region: no-drag; }
&lt;/style&gt;</code></pre>
  </div>

  <h4>4.2 列表框（ListBox） — 需设置 data-listBox-items</h4>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="list_xxx" class="listBox" data-ctrl-type="listBox" data-drag-type="listBox" data-name="列表名"
     data-listBox-items='[{"id":"1","text":"项目1","selected":false},{"id":"2","text":"项目2","selected":false}]'
     data-editable="false" data-always-show-selection="false"
     style="width:200px;height:200px;"&gt;
  &lt;div class="listBox_scroll"&gt;
    &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="0"&gt;
      &lt;span class="listBox_item_text"&gt;项目1&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="1"&gt;
      &lt;span class="listBox_item_text"&gt;项目2&lt;/span&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>4.3 数据表格（DataGrid） — 需设置 data-columns 和 data-rows</h4>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="grid_xxx" class="dataGrid_container" data-ctrl-type="dataGrid" data-drag-type="dataGrid" data-name="表格名"
     data-columns='[{"field":"col1","header":"列A"},{"field":"col2","header":"列B"}]'
     data-rows='[{"id":"row1","cells":{"col1":"数据A1","col2":"数据B1"}}]'
     data-show-checkbox="true" data-editable="false" data-always-show-selection="false"
     style="width:400px;height:250px;"&gt;
  &lt;div class="dataGrid_header"&gt;
    &lt;div class="dataGrid_header_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
      &lt;input type="checkbox" class="dataGrid_select_all"&gt;
    &lt;/div&gt;
    &lt;div class="dataGrid_header_cell" data-col-key="col1" data-col-name="列A" style="width:100px;min-width:100px;flex-shrink:0"&gt;列A&lt;/div&gt;
    &lt;div class="dataGrid_header_cell" data-col-key="col2" data-col-name="列B" style="width:100px;min-width:100px;flex-shrink:0"&gt;列B&lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="dataGrid_body"&gt;
    &lt;div class="dataGrid_row" data-row-index="0" data-row-id="row1"&gt;
      &lt;div class="dataGrid_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
        &lt;input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox"&gt;
      &lt;/div&gt;
      &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="col1" data-col-name="列A" style="width:100px;min-width:100px;flex-shrink:0" title="数据A1"&gt;数据A1&lt;/div&gt;
      &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="col2" data-col-name="列B" style="width:100px;min-width:100px;flex-shrink:0" title="数据B1"&gt;数据B1&lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>4.4 树形框（TreeView） — 需设置 data-tree-id</h4>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="tree_xxx" class="treeView" data-ctrl-type="treeView" data-drag-type="treeView" data-name="树形名"
     data-tree-id="tree_xxx" data-editable="false" data-show-icon="true" data-always-show-selection="true"
     style="width:220px;height:280px;"&gt;
  &lt;div class="treeView_node" data-node-id="node1" data-level="0"&gt;
    &lt;div class="treeView_node_content"&gt;
      &lt;span class="treeView_toggle expanded" data-ctrl-type="treeview_node_toggle"&gt;▶&lt;/span&gt;
      &lt;span class="treeView_icon folder"&gt;📁&lt;/span&gt;
      &lt;span class="treeView_label" data-ctrl-type="treeview_node_text"&gt;根节点&lt;/span&gt;
      &lt;span class="tree-edit-input" style="display:none"&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="treeView_children"&gt;
      &lt;div class="treeView_node" data-node-id="node2" data-level="1"&gt;
        &lt;div class="treeView_node_content"&gt;
          &lt;span class="treeView_toggle empty" data-ctrl-type="treeview_node_toggle"&gt;▶&lt;/span&gt;
          &lt;span class="treeView_icon file"&gt;📄&lt;/span&gt;
          &lt;span class="treeView_label" data-ctrl-type="treeview_node_text"&gt;子节点&lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>4.5 标签页（TabContainer） — 按钮与面板通过 data-tab-name 关联</h4>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="tabs_xxx" class="tabsContainer" data-ctrl-type="tabsContainer" data-drag-type="tabsContainer" data-name="标签页名"
     style="width:300px;height:200px;"&gt;
  &lt;div class="tabsContainer_headerBar"&gt;
    &lt;button class="tabsContainer_headerBar_btn active" data-tab-name="tab1" data-ctrl-type="tabsContainer_headerBar_btn" data-name="标签1" data-drag-type="tabs_btn"&gt;标签1&lt;/button&gt;
    &lt;button class="tabsContainer_headerBar_btn" data-tab-name="tab2" data-ctrl-type="tabsContainer_headerBar_btn" data-name="标签2" data-drag-type="tabs_btn"&gt;标签2&lt;/button&gt;
  &lt;/div&gt;
  &lt;div class="tabsContainer_contentWrapper"&gt;
    &lt;div class="tabsContainer_contentWrapper_panel active" data-tab-name="tab1"&gt;内容1&lt;/div&gt;
    &lt;div class="tabsContainer_contentWrapper_panel" data-tab-name="tab2"&gt;内容2&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>4.6 卡片框（CardBox） — 需 data-collapsible 和 data-collapsed</h4>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="card_xxx" class="cardBox" data-ctrl-type="cardBox" data-drag-type="cardBox" data-name="卡片名"
     data-collapsible="true" data-collapsed="false"
     style="width:260px;height:180px;"&gt;
  &lt;div class="cardBox_header"&gt;
    &lt;span class="cardBox_header_title"&gt;卡片标题&lt;/span&gt;
    &lt;span class="cardBox_collapse_btn" data-ctrl-type="cardBox_collapse_btn"&gt;
      &lt;svg width="12" height="12" viewBox="0 0 12 12"&gt;&lt;path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" stroke-width="1.5"/&gt;&lt;/svg&gt;
    &lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="cardBox_body" data-ctrl-type="cardBox_body"&gt;卡片内容&lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>4.7 日志框（LogOutput） — 使用 logOutput_container 类</h4>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="log_xxx" class="logOutput_container" data-ctrl-type="logOutput" data-drag-type="logOutput" data-name="日志名"
     style="width:300px;height:150px;"&gt;
  &lt;div class="logOutput_line" data-ctrl-type="logOutput_item" style="color:#333;"&gt;[INFO] 日志已就绪&lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>4.8 单选框组（RadioGroup） — 需要特定类名</h4>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="radioGroup_xxx" class="radioGroup_container" data-ctrl-type="radioGroup" data-drag-type="radioGroup" data-name="单选框组"
     style="width:120px;height:40px;"&gt;
  &lt;label class="radioGroup_item"&gt;
    &lt;input type="radio" data-ctrl-type="radio" name="groupName" value="选项1" checked /&gt;选项1
  &lt;/label&gt;
  &lt;label class="radioGroup_item"&gt;
    &lt;input type="radio" data-ctrl-type="radio" name="groupName" value="选项2" /&gt;选项2
  &lt;/label&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>4.9 进度条（高级样式） — 使用 progressBar_container 类</h4>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="progress_xxx" class="progressBar_container" data-ctrl-type="progressBar" data-drag-type="progressBar" data-name="进度条"
     data-editable="true" data-draggable="false"
     style="width:250px;height:10px;overflow:visible;"&gt;
  &lt;div class="progressBar_track"&gt;&lt;/div&gt;
  &lt;div class="progressBar_fill" style="width:60%;height:100%;background:#0078D4;border-radius:inherit;transition:width 0.15s;"&gt;&lt;/div&gt;
  &lt;span class="progressBar_text" style="transform:translate(-50%,-50%);font-size:inherit;pointer-events:none;white-space:nowrap;"&gt;60%&lt;/span&gt;
&lt;/div&gt;</code></pre>
  </div>
</div>

<!-- ==================== 5. 属性速查表（完整版） ==================== -->
<div class="dev-step">
  <h3><span class="step-num">5</span> 属性速查表（完整版）</h3>

  <table>
    <thead>
      <tr><th style="width:20%;">属性</th><th style="width:15%;">必填</th><th style="width:35%;">说明</th><th style="width:30%;">示例</th></tr>
    </thead>
    <tbody>
      <tr><td><code>id</code></td><td><span class="tag tag-required">必填</span></td><td>控件唯一标识，宿主通过此 ID 定位控件</td><td><code>id="btn_save"</code></td></tr>
      <tr><td><code>data-ctrl-type</code></td><td><span class="tag tag-required">必填</span></td><td>控件类型，决定事件上报的 <code>ctrlType</code> 和数据提取逻辑</td><td><code>data-ctrl-type="button"</code></td></tr>
      <tr><td><code>data-drag-type</code></td><td><span class="tag tag-required">可交互控件必填</span></td><td>标记可交互控件，CSS 统一设置 <code>no-drag</code>，防止拖拽窗口。<strong>纯布局容器不需要此属性。</strong></td><td><code>data-drag-type="button"</code></td></tr>
      <tr><td><code>data-name</code></td><td><span class="tag tag-recommend">推荐</span></td><td>控件中文名称，显示在事件日志的 <code>customname</code> 字段</td><td><code>data-name="保存按钮"</code></td></tr>
      <tr><td><code>data-type</code></td><td><span class="tag tag-optional">可选</span></td><td>基础控件类型，与 <code>data-ctrl-type</code> 不同，只记录原生控件最基础的标签类型，</td><td><code>data-type="select"</code></td></tr>
      <tr><td><code>aria-label</code></td><td><span class="tag tag-optional">可选</span></td><td>无障碍标签，会作为 <code>customname</code> 的回退来源</td><td><code>aria-label="保存"</code></td></tr>
      <tr><td><code>data-editable</code></td><td><span class="tag tag-optional">可选</span></td><td>是否可编辑（进度条点击调整、表格/列表/树形编辑）</td><td><code>data-editable="true"</code></td></tr>
      <tr><td><code>data-href</code></td><td><span class="tag tag-optional">可选</span></td><td>超链接的目标地址（代替 <code>href</code>，避免页面跳转）</td><td><code>data-href="https://..."</code></td></tr>
      <tr><td><code>data-col-key</code></td><td><span class="tag tag-required">表格单元格必填</span></td><td>表格列的字段名，用于定位列</td><td><code>data-col-key="name"</code></td></tr>
      <tr><td><code>data-col-name</code></td><td><span class="tag tag-optional">推荐</span></td><td>表格列的中文显示名，自动用于 <code>colName</code></td><td><code>data-col-name="姓名"</code></td></tr>
      <tr><td><code>data-tab-name</code></td><td><span class="tag tag-required">标签页必填</span></td><td>标签按钮和内容面板的配对标识</td><td><code>data-tab-name="tab1"</code></td></tr>
      <tr><td><code>data-node-id</code></td><td><span class="tag tag-required">树形节点必填</span></td><td>树节点的唯一标识</td><td><code>data-node-id="node_1"</code></td></tr>
      <tr><td><code>data-item-id</code></td><td><span class="tag tag-optional">列表项推荐</span></td><td>列表项的自定义 ID，用于数据管理</td><td><code>data-item-id="1"</code></td></tr>
      <tr><td><code>data-row-id</code></td><td><span class="tag tag-optional">表格行推荐</span></td><td>表格行的自定义 ID</td><td><code>data-row-id="row_1"</code></td></tr>
      <tr><td><code>data-listBox-items</code></td><td><span class="tag tag-required">列表框必填</span></td><td>列表框数据的 JSON 数组，用于管理器同步</td><td><code>data-listBox-items='[{"text":"项1"}]'</code></td></tr>
      <tr><td><code>data-columns</code></td><td><span class="tag tag-required">数据表格必填</span></td><td>表格列定义的 JSON 数组</td><td><code>data-columns='[{"field":"col1","header":"列A"}]'</code></td></tr>
      <tr><td><code>data-rows</code></td><td><span class="tag tag-required">数据表格必填</span></td><td>表格行数据的 JSON 数组</td><td><code>data-rows='[{"id":"r1","cells":{"col1":"值"}}]'</code></td></tr>
      <tr><td><code>data-tree-id</code></td><td><span class="tag tag-required">树形框必填</span></td><td>树形框的唯一标识，用于 TreeManager</td><td><code>data-tree-id="tree_xxx"</code></td></tr>
      <tr><td><code>data-collapsible</code></td><td><span class="tag tag-required">卡片框必填</span></td><td>是否允许折叠，必须为 <code>"true"</code></td><td><code>data-collapsible="true"</code></td></tr>
      <tr><td><code>data-collapsed</code></td><td><span class="tag tag-optional">推荐</span></td><td>初始折叠状态，<code>"true"</code> 或 <code>"false"</code></td><td><code>data-collapsed="false"</code></td></tr>
      <tr><td><code>data-show-checkbox</code></td><td><span class="tag tag-optional">可选</span></td><td>列表框/表格是否显示复选框列</td><td><code>data-show-checkbox="true"</code></td></tr>
      <tr><td><code>data-always-show-selection</code></td><td><span class="tag tag-optional">可选</span></td><td>点击外部是否保留选中高亮</td><td><code>data-always-show-selection="true"</code></td></tr>
      <tr><td><code>data-original-width</code></td><td><span class="tag tag-optional">页面容器推荐</span></td><td>设计稿宽度，用于 <code>setFixedCanvasSize</code> 等 API</td><td><code>data-original-width="1065"</code></td></tr>
      <tr><td><code>data-original-height</code></td><td><span class="tag tag-optional">页面容器推荐</span></td><td>设计稿高度，用于 <code>setFixedCanvasSize</code> 等 API</td><td><code>data-original-height="695"</code></td></tr>
    </tbody>
  </table>

  <div class="tip-box">
    <strong>💡 快速记忆口诀：</strong><br/>
    “<strong>id</strong> 唯一不能少，<strong>ctrl-type</strong> 定类型，<strong>drag-type</strong> 防拖拽，<strong>data-name</strong> 写中文，<strong>容器数据</strong> 要填好。”
  </div>
</div>

<!-- ==================== 6. 完整页面模板（复制即用） ==================== -->
<div class="dev-step">
  <h3><span class="step-num">6</span> 完整页面模板（复制即用）</h3>
  <p>以下模板包含标题栏 + 所有基础控件，可直接运行测试。所有属性均已完整配置，与设计器导出风格一致。</p>

  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML（完整页面）</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="zh-CN"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" /&gt;
  &lt;title&gt;我的应用&lt;/title&gt;
  &lt;style&gt;
    * { margin:0; padding:0; box-sizing:border-box; }
    .pageContainer {
      app-region: drag; -webkit-app-region: drag;
      position: relative;
      width: 100vw; height: 100vh;
      background: #f0f2f5;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .pageContainer.glass-effect {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    /* ⚠️ 只有【可交互控件】才需要 data-drag-type */
    /* 纯布局容器（侧边栏、内容区等）【不需要】添加 data-drag-type */
    [data-drag-type] { app-region: no-drag; -webkit-app-region: no-drag; }
    [data-ctrl-type="titlebar_max"] span { app-region: drag; -webkit-app-region: drag; }

    /* 标题栏 */
    .titlebar {
      position: absolute; top:0; left:0; right:0;
      height: 40px; background: #2d3a4b;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 12px; flex-shrink: 0;
    }
    .titlebar_title { font-size: 14px; font-weight: 500; color: #fff; }
    .titlebar_btn {
      width: 36px; height: 28px; border: none; background: transparent;
      color: #fff; cursor: pointer; border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
    }
    .titlebar_btn:hover { background: rgba(255,255,255,0.15); }
    .titlebar_btn_close:hover { background: #e74c3c; }

    /* 内容区 */
    .content { flex:1; padding:20px; overflow-y:auto; }
    .toolbar { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
    .toolbar input, .toolbar select { padding:6px 12px; border:1px solid #dadce0; border-radius:4px; font-size:13px; outline:none; }
    .toolbar input:focus, .toolbar select:focus { border-color:#409EFF; }
    .toolbar button { padding:6px 16px; border:1px solid #dadce0; border-radius:4px; background:#fff; cursor:pointer; font-size:13px; }
    .toolbar button:hover { background:#f1f3f4; }
    .toolbar button.primary { background:#409EFF; border-color:#409EFF; color:#fff; }
    .toolbar button.primary:hover { background:#3a8ee6; }

    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
    .form-group label { display:block; font-size:13px; font-weight:500; margin-bottom:4px; }
    .form-group input, .form-group select, .form-group textarea {
      width:100%; padding:8px 12px; border:1px solid #dadce0; border-radius:4px; font-size:13px; outline:none;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color:#409EFF; }
    .form-check { display:flex; align-items:center; gap:8px; margin:4px 0; }
    .form-check input[type="checkbox"], .form-check input[type="radio"] { width:16px; height:16px; }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;div class="pageContainer glass-effect" id="pageContainer"
     data-ctrl-type="pageContainer" data-name="canvas"
     data-original-width="900" data-original-height="600"&gt;

  &lt;!-- ===== 标题栏 ===== --&gt;
  &lt;div class="titlebar" id="titlebar"&gt;
    &lt;div class="titlebar_left"&gt;
      &lt;span id="titlebar_left_icon" data-ctrl-type="titlebar_left_icon" data-drag-type="titlebar_left_icon"&gt;⚙️&lt;/span&gt;
      &lt;span class="titlebar_title" id="titlebar_title" data-ctrl-type="titlebar_title" data-name="窗口标题" data-drag-type="titlebar_title"&gt;我的应用&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="titlebar_right"&gt;
      &lt;button id="titlebar_min" data-ctrl-type="titlebar_min" data-drag-type="titlebar_min" class="titlebar_btn"&gt;─&lt;/button&gt;
      &lt;button id="titlebar_max" data-ctrl-type="titlebar_max" data-drag-type="titlebar_max" class="titlebar_btn"&gt;
        &lt;span style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;"&gt;☐&lt;/span&gt;
      &lt;/button&gt;
      &lt;button id="titlebar_close" data-ctrl-type="titlebar_close" data-drag-type="titlebar_close" class="titlebar_btn titlebar_btn_close"&gt;✕&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;

  &lt;!-- ===== 内容区（布局容器，不需要 data-drag-type） ===== --&gt;
  &lt;div class="content" id="contentArea"&gt;

    &lt;!-- 工具栏 --&gt;
    &lt;div class="toolbar"&gt;
      &lt;input id="inp_search" data-ctrl-type="inputText" data-name="搜索框" data-drag-type="inputText" placeholder="🔍 搜索..."&gt;
      &lt;button id="btn_search" data-ctrl-type="button" data-name="搜索按钮" data-drag-type="button" class="primary"&gt;搜索&lt;/button&gt;
      &lt;button id="btn_add" data-ctrl-type="button" data-name="添加按钮" data-drag-type="button" class="primary"&gt;➕ 添加&lt;/button&gt;
    &lt;/div&gt;

    &lt;!-- 表单区域 --&gt;
    &lt;div class="form-row"&gt;
      &lt;div class="form-group"&gt;
        &lt;label&gt;用户名&lt;/label&gt;
        &lt;input id="inp_username" data-ctrl-type="inputText" data-name="用户名" data-drag-type="inputText" placeholder="请输入用户名"&gt;
      &lt;/div&gt;
      &lt;div class="form-group"&gt;
        &lt;label&gt;城市&lt;/label&gt;
        &lt;select id="sel_city" data-ctrl-type="comboBox" data-name="城市下拉" data-drag-type="comboBox"&gt;
          &lt;option value="bj"&gt;北京&lt;/option&gt;
          &lt;option value="sh"&gt;上海&lt;/option&gt;
          &lt;option value="gz"&gt;广州&lt;/option&gt;
        &lt;/select&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class="form-row"&gt;
      &lt;div class="form-group"&gt;
        &lt;label&gt;选项&lt;/label&gt;
        &lt;div class="form-check"&gt;
          &lt;input id="chk_agree" type="checkbox" data-ctrl-type="checkbox" data-name="同意条款" data-drag-type="checkbox"&gt;
          &lt;label&gt;我已阅读并同意协议&lt;/label&gt;
        &lt;/div&gt;
        &lt;div class="form-check"&gt;
          &lt;input id="sw_notify" type="checkbox" data-ctrl-type="switchToggle" data-name="通知开关" data-drag-type="switchToggle" checked&gt;
          &lt;label&gt;启用通知&lt;/label&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;div class="form-group"&gt;
        &lt;label&gt;性别&lt;/label&gt;
        &lt;div class="form-check"&gt;
          &lt;input id="rdo_male" type="radio" name="gender" data-ctrl-type="radio" data-name="男" data-drag-type="radio" value="male" checked&gt;
          &lt;label&gt;男&lt;/label&gt;
        &lt;/div&gt;
        &lt;div class="form-check"&gt;
          &lt;input id="rdo_female" type="radio" name="gender" data-ctrl-type="radio" data-name="女" data-drag-type="radio" value="female"&gt;
          &lt;label&gt;女&lt;/label&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class="form-row"&gt;
      &lt;div class="form-group"&gt;
        &lt;label&gt;进度条&lt;/label&gt;
        &lt;input id="prg_load" type="range" min="0" max="100" value="60" data-ctrl-type="progressBar" data-name="加载进度" data-drag-type="progressBar" data-editable="true"&gt;
      &lt;/div&gt;
      &lt;div class="form-group"&gt;
        &lt;label&gt;日期&lt;/label&gt;
        &lt;input id="dt_birth" type="date" data-ctrl-type="datetimePicker" data-name="出生日期" data-drag-type="datetimePicker"&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div style="display:flex; gap:12px; margin-top:12px;"&gt;
      &lt;button id="btn_submit" data-ctrl-type="button" data-name="提交按钮" data-drag-type="button" class="primary"&gt;✅ 提交&lt;/button&gt;
      &lt;button id="btn_reset" data-ctrl-type="button" data-name="重置按钮" data-drag-type="button"&gt;↩️ 重置&lt;/button&gt;
      &lt;span id="lbl_status" data-ctrl-type="label" data-name="状态标签" data-drag-type="label" style="font-size:13px;color:#5f6368;align-self:center;"&gt;就绪&lt;/span&gt;
    &lt;/div&gt;

  &lt;/div&gt;
&lt;/div&gt;

&lt;script src="webviewBridge.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
  </div>

  <div class="tip-box">
    <strong>💡 使用说明：</strong>复制此模板后，修改 <code>id</code> 和 <code>data-name</code> 为实际业务名称，删除不需要的控件即可。所有控件均已配置完整属性，无需额外调试。<br/>
    <strong>⚠️ 特别注意：</strong>模板中的 <code>&lt;div class="content"&gt;</code> 是布局容器，<strong>不需要</strong> <code>data-drag-type</code>，以保持窗口拖拽能力。
  </div>
</div>

<!-- ==================== 7. 进阶知识 ==================== -->
<div class="dev-step">
  <h3><span class="step-num">7</span> 进阶知识</h3>

  <h4>7.1 API 返回值统一包装规范</h4>
  <p>所有 API 方法的返回值都会经过统一处理，<strong>规则如下：</strong></p>
  <ul>
    <li><code>null</code> / <code>undefined</code> → 自动转为 <strong>空字符串 <code>''</code></strong></li>
    <li><code>boolean</code> / <code>number</code> → <strong>保持原值</strong></li>
    <li><code>string</code> → 经过图标解码后返回</li>
    <li><code>object</code> / <code>array</code> → 转为 <strong>JSON 字符串</strong>返回，需要自行 <code>JSON.parse()</code> 解析</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header"><span class="lang-label">示例</span><button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button></div>
    <pre><code>// 获取配置对象 → 返回值是 JSON 字符串，需要解析
var config = JSON.parse(webviewBridge.api.tooltip.getConfig('tip1'));</code></pre>
  </div>

  <h4>7.2 模块层级结构</h4>
  <p>API 统一挂载在 <code>webviewBridge.api</code> 下，各模块<strong>层级独立</strong>：</p>
  <table>
    <thead><tr><th style="width:25%;">模块</th><th style="width:40%;">调用路径</th><th style="width:35%;">说明</th></tr></thead>
    <tbody>
      <tr><td>通用操作</td><td><code>webviewBridge.api.public</code></td><td>setValue / getValue / show / hide 等</td></tr>
      <tr><td>画布操作</td><td><code>webviewBridge.api.canvas</code></td><td><strong>独立模块！</strong>不在 public 下</td></tr>
      <tr><td>标题栏</td><td><code>webviewBridge.api.titleBar</code></td><td><strong>独立模块！</strong>最大化/还原控制</td></tr>
      <tr><td>图标辅助</td><td><code>webviewBridge.api.public.icon</code></td><td>在 public 子模块下</td></tr>
    </tbody>
  </table>
  <div class="warn-box">
    <strong>❌ 常见错误：</strong><code>webviewBridge.api.public.canvas</code> → 错误！应使用 <code>webviewBridge.api.canvas</code><br/>
    <strong>❌ 常见错误：</strong><code>webviewBridge.api.public.titleBar</code> → 错误！应使用 <code>webviewBridge.api.titleBar</code>
  </div>

  <h4>7.3 五层智能识别机制（了解即可）</h4>
  <p>即便您显式填写了所有属性，系统仍会在后台使用以下五层机制作为补充保障：</p>
  <table>
    <thead><tr><th style="width:15%;">层级</th><th style="width:25%;">识别方式</th><th style="width:20%;">source值</th><th style="width:40%;">说明</th></tr></thead>
    <tbody>
      <tr><td><strong style="color:#e74c3c;">Layer 1</strong></td><td><code>data-ctrl-type</code> 属性</td><td><code>explicit</code></td><td>显式声明，最高优先级</td></tr>
      <tr><td><strong style="color:#e67e22;">Layer 2</strong></td><td>ARIA <code>role</code> 属性</td><td><code>aria</code></td><td>语义化识别，无障碍友好</td></tr>
      <tr><td><strong style="color:#f1c40f;">Layer 3</strong></td><td>CSS class 约定命名</td><td><code>css</code></td><td>特定 class 识别复杂控件</td></tr>
      <tr><td><strong style="color:#2ecc71;">Layer 4</strong></td><td>DOM 结构特征推断</td><td><code>structure</code></td><td>ul/li、table/tr/td 等自动识别</td></tr>
      <tr><td><strong style="color:#3498db;">Layer 5</strong></td><td>原生 HTML 标签</td><td><code>native</code></td><td>兜底推断，零配置即用</td></tr>
    </tbody>
  </table>
  <div class="tip-box">
    <strong>💡 建议：</strong>虽然系统支持自动识别，但仍<strong>推荐显式填写</strong> <code>data-ctrl-type</code>，以保证数据提取的准确性。
  </div>
</div>

<!-- ==================== 8. AI 提示词模板（已更新，含完整结构） ==================== -->
<div class="dev-step">
  <h3><span class="step-num">8</span> AI 提示词模板（已更新）</h3>
  <p>将以下提示词发给 AI（如 ChatGPT、Claude、DeepSeek），即可快速生成符合规范的完整页面。</p>

  <h4>模板 ：通用万能提示词</h4>
  <div class="prompt-box" id="prompt-a">
你是 webviewBridge.js 前端开发专家，请生成一个可在 WebView2 中运行的完整 HTML 页面。

【身份定位】
你是精通 webviewBridge.js 桥接机制的前端开发专家，擅长用最标准的 HTML 结构实现与宿主程序的完整交互。

【核心规则 — 必须100%严格遵守】

1. 页面通过 webviewBridge.js 【改成实际路径】与宿主程序通信，脚本已存在，只需引入。

2. 基础控件属性规则（每个控件缺一不可）：
   - id（唯一标识，英文小写+下划线，如 btn_submit）
   - data-ctrl-type（控件类型，见下表）
   - data-drag-type（拖拽标记，值任意，如 button）—— 【仅可交互控件需要】
   - data-name（中文名称，推荐）
   - data-type（基础控件类型，与 data-ctrl-type 不同，只记录原生控件最基础的标签类型，如 select）

   控件类型对应关系：
   按钮: button       输入框: inputText     复选框: checkbox
   单选框: radio      开关: switchToggle    下拉框: comboBox
   文本域: textarea   超链接: hyperLink     标签: label
   图片: imageBox     进度条: progressBar   日期: datetimePicker
   列表: listBox      表格: dataGrid        树形: treeView
   标签页: tabsContainer  卡片: cardBox     日志: logOutput

3. 复杂控件必须包含完整子结构 + 初始化数据属性（这是重点！）：
   ▸ 列表框（ListBox）：
     容器必须设置 data-listBox-items='[{"id":"1","text":"项1","selected":false}]'
     内部必须有 .listBox_scroll → .listBox_item → .listBox_item_text
     &lt;div id="list_xxx" class="listBox" data-ctrl-type="listBox" data-listBox-items='[{"text":"示例"}]'&gt;
       &lt;div class="listBox_scroll"&gt;
         &lt;div class="listBox_item" data-item-index="0"&gt;
           &lt;span class="listBox_item_text"&gt;示例&lt;/span&gt;
         &lt;/div&gt;
       &lt;/div&gt;
     &lt;/div&gt;

   ▸ 数据表格（DataGrid）：
     容器使用 class="dataGrid_container"，必须设置 data-columns 和 data-rows JSON
     内部必须有 .dataGrid_header（含 .dataGrid_header_cell）和 .dataGrid_body（含 .dataGrid_row → .dataGrid_cell）
     如需复选框，添加 .dataGrid_checkbox 和 input.dataGrid_row_check

   ▸ 树形框（TreeView）：
     容器必须设置 data-tree-id="tree_xxx"
     节点必须用 .treeView_node（含 data-node-id）→ .treeView_node_content → .treeView_label
     展开按钮用 .treeView_toggle（expanded/collapsed/empty 类）
     子容器用 .treeView_children

   ▸ 进度条（高级样式）：
     容器使用 class="progressBar_container"，设置 data-editable="true" 和 data-draggable="false"
     内部必须包含 .progressBar_fill（控制宽度）和 .progressBar_text（显示百分比）

   ▸ 日志框（LogOutput）：
     容器使用 class="logOutput_container"
     每一行使用 .logOutput_line

   ▸ 单选框组（RadioGroup）：
     容器使用 class="radioGroup_container"
     每个选项使用 class="radioGroup_item"

   ▸ 卡片框（CardBox）：
     容器必须设置 data-collapsible="true" 和 data-collapsed="false"

4. 页面结构：
   - 最外层用 &lt;div class="pageContainer glass-effect" id="pageContainer" data-ctrl-type="pageContainer" data-name="canvas" style="app-region: drag;"&gt;
   - 标题栏 id="titlebar"，包含最小化/最大化/关闭按钮（最大化按钮内部必须有一个 &lt;span&gt; 包含图标，并设为 drag，固定高宽18px）
   - 所有交互控件放在内容区

5. 样式要求：
   - .pageContainer { app-region: drag; }
   - 【仅可交互控件】需要 [data-drag-type] { app-region: no-drag; }
   - 纯布局容器（侧边栏、内容区）【不要】添加 data-drag-type，记住：能点能输入就需要，纯放东西不需要。
   - [data-ctrl-type="titlebar_max"] span { app-region: drag; }

6. 所有控件交互事件会自动上报给宿主，无需手动写事件监听。

【输出要求】
- 完整可运行的 HTML 文件
- 样式使用内联 &lt;style&gt; 标签，界面美观
- 所有文字使用中文
- 代码结构清晰，缩进规范

请根据用户需求生成页面。
<button class="copy-prompt" onclick="copyPrompt('prompt-a',this)">复制提示词</button>
  </div>
</div>

<!-- ==================== 9. 常见问题与调试 ==================== -->
<div class="dev-step">
  <h3><span class="step-num">9</span> 常见问题与调试</h3>

  <h4>开发检查清单</h4>
  <div class="checklist">
    <span class="check-item">已引入 webviewBridge.js</span>
    <span class="check-item">每个控件有唯一 id</span>
    <span class="check-item">所有控件设置了 data-ctrl-type</span>
    <span class="check-item">可交互控件设置了 data-drag-type</span>
    <span class="check-item">布局容器【没有】设置 data-drag-type（保持拖拽能力）</span>
    <span class="check-item">复杂控件设置了对应的数据属性（data-listBox-items / data-columns 等）</span>
    <span class="check-item">控件可点击且事件上报正常</span>
    <span class="check-item">控制台无报错</span>
  </div>

  <h4>常见问题</h4>
  <table>
    <thead><tr><th>问题</th><th>原因</th><th>解决方案</th></tr></thead>
    <tbody>
      <tr><td>点击控件无事件上报</td><td>缺少 <code>id</code> 或未引入桥接脚本</td><td>检查控件是否设置了 <code>id</code>，检查 <code>&lt;script&gt;</code> 标签</td></tr>
      <tr><td>进度条 <code>data.value</code> 始终为 0</td><td>进度条未设置 <code>data-ctrl-type="progressBar"</code></td><td>在 <code>&lt;input type="range"&gt;</code> 或容器上添加该属性</td></tr>
      <tr><td>表格行点击无 <code>rowIndex</code></td><td>点击的是按钮而非单元格</td><td>在按钮上自定义 <code>data-row-id</code> 或改用 <code>td</code> 点击</td></tr>
      <tr><td>最大化按钮悬停无贴靠布局</td><td>内部 <code>&lt;span&gt;</code> 未设置 <code>app-region: drag</code></td><td>按本文档第1步中的示例修正</td></tr>
      <tr><td>点击控件时窗口跟随拖动</td><td>控件缺少 <code>data-drag-type</code> 或 CSS 未设置 <code>no-drag</code></td><td>添加 <code>data-drag-type</code> 并确保 CSS 规则生效</td></tr>
      <tr><td>无法通过拖拽空白区域移动窗口</td><td>布局容器被错误添加了 <code>data-drag-type</code></td><td>移除侧边栏、内容区等布局容器上的 <code>data-drag-type</code></td></tr>
      <tr><td>列表/表格/树形动态操作不生效</td><td>缺少初始化 JSON 属性（如 <code>data-listBox-items</code>）</td><td>参考第4节复杂控件模板，补全对应数据属性</td></tr>
    </tbody>
  </table>

  <div class="tip-box">
    <strong>🔍 调试技巧：</strong>打开浏览器开发者工具（F12），在 Console 中可看到桥接脚本打印的完整事件消息，对比 <code>data</code> 字段即可快速定位缺失属性。
  </div>
</div>

<div class="intro-section" id="intro" style="display:none">
  <h2>欢迎使用 webviewBridge API</h2>
  <p><code>webviewBridge</code> 是 WebView2 宿主与前端页面的桥接脚本，挂载在全局 <code>window.webviewBridge</code> 上。</p>
  <p>本指南提供了强制属性规范 + 完整模板，确保您的控件能 100% 正确上报数据。</p>
  <p style="margin-top:14px;">请从左侧导航选择控件查看详细 API 文档。</p>
</div>
`;