<template>
  <div class="app-container" style="margin-top:10px">
    <el-divider />
    <el-form ref="form" :rules="model.rules" :model="model" label-width="100px">
      <el-form-item label="数据源名称" prop="name" class="form-item" :rules="model.rules.name">
        <el-input v-model="model.name" :maxlength="16" clearable placeholder="请输入数据源名称" />
      </el-form-item>
      <el-form-item label="数据源描述" prop="description" class="form-item" :rules="model.rules.description">
        <el-input v-model="model.description" :maxlength="100" clearable placeholder="请输入数据源描述" />
      </el-form-item>
      <el-form-item label="数据源URL" prop="url" class="form-item" :rules="model.rules.url">
        <el-input v-model="model.url" :maxlength="200" clearable placeholder="请输入数据库URL" />
      </el-form-item>
      <el-form-item label="数据库帐号" prop="userName" class="form-item" :rules="model.rules.userName">
        <el-input v-model="model.userName" :maxlength="30" clearable placeholder="请输入数据库帐号" />
      </el-form-item>
      <el-form-item label="数据库密码" prop="password" class="form-item" :rules="model.rules.password">
        <el-input v-model="model.password" :maxlength="30" type="password" clearable placeholder="请输入数据库密码" />
      </el-form-item>
      <!-- <el-form-item label="数据库类型" prop="dbType" class="form-item" :rules="model.rules.dbType">
        <el-select v-model="model.dbType" placeholder="请选择数据库类型" style="width: 100%" @change="changeType(model.dbType)">
          <el-option v-for="item in dbTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item> -->
    </el-form>
    <div style="margin-left: 20%">
      <el-button type="primary" @click="getDatabaseConnect()">测试连接</el-button>
      <el-button type="primary" @click="saveAddDatabase()">提交</el-button>
      <el-button type="cancel" @click="closeAddDatabase">取消</el-button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import aTool from '@acloud/acloud-atool-js'
import defaultSettings from '@/settings'
import { Sm3Utils } from '@acloud/acloud-smcrypto-js'
export default {
  props: {
    'drawer': {
      type: Object,
      default: null
    },
    'reloadTable': {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      activeName: 'accountAttr',
      // dbTypes: [{
      //   label: 'Mysql',
      //   value: '1'
      // }, {
      //   label: 'Oracle',
      //   value: '2'
      // }],
      model: {
        rules: {
          name: [
            { required: true, message: '请输入数据源名称', trigger: 'blur' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ], description: [
            { required: true, message: '请输入数据源描述', trigger: 'blur' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ], url: [
            { required: true, message: '请输入数据库URL', trigger: 'blur' },
            {
              pattern: aTool.RegexHelper.constants.url.value,
              message: '请输入正确的URL',
              trigger: 'change'
            }
          ], userName: [
            { required: true, message: '请输入数据库帐号', trigger: 'blur' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ], password: [
            { required: true, message: '请输入数据库密码', trigger: 'blur' }
          ]
        }
      }
    }
  },
  created() {
  },
  methods: {
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    changeType() {
    },
    saveAddDatabase() {
      const params = {
        'name': this.model.name,
        'description': this.model.description,
        'url': this.model.url,
        'userName': this.model.userName,
        'password': Sm3Utils.sm3AndSm2EncryptRP(defaultSettings.publicKey, this.model.password, '|'),
        'dbType': '1',
        'loginUserId': Vue.getAcloudProvider().getUserInfo().id
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios.post('/sgid-out-manage/databaseManage/addDatabase', params).then(res => {
            if (res.data.code === '100001') {
              this.$message.success('添加成功。')
              this.$emit('confirm', res.data.message)
              this.drawer.addDatabaseDrawer.hide()
              this.reloadTable()
            } else {
              this.$message.error(res.data.message)
            }
          }).catch(e => {
            this.$message.error(e.res.data.message || '服务器繁忙')
          })
        }
      })
    },
    getDatabaseConnect() {
      const params = {
        'url': this.model.url,
        'userName': this.model.userName,
        'password': Sm3Utils.sm3AndSm2EncryptRP(defaultSettings.publicKey, this.model.password, '|'),
        'dbType': '1',
        'loginUserId': Vue.getAcloudProvider().getUserInfo().id
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios.post('/sgid-out-manage/databaseManage/getDatabaseConnect', params).then(res => {
            if (res.data.code === '100001') {
              this.$message.success('连接成功。')
            } else {
              this.$message.error(res.data.message)
            }
          }).catch(e => {
            this.$message.error(e.res.data.message || '服务器繁忙')
          })
        }
      })
    },
    closeAddDatabase() {
      this.drawer.addDatabaseDrawer.hide()
    }
  }
}
</script>
<style scoped lang="scss">
  /deep/.el-icon-search{
    background: transparent !important;
    color:#fff !important;
  }
  /deep/.el-input-group--append .el-input__inner{
    height: 35px !important;
  }
  /deep/.el-drawer__header{
    margin-bottom: 0px;
  }
  /deep/.el-input__icon {
    line-height: 31px
  }
  .el-divider--horizontal {
    margin-top: -30px;
  }
</style>
