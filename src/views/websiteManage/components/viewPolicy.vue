<template>
  <div>
    <el-divider content-position="left" style="margin-top: -20px;">策略列表</el-divider>
    <el-form ref="form" :model="sizeForm" label-width="80px">
      <el-form-item label="策略名称" prop="uname">
        <el-input v-model="sizeForm.uname"  readonly="readonly" />
      </el-form-item>
      <el-form-item label="策略类型" prop="rtutype">
        <el-input v-model="sizeForm.rtutype" readonly="readonly" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input
          v-model="sizeForm.remarks"
          type="textarea"
          maxlength="200"
          show-word-limit
          clearable
          readonly="readonly"
        />
      </el-form-item>
      <el-divider content-position="left" style="margin-top: -20px;">动作列表</el-divider>
      <el-table
        ref="multipleTable"
        v-loading.body="tableData.listLoading"
        :header-cell-style="getRowClass"
        :row-class-name="tableRowClassName"
        :data="tableData.dataList"
        element-loading-text="Loading"
        border
        highlight-current-row
        style="width: 100%;margin-top: 10px;cursor: pointer"
        :cell-style="changeCellStyle"
      >
        <el-table-column label="序号" width="50" type="index" />
        <el-table-column show-overflow-tooltip prop="actiontype" label="执行类型">
          <template slot-scope="scope">
            {{ scope.row.actiontype | judgeAction }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="lampsmask" label="调光强度" />
           <!-- v-if="checkedType ==='E43EC3CB-EB15-4429-9BF8-94BA92E08403'" -->
        <el-table-column
       
          show-overflow-tooltip
          prop="exectime"
          label="执行时间"
          :formatter="formatCreateDate"
        />
        <!-- <el-table-column
          v-if="checkedType ==='483045FD-E278-4EEB-AFE9-53836FCF6B27'"
          show-overflow-tooltip
          prop="personnum"
          label="人流数量"
        /> -->
         <!-- v-if="checkedType ==='A566EF12-3F1F-4E2F-A6AC-9A5E90D2C4ED'" -->
        <el-table-column
         
          show-overflow-tooltip
          prop="timetype"
          label="时间类型"
        >
          <template slot-scope="scope">
            {{ scope.row.timetype | judgeTime }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="execloop" label="单灯" />
      </el-table>
    </el-form>

  </div>
</template>

<script>
import dateTool from '@/utils/date-tool'
export default {
  filters: {
    judgeAction(param) {
      if (param == null || param === undefined || param === '') {
        return
      }

      if (param === 1) {
        return '开灯'
      } else if (param === 2) {
        return '关灯'
      } else {
        return '调光'
      }
    },
    judgeTime(param) {
      if (param == null || param === undefined || param === '') {
        return
      }
      if (param === 1) {
        return '日落时间'
      } else {
        return '日出时间'
      }
    }
  },
  props: {
    'drawer': {
      type: Object,
      default: null
    },
    'loaddata': {
      type: Function,
      default: null
    },
    'params': {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rtuList: [],
      loops: [],
      projectList: [],
      actiontype: '',
      checkedType: '',
      changeFlag: false,
      sizeForm: {
        uname: '',
        rtutype: '',
        bdate: '',
        edate: '',
        remarks: ''
      },
      tableData: {
        params: {
          uname: '',
          rtutype: '',
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: false,
        dataList: []
      }
    }
  },
  created() {
    this.getPolicyByStationId()
  },
  methods: {
    getPolicyByStationId() {
      this.$axios.get('/acloud-lighting/stationsetlist/findByStation?stationId=' + this.params.autoId).then(res => {
        if (res.data.code === 20000) {
          this.sizeForm.uname = res.data.data.stationSetList.uname
          this.sizeForm.rtutype = res.data.data.stationSetList.userdiskid === 'E43EC3CB-EB15-4429-9BF8-94BA92E08403' ? '普通策略' : '经纬度策略'
          this.sizeForm.remarks = res.data.data.stationSetList.remarks
          this.tableData.dataList = res.data.data.stationSetTailList
        } else {
          this.$message.error('查询失败,该站点未关联策略。')
          return
        }
      }).catch(() => {
        this.$message.error('服务器繁忙。')
      })
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
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      } else {
        return ''
      }
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    reset() {
      this.sizeForm.rtutype = null
      this.sizeForm.uname = null
      this.sizeForm.remarks = null
      this.tableData.dataList = []
      this.$refs.form.resetFields()
    }
  }
}
</script>
