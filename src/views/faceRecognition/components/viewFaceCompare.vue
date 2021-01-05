<template>
  <div class="app-container">
    <!---------------------------------------------表格------------------------------------------------------------------->
    <el-button type="primary" @click="handleDownload()">导出</el-button>
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
     
      <el-table-column show-overflow-tooltip prop="gender" label="性别" sortable :formatter="formategender" />
      <el-table-column show-overflow-tooltip prop="age" label="年龄" sortable />
      <!-- <el-table-column show-overflow-tooltip prop="imgUrl" label="图片路径" /> -->
      <el-table-column show-overflow-tooltip prop="imgUrl" label="预览">
        <template slot-scope="scope">
          <img v-image-preview v-bind:src="geturl(scope.row.imgUrl)"  min-width="50" height="50">
        </template>
      </el-table-column>
       <el-table-column show-overflow-tooltip prop="similar" label="匹配结果" :formatter="valueformat" sortable />
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

  </div>
</template>
<script>
import dateTool from '@/utils/date-tool'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
import Vue from 'vue'
import { mapGetters } from "vuex";
Vue.use(VueDirectiveImagePreviewer)
export default {
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
      fileImgUrl: process.env.VUE_APP_FILE_URI,
      viewFaceCompare1: this.$refs,
      editParams: '',
      tableChecked: [],
      viewparams: '',
      tableData: {
        params: {
          fName: '',
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: true
      }
    }
  },
  created() {
    this.getTableData()
  },
    computed: {
    ...mapGetters(["token"]),
  },
  // 查询分页信息
  methods: {
     geturl(id) {
      var s = this.fileImgUrl + id + "&access_token=" + this.token;
      return s;
    },
    getTableData() {
      this.tableData.listLoading = true
      this.$axios.post('/acloud-file/faceTask/findOne?autoId=' + this.params.autoId).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = JSON.parse(res.data.data.searchresult)
          this.tableData.total = res.data.data.length
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
    formategender(row, column, cellValue) {
      switch (parseInt(cellValue)) {
        case 0:
          return '男'
        case 1:
          return '女'
      }
    },
    valueformat(row, column, cellValue) {

      return parseFloat(cellValue*100).toFixed(2)+'%';
    },
    
    queryAll() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.tableData.params.currentPage = 1
          this.getTableData()
        }
      })
    },
    // 重置
    resetQuery() {
      this.tableData.params.fName = null
      this.$refs.paramForm.resetFields()
      this.tableData.params.ccurrentPageurrentPage = 1
      this.tableData.params.pageSize = 10
      this.getTableData()
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 3 && row.row.status === 2) {
        return 'color: #009578;'
      } else if (row.columnIndex === 3 && row.row.status === 0) {
        return 'color: red;'
      } else if (row.columnIndex === 3 && row.row.status === 1) {
        return 'color: orange;'
      }
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
        if (rowIndex == 0) { // eslint-disable-line
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
    },
    edit(row) {
      this.editParams = row
      this.editdrawer = true
    },
    faceCompare() {
      this.drawer = true
    },
    viewDetail(row) {
      this.drawer = true
      this.viewparams = row
    },
    formateStatus(cellValue) {
      switch (parseInt(cellValue.status)) {
        case 0:
          return '未开始'
        case 1:
          return '正在计算'
        case 2:
          return '结束'
      }
    },
    handleDownload() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/utils/Export2Excel')
        const tHader = ['皮配值', '性别', '年龄', '图片路径']
        const filterVal = ['similar', 'gender', 'age', 'imgUrl']
        const list = this.tableData.dataList
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHader, data, '比对列表')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
<style scoped lang="scss">
  /deep/.el-table .success-row{
    background:rgb(228, 228, 228);
  }
  /deep/.el-dialog__close.el-icon.el-icon-close{
    color:black
  }
  .parent{
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }

  .child{
    display: inline-block;
  }
</style>
