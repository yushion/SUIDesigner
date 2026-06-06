import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import _monacoEditorPlugin from 'vite-plugin-monaco-editor'
import { fileURLToPath, URL } from 'node:url'

const monacoEditorPlugin = (_monacoEditorPlugin as any).default || _monacoEditorPlugin

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService', 'css']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})