<template>
  <div class="app-container">
    <div name="buttonGroup">
      <el-row>
        <el-col :span="10">
          <el-button-group>

            <el-button type="primary" @click="passAudit()">审核</el-button>
            <!--
            <el-button type="primary" >同步设备</el-button>
            <el-button type="primary" icon="el-icon-refresh-right">同步视频</el-button> -->
            <!-- <el-button type="primary" >...更多</el-button> -->
          </el-button-group>
        </el-col>
        <el-col :span="10">
          <el-input v-model="searchName" :maxlength="200" clearable placeholder="请输入搜索条件" />
        </el-col>
        <el-col :span="4" style="padding-left:5px ;">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="reset()">重置</el-button>
        </el-col>
      </el-row>
    </div>
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
        @selection-change="selsChange"
      >
        <el-table-column label="序号" width="50" type="index" :index="indexMethod" />
        <el-table-column type="selection" width="50" />
        <el-table-column show-overflow-tooltip prop="name" label="文件名" sortable />
        <el-table-column show-overflow-tooltip prop="type" label="文件类型" sortable>
          <template slot-scope="scope">
            {{ scope.row.type | judgeType }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ip" label="预览">
          <template slot-scope="scope">
            <img v-if="scope.row.type == 2" v-image-preview :src="fileImgUrl +'/'+scope.row.url" min-width="50" height="50">
            <div v-if="scope.row.type == 3"> <video :src="fileImgUrl +'/'+scope.row.url" min-width="50" height="50" /></div>
          </template>
        </el-table-column>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="filesize" label="文件大小(字节)" />
        <el-table-column show-overflow-tooltip prop="videltime" label="时长" />
        <el-table-column show-overflow-tooltip prop="createId" label="创建人" />
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" />
        <el-table-column show-overflow-tooltip prop="createTime" label="审核状态">
          <template slot-scope="scope">
            {{ scope.row.audit ? "已审核" : "未审核" }}
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
  </div>
</template>

<script>
import {
  addFile,
  getSysledmaterial,
  deletesysLeddevice,
  audit
} from '@/views/displayScreen/sysledmaterial.js'
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
Vue.use(VueDirectiveImagePreviewer)
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
      fileApi: process.env.VUE_APP_BASE_API,
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: false,
        dataList: []
      },
      searchName: '',
      selectList: [],
      sysLeddevice: {},
      fileList1: [],
      fileList2: [],
      fileList3: []
    }
  },
  computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    }
  },
  created() {
    this.queryTable()
  },
  methods: {
    search() {
      this.queryTable()
    },
    queryTable() {
      var tempObj = {
        delState: true,
        'name': this.searchName
      }
      getSysledmaterial(tempObj, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code == 20000) {
          this.tableData.dataList = res.data.data.rows
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        }
      })
    },
    passAudit() {
      if (this.selectList.length == 0) {
        this.$message.error('请选择一项或者多项')
        return
      }
      var tempList = []
      for (let i = 0; i < this.selectList.length; i++) {
        tempList.push(this.selectList[i].id)
      }
      audit(tempList).then(res => {

      })
    },
    handleCommand(command) {
      if (command == 'text') {

      } else if (command == 'picture') {

      } else if (command == 'video') {

      }
    },
    handleChangeText(file, fileList) {

    },
    add() {
      this.sysLeddevice = {}
      this.drwTitle = '设备添加'
      this.drawer = true
      this.excuteStatus = 'add'
    },
    update() {
      console.log('hhhh')
      if (this.selectList.length != 1) {
        this.$message.error('请只选中一行来操作')
        return
      }
      this.drwTitle = '设备修改'
      this.drawer = true
      this.excuteStatus = 'update'
      this.sysLeddevice = { ...this.selectList[0] }
    },
    deleteMulti() {
      var deleteStr = ''
      for (let i = 0; i < this.selectList.length; i++) {
        deleteStr += this.selectList[i].id + ','
      }
      deleteStr = deleteStr.substring(0, deleteStr.length - 1)
      deletesysLeddevice(deleteStr).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.drawer = false
          this.queryTable()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
    },
    // 表格颜色
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
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {})
    },
    selsChange(val) {
      this.selectList = val
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
