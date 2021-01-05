<template>
  <div>
    <el-table
      v-loading.body="tableData.listLoading"
      :header-cell-style="getRowClass"
      :row-class-name="tableRowClassName"
      :data="tableData.dataList"
      element-loading-text="Loading"
      border
      highlight-current-row
      style="width: 100%;margin-top: 10px;cursor: pointer"
      :cell-style="changeCellStyle"
      @row-click="showRow"
    >
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column align="center" width="65">
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.$index+1" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="fAlias" label="设备名称" sortable />
      <el-table-column show-overflow-tooltip prop="fBatteryVoltage" label="电池电压" />
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
      />
      <el-table-column
        show-overflow-tooltip
        prop="fWaterLevelState"
        label="水位状态"
        :formatter="formatw"
      />
      <!-- <el-table-column show-overflow-tooltip prop="welllidDevice.fUid" label="设备ID" sortable />
      <el-table-column show-overflow-tooltip prop="welllidDevice.fCompanyName" label="企业名称" />
      <el-table-column show-overflow-tooltip prop="welllidDevice.fProjectId" label="所属项目" />
      <el-table-column show-overflow-tooltip prop="welllidDevice.fDeviceStatus" label="设备状态" /> -->
      <el-table-column show-overflow-tooltip prop="fDeviceStatusUpdateTime" label="更新时间" />
      <el-table-column show-overflow-tooltip prop="longitude" label="经度" />
      <el-table-column show-overflow-tooltip prop="latitude" label="纬度" />
      <!-- <el-table-column show-overflow-tooltip prop="welllidDevice.fDeviceType" label="设备类型" /> -->
      <el-table-column show-overflow-tooltip prop="address" label="地址" />
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
    <el-button style="margin-top: 12px;margin-left: 40%" type="primary" @click="confirmSave()">确定</el-button>
    <el-button style="margin-top: 12px;text-align:center" type="cancel" @click="cancelOpt()">取消</el-button>
  </div>
</template>
<script>
import { getWelllidDevice } from '@/views/jingai/wellliddevice.js'
import dateTool from '@/utils/date-tool'
import $ from 'jquery'
import Vue from 'vue'

import { getToken, setToken, removeToken } from '@/utils/auth'
export default {
  props: {
    drawer: {
      type: Object,
      default: null
    },
    loaddata: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      radio: '',
      rowInfo: {},
      tableChecked: [],
      tableData: {
        params: {
          uname: '',
          rtutype: '',
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: true,
        dataList: [],
        searchKey: ''
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    formatp(row, column, state) {
      if (state === 0) { return '正常' } else { return '移动' }
    },
    formatw(row, column, state) {
      if (state === 0) { return '正常' } else { return '水满' }
    },
    // 查询分页信息
    getTableData() {
      this.tableData.listLoading = true
      var req = {
        fAlias: '',
        fDelState: 0,
        createId: Vue.getAcloudProvider().getUserInfo().id
      }
      getWelllidDevice(req, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        } else {
          this.$message.error(res.data.message || '查询失败')
          this.tableData.listLoading = false
          this.tableData.dataList = []
          return
        }
      }).catch(() => {
        this.$message.error('服务器繁忙。')
      })
    },
    confirmSave() {
      this.$emit('getStationInfo', this.rowInfo)
      this.drawer.stationdrawer.hide()
    },
    showRow(row) {
      this.rowInfo = row
    },
    cancelOpt() {
      this.drawer.stationdrawer.hide()
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {})
    },
    handleSizeChange(val) {
      this.tableData.params.pageSize = val
      this.tableData.currentPage = 1
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val
      this.getTableData()
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      } else {
        return ''
      }
    }

  }
}
</script>
