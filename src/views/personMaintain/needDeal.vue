<template>
  <div class="app-container">
    <div>
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="addHandleDeal">新增待办</el-button>
          <el-button type="primary" @click="handleDeal">处理待办</el-button>
        </el-col>
        <el-col :span="8">
          <el-input v-model="searchKey" />
        </el-col>
        <el-col :span="4" style="padding-left: 10px;">
          <el-button type="primary" @click="queryTable">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
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
          <el-table-column show-overflow-tooltip prop="approveInfo" label="审批信息" />
          <el-table-column show-overflow-tooltip min-width="40" prop="createName" label="创建人" />
          <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" />
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
        title="处理信息"
        size="50%"
        :visible.sync="drawer"
        :destroy-on-close="true"
      >

        <el-form ref="form" :rules="model.rules" :model="entityObj" label-width="100px">
          <!-- <el-form-item label="审批:" prop="state" class="form-item" :rules="model.rules.state">
             <el-radio-group v-model="entityObj.state">
                 <el-radio :label="3">通过</el-radio>
                 <el-radio :label="2">不通过</el-radio>
               </el-radio-group>
          </el-form-item> -->
          <el-form-item label="处理信息" class="form-item" :rules="model.rules.approveInfo">
            <el-input v-model="entityObj.dealInfo" type="textarea" placeholder="请输入处理意见" />
          </el-form-item>
        </el-form>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="closehandle()">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="handleConfirm()">提交</el-button>
      </el-drawer>
    </div>

    <div>
      <el-drawer
        title="新增待办"
        size="50%"
        :visible.sync="drawerAdd"
        :destroy-on-close="true"
      >

        <el-form ref="form" :rules="modelAdd.rules" :model="entityObjAdd" label-width="100px">

          <el-form-item label="选择报警:" class="form-item" :rules="modelAdd.rules.parentid">
            <el-input v-model="entityObjAdd.parentid" placeholder="请输入报警" @click.native="selectAlert" />
          </el-form-item>

          <el-form-item label="处理人:" class="form-item" :rules="modelAdd.rules.dealPersonId">
            <el-select v-model="entityObjAdd.dealPersonId" placeholder="请选择">
              <el-option v-for="item in personList" :key="item.autoId" :label="item.name +' '+item.phoneNum" :value="item.autoId" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-drawer
          title="新增待办"
          size="50%"
          :visible.sync="drawerchild"
          :append-to-body="true"
          :model-append-to-body="false"
          :destroy-on-close="true"
        >
          <AlertChild @getAlert="getAlert" />
        </el-drawer>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="closeDeal()">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
      </el-drawer>
    </div>

  </div>
</template>

<script>
import { getObjectEntity, auditPass, addObjectEntity } from '@/views/personMaintain/needDeal.js'
import AlertChild from '@/views/personMaintain/AlertChild.vue'
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
export default {
  components: {
    AlertChild
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
      drawerAdd: false,
      drawerchild: false,
      drawer: false,
      searchKey: '',
      selectList: [],
      entityObj: {},
      entityObjAdd: {},
      personList: [],
      model: {
        rules: {
          approveInfo: [
            { required: true, message: '请输入处理信息。', trigger: 'blur' }
          ]
        }
      },
      modelAdd: {
        rules: {
          parentid: [
            { required: true, message: '请选择相关报警。', trigger: 'blur' }
          ],
          dealPersonId: [
            { required: true, message: '请选择处理人员。', trigger: 'blur' }
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
    this.getPerson()
	  },
  methods: {
    queryTable() {
      var req = {
        dealInfo: this.searchKey,
        createId: Vue.getAcloudProvider().getUserInfo().id
      }
      getObjectEntity(this.tableData.params.currentPage, this.tableData.params.pageSize, req).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        }
      })
    },
    getPerson() {
      this.$axios.get('/acloud-lighting/person/getAll').then(res => {
        if (res.data.code === 20000) {
          this.personList = res.data.data
        }
      })
    },
    reset() {
      this.searchKey = ''
      this.tableData.params.currentPage = 1
      this.tableData.params.pageSize = 10
      this.queryTable()
    },
    getAlert(rowInfo) {
      console.log(rowInfo)
      this.entityObjAdd.alertId = rowInfo.stationAlert.autoid
      this.entityObjAdd.parentid = rowInfo.stationAlert.parentid
      this.drawerchild = false
    },
    addHandleDeal() {
      this.drawerAdd = true
    },
    selectAlert() {
      this.drawerchild = true
    },
    handleDeal() {
      if (this.selectList.length != 1) {
        this.$message.error('请只选择一行数据')
        return
      }
      if (this.selectList[0].createId == Vue.getAcloudProvider().getUserInfo().id) {
        this.$message.error('创建人无权限处理此项')
        return
      }
      if (this.selectList[0].state != 0 && this.selectList[0].state != 2) {
        this.$message.error('此状态下不能处理！')
        return
      }
      this.drawer = true
      this.entityObj = { ...this.selectList[0] }
    },
    closeDeal() {
      this.drawerAdd = false
    },
    closehandle() {
      this.drawer = false
    },
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          var req = {
            alertId: this.entityObjAdd.alertId,
            dealPersonId: this.entityObjAdd.dealPersonId,
            createId: Vue.getAcloudProvider().getUserInfo().id
          }
          addObjectEntity(req).then(res => {
            if (res.data.code == 20000) {
              this.$message.success(res.data.message)
              this.drawerAdd = false
              this.queryTable()
            } else {
              this.$message.error(res.data.message || '添加失败')
            }
          })
        }
      })
    },

    handleConfirm() {
      this.$refs.form.validate(v => {
        if (v) {
          this.entityObj.state = 1
          delete this.entityObj.username
          auditPass(this.entityObj).then(res => {
            if (res.data.code === 20000) {
              this.$message.success(res.data.message)
              this.drawer = false
              this.queryTable()
            } else {
              this.$message.error(res.data.message || '修改失败')
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
