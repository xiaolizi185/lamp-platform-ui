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
      @selection-change="selsChange"
    >
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column type="selection" width="50" />
      <el-table-column show-overflow-tooltip prop="ucode" label="编号" sortable />
      <el-table-column show-overflow-tooltip prop="projName" label="所属项目" sortable />
      <el-table-column show-overflow-tooltip prop="uname" label="站点名称" />
      <el-table-column show-overflow-tooltip prop="rtuType" label="产品型号" :formatter="formatRtuType"/>
      <el-table-column show-overflow-tooltip prop="address" label="安装地址" />
      <el-table-column show-overflow-tooltip prop="cname" label="创建人" />
      <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" />
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
        'delstate': 0,
        'createId': Vue.getAcloudProvider().getUserInfo().id
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
    selsChange(val) {
      this.tableChecked = val
    },
    confirmSave() {
      let delParams = ''
      if (this.tableChecked.length === 0) {
        this.$message.error('请选择数据。')
        return
      } else {
        for (let i = 0; i < this.tableChecked.length; i++) {
          if (this.tableChecked.length === 1) {
            delParams = this.tableChecked[i].autoId
          } else {
            delParams += this.tableChecked[i].autoId + ','
            const last = this.tableChecked[this.tableChecked.length - 1]
            if (last === this.tableChecked.length) {
              delParams = delParams.Substring(0, delParams.length - 1)
            }
          }
        }
        
        this.$axios.post('/acloud-lighting/station/restore?autoId='+delParams).then(res => {
          if (res.data.code === 20000) {
            this.$message.success('恢复成功。')
            this.getTableData()
            this.loaddata()
            this.drawer.resumeStationDrawer1.hide()
          } else {
            this.$message.error(res.data.message)
            this.loaddata()
            this.drawer.resumeStationDrawer1.hide()
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      }
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      } else {
        return ''
      }
    },
    cancelOpt() {
      this.drawer.resumeStationDrawer1.hide()
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val
      this.getTableData()
    },
    handleSizeChange(val) {
      this.tableData.params.pageSize = val
      this.tableData.currentPage = 1
      this.getTableData()
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    }
  }
}
</script>
