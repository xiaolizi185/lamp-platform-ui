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
          <!-- <el-form-item prop="uname" label="搜索" style="font-family: 宋体">
            <el-input v-model="searchObj.parentid" :maxlength="20" placeholder="请输入关键词进行检索" clearable style="width:250px;" />
          </el-form-item> -->
          <el-form-item>
            <!-- <el-button type="primary" @click="query()">查询</el-button> -->
            <!-- <el-button type="primary" style="margin-top:3px" @click="resetQuery()">重置</el-button>
            <el-button type="primary" style="margin-top:3px" @click="sendMessage()">发送短信</el-button> -->
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
        <el-table-column show-overflow-tooltip min-width="100" prop="led_SN" width="150" label="序列号" sortable />
        <el-table-column show-overflow-tooltip min-width="100" prop="commandContent" label="命令内容" sortable />
        <el-table-column show-overflow-tooltip min-width="100" prop="commandName"  label="命令名称" />
        <!-- <el-table-column show-overflow-tooltip prop="cName" label="操作人" /> -->
        <el-table-column show-overflow-tooltip prop="createTime" label="操作时间" />
        <el-table-column show-overflow-tooltip prop="errorCode" :formatter="formaterr" label="错误码" />
        <!-- <el-table-column show-overflow-tooltip prop="remarks" label="备注" /> -->
       

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
// import {getStationAndAlert} from '../api/smartLighting.js'
import Vue from 'vue'
const paramFormRules = {
  uname: [{
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
          uname: '',
          rtutype: '',
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: true,
        dataList: [],
        paramFormRules
      },
      paramFormRules: paramFormRules,
      searchObj: {},
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
    formaterr(row, column, cellValue)  
    {
      if(cellValue===0)return '失败'
      else if(cellValue===4)return '成功'
    },

    query() {
      this.getTableData()
    },
    resetQuery() {
      this.searchObj = {}
      this.getTableData()
    },

    getTableData() {
      const params = {
        'fDelState': true,
        'createId':Vue.getAcloudProvider().getUserInfo().id
      }
      this.$axios.get('/acloud-display/ledLog/getLedLog?page=' + this.tableData.params.currentPage +
          '&size=' + this.tableData.params.pageSize,).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        } else {
          console.log(res.data.message)
          this.$message.error(res.data.message || '查询失败')
          this.tableData.listLoading = false
          this.tableData.dataList = []
          return
        }
      })
    },
    // sendMessage() {
    //   if (this.selectList.length == 0) {
    //     this.$message.error('请选中选项')
    //     return
    //   }
    //   this.$axios.post('/acloud-lighting/stationAlert/sendMessage', this.selectList).then(res => {
    //     if (res.data.code === 20000) {
    //       this.$message.success(res.data.message)
    //     } else {
    //       this.$message.error(res.data.message | '删除失败')
    //     }
    //   })
    // },
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
