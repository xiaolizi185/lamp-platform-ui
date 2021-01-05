<template>
  <div>
    <el-steps :active="active" finish-status="success">
      <el-step title="网关信息" />
      <el-step title="单灯设置" />
    </el-steps>
    <!--网关信息--->
    <div v-if="active===0" class="gatewayInfo">
      <!--<div style="margin-bottom: 10px"><span style="font-size: 16px">创建一个站点:</span><span style="font-size: 14px;color:#d0d0d0">请填写你的站点基本信息</span></div>-->
      <el-form ref="form" :rules="model.rules" :model="model" label-width="100px">
        <el-form-item label="站点名称" prop="uname" class="form-item" :rules="model.rules.uname">
          <el-input v-model="model.uname" :maxlength="16" clearable placeholder="请输入站点名称" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projName" class="form-item" :rules="model.rules.projName">
          <el-select v-model="model.projName" placeholder="请选择项目" style="width: 100%" @change="changeProject(model.projName)">
            <el-option
              v-for="item in projectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="集控类型" prop="rtutype" class="form-item" :rules="model.rules.rtutype">
          <el-select v-model="model.rtutype" placeholder="请选择集控类型" style="width: 100%" @change="changeRtuType(model.rtutype)">
            <el-option
              v-for="item in rtuList"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="编号" prop="ucode" class="form-item" :rules="model.rules.ucode">
          <el-input disabled="true" v-model="model.ucode" :maxlength="200" clearable placeholder="请输入集控编号" @blur="checkUcode"/>
        </el-form-item>
        <el-form-item label="经度" prop="maplongitude" class="form-item" :rules="model.rules.maplongitude">
          <el-input v-model="model.maplongitude" :maxlength="200" clearable placeholder="请输入经度" @click.native="selectMap" />
        </el-form-item>
        <el-form-item label="纬度" prop="maplatitude" class="form-item" :rules="model.rules.maplatitude">
          <el-input v-model="model.maplatitude" :maxlength="200" clearable placeholder="请输入纬度" @click.native="selectMap" />
        </el-form-item>
        <el-form-item label="安装地址" prop="address" class="form-item" :rules="model.rules.address">
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
          :rules="model.rules.remarks"
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
    </div>
    <div v-if="active===1" class="gatewayInfo">
      <!--回路信息-->
      <loop ref="childLoop" :params="params" @selectedTableData="selectedTableData" />
    </div>
    <el-button v-if="active===1" style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
    <el-button v-if="active===1" style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="prev">上一步</el-button>
    <el-button v-if="active===0" style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="next">下一步</el-button>
    <!---嵌套的选择地图层-->
    <el-drawer
      ref="innerMapDrawer"
      size="80%"
      :append-to-body="true"
      :before-close="handleClose"
      :visible.sync="innerDrawer"
    >
      <map-drawer :drawer="innerMapDrawer" :maplongitude="params.maplongitude" :maplatitude="params.maplatitude" :address="params.address" @saveMapInfo="saveMapInfo" />
    </el-drawer>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import mapDrawer from './mapDrawer'
import loop from './loop'
import Vue from 'vue'
export default {
  components: { mapDrawer, loop },
  props: {
    'drawer': {
      type: Object,
      default: null
    },
    'params': {
      type: Object,
      default: null
    },
    'loaddata': {
      type: Function,
      default: null
    },
    'projectList': {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      active: 0,
      innerMapDrawer: this.$refs,
      mapDrawer: false,
      innerDrawer: false,
      rtuList: [],
      selecteTabelData: [],
      projectid: '',
      changeproject: false,
      model: {
        uname: '',
        projName: '',
        rtutype: '',
        ucode: '',
        maplongitude: '',
        maplatitude: '',
        address: '',
        remarks: '',
        rules: {
          uname: [
            { required: true, message: '请输入站点名称。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
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
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          remarks: [
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          rtutype: [
            { required: true, message: '请输入集控类型。', trigger: 'blur' }
          ],
          maplongitude: [
            { required: true, message: '请选择经度。', trigger: 'blur' }
          ],
          maplatitude: [
            { required: true, message: '请选择纬度。', trigger: 'blur' }
          ]
        }
      }
    }
  },
  created() {
    this.getRtuTypeList()
    this.init()
  },
  methods: {
    init() {
      this.model.uname = this.params.uname
      this.projectid = this.params.projectID
      this.model.projName = this.params.projName
      this.model.rtutype = this.params.rtuType
      this.model.ucode = this.params.ucode
      this.model.maplongitude = this.params.mapLongitude
      this.model.maplatitude = this.params.mapLatitude
      this.model.address = this.params.address
      this.model.remarks = this.params.remarks
    },
    prev() {
      --this.active
      if (this.active < 0) this.active = 0
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
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
    changeRtuType(rtutype) {
      this.model.rtutype = rtutype
    },
    changeProject(projectId) {
      this.model.projName = projectId
      this.changeproject = true
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      } else {
        return ''
      }
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    // 选择经纬度
    selectMap() {
      this.innerDrawer = true
    },
    saveMapInfo(mapInfo) {
      this.model.maplongitude = mapInfo.lng
      this.model.maplatitude = mapInfo.lat
      this.model.address = mapInfo.address
    },
    selectedTableData(selectedTableData) {
      this.selecteTabelData = selectedTableData
    },
    // 检查集控编号是否存在
    checkUcode() {
      this.$axios.get('/acloud-lighting/station/findByUCode?uCode=' + this.model.ucode).then(res => {
        if (res.data.code !== 20000) {
          this.$message.error(res.data.message)
          this.model.ucode = ''
          return
        }
      })
    },
    // 保存站点基本信息
    confirmSave() {
      this.$refs.childLoop.subSingle()
      const station = {
        'autoid': this.params.autoId,
        'projectid': this.changeproject === true ? this.model.projName : this.projectid,
        'projectname': this.model.projName,
        'ucode': this.model.ucode,
        'uname': this.model.uname,
        'rtutype': this.model.rtutype,
        'address': this.model.address,
        'maplongitude': this.model.maplongitude,
        'maplatitude': this.model.maplatitude,
        'createid': Vue.getAcloudProvider().getUserInfo().id,
        'updatetime': new Date().getTime(),
        'remarks': this.model.remarks,
        'delstate': 1
      }
      const params = {
        'station': station,
        'stationSingleLampList': this.selecteTabelData
      }
      this.$axios.post('/acloud-lighting/station/update', params).then(res => {
        if (res.data.code === 20000) {
          this.$message.success('修改成功')
          this.loaddata()
          this.drawer.editStationDrawer.hide()
        } else {
          this.$message.error(res.data.message)
          this.drawer.editStationDrawer.hide()
          return
        }
      }).catch(() => {
        // this.$message.error('修改失败。')
        this.drawer.editStationDrawer.hide()
        return
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
  .el-table .success-row{
    background:rgb(228, 228, 228);
  }
</style>
