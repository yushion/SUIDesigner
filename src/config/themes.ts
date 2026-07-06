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
    canvasBackgroundColor: 'rgba(255, 255, 255, 1)',
    canvasBackdropFilter: 'blur(10px)',
    canvasBorderColor: 'rgba(200, 200, 200, 1)',
    canvasOpacity: 1,
    textColor: '#1e1e1e',
    accentColor: '#0078d4',
    glassBlur: '10px',
    titleBarBgColor: 'rgba(255, 255, 255, 1)',
    titleBarOpacity: 1,
    titleBarTextColor: '#1e1e1e'
  },
  components: {}
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
    button: { backgroundColor: 'rgba(0,120,212,0.8)', color: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' },
    input: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    label: { color: '#1f1f2b', fontWeight: 'normal', textAlign: 'left' },
    checkbox: { color: '#1f1f2b' },
    toggle: { trackColor: '#cccccc', knobColor: '#ffffff', activeTrackColor: '#0078d4', backgroundColor: 'rgba(200,200,200,0.5)' },
    comboBox: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    hyperLink: { color: '#0078d4', textDecoration: 'underline' },
    radioGroup: { color: '#1f1f2b' },
    tabsContainer: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)', tabHeaderBg: 'rgba(255,255,255,0.1)', tabBtnBg: 'rgba(255,255,255,0.1)', tabActiveBg: 'rgba(255,255,255,0.5)', tabActiveBorderColor: '#0078d4', tabInactiveBg: 'rgba(255,255,255,0.2)' },
    progressBar: { backgroundColor: 'rgba(240,240,240,0.3)', barColor: '#0078d4', color: '#ffffff', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff', itemColor: '#1f1f2b' },
    treeView: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff', treeSelectedBg: 'rgba(0,120,212,0.2)', treeToggleColor: 'rgba(102,102,102,0.7)' },
    dataGrid: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(255,255,255,0.4)', rowHoverBg: 'rgba(0,120,212,0.08)', rowSelectedBg: 'rgba(0,120,212,0.15)', gridHeaderBg: 'rgba(240,240,240,0.3)', gridEvenRowBg: 'rgba(250,250,250,0.3)', gridHoverBg: 'rgba(230,247,255,0.3)', gridFocusedBg: 'rgba(214,228,255,0.3)' },
    cardBox: { backgroundColor: 'rgba(255,255,255,0.25)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)', headerColor: 'rgba(245,245,245,0.5)', headerTitleColor: '#1E1F22', collapseBtnColor: 'rgba(102,102,102,0.7)' },
    contextMenu: { backgroundColor: 'rgba(255,255,255,0.9)', color: '#1f1f2b' },
    tooltip: { backgroundColor: 'rgba(51,51,51,0.9)', color: '#fff' },
    textarea: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.3)' },
    iconButton: { backgroundColor: 'rgba(0,120,212,0.8)', color: '#ffffff' },
    imageBox: { backgroundColor: 'rgba(245,245,245,0.3)', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: 'rgba(208, 208, 208, 1)', lineStyle: 'solid'},
    messageBox: { backgroundColor: 'rgba(255,255,255,0.85)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)' },
    inputBox: { backgroundColor: 'rgba(255,255,255,0.85)', color: '#1f1f2b', borderColor: 'rgba(128,128,128,0.2)' },
    datetimePicker: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' },
    logOutput: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' }
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
    button: { backgroundColor: 'rgba(43,136,216,0.8)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.1)' },
    input: { backgroundColor: 'rgba(20,20,28,0.2)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    label: { color: '#f0f0f8', fontWeight: 'normal', textAlign: 'left' },
    checkbox: { color: '#f0f0f8' },
    toggle: { trackColor: '#555', knobColor: '#ddd', activeTrackColor: '#2b88d8', backgroundColor: 'rgba(80,80,80,0.5)' },
    comboBox: { backgroundColor: 'rgba(20,20,28,0.2)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    hyperLink: { color: '#2b88d8', textDecoration: 'underline' },
    radioGroup: { color: '#f0f0f8' },
    tabsContainer: { backgroundColor: 'rgba(30,30,40,0.15)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.15)', tabHeaderBg: 'rgba(30,30,40,0.1)', tabBtnBg: 'rgba(30,30,40,0.1)', tabActiveBg: 'rgba(40,40,55,0.5)', tabActiveBorderColor: '#2b88d8', tabInactiveBg: 'rgba(20,20,28,0.3)' },
    progressBar: { backgroundColor: 'rgba(61,61,61,0.3)', barColor: '#2b88d8', color: '#ffffff', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(20,20,28,0.15)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(43,136,216,0.15)', itemSelectedBg: '#2b88d8', itemSelectedColor: '#ffffff', itemColor: '#f0f0f8' },
    treeView: { backgroundColor: 'rgba(20,20,28,0.15)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(43,136,216,0.15)', itemSelectedBg: '#2b88d8', itemSelectedColor: '#ffffff', treeSelectedBg: 'rgba(43,136,216,0.2)', treeToggleColor: 'rgba(180,180,180,0.7)' },
    dataGrid: { backgroundColor: 'rgba(20,20,28,0.15)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(30,30,40,0.5)', rowHoverBg: 'rgba(43,136,216,0.1)', rowSelectedBg: 'rgba(43,136,216,0.15)', gridHeaderBg: 'rgba(40,40,50,0.3)', gridEvenRowBg: 'rgba(35,35,40,0.3)', gridHoverBg: 'rgba(30,50,80,0.3)', gridFocusedBg: 'rgba(40,60,100,0.3)' },
    cardBox: { backgroundColor: 'rgba(40,40,48,0.25)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.15)', headerColor: 'rgba(50,50,60,0.5)', headerTitleColor: '#f0f0f8', collapseBtnColor: 'rgba(180,180,180,0.7)' },
    contextMenu: { backgroundColor: 'rgba(40,40,48,0.9)', color: '#f0f0f8' },
    tooltip: { backgroundColor: 'rgba(85,85,85,0.9)', color: '#fff', borderColor: 'rgba(128,128,128,0.2)' },
    textarea: { backgroundColor: 'rgba(20,20,28,0.2)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.3)', padding: 4, fontSize: 13 },
    iconButton: { backgroundColor: 'rgba(43,136,216,0.8)', color: '#ffffff' },
    imageBox: { backgroundColor: 'rgba(45,45,45,0.3)', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: 'rgba(208, 208, 208, 1)', lineStyle: 'solid'},
    messageBox: { backgroundColor: 'rgba(40,40,48,0.85)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.15)' },
    inputBox: { backgroundColor: 'rgba(40,40,48,0.85)', color: '#f0f0f8', borderColor: 'rgba(128,128,128,0.15)' },
    datetimePicker: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' },
    logOutput: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' }
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
    button: { backgroundColor: 'rgba(0,120,212,0.8)', color: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' },
    input: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#111111', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    label: { color: '#111111', fontWeight: 'normal', textAlign: 'left' },
    checkbox: { color: '#111111' },
    toggle: { trackColor: '#cccccc', knobColor: '#ffffff', activeTrackColor: '#0078d4', backgroundColor: 'rgba(200,200,200,0.5)' },
    comboBox: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#111111', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    hyperLink: { color: '#0078d4', textDecoration: 'underline' },
    radioGroup: { color: '#111111' },
    tabsContainer: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)', tabHeaderBg: 'rgba(255,255,255,0.1)', tabBtnBg: 'rgba(255,255,255,0.1)', tabActiveBg: 'rgba(255,255,255,0.5)', tabActiveBorderColor: '#0078d4', tabInactiveBg: 'rgba(255,255,255,0.3)' },
    progressBar: { backgroundColor: 'rgba(240,240,240,0.3)', barColor: '#0078d4', color: '#ffffff', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff', itemColor: '#111111' },
    treeView: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff', treeSelectedBg: 'rgba(0,120,212,0.2)', treeToggleColor: 'rgba(102,102,102,0.7)' },
    dataGrid: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(255,255,255,0.6)', rowHoverBg: 'rgba(0,120,212,0.08)', rowSelectedBg: 'rgba(0,120,212,0.15)', gridHeaderBg: 'rgba(240,240,240,0.3)', gridEvenRowBg: 'rgba(250,250,250,0.3)', gridHoverBg: 'rgba(230,247,255,0.3)', gridFocusedBg: 'rgba(214,228,255,0.3)' },
    cardBox: { backgroundColor: 'rgba(255,255,245,0.25)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)', headerColor: 'rgba(245,245,245,0.5)', headerTitleColor: '#1E1F22', collapseBtnColor: 'rgba(102,102,102,0.7)' },
    contextMenu: { backgroundColor: 'rgba(255,255,255,0.9)', color: '#111111' },
    tooltip: { backgroundColor: 'rgba(51,51,51,0.9)', color: '#fff', borderColor: 'rgba(128,128,128,0.2)' },
    textarea: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#111111', borderColor: 'rgba(128,128,128,0.3)', padding: 4, fontSize: 13 },
    iconButton: { backgroundColor: 'rgba(0,120,212,0.8)', color: '#ffffff' },
    imageBox: { backgroundColor: 'rgba(245,245,245,0.3)', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: 'rgba(208, 208, 208, 1)', lineStyle: 'solid'},
    messageBox: { backgroundColor: 'rgba(255,255,255,0.85)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)' },
    inputBox: { backgroundColor: 'rgba(255,255,255,0.85)', color: '#111111', borderColor: 'rgba(128,128,128,0.2)' },
    datetimePicker: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' },
    logOutput: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' }
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
    button: { backgroundColor: 'rgba(43,136,216,0.8)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.1)' },
    input: { backgroundColor: 'rgba(20,20,28,0.2)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    label: { color: '#f0f0fc', fontWeight: 'normal', textAlign: 'left' },
    checkbox: { color: '#f0f0fc' },
    toggle: { trackColor: '#555', knobColor: '#ddd', activeTrackColor: '#2b88d8', backgroundColor: 'rgba(80,80,80,0.5)' },
    comboBox: { backgroundColor: 'rgba(20,20,28,0.2)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    hyperLink: { color: '#2b88d8', textDecoration: 'underline' },
    radioGroup: { color: '#f0f0fc' },
    tabsContainer: { backgroundColor: 'rgba(30,35,50,0.15)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.15)', tabHeaderBg: 'rgba(30,30,40,0.1)', tabBtnBg: 'rgba(30,30,40,0.1)', tabActiveBg: 'rgba(40,45,60,0.5)', tabActiveBorderColor: '#2b88d8', tabInactiveBg: 'rgba(20,25,35,0.3)' },
    progressBar: { backgroundColor: 'rgba(61,61,61,0.3)', barColor: '#2b88d8', color: '#ffffff', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(20,20,28,0.15)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(43,136,216,0.15)', itemSelectedBg: '#2b88d8', itemSelectedColor: '#ffffff', itemColor: '#f0f0fc' },
    treeView: { backgroundColor: 'rgba(20,20,28,0.15)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(43,136,216,0.15)', itemSelectedBg: '#2b88d8', itemSelectedColor: '#ffffff', treeSelectedBg: 'rgba(43,136,216,0.2)', treeToggleColor: 'rgba(180,180,180,0.7)' },
    dataGrid: { backgroundColor: 'rgba(20,20,28,0.15)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(30,35,50,0.5)', rowHoverBg: 'rgba(43,136,216,0.1)', rowSelectedBg: 'rgba(43,136,216,0.15)', gridHeaderBg: 'rgba(40,40,50,0.3)', gridEvenRowBg: 'rgba(35,35,40,0.3)', gridHoverBg: 'rgba(30,50,80,0.3)', gridFocusedBg: 'rgba(40,60,100,0.3)' },
    cardBox: { backgroundColor: 'rgba(35,38,55,0.25)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.15)', headerColor: 'rgba(50,50,60,0.5)', headerTitleColor: '#f0f0fc', collapseBtnColor: 'rgba(180,180,180,0.7)' },
    contextMenu: { backgroundColor: 'rgba(35,38,55,0.9)', color: '#f0f0fc' },
    tooltip: { backgroundColor: 'rgba(85,85,85,0.9)', color: '#fff', borderColor: 'rgba(128,128,128,0.2)' },
    textarea: { backgroundColor: 'rgba(20,20,28,0.2)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.3)', padding: 4, fontSize: 13 },
    iconButton: { backgroundColor: 'rgba(43,136,216,0.8)', color: '#ffffff' },
    imageBox: { backgroundColor: 'rgba(45,45,45,0.3)', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: 'rgba(208, 208, 208, 1)', lineStyle: 'solid'},
    messageBox: { backgroundColor: 'rgba(35,38,55,0.85)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.15)' },
    inputBox: { backgroundColor: 'rgba(35,38,55,0.85)', color: '#f0f0fc', borderColor: 'rgba(128,128,128,0.15)' },
    datetimePicker: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' },
    logOutput: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' }
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
    button: { backgroundColor: 'rgba(0,120,212,0.8)', color: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' },
    input: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    label: { color: '#1e1e2a', fontWeight: 'normal', textAlign: 'left' },
    checkbox: { color: '#1e1e2a' },
    toggle: { trackColor: '#cccccc', knobColor: '#ffffff', activeTrackColor: '#0078d4', backgroundColor: 'rgba(200,200,200,0.5)' },
    comboBox: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    hyperLink: { color: '#0078d4', textDecoration: 'underline' },
    radioGroup: { color: '#1e1e2a' },
    tabsContainer: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)', tabHeaderBg: 'rgba(255,255,255,0.1)', tabBtnBg: 'rgba(255,255,255,0.1)', tabActiveBg: 'rgba(255,255,255,0.5)', tabActiveBorderColor: '#0078d4', tabInactiveBg: 'rgba(255,255,255,0.15)' },
    progressBar: { backgroundColor: 'rgba(240,240,240,0.3)', barColor: '#0078d4', color: '#ffffff', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff', itemColor: '#1e1e2a' },
    treeView: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(0,120,212,0.15)', itemSelectedBg: '#0078d4', itemSelectedColor: '#ffffff', treeSelectedBg: 'rgba(0,120,212,0.2)', treeToggleColor: 'rgba(102,102,102,0.7)' },
    dataGrid: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(255,255,255,0.5)', rowHoverBg: 'rgba(0,120,212,0.08)', rowSelectedBg: 'rgba(0,120,212,0.15)', gridHeaderBg: 'rgba(240,240,240,0.3)', gridEvenRowBg: 'rgba(250,250,250,0.3)', gridHoverBg: 'rgba(230,247,255,0.3)', gridFocusedBg: 'rgba(214,228,255,0.3)' },
    cardBox: { backgroundColor: 'rgba(255,255,250,0.25)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)', headerColor: 'rgba(245,245,245,0.5)', headerTitleColor: '#1E1F22', collapseBtnColor: 'rgba(102,102,102,0.7)' },
    contextMenu: { backgroundColor: 'rgba(255,255,255,0.9)', color: '#1e1e2a' },
    tooltip: { backgroundColor: 'rgba(51,51,51,0.9)', color: '#fff', borderColor: 'rgba(128,128,128,0.2)' },
    textarea: { backgroundColor: 'rgba(255,255,255,0.2)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.3)', padding: 4, fontSize: 13 },
    iconButton: { backgroundColor: 'rgba(0,120,212,0.8)', color: '#ffffff' },
    imageBox: { backgroundColor: 'rgba(245,245,245,0.3)', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: 'rgba(208, 208, 208, 1)', lineStyle: 'solid'},
    messageBox: { backgroundColor: 'rgba(255,255,255,0.85)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)' },
    inputBox: { backgroundColor: 'rgba(255,255,255,0.85)', color: '#1e1e2a', borderColor: 'rgba(128,128,128,0.2)' },
    datetimePicker: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' },
    logOutput: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' }
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
    button: { backgroundColor: 'rgba(30,136,229,0.8)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.1)' },
    input: { backgroundColor: 'rgba(20,20,28,0.2)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    label: { color: '#f5f5ff', fontWeight: 'normal', textAlign: 'left' },
    checkbox: { color: '#f5f5ff' },
    toggle: { trackColor: '#555', knobColor: '#ddd', activeTrackColor: '#1e88e5', backgroundColor: 'rgba(80,80,80,0.5)' },
    comboBox: { backgroundColor: 'rgba(20,20,28,0.2)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.3)', padding: 4 },
    hyperLink: { color: '#1e88e5', textDecoration: 'underline' },
    radioGroup: { color: '#f5f5ff' },
    tabsContainer: { backgroundColor: 'rgba(25,30,40,0.15)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.15)', tabHeaderBg: 'rgba(30,30,40,0.1)', tabBtnBg: 'rgba(30,30,40,0.1)', tabActiveBg: 'rgba(35,40,55,0.5)', tabActiveBorderColor: '#1e88e5', tabInactiveBg: 'rgba(15,20,30,0.2)' },
    progressBar: { backgroundColor: 'rgba(61,61,61,0.3)', barColor: '#1e88e5', color: '#ffffff', valueColor: '#ffffff' },
    listBox: { backgroundColor: 'rgba(20,20,28,0.15)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(30,136,229,0.15)', itemSelectedBg: '#1e88e5', itemSelectedColor: '#ffffff', itemColor: '#f5f5ff' },
    treeView: { backgroundColor: 'rgba(20,20,28,0.15)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.2)', itemHoverBg: 'rgba(30,136,229,0.15)', itemSelectedBg: '#1e88e5', itemSelectedColor: '#ffffff', treeSelectedBg: 'rgba(30,136,229,0.2)', treeToggleColor: 'rgba(180,180,180,0.7)' },
    dataGrid: { backgroundColor: 'rgba(20,20,28,0.15)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.2)', headerBg: 'rgba(25,30,40,0.5)', rowHoverBg: 'rgba(30,136,229,0.1)', rowSelectedBg: 'rgba(30,136,229,0.15)', gridHeaderBg: 'rgba(40,40,50,0.3)', gridEvenRowBg: 'rgba(35,35,40,0.3)', gridHoverBg: 'rgba(30,50,80,0.3)', gridFocusedBg: 'rgba(40,60,100,0.3)' },
    cardBox: { backgroundColor: 'rgba(30,35,50,0.25)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.15)', headerColor: 'rgba(50,50,60,0.5)', headerTitleColor: '#f5f5ff', collapseBtnColor: 'rgba(180,180,180,0.7)' },
    contextMenu: { backgroundColor: 'rgba(30,35,50,0.9)', color: '#f5f5ff' },
    tooltip: { backgroundColor: 'rgba(85,85,85,0.9)', color: '#fff', borderColor: 'rgba(128,128,128,0.2)' },
    textarea: { backgroundColor: 'rgba(20,20,28,0.2)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.3)', padding: 4, fontSize: 13 },
    iconButton: { backgroundColor: 'rgba(30,136,229,0.8)', color: '#ffffff' },
    imageBox: { backgroundColor: 'rgba(45,45,45,0.3)', borderColor: 'rgba(128,128,128,0.3)' },
    divider: { borderColor: 'rgba(208, 208, 208, 1)', lineStyle: 'solid'},
    messageBox: { backgroundColor: 'rgba(30,35,50,0.85)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.15)' },
    inputBox: { backgroundColor: 'rgba(30,35,50,0.85)', color: '#f5f5ff', borderColor: 'rgba(128,128,128,0.15)' },
    datetimePicker: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' },
    logOutput: { backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#1f1f2b', borderColor: 'rgba(128, 128, 128, 0.2)' }
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