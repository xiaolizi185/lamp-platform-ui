<template>
  <div class="app-container">
    <div>
      <el-row>
        <el-col :span="12" />
        <el-col :span="8">
          <el-input v-model="searchKey" />
        </el-col>
        <el-col :span="4" style="padding-left: 10px;">
          <el-button type="primary" @click="queryTable">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <el-button-group>
        <!-- <el-button type="primary" @click="">新增</el-button>
          <el-button type="primary" @click="deleteMulti">删除</el-button>
          <el-button type="primary" @click="reset">重置</el-button> -->
      </el-button-group>

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
          @selection-change="selsChange"
        >
          <el-table-column label="序号" width="50" type="index" :index="indexMethod" />
          <el-table-column type="selection" width="50" />
          <el-table-column show-overflow-tooltip min-width="100" prop="alertContent" label="报警内容" sortable />
          <el-table-column show-overflow-tooltip min-width="100" prop="dealInfo" label="处理信息" sortable />
          <el-table-column show-overflow-tooltip min-width="40" prop="dealName" label="处理人" />
          <!-- <el-table-column show-overflow-tooltip prop="msgState" label="短信状态">
            <template slot-scope="scope">
              {{ scope.row.msgState | msgStateJudge }}
            </template>
          </el-table-column> -->
          <el-table-column show-overflow-tooltip prop="state" label="待办状态">
            <template slot-scope="scope">
              {{ scope.row.state | stateJudge }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="40" prop="createName" label="创建人" />
          <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" />
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="passAudit(scope.row)">审核</el-button>
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
          layout="total,sizes,prev,pager,next"
          style="float: right;margin-top:10px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </div>

    <div>
      <el-drawer
        title="新增待办"
        size="50%"
        :visible.sync="drawer"
        :destroy-on-close="true"
      >

        <el-form ref="form" :rules="model.rules" :model="entityObj" label-width="100px">
          <el-form-item label="审批:" prop="state" class="form-item" :rules="model.rules.state">
            <el-radio-group v-model="entityObj.state">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="2">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审批意见" class="form-item">
            <el-input v-model="entityObj.approveInfo" type="textarea" placeholder="请输入审批意见" />
          </el-form-item>
        </el-form>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="drawer=false">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
      </el-drawer>
    </div>

  </div>
</template>

<script>
import { getObjectEntity, auditPass } from '@/views/personMaintain/needDeal.js'
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
export default {
  components: {

  },
  filters: {
    msgStateJudge(param) {
      if (param === undefined || param === null || param === '') {
        return
      }
      if (param === 0) {
        return '未发送'
      } else {
        return '已发送'
      }
    },
    stateJudge(param) {
      if (param === undefined || param === null || param === '') {
        return
      }
      var temp = ''
      switch (param) {
        case 0:
          temp = '未处理'
          break
        case 1:
          temp = '处理完毕提交审核'
          break
        case 2:
          temp = '审核未通过'
          break
        case 3:
          temp = '结束'
          break
        default:
          break
      }
      return temp
    }
  },
  data() {
    return {
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
      searchKey: '',
      selectList: [],
      entityObj: {},
      tempObj: {},
      drawer: false,
      model: {
        rules: {
          state: [
            { required: true, message: '请选择是否通过。', trigger: 'blur' }
          ]
        }
      }
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
    queryTable() {
      var req = {
        dealinfo: this.searchKey,
        state: 1,
        approveId: Vue.getAcloudProvider().getUserInfo().id
      }
      getObjectEntity(this.tableData.params.currentPage, this.tableData.params.pageSize, req).then(res => {
        if (res.data.code == 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        }
      })
    },
    reset() {
      this.searchKey = ''
      this.tableData.params.currentPage = 1
      this.tableData.params.pageSize = 10
      this.queryTable()
    },
    passAudit(row) {
      this.tempObj = { ...row }
      this.drawer = true
    },
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          this.tempObj.state = this.entityObj.state
          this.tempObj.approveInfo = this.entityObj.approveInfo
          auditPass(this.tempObj).then(res => {
            if (res.data.code === 20000) {
              this.$message.success(res.data.message)
              this.queryTable()
              this.drawer = false
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    indexMethod(index) {
      return this.xuhao + index + 1
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
    selsChange(val) {
      this.selectList = val
    },
    selectMap() {
      this.innerDrawer = true
    },
    indexMethod(index) {
      return this.xuhao + index + 1
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
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
