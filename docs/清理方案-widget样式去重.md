# Widget 样式清理方案

## 问题背景

widgetDefaults/\*.json 已作为唯一数据源，但 Vue 组件中仍存在大量硬编码样式。由于 customCSS 的 #id 选择器优先级高于 scoped CSS，视觉效果正确，但这些硬编码属于技术债务。

## 三类硬编码

| 类别 | 位置 | 示例 |
|---|---|---|
| A. scoped 视觉默认值 | `<style scoped>` | `background-color: #0078d4` |
| B. computed fallback | `computed` 内 | `\|\| '#333'`、`\|\| '#ffffff'` |
| C. scoped 子元素结构样式 | `<style scoped>` | `.list-item { height: 32px }` |

## 清理原则

- **视觉/主题属性** → widgetDefaults JSON + customCSS 控制
- **编辑器交互样式** → 保留在 Vue 组件中（outline、cursor: move）
- **子元素布局** → 迁移到 structuralCSS + mappedProps

## 执行顺序

### 第 1 批：低复杂度（批量处理 10 个）
Button / Input / Label / Checkbox / Toggle / Hyperlink / RadioGroup / Textarea / Divider / IconButton

### 第 2 批：中复杂度（逐个处理 7 个）
ComboBox / ProgressBar / ImageBox / CardBox / DateTimePicker / LogOutput / Tooltip

### 第 3 批：高复杂度（逐个处理 7 个，需更新 structuralCSS + mappedProps）
ListBox / TreeView / DataGrid / TabsContainer / ContextMenu / MessageBox / InputBox

## 操作步骤

1. 补充 JSON 中缺失的 CSS 属性
2. 创建共享工具 `widgetStyleUtils.ts`
3. 移除 scoped CSS 中的视觉属性（保留 outline、cursor:move、user-select、box-sizing）
4. 消除 computed fallback 值
5. 复杂组件的子元素样式迁移到 structuralCSS + mappedProps
6. 回归验证
