/**
 * UI Runtime v1.0.0
 * 通用控件交互运行时 — 事件委托、WebView2 桥接、值同步、标签页切换
 *
 * 依赖标准 DOM 属性（与具体控件类型无关）：
 *   id                - 控件唯一标识（同时也是 HTML id 属性）
 *   data-type         - 控件类型 (button/input/checkbox/toggle/comboBox/label/hyperlink/textarea/radioGroup/tabsContainer)
 *   data-name         - 控件名称
 *   data-parent       - 父容器ID（可选）
 *   data-tab          - 所属标签页索引（可选）
 *   data-tab-name     - 标签页名称（可选，用于 tabsContainer 的标签按钮）
 *
 * 用法：
 *   1. 在 HTML 中通过 <script src="ui-runtime.js"></script> 引入
 *   2. 脚本自动初始化，无需手动调用
 *   3. 通过 window.UI.Runtime 可访问公共 API
 *
 * @version 1.0.0
 * @license MIT
 */
(function(global) {
  'use strict';

  // ================================================================
  // 防止重复初始化
  // ================================================================
  if (global.__UI_RUNTIME_INITIALIZED__) return;
  global.__UI_RUNTIME_INITIALIZED__ = true;

  // ================================================================
  // 消息发送缓冲区（批量发送，减少 WebView2 postMessage 调用）
  // ================================================================
  var sendBuffer = [];
  var sendTimer = null;
  var SEND_INTERVAL = 50; // ms

  /**
   * 执行实际的消息发送
   * @param {string} action - 操作类型 (click/change/focus/input/tabChange)
   * @param {string} tagName - HTML 标签名
   * @param {string} type - 控件类型
   * @param {string} id - 控件 ID
   * @param {string} idname - 控件名称
   * @param {Object} data - 附加数据
   */
  function doSend(action, tagName, type, id, idname, data) {
    // 清理空值
    if (data && data.value === undefined) delete data.value;
    if (data && typeof data.value === 'string' && (data.value === '' || data.value.indexOf('\n') !== -1)) {
      delete data.value;
    }

    var msg = {
      title: document.title,
      action: action,
      tagName: (tagName || '').toLowerCase(),
      type: type,
      id: id,
      idname: idname || '',
      data: data || {},
      timestamp: Date.now()
    };

    // 提升 parentId 和 tabIndex 到消息顶层
    if (data && data.parentId) { msg.parentId = data.parentId; delete data.parentId; }
    if (data && data.tabIndex !== undefined) { msg.tabIndex = data.tabIndex; delete data.tabIndex; }

    if (Object.keys(msg.data).length === 0) delete msg.data;
    if (!msg.idname) delete msg.idname;

    // WebView2 环境
    if (global.chrome && global.chrome.webview) {
      global.chrome.webview.postMessage(JSON.stringify(msg));
    }
  }

  /** 刷新发送缓冲区 */
  function flushSend() {
    var pending = sendBuffer.splice(0);
    for (var i = 0; i < pending.length; i++) {
      var item = pending[i];
      doSend(item.action, item.tagName, item.type, item.id, item.idname, item.data);
    }
  }

  /**
   * 将消息加入发送缓冲区（防抖批量发送）
   * @returns {boolean}
   */
  function send(action, tagName, type, id, idname, data) {
    sendBuffer.push({
      action: action,
      tagName: tagName,
      type: type,
      id: id,
      idname: idname,
      data: data || {}
    });
    if (!sendTimer) {
      sendTimer = setTimeout(function() {
        sendTimer = null;
        flushSend();
      }, SEND_INTERVAL);
    }
    return true;
  }

  // ================================================================
  // DOM 工具函数
  // ================================================================

  /**
   * 从元素上提取 data 属性
   * @param {Element} el
   * @returns {{ id: string, type: string, idname: string, parentId: string, tabIndex: number|undefined }}
   */
  function getDataAttrs(el) {
    var id = el.id || el.getAttribute('id') || '';
    var type = el.getAttribute('data-type') || '';
    var name = el.getAttribute('data-name') || '';
    var parentId = el.getAttribute('data-parent') || '';
    var tabIndex = el.getAttribute('data-tab');
    return {
      id: id,
      type: type,
      idname: name,
      parentId: parentId,
      tabIndex: tabIndex !== null ? parseInt(tabIndex, 10) : undefined
    };
  }

  /**
   * 获取控件的当前值（适配不同类型）
   * @param {Element} el
   * @returns {string|boolean|undefined}
   */
  function getElementValue(el) {
    var tag = el.tagName.toLowerCase();
    if (tag === 'input') {
      var itype = (el.type || 'text').toLowerCase();
      if (itype === 'checkbox') return el.checked;
      return el.value;
    }
    if (tag === 'textarea') return el.value;
    if (tag === 'select') return el.value;
    return undefined;
  }

  // ================================================================
  // 事件委托（全局监听，基于 data-type 属性匹配）
  // ================================================================

  /**
   * click 事件委托
   * - 处理标签页按钮切换（.tab-header-btn）
   * - 处理普通控件点击
   */
  document.addEventListener('click', function(e) {
    // 优先处理标签页按钮
    var tabBtn = e.target.closest('.tab-header-btn');
    if (tabBtn) {
      var container = tabBtn.closest('.tabs-container');
      if (!container) return;

      // 禁用状态下不处理标签切换
       if (container.getAttribute('data-disabled') === 'true') return;

      var tabName = tabBtn.getAttribute('data-tab-name');

      // 切换标签头 active 状态
      var allBtns = container.querySelectorAll('.tab-header-btn');
      for (var b = 0; b < allBtns.length; b++) {
        allBtns[b].classList.remove('active');
      }
      tabBtn.classList.add('active');

      // 切换内容面板 active 状态
      var allPanes = container.querySelectorAll('.tab-pane');
      for (var p = 0; p < allPanes.length; p++) {
        allPanes[p].classList.remove('active');
      }
      var activePane = container.querySelector('.tab-pane[data-tab-name="' + tabName + '"]');
      if (activePane) activePane.classList.add('active');

      // 发送标签切换事件
      var attrs = getDataAttrs(container);
      var paneEl = container.querySelector('.tab-pane[data-tab-name="' + tabName + '"]');
      var tabIndex = paneEl ? paneEl.getAttribute('data-tab') : undefined;
      var data = { tabName: tabName };
      if (tabIndex !== null && tabIndex !== undefined) data.tabIndex = parseInt(tabIndex, 10);
      send('tabChange', 'DIV', attrs.type, attrs.id, attrs.idname, data);
      return;
    }

    // 普通控件点击
    var el = e.target.closest('[data-type]');
    if (!el) return;

    var attrs = getDataAttrs(el);
    var data = {};
    if (attrs.parentId) data.parentId = attrs.parentId;
    if (attrs.tabIndex !== undefined) data.tabIndex = attrs.tabIndex;
    var val = getElementValue(el);
    if (val !== undefined) data.value = val;
    send('click', el.tagName, attrs.type, attrs.id, attrs.idname, data);
  });

  /**
   * change 事件委托 - 处理表单控件值变更
   */
  document.addEventListener('change', function(e) {
    var el = e.target.closest('[data-type]');
    if (!el) return;

    var attrs = getDataAttrs(el);
    var data = {};
    if (attrs.parentId) data.parentId = attrs.parentId;
    if (attrs.tabIndex !== undefined) data.tabIndex = attrs.tabIndex;
    var val = getElementValue(el);
    if (val !== undefined) data.value = val;
    send('change', el.tagName, attrs.type, attrs.id, attrs.idname, data);
  });

  /**
   * focus 事件委托（捕获阶段）- 处理控件获得焦点
   */
  document.addEventListener('focus', function(e) {
    var el = e.target.closest('[data-type]');
    if (!el) return;

    var attrs = getDataAttrs(el);
    var data = {};
    if (attrs.parentId) data.parentId = attrs.parentId;
    if (attrs.tabIndex !== undefined) data.tabIndex = attrs.tabIndex;
    send('focus', el.tagName, attrs.type, attrs.id, attrs.idname, data);
  }, true);

  /**
   * input 事件委托 - 处理文本输入实时变化
   */
  document.addEventListener('input', function(e) {
    var el = e.target.closest('[data-type]');
    if (!el) return;

    var attrs = getDataAttrs(el);
    var data = {};
    if (attrs.parentId) data.parentId = attrs.parentId;
    if (attrs.tabIndex !== undefined) data.tabIndex = attrs.tabIndex;
    var val = getElementValue(el);
    if (val !== undefined) data.value = val;
    send('input', el.tagName, attrs.type, attrs.id, attrs.idname, data);
  });

  // ================================================================
  // WebView2 消息接收（从宿主应用接收指令）
  // ================================================================

  var receiveCallbacks = [];

  /**
   * 注册消息接收回调
   * @param {Function} callback
   */
  function receive(callback) {
    if (typeof callback === 'function') receiveCallbacks.push(callback);
  }

  /**
   * 分发接收到的消息
   * 支持的命令：
   *   setValue  - 设置控件值
   *   setChecked - 设置复选框/开关状态
   * @param {Object} data
   */
  function dispatchReceived(data) {
    var cmd = data.command || data.cmd || '';
    var targetId = data.targetId || data.id || '';

    // 处理 setValue 命令
    if (cmd === 'setValue' && targetId) {
      var el = document.getElementById(targetId);
      if (el) {
        var tag = el.tagName.toLowerCase();
        if (tag === 'input') {
          if (el.type === 'checkbox') el.checked = !!data.value;
          else el.value = data.value || '';
        } else if (tag === 'textarea') {
          el.value = data.value || '';
        } else if (tag === 'select') {
          el.value = data.value || '';
        }
        send('setValueAck', el.tagName, getDataAttrs(el).type, targetId, getDataAttrs(el).idname, { value: data.value });
      }
    }

    // 处理 setChecked 命令
    if (cmd === 'setChecked' && targetId) {
      var el2 = document.getElementById(targetId);
      if (el2) {
        var cbx = el2.querySelector('input[type="checkbox"]') || el2;
        if (cbx) cbx.checked = !!data.value;
        send('setCheckedAck', el2.tagName, getDataAttrs(el2).type, targetId, getDataAttrs(el2).idname, { value: data.value });
      }
    }

    // 通知所有注册的回调
    for (var i = 0; i < receiveCallbacks.length; i++) {
      receiveCallbacks[i](data);
    }
  }

  // 监听 WebView2 消息
  if (global.chrome && global.chrome.webview) {
    global.chrome.webview.addEventListener('message', function(e) {
      try {
        var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        dispatchReceived(data);
      } catch (err) {
        console.error('[UI.Runtime receive] parse error:', err);
      }
    });
  }

  // ================================================================
  // 公共 API（挂载到 window.UI.Runtime）
  // ================================================================

  global.UI = global.UI || {};
  global.UI.Runtime = {
    /** 版本号 */
    version: '1.0.0',

    /** 发送消息到宿主 */
    send: send,

    /** 注册消息接收回调 */
    on: receive,
    receive: receive,

    /** 获取控件值 */
    getElementValue: getElementValue,

    /** 获取控件 data 属性 */
    getDataAttrs: getDataAttrs,

    /** 刷新发送缓冲区 */
    flush: flushSend
  };

  // 兼容旧版 API：挂载到 window.webviewBridge
  global.webviewBridge = global.UI.Runtime;
})(window);