import request from '@/utils/request'
import Vue from 'vue'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function getInfoAndMenus(token) {
  return Promise.all([
    request({ // IE跨域问题，开发模式下使用node代理
      url: process.env.NODE_ENV === 'development' ? '/acloud-oauth/users/info' : Vue.getAcloudProvider().getUserInfoUri().replace('..', ''), // '/user/info',
      method: 'get'
    }).then(response => { return response.data }),
    request({
      url: Vue.getAcloudProvider().getMenuUri() + '?resType=1&clientId=' + (process.env.VUE_APP_CLIENT_ID),
      method: 'get'
    }).then(response => { return response.data })
  ]).then(data => {
    Vue.getAcloudProvider().setUserInfo(data[0])
    data[0].roles = getMenuUrls([], data[1])
    return Promise.resolve({ data: data[0] })
  })
}

function getMenuUrls(urls, menus) {
  menus.forEach(menu => {
    if (menu.raw.value) {
      urls.push(menu.raw.value)
    }
    if (menu.children && menu.children.length > 0) {
      getMenuUrls(urls, menu.children)
    }
  })
  return urls
}

export function logout() {
  // Vue.getAcloudProvider().deleteUserInfo()
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
