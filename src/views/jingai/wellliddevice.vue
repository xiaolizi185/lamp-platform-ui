<template>
  <div class="app-container">
    <div name="buttonGroup">
      <el-row>
        <el-form
          ref="paramForm"
          :model="tableData.params"
          :rules="tableData.paramFormRules"
          inline
          label-position="right"
          label-width="80px"
          class="query-form"
          style="margin-top: 10px"
        >
          <el-form-item>
          <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="addVideo">新增</el-button>
          <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34" @click="deleteMulti">删除</el-button>
          </el-form-item>
          <el-form-item prop="searchKey">
          <el-input v-model="tableData.params.searchKey" :maxlength="200" clearable placeholder="请输入搜索条件" />
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div name="table">
      <el-table
        v-loading.body="tableData.listLoading"
        :header-cell-style="getRowClass"
        :row-class-name="tableRowClassName"
        :data="tableData.dataList"
        element-loading-text="Loading"
        border
        highlight-current-row
        style="width: 100%;margin-top: 10px;cursor: pointer"
        @selection-change="selsChange"
      >
        <el-table-column label="序号" width="50" type="index" />
        <el-table-column type="selection" width="50" />
        <el-table-column show-overflow-tooltip prop="fAlias" label="设备别名" sortable />
        <el-table-column show-overflow-tooltip prop="fImei" label="IMEI" sortable />
        <el-table-column show-overflow-tooltip prop="projName" label="所属项目" />
        <!-- <el-table-column show-overflow-tooltip prop="fBatteryVoltage" label="电池电压" /> -->
        <el-table-column
          show-overflow-tooltip
          prop="fManholeCoverPositionState"
          label="井盖位置状态"
          :formatter="formatp"
        />
        <el-table-column
          show-overflow-tooltip
          prop="fLeanAngle"
          label="井盖倾斜角度"
          :formatter="formatangle"
        />
        <el-table-column
          show-overflow-tooltip
          prop="fWaterLevelState"
          label="水位状态"
          :formatter="formatw"
        />
        <!-- <el-table-column show-overflow-tooltip prop="fGasType" label="气体类型" />
        <el-table-column show-overflow-tooltip prop="fGasConcentration" label="气体浓度" />
        <el-table-column show-overflow-tooltip prop="fVibFreq" label="井盖震动频次" /> -->

        <!-- <el-table-column show-overflow-tooltip prop="fRsrp" label="信号功率" />
        <el-table-column show-overflow-tooltip prop="fSinr" label="信号噪声比" />
        <el-table-column show-overflow-tooltip prop="fEcl" label="信号覆盖等级" /> -->
        <!-- <el-table-column show-overflow-tooltip prop="fSignalUpdateTime" label="信号上报时间"
        :formatter="formatuptime"/>
        <el-table-column show-overflow-tooltip prop="fRemarks" label="备注" /> -->
        <el-table-column show-overflow-tooltip prop="fCreateTime" label="创建时间" />
        <el-table-column show-overflow-tooltip prop="cName" label="创建人" />
        <el-table-column show-overflow-tooltip prop="address" label="地址" />
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="updateWelllidDevice(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-show="tableData.total > 0"
        background
        :total="tableData.total"
        :current-page="tableData.params.currentPage"
        :page-sizes="[10,20,30,40,50]"
        :page-size="tableData.params.pageSize"
        layout="total,sizes,prev,next"
        style="float: right;margin-top:10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div>
      <el-drawer
        :title="drwTitle"
        size="50%"
        :visible.sync="drawer"
        :destroy-on-close="true"
        :before-close="handleClose"
      >

        <el-form ref="form" :rules="model.rules" :model="welllidDevice" label-width="100px">
          <el-form-item label="设备别名:" prop="fAlias" class="form-item" :rules="model.rules.fAlias">
            <el-input v-model="welllidDevice.fAlias" :maxlength="16" clearable placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item label="IMEI:" prop="fImei" class="form-item" :rules="model.rules.fImei">
            <el-input v-model="welllidDevice.fImei" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="所属项目:" prop="fProjectId" class="form-item" :rules="model.rules.fProjectId">
            <el-select v-model="welllidDevice.fProjectId" placeholder="请选择">
              <el-option
                v-for="item in projectList"
                :key="item.fID.toString()"
                :label="item.fName"
                :value="item.fID.toString()"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="经度:" class="form-item" :rules="model.rules.fLatitude">
            <el-input v-model="welllidDevice.longitude" :maxlength="200" clearable placeholder="请输入" @click.native="selectMap" />
          </el-form-item>
          <el-form-item label="纬度:" class="form-item" :rules="model.rules.fLatitude">
            <el-input v-model="welllidDevice.latitude" :maxlength="200" clearable placeholder="请输入" @click.native="selectMap" />
          </el-form-item>
          <el-form-item label="地址:" prop="fAddr" class="form-item" :rules="model.rules.fAddr">
            <el-input v-model="welllidDevice.address" :maxlength="200" clearable placeholder="请输入地址" />
          </el-form-item>
        </el-form>
        <el-drawer
          ref="innerMapDrawer"
          size="80%"
          :append-to-body="true"
          :visible.sync="innerDrawer"
        >
          <map-drawer :drawer="innerMapDrawer1" @saveMapInfo="saveMapInfo" />
        </el-drawer>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="drawer=false">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import { getWelllidDevice, addWelllidDevice, updateWelllidDevice, deleteWelllidDevice } from '@/views/jingai/wellliddevice.js'
import { queryProject } from '@/views/videoMonitor/videoAccount/videoM.js'
import mapDrawer from '@/views/websiteManage/components/mapDrawer'
import Vue from 'vue'
const paramFormRules = {
  searchKey: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: {
    mapDrawer
  },
  filters: {

  },
  data() {
    return {
      innerMapDrawer1: this.$refs,
      drwTitle: '人员编辑',
      drawer: false,
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10,
          searchKey: ''
        },
        paramFormRules,
        total: 0,
        listLoading: true,
        dataList: []
      },
      welllidDevice: {},
      excuteStatus: '',
      selectList: [],
      projectList: [],
      model: {
        rules: {
          fAlias: [
            { required: true, message: '请输入设备名称。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fImei: [
            { required: true, message: '请输入设备ID。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fProjectId: [
            { required: true, message: '选择所属项目。', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入地址。', trigger: 'change' }
          ],
          longitude: [
            { required: true, message: '请输入经度。', trigger: 'change' }
          ],
          latitude: [
            { required: true, message: '请输入纬度。', trigger: 'change' }
          ]
        }
      },
      innerDrawer: false
	  }
  },
  created() {
    this.queryTable()
    this.selectProject()
	  },
  methods: {
    formatp(row, column, state) {
      if (state === 0) { return '正常' } 
      else if((state === 1)){ return '移动' }
      else { return '未知' }
    },
    formatw(row, column, state) {
      if (state === 0) { return '正常' } else if((state === 1)){ return '水满' }
       else { return '未知' }
    },

    formatangle(row, column, state) {
      if (state === null) { return '0' } else { return state }
      
    },
    formatuptime(row, column, timestr) {
      if (timestr === null) return
      var date = new Date(parseInt(timestr))
      const y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
    queryTable() {
      var req = {
        fAlias: this.tableData.params.searchKey,
        fDelState: 0,
        createId: Vue.getAcloudProvider().getUserInfo().id
      }
      getWelllidDevice(req, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.total
          this.tableData.listLoading = false
        }
      })
    },

    // changeCellStyle(row, columnIndex) {
    //   if (row.columnIndex === 5 && row.welllidDevice.fDeviceStatus === 1) {
    //     return 'color: green;'
    //   } else if (row.columnIndex === 5 && row.welllidDevice.fDeviceStatus === 0) {
    //     return 'color: red;'
    //   }
    // },
    search() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.queryTable()
        }
      })
    },
    addVideo() {
      this.welllidDevice = {}
      this.drwTitle = '井盖设备添加'
      this.drawer = true
      this.excuteStatus = 'add'
    },
    updateWelllidDevice(row) {
      this.drwTitle = '井盖设备修改'
      this.drawer = true
      this.excuteStatus = 'update'
      this.welllidDevice = { ...row }
    },
    deleteMulti() {
      // if (this.selectList.length < 1) {
      //   this.$message.error('请只选中一行或多行来操作')
      //   return
      // }
      var deleteList = []

      for (let i = 0; i < this.selectList.length; i++) {
        var s = this.selectList[i].fId
        deleteList.push(s)
      }
      deleteWelllidDevice(deleteList).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.drawer = false
          this.queryTable()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
    },
    reset() {
      this.tableData.params.searchKey = ''
      this.tableData = {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: true,
        dataList: []
      }
      this.queryTable()
    },
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.excuteStatus === 'add') {
            // this.welllidDevice.fManholeCoverPositionState = 0
            // this.welllidDevice.fWaterLevelState = 0
            this.welllidDevice.fCreateID = Vue.getAcloudProvider().getUserInfo().id

            addWelllidDevice(this.welllidDevice).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '添加失败')
              }
            })
          } else {
            updateWelllidDevice(this.welllidDevice).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '更新失败')
              }
            })
          }
        }
      })
    },
    selectProject() {
      queryProject().then(res => {
        if (res.data.code === 20000) {
          this.projectList = res.data.data
        }
      })
    },
    selsChange(val) {
      this.selectList = val
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    },
    // 表格颜色
    // 修改表格头部颜色
    getRowClass({
      rowIndex
    }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    tableRowClassName({
      rowIndex
    }) {
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      } else {
        return ''
      }
    },
    selectMap() {
      this.innerDrawer = true
    },
    saveMapInfo(mapInfo) {
      this.welllidDevice.longitude = mapInfo.lng
      this.welllidDevice.latitude = mapInfo.lat
      this.welllidDevice.address = mapInfo.address
    },
    handleSizeChange(val) {
      this.tableData.params.pageSize = val
      this.tableData.currentPage = 1
      this.queryTable()
    },
    handleCurrentChange(val) {
      this.pagtation.currentPage = val
      this.queryTable()
    }
  }
}
</script>

<style scoped>
div /deep/.el-drawer{
overflow:auto
}
</style>
