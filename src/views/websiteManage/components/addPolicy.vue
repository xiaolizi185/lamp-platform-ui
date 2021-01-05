<template>
  <div>
    <el-divider
      content-position="left"
      style="margin-top: -20px;"
    >策略列表</el-divider>
    <el-form
      ref="form"
      :model="sizeForm"
      label-width="80px"
      :rules="sizeForm.rules"
    >
      <el-form-item
        label="策略名称"
        prop="uname"
        :rules="sizeForm.rules.uname"
      >
        <el-input
          v-model="sizeForm.uname"
          placeholder="请输入策略名称"
        />
      </el-form-item>
      <el-form-item
        label="所属项目"
        prop="projectid"
        :rules="sizeForm.rules.projectid"
      >
        <el-select
          v-model="sizeForm.projectid"
          prop="projectid"
          placeholder="请选择所属项目"
          clearable
        >
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="策略类型"
        prop="rtutype"
        :rules="sizeForm.rules.rtutype"
      >
        <el-select
          ref="typesel"
          v-model="sizeForm.rtutype"
          prop="rtutype"
          placeholder="请选择策略类型"
          @change="changeRtuTYpe(sizeForm.rtutype)"
        >
          <el-option
            v-for="item in rtuList"
            :key="item.value"
            :label="item.lable"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="活动时间" prop="bdate" :rules="sizeForm.rules.bdate">
        <div class="block">
          <el-date-picker
            v-model="sizeForm.bdate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          />
        </div>
      </el-form-item> -->
      <el-form-item
        label="备注"
        prop="remarks"
        :rules="sizeForm.rules.remarks"
      >
        <el-input
          v-model="sizeForm.remarks"
          type="textarea"
          maxlength="200"
          show-word-limit
          clearable
          placeholder="请输入相关备注信息"
        />
      </el-form-item>
      <el-divider
        content-position="left"
        style="margin-top: -20px;"
      >动作列表</el-divider>
      <el-button
        style="margin-top: 12px;float: left;margin-left: 10px;margin-bottom: 10px"
        type="primary"
        @click="addloop"
      >添加动作</el-button>
      <el-table
        ref="multipleTable"
        v-loading.body="tableData.listLoading"
        :header-cell-style="getRowClass"
        :data="tableData.dataList"
        element-loading-text="Loading"
        border
        highlight-current-row
        style="width: 100%;margin-top: 10px;cursor: pointer"
        :cell-style="changeCellStyle"
      >
        <el-table-column
          label="序号"
          width="50"
          type="index"
        />
        <el-table-column
          show-overflow-tooltip
          prop="actiontype"
          label="执行类型"
        >
          <template slot-scope="scope">
            {{ scope.row.actiontype | judgeAction }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="lampsmask"
          label="调光强度"
        />

        <el-table-column
          show-overflow-tooltip
          prop="exectime"
          label="执行时间"
          :formatter="formatCreateDate"
        />
        <!--
           v-if="checkedType ==='E43EC3CB-EB15-4429-9BF8-94BA92E08403'"
          <el-table-column
          v-if="checkedType ==='483045FD-E278-4EEB-AFE9-53836FCF6B27'"
          show-overflow-tooltip
          prop="personnum"
          label="人流数量"
           v-if="checkedType ==='A566EF12-3F1F-4E2F-A6AC-9A5E90D2C4ED'"
        /> -->
        <el-table-column
          show-overflow-tooltip
          prop="timetype"
          label="时间类型"
        >
          <template slot-scope="scope">
            {{ scope.row.timetype | judgeTime }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="execloop"
          label="单灯"
        />
        <el-table-column
          show-overflow-tooltip
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="deleteloop(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider
        content-position="left"
        style="margin-top: -20px;"
      >提交列表</el-divider>
      <el-button
        style="margin-top: 12px;float: right;margin-right: 5px"
        type="cancel"
        @click="reset()"
      >重置</el-button>
      <el-button
        style="margin-top: 12px;float: right;margin-right: 5px"
        type="primary"
        @click="confirmSave()"
      >提交</el-button>
    </el-form>

    <el-drawer
      v-if="drawer"
      ref="actionDrawer"
      :model="false"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="drawer"
      size="40%"
      :append-to-body="true"
      :modal-append-to-body="false"
    >
      <add-action
        :drawer="addActionDrawer"
        :rtu-type="sizeForm.rtutype"
        @parentTableData="parentTableData"
      />
    </el-drawer>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import addAction from './addAction'
import dateTool from '@/utils/date-tool'
import { dateFormat } from '@/utils/publicMethod.js'
import Vue from 'vue'
export default {
  components: {
    addAction
  },
  filters: {
    judgeAction(param) {
      if (param == null || param === undefined || param === '') {
        return
      }
      if (param === 1) {
        return '开灯'
      } else if (param === 2) {
        return '关灯'
      } else {
        return '调光'
      }
    },
    judgeTime(param) {
      if (param == null || param === undefined || param === '') {
        return
      }
      if (param === 1) {
        return '日落时间'
      } else {
        return '日出时间'
      }
    }
  },
  props: {
    drawer1: {
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
      itemkey: '',
      isauto: false,
      rtuList: [],
      drawer: false,
      addActionDrawer: this.$refs,
      projectList: [],
      actiontype: '',
      checkedType: '',
      oldTyepe: '',
      sizeForm: {
        projectid: '',
        uname: '',
        rtutype: '',
        remarks: '',
        rules: {
          uname: [
            {
              required: true,
              message: '请输入策略名称。',
              trigger: 'change'
            },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          projectid: [
            {
              required: true,
              message: '请选择项目。',
              trigger: 'change'
            }
          ],
          rtutype: [
            {
              required: true,
              message: '请选择策略。',
              trigger: 'change'
            }
          ],
          remarks: [
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ]
        }
      },
      tableData: {
        params: {
          uname: '',
          rtutype: '',
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: false,
        dataList: []
        // paramFormRules
      }
    }
  },
  created() {
    this.getRtuTypeList()
    this.getProjectInfo()
  },
  methods: {
    parentTableData(parentTableData) {
      if (this.tableData.dataList.length >= 1) {
        var temp = this.tableData.dataList
        for (let i = 0; i < temp.length; i++) {
          if (
            (temp[i].timetype !== '' &&
              temp[i].timetype === parentTableData.timetype) ||
            (temp[i].exectime !== '' &&
              temp[i].exectime === parentTableData.exectime)
          ) {
            for (let j = 0; j < temp[i].execloop.length; j++) {
              for (let k = 0; k < parentTableData.execloop.length; k++) {
                if (temp[i].execloop[j] === parentTableData.execloop[k]) {
                  this.$message.error(
                    temp[i].execloop[j] + '已经包含相同策略请重新选择了'
                  )
                  return
                }
              }
            }
          }
        }
      }
      this.tableData.dataList.push(parentTableData)
    },
    getProjectInfo() {
      const params = {
        fDelState: true,
         createId:Vue.getAcloudProvider().getUserInfo().id
      }
      this.$axios
        .post(
          '/acloud-lamppost/project/search?page=' + 1 + '&size=' + 20,
          params
        )
        .then((res) => {
          if (res.data.code === 20000) {
            for (let i = 0; i < res.data.data.rows.length; i++) {
              this.projectList.push({
                label: res.data.data.rows[i].fName,
                value: res.data.data.rows[i].fId
              })
            }
          } else {
            this.$message.error(res.data.message || '查询失败')
            return
          }
        })
    },
    getRtuTypeList() {
      this.$axios.get('/acloud-lighting/userdisk/findAll').then((res) => {
        if (res.data.code === 20000) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].itemtype != null) {
              if (res.data.data[i].itemtype === 'Rtu策略类型') {
                this.rtuList.push({
                  value: res.data.data[i].icode,
                  lable: res.data.data[i].uname
                })
              }
            }
          }
        } else {
          this.rtuList = []
          return
        }
      })
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    addloop() {
      if (this.sizeForm.rtutype === null || this.sizeForm.rtutype === '') {
        this.$message.error('请选择策略类型。')
        return
      } else {
        this.drawer = true
      }
    },
    deleteloop(index) {
      this.$confirm('确认删除？')
        .then((_) => {
          this.tableData.dataList.splice(index, 1)
        })
        .catch((_) => {
          return
        })
    },
    changeRtuTYpe(val) {
      // 判断如果有动作再切换策略数据清空
      if (this.tableData.dataList.length !== 0) {
        if (this.isauto) {
          this.isauto = false
          return
        }
        this.$confirm('确认切换策略？切换后执行动作将清空。')
          .then((_) => {
            this.tableData.dataList = []
            this.sizeForm.rtutype = val
            this.checkedType = val
          })
          .catch((_) => {
            this.isauto = true
            this.$refs.typesel.value = this.checkedType
            this.isauto = false
            return
          })
      } else {
        this.sizeForm.rtutype = val
        this.checkedType = val
      }
    },
    reset() {
      this.sizeForm.projectid = null
      this.sizeForm.rtutype = null
      this.sizeForm.uname = null
      this.sizeForm.remarks = null
      this.tableData.dataList = []
      this.$refs.form.resetFields()
    },
    confirmSave() {
      if (this.tableData.dataList.length === 0) {
        this.$message.error('请添加动作。')
        return
      }
      this.$refs.form.validate((v) => {
        if (v) {
          const stationSetTailwebList = []
          const stationSetListweb = {
            projectid: this.sizeForm.projectid,
            userdiskid: this.sizeForm.rtutype,
            uname: this.sizeForm.uname,
            createid: Vue.getAcloudProvider().getUserInfo().id,
            createtime: new Date().getTime(),
            remarks: this.sizeForm.remarks,
            delstate: 1
          }
          for (let i = 0; i < this.tableData.dataList.length; i++) {
            if (
              (typeof this.tableData.dataList[i].execloop === 'object' &&
                this.tableData.dataList[i].execloop.constructor === Array) ===
              false
            ) {
              this.loops = this.tableData.dataList[i].execloop.split(',')
            } else {
              this.loops = this.tableData.dataList[i].execloop
            }
            var nowDate = new Date()
            var year = nowDate.getFullYear()
            var month =
              nowDate.getMonth() + 1 < 10
                ? '0' + (nowDate.getMonth() + 1)
                : nowDate.getMonth() + 1
            var day =
              nowDate.getDate() < 10
                ? '0' + nowDate.getDate()
                : nowDate.getDate()
            var dateStr = ''
            if (
              this.sizeForm.rtutype === 'E43EC3CB-EB15-4429-9BF8-94BA92E08403'
            ) {
              dateStr =
                year +
                '-' +
                month +
                '-' +
                day +
                ' ' +
                this.tableData.dataList[i].exectime +
                ':00'
            } else {
              dateStr = year + '-' + month + '-' + day + ' ' + '00:00:00'
            }
            stationSetTailwebList.push({
              actiontype: this.tableData.dataList[i].actiontype,
              exectime: new Date(dateStr).getTime(),
              execloop: this.loops.join(',').toString(),
              lampsmask: this.tableData.dataList[i].lampsmask,
              createid: Vue.getAcloudProvider().getUserInfo().id,
              createtime: new Date().getTime(),
              delstate: 1,
              timetype: this.tableData.dataList[i].timetype,
              personnum: this.tableData.dataList[i].personnum
            })
          }
          const params = {
            stationSetListweb,
            stationSetTailwebList
          }
          this.$axios
            .post('/acloud-lighting/stationsetlistweb/add', params)
            .then((res) => {
              if (res.data.code === 20000) {
                this.$message.success('添加策略成功')
                this.loaddata()
                this.drawer1.drawerPolicy.hide()
              } else {
                this.$message.error(res.data.message)
                this.drawer1.drawerPolicy.hide()
                return
              }
            })
            .catch(() => {
              this.$message.error('添加失败。')
              this.drawer1.drawerPolicy.hide()
              return
            })
        }
      })
    }
  }
}
</script>
