/**
 * @file config/registerAllWidgets.ts
 * @description 内置控件统一注册清单 —— 所有控件的单一注册入口
 *
 * 注册内容：
 *   1. JSON 配置（widgetDefaults/*.json）
 *   2. Vue 渲染组件（components/widgets/*.vue）
 *   3. HTML 导出函数（htmlExporter.widgetHTMLGenerators）
 *   4. 子选择器 CSS 映射（cssParser.CHILD_SELECTOR_MAP）
 */

import { registerWidget } from './widgetRegistry'
import { widgetHTMLGenerators } from '@/utils/htmlExporter'
import { CHILD_SELECTOR_MAP } from '@/utils/cssParser'
import type { WidgetJSONConfig } from '@/types/index'

// ---- JSON 配置 ----
import buttonConfig             from './widgetDefaults/button.json'
import inputConfig              from './widgetDefaults/input.json'
import checkboxConfig           from './widgetDefaults/checkbox.json'
import toggleConfig             from './widgetDefaults/toggle.json'
import comboBoxConfig           from './widgetDefaults/comboBox.json'
import labelConfig              from './widgetDefaults/label.json'
import dividerConfig            from './widgetDefaults/divider.json'
import hyperlinkConfig          from './widgetDefaults/hyperlink.json'
import textareaConfig           from './widgetDefaults/textarea.json'
import radioGroupConfig         from './widgetDefaults/radioGroup.json'
import tabsContainerConfig      from './widgetDefaults/tabsContainer.json'
import progressBarConfig        from './widgetDefaults/progressBar.json'
import datetimePickerConfig     from './widgetDefaults/datetimePicker.json'
import logOutputConfig          from './widgetDefaults/logOutput.json'
import iconButtonConfig         from './widgetDefaults/iconButton.json'
import imageBoxConfig           from './widgetDefaults/imageBox.json'
import cardBoxConfig            from './widgetDefaults/cardBox.json'
import listBoxConfig            from './widgetDefaults/listBox.json'
import treeViewConfig           from './widgetDefaults/treeView.json'
import dataGridConfig           from './widgetDefaults/dataGrid.json'
import contextMenuConfig        from './widgetDefaults/contextMenu.json'
import tooltipConfig            from './widgetDefaults/tooltip.json'
import messageBoxConfig         from './widgetDefaults/messageBox.json'
import inputBoxConfig           from './widgetDefaults/inputBox.json'

// ---- Vue 渲染组件 ----
import ButtonWidget             from '@/components/widgets/ButtonWidget.vue'
import InputWidget              from '@/components/widgets/InputWidget.vue'
import CheckboxWidget           from '@/components/widgets/CheckboxWidget.vue'
import ToggleWidget             from '@/components/widgets/ToggleWidget.vue'
import ComboBoxWidget           from '@/components/widgets/ComboBoxWidget.vue'
import LabelWidget              from '@/components/widgets/LabelWidget.vue'
import DividerWidget            from '@/components/widgets/DividerWidget.vue'
import HyperlinkWidget          from '@/components/widgets/HyperlinkWidget.vue'
import TextareaWidget           from '@/components/widgets/TextareaWidget.vue'
import RadioGroupWidget         from '@/components/widgets/RadioGroupWidget.vue'
import TabsContainer            from '@/components/widgets/TabsContainer.vue'
import ProgressBarWidget        from '@/components/widgets/ProgressBarWidget.vue'
import DateTimePickerWidget     from '@/components/widgets/DateTimePickerWidget.vue'
import LogOutputWidget          from '@/components/widgets/LogOutputWidget.vue'
import IconButtonWidget         from '@/components/widgets/IconButtonWidget.vue'
import ImageBoxWidget           from '@/components/widgets/ImageBoxWidget.vue'
import CardBoxWidget            from '@/components/widgets/CardBoxWidget.vue'
import ListBoxWidget            from '@/components/widgets/ListBoxWidget.vue'
import TreeViewWidget           from '@/components/widgets/TreeViewWidget.vue'
import DataGridWidget           from '@/components/widgets/DataGridWidget.vue'
import ContextMenuWidget        from '@/components/widgets/ContextMenuWidget.vue'

interface RegistryEntry {
  type: string
  config: WidgetJSONConfig
  component?: any
}

/** 所有内置控件的注册数据 */
const BUILTIN_WIDGETS: RegistryEntry[] = [
  { type: 'button',           config: buttonConfig as WidgetJSONConfig,           component: ButtonWidget },
  { type: 'input',            config: inputConfig as WidgetJSONConfig,            component: InputWidget },
  { type: 'checkbox',         config: checkboxConfig as WidgetJSONConfig,         component: CheckboxWidget },
  { type: 'toggle',           config: toggleConfig as WidgetJSONConfig,           component: ToggleWidget },
  { type: 'comboBox',         config: comboBoxConfig as WidgetJSONConfig,         component: ComboBoxWidget },
  { type: 'label',            config: labelConfig as WidgetJSONConfig,            component: LabelWidget },
  { type: 'divider',          config: dividerConfig as WidgetJSONConfig,          component: DividerWidget },
  { type: 'hyperlink',        config: hyperlinkConfig as WidgetJSONConfig,        component: HyperlinkWidget },
  { type: 'textarea',         config: textareaConfig as WidgetJSONConfig,         component: TextareaWidget },
  { type: 'radioGroup',       config: radioGroupConfig as WidgetJSONConfig,       component: RadioGroupWidget },
  { type: 'tabsContainer',    config: tabsContainerConfig as WidgetJSONConfig,    component: TabsContainer },
  { type: 'progressBar',      config: progressBarConfig as WidgetJSONConfig,      component: ProgressBarWidget },
  { type: 'datetimePicker',   config: datetimePickerConfig as WidgetJSONConfig,   component: DateTimePickerWidget },
  { type: 'logOutput',        config: logOutputConfig as WidgetJSONConfig,        component: LogOutputWidget },
  { type: 'iconButton',       config: iconButtonConfig as WidgetJSONConfig,       component: IconButtonWidget },
  { type: 'imageBox',         config: imageBoxConfig as WidgetJSONConfig,         component: ImageBoxWidget },
  { type: 'cardBox',          config: cardBoxConfig as WidgetJSONConfig,          component: CardBoxWidget },
  { type: 'listBox',          config: listBoxConfig as WidgetJSONConfig,          component: ListBoxWidget },
  { type: 'treeView',         config: treeViewConfig as WidgetJSONConfig,         component: TreeViewWidget },
  { type: 'dataGrid',         config: dataGridConfig as WidgetJSONConfig,         component: DataGridWidget },
  // 以下为纯逻辑控件（无画布渲染组件）
  { type: 'contextMenu',      config: contextMenuConfig as WidgetJSONConfig },
  { type: 'tooltip',          config: tooltipConfig as WidgetJSONConfig },
  { type: 'messageBox',       config: messageBoxConfig as WidgetJSONConfig },
  { type: 'inputBox',         config: inputBoxConfig as WidgetJSONConfig },
]

/** 初始化：注册所有内置控件到统一注册中心 */
export function registerAllWidgets(): void {
  for (const entry of BUILTIN_WIDGETS) {
    registerWidget({
      type: entry.type,
      label: entry.config.label,
      icon: entry.config.icon,
      jsonConfig: entry.config,
      vueComponent: entry.component,
      htmlExporter: widgetHTMLGenerators[entry.type],
      childSelectorMap: CHILD_SELECTOR_MAP[entry.type],
    })
  }
}
