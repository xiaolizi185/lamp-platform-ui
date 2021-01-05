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
      <el-table-column show-overflow-tooltip prop="fName" label="项目名称" />
      <el-table-column show-overflow-tooltip prop="fDelState" label="删除状态" :formatter="formatDelState" />
      <el-table-column show-overflow-tooltip prop="fLongitude" label="经度" />
      <el-table-column show-overflow-tooltip prop="fLatitude" label="纬度" />
      <el-table-column show-overflow-tooltip prop="fRemark" label="备注" />
      <el-table-column show-overflow-tooltip prop="fCreateTime" label="创建时间" :formatter="formatCreateDate" />
    </el-table>
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
        'fName': this.tableData.params.fName,
        'fDelState': false,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      this.tableData.listLoading = true
      this.$axios.post('/acloud-lamppost/project/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
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
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    formatDelState(cellValue) {
      if (cellValue.fDelState === false) {
        return '已删除'
      } else {
        return '未删除'
      }
    },
    confirmSave() {
      let delParams = ''
      if (this.tableChecked.length === 0) {
        this.$message.error('请选择数据。')
        return
      } else {
        for (let i = 0; i < this.tableChecked.length; i++) {
          if (this.tableChecked.length === 1) {
            delParams = this.tableChecked[i].fId
          } else {
            delParams += this.tableChecked[i].fId + ','
            const last = this.tableChecked[this.tableChecked.length - 1]
            if (last === this.tableChecked.length) {
              delParams = delParams.Substring(0, delParams.length - 1)
            }
          }
        }
        this.$axios.post('/acloud-lamppost/project/restore?autoId=' + delParams).then(res => {
          if (res.data.code === 20000) {
            this.$message.success('恢复成功。')
            this.getTableData()
            this.loaddata()
            this.drawer.resumeProject1.hide()
          } else {
            this.$message.error(res.data.message)
            this.loaddata()
            this.drawer.resumeProject1.hide()
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      }
    },
    cancelOpt() {
      this.drawer.resumeProject1.hide()
    }
  }
}
</script>
