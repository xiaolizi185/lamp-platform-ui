<template>
  <div>
    <el-row>
      <el-col class="table-content">
        <el-form
          ref="paramForm"
          :model="orgTableData.params"
          :rules="orgTableData.paramFormRules"
          inline
          label-position="right"
          label-width="80px"
          class="query-form"
        >
          <el-form-item prop="status">
            <el-select v-model="orgTableData.params.status" placeholder="经营状态" clearable>
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="trade">
            <el-select v-model="orgTableData.params.trade" placeholder="所属行业" clearable>
              <el-option
                v-for="item in tradeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="type">
            <el-select v-model="orgTableData.params.type" placeholder="请选择" clearable>
              <el-option label="企业名称" value="name">企业名称</el-option>
              <el-option label="法定代表人" value="legal">法定代表人</el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orgInfo" style="font-family: 宋体">
            <el-input
              v-model="orgTableData.params.orgInfo"
              :maxlength="25"
              placeholder="请输入企业信息进行检索"
              clearable
              style="width: 300px"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                style="background-color:rgba(0, 149, 120, 1); height: 35px"
                @click="queryTable"
              />
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-table
      v-loading.body="orgTableData.listLoading"
      :header-cell-style="getRowClass"
      :data="orgTableData.dataList"
      style="width: 100%;"
      element-loading-text="Loading"
      stripe
      border
      highlight-current-row
      fit
      @row-click="getOrgInfo"
    >
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column show-overflow-tooltip prop="name" label="企业名称" />
      <el-table-column show-overflow-tooltip prop="legal" label="法定代表人" />
      <el-table-column
        show-overflow-tooltip
        prop="status"
        label="经营状态"
        :formatter="formatOrgStatus"
      />
      <el-table-column
        show-overflow-tooltip
        prop="buildDate"
        :formatter="formatCreateDate"
        label="成立日期"
      />
      <el-table-column show-overflow-tooltip prop="uscc" label="统一社会信用代码" />
      <el-table-column show-overflow-tooltip prop="orgCode" label="组织机构代码" />
      <el-table-column show-overflow-tooltip prop="baRegisterCode" label="工商注册号" />
      <el-table-column show-overflow-tooltip prop="trade" label="所属行业" :formatter="formatOrgTrade" />
      <el-table-column
        show-overflow-tooltip
        prop="endDate"
        :formatter="formatEndDate"
        label="营业期限"
      />
      <el-table-column show-overflow-tooltip prop="addr" label="企业地址" />
    </el-table>
    <el-pagination
      v-show="orgTableData.total > 0"
      background
      layout="total, sizes, prev, next"
      style="float: right; margin-top:10px"
      :page-sizes="[10,20,30,40,50]"
      :page-size="orgTableData.params.pageSize"
      :current-page="orgTableData.params.currentPage"
      :total="orgTableData.total"
      @current-change="handleCurrentChange"
    />
    <!-------------------------------------------查看详情---------------------------------------------------------->
    <el-drawer
      title="详情信息"
      size="50%"
      style="font-weight: 500;font-size: 14px;"
      :visible.sync="drawer"
      :destroy-on-close="true"
      :before-close="handleClose"
    >
      <getRealnameOrgInfoDrawer :params="rowParams" />
    </el-drawer>
  </div>
</template>
<script>
import Vue from 'vue'
import dateTool from '@/utils/date-tool'
import aTool from '@acloud/acloud-atool-js'
import getRealnameOrgInfoDrawer from '@/views/operationSupport/realnameManage/components/getRealnameOrgInfo'
const paramFormRules = {
  orgInfo: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: { getRealnameOrgInfoDrawer },
  data() {
    return {
      activeName: 'orgRealname',
      drawer: false,
      rowParams: '',
      orgTableData: {
        total: 20,
        params: {
          pageNo: 1,
          currentPage: 1,
          pageSize: 10
        },
        dataList: [],
        paramFormRules
      },
      statusList: [],
      tradeList: []
    }
  },
  created() {
    this.getOrgStatus()
    this.getTradeList()
    this.getTableData()
  },
  methods: {
    getOrgStatus() {
      this.$axios
        .get('/sgid-out-manage/common/queryEnterpriseStatus')
        .then(res => {
          if (res.data.code === '100001') {
            for (let i = 0; i < res.data.data.length; i++) {
              this.statusList.push({
                label: res.data.data[i].describe,
                value: res.data.data[i].val
              })
            }
          } else {
            this.$message.error(res.data.message)
            return
          }
        })
        .catch(() => {
          this.$message.error('服务器繁忙。')
        })
    },
    getTradeList() {
      this.$axios
        .get('/sgid-out-manage/common/queryEnterpriseTrade')
        .then(res => {
          if (res.data.code === '100001') {
            for (let i = 0; i < res.data.data.length; i++) {
              this.tradeList.push({
                label: res.data.data[i].describe,
                value: res.data.data[i].val
              })
            }
          } else {
            this.$message.error(res.data.message)
            return
          }
        })
        .catch(() => {
          this.$message.error('服务器繁忙。')
        })
    },
    getTableData(pageNo) {
      const params = {
        pageNo: pageNo != null ? pageNo : this.orgTableData.params.currentPage,
        pageSize: this.orgTableData.params.pageSize,
        userId: Vue.getAcloudProvider().getUserInfo().id
      }
      const choose = this.orgTableData.params.type
      const value = this.orgTableData.params.orgInfo
      if (
        value != null &&
        value !== '' &&
        (choose === undefined || choose === '')
      ) {
        this.$message.error('请选择查询条件。')
        return
      }
      if (choose != null) {
        if (choose === 'name') {
          params.field = 'NAME'
          params.fieldValue = value
        } else {
          params.field = 'LEGAL'
          params.fieldValue = value
        }
      }
      params.status = this.orgTableData.params.status
      params.trade = this.orgTableData.params.trade
      this.orgTableData.listLoading = true
      this.$axios
        .post('/sgid-out-account/enterprise/query', params)
        .then(res => {
          if (res.data.code === '100001') {
            this.orgTableData.dataList = res.data.data.rows
            this.orgTableData.total = res.data.data.total
            this.orgTableData.listLoading = false
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.orgTableData.listLoading = false
            this.orgTableData.dataList = []
            return
          }
        })
        .catch(() => {
          this.$message.error('服务器繁忙。')
        })
    },
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    queryTable() {
      this.getTableData(1)
    },
    handleSizeChange(val) {
      this.orgTableData.params.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.orgTableData.params.pageNo = val
      this.getTableData(this.orgTableData.params.pageNo)
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDate(cellValue)
    },
    formatEndDate(row, column, cellValue) {
      return (
        dateTool.formatDate(row.buildDate) +
        ' ~ ' +
        dateTool.formatDate(cellValue)
      )
    },
    formatOrgStatus(row, column, cellValue) {
      if (cellValue === '1') {
        return '存续（在营、开业、在册）'
      } else if (cellValue === '2') {
        return '在业'
      } else if (cellValue === '3') {
        return '吊销'
      } else if (cellValue === '4') {
        return '注销'
      } else if (cellValue === '5') {
        return '迁入'
      } else if (cellValue === '6') {
        return '迁出'
      } else if (cellValue === '7') {
        return '停业'
      } else if (cellValue === '8') {
        return '清算'
      } else {
        return '未知'
      }
    },
    formatOrgTrade(row, column, cellValue) {
      if (cellValue === '1') {
        return '商务服务业'
      } else if (cellValue === '2') {
        return '电力生产和供应业'
      } else if (cellValue === '3') {
        return '其他'
      } else {
        return '未知'
      }
    },
    getOrgInfo(row) {
      this.drawer = true
      this.rowParams = row
    },
    handleClose(done) {
      done()
    }
  }
}
</script>
<style scoped lang='scss'>
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
