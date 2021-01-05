<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <!-- <img src="http://192.168.3.25:18000/acloud-file-center/file/oper/download?fileId=DB79C845DB3E40F6BEE7FD11AE573F9E&access_token=8dba80a0afbab80ca6454011d7083187" class="sidebar-logo"> -->
      <!-- <img  src="../../icons/light/lighting-red.png" class="sidebar-logo"> -->
      <el-avatar
        class="sidebar-logo"
        shape="square"
        :size="40"
        :src="avatarUrl + objectEntity.fileId + '&access_token=' +token"
      />
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span class="user-name">{{ name }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided>
            <el-button type="text" icon="el-icon-unlock" @click="changePassword">修改密码</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-upload
              ref="uploadxls"
              accept="image/jpeg,image/jpg,image/png"
              class="upload-demo"
              action=""
              list-type="picture"
              :show-file-list="true"
              :before-upload="beforeUpload"
            >
              <el-button icon="el-icon-s-custom" type="text">修改头像</el-button>
            </el-upload>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-button type="text" icon="el-icon-document" @click="updateLog">更新日志</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-button type="text" icon="el-icon-folder-checked" @click="$router.push({path: '/handlePerson/needDeal'})">运维待办</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-button type="text" icon="el-icon-switch-button" @click="signOut">退出</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <el-drawer
        :title="drwTitle"
        size="50%"
        :visible.sync="drawer"
        :destroy-on-close="true"
      >

        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="300px">
          <el-form-item label="原密码" prop="oldpassword">
            <el-input v-model="ruleForm.oldpassword" type="password" :maxlength="64" clearable style="width: 300px" />

          </el-form-item>
          <el-form-item label="新密码" prop="password">

            <el-input v-model="ruleForm.password" type="password" :maxlength="64" clearable style="width: 300px" />

          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">

            <el-input v-model="ruleForm.repassword" type="password" :maxlength="64" clearable style="width: 300px" />

          </el-form-item>
          <el-form-item style="margin-left: 20%;">
            <el-button type="primary" @click="save()">确认</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="drawer=false">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
       -->
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import tool from '@acloud/acloud-smcrypto-js'
import Vue from 'vue'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name',
      'token'
    ])
  },
  data() {
    return {
      ruleForm: {
        oldpassword: '',
        password: '',
        repassword: ''
      },
      isable: false,
      alertTotal: 0,
      alertObj: {},
      qunxianFlag: true,
      drwTitle: '修改密码',
      drawer: false,
      objectEntity: {
        fileId: Vue.getAcloudProvider().getUserInfo().photo
      },
      rules: {
        oldpassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
          /* {
            pattern: '^(?![A-Za-z0-9]+$)(?![a-z0-9\\W]+$)(?![A-Za-z\\W]+$)(?![A-Z0-9\\W]+$)[a-zA-Z0-9\\W]{8,16}$',
            message: '密码强度不够',
            trigger: 'blur'
          }*/
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            pattern: '^(?![A-Za-z0-9]+$)(?![a-z0-9\\W]+$)(?![A-Za-z\\W]+$)(?![A-Z0-9\\W]+$)[a-zA-Z0-9\\W]{8,16}$',
            message: '密码强度不够，由大小写字母、数字、特殊字符组成,密码长度至少8位以上如Star*2014',
            trigger: 'blur'
          }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.ruleForm.password) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }]
      },
      avatarUrl: 'http://192.168.3.25:18000/acloud-file-center/file/oper/download?fileId='
    }
  },
  created() {
    // 进来就加载一次
    // this.getGlobalInfo()
    // 10分钟后获取一次通知
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.getGlobalInfo()
    }, 1000 * 600)
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    beforeUpload(file) {
      var that = this
      var formData = new FormData()
      formData.append('file', file)
      this.$axios.post('/acloud-file-center/file/oper/upload', formData).then(res => {
        this.objectEntity = res.data
        var req = {
          'id': Vue.getAcloudProvider().getUserInfo().id,
          'photo': this.objectEntity.fileId
        }
        this.$axios.post('/stars-user/admin/updateById', req).then(res => {
          if (res.data.code === 20000) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      })
    },
    changePassword() {
      console.log(Vue.getAcloudProvider().getUserInfo())
      this.drawer = true
    },
    updateLog() {
      this.$router.push({ path: '/updateLog/updateLog' })
    },
    save() {
      this.$refs.ruleForm.validate(v => {
        if (v) {
          const userInfo = eval('(' + window.sessionStorage.getItem('acloud-user_info') + ')')
          let userId = null
          if (userInfo != null) {
            userId = userInfo.id
          } else {
            this.$message.error('无登录用户信息，请登录后操作。')
            return
          }
          var req = {}
          const PublicKey = '040ECAE82EA6BDC5FF6C90E6D8700F4F9BD44224E8F7F7576FA9B17CE823C18DD5C1D4F9CBF4EE23B3D3347C589036EE13E9497607D0F6C7B5CC655D0D250EDCE8'
          req.userId = Vue.getAcloudProvider().getUserInfo().id
          req.username = Vue.getAcloudProvider().getUserInfo().username
          debugger
          req.pscode = '{crypto}' + tool.Sm3Utils.sm3AndSm2EncryptRP(PublicKey, this.ruleForm.oldpassword, '|')
          req.newPscode = '{crypto}' + tool.Sm3Utils.sm3AndSm2EncryptRP(PublicKey, this.ruleForm.password, '|')
          req.sign = tool.Sm3Utils.encrypt(Vue.getAcloudProvider().getUserInfo().username)
          this.$axios.post('/acloud-user/users/pscode/forceModify', req).then(res => {
            this.drawer = false
            this.objectEntity = {}
            this.$message.success('密码修改成功！')
          }
          )
            .catch(e => {
              this.$message.error(e.res.data.message || '服务器繁忙')
            })
        }
      }
      )
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    // 获取全局的告警信息
    getGlobalInfo() {
      const params = {
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      const message = '测试'
      const _this = this // 函数作用域问题
      this.$axios.post('/acloud-lighting/stationAlert/getTotal', params).then(res => {
        if (res.data.code === 20000) {
          if (res.data.data !== null || res.data.data !== 'undefined') {
            this.alertTotal = res.data.data.井盖 + res.data.data.垃圾桶 + res.data.data.照明 + res.data.data.摄像头 + res.data.data.显示屏
            this.alertObj = res.data.data
          }
          const confirmText = ['未出理告警总数' + this.alertTotal, '其中井盖数:' + this.alertObj.井盖, '垃圾桶数:' + this.alertObj.垃圾桶,
            '照明数:' + this.alertObj.照明, '摄像头数:' + this.alertObj.摄像头, '显示屏数:' + this.alertObj.显示屏
          ]

          const newDatas = []
          const h = this.$createElement
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          // message: h('div', null, newDatas)
          this.$notify({
            title: '告警信息',
            message: '<span>未处理告警总数:</span>' + this.alertTotal +
              '<p/>' + '<span>井盖:</span>' + this.alertObj.井盖 +
              '<p/>' + '<span>垃圾桶:</span>' + this.alertObj.垃圾桶 +
              '<p/>' + '<span>照明:</span>' + this.alertObj.照明 +
              '<p/>' + '<span>摄像头:</span>' + this.alertObj.摄像头 +
              '<p/>' + '<span>显示屏:</span>' + this.alertObj.显示屏 +
              '<p/>' +
              '<button style="cursor: pointer;background-color: #00a2ff;border-color: #00a2ff;color: #fff;width: 250px">查看</button>',
            dangerouslyUseHTMLString: true,
            position: 'bottom-right',
            type: 'warning',
            duration: '8000',
            onClick() {
              _this.defineCallBack(message) // 自定义回调,message为传的参数
            }
          })
        } else {
          this.qunxianFlag = false
          // this.$message.error(res.data.message || '查询失败')
          return
        }
      }).catch(() => {
        // this.$message.error('服务器繁忙。')
      })
    },
    // 点击事件回调
    defineCallBack(message) {
      this.$router.push({ path: '/handlePerson/list' })
    },

    signOut() {
      this.$confirm('您确认退出系统吗？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'info',
        callback: action => {
          if (action === 'confirm') {
            // 退出方法
            this.logout()
          }
        }
      })
    },
    async logout() {
      // await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>

  .auth_text_blue{
    cursor: pointer;
    color:#fff;
    background-color: #09f;
    font-size: 16px;
    border-color: #09f;
  }

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 10px;
          vertical-align: middle;
        }

        .user-name {
          cursor: pointer;
          font-size: 16px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
