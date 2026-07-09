window.__devGuideHTML = `<div class="section-header">
  <h2>🚀 快速开发指南(生成具有 Win11 窗口风格的软件界面)</h2>
  <div class="h2-meta">
    <span class="ctrl-badge">必读</span>
  </div>
</div>

<style>
  /* 此样式块仅用于本指南内部，不影响业务页面 */
  .dev-step { font-weight: normal;background:#fff;padding:20px; margin-bottom:16px; border:1px solid #c8d6e5;border-radius:8px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.07);}
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
  .dev-step code { font-weight: background:#f0f4f8; padding:2px 6px; border-radius:3px; font-size:13px; color:#409EFF;}
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
  <ul>
    <li>在页面 <code>&lt;body&gt;</code> 末尾引入：</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;script src="webviewBridge.js"&gt;&lt;/script&gt;</code></pre>
  </div>

  <h4>第 2 步：创建页面容器</h4>
  <ul>
    <li>创建页面容器 <code>pageContainer</code></li>
    <li>页面容器需设置 <code>app-region:drag;-webkit-app-region:drag;</code> 使整个窗口可拖拽。</li>
    <li>页面容器的高宽仅允许使用百分比和固定值，不允许使用 <code>auto</code> 或 <code>100vw</code>、<code>100vh</code> 等动态值。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML + CSS</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div class="pageContainer glass-effect" id="pageContainer"
     data-ctrl-type="pageContainer"  &lt;!-- 控件类型，见第 4 步详解 --&gt;
     data-name="canvas"   &lt;!-- 中文名，见第 4 步详解 --&gt;
     style="position:relative;
      app-region:drag;-webkit-app-region:drag; /* 使整个窗口可拖拽 */
      padding-top: 40px;  /* 留出标题栏高度 */"
      &gt;
  &lt;!-- 所有控件放在这里 --&gt;
&lt;/div&gt;

&lt;style&gt;
  /* 见第 4 步详解：⚠️ 添加【可交互控件】需要的不可拖拽属性：<strong>data-drag-type</strong>（按钮、输入框、菜单项等） */
  [data-drag-type] {app-region:no-drag;-webkit-app-region:no-drag;}
&lt;/style&gt;</code></pre>
  </div>

  <h4>第 3 步：定义标题栏</h4>
  <ul>
    <li>创建标题栏 <code>titlebar</code></li>
    <li>需定位于页面容器顶部 <code>position:absolute;top:0;left:0;right:0;height:40px;</code> ，<code>height</code> 高度自定义。</li>
    <li>💡 标题栏使用绝对定位脱离文档流，如页面容器使用 <code>padding-top</code>（或内容区 <code>margin-top</code>）≥ 标题栏高度（如 40px），可防止内容区顶部被遮挡。其他布局方案（如标题栏不用绝对定位）无需此设置。</li>
    <li>标题栏<code>titlebar</code>需设置 <code>app-region:drag;-webkit-app-region:drag;</code> 确保使整个标题栏可拖拽。</li>
    <li>三分布局：左侧图标区 <code>titlebar_left</code> ，中间标题文本区 <code>titlebar_center</code> ，右侧控制按钮区 <code>titlebar_right</code> </li>
    <li>-- 控制按钮区 <code>titlebar_right</code> 三分布局：最小化 <code>titlebar_min</code> ，最大化 <code>titlebar_max</code> ，关闭 <code>titlebar_close</code> </li>
	  <li>-- 所有标题栏控制按钮都必须设有<code>app-region:no-drag</code>（保证点击响应）。<strong style="color: rgb(240, 0, 0);">为适配下方最大化按钮的Windows 11 贴靠布局，不要用 <code>data-drag-type</code>，改用 CSS 选择器 <code>[data-ctrl-type^="titlebar_"]</code> 控制 no-drag。</strong></li>
    <li>-- 最大化按钮 <code>titlebar_max</code> 实现 Windows 11 贴靠布局（Snap Layout）兼容说明：
      <div class="info-box">
    在 Windows 11 中，鼠标悬停最大化按钮时会弹出贴靠布局菜单。要触发此功能，<strong>最大化按钮所在的区域必须被系统识别为“标题栏可拖拽区域”，因此需在内部添加<code>&lt;span&gt;</code>( 或<code>&lt;div&gt;</code>)。</strong>。
    <ul style="margin:8px 0 0 20px;line-height:1.8;">
      <li>按钮自身：须有<code>app-region:no-drag</code>（保证点击响应），不要用 <code>data-drag-type</code>，改用 CSS 选择器 <code>[data-ctrl-type^="titlebar_"]</code> 控制 no-drag。</li>
      <li>按钮内部的 <code>&lt;span&gt;</code>( 或<code>&lt;div&gt;</code>)：必须设为 <code>app-region:drag</code>，让系统认为该区域属于标题栏，从而激活悬停时的贴靠布局。</li>
      <li>按钮内部的 <code>&lt;span&gt;</code>( 或<code>&lt;div&gt;</code>)：固定宽高 = <strong style="color: rgb(240, 0, 0);font-size: 13px;">18px</strong></li>
    </ul>
    <div style="margin-top:8px;padding:8px;background:#f5f5f5;border-radius:4px;font-size:12px;color:#333;">
      <strong>正确示例：</strong><br/>
      <code><br/>
	    &lt;style&gt;<br/>
      &nbsp;&nbsp;/* 标题栏按钮 no-drag（用 ctrl-type 选，不用 data-drag-type，避免 WebView2 子元素句柄失效） */<br/>
      &nbsp;&nbsp;.pageContainer [data-ctrl-type^="titlebar_"] { app-region: no-drag; -webkit-app-region: no-drag; }<br/>
      &nbsp;&nbsp;/* 最大化按钮内部 span — 设回 drag，支持 Windows 11 Snap Layout */<br/>
      &nbsp;&nbsp;.pageContainer [data-ctrl-type="titlebar_max"] span { app-region: drag; -webkit-app-region: drag; }<br/>
	    &lt;/style&gt;<br/>

	    &lt;button id="titlebar_max" data-ctrl-type="titlebar_max" title="最大化"&gt;<br/>
      &nbsp;&nbsp;&lt;span style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;"&gt;☐&lt;/span&gt;<br/>
      &lt;/button&gt;</code><br/>
    </div>
    <p style="margin-top:6px;"><strong>⚠️ 如果缺少此设置</strong>，最大化按钮在 Windows 11 中悬停时将不会弹出贴靠布局菜单，影响用户体验。</p>
  </div>
  </li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div class="titlebar" id="titlebar" data-name="标题栏" style="position:absolute;top:0;left:0;right:0;height:40px;background:#F8F8F8;border-bottom:1px solid rgba(0,0,0,0.08);app-region:drag;-webkit-app-region:drag;"&gt;
  &lt;div class="titlebar_left"&gt;
    &lt;span class="titlebar_left_icon" id="titlebar_left_icon" data-ctrl-type="titlebar_left_icon" data-drag-type="titlebar_left_icon" data-name="图标" style="color:#333;"&gt;&lt;i class="fas fa-star"&gt;&lt;/i&gt;&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="titlebar_center" style="justify-content:flex-start;"&gt;
    &lt;span class="titlebar_center_title" id="titlebar_title" data-ctrl-type="titlebar_title" data-drag-type="titlebar_title" data-name="标题" style="color:#333;font-weight:600;"&gt;我的应用&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="titlebar_right"&gt;
    &lt;button id="titlebar_min" data-ctrl-type="titlebar_min" style="color:#333;" class="titlebar_rightBtn" title="最小化"&gt;
      &lt;svg width="12" height="1" viewBox="0 0 10 1"&gt;&lt;rect width="10" height="1" fill="currentColor"/&gt;&lt;/svg&gt;
    &lt;/button&gt;
    &lt;button id="titlebar_max" data-ctrl-type="titlebar_max" style="color:#333;" class="titlebar_rightBtn" title="最大化"&gt;
      &lt;span style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;"&gt;
        &lt;svg width="12" height="12" viewBox="0 0 10 10" shape-rendering="crispEdges"&gt;
          &lt;rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1"/&gt;
        &lt;/svg&gt;
      &lt;/span&gt;
    &lt;/button&gt;
    &lt;button id="titlebar_close" data-ctrl-type="titlebar_close" style="color:#333;" class="titlebar_rightBtn titlebar_rightBtn_close" title="关闭"&gt;
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
&lt;/style&gt;</code></pre>
  </div>

  <h4> 第 4 步：控件属性规范: <strong style="color:rgb(240, 0, 0);font-size: 14px;">⚠️ 重要核心原则（必须遵守）</strong></h4>
      <ul>
      <li>所有控件必须设置<code>id</code>（唯一标识）、<code>data-ctrl-type</code>（控件类型）、<code>data-name</code>（中文名，推荐），与桥接脚本配合使用。</li>
      <li>防拖拽标记 <code>data-drag-type</code> : </li>
      <li>-- 所有可交互控件（用户可点击或输入:按钮、输入框、下拉框、菜单项 等）<strong style="color:rgb(240, 0, 0);font-size: 13px;">必须设置</strong><code>data-drag-type</code></li>
      <li>-- 纯布局容器（侧边栏、内容区、卡片容器 等）<strong style="color:rgb(240, 0, 0);font-size: 13px;">不需要添加</strong> <code>data-drag-type</code>，它们应保持可拖拽，让用户能通过拖拽空白区域移动窗口。</li>
      <li>-- 判断规则：用户<strong style="color:rgb(240, 0, 0);font-size: 13px;">能“点击”或“输入”</strong>的元素 → <strong style="color:rgb(240, 0, 0);font-size: 13px;">需要</strong> <code>data-drag-type</code>；仅用于“承载/布局”的元素 → <strong style="color:rgb(240, 0, 0);font-size: 13px;">不需要</strong>。</li>
      <li>控件类型 <code>data-ctrl-type</code>：</li>
      <li>-- 对于标准原生标签（如 <code>&lt;button&gt;</code>、<code>&lt;input&gt;</code>、<code>&lt;select&gt;</code>），<code>data-ctrl-type</code> 可以省略（脚本会自动识别，但建议添加）。</li>
      <li>-- 但对于自定义标签或布局元素（如导航菜单项 <code>&lt;div class="nav-item"&gt;</code>、自定义按钮等），<strong style="color:rgb(240, 0, 0);font-size: 13px;">必须显式添加 <code>data-ctrl-type</code></strong>（通常设为 <code>button</code> 或 <code>listBox_item</code>），否则事件会被错误地归并到父容器。</li>
      <li>-- 不要依赖自动推断，对于自定义元素，显式填写所有属性可确保 100% 上报正确。</li>
      <li>-- 开关（SwitchToggle）<strong style="color:rgb(240, 0, 0);font-size: 13px;">必须使用</strong> <code>data-ctrl-type="switchToggle"</code>。</li>
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
    </ul>
  
</div>

<!-- ==================== 2. 基础控件完整模板 ==================== -->
<div class="dev-step">
  <h3><span class="step-num">2</span> 基础控件完整模板</h3>
  <p>以下每个模板都包含 <strong>全部必要属性</strong>，直接复制到页面中即可。</p>

  <!-- ========== 修改点 ③：表格上方增加 data-drag-type 适用范围说明 ========== -->
  <div class="info-box">
    <strong>📌 关于 <code>data-drag-type</code> 的适用范围：</strong><br/>
    <ul>
      <li>下表列出的 <strong>所有控件都是可交互控件</strong>（用户可点击或输入），因此每个模板都包含 <code>data-drag-type</code> 属性。<br/></li>
      <li><strong>纯布局容器</strong>（如侧边栏 <code>.sidebar</code>、内容区 <code>.main-content</code>、卡片容器 <code>.card-panel</code>）<strong>不要添加</strong> <code>data-drag-type</code>，以保持窗口拖拽能力。</li>
    </ul>
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

<!-- ==================== 3. 复杂控件完整模板 ==================== -->
<div class="dev-step">
  <h3><span class="step-num">3</span> 复杂控件完整模板</h3>
  <p>以下模板严格匹配桥接脚本 <code>webviewBridge.js</code> 的 <strong>完整 DOM 结构</strong>和必需的数据属性。每个控件的类名、层级、data 属性均不可省略或变更。</p>

  <div class="info-box">
    <strong>📌 复杂控件的通用规则：</strong>
    <ul style="margin:6px 0 0 16px;font-size:12px;line-height:1.8;">
      <li>容器必须设置 <code>id</code>、<code>data-ctrl-type</code>、<code>data-drag-type</code>、<code>data-name</code></li>
      <li>子元素需要 <code>data-ctrl-type</code> 的必须精确设置（如 <code>listBox_item</code>、<code>dataGrid_cell</code>、<code>treeview_node_toggle</code> 等）</li>
      <li>数据属性（<code>data-listBox-items</code>、<code>data-columns</code>、<code>data-rows</code> 等）使用 <strong>单引号 JSON</strong>，与设计器导出格式一致</li>
    </ul>
  </div>

  <h4>3.1 列表框（ListBox）</h4>
  <ul>
    <li><strong>关键属性：</strong><code>data-listBox-items</code>（JSON 数组）。</li>
    <li><strong>关键子元素类名：</strong><code>.listBox_scroll</code> → <code>.listBox_item</code> → <code>.listBox_item_text</code>。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="listBox_1" data-type="listBox" data-ctrl-type="listBox" data-drag-type="listBox" data-ctrl-id="listBox_1" data-name="列表框"
     data-listBox-items='[{"id":"1","text":"列表项1","selected":false},{"id":"2","text":"列表项2","selected":false},{"id":"3","text":"列表项3","selected":false}]'
     data-editable="false" data-always-show-selection="false" style="width:200px;height:200px;"&gt;
  &lt;div class="listBox_scroll"&gt;
    &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="0"&gt;
      &lt;span class="listBox_item_text"&gt;列表项1&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="1"&gt;
      &lt;span class="listBox_item_text"&gt;列表项2&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="2"&gt;
      &lt;span class="listBox_item_text"&gt;列表项3&lt;/span&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.2 多项表格（DataGrid）</h4>
  <ul>
    <li><strong>关键属性：</strong><code>data-columns</code> + <code>data-rows</code>（均 JSON 数组）。</li>
    <li><strong>关键结构：</strong>头部 <code>.dataGrid_header</code> → 单元格 <code>.dataGrid_header_cell</code>，数据体 <code>.dataGrid_body</code> → 行 <code>.dataGrid_row</code> → 单元格 <code>.dataGrid_cell</code>。<strong>头部和数据单元格均需</strong> <code>data-ctrl-type="dataGrid_cell"</code>。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="dataGrid_1" data-type="dataGrid" data-ctrl-type="dataGrid" data-drag-type="dataGrid" data-ctrl-id="dataGrid_1" data-name="多项表格"
     data-columns='[{"field":"col1","header":"列A"},{"field":"col2","header":"列B"},{"field":"col3","header":"列C"}]'
     data-rows='[{"id":"dataGrid_1_row_1","cells":{"col1":"数据A1","col2":"数据B1","col3":"数据C1"}},{"id":"dataGrid_1_row_2","cells":{"col1":"数据A2","col2":"数据B2","col3":"数据C2"}},{"id":"dataGrid_1_row_3","cells":{"col1":"数据A3","col2":"数据B3","col3":"数据C3"}}]'
     data-show-checkbox="true" data-editable="false" data-always-show-selection="false"
     class="dataGrid_container" style="width:500px;height:300px;"&gt;
  &lt;div class="dataGrid_header"&gt;
    &lt;div class="dataGrid_header_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
      &lt;input type="checkbox" class="dataGrid_select_all"&gt;
    &lt;/div&gt;
    &lt;div class="dataGrid_header_cell" data-ctrl-type="dataGrid_cell" data-col-key="col1" data-col-name="列A" style="width:100px;min-width:100px;flex-shrink:0"&gt;列A&lt;/div&gt;
    &lt;div class="dataGrid_header_cell" data-ctrl-type="dataGrid_cell" data-col-key="col2" data-col-name="列B" style="width:100px;min-width:100px;flex-shrink:0"&gt;列B&lt;/div&gt;
    &lt;div class="dataGrid_header_cell" data-ctrl-type="dataGrid_cell" data-col-key="col3" data-col-name="列C" style="width:100px;min-width:100px;flex-shrink:0"&gt;列C&lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="dataGrid_body"&gt;
    &lt;div class="dataGrid_row" data-row-index="0" data-row-id="dataGrid_1_row_1"&gt;
      &lt;div class="dataGrid_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
        &lt;input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox"&gt;
      &lt;/div&gt;
      &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="col1" data-col-name="列A" style="width:100px;min-width:100px;flex-shrink:0" title="数据A1"&gt;数据A1&lt;/div&gt;
      &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="col2" data-col-name="列B" style="width:100px;min-width:100px;flex-shrink:0" title="数据B1"&gt;数据B1&lt;/div&gt;
      &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="col3" data-col-name="列C" style="width:100px;min-width:100px;flex-shrink:0" title="数据C1"&gt;数据C1&lt;/div&gt;
    &lt;/div&gt;
    &lt;!-- ... 更多行 ... --&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.3 树形框（TreeView）</h4>
  <ul>
    <li><strong>关键属性：</strong><code>data-tree-id</code>（唯一标识）。</li>
    <li><strong>关键结构：</strong>节点 <code>.treeView_node</code> → 内容区 <code>.treeView_node_content</code> → 三角 <code>.treeView_toggle</code> + 图标 <code>.treeView_icon</code> + 文本 <code>.treeView_label</code>。<strong>每个节点都必须有</strong> <code>.tree-edit-input</code>（初始隐藏）。展开状态由 <code>.treeView_toggle</code> 的 class（<code>expanded</code>/<code>collapsed</code>/<code>empty</code>）决定，子节点容器为 <code>.treeView_children</code>。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="treeView_1" data-type="treeView" data-ctrl-type="treeView" data-drag-type="treeView" data-ctrl-id="treeView_1" data-name="树形框"
     data-tree-id="treeView_1" data-editable="false" data-show-icon="true" data-always-show-selection="true"
     style="width:220px;height:320px;"&gt;
  &lt;!-- 根节点（expanded = 展开可见子节点） --&gt;
  &lt;div class="treeView_node" data-node-id="node_1" data-level="0"&gt;
    &lt;div class="treeView_node_content"&gt;
      &lt;span class="treeView_toggle expanded" data-ctrl-type="treeview_node_toggle"&gt;▶&lt;/span&gt;
      &lt;span class="treeView_icon folder"&gt;📁&lt;/span&gt;
      &lt;span class="treeView_label" data-ctrl-type="treeview_node_text"&gt;根节点&lt;/span&gt;
      &lt;span class="tree-edit-input" style="display:none"&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="treeView_children"&gt;
      &lt;!-- 叶子节点（empty = 没有子节点，三角隐藏） --&gt;
      &lt;div class="treeView_node" data-node-id="node_2" data-level="1"&gt;
        &lt;div class="treeView_node_content"&gt;
          &lt;span class="treeView_toggle empty" data-ctrl-type="treeview_node_toggle"&gt;▶&lt;/span&gt;
          &lt;span class="treeView_icon file"&gt;📄&lt;/span&gt;
          &lt;span class="treeView_label" data-ctrl-type="treeview_node_text"&gt;子节点1（叶子）&lt;/span&gt;
          &lt;span class="tree-edit-input" style="display:none"&gt;&lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;
      &lt;!-- 子节点（collapsed = 有子节点但折叠，三角可点击展开） --&gt;
      &lt;div class="treeView_node" data-node-id="node_3" data-level="1"&gt;
        &lt;div class="treeView_node_content"&gt;
          &lt;span class="treeView_toggle collapsed" data-ctrl-type="treeview_node_toggle"&gt;▶&lt;/span&gt;
          &lt;span class="treeView_icon folder"&gt;📁&lt;/span&gt;
          &lt;span class="treeView_label" data-ctrl-type="treeview_node_text"&gt;子节点2（含子节点）&lt;/span&gt;
          &lt;span class="tree-edit-input" style="display:none"&gt;&lt;/span&gt;
        &lt;/div&gt;
        &lt;div class="treeView_children"&gt;
          &lt;div class="treeView_node" data-node-id="node_4" data-level="2"&gt;
            &lt;div class="treeView_node_content"&gt;
              &lt;span class="treeView_toggle empty" data-ctrl-type="treeview_node_toggle"&gt;▶&lt;/span&gt;
              &lt;span class="treeView_icon file"&gt;📄&lt;/span&gt;
              &lt;span class="treeView_label" data-ctrl-type="treeview_node_text"&gt;子节点2-1&lt;/span&gt;
              &lt;span class="tree-edit-input" style="display:none"&gt;&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.4 标签页（TabContainer）</h4>
  <ul>
    <li><strong>关键结构：</strong>头部栏 <code>.tabsContainer_headerBar</code> → 按钮 <code>.tabsContainer_headerBar_btn</code>（通过 <code>data-tab-name</code> 关联面板），内容区 <code>.tabsContainer_contentWrapper</code> → 面板 <code>.tabsContainer_contentWrapper_panel</code>。面板需设置 <code>data-parent</code> 指向容器 ID。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="tabsContainer_1" data-type="tabsContainer" data-ctrl-type="tabsContainer" data-drag-type="tabsContainer" data-ctrl-id="tabsContainer_1" data-name="标签页容器"
     class="tabsContainer" style="width:300px;height:200px;"&gt;
  &lt;div class="tabsContainer_headerBar"&gt;
    &lt;button class="tabsContainer_headerBar_btn active" data-ctrl-type="tabsContainer_headerBar_btn" data-tab-name="tab1"&gt;标签1&lt;/button&gt;
    &lt;button class="tabsContainer_headerBar_btn" data-ctrl-type="tabsContainer_headerBar_btn" data-tab-name="tab2"&gt;标签2&lt;/button&gt;
    &lt;button class="tabsContainer_headerBar_btn" data-ctrl-type="tabsContainer_headerBar_btn" data-tab-name="tab3"&gt;标签3&lt;/button&gt;
  &lt;/div&gt;
  &lt;div class="tabsContainer_contentWrapper"&gt;
    &lt;div class="tabsContainer_contentWrapper_panel active" data-tab-name="tab1" data-parent="tabsContainer_1" data-tab="0"&gt;内容1&lt;/div&gt;
    &lt;div class="tabsContainer_contentWrapper_panel" data-tab-name="tab2" data-parent="tabsContainer_1" data-tab="1"&gt;内容2&lt;/div&gt;
    &lt;div class="tabsContainer_contentWrapper_panel" data-tab-name="tab3" data-parent="tabsContainer_1" data-tab="2"&gt;内容3&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.5 卡片框（CardBox）</h4>
  <ul>
    <li><strong>关键属性：</strong><code>data-collapsible="true"</code> + <code>data-collapsed="false"</code>。</li>
    <li><strong>关键结构：</strong>头部 <code>.cardBox_header</code> → 标题 <code>.cardBox_header_title</code> + 折叠按钮 <code>.cardBox_collapse_btn</code>（含 SVG），内容区 <code>.cardBox_body</code> 需设 <code>data-ctrl-type="cardBox_body"</code>。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="cardBox_1" data-type="cardBox" data-ctrl-type="cardBox" data-drag-type="cardBox" data-ctrl-id="cardBox_1" data-name="卡片框"
     data-collapsible="true" data-collapsed="false"
     class="cardBox" style="width:260px;height:180px;"&gt;
  &lt;div class="cardBox_header"&gt;
    &lt;span class="cardBox_header_title"&gt;卡片标题&lt;/span&gt;
    &lt;span class="cardBox_collapse_btn"&gt;
      &lt;svg width="12" height="12" viewBox="0 0 12 12"&gt;&lt;path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/&gt;&lt;/svg&gt;
    &lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="cardBox_body" data-ctrl-type="cardBox_body"&gt;卡片内容&lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.6 日志框（LogOutput）</h4>
  <ul>
    <li><strong>关键结构：</strong>容器 <code>.logOutput_container</code> → 日志行 <code>.logOutput_line</code>（每条需设 <code>data-ctrl-type="logOutput_item"</code>）。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="logOutput_1" data-type="logOutput" data-ctrl-type="logOutput" data-drag-type="logOutput" data-ctrl-id="logOutput_1" data-name="日志框"
     class="logOutput_container" style="width:300px;height:150px;"&gt;
  &lt;div class="logOutput_line" data-ctrl-type="logOutput_item" style="color:#333"&gt;[INFO] 日志已就绪&lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.7 单选框组（RadioGroup）</h4>
  <ul>
    <li><strong>关键结构：</strong>容器 <code>.radioGroup_container</code> → <code>&lt;label class="radioGroup_item"&gt;</code>（内含 <code>&lt;input type="radio"&gt;</code>）。每个 radio 的 <code>name</code> 必须一致（用于单选分组），且需设 <code>data-ctrl-type="radio"</code>。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="radioGroup_1" data-type="radioGroup" data-ctrl-type="radioGroup" data-drag-type="radioGroup" data-ctrl-id="radioGroup_1" data-name="单选框组"
     class="radioGroup_container" style="width:120px;height:60px;"&gt;
  &lt;label class="radioGroup_item"&gt;
    &lt;input type="radio" data-ctrl-type="radio" name="radioGroup_1" value="选项1" checked /&gt;选项1
  &lt;/label&gt;
  &lt;label class="radioGroup_item"&gt;
    &lt;input type="radio" data-ctrl-type="radio" name="radioGroup_1" value="选项2" /&gt;选项2
  &lt;/label&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.8 进度条（高级样式，非原生 range）</h4>
  <ul>
    <li><strong>关键结构：</strong>容器 <code>.progressBar_container</code> → 轨道 <code>.progressBar_track</code> + 填充 <code>.progressBar_fill</code> + 文本 <code>.progressBar_text</code>。<code>data-editable="true"</code> 时允许点击跳转进度。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="progressBar_1" data-type="progressBar" data-ctrl-type="progressBar" data-drag-type="progressBar" data-ctrl-id="progressBar_1" data-name="进度条"
     data-editable="true" class="progressBar_container"
     style="width:250px;height:10px;overflow:visible;"&gt;
  &lt;div class="progressBar_track"&gt;&lt;/div&gt;
  &lt;div class="progressBar_fill" style="width:60%;height:100%;background:#0078D4;border-radius:inherit;transition:width 0.15s;"&gt;&lt;/div&gt;
  &lt;span class="progressBar_text" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:inherit;pointer-events:none;white-space:nowrap;"&gt;60%&lt;/span&gt;
&lt;/div&gt;</code></pre>
  </div>
  
    <h4>3.9 右键菜单（ContextMenu）</h4>
  <ul>
    <li><strong>用途：</strong>设计态标记右键菜单的占位容器，运行态由宿主在指定触发元素上弹出右键菜单。</li>
    <li><strong>关键属性：</strong><code>data-ctrl-type="contextMenu"</code>、<code>data-drag-type="contextMenu"</code>、<code>data-contextMenu-items</code>（菜单项 JSON 数组）、<code>data-contextmenu-target</code>（绑定目标控件 ID）。</li>
    <li><strong>必须在设计态的占位中写入触发控件的 id。</strong></li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="contextMenu_1" data-type="contextMenu" data-ctrl-type="contextMenu" data-drag-type="contextMenu" data-ctrl-id="contextMenu_1" data-name="右键菜单"
     data-contextMenu-items='[{"id":"item1","text":"复制","type":"normal","icon":""},{"id":"item2","text":"粘贴","type":"normal","icon":""},{"id":"item3","text":"-","type":"separator","icon":""},{"id":"item4","text":"删除","type":"danger","icon":""}]'
     data-contextMenu-target="targetButton_1"
     style="width:120px;height:60px;border:2px dashed #E58080;background:#FFEEE9;"&gt;
  &lt;div style="padding:4px;font-size:12px;color:#999;"&gt;⚠ 右键菜单占位区&lt;br&gt;不显示在运行界面&lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.10 气泡提示框（Tooltip）</h4>
  <ul>
    <li><strong>用途：</strong>设计态标记气泡提示框的占位容器，运行态由宿主在指定触发元素上显示提示。</li>
    <li><strong>关键属性：</strong><code>data-ctrl-type="tooltip"</code>、<code>data-drag-type="tooltip"</code>、<code>data-tooltip-content</code>（提示文字/HTML）、<code>data-tooltip-target</code>（绑定目标控件 ID）。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="tooltip_1" data-type="tooltip" data-ctrl-type="tooltip" data-drag-type="tooltip" data-ctrl-id="tooltip_1" data-name="气泡提示框"
     data-tooltip-content="这是提示内容&lt;br&gt;支持换行" data-tooltip-target="targetButton_1" data-tooltip-trigger="hover" data-tooltip-position="top"
     data-tooltip-allow-html="true" data-tooltip-show-delay="500" data-tooltip-hide-delay="300"
     style="width:120px;height:60px;border:2px dashed #809EE5;background:#E9F9FF;"&gt;
  &lt;div style="padding:4px;font-size:12px;color:#999;"&gt;💬 气泡提示占位区&lt;br&gt;不显示在运行界面&lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.11 信息框（MessageBox）</h4>
  <ul>
    <li><strong>用途：</strong>设计态标记信息提示框的弹窗样式，运行态由宿主调用 <code>MessageBox_show/MessageBox_hide</code> 控制。</li>
    <li><strong>关键属性：</strong><code>data-ctrl-type="messageBox"</code>（不设 <code>data-drag-type</code> —— 弹窗覆盖层不应参与拖拽）。</li>
    <li><strong>DOM 结构：</strong>覆盖层 → 标题栏（关闭按钮）+ 内容区（图标 + 提示文字 + 按钮区）。</li>
    <li>运行态样式由宿主注入，设计态只需提供占位标记。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="messageBox_1" data-type="messageBox" data-ctrl-type="messageBox" data-ctrl-id="messageBox_1" data-name="信息提示框"
     style="width:360px;height:180px;border:2px dashed #809EE5;background:#FFEEE9;"&gt;
  &lt;div class="mb-header" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;"&gt;
    &lt;span class="mb-header-title"&gt;提示&lt;/span&gt;
    &lt;span class="mb-header-close" data-ctrl-type="messageBox_close"&gt;✕&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="mb-body" style="padding:12px;"&gt;
    &lt;div class="mb-icon"&gt;⚠&lt;/div&gt;
    &lt;span class="mb-message"&gt;操作确认提示&lt;/span&gt;
    &lt;div class="mb-footer"&gt;
      &lt;button class="mb-btn" data-ctrl-type="messageBox_no"&gt;取消&lt;/button&gt;
      &lt;button class="mb-btn mb-btn-primary" data-ctrl-type="messageBox_yes"&gt;确定&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>

  <h4>3.12 输入框（InputBox）</h4>
  <ul>
    <li><strong>用途：</strong>设计态标记输入弹窗的样式，运行态由宿主调用 <code>InputBox_show/InputBox_hide</code> 控制。</li>
    <li><strong>关键属性：</strong><code>data-ctrl-type="inputBox"</code>（不设 <code>data-drag-type</code>）。</li>
    <li><strong>DOM 结构：</strong>覆盖层 → 标题栏 + 输入区域（提示文字 + input + 按钮区）。</li>
  </ul>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">HTML</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code>&lt;div id="inputBox_1" data-type="inputBox" data-ctrl-type="inputBox" data-ctrl-id="inputBox_1" data-name="输入框"
     style="width:360px;height:180px;border:2px dashed #809EE5;background:#E9F9FF;"&gt;
  &lt;div class="ib-header" style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;"&gt;
    &lt;span class="ib-header-title"&gt;请输入&lt;/span&gt;
    &lt;span class="ib-header-close" data-ctrl-type="inputBox_close"&gt;✕&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="ib-body" style="padding:12px;"&gt;
    &lt;span class="ib-prompt"&gt;请输入内容：&lt;/span&gt;
    &lt;input class="ib-input" data-ctrl-type="inputBox_text" placeholder="请输入..." /&gt;
    &lt;div class="ib-footer"&gt;
      &lt;button class="ib-btn" data-ctrl-type="inputBox_no"&gt;取消&lt;/button&gt;
      &lt;button class="ib-btn ib-btn-primary" data-ctrl-type="inputBox_yes"&gt;确定&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>
  </div>
</div>
</div>

<!-- ==================== 4. 属性速查表（完整版） ==================== -->
<div class="dev-step">
  <h3><span class="step-num">4</span> 属性速查表（完整版）</h3>

  <table>
    <thead>
      <tr><th style="width:20%;">属性</th><th style="width:15%;">必填</th><th style="width:35%;">说明</th><th style="width:30%;">示例</th></tr>
    </thead>
    <tbody>
      <tr><td><code>id</code></td><td><span class="tag tag-required">必填</span></td><td>控件唯一标识，宿主通过此 ID 定位控件</td><td><code>id="btn_save"</code></td></tr>
      <tr><td><code>data-ctrl-type</code></td><td><span class="tag tag-required">必填</span></td><td>控件类型，决定事件上报的 <code>ctrlType</code> 和数据提取逻辑</td><td><code>data-ctrl-type="button"</code></td></tr>
      <tr><td><code>data-drag-type</code></td><td><span class="tag tag-required">可交互控件必填</span></td><td>标记可交互控件，CSS 统一设置 <code>no-drag</code>，防止拖拽窗口。<strong>纯布局容器不需要此属性。</strong></td><td><code>data-drag-type="button"</code></td></tr>
      <tr><td><code>data-name</code></td><td><span class="tag tag-recommend">推荐</span></td><td>控件中文名称，显示在事件日志的 <code>customname</code> 字段</td><td><code>data-name="保存按钮"</code></td></tr>
      <tr><td><code>data-type</code></td><td><span class="tag tag-recommend">推荐</span></td><td>控件小写类型名（button/input/checkbox/…），所有控件根元素必须设置，与设计器输出一致，便于选择器和调试</td><td><code>data-type="button"</code></td></tr>
      <tr><td><code>data-ctrl-id</code></td><td><span class="tag tag-optional">可选</span></td><td>与 <code>id</code> 相同，设计器产物中会自动输出，手工开发时非必须</td><td><code>data-ctrl-id="button_1"</code></td></tr>
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

<!-- ==================== 5. 完整页面模板（复制即用） ==================== -->
<div class="dev-step">
  <h3><span class="step-num">5</span> 完整页面模板（复制即用）</h3>
  <p>以下模板严格遵循本文档规范（第 1 步页面容器/标题栏 + 第 2 步基础控件 + 第 3 步复杂控件 <strong>DataGrid</strong> / <strong>ListBox</strong>），可直接复制运行。</p>

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
    html, body { width:100%; height:100%; overflow:hidden; }

    /* 页面容器 — padding-top 留出标题栏高度，防止内容被遮挡 */
    .pageContainer {
      position: relative;
      width: 100%; height: 100%;
      padding-top: 40px; /* 留出标题栏高度 */
      background: #f0f2f5;
      font-family: 'Segoe UI', sans-serif;
      display: flex; flex-direction: column;
      overflow: hidden;
      app-region: drag; -webkit-app-region: drag;  /* 使整个窗口可拖拽 */
    }

    /* 可交互控件 — 统一 no-drag，防止拖拽穿透到窗口 */
    [data-drag-type] { app-region: no-drag; -webkit-app-region: no-drag; }

    /* 标题栏按钮 no-drag（用 ctrl-type 选，不用 data-drag-type，避免 WebView2 子元素句柄失效） */
    .pageContainer [data-ctrl-type^="titlebar_"] { app-region: no-drag; -webkit-app-region: no-drag; }
    /* 最大化按钮内部 span — 设回 drag，支持 Windows 11 Snap Layout */
    .pageContainer [data-ctrl-type="titlebar_max"] span { app-region: drag; -webkit-app-region: drag; }

    /* ===== 标题栏（与第 1 步规范一致） ===== */
    .titlebar_left { display:flex; align-items:center; padding-left:12px; }
    .titlebar_center { flex:1; display:flex; justify-content:center; }
    .titlebar_right { display:flex; align-items:center; padding-right:4px; }
    .titlebar_rightBtn {
      width:35px; height:32px; border:none; background:transparent;
      cursor:default; border-radius:4px; display:flex; align-items:center; justify-content:center;
    }
    .titlebar_rightBtn:hover { background:rgba(0,0,0,0.06); }
    .titlebar_rightBtn_close:hover { background:#e81123; color:#fff; }

    /* 侧边栏 + 内容区布局 */
    .main-layout { flex:1; display:flex; overflow:hidden; }
    .sidebar {
      width: 240px; background: #fff;
      border-right: 1px solid #e0e0e0;
      display: flex; flex-direction: column; flex-shrink: 0;
    }
    .sidebar-header {
      padding: 14px 16px; border-bottom: 1px solid #f0f0f0;
      font-size: 14px; font-weight: 600; color: #1a1a2e;
    }
    .sidebar-nav { flex:1; overflow-y:auto; padding: 8px 0; }
    .nav-item {
      padding: 10px 20px; cursor: pointer; font-size: 13px; color: #555;
      display: flex; align-items: center; gap: 10px;
    }
    .nav-item:hover { background: #f5f7fa; }
    .nav-item.active { background: #e8f0fe; color: #409EFF; font-weight: 600; }

    /* 内容区（布局容器，不需要 data-drag-type） */
    .content { flex:1; padding:20px; overflow-y:auto; }

    /* 工具栏 */
    .toolbar { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
    .toolbar input, .toolbar select { padding:6px 12px; border:1px solid #dadce0; border-radius:4px; font-size:13px; outline:none; }
    .toolbar input:focus, .toolbar select:focus { border-color:#409EFF; }
    .toolbar button { padding:6px 16px; border:1px solid #dadce0; border-radius:4px; background:#fff; cursor:pointer; font-size:13px; }
    .toolbar button:hover { background:#f1f3f4; }
    .toolbar button.primary { background:#409EFF; border-color:#409EFF; color:#fff; }
    .toolbar button.primary:hover { background:#3a8ee6; }
    .toolbar button.danger { background:#f56c6c; border-color:#f56c6c; color:#fff; }
    .toolbar button.danger:hover { background:#f89898; }

    /* 表单区域 */
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px; }
    .form-group label { display:block; font-size:13px; font-weight:500; margin-bottom:4px; color:#333; }
    .form-group input, .form-group select, .form-group textarea {
      width:100%; padding:8px 12px; border:1px solid #dadce0; border-radius:4px; font-size:13px; outline:none;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color:#409EFF; }
    .form-check { display:flex; align-items:center; gap:8px; margin:4px 0; }
    .form-check input[type="checkbox"], .form-check input[type="radio"] { width:16px; height:16px; }

    /* 列表控件区 */
    .widget-section {
      background: #fff; border: 1px solid #e8eaed; border-radius: 8px;
      padding: 16px; margin-bottom: 16px;
    }
    .widget-section h4 { margin-bottom: 10px; font-size: 14px; color: #1a1a2e; }

    /* ===== DataGrid（与第 3.2 节规范一致） ===== */
    .dataGrid {
      display:flex; flex-direction:column;
      border:1px solid #e0e0e0; border-radius:4px; overflow:hidden; background:#fff;
    }
    .dataGrid_header {
      display:flex; background:#f5f7fa;
      border-bottom:2px solid #e0e0e0; flex-shrink:0;
    }
    .dataGrid_header_cell {
      padding:8px 12px; font-size:13px; font-weight:600; color:#333;
      display:flex; align-items:center;
    }
    .dataGrid_body { flex:1; overflow-y:auto; }
    .dataGrid_row {
      display:flex; border-bottom:1px solid #f0f0f0;
    }
    .dataGrid_row:hover { background:#f9fafb; }
    .dataGrid_cell {
      padding:8px 12px; font-size:13px; color:#333;
      display:flex; align-items:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }
    .dataGrid_checkbox {
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .dataGrid_checkbox input { width:14px; height:14px; cursor:pointer; }

    /* 统计卡片 */
    .stat-cards { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:16px; }
    .stat-card {
      background: #fff; border: 1px solid #e8eaed; border-radius: 8px;
      padding: 16px; text-align: center;
    }
    .stat-card .number { font-size: 28px; font-weight: 700; color: #1a1a2e; }
    .stat-card .label { font-size: 13px; color: #888; margin-top: 4px; }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;

&lt;!-- ===== 页面容器 ===== --&gt;
&lt;div class="pageContainer" id="pageContainer"
     data-ctrl-type="pageContainer" data-name="canvas"
     data-original-width="1065" data-original-height="695"&gt;

  &lt;!-- ===== 标题栏（与第 1 步规范完全一致） ===== --&gt;
  &lt;div class="titlebar" id="titlebar" data-name="标题栏"
       style="position:absolute;top:0;left:0;right:0;height:40px;background:#F8F8F8;border-bottom:1px solid rgba(0,0,0,0.08);app-region:drag;-webkit-app-region:drag;display:flex;align-items:center;"&gt;
    &lt;div class="titlebar_left"&gt;
      &lt;span class="titlebar_left_icon" id="titlebar_left_icon"
            data-ctrl-type="titlebar_left_icon" data-drag-type="titlebar_left_icon" data-name="图标" style="color:#333;"&gt;
        &lt;i class="fas fa-star"&gt;&lt;/i&gt;
      &lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="titlebar_center" style="justify-content:flex-start;"&gt;
      &lt;span class="titlebar_center_title" id="titlebar_title"
            data-ctrl-type="titlebar_title" data-drag-type="titlebar_title" data-name="标题" style="color:#333;font-weight:600;"&gt;我的应用&lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="titlebar_right"&gt;
      &lt;button id="titlebar_min" data-ctrl-type="titlebar_min" data-name="最小化"
              style="color:#333;" class="titlebar_rightBtn" title="最小化"&gt;
        &lt;svg width="12" height="1" viewBox="0 0 10 1"&gt;&lt;rect width="10" height="1" fill="currentColor"/&gt;&lt;/svg&gt;
      &lt;/button&gt;
      &lt;button id="titlebar_max" data-ctrl-type="titlebar_max" data-name="最大化"
              style="color:#333;" class="titlebar_rightBtn" title="最大化"&gt;
        &lt;span style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;"&gt;
          &lt;svg width="12" height="12" viewBox="0 0 10 10" shape-rendering="crispEdges"&gt;
            &lt;rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1"/&gt;
          &lt;/svg&gt;
        &lt;/span&gt;
      &lt;/button&gt;
      &lt;button id="titlebar_close" data-ctrl-type="titlebar_close" data-name="关闭"
              style="color:#333;" class="titlebar_rightBtn titlebar_rightBtn_close" title="关闭"&gt;
        &lt;svg width="12" height="12" viewBox="0 0 10 10"&gt;
          &lt;line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1"/&gt;
          &lt;line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1"/&gt;
        &lt;/svg&gt;
      &lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;

  &lt;!-- ===== 主体（侧边栏 + 内容区，均为布局容器，不需要 data-drag-type） ===== --&gt;
  &lt;div class="main-layout"&gt;

    &lt;!-- 侧边栏 --&gt;
    &lt;div class="sidebar" id="sidebar"&gt;
      &lt;div class="sidebar-header"&gt;📋 导航菜单&lt;/div&gt;
      &lt;div class="sidebar-nav"&gt;
        &lt;div id="nav_dashboard" class="nav-item active"
             data-ctrl-type="button" data-drag-type="button" data-name="仪表盘"&gt;📊 仪表盘&lt;/div&gt;
        &lt;div id="nav_users" class="nav-item"
             data-ctrl-type="button" data-drag-type="button" data-name="用户管理"&gt;👥 用户管理&lt;/div&gt;
        &lt;div id="nav_settings" class="nav-item"
             data-ctrl-type="button" data-drag-type="button" data-name="系统设置"&gt;⚙️ 系统设置&lt;/div&gt;
        &lt;div id="nav_logs" class="nav-item"
             data-ctrl-type="button" data-drag-type="button" data-name="运行日志"&gt;📝 运行日志&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;!-- 内容区 --&gt;
    &lt;div class="content" id="contentArea"&gt;

      &lt;!-- 统计卡片 --&gt;
      &lt;div class="stat-cards"&gt;
        &lt;div class="stat-card"&gt;
          &lt;div class="number"&gt;1,286&lt;/div&gt;
          &lt;div class="label"&gt;用户总数&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="stat-card"&gt;
          &lt;div class="number"&gt;96.8%&lt;/div&gt;
          &lt;div class="label"&gt;在线率&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="stat-card"&gt;
          &lt;div class="number"&gt;42&lt;/div&gt;
          &lt;div class="label"&gt;待处理任务&lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- 工具栏 --&gt;
      &lt;div class="toolbar"&gt;
        &lt;input id="inp_search" data-ctrl-type="inputText" data-name="搜索框" data-drag-type="inputText" placeholder="🔍 搜索用户名或邮箱..."&gt;
        &lt;select id="sel_role" data-ctrl-type="comboBox" data-name="角色筛选" data-drag-type="comboBox"&gt;
          &lt;option value=""&gt;全部角色&lt;/option&gt;
          &lt;option value="admin"&gt;管理员&lt;/option&gt;
          &lt;option value="editor"&gt;编辑&lt;/option&gt;
          &lt;option value="viewer"&gt;访客&lt;/option&gt;
        &lt;/select&gt;
        &lt;button id="btn_search" data-ctrl-type="button" data-name="搜索按钮" data-drag-type="button" class="primary"&gt;搜索&lt;/button&gt;
        &lt;button id="btn_add" data-ctrl-type="button" data-name="添加用户" data-drag-type="button"&gt;➕ 新增&lt;/button&gt;
        &lt;button id="btn_delete" data-ctrl-type="button" data-name="批量删除" data-drag-type="button" class="danger"&gt;🗑️ 批量删除&lt;/button&gt;
        &lt;span style="flex:1"&gt;&lt;/span&gt;
        &lt;label style="display:flex;align-items:center;gap:6px;font-size:13px;color:#666;cursor:pointer;"&gt;
          &lt;input id="sw_autorefresh" type="checkbox" data-ctrl-type="switchToggle" data-name="自动刷新" data-drag-type="switchToggle" checked&gt;
          自动刷新
        &lt;/label&gt;
        &lt;a id="link_help" data-ctrl-type="hyperLink" data-name="帮助链接" data-drag-type="hyperLink" data-href="#"&gt;❓ 帮助&lt;/a&gt;
      &lt;/div&gt;

      &lt;!-- ===== DataGrid 多项表格（与第 3.2 节规范完全一致） ===== --&gt;
      &lt;div class="widget-section"&gt;
        &lt;h4&gt;👥 用户列表 — DataGrid&lt;/h4&gt;
        &lt;div id="grid_users" class="dataGrid" data-ctrl-type="dataGrid" data-drag-type="dataGrid" data-name="用户表格"
             data-columns='[{"field":"username","header":"用户名"},{"field":"role","header":"角色"},{"field":"status","header":"状态"}]'
             data-rows='[{"id":"row1","cells":{"username":"张三","role":"管理员","status":"在线"}},{"id":"row2","cells":{"username":"李四","role":"编辑","status":"在线"}},{"id":"row3","cells":{"username":"王五","role":"访客","status":"离线"}}]'
             data-show-checkbox="true" data-editable="false" data-always-show-selection="false"
             style="width:100%;height:300px;"&gt;
          &lt;div class="dataGrid_header"&gt;
            &lt;div class="dataGrid_header_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
              &lt;input type="checkbox" class="dataGrid_select_all"&gt;
            &lt;/div&gt;
            &lt;div class="dataGrid_header_cell" data-col-key="username" data-col-name="用户名" style="flex:1;min-width:100px;"&gt;用户名&lt;/div&gt;
            &lt;div class="dataGrid_header_cell" data-col-key="role" data-col-name="角色" style="width:100px;min-width:100px;flex-shrink:0"&gt;角色&lt;/div&gt;
            &lt;div class="dataGrid_header_cell" data-col-key="status" data-col-name="状态" style="width:80px;min-width:80px;flex-shrink:0"&gt;状态&lt;/div&gt;
            &lt;div class="dataGrid_header_cell" style="width:80px;min-width:80px;flex-shrink:0"&gt;操作&lt;/div&gt;
          &lt;/div&gt;
          &lt;div class="dataGrid_body"&gt;
            &lt;div class="dataGrid_row" data-row-index="0" data-row-id="row1"&gt;
              &lt;div class="dataGrid_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
                &lt;input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox"&gt;
              &lt;/div&gt;
              &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="username" data-col-name="用户名" style="flex:1;min-width:100px;" title="张三"&gt;张三&lt;/div&gt;
              &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="role" data-col-name="角色" style="width:100px;min-width:100px;flex-shrink:0" title="管理员"&gt;管理员&lt;/div&gt;
              &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="status" data-col-name="状态" style="width:80px;min-width:80px;flex-shrink:0;color:#67c23a;" title="在线"&gt;在线&lt;/div&gt;
              &lt;div class="dataGrid_cell" style="width:80px;min-width:80px;flex-shrink:0"&gt;
                &lt;button id="btn_edit_1" data-ctrl-type="button" data-name="编辑张三" data-drag-type="button" style="padding:2px 10px;font-size:12px;border:1px solid #dadce0;border-radius:3px;background:#fff;cursor:pointer;"&gt;编辑&lt;/button&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div class="dataGrid_row" data-row-index="1" data-row-id="row2"&gt;
              &lt;div class="dataGrid_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
                &lt;input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox"&gt;
              &lt;/div&gt;
              &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="username" data-col-name="用户名" style="flex:1;min-width:100px;" title="李四"&gt;李四&lt;/div&gt;
              &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="role" data-col-name="角色" style="width:100px;min-width:100px;flex-shrink:0" title="编辑"&gt;编辑&lt;/div&gt;
              &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="status" data-col-name="状态" style="width:80px;min-width:80px;flex-shrink:0;color:#67c23a;" title="在线"&gt;在线&lt;/div&gt;
              &lt;div class="dataGrid_cell" style="width:80px;min-width:80px;flex-shrink:0"&gt;
                &lt;button id="btn_edit_2" data-ctrl-type="button" data-name="编辑李四" data-drag-type="button" style="padding:2px 10px;font-size:12px;border:1px solid #dadce0;border-radius:3px;background:#fff;cursor:pointer;"&gt;编辑&lt;/button&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div class="dataGrid_row" data-row-index="2" data-row-id="row3"&gt;
              &lt;div class="dataGrid_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
                &lt;input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox"&gt;
              &lt;/div&gt;
              &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="username" data-col-name="用户名" style="flex:1;min-width:100px;" title="王五"&gt;王五&lt;/div&gt;
              &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="role" data-col-name="角色" style="width:100px;min-width:100px;flex-shrink:0" title="访客"&gt;访客&lt;/div&gt;
              &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="status" data-col-name="状态" style="width:80px;min-width:80px;flex-shrink:0;color:#f56c6c;" title="离线"&gt;离线&lt;/div&gt;
              &lt;div class="dataGrid_cell" style="width:80px;min-width:80px;flex-shrink:0"&gt;
                &lt;button id="btn_edit_3" data-ctrl-type="button" data-name="编辑王五" data-drag-type="button" style="padding:2px 10px;font-size:12px;border:1px solid #dadce0;border-radius:3px;background:#fff;cursor:pointer;"&gt;编辑&lt;/button&gt;
              &lt;/div&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- 表单区域 --&gt;
      &lt;div class="widget-section"&gt;
        &lt;h4&gt;✏️ 编辑用户信息&lt;/h4&gt;
        &lt;div class="form-row"&gt;
          &lt;div class="form-group"&gt;
            &lt;label&gt;用户名&lt;/label&gt;
            &lt;input id="inp_username" data-ctrl-type="inputText" data-name="用户名" data-drag-type="inputText" placeholder="请输入用户名"&gt;
          &lt;/div&gt;
          &lt;div class="form-group"&gt;
            &lt;label&gt;邮箱&lt;/label&gt;
            &lt;input id="inp_email" type="email" data-ctrl-type="inputText" data-name="邮箱" data-drag-type="inputText" placeholder="请输入邮箱"&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="form-row"&gt;
          &lt;div class="form-group"&gt;
            &lt;label&gt;密码&lt;/label&gt;
            &lt;input id="inp_password" type="password" data-ctrl-type="inputText" data-name="密码" data-drag-type="inputText" placeholder="请输入密码"&gt;
          &lt;/div&gt;
          &lt;div class="form-group"&gt;
            &lt;label&gt;角色&lt;/label&gt;
            &lt;select id="sel_userrole" data-ctrl-type="comboBox" data-name="用户角色" data-drag-type="comboBox"&gt;
              &lt;option value="viewer"&gt;访客&lt;/option&gt;
              &lt;option value="editor"&gt;编辑&lt;/option&gt;
              &lt;option value="admin"&gt;管理员&lt;/option&gt;
            &lt;/select&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="form-row"&gt;
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
          &lt;div class="form-group"&gt;
            &lt;label&gt;状态&lt;/label&gt;
            &lt;div class="form-check"&gt;
              &lt;input id="chk_active" type="checkbox" data-ctrl-type="checkbox" data-name="启用账户" data-drag-type="checkbox" checked&gt;
              &lt;label&gt;启用账户&lt;/label&gt;
            &lt;/div&gt;
            &lt;div class="form-check"&gt;
              &lt;input id="sw_vip" type="checkbox" data-ctrl-type="switchToggle" data-name="VIP会员" data-drag-type="switchToggle"&gt;
              &lt;label&gt;VIP 会员&lt;/label&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="form-row"&gt;
          &lt;div class="form-group"&gt;
            &lt;label&gt;备注&lt;/label&gt;
            &lt;textarea id="txt_remark" data-ctrl-type="textarea" data-name="备注" data-drag-type="textarea" rows="3" placeholder="请输入备注信息"&gt;&lt;/textarea&gt;
          &lt;/div&gt;
          &lt;div class="form-group"&gt;
            &lt;label&gt;进度&lt;/label&gt;
            &lt;input id="prg_complete" type="range" min="0" max="100" value="75" data-ctrl-type="progressBar" data-name="完成进度" data-drag-type="progressBar" data-editable="true" style="width:100%;"&gt;
            &lt;div style="display:flex;justify-content:space-between;font-size:12px;color:#999;margin-top:4px;"&gt;
              &lt;span&gt;0%&lt;/span&gt;&lt;span id="lbl_progress" data-ctrl-type="label" data-name="进度文本" data-drag-type="label"&gt;75%&lt;/span&gt;&lt;span&gt;100%&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
        &lt;div class="form-row"&gt;
          &lt;div class="form-group"&gt;
            &lt;label&gt;入职日期&lt;/label&gt;
            &lt;input id="dt_join" type="date" data-ctrl-type="datetimePicker" data-name="入职日期" data-drag-type="datetimePicker"&gt;
          &lt;/div&gt;
          &lt;div class="form-group" style="display:flex;align-items:flex-end;gap:12px;padding-bottom:2px;"&gt;
            &lt;button id="btn_save" data-ctrl-type="button" data-name="保存按钮" data-drag-type="button" class="primary"&gt;💾 保存&lt;/button&gt;
            &lt;button id="btn_reset" data-ctrl-type="button" data-name="重置按钮" data-drag-type="button"&gt;↩️ 重置&lt;/button&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- 列表框演示 --&gt;
      &lt;div class="widget-section"&gt;
        &lt;h4&gt;📋 最近操作日志&lt;/h4&gt;
        &lt;div id="list_log" class="listBox" data-ctrl-type="listBox" data-name="操作日志" data-drag-type="listBox"
             data-listBox-items='[{"id":"1","text":"管理员登录系统","selected":false},{"id":"2","text":"新增用户 张三","selected":false},{"id":"3","text":"修改系统设置","selected":false}]'
             data-always-show-selection="false" data-editable="false"
             style="width:100%;height:160px;border:1px solid #e8eaed;border-radius:4px;"&gt;
          &lt;div class="listBox_scroll"&gt;
            &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="0"&gt;
              &lt;span class="listBox_item_text"&gt;管理员登录系统&lt;/span&gt;
            &lt;/div&gt;
            &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="1"&gt;
              &lt;span class="listBox_item_text"&gt;新增用户 张三&lt;/span&gt;
            &lt;/div&gt;
            &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="2"&gt;
              &lt;span class="listBox_item_text"&gt;修改系统设置&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;

    &lt;/div&gt;&lt;!-- .content --&gt;
  &lt;/div&gt;&lt;!-- .main-layout --&gt;
&lt;/div&gt;&lt;!-- .pageContainer --&gt;

&lt;script src="webviewBridge.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
  </div>

  <div class="tip-box">
    <strong>💡 使用说明：</strong><br/>
    1. 复制此模板到新 <code>.html</code> 文件，同目录放置 <code>webviewBridge.js</code> 即可运行<br/>
    2. 修改 <code>id</code> 和 <code>data-name</code> 为实际业务名称，删除不需要的控件<br/>
    3. <strong>DataGrid 必须使用 <code>div+flex</code> 布局</strong>（非 <code>&lt;table&gt;</code> 标签），严格遵循第 3.2 节的类名结构<br/>
    4. <strong>侧边栏、内容区、主布局均为布局容器，<span style="color:#c62828;">不需要</span> <code>data-drag-type</code></strong>，保持窗口拖拽能力<br/>
    5. <strong>导航菜单项 <code>.nav-item</code> 和表格内操作按钮均为自定义元素，<span style="color:#c62828;">必须显式设置</span> <code>data-ctrl-type</code></strong>
  </div>
</div>


<!-- ==================== 6. 图标占位符处理 ==================== -->
<div class="dev-step">
  <h3><span class="step-num">6</span> 图标占位符处理（IconManager）</h3>
  <p>桥接脚本内置了 <strong>图标管理器（IconManager）</strong>，支持将 <code>[OK]</code>、<code>{ERROR}</code> 等占位符自动转换为对应的 Emoji 图标。</p>
  <ul>
    <li><strong>解析（页面显示）</strong>：<code>IconManager.parse(text)</code> 将占位符转为图标，通常无需手动调用，脚本会自动处理。</li>
    <li><strong>转义（上报数据）</strong>：<code>IconManager.toText(html)</code> 将图标转为占位符或 <code>[U+XXXX]</code>，所有事件上报和 API 返回值均会自动执行此操作。</li>
  </ul>
  <div class="tip-box">
    <strong>💡 开发建议：</strong>在控件文本中直接使用占位符，如 <code>&lt;button&gt;[OK] 确定&lt;/button&gt;</code>，即可显示为“✅ 确定”。无需额外处理，桥接脚本会自动完成双向转换。
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

<!-- ==================== 7+. Win11 风格毛玻璃与主题兼容指南 ==================== -->
<div class="dev-step">
  <h3><span class="step-num">T</span> Win11 风格毛玻璃与主题兼容指南（建议版）</h3>

  <div class="info-box">
    <strong>🔍 背景：</strong>WebView2 宿主窗口可设置 Win11 毛玻璃背景（Mica / Acrylic / 高透）。当宿主需要开发这类特效，页面背景将变为半透明，控件底色也需要配合使用 <code>rgba()</code> 半透明才能实现"穿透"效果，同时控件文字颜色需要可动态切换（浅色/深色模式）。本节说明如何让 HTML 页面兼容这些效果。
  </div>

  <h4>规则 1：可继承样式不要写死在子元素上</h4>
  <p>CSS 可继承属性（<code>color</code>、<code>font-size</code>、<code>font-family</code> 等）应从父容器自然继承，不要在子元素选择器中写死固定值。写了会阻断继承链。</p>
  <div class="warn-box">
    <strong>❌ 阻断继承的写法：</strong>
    <pre><code>.tabsContainer_headerBar_btn { color: #333; font-size: 13px; }</code></pre>
    <strong>✅ 允许继承的写法：</strong>
    <pre><code>.tabsContainer_headerBar_btn { color: inherit; font-size: inherit; font-family: inherit; }</code></pre>
  </div>

  <h4>规则 2：<code>&lt;button&gt;</code> 和表单元素必须显式 inherit</h4>
  <p><code>&lt;button&gt;</code>、<code>&lt;input&gt;</code>、<code>&lt;select&gt;</code> 等原生元素被浏览器 UA 样式表预置了 <code>color: buttontext</code> 等属性。<strong>浏览器 UA 的直接声明会阻断 CSS 继承</strong>，所以必须显式设置 <code>color: inherit</code> 和 <code>font-size: inherit</code> 覆盖 UA 样式：</p>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">CSS</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code class="language-css">/* 所有作为子元素的 &lt;button&gt; 必须覆盖 UA 样式 */
.tabsContainer_headerBar_btn,
.cardBox_collapse_btn {
  color: inherit;
  font-size: inherit;
  font-family: inherit;
  border: none;
  background: none;
  cursor: pointer;
}
/* 必须追加！保护 Font Awesome 图标不受 font-family:inherit 影响 */
.pageContainer i[class*="fa-"] {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900;
}</code></pre>
  </div>
  <div class="warn-box">
    <strong>⚠️ 重要：</strong><code>font-family: inherit</code> 会导致 <code>&lt;i class="fas fa-moon"&gt;</code> 等 Font Awesome 图标消失。必须追加图标保护规则。
  </div>

  <h4>规则 3：背景色默认用 hex，需要毛玻璃时用 rgba</h4>
  <p>默认情况下控件背景色用不透明的 hex 色值（如 <code>#ffffff</code>、<code>#0078d4</code>）。如果页面需要支持毛玻璃穿透效果，将背景色改为对应 alpha 通道的 rgba：</p>
  <table>
    <thead><tr><th>控件</th><th>不透明值</th><th>半透明值（毛玻璃用）</th></tr></thead>
    <tbody>
      <tr><td>按钮 / 图标按钮</td><td><code>#0078d4</code></td><td><code>rgba(0, 120, 212, 0.8)</code></td></tr>
      <tr><td>输入框 / 下拉框</td><td><code>#ffffff</code></td><td><code>rgba(255, 255, 255, 0.2)</code></td></tr>
      <tr><td>标签页 / 列表 / 树形 / 表格</td><td><code>#ffffff</code></td><td><code>rgba(255, 255, 255, 0.15)</code></td></tr>
      <tr><td>卡片框</td><td><code>#ffffff</code></td><td><code>rgba(255, 255, 255, 0.25)</code></td></tr>
      <tr><td>右键菜单 / 气泡框</td><td><code>#ffffff</code></td><td><code>rgba(255, 255, 255, 0.9)</code></td></tr>
      <tr><td>弹窗（信息框 / 输入框）</td><td><code>#ffffff</code></td><td><code>rgba(255, 255, 255, 0.85)</code></td></tr>
    </tbody>
  </table>
  <div class="tip-box">
    <strong>💡 推荐做法：</strong>使用 CSS 变量定义背景色，让宿主动态注入。例如用 <code>background-color: var(--canvas-bg-color, #ffffff)</code>，宿主可通过 <code>--canvas-bg-color</code> 覆盖。常用 CSS 变量：<code>--canvas-bg-color</code>、<code>--text-color</code>、<code>--accent-color</code>。
  </div>

  <h4>规则 4：毛玻璃效果需要 backdrop-filter</h4>
  <p>要让背景图透过控件显示出来，页面容器需要设置 <code>backdrop-filter: blur()</code>：</p>
  <div class="code-block">
    <div class="code-block-header">
      <span class="lang-label">CSS</span>
      <button class="copy-btn" onclick="copyCodeFromBlock(this)">复制</button>
    </div>
    <pre><code class="language-css">.pageContainer {
  background-color: var(--canvas-bg-color, rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}</code></pre>
  </div>

  <h4>规则 5：浅色/深色模式文字色适配</h4>
  <p>文字颜色从父容器继承即可，不要在子元素中写死。父容器使用 <code>color: var(--text-color, #1e1e1e)</code>，宿主可通过 CSS 变量切换浅色/深色文字。避免在子元素中写 <code>color: #333</code> 等固定值。</p>

  <div class="checklist">
    <span class="check-item">button/input/select 子元素 CSS 有 color:inherit</span>
    <span class="check-item">font-size 不写在子元素选择器中</span>
    <span class="check-item">默认用 hex 背景色，需要毛玻璃时改用 rgba</span>
    <span class="check-item">页面容器设置了 backdrop-filter</span>
    <span class="check-item">文字色从父容器继承，不用固定 hex</span>
  </div>
</div>

<!-- ==================== 8. AI 提示词模板（基于最新文档规范） ==================== -->
<div class="dev-step">
  <h3><span class="step-num">8</span> AI 提示词模板</h3>
  <p>将以下提示词发给 AI（ChatGPT、Claude、DeepSeek 等），即可生成符合本文档全部规范的完整页面。</p>

  <h4>通用万能提示词</h4>
  <div class="prompt-box" id="prompt-a">
你是 webviewBridge.js 前端开发专家，请生成一个可在 WebView2 中运行的完整 HTML 页面。

【身份定位】
你精通 webviewBridge.js 桥接机制，擅长用最标准的 HTML 结构实现与宿主程序的完整交互。

【核心规则 — 必须100%严格遵守】

一、页面骨架
1. 在 &lt;body&gt; 末尾引入 &lt;script src="webviewBridge.js"&gt;&lt;/script&gt;（脚本已存在，只需引入）
2. 页面容器：
   &lt;div class="pageContainer" id="pageContainer"
        data-ctrl-type="pageContainer" data-name="canvas"
        data-original-width="1065" data-original-height="695"
        style="position:relative;width:100%;height:100%;padding-top:40px;display:flex;flex-direction:column;overflow:hidden;app-region:drag;-webkit-app-region:drag;"&gt;
   注意：如标题栏使用绝对定位，padding-top 建议 ≥ 标题栏高度（默认40px），防止内容被遮挡。

二、标题栏（与页面容器同级，放在容器内最顶部）
&lt;div class="titlebar" id="titlebar" data-name="标题栏"
     style="position:absolute;top:0;left:0;right:0;height:40px;background:#F8F8F8;border-bottom:1px solid rgba(0,0,0,0.08);app-region:drag;-webkit-app-region:drag;display:flex;align-items:center;"&gt;
  &lt;div class="titlebar_left"&gt;
    &lt;span class="titlebar_left_icon" id="titlebar_left_icon"
          data-ctrl-type="titlebar_left_icon" data-drag-type="titlebar_left_icon" data-name="图标" style="color:#333;"&gt;
      &lt;i class="fas fa-star"&gt;&lt;/i&gt;
    &lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="titlebar_center"&gt;
    &lt;span class="titlebar_center_title" id="titlebar_title"
          data-ctrl-type="titlebar_title" data-drag-type="titlebar_title" data-name="标题" style="color:#333;font-weight:600;"&gt;应用标题&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="titlebar_right"&gt;
    &lt;button id="titlebar_min" data-ctrl-type="titlebar_min"
            class="titlebar_rightBtn" title="最小化"&gt;
      &lt;svg width="12" height="1" viewBox="0 0 10 1"&gt;&lt;rect width="10" height="1" fill="currentColor"/&gt;&lt;/svg&gt;
    &lt;/button&gt;
    &lt;button id="titlebar_max" data-ctrl-type="titlebar_max"
            class="titlebar_rightBtn" title="最大化"&gt;
      &lt;span style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;"&gt;
        &lt;svg width="12" height="12" viewBox="0 0 10 10" shape-rendering="crispEdges"&gt;
          &lt;rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1"/&gt;
        &lt;/svg&gt;
      &lt;/span&gt;
    &lt;/button&gt;
    &lt;button id="titlebar_close" data-ctrl-type="titlebar_close"
            class="titlebar_rightBtn titlebar_rightBtn_close" title="关闭"&gt;
      &lt;svg width="12" height="12" viewBox="0 0 10 10"&gt;
        &lt;line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1"/&gt;
        &lt;line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1"/&gt;
      &lt;/svg&gt;
    &lt;/button&gt;
  &lt;/div&gt;
&lt;/div&gt;
关键：最大化按钮内部的 &lt;span&gt; 必须设置 app-region:drag（支持 Windows 11 Snap Layout），固定宽高18px。

三、基础控件属性规则
每个控件缺一不可的属性：
  id（唯一标识，英文小写+下划线，如 btn_submit）<strong>—— 必填</strong>
  data-ctrl-type（控件交互类型，见下表）<strong>—— 必填</strong>
  data-drag-type（防拖拽标记）—— 【仅可交互控件需要】，纯布局容器（侧边栏、内容区）不需要
  data-type（控件小写类型名，如 "button"、"input"，与 id 配对，推荐）
  data-name（中文名称，推荐）

控件类型速查：
  按钮: button       输入框: inputText     密码框: inputText（type="password"）
  文本域: textarea    复选框: checkbox       开关: switchToggle（必须用此值！）
  单选框: radio       下拉框: comboBox       超链接: hyperLink
  标签: label         图片框: imageBox       进度条(原生range): progressBar
  日期: datetimePicker  分割线: divider      图标按钮: iconButton
  列表: listBox        表格: dataGrid        树形: treeView
  标签页: tabsContainer  卡片: cardBox       日志: logOutput
  单选框组: radioGroup  进度条(高级): progressBar
  右键菜单: contextMenu  气泡框: tooltip
  信息框: messageBox    输入弹窗: inputBox

⚠️ 开关必须使用 data-ctrl-type="switchToggle"，不能用 checkbox，否则脚本无法区分。
⚠️ 自定义元素（如 &lt;div class="nav-item"&gt; 导航菜单项）必须显式添加 data-ctrl-type="button" 和 data-drag-type="button"，否则事件会被父容器捕获。

四、复杂控件 — 必须包含完整子结构 + 初始化数据属性

▸ 列表框（ListBox）：
  &lt;div id="list_1" class="listBox" data-ctrl-type="listBox" data-drag-type="listBox" data-name="列表"
       data-listBox-items='[{"id":"1","text":"项1","selected":false},{"id":"2","text":"项2","selected":false}]'
       data-editable="false" data-always-show-selection="false" style="width:200px;height:200px;"&gt;
    &lt;div class="listBox_scroll"&gt;
      &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="0"&gt;
        &lt;span class="listBox_item_text"&gt;项1&lt;/span&gt;
      &lt;/div&gt;
      &lt;div class="listBox_item" data-ctrl-type="listBox_item" data-item-index="1"&gt;
        &lt;span class="listBox_item_text"&gt;项2&lt;/span&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  JSON 使用单引号包裹，内部属性用双引号。

▸ 多项表格（DataGrid）：
  &lt;div id="grid_1" class="dataGrid_container" data-ctrl-type="dataGrid" data-drag-type="dataGrid" data-name="表格"
       data-columns='[{"field":"col1","header":"列A"},{"field":"col2","header":"列B"}]'
       data-rows='[{"id":"row1","cells":{"col1":"值A","col2":"值B"}}]'
       data-show-checkbox="true" data-editable="false" data-always-show-selection="false"
       style="width:500px;height:300px;"&gt;
    &lt;div class="dataGrid_header"&gt;
      &lt;div class="dataGrid_header_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
        &lt;input type="checkbox" class="dataGrid_select_all"&gt;
      &lt;/div&gt;
      &lt;div class="dataGrid_header_cell" data-ctrl-type="dataGrid_cell" data-col-key="col1" data-col-name="列A" style="width:100px;min-width:100px;flex-shrink:0"&gt;列A&lt;/div&gt;
      &lt;div class="dataGrid_header_cell" data-ctrl-type="dataGrid_cell" data-col-key="col2" data-col-name="列B" style="width:100px;min-width:100px;flex-shrink:0"&gt;列B&lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="dataGrid_body"&gt;
      &lt;div class="dataGrid_row" data-row-index="0" data-row-id="row1"&gt;
        &lt;div class="dataGrid_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"&gt;
          &lt;input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox"&gt;
        &lt;/div&gt;
        &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="col1" data-col-name="列A" style="width:100px;min-width:100px;flex-shrink:0" title="值A"&gt;值A&lt;/div&gt;
        &lt;div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="col2" data-col-name="列B" style="width:100px;min-width:100px;flex-shrink:0" title="值B"&gt;值B&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  头部和数据单元格都必须设置 data-ctrl-type="dataGrid_cell"。表格使用 div+flex 布局，不是 &lt;table&gt; 标签。

▸ 树形框（TreeView）：
  &lt;div id="tree_1" class="treeView" data-ctrl-type="treeView" data-drag-type="treeView" data-name="树形"
       data-tree-id="tree_1" data-editable="false" data-show-icon="true" data-always-show-selection="true"
       style="width:220px;height:320px;"&gt;
    &lt;div class="treeView_node" data-node-id="node_1" data-level="0"&gt;
      &lt;div class="treeView_node_content"&gt;
        &lt;span class="treeView_toggle expanded" data-ctrl-type="treeview_node_toggle"&gt;▶&lt;/span&gt;
        &lt;span class="treeView_icon folder"&gt;📁&lt;/span&gt;
        &lt;span class="treeView_label" data-ctrl-type="treeview_node_text"&gt;根节点&lt;/span&gt;
        &lt;span class="tree-edit-input" style="display:none"&gt;&lt;/span&gt;
      &lt;/div&gt;
      &lt;div class="treeView_children"&gt;
        &lt;div class="treeView_node" data-node-id="node_2" data-level="1"&gt;
          &lt;div class="treeView_node_content"&gt;
            &lt;span class="treeView_toggle empty" data-ctrl-type="treeview_node_toggle"&gt;▶&lt;/span&gt;
            &lt;span class="treeView_icon file"&gt;📄&lt;/span&gt;
            &lt;span class="treeView_label" data-ctrl-type="treeview_node_text"&gt;子节点&lt;/span&gt;
            &lt;span class="tree-edit-input" style="display:none"&gt;&lt;/span&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  三角状态：expanded=已展开、collapsed=有子节点已折叠、empty=叶子节点无子节点。
  每个节点都必须包含 .tree-edit-input（初始 display:none）。

▸ 标签页（TabContainer）：
  &lt;div id="tabs_1" class="tabsContainer" data-ctrl-type="tabsContainer" data-drag-type="tabsContainer" data-name="标签页"
       style="width:300px;height:200px;"&gt;
    &lt;div class="tabsContainer_headerBar"&gt;
      &lt;button class="tabsContainer_headerBar_btn active" data-ctrl-type="tabsContainer_headerBar_btn" data-tab-name="tab1"&gt;标签1&lt;/button&gt;
      &lt;button class="tabsContainer_headerBar_btn" data-ctrl-type="tabsContainer_headerBar_btn" data-tab-name="tab2"&gt;标签2&lt;/button&gt;
    &lt;/div&gt;
    &lt;div class="tabsContainer_contentWrapper"&gt;
      &lt;div class="tabsContainer_contentWrapper_panel active" data-tab-name="tab1" data-parent="tabs_1" data-tab="0"&gt;内容1&lt;/div&gt;
      &lt;div class="tabsContainer_contentWrapper_panel" data-tab-name="tab2" data-parent="tabs_1" data-tab="1"&gt;内容2&lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  面板需设置 data-parent（指向容器ID）和 data-tab（索引）。

▸ 卡片框（CardBox）：
  &lt;div id="card_1" class="cardBox" data-ctrl-type="cardBox" data-drag-type="cardBox" data-name="卡片"
       data-collapsible="true" data-collapsed="false" style="width:260px;height:180px;"&gt;
    &lt;div class="cardBox_header"&gt;
      &lt;span class="cardBox_header_title"&gt;卡片标题&lt;/span&gt;
      &lt;span class="cardBox_collapse_btn"&gt;
        &lt;svg width="12" height="12" viewBox="0 0 12 12"&gt;
          &lt;path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/&gt;
        &lt;/svg&gt;
      &lt;/span&gt;
    &lt;/div&gt;
    &lt;div class="cardBox_body" data-ctrl-type="cardBox_body"&gt;卡片内容&lt;/div&gt;
  &lt;/div&gt;

▸ 日志框（LogOutput）：
  &lt;div id="log_1" class="logOutput_container" data-ctrl-type="logOutput" data-drag-type="logOutput" data-name="日志"
       style="width:300px;height:150px;"&gt;
    &lt;div class="logOutput_line" data-ctrl-type="logOutput_item" style="color:#333"&gt;日志已就绪&lt;/div&gt;
  &lt;/div&gt;

▸ 单选框组（RadioGroup）：
  &lt;div id="rg_1" class="radioGroup_container" data-ctrl-type="radioGroup" data-drag-type="radioGroup" data-name="单选框组"
       style="width:120px;height:60px;"&gt;
    &lt;label class="radioGroup_item"&gt;
      &lt;input type="radio" data-ctrl-type="radio" name="rg_1" value="选项1" checked /&gt;选项1
    &lt;/label&gt;
    &lt;label class="radioGroup_item"&gt;
      &lt;input type="radio" data-ctrl-type="radio" name="rg_1" value="选项2" /&gt;选项2
    &lt;/label&gt;
  &lt;/div&gt;

▸ 进度条（高级样式，非原生 range）：
  &lt;div id="prg_1" class="progressBar_container" data-ctrl-type="progressBar" data-drag-type="progressBar" data-name="进度条"
       data-editable="true" style="width:250px;height:10px;overflow:visible;"&gt;
    &lt;div class="progressBar_track"&gt;&lt;/div&gt;
    &lt;div class="progressBar_fill" style="width:60%;height:100%;background:#0078D4;border-radius:inherit;transition:width 0.15s;"&gt;&lt;/div&gt;
    &lt;span class="progressBar_text" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:inherit;pointer-events:none;white-space:nowrap;"&gt;60%&lt;/span&gt;
  &lt;/div&gt;

▸ 右键菜单（ContextMenu）：
  &lt;div id="ctx_1" data-type="contextMenu" data-ctrl-type="contextMenu" data-drag-type="contextMenu" data-ctrl-id="ctx_1" data-name="右键菜单"
       data-contextMenu-items='[{"id":"1","text":"复制","type":"normal"},{"id":"2","text":"粘贴","type":"normal"},{"id":"3","text":"-","type":"separator"},{"id":"4","text":"删除","type":"danger"}]'
       data-contextMenu-target="target_id"
       style="width:120px;height:60px;border:2px dashed #E58080;background:#FFEEE9;"&gt;
    &lt;div style="padding:4px;font-size:12px;color:#999;"&gt;⚠ 右键菜单（设计态占位，运行时不显示）&lt;/div&gt;
  &lt;/div&gt;

▸ 气泡框（Tooltip）：
  &lt;div id="tt_1" data-type="tooltip" data-ctrl-type="tooltip" data-drag-type="tooltip" data-ctrl-id="tt_1" data-name="气泡框"
       data-tooltip-content="提示文字" data-tooltip-target="target_id" data-tooltip-trigger="hover" data-tooltip-position="top"
       style="width:120px;height:60px;border:2px dashed #809EE5;background:#E9F9FF;"&gt;
    &lt;div style="padding:4px;font-size:12px;color:#999;"&gt;💬 气泡框（设计态占位）&lt;/div&gt;
  &lt;/div&gt;

▸ 信息框（MessageBox）：
  &lt;div id="mb_1" data-type="messageBox" data-ctrl-type="messageBox" data-ctrl-id="mb_1" data-name="信息框"
       style="width:360px;height:180px;border:2px dashed #809EE5;background:#FFEEE9;"&gt;
    &lt;div class="mb-header"&gt;&lt;span class="mb-header-title"&gt;提示&lt;/span&gt;&lt;span class="mb-header-close" data-ctrl-type="messageBox_close"&gt;✕&lt;/span&gt;&lt;/div&gt;
    &lt;div class="mb-body"&gt;
      &lt;span class="mb-message"&gt;确认操作？&lt;/span&gt;
      &lt;button class="mb-btn" data-ctrl-type="messageBox_no"&gt;取消&lt;/button&gt;
      &lt;button class="mb-btn mb-btn-primary" data-ctrl-type="messageBox_yes"&gt;确定&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;

▸ 输入框（InputBox）：
  &lt;div id="ib_1" data-type="inputBox" data-ctrl-type="inputBox" data-ctrl-id="ib_1" data-name="输入框"
       style="width:360px;height:180px;border:2px dashed #809EE5;background:#E9F9FF;"&gt;
    &lt;div class="ib-header"&gt;&lt;span class="ib-header-title"&gt;请输入&lt;/span&gt;&lt;span class="ib-header-close" data-ctrl-type="inputBox_close"&gt;✕&lt;/span&gt;&lt;/div&gt;
    &lt;div class="ib-body"&gt;
      &lt;input class="ib-input" data-ctrl-type="inputBox_text" placeholder="请输入..." /&gt;
      &lt;button class="ib-btn" data-ctrl-type="inputBox_no"&gt;取消&lt;/button&gt;
      &lt;button class="ib-btn ib-btn-primary" data-ctrl-type="inputBox_yes"&gt;确定&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;

五、CSS 必须包含的规则
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:100%; height:100%; overflow:hidden; }
  [data-drag-type] { app-region: no-drag; -webkit-app-region: no-drag; }
  .pageContainer [data-ctrl-type^="titlebar_"] { app-region: no-drag; -webkit-app-region: no-drag; }
  .pageContainer [data-ctrl-type="titlebar_max"] span { app-region: drag; -webkit-app-region: drag; }
  .titlebar_rightBtn { width:35px; height:32px; border:none; background:transparent; cursor:default; border-radius:4px; display:flex; align-items:center; justify-content:center; }
  .titlebar_rightBtn:hover { background:rgba(0,0,0,0.06); }
  .titlebar_rightBtn_close:hover { background:#e81123; color:#fff; }
  .titlebar_left { display:flex; align-items:center; padding-left:12px; }
  .titlebar_center { flex:1; display:flex; justify-content:center; }
  .titlebar_right { display:flex; align-items:center; padding-right:4px; }
  /* 按钮子元素必须显式 inherit 覆盖浏览器 UA 样式（button{color:buttontext}） */
  .tabsContainer_headerBar_btn, .cardBox_collapse_btn { color: inherit; font-size: inherit; font-family: inherit; border: none; background: none; cursor: pointer; }
  /* 保护 Font Awesome 图标字体不被 inherit 覆盖 */
  .pageContainer i[class*="fa-"] { font-family: "Font Awesome 6 Free" !important; font-weight: 900; }
  /* 毛玻璃效果 */
  .pageContainer { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }

六、拖拽规则（重要！）
  ✅ 可交互控件（按钮、输入框、下拉框、复选框、菜单项、列表项等）→ 必须设置 data-drag-type
  ❌ 纯布局容器（侧边栏、内容区、卡片面板、主布局等）→ 不设置 data-drag-type
  记忆：能点能输入就需要，纯放东西不需要。

七、Win11 毛玻璃与主题兼容规则（建议版）
  ✅ 所有 &lt;button&gt; 子元素 CSS 必须 color: inherit; font-size: inherit; font-family: inherit（覆盖浏览器 UA 的 button { color:buttontext }）
  ✅ 默认使用不透明 hex 背景色，需毛玻璃穿透时改用 rgba 半透明
  ✅ 页面容器设置 backdrop-filter:blur() 并预留 --canvas-bg-color 等 CSS 变量给宿主注入
  ✅ 文字色从父容器继承，不在子元素中写死 color
  ❌ 不在子元素选择器中写死 color / fontSize（阻断继承链）

八、其他
  - 所有控件交互事件会自动上报给宿主，无需手动写事件监听
  - 如使用 Font Awesome 图标，引入 &lt;link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" /&gt;

【输出要求】
- 完整可运行的 HTML 文件（包含 &lt;!DOCTYPE html&gt; 到 &lt;/html&gt;）
- 样式使用内联 &lt;style&gt; 标签，界面美观现代
- 所有文字使用中文
- 代码结构清晰，缩进规范
- 所有控件属性完整，不可省略

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
    <span class="check-item">每个控件有唯一 id（必填）</span>
    <span class="check-item">所有控件设置了 data-ctrl-type</span>
    <span class="check-item">可交互控件设置了 data-drag-type</span>
    <span class="check-item">布局容器【没有】设置 data-drag-type（保持拖拽能力）</span>
    <span class="check-item">&lt;button&gt; 子元素 CSS 有 color:inherit; font-size:inherit</span>
    <span class="check-item">背景色默认用 hex，需要毛玻璃时改用 rgba</span>
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