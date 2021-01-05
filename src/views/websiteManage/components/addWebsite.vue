<template>
  <div>
    <el-steps :active="active" finish-status="success">
      <el-step title="网关信息" />
      <el-step title="单灯设置" />
    </el-steps>

    <div v-if="active===0" class="gatewayInfo">
      <div style="margin-bottom: 10px"><span style="font-size: 16px">创建一个站点:</span><span style="font-size: 14px;color:#d0d0d0">请填写你的站点基本信息</span></div>
      <el-form ref="form" :rules="rules" :model="model" label-width="100px">
        <el-form-item label="站点名称" prop="uname" class="form-item">
          <el-input v-model="model.uname" :maxlength="16" clearable placeholder="请输入站点名称" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectid" class="form-item">
          <el-select v-model="model.projectid" placeholder="请选择项目" style="width: 100%">
            <el-option
              v-for="item in projectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="集控类型" prop="rtuType" class="form-item">
          <el-select v-model="model.rtuType" placeholder="请选择集控类型" style="width: 100%">
            <el-option
              v-for="item in rtuList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="ucode" class="form-item">
          <el-input v-model="model.ucode" :maxlength="200" clearable placeholder="请输入集控编号" />
        </el-form-item>
        <el-form-item label="经度" prop="maplongitude" class="form-item">
          <el-input v-model="model.maplongitude" :maxlength="200" clearable placeholder="请输入经度" @click.native="selectMap" />
        </el-form-item>
        <el-form-item label="纬度" prop="maplatitude" class="form-item">
          <el-input v-model="model.maplatitude" :maxlength="200" clearable placeholder="请输入纬度" @click.native="selectMap" />
        </el-form-item>
        <el-form-item label="安装地址" prop="address" class="form-item">
          <el-input
            v-model="model.address"
            type="textarea"
            maxlength="200"
            show-word-limit
            clearable
            placeholder="请输入地址"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remarks"
          class="form-item"
        >
          <el-input
            v-model="model.remarks"
            type="textarea"
            maxlength="200"
            show-word-limit
            clearable
            placeholder="请输入相关备注信息"
          />
        </el-form-item>
      </el-form>
      <!--经纬度选择-->
      <el-drawer
        v-if="mapDrawer"
        ref="mapDrawer1"
        title="经纬度选择"
        size="40%"
        :append-to-body="true"
        style="font-weight: 600;font-size: 14px;"
        :visible.sync="mapDrawer"
        :direction="direction"
        :destory-on-close="true"
        :model-append-to-body="false"
        :before-close="handleClose"
      >
        <map-drawer :drawer="mapDrawer1" />
        <!-- <view-detail-app :drawer="viewDetailAppDrawer" :params="detailParams" :loaddata="getTableData" />-->
      </el-drawer>
    </div>
    <div v-if="active===1" class="gatewayInfo" />
    <el-button v-if="active===1" style="margin-top: 12px;" @click="prev">上一步</el-button>
    <el-button v-if="active===0" style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="next">下一步</el-button>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import mapDrawer from './mapDrawer'
import Vue from 'vue'
export default {
  components: { mapDrawer },
  data() {
    var test = (value, rule, callback) => {
      console.log(value)
    }
    return {
      active: 0,
      mapDrawer1: this.$refs,
      mapDrawer: false,
      rtuList: [],
      projectList: [],
      model: {
        uname: '',
        projectid: '',
        rtuType: '',
        ucode: '',
        maplongitude: '',
        maplatitude: '',
        address: ''
      },
      rules: {
        uname: [
          { required: true, message: '请输入站点名称。', trigger: 'change' },

          {
            validator: test,
            trigger: 'change'
          }
        ],

        ucode: [
          { required: true, message: '请输入编号。', trigger: 'change' },
          {
            pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }
        ],
        address: [
          { required: true, message: '请输入安装地址。', trigger: 'change' },
          {
            pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
            message: '请输入安装地址。',
            trigger: 'change'
          }
        ],
        rtuType: [
          { required: true, message: '请输入集控类型。', trigger: 'change' }
        ],
        maplongitude: [
          { required: true, message: '请选择经度。', trigger: 'change' }
        ],
        maplatitude: [
          { required: true, message: '请选择纬度。', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getRtuTypeList()
    this.getProjectInfo()
  },
  methods: {
    prev() {
      --this.active
      if (this.active < 0) this.active = 0
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    // 获取产品型号
    getRtuTypeList() {
      this.$axios.get('/acloud-lighting/userdisk/findAll').then(res => {
        if (res.data.code === 20000) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].itemtype === 'Rtu类型') {
              this.rtuList.push({
                'value': res.data.data[i].ucode,
                'lable': res.data.data[i].uname
              })
            }
          }
        } else {
          this.rtuList = []
          return
        }
      })
    },
    // 选择经纬度
    selectMap() {
      this.mapDrawer = true
    },
    checkUcodeExists() {
      this.$axios.get('/acloud-lighting/station/findByUCode?uCode=' + this.model.ucode).then(res => {
        if (res.data.code !== 20000) {
          this.$message.error(res.data.message)
          return
        }
      })
    }
  }
}
</script>
<style type="text/css">
  .gatewayInfo{
    margin-top: 10px;
  }
  .el-dialog__close.el-icon.el-icon-close{
    color:black
  }
</style>
