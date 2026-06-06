/**
 * @file utils/ui-runtime.ts
 * @description 运行时库 — 为导出的预览 HTML 提供 TreeManager 和 DataTableManager 交互功能
 * 导出为字符串常量，内联到预览 HTML 中
 */

/**
 * TreeManager 运行时脚本
 * 提供完整的树形控件交互：展开/折叠、选中、双击编辑、增删改节点
 */
export const TREE_RUNTIME_SCRIPT = `
(function() {
  'use strict';

  if (window.__TREE_RUNTIME_INITIALIZED__) return;
  window.__TREE_RUNTIME_INITIALIZED__ = true;

  var TreeManager = {
    configs: {},
    selectedNodes: {},

    /**
     * 初始化树形控件
     * @param {Object} config - { id: string, data: TreeNode[], editable: boolean, showIcon: boolean }
     */
    init: function(config) {
      var treeId = config.id;
      var data = config.data || [];
      var editable = !!config.editable;
      var showIcon = !!config.showIcon;
      var showCheckbox = !!config.showCheckbox;

      TreeManager.configs[treeId] = {
        id: treeId,
        data: data,
        editable: editable,
        showIcon: showIcon,
        showCheckbox: showCheckbox
      };

      var container = document.getElementById(treeId);
      if (!container) return;

      container.innerHTML = '';

      for (var i = 0; i < data.length; i++) {
        var nodeEl = TreeManager.createNodeElement(treeId, data[i], 0);
        if (nodeEl) container.appendChild(nodeEl);
      }

      TreeManager._bindGlobalEvents(container, treeId);
    },

    /**
     * 递归创建节点 DOM 元素
     * @param {string} treeId - 树控件 ID
     * @param {Object} node - 节点数据 { id, text, expanded, children }
     * @param {number} level - 层级深度
     * @returns {HTMLElement}
     */
    createNodeElement: function(treeId, node, level) {
      var config = TreeManager.configs[treeId];
      if (!config || !node) return null;

      var nodeDiv = document.createElement('div');
      nodeDiv.className = 'tree-node';
      nodeDiv.setAttribute('data-tree-id', treeId);
      nodeDiv.setAttribute('data-node-id', node.id);
      nodeDiv.setAttribute('data-level', level);

      if (config.editable) {
        nodeDiv.setAttribute('data-editable', 'true');
        nodeDiv.classList.add('editable');
      }

      var contentDiv = document.createElement('div');
      contentDiv.className = 'tree-node-content';

      if (config.showCheckbox) {
        var checkboxSpan = document.createElement('span');
        checkboxSpan.className = 'tree-checkbox';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'tree-node-check';
        cb.checked = !!node.checked;
        cb.setAttribute('data-ctrl-type', 'treeview_node_checkbox');
        checkboxSpan.appendChild(cb);
        contentDiv.appendChild(checkboxSpan);
      }

      var toggle = document.createElement('span');
      toggle.className = 'tree-toggle';
      toggle.textContent = '';
      if (node.children && node.children.length > 0) {
        if (node.expanded === true) {
          toggle.classList.add('expanded');
        } else {
          toggle.classList.add('collapsed');
        }
      } else {
        toggle.classList.add('empty');
      }
      contentDiv.appendChild(toggle);

      var icon = document.createElement('span');
      icon.className = 'tree-icon';
      var showIcon = config.showIcon !== false;
      if (showIcon) {
        var nodeIcon = node.icon || '';
        if (!nodeIcon) {
          nodeIcon = (node.children && node.children.length > 0) ? '\uD83D\uDCC1' : '\uD83D\uDCC4';
        }
        icon.textContent = nodeIcon;
      }

      var label = document.createElement('span');
      label.className = 'tree-label';
      label.textContent = node.text || '';

      contentDiv.appendChild(icon);
      contentDiv.appendChild(label);
      nodeDiv.appendChild(contentDiv);

      if (node.children && node.children.length > 0) {
        var childrenDiv = document.createElement('div');
        childrenDiv.className = 'tree-children';
        if (node.expanded === false) {
          childrenDiv.style.display = 'none';
        }
        for (var i = 0; i < node.children.length; i++) {
          var childEl = TreeManager.createNodeElement(treeId, node.children[i], level + 1);
          if (childEl) childrenDiv.appendChild(childEl);
        }
        nodeDiv.appendChild(childrenDiv);
      }

      return nodeDiv;
    },

    /**
     * 展开/折叠节点
     * @param {string} treeId - 树控件 ID
     * @param {string} nodeId - 节点 ID
     */
    toggleNode: function(treeId, nodeId) {
      var container = document.getElementById(treeId);
      if (!container) return;

      var nodeEl = container.querySelector('[data-node-id="' + nodeId + '"]');
      if (!nodeEl) return;

      var toggle = nodeEl.querySelector(':scope > .tree-node-content > .tree-toggle');
      var children = nodeEl.querySelector(':scope > .tree-children');
      if (!toggle || !children) return;

      var node = TreeManager.findNodeData(TreeManager.configs[treeId] ? TreeManager.configs[treeId].data : null, nodeId);
      if (!node) return;

      if (toggle.classList.contains('expanded')) {
        toggle.classList.remove('expanded');
        toggle.classList.add('collapsed');
        children.style.display = 'none';
        node.expanded = false;
      } else {
        toggle.classList.remove('collapsed');
        toggle.classList.add('expanded');
        children.style.display = '';
        node.expanded = true;
      }
    },

    /**
     * 选中节点（高亮选中，取消之前的选中）
     * @param {string} treeId - 树控件 ID
     * @param {string} nodeId - 节点 ID
     */
    selectNode: function(treeId, nodeId) {
      var container = document.getElementById(treeId);
      if (!container) return;

      var prevSelected = container.querySelector('.tree-node-content.selected');
      if (prevSelected) {
        prevSelected.classList.remove('selected');
      }

      var nodeEl = container.querySelector('[data-node-id="' + nodeId + '"]');
      if (!nodeEl) return;

      var content = nodeEl.querySelector(':scope > .tree-node-content');
      if (content) {
        content.classList.add('selected');
      }

      TreeManager.selectedNodes[treeId] = nodeId;
    },

    /**
     * 获取当前选中的节点数据
     * @param {string} treeId - 树控件 ID
     * @returns {Object|null}
     */
    getSelectedNode: function(treeId) {
      var nodeId = TreeManager.selectedNodes[treeId];
      if (!nodeId) return null;
      var config = TreeManager.configs[treeId];
      if (!config) return null;
      return TreeManager.findNodeData(config.data, nodeId);
    },

    /**
     * 递归查找节点数据
     * @param {Object[]} nodes - 节点数组
     * @param {string} nodeId - 节点 ID
     * @returns {Object|null}
     */
    findNodeData: function(nodes, nodeId) {
      if (!nodes) return null;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) return nodes[i];
        if (nodes[i].children && nodes[i].children.length > 0) {
          var found = TreeManager.findNodeData(nodes[i].children, nodeId);
          if (found) return found;
        }
      }
      return null;
    },

    /**
     * 添加子节点并重新渲染
     * @param {string} treeId - 树控件 ID
     * @param {string} parentNodeId - 父节点 ID（父节点必须存在 children）
     * @param {Object} newNodeData - 新节点数据 { id, text, children }
     */
    addNode: function(treeId, parentNodeId, newNodeData) {
      var config = TreeManager.configs[treeId];
      if (!config || !newNodeData) return false;

      var parent = TreeManager.findNodeData(config.data, parentNodeId);
      if (!parent) return false;

      if (!parent.children) {
        parent.children = [];
      }

      parent.children.push({
        id: newNodeData.id || ('node_' + Date.now()),
        text: newNodeData.text || '新节点',
        expanded: newNodeData.expanded !== undefined ? newNodeData.expanded : false,
        children: newNodeData.children || undefined
      });

      TreeManager.init(config);
      return true;
    },

    /**
     * 删除节点并重新渲染
     * @param {string} treeId - 树控件 ID
     * @param {string} nodeId - 节点 ID
     */
    removeNode: function(treeId, nodeId) {
      var config = TreeManager.configs[treeId];
      if (!config) return false;

      var removed = TreeManager._removeNodeFromData(config.data, nodeId);
      if (removed) {
        TreeManager.init(config);
        return true;
      }
      return false;
    },

    /**
     * 从数据中递归删除节点
     * @param {Object[]} nodes - 节点数组
     * @param {string} nodeId - 节点 ID
     * @returns {boolean}
     */
    _removeNodeFromData: function(nodes, nodeId) {
      if (!nodes) return false;
      for (var i = nodes.length - 1; i >= 0; i--) {
        if (nodes[i].id === nodeId) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && nodes[i].children.length > 0) {
          if (TreeManager._removeNodeFromData(nodes[i].children, nodeId)) {
            return true;
          }
        }
      }
      return false;
    },

    /**
     * 更新节点文本并重新渲染
     * @param {string} treeId - 树控件 ID
     * @param {string} nodeId - 节点 ID
     * @param {string} text - 新文本
     */
    updateNode: function(treeId, nodeId, text) {
      var config = TreeManager.configs[treeId];
      if (!config) return false;

      var node = TreeManager.findNodeData(config.data, nodeId);
      if (!node) return false;

      node.text = text;
      TreeManager.init(config);
      return true;
    },

    /**
     * 展开节点
     * @param {string} treeId - 树控件 ID
     * @param {string} nodeId - 节点 ID
     */
    expandNode: function(treeId, nodeId) {
      var node = TreeManager.findNodeData(
        TreeManager.configs[treeId] ? TreeManager.configs[treeId].data : null,
        nodeId
      );
      if (node) {
        node.expanded = true;
      }
      var container = document.getElementById(treeId);
      if (!container) return;
      var nodeEl = container.querySelector('[data-node-id="' + nodeId + '"]');
      if (!nodeEl) return;
      var toggle = nodeEl.querySelector(':scope > .tree-node-content > .tree-toggle');
      var children = nodeEl.querySelector(':scope > .tree-children');
      if (toggle) {
        toggle.classList.remove('collapsed');
        toggle.classList.add('expanded');
      }
      if (children) {
        children.style.display = '';
      }
    },

    /**
     * 折叠节点
     * @param {string} treeId - 树控件 ID
     * @param {string} nodeId - 节点 ID
     */
    collapseNode: function(treeId, nodeId) {
      var node = TreeManager.findNodeData(
        TreeManager.configs[treeId] ? TreeManager.configs[treeId].data : null,
        nodeId
      );
      if (node) {
        node.expanded = false;
      }
      var container = document.getElementById(treeId);
      if (!container) return;
      var nodeEl = container.querySelector('[data-node-id="' + nodeId + '"]');
      if (!nodeEl) return;
      var toggle = nodeEl.querySelector(':scope > .tree-node-content > .tree-toggle');
      var children = nodeEl.querySelector(':scope > .tree-children');
      if (toggle) {
        toggle.classList.remove('expanded');
        toggle.classList.add('collapsed');
      }
      if (children) {
        children.style.display = 'none';
      }
    },

    /**
     * 动态设置树控件的编辑状态
     * @param {string} treeId - 树控件 ID
     * @param {boolean} enabled - 是否允许编辑
     */
    setEditable: function(treeId, enabled) {
      var config = TreeManager.configs[treeId];
      if (!config) return;
      config.editable = !!enabled;
      var el = document.getElementById(treeId);
      if (el) {
        el.setAttribute('data-editable', enabled ? 'true' : 'false');
      }
    },

    /**
     * 动态设置树控件的复选框显示状态
     * @param {string} treeId - 树控件 ID
     * @param {boolean} show - 是否显示复选框
     */
    showCheckbox: function(treeId, show) {
      var config = TreeManager.configs[treeId];
      if (!config) return false;
      config.showCheckbox = !!show;
      var el = document.getElementById(treeId);
      if (el) {
        el.setAttribute('data-show-checkbox', show ? 'true' : 'false');
      }
      return true;
    },

    /**
     * 设置指定节点的勾选状态
     * @param {string} treeId - 树控件 ID
     * @param {string} nodeId - 节点 ID
     * @param {boolean} checked - 是否勾选
     */
    setNodeChecked: function(treeId, nodeId, checked) {
      var container = document.getElementById(treeId);
      if (!container) return false;
      var nodeEl = container.querySelector('[data-node-id="' + nodeId + '"]');
      if (!nodeEl) return false;
      var cbs = nodeEl.querySelectorAll('.tree-node-check');
      for (var i = 0; i < cbs.length; i++) {
        cbs[i].checked = !!checked;
      }
      return true;
    },

    /**
     * 获取指定节点的勾选状态
     * @param {string} treeId - 树控件 ID
     * @param {string} nodeId - 节点 ID
     * @returns {boolean} 是否勾选
     */
    isNodeChecked: function(treeId, nodeId) {
      var container = document.getElementById(treeId);
      if (!container) return false;
      var nodeEl = container.querySelector('[data-node-id="' + nodeId + '"]');
      if (!nodeEl) return false;
      var cb = nodeEl.querySelector('.tree-node-check');
      return cb ? cb.checked : false;
    },

    /**
     * 获取所有已勾选的节点 ID 数组
     * @param {string} treeId - 树控件 ID
     * @returns {string[]} 已勾选节点 ID 数组
     */
    getCheckedNodes: function(treeId) {
      var container = document.getElementById(treeId);
      if (!container) return [];
      var checkboxes = container.querySelectorAll('.tree-node-check:checked');
      var ids = [];
      for (var i = 0; i < checkboxes.length; i++) {
        var nodeEl = checkboxes[i].closest('.tree-node');
        if (nodeEl) {
          ids.push(nodeEl.getAttribute('data-node-id'));
        }
      }
      return ids;
    },

    /**
     * 全选所有节点的复选框
     * @param {string} treeId - 树控件 ID
     */
    checkAll: function(treeId) {
      var container = document.getElementById(treeId);
      if (!container) return false;
      var checkboxes = container.querySelectorAll('.tree-node-check');
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
      }
      return true;
    },

    /**
     * 取消全选所有节点的复选框
     * @param {string} treeId - 树控件 ID
     */
    uncheckAll: function(treeId) {
      var container = document.getElementById(treeId);
      if (!container) return false;
      var checkboxes = container.querySelectorAll('.tree-node-check');
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
      return true;
    },

    /**
     * 编辑节点标签（内联编辑）
     * @param {string} treeId - 树控件 ID
     * @param {string} nodeId - 节点 ID
     */
    editNodeLabel: function(treeId, nodeId) {
      var config = TreeManager.configs[treeId];
      if (!config || !config.editable) return;

      var container = document.getElementById(treeId);
      if (!container) return;

      var nodeEl = container.querySelector('[data-node-id="' + nodeId + '"]');
      if (!nodeEl) return;

      var label = nodeEl.querySelector(':scope > .tree-node-content > .tree-label');
      if (!label) return;

      var node = TreeManager.findNodeData(config.data, nodeId);
      if (!node) return;

      var oldText = node.text;
      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'tree-edit-input';
      input.value = oldText;

      label.replaceWith(input);
      input.focus();
      input.select();

      var save = function() {
        var newText = input.value.trim();
        if (newText && newText !== oldText) {
          node.text = newText;
        }
        var newLabel = document.createElement('span');
        newLabel.className = 'tree-label';
        newLabel.textContent = node.text;
        input.replaceWith(newLabel);
      };

      var cancel = function() {
        var newLabel = document.createElement('span');
        newLabel.className = 'tree-label';
        newLabel.textContent = oldText;
        input.replaceWith(newLabel);
      };

      input.addEventListener('blur', save);
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          save();
        }
        if (e.key === 'Escape') {
          cancel();
        }
      });
    },

    /**
     * 绑定全局事件委托到树容器
     * @param {HTMLElement} container - 树容器元素
     * @param {string} treeId - 树控件 ID
     */
    _bindGlobalEvents: function(container, treeId) {
      var config = TreeManager.configs[treeId];
      if (!config) return;

      container.onclick = function(e) {
        if (e.target.closest('.tree-node-check')) {
          return;
        }

        var content = e.target.closest('.tree-node-content');
        if (!content) return;

        var nodeEl = content.closest('.tree-node');
        if (!nodeEl) return;

        var nodeId = nodeEl.getAttribute('data-node-id');
        if (!nodeId) return;

        var targetTreeId = nodeEl.getAttribute('data-tree-id');
        if (targetTreeId !== treeId) return;

        if (e.target.closest('.tree-toggle')) {
          TreeManager.toggleNode(treeId, nodeId);
          return;
        }

        TreeManager.selectNode(treeId, nodeId);
      };

      container.ondblclick = function(e) {
        var content = e.target.closest('.tree-node-content');
        if (!content) return;

        var nodeEl = content.closest('.tree-node');
        if (!nodeEl) return;

        var nodeId = nodeEl.getAttribute('data-node-id');
        if (!nodeId) return;

        var targetTreeId = nodeEl.getAttribute('data-tree-id');
        if (targetTreeId !== treeId) return;

        if (config.editable) {
          TreeManager.editNodeLabel(treeId, nodeId);
        }
      };

      container.addEventListener('change', function(e) {
        var target = e.target;
        if (!target || !target.classList.contains('tree-node-check')) return;
        var nodeEl = target.closest('.tree-node');
        if (!nodeEl) return;
        var targetTreeId = nodeEl.getAttribute('data-tree-id');
        if (targetTreeId !== treeId) return;
        var checked = target.checked;
        var descendants = nodeEl.querySelectorAll('.tree-node-check');
        for (var i = 0; i < descendants.length; i++) {
          descendants[i].checked = checked;
        }
      });
    }
  };

  window.TreeManager = TreeManager;
})();
`

/**
 * DataTableManager 运行时脚本
 * 提供多项表格控件的交互功能：行选择、单元格编辑、动态增删行
 */
export const DATATABLE_RUNTIME_SCRIPT = `
(function(){
  var DataTableManager = {
    tables: {},

    /**
     * 初始化表格
     */
    init: function(tableId, config) {
      var container = document.getElementById(tableId);
      if (!container) return;

      var store = {
        id: tableId,
        container: container,
        columns: config.columns || [],
        rows: config.rows || [],
        showCheckbox: config.showCheckbox !== false,
        allowAdd: config.allowAdd === true,
        allowDelete: config.allowDelete === true,
        editable: config.editable === true,
        alwaysShowSelection: config.alwaysShowSelection === true,
        selectedRowIndex: -1
      };

      this.tables[tableId] = store;
      this.bindEvents(store);
    },

    /**
     * 绑定表格事件
     */
    bindEvents: function(store) {
      var self = this;
      var container = store.container;

      // 表头全选复选框
      var selectAll = container.querySelector('.data-grid-select-all');
      if (selectAll) {
        selectAll.addEventListener('change', function(e) {
          self.selectAllRows(store.id, e.target.checked);
        });
      }

      // 行复选框
      container.querySelectorAll('.data-grid-row-check').forEach(function(cb) {
        cb.addEventListener('change', function(e) {
          var row = e.target.closest('.data-grid-row');
          if (row) {
            var idx = parseInt(row.getAttribute('data-row-index'), 10);
            var rowData = self.getRowData(store.id, idx);
            if (rowData) {
              rowData.selected = e.target.checked;
              self.updateSelectAllState(store);
            }
          }
        });
      });

      // 行点击高亮处理
      container.querySelectorAll('.data-grid-row').forEach(function(row) {
        row.addEventListener('click', function(e) {
          if (e.target.tagName === 'INPUT') return;
          // 移除其他行的高亮
          container.querySelectorAll('.data-grid-row.data-grid-row-focused').forEach(function(r) {
            r.classList.remove('data-grid-row-focused');
          });
          // 高亮当前行
          row.classList.add('data-grid-row-focused');
          store.selectedRowIndex = parseInt(row.getAttribute('data-row-index'), 10);
        });
      });

      // 单元格双击编辑
      if (store.editable) {
        container.querySelectorAll('.data-grid-cell[data-col-key]').forEach(function(cell) {
          if (cell.closest('.data-grid-checkbox')) return;
          cell.addEventListener('dblclick', function() {
            var row = cell.closest('.data-grid-row');
            if (!row) return;
            var ri = parseInt(row.getAttribute('data-row-index'), 10);
            var field = cell.getAttribute('data-col-key');
            if (ri === undefined || !field) return;
            self.startEditCell(store, cell, ri, field);
          });
        });
      }
    },

    /** 更新全选复选框状态 */
    updateSelectAllState: function(store) {
      var selectAll = store.container.querySelector('.data-grid-select-all');
      if (!selectAll) return;
      var total = store.rows.length;
      var selected = store.rows.filter(function(r) { return r.selected; }).length;
      selectAll.checked = (total > 0 && selected === total);
      selectAll.indeterminate = (selected > 0 && selected < total);
    },

    /** 全选/取消全选 */
    selectAllRows: function(tableId, checked) {
      var store = this.tables[tableId];
      if (!store) return;
      store.rows.forEach(function(r) {
        r.selected = checked;
      });
      store.container.querySelectorAll('.data-grid-row-check').forEach(function(cb) {
        cb.checked = checked;
      });
    },

    /** 开始编辑单元格 */
    startEditCell: function(store, cell, ri, field) {
      var self = this;
      if (!store.editable) return;
      if (cell.hasAttribute('data-editable')) return;
      if (cell.querySelector('input')) return;
      var oldVal = cell.textContent || '';
      var input = document.createElement('input');
      input.type = 'text';
      input.value = oldVal;
      input.style.cssText = 'width:100%;height:100%;border:1px solid #1890ff;outline:none;padding:2px 4px;font-size:12px;font-family:inherit;background:#fff;box-sizing:border-box;margin:-2px -4px;';
      cell.textContent = '';
      cell.appendChild(input);
      input.focus();
      input.select();

      var commit = function() {
        var val = input.value;
        cell.textContent = val;
        self.setCellValue(store.id, ri, field, val);
      };
      input.addEventListener('blur', commit);
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          commit();
        } else if (e.key === 'Escape') {
          cell.textContent = oldVal;
        }
      });
    },

    /** 设置单元格值 */
    setCellValue: function(tableId, rowIndex, field, value) {
      var store = this.tables[tableId];
      if (!store || !store.rows[rowIndex]) return;
      store.rows[rowIndex].cells[field] = value;
    },

    /** 获取行数据 */
    getRowData: function(tableId, rowIndex) {
      var store = this.tables[tableId];
      if (!store || !store.rows[rowIndex]) return null;
      return store.rows[rowIndex];
    },

    /** 添加行 */
    addRow: function(tableId, rowData) {
      var store = this.tables[tableId];
      if (!store) return;
      var newRow = {
        id: tableId + '_row_' + (store.rows.length + 1),
        cells: {},
        selected: false
      };
      store.columns.forEach(function(col) {
        newRow.cells[col.field] = (rowData && rowData[col.field] !== undefined) ? rowData[col.field] : '';
      });
      store.rows.push(newRow);
      this.refreshDOM(store);
    },

    /** 删除行 */
    removeRow: function(tableId, rowIndex) {
      var store = this.tables[tableId];
      if (!store || !store.rows[rowIndex]) return;
      store.rows.splice(rowIndex, 1);
      this.refreshDOM(store);
    },

    /** 动态设置表格的编辑状态 */
    setEditable: function(tableId, enabled) {
      var store = this.tables[tableId];
      if (!store) return;
      store.editable = !!enabled;
      store.container.setAttribute('data-editable', enabled ? 'true' : 'false');
      if (!enabled) return;
      var self = this;
      store.container.querySelectorAll('.data-grid-cell[data-col-key]').forEach(function(cell) {
        if (cell.closest('.data-grid-checkbox')) return;
        if (cell._dgEditBound) return;
        cell._dgEditBound = true;
        cell.addEventListener('dblclick', function() {
          var row = cell.closest('.data-grid-row');
          if (!row) return;
          var ri = parseInt(row.getAttribute('data-row-index'), 10);
          var field = cell.getAttribute('data-col-key');
          if (ri === undefined || !field) return;
          self.startEditCell(store, cell, ri, field);
        });
      });
    },

    /** 刷新 DOM */
    refreshDOM: function(store) {
      var self = this;
      var body = store.container.querySelector('.data-grid-body');
      if (!body) return;

      var html = '';
      store.rows.forEach(function(row, ri) {
        var rowClass = (store.selectedRowIndex === ri) ? 'data-grid-row data-grid-row-focused' : 'data-grid-row';
        html += '<div class="' + rowClass + '" data-row-index="' + ri + '" data-row-id="' + row.id + '">';
        if (store.showCheckbox) {
          var checked = row.selected ? ' checked' : '';
          html += '<div class="data-grid-cell data-grid-checkbox" style="width:36px;min-width:36px;flex-shrink:0"><input type="checkbox" class="data-grid-row-check"' + checked + '></div>';
        }
        store.columns.forEach(function(col) {
          var w = col.width || 100;
          var val = row.cells && row.cells[col.field] !== undefined && row.cells[col.field] !== null ? String(row.cells[col.field]) : '';
          html += '<div class="data-grid-cell" data-col-key="' + col.field + '" style="width:' + w + 'px;min-width:' + w + 'px;flex-shrink:0" title="' + val + '">' + val + '</div>';
        });
        html += '</div>';
      });
      body.innerHTML = html;
      this.bindEvents(store);
    }
  };

  window.DataTableManager = DataTableManager;
})();
`