import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // al css
/* import 'bootstrap/dist/css/bootstrap.css'*/
import echarts from 'echarts'
import './utils/oauth2' // 安装OAuth2.0客户端组件

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission-acloud' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // al filters
import { Notification } from 'element-ui'
import request from './utils/request'
import { BmlMarkerClusterer } from 'vue-baidu-map'
Vue.component('bml-marker-clusterer', BmlMarkerClusterer)
Vue.prototype.$axios = request
// 消息通知组件
Vue.prototype.$notify = Notification
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
/* import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
} */

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  locale
})
Vue.use(echarts)
Vue.prototype.$echarts = echarts

// register al utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 阻止整个页面所有的右击事件
document.oncontextmenu = function() {
  return false
}
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
