<template>
  <div class="app-container">
    <el-row>
      <el-col class="table-content">
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
          <el-form-item prop="parentid" label="编号" style="font-family: 宋体">
            <el-input v-model="tableData.params.parentid" :maxlength="20" placeholder="请输入关键词进行检索" clearable style="width:250px;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query()">查询</el-button>
            <el-button type="primary" style="margin-top:3px" @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
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
        <el-table-column label="序号" width="50" type="index" :index="indexMethod" />
        <el-table-column type="selection" width="50" />
        <el-table-column show-overflow-tooltip min-width="100" prop="parentid" label="设备编号" sortable />
        <el-table-column show-overflow-tooltip min-width="100" prop="cmdtype" label="执行命令类型" sortable :formatter="formatType" />
        <el-table-column show-overflow-tooltip min-width="100" prop="content" label="内容" :formatter="formatContent" />
        <el-table-column show-overflow-tooltip prop="createtime" label="创建时间" />
        <el-table-column show-overflow-tooltip prop="addinfo1" label="状态" :formatter="formatState" />
        <el-table-column show-overflow-tooltip prop="taskdes" label="任务描述" />
        <el-table-column show-overflow-tooltip prop="errmsg" label="错误信息" />

      </el-table>
      <el-pagination
        v-show="tableData.total > 0"
        background
        :total="tableData.total"
        :current-page="tableData.params.currentPage"
        :page-sizes="[10,20,30,40,50]"
        :page-size="tableData.params.pageSize"
        layout="total,sizes,prev,pager,next"
        style="float: right;margin-top:10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
const paramFormRules = {
  parentid: [{
    pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
    message: '不能输入特殊字符。',
    trigger: 'change'
  }]
}
export default {
  components: {

  },
  filters: {

  },
  data() {
    return {
      searchKey: '',
      stationAlert: {

      },
      tableData: {
        params: {
          parentid: '',
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: true,
        dataList: [],
        paramFormRules
      },
      selectList: []
    }
  },
  computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    query() {
      this.getTableData()
    },
    resetQuery() {
      this.tableData.params.parentid= ''
      this.getTableData()
    },
    formatType(row, column, cellValue) {
      if (cellValue === 1) {
        return '策略'
      } else if (cellValue === 2) {
        return '临时任务'
      } else if (cellValue === 3) {
        return '报警信息'
      } else {
        return '短信'
      }
    },
    getTableData() {
      const params = {
        'parentid': this.tableData.params.parentid
      }
      this.$axios.post('acloud-lighting/record/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
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
      })
    },
    sendMessage() {
      if (this.selectList.length === 0) {
        this.$message.error('请选中选项')
        return
      }
      this.$axios.post('/acloud-lighting/stationAlert/sendMessage', this.selectList).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message | '删除失败')
        }
      })
    },
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
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
    },
    selsChange(val) {
      this.selectList = []
      if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          this.selectList.push(val[i])
        }
      }
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    formatContent(row, column, cellValue) {
      if (cellValue === 'orderKind:8') {
        return '查询控制器运行数据'
      } else if (cellValue === 'orderKind:12') {
        return '设置定时计划'
      } else {
        return '手动控制'
      }
    },
    formatState(row, column, cellValue) {
      if (cellValue === '0') {
        return '失败'
      } else if (cellValue === '1') {
        return '已创建'
      } else if (cellValue === '2') {
        return '已下发'
      } else {
        return '成功执行'
      }
    },
    indexMethod(index) {
      return this.xuhao + index + 1
    },
    handleSizeChange(val) {
      this.tableData.params.pageSize = val
      this.tableData.currentPage = 1
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val
      this.getTableData()
    }
  }
}
</script>

<style scoped>

</style>
