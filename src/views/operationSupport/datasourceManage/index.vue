<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24">
        <el-input
          v-model="textarea1"
          prefix-icon="el-icon-info"
          size="large"
          clearable
          readonly
          style="border-color: #15aabf"
        />
      </el-col>
    </el-row>
    <el-row style="margin-top:10px">
      <el-col class="table-content">
        <el-form
          ref="paramForm"
          inline
          label-position="right"
          label-width="80px"
          class="query-form"
          :model="datasourceTableData.params"
          :rules="datasourceTableData.paramFormRules"
        >
          <el-form-item>
            <el-button type="primary" @click="addDrawer=true">添加数据源</el-button>
          </el-form-item>
          <!-- <el-form-item prop="databaseType">
            <el-select v-model="datasourceTableData.params.dbType" placeholder="请选择数据库类型" clearable>
              <el-option label="所有" value="0">所有</el-option>
              <el-option label="Mysql" value="1">Mysql</el-option>
              <el-option label="Oracle" value="2">Oracle</el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item prop="choose">
            <el-select v-model="datasourceTableData.params.choose" placeholder="请选择查询条件" clearable>
              <el-option label="数据库名称" value="name">数据库名称</el-option>
              <el-option label="数据库帐号" value="userName">数据库帐号</el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="databaseInfo" style="font-family: 宋体">
            <span v-if="datasourceTableData.params.choose === 'name'">
              <el-input
                v-model="datasourceTableData.params.databaseInfo"
                :maxlength="25"
                placeholder="请输入数据库名称"
                clearable
                style="width: 300px"
              />
            </span>
            <span v-if="datasourceTableData.params.choose === 'userName'">
              <el-input
                v-model="datasourceTableData.params.databaseInfo"
                :maxlength="25"
                placeholder="请输入数据库帐号"
                clearable
                style="width: 300px"
              />
            </span>
            <el-button type="primary" style="margin-top:3px" @click="queryTable(1)">查询</el-button>
            <el-button type="primary" style="margin-top:3px" @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      v-loading.body="datasourceTableData.listLoading"
      :header-cell-style="getRowClass"
      style="width: 100%;"
      :data="datasourceTableData.dataList"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
    >
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column show-overflow-tooltip prop="name" label="数据源名称" />
      <el-table-column show-overflow-tooltip prop="description" label="数据源描述" />
      <el-table-column show-overflow-tooltip prop="url" label="数据库连接地址" />
      <el-table-column show-overflow-tooltip prop="userName" label="数据库帐号" />
      <!-- <el-table-column show-overflow-tooltip prop="dbType" label="数据库类型" /> -->
      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        label="创建时间"
        :formatter="formatterTime"
      />
      <el-table-column show-overflow-tooltip label="操作" width="330px">
        <template slot-scope="scope">
          <el-button type="text" @click="editDatabase(scope.row)">编辑</el-button>
          <el-button type="text" @click="removeDatabase(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="datasourceTableData.total > 0"
      background
      style="float: right; margin-top:10px"
      layout="total, sizes, prev, next"
      :total="datasourceTableData.total"
      :page-sizes="[10,20,30,40,50]"
      :page-size="datasourceTableData.params.pageSize"
      :current-page="datasourceTableData.params.currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-------------------------------------------新增---------------------------------------------------------->
    <el-drawer
      ref="addDatabaseDrawer"
      title="数据源管理/添加数据源"
      size="30%"
      style="font-weight: 500;font-size: 14px;"
      :visible.sync="addDrawer"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <add-datasource-drawer :drawer="addDrawerWindow" :reload-table="getTableData" />
    </el-drawer>
    <!-------------------------------------------编辑---------------------------------------------------------->
    <el-drawer
      ref="editDatabaseDrawer"
      title="数据源管理/编辑数据源"
      size="30%"
      style="font-weight: 500;font-size: 14px;"
      :visible.sync="editDrawer"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <editDatasourceDrawer
        :params="editParams"
        :drawer="editDrawerWindow"
        :reload-table="getTableData"
      />
    </el-drawer>
  </div>
</template>
<script>
import Vue from 'vue'
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import addDatasourceDrawer from './components/addDatasourceDrawer'
import editDatasourceDrawer from './components/editDatasourceDrawer'
const paramFormRules = {
  databaseInfo: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: { addDatasourceDrawer, editDatasourceDrawer },
  data() {
    return {
      textarea1:
        '管理员在此对数据库策略进行管理，并在应用列表页面维护应用的数据库策略。',
      addDrawer: false,
      editDrawer: false,
      addDrawerWindow: this.$refs,
      editDrawerWindow: this.$refs,
      editParams: '',
      datasourceTableData: {
        params: {
          pageNo: 1,
          currentPage: 1,
          pageSize: 10
        },
        total: 10,
        listLoading: true,
        dataList: [],
        paramFormRules
      }
    }
  },
  created() {
    this.getTableData(1)
  },
  methods: {
    queryTable() {
      this.$refs.paramForm.validate((valid) => {
        if (valid) {
          this.getTableData(1)
        }
      })
    },
    getTableData(val) {
      if (val !== undefined) {
        this.datasourceTableData.params.currentPage = val
      } else {
        this.datasourceTableData.params.currentPage = 1
      }
      const params = {
        dbType: '1',
        pageNo: this.datasourceTableData.params.currentPage,
        pageSize: this.datasourceTableData.params.pageSize,
        createId: Vue.getAcloudProvider().getUserInfo().id
      }
      // if (params.dbType === '') {
      //   params.dbType = '0'
      // }
      const choose = this.datasourceTableData.params.choose
      const value = this.datasourceTableData.params.databaseInfo
      if (choose !== null) {
        if (choose === 'name') {
          params.name = value
        } else if (choose === 'userName') {
          params.userName = value
        }
      }
      this.datasourceTableData.listLoading = true
      this.$axios
        .post('/sgid-out-manage/databaseManage/getDatabasePage', params)
        .then(res => {
          if (res.data.code === '100001') {
            this.datasourceTableData.dataList = res.data.data.rows
            this.datasourceTableData.total = res.data.data.total
            this.datasourceTableData.listLoading = false
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.datasourceTableData.listLoading = false
            this.datasourceTableData.dataList = []
            return
          }
        })
        .catch(() => {
          this.$message.error('服务器繁忙。')
        })
    },
    formatterTime(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        // eslint-disable-line
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleSizeChange(val) {
      this.datasourceTableData.params.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.datasourceTableData.params.pageNo = val
      this.getTableData(val)
    },
    editDatabase(item) {
      this.editParams = item
      this.editDrawer = true
    },
    removeDatabase(data) {
      this.$confirm('确定删除所选记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: data.id,
          createId: Vue.getAcloudProvider().getUserInfo().id
        }
        this.$axios
          .post('/sgid-out-manage/databaseManage/removeDatabaseById', params)
          .then(res => {
            if (res.data.code === '100001') {
              this.$message.success('删除成功。')
              this.getTableData(1)
            } else {
              this.$message.error(res.data.message)
              return
            }
          })
          .catch(() => {
            this.$message.error('服务器繁忙。')
          })
      })
    },
    resetQuery() {
      this.datasourceTableData.params.databaseInfo = ''
      this.datasourceTableData.params.choose = ''
      this.datasourceTableData.params.currentPage = 1
      this.getTableData(1)
    }
  }
}
</script>
<style scoped lang="scss">
/deep/.el-icon-search {
  background: transparent !important;
  color: #fff !important;
}
/deep/.el-input-group--append .el-input__inner {
  height: 35px !important;
}
/deep/.el-drawer__header {
  margin-bottom: 0px;
}
/deep/.el-dialog__close.el-icon.el-icon-close {
  color: black;
}
/deep/.el-divider--horizontal {
  margin-top: -20px;
  margin-bottom: 10px;
}
/deep/.el-input__icon {
  margin-top: -4px;
}
</style>
