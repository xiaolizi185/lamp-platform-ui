<template>
  <div>
    <!---------------------------------------------表格------------------------------------------------------------------->
    <el-table
      v-loading="tableData.listLoading"
      
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
      <el-table-column show-overflow-tooltip prop="ucode" label="编号" sortable />
      <el-table-column show-overflow-tooltip prop="projName" label="所属项目" sortable />
      <el-table-column show-overflow-tooltip prop="uname" label="站点名称" />
      <el-table-column show-overflow-tooltip prop="rtuType" label="产品型号" :formatter="formatRtuType" />
      <el-table-column show-overflow-tooltip prop="address" label="安装地址" />
      <el-table-column show-overflow-tooltip prop="cname" label="创建人" />
      <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" :formatter="formatCreateDate" />
      <el-table-column show-overflow-tooltip prop="remarks" label="备注" />
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
        'uname': this.tableData.params.uname,
        'ucode': this.tableData.params.ucode,
        'rtutype': this.tableData.params.rtutype,
        'createId': Vue.getAcloudProvider().getUserInfo().id,
        'delstate': 1
      }
      this.tableData.listLoading = true
      this.$axios.post('/acloud-lighting/station/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
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
    formatRtuType(row, column, cellValue) {
      if (cellValue === '003') {
        return '单灯'
      } else if (cellValue === '002') {
        return 'T212'
      } else if (cellValue === '001') {
        return 'G608'
      } else {
        return '智能盒'
      }
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
<style scoped>
  div /deep/ .el-loading-spinner {
    
    margin-top:-35px;
  }
</style>
