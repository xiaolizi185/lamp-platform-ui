<template>
  <el-container>
    <!-- <div class="error-box">
      <div class="error-code">
        <div class="animated tada">401</div>
      </div>
      <div class="error-title">
        抱歉，你不能访问！
      </div>
      <div class="error-content">
        <p>原因：你的会话已过期或已注销</p>
      </div>
    </div> -->
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
