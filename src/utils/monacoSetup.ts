/**
 * @file utils/monacoSetup.ts
 * @description Monaco Editor 配置入口
 *              worker 和语言过滤由 vite-plugin-monaco-editor 自动处理
 */

// 从 monaco-editor 导入编辑器类型
import type { editor, languages, CancellationToken, Emitter, IDisposable, IKeyboardEvent, IMouseEvent, IPosition, IRange, ISelection, KeyCode, KeyMod, MarkerSeverity, Position, Range, Selection, Uri } from 'monaco-editor'

export type { editor, languages, CancellationToken, Emitter, IDisposable, IKeyboardEvent, IMouseEvent, IPosition, IRange, ISelection, KeyCode, KeyMod, MarkerSeverity, Position, Range, Selection, Uri }