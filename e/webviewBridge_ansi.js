/**
 * webviewBridge.js — WebView2 运行时桥接脚本
 * 负责监控所有控件事件并与 WebView2 宿主通信
 * 独立于 UI 设计器，纯原生 JavaScript，不依赖任何第三方库
 */
(function() {
  'use strict';

  var isDebug = function() {
    return true;
    try { return localStorage.getItem('webviewBridgeDebug') == 'true'; } catch(e) { return false; }
  };

  var log = function() {
    if (isDebug()) {
      console.log.apply(console, arguments);
      console.log(JSON.stringify(arguments[1]));
    }
  };

  var warn = function() {
    if (isDebug()) console.warn.apply(console, arguments);
  };

  // ================================================================
  // IconManager — 图标占位符与 emoji 互转
  // ================================================================

  var IconManager = {
    iconMap: {
      'OK': '\u2705',
      'YES': '\u2705',
      'CHECK': '\u2705',
      'TRUE': '\u2705',
      'ERROR': '\u274C',
      'FAIL': '\u274C',
      'FALSE': '\u274C',
      'NO': '\u274C',
      'CROSS': '\u274C',
      'WARN': '\u26A0\uFE0F',
      'WARNING': '\u26A0\uFE0F',
      'INFO': '\u2139\uFE0F',
      'INFORMATION': '\u2139\uFE0F',
      'FOLDER': '\uD83D\uDCC1',
      'DIRECTORY': '\uD83D\uDCC1',
      'FILE': '\uD83D\uDCC4',
      'DOC': '\uD83D\uDCC4',
      'IMG': '\uD83D\uDDBC\uFE0F',
      'IMAGE': '\uD83D\uDDBC\uFE0F',
      'PICTURE': '\uD83D\uDDBC\uFE0F',
      'DOCUMENT': '\uD83D\uDCDD',
      'DOCS': '\uD83D\uDCDD',
      'DOWNLOAD': '\u2B07\uFE0F',
      'DOWN': '\u2B07\uFE0F',
      'UPLOAD': '\u2B06\uFE0F',
      'UP': '\u2B06\uFE0F',
      'EDIT': '\u270F\uFE0F',
      'EDITING': '\u270F\uFE0F',
      'DELETE': '\uD83D\uDDD1\uFE0F',
      'REMOVE': '\uD83D\uDDD1\uFE0F',
      'TRASH': '\uD83D\uDDD1\uFE0F',
      'ADD': '\u2795',
      'NEW': '\u2795',
      'PLUS': '\u2795',
      'SEARCH': '\uD83D\uDD0D',
      'FIND': '\uD83D\uDD0D',
      'SETTINGS': '\u2699\uFE0F',
      'CONFIG': '\u2699\uFE0F',
      'GEAR': '\u2699\uFE0F',
      'USER': '\uD83D\uDC64',
      'USERS': '\uD83D\uDC65',
      'PERSON': '\uD83D\uDC64',
      'CLOCK': '\uD83D\uDD50',
      'TIME': '\uD83D\uDD50',
      'TIMER': '\uD83D\uDD50',
      'CALENDAR': '\uD83D\uDCC5',
      'DATE': '\uD83D\uDCC5',
      'LINK': '\uD83D\uDD17',
      'URL': '\uD83D\uDD17',
      'EMAIL': '\uD83D\uDCE7',
      'MAIL': '\uD83D\uDCE7',
      'PHONE': '\uD83D\uDCDE',
      'CALL': '\uD83D\uDCDE',
      'STAR': '\u2B50',
      'FAVORITE': '\u2B50',
      'FAV': '\u2B50',
      'LOCK': '\uD83D\uDD12',
      'SECURE': '\uD83D\uDD12',
      'UNLOCK': '\uD83D\uDD13',
      'HIDDEN': '\uD83D\uDC41\uFE0F',
      'EYE': '\uD83D\uDC41\uFE0F',
      'VISIBLE': '\uD83D\uDC41\u200D\uD83D\uDDE8\uFE0F',
      'QUESTION': '\u2753',
      'HELP': '\u2753',
      'HOME': '\uD83C\uDFE0',
      'HOUSE': '\uD83C\uDFE0',
      'BACK': '\uD83D\uDD19',
      'RETURN': '\uD83D\uDD19',
      'FORWARD': '\uD83D\uDD1C',
      'NEXT': '\u27A1\uFE0F',
      'PREV': '\u2B05\uFE0F',
      'PREVIOUS': '\u2B05\uFE0F',
      'FIRST': '\u23EE\uFE0F',
      'LAST': '\u23ED\uFE0F',
      'PLAY': '\u25B6\uFE0F',
      'PAUSE': '\u23F8\uFE0F',
      'STOP': '\u23F9\uFE0F',
      'RECORD': '\u23FA\uFE0F',
      'POWER': '\uD83D\uDD18',
      'ON': '\uD83D\uDD0B',
      'OFF': '\uD83D\uDD0C',
      'LOADING': '\u23F3',
      'WAIT': '\u23F3',
      'LOAD': '\uD83D\uDCE6',
      'PACKAGE': '\uD83D\uDCE6',
      'SAVE': '\uD83D\uDCBE',
      'DISK': '\uD83D\uDCBE',
      'FLOPPY': '\uD83D\uDCBE',
      'COPY': '\uD83D\uDCCB',
      'CLONE': '\uD83D\uDCD1',
      'CUT': '\u2702\uFE0F',
      'PASTE': '\uD83D\uDCC4',
      'REFRESH': '\uD83D\uDD04',
      'RELOAD': '\uD83D\uDD04',
      'SYNC': '\uD83D\uDD04',
      'CONNECT': '\uD83D\uDD17',
      'DISCONNECT': '\u26D3\uFE0F',
      'NETWORK': '\uD83C\uDF10',
      'WEB': '\uD83C\uDF10',
      'INTERNET': '\uD83C\uDF10',
      'SERVER': '\uD83D\uDDA5\uFE0F',
      'COMPUTER': '\uD83D\uDCBB',
      'LAPTOP': '\uD83D\uDCBB',
      'MOBILE': '\uD83D\uDCF1',
      'PHONE2': '\uD83D\uDCF1',
      'TABLET': '\uD83D\uDCF1',
      'KEYBOARD': '\u2328\uFE0F',
      'MOUSE': '\uD83D\uDDB1\uFE0F',
      'PRINTER': '\uD83D\uDDA8\uFE0F',
      'SCAN': '\uD83D\uDCF7',
      'CAMERA': '\uD83D\uDCF7',
      'VIDEO': '\uD83C\uDFA5',
      'MOVIE': '\uD83C\uDFAC',
      'AUDIO': '\uD83C\uDFB5',
      'MUSIC': '\uD83C\uDFB5',
      'SOUND': '\uD83D\uDD0A',
      'MUTE': '\uD83D\uDD07',
      'VOLUME': '\uD83D\uDD09',
      'BOOK': '\uD83D\uDCD6',
      'BOOKMARK': '\uD83D\uDD16',
      'LIBRARY': '\uD83D\uDCDA',
      'ARCHIVE': '\uD83D\uDDC4\uFE0F',
      'FOLDER_OPEN': '\uD83D\uDCC2',
      'FILE_NEW': '\uD83D\uDCC4',
      'FILE_OPEN': '\uD83D\uDCC2',
      'FILE_SAVE': '\uD83D\uDCBE',
      'FILE_EDIT': '\u270F\uFE0F',
      'FILE_DELETE': '\uD83D\uDDD1\uFE0F',
      'SUCCESS': '\uD83C\uDF89',
      'PARTY': '\uD83C\uDF89',
      'WIN': '\uD83C\uDFC6',
      'TROPHY': '\uD83C\uDFC6',
      'AWARD': '\uD83C\uDFC6',
      'LOVE': '\u2764\uFE0F',
      'LIKE': '\uD83D\uDC4D',
      'THUMBS_UP': '\uD83D\uDC4D',
      'THUMBS_DOWN': '\uD83D\uDC4E',
      'COOL': '\uD83D\uDE0E',
      'FUNNY': '\uD83D\uDE04',
      'SAD': '\uD83D\uDE22',
      'CRY': '\uD83D\uDE2D',
      'ANGRY': '\uD83D\uDE21',
      'GOOD': '\uD83D\uDC4D',
      'BAD': '\uD83D\uDC4E',
      'HOT': '\uD83D\uDD25',
      'FIRE': '\uD83D\uDD25',
      'COLD': '\u2744\uFE0F',
      'SNOW': '\uD83C\uDF28\uFE0F',
      'SUN': '\u2600\uFE0F',
      'MOON': '\uD83C\uDF19',
      'STAR2': '\u2B50',
      'GOLD': '\uD83E\uDD47',
      'SILVER': '\uD83E\uDD48',
      'BRONZE': '\uD83E\uDD49',
      'MEDAL': '\uD83C\uDFC5',
      'RIBBON': '\uD83C\uDF97\uFE0F',
      'TICKET': '\uD83C\uDFAB',
      'GIFT': '\uD83C\uDF81',
      'PRESENT': '\uD83C\uDF81',
      'PARTY2': '\uD83C\uDF8A',
      'BALLOON': '\uD83C\uDF88',
      'CAKE': '\uD83C\uDF82',
      'CANDLE': '\uD83D\uDD6F\uFE0F',
      'COOKIE': '\uD83C\uDF6A',
      'CANDY': '\uD83C\uDF6C',
      'COFFEE': '\u2615',
      'TEA': '\uD83C\uDF75',
      'BEER': '\uD83C\uDF7A',
      'WINE': '\uD83C\uDF77',
      'FOOD': '\uD83C\uDF54',
      'BURGER': '\uD83C\uDF54',
      'PIZZA': '\uD83C\uDF55',
      'CAKE2': '\uD83C\uDF70',
      'FRUIT': '\uD83C\uDF4E',
      'APPLE': '\uD83C\uDF4E',
      'BANANA': '\uD83C\uDF4C',
      'GRAPE': '\uD83C\uDF47',
      'WATER': '\uD83D\uDCA7',
      'DRINK': '\uD83E\uDD64'
    },

    parse: function(text) {
      if (!text || typeof text !== 'string') return text;
      var result = text;
      var entries = Object.keys(IconManager.iconMap);
      for (var i = 0; i < entries.length; i++) {
        var placeholder = entries[i];
        var icon = IconManager.iconMap[placeholder];
        var bracketRegex = new RegExp('\\[' + placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\]', 'gi');
        result = result.replace(bracketRegex, icon);
        var braceRegex = new RegExp('\\{' + placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\}', 'gi');
        result = result.replace(braceRegex, icon);
      }
      return result;
    },

    toText: function(html) {
      if (!html || typeof html !== 'string') return html;
      var result = html;
      var entries = Object.keys(IconManager.iconMap);
      for (var i = 0; i < entries.length; i++) {
        var placeholder = entries[i];
        var icon = IconManager.iconMap[placeholder];
        var escaped = icon.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var regex = new RegExp(escaped, 'g');
        result = result.replace(regex, '[' + placeholder + ']');
      }
      return result;
    },

    parseAll: function() {
      var textElements = document.querySelectorAll('[data-ctrl-type]');
      for (var i = 0; i < textElements.length; i++) {
        var el = textElements[i];
        IconManager.parseElement(el);
      }
      var staticTexts = document.querySelectorAll('span:not([data-ctrl-type]), button:not([data-ctrl-type]), a:not([data-ctrl-type]), label:not([data-ctrl-type])');
      for (var j = 0; j < staticTexts.length; j++) {
        IconManager.parseElement(staticTexts[j]);
      }
    },

    parseElement: function(el) {
      if (el.hasAttribute('data-original-text')) return;
      if (el.children.length > 0 && !el.querySelector('input, select, textarea')) {
        var childTextNodes = [];
        var walk = function(node) {
          if (node.nodeType === 3) childTextNodes.push(node);
          else if (node.nodeType === 1) {
            for (var k = 0; k < node.childNodes.length; k++) walk(node.childNodes[k]);
          }
        };
        for (var c = 0; c < el.childNodes.length; c++) walk(el.childNodes[c]);
        var hasPlaceholder = false;
        for (var t = 0; t < childTextNodes.length; t++) {
          if (/[\[{][A-Za-z_]+[\]}]/.test(childTextNodes[t].nodeValue)) {
            hasPlaceholder = true;
            break;
          }
        }
        if (!hasPlaceholder) return;
      }
      var raw = el.innerHTML;
      var parsed = IconManager.parse(raw);
      if (parsed !== raw) {
        el.setAttribute('data-original-text', raw);
        el.innerHTML = parsed;
      }
    }
  };

  /**
   * 深度处理值：递归遍历数组/对象，对字符串应用 processor 函数
   * @param {*} value - 要处理的值
   * @param {Function} processor - 处理函数
   * @returns {*} 处理后的值
   */
  function deepProcess(value, processor) {
    if (typeof value === 'string') {
      return processor(value);
    } else if (Array.isArray(value)) {
      return value.map(function(item) { return deepProcess(item, processor); });
    } else if (value && typeof value === 'object') {
      var result = {};
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          result[key] = deepProcess(value[key], processor);
        }
      }
      return result;
    }
    return value;
  }

  /**
   * 格式化返回值：将任意值转为字符串，并对字符串应用 IconManager.toText
   * @param {*} raw - API 函数返回的原始值
   * @returns {string} 格式化后的字符串
   */
  function formatReturnValue(raw) {
    if (raw === null || raw === undefined) {
      return '';
    }
    var type = typeof raw;
    if (type === 'boolean' || type === 'number') {
      return raw;
    }
    if (type === 'string') {
      return IconManager.toText(raw);
    }
    try {
      var jsonStr = JSON.stringify(raw);
      return IconManager.toText(jsonStr);
    } catch(e) {
      return '';
    }
  }

  // ================================================================
  // 辅助函数
  // ================================================================

  function getOriginalText(el) {
    if (el.hasAttribute('data-original-text')) {
      return el.getAttribute('data-original-text');
    }
    return IconManager.toText(el.innerHTML);
  }

  function setOriginalText(el, text) {
    el.setAttribute('data-original-text', text);
    el.innerHTML = IconManager.parse(text);
  }

  function reindexChildren(container, childSelector, indexAttr) {
    var children = container.querySelectorAll(childSelector);
    for (var i = 0; i < children.length; i++) {
      children[i].setAttribute(indexAttr, String(i));
    }
  }

  function getElementIndex(el, type) {
    var attr = type === 'row' ? 'data-row-index' : 'data-item-index';
    if (el.hasAttribute(attr)) {
      return parseInt(el.getAttribute(attr), 10);
    }
    var parent = el.closest('[' + attr + ']');
    if (parent) {
      return parseInt(parent.getAttribute(attr), 10);
    }
    return -1;
  }

  function getNodeId(el) {
    if (el.hasAttribute('data-node-id')) {
      return el.getAttribute('data-node-id');
    }
    var nodeEl = el.closest('.tree-node');
    if (nodeEl && nodeEl.hasAttribute('data-node-id')) {
      return nodeEl.getAttribute('data-node-id');
    }
    return '';
  }

  function getColKey(el) {
    return el.getAttribute('data-col-key') || '';
  }

  function directChild(parent, selector) {
    var children = parent.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].matches && children[i].matches(selector)) {
        return children[i];
      }
    }
    return null;
  }

  function getRootWidgetId(el) {
    var current = el;
    while (current) {
      if (current.id && current.hasAttribute('data-ctrl-type')) {
        return current.id;
      }
      current = current.parentElement;
    }
    var idEl = el.closest('[id]');
    return idEl ? idEl.id : '';
  }

  function ensureDataAttributes(el, ctrlType, originalText) {
    if (ctrlType) {
      el.setAttribute('data-ctrl-type', ctrlType);
    }
    if (originalText !== undefined && originalText !== null) {
      setOriginalText(el, originalText);
    }
  }

  function detectCtrlType(el) {
    var current = el;
    while (current) {
      if (current.hasAttribute && current.hasAttribute('data-ctrl-type')) {
        return current.getAttribute('data-ctrl-type');
      }
      if (current.classList) {
        if (current.classList.contains('tree-toggle')) return 'treeview_node_toggle';
        if (current.classList.contains('tree-label')) return 'treeview_node_text';
        if (current.classList.contains('tree-node-content')) {
          var lbl = current.querySelector('.tree-label');
          if (lbl && lbl === el) return 'treeview_node_text';
          var tgl = current.querySelector('.tree-toggle');
          if (tgl && tgl === el) return 'treeview_node_toggle';
        }
        if (current.classList.contains('list-box-scroll')) return 'listbox';
        if (current.classList.contains('list-item')) return 'listbox_item';
        if (current.classList.contains('list-item-text')) return 'listbox_item';
        if (current.classList.contains('list-item-checkbox')) return 'listbox_item_checkbox';
        if (current.classList.contains('log-output-container')) return 'logbox';
        if (current.classList.contains('log-line')) return 'log_item';
        if (current.classList.contains('data-grid-container')) return 'datagrid';
        if (current.classList.contains('data-grid-body')) return 'datagrid';
        if (current.classList.contains('data-grid-header')) return 'datagrid';
        if (current.classList.contains('data-grid-cell')) return 'datagrid_cell';
        if (current.classList.contains('data-grid-row')) return 'datagrid';
        if (current.classList.contains('tree-children')) return 'treeview';
        if (current.classList.contains('tree-node')) return 'treeview';
        if (current.classList.contains('page-container')) return 'page';
        if (current.classList.contains('progress-bar-container')) return 'progress_bar';
      }
      current = current.parentElement;
    }
    return '';
  }

  function getRadioIndex(el) {
    var name = el.name;
    if (!name) return -1;
    var siblings = document.querySelectorAll('input[type="radio"][name="' + name + '"]');
    for (var i = 0; i < siblings.length; i++) {
      if (siblings[i] === el) return i;
    }
    return -1;
  }

  function getProgressClickValue(progressEl, event) {
    if (!progressEl) return 0;
    var rect = progressEl.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    if (rect.width <= 0) return 0;
    var pct = Math.round((clickX / rect.width) * 100);
    return Math.max(0, Math.min(100, pct));
  }

  function getItemLabel(el, ctrlType) {
    if (ctrlType === 'listbox_item') {
      var textEl = el.querySelector('.list-item-text');
      if (textEl) return getOriginalText(textEl);
      return getOriginalText(el);
    }
    if (ctrlType === 'listbox_item_checkbox') {
      var itemEl = el.closest('.list-item');
      if (itemEl) return getItemLabel(itemEl, 'listbox_item');
      return '';
    }
    if (ctrlType === 'treeview_node_text') {
      return getOriginalText(el);
    }
    if (ctrlType === 'treeview_node_toggle') {
      var node = el.closest('.tree-node');
      if (node) {
        var label = node.querySelector('.tree-label');
        if (label) return getOriginalText(label);
      }
      return '';
    }
    return '';
  }

  // ================================================================
  // API 包装层
  // ================================================================

  /**
   * 包装单个 API 函数：入参转换图标占位符，返回值统一字符串化
   * @param {Function} fn - 原始 API 函数
   * @returns {Function} 包装后的函数
   */
  function wrapAPIFunction(fn) {
    return function() {
      var parsedArgs = [];
      for (var i = 0; i < arguments.length; i++) {
        parsedArgs.push(deepProcess(arguments[i], IconManager.parse));
      }
      var rawResult = fn.apply(this, parsedArgs);
      return formatReturnValue(rawResult);
    };
  }

  /**
   * 递归包装整个 API 对象中的所有函数
   * @param {*} obj - API 对象或函数
   * @returns {*} 包装后的对象或函数
   */
  function wrapAPIObject(obj) {
    if (typeof obj === 'function') {
      return wrapAPIFunction(obj);
    }
    if (obj && typeof obj === 'object') {
      var wrapped = {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key.charAt(0) === '_' || key === 'icon') {
            wrapped[key] = obj[key];
          } else {
            wrapped[key] = wrapAPIObject(obj[key]);
          }
        }
      }
      return wrapped;
    }
    return obj;
  }

  // ================================================================
  // 消息发送
  // ================================================================

  function send(action, ctrlType, targetId, data) {
    var targetEl = targetId ? findTarget(targetId) : null;
    var msg = {
      title: document.title || '',
      action: action,
      customname: targetEl ? (targetEl.getAttribute('data-name') || '') : '',
      targetId: targetId,
      basictype: targetEl ? (targetEl.getAttribute('data-type') || '') : '',
      ctrlType: ctrlType,
      data: data || {},
      timestamp: Date.now()
    };
    msg.data = deepProcess(msg.data, IconManager.toText);
    log('[webviewBridge] send:', msg);
    try {
      if (window.chrome && window.chrome.webview && window.chrome.webview.postMessage) {
        window.chrome.webview.postMessage(msg);
      }
    } catch(e) {
      warn('[webviewBridge] postMessage error:', e.message);
    }
  }

  // ================================================================
  // 事件委托处理器
  // ================================================================

  function extractEventData(el, ctrlType, event) {
    var data = {};
    var x = event.clientX !== undefined ? event.clientX : 0;
    var y = event.clientY !== undefined ? event.clientY : 0;
    if (event) {
      if (event.type === 'contextmenu') {
        data.mouse = 'right';
        data.x = x;
        data.y = y;
      } else if (event.type === 'click' || event.type === 'dblclick') {
        if (event.button === 2) data.mouse = 'right';
        else if (event.button === 1) data.mouse = 'middle';
        else data.mouse = 'left';
        data.x = x;
        data.y = y;
      } else if (event.type === 'change' || event.type === 'input' || event.type === 'blur') {
        data.mouse = 'left';
      }
    }

    switch (ctrlType) {
      case 'button':
        data.value = getOriginalText(el);
        break;
      case 'hyperlink':
        data.value = el.getAttribute('data-href') || el.href || getOriginalText(el);
        break;
      case 'icon_button':
        data.value = getOriginalText(el);
        break;
      case 'tab_btn':
        data.value = el.textContent || '';
        break;
      case 'input_text':
      case 'textarea':
        data.value = el.value || '';
        break;
      case 'checkbox':
        data.checked = el.checked || false;
        data.value = el.checked ? 'on' : 'off';
        break;
      case 'switch_toggle':
        data.checked = el.checked || false;
        data.value = el.checked ? 'on' : 'off';
        break;
      case 'radio':
        data.index = getRadioIndex(el);
        data.value = el.value || '';
        data.groupName = el.name || '';
        data.checked = el.checked || false;
        break;
      case 'combobox':
        data.value = el.value || '';
        data.index = el.selectedIndex;
        data.text = el.options && el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : '';
        break;
      case 'progress_bar':
        var progressRoot = el.closest('[data-ctrl-type="progress_bar"]');
        if (!progressRoot) break;
        var fillEl = progressRoot.querySelector('.progress-fill');
        var textEl = progressRoot.querySelector('.progress-text');
        var curVal = 0;
        if (fillEl) {
          curVal = parseFloat(fillEl.style.width) || 0;
          if (!curVal && textEl) {
            curVal = parseFloat(textEl.textContent) || 0;
          }
          if (!curVal) {
            var cs = window.getComputedStyle(fillEl);
            curVal = parseFloat(cs.width) / parseFloat(progressRoot.getBoundingClientRect().width) * 100 || 0;
          }
        } else if (textEl) {
          curVal = parseFloat(textEl.textContent) || 0;
        }
        if (event && (event.type === 'click' || event.type === 'dblclick')) {
          var editable = progressRoot.getAttribute('data-editable') === 'true';
          if (editable) {
            var clickVal = getProgressClickValue(progressRoot, event);
            if (fillEl) fillEl.style.width = clickVal + '%';
            if (textEl) textEl.textContent = clickVal + '%';
            data.value = clickVal;
          } else {
            data.value = curVal;
          }
        } else {
          data.value = curVal;
        }
        break;
      case 'datetime_picker':
        data.value = el.value || '';
        break;
      case 'listbox_item':
        data.itemIndex = getElementIndex(el, 'item');
        data.label = getItemLabel(el, ctrlType);
        break;
      case 'listbox_item_checkbox':
        data.itemIndex = getElementIndex(el, 'item');
        data.checked = el.checked || false;
        data.label = getItemLabel(el, ctrlType);
        break;
      case 'datagrid_row_checkbox':
        data.rowIndex = getElementIndex(el, 'row');
        data.checked = el.checked || false;
        break;
      case 'datagrid_cell':
        data.rowIndex = getElementIndex(el, 'row');
        data.colKey = getColKey(el);
        data.value = getOriginalText(el);
        break;
      case 'treeview_node_text':
        data.nodeId = getNodeId(el);
        data.text = getOriginalText(el);
        data.value = data.text;
        break;
      case 'treeview_node_toggle':
        data.nodeId = getNodeId(el);
        var nodeEl = el.closest('.tree-node');
        if (nodeEl) {
          var childrenEl = directChild(nodeEl, '.tree-children');
          data.expanded = childrenEl ? (childrenEl.style.display !== 'none') : false;
        } else {
          data.expanded = false;
        }
        data.text = getItemLabel(el, 'treeview_node_toggle');
        data.value = data.text;
        break;
      case 'cardbox_body':
        var cardEl = el.closest('.card-box');
        if (cardEl) {
          data.collapsed = cardEl.getAttribute('data-collapsed') === 'true';
          var cardTitleEl = cardEl.querySelector('.card-header-title');
          data.cardTitle = cardTitleEl ? (cardTitleEl.textContent || '') : '';
          data.tabTxt = data.cardTitle;
        }
        break;
      case 'log_item':
        data.value = el.textContent || '';
        break;
      case 'label':
        data.value = el.textContent || '';
        break;
      case 'image_box':
      case 'canvas':
        break;
      case 'cardbox':
        var cEl = el.closest('.card-box') || el;
        data.collapsed = cEl.getAttribute('data-collapsed') === 'true';
        var cTitle = cEl.querySelector('.card-header-title');
        data.cardTitle = cTitle ? (cTitle.textContent || '') : '';
        data.tabTxt = data.cardTitle;
        break;
      case 'tab_container':
        var tEl = el.closest('.tabs-container') || el;
        var ab = tEl.querySelector('.tab-header-btn.active');
        data.tabName = ab ? (ab.getAttribute('data-tab-name') || '') : '';
        data.tabTxt = ab ? (ab.textContent || '') : '';
        break;
      default:
        break;
    }
    return data;
  }

  var lastActiveTab = {};
  var lastActiveListbox = null;
  var lastActiveDataGrid = null;
  var lastActiveTreeView = null;
  var inputOldValues = {};

  function handleClick(e) {
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    if (e.button === 2) return;
    var targetId = getRootWidgetId(e.target);
    var data = extractEventData(e.target, ctrlType, e);
    if (ctrlType === 'listbox_item_checkbox') return;
    if (ctrlType === 'listbox_item') {
      var listContainer = e.target.closest('[data-ctrl-type="listbox"]');
      if (listContainer) {
        if (e.ctrlKey && listContainer.getAttribute('data-show-checkbox') === 'true') {
          var cbItem = e.target.closest('.list-item');
          if (cbItem) {
            var cb = cbItem.querySelector('.list-item-checkbox');
            if (cb) { cb.checked = !cb.checked; return; }
          }
        }
        var allItems = listContainer.querySelectorAll('.list-item');
        for (var li = 0; li < allItems.length; li++) {
          allItems[li].classList.remove('item-selected');
        }
        var clickedItem = e.target.closest('.list-item');
        if (clickedItem) clickedItem.classList.add('item-selected');
        lastActiveListbox = listContainer;
      }
    }
    if (ctrlType === 'datagrid_cell') {
      var gridContainer = e.target.closest('[data-ctrl-type="datagrid"]');
      if (gridContainer) {
        if (e.ctrlKey && gridContainer.getAttribute('data-show-checkbox') === 'true') {
          var cbRow = e.target.closest('.data-grid-row');
          if (cbRow) {
            var cb = cbRow.querySelector('.data-grid-row-check');
            if (cb) { cb.checked = !cb.checked; return; }
          }
        }
        var allRows = gridContainer.querySelectorAll('.data-grid-row');
        for (var ri = 0; ri < allRows.length; ri++) {
          allRows[ri].classList.remove('data-grid-row-focused');
        }
        var clickedRow = e.target.closest('.data-grid-row');
        if (clickedRow) clickedRow.classList.add('data-grid-row-focused');
        lastActiveDataGrid = gridContainer;
      }
    }
    if (ctrlType === 'treeview_node_toggle') {
      send('nodeToggle', ctrlType, targetId, data);
      return;
    }
    if (ctrlType === 'treeview_node_text' || ctrlType === 'treeview') {
      var treeContainer = e.target.closest('[data-type="treeView"]');
      if (treeContainer) {
        if (e.ctrlKey && treeContainer.getAttribute('data-show-checkbox') === 'true') {
          var cbContent = e.target.closest('.tree-node-content');
          if (cbContent) {
            var cb = cbContent.querySelector('.tree-node-check');
            if (cb) { cb.checked = !cb.checked; return; }
          }
        }
        var allContents = treeContainer.querySelectorAll('.tree-node-content.selected');
        for (var tc = 0; tc < allContents.length; tc++) {
          allContents[tc].classList.remove('selected');
        }
        var clickedContent = e.target.closest('.tree-node-content');
        if (clickedContent) clickedContent.classList.add('selected');
        lastActiveTreeView = treeContainer;
      }
    }
    if (ctrlType === 'tab_btn') {
      var tabContainer = e.target.closest('.tabs-container');
      if (tabContainer) {
        var containerId = tabContainer.id || targetId;
        var newTabName = e.target.getAttribute('data-tab-name') || '';
        var newTabTxt = e.target.textContent || '';
        var oldTabName = lastActiveTab[containerId] ? lastActiveTab[containerId].tabName : '';
        var oldTabTxt = lastActiveTab[containerId] ? lastActiveTab[containerId].tabTxt : '';
        data.tabName = newTabName;
        data.tabTxt = newTabTxt;
        data.oldTabName = oldTabName;
        data.oldTabTxt = oldTabTxt;
        lastActiveTab[containerId] = { tabName: newTabName, tabTxt: newTabTxt };
        send('tabChange', ctrlType, containerId, data);
        send('click', ctrlType, containerId, data);
        return;
      }
    }
    if (ctrlType === 'cardbox_body' || ctrlType === 'cardbox') {
      var cardRoot = e.target.closest('.card-box');
      if (cardRoot) {
        var cardId = cardRoot.id || targetId;
        if (!data.collapsed) data.collapsed = cardRoot.getAttribute('data-collapsed') === 'true';
        if (!data.cardTitle) {
          var ctEl = cardRoot.querySelector('.card-header-title');
          data.cardTitle = ctEl ? (ctEl.textContent || '') : '';
          data.tabTxt = data.cardTitle;
        }
        var collapseBtn = e.target.closest('.card-collapse-btn');
        if (collapseBtn) {
          data.isCollapseBtn = true;
          data.collapsed = cardRoot.getAttribute('data-collapsed') === 'true';
          send('click', 'cardbox', cardId, data);
          return;
        }
        var cardHeader = e.target.closest('.card-header');
        if (cardHeader) {
          data.isHeader = true;
          send('click', 'cardbox', cardId, data);
          return;
        }
        send('click', ctrlType, cardId, data);
        return;
      }
    }
    if (ctrlType === 'tab_container') {
      var tabRoot = e.target.closest('.tabs-container');
      if (tabRoot) {
        var tcId = tabRoot.id || targetId;
        var activeBtn = tabRoot.querySelector('.tab-header-btn.active');
        data.tabName = activeBtn ? (activeBtn.getAttribute('data-tab-name') || '') : '';
        data.tabTxt = activeBtn ? (activeBtn.textContent || '') : '';
        send('click', ctrlType, tcId, data);
        return;
      }
    }
    if (lastActiveListbox) {
      var clickedInListbox = e.target.closest('[data-ctrl-type="listbox"]');
      if (clickedInListbox !== lastActiveListbox) {
        if (lastActiveListbox.getAttribute('data-always-show-selection') !== 'true') {
          var clearItems = lastActiveListbox.querySelectorAll('.list-item');
          for (var cl = 0; cl < clearItems.length; cl++) {
            clearItems[cl].classList.remove('item-selected');
          }
        }
        lastActiveListbox = null;
      }
    }
    if (lastActiveDataGrid) {
      var clickedInGrid = e.target.closest('[data-ctrl-type="datagrid"]');
      if (clickedInGrid !== lastActiveDataGrid) {
        if (lastActiveDataGrid.getAttribute('data-always-show-selection') !== 'true') {
          var clearRows = lastActiveDataGrid.querySelectorAll('.data-grid-row');
          for (var cr = 0; cr < clearRows.length; cr++) {
            clearRows[cr].classList.remove('data-grid-row-focused');
          }
        }
        lastActiveDataGrid = null;
      }
    }
    if (lastActiveTreeView) {
      var clickedInTree = e.target.closest('[data-type="treeView"]');
      if (clickedInTree !== lastActiveTreeView) {
        if (lastActiveTreeView.getAttribute('data-always-show-selection') !== 'true') {
          var clearContents = lastActiveTreeView.querySelectorAll('.tree-node-content.selected');
          for (var ct = 0; ct < clearContents.length; ct++) {
            clearContents[ct].classList.remove('selected');
          }
        }
        lastActiveTreeView = null;
      }
    }
    var clickableTypes = [
      'button', 'hyperlink', 'icon_button',
      'input_text', 'textarea', 'checkbox', 'radio', 'switch_toggle',
      'combobox', 'datetime_picker', 'progress_bar',
      'listbox_item', 'datagrid_cell', 'datagrid_row_checkbox',
      'treeview_node_text',
      'log_item', 'label', 'image_box', 'canvas',
      'logbox', 'listbox', 'datagrid', 'treeview',
      'cardbox', 'cardbox_body', 'tab_container',
      'radio_group', 'page',
      'titlebar_icon', 'titlebar_title', 'titlebar_min', 'titlebar_max', 'titlebar_close'
    ];
    if (clickableTypes.indexOf(ctrlType) !== -1) {
      send('click', ctrlType, targetId, data);
    }
  }

  function handleChange(e) {
    var selectAll = e.target.closest('.data-grid-select-all');
    if (selectAll) {
      var gridId = getRootWidgetId(selectAll);
      var saData = { selectAll: true, checked: selectAll.checked || false, mouse: 'left' };
      send('change', 'datagrid_select_all', gridId, saData);
      return;
    }
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    var targetId = getRootWidgetId(e.target);
    var data = extractEventData(e.target, ctrlType, e);
    var changeTypes = ['checkbox', 'switch_toggle', 'radio', 'combobox', 'datetime_picker', 'listbox_item_checkbox', 'datagrid_row_checkbox'];
    if (changeTypes.indexOf(ctrlType) !== -1) {
      send('change', ctrlType, targetId, data);
      return;
    }
  }

  function handleInput(e) {
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    if (ctrlType === 'input_text' || ctrlType === 'textarea') {
      var targetId = getRootWidgetId(e.target);
      var data = extractEventData(e.target, ctrlType, e);
      send('change', ctrlType, targetId, data);
      return;
    }
  }

  function handleBlur(e) {
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    if (ctrlType === 'input_text' || ctrlType === 'textarea') {
      var targetId = getRootWidgetId(e.target);
      var newValue = e.target.value || '';
      var oldValue = inputOldValues[targetId] !== undefined ? inputOldValues[targetId] : newValue;
      var data = extractEventData(e.target, ctrlType, e);
      data.value = newValue;
      data.oldvalue = oldValue;
      data.type = 'end';
      send('change', ctrlType, targetId, data);
      return;
    }
  }

  function handleFocus(e) {
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    var focusTypes = [
      'input_text', 'textarea', 'combobox', 'datetime_picker',
      'checkbox', 'radio', 'button', 'hyperlink', 'icon_button',
      'datagrid_cell'
    ];
    if (focusTypes.indexOf(ctrlType) === -1) return;
    var targetId = getRootWidgetId(e.target);
    if (ctrlType === 'input_text' || ctrlType === 'textarea') {
      inputOldValues[targetId] = e.target.value || '';
    }
    var data = extractEventData(e.target, ctrlType, e);
    send('focus', ctrlType, targetId, data);
  }

  function makeEditable(el, ctrlType, targetId, options) {
    var oldValue = getOriginalText(el);
    var parent = el.parentNode;
    var nextSibling = el.nextSibling;
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'webview-edit-input';
    input.value = IconManager.parse(oldValue);
    input.style.cssText = 'width:100%;box-sizing:border-box;padding:2px 4px;border:1px solid #409EFF;outline:none;font:inherit;background:inherit;color:inherit;';
    parent.removeChild(el);
    if (nextSibling) {
      parent.insertBefore(input, nextSibling);
    } else {
      parent.appendChild(input);
    }
    input.focus();
    input.select();
    var edited = false;
    function finishEdit(save) {
      if (edited) return;
      edited = true;
      var newValue = save ? input.value : oldValue;
      if (input.parentNode) {
        if (nextSibling && nextSibling.parentNode === parent) {
          parent.insertBefore(el, nextSibling);
        } else {
          parent.appendChild(el);
        }
        parent.removeChild(input);
      }
      if (save) {
        setOriginalText(el, newValue);
      }
      return newValue;
    }
    input.addEventListener('blur', function() {
      var savedValue = finishEdit(true);
      if (options && options.onSave) {
        options.onSave(oldValue, savedValue);
      }
    });
    input.addEventListener('keydown', function(ke) {
      if (ke.key === 'Enter') {
        ke.preventDefault();
        input.blur();
      } else if (ke.key === 'Escape') {
        ke.preventDefault();
        var cancelledValue = finishEdit(false);
        if (options && options.onCancel) {
          options.onCancel(cancelledValue);
        }
      }
    });
  }

  function handleDblClick(e) {
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    var targetId = getRootWidgetId(e.target);
    var data = extractEventData(e.target, ctrlType, e);
    if (ctrlType === 'datagrid_cell') {
      var cell = e.target;
      if (cell.closest('.data-grid-checkbox')) return;
      var container = cell.closest('[data-editable]');
      if (container && container.getAttribute('data-editable') !== 'true') return;
      send('cellEdit', ctrlType, targetId, data);
      if (window.DataTableManager && window.DataTableManager.tables && window.DataTableManager.tables[targetId]) {
        if (!cell.hasAttribute('data-editable')) {
          return;
        }
      }
      var oldValue = cell.textContent || '';
      cell.textContent = '';
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'webview-edit-input';
      input.value = oldValue;
      input.style.cssText = 'width:100%;height:100%;box-sizing:border-box;padding:0 4px;border:1px solid #409EFF;outline:none;font:inherit;background:white;color:inherit;margin:0;';
      cell.appendChild(input);
      input.focus();
      input.select();
      var edited = false;
      function finishEdit(save) {
        if (edited) return;
        edited = true;
        var newValue = save ? input.value : oldValue;
        if (input.parentNode) input.parentNode.removeChild(input);
        cell.textContent = newValue;
        if (save) {
          send('cellEdit', ctrlType, targetId, {
            mouse: data.mouse,
            x: data.x,
            y: data.y,
            rowIndex: data.rowIndex,
            colKey: data.colKey,
            value: newValue,
            oldvalue: oldValue,
            type: 'end'
          });
        }
      }
      input.addEventListener('blur', function() { finishEdit(true); });
      input.addEventListener('keydown', function(ke) {
        if (ke.key === 'Enter') { ke.preventDefault(); input.blur(); }
        else if (ke.key === 'Escape') { ke.preventDefault(); finishEdit(false); }
      });
      return;
    }
    if (ctrlType === 'treeview_node_text') {
      var treeContainer = e.target.closest('[data-editable]');
      if (treeContainer && treeContainer.getAttribute('data-editable') !== 'true') return;
      send('itemEdit', ctrlType, targetId, data);
      if (window.TreeManager && window.TreeManager.configs && window.TreeManager.configs[targetId]) {
        return;
      }
      makeEditable(e.target, ctrlType, targetId, {
        onSave: function(oldVal, newVal) {
          send('itemEdit', ctrlType, targetId, {
            mouse: data.mouse,
            x: data.x,
            y: data.y,
            nodeId: data.nodeId,
            value: newVal,
            oldvalue: oldVal,
            type: 'end'
          });
        }
      });
      return;
    }
    if (ctrlType === 'listbox_item') {
      var itemEl = e.target.closest('.list-item');
      if (!itemEl) return;
      var containerEl = itemEl.closest('[data-editable]');
      if (containerEl && containerEl.getAttribute('data-editable') !== 'true') return;
      var textEl = itemEl.querySelector('.list-item-text');
      if (!textEl) return;
      var lbData = extractEventData(textEl, ctrlType, e);
      send('itemEdit', ctrlType, targetId, lbData);
      makeEditable(textEl, ctrlType, targetId, {
        onSave: function(oldVal, newVal) {
          send('itemEdit', ctrlType, targetId, {
            mouse: lbData.mouse,
            x: lbData.x,
            y: lbData.y,
            itemIndex: lbData.itemIndex,
            value: newVal,
            oldvalue: oldVal,
            type: 'end'
          });
        }
      });
      return;
    }
  }

  function handleContextMenu(e) {
    if (blockContextMenu) {
      e.preventDefault();
      return;
    }
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    e.preventDefault();
    var targetId = getRootWidgetId(e.target);
    var data = extractEventData(e.target, ctrlType, e);

    if (ctrlType === 'listbox_item') {
      var listContainer = e.target.closest('[data-ctrl-type="listbox"]');
      if (listContainer) {
        var allItems = listContainer.querySelectorAll('.list-item');
        for (var li = 0; li < allItems.length; li++) {
          allItems[li].classList.remove('item-selected');
        }
        var clickedItem = e.target.closest('.list-item');
        if (clickedItem) clickedItem.classList.add('item-selected');
        lastActiveListbox = listContainer;
      }
    }
    if (ctrlType === 'datagrid_cell') {
      var gridContainer = e.target.closest('[data-ctrl-type="datagrid"]');
      if (gridContainer) {
        var allRows = gridContainer.querySelectorAll('.data-grid-row');
        for (var ri = 0; ri < allRows.length; ri++) {
          allRows[ri].classList.remove('data-grid-row-focused');
        }
        var clickedRow = e.target.closest('.data-grid-row');
        if (clickedRow) clickedRow.classList.add('data-grid-row-focused');
        lastActiveDataGrid = gridContainer;
      }
    }
    if (ctrlType === 'treeview_node_text') {
      var treeContainer = e.target.closest('[data-type="treeView"]');
      if (treeContainer) {
        var allContents = treeContainer.querySelectorAll('.tree-node-content.selected');
        for (var tc = 0; tc < allContents.length; tc++) {
          allContents[tc].classList.remove('selected');
        }
        var clickedContent = e.target.closest('.tree-node-content');
        if (clickedContent) clickedContent.classList.add('selected');
        lastActiveTreeView = treeContainer;
      }
    }

    var ctxTypes = [
      'button', 'hyperlink', 'tab_btn', 'icon_button',
      'listbox_item', 'datagrid_cell', 'treeview_node_text',
      'combobox', 'input_text', 'textarea',
      'checkbox', 'radio', 'progress_bar', 'datetime_picker',
      'log_item', 'label', 'logbox', 'image_box', 'datagrid', 'tab_container',
      'cardbox', 'cardbox_body', 'canvas', 'listbox', 'treeview', 'radio_group', 'page',
      'titlebar_icon', 'titlebar_title', 'titlebar_min', 'titlebar_max', 'titlebar_close'
    ];
    if (ctxTypes.indexOf(ctrlType) !== -1) {
      send('click', ctrlType, targetId, data);
    }
  }

  function bindEvents() {
    var tabBtns = document.querySelectorAll('.tab-header-btn.active');
    for (var i = 0; i < tabBtns.length; i++) {
      var container = tabBtns[i].closest('.tabs-container');
      if (container && container.id) {
        lastActiveTab[container.id] = {
          tabName: tabBtns[i].getAttribute('data-tab-name') || '',
          tabTxt: tabBtns[i].textContent || ''
        };
      }
    }
    document.addEventListener('click', handleClick, true);
    document.addEventListener('change', handleChange, true);
    document.addEventListener('input', handleInput, true);
    document.addEventListener('blur', handleBlur, true);
    document.addEventListener('dblclick', handleDblClick, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('focus', handleFocus, true);
    log('[webviewBridge] 事件委托已绑定 (click/change/input/blur/dblclick/contextmenu/focus)');
  }

  // ================================================================
  // 工具函数
  // ================================================================

  function findTarget(targetId) {
    if (!targetId) return null;
    var el = document.getElementById(targetId);
    if (el) return el;
    el = document.querySelector('[id="' + targetId + '"]');
    return el;
  }

  // ================================================================
  // 全局状态变量
  // ================================================================

  var blockContextMenu = false;
  var messageListeners = [];

  // ================================================================
  // 默认命令处理器（直接调用 api 方法）
  // ================================================================

  var defaultCommands = {
    setValue: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.setValue) {
        window.webviewBridge.api.setValue(cmd.targetId, cmd.value);
      }
    },
    setChecked: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.setChecked) {
        window.webviewBridge.api.setChecked(cmd.targetId, cmd.checked);
      }
    },
    setDisabled: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.setEnabled) {
        window.webviewBridge.api.setEnabled(cmd.targetId, false);
      }
    },
    setEnabled: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.setEnabled) {
        window.webviewBridge.api.setEnabled(cmd.targetId, true);
      }
    },
    show: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.show) {
        window.webviewBridge.api.show(cmd.targetId);
      }
    },
    hide: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.hide) {
        window.webviewBridge.api.hide(cmd.targetId);
      }
    },
    toggle: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.toggle) {
        window.webviewBridge.api.toggle(cmd.targetId);
      }
    },
    focus: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.focus) {
        window.webviewBridge.api.focus(cmd.targetId);
      }
    },
    setStyle: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.setStyle) {
        window.webviewBridge.api.setStyle(cmd.targetId, cmd.style || cmd.css);
      }
    },
    setBlockContextMenu: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.setBlockContextMenu) {
        window.webviewBridge.api.setBlockContextMenu(cmd.block);
      }
    },
    showNotification: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.showNotification) {
        window.webviewBridge.api.showNotification({
          title: cmd.title,
          text: cmd.text,
          text2: cmd.text2,
          image: cmd.image,
          button1: cmd.button1,
          button2: cmd.button2
        });
      }
    },
    iconParse: function(cmd) {
      var el = findTarget(cmd.targetId);
      if (el && window.webviewBridge.api.icon.parse) {
        el.innerHTML = window.webviewBridge.api.icon.parse(cmd.text || el.innerHTML);
      }
    },
    iconToText: function(cmd) {
      var el = findTarget(cmd.targetId);
      if (el && window.webviewBridge.api.icon.toText) {
        el.innerHTML = window.webviewBridge.api.icon.toText(cmd.html || el.innerHTML);
      }
    },
    showMessageBox: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.messageBox) {
        window.webviewBridge.api.messageBox.show(cmd.overrides, cmd.requestId);
      }
    },
    'messageBox.getConfig': function() {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.messageBox) {
        return window.webviewBridge.api.messageBox.getConfig();
      }
      return null;
    },
    'messageBox.updateConfig': function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.messageBox) {
        window.webviewBridge.api.messageBox.updateConfig(cmd.config);
      }
    },
    showInputBox: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.inputBox) {
        window.webviewBridge.api.inputBox.show(cmd.overrides, cmd.requestId);
      }
    },
    'inputBox.getConfig': function() {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.inputBox) {
        return window.webviewBridge.api.inputBox.getConfig();
      }
      return null;
    },
    'inputBox.updateConfig': function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.inputBox) {
        window.webviewBridge.api.inputBox.updateConfig(cmd.config);
      }
    },
    setFixedCanvasSize: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api && window.webviewBridge.api.canvas) {
        window.webviewBridge.api.canvas.setFixedCanvasSize(cmd.isFixed, cmd.width, cmd.height);
      }
    },
    getIdByName: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api) {
        var result = window.webviewBridge.api.getIdByName(cmd.dataName);
        send('getIdByNameResult', '', '', { dataName: cmd.dataName, result: result });
      }
    },
    getInfoById: function(cmd) {
      if (window.webviewBridge && window.webviewBridge.api) {
        var result = window.webviewBridge.api.getInfoById(cmd.id);
        send('getInfoByIdResult', '', '', { id: cmd.id, result: result });
      }
    }
  };

  function dispatchCommand(cmd) {
    if (!cmd || typeof cmd !== 'object') return;
    var name = cmd.command || cmd.cmd || '';
    if (!name) return;
    log('[webviewBridge] 收到命令:', name, cmd);
    if (defaultCommands[name]) {
      try {
        defaultCommands[name](cmd);
      } catch(e) {
        warn('[webviewBridge] 默认命令执行异常:', name, e.message);
      }
      return;
    }
    warn('[webviewBridge] 未知命令:', name);
  }

  function listenHostMessages() {
    try {
      if (window.chrome && window.chrome.webview && window.chrome.webview.addEventListener) {
        window.chrome.webview.addEventListener('message', function(e) {
          log('[webviewBridge] 收到宿主消息:', e.data);
          try {
            var cmd = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            if (Array.isArray(cmd)) {
              for (var i = 0; i < cmd.length; i++) {
                dispatchCommand(cmd[i]);
              }
            } else {
              dispatchCommand(cmd);
            }
          } catch(parseErr) {
            warn('[webviewBridge] 消息解析失败:', parseErr.message);
          }
        });
        log('[webviewBridge] WebView2 消息监听已注册');
      }
    } catch(e) {
      warn('[webviewBridge] WebView2 API 不可用:', e.message);
    }
  }

  var contextMenuActive = null;

  function initContextMenus() {
    var configs = window.__contextMenus;
    if (!configs || !configs.length) return;

    for (var i = 0; i < configs.length; i++) {
      (function(config) {
        var targetEl = config.targetId ? findTarget(config.targetId) : null;
        if (!targetEl) {
          warn('[webviewBridge] 右键菜单目标控件未找到:', config.targetId);
          return;
        }

        var trigger = config.trigger || 'contextmenu';
        var handler = function(e) {
          if (trigger === 'contextmenu') {
            e.preventDefault();
            e.stopPropagation();
          }
          showContextMenu(config, e);
        };

        targetEl.addEventListener(trigger, handler);

        if (!targetEl._contextMenuHandlers) {
          targetEl._contextMenuHandlers = [];
        }
        targetEl._contextMenuHandlers.push({ trigger: trigger, handler: handler });
      })(configs[i]);
    }

    log('[webviewBridge] 右键菜单初始化完成: ' + configs.length + ' 个');
  }

  function buildMenuDOM(items) {
    var frag = document.createDocumentFragment();
    if (!items || !items.length) return frag;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.type === 'separator') {
        var sep = document.createElement('div');
        sep.className = 'ctx-menu-separator';
        frag.appendChild(sep);
      } else {
        var el = document.createElement('div');
        el.className = 'ctx-menu-item';
        el.setAttribute('data-menu-item-id', item.id);
        if (item.icon) {
          var icon = document.createElement('span');
          icon.className = 'ctx-menu-item-icon';
          icon.textContent = item.icon;
          el.appendChild(icon);
        }
        var text = document.createElement('span');
        text.className = 'ctx-menu-item-text';
        text.textContent = item.text || '';
        el.appendChild(text);
        if (item.children && item.children.length > 0) {
          var arrow = document.createElement('span');
          arrow.className = 'ctx-menu-item-arrow';
          arrow.textContent = '?';
          el.appendChild(arrow);
          var subMenu = document.createElement('div');
          subMenu.className = 'ctx-sub-menu';
          subMenu.appendChild(buildMenuDOM(item.children));
          el.appendChild(subMenu);
        }
        el.setAttribute('data-menu-path', item.id);

        el.addEventListener('mouseenter', function(e) {
          var sub = this.querySelector('.ctx-sub-menu');
          if (sub) {
            sub.style.display = 'block';
            var rect = sub.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
              sub.classList.add('left');
            } else {
              sub.classList.remove('left');
            }
          }
        });
        el.addEventListener('mouseleave', function(e) {
          var sub = this.querySelector('.ctx-sub-menu');
          if (sub) {
            sub.style.display = 'none';
          }
        });
        frag.appendChild(el);
      }
    }
    return frag;
  }

  function showContextMenu(config, mouseEvent) {
    hideContextMenu();

    var overlay = document.createElement('div');
    overlay.className = 'ctx-menu-overlay';

    var menu = document.createElement('div');
    menu.className = 'ctx-menu';
    menu.setAttribute('data-context-menu-id', config.id);
    menu.appendChild(buildMenuDOM(config.items));

    if (config.customCSS) {
      var styleEl = document.createElement('style');
      styleEl.setAttribute('data-context-menu-style', config.id);
      styleEl.textContent = config.customCSS;
      menu.appendChild(styleEl);
    }

    overlay.appendChild(menu);
    document.body.appendChild(overlay);

    var x = mouseEvent.clientX || 0;
    var y = mouseEvent.clientY || 0;

    requestAnimationFrame(function() {
      var menuRect = menu.getBoundingClientRect();
      if (x + menuRect.width > window.innerWidth) {
        x = window.innerWidth - menuRect.width - 4;
      }
      if (y + menuRect.height > window.innerHeight) {
        y = window.innerHeight - menuRect.height - 4;
      }
      if (x < 0) x = 4;
      if (y < 0) y = 4;
      menu.style.left = x + 'px';
      menu.style.top = y + 'px';
    });

    contextMenuActive = {
      config: config,
      overlay: overlay,
      menu: menu
    };

    menu.querySelectorAll('.ctx-menu-item').forEach(function(itemEl) {
      itemEl.addEventListener('click', function(e) {
        e.stopPropagation();
        var menuId = config.id;
        var path = itemEl.getAttribute('data-menu-path') || '';
        var text = (itemEl.querySelector('.ctx-menu-item-text') || {}).textContent || '';

        var pathArr = [];
        var findPath = function(items, targetId, currentPath) {
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var newPath = currentPath.concat([item.id]);
            if (item.id === targetId) {
              pathArr = newPath;
              return true;
            }
            if (item.children && item.children.length > 0) {
              if (findPath(item.children, targetId, newPath)) return true;
            }
          }
          return false;
        };
        findPath(config.items, path, []);

        send('menuClick', 'contextMenu', menuId, {
          menuId: menuId,
          text: text,
          path: pathArr
        });
        hideContextMenu();
      });
    });

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        hideContextMenu();
      }
    });
    overlay.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      hideContextMenu();
    });
  }

  function hideContextMenu() {
    if (contextMenuActive) {
      if (contextMenuActive.overlay && contextMenuActive.overlay.parentNode) {
        contextMenuActive.overlay.parentNode.removeChild(contextMenuActive.overlay);
      }
      contextMenuActive = null;
      var oldStyles = document.querySelectorAll('[data-context-menu-style]');
      for (var s = 0; s < oldStyles.length; s++) {
        oldStyles[s].parentNode.removeChild(oldStyles[s]);
      }
    }
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hideContextMenu();
    }
  });

  // ==================== 气泡提示框 (Tooltip) ====================

  var tooltipActive = null;
  var tooltipShowTimer = null;
  var tooltipHideTimer = null;

  function createTooltipElement() {
    var wrapper = document.createElement('div');
    wrapper.className = 'tt-wrapper';
    wrapper.style.cssText = 'position:fixed;z-index:999999;pointer-events:none;';

    var content = document.createElement('div');
    content.className = 'tt-content';
    wrapper.appendChild(content);

    var arrow = document.createElement('div');
    arrow.className = 'tt-arrow';
    wrapper.appendChild(arrow);

    return { wrapper: wrapper, content: content, arrow: arrow };
  }

  function calcTooltipPosition(targetRect, ttWidth, ttHeight, position) {
    var x, y, arrowClass;
    var gap = 8;
    var viewW = window.innerWidth;
    var viewH = window.innerHeight;

    function tryTop() {
      var cx = targetRect.left + targetRect.width / 2;
      var cy = targetRect.top - ttHeight - gap;
      x = cx - ttWidth / 2;
      y = cy;
      arrowClass = 'bottom';
      return y >= 4;
    }

    function tryBottom() {
      var cx = targetRect.left + targetRect.width / 2;
      var cy = targetRect.bottom + gap;
      x = cx - ttWidth / 2;
      y = cy;
      arrowClass = 'top';
      return y + ttHeight <= viewH - 4;
    }

    function tryLeft() {
      var cx = targetRect.left - ttWidth - gap;
      var cy = targetRect.top + targetRect.height / 2 - ttHeight / 2;
      x = cx;
      y = cy;
      arrowClass = 'right';
      return x >= 4;
    }

    function tryRight() {
      var cx = targetRect.right + gap;
      var cy = targetRect.top + targetRect.height / 2 - ttHeight / 2;
      x = cx;
      y = cy;
      arrowClass = 'left';
      return x + ttWidth <= viewW - 4;
    }

    var ok = false;
    if (position === 'top') ok = tryTop();
    if (!ok && position === 'bottom') ok = tryBottom();
    if (!ok && position === 'left') ok = tryLeft();
    if (!ok && position === 'right') ok = tryRight();
    if (!ok) ok = tryBottom();
    if (!ok) ok = tryTop();
    if (!ok) ok = tryRight();
    if (!ok) ok = tryLeft();

    x = Math.max(4, Math.min(x, viewW - ttWidth - 4));
    y = Math.max(4, Math.min(y, viewH - ttHeight - 4));

    return { x: x, y: y, arrowClass: arrowClass || 'top' };
  }

  function showTooltip(config) {
    clearTimeout(tooltipShowTimer);
    clearTimeout(tooltipHideTimer);

    if (tooltipActive && tooltipActive.config.id === config.id) return;

    hideTooltip(true);

    var targetEl = config.targetId ? findTarget(config.targetId) : null;
    if (!targetEl) return;

    var showDelay = config.showDelay || 200;

    tooltipShowTimer = setTimeout(function() {
      var els = createTooltipElement();
      var wrapper = els.wrapper;
      var content = els.content;
      var arrow = els.arrow;

      if (config.allowHTML) {
        content.innerHTML = config.content || '';
      } else {
        content.textContent = config.content || '';
      }

      document.body.appendChild(wrapper);

      var targetRect = targetEl.getBoundingClientRect();
      var ttWidth = wrapper.offsetWidth || wrapper.clientWidth;
      var ttHeight = wrapper.offsetHeight || wrapper.clientHeight;

      var pos = calcTooltipPosition(targetRect, ttWidth, ttHeight, config.position || 'auto');
      wrapper.style.left = pos.x + 'px';
      wrapper.style.top = pos.y + 'px';
      arrow.className = 'tt-arrow ' + pos.arrowClass;

      if (config.customCSS) {
        var styleEl = document.createElement('style');
        styleEl.setAttribute('data-tooltip-style', config.id);
        styleEl.textContent = config.customCSS;
        document.head.appendChild(styleEl);
      }

      tooltipActive = {
        config: config,
        wrapper: wrapper,
        targetEl: targetEl
      };
    }, showDelay);
  }

  function hideTooltip(immediate) {
    clearTimeout(tooltipShowTimer);
    clearTimeout(tooltipHideTimer);

    if (!tooltipActive) return;

    var hideDelay = immediate ? 0 : (tooltipActive.config.hideDelay || 100);

    var current = tooltipActive;
    tooltipHideTimer = setTimeout(function() {
      if (current.wrapper && current.wrapper.parentNode) {
        current.wrapper.parentNode.removeChild(current.wrapper);
      }
      if (current.config && current.config.id) {
        var oldStyles = document.querySelectorAll('[data-tooltip-style="' + current.config.id + '"]');
        for (var s = 0; s < oldStyles.length; s++) {
          oldStyles[s].parentNode.removeChild(oldStyles[s]);
        }
      }
      if (tooltipActive === current) {
        tooltipActive = null;
      }
    }, hideDelay);
  }

  function initTooltips() {
    var configs = window.__tooltips;
    if (!configs || !configs.length) return;

    for (var i = 0; i < configs.length; i++) {
      (function(config) {
        var targetEl = config.targetId ? findTarget(config.targetId) : null;
        if (!targetEl) {
          warn('[webviewBridge] 提示框目标控件未找到:', config.targetId);
          return;
        }

        var trigger = config.trigger || 'hover';

        if (trigger === 'hover') {
          targetEl.addEventListener('mouseenter', function(e) {
            showTooltip(config);
          });
          targetEl.addEventListener('mouseleave', function(e) {
            hideTooltip(false);
          });
        } else if (trigger === 'click') {
          targetEl.addEventListener('click', function(e) {
            if (tooltipActive && tooltipActive.config.id === config.id) {
              hideTooltip(true);
            } else {
              showTooltip(config);
            }
          });
        } else if (trigger === 'focus') {
          targetEl.addEventListener('focus', function(e) {
            showTooltip(config);
          });
          targetEl.addEventListener('blur', function(e) {
            hideTooltip(true);
          });
        }
      })(configs[i]);
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        hideTooltip(true);
      }
    });

    document.addEventListener('scroll', function() {
      hideTooltip(true);
    }, true);

    log('[webviewBridge] 提示框初始化完成: ' + configs.length + ' 个');
  }

  // ==================== 全局信息提示框 (MessageBox) ====================

  var messageBoxConfig = null;
  var currentMessageBox = null;

  // ==================== 全局输入框 (InputBox) ====================

  var inputBoxConfig = null;
  var currentInputBox = null;

  function initMessageBox() {
    if (window.__messageBoxConfig) {
      messageBoxConfig = window.__messageBoxConfig;
      log('[webviewBridge] 信息提示框配置已加载');
    }

    if (!document.querySelector('[data-messagebox-base-style]')) {
      var baseStyle = document.createElement('style');
      baseStyle.setAttribute('data-messagebox-base-style', '1');
      baseStyle.textContent = '.mb-overlay{position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:99999;display:flex;align-items:center;justify-content:center;}' +
        '.mb-dialog{background:#fff;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.2);max-width:90vw;overflow:hidden;display:flex;flex-direction:column;}' +
        '.mb-header{padding:16px 20px 8px;font-size:16px;font-weight:600;color:#333;cursor:default;display:flex;align-items:center;justify-content:space-between;}' +
        '.mb-header-title{flex:1;}' +
        '.mb-header-close{width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;background:transparent;color:#999;font-size:16px;border-radius:4px;}' +
        '.mb-header-close:hover{background:#f0f0f0;color:#333;}' +
        '.mb-body{padding:8px 20px 16px;display:flex;align-items:flex-start;gap:12px;}' +
        '.mb-icon{font-size:28px;flex-shrink:0;}' +
        '.mb-message{font-size:14px;color:#555;line-height:1.6;word-wrap:break-word;flex:1;}' +
        '.mb-footer{padding:12px 20px 16px;display:flex;justify-content:flex-end;gap:8px;}' +
        '.mb-btn{padding:7px 20px;border:1px solid #d9d9d9;border-radius:4px;background:#fff;font-size:13px;cursor:pointer;}' +
        '.mb-btn:hover{border-color:#409eff;color:#409eff;}' +
        '.mb-btn.mb-btn-primary{background:#409eff;color:#fff;border-color:#409eff;}' +
        '.mb-btn.mb-btn-primary:hover{background:#66b1ff;}';
      document.head.appendChild(baseStyle);
    }
  }

  function initInputBox() {
    if (window.__inputBoxConfig) {
      inputBoxConfig = window.__inputBoxConfig;
      log('[webviewBridge] 输入框配置已加载');
    }

    if (!document.querySelector('[data-inputbox-base-style]')) {
      var baseStyle = document.createElement('style');
      baseStyle.setAttribute('data-inputbox-base-style', '1');
      baseStyle.textContent = '.ib-overlay{position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:99999;display:flex;align-items:center;justify-content:center;}' +
        '.ib-dialog{background:#fff;border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.2);max-width:90vw;overflow:hidden;display:flex;flex-direction:column;}' +
        '.ib-header{padding:16px 20px 8px;font-size:16px;font-weight:600;color:#333;display:flex;align-items:center;justify-content:space-between;}' +
        '.ib-header-title{flex:1;}' +
        '.ib-header-close{width:24px;height:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;background:transparent;color:#999;font-size:16px;border-radius:4px;}' +
        '.ib-header-close:hover{background:#f0f0f0;color:#333;}' +
        '.ib-body{padding:8px 20px 16px;}' +
        '.ib-prompt{font-size:14px;color:#555;line-height:1.6;margin-bottom:10px;}' +
        '.ib-input{width:100%;padding:7px 10px;border:1px solid #d9d9d9;border-radius:4px;font-size:13px;color:#333;outline:none;box-sizing:border-box;}' +
        '.ib-input:focus{border-color:#409eff;box-shadow:0 0 0 2px rgba(64,158,255,0.2);}' +
        '.ib-footer{padding:12px 20px 16px;display:flex;justify-content:flex-end;gap:8px;}' +
        '.ib-btn{padding:7px 20px;border:1px solid #d9d9d9;border-radius:4px;background:#fff;font-size:13px;cursor:pointer;}' +
        '.ib-btn:hover{border-color:#409eff;color:#409eff;}' +
        '.ib-btn.ib-btn-primary{background:#409eff;color:#fff;border-color:#409eff;}' +
        '.ib-btn.ib-btn-primary:hover{background:#66b1ff;}';
      document.head.appendChild(baseStyle);
    }
  }

  function showMessageBox(overrides, requestId) {
    if (!messageBoxConfig && !overrides) {
      warn('[webviewBridge] 信息提示框配置未加载');
      return;
    }
    hideMessageBox();
    hideInputBox();

    var cfg = {};
    if (messageBoxConfig) {
      for (var k in messageBoxConfig) {
        if (messageBoxConfig.hasOwnProperty(k)) cfg[k] = messageBoxConfig[k];
      }
    }
    if (overrides) {
      for (var k in overrides) {
        if (overrides.hasOwnProperty(k)) cfg[k] = overrides[k];
      }
    }

    var showOverlay = cfg.showOverlay !== false;
    var closeOnOverlayClick = cfg.closeOnOverlayClick === true;
    var draggable = cfg.draggable !== false;
    var width = cfg.width || 400;
    var height = cfg.height || 0;
    var title = cfg.title || '提示';
    var message = cfg.message || '';
    var icon = cfg.icon || 'none';
    var customIcon = cfg.customIcon || '';
    var buttons = cfg.buttons || 'ok';
    var defaultBtnIdx = cfg.defaultButton || 0;

    var iconMap = { none: '', info: '\u2139\uFE0F', warning: '\u26A0\uFE0F', error: '\u274C', question: '\u2753' };
    var btnDefs = {
      ok: [{ text: '确定', result: 'ok' }],
      okcancel: [{ text: '确定', result: 'ok' }, { text: '取消', result: 'cancel' }],
      yesno: [{ text: '是', result: 'yes' }, { text: '否', result: 'no' }],
      yesnocancel: [{ text: '是', result: 'yes' }, { text: '否', result: 'no' }, { text: '取消', result: 'cancel' }],
      retrycancel: [{ text: '重试', result: 'retry' }, { text: '取消', result: 'cancel' }]
    };

    if (showOverlay) {
      var overlay = document.createElement('div');
      overlay.className = 'mb-overlay';
      if (closeOnOverlayClick) {
        overlay.addEventListener('click', function(e) {
          if (e.target === overlay) {
            hideMessageBox('close', requestId);
          }
        });
      }
      document.body.appendChild(overlay);
    }

    var dialog = document.createElement('div');
    dialog.className = 'mb-dialog';
    dialog.setAttribute('data-ctrl-type', 'messagebox');
    dialog.style.width = width + 'px';
    if (height > 0) dialog.style.height = height + 'px';
    dialog.style.opacity = cfg.opacity !== undefined ? cfg.opacity : 1;

    var header = document.createElement('div');
    header.className = 'mb-header';

    var headerTitle = document.createElement('span');
    headerTitle.className = 'mb-header-title';
    headerTitle.textContent = title;
    header.appendChild(headerTitle);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'mb-header-close';
    closeBtn.textContent = '\u2715';
    closeBtn.addEventListener('click', function() {
      hideMessageBox('close', requestId);
    });
    header.appendChild(closeBtn);

    var body = document.createElement('div');
    body.className = 'mb-body';
    if (icon === 'custom' && customIcon) {
      var iconEl = document.createElement('span');
      iconEl.className = 'mb-icon';
      iconEl.textContent = customIcon;
      body.appendChild(iconEl);
    } else if (icon !== 'none' && iconMap[icon]) {
      var iconEl = document.createElement('span');
      iconEl.className = 'mb-icon';
      iconEl.textContent = iconMap[icon];
      body.appendChild(iconEl);
    }
    var msgEl = document.createElement('div');
    msgEl.className = 'mb-message';
    msgEl.innerHTML = IconManager.parse(message);
    body.appendChild(msgEl);

    var footer = document.createElement('div');
    footer.className = 'mb-footer';
    var btnList = btnDefs[buttons] || btnDefs['ok'];
    for (var bi = 0; bi < btnList.length; bi++) {
      (function(btnInfo, idx) {
        var btn = document.createElement('button');
        btn.className = 'mb-btn' + (idx === defaultBtnIdx ? ' mb-btn-primary' : '');
        btn.textContent = btnInfo.text;
        btn.addEventListener('click', function() {
          hideMessageBox(btnInfo.result, requestId);
        });
        footer.appendChild(btn);
      })(btnList[bi], bi);
    }

    dialog.appendChild(header);
    dialog.appendChild(body);
    dialog.appendChild(footer);
    document.body.appendChild(dialog);

    if (cfg.customCSS) {
      var styleEl = document.createElement('style');
      styleEl.setAttribute('data-messagebox-style', '1');
      styleEl.textContent = cfg.customCSS;
      document.head.appendChild(styleEl);
    }

    dialog.style.position = 'fixed';
    dialog.style.zIndex = '100000';
    dialog.style.left = '50%';
    dialog.style.top = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';

    if (draggable) {
      var isDragging = false;
      var startX, startY, startLeft, startTop;

      header.style.cursor = 'move';
      header.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = dialog.offsetLeft;
        startTop = dialog.offsetTop;
        dialog.style.transform = 'none';
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
      });

      function onDragMove(e) {
        if (!isDragging) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        dialog.style.left = (startLeft + dx) + 'px';
        dialog.style.top = (startTop + dy) + 'px';
      }

      function onDragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
      }
    }

    currentMessageBox = { overlay: showOverlay ? overlay : null, dialog: dialog, requestId: requestId };
  }

  function hideMessageBox(result, requestId) {
    if (currentMessageBox) {
      if (currentMessageBox.overlay && currentMessageBox.overlay.parentNode) {
        currentMessageBox.overlay.parentNode.removeChild(currentMessageBox.overlay);
      }
      if (currentMessageBox.dialog && currentMessageBox.dialog.parentNode) {
        currentMessageBox.dialog.parentNode.removeChild(currentMessageBox.dialog);
      }
      var oldStyles = document.querySelectorAll('[data-messagebox-style]');
      for (var sj = 0; sj < oldStyles.length; sj++) {
        oldStyles[sj].parentNode.removeChild(oldStyles[sj]);
      }
      var rid = currentMessageBox.requestId;
      currentMessageBox = null;
      if (result) {
        var sendResult = result;
        var sendReqId = requestId || rid;
        send('messageBoxResult', 'messageBox', '', { result: sendResult, requestId: sendReqId || '' });
      }
    }
  }

  function showInputBox(overrides, requestId) {
    if (!inputBoxConfig && !overrides) {
      warn('[webviewBridge] 输入框配置未加载');
      return;
    }
    hideMessageBox();
    hideInputBox();

    var cfg = {};
    if (inputBoxConfig) {
      for (var k in inputBoxConfig) {
        if (inputBoxConfig.hasOwnProperty(k)) cfg[k] = inputBoxConfig[k];
      }
    }
    if (overrides) {
      for (var k in overrides) {
        if (overrides.hasOwnProperty(k)) cfg[k] = overrides[k];
      }
    }

    var width = cfg.width || 400;
    var height = cfg.height || 0;
    var title = cfg.title || '输入';
    var prompt = cfg.prompt || '';
    var defaultValue = cfg.defaultValue || '';
    var inputType = cfg.inputType || 'text';
    var buttons = cfg.buttons || 'okcancel';
    var showOverlay = cfg.showOverlay !== false;
    var closeOnOverlayClick = cfg.closeOnOverlayClick === true;
    var draggable = cfg.draggable !== false;
    var defaultBtnIdx = cfg.defaultButton || 0;

    var overlay = null;
    if (showOverlay) {
      overlay = document.createElement('div');
      overlay.className = 'ib-overlay';
      if (closeOnOverlayClick) {
        overlay.addEventListener('click', function(e) {
          if (e.target === overlay) hideInputBox('close', requestId);
        });
      }
      document.body.appendChild(overlay);
    }

    var dialog = document.createElement('div');
    dialog.className = 'ib-dialog';
    dialog.setAttribute('data-ctrl-type', 'inputbox');
    dialog.style.width = width + 'px';
    if (height > 0) dialog.style.height = height + 'px';
    dialog.style.opacity = cfg.opacity !== undefined ? cfg.opacity : 1;
    dialog.style.position = 'fixed';
    dialog.style.zIndex = '100000';
    dialog.style.left = '50%';
    dialog.style.top = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';

    var header = document.createElement('div');
    header.className = 'ib-header';

    var headerTitle = document.createElement('span');
    headerTitle.className = 'ib-header-title';
    headerTitle.textContent = title;
    header.appendChild(headerTitle);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'ib-header-close';
    closeBtn.textContent = '\u2715';
    closeBtn.addEventListener('click', function() {
      hideInputBox('close', requestId);
    });
    header.appendChild(closeBtn);
    dialog.appendChild(header);

    var body = document.createElement('div');
    body.className = 'ib-body';

    var promptEl = document.createElement('div');
    promptEl.className = 'ib-prompt';
    var parsedPrompt = IconManager.parse(prompt);
    promptEl.innerHTML = parsedPrompt;
    body.appendChild(promptEl);

    var input = document.createElement('input');
    input.className = 'ib-input';
    input.type = inputType;
    input.value = defaultValue;
    body.appendChild(input);
    dialog.appendChild(body);

    var btnDefs = {
      ok: [{ text: '确定', result: 'ok' }],
      okcancel: [{ text: '确定', result: 'ok' }, { text: '取消', result: 'cancel' }]
    };
    var btnList = btnDefs[buttons] || btnDefs['okcancel'];

    var footer = document.createElement('div');
    footer.className = 'ib-footer';

    for (var bi = 0; bi < btnList.length; bi++) {
      (function(btnInfo, idx) {
        var btn = document.createElement('button');
        btn.className = 'ib-btn' + (idx === defaultBtnIdx ? ' ib-btn-primary' : '');
        btn.textContent = btnInfo.text;
        btn.addEventListener('click', function() {
          hideInputBox(btnInfo.result, requestId, input.value);
        });
        footer.appendChild(btn);
      })(btnList[bi], bi);
    }
    dialog.appendChild(footer);

    if (cfg.customCSS && cfg.customCSS.trim()) {
      var customStyle = document.createElement('style');
      customStyle.setAttribute('data-inputbox-style', '1');
      customStyle.textContent = cfg.customCSS;
      dialog.appendChild(customStyle);
    }

    document.body.appendChild(dialog);
    currentInputBox = {
      overlay: overlay,
      dialog: dialog,
      requestId: requestId
    };

    setTimeout(function() {
      input.focus();
      input.select();
    }, 100);

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        hideInputBox(btnList[defaultBtnIdx] ? btnList[defaultBtnIdx].result : 'ok', requestId, input.value);
      }
    });

    if (draggable) {
      var startX, startY, startLeft, startTop, isDragging = false;
      header.style.cursor = 'move';
      header.addEventListener('mousedown', function(e) {
        if (e.target === closeBtn) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = dialog.offsetLeft;
        startTop = dialog.offsetTop;
        dialog.style.transform = 'none';
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
      });

      function onDragMove(e) {
        if (!isDragging) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        dialog.style.left = (startLeft + dx) + 'px';
        dialog.style.top = (startTop + dy) + 'px';
      }

      function onDragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
      }
    }
  }

  function hideInputBox(result, requestId, value) {
    if (currentInputBox) {
      if (currentInputBox.overlay && currentInputBox.overlay.parentNode) {
        currentInputBox.overlay.parentNode.removeChild(currentInputBox.overlay);
      }
      if (currentInputBox.dialog && currentInputBox.dialog.parentNode) {
        currentInputBox.dialog.parentNode.removeChild(currentInputBox.dialog);
      }
      var oldStyles = document.querySelectorAll('[data-inputbox-style]');
      for (var sj = 0; sj < oldStyles.length; sj++) {
        oldStyles[sj].parentNode.removeChild(oldStyles[sj]);
      }
      var rid = currentInputBox.requestId;
      currentInputBox = null;
      if (result) {
        var sendResult = result;
        var sendReqId = requestId || rid;
        send('inputBoxResult', 'inputBox', '', { result: sendResult, value: value || '', requestId: sendReqId || '' });
      }
    }
  }

  function getAllOriginalStyles(targetId) {
    var element = document.getElementById(targetId);
    var styles = {width:'',height:''};
    var styleSheets = document.styleSheets;
    // 兼容老版本 IE 的 matches 方法
    var matches = element.matches || element.msMatchesSelector || element.webkitMatchesSelector;

    // 使用传统的 for 循环遍历样式表
    for (var i = 0; i < styleSheets.length; i++) {
      var sheet = styleSheets[i];
      try {
        var cssRules = sheet.cssRules || sheet.rules;
        if (!cssRules) continue;
        // 遍历样式表中的每一条规则
        for (var j = 0; j < cssRules.length; j++) {
          var rule = cssRules[j];
          // 判断当前元素是否匹配该选择器
          if (matches.call(element, rule.selectorText)) {
            // 遍历该规则下的所有 CSS 属性
            for (var k = 0; k < rule.style.length; k++) {
              var prop = rule.style[k];
              styles[prop] = rule.style.getPropertyValue(prop);
            }
          }
        }
      } catch (e) {}
    }
    return styles;
  }

  function init() {
    log('[webviewBridge] 初始化开始');
    IconManager.parseAll();
    bindEvents();
    listenHostMessages();
    initContextMenus();
    initTooltips();
    initMessageBox();
    initInputBox();
    
	var styles = getAllOriginalStyles('page_container');
    // ========== 判断并定义 width ==========
    var newWidth;
    if (styles.width === "100%") {
      newWidth = -1;
    } else {        
        var widthNum = parseInt(styles.width) || 0;
        if(widthNum > 0){
          if ('box-shadow' in styles) {
            newWidth = widthNum + 10;
          }else{
            newWidth = widthNum;
          }
        }else{
            newWidth = widthNum;
        }
    }

    // ========== 判断并定义 height ==========
    var newHeight;
    if (styles.height === "100%") {
      newHeight = -1;
    } else {        
        var heightNum = parseInt(styles.height) || 0;
        if(heightNum > 0){
          if ('box-shadow' in styles) {
            newHeight = heightNum + 10;
          }else{
            newHeight = heightNum;
          }
        }else{
            newHeight = heightNum;
        }
    }

    var container = document.querySelector('.page-container');
    send('pageLoaded', 'canvas', 'page_container', {
      url: window.location.href,
      readyState: document.readyState,
      width: newWidth || container.offsetWidth || container.clientWidth || document.documentElement.scrollWidth,
      height: newHeight || container.offsetHeight || container.clientHeight || document.documentElement.scrollHeight
    });

    window.__uiRuntimeReady = true;
    log('[webviewBridge] 初始化完成');
  }

  // ================================================================
  // 暴露全局 API
  // ================================================================

  window.webviewBridge = {
    send: send,
    api: {
      setValue: function(targetId, value) {
        var el = findTarget(targetId);
        if (!el) return false;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          setOriginalText(el, value);
        }
        return true;
      },
      getValue: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return '';
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
          return el.value;
        }
        return getOriginalText(el);
      },
      setChecked: function(targetId, checked) {
        var el = findTarget(targetId);
        if (!el) return false;
        var input = el;
        if (el.tagName !== 'INPUT') {
          input = el.querySelector('input[type="checkbox"], input[type="radio"]');
        }
        if (input) {
          input.checked = !!checked;
          input.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        return false;
      },
      getChecked: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return false;
        if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio')) {
          return el.checked;
        }
        var input = el.querySelector('input[type="checkbox"], input[type="radio"]');
        return input ? input.checked : false;
      },
      setEnabled: function(targetId, enabled) {
        var el = findTarget(targetId);
        if (!el) return false;
        el.disabled = !enabled;
        return true;
      },
      isEnabled: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return false;
        return !el.disabled;
      },
      show: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return false;
        el.hidden = false;
        el.style.display = '';
        return true;
      },
      hide: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return false;
        el.hidden = true;
        el.style.display = 'none';
        return true;
      },
      toggle: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return false;
        if (el.hidden || el.style.display === 'none') {
          el.hidden = false;
          el.style.display = '';
        } else {
          el.hidden = true;
          el.style.display = 'none';
        }
        return true;
      },
      isVisible: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return false;
        return !el.hidden && el.style.display !== 'none';
      },
      focus: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return false;
        try { el.focus(); } catch(e) { return false; }
        return true;
      },
      setStyle: function(targetId, styleObj) {
        var el = findTarget(targetId);
        if (!el || !styleObj) return false;
        var keys = Object.keys(styleObj);
        for (var i = 0; i < keys.length; i++) {
          try { el.style[keys[i]] = styleObj[keys[i]]; } catch(e) {}
        }
        return true;
      },
      setBlockContextMenu: function(block) {
        blockContextMenu = !!block;
        return true;
      },
      getBlockContextMenu: function() {
        return blockContextMenu;
      },
      getWindowSize: function() {
        var container = document.querySelector('.page-container') || document.body;
        return {
          width: container.offsetWidth || container.clientWidth || document.documentElement.scrollWidth,
          height: container.offsetHeight || container.clientHeight || document.documentElement.scrollHeight
        };
      },
      /**
       * 固定画布宽高 — 设置预览页面的画布尺寸是否固定
       * @param {boolean} isFixed - 是否固定画布宽高（true=固定用指定宽高，false=继承body宽高）
       * @param {number} [width] - 固定时的画布宽度（px），不传则使用设计器中设置的默认宽度
       * @param {number} [height] - 固定时的画布高度（px），不传则使用设计器中设置的默认高度
       * @returns {boolean} 是否操作成功
       */
      setFixedCanvasSize: function(isFixed, width, height) {
        var container = document.querySelector('.page-container');
        if (!container) return false;
        if (isFixed) {
          var w = (typeof width === 'number' && width > 0) ? width : parseFloat(container.getAttribute('data-original-width') || '800');
          var h = (typeof height === 'number' && height > 0) ? height : parseFloat(container.getAttribute('data-original-height') || '500');
          container.style.width = w + 'px';
          container.style.height = h + 'px';
        } else {
          container.style.width = '100%';
          container.style.height = '100%';
        }
        return true;
      },
      /**
       * 通过元素 data-name 属性查找其 id
       * @param {string} dataName - 元素的 data-name 值，如 "按钮_1"
       * @returns {string|null} 元素的 id 值，如 "button_1"；未找到返回 null
       */
      getIdByName: function(dataName) {
        if (!dataName) return null;
        var el = document.querySelector('[data-name="' + dataName + '"]');
        return el ? el.id : null;
      },
      /**
       * 通过元素 id 获取其 data-name、data-type、data-ctrl-type 属性值
       * @param {string} id - 元素的 id 值，如 "button_1"
       * @returns {object|null} { name, type, ctrlType } 对象；未找到返回 null
       */
      getInfoById: function(id) {
        if (!id) return null;
        var el = document.getElementById(id);
        if (!el) return null;
        return {
          name: el.getAttribute('data-name') || '',
          type: el.getAttribute('data-type') || '',
          ctrlType: el.getAttribute('data-ctrl-type') || ''
        };
      },
    /**
     * 画布操作 API
     * @namespace canvas
     */
    canvas: {
      /**
       * 固定画布宽高
       * @param {boolean} isFixed
       * @param {number} [width]
       * @param {number} [height]
       * @returns {boolean}
       */
      setFixedCanvasSize: function(isFixed, width, height) {
        var container = document.querySelector('.page-container');
        if (!container) return false;
        if (isFixed) {
          var w = (typeof width === 'number' && width > 0) ? width : parseFloat(container.getAttribute('data-original-width') || '800');
          var h = (typeof height === 'number' && height > 0) ? height : parseFloat(container.getAttribute('data-original-height') || '500');
          container.style.width = w + 'px';
          container.style.height = h + 'px';
        } else {
          container.style.width = '100%';
          container.style.height = '100%';
        }
        return true;
      },

      /**
       * 获取画布标题栏文字
       * @returns {string} 标题栏文字，若无标题栏返回空字符串
       */
      getTitleBarTitle: function() {
        var titleEl = document.querySelector('.tb-title');
        if (!titleEl) return '';
        return titleEl.textContent || '';
      },

      /**
       * 设置画布标题栏文字
       * @param {string} title - 新的标题文字
       * @returns {boolean} 是否设置成功
       */
      setTitleBarTitle: function(title) {
        var titleEl = document.querySelector('.tb-title');
        if (!titleEl) return false;
        titleEl.textContent = title;
        document.title = title;
        return true;
      }
    },
      showNotification: function(options) {
        if (!options || !options.title || !options.text) return false;
        send('notification', '', '', {
          title: options.title || '',
          text: options.text || '',
          text2: options.text2 || '',
          image: options.image || '',
          button1: options.button1 || '',
          button2: options.button2 || ''
        });
        return true;
      },
      sendMessage: function(action, tagName, type, id, data) {
        var msg = {
          title: document.title || '',
          action: action,
          tagName: (tagName || '').toLowerCase(),
          type: type || '',
          id: id || '',
          data: data || {},
          timestamp: Date.now()
        };
        log('[webviewBridge] sendMessage:', msg);
        try {
          if (window.chrome && window.chrome.webview && window.chrome.webview.postMessage) {
            window.chrome.webview.postMessage(JSON.stringify(msg));
          }
        } catch(e) {
          warn('[webviewBridge] sendMessage error:', e.message);
        }
        return '';
      },
      testReturn: function() {
        return 'test_success';
      },
      icon: {
        parse: function(text) {
          return IconManager.parse(text);
        },
        toText: function(html) {
          return IconManager.toText(html);
        }
      },
      addMessageListener: function(callback) {
        if (typeof callback !== 'function') return false;
        messageListeners.push(callback);
        try {
          if (window.chrome && window.chrome.webview && window.chrome.webview.addEventListener) {
            window.chrome.webview.addEventListener('message', callback);
          }
        } catch(e) {
          warn('[webviewBridge] addMessageListener error:', e.message);
        }
        return true;
      },
      removeMessageListener: function(callback) {
        if (typeof callback !== 'function') return false;
        var idx = messageListeners.indexOf(callback);
        if (idx !== -1) messageListeners.splice(idx, 1);
        try {
          if (window.chrome && window.chrome.webview && window.chrome.webview.removeEventListener) {
            window.chrome.webview.removeEventListener('message', callback);
          }
        } catch(e) {
          warn('[webviewBridge] removeMessageListener error:', e.message);
        }
        return true;
      },

      move: function(targetId, x, y) {
        var el = findTarget(targetId);
        if (!el) return false;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        return true;
      },

      setSize: function(targetId, width, height) {
        var el = findTarget(targetId);
        if (!el) return false;
        el.style.width = width + 'px';
        el.style.height = height + 'px';
        return true;
      },

      getPosition: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return { x: 0, y: 0 };
        var container = document.querySelector('.page-container');
        var elRect = el.getBoundingClientRect();
        if (container) {
          var containerRect = container.getBoundingClientRect();
          return { x: elRect.left - containerRect.left, y: elRect.top - containerRect.top };
        }
        return { x: elRect.left, y: elRect.top };
      },

      getSize: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return { width: 0, height: 0 };
        return { width: el.offsetWidth  || el.clientWidth, height: el.offsetHeight  || el.clientHeight };
      },

      bringToFront: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return false;
        el.style.zIndex = '9999';
        return true;
      },

      sendToBack: function(targetId) {
        var el = findTarget(targetId);
        if (!el) return false;
        el.style.zIndex = '0';
        return true;
      },

      setZIndex: function(targetId, zIndex) {
        var el = findTarget(targetId);
        if (!el) return false;
        el.style.zIndex = String(zIndex);
        return true;
      },

      button: {
        getText: function(targetId) {
          var el = findTarget(targetId);
          return el ? getOriginalText(el) : '';
        },

        setText: function(targetId, text) {
          var el = findTarget(targetId);
          if (!el) return false;
          setOriginalText(el, text);
          return true;
        }
      },

      input: {
        getValue: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.value : '';
        },

        setValue: function(targetId, value) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        },

        getPlaceholder: function(targetId) {
          var el = findTarget(targetId);
          return el ? (el.getAttribute('placeholder') || '') : '';
        },

        setPlaceholder: function(targetId, placeholder) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('placeholder', placeholder);
          return true;
        },

        setType: function(targetId, type) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.type = type;
          return true;
        }
      },

      textarea: {
        getValue: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.value : '';
        },

        setValue: function(targetId, value) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.value = value;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          return true;
        },

        getPlaceholder: function(targetId) {
          var el = findTarget(targetId);
          return el ? (el.getAttribute('placeholder') || '') : '';
        },

        setPlaceholder: function(targetId, placeholder) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('placeholder', placeholder);
          return true;
        },

        setRows: function(targetId, rows) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('rows', String(rows));
          return true;
        }
      },

      checkbox: {
        getChecked: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var cb = el.tagName === 'INPUT' ? el : el.querySelector('input[type="checkbox"]');
          return cb ? cb.checked : false;
        },

        setChecked: function(targetId, checked) {
          var el = findTarget(targetId);
          if (!el) return false;
          var cb = el.tagName === 'INPUT' ? el : el.querySelector('input[type="checkbox"]');
          if (!cb) return false;
          cb.checked = !!checked;
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        },

        getLabel: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return '';
          var span = el.querySelector('span');
          return span ? getOriginalText(span) : '';
        },

        setLabel: function(targetId, text) {
          var el = findTarget(targetId);
          if (!el) return false;
          var span = el.querySelector('span');
          if (span) { setOriginalText(span, text); }
          return true;
        }
      },

      switchToggle: {
        getChecked: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var cb = el.tagName === 'INPUT' ? el : el.querySelector('input[type="checkbox"]');
          return cb ? cb.checked : false;
        },

        setChecked: function(targetId, checked) {
          var el = findTarget(targetId);
          if (!el) return false;
          var cb = el.tagName === 'INPUT' ? el : el.querySelector('input[type="checkbox"]');
          if (!cb) return false;
          cb.checked = !!checked;
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      },

      comboBox: {
        getValue: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.value : '';
        },

        setValue: function(targetId, value) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.value = value;
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        },

        getText: function(targetId) {
          var el = findTarget(targetId);
          if (!el || el.selectedIndex < 0) return '';
          return el.options[el.selectedIndex].text;
        },

        getIndex: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.selectedIndex : -1;
        },

        setIndex: function(targetId, index) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.selectedIndex = index;
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        },

        addItem: function(targetId, text, value) {
          var el = findTarget(targetId);
          if (!el) return false;
          var opt = document.createElement('option');
          opt.text = text;
          opt.value = value !== undefined ? String(value) : text;
          el.appendChild(opt);
          return true;
        },

        removeItem: function(targetId, index) {
          var el = findTarget(targetId);
          if (!el || index < 0 || index >= el.options.length) return false;
          el.remove(index);
          return true;
        },

        clearItems: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.innerHTML = '';
          return true;
        },

        getItemCount: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.options.length : 0;
        }
      },

      label: {
        getText: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return '';
          var span = el.querySelector('span');
          return span ? getOriginalText(span) : getOriginalText(el);
        },

        setText: function(targetId, text) {
          var el = findTarget(targetId);
          if (!el) return false;
          var span = el.querySelector('span');
          if (span) { setOriginalText(span, text); } else { setOriginalText(el, text); }
          return true;
        }
      },

      hyperlink: {
        getText: function(targetId) {
          var el = findTarget(targetId);
          return el ? getOriginalText(el) : '';
        },

        setText: function(targetId, text) {
          var el = findTarget(targetId);
          if (!el) return false;
          setOriginalText(el, text);
          return true;
        },

        getHref: function(targetId) {
          var el = findTarget(targetId);
          return el ? (el.getAttribute('href') || '') : '';
        },

        setHref: function(targetId, url) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('href', url);
          return true;
        }
      },

      radioGroup: {
        getValue: function(groupName) {
          var el = document.getElementById(groupName);
          if (!el) el = document.querySelector('[data-name="' + groupName + '"]');
          if (!el) return '';
          var checked = el.querySelector('input[type="radio"]:checked');
          return checked ? checked.value : '';
        },

        setValue: function(groupName, value) {
          var el = document.getElementById(groupName);
          if (!el) el = document.querySelector('[data-name="' + groupName + '"]');
          if (!el) return false;
          var radio = el.querySelector('input[type="radio"][value="' + value + '"]');
          if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
          }
          return false;
        },

        getIndex: function(groupName) {
          var el = document.getElementById(groupName);
          if (!el) el = document.querySelector('[data-name="' + groupName + '"]');
          if (!el) return -1;
          var radios = el.querySelectorAll('input[type="radio"]');
          for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) return i;
          }
          return -1;
        },

        setIndex: function(groupName, index) {
          var el = document.getElementById(groupName);
          if (!el) el = document.querySelector('[data-name="' + groupName + '"]');
          if (!el) return false;
          var radios = el.querySelectorAll('input[type="radio"]');
          if (index >= 0 && index < radios.length) {
            radios[index].checked = true;
            radios[index].dispatchEvent(new Event('change', { bubbles: true }));
            return true;
          }
          return false;
        },

        addOption: function(groupName, text, value) {
          var el = document.getElementById(groupName);
          if (!el) el = document.querySelector('[data-name="' + groupName + '"]');
          if (!el) return false;
          var existingLabels = el.querySelectorAll('.radiogroup-item');
          var disabled = existingLabels.length > 0 && existingLabels[0].hasAttribute('disabled');
          var label = document.createElement('label');
          label.className = 'radiogroup-item';
          if (disabled) label.setAttribute('disabled', '');
          var input = document.createElement('input');
          input.type = 'radio';
          input.setAttribute('data-ctrl-type', 'radio');
          input.name = groupName;
          input.value = value || text;
          if (disabled) input.setAttribute('disabled', '');
          label.appendChild(input);
          label.appendChild(document.createTextNode(text));
          el.appendChild(label);
          return true;
        },

        removeOption: function(groupName, valueOrIndex) {
          var el = document.getElementById(groupName);
          if (!el) el = document.querySelector('[data-name="' + groupName + '"]');
          if (!el) return false;
          var target = null;
          if (typeof valueOrIndex === 'number') {
            var labels = el.querySelectorAll('.radiogroup-item');
            if (valueOrIndex >= 0 && valueOrIndex < labels.length) {
              target = labels[valueOrIndex];
            }
          } else {
            var radios = el.querySelectorAll('input[type="radio"]');
            for (var i = 0; i < radios.length; i++) {
              if (radios[i].value === valueOrIndex) {
                target = radios[i].parentNode;
                break;
              }
            }
          }
          if (target && target.parentNode === el) {
            el.removeChild(target);
            return true;
          }
          return false;
        }
      },

      progressBar: {
        getValue: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return 0;
          var fill = el.querySelector('.progress-fill');
          if (fill && fill.style.width) {
            return parseFloat(fill.style.width) || 0;
          }
          var text = el.querySelector('.progress-text');
          return text ? (parseFloat(text.textContent) || 0) : 0;
        },

        setValue: function(targetId, value) {
          var el = findTarget(targetId);
          if (!el) return false;
          var pct = Math.max(0, Math.min(100, parseFloat(value) || 0));
          var fill = el.querySelector('.progress-fill');
          var text = el.querySelector('.progress-text');
          if (fill) fill.style.width = pct + '%';
          if (text) {
            text.setAttribute('data-original-text', pct + '%');
            text.textContent = pct + '%';
          }
          return true;
        },

        setRange: function(targetId, min, max) {
          return true;
        },

        increment: function(targetId, delta) {
          var cur = parseFloat(this.getValue(targetId)) || 0;
          return this.setValue(targetId, cur + (delta || 1));
        },

        decrement: function(targetId, delta) {
          var cur = parseFloat(this.getValue(targetId)) || 0;
          return this.setValue(targetId, cur - (delta || 1));
        },

        enableClick: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-editable', 'true');
          return true;
        },

        disableClick: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-editable', 'false');
          return true;
        }
      },

      dateTimePicker: {
        getValue: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.value : '';
        },

        setValue: function(targetId, datetime) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.value = datetime;
          el.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
      },

      logBox: {
        addLog: function(targetId, text, color, wrap) {
          var el = findTarget(targetId);
          if (!el) return false;
          var line = document.createElement('div');
          line.className = 'log-line';
          line.setAttribute('data-ctrl-type', 'log_item');
          line.style.color = color || '#000000';
          if (wrap === false) {
            line.style.display = 'inline-block';
          }
          line.textContent = text;
          el.appendChild(line);
          el.scrollTop = el.scrollHeight;
          return true;
        },

        addHtmlLog: function(targetId, html) {
          var el = findTarget(targetId);
          if (!el) return false;
          var line = document.createElement('div');
          line.className = 'log-line';
          line.setAttribute('data-ctrl-type', 'log_html_item');
          line.innerHTML = html;
          el.appendChild(line);
          el.scrollTop = el.scrollHeight;
          return true;
        },

        clearLog: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.innerHTML = '';
          return true;
        },

        getLogCount: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.querySelectorAll('.log-line').length : 0;
        }
      },

      iconButton: {
        _getIconEl: function(el) {
          if (!el) return null;
          var children = el.childNodes;
          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeType === 3) {
              if (child.textContent.trim()) return child;
            } else if (child.nodeType === 1 && child.tagName !== 'SPAN') {
              return child;
            }
          }
          return null;
        },

        _getTextEl: function(el) {
          if (!el) return null;
          var children = el.children;
          for (var i = 0; i < children.length; i++) {
            if (children[i].tagName === 'SPAN') return children[i];
          }
          return null;
        },

        getText: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return '';
          var span = this._getTextEl(el);
          if (span) return getOriginalText(span);
          var clone = el.cloneNode(true);
          var cloneIcon = this._getIconEl(clone);
          if (cloneIcon) clone.removeChild(cloneIcon);
          return (clone.textContent || '').trim();
        },

        setText: function(targetId, text) {
          var el = findTarget(targetId);
          if (!el) return false;
          var span = this._getTextEl(el);
          if (!span) {
            var icon = this._getIconEl(el);
            span = document.createElement('span');
            if (icon && icon.nextSibling) {
              el.insertBefore(span, icon.nextSibling);
            } else {
              el.appendChild(span);
            }
          }
          setOriginalText(span, text);
          return true;
        },

        getIconHtml: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return '';
          var icon = this._getIconEl(el);
          return icon ? (icon.outerHTML || icon.textContent || '') : '';
        },

        setIconHtml: function(targetId, html) {
          var el = findTarget(targetId);
          if (!el) return false;
          var oldIcon = this._getIconEl(el);
          if (oldIcon) oldIcon.parentNode.removeChild(oldIcon);
          if (html) {
            var span = this._getTextEl(el);
            var parsed = IconManager.parse(html);
            if (span) {
              span.insertAdjacentHTML('beforebegin', parsed);
            } else {
              el.insertAdjacentHTML('afterbegin', parsed);
            }
          }
          return true;
        }
      },

      imageBox: {
        _ensureImg: function(el) {
          var img = el.querySelector('img');
          if (!img) {
            img = document.createElement('img');
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
            el.appendChild(img);
          }
          return img;
        },

        getSrc: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return '';
          var img = el.querySelector('img');
          return img ? (img.getAttribute('src') || '') : '';
        },

        setSrc: function(targetId, url) {
          var el = findTarget(targetId);
          if (!el) return false;
          var img = this._ensureImg(el);
          img.setAttribute('src', url);
          return true;
        },

        getFit: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return '';
          var img = el.querySelector('img');
          if (!img) return '';
          return img.getAttribute('data-fit') || img.style.objectFit || 'cover';
        },

        setFit: function(targetId, fitMode) {
          var el = findTarget(targetId);
          if (!el) return false;
          var img = this._ensureImg(el);
          img.setAttribute('data-fit', fitMode);
          var fitMap = { fill: 'fill', contain: 'contain', cover: 'cover', 'none-top-left': 'none', 'none-center': 'none' };
          img.style.objectFit = fitMap[fitMode] || 'cover';
          return true;
        }
      },

      listBox: {
        _getScroll: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.querySelector('.list-box-scroll') : null;
        },

        _getItems: function(targetId) {
          var scroll = this._getScroll(targetId);
          return scroll ? scroll.querySelectorAll('.list-item') : [];
        },

        _getItem: function(targetId, index) {
          var items = this._getItems(targetId);
          return (index >= 0 && index < items.length) ? items[index] : null;
        },

        _getCheckbox: function(targetId, index) {
          var item = this._getItem(targetId, index);
          return item ? item.querySelector('.list-item-checkbox') : null;
        },

        _renderEmpty: function(scroll) {
          scroll.innerHTML = '<div class="list-empty">暂无数据</div>';
        },

        _syncDataAttr: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return;
          var items = this._getItems(targetId);
          var data = [];
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var cb = item.querySelector('.list-item-checkbox');
            var txt = item.querySelector('.list-item-text');
            data.push({
              text: txt ? txt.textContent : '',
              selected: cb ? cb.checked : false
            });
          }
          try { el.setAttribute('data-listbox-items', JSON.stringify(data)); } catch(e) {}
        },

        addItem: function(targetId, text) {
          var scroll = this._getScroll(targetId);
          if (!scroll) return false;
          var el = findTarget(targetId);
          var showCb = el ? el.getAttribute('data-show-checkbox') === 'true' : false;
          var empty = scroll.querySelector('.list-empty');
          if (empty) scroll.innerHTML = '';
          var items = this._getItems(targetId);
          var idx = items.length;
          var cbHtml = showCb ? '<input type="checkbox" class="list-item-checkbox" data-ctrl-type="listbox_item_checkbox" data-item-index="' + idx + '" />' : '';
          var div = document.createElement('div');
          div.className = 'list-item';
          div.setAttribute('data-ctrl-type', 'listbox_item');
          div.setAttribute('data-item-index', String(idx));
          div.innerHTML = cbHtml + '<span class="list-item-text">' + text + '</span>';
          scroll.appendChild(div);
          reindexChildren(scroll, '.list-item', 'data-item-index');
          reindexChildren(scroll, '.list-item-checkbox', 'data-item-index');
          this._syncDataAttr(targetId);
          try { scroll.dispatchEvent(new CustomEvent('listbox.itemschanged', { detail: { targetId: targetId } })); } catch(e) {}
          return true;
        },

        addItemWithHtml: function(targetId, html) {
          var scroll = this._getScroll(targetId);
          if (!scroll) return false;
          var empty = scroll.querySelector('.list-empty');
          if (empty) scroll.innerHTML = '';
          var items = this._getItems(targetId);
          var idx = items.length;
          var el = findTarget(targetId);
          var showCb = el ? el.getAttribute('data-show-checkbox') === 'true' : false;
          var cbHtml = showCb ? '<input type="checkbox" class="list-item-checkbox" data-ctrl-type="listbox_item_checkbox" data-item-index="' + idx + '" />' : '';
          var div = document.createElement('div');
          div.className = 'list-item';
          div.setAttribute('data-ctrl-type', 'listbox_item');
          div.setAttribute('data-item-index', String(idx));
          div.innerHTML = cbHtml + html;
          scroll.appendChild(div);
          reindexChildren(scroll, '.list-item', 'data-item-index');
          reindexChildren(scroll, '.list-item-checkbox', 'data-item-index');
          this._syncDataAttr(targetId);
          try { scroll.dispatchEvent(new CustomEvent('listbox.itemschanged', { detail: { targetId: targetId } })); } catch(e) {}
          return true;
        },

        removeItem: function(targetId, index) {
          var item = this._getItem(targetId, index);
          if (!item) return false;
          var scroll = item.parentNode;
          item.parentNode.removeChild(item);
          reindexChildren(scroll, '.list-item', 'data-item-index');
          reindexChildren(scroll, '.list-item-checkbox', 'data-item-index');
          var items = this._getItems(targetId);
          if (items.length === 0) this._renderEmpty(scroll);
          this._syncDataAttr(targetId);
          return true;
        },

        clearItems: function(targetId) {
          var scroll = this._getScroll(targetId);
          if (!scroll) return false;
          this._renderEmpty(scroll);
          var el = findTarget(targetId);
          if (el) el.setAttribute('data-listbox-items', '[]');
          return true;
        },

        getItemCount: function(targetId) {
          return this._getItems(targetId).length;
        },

        setItemText: function(targetId, index, text) {
          var item = this._getItem(targetId, index);
          if (!item) return false;
          var span = item.querySelector('.list-item-text');
          if (span) span.textContent = text;
          this._syncDataAttr(targetId);
          return true;
        },

        getItemText: function(targetId, index) {
          var item = this._getItem(targetId, index);
          if (!item) return '';
          var span = item.querySelector('.list-item-text');
          return span ? span.textContent : '';
        },

        setItemChecked: function(targetId, index, checked) {
          var item = this._getItem(targetId, index);
          if (!item) return false;
          var cb = item.querySelector('.list-item-checkbox');
          if (cb) {
            cb.checked = !!checked;
            cb.dispatchEvent(new Event('change', { bubbles: true }));
          }
          this._syncDataAttr(targetId);
          return true;
        },

        getItemChecked: function(targetId, index) {
          var item = this._getItem(targetId, index);
          if (!item) return false;
          var cb = item.querySelector('.list-item-checkbox');
          return cb ? cb.checked : false;
        },

        selectAll: function(targetId) {
          var items = this._getItems(targetId);
          for (var i = 0; i < items.length; i++) {
            var cb = items[i].querySelector('.list-item-checkbox');
            if (cb && !cb.checked) { cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true })); }
          }
          this._syncDataAttr(targetId);
          return true;
        },

        toggleAll: function(targetId) {
          var items = this._getItems(targetId);
          for (var i = 0; i < items.length; i++) {
            var cb = items[i].querySelector('.list-item-checkbox');
            if (cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change', { bubbles: true })); }
          }
          this._syncDataAttr(targetId);
          return true;
        },

        deleteSelected: function(targetId) {
          var items = this._getItems(targetId);
          var scroll = this._getScroll(targetId);
          var removed = false;
          for (var i = items.length - 1; i >= 0; i--) {
            var cb = items[i].querySelector('.list-item-checkbox');
            if (cb && cb.checked) {
              items[i].parentNode.removeChild(items[i]);
              removed = true;
            }
          }
          if (removed) {
            reindexChildren(scroll, '.list-item', 'data-item-index');
            reindexChildren(scroll, '.list-item-checkbox', 'data-item-index');
            var remaining = this._getItems(targetId);
            if (remaining.length === 0) this._renderEmpty(scroll);
            this._syncDataAttr(targetId);
          }
          return true;
        },

        selectItem: function(targetId, index) {
          var items = this._getItems(targetId);
          if (index < 0 || index >= items.length) return false;
          for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('item-selected');
          }
          items[index].classList.add('item-selected');
          return true;
        },

        deselectItem: function(targetId, index) {
          var items = this._getItems(targetId);
          if (index < 0 || index >= items.length) return false;
          items[index].classList.remove('item-selected');
          return true;
        },

        getSelectedItemId: function(targetId) {
          var items = this._getItems(targetId);
          for (var i = 0; i < items.length; i++) {
            var cb = items[i].querySelector('.list-item-checkbox');
            if (cb && cb.checked) return i;
          }
          return -1;
        },

        getHighlightedItem: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return null;
          var highlighted = el.querySelector('.list-item.item-selected');
          if (!highlighted) return null;
          var allItems = el.querySelectorAll('.list-item');
          for (var i = 0; i < allItems.length; i++) {
            if (allItems[i] === highlighted) {
              var textEl = highlighted.querySelector('.list-item-label') || highlighted;
              return { index: i, text: (textEl.textContent || '').trim(), element: highlighted };
            }
          }
          return null;
        },

        setAlwaysShowSelection: function(targetId, enabled) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-always-show-selection', enabled ? 'true' : 'false');
          return true;
        },

        getAlwaysShowSelection: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          return el.getAttribute('data-always-show-selection') === 'true';
        },

        showCheckbox: function(targetId, show) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-show-checkbox', show ? 'true' : 'false');
          var checkboxes = el.querySelectorAll('.list-item-checkbox');
          if (!show) {
            for (var i = 0; i < checkboxes.length; i++) {
              checkboxes[i].style.display = 'none';
            }
            return true;
          }
          if (checkboxes.length > 0) {
            for (var i = 0; i < checkboxes.length; i++) {
              checkboxes[i].style.display = '';
            }
            return true;
          }
          var items = el.querySelectorAll('.list-item');
          for (var j = 0; j < items.length; j++) {
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'list-item-checkbox';
            cb.setAttribute('data-ctrl-type', 'listbox_item_checkbox');
            cb.setAttribute('data-item-index', String(j));
            items[j].insertBefore(cb, items[j].firstChild);
          }
          return true;
        },

        enableDblClickEdit: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-editable', 'true');
          return true;
        },

        disableDblClickEdit: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-editable', 'false');
          return true;
        },

        setItemChecked: function(targetId, index, checked) {
          var checkbox = this._getCheckbox(targetId, index);
          if (!checkbox) return false;
          checkbox.checked = !!checked;
          return true;
        },

        isItemChecked: function(targetId, index) {
          var checkbox = this._getCheckbox(targetId, index);
          return checkbox ? checkbox.checked : false;
        },

        getCheckedItems: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return [];
          var checkboxes = el.querySelectorAll('.list-item-checkbox:checked');
          var indices = [];
          for (var i = 0; i < checkboxes.length; i++) {
            var idx = parseInt(checkboxes[i].getAttribute('data-item-index'), 10);
            if (!isNaN(idx)) indices.push(idx);
          }
          return indices;
        },

        checkAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var checkboxes = el.querySelectorAll('.list-item-checkbox');
          for (var i = 0; i < checkboxes.length; i++) { checkboxes[i].checked = true; }
          return true;
        },

        uncheckAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var checkboxes = el.querySelectorAll('.list-item-checkbox');
          for (var i = 0; i < checkboxes.length; i++) { checkboxes[i].checked = false; }
          return true;
        }

      },

      treeView: {
        _getNode: function(targetId, nodeId) {
          var el = findTarget(targetId);
          if (!el) return null;
          return el.querySelector('.tree-node[data-node-id="' + nodeId + '"]');
        },

        _getNodeLabel: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          return node ? node.querySelector('.tree-label') : null;
        },

        _getNodeToggle: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          return node ? node.querySelector('.tree-toggle') : null;
        },

        _getNodeChildren: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          return node ? node.querySelector('.tree-children') : null;
        },

        addNode: function(targetId, parentNodeId, newNode) {
          var el = findTarget(targetId);
          if (!el) return false;
          var hasChildren = newNode.children && newNode.children.length > 0;
          var isExpanded = newNode.expanded === true;
          var toggleClass = hasChildren ? (isExpanded ? ' expanded' : ' collapsed') : ' empty';
          var iconClass = hasChildren ? ' folder' : ' file';
          var nodeId = newNode.id || ('node_' + Date.now());
          var childrenHTML = '';
          if (hasChildren) {
            childrenHTML = '<div class="tree-children">' + newNode.children.map(function(c) { return ''; }).join('') + '</div>';
          }
          var parentNode = parentNodeId ? this._getNode(targetId, parentNodeId) : null;
          var parentChildren = parentNode ? this._getNodeChildren(targetId, parentNodeId) : null;
          var container = parentChildren || el;
          var level = parentNode ? (parseInt(parentNode.getAttribute('data-level')) + 1) : 0;
          var div = document.createElement('div');
          div.className = 'tree-node';
          div.setAttribute('data-node-id', nodeId);
          div.setAttribute('data-level', String(level));
          var showCb = el.getAttribute('data-show-checkbox') === 'true';
          var newNodeChecked = newNode.checked ? ' checked' : '';
          var checkboxHTML = showCb ? '<span class="tree-checkbox"><input type="checkbox" class="tree-node-check" data-ctrl-type="treeview_node_checkbox"' + newNodeChecked + '></span>' : '';
          div.innerHTML = '<div class="tree-node-content">' +
            checkboxHTML +
            '<span class="tree-toggle' + toggleClass + '" data-ctrl-type="treeview_node_toggle">?</span>' +
            '<span class="tree-icon' + iconClass + '">' + (hasChildren ? '??' : '??') + '</span>' +
            '<span class="tree-label" data-ctrl-type="treeview_node_text">' + (newNode.text || '') + '</span>' +
            '<span class="tree-edit-input" style="display:none"></span>' +
            '</div>' + childrenHTML;
          container.appendChild(div);
          if (parentNode) {
            var toggle = this._getNodeToggle(targetId, parentNodeId);
            if (toggle) {
              toggle.className = toggle.className.replace('empty', '').replace('collapsed', '') + ' expanded';
              toggle.textContent = '▼';
            }
            var icon = parentNode.querySelector('.tree-node-content .tree-icon');
            if (icon) {
              icon.className = icon.className.replace('file', 'folder');
              icon.textContent = '??';
            }
          }
          return true;
        },

        removeNode: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          if (!node) return false;
          node.parentNode.removeChild(node);
          return true;
        },

        updateNode: function(targetId, nodeId, newText) {
          var label = this._getNodeLabel(targetId, nodeId);
          if (!label) return false;
          label.textContent = newText;
          return true;
        },

        getNodeText: function(targetId, nodeId) {
          var label = this._getNodeLabel(targetId, nodeId);
          return label ? label.textContent : '';
        },

        expandNode: function(targetId, nodeId) {
          var toggle = this._getNodeToggle(targetId, nodeId);
          var children = this._getNodeChildren(targetId, nodeId);
          if (!toggle || !children) return false;
          toggle.className = toggle.className.replace('collapsed', 'expanded');
          toggle.textContent = '▼';
          children.style.display = '';
          return true;
        },

        collapseNode: function(targetId, nodeId) {
          var toggle = this._getNodeToggle(targetId, nodeId);
          var children = this._getNodeChildren(targetId, nodeId);
          if (!toggle || !children) return false;
          toggle.className = toggle.className.replace('expanded', 'collapsed');
          toggle.textContent = '?';
          children.style.display = 'none';
          return true;
        },

        expandAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var toggles = el.querySelectorAll('.tree-toggle.collapsed');
          for (var i = 0; i < toggles.length; i++) {
            toggles[i].className = toggles[i].className.replace('collapsed', 'expanded');
            toggles[i].textContent = '▼';
            var node = toggles[i].closest('.tree-node');
            var children = node ? node.querySelector('.tree-children') : null;
            if (children) children.style.display = '';
          }
          return true;
        },

        collapseAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var toggles = el.querySelectorAll('.tree-toggle.expanded');
          for (var i = 0; i < toggles.length; i++) {
            toggles[i].className = toggles[i].className.replace('expanded', 'collapsed');
            toggles[i].textContent = '?';
            var node = toggles[i].closest('.tree-node');
            var children = node ? node.querySelector('.tree-children') : null;
            if (children) children.style.display = 'none';
          }
          return true;
        },

        selectNode: function(targetId, nodeId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var prev = el.querySelectorAll('.tree-node-content.selected');
          for (var i = 0; i < prev.length; i++) { prev[i].classList.remove('selected'); }
          var node = this._getNode(targetId, nodeId);
          if (!node) return false;
          var content = node.querySelector('.tree-node-content');
          if (content) content.classList.add('selected');
          lastActiveTreeView = el;
          return true;
        },

        deselectNode: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          if (!node) return false;
          var content = node.querySelector('.tree-node-content');
          if (content) content.classList.remove('selected');
          return true;
        },

        clearSelection: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var allContents = el.querySelectorAll('.tree-node-content.selected');
          for (var i = 0; i < allContents.length; i++) {
            allContents[i].classList.remove('selected');
          }
          return true;
        },

        getSelectedNode: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return '';
          var sel = el.querySelector('.tree-node-content.selected');
          if (!sel) return '';
          var node = sel.closest('.tree-node');
          return node ? (node.getAttribute('data-node-id') || '') : '';
        },

        getHighlightedNode: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return null;
          var sel = el.querySelector('.tree-node-content.selected');
          if (!sel) return null;
          var node = sel.closest('.tree-node');
          if (!node) return null;
          var textEl = sel.querySelector('.tree-node-text');
          return {
            nodeId: node.getAttribute('data-node-id') || '',
            text: textEl ? (textEl.textContent || '').trim() : (sel.textContent || '').trim(),
            element: sel
          };
        },

        setAlwaysShowSelection: function(targetId, enabled) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-always-show-selection', enabled ? 'true' : 'false');
          return true;
        },

        getAlwaysShowSelection: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          return el.getAttribute('data-always-show-selection') === 'true';
        },

        enableNodeEdit: function(targetId, nodeId) {
          var label = this._getNodeLabel(targetId, nodeId);
          if (!label) return false;
          label.setAttribute('contenteditable', 'true');
          return true;
        },

        disableNodeEdit: function(targetId, nodeId) {
          var label = this._getNodeLabel(targetId, nodeId);
          if (!label) return false;
          label.removeAttribute('contenteditable');
          return true;
        },

        enableAllEdit: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          if (window.TreeManager && window.TreeManager.setEditable) {
            window.TreeManager.setEditable(targetId, true);
            return true;
          }
          el.setAttribute('data-editable', 'true');
          var labels = el.querySelectorAll('.tree-label');
          for (var i = 0; i < labels.length; i++) {
            labels[i].setAttribute('contenteditable', 'true');
          }
          return true;
        },

        disableAllEdit: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          if (window.TreeManager && window.TreeManager.setEditable) {
            window.TreeManager.setEditable(targetId, false);
            return true;
          }
          el.setAttribute('data-editable', 'false');
          var labels = el.querySelectorAll('.tree-label');
          for (var i = 0; i < labels.length; i++) {
            labels[i].removeAttribute('contenteditable');
          }
          return true;
        },

        isAllEditEnabled: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          return el.getAttribute('data-editable') === 'true';
        },

        getNodeLevel: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          return node ? parseInt(node.getAttribute('data-level')) || 0 : -1;
        },

        clearTree: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.innerHTML = '';
          return true;
        },

        _getNodeCheckbox: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          return node ? node.querySelector('.tree-node-check') : null;
        },

        showCheckbox: function(targetId, show) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-show-checkbox', show ? 'true' : 'false');
          if (window.TreeManager && window.TreeManager.showCheckbox) {
            window.TreeManager.showCheckbox(targetId, show);
          }
          var checkboxes = el.querySelectorAll('.tree-node-check');
          if (!show) {
            for (var i = 0; i < checkboxes.length; i++) {
              var cbs = checkboxes[i].closest('.tree-checkbox');
              if (cbs) cbs.style.display = 'none';
            }
            return true;
          }
          if (checkboxes.length > 0) {
            for (var i = 0; i < checkboxes.length; i++) {
              var cbs = checkboxes[i].closest('.tree-checkbox');
              if (cbs) cbs.style.display = '';
            }
            return true;
          }
          var nodes = el.querySelectorAll('.tree-node');
          for (var j = 0; j < nodes.length; j++) {
            var content = nodes[j].querySelector(':scope > .tree-node-content');
            if (!content) continue;
            var existing = content.querySelector('.tree-checkbox');
            if (existing) { existing.style.display = ''; continue; }
            var checkboxSpan = document.createElement('span');
            checkboxSpan.className = 'tree-checkbox';
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'tree-node-check';
            cb.setAttribute('data-ctrl-type', 'treeview_node_checkbox');
            checkboxSpan.appendChild(cb);
            content.insertBefore(checkboxSpan, content.firstChild);
          }
          return true;
        },

        isCheckboxVisible: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          return el.getAttribute('data-show-checkbox') === 'true';
        },

        getCheckedNodes: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return [];
          if (window.TreeManager && window.TreeManager.getCheckedNodes) {
            return window.TreeManager.getCheckedNodes(targetId);
          }
          var checkboxes = el.querySelectorAll('.tree-node-check:checked');
          var ids = [];
          for (var i = 0; i < checkboxes.length; i++) {
            var nodeEl = checkboxes[i].closest('.tree-node');
            if (nodeEl) {
              ids.push(nodeEl.getAttribute('data-node-id') || '');
            }
          }
          return ids;
        },

        setNodeChecked: function(targetId, nodeId, checked) {
          if (window.TreeManager && window.TreeManager.setNodeChecked) {
            return window.TreeManager.setNodeChecked(targetId, nodeId, checked);
          }
          var node = this._getNode(targetId, nodeId);
          if (!node) return false;
          var cbs = node.querySelectorAll('.tree-node-check');
          for (var i = 0; i < cbs.length; i++) {
            cbs[i].checked = !!checked;
          }
          return true;
        },

        isNodeChecked: function(targetId, nodeId) {
          if (window.TreeManager && window.TreeManager.isNodeChecked) {
            return window.TreeManager.isNodeChecked(targetId, nodeId);
          }
          var cb = this._getNodeCheckbox(targetId, nodeId);
          return cb ? cb.checked : false;
        },

        checkAll: function(targetId) {
          if (window.TreeManager && window.TreeManager.checkAll) {
            return window.TreeManager.checkAll(targetId);
          }
          var el = findTarget(targetId);
          if (!el) return false;
          var checkboxes = el.querySelectorAll('.tree-node-check');
          for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
          }
          return true;
        },

        uncheckAll: function(targetId) {
          if (window.TreeManager && window.TreeManager.uncheckAll) {
            return window.TreeManager.uncheckAll(targetId);
          }
          var el = findTarget(targetId);
          if (!el) return false;
          var checkboxes = el.querySelectorAll('.tree-node-check');
          for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
          }
          return true;
        }
      },

      dataGrid: {
        _getBody: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.querySelector('.data-grid-body') : null;
        },

        _getHeader: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.querySelector('.data-grid-header') : null;
        },

        _getRows: function(targetId) {
          var body = this._getBody(targetId);
          return body ? body.querySelectorAll('.data-grid-row') : [];
        },

        _getRow: function(targetId, rowIndex) {
          var rows = this._getRows(targetId);
          return (rowIndex >= 0 && rowIndex < rows.length) ? rows[rowIndex] : null;
        },

        _getColumns: function(targetId) {
          var header = this._getHeader(targetId);
          if (!header) return [];
          var cells = header.querySelectorAll('.data-grid-header-cell:not(.data-grid-checkbox)');
          var cols = [];
          for (var i = 0; i < cells.length; i++) {
            cols.push({ field: cells[i].getAttribute('data-col-key') || '', index: i });
          }
          return cols;
        },

        _reindexRows: function(body) {
          var rows = body.querySelectorAll('.data-grid-row');
          for (var i = 0; i < rows.length; i++) {
            rows[i].setAttribute('data-row-index', String(i));
          }
        },

        _makeRowHtml: function(rowIndex, rowData, columns, showCheckbox) {
          var html = '';
          if (showCheckbox) {
            var ck = rowData.selected ? ' checked' : '';
            html += '<div class="data-grid-cell data-grid-checkbox" style="width:36px;min-width:36px;flex-shrink:0"><input type="checkbox" class="data-grid-row-check" data-ctrl-type="datagrid_row_checkbox"' + ck + '></div>';
          }
          for (var j = 0; j < columns.length; j++) {
            var w = columns[j].width || 100;
            var val = '';
            if (rowData.cells && rowData.cells[columns[j].field] !== undefined) {
              val = String(rowData.cells[columns[j].field]);
            }
            var displayVal = IconManager.parse(val);
            var escapedVal = val.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            html += '<div class="data-grid-cell" data-ctrl-type="datagrid_cell" data-col-key="' + columns[j].field + '" data-original-text="' + escapedVal + '" style="width:' + w + 'px;min-width:' + w + 'px;flex-shrink:0" title="' + displayVal.replace(/"/g, '&quot;') + '">' + displayVal + '</div>';
          }
          return html;
        },

        addRow: function(targetId, rowData, insertIndex) {
          var body = this._getBody(targetId);
          if (!body) return false;
          var el = findTarget(targetId);
          var columns = this._getColumns(targetId);
          var showCheckbox = body.querySelector('.data-grid-checkbox') !== null;
          rowData = rowData || { cells: {} };
          var existingRows = this._getRows(targetId);
          var idx = (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= existingRows.length) ? insertIndex : existingRows.length;
          var div = document.createElement('div');
          div.className = 'data-grid-row';
          div.setAttribute('data-row-index', String(idx));
          div.setAttribute('data-row-id', rowData.id || ('row_' + Date.now()));
          div.innerHTML = this._makeRowHtml(idx, rowData, columns, showCheckbox);
          if (idx < existingRows.length) {
            body.insertBefore(div, existingRows[idx]);
          } else {
            body.appendChild(div);
          }
          this._reindexRows(body);
          try { body.dispatchEvent(new CustomEvent('datagrid.rowschanged', { detail: { targetId: targetId } })); } catch(e) {}
          return true;
        },

        removeRow: function(targetId, rowIndex) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return false;
          var body = row.parentNode;
          body.removeChild(row);
          this._reindexRows(body);
          return true;
        },

        getRowCount: function(targetId) {
          return this._getRows(targetId).length;
        },

        setCellValue: function(targetId, rowIndex, columnKey, value) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return false;
          var cell = row.querySelector('.data-grid-cell[data-col-key="' + columnKey + '"]');
          if (!cell) return false;
          cell.textContent = String(value);
          cell.setAttribute('title', String(value));
          return true;
        },

        getCellValue: function(targetId, rowIndex, columnKey) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return '';
          var cell = row.querySelector('.data-grid-cell[data-col-key="' + columnKey + '"]');
          return cell ? cell.textContent : '';
        },

        setCellValueByIndex: function(targetId, rowIndex, colIndex, value) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return false;
          var cells = row.querySelectorAll('.data-grid-cell:not(.data-grid-checkbox)');
          if (colIndex < 0 || colIndex >= cells.length) return false;
          cells[colIndex].textContent = String(value);
          cells[colIndex].setAttribute('title', String(value));
          return true;
        },

        getCellValueByIndex: function(targetId, rowIndex, colIndex) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return '';
          var cells = row.querySelectorAll('.data-grid-cell:not(.data-grid-checkbox)');
          if (colIndex < 0 || colIndex >= cells.length) return '';
          return cells[colIndex].textContent;
        },

        setRowData: function(targetId, rowIndex, rowData) {
          var row = this._getRow(targetId, rowIndex);
          if (!row || !rowData) return false;
          if (rowData.cells) {
            var keys = Object.keys(rowData.cells);
            for (var i = 0; i < keys.length; i++) {
              this.setCellValue(targetId, rowIndex, keys[i], rowData.cells[keys[i]]);
            }
          }
          return true;
        },

        getRowData: function(targetId, rowIndex) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return {};
          var cells = row.querySelectorAll('.data-grid-cell[data-col-key]');
          var data = { id: row.getAttribute('data-row-id') || '', cells: {} };
          for (var i = 0; i < cells.length; i++) {
            var key = cells[i].getAttribute('data-col-key');
            if (key) data.cells[key] = cells[i].textContent;
          }
          var cb = row.querySelector('.data-grid-row-check');
          data.selected = cb ? cb.checked : false;
          return data;
        },

        clearRows: function(targetId) {
          var body = this._getBody(targetId);
          if (!body) return false;
          body.innerHTML = '';
          return true;
        },

        setRowChecked: function(targetId, rowIndex, checked) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return false;
          var cb = row.querySelector('.data-grid-row-check');
          if (!cb) return false;
          cb.checked = !!checked;
          if (checked) {
            row.classList.add('data-grid-row-focused');
          } else {
            row.classList.remove('data-grid-row-focused');
          }
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        },

        getRowChecked: function(targetId, rowIndex) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return false;
          var cb = row.querySelector('.data-grid-row-check');
          return cb ? cb.checked : false;
        },

        selectAllRows: function(targetId) {
          var rows = this._getRows(targetId);
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.data-grid-row-check');
            if (cb) { cb.checked = true; rows[i].classList.add('data-grid-row-focused'); }
          }
          var selectAll = document.querySelector('#' + targetId + ' .data-grid-select-all');
          if (selectAll) selectAll.checked = true;
          return true;
        },

        toggleAllRows: function(targetId) {
          var rows = this._getRows(targetId);
          var allChecked = true;
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.data-grid-row-check');
            if (cb && !cb.checked) { allChecked = false; break; }
          }
          for (var j = 0; j < rows.length; j++) {
            var cb2 = rows[j].querySelector('.data-grid-row-check');
            if (cb2) {
              cb2.checked = !allChecked;
              if (!allChecked) { rows[j].classList.add('data-grid-row-focused'); }
              else { rows[j].classList.remove('data-grid-row-focused'); }
            }
          }
          return true;
        },

        getSelectedRows: function(targetId) {
          var rows = this._getRows(targetId);
          var result = [];
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.data-grid-row-check');
            if (cb && cb.checked) result.push(i);
          }
          return result;
        },

        getSelectedRowCount: function(targetId) {
          var rows = this._getRows(targetId);
          var count = 0;
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.data-grid-row-check');
            if (cb && cb.checked) count++;
          }
          return count;
        },

        getHighlightedRow: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return null;
          var highlighted = el.querySelector('.data-grid-row.data-grid-row-focused');
          if (!highlighted) return null;
          var allRows = el.querySelectorAll('.data-grid-row');
          for (var i = 0; i < allRows.length; i++) {
            if (allRows[i] === highlighted) {
              var cells = highlighted.querySelectorAll('.data-grid-cell');
              var rowData = { index: i, cells: [], element: highlighted };
              for (var c = 0; c < cells.length; c++) {
                rowData.cells.push((cells[c].textContent || '').trim());
              }
              return rowData;
            }
          }
          return null;
        },

        selectRow: function(targetId, rowIndex) {
          var rows = this._getRows(targetId);
          if (rowIndex < 0 || rowIndex >= rows.length) return false;
          for (var i = 0; i < rows.length; i++) {
            rows[i].classList.remove('data-grid-row-focused');
          }
          rows[rowIndex].classList.add('data-grid-row-focused');
          return true;
        },

        deselectRow: function(targetId, rowIndex) {
          var rows = this._getRows(targetId);
          if (rowIndex < 0 || rowIndex >= rows.length) return false;
          rows[rowIndex].classList.remove('data-grid-row-focused');
          return true;
        },

        deleteSelectedRows: function(targetId) {
          var rows = this._getRows(targetId);
          var body = this._getBody(targetId);
          for (var i = rows.length - 1; i >= 0; i--) {
            var cb = rows[i].querySelector('.data-grid-row-check');
            if (cb && cb.checked) {
              body.removeChild(rows[i]);
            }
          }
          this._reindexRows(body);
          return true;
        },

        enableCellEdit: function(targetId, colIndex) {
          var el = findTarget(targetId);
          if (!el) return false;
          var headerCells = el.querySelectorAll('.data-grid-header-cell:not(.data-grid-checkbox)');
          if (colIndex < 0 || colIndex >= headerCells.length) return false;
          headerCells[colIndex].setAttribute('data-editable', 'true');
          var rows = el.querySelectorAll('.data-grid-row');
          for (var r = 0; r < rows.length; r++) {
            var cells = rows[r].querySelectorAll('.data-grid-cell:not(.data-grid-checkbox)');
            if (colIndex < cells.length) {
              cells[colIndex].setAttribute('data-editable', 'true');
            }
          }
          return true;
        },

        disableCellEdit: function(targetId, colIndex) {
          var el = findTarget(targetId);
          if (!el) return false;
          var headerCells = el.querySelectorAll('.data-grid-header-cell:not(.data-grid-checkbox)');
          if (colIndex < 0 || colIndex >= headerCells.length) return false;
          headerCells[colIndex].setAttribute('data-editable', 'false');
          var rows = el.querySelectorAll('.data-grid-row');
          for (var r = 0; r < rows.length; r++) {
            var cells = rows[r].querySelectorAll('.data-grid-cell:not(.data-grid-checkbox)');
            if (colIndex < cells.length) {
              cells[colIndex].setAttribute('data-editable', 'false');
            }
          }
          return true;
        },

        isCellEditable: function(targetId, colIndex) {
          var el = findTarget(targetId);
          if (!el) return false;
          var headerCells = el.querySelectorAll('.data-grid-header-cell:not(.data-grid-checkbox)');
          if (colIndex < 0 || colIndex >= headerCells.length) return false;
          return headerCells[colIndex].getAttribute('data-editable') === 'true';
        },

        enableGlobalEdit: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          if (window.DataTableManager && window.DataTableManager.setEditable) {
            window.DataTableManager.setEditable(targetId, true);
            return true;
          }
          el.setAttribute('data-editable', 'true');
          return true;
        },

        disableGlobalEdit: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          if (window.DataTableManager && window.DataTableManager.setEditable) {
            window.DataTableManager.setEditable(targetId, false);
            return true;
          }
          el.setAttribute('data-editable', 'false');
          return true;
        },

        isGlobalEditEnabled: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          if (window.DataTableManager && window.DataTableManager.tables && window.DataTableManager.tables[targetId]) {
            return window.DataTableManager.tables[targetId].editable === true;
          }
          return el.getAttribute('data-editable') === 'true';
        },

        setAlwaysShowSelection: function(targetId, enabled) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-always-show-selection', enabled ? 'true' : 'false');
          return true;
        },

        getAlwaysShowSelection: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          return el.getAttribute('data-always-show-selection') === 'true';
        },

        showRowCheckbox: function(targetId, show) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-show-checkbox', show ? 'true' : 'false');
          if (window.DataTableManager && window.DataTableManager.tables && window.DataTableManager.tables[targetId]) {
            window.DataTableManager.tables[targetId].showCheckbox = !!show;
          }
          var checkboxes = el.querySelectorAll('.data-grid-checkbox');
          if (!show) {
            for (var i = 0; i < checkboxes.length; i++) {
              checkboxes[i].style.display = 'none';
            }
            return true;
          }
          if (checkboxes.length > 0) {
            for (var i = 0; i < checkboxes.length; i++) {
              checkboxes[i].style.display = '';
            }
            return true;
          }
          var header = el.querySelector('.data-grid-header');
          if (header) {
            var headerCb = document.createElement('div');
            headerCb.className = 'data-grid-header-cell data-grid-checkbox';
            headerCb.style.cssText = 'width:36px;min-width:36px;flex-shrink:0';
            headerCb.innerHTML = '<input type="checkbox" class="data-grid-select-all">';
            header.insertBefore(headerCb, header.firstChild);
          }
          var rows = el.querySelectorAll('.data-grid-row');
          for (var r = 0; r < rows.length; r++) {
            var rowCb = document.createElement('div');
            rowCb.className = 'data-grid-cell data-grid-checkbox';
            rowCb.style.cssText = 'width:36px;min-width:36px;flex-shrink:0';
            rowCb.innerHTML = '<input type="checkbox" class="data-grid-row-check" data-ctrl-type="datagrid_row_checkbox">';
            rows[r].insertBefore(rowCb, rows[r].firstChild);
          }
          return true;
        },

        _getRowCheckbox: function(targetId, rowIndex) {
          var el = findTarget(targetId);
          if (!el) return null;
          var rows = el.querySelectorAll('.data-grid-row');
          if (rowIndex < 0 || rowIndex >= rows.length) return null;
          return rows[rowIndex].querySelector('.data-grid-row-check') || null;
        },

        setRowChecked: function(targetId, rowIndex, checked) {
          var cb = this._getRowCheckbox(targetId, rowIndex);
          if (!cb) return false;
          cb.checked = !!checked;
          return true;
        },

        isRowChecked: function(targetId, rowIndex) {
          var cb = this._getRowCheckbox(targetId, rowIndex);
          return cb ? cb.checked : false;
        },

        getCheckedRows: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return [];
          var rows = el.querySelectorAll('.data-grid-row');
          var indices = [];
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.data-grid-row-check');
            if (cb && cb.checked) indices.push(i);
          }
          return indices;
        },

        checkAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var checkboxes = el.querySelectorAll('.data-grid-row-check');
          for (var i = 0; i < checkboxes.length; i++) { checkboxes[i].checked = true; }
          return true;
        },

        uncheckAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var checkboxes = el.querySelectorAll('.data-grid-row-check');
          for (var i = 0; i < checkboxes.length; i++) { checkboxes[i].checked = false; }
          return true;
        }

      },

      cardBox: {
        _getHeader: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.querySelector('.card-header') : null;
        },

        _getTitle: function(targetId) {
          var header = this._getHeader(targetId);
          return header ? header.querySelector('.card-header-title') : null;
        },

        _getCollapseBtn: function(targetId) {
          var header = this._getHeader(targetId);
          return header ? header.querySelector('.card-collapse-btn') : null;
        },

        _updateArrow: function(targetId, collapsed) {
          var btn = this._getCollapseBtn(targetId);
          if (!btn) return;
          if (collapsed) {
            btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M4.5 3L7.5 6L4.5 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          } else {
            btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          }
        },

        getCardTitle: function(targetId) {
          var title = this._getTitle(targetId);
          return title ? title.textContent : '';
        },

        setCardTitle: function(targetId, title) {
          var titleEl = this._getTitle(targetId);
          if (!titleEl) return false;
          titleEl.textContent = title;
          return true;
        },

        showCardHeader: function(targetId) {
          var header = this._getHeader(targetId);
          if (!header) return false;
          header.style.display = '';
          return true;
        },

        hideCardHeader: function(targetId) {
          var header = this._getHeader(targetId);
          if (!header) return false;
          header.style.display = 'none';
          return true;
        },

        isCardHeaderVisible: function(targetId) {
          var header = this._getHeader(targetId);
          if (!header) return false;
          return header.style.display !== 'none';
        },

        collapseCard: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          if (el.getAttribute('data-collapsible') !== 'true') return false;
          el.classList.add('collapsed');
          el.setAttribute('data-collapsed', 'true');
          this._updateArrow(targetId, true);
          return true;
        },

        expandCard: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          if (el.getAttribute('data-collapsible') !== 'true') return false;
          el.classList.remove('collapsed');
          el.setAttribute('data-collapsed', 'false');
          this._updateArrow(targetId, false);
          return true;
        },

        isCardCollapsed: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          return el.getAttribute('data-collapsed') === 'true';
        },

        showCollapseButton: function(targetId, show) {
          var btn = this._getCollapseBtn(targetId);
          if (!btn) {
            return false;
          }
          btn.style.display = show ? '' : 'none';
          return true;
        },

        isCollapseButtonVisible: function(targetId) {
          var btn = this._getCollapseBtn(targetId);
          if (!btn) return false;
          return btn.style.display !== 'none';
        }
      },

      tabContainer: {
        _getContainer: function(targetId) {
          return findTarget(targetId);
        },

        _getTabBtns: function(targetId) {
          var el = this._getContainer(targetId);
          return el ? el.querySelectorAll('.tab-header-btn') : [];
        },

        _getTabPanes: function(targetId) {
          var el = this._getContainer(targetId);
          return el ? el.querySelectorAll('.tab-pane') : [];
        },

        _findTabBtn: function(targetId, tabId) {
          var el = this._getContainer(targetId);
          return el ? el.querySelector('.tab-header-btn[data-tab-name="' + tabId + '"]') : null;
        },

        _findTabPane: function(targetId, tabId) {
          var el = this._getContainer(targetId);
          return el ? el.querySelector('.tab-pane[data-tab-name="' + tabId + '"]') : null;
        },

        _deactivateAll: function(targetId) {
          var btns = this._getTabBtns(targetId);
          for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active');
          }
          var panes = this._getTabPanes(targetId);
          for (var j = 0; j < panes.length; j++) {
            panes[j].classList.remove('active');
          }
        },

        selectTab: function(targetId, tabId) {
          var btn = this._findTabBtn(targetId, tabId);
          var pane = this._findTabPane(targetId, tabId);
          if (!btn || !pane) return false;
          this._deactivateAll(targetId);
          btn.classList.add('active');
          pane.classList.add('active');
          return true;
        },

        getActiveTab: function(targetId) {
          var btn = this._getContainer(targetId);
          if (!btn) return '';
          var active = btn.querySelector('.tab-header-btn.active');
          return active ? active.getAttribute('data-tab-name') || '' : '';
        },

        getActiveTabIndex: function(targetId) {
          var btns = this._getTabBtns(targetId);
          var activeName = this.getActiveTab(targetId);
          for (var i = 0; i < btns.length; i++) {
            if (btns[i].getAttribute('data-tab-name') === activeName) return i;
          }
          return -1;
        },

        addTab: function(targetId, tabId, tabTitle) {
          var el = this._getContainer(targetId);
          if (!el) return false;
          var tabBar = el.querySelector('.tab-header-bar');
          var contentWrapper = el.querySelector('.tab-content-wrapper');
          if (!tabBar || !contentWrapper) return false;
          if (this._findTabBtn(targetId, tabId)) return false;
          tabId = tabId || ('tab_' + Date.now());
          tabTitle = tabTitle || ('标签' + (this._getTabBtns(targetId).length + 1));
          var btn = document.createElement('button');
          btn.className = 'tab-header-btn';
          btn.setAttribute('data-ctrl-type', 'tab_btn');
          btn.setAttribute('data-tab-name', tabId);
          btn.textContent = tabTitle;
          tabBar.appendChild(btn);
          var pane = document.createElement('div');
          pane.className = 'tab-pane';
          pane.setAttribute('data-tab-name', tabId);
          contentWrapper.appendChild(pane);
          return true;
        },

        removeTab: function(targetId, tabId) {
          var btn = this._findTabBtn(targetId, tabId);
          var pane = this._findTabPane(targetId, tabId);
          if (!btn) return false;
          var wasActive = btn.classList.contains('active');
          btn.parentNode.removeChild(btn);
          if (pane) pane.parentNode.removeChild(pane);
          if (wasActive) {
            var btns = this._getTabBtns(targetId);
            if (btns.length > 0) {
              this.selectTab(targetId, btns[0].getAttribute('data-tab-name'));
            }
          }
          return true;
        },

        renameTab: function(targetId, tabId, newTitle) {
          var btn = this._findTabBtn(targetId, tabId);
          if (!btn) return false;
          btn.textContent = newTitle;
          return true;
        },

        getTabCount: function(targetId) {
          return this._getTabBtns(targetId).length;
        }
      },

      contextMenu: {
        show: function(targetId, mouseEvent) {
          var configs = window.__contextMenus || [];
          for (var i = 0; i < configs.length; i++) {
            if (configs[i].id === targetId) {
              if (!mouseEvent) {
                mouseEvent = { clientX: 100, clientY: 100 };
              }
              showContextMenu(configs[i], mouseEvent);
              return true;
            }
          }
          return false;
        },

        hide: function() {
          hideContextMenu();
          return true;
        },

        isVisible: function() {
          return !!contextMenuActive;
        },

        updateItems: function(targetId, items) {
          var configs = window.__contextMenus;
          if (!configs) return false;
          for (var i = 0; i < configs.length; i++) {
            if (configs[i].id === targetId) {
              configs[i].items = items;
              return true;
            }
          }
          return false;
        },

        getItems: function(targetId) {
          var configs = window.__contextMenus;
          if (!configs) return null;
          for (var i = 0; i < configs.length; i++) {
            if (configs[i].id === targetId) {
              return configs[i].items;
            }
          }
          return null;
        }
      },

      tooltip: {
        show: function(targetId, mouseEvent) {
          var configs = window.__tooltips || [];
          for (var i = 0; i < configs.length; i++) {
            if (configs[i].id === targetId) {
              if (!mouseEvent) {
                mouseEvent = { clientX: 100, clientY: 100 };
              }
              showTooltip(configs[i]);
              return true;
            }
          }
          return false;
        },

        hide: function() {
          hideTooltip(true);
          return true;
        },

        isVisible: function() {
          return !!tooltipActive;
        },

        updateConfig: function(targetId, config) {
          var configs = window.__tooltips;
          if (!configs) return false;
          for (var i = 0; i < configs.length; i++) {
            if (configs[i].id === targetId) {
              if (config.content !== undefined) configs[i].content = config.content;
              if (config.position !== undefined) configs[i].position = config.position;
              if (config.allowHTML !== undefined) configs[i].allowHTML = config.allowHTML;
              if (config.showDelay !== undefined) configs[i].showDelay = config.showDelay;
              if (config.hideDelay !== undefined) configs[i].hideDelay = config.hideDelay;
              if (config.customCSS !== undefined) configs[i].customCSS = config.customCSS;
              return true;
            }
          }
          return false;
        },

        getConfig: function(targetId) {
          var configs = window.__tooltips;
          if (!configs) return null;
          for (var i = 0; i < configs.length; i++) {
            if (configs[i].id === targetId) {
              return {
                content: configs[i].content,
                position: configs[i].position,
                allowHTML: configs[i].allowHTML,
                showDelay: configs[i].showDelay,
                hideDelay: configs[i].hideDelay,
                customCSS: configs[i].customCSS
              };
            }
          }
          return null;
        }
      },

      messageBox: {
        show: function(overrides, requestId) {
          showMessageBox(overrides, requestId);
        },

        hide: function() {
          hideMessageBox('close');
        },

        getConfig: function() {
          if (!messageBoxConfig) return null;
          var cfg = {};
          for (var k in messageBoxConfig) {
            if (messageBoxConfig.hasOwnProperty(k)) cfg[k] = messageBoxConfig[k];
          }
          return cfg;
        },

        updateConfig: function(config) {
          if (!messageBoxConfig) messageBoxConfig = {};
          for (var k in config) {
            if (config.hasOwnProperty(k)) messageBoxConfig[k] = config[k];
          }
          return true;
        }
      },

      inputBox: {
        show: function(overrides, requestId) {
          showInputBox(overrides, requestId);
        },

        hide: function() {
          hideInputBox('close');
        },

        getConfig: function() {
          if (!inputBoxConfig) return null;
          var cfg = {};
          for (var k in inputBoxConfig) {
            if (inputBoxConfig.hasOwnProperty(k)) cfg[k] = inputBoxConfig[k];
          }
          return cfg;
        },

        updateConfig: function(config) {
          if (!inputBoxConfig) inputBoxConfig = {};
          for (var k in config) {
            if (config.hasOwnProperty(k)) inputBoxConfig[k] = config[k];
          }
          return true;
        }
      }
    }
  };

  window.webviewBridge.api = wrapAPIObject(window.webviewBridge.api);

  window.webviewBridge.api.public = {
    setValue:              window.webviewBridge.api.setValue,
    getValue:              window.webviewBridge.api.getValue,
    setChecked:            window.webviewBridge.api.setChecked,
    getChecked:            window.webviewBridge.api.getChecked,
    setEnabled:            window.webviewBridge.api.setEnabled,
    isEnabled:             window.webviewBridge.api.isEnabled,
    show:                  window.webviewBridge.api.show,
    hide:                  window.webviewBridge.api.hide,
    toggle:                window.webviewBridge.api.toggle,
    isVisible:             window.webviewBridge.api.isVisible,
    focus:                 window.webviewBridge.api.focus,
    setStyle:              window.webviewBridge.api.setStyle,
    setBlockContextMenu:   window.webviewBridge.api.setBlockContextMenu,
    getBlockContextMenu:   window.webviewBridge.api.getBlockContextMenu,
    getWindowSize:         window.webviewBridge.api.getWindowSize,
    setFixedCanvasSize:    window.webviewBridge.api.canvas.setFixedCanvasSize,
    getIdByName:           window.webviewBridge.api.getIdByName,
    getInfoById:           window.webviewBridge.api.getInfoById,
    showNotification:      window.webviewBridge.api.showNotification,
    sendMessage:           window.webviewBridge.api.sendMessage,
    testReturn:            window.webviewBridge.api.testReturn,
    move:                  window.webviewBridge.api.move,
    setSize:               window.webviewBridge.api.setSize,
    getPosition:           window.webviewBridge.api.getPosition,
    getSize:               window.webviewBridge.api.getSize,
    bringToFront:          window.webviewBridge.api.bringToFront,
    sendToBack:            window.webviewBridge.api.sendToBack,
    setZIndex:             window.webviewBridge.api.setZIndex,
    addMessageListener:    window.webviewBridge.api.addMessageListener,
    removeMessageListener: window.webviewBridge.api.removeMessageListener
  };

  window.webviewBridge.api.canvas = {
    setFixedCanvasSize:    window.webviewBridge.api.canvas.setFixedCanvasSize,
    getTitleBarTitle:    window.webviewBridge.api.canvas.getTitleBarTitle,
    setTitleBarTitle:    window.webviewBridge.api.canvas.setTitleBarTitle
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();