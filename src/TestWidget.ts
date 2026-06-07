// 从项目已有的 API 文件中导入注册函数（你不需要自己实现）
import { registerCustomWidget } from '@/config/customWidgetAPI'

registerCustomWidget({
    // ① 控件唯一标识（不能与内置控件重复）
    type: 'testWidget',
    // ② 库面板显示的名称
    label: '综合测试控件',
    // ③ 库面板显示的图标（可以用 emoji 或 Unicode）
    icon: '🧪',

    // ④ 控件的全部配置 (jsonConfig)
    jsonConfig: {
        label: '综合测试控件',
        icon: '🧪',

        // ---------- A. 默认样式数据 ----------
        defaultStyleData: {
            // A1. 控件自身的样式
            base: {
                width: 330,
                height: 150,
                backgroundColor: '#f9f9f9',
                borderColor: '#ddd',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
            },
            // A2. 子元素默认样式（key 必须与 htmlTemplate 中的 class 匹配，且以 . 开头）
            sub: {
                '.test-title': {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#333',
                },
                '.test-score': {
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#1890ff',
                },
                '.test-status': {
                    fontSize: '14px',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    display: 'inline-block',
                },
                '.test-theme': {
                    fontSize: '12px',
                    color: '#666',
                },
                '.test-extra': {
                    fontSize: '12px',
                    color: '#999',
                    borderTop: '1px solid #eee',
                    paddingTop: '8px',
                    marginTop: '4px',
                },
            },
            // A3. 伪类样式（作用于控件自身）
            pseudo: {
                hover: {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderColor: '#bbb',
                },
            },
        },

        // ---------- B. 可编辑的子元素样式（用户可在样式编辑器中修改）----------
        mappedProps: [
            {
                selector: '.test-title',
                base: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#333',
                },
                // 伪类样式（也可编辑）
                pseudo: {
                    hover: { color: '#ff6b6b' },
                },
            },
            {
                selector: '.test-score',
                base: {
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#1890ff',
                },
                pseudo: {},
            },
            {
                selector: '.test-status',
                base: {
                    fontSize: '14px',
                    padding: '4px 8px',
                    borderRadius: '20px',
                },
                pseudo: {},
            },
        ],

        // ---------- C. 结构样式（不可在样式编辑器中修改）----------
        structuralCSS: {
            '.test-title': ['display: block', 'margin-bottom: 4px'],
            '.test-score': ['display: inline-block', 'margin-right: 12px'],
            '.test-status': ['display: inline-block', 'vertical-align: middle'],
            '.test-theme': ['display: block', 'margin-top: 6px'],
            '.test-extra': ['display: block', 'transition: all 0.2s'],
        },

        // ---------- D. 动态计算属性（本例不需要，保留空数组）----------
        computedProps: [],

        // ---------- E. 业务属性（会在属性面板自动生成表单）----------
        defaultProps: {
            // 字符串 → 文本输入框
            title: '测试卡片',
            // 数字 → 数字输入框
            score: 88,
            // 布尔值 → 复选框
            showExtra: true,
            // 数组 → 下拉选择框
            theme: ['浅色', '深色'],
            // 以 '#' 开头的颜色字符串 → 颜色选择器
            accentColor: '#1890ff',
            // 必填的 visible 和 disabled（通用属性）
            visible: true,
            disabled: false,
        },
    },

    // ⑤ HTML 模板（使用 {{prop}} 引用 defaultProps 中的属性）
    // 注意：模板引擎只支持 {{propName}}（纯变量替换），不支持表达式/三元运算
    // 条件渲染请用 data 属性 + CSS 联动（见下方 cssString）
    // defaultStyleData为widget容器样式， htmlTemplate 最终预览页的显示效果
    htmlTemplate: `
        <div data-theme="{{theme}}" style="padding:16px;display:flex;border-radius:6px; flex-direction:column;height:100%;box-sizing:border-box;">
            <div class="test-title">{{title}}</div>
            <div>
                <span class="test-score">{{score}}</span>
                <span class="test-status" style="background-color: {{accentColor}}20; color: {{accentColor}};" data-active="{{showExtra}}">
                    <span class="status-on">● 活跃</span>
                    <span class="status-off">○ 停用</span>
                </span>
            </div>
            <div class="test-theme">主题：{{theme}}</div>
            <div class="test-extra" data-visible="{{showExtra}}">
                🌟 额外信息：你选择了 {{theme}} 主题
            </div>
        </div>
    `,

    // ⑥ 额外 CSS 字符串
    cssString: `
        /* 布尔→复选框联动：根据 showExtra 切换显示 ●活跃 / ○停用 */
        [data-active="true"]  .status-off { display: none; }
        [data-active="false"] .status-on  { display: none; }

        /* 下拉框联动：theme=深色 时切换子元素配色 */
        [data-theme="深色"] { background: #1a1a2e !important;}
        [data-theme="深色"] .test-title   { color: #cdd6f4 !important; }
        [data-theme="深色"] .test-score   { color: #89b4fa !important; }
        [data-theme="深色"] .test-theme   { color: #a6adc8 !important; }
        [data-theme="深色"] .test-extra   { color: #9399b2 !important; border-top-color: #45475a !important; }
        [data-theme="深色"] .test-status  { background-color: #89b4fa30 !important; }

        /* 根据 showExtra 控制 extra 区域显隐 */
        .test-extra[data-visible="false"] {
            display: none !important;
        }

        /* 简单的淡入效果 */
        .test-extra {
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to   { opacity: 1; transform: translateY(0); }
        }
    `,
})