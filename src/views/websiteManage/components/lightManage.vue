<template>
  <div class="app-container">
    <div name="buttonGroup">
      <el-row>
        <el-col :span="10">
          <el-input v-model="searchKey" :maxlength="200" clearable placeholder="请输入搜索条件" />
        </el-col>
        <el-col :span="2" style="padding-left:5px ;">
          <el-button type="primary" @click="search">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
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
        >
          <el-table-column label="序号" width="50" type="index" :index="indexMethod" />
          <el-table-column type="selection" width="50" />
          <el-table-column show-overflow-tooltip prop="fName" label="设备名称" sortable />
          <el-table-column show-overflow-tooltip prop="fSerial" label="序列号" />
          <el-table-column show-overflow-tooltip prop="validatecode" label="验证码" />
          <el-table-column show-overflow-tooltip prop="fDeviceaccount" label="设备账号" />
          <el-table-column show-overflow-tooltip prop="fDevicepass" label="设备密码" />
          <el-table-column show-overflow-tooltip prop="devicestatus" label="设备状态" />
          <el-table-column show-overflow-tooltip prop="livestatus" label="直播状态" />
          <el-table-column show-overflow-tooltip label="分配">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.flag"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="matchChange(scope.row)"
              />
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
      </el-row>
    </div>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
export default {
  components: {
  },
  filters: {

  },
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
      innerMapDrawer1: this.$refs,
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: true,
        dataList: []
      },
      selectList: [],
      searchKey: '',
      videoHkInfo: {},
      drawerObj: {
        drwTitle: '',
        drawer: false
      }
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
    getTableData() {
      this.$axios.get('/acloud-lighting/VideoHkInfo/getHkInfoCameraRef?page=' +
        this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize +
        '&stationId=' + this.drawer.autoid + '&keyWord=' + this.searchKey).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
        }
      })
    },
    matchChange(row) {
      var that = this
      if (row.flag) {
        var req = {
          stationId: this.drawer.autoid,
          cameraId: row.fId,
          fCreateId: Vue.getAcloudProvider().getUserInfo().id
        }
        this.$axios.post('/acloud-lighting/StationCamera/addStationCamera', req).then(res => {
          if (res.data.code === 20000) {
            this.$message.success(res.data.message)
            that.getTableData()
          } else {
            this.$message.error(res.data.message || '分配失败')
          }
        })
      } else {
        var req = {
          stationId: this.drawer.autoid,
          cameraId: row.fId
        }
        this.$axios.post('/acloud-lighting/StationCamera/deleteStationCamera', req).then(res => {
          if (res.data.code === 20000) {
            this.$message.success(res.data.message)
            that.getTableData()
          } else {
            this.$message.error(res.data.message || '分配失败')
          }
        })
      }
    },
    search() {
      this.getTableData()
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
