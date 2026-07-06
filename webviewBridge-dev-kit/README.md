# webviewBridge 开发知识包

本包包含开发 webviewBridge 页面所需的所有文档、规范和参考文件。可直接打包分享给开发者或喂给 AI 使用。

---

## 快速开始

### 人类开发者
浏览器打开以下文件阅读：
1. `dev-guide.html` → 完整开发文档
2. `public/webviewBridge_api_doc.html` → API 文档
3. `references/example.html` → 完整可运行示例

### 喂给 AI（一次性拖入，AI 自动遵循规范开发）
按顺序将以下文件**拖入 AI 对话窗口**：
1. `SKILL.md` — 工作流 + 6 种复杂控件完整模板
2. `.cursorrules` — 20 条硬性约束 + 控件速查表
3. `references/quick-ref.md` — data-ctrl-type 快速对照卡

以上 3 个文件足以让 AI 正确生成页面。如需更详细参考，再追加：
4. `dev-guide.html` — 完整开发文档
5. `references/example.html` — 完整可运行示例

---

## 目录结构

```
webviewBridge-dev-kit/
├── README.md                        本说明文件
├── .cursorrules                     AI 规则：20 条硬性约束 + 控件速查表
├── SKILL.md                         AI 技能：工作流 + 6 种复杂控件完整模板 + 踩坑表
├── dev-guide.html                   完整开发文档（浏览器打开）
│
├── public/
│   ├── webviewBridge.js             ★ 桥接脚本（页面必须引入）
│   ├── webviewBridge_api_doc.html   完整 API 方法文档
│   └── docs/
│       ├── api/                     各控件独立 API 文档（27 个 .js 文件）
│       ├── data/                    开发指南数据文件
│       ├── app.js                   文档网站主程序
│       └── styles.css               文档网站样式
│
└── references/
    ├── quick-ref.md                 data-ctrl-type 对照表 + 子结构表 + HTML 骨架
    └── example.html                 完整可运行的示例页面
```

---

## 文件说明

| 文件 | 用途 | AI 必读 |
|------|------|--------|
| `SKILL.md` | 告诉 AI 完整工作流：先读什么、按什么顺序生成、怎么自检 | ⭐ 必读 |
| `.cursorrules` | 告诉 AI 不能违反什么：20 条约束 + 控件类型速查 | ⭐ 必读 |
| `references/quick-ref.md` | 控件 data-ctrl-type 快速对照 + 子结构速查表 | ⭐ 推荐 |
| `dev-guide.html` | 完整开发文档（9 章，含模板、属性表、主题指南） | 推荐 |
| `references/example.html` | 完整可运行的实际页面（对照 HTML/CSS 写法） | 推荐 |
| `public/webviewBridge.js` | 桥接脚本（页面 `<script src="webviewBridge.js">` 引入） | 运行时 |
| `public/webviewBridge_api_doc.html` | 所有 API 方法文档 | 按需 |

---

## 为什么可靠

- ✅ 所有规则和模板**提取自设计器实际输出的 example.html**
- ✅ API 文档**基于 webviewBridge.js 源码**生成
- ✅ 规则文件**不包含臆造值**（不存在的 CSS 变量、渐变等）
- ✅ 三层架构（Rules + Skill + 文档）形成知识金字塔
- ✅ `references/example.html` 是可运行的完整页面，可直接在 WebView2 中打开
