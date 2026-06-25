import { registerCustomWidget } from '@/config/customWidgetAPI'

registerCustomWidget({
    type: 'fullTest',
    label: '完整测试控件',
    icon: '🧪',

    jsonConfig: {
        label: '完整测试控件',
        icon: '🧪',

        // ========== 1. 默认样式数据 ==========
        defaultStyleData: {
            // 外层容器样式（用户不可编辑）
            base: {
                width: 320,
                height: 170,
                backgroundColor: '#ffffff',
                borderColor: '#d9d9d9',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
            },
            // 子元素默认样式（用户不可见，但作为初始值）
            sub: {
                '.card-title': {
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2d3d',
                    marginBottom: '8px',
                },
                '.card-value': {
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#409eff',
                },
                '.card-status': {
                    fontSize: '14px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    display: 'inline-block',
                },
                '.card-footer': {
                    fontSize: '12px',
                    color: '#909399',
                    marginTop: '12px',
                    borderTop: '1px solid #ebeef5',
                    paddingTop: '8px',
                },
            },
            // 外层容器伪类（用户不可编辑）
            pseudo: {
                hover: {
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    borderColor: '#409eff',
                },
            },
        },

        // ========== 2. 可编辑的子元素样式（在样式编辑器中可修改） ==========
        mappedProps: [
            {
                selector: '.card-title',
                base: {
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2d3d',
                },
                // 子元素 hover 伪类（可编辑）
                pseudo: {
                    hover: { color: '#ff6b6b' },
                },
            },
            {
                selector: '.card-value',
                base: {
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#409eff',
                },
                pseudo: {},
            },
            {
                selector: '.card-status',
                base: {
                    fontSize: '14px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                },
                pseudo: {},
            },
        ],

        // ========== 3. 结构样式（不可编辑，始终生效） ==========
        structuralCSS: {
            '.card-title':   ['display: block', 'text-align: center'],
            '.card-value':   ['display: block', 'text-align: center', 'line-height: 1.2'],
            '.card-status':  ['display: inline-block', 'vertical-align: middle'],
            '.card-footer':  ['display: flex', 'justify-content: space-between', 'align-items: center'],
        },

        // ========== 4. 动态计算属性（暂时不支持，保留空数组） ==========
        computedProps: [],

        // ========== 5. 业务属性（类型自动推断生成属性面板表单） ==========
        defaultProps: {
            // 字符串 → 文本输入框
            title: '数据看板',
            // 数字 → 数字输入框
            value: 98,
            // 布尔 → 复选框
            showFooter: true,
            // 数组 → 下拉框（首项为默认值）
            theme: ['默认主题', '暗黑主题', '清新主题'],
            // 颜色（#开头）→ 颜色选择器
            accentColor: '#409eff',
            // 通用属性（必须）
            visible: true,
            disabled: false,
        },
    },

    // ========== 6. HTML 模板 ==========
    htmlTemplate: `
        <div class="card-wrapper" data-theme="{{theme}}">
            <div class="card-title">{{title}}</div>
            <div class="card-value" style="color: {{accentColor}};">{{value}}</div>
            <div class="card-status" style="background-color: {{accentColor}}20; color: {{accentColor}};" data-active="{{showFooter}}">
                <span class="status-on">● 启用</span>
                <span class="status-off">○ 禁用</span>
            </div>
            <div class="card-footer" data-visible="{{showFooter}}">
                <span>📊 数据实时更新</span>
                <span>⭐ 评分 4.8</span>
            </div>
        </div>
    `,

    // ========== 7. 额外 CSS 字符串（复杂联动 + 动画） ==========
    cssString: `
        /* 根据 showFooter 复选框控制底部区域显隐 */
        .card-footer[data-visible="false"] {
            display: none !important;
        }

        /* 根据复选框切换状态文字显隐 */
        [data-active="true"]  .status-off { display: none; }
        [data-active="false"] .status-on  { display: none; }

        /* 根据主题下拉框切换整体配色 */
        [data-theme="暗黑主题"] .card-wrapper {
            background: #1e1e2f;
            border-color: #3a3a4a;
        }
        [data-theme="暗黑主题"] .card-title {
            color: #cdd6f4 !important;
        }
        [data-theme="暗黑主题"] .card-value {
            color: #89b4fa !important;
        }
        [data-theme="暗黑主题"] .card-status {
            background-color: #89b4fa30 !important;
            color: #89b4fa !important;
        }
        [data-theme="暗黑主题"] .card-footer {
            color: #a6adc8 !important;
            border-top-color: #45475a !important;
        }

        [data-theme="清新主题"] .card-wrapper {
            background: #e8f5e9;
            border-color: #a5d6a7;
        }
        [data-theme="清新主题"] .card-title {
            color: #2e7d32 !important;
        }
        [data-theme="清新主题"] .card-value {
            color: #66bb6a !important;
        }
        [data-theme="清新主题"] .card-status {
            background-color: #66bb6a30 !important;
            color: #2e7d32 !important;
        }

        /* 简单进入动画 */
        .card-wrapper {
            animation: fadeSlideUp 0.3s ease;
        }
        @keyframes fadeSlideUp {
            from {
                opacity: 0;
                transform: translateY(8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `,
})