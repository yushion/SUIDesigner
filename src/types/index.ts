/**
 * @file types/index.ts
 * @description UI 设计器 - 全局类型定义
 */

/** 控件类型枚举 */
export type WidgetType =
  | 'button'
  | 'input'
  | 'checkbox'
  | 'toggle'
  | 'comboBox'
  | 'label'
  | 'hyperlink'
  | 'textarea'
  | 'radioGroup'
  | 'tabsContainer'
  | 'progressBar'
  | 'datetimePicker'
  | 'logOutput'
  | 'iconButton'
  | 'imageBox'
  | 'cardBox'
  | 'listBox'
  | 'treeView'
  | 'dataGrid'
  | 'contextMenu'
  | 'tooltip'
  | 'divider'
  | 'messageBox'
  | 'inputBox'

/** 标签页定义 */
export interface TabDef {
  name: string
  title: string
}

/** 日志条目 */
export interface LogEntry {
  text: string
  color: string
}

/** 列表框项 */
export interface ListBoxItem {
  id: string
  text: string
  selected?: boolean
}

/** 树形控件节点 */
export interface TreeNode {
  id: string
  text: string
  icon?: string
  expanded?: boolean
  checked?: boolean
  children?: TreeNode[]
}

/** 多项表格列定义 */
export interface TableColumn {
  field: string
  header: string
  width?: number
  editable?: boolean
}

/** 多项表格行数据 */
export interface TableRow {
  id: string
  cells: Record<string, any>
  selected?: boolean
}

/** 右键菜单项（支持子菜单和分隔线） */
export interface ContextMenuItem {
  id: string
  text: string
  icon?: string
  type?: 'normal' | 'separator'
  children?: ContextMenuItem[]
}

/** 控件样式对象 */
export interface WidgetStyle {
  left: number
  top: number
  width: number
  height: number
  backgroundColor?: string
  color?: string
  borderColor?: string
  borderWidth?: number
  borderStyle?: string
  borderRadius?: number
  fontSize?: number
  fontWeight?: string
  fontFamily?: string
  textAlign?: string
  textDecoration?: string
  padding?: number
  margin?: number
  boxShadow?: string
  opacity?: number
  zIndex?: number
  cursor?: string
  minWidth?: number
  minHeight?: number
  /** 子选择器样式映射（如 { '.progress-fill': { background: '#0078D4' } }） */
  subStyles?: Record<string, Record<string, any>>
  /** 伪类样式映射（如 { ':hover': { filter: 'brightness(1.1)' } }） */
  pseudoStyles?: Record<string, Record<string, any>>
  [key: string]: any
}

/** 控件样式 JSON 存储结构（纯数据，不含 CSS 字符串） */
export interface WidgetStyleData {
  /** 控件自身样式属性（camelCase） */
  base: Record<string, any>
  /** 子选择器样式（key 为选择器字符串如 '.progress-fill'，value 为属性对象） */
  sub: Record<string, Record<string, any>>
  /** 伪类样式（key 为伪类字符串如 ':hover'，value 为属性对象） */
  pseudo: Record<string, Record<string, any>>
}

/** JSON 配置中的子元素样式定义（新格式：base+pseudo 直接定义样式属性） */
export interface MappedProp {
  selector: string
  base: Record<string, any>
  pseudo: Record<string, Record<string, any>>
}

/** JSON 配置中的计算属性定义（模板变量，如 {{halfH}}） */
export interface ComputedProp {
  selector: string
  cssProp: string
  template: string
}

/** 结构 CSS：选择器 → CSS 声明数组（不含变量，纯静态） */
export type StructuralCSS = Record<string, string[]>

/** 单个控件类型的 JSON 配置（一个 JSON 文件的结构） */
export interface WidgetJSONConfig {
  label: string
  icon: string
  defaultStyleData: WidgetStyleData
  defaultStyleLight?: WidgetStyleData
  defaultStyleDark?: WidgetStyleData
  structuralCSS?: StructuralCSS
  mappedProps: MappedProp[]
  computedProps: ComputedProp[]
  defaultProps: Record<string, any>
}

/** 统一运行时配置（整个设计器的唯一数据源） */
export interface DesignRuntimeConfig {
  version: string
  canvas: CanvasConfig
  widgets: Widget[]
  messageBoxConfig: MessageBoxConfig
  inputBoxConfig: InputBoxConfig
}

/** 控件数据模型 */
export interface Widget {
  id: string
  type: WidgetType
  name: string
  style: WidgetStyle
  /** 纯 JSON 样式数据（迁移目标：唯一数据源） */
  styleData?: WidgetStyleData
  text?: string
  labelText?: string
  placeholder?: string
  value?: string
  options?: string[]
  selectedIndex?: number
  layout?: 'vertical' | 'horizontal'
  href?: string
  /** 超链接专有：是否显示下划线 */
  showUnderline?: boolean
  checked?: boolean
  rows?: number | TableRow[]
  inputType?: string
  customCSS?: string
  disabled: boolean
  visible: boolean
  /** 进度条专有：进度值 0-100 */
  progressValue?: number
  /** 进度条专有：是否显示进度文本（默认 true） */
  showProgressText?: boolean
  /** 进度条/列表框专有：是否可编辑/可交互 */
  editable?: boolean
  /** 进度条专有：是否可拖拽修改进度 */
  draggable?: boolean
  /** 日志输出专有：日志行数组 */
  logs?: LogEntry[]
  /** 图标按钮专有：图标类名 */
  iconName?: string
  /** 图标按钮专有：图标位置 */
  iconPosition?: 'left' | 'right' | 'icon-only'
  /** 图标按钮专有：自定义图标 HTML */
  iconHtml?: string
  /** 图片框专有：图片地址 */
  src?: string
  /** 图片框专有：缩放模式 fill|contain|cover|none */
  fit?: string
  /** 图片框专有：图片位置（配合 fit=none） */
  objectPosition?: string
  /** 卡片框专有：是否显示标题栏 */
  showHeader?: boolean
  /** 卡片框专有：标题文字 */
  headerTitle?: string
  /** 卡片框专有：标题栏背景色 */
  headerColor?: string
  /** 卡片框专有：是否可折叠 */
  collapsible?: boolean
  /** 卡片框专有：当前是否已折叠 */
  collapsed?: boolean
  /** 列表框专有：列表项数组 */
  items?: ListBoxItem[]
  /** 列表框专有：是否显示复选框 */
  showCheckbox?: boolean
  /** 列表框专有：是否允许多选 */
  multiSelect?: boolean
  /** 列表框专有：是否允许双击编辑 / 多项表格专有：全局可编辑单元格 */
  editable?: boolean
  /** 列表框/多项表格专有：失去焦点后是否保持高亮 / 是否始终显示行复选框 */
  alwaysShowSelection?: boolean
  /** 树形框专有：节点数组 */
  treeNodes?: TreeNode[]
  /** 树形框专有：是否允许双击编辑 */
  treeEditable?: boolean
  /** 树形框专有：是否显示图标 */
  treeShowIcon?: boolean
  /** 树形框专有：是否显示复选框 */
  treeShowCheckbox?: boolean
  /** 树形框专有：失去焦点后是否保持选中高亮 */
  treeAlwaysShowSelection?: boolean
  /** 标签页容器专有：标签页定义 */
  tabs?: TabDef[]
  /** 标签页容器专有：当前激活的标签页 */
  activeTab?: string
  /** 标签页容器专有：是否隐藏标签头 */
  hideTabHeader?: boolean
  /** 标签页/卡片框容器专有：运行时测量的头部高度（px） */
  headerHeight?: number
  /** 图片框专有：是否使用透明底色 */
  transparentBg?: boolean
  /** 子控件（仅容器控件使用） */
  children?: Widget[]
  /** 父控件ID（子控件使用） */
  parentId?: string
  /** 所属标签页索引（子控件使用） */
  parentTabIndex?: number
  /** 多项表格专有：列定义 */
  columns?: TableColumn[]
  /** 多项表格专有：是否显示行复选框 */
  showRowCheckbox?: boolean
  /** 多项表格专有：是否允许添加行 */
  allowAddRow?: boolean
  /** 多项表格专有：是否允许删除行 */
  allowDeleteRow?: boolean
  /** 右键菜单专有：绑定目标控件ID */
  contextMenuTargetId?: string
  /** 右键菜单专有：触发事件 */
  contextMenuTrigger?: 'contextmenu' | 'click' | 'dblclick' | 'mouseenter'
  /** 右键菜单专有：菜单项列表 */
  contextMenuItems?: ContextMenuItem[]
  /** 右键菜单专有：弹出菜单样式CSS（子样式编辑器） */
  contextMenuCSS?: string
  /** 气泡框专有：绑定目标控件ID */
  tooltipTargetId?: string
  /** 气泡框专有：触发事件 */
  tooltipTrigger?: 'hover' | 'click' | 'focus'
  /** 气泡框专有：提示内容 */
  tooltipContent?: string
  /** 气泡框专有：是否允许HTML内容 */
  tooltipAllowHTML?: boolean
  /** 气泡框专有：显示位置 */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  /** 气泡框专有：显示延迟(ms) */
  tooltipShowDelay?: number
  /** 气泡框专有：隐藏延迟(ms) */
  tooltipHideDelay?: number
  /** 气泡框专有：弹出气泡样式CSS（子样式编辑器） */
  tooltipCSS?: string
}

/** 全局信息提示框配置 */
export interface MessageBoxConfig {
  title: string
  message: string
  icon: 'none' | 'info' | 'warning' | 'error' | 'question' | 'custom'
  customIcon: string
  buttons: 'ok' | 'okcancel' | 'yesno' | 'yesnocancel' | 'retrycancel'
  defaultButton: number
  width: number
  height: number
  showOverlay: boolean
  closeOnOverlayClick: boolean
  draggable: boolean
  customCSS: string
  /** 信息提示框透明度（0-1） */
  opacity?: number
}

/** 全局输入框配置 */
export interface InputBoxConfig {
  title: string
  prompt: string
  defaultValue: string
  inputType: 'text' | 'number' | 'password'
  buttons: 'ok' | 'okcancel'
  defaultButton: number
  width: number
  height: number
  showOverlay: boolean
  closeOnOverlayClick: boolean
  draggable: boolean
  customCSS: string
  /** 输入框透明度（0-1） */
  opacity?: number
}

/** 画布配置 */
export interface CanvasConfig {
  width: number
  height: number
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderRadius: number
  /** 画布标题（作为导出 HTML 的页面 title） */
  title?: string
  /** 是否固定画布宽高（预览时选中则用设置的宽高，未选中则继承body宽高） */
  canvasFixedSize: boolean
  /** 总控透明度（0-1，统一调度所有控件透明度） */
  masterOpacity?: number
  /** 画布自身透明度（0-1） */
  opacity?: number
  /** 画布自定义 CSS */
  customCSS: string

  // ===== 标题栏配置 =====
  /** 是否显示标题栏 */
  showTitleBar: boolean
  /** 标题栏文字 */
  titleBarTitle: string
  /** 标题栏对齐方式 */
  titleBarAlign: 'left' | 'center' | 'right'
  /** 标题栏图标名称（Font Awesome） */
  titleBarIconName: string
  /** 标题栏自定义图标 HTML */
  titleBarIconHtml: string
  /** 标题栏背景色 */
  titleBarBgColor: string
  /** 标题栏文字颜色 */
  titleBarTextColor: string
  /** 标题栏按钮颜色（最小化/最大化/关闭按钮文字颜色） */
  titleBarBtnColor: string
  /** 标题栏透明度（独立于总控透明度，0-1） */
  titleBarOpacity: number

  // ===== 画布视觉效果 =====
  /** 毛玻璃效果（backdrop-filter blur） */
  glassEffect: boolean
  /** 显示画布外边框阴影 */
  showShadow: boolean
  /** 画布区可否拖拽（仅总预览生成页，app-region） */
  canvasDraggable: boolean

  // ===== 底部背景（模拟真实页面 body 背景） =====
  bodyBackground: {
    enabled: boolean
    imageUrl: string
    imageSize: 'cover' | 'contain' | 'auto'
    imageRepeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
    imagePosition: string
  }
}

/** 控件库条目 */
export interface WidgetLibraryItem {
  type: WidgetType
  label: string
  icon: string
  defaultStyle: WidgetStyle
}