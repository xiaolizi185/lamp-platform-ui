// 这里存在安全问题，不能使用cookie 2019-06-12 djdeng
// import Cookies from 'js-cookie'
import Vue from 'vue'

// const TokenKey = 'admin_token'

export function getToken() {
  try {
    return Vue.getAcloudProvider().getAccessToken()
  } catch (error) {
    // return Cookies.get(TokenKey)
  }
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
}
