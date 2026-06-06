/**
 * @file main.ts
 * @description UI 设计器 - 应用入口
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { registerAllWidgets } from './config/registerAllWidgets'
import './examples/customWidgetDemo'  // 自定义控件示例
import App from './App.vue'

// 注册所有内置控件（必须在 mount 之前执行）
registerAllWidgets()

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.mount('#app')