<template>
  <div>
    <!---------------------------------------------表格------------------------------------------------------------------->
    <el-table
      v-loading.body="tableData.listLoading"
      :header-cell-style="getRowClass"
      :row-class-name="tableRowClassName"
      :data="tableData.dataList"
      element-loading-text="Loading"
      border
      highlight-current-row
      style="width: 100%;margin-top: 10px;cursor: pointer"
      @row-click="showRow"
    >
      <el-table-column align="center" width="65">
        <template slot-scope="scope">
          <el-radio v-model="radio" :label="scope.$index+1" />
        </template>
      </el-table-column>
      <el-table-column label="序号" width="50" type="index" :index="indexMethod" />
      <el-table-column type="selection" width="50" />
      <el-table-column show-overflow-tooltip prop="alias" label="传感器别名" sortable />
      <el-table-column show-overflow-tooltip prop="imei" label="IMEI" sortable />
      <el-table-column show-overflow-tooltip prop="f_OnlineTime" label="上下线时间" />
      <el-table-column show-overflow-tooltip prop="fullState" label="满空状态" />
      <el-table-column show-overflow-tooltip prop="powerState" label="电量状态" />
      <el-table-column show-overflow-tooltip prop="batteryValue" label="电池电量" />
      <el-table-column show-overflow-tooltip prop="batteryVoltage" label="电池电压" />
      <el-table-column show-overflow-tooltip prop="temperature" label="温度" />
      <el-table-column show-overflow-tooltip prop="tiltAngle" label="倾角" />
      <el-table-column show-overflow-tooltip prop="rsrp" label="信号功率" />
      <el-table-column show-overflow-tooltip prop="remarks" label="备注" />
      <el-table-column show-overflow-tooltip prop="updateTime" label="创建时间" />
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
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
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
      rowInfo: '',
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
        dataList: []
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 查询分页信息
    getTableData() {
      const params = {
        delstate: 1,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      this.$axios.post('/acloud-trash/trashSensorDevice/search?page=' + 1 + '&size=' + 20, params).then((res) => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.rows
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
      this.$emit('getTrashInfo', this.rowInfo)
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
