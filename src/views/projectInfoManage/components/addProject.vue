<template>
  <div>
    <el-form ref="form" :rules="model.rules" :model="model" label-width="100px">
      <el-form-item label="项目名称" prop="fName" class="form-item" :rules="model.rules.fName">
        <el-input v-model="model.fName" :maxlength="16" clearable placeholder="请输入项目名称" />
      </el-form-item>
      <el-form-item label="经度" prop="fLongitude" class="form-item" :rules="model.rules.fLongitude">
        <el-input v-model="model.fLongitude" :maxlength="200" clearable placeholder="请输入经度" @click.native="selectMap" />
      </el-form-item>
      <el-form-item label="纬度" prop="fLatitude" class="form-item" :rules="model.rules.fLatitude">
        <el-input v-model="model.fLatitude" :maxlength="200" clearable placeholder="请输入纬度" @click.native="selectMap" />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="fRemark"
        class="form-item"
        :rules="model.rules.fRemark"
      >
        <el-input
          v-model="model.fRemark"
          type="textarea"
          maxlength="200"
          show-word-limit
          clearable
          placeholder="请输入相关备注信息"
        />
      </el-form-item>
    </el-form>
    <!---嵌套的选择地图层-->
    <el-drawer
      ref="innerMapDrawer"
      size="80%"
      :append-to-body="true"
      :before-close="handleClose"
      :visible.sync="innerDrawer"
    >
      <map-drawer :drawer="innerMapDrawer1" @saveMapInfo="saveMapInfo" />
    </el-drawer>
    <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="cancel" @click="resetData()">重置</el-button>
    <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
  </div>
</template>
<script>
import aTool from '@acloud/acloud-atool-js'
import Vue from 'vue'
import mapDrawer from '../../websiteManage/components/mapDrawer'
export default {
  components: { mapDrawer },
  props: {
    'drawer1': {
      type: Object,
      default: null
    },
    'loaddata': {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      innerMapDrawer1: this.$refs,
      innerDrawer: false,
      model: {
        fName: '',
        fLongitude: '',
        fLatitude: '',
        fRemark: '',
        rules: {
          fName: [
            { required: true, message: '请输入项目名称。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fRemark: [
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fLongitude: [
            { required: true, message: '请选择经度。', trigger: 'change' }
          ],
          fLatitude: [
            { required: true, message: '请选择纬度。', trigger: 'change' }
          ]
        }
      }
    }
  },
  created() {
  },
  methods: {
    // 选择经纬度
    selectMap() {
      this.innerDrawer = true
    },
    saveMapInfo(mapInfo) {
      this.model.fLongitude = mapInfo.lng
      this.model.fLatitude = mapInfo.lat
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    },
    confirmSave() {
      const params = {
        'fName': this.model.fName,
        'fCreateId': Vue.getAcloudProvider().getUserInfo().id,
        'fCreateTime': new Date().getTime(),
        'fRemark': this.model.fRemark,
        'fDelState': true,
        'fLongitude': this.model.fLongitude,
        'fLatitude': this.model.fLatitude
      }
      this.$refs.form.validate(v => {
        if (v) {
          this.$axios.post('/acloud-lamppost/project/add', params).then(res => {
            if (res.data.code === 20000) {
              this.$message.success('项目添加成功')
              this.loaddata()
              this.drawer1.addProject.hide()
            } else {
              this.$message.error(res.data.message)
              this.drawer1.addProject.hide()
              return
            }
          }).catch(() => {
            // this.$message.error('修改失败。')
            this.drawer1.addProject.hide()
            return
          })
        }
      })
    },
    resetData() {
      this.model.fName = null
      this.model.fRemark = null
      this.model.fLongitude = null
      this.model.fLatitude = null
    }
  }
}
</script>
<style type="text/css">
  .gatewayInfo{
    margin-top: 10px;
  }
  /deep/.el-dialog__close.el-icon.el-icon-close{
    color:black
  }
</style>
