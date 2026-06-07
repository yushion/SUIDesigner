SUIDesigner - WYSIWYG UI Designer
===================================

拖拽式可视化 UI 设计器，支持 24 种内置控件 + 自定义控件 API，一键导出独立 HTML。

项目文件:
  src/                    源码目录 (Vue 3 + TypeScript + Pinia)
  docs/                   设计文档
  public/webviewBridge.js 运行时脚本 (~178 个 API，与 WebView2 宿主通信)

快速开始:
  npm install             安装依赖
  npm run dev             启动开发服务器 (http://localhost:5173)
  npm run build           构建生产版本
  npm run preview         预览构建结果

在线部署:
  GitHub Pages:   自动构建 (.github/workflows/deploy.yml)
  CloudFlare Pages: 连接仓库，构建命令 npx vite build
  Vercel:          导入仓库，零配置

文档:
  docs/架构分析文档.md     完整架构分析
  docs/项目简介.txt        项目报告与建议
  docs/自定义控件开发指南.md 第三方控件开发教程

技术栈:
  Vue 3 + TypeScript + Pinia + Vite + Element Plus + Monaco Editor

许可: MIT
