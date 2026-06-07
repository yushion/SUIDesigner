# SUIDesigner

**所见即所得的 UI 设计器** — 拖拽式可视化设计，一键导出独立 HTML。

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.2-ffd859)](https://pinia.vuejs.org/)

## ✨ 特性

- 🎨 **24 种内置控件**：按钮、输入框、选择框、开关、组合框、文本标签、分割线
  超链接、文本域、单选框组、标签页容器、进度条、日期选择器、日志输出
  图标按钮、图片框、卡片框、列表框、树形框、多项表格、右键菜单、气泡提示框
- 🔌 **自定义控件 API**：纯 JSON 配置 + HTML 模板，无需写 Vue 组件即可扩展
- 🎯 **7 套预设主题**：默认 / Mica / 亚克力 / 高透明，各含明暗双模式
- ⚡ **双速通道性能**：rAF 限流 + 150ms 防抖，高频操作不卡顿
- 📝 **Monaco CSS 编辑器**：源码级样式编辑，实时预览
- 🔄 **50 步撤销/重做**：完整设计快照，rAF 合并防高频
- 🔗 **webviewBridge.js**：~178 个运行时 API，与 WebView2 宿主双向通信
- 📦 **纯 JSON 配置**：控件样式与代码分离，修改外观无需改代码

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

开发服务器默认运行在 `http://localhost:5173`

## 🌐 在线部署

项目支持一键部署到以下平台：

| 平台 | 方式 |
|------|------|
| **GitHub Pages** | 推送触发 `.github/workflows/deploy.yml` 自动构建 |
| **CloudFlare Pages** | 连接 GitHub 仓库，构建命令 `npx vite build` |
| **Vercel** | 导入 GitHub 仓库，零配置自动部署 |

## 🎯 自定义控件

通过 `registerCustomWidget()` 即可扩展控件库：

```typescript
import { registerCustomWidget } from '@/config/customWidgetAPI'

registerCustomWidget({
  type: 'myWidget',
  label: '我的控件',
  icon: '⭐',
  jsonConfig: { /* 标准 JSON 配置 */ },
  htmlTemplate: '<div>{{title}}</div>',
})
```

详见 `docs/自定义控件开发指南.md`

## 📁 项目结构

```
src/
├── components/       # Vue 组件（控件库/画布/属性面板/23个控件）
├── config/           # 配置层（注册中心/自定义控件API/主题/24个JSON）
├── stores/           # Pinia 状态管理（widgetStore/themeStore）
├── utils/            # 工具层（CSS生成器/解析器/导出器/SSR引擎）
├── types/            # TypeScript 类型定义
├── examples/         # 自定义控件完整示例
└── composables/      # Vue Composables（键盘/缩放）
```

## 📖 文档

| 文档 | 内容 |
|------|------|
| `docs/架构分析文档.md` | 完整架构分析（状态管理/样式数据流/渲染链路/性能优化） |
| `docs/项目简介.txt` | 项目报告与后续建议 |
| `docs/自定义控件开发指南.md` | 第三方自定义控件开发教程 |
| `public/webviewBridge_api_doc.html` | webviewBridge 完整 API 参考（~178 个方法，26 个命名空间） |

## 🔗 webviewBridge API 文档

导出后的 HTML 通过 `webviewBridge.js` 与 WebView2 宿主双向通信，提供 ~178 个运行时 API。

打开 `public/webviewBridge_api_doc.html` 即可查看完整 API 参考，包含：

- **26 个命名空间**：`api.public`、`api.canvas`、`api.button` ~ `api.dataGrid` 等
- **交互式搜索**：侧边栏导航 + 代码高亮
- **每个 API 的方法签名、参数说明和使用示例**

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 + Composition API | 前端框架 |
| TypeScript | 类型安全 |
| Pinia | 状态管理 |
| Vite | 构建工具 |
| Element Plus | UI 组件库 |
| Monaco Editor | CSS 代码编辑器 |
| ECharts | 图表渲染 |

## 📄 License

MIT
