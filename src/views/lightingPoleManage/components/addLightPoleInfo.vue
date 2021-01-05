<template>
  <div>
    <el-form ref="form" :rules="model.rules" :model="model" label-width="100px">
        <el-form-item label="灯杆名称" prop="fName" class="form-item" :rules="model.rules.fName">
        <el-input v-model="model.fName" :maxlength="200" clearable placeholder="请输入集控编号" />
      </el-form-item>
      <el-form-item label="项目名称" prop="fProjectId" class="form-item" :rules="model.rules.fProjectId">
        <el-select v-model="model.fProjectId" placeholder="请选择项目" style="width: 100%" @change="changeProject(model.fProjectId)">
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
       <!-- @change="changeRtuType(model.fLampPoleTypeId)" -->
      <el-form-item label="灯杆类型" prop="fLampPoleTypeId" class="form-item" :rules="model.rules.fLampPoleTypeId">
        <el-select v-model="model.fLampPoleTypeId" placeholder="请选择灯杆类型" style="width: 100%"

        >
          <el-option
            v-for="item in lightType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="经度" prop="fLongitude" class="form-item" :rules="model.rules.fLongitude">
        <el-input v-model="model.fLongitude" :maxlength="200" clearable placeholder="请输入纬度" @click.native="selectMap" />
      </el-form-item>
      <el-form-item label="纬度" prop="f_Latitude" class="form-item" :rules="model.rules.f_Latitude">
        <el-input v-model="model.f_Latitude" :maxlength="200" clearable placeholder="请输入纬度" @click.native="selectMap" />
      </el-form-item>
      <el-form-item label="安装地址" prop="fInstallAddress" class="form-item" :rules="model.rules.fInstallAddress">
        <el-input v-model="model.fInstallAddress" :maxlength="200" clearable placeholder="请输入安装地址" />
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
    <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
    <!---嵌套的选择地图层-->
    <el-drawer
      ref="innerMapDrawer"
      size="80%"
      :append-to-body="true"
      :before-close="handleClose"
      :visible.sync="innerDrawer"
    >
      <map-drawer :drawer="innerMapDrawer" @saveMapInfo="saveMapInfo" />
    </el-drawer>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import mapDrawer from '../../websiteManage/components/mapDrawer'
import Vue from 'vue'
export default {
  components: { mapDrawer },
  props: {
    'drawer': {
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
      active: 0,
      innerMapDrawer: this.$refs,
      mapDrawer: false,
      innerDrawer: false,
      rtuList: [],
      selecteTabelData: [],
      projectList: [],
      lightType: [],
      model: {
        fProjectId: '',
        fLampPoleTypeId: '',
        fName: '',
        fInstallAddress: '',
        fLongitude: '',
        f_Latitude: '',
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
          fInstallAddress: [
            { required: true, message: '请输入安装地址。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '请输入安装地址。',
              trigger: 'change'
            }
          ],
          fProjectId: [
            { required: true, message: '请选择所属项目。', trigger: 'blur' }
          ],
          fLampPoleTypeId: [
            { required: true, message: '请选择灯杆类型。', trigger: 'blur' }
          ],
          fLongitude: [
            { required: true, message: '请选择经度。', trigger: 'change' }
          ],
          f_Latitude: [
            { required: true, message: '请选择纬度。', trigger: 'change' }
          ]
        }
      }
    }
  },
  created() {
    this.getProjectInfo()
    this.getLightPoleyType()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    },
    changeProject(projectId) {
      this.model.fProjectId = projectId
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
      this.model.fLongitude = mapInfo.lng
      this.model.f_Latitude = mapInfo.lat
      this.model.fInstallAddress = mapInfo.address
    },
    selectedTableData(selectedTableData) {
      this.selecteTabelData[0] = selectedTableData
    },
    getProjectInfo() {
      const params = {
        'fDelState': true,
         'createId':Vue.getAcloudProvider().getUserInfo().id
      }
      return this.$axios.post('/acloud-lamppost/project/search?page=' + 1 + '&size=' + 20, params).then(res => {
        if (res.data.code === 20000) {
          for (let i = 0; i < res.data.data.rows.length; i++) {
            this.projectList.push({
              'label': res.data.data.rows[i].fName,
              'value': res.data.data.rows[i].fId
            })
          }
        } else {
          this.$message.error(res.data.message || '查询失败')
          return
        }
      }).catch(() => {
        this.$message.error('服务器繁忙。')
      })
    },
    getLightPoleyType() {
      const params = {
        'fDelState': 1
      }
      this.$axios.post('/acloud-lighting/LampPoleType/search?page=' + 1 + '&size=' + 20, params).then(res => {
        if (res.data.code === 20000) {
          for (let i = 0; i < res.data.data.rows.length; i++) {
            this.lightType.push({
              'label': res.data.data.rows[i].fName,
              'value': res.data.data.rows[i].fId
            })
          }
        } else {
          this.$message.error(res.data.message || '查询失败')
          return
        }
      }).catch(() => {
        this.$message.error('服务器繁忙。')
      })
    },

    // 保存站点基本信息
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          const params = {
            'fProjectId': this.model.fProjectId,
            'fLampPoleTypeId': this.model.fLampPoleTypeId,
            'fName': this.model.fName,
            'fInstallAddress': this.model.fInstallAddress,
            'fLongitude': this.model.fLongitude,
            'fCreateID': Vue.getAcloudProvider().getUserInfo().id,
            'fRemark': this.model.fRemark,
            'f_Latitude': this.model.f_Latitude
          }
          this.$axios.post('/acloud-lighting/lampPole/add', params).then(res => {
            if (res.data.code === 20000) {
              this.$message.success('添加成功。')
              this.loaddata()
              this.drawer.addLightPoleDrawer.hide()
            } else {
              this.$message.error(res.data.message || '修改失败')
              this.drawer.addLightPoleDrawer.hide()
              return
            }
          }).catch(() => {
            this.drawer.addLightPoleDrawer.hide()
            return
          })
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
  .el-table .success-row{
    background:rgb(228, 228, 228);
  }
</style>
