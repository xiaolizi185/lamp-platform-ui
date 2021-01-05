<template>
  <div class="app-container">
    <div name="buttonGroup">
      <el-row>
        <el-col :span="12">
            <el-button type="primary" @click="add()">新增</el-button>
            <el-button type="primary" @click="deleteMulti()">删除</el-button>
            <el-button type="primary" @click="reset()">重置</el-button>
            <!--
            <el-button type="primary" >同步设备</el-button>
            <el-button type="primary" icon="el-icon-refresh-right">同步视频</el-button> -->
            <!-- <el-button type="primary" >...更多</el-button> -->
        </el-col>
        <el-col :span="10">
          <el-input v-model="searchKey" :maxlength="200" clearable placeholder="请输入搜索条件" />
        </el-col>
        <el-col :span="2" style="padding-left:5px ;">
          <el-button type="primary" @click="search">查询</el-button>
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
        <el-table-column show-overflow-tooltip prop="sysOneKey.fName" label="设备名称" sortable />
        <el-table-column show-overflow-tooltip prop="sysOneKey.fDevId" label="设备ID" sortable />
        <el-table-column show-overflow-tooltip prop="fName" label="所属项目" />
        <el-table-column show-overflow-tooltip prop="sysOneKey.fState" label="设备状态" />
        <el-table-column show-overflow-tooltip prop="sysOneKey.fDeviceTypeID" label="设备类型" />
        <el-table-column show-overflow-tooltip prop="sysOneKey.fRemarks" label="备注" />
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="update(scope.row)">修改</el-button>
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
    <div>
      <el-drawer
        :title="drwTitle"
        size="50%"
        :visible.sync="drawer"
        :destroy-on-close="true"
        :before-close="handleClose"
      >

        <el-form ref="form" :rules="model.rules" :model="sysOneKey" label-width="100px">
          <el-form-item v-show="excuteStatus != 'getToken'" label="设备编号:" prop="fDevId" class="form-item" :rules="model.rules.fDevId">
            <el-input v-model="sysOneKey.fDevId" :maxlength="16" clearable placeholder="请输入设备编号" />
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="设备名称:" prop="fName" class="form-item" :rules="model.rules.fName">
            <el-input v-model="sysOneKey.fName" :maxlength="16" clearable placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="项目:" prop="fProjectID" class="form-item" :rules="model.rules.fProjectID">
            <el-select v-model="sysOneKey.fProjectID" placeholder="请选择">
              <el-option
                v-for="item in projectList"
                :key="item.fID"
                :label="item.fName"
                :value="item.fID"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="备注:" prop="fRemarks" class="form-item" :rules="model.rules.fRemarks">
            <el-input
              v-model="sysOneKey.fRemarks"
              type="textarea"
              maxlength="200"
              show-word-limit
              clearable
              placeholder="请输入相关备注信息"
            />
          </el-form-item>
        </el-form>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="drawer=false">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { getSysOneKey, addSysOneKey, updateSysOneKey, deleteSysOneKey } from '@/views/sysOneKey/oneKeyEquip/sysOneKey.js'
import aTool from '@acloud/acloud-atool-js'
export default {
  components: {

  },
  filters: {

  },
  data() {
    return {
      searchKey: '',
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
      projectList: [],
      sysOneKey: {},
      excuteStatus: 'add',
      drwTitle: '新增呼叫设备',
      drawer: false,
      model: {
        rules: {
          fDevId: [
            { required: true, message: '请输入设备编号。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fName: [
            { required: true, message: '请输入设备名称。', trigger: 'change' },
            {
              required: true,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fProjectID: [
            { required: true, message: '请选择项目。', trigger: 'change' }
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
    search() {
      this.queryTable()
    },
    queryTable() {
      getSysOneKey(this.searchKey, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        }
      })
    },
    add() {
      this.sysOneKey = {}
      this.drwTitle = '呼叫设备添加'
      this.drawer = true
      this.excuteStatus = 'add'
    },
    update(row) {
      this.drwTitle = '视频账号修改'
      this.drawer = true
      this.excuteStatus = 'update'
      this.sysOneKey = { ...row.sysOneKey }
    },
    deleteMulti() {
      var deleteList = []
      for (let i = 0; i < this.selectList.length; i++) {
        deleteList.push(this.selectList[i].sysOneKey.autoId)
      }
      deleteSysOneKey(deleteList).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.drawer = false
          this.queryTable()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
    },
    reset() {},
    search() {},
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.excuteStatus === 'add') {
            addSysOneKey(this.sysOneKey).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '添加失败')
              }
            })
          } else if (this.excuteStatus === 'update') {
            updateSysOneKey(this.sysOneKey).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '修改失败')
              }
            })
          }
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
      this.tableData.params.currentPage = 1
      this.queryTable()
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val
      this.queryTable()
    }

  }
}
</script>

<style scoped>

</style>
