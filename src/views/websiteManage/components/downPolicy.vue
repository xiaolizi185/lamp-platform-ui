<template>
  <div>
    <el-form ref="form" :model="model">
      <!-- <el-form-item label="任务名称" prop="taskname" class="form-item" :rules="model.rules.taskname" style="margin-left: 10px">
        <el-input v-model="model.taskname" :maxlength="16" clearable placeholder="请输入任务名称" />
      </el-form-item>-->
      <el-divider content-position="left" style="margin-top: -20px;">策略列表</el-divider>
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
        @row-click="showRow"
      >
        <el-table-column align="center" width="65">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.$index+1" />
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="projname" label="所属项目" sortable />
        <el-table-column show-overflow-tooltip prop="uname" label="策略名称" />
        <el-table-column show-overflow-tooltip prop="userdiskname" label="策略类型" />
      </el-table>
      <el-button style="margin-top: 12px;margin-left: 40%" type="primary" @click="confirmSave()">写入策略</el-button>
      <el-button style="margin-top: 12px;text-align:center" type="cancel" @click="cancelOpt()">取消</el-button>
    </el-form>
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
    },
    checkedValue: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      policyid: '',
      radio: '',
      model: {
        taskname: ''
      },
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
        'delstate': 1,
        'createId': Vue.getAcloudProvider().getUserInfo().id
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
    showRow(row) {
      this.policyid = row.autoid
    },
    confirmSave() {
      let delParams = ''
      if (this.policyid === '' || this.policyid === null) {
        this.$message.error('请选择数据。')
        return
      } else {
        for (let i = 0; i < this.checkedValue.length; i++) {
          if (this.checkedValue.length === 1) {
            delParams = this.checkedValue[i].autoId
          } else {
            delParams += this.checkedValue[i].autoId + ','
            delParams = delParams.substring(0, delParams.lastIndexOf(','))
          }
        }
        // 去掉最后一个逗号
        this.$axios.post('/acloud-lighting/stationset/add?autoId=' + delParams + '&policyId=' + this.policyid).then(res => {
          if (res.data.code === 20000) {
            this.$message.success('策略下发成功。')
            this.getTableData()
            this.loaddata()
            this.drawer.downPolicyDrawer.hide()
          } else {
            this.$message.error(res.data.message)
            this.loaddata()
            this.drawer.downPolicyDrawer.hide()
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      }
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    cancelOpt() {
      this.drawer.downPolicyDrawer.hide()
    }
  }
}
</script>
