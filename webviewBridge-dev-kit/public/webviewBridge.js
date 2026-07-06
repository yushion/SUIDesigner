/**
 * webviewBridge.js — WebView2 运行时桥接脚本
 * 负责监控所有控件事件并与 WebView2 宿主通信
 * 纯原生 JavaScript，不依赖任何第三方库
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

  /**
   * 判断 BMP 字符码点是否属于图标/符号/dingbat 区块（需转为 [U+XXXX]）
   * 中日韩文字、拉丁扩展等正常文本字符不在此列，保留原样
   */
  function _isIconChar(cp) {
    // 杂项符号 U+2600-U+26FF（★☆�?☁…✕✓✗✘❌✅…）
    if (cp >= 0x2600 && cp <= 0x26FF) return true;
    // 装饰符号 U+2700-U+27BF（✂✃✄✅…✕✖✗✘✙✚…）
    if (cp >= 0x2700 && cp <= 0x27BF) return true;
    // 杂项符号与箭头 U+2B00-U+2BFF（⬀⬁…⬆⬇⭐⭕…）
    if (cp >= 0x2B00 && cp <= 0x2BFF) return true;
    // 几何形状 U+25A0-U+25FF（■□▲△▼▽◆◇○◎●…）
    if (cp >= 0x25A0 && cp <= 0x25FF) return true;
    // 货币符号 U+20A0-U+20CF（₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯…）
    if (cp >= 0x20A0 && cp <= 0x20CF) return true;
    // 类字母符�? U+2100-U+214F（℃℉℗℘…）
    if (cp >= 0x2100 && cp <= 0x214F) return true;
    // 箭头 U+2190-U+21FF（←↑→↓↔↕…）
    if (cp >= 0x2190 && cp <= 0x21FF) return true;
    // 数学运算符 U+2200-U+22FF（∀∁∂∃∄∅…）
    if (cp >= 0x2200 && cp <= 0x22FF) return true;
    // 杂项技术符号 U+2300-U+23FF（⌀⌁⌂⌃⌄⌅⌆⌇⌈⌉⌊⌋…）
    if (cp >= 0x2300 && cp <= 0x23FF) return true;
    // 制表�?/方框绘制 U+2500-U+257F（─━│┃┄…）
    if (cp >= 0x2500 && cp <= 0x257F) return true;
    // 一般标点 U+2000-U+206F（—‖‗…†‡•…‰‹›※‼‽‾⁁）
    if (cp >= 0x2000 && cp <= 0x206F) return true;
    // 半角/全角形式 U+FF00-U+FFEF（全角字母数字和半角片假名之外的特殊符号）
    if (cp >= 0xFF01 && cp <= 0xFF5E) return true;
    if (cp >= 0xFFE0 && cp <= 0xFFE6) return true;
    return false;
  }

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
      // 通用回退：将 iconMap 未能覆盖的非 ASCII 字符转为 [U+XXXX] 格式，兼容易语言等不支持 Unicode 的环境
      return IconManager.sanitize(result);
    },

    /**
     * 通用 Unicode 消毒：仅转换图标/符号/emoji 类字符为 [U+XXXX] 占位符
     * 中日韩文字、拉丁扩展等正常文本字符保留不变
     * - 杂项符号（U+2600-U+26FF）：★☆☀☁☂☃☄★☆☇☈☉☊☋☌☍☎☏☐☑☒☓…✕✓✗✘…
     * - 装饰符号（U+2700-U+27BF）：✂✃✄✅✆✇✈✉✊✋✌✍✎✏✐✑✒✓✔✕✖✗✘…
     * - 杂项符号与箭头（U+2B00-U+2BFF）：⬀⬁⬂⬃⬄⬅⬆⬇⬈⬉⬊⬋⬌⬍⬎⬏…
     * - 表情符号（U+1F600-U+1F64F）、象形符号（U+1F300-U+1F5FF）等
     * - 补充平面字符（codepoint >= 0x10000）
     */
    sanitize: function(str) {
      if (!str || typeof str !== 'string') return str;
      var result = '';
      for (var i = 0; i < str.length; i++) {
        var cp = str.charCodeAt(i);

        // ASCII 直接保留
        if (cp <= 127) {
          result += str.charAt(i);
          continue;
        }

        // 补充平面代理对（高位代理 + 低位代理）
        if (cp >= 0xD800 && cp <= 0xDBFF && i + 1 < str.length) {
          var lo = str.charCodeAt(i + 1);
          if (lo >= 0xDC00 && lo <= 0xDFFF) {
            var fullCp = ((cp - 0xD800) * 0x400) + (lo - 0xDC00) + 0x10000;
            // 补充平面全部视为图标/emoji
            result += '[U+' + fullCp.toString(16).toUpperCase() + ']';
            i++;
            continue;
          }
        }

        // BMP 中仅图标/符号块做转换，文字类字符保留
        if (_isIconChar(cp)) {
          result += '[U+' + cp.toString(16).toUpperCase() + ']';
        } else {
          result += str.charAt(i);
        }
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
    // 对象/数组：原样返回，不做 stringify。宿主 WebView2 自身会序列化 JSON
    return raw;
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
    // 自动计算：先找到行/项元素，再计算同级索引
    var itemEl = el;
    var itemSelector = type === 'row' ? 'tr, .dataGrid_row' : 'li, .listBox_item';
    if (el.closest) {
      var found = el.closest(itemSelector);
      if (found) itemEl = found;
    }
    var container = itemEl.parentElement;
    if (container) {
      var children;
      if (type === 'row') {
        children = Array.prototype.filter.call(container.children, function(c) {
          return c.tagName === 'TR' || (c.classList && c.classList.contains('dataGrid_row'));
        });
      } else {
        children = Array.prototype.filter.call(container.children, function(c) {
          return c.tagName === 'LI' || (c.classList && c.classList.contains('listBox_item'));
        });
      }
      var idx = children.indexOf(itemEl);
      if (idx !== -1) return idx;
    }
    return -1;
  }

  function getNodeId(el) {
    if (el.hasAttribute('data-node-id')) {
      return el.getAttribute('data-node-id');
    }
    var nodeEl = el.closest('.treeView_node');
    if (nodeEl && nodeEl.hasAttribute('data-node-id')) {
      return nodeEl.getAttribute('data-node-id');
    }
    return '';
  }

  function getColKey(el) {
    // 优先取 data-col-key 属性（API 用来定位列）
    var colKey = el.getAttribute('data-col-key');
    if (colKey) return colKey;
    // 自动计算：找到单元格，计算列索引，返回 col0/col1/col2 格式
    var cellEl = el;
    if (el.closest) {
      var found = el.closest('td, th, .dataGrid_cell');
      if (found) cellEl = found;
    }
    var rowEl = cellEl.parentElement;
    if (rowEl) {
      var cells = Array.prototype.filter.call(rowEl.children, function(c) {
        return c.tagName === 'TD' || c.tagName === 'TH' ||
               (c.classList && c.classList.contains('dataGrid_cell'));
      });
      var colIndex = cells.indexOf(cellEl);
      if (colIndex !== -1) {
        return 'col' + colIndex;
      }
    }
    return '';
  }

  function getColName(el) {
    // 获取列名称（给人看的中文名称）
    // 优先级：data-col-name 属性 > 表头 data-col-name > 表头文字
    var cellEl = el;
    if (el.closest) {
      var found = el.closest('td, th, .dataGrid_cell, .dataGrid_header_cell');
      if (found) cellEl = found;
    }
    // 方式1：单元格自身的 data-col-name 属性
    var colName = cellEl.getAttribute('data-col-name');
    if (colName) return colName;
    var rowEl = cellEl.parentElement;
    if (rowEl) {
      var cells = Array.prototype.filter.call(rowEl.children, function(c) {
        return c.tagName === 'TD' || c.tagName === 'TH' ||
               (c.classList && (c.classList.contains('dataGrid_cell') || c.classList.contains('dataGrid_header_cell')));
      });
      var colIndex = cells.indexOf(cellEl);
      if (colIndex !== -1) {
        var tableEl = cellEl.closest ? cellEl.closest('table, .dataGrid') : null;
        if (tableEl) {
          var headerRow = null;
          // 先找 dataGrid 风格的表头
          var dataGridHeader = tableEl.querySelector('.dataGrid_header');
          if (dataGridHeader) {
            headerRow = dataGridHeader;
          }
          // 再找原生 table 的 thead
          if (!headerRow) {
            var thead = tableEl.querySelector('thead');
            if (thead) {
              headerRow = thead.querySelector('tr');
            }
          }
          // 最后找第一行 tr
          if (!headerRow) {
            headerRow = tableEl.querySelector('tr');
          }
          if (headerRow) {
            var headerCells = headerRow.querySelectorAll('th, td, .dataGrid_header_cell, .dataGrid_cell');
            if (headerCells[colIndex]) {
              // 方式2：表头单元格的 data-col-name 属性
              var headerColName = headerCells[colIndex].getAttribute('data-col-name');
              if (headerColName) return headerColName;
              // 方式3：表头文字
              var headerText = headerCells[colIndex].textContent.trim();
              if (headerText) return headerText;
            }
          }
        }
      }
    }
    return '';
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
    var containerTypes = [
      'listBox', 'treeView', 'dataGrid', 'cardBox', 'tabsContainer',
      'logOutput', 'progressBar', 'pageContainer', 'imageBox', 'canvas'
    ];
    while (current) {
      if (current.id) {
        // Layer 1: data-ctrl-type 显式声明
        if (current.hasAttribute && current.hasAttribute('data-ctrl-type')) {
          return current.id;
        }
        // Layer 2: ARIA role
        if (current.getAttribute) {
          var role = current.getAttribute('role');
          if (role && ARIA_ROLE_MAP[role]) {
            var ct = ARIA_ROLE_MAP[role];
            if (containerTypes.indexOf(ct) >= 0 || ct === 'button' || ct === 'inputText') {
              return current.id;
            }
          }
        }
        // Layer 3: CSS class 容器类
        if (current.classList) {
          var cls = current.classList;
          if (cls.contains('listBox') || cls.contains('listBox_scroll') ||
              cls.contains('dataGrid') || cls.contains('dataGrid_container') ||
              cls.contains('treeView') || cls.contains('treeView_children') ||
              cls.contains('cardBox') || cls.contains('tabsContainer') ||
              cls.contains('logOutput') || cls.contains('logOutput_container') ||
              cls.contains('progressBar') || cls.contains('progressBar_container') ||
              cls.contains('imageBox') || cls.contains('pageContainer')) {
            return current.id;
          }
        }
        // Layer 4/5: 原生标签容器
        var tag = (current.tagName || '').toUpperCase();
        if (tag === 'TABLE' || tag === 'UL' || tag === 'OL' ||
            tag === 'PROGRESS' || tag === 'CANVAS') {
          return current.id;
        }
      }
      current = current.parentElement;
    }
    var idEl = el.closest ? el.closest('[id]') : null;
    if (!idEl) {
      var cur = el.parentElement;
      while (cur) {
        if (cur.id) { idEl = cur; break; }
        cur = cur.parentElement;
      }
    }
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

  // ================================================================
  // Layer 2: ARIA Role → ctrlType 映射表（Web 标准语义化识别）
  // 使用标准 role 属性替代硬编码的 data-ctrl-type
  // ================================================================
  var ARIA_ROLE_MAP = {
    'button': 'button',
    'link': 'hyperLink',
    'textbox': 'inputText',
    'textarea': 'textarea',
    'checkbox': 'checkbox',
    'radio': 'radio',
    'listbox': 'listBox',
    'option': 'listBox_item',
    'tree': 'treeView',
    'treeitem': 'treeview_node_text',
    'grid': 'dataGrid',
    'gridcell': 'dataGrid_cell',
    'row': 'dataGrid_row',
    'columnheader': 'dataGrid_header',
    'tablist': 'tabsContainer',
    'tab': 'tabsContainer_headerBar_btn',
    'tabpanel': 'tabsContainer_panel',
    'progressbar': 'progressBar',
    'img': 'imageBox',
    'log': 'logOutput',
    'status': 'label',
    'article': 'cardBox',
    'region': 'cardBox',
    'combobox': 'comboBox',
    'searchbox': 'inputText',
    'slider': 'progressBar',
    'switch': 'switchToggle',
    'menuitem': 'button'
  };

  /**
   * 从 ARIA role 属性推断 ctrlType（Layer 2，标准语义化识别）
   * @param {Element} el - DOM 元素
   * @returns {string} ctrlType 或空字符串
   */
  function inferCtrlTypeFromAria(el) {
    if (!el) return '';
    var current = el;
    while (current) {
      if (current.getAttribute) {
        var role = current.getAttribute('role');
        if (role && ARIA_ROLE_MAP[role]) {
          return ARIA_ROLE_MAP[role];
        }
      }
      current = current.parentElement;
    }
    return '';
  }

  // ================================================================
  // Layer 5: 原生 HTML 标签 → ctrlType 自动推断映射表（兜底检测）
  // 让纯 HTML 元素无需 data-ctrl-type 也能被识别
  // ================================================================
  var NATIVE_TAG_MAP = {
    'BUTTON': 'button',
    'A': 'hyperLink',
    'SELECT': 'comboBox',
    'TEXTAREA': 'textarea',
    'INPUT': function(el) {
      var t = (el.type || 'text').toLowerCase();
      var map = {
        'text': 'inputText', 'password': 'inputText', 'email': 'inputText',
        'number': 'inputText', 'tel': 'inputText', 'url': 'inputText', 'search': 'inputText',
        'checkbox': 'checkbox', 'radio': 'radio',
        'range': 'progressBar', 'datetime-local': 'datetimePicker',
        'date': 'datetimePicker', 'time': 'datetimePicker', 'color': 'inputText',
        'submit': 'button', 'reset': 'button', 'button': 'button'
      };
      return map[t] || 'inputText';
    },
    'SPAN': 'label',
    'LABEL': function(el) {
      var input = el.querySelector('input[type="checkbox"], input[type="radio"]');
      if (input) return (input.type === 'checkbox') ? 'checkbox' : 'radio';
      return 'label';
    },
    'IMG': 'imageBox',
    'UL': 'listBox',
    'OL': 'listBox',
    'TABLE': 'dataGrid',
    'PROGRESS': 'progressBar',
    'CANVAS': 'canvas'
  };

  /**
   * 从原生 HTML 标签推断 ctrlType（Layer 5，兜底检测）
   * @param {Element} el - DOM 元素
   * @returns {string} ctrlType 或空字符串
   */
  function inferCtrlTypeFromTag(el) {
    if (!el) return '';
    var tag = el.tagName.toUpperCase();
    var handler = NATIVE_TAG_MAP[tag];
    if (!handler) return '';
    if (typeof handler === 'function') return handler(el);
    return handler;
  }

  // ================================================================
  // Layer 4: DOM 结构特征智能推断
  // 通过分析 DOM 结构特征自动识别复杂控件，无需任何特殊属性
  // ================================================================

  /**
   * 判断元素是否在列表容器内
   * @param {Element} el - 元素
   * @returns {Element|null} 列表容器或 null
   */
  function findListContainer(el) {
    if (!el) return null;
    var current = el.parentElement;
    while (current) {
      var tag = current.tagName || '';
      tag = tag.toUpperCase();
      if (tag === 'UL' || tag === 'OL') return current;
      if (current.getAttribute && current.getAttribute('role') === 'listbox') return current;
      if (current.classList && (
        current.classList.contains('listBox') ||
        current.classList.contains('listbox') ||
        current.classList.contains('list-container')
      )) return current;
      current = current.parentElement;
    }
    return null;
  }

  /**
   * 判断元素是否在表格容器内
   * @param {Element} el - 元素
   * @returns {Element|null} 表格容器或 null
   */
  function findGridContainer(el) {
    if (!el) return null;
    var current = el.parentElement;
    while (current) {
      var tag = current.tagName || '';
      tag = tag.toUpperCase();
      if (tag === 'TABLE') return current;
      if (current.getAttribute && current.getAttribute('role') === 'grid') return current;
      if (current.classList && (
        current.classList.contains('dataGrid') ||
        current.classList.contains('datagrid') ||
        current.classList.contains('grid') ||
        current.classList.contains('table-container')
      )) return current;
      current = current.parentElement;
    }
    return null;
  }

  /**
   * 判断元素是否在树形容器内
   * @param {Element} el - 元素
   * @returns {Element|null} 树形容器或 null
   */
  function findTreeContainer(el) {
    if (!el) return null;
    var current = el.parentElement;
    while (current) {
      if (current.getAttribute && current.getAttribute('role') === 'tree') return current;
      if (current.classList && (
        current.classList.contains('treeView') ||
        current.classList.contains('treeview') ||
        current.classList.contains('tree')
      )) return current;
      var tag = current.tagName || '';
      tag = tag.toUpperCase();
      if (tag === 'UL' || tag === 'OL') {
        var parent = current.parentElement;
        if (parent) {
          var pTag = (parent.tagName || '').toUpperCase();
          if (pTag === 'LI') return findTreeRoot(current);
        }
      }
      current = current.parentElement;
    }
    return null;
  }

  /**
   * 找到树的根容器
   */
  function findTreeRoot(el) {
    var current = el;
    while (current && current.parentElement) {
      var parent = current.parentElement;
      var pTag = (parent.tagName || '').toUpperCase();
      if (pTag !== 'LI' && pTag !== 'UL' && pTag !== 'OL') {
        return current;
      }
      if (pTag === 'UL' || pTag === 'OL') {
        current = parent;
      } else {
        break;
      }
    }
    return current;
  }

  /**
   * 判断元素是否在标签页容器内
   * @param {Element} el - 元素
   * @returns {Element|null} 标签页容器或 null
   */
  function findTabsContainer(el) {
    if (!el) return null;
    var current = el.parentElement;
    while (current) {
      if (current.getAttribute && current.getAttribute('role') === 'tablist') return current;
      if (current.classList && (
        current.classList.contains('tabsContainer') ||
        current.classList.contains('tabs') ||
        current.classList.contains('tab-container')
      )) return current;
      current = current.parentElement;
    }
    return null;
  }

  /**
   * 判断元素是否在卡片容器内
   * @param {Element} el - 元素
   * @returns {Element|null} 卡片容器或 null
   */
  function findCardContainer(el) {
    if (!el) return null;
    var current = el.parentElement;
    var depth = 0;
    while (current && depth < 5) {
      if (current.classList && (
        current.classList.contains('cardBox') ||
        current.classList.contains('card')
      )) return current;
      if (current.getAttribute) {
        var role = current.getAttribute('role');
        if (role === 'article' || role === 'region') return current;
      }
      current = current.parentElement;
      depth++;
    }
    return null;
  }

  /**
   * 判断是否为列表项复选框
   */
  function isListCheckbox(el) {
    var listContainer = findListContainer(el);
    if (!listContainer) return false;
    var li = el.closest ? el.closest('li') : null;
    if (!li) {
      var cur = el.parentElement;
      for (var i = 0; i < 3 && cur; i++) {
        if (cur.classList && (cur.classList.contains('listBox_item') || cur.classList.contains('list-item'))) {
          return true;
        }
        cur = cur.parentElement;
      }
    }
    return !!li;
  }

  /**
   * 判断是否为表格行复选框
   */
  function isGridCheckbox(el) {
    var gridContainer = findGridContainer(el);
    if (!gridContainer) return false;
    var tr = el.closest ? el.closest('tr') : null;
    if (!tr) {
      var cur = el.parentElement;
      for (var i = 0; i < 3 && cur; i++) {
        if (cur.classList && (cur.classList.contains('dataGrid_row') || cur.classList.contains('table-row'))) {
          return true;
        }
        cur = cur.parentElement;
      }
    }
    return !!tr;
  }

  /**
   * 通过 DOM 结构特征推断 ctrlType（Layer 4，智能识别）
   * @param {Element} el - DOM 元素
   * @returns {string} ctrlType 或空字符串
   */
  function inferCtrlTypeFromStructure(el) {
    if (!el) return '';
    var tag = (el.tagName || '').toUpperCase();

    // 复选框：判断是独立的还是在列表/表格里
    if (tag === 'INPUT' && el.type === 'checkbox') {
      if (isGridCheckbox(el)) return 'dataGrid_row_checkbox';
      if (isListCheckbox(el)) return 'listbox_item_checkbox';
      return 'checkbox';
    }

    // 列表项识别
    if (tag === 'LI') {
      var listEl = findListContainer(el);
      if (listEl) return 'listBox_item';
    }

    // 表格单元格识别
    if (tag === 'TD' || tag === 'TH') {
      var gridEl = findGridContainer(el);
      if (gridEl) return tag === 'TH' ? 'dataGrid_header' : 'dataGrid_cell';
    }

    // 表格行识别
    if (tag === 'TR') {
      var gridEl2 = findGridContainer(el);
      if (gridEl2) return 'dataGrid';
    }

    // 树节点识别
    var treeEl = findTreeContainer(el);
    if (treeEl) {
      if (tag === 'LI') return 'treeview_node_text';
      if (el.classList && el.classList.contains('toggle')) return 'treeview_node_toggle';
      if (tag === 'SPAN' || tag === 'DIV') {
        var parentLi = el.closest ? el.closest('li') : null;
        if (parentLi) return 'treeview_node_text';
      }
    }

    // 标签页识别
    var tabsEl = findTabsContainer(el);
    if (tabsEl) {
      if (el.classList && (
        el.classList.contains('tab') ||
        el.classList.contains('tabsContainer_headerBar_btn') ||
        el.classList.contains('tab-item')
      )) return 'tabsContainer_headerBar_btn';
      if (tag === 'BUTTON' || tag === 'DIV') {
        if (el.getAttribute && el.getAttribute('role') === 'tab') return 'tabsContainer_headerBar_btn';
      }
    }

    // 卡片识别
    var cardEl = findCardContainer(el);
    if (cardEl && (el.classList && el.classList.contains('card-body'))) {
      return 'cardBox_body';
    }

    return '';
  }

  /**
   * 五层智能识别机制（从高到低优先级）：
   * Layer 1: data-ctrl-type 显式声明（向后兼容，最高优先级）
   * Layer 2: ARIA role 语义化角色（Web 标准）
   * Layer 3: CSS class 约定命名（现有约定）
   * Layer 4: DOM 结构特征推断（智能识别）
   * Layer 5: 原生 HTML 标签推断（兜底检测）
   */

  /**
   * 获取控件检测来源（用于消息溯源）
   * @param {Element} el - DOM 元素
   * @param {string} ctrlType - 已识别的 ctrlType
   * @returns {string} 'explicit' | 'aria' | 'css' | 'structure' | 'native'
   */
  function getCtrlSource(el, ctrlType, sourceEl) {
    if (!ctrlType) return '';
    if (!el && !sourceEl) return 'unknown';
    var detectEl = sourceEl || el;
    // Layer 1: 显式 data-ctrl-type
    var current = detectEl;
    while (current) {
      if (current.hasAttribute && current.hasAttribute('data-ctrl-type')) return 'explicit';
      current = current.parentElement;
    }
    // Layer 2: ARIA role（先检测源元素，再检测根元素）
    if (inferCtrlTypeFromAria(detectEl) === ctrlType) return 'aria';
    if (el && el !== detectEl && inferCtrlTypeFromAria(el) === ctrlType) return 'aria';
    // Layer 3: CSS class 检测
    if (inferCtrlTypeFromCss(detectEl) === ctrlType) return 'css';
    if (el && el !== detectEl && inferCtrlTypeFromCss(el) === ctrlType) return 'css';
    // Layer 4: DOM 结构特征推断
    if (inferCtrlTypeFromStructure(detectEl) === ctrlType) return 'structure';
    if (el && el !== detectEl && inferCtrlTypeFromStructure(el) === ctrlType) return 'structure';
    // Layer 5: 原生 HTML 标签推断
    if (inferCtrlTypeFromTag(detectEl) === ctrlType) return 'native';
    if (el && el !== detectEl && inferCtrlTypeFromTag(el) === ctrlType) return 'native';
    return 'unknown';
  }

  /**
   * 从 CSS class 推断 ctrlType（Layer 3，约定命名）
   * @param {Element} el - DOM 元素
   * @returns {string} ctrlType 或空字符串
   */
  function inferCtrlTypeFromCss(el) {
    if (!el) return '';
    var current = el;
    while (current) {
      if (current.classList) {
        if (current.classList.contains('treeView_toggle')) return 'treeview_node_toggle';
        if (current.classList.contains('treeView_label')) return 'treeview_node_text';
        if (current.classList.contains('treeView_node_content')) {
          var lbl = current.querySelector('.treeView_label');
          if (lbl && lbl === el) return 'treeview_node_text';
          var tgl = current.querySelector('.treeView_toggle');
          if (tgl && tgl === el) return 'treeview_node_toggle';
        }
        if (current.classList.contains('listBox_scroll')) return 'listBox';
        if (current.classList.contains('listBox_item')) return 'listBox_item';
        if (current.classList.contains('listBox_item_text')) return 'listBox_item';
        if (current.classList.contains('listBox_item-checkbox')) return 'listbox_item_checkbox';
        if (current.classList.contains('logOutput_container')) return 'logOutput';
        if (current.classList.contains('logOutput_line')) return 'logOutput_item';
        if (current.classList.contains('dataGrid_container')) return 'dataGrid';
        if (current.classList.contains('dataGrid_body')) return 'dataGrid';
        if (current.classList.contains('dataGrid_header')) return 'dataGrid';
        if (current.classList.contains('dataGrid_cell')) return 'dataGrid_cell';
        if (current.classList.contains('dataGrid_row')) return 'dataGrid';
        if (current.classList.contains('treeView_children')) return 'treeView';
        if (current.classList.contains('treeView_node')) return 'treeView';
        if (current.classList.contains('pageContainer')) return 'pageContainer';
        if (current.classList.contains('progressBar_container')) return 'progressBar';
      }
      current = current.parentElement;
    }
    return '';
  }

  /**
   * 检测控件类型（五层智能识别，从高到低优先级）
   * @param {Element} el - DOM 元素
   * @returns {string} ctrlType 或空字符串
   */
  function detectCtrlType(el) {
    if (!el) return '';
    var result;

    // Layer 1: data-ctrl-type 显式声明（最高优先级，向后兼容）
    var current = el;
    while (current) {
      if (current.hasAttribute && current.hasAttribute('data-ctrl-type')) {
        return current.getAttribute('data-ctrl-type');
      }
      current = current.parentElement;
    }

    // Layer 2: ARIA role 语义化角色（Web 标准）
    result = inferCtrlTypeFromAria(el);
    if (result) return result;

    // Layer 3: CSS class 约定命名
    result = inferCtrlTypeFromCss(el);
    if (result) return result;

    // Layer 4: DOM 结构特征推断（智能识别）
    result = inferCtrlTypeFromStructure(el);
    if (result) return result;

    // Layer 5: 原生 HTML 标签兜底推断
    return inferCtrlTypeFromTag(el) || '';
  }

  // ================================================================
  // 智能名称推断：自动从 DOM 中获取控件的中文名称
  // 当没有设置 data-name 时，自动推断一个直观的名称
  // ================================================================

  /**
   * 获取关联的 label 元素文本
   */
  function getAssociatedLabelText(el) {
    if (!el) return '';
    // 方式1: id 关联的 label
    if (el.id) {
      var label = document.querySelector('label[for="' + el.id + '"]');
      if (label) return label.textContent.trim();
    }
    // 方式2: 父级 label 包裹
    var parentLabel = el.closest ? el.closest('label') : null;
    if (!parentLabel) {
      var cur = el.parentElement;
      for (var i = 0; i < 3 && cur; i++) {
        if (cur.tagName === 'LABEL') { parentLabel = cur; break; }
        cur = cur.parentElement;
      }
    }
    if (parentLabel) return parentLabel.textContent.trim();
    return '';
  }

  /**
   * 获取前面的文本（用于复选框、单选框等）
   */
  function getFollowingText(el) {
    if (!el) return '';
    // 检查后面的兄弟节点文本
    if (el.nextSibling && el.nextSibling.nodeType === 3) {
      var text = el.nextSibling.textContent.trim();
      if (text) return text;
    }
    // 检查父元素的文本
    if (el.parentElement) {
      var pText = el.parentElement.textContent.trim();
      if (pText && pText.length < 50) return pText;
    }
    return '';
  }

  /**
   * 智能推断控件名称（customname）
   * 优先级：data-name > aria-label > 关联 label > 文本内容 > placeholder > title > alt > id
   * @param {Element} el - 控件元素
   * @param {string} ctrlType - 控件类型
   * @param {Element} sourceEl - 事件源元素（可能是子元素）
   * @returns {string} 推断出的名称
   */
  function inferControlName(el, ctrlType, sourceEl) {
    if (!el) return '';
    var actualEl = sourceEl || el;

    // 1. 优先取 data-name
    var dataName = el.getAttribute('data-name');
    if (dataName) return dataName;

    // 2. aria-label
    var ariaLabel = actualEl.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    // 3. 根据控件类型推断
    switch (ctrlType) {
      case 'button':
      case 'iconButton':
        return getOriginalText(actualEl) || actualEl.value || '';

      case 'inputText':
      case 'textarea':
      case 'datetimePicker':
        // 先找 label，再找 placeholder
        var labelText = getAssociatedLabelText(actualEl);
        if (labelText) return labelText;
        var placeholder = actualEl.getAttribute('placeholder');
        if (placeholder) return placeholder;
        break;

      case 'checkbox':
      case 'radio':
      case 'switchToggle':
        // 找 label 或后面的文本
        var cbLabel = getAssociatedLabelText(actualEl);
        if (cbLabel) return cbLabel;
        var followText = getFollowingText(actualEl);
        if (followText) return followText;
        break;

      case 'comboBox':
        var selLabel = getAssociatedLabelText(actualEl);
        if (selLabel) return selLabel;
        if (actualEl.options && actualEl.selectedIndex >= 0) {
          return actualEl.options[actualEl.selectedIndex].text || '';
        }
        break;

      case 'hyperLink':
        return getOriginalText(actualEl) || actualEl.getAttribute('data-href') || actualEl.href || '';

      case 'label':
        return getOriginalText(actualEl);

      case 'imageBox':
        return actualEl.getAttribute('alt') || actualEl.getAttribute('title') || '';

      case 'listBox':
      case 'listBox_item':
        var listEl = actualEl.tagName === 'LI' ? actualEl : (actualEl.querySelector('li') || actualEl);
        var itemText = listEl ? listEl.textContent.trim() : '';
        if (itemText && itemText.length < 30) return itemText;
        break;

      case 'listbox_item_checkbox':
        var item = findListContainer(actualEl);
        if (item) {
          var li = actualEl.closest ? actualEl.closest('li') : null;
          if (li) return li.textContent.trim().substring(0, 30);
        }
        break;

      case 'dataGrid':
      case 'dataGrid_cell':
        var td = actualEl.tagName === 'TD' || actualEl.tagName === 'TH' ? actualEl : (actualEl.querySelector('td') || actualEl);
        var cellText = td ? td.textContent.trim() : '';
        if (cellText && cellText.length < 30) return cellText;
        break;

      case 'dataGrid_row_checkbox':
        var tr = actualEl.closest ? actualEl.closest('tr') : null;
        if (tr) {
          var tds = tr.querySelectorAll('td');
          for (var i = 0; i < tds.length; i++) {
            var t = tds[i].textContent.trim();
            if (t && t.length < 30 && t.length > 0) return t;
          }
        }
        break;

      case 'treeview_node_text':
      case 'treeview_node_toggle':
      case 'treeView':
        var nodeText = actualEl.textContent ? actualEl.textContent.trim() : '';
        if (nodeText && nodeText.length < 30) return nodeText;
        break;

      case 'tabsContainer':
      case 'tabsContainer_headerBar_btn':
        var tabText = actualEl.textContent ? actualEl.textContent.trim() : '';
        if (tabText && tabText.length < 20) return tabText;
        break;

      case 'progressBar':
        var progText = actualEl.textContent ? actualEl.textContent.trim() : '';
        if (progText) return progText;
        var progLabel = getAssociatedLabelText(actualEl);
        if (progLabel) return progLabel;
        break;

      case 'logOutput':
      case 'logOutput_item':
        var logText = actualEl.textContent ? actualEl.textContent.trim() : '';
        if (logText && logText.length < 50) return logText.substring(0, 30);
        break;

      case 'cardBox':
      case 'cardBox_body':
        var cardTitle = actualEl.querySelector('.cardBox_header_title, .card-title, [class*="title"]');
        if (cardTitle) return cardTitle.textContent.trim().substring(0, 30);
        break;
    }

    // 4. title 属性
    var title = actualEl.getAttribute('title');
    if (title) return title;

    // 5. 最后用 id 兜底
    if (el.id) return el.id;

    return '';
  }

  /**
   * ctrlType 到中文基础类型的映射
   */
  var CTRL_TYPE_CN_MAP = {
    'button': '按钮',
    'iconButton': '图标按钮',
    'inputText': '输入框',
    'textarea': '文本域',
    'checkbox': '复选框',
    'radio': '单选框',
    'switchToggle': '开关',
    'comboBox': '组合框',
    'hyperLink': '超链接',
    'label': '文本标签',
    'imageBox': '图片框',
    'progressBar': '进度条',
    'datetimePicker': '时间框',
    'listBox': '列表框',
    'listBox_item': '列表项',
    'listbox_item_checkbox': '列表复选框',
    'treeView': '树形框',
    'treeview_node_text': '树节点',
    'treeview_node_toggle': '树节点开关',
    'dataGrid': '数据表格',
    'dataGrid_cell': '表格单元格',
    'dataGrid_row_checkbox': '表格行复选框',
    'dataGrid_header': '表格表头',
    'cardBox': '卡片框',
    'cardBox_body': '卡片主体',
    'tabsContainer': '标签页',
    'tabsContainer_headerBar_btn': '标签按钮',
    'logOutput': '日志框',
    'logOutput_item': '日志项',
    'canvas': '画布',
    'pageContainer': '页面容器'
  };

  /**
   * 智能推断控件基础类型（basictype）
   * 优先级：data-type > 自动从 ctrlType 映射中文名称
   * @param {Element} el - 控件元素
   * @param {string} ctrlType - 控件类型
   * @returns {string} 中文基础类型
   */
  function inferBasicType(el, ctrlType) {
    if (!el) return '';
    // 优先取 data-type
    var dataType = el.getAttribute('data-type');
    if (dataType) return dataType;
    // 自动从 ctrlType 映射
    if (ctrlType && CTRL_TYPE_CN_MAP[ctrlType]) {
      return CTRL_TYPE_CN_MAP[ctrlType];
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
    if (ctrlType === 'listBox_item') {
      var textEl = el.querySelector('.listBox_item_text');
      if (textEl) return getOriginalText(textEl);
      return getOriginalText(el);
    }
    if (ctrlType === 'listbox_item_checkbox') {
      var itemEl = el.closest('.listBox_item');
      if (itemEl) return getItemLabel(itemEl, 'listBox_item');
      return '';
    }
    if (ctrlType === 'treeview_node_text') {
      return getOriginalText(el);
    }
    if (ctrlType === 'treeview_node_toggle') {
      var node = el.closest('.treeView_node');
      if (node) {
        var label = node.querySelector('.treeView_label');
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

  function send(action, ctrlType, targetId, data, sourceEl) {
    var targetEl = targetId ? findTarget(targetId) : null;
    // v2: 自动推断控件来源（explicit / aria / css / structure / native）
    var source = getCtrlSource(targetEl, ctrlType, sourceEl);
    // v3: 智能推断 customname 和 basictype
    var customname = targetEl ? inferControlName(targetEl, ctrlType, sourceEl) : '';
    var basictype = targetEl ? inferBasicType(targetEl, ctrlType) : '';
    var msg = {
      title: document.title || '',
      action: action,
      customname: customname,
      targetId: targetId,
      basictype: basictype,
      ctrlType: ctrlType,
      source: source,
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
      case 'hyperLink':
        data.value = el.getAttribute('data-href') || el.href || getOriginalText(el);
        break;
      case 'iconButton':
        data.value = getOriginalText(el);
        break;
      case 'tabsContainer_headerBar_btn':
        data.value = el.textContent || '';
        break;
      case 'inputText':
      case 'textarea':
        data.value = el.value || '';
        break;
      case 'checkbox':
        data.checked = el.checked || false;
        data.value = el.checked ? 'on' : 'off';
        break;
      case 'switchToggle':
        data.checked = el.checked || false;
        data.value = el.checked ? 'on' : 'off';
        break;
      case 'radio':
        data.index = getRadioIndex(el);
        data.value = el.value || '';
        data.groupName = el.name || '';
        data.checked = el.checked || false;
        break;
      case 'comboBox':
        data.value = el.value || '';
        data.index = el.selectedIndex;
        data.text = el.options && el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : '';
        break;
      case 'progressBar':
        var progressRoot = el.closest('[data-ctrl-type="progressBar"]');
        if (!progressRoot) break;
        var fillEl = progressRoot.querySelector('.progressBar_fill');
        var textEl = progressRoot.querySelector('.progressBar_text');
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
      case 'datetimePicker':
        data.value = el.value || '';
        break;
      case 'listBox_item':
        data.itemIndex = getElementIndex(el, 'item');
        data.label = getItemLabel(el, ctrlType);
        break;
      case 'listbox_item_checkbox':
        data.itemIndex = getElementIndex(el, 'item');
        data.checked = el.checked || false;
        data.label = getItemLabel(el, ctrlType);
        break;
      case 'dataGrid_row_checkbox':
        data.rowIndex = getElementIndex(el, 'row');
        data.checked = el.checked || false;
        break;
      case 'dataGrid_cell':
        data.rowIndex = getElementIndex(el, 'row');
        data.colKey = getColKey(el);
        data.colName = getColName(el);
        data.value = getOriginalText(el);
        break;
      case 'treeview_node_text':
        data.nodeId = getNodeId(el);
        data.text = getOriginalText(el);
        data.value = data.text;
        break;
      case 'treeview_node_toggle':
        data.nodeId = getNodeId(el);
        var nodeEl = el.closest('.treeView_node');
        if (nodeEl) {
          var childrenEl = directChild(nodeEl, '.treeView_children');
          data.expanded = childrenEl ? (childrenEl.style.display !== 'none') : false;
        } else {
          data.expanded = false;
        }
        data.text = getItemLabel(el, 'treeview_node_toggle');
        data.value = data.text;
        break;
      case 'cardBox_body':
        var cardEl = el.closest('.cardBox');
        if (cardEl) {
          data.collapsed = cardEl.getAttribute('data-collapsed') === 'true';
          var cardTitleEl = cardEl.querySelector('.cardBox_header_title');
          data.cardTitle = cardTitleEl ? (cardTitleEl.textContent || '') : '';
          data.tabTxt = data.cardTitle;
        }
        break;
      case 'logOutput_item':
        data.value = el.textContent || '';
        break;
      case 'label':
        data.value = el.textContent || '';
        break;
      case 'imageBox':
      case 'canvas':
        break;
      case 'cardBox':
        var cEl = el.closest('.cardBox') || el;
        data.collapsed = cEl.getAttribute('data-collapsed') === 'true';
        var cTitle = cEl.querySelector('.cardBox_header_title');
        data.cardTitle = cTitle ? (cTitle.textContent || '') : '';
        data.tabTxt = data.cardTitle;
        break;
      case 'tabsContainer':
        var tEl = el.closest('.tabsContainer') || el.closest('[data-ctrl-type="tabsContainer"]') || el;
        var ab = tEl.querySelector('.tabsContainer_headerBar_btn.active');
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
    if (ctrlType === 'listBox_item') {
      var listContainer = e.target.closest('[data-ctrl-type="listBox"]');
      if (listContainer) {
        if (e.ctrlKey && listContainer.getAttribute('data-show-checkbox') === 'true') {
          var cbItem = e.target.closest('.listBox_item');
          if (cbItem) {
            var cb = cbItem.querySelector('.listBox_item-checkbox');
            if (cb) { cb.checked = !cb.checked; return; }
          }
        }
        var allItems = listContainer.querySelectorAll('.listBox_item');
        for (var li = 0; li < allItems.length; li++) {
          allItems[li].classList.remove('item-selected');
        }
        var clickedItem = e.target.closest('.listBox_item');
        if (clickedItem) clickedItem.classList.add('item-selected');
        lastActiveListbox = listContainer;
      }
    }
    if (ctrlType === 'dataGrid_cell') {
      var gridContainer = e.target.closest('[data-ctrl-type="dataGrid"]');
      if (gridContainer) {
        if (e.ctrlKey && gridContainer.getAttribute('data-show-checkbox') === 'true') {
          var cbRow = e.target.closest('.dataGrid_row');
          if (cbRow) {
            var cb = cbRow.querySelector('.dataGrid_row_check');
            if (cb) { cb.checked = !cb.checked; return; }
          }
        }
        var allRows = gridContainer.querySelectorAll('.dataGrid_row');
        for (var ri = 0; ri < allRows.length; ri++) {
          allRows[ri].classList.remove('dataGrid_row-focused');
        }
        var clickedRow = e.target.closest('.dataGrid_row');
        if (clickedRow) clickedRow.classList.add('dataGrid_row-focused');
        lastActiveDataGrid = gridContainer;
      }
    }
    if (ctrlType === 'treeview_node_toggle') {
      send('nodeToggle', ctrlType, targetId, data, e.target);
      return;
    }
    if (ctrlType === 'treeview_node_text' || ctrlType === 'treeView') {
      var treeContainer = e.target.closest('[data-type="treeView"]');
      if (treeContainer) {
        if (e.ctrlKey && treeContainer.getAttribute('data-show-checkbox') === 'true') {
          var cbContent = e.target.closest('.treeView_node_content');
          if (cbContent) {
            var cb = cbContent.querySelector('.treeView_node-check');
            if (cb) { cb.checked = !cb.checked; return; }
          }
        }
        var clickedContent = e.target.closest('.treeView_node_content');
        if (clickedContent) {
          var allNodes = treeContainer.querySelectorAll('.treeView_node.selected');
          for (var tn = 0; tn < allNodes.length; tn++) {
            allNodes[tn].classList.remove('selected');
          }
          var clickedNode = clickedContent.closest('.treeView_node');
          if (clickedNode) clickedNode.classList.add('selected');
        } else if (treeContainer.getAttribute('data-always-show-selection') !== 'true') {
          var allNodes = treeContainer.querySelectorAll('.treeView_node.selected');
          for (var tn = 0; tn < allNodes.length; tn++) {
            allNodes[tn].classList.remove('selected');
          }
        }
        lastActiveTreeView = treeContainer;
      }
    }
    if (ctrlType === 'tabsContainer_headerBar_btn') {
      var tabContainer = e.target.closest('.tabsContainer') || e.target.closest('[data-ctrl-type="tabsContainer"]');
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
    if (ctrlType === 'cardBox_body' || ctrlType === 'cardBox') {
      var cardRoot = e.target.closest('.cardBox');
      if (cardRoot) {
        var cardId = cardRoot.id || targetId;
        if (!data.collapsed) data.collapsed = cardRoot.getAttribute('data-collapsed') === 'true';
        if (!data.cardTitle) {
          var ctEl = cardRoot.querySelector('.cardBox_header_title');
          data.cardTitle = ctEl ? (ctEl.textContent || '') : '';
          data.tabTxt = data.cardTitle;
        }
        var collapseBtn = e.target.closest('.cardBox_collapse_btn');
        if (collapseBtn) {
          data.isCollapseBtn = true;
          data.collapsed = cardRoot.getAttribute('data-collapsed') === 'true';
          send('click', 'cardBox', cardId, data);
          return;
        }
        var cardHeader = e.target.closest('.cardBox_header');
        if (cardHeader) {
          data.isHeader = true;
          send('click', 'cardBox', cardId, data);
          return;
        }
        send('click', ctrlType, cardId, data);
        return;
      }
    }
    if (ctrlType === 'tabsContainer') {
      var tabRoot = e.target.closest('.tabsContainer') || e.target.closest('[data-ctrl-type="tabsContainer"]');
      if (tabRoot) {
        var tcId = tabRoot.id || targetId;
        var activeBtn = tabRoot.querySelector('.tabsContainer_headerBar_btn.active');
        data.tabName = activeBtn ? (activeBtn.getAttribute('data-tab-name') || '') : '';
        data.tabTxt = activeBtn ? (activeBtn.textContent || '') : '';
        send('click', ctrlType, tcId, data);
        return;
      }
    }
    if (lastActiveListbox) {
      var clickedInListbox = e.target.closest('[data-ctrl-type="listBox"]');
      if (clickedInListbox !== lastActiveListbox) {
        if (lastActiveListbox.getAttribute('data-always-show-selection') !== 'true') {
          var clearItems = lastActiveListbox.querySelectorAll('.listBox_item');
          for (var cl = 0; cl < clearItems.length; cl++) {
            clearItems[cl].classList.remove('item-selected');
          }
        }
        lastActiveListbox = null;
      }
    }
    if (lastActiveDataGrid) {
      var clickedInGrid = e.target.closest('[data-ctrl-type="dataGrid"]');
      if (clickedInGrid !== lastActiveDataGrid) {
        if (lastActiveDataGrid.getAttribute('data-always-show-selection') !== 'true') {
          var clearRows = lastActiveDataGrid.querySelectorAll('.dataGrid_row');
          for (var cr = 0; cr < clearRows.length; cr++) {
            clearRows[cr].classList.remove('dataGrid_row-focused');
          }
        }
        lastActiveDataGrid = null;
      }
    }
    if (lastActiveTreeView) {
      var clickedInTree = e.target.closest('[data-type="treeView"]');
      if (clickedInTree !== lastActiveTreeView) {
        if (lastActiveTreeView.getAttribute('data-always-show-selection') !== 'true') {
          var clearNodes = lastActiveTreeView.querySelectorAll('.treeView_node.selected');
          for (var cn = 0; cn < clearNodes.length; cn++) {
            clearNodes[cn].classList.remove('selected');
          }
        }
        lastActiveTreeView = null;
      }
    }
    var clickableTypes = [
      'button', 'hyperLink', 'iconButton',
      'inputText', 'textarea', 'checkbox', 'radio', 'switchToggle',
      'comboBox', 'datetimePicker', 'progressBar',
      'listBox_item', 'dataGrid_cell', 'dataGrid_row_checkbox',
      'treeview_node_text',
      'logOutput_item', 'label', 'imageBox', 'canvas',
      'logOutput', 'listBox', 'dataGrid', 'treeView',
      'cardBox', 'cardBox_body', 'tabsContainer',
      'radioGroup', 'pageContainer',
      'titlebar_left_icon', 'titlebar_title', 'titlebar_min', 'titlebar_max', 'titlebar_close'
    ];
    if (clickableTypes.indexOf(ctrlType) !== -1) {
      send('click', ctrlType, targetId, data, e.target);
    }
  }

  function handleChange(e) {
    var selectAll = e.target.closest('.dataGrid_select_all');
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
    var changeTypes = ['checkbox', 'switchToggle', 'radio', 'comboBox', 'datetimePicker', 'listbox_item_checkbox', 'dataGrid_row_checkbox'];
    if (changeTypes.indexOf(ctrlType) !== -1) {
      send('change', ctrlType, targetId, data, e.target);
      return;
    }
  }

  function handleInput(e) {
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    if (ctrlType === 'inputText' || ctrlType === 'textarea') {
      var targetId = getRootWidgetId(e.target);
      var data = extractEventData(e.target, ctrlType, e);
      send('change', ctrlType, targetId, data, e.target);
      return;
    }
  }

  function handleBlur(e) {
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    if (ctrlType === 'inputText' || ctrlType === 'textarea') {
      var targetId = getRootWidgetId(e.target);
      var newValue = e.target.value || '';
      var oldValue = inputOldValues[targetId] !== undefined ? inputOldValues[targetId] : newValue;
      var data = extractEventData(e.target, ctrlType, e);
      data.value = newValue;
      data.oldvalue = oldValue;
      data.type = 'end';
      send('change', ctrlType, targetId, data, e.target);
      return;
    }
  }

  function handleFocus(e) {
    var ctrlType = detectCtrlType(e.target);
    if (!ctrlType) return;
    var focusTypes = [
      'inputText', 'textarea', 'comboBox', 'datetimePicker',
      'checkbox', 'radio', 'button', 'hyperLink', 'iconButton',
      'dataGrid_cell'
    ];
    if (focusTypes.indexOf(ctrlType) === -1) return;
    var targetId = getRootWidgetId(e.target);
    if (ctrlType === 'inputText' || ctrlType === 'textarea') {
      inputOldValues[targetId] = e.target.value || '';
    }
    var data = extractEventData(e.target, ctrlType, e);
    send('focus', ctrlType, targetId, data, e.target);
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
    if (ctrlType === 'dataGrid_cell') {
      var cell = e.target;
      if (cell.closest('.dataGrid_checkbox')) return;
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
    if (ctrlType === 'listBox_item') {
      var itemEl = e.target.closest('.listBox_item');
      if (!itemEl) return;
      var containerEl = itemEl.closest('[data-editable]');
      if (containerEl && containerEl.getAttribute('data-editable') !== 'true') return;
      var textEl = itemEl.querySelector('.listBox_item_text');
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

    if (ctrlType === 'listBox_item') {
      var listContainer = e.target.closest('[data-ctrl-type="listBox"]');
      if (listContainer) {
        var allItems = listContainer.querySelectorAll('.listBox_item');
        for (var li = 0; li < allItems.length; li++) {
          allItems[li].classList.remove('item-selected');
        }
        var clickedItem = e.target.closest('.listBox_item');
        if (clickedItem) clickedItem.classList.add('item-selected');
        lastActiveListbox = listContainer;
      }
    }
    if (ctrlType === 'dataGrid_cell') {
      var gridContainer = e.target.closest('[data-ctrl-type="dataGrid"]');
      if (gridContainer) {
        var allRows = gridContainer.querySelectorAll('.dataGrid_row');
        for (var ri = 0; ri < allRows.length; ri++) {
          allRows[ri].classList.remove('dataGrid_row-focused');
        }
        var clickedRow = e.target.closest('.dataGrid_row');
        if (clickedRow) clickedRow.classList.add('dataGrid_row-focused');
        lastActiveDataGrid = gridContainer;
      }
    }
    if (ctrlType === 'treeview_node_text') {
      var treeContainer = e.target.closest('[data-type="treeView"]');
      if (treeContainer) {
        var allSelected = treeContainer.querySelectorAll('.treeView_node.selected');
        for (var ts = 0; ts < allSelected.length; ts++) {
          allSelected[ts].classList.remove('selected');
        }
        var clickedContent = e.target.closest('.treeView_node_content');
        if (clickedContent) clickedContent.classList.add('selected');
        lastActiveTreeView = treeContainer;
      }
    }

    var ctxTypes = [
      'button', 'hyperLink', 'tabsContainer_headerBar_btn', 'iconButton',
      'listBox_item', 'dataGrid_cell', 'treeview_node_text',
      'comboBox', 'inputText', 'textarea',
      'checkbox', 'radio', 'progressBar', 'datetimePicker',
      'logOutput_item', 'label', 'logOutput', 'imageBox', 'dataGrid', 'tabsContainer',
      'cardBox', 'cardBox_body', 'canvas', 'listBox', 'treeView', 'radioGroup', 'pageContainer',
      'titlebar_left_icon', 'titlebar_title', 'titlebar_min', 'titlebar_max', 'titlebar_close'
    ];
    if (ctxTypes.indexOf(ctrlType) !== -1) {
      send('click', ctrlType, targetId, data);
    }
  }

  /**
   * 链接点击拦截器 - 禁止所有页面跳转，通过事件消息发送超链接数据给宿主
   */
  function handleLinkClick(e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href === 'javascript:void(0)' || href === 'javascript:void(0);') {
      e.preventDefault();
      e.stopPropagation();
      var dataHref = link.getAttribute('data-href') || '';
      var targetId = '';
      var idEl = link.closest('[id]');
      if (idEl) targetId = idEl.id;
      if (idEl && idEl.getAttribute('data-ctrl-type') === 'hyperLink') {
        send('hyperLink', 'hyperLink', targetId, { href: dataHref, text: link.textContent || '' });
      }
      return;
    }
    // 任何其他链接也禁止跳转
    e.preventDefault();
    e.stopPropagation();
  }

  function bindEvents() {
    var tabBtns = document.querySelectorAll('.tabsContainer_headerBar_btn.active');
    for (var i = 0; i < tabBtns.length; i++) {
      var container = tabBtns[i].closest('.tabsContainer') || tabBtns[i].closest('[data-ctrl-type="tabsContainer"]');
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
    // 拦截所有链接跳转，发送超链接数据给宿主处理
    document.addEventListener('click', handleLinkClick, false);
    log('[webviewBridge] 事件委托已绑定 (click/change/input/blur/dblclick/contextmenu/focus/link)');
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
  // 宿主消息监听 — 仅记录收到的命令消息，暂不做分发处理
  // ================================================================

  function listenHostMessages() {
    try {
      if (window.chrome && window.chrome.webview && window.chrome.webview.addEventListener) {
        window.chrome.webview.addEventListener('message', function(e) {
          try {
            var cmd = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            if (Array.isArray(cmd)) {
              for (var i = 0; i < cmd.length; i++) {
                log('[webviewBridge] 收到宿主命令:', cmd[i].command || cmd[i].cmd || '(无命令名)', cmd[i]);
              }
            } else {
              log('[webviewBridge] 收到宿主命令:', cmd.command || cmd.cmd || '(无命令名)', cmd);
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
          arrow.textContent = '▶';
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
    wrapper.style.cssText = 'position:fixed;z-index:999999;pointer-events:none;app-region:no-drag;-webkit-app-region:no-drag;';

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
  }

  // ================================================================
  // 标题栏最大化/还原
  // ================================================================

  var _titlebarMaxIcon = '<span style="width:18px;height:14px;display:flex;align-items:center;justify-content:center;"><svg width="12" height="12" viewBox="0 0 10 10" shape-rendering="crispEdges"><rect x="1" y="1" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1" /></svg></span>';
  var _titlebarRestoreIcon = '<span style="width:18px;height:14px;display:flex;align-items:center;justify-content:center;"><svg width="12" height="12" viewBox="0 0 10 10" shape-rendering="crispEdges"><line x1="4" y1="1" x2="10" y2="1" stroke="currentColor" stroke-width="1" /><line x1="10" y1="1" x2="10" y2="6" stroke="currentColor" stroke-width="1" /><rect x="2" y="3" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1" /></svg></span>';
  var _titlebarIsMaximized = false;

  function initTitleBar() {
    var maxBtn = document.getElementById('titlebar_max');
    if (!maxBtn) return;

    /** 切换到最大化状态：换图标 + 发消息 */
    function doMaximize() {
      _titlebarIsMaximized = true;
      maxBtn.innerHTML = _titlebarRestoreIcon;
      maxBtn.title = '还原';
    }

    /** 切换到还原状态：换图标 + 发消息 */
    function doRestore() {
      _titlebarIsMaximized = false;
      maxBtn.innerHTML = _titlebarMaxIcon;
      maxBtn.title = '最大化';
    }

    // 暴露 API
    if (!window.webviewBridge.api.titleBar) {
      window.webviewBridge.api.titleBar = {
        maximize: doMaximize,
        restore: doRestore,
        isMaximized: function() { return _titlebarIsMaximized; },
        setIcon: function(iconHTML) {
          if (iconHTML) _titlebarMaxIcon = iconHTML;
        },
        setRestoreIcon: function(iconHTML) {
          if (iconHTML) _titlebarRestoreIcon = iconHTML;
        }
      };
    }
  }

  function initInputBox() {
    if (window.__inputBoxConfig) {
      inputBoxConfig = window.__inputBoxConfig;
      log('[webviewBridge] 输入框配置已加载');
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
    dialog.style.setProperty('app-region', 'no-drag');
    dialog.style.setProperty('-webkit-app-region', 'no-drag');

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
    dialog.style.setProperty('app-region', 'no-drag');
    dialog.style.setProperty('-webkit-app-region', 'no-drag');

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

  function getAllOriginalStyles(element) {
    var newStyles = { width: 0, height: 0, realWidth: 0, realHeight: 0 };
    var widthVal = '';
    var heightVal = '';

    // 1. 从样式表中提取原始 width 和 height 值
    var styleSheets = document.styleSheets;
    var matches = element.matches || element.msMatchesSelector || element.webkitMatchesSelector;
    for (var i = 0; i < styleSheets.length; i++) {
        var sheet = styleSheets[i];
        try {
            var cssRules = sheet.cssRules || sheet.rules;
            if (!cssRules) continue;
            for (var j = 0; j < cssRules.length; j++) {
                var rule = cssRules[j];
                if (matches.call(element, rule.selectorText)) {
                    var w = rule.style.getPropertyValue('width');
                    if (w) widthVal = w;
                    var h = rule.style.getPropertyValue('height');
                    if (h) heightVal = h;
                }
            }
        } catch (e) { /* 忽略跨域样式表 */ }
    }

    // 保存原始内联样式用于恢复
    var orig = element.style.cssText;

    // 离屏测量滚动尺寸（用于自适应时的实际内容尺寸）
    function measureScrollSize() {
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        element.style.width = 'auto';
        element.style.height = 'auto';
        var dummy = element.offsetHeight; // 强制重排
        var sw = element.scrollWidth;
        var sh = element.scrollHeight;
        element.style.cssText = orig;
        return { scrollWidth: sw, scrollHeight: sh };
    }

    // 获取最终计算像素值（用于回退）
    var computedStyle = window.getComputedStyle(element);
    var computedWidth = parseFloat(computedStyle.width) || 0;
    var computedHeight = parseFloat(computedStyle.height) || 0;

    // 辅助：判断值是否为固定像素（如 "200px"）或数值+px
    function isFixedPixel(val) {
        if (!val) return false;
        var trimmed = val.trim();
        // 如果以 px 结尾，并且数字部分不为 0，认为是固定像素
        if (/^\d+(\.\d+)?px$/i.test(trimmed)) {
            return true;
        }
        // 如果纯数字（无单位），也视为固定像素（旧式写法）
        if (/^\d+(\.\d+)?$/.test(trimmed)) {
            return true;
        }
        return false;
    }

    // 处理宽度
    if (widthVal && isFixedPixel(widthVal)) {
        // 固定像素：直接取数值
        var num = parseFloat(widthVal);
        newStyles.width = num;
        newStyles.realWidth = num;
    } else {
        // 非固定（auto、%、vw等）：视为自适应，width=0，realWidth为实际内容宽度
        newStyles.width = 0;
        // 尝试获取实际内容宽度：离屏测量滚动宽度
        var size = measureScrollSize();
        newStyles.realWidth = size.scrollWidth || computedWidth || 0;
    }

    // 处理高度
    if (heightVal && isFixedPixel(heightVal)) {
        var num2 = parseFloat(heightVal);
        newStyles.height = num2;
        newStyles.realHeight = num2;
    } else {
        newStyles.height = 0;
        var size2 = measureScrollSize();
        newStyles.realHeight = size2.scrollHeight || computedHeight || 0;
    }

    return newStyles;
}
   /**
   * 自动寻找页面中最大的可见块级容器（div/main/section/article）
   * 跳过隐藏元素、遮罩层（fixed + z-index 高）以及太小或比例失调的元素
   * @returns {Element} 找到的容器元素，若失败则返回 document.body
   */
function findMainContainer() {
    // ----- 辅助函数：判断元素是否“可视”（不检查 opacity）-----
    const isVisible = (el) => {
        if (!el) return false;
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return false;
        const rect = el.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) return false;
        return true;
    };

    // 获取元素面积
    const getArea = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.width * rect.height;
    };

    const body = document.body;
    const html = document.documentElement;

    // ----- 第一步：判断 body 自身是否可以作为主容器 -----
    // 如果 body 本身不可见，直接跳过，进入子元素搜索
    if (!isVisible(body)) {
        return searchInChildren(body);
    }

    // body 可见，比较尺寸
    const bodyRect = body.getBoundingClientRect();
    const htmlRect = html.getBoundingClientRect();
    // 允许 1px 误差（考虑滚动条造成的细微差异）
    const widthMatch = Math.abs(bodyRect.width - htmlRect.width) <= 1;
    const heightMatch = Math.abs(bodyRect.height - htmlRect.height) <= 1;

    // 如果 body 尺寸与 html 不同，说明 body 本身就是内容容器（例如有 margin/padding）
    if (!widthMatch || !heightMatch) {
        return body;
    }

    // 如果 body 尺寸与 html 相同，说明 body 只是一个全屏包裹层，往下找真正的容器
    return searchInChildren(body);

    // ----- 第二步：在指定元素的子元素中逐层查找最大可视容器 -----
    function searchInChildren(startEl) {
        let current = startEl;
        let depth = 0;
        const MAX_DEPTH = 10; // 防止死循环

        while (current && depth < MAX_DEPTH) {
            const children = current.children;

            // 没有子元素 → 回退到起始元素（body）
            if (children.length === 0) {
                return startEl;
            }

            // 找出当前层面积最大的子元素
            let bestChild = null;
            let maxArea = -1;
            for (let i = 0; i < children.length; i++) {
                const el = children[i];
                const area = getArea(el);
                if (area > maxArea) {
                    maxArea = area;
                    bestChild = el;
                }
            }

            // 所有子元素面积为 0 → 回退到起始
            if (!bestChild || maxArea <= 0) {
                return startEl;
            }

            // 如果面积最大的子元素是可视的 → 直接返回它
            if (isVisible(bestChild)) {
                return bestChild;
            }

            // 否则（不可见），钻进这个不可见容器内部继续找
            if (bestChild.children.length > 0) {
                current = bestChild;
                depth++;
                continue;
            }

            // 不可见且没有子元素 → 死胡同，回退到起始
            return startEl;
        }

        // 超过深度限制，回退到起始
        return startEl;
    }
}

/**
 * 增强版：分析标题栏元素，提取高度和右侧最右边的三个按钮坐标
 * 支持扁平布局（所有控件直接平铺）和容器布局（左、中、右分区）
 * @param {HTMLElement} titleBarEl - 标题栏 DOM 元素
 * @param {DOMRect} containerRect - 主容器的 getBoundingClientRect()
 * @returns {Object|null} 包含 height 和 buttonRects 的对象，若按钮少于2个则返回 null
 */
function analyzeTitleBarElement(titleBarEl, containerRect) {
    if (!titleBarEl) return null;
    var elRect = titleBarEl.getBoundingClientRect();
    var titleBarHeight = elRect.height;
    var width = elRect.width;

    // 收集所有可能为按钮的候选元素（去重）
    var candidates = [];

    // ---- 第一步：基于特征直接查找窗口控制按钮 ----
    var windowControlSelectors = [
		// ID 选择器（精准定位）
		'#titlebar_min', '#titlebar_max', '#titlebar_close',
		// data-ctrl-type
		'[data-ctrl-type="titlebar_min"]',
		'[data-ctrl-type="titlebar_max"]',
		'[data-ctrl-type="titlebar_close"]',
		// 常见类名
		'.minimize', '.maximize', '.close', '.restore',
		'.window-control', '.window-close', '.window-max', '.window-min',
		'.btn-min', '.btn-max', '.btn-close',
		// data 属性
		'[data-action="minimize"]', '[data-action="maximize"]', '[data-action="close"]', '[data-action="restore"]',
		// aria-label
		'[aria-label*="minimize" i]', '[aria-label*="maximize" i]', '[aria-label*="close" i]', '[aria-label*="restore" i]',
		// title
		'[title*="最小化" i]', '[title*="最大化" i]', '[title*="关闭" i]', '[title*="还原" i]',
		'[title*="minimize" i]', '[title*="maximize" i]', '[title*="close" i]', '[title*="restore" i]'
	];
    var featureMatches = titleBarEl.querySelectorAll(windowControlSelectors.join(','));
    for (var f = 0; f < featureMatches.length; f++) {
        var el = featureMatches[f];
        var r = el.getBoundingClientRect();
        // 只收集位于右侧区域的（左边界 > 30% 宽度）
        if (r.left > elRect.left + width * 0.3) {
            if (candidates.indexOf(el) === -1) {
                candidates.push(el);
            }
        }
    }

    // ---- 第二步：如果特征查找找到至少2个，直接使用；否则回退到通用几何检测 ----
    if (candidates.length < 2) {
        candidates = [];
        var isButtonSized = function(r) {
            return r.width >= 10 && r.width <= titleBarHeight * 1.5 &&
                   r.height >= 10 && r.height <= titleBarHeight;
        };

        // 检查直接子元素
        for (var i = 0; i < titleBarEl.children.length; i++) {
            var child = titleBarEl.children[i];
            var r = child.getBoundingClientRect();
            if (r.left < elRect.left + width * 0.7) continue;

            var style = getComputedStyle(child);
            var isClickable = style.cursor === 'pointer' ||
                              child.classList.contains('btn') ||
                              child.classList.contains('button') ||
                              child.hasAttribute('role') ||
                              child.tagName === 'BUTTON';

            if (isButtonSized(r) && isClickable) {
                if (candidates.indexOf(child) === -1) candidates.push(child);
                continue;
            }

            if (r.width > titleBarHeight * 1.5) {
                for (var j = 0; j < child.children.length; j++) {
                    var sub = child.children[j];
                    var sr = sub.getBoundingClientRect();
                    if (!isButtonSized(sr)) continue;
                    var subStyle = getComputedStyle(sub);
                    var isSubClickable = subStyle.cursor === 'pointer' ||
                                         sub.classList.contains('btn') ||
                                         sub.classList.contains('button') ||
                                         sub.hasAttribute('role') ||
                                         sub.tagName === 'BUTTON';
                    if (isSubClickable && candidates.indexOf(sub) === -1) {
                        candidates.push(sub);
                    }
                }
            }
        }

        // 如果仍然少于2个，用选择器补查直接子元素
        if (candidates.length < 2) {
            var directBtns = titleBarEl.querySelectorAll(':scope > .btn, :scope > [class*="btn"], :scope > button, :scope > [role="button"]');
            for (var k = 0; k < directBtns.length; k++) {
                var btn = directBtns[k];
                var r2 = btn.getBoundingClientRect();
                if (r2.left > elRect.left + width * 0.7) {
                    if (candidates.indexOf(btn) === -1) candidates.push(btn);
                }
            }
        }
    }

    // 如果候选数少于2，返回 null
    if (candidates.length < 2) return null;

    // ---- 第三步：按左边界从右到左排序，只取最右边的三个 ----
    candidates.sort(function(a, b) {
        var ra = a.getBoundingClientRect();
        var rb = b.getBoundingClientRect();
        return rb.left - ra.left; // 降序，最右在前
    });
    candidates = candidates.slice(0, 3);

    // 重新按从左到右排序（保持视觉顺序）
    candidates.sort(function(a, b) {
        var ra = a.getBoundingClientRect();
        var rb = b.getBoundingClientRect();
        return ra.left - rb.left;
    });

    // ---- 第四步：构建坐标数据 ----
    var buttonRects = candidates.map(function(btn) {
        var r = btn.getBoundingClientRect();
        // 尝试获取样式表中的声明尺寸（非百分比）
        var declared = getAllOriginalStyles(btn);
        // 若声明值有效（>0），则使用声明值；否则回退到渲染尺寸
        var width = (declared.width > 0) ? declared.width : r.width;
        var height = (declared.height > 0) ? declared.height : r.height;
        return {
            x: containerRect.right - r.left,
            y: r.top - containerRect.top,
            width: width,
            height: height
        };
    });

    return {
        height: titleBarHeight,
        buttonRects: buttonRects
    };
}


function getTitleBarInfo(container) {
    if (!container) return null;

    var containerRect = container.getBoundingClientRect();
    var children = container.children;
    var candidates = [];

    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var rect = child.getBoundingClientRect();
        if (rect.top - containerRect.top > 5) continue;

        var height = rect.height;
        var width = rect.width;
        if (height < 15 || height > 80) continue;
        if (width < containerRect.width * 0.7) continue;

        var style = getComputedStyle(child);
        if (style.position === 'fixed' && parseInt(style.zIndex) > 1000) continue;

        candidates.push(child);
    }

    candidates.sort(function(a, b) {
        return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });

    for (var j = 0; j < candidates.length; j++) {
        var el = candidates[j];
        var info = analyzeTitleBarElement(el, containerRect);
        if (info) {
            // 获取当前元素的矩形用于标题文本定位
            var elRect = el.getBoundingClientRect();
            var width = elRect.width;

            var titleText = '';
            var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
                acceptNode: function(node) {
                    if (node.textContent.trim().length === 0) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            });
            var node = walker.nextNode();
            while (node) {
                var text = node.textContent.trim();
                if (text.length > 0 && text.length <= 30) {
                    var range = document.createRange();
                    range.selectNode(node);
                    var rect = range.getBoundingClientRect();
                    var relX = (rect.left + rect.right) / 2 - elRect.left;
                    if (relX >= width * 0.3 && relX <= width * 0.7) {
                        titleText = text;
                        break;
                    }
                }
                node = walker.nextNode();
            }
            if (!titleText) {
                var allText = el.textContent;
                var lines = allText.split('\n').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0; });
                for (var l = 0; l < lines.length; l++) {
                    if (lines[l].length <= 30) { titleText = lines[l]; break; }
                }
            }

            return {
                element: el,
                height: info.height,
                titleText: titleText,
                buttonRects: info.buttonRects
            };
        }
    }

    return null;
}
  /**
   * 获取页面布局信息（浏览器自动调用 + 用户手动调用通用函数）
   * @param {string} [containerId] - 可选，容器元素ID（不传则自动检测）
   * @param {string} [titleBarId] - 可选，标题栏元素ID（不传则自动检测）
   * @returns {{width,height,realWidth,realHeight,titleBar:{height,titleText,buttonRects}}|null}
   */
  function getPageLayoutInfo(containerId, titleBarId) {
    var container;
    if (containerId) {
      container = document.getElementById(containerId);
      if (!container) return null;
    } else {
      container = findMainContainer();
      if (!container) container = document.body;
    }

    var size = getAllOriginalStyles(container);

    var titleBarData;
    if (titleBarId) {
      var titleBarEl = document.getElementById(titleBarId);
      if (titleBarEl) {
        var containerRect = container.getBoundingClientRect();
        var info = analyzeTitleBarElement(titleBarEl, containerRect);
        // 提取标题文本（与 getTitleBarInfo 内逻辑一致）
        var titleBarTitleText = '';
        var elRect = titleBarEl.getBoundingClientRect();
        var elWidth = elRect.width;
        var walker = document.createTreeWalker(titleBarEl, NodeFilter.SHOW_TEXT, {
          acceptNode: function(node) {
            return node.textContent.trim().length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        });
        var textNode = walker.nextNode();
        while (textNode) {
          var text = textNode.textContent.trim();
          if (text.length > 0 && text.length <= 30) {
            var range = document.createRange();
            range.selectNode(textNode);
            var textRect = range.getBoundingClientRect();
            var relX = (textRect.left + textRect.right) / 2 - elRect.left;
            if (relX >= elWidth * 0.3 && relX <= elWidth * 0.7) {
              titleBarTitleText = text;
              break;
            }
          }
          textNode = walker.nextNode();
        }
        if (!titleBarTitleText) {
          var allText = titleBarEl.textContent || '';
          var lines = allText.split('\n').map(function(s) { return s.trim(); }).filter(function(s) { return s.length > 0 && s.length <= 30; });
          if (lines.length > 0) titleBarTitleText = lines[0];
        }
        if (info) {
          titleBarData = { height: info.height, titleText: titleBarTitleText, buttonRects: info.buttonRects };
        } else {
          var rect = titleBarEl.getBoundingClientRect();
          titleBarData = { height: rect.height, titleText: titleBarTitleText, buttonRects: [] };
        }
      } else {
        titleBarData = { height: -1, titleText: '', buttonRects: [] };
      }
    } else {
      var titleInfo = getTitleBarInfo(container);
      if (titleInfo) {
        titleBarData = {
          height: titleInfo.height,
          titleText: titleInfo.titleText,
          buttonRects: titleInfo.buttonRects
        };
      } else {
        titleBarData = { height: -1, titleText: '', buttonRects: [] };
      }
    }

    return {
      width: size.width || 0,
      height: size.height || 0,
      realWidth: size.realWidth || 0,
      realHeight: size.realHeight || 0,
      titleBar: titleBarData
    };
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
    initTitleBar();

    var layout = getPageLayoutInfo();

    send('pageLoaded', 'canvas', 'pageContainer', {
        title: document.title || '',
        url: window.location.href,
        readyState: document.readyState,
        width: layout.width,
        height: layout.height,
        realWidth: layout.realWidth,
        realHeight: layout.realHeight,
        titleBar: layout.titleBar
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
      public: {
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
        var layout = getPageLayoutInfo();
        return {
          width: layout.width,
          height: layout.height,
          realWidth: layout.realWidth,
          realHeight: layout.realHeight
        };
      },
      /**
       * 获取页面布局信息（含容器尺寸 + 标题栏信息）
       * @param {string} [containerId] - 可选，容器ID（不传自动检测）
       * @param {string} [titleBarId] - 可选，标题栏ID（不传自动检测）
       * @returns {object} { width, height, realWidth, realHeight, titleBar: { height, titleText, buttonRects } }
       */
      getPageLayoutInfo: function(containerId, titleBarId) {
        return getPageLayoutInfo(containerId, titleBarId);
      },

      /**
       * 固定画布宽高 — 设置预览页面的画布尺寸是否固定
       * @param {boolean} isFixed - 是否固定画布宽高（true=固定用指定宽高，false=继承body宽高）
       * @param {number} [width] - 固定时的画布宽度（px），不传则使用设计器中设置的默认宽度
       * @param {number} [height] - 固定时的画布高度（px），不传则使用设计器中设置的默认高度
       * @returns {boolean} 是否操作成功
       */
      setFixedCanvasSize: function(isFixed, width, height) {
        var container = document.querySelector('.pageContainer');
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
        var container = document.querySelector('.pageContainer');
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
      }

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
          var container = document.querySelector('.pageContainer');
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
          var titleEl = document.querySelector('.titlebar_center_title');
          if (!titleEl) return '';
          return titleEl.textContent || '';
        },

        /**
         * 设置画布标题栏文字
         * @param {string} title - 新的标题文字
         * @returns {boolean} 是否设置成功
         */
        setTitleBarTitle: function(title) {
          var titleEl = document.querySelector('.titlebar_center_title');
          if (!titleEl) return false;
          titleEl.textContent = title;
          document.title = title;
          return true;
        }
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

        // 在 webviewBridge.js 中找到 api.comboBox.setValue，替换为：
		setValue: function(targetId, value) {
		  var el = findTarget(targetId);
		  if (!el) return false;

		  // 检查 value 是否存在于任意 option 的 value 属性中
		  var exists = false;
		  for (var i = 0; i < el.options.length; i++) {
			if (el.options[i].value == value) {  // 使用 == 允许字符串与数字比较
			  exists = true;
			  break;
			}
		  }
		  if (!exists) {
			// 值不存在，终止操作，不修改当前选中项，不触发 change 事件
			return false;
		  }

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

      hyperLink: {
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
          var existingLabels = el.querySelectorAll('.radioGroup_item');
          var disabled = existingLabels.length > 0 && existingLabels[0].hasAttribute('disabled');
          var label = document.createElement('label');
          label.className = 'radioGroup_item';
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
            var labels = el.querySelectorAll('.radioGroup_item');
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
          var fill = el.querySelector('.progressBar_fill');
          if (fill && fill.style.width) {
            return parseFloat(fill.style.width) || 0;
          }
          var text = el.querySelector('.progressBar_text');
          return text ? (parseFloat(text.textContent) || 0) : 0;
        },

        setValue: function(targetId, value) {
          var el = findTarget(targetId);
          if (!el) return false;
          var pct = Math.max(0, Math.min(100, parseFloat(value) || 0));
          var fill = el.querySelector('.progressBar_fill');
          var text = el.querySelector('.progressBar_text');
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

      logOutput: {
        addLog: function(targetId, text, color, wrap) {
          var el = findTarget(targetId);
          if (!el) return false;
          var line = document.createElement('div');
          line.className = 'logOutput_line';
          line.setAttribute('data-ctrl-type', 'logOutput_item');
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
          line.className = 'logOutput_line';
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
          return el ? el.querySelectorAll('.logOutput_line').length : 0;
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
          return el ? el.querySelector('.listBox_scroll') : null;
        },

        _getItems: function(targetId) {
          var scroll = this._getScroll(targetId);
          return scroll ? scroll.querySelectorAll('.listBox_item') : [];
        },

        _getItem: function(targetId, index) {
          var items = this._getItems(targetId);
          return (index >= 0 && index < items.length) ? items[index] : null;
        },

        _getCheckbox: function(targetId, index) {
          var item = this._getItem(targetId, index);
          return item ? item.querySelector('.listBox_item-checkbox') : null;
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
            var cb = item.querySelector('.listBox_item-checkbox');
            var txt = item.querySelector('.listBox_item_text');
            data.push({
              text: txt ? txt.textContent : '',
              selected: cb ? cb.checked : false
            });
          }
          try { el.setAttribute('data-listBox-items', JSON.stringify(data)); } catch(e) {}
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
          var cbHtml = showCb ? '<input type="checkbox" class="listBox_item-checkbox" data-ctrl-type="listbox_item_checkbox" data-item-index="' + idx + '" />' : '';
          var div = document.createElement('div');
          div.className = 'listBox_item';
          div.setAttribute('data-ctrl-type', 'listBox_item');
          div.setAttribute('data-item-index', String(idx));
          div.innerHTML = cbHtml + '<span class="listBox_item_text">' + text + '</span>';
          scroll.appendChild(div);
          reindexChildren(scroll, '.listBox_item', 'data-item-index');
          reindexChildren(scroll, '.listBox_item-checkbox', 'data-item-index');
          this._syncDataAttr(targetId);
          try { scroll.dispatchEvent(new CustomEvent('listBox.itemschanged', { detail: { targetId: targetId } })); } catch(e) {}
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
          var cbHtml = showCb ? '<input type="checkbox" class="listBox_item-checkbox" data-ctrl-type="listbox_item_checkbox" data-item-index="' + idx + '" />' : '';
          var div = document.createElement('div');
          div.className = 'listBox_item';
          div.setAttribute('data-ctrl-type', 'listBox_item');
          div.setAttribute('data-item-index', String(idx));
          div.innerHTML = cbHtml + html;
          scroll.appendChild(div);
          reindexChildren(scroll, '.listBox_item', 'data-item-index');
          reindexChildren(scroll, '.listBox_item-checkbox', 'data-item-index');
          this._syncDataAttr(targetId);
          try { scroll.dispatchEvent(new CustomEvent('listBox.itemschanged', { detail: { targetId: targetId } })); } catch(e) {}
          return true;
        },

        removeItem: function(targetId, index) {
          var item = this._getItem(targetId, index);
          if (!item) return false;
          var scroll = item.parentNode;
          item.parentNode.removeChild(item);
          reindexChildren(scroll, '.listBox_item', 'data-item-index');
          reindexChildren(scroll, '.listBox_item-checkbox', 'data-item-index');
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
          if (el) el.setAttribute('data-listBox-items', '[]');
          return true;
        },

        getItemCount: function(targetId) {
          return this._getItems(targetId).length;
        },

        setItemText: function(targetId, index, text) {
          var item = this._getItem(targetId, index);
          if (!item) return false;
          var span = item.querySelector('.listBox_item_text');
          if (span) span.textContent = text;
          this._syncDataAttr(targetId);
          return true;
        },

        getItemText: function(targetId, index) {
          var item = this._getItem(targetId, index);
          if (!item) return '';
          var span = item.querySelector('.listBox_item_text');
          return span ? span.textContent : '';
        },

        setItemChecked: function(targetId, index, checked) {
          var item = this._getItem(targetId, index);
          if (!item) return false;
          var cb = item.querySelector('.listBox_item-checkbox');
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
          var cb = item.querySelector('.listBox_item-checkbox');
          return cb ? cb.checked : false;
        },

        selectAll: function(targetId) {
          var items = this._getItems(targetId);
          for (var i = 0; i < items.length; i++) {
            var cb = items[i].querySelector('.listBox_item-checkbox');
            if (cb && !cb.checked) { cb.checked = true; cb.dispatchEvent(new Event('change', { bubbles: true })); }
          }
          this._syncDataAttr(targetId);
          return true;
        },

        toggleAll: function(targetId) {
          var items = this._getItems(targetId);
          for (var i = 0; i < items.length; i++) {
            var cb = items[i].querySelector('.listBox_item-checkbox');
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
            var cb = items[i].querySelector('.listBox_item-checkbox');
            if (cb && cb.checked) {
              items[i].parentNode.removeChild(items[i]);
              removed = true;
            }
          }
          if (removed) {
            reindexChildren(scroll, '.listBox_item', 'data-item-index');
            reindexChildren(scroll, '.listBox_item-checkbox', 'data-item-index');
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
            var cb = items[i].querySelector('.listBox_item-checkbox');
            if (cb && cb.checked) return i;
          }
          return -1;
        },

        getHighlightedItem: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return null;
          var highlighted = el.querySelector('.listBox_item.item-selected');
          if (!highlighted) return null;
          var allItems = el.querySelectorAll('.listBox_item');
          for (var i = 0; i < allItems.length; i++) {
            if (allItems[i] === highlighted) {
              var textEl = highlighted.querySelector('.listBox_item-label') || highlighted;
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
          var checkboxes = el.querySelectorAll('.listBox_item-checkbox');
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
          var items = el.querySelectorAll('.listBox_item');
          for (var j = 0; j < items.length; j++) {
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'listBox_item-checkbox';
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
          var checkboxes = el.querySelectorAll('.listBox_item-checkbox:checked');
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
          var checkboxes = el.querySelectorAll('.listBox_item-checkbox');
          for (var i = 0; i < checkboxes.length; i++) { checkboxes[i].checked = true; }
          return true;
        },

        uncheckAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var checkboxes = el.querySelectorAll('.listBox_item-checkbox');
          for (var i = 0; i < checkboxes.length; i++) { checkboxes[i].checked = false; }
          return true;
        }

      },

      treeView: {
        _getNode: function(targetId, nodeId) {
          var el = findTarget(targetId);
          if (!el) return null;
          return el.querySelector('.treeView_node[data-node-id="' + nodeId + '"]');
        },

        _getNodeLabel: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          return node ? node.querySelector('.treeView_label') : null;
        },

        _getNodeToggle: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          return node ? node.querySelector('.treeView_toggle') : null;
        },

        _getNodeChildren: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          return node ? node.querySelector('.treeView_children') : null;
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
            childrenHTML = '<div class="treeView_children">' + newNode.children.map(function(c) { return ''; }).join('') + '</div>';
          }
          var parentNode = parentNodeId ? this._getNode(targetId, parentNodeId) : null;
          var parentChildren = parentNode ? this._getNodeChildren(targetId, parentNodeId) : null;
          var container = parentChildren || el;
          var level = parentNode ? (parseInt(parentNode.getAttribute('data-level')) + 1) : 0;
          var div = document.createElement('div');
          div.className = 'treeView_node';
          div.setAttribute('data-node-id', nodeId);
          div.setAttribute('data-level', String(level));
          var showCb = el.getAttribute('data-show-checkbox') === 'true';
          var newNodeChecked = newNode.checked ? ' checked' : '';
          var checkboxHTML = showCb ? '<span class="tree-checkbox"><input type="checkbox" class="treeView_node-check" data-ctrl-type="treeview_node_checkbox"' + newNodeChecked + '></span>' : '';
          div.innerHTML = '<div class="treeView_node_content">' +
            checkboxHTML +
            '<span class="treeView_toggle' + toggleClass + '" data-ctrl-type="treeview_node_toggle">▶</span>' +
            '<span class="treeView_icon' + iconClass + '">' + (hasChildren ? '📁' : '📄') + '</span>' +
            '<span class="treeView_label" data-ctrl-type="treeview_node_text">' + (newNode.text || '') + '</span>' +
            '<span class="tree-edit-input" style="display:none"></span>' +
            '</div>' + childrenHTML;
          container.appendChild(div);
          if (parentNode) {
            var toggle = this._getNodeToggle(targetId, parentNodeId);
            if (toggle) {
              // 仅在父节点之前无子节点时才更新 toggle 状态
              // 如果之前是 empty，现在有子节点了，设为 expanded 并显示箭头
              if (toggle.classList.contains('empty')) {
                toggle.className = 'treeView_toggle expanded';
              }
              // 如果之前已有子节点，保持其原有的 expanded/collapsed 状态不变
            }
            var icon = parentNode.querySelector('.treeView_node_content .treeView_icon');
            if (icon) {
              if (icon.classList.contains('file')) {
                icon.className = 'treeView_icon folder';
                icon.textContent = '📁';
              }
            }
          }
          return true;
        },

        removeNode: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          if (!node) return false;
          var parentNode = node.parentNode;
          parentNode.removeChild(node);
          // 检查父节点是否还有其他子节点，如果没了则更新父级 toggle
          if (parentNode && parentNode.classList.contains('treeView_children')) {
            var parentTreeNode = parentNode.closest('.treeView_node');
            if (parentTreeNode) {
              var parentToggle = parentTreeNode.querySelector(':scope > .treeView_node_content .treeView_toggle');
              var remaining = parentNode.querySelectorAll('.treeView_node');
              if (remaining.length === 0) {
                if (parentToggle) {
                  parentToggle.className = 'treeView_toggle empty';
                  parentToggle.textContent = '';
                }
              }
            }
          }
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
          toggle.classList.remove('collapsed');
          toggle.classList.add('expanded');
          children.style.display = '';
          return true;
        },

        collapseNode: function(targetId, nodeId) {
          var toggle = this._getNodeToggle(targetId, nodeId);
          var children = this._getNodeChildren(targetId, nodeId);
          if (!toggle || !children) return false;
          toggle.classList.remove('expanded');
          toggle.classList.add('collapsed');
          children.style.display = 'none';
          return true;
        },

        toggleNode: function(targetId, nodeId) {
          var toggle = this._getNodeToggle(targetId, nodeId);
          var children = this._getNodeChildren(targetId, nodeId);
          if (!toggle) return false;
          if (toggle.classList.contains('empty')) return false;
          if (toggle.classList.contains('expanded')) {
            return this.collapseNode(targetId, nodeId);
          } else {
            return this.expandNode(targetId, nodeId);
          }
        },

        expandAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var toggles = el.querySelectorAll('.treeView_toggle.collapsed');
          for (var i = 0; i < toggles.length; i++) {
            toggles[i].classList.remove('collapsed');
            toggles[i].classList.add('expanded');
            var node = toggles[i].closest('.treeView_node');
            var children = node ? node.querySelector('.treeView_children') : null;
            if (children) children.style.display = '';
          }
          return true;
        },

        collapseAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var toggles = el.querySelectorAll('.treeView_toggle.expanded');
          for (var i = 0; i < toggles.length; i++) {
            toggles[i].classList.remove('expanded');
            toggles[i].classList.add('collapsed');
            var node = toggles[i].closest('.treeView_node');
            var children = node ? node.querySelector('.treeView_children') : null;
            if (children) children.style.display = 'none';
          }
          return true;
        },

        selectNode: function(targetId, nodeId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var prev = el.querySelectorAll('.treeView_node.selected');
          for (var i = 0; i < prev.length; i++) { prev[i].classList.remove('selected'); }
          var node = this._getNode(targetId, nodeId);
          if (!node) return false;
          node.classList.add('selected');
          lastActiveTreeView = el;
          return true;
        },

        deselectNode: function(targetId, nodeId) {
          var node = this._getNode(targetId, nodeId);
          if (!node) return false;
          node.classList.remove('selected');
          return true;
        },

        clearSelection: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var allSelected = el.querySelectorAll('.treeView_node.selected');
          for (var i = 0; i < allSelected.length; i++) {
            allSelected[i].classList.remove('selected');
          }
          return true;
        },

        getSelectedNode: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return '';
          var sel = el.querySelector('.treeView_node.selected');
          if (!sel) return '';
          return sel.getAttribute('data-node-id') || '';
        },

        getHighlightedNode: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return null;
          var sel = el.querySelector('.treeView_node.selected');
          if (!sel) return null;
          var textEl = sel.querySelector('.treeView_label') || sel.querySelector('.treeView_node-text');
          return {
            nodeId: sel.getAttribute('data-node-id') || '',
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
          var labels = el.querySelectorAll('.treeView_label');
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
          var labels = el.querySelectorAll('.treeView_label');
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
          return node ? node.querySelector('.treeView_node-check') : null;
        },

        showCheckbox: function(targetId, show) {
          var el = findTarget(targetId);
          if (!el) return false;
          el.setAttribute('data-show-checkbox', show ? 'true' : 'false');
          if (window.TreeManager && window.TreeManager.showCheckbox) {
            window.TreeManager.showCheckbox(targetId, show);
          }
          var checkboxes = el.querySelectorAll('.treeView_node-check');
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
          var nodes = el.querySelectorAll('.treeView_node');
          for (var j = 0; j < nodes.length; j++) {
            var content = nodes[j].querySelector(':scope > .treeView_node_content');
            if (!content) continue;
            var existing = content.querySelector('.tree-checkbox');
            if (existing) { existing.style.display = ''; continue; }
            var checkboxSpan = document.createElement('span');
            checkboxSpan.className = 'tree-checkbox';
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'treeView_node-check';
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
          var checkboxes = el.querySelectorAll('.treeView_node-check:checked');
          var ids = [];
          for (var i = 0; i < checkboxes.length; i++) {
            var nodeEl = checkboxes[i].closest('.treeView_node');
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
          var cbs = node.querySelectorAll('.treeView_node-check');
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
          var checkboxes = el.querySelectorAll('.treeView_node-check');
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
          var checkboxes = el.querySelectorAll('.treeView_node-check');
          for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
          }
          return true;
        }
      },

      dataGrid: {
        _getBody: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.querySelector('.dataGrid_body') : null;
        },

        _getHeader: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.querySelector('.dataGrid_header') : null;
        },

        _getRows: function(targetId) {
          var body = this._getBody(targetId);
          if (body) {
            var rows = body.querySelectorAll('.dataGrid_row');
            if (rows.length > 0) return rows;
          }
          // 原生 table 支持
          var el = findTarget(targetId);
          if (el) {
            var tbody = el.querySelector('tbody');
            if (tbody) {
              return tbody.querySelectorAll('tr');
            }
            return el.querySelectorAll('tr');
          }
          return [];
        },

        _getRow: function(targetId, rowIndex) {
          var rows = this._getRows(targetId);
          // 对于原生 table，第一行可能是表头，需要跳过
          var el = findTarget(targetId);
          if (el && el.tagName === 'TABLE') {
            var dataRows = [];
            for (var i = 0; i < rows.length; i++) {
              // 跳过 thead 里的行
              var parentTHead = rows[i].closest('thead');
              if (!parentTHead) {
                dataRows.push(rows[i]);
              }
            }
            return (rowIndex >= 0 && rowIndex < dataRows.length) ? dataRows[rowIndex] : null;
          }
          return (rowIndex >= 0 && rowIndex < rows.length) ? rows[rowIndex] : null;
        },
		
		_getCellObj: function(row,columnKey){
		  // 方式1：按 data-col-name 查找（原逻辑）
		  var cell = row.querySelector('.dataGrid_cell[data-col-name="' + columnKey + '"]');
          if (cell) {
            var cellkey = cell.getAttribute('data-col-key');
            if (cellkey) {
		      cell = row.querySelector('.dataGrid_cell[data-col-key="' + cellkey + '"]');
              if (cell) return cell;
            }
          }
          // 方式2：按 data-col-key 查找
          cell = row.querySelector('.dataGrid_cell[data-col-key="' + columnKey + '"]');
          if (cell) return cell;
          // 方式3：按 col+数字 索引格式（如 col0, col1）
          if (/^col\d+$/.test(columnKey)) {
            var colIndex = parseInt(columnKey.substring(3), 10);
            // 先找 dataGrid 风格的单元格
            var cells = row.querySelectorAll('.dataGrid_cell:not(.dataGrid_checkbox)');
            if (cells.length > 0) {
              if (colIndex >= 0 && colIndex < cells.length) return cells[colIndex];
            }
            // 再找原生 table 的 td
            var tds = row.querySelectorAll('td');
            if (tds.length > 0) {
              if (colIndex >= 0 && colIndex < tds.length) return tds[colIndex];
            }
          }
          // 方式4：按表头名称查找（原生 table 或 dataGrid）
          var tableEl = row.closest ? row.closest('table, .dataGrid') : null;
          if (tableEl) {
            var headerRow = null;
            var thead = tableEl.querySelector('thead');
            if (thead) headerRow = thead.querySelector('tr');
            if (!headerRow) headerRow = tableEl.querySelector('tr');
            if (headerRow) {
              var headerCells = headerRow.querySelectorAll('th, td, .dataGrid_cell');
              var foundIndex = -1;
              for (var i = 0; i < headerCells.length; i++) {
                if (headerCells[i].textContent.trim() === columnKey) {
                  foundIndex = i;
                  break;
                }
              }
              if (foundIndex !== -1) {
                var rowCells = row.querySelectorAll('td, .dataGrid_cell:not(.dataGrid_checkbox)');
                if (rowCells[foundIndex]) return rowCells[foundIndex];
              }
            }
          }
		  return null;
		},
		
		_getCellkey: function(row,columnKey){
		  var cell = row.querySelector('.dataGrid_cell[data-col-name="' + columnKey + '"]');
          if (!cell) return null;
          var cellkey = cell.getAttribute('data-col-key');
		  return cellkey;
		},

        _getColumns: function(targetId) {
          var header = this._getHeader(targetId);
          if (!header) {
            // fallback: read from first data row
            var row = this._getRow(targetId, 0);
            if (!row) return [];
            var dataCells = row.querySelectorAll('.dataGrid_cell:not(.dataGrid_checkbox)');
            var cols = [];
            for (var k = 0; k < dataCells.length; k++) {
              cols.push({ field: dataCells[k].getAttribute('data-col-key') || '',header: dataCells[k].getAttribute('data-col-name') || '', index: k });
            }
            return cols;
          }
          var cells = header.querySelectorAll('.dataGrid_header_cell:not(.dataGrid_checkbox)');
          var cols = [];
          for (var i = 0; i < cells.length; i++) {
            cols.push({ field: cells[i].getAttribute('data-col-key') || '',header: cells[i].getAttribute('data-col-name') || '', index: i });
          }
          return cols;
        },

        _reindexRows: function(body) {
          var rows = body.querySelectorAll('.dataGrid_row');
          for (var i = 0; i < rows.length; i++) {
            rows[i].setAttribute('data-row-index', String(i));
          }
        },

        _makeRowHtml: function(rowIndex, rowData, columns, showCheckbox) {
          var html = '';
          if (showCheckbox) {
            var ck = rowData.selected ? ' checked' : '';
            html += '<div class="dataGrid_cell dataGrid_checkbox" style="width:36px;min-width:36px;flex-shrink:0"><input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox"' + ck + '></div>';
          }
          for (var j = 0; j < columns.length; j++) {
            var w = columns[j].width || 100;
            var val = '';
            if (rowData.cells) {
              if (rowData.cells[columns[j].field] !== undefined) {
                val = String(rowData.cells[columns[j].field]);
              } else if (rowData.cells[columns[j].header] !== undefined) {
                val = String(rowData.cells[columns[j].header]);
              }
            }
            var displayVal = IconManager.parse(val);
            var escapedVal = val.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            html += '<div class="dataGrid_cell" data-ctrl-type="dataGrid_cell" data-col-key="' + columns[j].field + '" data-col-name="' + columns[j].header + '" data-original-text="' + escapedVal + '" style="width:' + w + 'px;min-width:' + w + 'px;flex-shrink:0" title="' + displayVal.replace(/"/g, '&quot;') + '">' + displayVal + '</div>';
          }
          return html;
        },

        addRow: function(targetId, rowData, insertIndex) {
          var body = this._getBody(targetId);
          if (!body) return false;
          var el = findTarget(targetId);
          var columns = this._getColumns(targetId);
          var showCheckbox = body.querySelector('.dataGrid_checkbox') !== null;
          rowData = rowData || { cells: {} };
          var existingRows = this._getRows(targetId);
          var idx = (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= existingRows.length) ? insertIndex : existingRows.length;
          var div = document.createElement('div');
          div.className = 'dataGrid_row';
          div.setAttribute('data-row-index', String(idx));
          div.setAttribute('data-row-id', rowData.id || ('row_' + Date.now()));
          div.innerHTML = this._makeRowHtml(idx, rowData, columns, showCheckbox);
          if (idx < existingRows.length) {
            body.insertBefore(div, existingRows[idx]);
          } else {
            body.appendChild(div);
          }
          this._reindexRows(body);
          try { body.dispatchEvent(new CustomEvent('dataGrid.rowschanged', { detail: { targetId: targetId } })); } catch(e) {}
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
		  var cell = this._getCellObj(row,columnKey);
          cell.textContent = String(value);
          cell.setAttribute('title', String(value));
          return true;
        },

        getCellValue: function(targetId, rowIndex, columnKey) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return '';
		  var cell = this._getCellObj(row,columnKey);
          return cell ? cell.textContent : '';
        },

        setCellValueByIndex: function(targetId, rowIndex, colIndex, value) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return false;
          // 先找 dataGrid 风格的单元格
          var cells = row.querySelectorAll('.dataGrid_cell:not(.dataGrid_checkbox)');
          if (cells.length === 0) {
            // 原生 table 支持
            cells = row.querySelectorAll('td');
          }
          if (colIndex < 0 || colIndex >= cells.length) return false;
          cells[colIndex].textContent = String(value);
          cells[colIndex].setAttribute('title', String(value));
          return true;
        },

        getCellValueByIndex: function(targetId, rowIndex, colIndex) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return '';
          // 先找 dataGrid 风格的单元格
          var cells = row.querySelectorAll('.dataGrid_cell:not(.dataGrid_checkbox)');
          if (cells.length === 0) {
            // 原生 table 支持
            cells = row.querySelectorAll('td');
          }
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
          var cells = row.querySelectorAll('.dataGrid_cell[data-col-key]');
          var data = { id: row.getAttribute('data-row-id') || '', cells: {} };
          for (var i = 0; i < cells.length; i++) {
            var key = cells[i].getAttribute('data-col-key');
            if (key) data.cells[key] = cells[i].textContent;
          }
          var cb = row.querySelector('.dataGrid_row_check');
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
          var cb = row.querySelector('.dataGrid_row_check');
          if (!cb) return false;
          cb.checked = !!checked;
          if (checked) {
            row.classList.add('dataGrid_row-focused');
          } else {
            row.classList.remove('dataGrid_row-focused');
          }
          cb.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        },

        getRowChecked: function(targetId, rowIndex) {
          var row = this._getRow(targetId, rowIndex);
          if (!row) return false;
          var cb = row.querySelector('.dataGrid_row_check');
          return cb ? cb.checked : false;
        },

        selectAllRows: function(targetId) {
          var rows = this._getRows(targetId);
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.dataGrid_row_check');
            if (cb) { cb.checked = true; rows[i].classList.add('dataGrid_row-focused'); }
          }
          var selectAll = document.querySelector('#' + targetId + ' .dataGrid_select_all');
          if (selectAll) selectAll.checked = true;
          return true;
        },

        toggleAllRows: function(targetId) {
          var rows = this._getRows(targetId);
          var allChecked = true;
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.dataGrid_row_check');
            if (cb && !cb.checked) { allChecked = false; break; }
          }
          for (var j = 0; j < rows.length; j++) {
            var cb2 = rows[j].querySelector('.dataGrid_row_check');
            if (cb2) {
              cb2.checked = !allChecked;
              if (!allChecked) { rows[j].classList.add('dataGrid_row-focused'); }
              else { rows[j].classList.remove('dataGrid_row-focused'); }
            }
          }
          return true;
        },

        getSelectedRows: function(targetId) {
          var rows = this._getRows(targetId);
          var result = [];
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.dataGrid_row_check');
            if (cb && cb.checked) result.push(i);
          }
          return result;
        },

        getSelectedRowCount: function(targetId) {
          var rows = this._getRows(targetId);
          var count = 0;
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.dataGrid_row_check');
            if (cb && cb.checked) count++;
          }
          return count;
        },

        getHighlightedRow: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return null;
          var highlighted = el.querySelector('.dataGrid_row.dataGrid_row-focused');
          if (!highlighted) return null;
          var allRows = el.querySelectorAll('.dataGrid_row');
          for (var i = 0; i < allRows.length; i++) {
            if (allRows[i] === highlighted) {
              var cells = highlighted.querySelectorAll('.dataGrid_cell');
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
            rows[i].classList.remove('dataGrid_row-focused');
          }
          rows[rowIndex].classList.add('dataGrid_row-focused');
          return true;
        },

        deselectRow: function(targetId, rowIndex) {
          var rows = this._getRows(targetId);
          if (rowIndex < 0 || rowIndex >= rows.length) return false;
          rows[rowIndex].classList.remove('dataGrid_row-focused');
          return true;
        },

        deleteSelectedRows: function(targetId) {
          var rows = this._getRows(targetId);
          var body = this._getBody(targetId);
          for (var i = rows.length - 1; i >= 0; i--) {
            var cb = rows[i].querySelector('.dataGrid_row_check');
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
          var headerCells = el.querySelectorAll('.dataGrid_header_cell:not(.dataGrid_checkbox)');
          if (colIndex < 0 || colIndex >= headerCells.length) return false;
          headerCells[colIndex].setAttribute('data-editable', 'true');
          var rows = el.querySelectorAll('.dataGrid_row');
          for (var r = 0; r < rows.length; r++) {
            var cells = rows[r].querySelectorAll('.dataGrid_cell:not(.dataGrid_checkbox)');
            if (colIndex < cells.length) {
              cells[colIndex].setAttribute('data-editable', 'true');
            }
          }
          return true;
        },

        disableCellEdit: function(targetId, colIndex) {
          var el = findTarget(targetId);
          if (!el) return false;
          var headerCells = el.querySelectorAll('.dataGrid_header_cell:not(.dataGrid_checkbox)');
          if (colIndex < 0 || colIndex >= headerCells.length) return false;
          headerCells[colIndex].setAttribute('data-editable', 'false');
          var rows = el.querySelectorAll('.dataGrid_row');
          for (var r = 0; r < rows.length; r++) {
            var cells = rows[r].querySelectorAll('.dataGrid_cell:not(.dataGrid_checkbox)');
            if (colIndex < cells.length) {
              cells[colIndex].setAttribute('data-editable', 'false');
            }
          }
          return true;
        },

        isCellEditable: function(targetId, colIndex) {
          var el = findTarget(targetId);
          if (!el) return false;
          var headerCells = el.querySelectorAll('.dataGrid_header_cell:not(.dataGrid_checkbox)');
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
          var checkboxes = el.querySelectorAll('.dataGrid_checkbox');
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
          var header = el.querySelector('.dataGrid_header');
          if (header) {
            var headerCb = document.createElement('div');
            headerCb.className = 'dataGrid_header_cell dataGrid_checkbox';
            headerCb.style.cssText = 'width:36px;min-width:36px;flex-shrink:0';
            headerCb.innerHTML = '<input type="checkbox" class="dataGrid_select_all">';
            header.insertBefore(headerCb, header.firstChild);
          }
          var rows = el.querySelectorAll('.dataGrid_row');
          for (var r = 0; r < rows.length; r++) {
            var rowCb = document.createElement('div');
            rowCb.className = 'dataGrid_cell dataGrid_checkbox';
            rowCb.style.cssText = 'width:36px;min-width:36px;flex-shrink:0';
            rowCb.innerHTML = '<input type="checkbox" class="dataGrid_row_check" data-ctrl-type="dataGrid_row_checkbox">';
            rows[r].insertBefore(rowCb, rows[r].firstChild);
          }
          return true;
        },

        _getRowCheckbox: function(targetId, rowIndex) {
          var el = findTarget(targetId);
          if (!el) return null;
          var rows = el.querySelectorAll('.dataGrid_row');
          if (rowIndex < 0 || rowIndex >= rows.length) return null;
          return rows[rowIndex].querySelector('.dataGrid_row_check') || null;
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
          var rows = el.querySelectorAll('.dataGrid_row');
          var indices = [];
          for (var i = 0; i < rows.length; i++) {
            var cb = rows[i].querySelector('.dataGrid_row_check');
            if (cb && cb.checked) indices.push(i);
          }
          return indices;
        },

        checkAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var checkboxes = el.querySelectorAll('.dataGrid_row_check');
          for (var i = 0; i < checkboxes.length; i++) { checkboxes[i].checked = true; }
          return true;
        },

        uncheckAll: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var checkboxes = el.querySelectorAll('.dataGrid_row_check');
          for (var i = 0; i < checkboxes.length; i++) { checkboxes[i].checked = false; }
          return true;
        }

      },

      cardBox: {
        _getHeader: function(targetId) {
          var el = findTarget(targetId);
          return el ? el.querySelector('.cardBox_header') : null;
        },

        _getTitle: function(targetId) {
          var header = this._getHeader(targetId);
          return header ? header.querySelector('.cardBox_header_title') : null;
        },

        _getCollapseBtn: function(targetId) {
          var header = this._getHeader(targetId);
          return header ? header.querySelector('.cardBox_collapse_btn') : null;
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
          return el ? el.querySelectorAll('.tabsContainer_headerBar_btn') : [];
        },

        _getTabPanes: function(targetId) {
          var el = this._getContainer(targetId);
          return el ? el.querySelectorAll('.tabsContainer_contentWrapper_panel') : [];
        },

        _findTabBtn: function(targetId, tabId) {
          var el = this._getContainer(targetId);
          return el ? el.querySelector('.tabsContainer_headerBar_btn[data-tab-name="' + tabId + '"]') : null;
        },

        _findTabPane: function(targetId, tabId) {
          var el = this._getContainer(targetId);
          return el ? el.querySelector('.tabsContainer_contentWrapper_panel[data-tab-name="' + tabId + '"]') : null;
        },

        _deactivateAll: function(targetId) {
          var btns = this._getTabBtns(targetId);
          for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active');
          }
          var panes = this._getTabPanes(targetId);
          for (var j = 0; j < panes.length; j++) {
            panes[j].classList.remove('active');
            panes[j].style.display = 'none';
          }
        },

        selectTab: function(targetId, tabId) {
          var btn = this._findTabBtn(targetId, tabId);
          var pane = this._findTabPane(targetId, tabId);
          if (!btn || !pane) return false;
          this._deactivateAll(targetId);
          btn.classList.add('active');
          pane.classList.add('active');
          pane.style.display = 'block';
          return true;
        },

        getActiveTab: function(targetId) {
          var btn = this._getContainer(targetId);
          if (!btn) return '';
          var active = btn.querySelector('.tabsContainer_headerBar_btn.active');
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
          var tabBar = el.querySelector('.tabsContainer_headerBar');
          var contentWrapper = el.querySelector('.tabsContainer_contentWrapper');
          if (!tabBar || !contentWrapper) return false;
          if (this._findTabBtn(targetId, tabId)) return false;
          tabId = tabId || ('tab_' + Date.now());
          tabTitle = tabTitle || ('标签' + (this._getTabBtns(targetId).length + 1));
          var btn = document.createElement('button');
          btn.className = 'tabsContainer_headerBar_btn';
          btn.setAttribute('data-ctrl-type', 'tabsContainer_headerBar_btn');
          btn.setAttribute('data-tab-name', tabId);
          btn.textContent = tabTitle;
          tabBar.appendChild(btn);
          var pane = document.createElement('div');
          pane.className = 'tabsContainer_contentWrapper_panel';
          pane.setAttribute('data-tab-name', tabId);
          contentWrapper.appendChild(pane);
          return tabId;
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
        },

        setTabHeaderVisible: function(targetId, visible) {
          var el = findTarget(targetId);
          if (!el) return false;
          var header = el.querySelector('.tabsContainer_headerBar');
          if (!header) return false;
          header.style.display = visible ? '' : 'none';
          return true;
        },

        getTabHeaderVisible: function(targetId) {
          var el = findTarget(targetId);
          if (!el) return false;
          var header = el.querySelector('.tabsContainer_headerBar');
          if (!header) return true;
          return header.style.display !== 'none';
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();