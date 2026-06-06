/**
 * @file App.vue
 * @description UI 设计器 - 主布局组件（白底顶部导航条 + 三栏布局）
 */
<template>
  <div class="app-container">
    <!-- 顶部悬浮导航条（白色，高60px） -->
    <header class="top-navbar">
      <div class="nav-left">
        <div class="nav-logo">
          <img class="logo-img" src="./logo.png" />
        </div>
      </div>
      <div class="nav-right">
        <el-button class="btn-save" size="default" @click="handleSave" title="手动保存设计状态，防止刷新丢失">
          💾 防刷保存
        </el-button>
        <el-button class="btn-export-html" size="default" @click="showExportDialog = true" title="导出为 HTML 文件">
          📄 导出 HTML
        </el-button>
      </div>
    </header>

    <!-- 导出选项对话框 -->
    <el-dialog v-model="showExportDialog" title="导出 HTML" width="420px" :close-on-click-modal="false" append-to-body>
      <div class="export-options">
        <div class="export-option-card" :class="{ active: exportMode === 'noBridge' }" @click="exportMode = 'noBridge'">
          <div class="option-radio">
            <el-radio v-model="exportMode" value="noBridge" size="large" />
          </div>
          <div class="option-content">
            <div class="option-title">📄 独立导出（含外链，仅不下载 webviewBridge.js）</div>
            <div class="option-desc">
              导出 HTML 页面，包含 <code>&lt;script src="./webviewBridge.js"&gt;</code> 外链引用。<br/>
              适合已有 <code>webviewBridge.js</code> 的场景，仅需把 HTML 和 js 放在同一目录。
            </div>
          </div>
        </div>
        <div class="export-option-card" :class="{ active: exportMode === 'external' }" @click="exportMode = 'external'">
          <div class="option-radio">
            <el-radio v-model="exportMode" value="external" size="large" />
          </div>
          <div class="option-content">
            <div class="option-title">🔗 外链导出（同时下载 webviewBridge.js）</div>
            <div class="option-desc">
              UI 交互脚本已内嵌。此选项控制 <code>webviewBridge.js</code> 是否外链。<br/>
              导出时将同时下载 <code>export.html</code> 和 <code>webviewBridge.js</code>，请放在同一目录下。
            </div>
          </div>
        </div>
        <div class="export-option-card" :class="{ active: exportMode === 'inline' }" @click="exportMode = 'inline'">
          <div class="option-radio">
            <el-radio v-model="exportMode" value="inline" size="large" />
          </div>
          <div class="option-content">
            <div class="option-title">📦 内联导出（单文件含 webviewBridge.js 全代码）</div>
            <div class="option-desc">
              所有脚本内嵌在 HTML 中，包括 <code>webviewBridge.js</code> 的完整内容，<br/>
              单个文件即可运行，兼容离线场景，支持与宿主通信。
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button type="primary" @click="doExport">📄 导出</el-button>
      </template>
    </el-dialog>

    <!-- 加载缓存对话框 -->
    <el-dialog v-model="showLoadDialog" title="恢复设计" class="load-cache-dialog" align-center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" append-to-body>
      <div class="load-cache-content">
        <div class="load-cache-row">
          <span class="load-cache-icon">🔄</span>
          <div class="load-cache-text-wrap">
            <p class="load-cache-text">检测到上次设计缓存，是否加载？</p>
            <p class="load-cache-hint">选择"取消"将清空画布，开始全新设计。</p>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="loadCache">确定</el-button>
        <el-button @click="discardCache">取消</el-button>
      </template>
    </el-dialog>

    <!-- 主体三栏布局 -->
    <div class="main-body">
      <WidgetLibrary />
      <div class="canvas-area" :style="canvasAreaStyle">
        <!-- 撤销/重做/网格（相对 canvas-area 定位） -->
        <div class="canvas-undo-redo">
          <el-button size="small" @click="store.undo()" :disabled="!store.canUndo" title="撤销 (Ctrl+Z)">
            ↩️ 撤销
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" @click="store.redo()" :disabled="!store.canRedo" title="重做 (Ctrl+Y)">
            ↪️ 重做
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" @click="clearDesign" type="danger" plain title="清空当前设计">
            🗑️ 清空
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" :type="showGrid ? 'primary' : 'default'" @click="showGrid = !showGrid" title="显示/隐藏网格">
            ▦ 网格
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" @click="store.alignLeft()" :disabled="store.selectedIds.length < 2" title="左齐">
            ⊢ 左齐
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" @click="store.alignRight()" :disabled="store.selectedIds.length < 2" title="右齐">
            ⊣ 右齐
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" @click="store.alignTop()" :disabled="store.selectedIds.length < 2" title="上齐">
            ⊤ 上齐
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" @click="store.alignBottom()" :disabled="store.selectedIds.length < 2" title="下齐">
            ⊥ 下齐
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" @click="store.equalWidth()" :disabled="store.selectedIds.length < 2" title="等宽">
            ⊟ 等宽
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" @click="store.equalHeight()" :disabled="store.selectedIds.length < 2" title="等高">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="1.5"/>
            </svg> 等高
          </el-button>
          <span class="toolbar-separator">|</span>
          <el-button size="small" @click="store.equalWidthHeight()" :disabled="store.selectedIds.length < 2" title="等宽高">
            ⊞ 等宽高
          </el-button>
        </div>
        <!-- 预览按钮（相对 canvas-area 定位） -->
        <div class="canvas-right-toolbar">
          <select class="canvas-widget-selector" @change="onCanvasWidgetSelectorChange" title="选择要编辑的控件">
            <option value="">-- 选择控件 --</option>
            <option v-for="w in store.widgets" :key="w.id" :value="w.id" :selected="store.selectedWidget?.id === w.id">
              {{ w.name || '未命名' }}({{ w.id }})
            </option>
          </select>
          <el-button class="canvas-preview-btn" size="small" type="primary" @click="onPreviewHTML" title="在新窗口预览">
            👁️ 预览
          </el-button>
        </div>
        <CanvasArea :show-grid="showGrid" />
      </div>
      <div v-show="store.propertyPanelVisible" class="property-panel-wrapper">
        <PropertyPanel />
      </div>
      <button
        class="property-panel-toggle"
        :class="{ panelHidden: !store.propertyPanelVisible }"
        @click="store.propertyPanelVisible = !store.propertyPanelVisible"
        :title="store.propertyPanelVisible ? '隐藏属性面板' : '显示属性面板'"
      >
        <span class="arrow-icon">{{ store.propertyPanelVisible ? '▶' : '◀' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useWidgetStore } from '@/stores/widgetStore'
import { useThemeStore } from '@/stores/themeStore'
import { generateCompleteHTML, downloadHTML, previewHTML, downloadRuntimeJS, fetchBridgeContent } from '@/utils/htmlExporter'
import { ElMessage, ElMessageBox } from 'element-plus'
import WidgetLibrary from './components/WidgetLibrary.vue'
import CanvasArea from './components/CanvasArea.vue'
import PropertyPanel from './components/PropertyPanel.vue'

const store = useWidgetStore()
const themeStore = useThemeStore()
const showGrid = ref(true)

/** 画布区容器样式（模拟真实页面 body 背景） */
const canvasAreaStyle = computed(() => {
  const bg = store.canvas.bodyBackground
  if (!bg?.enabled) return { backgroundColor: 'transparent' }
  return {
    backgroundColor: 'transparent',
    backgroundImage: bg.imageUrl
      ? `url(${bg.imageUrl}), radial-gradient(circle at 50% 50%, rgba(0,0,0,0.015) 1px, transparent 1px)`
      : 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.015) 1px, transparent 1px)',
    backgroundSize: bg.imageUrl ? `${bg.imageSize}, 20px 20px` : '20px 20px',
    backgroundRepeat: bg.imageUrl ? `${bg.imageRepeat}, repeat` : 'repeat',
    backgroundPosition: bg.imageUrl ? `${bg.imagePosition}, 0 0` : '0 0'
  }
})

/** 画布区控件下拉选择器 */
function onCanvasWidgetSelectorChange(e: Event) {
  const target = e.target as HTMLSelectElement
  const id = target.value
  if (!id) {
    store.selectCanvas()
  } else {
    store.selectWidget(id)
  }
}

/** 导出对话框 */
const showExportDialog = ref(false)

/** 导出模式：true=外链webviewBridge.js, false=内联webviewBridge.js */
const exportMode = ref<'noBridge' | 'external' | 'inline'>('noBridge')

/** 加载缓存对话框 */
const showLoadDialog = ref(false)
const cacheKey = 'ui-designer-cache'
const globalConfigsKey = 'ui-designer-global-configs'

/** 自动保存到 localStorage（防抖 500ms） */
let autoSaveTimer: ReturnType<typeof setTimeout> | null = null

/** 上次保存时的数据指纹（避免重复保存相同内容） */
let lastSavedFingerprint = ''

/** 缓存对话框是否已处理完成（完成前禁止自动保存，防止空状态覆盖缓存） */
let cacheLoaded = false

/**
 * 计算当前设计数据指纹（canvas + widget 数量 + 第一个控件的 id）
 * 用于快速判断设计是否和上次保存的一致
 */
function computeFingerprint(): string {
  try {
    const wids = store.widgets.map(w => w.id).join(',')
    const mbCSS = store.messageBoxConfig.customCSS || ''
    const ibCSS = store.inputBoxConfig.customCSS || ''
    return `${store.canvas.width}x${store.canvas.height}-${store.widgets.length}-${wids}-${store.canvas.title || ''}-${mbCSS.length}-${ibCSS.length}`
  } catch {
    return ''
  }
}

/**
 * 保存当前设计状态到 localStorage（去重：与上次保存相同时跳过）
 */
function saveToLocalStorage(force: boolean = false) {
  try {
    if (!cacheLoaded && !force) {
      return
    }
    const fingerprint = computeFingerprint()
    if (!force && fingerprint === lastSavedFingerprint) {
      return
    }

    const data = {
      canvas: { ...store.canvas },
      widgets: store.serializeWidgets(),
      messageBoxConfig: { ...store.messageBoxConfig },
      inputBoxConfig: { ...store.inputBoxConfig }
    }
    localStorage.setItem(cacheKey, JSON.stringify(data))
    lastSavedFingerprint = fingerprint
  } catch (e) {
    console.error('[Cache] 保存失败:', e)
  }
}

/** 手动保存 */
function handleSave() {
  saveToLocalStorage(true)
  ElMessage.success('设计已手动保存置浏览器缓存，防止刷新丢失')
}

/**
 * 触发防抖自动保存（每次 saveState 后调用）
 */
function triggerAutoSave() {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(() => saveToLocalStorage(false), 500)
}

/** 保存全局配置到独立 localStorage key */
function saveGlobalConfigs() {
  try {
    const data = {
      messageBoxConfig: { ...store.messageBoxConfig },
      inputBoxConfig: { ...store.inputBoxConfig },
      canvas: {
        canvasFixedSize: store.canvas.canvasFixedSize,
        borderWidth: store.canvas.borderWidth,
        borderRadius: store.canvas.borderRadius,
        showTitleBar: store.canvas.showTitleBar,
        titleBarAlign: store.canvas.titleBarAlign,
      },
      contextMenuDefaultCSS: store.contextMenuDefaultCSS,
      tooltipDefaultCSS: store.tooltipDefaultCSS,
    }
    localStorage.setItem(globalConfigsKey, JSON.stringify(data))
  } catch (e) {
    console.error('[GlobalConfigs] 保存失败:', e)
  }
}

/** 从独立 localStorage key 加载全局配置 */
function loadGlobalConfigs() {
  try {
    const saved = localStorage.getItem(globalConfigsKey)
    if (!saved) return
    const data = JSON.parse(saved)
    if (data.messageBoxConfig) {
      Object.assign(store.messageBoxConfig, data.messageBoxConfig)
    }
    if (data.inputBoxConfig) {
      Object.assign(store.inputBoxConfig, data.inputBoxConfig)
    }
    if (data.canvas) {
      // 只恢复全局持久化属性，不触发 "恢复设计" 弹窗检测（这些属性已从 isCanvasDefault 中排除）
      const canvasGlobals = data.canvas as Partial<typeof store.canvas>
      if (canvasGlobals.canvasFixedSize !== undefined) store.canvas.canvasFixedSize = canvasGlobals.canvasFixedSize
      if (canvasGlobals.borderWidth !== undefined) store.canvas.borderWidth = canvasGlobals.borderWidth
      if (canvasGlobals.borderRadius !== undefined) store.canvas.borderRadius = canvasGlobals.borderRadius
      if (canvasGlobals.showTitleBar !== undefined) store.canvas.showTitleBar = canvasGlobals.showTitleBar
      if (canvasGlobals.titleBarAlign !== undefined) store.canvas.titleBarAlign = canvasGlobals.titleBarAlign
    }
    if (data.contextMenuDefaultCSS !== undefined) {
      store.contextMenuDefaultCSS = data.contextMenuDefaultCSS
    }
    if (data.tooltipDefaultCSS !== undefined) {
      store.tooltipDefaultCSS = data.tooltipDefaultCSS
    }
  } catch (e) {
    console.error('[GlobalConfigs] 加载失败:', e)
  }
}



/** 加载缓存（与导入文件的加载逻辑完全一致） */
function loadCache() {
  cacheLoaded = true
  showLoadDialog.value = false
  const cached = localStorage.getItem(cacheKey)
  if (!cached) {
    store.initHistory()
    return
  }
  try {
    const data = JSON.parse(cached)

    // 清空现有内容
    store.clearAll()

    // 恢复画布配置（Object.assign 与 restoreState / handleImport 保持一致）
    if (data.canvas) {
      Object.assign(store.canvas, data.canvas)
    }

    // 恢复控件
    if (data.widgets && Array.isArray(data.widgets)) {
      data.widgets.forEach((w: any) => {
        const deserialized = store.deserializeWidget(w)
        store.widgets.push(deserialized)
      })
    }

    // 恢复信息框全局配置
    if (data.messageBoxConfig) {
      Object.assign(store.messageBoxConfig, data.messageBoxConfig)
    }

    // 恢复输入框全局配置
    if (data.inputBoxConfig) {
      Object.assign(store.inputBoxConfig, data.inputBoxConfig)
    }

    store.initHistory()
    ElMessage.success('已加载上次设计')

    // 重新应用当前主题，确保缓存控件样式与主题一致
    if (themeStore.currentThemeId !== 'default') {
      themeStore.applyTheme(themeStore.currentThemeId)
    }
  } catch (e) {
    console.error('[Cache] loadCache异常:', e)
    ElMessage.error('缓存数据损坏，已清空画布')
    store.clearAll()
    store.initHistory()
  }
}

/** 丢弃缓存 */
function discardCache() {
  cacheLoaded = true
  showLoadDialog.value = false
  localStorage.removeItem(cacheKey)
  lastSavedFingerprint = ''
  store.clearAll()
  loadGlobalConfigs()
  // 重置主题为默认风格
  themeStore.applyTheme('default')
  store.initHistory()
  ElMessage.info('已清空画布，开始全新设计')
}

/** 清空当前设计（带确认弹窗） */
function clearDesign() {
  ElMessageBox.confirm(
    '是否清空当前设计？',
    '确认清空',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    store.clearAll()
    localStorage.removeItem(cacheKey)
    lastSavedFingerprint = ''
    loadGlobalConfigs()
    // 重置主题为默认风格
    themeStore.applyTheme('default')
    store.initHistory()
    ElMessage.success('设计已清空')
  }).catch(() => {})
}

/** 默认画布配置（用于判断缓存是否为纯默认状态） */
const DEFAULT_CANVAS = {
  width: 800,
  height: 500,
  backgroundColor: '#ffffff',
  borderColor: '#e5e5e5',
  borderWidth: 1,
  borderRadius: 8,
  title: '标题'
}

/**
 * 判断缓存的画布配置是否与默认一致
 * 仅检测 "设计特有" 属性（宽高、颜色、标题），
 * 全局持久化属性（borderWidth/borderRadius/canvasFixedSize/showTitleBar/titleBarAlign）
 * 由 loadGlobalConfigs 统一管理，不在这里触发弹窗。
 */
function isCanvasDefault(cachedCanvas: Record<string, any>): boolean {
  const keys: (keyof typeof DEFAULT_CANVAS)[] = ['width', 'height', 'backgroundColor', 'borderColor', 'title']
  for (const k of keys) {
    if (cachedCanvas[k] !== DEFAULT_CANVAS[k]) {
      return false
    }
  }
  return true
}

/** 页面载入时检查缓存 */
onMounted(() => {
  // 初始化主题
  themeStore.initTheme()

  // 无条件加载全局配置（信息框/输入框的样式和属性）
  loadGlobalConfigs()

  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    try {
      const data = JSON.parse(cached)
      if (data.canvas && Array.isArray(data.widgets)) {
        // 0个控件且画布为默认配置时，无需弹窗恢复
        if (data.widgets.length === 0 && isCanvasDefault(data.canvas)) {
          cacheLoaded = true
          store.initHistory()
          return
        }
        cacheLoaded = false
        showLoadDialog.value = true
        return
      }
    } catch (e) {
      console.error('[Cache] 缓存解析失败:', e)
      localStorage.removeItem(cacheKey)
    }
  }
  cacheLoaded = true
  store.initHistory()
})

// 监听历史变化，自动保存到 localStorage（去重）
watch(
  () => store.history.length,
  () => triggerAutoSave()
)

// 监听全局配置变化（信息框/输入框/画布外观属性/右键菜单和气泡框默认CSS），自动保存到独立 localStorage key
watch(
  () => JSON.stringify({
    mb: { ...store.messageBoxConfig },
    ib: { ...store.inputBoxConfig },
    cv: {
      canvasFixedSize: store.canvas.canvasFixedSize,
      borderWidth: store.canvas.borderWidth,
      borderRadius: store.canvas.borderRadius,
      showTitleBar: store.canvas.showTitleBar,
      titleBarAlign: store.canvas.titleBarAlign
    },
    ctxCSS: store.contextMenuDefaultCSS,
    ttCSS: store.tooltipDefaultCSS
  }),
  () => saveGlobalConfigs()
)

// 刷新或关闭页面前静默自动保存（仅在有变化时）
window.addEventListener('beforeunload', () => {
  saveToLocalStorage(true)
})

/** 执行导出 */
async function doExport() {
  showExportDialog.value = false
  const title = store.canvas.title || '标题'

  let bridgeContent = ''
  if (exportMode.value === 'inline') {
    bridgeContent = await fetchBridgeContent()
    if (!bridgeContent) {
      ElMessage.error('无法获取 webviewBridge.js 内容，请检查网络或稍后重试')
      return
    }
  }

  const html = await generateCompleteHTML(
    store.canvas, store.widgets, title,
    exportMode.value, bridgeContent,
    store.messageBoxConfig, store.inputBoxConfig
  )

  let filename: string
  if (exportMode.value === 'noBridge') {
    filename = 'export.html'
  } else if (exportMode.value === 'inline') {
    filename = 'export-standalone.html'
  } else {
    filename = 'export-external.html'
  }
  downloadHTML(html, filename)

  if (exportMode.value === 'external') {
    const ok = await downloadRuntimeJS('webviewBridge.js')
    if (ok) {
      ElMessage.success('已导出 export-external.html 和 webviewBridge.js，请放在同一目录下使用')
    } else {
      ElMessage.warning('HTML 已导出，但 webviewBridge.js 下载失败，请从 public/ 目录手动复制')
    }
  } else if (exportMode.value === 'inline') {
    ElMessage.success('已导出 export-standalone.html（独立文件，包含完整 webviewBridge.js，可直接打开）')
  } else {
    ElMessage.success('已导出 export.html（含 webviewBridge.js 外链引用，需手动放置 js 文件）')
  }
}

/** 预览（webviewBridge.js 外链，避免文件过大）—— 仅点击预览按钮时触发，不在属性修改时自动刷新 */
async function onPreviewHTML() {
  const title = store.canvas.title || '标题'
  const html = await generateCompleteHTML(store.canvas, store.widgets, title, 'external', '', store.messageBoxConfig, store.inputBoxConfig)
  previewHTML(html)
}
</script>

<style>
@import './assets/editor-widget-styles.css';
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  margin: 0;
  font-family: 'Segoe UI', '微软雅黑', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(120deg, #f5f3ef 0%, #e8e4db 50%, #f0ece5 80%);
  background-attachment: fixed;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse 80% 50% at 20% 50%, rgba(0, 120, 212, 0.04) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 70% 60%, rgba(120, 100, 220, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse 50% 30% at 40% 20%, rgba(0, 180, 160, 0.02) 0%, transparent 40%);
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* ================================================================
   顶部导航条 — 磨砂玻璃效果
   ================================================================ */
.top-navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 90px;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.1);
  user-select: none;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.top-navbar:hover {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 6px 6px 8px rgba(0, 0, 0, 0.15);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  height: 50px;
  width: auto;
  opacity: 0.9;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}


.btn-export-html {
  background: #00b42a !important;
  border: none !important;
  color: #fff !important;
  font-size: 14px !important;
  padding: 20px !important;
  border-radius: 4px !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 6px rgba(82, 196, 26, 0.25) !important;
  transition: all 0.25s ease !important;
}

.btn-export-html:hover {
  filter: brightness(0.8);
  box-shadow: 0 4px 12px rgba(82, 196, 26, 0.35) !important;
}

.btn-save {
  background: #165dff !important;
  border: none !important;
  color: #fff !important;
  font-size: 13px !important;
  padding: 20px !important;
  border-radius: 4px !important;
  font-weight: 600 !important;
  box-shadow: 0 2px 6px rgba(22, 119, 255, 0.25) !important;
  transition: all 0.25s ease !important;
}

.btn-save:hover {
  filter: brightness(0.8);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.35) !important;
}

/* ================================================================
   主体三栏布局
   ================================================================ */
.main-body {
  padding-top: 90px;
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
  gap: 0;
  position: relative;
}

.canvas-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.015) 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: #f0f0f0;
  overflow: auto;
  position: relative;
  min-height: 0;
  border-left: 1px solid rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.4s ease;
}

/* 撤销/重做/网格（相对 canvas-area 定位） */
.canvas-undo-redo {
  position: absolute;
  top: 8px;
  left: 10px;
  z-index:11;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.canvas-undo-redo:hover {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.09);
}

/* 属性面板外层包装（保持 flex 布局，避免 v-show 与 PropertyPanel 内部 display 冲突） */
.property-panel-wrapper {
  display: flex;
  flex-shrink: 0;
}

/* ================================================================
   属性面板折叠/展开悬浮按钮
   ================================================================ */
.property-panel-toggle {
  position: absolute;
  top: 50%;
  right: 320px;
  transform: translateY(-50%);
  z-index: 100;
  width: 20px;
  height: 90px;
  border: 1px solid #d0d0d0;
  border-right: none;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px 0 0 10px;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  transition: right 0.25s ease, background 0.2s;
  padding: 0;
  outline: none;
}

.property-panel-toggle:hover {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
}

.property-panel-toggle.panelHidden {
  right: 0;
}

.arrow-icon {
  font-size: 11px;
  color: #555;
  user-select: none;
  line-height: 1;
}

/* 工具栏分隔符 */
.toolbar-separator {
  display: inline-flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.15);
  font-size: 14px;
  margin: 0 2px;
  user-select: none;
}

.canvas-undo-redo .el-button {
  padding: 5px 10px;
  font-size: 12px;
  height: auto;
  line-height: 1.4;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #555;
  transition: all 0.2s ease;
}

.canvas-undo-redo .el-button:hover:not(.is-disabled) {
  background: rgba(0, 0, 0, 0.06);
  color: #333;
}

/* 网格按钮选中态 */
.canvas-undo-redo .el-button--primary {
  background: #f5f5f5 !important;
  color: #333 !important;
  font-weight: 500;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
}
.canvas-undo-redo .el-button--primary:hover {
  background: #e3e3e3 !important;
}

.canvas-undo-redo .el-button--small {
  padding: 4px 6px;
  font-size: 12px;
}

/* 禁用态样式：文字灰度显示 */
.canvas-undo-redo .el-button.is-disabled,
.canvas-undo-redo .el-button.is-disabled:hover,
.canvas-undo-redo .el-button.is-disabled:focus {
  color: rgba(0, 0, 0, 0.25);
  background: transparent;
  cursor: not-allowed;
  border: none;
}

/* 右侧工具栏（控件选择 + 主题选择 + 预览按钮） */
.canvas-right-toolbar {
  position: absolute;
  top: 10px;
  right: 14px;
  z-index: 11;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.5s ease;
}
.canvas-right-toolbar:hover {
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.09);
}

.canvas-widget-selector,.canvas-theme-selector {
  font-size: 12px;
  padding: 2px 12px 2px 2px;
  border: 1px solid #f1f1f1;
  border-radius: 2px;
  background: #ededed;
  color: #0b8385;
  font-weight:500;
  max-width: 150px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.4);
}
.canvas-widget-selector:focus,.canvas-theme-selector:focus {
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.8);
}

.canvas-widget-selector option:checked,
.canvas-theme-selector option:checked {
  background-color: #d1d1d1 !important;
  color: #333 !important;
}

/* 预览按钮 */
.canvas-preview-btn {
  padding: 4px 14px;
  font-size: 12px;
  height: auto;
  line-height: 1.4;
  border-radius: 3px;
  background: #4080ff !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3) !important;
  transition: all 0.25s ease !important;
  margin-left:10px;
}

.canvas-preview-btn:hover {
  filter: brightness(0.8);
  box-shadow: 0 4px 14px rgba(22, 119, 255, 0.4) !important;
}

.canvas-right-toolbar .el-button--small {
  padding: 6px 14px;
  font-size: 12px;
}

/* ================================================================
   导出对话框选项样式
   ================================================================ */
.export-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-option-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #fafbfc;
}

.export-option-card:hover {
  border-color: #1677ff;
  background-color: #f0f7ff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.08);
}

.export-option-card.active {
  border-color: #1677ff;
  background: linear-gradient(135deg, #e6f4ff, #f0f7ff);
  box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.1);
  transform: scale(1.05);
}

.option-radio {
  flex-shrink: 0;
  padding-top: 2px;
}

.option-content {
  flex: 1;
  min-width: 0;
}

.option-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.option-desc {
  font-size: 12px;
  color: #888;
  line-height: 1.6;
}

.option-desc code {
  background-color: #f5f5f5;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  color: #d63384;
}

/* 加载缓存对话框 — 宽度自适应内容 */
.el-dialog.load-cache-dialog {
  width: fit-content !important;
  min-width: 340px;
}

.load-cache-content {
  padding: 6px 0;
}

.load-cache-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.load-cache-icon {
  flex-shrink: 0;
  font-size: 40px;
  line-height: 1;
}

.load-cache-text-wrap {
  min-width: 0;
}

.load-cache-text {
  font-size: 15px;
  color: #333;
  font-weight: 500;
  margin: 0 0 6px 0;
  white-space: nowrap;
}

.load-cache-hint {
  font-size: 12px;
  color: #999;
  margin: 0;
}
</style>