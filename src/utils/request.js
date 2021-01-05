import axios from 'axios'
import { Message } from 'element-ui'
// import store from '@/store'
import { getToken } from '@/utils/auth'
import { generateDataSign } from '@/utils/tamper-proofing'
import router from '../router'
import OnceTokenProvider from '@acloud/acloud-once-token-js'
import { enablePreventRequestReplay } from '@/settings'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})
// 添加 service 缺失的
service.all = axios.all
service.spread = axios.spread
service.Cancel = axios.Cancel
service.CancelToken = axios.CancelToken
service.isCancel = axios.isCancel

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const token = getToken()
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + token
    }

    // IE10 get请求因为缓存问题，导致无法发起真实请求
    if (config.method === 'get') {
      if (!config.params) {
        config.params = {}
      }
      config.params['_t'] = new Date().getTime()
    }
    if (enablePreventRequestReplay && config.method === 'post' || enablePreventRequestReplay && config.method === 'get') {
      Object.assign(config.headers, OnceTokenProvider.generateOnceTokenOfHeader())
    }

    generateDataSign(config)
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// service.interceptors.request.use(generateDataSign)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response
    // if the custom code is not 20000, it is judged as an error.
    /* if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    } */
  },
  error => {
    let message = null
    console.error(error)
    if (error.response) {
      if (error.response.status === 401) {
        console.error('非法的身份或者身份过期，需要重新登录。')
        router.push('/401')
      } else if (error.response.status === 403) {
        console.error('未授权访问，给用户提示或路由到一个其他错误页面。')
        router.push('/403')
      } else {
        const data = error.response.data
        if (data && data.status === 500 && data.message) {
          message = data.message
        }
      }
    }

    // 新增特殊字符安全拦截，错误提示特殊处理
    if (error.response.data && !error.response.data['message'] && error.response.data.indexOf('SafeModule::') !== -1) {
      if (error.config.url.indexOf('/acloud-audit/auditRuleDetail/save') !== -1 ||
        error.config.url.indexOf('/acloud-audit/auditRuleDetail/update') !== -1) {
        message = '请求包含特殊语法字符串，请重新输入。'
      }
    }

    Message({ message: message || '服务器繁忙。', type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

export default service
