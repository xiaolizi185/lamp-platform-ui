<template>
  <el-container>
    <div class="error-box">
      <div class="error-code">
        <div class="animated tada">403</div>
      </div>
      <div class="error-title">
        抱歉，你越权访问！
      </div>
      <div class="error-content">
        <p>原因：服务器拒绝或禁止访问</p>
      </div>
    </div>
  </el-container>
</template>

<script>
import Vue from 'vue'
export default {
  beforeMount() {
    this.delayJump()
  },
  methods: {
    delayJump() {
      Vue.getAcloudProvider().logout()
    }
  }
}
</script>
