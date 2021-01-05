<template>
  <div class="app-container">
    <el-form
      ref="authForm"
      :rules="authForm.authFormRules"
      :model="authForm"
    >
      <el-form-item prop="authkey">
        <el-input
          v-model="authForm.authkey"
          type="password"
          placeholder="请输入密码"
          :autofocus="true"
        >
          <el-button slot="append" :loading="loading" @click="confirm()">确认</el-button>
          <el-button slot="append" :loading="loading" @click="authForm.authkey = ''">重置</el-button>
          <el-button slot="append" @click="cancel">关闭</el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { Sm3Utils } from '@acloud/acloud-smcrypto-js'
import defaultSettings from '@/settings'

const authFormRules = {
  authkey: [{ required: true, message: '密码不能空', trigger: 'blur' }]
}
export default {
  name: 'UserAuth',
  props: {
    saving: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: this.saving,
      authForm: {
        authFormRules,
        authkey: '',
        pscode: null
      }
    }
  },
  watch: {
    saving: {
      handler: function(n, o) {
        this.loading = n
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    confirm() {
      this.preHandleSubmit()
    },
    cancel() {
      this.$emit('cancel')
    },
    init() {
    },
    preHandleSubmit() {
      this.$refs.authForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.authForm.pscode = '{crypto}' +
          Sm3Utils.sm3AndSm2EncryptRP(defaultSettings.publicKey, this.authForm.authkey, '|')
          // 因目前调用每个方法里面都进行了认证，所以暂时用不上这个方法
          // const params = {
          //   pscode: this.authForm.pscode
          // }
          // this.$axios.post('/acloud-user/users/secCertification', params).then(res => {
          this.$emit('confirm', this.authForm.pscode)
          // }).catch(e => {
          //   this.loading = false
          // })
        } else {
          return false
        }
      })
    }
  }
}
</script>
