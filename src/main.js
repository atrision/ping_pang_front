/*
 * @Author: misuzu 1411498103@qq.com
 * @Date: 2025-03-19 14:38:22
 * @LastEditors: misuzu 1411498103@qq.com
 * @LastEditTime: 2025-03-19 15:42:19
 * @FilePath: \web_app\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'

import router from './router'
import pinia from './store'
import {
  Button,
  Layout,
  Menu,
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  Switch,
  Table,
  Tabs,
  Tag,
  Modal,
  Drawer,
  Progress,
  Divider,
  Dropdown,
  List,
  Avatar,
  Descriptions,
  Timeline,
  Statistic,
  Popconfirm,
  Spin,
  Alert,
  message,
  notification
} from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './styles/input-fix.css' // 引入全局修复样式


const app = createApp(App)

// 注册 Ant Design Vue 组件
app.use(Button)
app.use(Layout)
app.use(Menu)
app.use(Card)
app.use(Form)
app.use(Input)
app.use(Select)
app.use(DatePicker)
app.use(Checkbox)
app.use(Radio)
app.use(Switch)
app.use(Table)
app.use(Tabs)
app.use(Tag)
app.use(Modal)
app.use(Drawer)
app.use(Progress)
app.use(Divider)
app.use(Dropdown)
app.use(List)
app.use(Avatar)
app.use(Descriptions)
app.use(Timeline)
app.use(Statistic)
app.use(Popconfirm)
app.use(Spin)
app.use(Alert)

// 全局挂载消息提示
app.config.globalProperties.$message = message
app.config.globalProperties.$notification = notification

// 使用路由和状态管理
app.use(router)
app.use(pinia)
app.use(Antd)

app.mount('#app')
