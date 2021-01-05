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
          <el-form-item>
            <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="addPerson()">添加人员</el-button>
            <el-button type="primary" style="background-color: #f48a60;border-color: #f48a60" @click="deleteStation">删除</el-button>
          </el-form-item>
          <el-form-item prop="uname" style="font-family: 宋体">
            <el-input v-model="tableData.params.uname" :maxlength="20" placeholder="请输入关键词进行检索" clearable style="width:250px;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query()">查询</el-button>
            <el-button type="primary" style="margin-top:3px" @click="resetQuery()">重置</el-button>
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
        element-loading-text="Loading"
        border
        highlight-current-row
        style="width: 100%;margin-top: 10px;cursor: pointer"
        :cell-style="changeCellStyle"
        @selection-change="selsChange"
      >
        <el-table-column label="序号" width="50" type="index" />
        <el-table-column type="selection" width="50" />
        <el-table-column show-overflow-tooltip prop="name" label="姓名" sortable />
        <el-table-column show-overflow-tooltip prop="age" label="年龄" sortable />
        <el-table-column show-overflow-tooltip prop="sex" label="性别">
          <template slot-scope="scope">
            {{ scope.row.sex | sexJugde }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="jobNum" label="工号" />
        <el-table-column show-overflow-tooltip prop="phoneNum" label="电话" />
        <el-table-column show-overflow-tooltip prop="note" label="备注" />
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">修改</el-button>
            <!-- <el-button type="text" @click="match(scope.row)">设备配置</el-button> -->
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
    </el-row>

    <el-row>
      <el-drawer
        :title="drwTitle"
        size="50%"
        :visible.sync="drawer"
        :destroy-on-close="true"
        :before-close="handleClose"
      >

        <el-form ref="form" :rules="model.rules" :model="person" label-width="100px">
          <el-form-item label="人员名称:" prop="name" class="form-item" :rules="model.rules.name">
            <el-input v-model="person.name" :maxlength="16" clearable placeholder="请输入人员名称" />
          </el-form-item>
          <el-form-item label="人员年龄:" prop="age" class="form-item" :rules="model.rules.age">
            <el-input v-model="person.age" :maxlength="16" clearable placeholder="请输入人员年龄" />
          </el-form-item>
          <el-form-item label="人员性别:" prop="sex" class="form-item" :rules="model.rules.sex">
            <el-select v-model="person.sex" placeholder="请选择人员性别" style="width: 100%">
              <el-option
                v-for="item in sexList"
                :key="item.lable"
                :label="item.lable"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="工号:" prop="jobNum" class="form-item" :rules="model.rules.jobNum">
            <el-input v-model="person.jobNum" :maxlength="10" clearable placeholder="请输入员工工号" />
          </el-form-item>
          <el-form-item label="电话号码:" prop="phoneNum" class="form-item" :rules="model.rules.phoneNum">
            <el-input v-model="person.phoneNum" :maxlength="11" clearable placeholder="请输入电话号码" />
          </el-form-item>


          <el-form-item label="平台账号" prop="relateAccount" class="form-item" :rules="model.rules.relateAccount">
            <el-select v-if="addOrUpdate === 'add'" v-model="person.relateAccount" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in acloudUserList"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              />
            </el-select>

            <span v-if="addOrUpdate === 'update'">{{ person.username }}</span>

          </el-form-item>
          <el-form-item
            label="备注:"
            prop="note"
            class="form-item"
            :rules="model.rules.note"
          >
            <el-input
              v-model="person.note"
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
    </el-row>

    <div>
      <el-drawer title="智慧照明" size="80%" :visible.sync="dialogTableVisible">
        <el-row>
          <el-input v-model="stationObj.uname" :maxlength="20" placeholder="请输入关键词进行检索" clearable style="width:250px;" />
          <el-button type="primary" @click="queryStatation()">查询</el-button>
        </el-row>
        <el-table
          v-loading.body="stationLoading"
          :data="stationList"
          :header-cell-style="getRowClass"
          :row-class-name="tableRowClassName"
          element-loading-text="Loading"
          border
          highlight-current-row
          style="width: 100%;margin-top: 10px;cursor: pointer"
          :cell-style="changeCellStyle"
        >
          <el-table-column label="序号" width="50" type="index" :index="indexMethod" />
          <el-table-column property="station.ucode" label="编号" />
          <el-table-column property="station.uname" label="名称" />
          <el-table-column property="station.dtuonline" label="联网" />
          <el-table-column property="station.address" label="站点" />
          <el-table-column property="station.rtufault" label="是否故障" />
          <el-table-column label="分配">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isMatched"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="matchChange(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="pagtation.total > 0"
          background
          :total="pagtation.total"
          :current-page="pagtation.currentPage"
          :page-sizes="pagtation.pageList"
          :page-size="pagtation.pageSize"
          layout="total,sizes,prev,next"
          style="float: right;margin-top:10px"
          @size-change="handleSizeStation"
          @current-change="handleCurrentStation"
        />
      </el-drawer>
    </div>

  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
const paramFormRules = {
  uname: [{
    pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
    message: '不能输入特殊字符。',
    trigger: 'change'
  }]
}
export default {
  components: {

  },
  filters: {
    sexJugde(param) {
      if (param == null || param === undefined || param === '') {
        return
      }
      if (param === '1') {
        return '男'
      }
      if (param === '0') {
        return '女'
      }
    }
  },
  data() {
    return {
      drwTitle: '人员编辑',
      tableChecked: [],
      dialogTableVisible: false,
      stationLoading: true,
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
      },
      drawer: false,
      paramFormRules: paramFormRules,
      searchObj: {},
      stationObj: {},
      stationList: [],
      acloudUserList: [],
      model: {
        rules: {
          name: [
            { required: true, message: '请输人员名称。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],

          age: [
            { required: true, message: '请输入人员年龄。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.positiveInteger.value,
              message: '请输入正整数。',
              trigger: 'change'
            }
          ],
          sex: [
            { required: true, message: '请输入人员性别。', trigger: 'change' }
          ],
          jobNum: [
            { required: true, message: '请输入人员工号。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          phoneNum: [
            { required: true, message: '请输入电话号码。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.mobilePhone.value,
              message: '请正确输入电话号码。',
              trigger: 'change'
            }
          ],
          note: [
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          relateAccount: [
            { required: true, message: '请选择平台账号。', trigger: 'change' }
          ]
        }
      },
      sexList: [
        { lable: '男', value: '1' },
        { lable: '女', value: '0' }
      ],
      person: {},
      addOrUpdate: '',
      deleteList: [],
      pagtation: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageList: [10, 20, 30, 40, 50]
      },
      matchOnePerson: {},
      witchKey: false
    }
  },
  computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    }
  },
  created() {
    this.getPerson()
    this.queryAllAcloudUser()
  },
  methods: {

    query() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.getPerson()
        }
      })
    },
    resetQuery() {
      this.tableData.params.uname = ''
      this.getPerson()
    },
    queryStatation() {},
    queryAllAcloudUser() {
      this.$axios.get('/stars-user/admin/getNotLinkUser').then(res => {
        if (res.data.code === 20000) {
          this.acloudUserList = res.data.data
        }
      })
    },
    getPerson() {
      const params = {
        'name': this.tableData.params.uname
      }
      this.$axios.post('/acloud-lighting/person/getPersons?page=' + this.tableData.params.currentPage +
          '&size=' + this.tableData.params.pageSize, params).then(res => {
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
    addPerson() {
      this.person = {}
      this.drwTitle = '人员添加'
      this.drawer = true
      this.addOrUpdate = 'add'
    },
    edit(row) {
      this.person = { ...row }
      this.drwTitle = '人员修改'
      this.drawer = true
      this.addOrUpdate = 'update'
    },
    getStationToperson() {
      this.stationObj.personId = this.matchOnePerson.autoId
      this.$axios.post('/acloud-lighting/personDev/getStationToPerson?page=' + this.pagtation.currentPage +
        '&size=' + this.pagtation.pageSize, this.stationObj).then(res => {
        if (res.data.code == 20000) {
          this.stationList = res.data.data.list
          this.pagtation.total = res.data.data.total
          for (let i = 0; i < this.stationList.length; i++) {
            if (this.stationList[i].personDev != null && this.stationList[i].personDev.personId == this.matchOnePerson.autoId) {
              this.$set(this.stationList[i], 'isMatched', true)
            } else {
              this.$set(this.stationList[i], 'isMatched', false)
            }
          }
          this.stationLoading = false
        } else {
          this.$message.error(res.data.message || '查询失败')
          this.stationList = []
        }
      })
    },
    match(row) {
      this.matchOnePerson = { ...row }
      this.dialogTableVisible = true
      this.stationLoading = true
      this.getStationToperson()
    },
    matchChange(row) {
      return
      var personDev = {}
      personDev.relationDevId = row.station.autoid
      personDev.personId = this.matchOnePerson.autoId
      if (row.isMatched) {
        this.$axios.post('/acloud-lighting/personDev/addPersonDev', personDev).then(res => {
          if (res.data.code === 20000) {
            this.getStationToperson()
          }
        })
      } else {
        personDev.autoId = row.personDev.autoId
        this.$axios.post('/acloud-lighting/personDev/deletePersonDev', personDev).then(res => {
          if (res.data.code === 20000) {
            this.getStationToperson()
          }
        })
      }
    },
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.addOrUpdate === 'add') {
            this.$axios.post('/acloud-lighting/person/addPerson', this.person).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.getPerson()
              } else {
                this.$message.error(res.data.message || '添加失败')
              }
            })
          } else {
            this.$axios.post('/acloud-lighting/person/updatePerson', this.person).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.getPerson()
              } else {
                this.$message.success(res.data.message || '修改失败')
              }
            })
          }
        }
      })
    },

    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
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
      this.deleteList = []
      for (let i = 0; i < val.length; i++) {
        this.deleteList.push(val[i].autoId)
      }
    },
    deleteStation() {
      if (this.deleteList.length == 0) {
        this.$message.error('请选中选项')
        return
      }
      this.$axios.post('/acloud-lighting/person/deleteList', this.deleteList).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.drawer = false
          this.getPerson()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
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
    },
    handleSizeStation(val) {
      this.pagtation.pageSize = val
      this.pagtation.currentPage = 1
      this.getPerson()
    },
    handleCurrentStation(val) {
      this.pagtation.currentPage = val
      this.getPerson()
    }
  }
}
</script>

<style scoped>

</style>
