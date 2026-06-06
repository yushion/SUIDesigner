/**
 * @file examples/customWidgetDemo.ts
 * @description 自定义控件完整示例（含子元素子样式）
 *
 * 使用方法：在 src/main.ts 中添加 import './examples/customWidgetDemo'
 */

import { registerCustomWidget } from '@/config/customWidgetAPI'

// ================================================================
// 示例 1：评分控件
// ================================================================
registerCustomWidget({
  type: 'starRating',
  label: '评分控件',
  icon: '\u2B50',
  jsonConfig: {
    label: '评分控件',
    icon: '\u2B50',
    defaultStyleData: {
      base: {
        width: 200,
        height: 36,
        backgroundColor: 'transparent',
        color: '#333',
        fontSize: 14,
      },
      sub: {
        // 子元素默认样式（导出/预览时会自动生成选择器）
        '.star-icon': { color: '#ffa500', fontSize: '20px' },
        '.star-count': { color: '#999', fontSize: '14px', marginLeft: '6px' },
      },
      pseudo: {},
    },
    mappedProps: [
      // 定义子选择器的可编辑默认值（属性面板样式编辑/样式编辑器中可修改）
      {
        selector: '.star-icon',
        base: { color: '#ffa500', fontSize: '20px' },
        pseudo: {},
      },
      {
        selector: '.star-count',
        base: { color: '#999', fontSize: '14px' },
        pseudo: {},
      },
    ],
    computedProps: [],
    structuralCSS: {
      // 导出时注入的结构样式（始终生效，不可通过属性面板修改）
      '.star-icon': [
        'display: inline-flex',
        'align-items: center',
        'gap: 2px',
      ],
      '.star-count': [
        'display: inline-block',
        'vertical-align: middle',
      ],
    },
    defaultProps: {
      maxStars: 5,
      value: 3,
    },
  },
  htmlTemplate:
    '<div class="star-icon">\u2605\u2605\u2605\u2606\u2606</div>' +
    '<div class="star-count">{{value}}/{{maxStars}}</div>',
})

// ================================================================
// 示例 2：数据卡片（完整子样式展示）
// ================================================================
registerCustomWidget({
  type: 'statCard',
  label: '数据卡片',
  icon: '\uD83D\uDCCA',
  jsonConfig: {
    label: '数据卡片',
    icon: '\uD83D\uDCCA',
    defaultStyleData: {
      base: {
        width: 180,
        height: 100,
        backgroundColor: '#ffffff',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
      },
      sub: {
        '.card-title':   { color: '#999', fontSize: '12px' },
        '.card-value':   { color: '#333', fontSize: '24px', fontWeight: '700' },
        '.card-subtitle': { color: '#52c41a', fontSize: '11px' },
      },
      pseudo: {},
    },
    mappedProps: [
      {
        selector: '.card-title',
        base: { color: '#999', fontSize: '12px' },
        pseudo: {},
      },
      {
        selector: '.card-value',
        base: { color: '#333', fontSize: '24px', fontWeight: '700' },
        pseudo: {},
      },
      {
        selector: '.card-subtitle',
        base: { color: '#52c41a', fontSize: '11px' },
        pseudo: {},
      },
    ],
    computedProps: [],
    structuralCSS: {
      '.card-title': [
        'display: block',
        'text-align: center',
      ],
      '.card-value': [
        'display: block',
        'text-align: center',
      ],
      '.card-subtitle': [
        'display: block',
        'text-align: center',
        'margin-top: 2px',
      ],
    },
    defaultProps: {
      title: '总用户数',
      value: '12,846',
      subtitle: '较昨日 +12%',
    },
  },
  htmlTemplate:
    '<div class="card-title">{{title}}</div>' +
    '<div class="card-value">{{value}}</div>' +
    '<div class="card-subtitle">{{subtitle}}</div>',
  cssString: '',
})

console.log('[customWidgetDemo] 已注册 2 个自定义控件：starRating、statCard')
