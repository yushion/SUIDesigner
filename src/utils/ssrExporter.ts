/**
 * @file utils/ssrExporter.ts
 * @description Vue SSR 导出引擎 - 使用 @vue/server-renderer 渲染 PreviewCanvas 到 HTML 字符串
 *
 * 替代手动 HTML 拼接，确保设计区和预览区使用相同的样式渲染逻辑。
 * PreviewCanvas 中的 PreviewWidget 使用与设计区相同的 widget.style 内联样式。
 */

import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import type { CanvasConfig, Widget } from '@/types/index'
import PreviewCanvas from '@/components/export/PreviewCanvas.vue'

/**
 * 使用 Vue SSR 将 PreviewCanvas 渲染为 HTML 字符串
 *
 * @param canvasConfig 画布配置
 * @param widgets 控件列表
 * @returns 渲染后的 HTML 字符串（仅画布区域，不含 <html>/<head>/<body>）
 */
export async function renderPreviewCanvas(canvasConfig: CanvasConfig, widgets: Widget[]): Promise<string> {
  const app = createSSRApp(PreviewCanvas, { canvasConfig, widgets })
  const html = await renderToString(app)
  return html
}