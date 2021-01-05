<template>
  <div class="app-container">
    <el-table
      v-loading="tableData.listLoading"
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
      <el-table-column show-overflow-tooltip prop="fName" label="名称" sortable />
      <el-table-column show-overflow-tooltip prop="fIp" label="IP地址" />
      <el-table-column show-overflow-tooltip prop="address" label="地址" />
      <el-table-column show-overflow-tooltip prop="fCreateTime" label="创建时间" />
      <el-table-column show-overflow-tooltip prop="flag" label="分配">
        <!-- <template slot-scope="scope">
          <el-button v-if="scope.row.lampId != editparams.fid" type="text" style="background-color: #dddddd;color:#fff" @click="dealOut(scope.row,false)">分配</el-button>
          <el-button v-if="scope.row.lampId === editparams.fid" type="text" style="background-color: #009578;color:#fff" @click="dealOut(scope.row,true)">分配</el-button>
        </template> -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.flag"
            active-color="#13ce66"
            inactive-color="#dddddd"
            :active-value="true"
            :inactive-value="false"
            @change="dealOut(scope.row)"
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
  </div>
</template>
<script>
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
export default {
  props: {
    'editparams': {
      type: Object,
      default: null
    },
    'loaddata': {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      tableChecked: [], // 被选中的记录数
      selecteTabelData: [], // 子组件传回来的数据
      loopSorts: '',
      selectedRtuType: '',
      rtuList: [],
      projectList: [],
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
      },
      active: 0,
      mapDrawer1: this.$refs,
      mapDrawer: false,
      dealFlag: false,
      model: {
        uname: '',
        projectid: '',
        rtutype: '',
        ucode: '',
        maplongitude: '',
        maplatitude: '',
        address: '',
        remarks: ''
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
        'lampId': this.editparams.fid,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      this.tableData.listLoading = true
      this.$axios.post('/acloud-display/ViewLedToLamp/getViewLedToLamp?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.rows
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
          this.loopSorts = res.data.data
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
    queryAll() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.tableData.params.currentPage = 1
          this.getTableData()
        }
      })
    },
    // 分配lampid
    dealOut(row) {
      if (row.flag === true) {
        this.$axios.post('/acloud-lighting/LampPoleEquipmentInfo/add?lampPoleId=' + this.editparams.fid + '&devId=' + row.fId).then(res => {
          if (res.data.code === 20000) {
            this.$message.success(res.data.message)
          //  this.getTableData()
          } else {
            this.$message.error(res.data.message || '关联失败')
            this.getTableData()
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      } else {
        this.$axios.post('/acloud-lighting/LampPoleEquipmentInfo/delete?id=' + row.fId).then(res => {
          if (res.data.code === 20000) {
            this.$message.success(res.data.message)
            // this.getTableData()
          } else {
            this.$message.error(res.data.message || '关联失败')
            this.getTableData()
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    },
    // 重置
    resetQuery() {
      this.tableData.params.uname = null
      this.$refs.paramForm.resetFields()
      this.tableData.params.ccurrentPageurrentPage = 1
      this.tableData.params.pageSize = 10
      this.getTableData()
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    tableRowClassName({ rowIndex }) {
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
    handleSizeChange(val) {
      this.tableData.params.pageSize = val
      this.tableData.currentPage = 1
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val
      this.getTableData()
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    changeRtuType(rtutype) {
      this.model.rtutype = rtutype
    },
    changeProject(projectId) {
      this.model.projectid = projectId
    },
    selectedTableData(selectedTableData) {
      this.selecteTabelData[0] = selectedTableData
    },
    formatState(row) {
      const str = row.loopstates
      if (str !== '' && str !== null) {
        if (str.indexOf('0') !== -1 && str.indexOf('1') !== -1 && str.indexOf('2') !== -1) {
          return '关闭,开启，故障'
        } else if (str.indexOf('0') !== -1 && str.indexOf('1') !== -1) {
          return '关闭,开启'
        } else if (str.indexOf('0') !== -1 && str.indexOf('2') !== -1) {
          return '关闭,故障'
        } else if (str.indexOf('1') !== -1 && str.indexOf('2') !== -1) {
          return '开启,故障'
        } else if (str.indexOf('1') !== -1) {
          return '开启'
        } else if (str.indexOf('0') !== -1) {
          return '关闭'
        } else if (str.indexOf('2') !== -1) {
          return '故障'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/.el-table .success-row{
    background:rgb(228, 228, 228);
  }
  .el-loading-mask {
    left:210px !important;
  }
  /deep/.el-dialog__close.el-icon.el-icon-close{
    color:black
  }
  /deep/.el-table .success-row{
    background:rgb(228, 228, 228);
  }
  .red-point{
    position: relative;
  }
  .red-point::before{
    content: "关闭 ";
    border: 5px solid red;/*设置红色*/
    border-radius:3px;/*设置圆角*/
    position: absolute;
    z-index: 1000;
    right: 0;
    margin-right: -8px;
  }
   div /deep/ .el-loading-spinner {
        margin-top:-35px;
  }
</style>
