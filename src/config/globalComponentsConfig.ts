/**
 * @file config/globalComponentsConfig.ts
 * @description 全局组件（画布、信息框、输入框）的默认配置工厂函数
 *
 * 将原本硬编码在 widgetStore.ts 中的默认值抽取到此文件，
 * 实现配置集中管理，方便维护和主题化。
 */

import type { CanvasConfig, MessageBoxConfig, InputBoxConfig } from '@/types/index'

/** 画布默认 CSS 模板 */
const DEFAULT_CANVAS_CSS = `/* ===== 画布自定义样式 ===== */

/* 页面容器（border/border-radius 由画布配置动态生成，此处不写死） */
.page-container {
  position: relative;
  overflow: hidden;
  --canvas-bg-color: #ffffff;
  --canvas-opacity: 1;
}
.page-container::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-color: var(--canvas-bg-color);
  opacity: var(--canvas-opacity);
  border-radius: inherit;
}

/* 毛玻璃效果 */
.page-container.glass-effect {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 标题栏容器 */
.canvas-titlebar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #f5f5f5;
  opacity: 1;
  user-select: none;
  z-index: 10;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.canvas-titlebar .tb-left {
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.canvas-titlebar .tb-center {
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
}
.canvas-titlebar .tb-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  padding-right: 4px;
  flex-shrink: 0;
}
.canvas-titlebar .tb-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.canvas-titlebar .tb-title {
  font-size: 13px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.canvas-titlebar .tb-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: default;
  border-radius: 4px;
  flex-shrink: 0;
}
.canvas-titlebar .tb-btn:hover { background: rgba(0, 0, 0, 0.06); }
.canvas-titlebar .tb-btn:active { background: rgba(0, 0, 0, 0.1); }
.canvas-titlebar .tb-btn-close:hover { background: #e81123; color: #fff; }
.canvas-titlebar .tb-btn-close:active { background: #bf0a1a; color: #fff; }
`

/** 信息框默认 CSS 模板 */
const DEFAULT_MESSAGEBOX_CSS = `/* ===== 信息提示框自定义样式 ===== */
/* 蒙版层 */
.mb-overlay {
  background: rgba(0, 0, 0, 0.4);
}
/* 对话框容器 */
.mb-dialog {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
/* 标题栏 */
.mb-header {
  padding: 16px 20px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
/* 关闭按钮 */
.mb-header-close {
  color: #999;
}
.mb-header-close:hover {
  background: #f0f0f0;
  color: #333;
}
/* 内容区域 */
.mb-body {
  padding: 8px 20px 16px;
}
/* 图标 */
.mb-icon {
  font-size: 28px;
}
/* 消息文字 */
.mb-message {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
}
/* 底部按钮栏 */
.mb-footer {
  padding: 12px 20px 16px;
}
/* 普通按钮 */
.mb-btn {
  padding: 7px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
}
.mb-btn:hover {
  border-color: #409eff;
  color: #409eff;
}
/* 主按钮 */
.mb-btn.mb-btn-primary {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.mb-btn.mb-btn-primary:hover {
  background: #66b1ff;
}
`

/** 输入框默认 CSS 模板 */
const DEFAULT_INPUTBOX_CSS = `/* ===== 输入框自定义样式 ===== */
/* 蒙版层 */
.ib-overlay {
  background: rgba(0, 0, 0, 0.4);
}
/* 对话框容器 */
.ib-dialog {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
/* 标题栏 */
.ib-header {
  padding: 16px 20px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
/* 关闭按钮 */
.ib-header-close {
  color: #999;
}
.ib-header-close:hover {
  background: #f0f0f0;
  color: #333;
}
/* 内容区域 */
.ib-body {
  padding: 8px 20px 16px;
}
/* 提示文字 */
.ib-prompt {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 10px;
}
/* 输入框 */
.ib-input {
  width: 100%;
  padding: 7px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  outline: none;
  box-sizing: border-box;
}
.ib-input:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
/* 底部按钮栏 */
.ib-footer {
  padding: 12px 20px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
/* 普通按钮 */
.ib-btn {
  padding: 7px 18px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  min-width: 72px;
  text-align: center;
}
.ib-btn:hover {
  border-color: #409eff;
  color: #409eff;
}
/* 主按钮 */
.ib-btn.ib-btn-primary {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.ib-btn.ib-btn-primary:hover {
  background: #66b1ff;
}
`

/**
 * 获取默认画布配置
 * @returns 完整的 CanvasConfig 对象
 */
export function getDefaultCanvasConfig(): CanvasConfig {
  return {
    width: 800,
    height: 500,
    backgroundColor: '#ffffff',
    borderColor: '#e5e5e5',
    borderWidth: 1,
    borderRadius: 8,
    title: '标题',
    canvasFixedSize: true,
    masterOpacity: 1,
    opacity: 1,
    customCSS: DEFAULT_CANVAS_CSS,
    showTitleBar: true,
    titleBarTitle: '我的应用',
    titleBarAlign: 'left',
    titleBarIconName: 'fa-star',
    titleBarIconHtml: '',
    titleBarBgColor: '#f5f5f5',
    titleBarTextColor: '#333333',
    titleBarBtnColor: '#333333',
    titleBarOpacity: 1,
    glassEffect: true,
    showShadow: false,
    canvasDraggable: true,
    bodyBackground: {
      enabled: false,
      imageUrl: '',
      imageSize: 'cover',
      imageRepeat: 'no-repeat',
      imagePosition: 'center'
    }
  }
}

/**
 * 获取默认信息提示框配置
 * @returns MessageBoxConfig 对象
 */
export function getDefaultMessageBoxConfig(): MessageBoxConfig {
  return {
    title: '提示',
    message: '这是一条消息',
    icon: 'info',
    customIcon: '',
    buttons: 'okcancel',
    defaultButton: 0,
    width: 400,
    height: 0,
    showOverlay: false,
    closeOnOverlayClick: false,
    draggable: true,
    opacity: 1,
    customCSS: DEFAULT_MESSAGEBOX_CSS
  }
}

/**
 * 获取默认输入框配置
 * @returns InputBoxConfig 对象
 */
export function getDefaultInputBoxConfig(): InputBoxConfig {
  return {
    title: '输入',
    prompt: '请输入内容',
    defaultValue: '',
    inputType: 'text',
    buttons: 'okcancel',
    defaultButton: 0,
    width: 400,
    height: 0,
    showOverlay: false,
    closeOnOverlayClick: false,
    draggable: true,
    opacity: 1,
    customCSS: DEFAULT_INPUTBOX_CSS
  }
}

export { DEFAULT_CANVAS_CSS, DEFAULT_MESSAGEBOX_CSS, DEFAULT_INPUTBOX_CSS }