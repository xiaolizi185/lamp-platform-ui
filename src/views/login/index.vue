<template>
  <div class="login-container">
    跳转到登录服务。。。
  </div>
</template>

<script>

import vue from 'vue'
import { getToken } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    return {
      queryParamters: null
    }
  },
  mounted() {
    this.login()
  },
  methods: {
    login() {
      const hasToken = getToken()
      const provider = vue.getAcloudProvider()
      if (this.queryParamters) {
        provider.request.redirect_uri = provider.request.redirect_uri + '?' + this.queryParamters
      }
      if (hasToken) {
        provider.logout()
      } else {
        provider.login()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  margin: 20px;
}
</style>
