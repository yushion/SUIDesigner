/**
 * @file config/themes.ts
 * @description Win11 风格主题系统 - 7套预设主题
 *
 * 每套主题包含：
 *   - global: 全局样式（画布背景、毛玻璃效果、强调色等）
 *   - components: 按控件类型覆盖的 base 颜色属性（伪类已统一由 cssGenerator 全局注入）
 *
 * 主题用途：
 *   - 一键切换整个设计器的视觉风格
 *   - 新建控件时自动应用当前主题的控件样式
 *   - 已在画布上的控件选择性合并主题覆盖（不删除用户已修改的属性）
 */

export interface ThemeGlobal {
  bodyBackgroundImage?: string
  canvasBackgroundColor?: string
  canvasBackdropFilter?: string
  canvasBorderColor?: string
  canvasOpacity?: number
  textColor?: string
  accentColor?: string
  glassBlur?: string
  titleBarBgColor?: string
  titleBarOpacity?: number
  titleBarTextColor?: string
}

export interface Theme {
  id: string
  name: string
  description: string
  mode: 'light' | 'dark'
  global: ThemeGlobal
  /** 按控件类型覆盖的 base 颜色属性（扁平结构，不再包含 pseudo/sub 嵌套） */
  components: Partial<Record<string, Record<string, any>>>
}

const defaultTheme: Theme = {
  id: 'default',
  name: '默认风格',
  description: '设计器初始默认风格，无特殊样式覆盖',
  mode: 'light',
  global: {
    canvasBackgroundColor: '#ffffff',
    canvasBackdropFilter: 'none',
    canvasBorderColor: '#e5e5e5',
    canvasOpacity: 1,
    textColor: '#1e1e1e',
    accentColor: '#0078d4',
    glassBlur: '10px',
    titleBarBgColor: '#f5f5f5',
    titleBarOpacity: 1,
    titleBarTextColor: '#1e1e1e'
  },
  components: {
    button: { backgroundColor: '#0078d4', color: '#ffffff', borderColor: '#d9d9d9' },
    input: { backgroundColor: '#ffffff', color: '#333333', borderColor: '#dddddd', padding: 4 },
    label: { color: '#1E1F22', fontWeight: 'normal', textAlign: 'left' },
    checkbox: { color: '#333333' },
    toggle: { trackColor: '#cccccc', knobColor: '#ffffff', activeTrackColor: '#0078d4', backgroundColor: '#cccccc' },
    comboBox: { backgroundColor: '#ffffff', color: '#1E1F22', borderColor: '#dddddd', padding: 4 },
    hyperlink: { color: '#0078d4', textDecoration: 'underline' },
    radioGroup: { color: '#333333' },
    tabsContainer: { backgroundColor: '#ffffff', color: '#333333', borderColor: '#d9d9d9', tabHeaderBg: '#f5f5f5', tabBtnBg: '#f5f5f5', tabActiveBg: '#ffffff', tabActiveBorderColor: '#0078d4', tabInactiveBg: 'rgba(255,255,255,0.2)' },
    progressBar: { backgroundColor: '#E0E0E0', barColor: '#0078D4', color: '#ffffff', valueColor: '#ffffff' },
    listBox: { backgroundColor: '#ffffff', color: '#333333', borderColor: '#d9d9d9', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#e0edff', itemSelectedColor: '#ffffff', itemColor: '#333333' },
    treeView: { backgroundColor: '#ffffff', color: '#333333', borderColor: '#d9d9d9', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff', treeSelectedBg: '#e0edff', treeToggleColor: '#666666' },
    dataGrid: { backgroundColor: '#ffffff', color: '#333333', borderColor: '#d9d9d9', headerBg: 'rgba(255,255,255,0.4)', rowHoverBg: 'rgba(0,120,212,0.08)', rowSelectedBg: 'rgba(0,120,212,0.15)', gridHeaderBg: '#f0f0f0', gridEvenRowBg: '#fafafa', gridHoverBg: '#e6f7ff', gridFocusedBg: '#d6e4ff' },
    cardBox: { backgroundColor: '#ffffff', color: '#333333', borderColor: '#e0e0e0', headerColor: '#f5f5f5', headerTitleColor: '#1E1F22', collapseBtnColor: '#666666' },
    contextMenu: { backgroundColor: '#FFEEE9', color: '#1E1F22' },
    tooltip: { backgroundColor: '#E9F9FF', color: '#fff', borderColor: '#809EE5' },
    textarea: { backgroundColor: '#ffffff', color: '#333333', borderColor: '#dddddd', padding: 4, fontSize: 13 },
    iconButton: { backgroundColor: '#0078d4', color: '#ffffff' },
    imageBox: { backgroundColor: '#f0f0f0', borderColor: '#dddddd' },
    divider: { borderColor: '#D0D0D0', lineStyle: 'solid', backgroundColor: '#fff' },
    messageBox: { backgroundColor: 'rgba(255,255,255,0.9)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)' },
    inputBox: { backgroundColor: 'rgba(255,255,255,0.9)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)' }
  }
}

const micaLight: Theme = {
  id: 'mica-light',
  name: 'Mica 浅色',
  description: '轻微毛玻璃效果 + 浅灰背景，经典 Win11 Mica 风格',
  mode: 'light',
  global: {
    bodyBackgroundImage: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    canvasBackgroundColor: 'rgba(245, 245, 250, 0.82)',
    canvasBackdropFilter: 'blur(10px)',
    canvasBorderColor: 'rgba(0,0,0,0.08)',
    canvasOpacity: 1,
    textColor: '#1f1f2b',
    accentColor: '#0078d4',
    glassBlur: '10px',
    titleBarBgColor: 'rgba(255,255,255,0.8)',
    titleBarOpacity: 0.95,
    titleBarTextColor: '#1f1f2b'
  },
  components: {
    button: { backgroundColor: '#0078d4', color: '#ffffff' },
    input: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.3)' },
    label: { color: '#1f1f2b' },
    checkbox: { color: '#1f1f2b' },
    toggle: { trackColor: '#cccccc', knobColor: '#ffffff', activeTrackColor: '#0078d4' },
    comboBox: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.3)' },
    hyperlink: { color: '#0078d4' },
    radioGroup: { color: '#1f1f2b' },
    tabsContainer: { backgroundColor: 'rgba(255,255,255,0.5)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)', tabActiveBg: 'rgba(255,255,255,0.7)', tabInactiveBg: 'rgba(255,255,255,0.2)' },
    progressBar: { backgroundColor: '#f0f0f0', barColor: '#0078d4', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(255,255,255,0.25)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff' },
    treeView: { backgroundColor: 'rgba(255,255,255,0.25)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff' },
    dataGrid: { backgroundColor: 'rgba(255,255,255,0.25)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(255,255,255,0.4)', rowHoverBg: 'rgba(0,120,212,0.08)', rowSelectedBg: 'rgba(0,120,212,0.15)' },
    cardBox: { backgroundColor: 'rgba(255,255,255,0.7)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)' },
    contextMenu: { backgroundColor: 'rgba(255,255,255,0.95)', color: '#1f1f2b' },
    tooltip: { backgroundColor: '#333', color: '#fff' },
    textarea: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.3)' },
    iconButton: { backgroundColor: '#0078d4', color: '#ffffff' },
    imageBox: { backgroundColor: '#f5f5f5', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: '#D0D0D0' },
    messageBox: { backgroundColor: 'rgba(255,255,255,0.9)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)' },
    inputBox: { backgroundColor: 'rgba(255,255,255,0.9)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)' }
  }
}

const micaDark: Theme = {
  id: 'mica-dark',
  name: 'Mica 深色',
  description: '深灰背景 + 毛玻璃效果，适合暗色模式',
  mode: 'dark',
  global: {
    bodyBackgroundImage: 'https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    canvasBackgroundColor: 'rgba(28, 28, 35, 0.86)',
    canvasBackdropFilter: 'blur(10px)',
    canvasBorderColor: 'rgba(255,255,255,0.3)',
    canvasOpacity: 1,
    textColor: '#f0f0f8',
    accentColor: '#2b88d8',
    glassBlur: '10px',
    titleBarBgColor: 'rgba(255,255,255,0.5)',
    titleBarOpacity: 0.95,
    titleBarTextColor: '#000'
  },
  components: {
    button: { backgroundColor: '#2b88d8', color: '#ffffff' },
    input: { backgroundColor: 'rgba(20,20,28,0.7)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.3)' },
    label: { color: '#f0f0f8' },
    checkbox: { color: '#f0f0f8' },
    toggle: { trackColor: '#555', knobColor: '#ddd', activeTrackColor: '#2b88d8' },
    comboBox: { backgroundColor: 'rgba(20,20,28,0.7)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.3)' },
    hyperlink: { color: '#2b88d8' },
    radioGroup: { color: '#f0f0f8' },
    tabsContainer: { backgroundColor: 'rgba(30,30,40,0.5)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.15)', tabActiveBg: 'rgba(40,40,55,0.7)', tabInactiveBg: 'rgba(20,20,28,0.3)' },
    progressBar: { backgroundColor: '#3d3d3d', barColor: '#2b88d8', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(20,20,28,0.5)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(43,136,216,0.15)', itemSelectedBg: '#2b88d8', itemSelectedColor: '#ffffff' },
    treeView: { backgroundColor: 'rgba(20,20,28,0.5)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(43,136,216,0.15)', itemSelectedBg: '#2b88d8', itemSelectedColor: '#ffffff' },
    dataGrid: { backgroundColor: 'rgba(20,20,28,0.5)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(30,30,40,0.5)', rowHoverBg: 'rgba(43,136,216,0.1)', rowSelectedBg: 'rgba(43,136,216,0.15)' },
    cardBox: { backgroundColor: 'rgba(40,40,48,0.8)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.15)' },
    contextMenu: { backgroundColor: 'rgba(40,40,48,0.95)', color: '#f0f0f8' },
    tooltip: { backgroundColor: '#555', color: '#fff' },
    textarea: { backgroundColor: 'rgba(20,20,28,0.7)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.3)' },
    iconButton: { backgroundColor: '#2b88d8', color: '#ffffff' },
    imageBox: { backgroundColor: '#2d2d2d', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: '#555' },
    messageBox: { backgroundColor: 'rgba(40,40,48,0.9)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.15)' },
    inputBox: { backgroundColor: 'rgba(40,40,48,0.9)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.15)' }
  }
}

const acrylicLight: Theme = {
  id: 'acrylic-light',
  name: '亚克力 浅色',
  description: '半透明白色背景 + 强模糊效果，Win11 亚克力风格',
  mode: 'light',
  global: {
    bodyBackgroundImage: 'https://images.pexels.com/photos/2531709/pexels-photo-2531709.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    canvasBackgroundColor: 'rgba(245, 245, 255, 0.65)',
    canvasBackdropFilter: 'blur(20px) saturate(180%)',
    canvasBorderColor: 'rgba(255,255,255,0.4)',
    canvasOpacity: 1,
    textColor: '#111111',
    accentColor: '#0078d4',
    glassBlur: '20px',
    titleBarBgColor: 'rgba(255,255,255,0.7)',
    titleBarOpacity: 0.95,
    titleBarTextColor: '#111111'
  },
  components: {
    button: { backgroundColor: '#0078d4', color: '#ffffff' },
    input: { backgroundColor: 'rgba(255,255,255,0.7)', color: '#111111', borderColor: 'rgba(128,128,128,0.3)' },
    label: { color: '#111111' },
    checkbox: { color: '#111111' },
    toggle: { trackColor: '#cccccc', knobColor: '#ffffff', activeTrackColor: '#0078d4' },
    comboBox: { backgroundColor: 'rgba(255,255,255,0.7)', color: '#111111', borderColor: 'rgba(128,128,128,0.3)' },
    hyperlink: { color: '#0078d4' },
    radioGroup: { color: '#111111' },
    tabsContainer: { backgroundColor: 'rgba(255,255,255,0.6)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)', tabActiveBg: 'rgba(255,255,255,0.9)', tabInactiveBg: 'rgba(255,255,255,0.3)' },
    progressBar: { backgroundColor: '#f0f0f0', barColor: '#0078d4', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(255,255,255,0.5)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff' },
    treeView: { backgroundColor: 'rgba(255,255,255,0.5)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff' },
    dataGrid: { backgroundColor: 'rgba(255,255,255,0.5)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(255,255,255,0.6)', rowHoverBg: 'rgba(0,120,212,0.08)', rowSelectedBg: 'rgba(0,120,212,0.15)' },
    cardBox: { backgroundColor: 'rgba(255,255,245,0.7)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)' },
    contextMenu: { backgroundColor: 'rgba(255,255,255,0.95)', color: '#111111' },
    tooltip: { backgroundColor: '#333', color: '#fff' },
    textarea: { backgroundColor: 'rgba(255,255,255,0.7)', color: '#111111', borderColor: 'rgba(128,128,128,0.3)' },
    iconButton: { backgroundColor: '#0078d4', color: '#ffffff' },
    imageBox: { backgroundColor: '#f5f5f5', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: '#ddd' },
    messageBox: { backgroundColor: 'rgba(255,255,255,0.95)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)' },
    inputBox: { backgroundColor: 'rgba(255,255,255,0.95)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)' }
  }
}

const acrylicDark: Theme = {
  id: 'acrylic-dark',
  name: '亚克力 深色',
  description: '半透明深色背景 + 强模糊效果，暗色亚克力风格',
  mode: 'dark',
  global: {
    bodyBackgroundImage: 'https://images.pexels.com/photos/1964471/pexels-photo-1964471.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    canvasBackgroundColor: 'rgba(20, 22, 32, 0.7)',
    canvasBackdropFilter: 'blur(20px) saturate(180%)',
    canvasBorderColor: 'rgba(255,255,255,0.2)',
    canvasOpacity: 1,
    textColor: '#f0f0fc',
    accentColor: '#2b88d8',
    glassBlur: '20px',
    titleBarBgColor: 'rgba(255,255,255,0.8)',
    titleBarOpacity: 0.95,
    titleBarTextColor: '#000'
  },
  components: {
    button: { backgroundColor: '#2b88d8', color: '#ffffff' },
    input: { backgroundColor: 'rgba(20,20,28,0.7)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.3)' },
    label: { color: '#f0f0fc' },
    checkbox: { color: '#f0f0fc' },
    toggle: { trackColor: '#555', knobColor: '#ddd', activeTrackColor: '#2b88d8' },
    comboBox: { backgroundColor: 'rgba(20,20,28,0.7)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.3)' },
    hyperlink: { color: '#2b88d8' },
    radioGroup: { color: '#f0f0fc' },
    tabsContainer: { backgroundColor: 'rgba(30,35,50,0.6)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.15)', tabActiveBg: 'rgba(40,45,60,0.7)', tabInactiveBg: 'rgba(20,25,35,0.3)' },
    progressBar: { backgroundColor: '#3d3d3d', barColor: '#2b88d8', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(20,20,28,0.5)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(43,136,216,0.15)', itemSelectedBg: '#2b88d8', itemSelectedColor: '#ffffff' },
    treeView: { backgroundColor: 'rgba(20,20,28,0.5)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(43,136,216,0.15)', itemSelectedBg: '#2b88d8', itemSelectedColor: '#ffffff' },
    dataGrid: { backgroundColor: 'rgba(20,20,28,0.5)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(30,35,50,0.5)', rowHoverBg: 'rgba(43,136,216,0.1)', rowSelectedBg: 'rgba(43,136,216,0.15)' },
    cardBox: { backgroundColor: 'rgba(35,38,55,0.8)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.15)' },
    contextMenu: { backgroundColor: 'rgba(35,38,55,0.95)', color: '#f0f0fc' },
    tooltip: { backgroundColor: '#555', color: '#fff' },
    textarea: { backgroundColor: 'rgba(20,20,28,0.7)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.3)' },
    iconButton: { backgroundColor: '#2b88d8', color: '#ffffff' },
    imageBox: { backgroundColor: '#2d2d2d', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: '#555' },
    messageBox: { backgroundColor: 'rgba(35,38,55,0.9)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.15)' },
    inputBox: { backgroundColor: 'rgba(35,38,55,0.9)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.15)' }
  }
}

const transparentLight: Theme = {
  id: 'transparent-light',
  name: '高透 浅色',
  description: '高透明度白色背景 + 极简风格',
  mode: 'light',
  global: {
    bodyBackgroundImage: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    canvasBackgroundColor: 'rgba(250, 250, 255, 0.32)',
    canvasBackdropFilter: 'blur(24px)',
    canvasBorderColor: 'rgba(255,255,255,0.5)',
    canvasOpacity: 1,
    textColor: '#1e1e2a',
    accentColor: '#0078d4',
    glassBlur: '24px',
    titleBarBgColor: 'rgba(255,255,255,0.8)',
    titleBarOpacity: 0.95,
    titleBarTextColor: '#000'
  },
  components: {
    button: { backgroundColor: 'rgba(0,120,212,0.9)', color: '#ffffff' },
    input: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.3)' },
    label: { color: '#1e1e2a' },
    checkbox: { color: '#1e1e2a' },
    toggle: { trackColor: '#cccccc', knobColor: '#ffffff', activeTrackColor: '#0078d4' },
    comboBox: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.3)' },
    hyperlink: { color: '#0078d4' },
    radioGroup: { color: '#1e1e2a' },
    tabsContainer: { backgroundColor: 'rgba(255,255,255,0.4)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)', tabActiveBg: 'rgba(255,255,255,0.7)', tabInactiveBg: 'rgba(255,255,255,0.15)' },
    progressBar: { backgroundColor: '#f0f0f0', barColor: '#0078d4', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(255,255,255,0.3)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff' },
    treeView: { backgroundColor: 'rgba(255,255,255,0.3)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff' },
    dataGrid: { backgroundColor: 'rgba(255,255,255,0.3)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(255,255,255,0.5)', rowHoverBg: 'rgba(0,120,212,0.08)', rowSelectedBg: 'rgba(0,120,212,0.15)' },
    cardBox: { backgroundColor: 'rgba(255,255,250,0.55)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)' },
    contextMenu: { backgroundColor: 'rgba(255,255,255,0.9)', color: '#1e1e2a' },
    tooltip: { backgroundColor: '#333', color: '#fff' },
    textarea: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.3)' },
    iconButton: { backgroundColor: 'rgba(0,120,212,0.9)', color: '#ffffff' },
    imageBox: { backgroundColor: '#f5f5f5', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: '#ddd' },
    messageBox: { backgroundColor: 'rgba(255,255,255,0.85)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)' },
    inputBox: { backgroundColor: 'rgba(255,255,255,0.85)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)' }
  }
}

const transparentDark: Theme = {
  id: 'transparent-dark',
  name: '高透 深色',
  description: '高透明度深色背景 + 极简暗色风格',
  mode: 'dark',
  global: {
    bodyBackgroundImage: 'https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    canvasBackgroundColor: 'rgba(8, 10, 18, 0.48)',
    canvasBackdropFilter: 'blur(24px)',
    canvasBorderColor: 'rgba(255,255,255,0.3)',
    canvasOpacity: 1,
    textColor: '#f5f5ff',
    accentColor: '#1e88e5',
    glassBlur: '24px',
    titleBarBgColor: 'rgba(255,255,255,0.8)',
    titleBarOpacity: 0.95,
    titleBarTextColor: '#000'
  },
  components: {
    button: { backgroundColor: '#1e88e5', color: '#ffffff' },
    input: { backgroundColor: 'rgba(20,20,28,0.7)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.3)' },
    label: { color: '#f5f5ff' },
    checkbox: { color: '#f5f5ff' },
    toggle: { trackColor: '#555', knobColor: '#ddd', activeTrackColor: '#1e88e5' },
    comboBox: { backgroundColor: 'rgba(20,20,28,0.7)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.3)' },
    hyperlink: { color: '#1e88e5' },
    radioGroup: { color: '#f5f5ff' },
    tabsContainer: { backgroundColor: 'rgba(25,30,40,0.4)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.15)', tabActiveBg: 'rgba(35,40,55,0.7)', tabInactiveBg: 'rgba(15,20,30,0.2)' },
    progressBar: { backgroundColor: '#3d3d3d', barColor: '#1e88e5', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(20,20,28,0.5)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(30,136,229,0.15)', itemSelectedBg: '#1e88e5', itemSelectedColor: '#ffffff' },
    treeView: { backgroundColor: 'rgba(20,20,28,0.5)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(30,136,229,0.15)', itemSelectedBg: '#1e88e5', itemSelectedColor: '#ffffff' },
    dataGrid: { backgroundColor: 'rgba(20,20,28,0.5)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(25,30,40,0.5)', rowHoverBg: 'rgba(30,136,229,0.1)', rowSelectedBg: 'rgba(30,136,229,0.15)' },
    cardBox: { backgroundColor: 'rgba(30,35,50,0.7)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.15)' },
    contextMenu: { backgroundColor: 'rgba(30,35,50,0.9)', color: '#f5f5ff' },
    tooltip: { backgroundColor: '#555', color: '#fff' },
    textarea: { backgroundColor: 'rgba(20,20,28,0.7)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.3)' },
    iconButton: { backgroundColor: '#1e88e5', color: '#ffffff' },
    imageBox: { backgroundColor: '#2d2d2d', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: '#555' },
    messageBox: { backgroundColor: 'rgba(30,35,50,0.85)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.15)' },
    inputBox: { backgroundColor: 'rgba(30,35,50,0.85)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.15)' }
  }
}

export const allThemes: Theme[] = [
  defaultTheme,
  micaLight,
  micaDark,
  acrylicLight,
  acrylicDark,
  transparentLight,
  transparentDark
]

export const themesById: Record<string, Theme> = {}
allThemes.forEach(t => { themesById[t.id] = t })

export function getDefaultTheme(): Theme {
  return defaultTheme
}