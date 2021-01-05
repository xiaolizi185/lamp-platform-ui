<template>
  <div>
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
        <el-table-column align="center" width="65">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index+1" />
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="deviceId" label="设备id" sortable />
        <el-table-column show-overflow-tooltip prop="name" label="名称" sortable />
        <el-table-column show-overflow-tooltip prop="ip" label="IP地址" />
        <el-table-column show-overflow-tooltip prop="width" label="宽度" />
        <el-table-column show-overflow-tooltip prop="height" label="高度" />
        <el-table-column show-overflow-tooltip prop="light" label="亮度" />
        <el-table-column show-overflow-tooltip prop="volnme" label="音量" />
        <el-table-column show-overflow-tooltip prop="username" label="创建人" />
        <el-table-column show-overflow-tooltip prop="status" label="状态" />
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" />

      </el-table>
      <el-pagination
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
  </div>
</template>

<script>
import { getSysLeddevice } from '@/views/displayScreen/sysLeddevice.js'
import Vue from 'vue'
export default {
  components: {

  },
  filters: {

  },
  props: {
    drawer: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: false,
        dataList: []
      },
      radio: '',
      rowInfo: ''
	  }
  },
  computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    }
  },
  created() {
    this.queryTable()
	  },
  methods: {

    queryTable() {
      var tempObj = {
        delState: true,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      getSysLeddevice(tempObj, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.total
          this.tableData.listLoading = false
        }
      })
    },
    showRow(row) {
      this.rowInfo = row
    },
    cancelOpt() {
      this.drawer.stationdrawer.hide()
    },
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
    selsChange(val) {
      this.selectList = val
    },
    confirmSave() {
      this.$emit('getStationInfo', this.rowInfo)
      this.drawer.stationdrawer.hide()
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
    },
    indexMethod(index) {
      return this.xuhao + index + 1
    },
    handleSizeChange(val) {
      this.tableData.params.pageSize = val
      this.tableData.params.currentPage = 1
      this.queryTable()
    },
    handleCurrentChange(val) {
      this.pagtation.params.currentPage = val
      this.queryTable()
    }
  }
}
</script>

<style scoped>

</style>
