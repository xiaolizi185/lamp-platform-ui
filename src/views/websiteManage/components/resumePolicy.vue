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
      :cell-style="changeCellStyle"
      @selection-change="selsChange"
    >
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column type="selection" width="50" />
      <el-table-column show-overflow-tooltip prop="projectid" label="所属项目" sortable />
      <el-table-column show-overflow-tooltip prop="uname" label="策略名称" />
      <el-table-column show-overflow-tooltip prop="userdiskname" label="策略类型" />
     <!-- <el-table-column show-overflow-tooltip prop="bdate" label="开始时间" :formatter="formatCreateDate" />
      <el-table-column show-overflow-tooltip prop="edate" label="结束时间" :formatter="formatCreateDate" />-->
      <el-table-column show-overflow-tooltip prop="cName" label="操作人" />
      <!--<el-table-column show-overflow-tooltip prop="buse" label="可用状态">
      <template slot-scope="scope">
        <div v-if="scope.row.buse == false">
          <el-badge is-dot style="right: 2px; margin-top: 5px;">
            <div>不可用</div>
          </el-badge>
        </div>
        <div v-if="scope.row.buse == true">
          <el-badge is-dot type="success" style="right: 2px; margin-top: 5px;">
            <div>可用</div>
          </el-badge>
        </div>
      </template>
    </el-table-column>-->
    </el-table>
    <el-button style="margin-top: 12px;margin-left: 40%" type="primary" @click="confirmSave()">确定</el-button>
    <el-button style="margin-top: 12px;text-align:center" type="cancel" @click="cancelOpt()">取消</el-button>
  </div>
</template>
<script>
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
        'delstate': 0
      }
      this.tableData.listLoading = true
      this.$axios.post('/acloud-lighting/stationsetlistweb/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
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
            delParams = this.tableChecked[i].autoid
          } else {
            delParams += this.tableChecked[i].autoid + ','
            const last = this.tableChecked[this.tableChecked.length - 1]
            if (last === this.tableChecked.length) {
              delParams = delParams.Substring(0, delParams.length - 1)
            }
          }
        }
        this.$axios.post('/acloud-lighting/stationsetlistweb/restore?autoId=' + delParams).then(res => {
          if (res.data.code === 20000) {
            this.$message.success('恢复成功。')
            this.getTableData()
            this.loaddata()
            this.drawer.resumePolicyDrawer1.hide()
          } else {
            this.$message.error(res.data.message)
            this.loaddata()
            this.drawer.resumePolicyDrawer1.hide()
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      }
    },
    cancelOpt() {
      this.drawer.resumePolicyDrawer1.hide()
    }
  }
}
</script>
