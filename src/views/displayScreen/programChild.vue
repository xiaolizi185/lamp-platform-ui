<template>
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
    >
      <el-table-column label="序号" width="50" type="index" :index="indexMethod" />
      <el-table-column show-overflow-tooltip prop="name" label="文件名" sortable />
      <el-table-column show-overflow-tooltip prop="type" label="文件类型" sortable>
        <template slot-scope="scope">
          {{ scope.row.type | judgeType }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="预览">
        <template slot-scope="scope">
          <img v-if="scope.row.type == 2" v-bind:src="geturl(scope.row.url)" min-width="50" height="50">
          <video v-if="scope.row.type == 3" v-bind:src="geturl(scope.row.url)" min-width="50" height="50" />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="filesize" label="文件大小(字节)" />
      <el-table-column show-overflow-tooltip prop="createTime" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="select(scope.row)">选择</el-button>
        </template>
      </el-table-column>
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
import { getSysledmaterial } from '@/views/displayScreen/sysledmaterial.js'
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
import { mapGetters } from 'vuex'
export default {
  components: {

  },
  filters: {
    judgeType(param) {
      if (param == undefined || param == null || param == '') {
        return
      }
      if (param == 1) {
        return '文本'
      } else if (param == 2) {
        return '图片'
      } else if (param == 3) {
        return '视频'
      } else {
        return '其他'
      }
    }
  },
  data() {
    return {
      fileImgUrl: process.env.VUE_APP_FILE_URI,
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: false,
        dataList: []
      }
	  }
  },
  computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    },
    ...mapGetters([
      'token'
    ])
  },
  created() {
    this.queryTable()
	  },
  methods: {
     geturl(id){
      var s=this.fileImgUrl+id+'&access_token='+this.token
      return s
    },
    queryTable() {
      var tempObj = {
        delState: true,
        'name': this.searchName
      }
      getSysledmaterial(tempObj, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code == 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        }
      })
    },
    select(row) {
      this.$emit('materialInfo', row)
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
      this.tableData.currentPage = 1
      this.queryTable()
    },
    handleCurrentChange(val) {
      this.pagtation.currentPage = val
      this.queryTable()
    }
  }
}
</script>

<style scoped>

</style>
