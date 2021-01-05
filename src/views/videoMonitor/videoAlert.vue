<template>
  <div class="app-container">
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
          <el-form-item prop="parentid" label="设备id" style="font-family: 宋体">
            <el-input v-model="tableData.params.parentid" :maxlength="20" placeholder="请输入关键词进行检索" clearable style="width:250px;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query()">查询</el-button>
            <el-button type="primary" style="margin-top:3px" @click="resetQuery()">重置</el-button>
            <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34" @click="dealState()">处理</el-button>
            <el-button type="primary" style="margin-top:3px;background-color: #53c5a1;border-color: #53c5a1" @click="sendMessage()">发送短信</el-button>
          </el-form-item>
          <el-form-item>
            <el-button style="background-color: #f48a60;border-color: #f48a60" type="primary" @click="del()">删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-table
        v-loading.body="tableData.listLoading"
        :header-cell-style="getRowClass"
        :row-class-name="tableRowClassName"
        :data="tableData.dataList"
        :model="tableData.params"
        :rules="tableData.paramFormRules"
        element-loading-text="Loading"
        border
        highlight-current-row
        style="width: 100%;margin-top: 10px;cursor: pointer"
        :cell-style="changeCellStyle"
        @selection-change="selsChange"
      >
        <el-table-column label="序号" width="50" type="index" :index="indexMethod" />
        <el-table-column type="selection" width="50" />
        <el-table-column show-overflow-tooltip min-width="100" prop="stationAlert.parentid" label="设备id" width="200" sortable />
        <el-table-column show-overflow-tooltip min-width="100" prop="stationAlert.createtime" label="报警时间" width="200" sortable />
        <el-table-column show-overflow-tooltip min-width="100" prop="stationAlert.varname" label="预警值" width="200" />
        <el-table-column show-overflow-tooltip prop="stationAlert.alarmContent" label="报警内容" />
        <el-table-column width="80" show-overflow-tooltip prop="stationAlert.state" label="是否处理">
          <template slot-scope="scope">
            <span v-if="scope.row.stationAlert.state === 1"><el-button type="success" round>已处理</el-button></span>
            <span v-else><el-button v-if="scope.row.stationAlert.state === 0" type="danger" round>未处理</el-button></span>
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

    <el-row>
      <el-drawer title="发送短信" size="50%" :visible.sync="drawer" :destroy-on-close="true">

        <el-form ref="form" label-width="120px">
          <el-form-item label="选择运维人员:">
            <el-select v-model="entityObj" placeholder="请选择" @change="changeUser(entityObj)">
              <el-option
                v-for="item in personList"
                :key="item.autoId"
                :label="item.name +' '+item.phoneNum"
                :value="item.autoId"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="margin-right: 50%">
          <el-button style="margin-top: 20px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">确定</el-button>
          <el-button style="margin-top: 20px;float: right;margin-right: 5px;margin-left: 20px" type="primary" @click="drawer=false">返回</el-button>
        </div>
      </el-drawer>
    </el-row>

  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
// import {getStationAndAlert} from '../api/smartLighting.js'
import Vue from 'vue'
const paramFormRules = {
  parentid: [{
    pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
    message: '不能输入特殊字符。',
    trigger: 'change'
  }]
}
export default {
  components: {

  },
  filters: {

  },
  data() {
    return {
      sendobj: {},
      stationAlert: {

      },
      tableData: {
        params: {
          uname: '',
          rtutype: '',
          parentid: '',
          currentPage: 1,
          pageSize: 20
        },
        total: 0,
        listLoading: true,
        dataList: [],
        paramFormRules
      },
      drawer: false,
      searchObj: {},
      selectList: [],
      entityObj: {},
      personList: []
    }
  },
  computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    }
  },
  created() {
    this.getTableData()
    this.getPerson()
  },
  methods: {
    dealState() {
      const checkValue = []
      if (this.selectList.length === 0) {
        this.$message.error('请选中选项')
        return
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].state === 1) {
          this.$message.error('请去除已处理对象。')
          return
        } else {
          checkValue.push(this.selectList[i].autoid)
        }
      }
      this.$axios.post('/acloud-lighting/stationAlert/updateMulti', checkValue).then(res => {
        if (res.data.code === 20000) {
          this.$message.success('处理成功。')
          this.getTableData()
        } else {
          this.$message.error('处理失败')
          return
        }
      })
    },
    query() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.getTableData()
        }
      })
    },
    resetQuery() {
      this.searchObj = {}
      this.tableData.params.parentid = ''
      this.getTableData()
    },
    getPerson() {
      this.$axios.get('/acloud-lighting/person/getAll').then(res => {
        if (res.data.code === 20000) {
          this.personList = res.data.data
          this.entityObj = this.personList[0].autoId
        }
      })
    },
    getTableData() {
      this.searchObj.alertDev = 2
      this.searchObj.parentid = this.tableData.params.parentid
      this.$axios.post('/acloud-lighting/stationAlert/getStationAlert?page=' + this.tableData.params.currentPage +
        '&size=' + this.tableData.params.pageSize, this.searchObj).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        } else {
          console.log(res.data.message)
          this.$message.error(res.data.message || '查询失败')
          this.tableData.listLoading = false
          this.tableData.dataList = []
          return
        }
      })
    },
    changeUser(val) {
      this.entityObj = val
    },
    confirmSave() {
      var tempList = []
      console.log(this.personList)
      for (let i = 0; i < this.personList.length; i++) {
        if (this.personList[i].autoId === this.entityObj) {
          this.sendobj = this.personList[i]
        }
      }
      console.log(this.entityObj)
      var req = {
        stationAlert: this.selectList[0],
        person: this.sendobj,
        createId: Vue.getAcloudProvider().getUserInfo().id
      }
      this.$axios.post('/acloud-lighting/stationAlert/sendMessage', req).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.drawer = false
        } else {
          this.$message.error(res.data.message || '发送失败！')
        }
      })
    },
    del() {
      if (this.selectList.length === 0) {
        this.$message.error('请选择删除数据。')
        return
      } else {
        const delList = []
        for (let i = 0; i < this.selectList.length; i++) {
          {
            delList.push(this.selectList[i].autoid)
          }
        }
        const params = {
          createId: Vue.getAcloudProvider().getUserInfo().id,
          list: delList
        }

        this.$axios.post('/acloud-lighting/stationAlert/realDelete', params).then(res => {
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
    },
    sendMessage() {
      if (this.selectList.length !== 1) {
        this.$message.error('请选只中一行')
        return
      }
      this.drawer = true
      // this.$axios.post('/acloud-lighting/stationAlert/sendMessage', this.selectList).then(res => {
      //   if (res.data.code === 20000) {
      //     this.$message.success(res.data.message)
      //   } else {
      //     this.$message.error(res.data.message || "发送失败！")
      //   }
      // })
    },
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
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
    },
    selsChange(val) {
      this.selectList = []
      if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          this.selectList.push(val[i].stationAlert)
        }
      }
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
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
