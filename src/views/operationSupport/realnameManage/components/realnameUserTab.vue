<template>
  <div>
    <el-row>
      <el-col class="table-content">
        <el-form
          ref="paramForm"
          :model="userTableData.params"
          :rules="userTableData.paramFormRules"
          inline
          label-position="right"
          label-width="80px"
          class="query-form"
        >
          <el-form-item prop="choose">
            <el-select v-model="userTableData.params.choose" placeholder="请选择" clearable>
              <el-option label="姓名" value="name">姓名</el-option>
              <el-option label="手机号码" value="phone">手机号码</el-option>
              <el-option label="身份证号码" value="idNumber">身份证号码</el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="userInfo" style="font-family: 宋体">
            <span v-if="userTableData.params.choose === 'name'">
              <el-input
                v-model="userTableData.params.userInfo"
                :maxlength="25"
                placeholder="请输入用户姓名进行检索"
                clearable
                style="width: 300px"
              />
            </span>
            <span v-if="userTableData.params.choose === 'phone'">
              <el-input
                v-model="userTableData.params.userInfo"
                :maxlength="25"
                placeholder="请输入手机号码进行检索"
                clearable
                style="width: 300px"
              />
            </span>
            <span v-if="userTableData.params.choose === 'idNumber'">
              <el-input
                v-model="userTableData.params.userInfo"
                :maxlength="25"
                placeholder="请输入身份证号码进行检索"
                clearable
                style="width: 300px"
              />
            </span>
            <el-button type="primary" @click="queryTable">查询</el-button>
            <el-button type="primary" style="margin-top:3px" @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      v-loading.body="userTableData.listLoading"
      :header-cell-style="getRowClass"
      :data="userTableData.dataList"
      style="width: 100%;"
      highlight-current-row
      element-loading-text="Loading"
      border
      fit
      stripe
      @row-click="getUserInfo"
    >
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column show-overflow-tooltip prop="name" label="姓名" />
      <el-table-column show-overflow-tooltip prop="sex" label="性别" :formatter="formatSex" />
      <el-table-column show-overflow-tooltip prop="birthday" label="年龄" />
      <el-table-column show-overflow-tooltip prop="idNumber" label="身份证号码" />
      <el-table-column show-overflow-tooltip prop="phone" label="手机号" />
      <el-table-column show-overflow-tooltip prop="expriedDate" label="实名时间" :formatter="formatDate" />
    </el-table>
    <el-pagination
      v-show="userTableData.total > 0"
      background
      style="float: right; margin-top:10px"
      layout="total, sizes, prev, next"
      :total="userTableData.total"
      :page-sizes="[10,20,30,40,50]"
      :page-size="userTableData.params.pageSize"
      :current-page="userTableData.params.currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-------------------------------------------查看详情---------------------------------------------------------->
    <el-drawer
      :title="title"
      size="35%"
      style="font-weight: 500;font-size: 14px;"
      :visible.sync="drawer"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <getRealnameUserInfoDrawer :params="rowParams" @getTotal="getTotal" />
    </el-drawer>
  </div>
</template>
<script>
import Vue from 'vue'
import dateTool from '@/utils/date-tool'
import aTool from '@acloud/acloud-atool-js'
import getRealnameUserInfoDrawer from '@/views/operationSupport/realnameManage/components/getRealnameUserInfo'
const paramFormRules = {
  userInfo: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: { getRealnameUserInfoDrawer },
  data() {
    return {
      activeName: 'orgRealname',
      drawer: false,
      rowParams: '',
      title: '已关联应用',
      listLoading: false,
      userTableData: {
        total: 20,
        params: {
          pageNo: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        paramFormRules
      }
    }
  },
  created() {
    this.getTableData(1)
  },
  methods: {
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    getTotal(total) {
      console.log(total)
      if (total === undefined) {
        total = 0
      }
      this.title = `已关联应用(${total})`
    },
    queryTable() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.getTableData(1)
        }
      })
    },
    getTableData(pageNo) {
      this.userTableData.params.currentPage = pageNo
      const params = {
        pageNo: pageNo !== null ? pageNo : this.userTableData.params.pageNo,
        pageSize: this.userTableData.params.pageSize,
        userId: Vue.getAcloudProvider().getUserInfo().id
      }
      const choose = this.userTableData.params.choose
      const value = this.userTableData.params.userInfo
      if (choose !== undefined) {
        if (choose === 'idNumber') {
          params.idNumber = value
        } else if (choose === 'name') {
          params.name = value
        } else if (choose === 'phone') {
          params.phone = value
        }
      }
      const sex = this.userTableData.params.sex
      params.sex = sex
      this.userTableData.listLoading = true
      this.$axios
        .post('/sgid-out-user/user/queryByPage', params)
        .then(res => {
          if (res.data.code === '100001') {
            this.userTableData.dataList = res.data.data.rows
            this.userTableData.total = res.data.data.total
            this.userTableData.listLoading = false
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.userTableData.listLoading = false
            this.userTableData.dataList = []
            return
          }
        })
        .catch(() => {
          this.$message.error('服务器繁忙。')
        })
    },
    formatSex(row, column, cellValue) {
      if (cellValue === 0) {
        return '女'
      } else if (cellValue === 1) {
        return '男'
      } else {
        return '未知'
      }
    },
    formatDate(cellValue) {
      return dateTool.formatDateTime(cellValue.expriedDate)
    },
    handleSizeChange(val) {
      this.userTableData.params.pageSize = val
    },
    handleCurrentChange(val) {
      this.userTableData.params.pageNo = val
      this.getTableData(this.userTableData.params.pageNo)
    },
    getUserInfo(row) {
      this.drawer = true
      this.rowParams = row
    },
    handleClose(done) {
      done()
    },
    resetQuery() {
      this.userTableData.params.choose = ''
      this.userTableData.params.userInfo = ''
      this.userTableData.params.currentPage = 1
      this.getTableData(1)
    }
  }
}
</script>
<style  scoped lang="scss">
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
</style>
