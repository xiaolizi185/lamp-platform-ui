<template>
  <div class="app-container">
    <!--------------------------------------------------搜索栏--------------------------------------------------------------->
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
          <el-form-item>
            <el-button type="primary" @click="drawer=true" style="background-color: #53c5a1;border-color: #53c5a1">添加策略</el-button>
            <el-button type="primary" @click="deletePolicy" style="background-color: #f0bc34;border-color: #f0bc34">删除</el-button>
            <!-- <el-button type="primary" @click="resumedrawer=true" style="background-color: #f48a60;border-color: #f48a60">恢复</el-button> -->
          </el-form-item>
          <el-form-item prop="uname" label="策略名称" style="font-family: 宋体">
            <el-input v-model="tableData.params.uname" :maxlength="20" placeholder="请输入策略名称进行检索" clearable style="width:250px;" />
          </el-form-item>
          <!--<el-form-item prop="rtutype" class="form-item" label="策略类型:" style="font-family: 宋体">
            <el-select v-model="tableData.params.rtutype" placeholder="请选择策略类型" clearable>
              <el-option v-for="item in rtuList" :key="item.value" :label="item.lable" :value="item.value" />
            </el-select>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="queryAll()">查询</el-button>
            <el-button type="primary" style="margin-top:3px" @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
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
      <el-table-column show-overflow-tooltip prop="uname" label="策略名称" sortable />
      <el-table-column show-overflow-tooltip prop="projname" label="所属项目" sortable />
f     <el-table-column show-overflow-tooltip prop="userdiskname" label="策略类型" />
<!--      <el-table-column show-overflow-tooltip prop="bdate" label="开始时间" :formatter="formatCreateDate" />
      <el-table-column show-overflow-tooltip prop="edate" label="结束时间" :formatter="formatCreateDate" />-->
      <el-table-column show-overflow-tooltip prop="cName" label="操作人" />
      <!--<el-table-column show-overflow-tooltip prop="buse" label="可用状态">
        <template slot-scope="scope">
          <div v-if="scope.row.buse == false">
            <el-badge is-dot style="right: 2px; margin-top: 5px;">
              <div>不可用</div>
            </el-badge>
          </div>
          <div v-if="scope.row.buse == true">
            <el-badge is-dot type="success" style="right: 2px; margin-top: 5px;">
              <div>可用</div>
            </el-badge>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column show-overflow-tooltip label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
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
    <!--------------------------------------------------添加策略----------------------------------------------->
    <el-drawer
      v-if="drawer"
      ref="drawerPolicy"
      title="添加策略"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="drawer"
      size="50%"
      :before-close="handleClose"
      destroy-on-close="true"
      :modal="false"
    >
      <add-policy :drawer1="policydrawer" :loaddata="getTableData" />
    </el-drawer>
    <!-----------------------------------------------恢复策略---------------------------------------------------->
    <el-drawer
      v-if="resumedrawer"
      ref="resumePolicyDrawer1"
      title="恢复策略"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="resumedrawer"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <resume-policy :drawer="resumePolicyDrawer" :loaddata="getTableData" />
    </el-drawer>
    <!-----------------------------------------------修改策略---------------------------------------------------->
    <el-drawer
      v-if="editdrawer"
      ref="resumePolicyDrawer1"
      title="修改策略"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="editdrawer"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
      :modal="false"
    >
      <editPolicy :drawer1="editPolicyDrawer" :editParams="editParams" :loaddata="getTableData" />
    </el-drawer>
  </div>
</template>
<script>
import dateTool from '@/utils/date-tool'
import aTool from '@acloud/acloud-atool-js'
import addPolicy from './components/addPolicy'
import resumePolicy from './components/resumePolicy'
import editPolicy from './components/editPolicy'
import Vue from 'vue'

const paramFormRules = {
  uname: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: { addPolicy, resumePolicy, editPolicy },
  data() {
    return {
      rtuList: [],
      drawer: false,
      policydrawer: this.$refs,
      resumedrawer: false,
      resumePolicyDrawer: this.$refs,
      editPolicyDrawer: this.$refs,
      editdrawer: false,
      editParams: '',
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
        dataList: [],
        paramFormRules
      }
    }
  },
  created() {
    this.getTableData()
    this.getRtuTypeList()
  },
  // 查询分页信息
  methods: {
    getTableData() {
      const params = {
        'uname': this.tableData.params.uname,
        'delstate': 1,
        'rtutype': this.tableData.params.rtutype,
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
    selsChange(val) {
      this.tableChecked = val
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
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
      this.tableData.params.uname = null
      this.$refs.paramForm.resetFields()
      this.tableData.params.ccurrentPageurrentPage = 1
      this.tableData.params.pageSize = 10
      this.getTableData()
    },
    getRtuTypeList() {
      this.$axios.get('/acloud-lighting/userdisk/findAll').then(res => {
        if (res.data.code === 20000) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].itemtype === 'Rtu策略类型') {
              this.rtuList.push({
                'value': res.data.data[i].ucode,
                'lable': res.data.data[i].uname
              })
            }
          }
        } else {
          this.rtuList = []
          return
        }
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
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
    deletePolicy() {
      let delParams = ''
      // 删除
      if (this.tableChecked.length === 0) {
        this.$message.error('请选择删除数据。')
        return
      } else {
        for (let i = 0; i < this.tableChecked.length; i++) {
          if (this.tableChecked.length === 1) {
            delParams = this.tableChecked[i].autoid
          } else {
            delParams += this.tableChecked[i].autoid + ','
            const last = this.tableChecked[this.tableChecked.length - 1]
            if (last === this.tableChecked.length) {
              delParams = delParams.Substring(0, delParams.length - 1)
            }
          }
        }
        this.$axios.post('/acloud-lighting/stationsetlistweb/delete?autoId=' + delParams).then(res => {
          if (res.data.code === 20000) {
            this.$message.success('删除成功。')
            this.getTableData()
          } else {
            this.$message.error(res.data.message)
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      }
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
</style>
