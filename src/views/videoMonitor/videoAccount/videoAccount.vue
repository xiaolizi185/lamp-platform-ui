<template>
  <div class="app-container">
    <div name="buttonGroup">
      <el-row>
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
          <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="addVideo">新增</el-button>
          <el-button type="primary" style="margin-left: 10px;background-color: #f0bc34;border-color: #f0bc34" @click="deleteMulti">删除</el-button>
          <!-- <el-button type="primary" style="margin-left: 10px;background-color: #f48a60;border-color: #f48a60" @click="getToken">获取Token</el-button> -->
          <!--
            <el-button type="primary" >同步设备</el-button>
            <el-button type="primary" icon="el-icon-refresh-right">同步视频</el-button> -->
          <!-- <el-button type="primary" >...更多</el-button> -->
          </el-form-item>
          <el-form-item prop="searchKey">
          <el-input v-model="tableData.params.searchKey" :maxlength="200" clearable placeholder="请输入搜索条件" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div name="table">
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
        <el-table-column show-overflow-tooltip prop="videoCloudUser.fName" label="名称" sortable />
        <el-table-column show-overflow-tooltip prop="sysProject.fName" label="所属项目" sortable />
        <el-table-column show-overflow-tooltip prop="videoCloudUser.comEquipmentTypeID" label="设备类型">
          <template slot-scope="scope">
            {{ scope.row.videoCloudUser.comEquipmentTypeID | jugdeEquipment }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="videoCloudUser.updateTime" label="更新时间" />
        <el-table-column show-overflow-tooltip prop="videoCloudUser.expiryTime" label="TOKEN过期时间" />
        <el-table-column show-overflow-tooltip prop="videoCloudUser.fCloudAccount" label="云平台账号" />
        <el-table-column show-overflow-tooltip prop="videoCloudUser.fCreateID" label="创建人" />
        <el-table-column show-overflow-tooltip prop="videoCloudUser.fRemarks" label="备注" />
        <el-table-column show-overflow-tooltip prop="videoCloudUser.fCreateTime" label="创建时间" />
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="updateVideo(scope.row)">修改</el-button>
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

        <el-form ref="form" :rules="model.rules" :model="videoCloudUser" label-width="100px">
          <el-form-item v-show="excuteStatus != 'getToken'" label="名称:" prop="fName" class="form-item" :rules="model.rules.fName">
            <el-input v-model="videoCloudUser.fName" :maxlength="16" clearable placeholder="视频账号名称" />
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="所属项目:" prop="fProjectID" class="form-item" :rules="model.rules.fProjectID">
            <el-select v-model="videoCloudUser.fProjectID" placeholder="请选择">
              <el-option
                v-for="item in projectList"
                :key="item.fID"
                :label="item.fName"
                :value="item.fID"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="设备类型:" prop="comEquipmentTypeID" class="form-item" :rules="model.rules.secomEquipmentTypeIDx">
            <el-select v-model="videoCloudUser.comEquipmentTypeID" placeholder="请选择">
              <el-option
                v-for="item in equipmentList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="AppKey:" prop="appKey" class="form-item" >
            <el-input v-model="videoCloudUser.appKey" :maxlength="10" clearable placeholder="Appkey 莹石云平台我的应用里面获取" />
          </el-form-item>
          <el-form-item label="Secret:" prop="secret" class="form-item" >
            <el-input type="password" v-model="videoCloudUser.secret" :maxlength="200" clearable placeholder="请输入Secret" />
          </el-form-item>

          <el-form-item
            v-show="excuteStatus != 'getToken'"
            label="云平台账户:"
            prop="fCloudAccount"
            class="form-item"
            :rules="model.rules.fCloudAccount"
          >
            <el-input
              v-model="videoCloudUser.fCloudAccount"
              placeholder="莹石台账号"
            />
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="云平台密码:" prop="fCloudPass" class="form-item" >
            <el-input type="password" v-model="videoCloudUser.fCloudPass" :maxlength="200" clearable placeholder="莹石台密码" />
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="备注:" prop="fRemarks" class="form-item" :rules="model.rules.fRemarks">
            <el-input
              v-model="videoCloudUser.fRemarks"
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
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import smtool from '@acloud/acloud-smcrypto-js'
import Vue from 'vue'
import { getVideoAccount, addVideoAccout, updateVideo, deleteVideo, queryProject, toGetToken } from './videoM.js'
const paramFormRules = {
  searchKey: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: {

  },
  filters: {
    jugdeEquipment(param) {
      if (param == null || param == '' || param == undefined) {
        return
      }
      switch (param) {
        case 4:
          return '海康'
          break
        default:
          break
      }
    }
  },
  data() {
    return {
      drwTitle: '人员编辑',
      drawer: false,
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10,
          searchKey: ''
        },
        paramFormRules,
        total: 0,
        listLoading: true,
        dataList: []
      },
      videoCloudUser: {},
      videoCloudUserAdd: {},
      videoCloudUserEdit: {},
      excuteStatus: '',
      selectList: [],
      projectList: [],
      equipmentList: [
        { name: '海康', value: 4 }
      ],
      infostrs:'',
      infostrp:'',
      model: {
        rules: {
          fName: [
            { required: true, message: '请输入视频账号名称。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fProjectID: [
            { required: true, message: '请选择所属项目。', trigger: 'change' },
            {
              required: true,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          comEquipmentTypeID: [
            { required: true, message: '请选择设备类型。', trigger: 'change' }
          ],
          appKey: [
            { required: true, message: '请输入appKey。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          secret: [
            { required: true, message: '请输入secret。', trigger: 'change' },
            // {
            //   pattern: aTool.RegexHelper.constants.lettersNumbers_underline.value,
            //   message: '请输入字母、数字或者下划线。',
            //   trigger: 'change'
            // }
          ],
          fCloudAccount: [
            { required: true, message: '请输入云平台账号。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fCloudPass: [
            { required: true, message: '请输入云平台密码。', trigger: 'change' },
            // {
            //   pattern: '^(?![A-Za-z0-9]+$)(?![a-z0-9\\W]+$)(?![A-Za-z\\W]+$)(?![A-Z0-9\\W]+$)[a-zA-Z0-9\\W]{8,16}$',
            //   message: '密码强度不够，由大小写字母、数字、特殊字符组成,密码长度至少8位以上如Star*2014',
            //   trigger: 'change'
            // }
          ]
        }
      }
    }
  },
  computed: {

  },
  created() {
    this.queryTable()
    this.selectProject()
  },
  methods: {
    search() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.queryTable()
        }
      })
    },
    reset() {
      this.tableData.params.searchKey = ''
      this.queryTable()
    },
    queryTable() {
      // if(this.searchKey != "" && this.searchKey != null){
      //   this.searchKey = "/" + this.searchKey;
      // }
      getVideoAccount(this.tableData.params.searchKey, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.total
          this.tableData.listLoading = false
        }
      })
    },
    addVideo() {
      this.videoCloudUser = {}
      this.drwTitle = '视频账号添加'
      this.drawer = true
      this.excuteStatus = 'add'
    },
    updateVideo(row) {
      this.drwTitle = '视频账号修改'
      this.drawer = true
      this.excuteStatus = 'update'
      this.infostrs=row.videoCloudUser.secret
      this.infostrp=row.videoCloudUser.fCloudPass
       row.videoCloudUser.secret='{crypto}'
       row.videoCloudUser.fCloudPass='{crypto}'
      this.videoCloudUser = { ...row.videoCloudUser }
    },
    deleteMulti() {
      var deleteList = []
      for (let i = 0; i < this.selectList.length; i++) {
        deleteList.push(this.selectList[i].videoCloudUser.fID)
      }
      deleteVideo(deleteList).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.drawer = false
          this.queryTable()
        } else {
          this.$message.error(res.data.message | '删除失败')
        }
      })
    },
    getToken() {
      if (this.selectList.length !== 1) {
        this.$message.error('请只选中一行来操作')
        return
      }
      this.drwTitle = '获取Token'
      this.excuteStatus = 'getToken'
      this.drawer = true
      this.videoCloudUser = { ...this.selectList[0].videoCloudUser }
    },
    selsChange(val) {
      this.selectList = val
    },
    selectProject() {
      queryProject().then(res => {
        if (res.data.code === 20000) {
          this.projectList = res.data.data
        }
      })
    },
    confirmSave() {
      if (this.excuteStatus==='getToken')
      {
            toGetToken(this.videoCloudUser).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
          else{
      this.$refs.form.validate(v => {
        if (v) {
          
        const PublicKey = '040ECAE82EA6BDC5FF6C90E6D8700F4F9BD44224E8F7F7576FA9B17CE823C18DD5C1D4F9CBF4EE23B3D3347C589036EE13E9497607D0F6C7B5CC655D0D250EDCE8'
          if (this.excuteStatus === 'add') {
          this.videoCloudUserAdd=JSON.parse(JSON.stringify(this.videoCloudUser))
          this.videoCloudUserAdd.fCreateID = Vue.getAcloudProvider().getUserInfo().id;
          //'{crypto}' + tool.Sm3Utils.sm3AndSm2EncryptRP(PublicKey, this.ruleForm.oldpassword, '|')
          this.videoCloudUserAdd.secret= '{crypto}' + smtool.Sm3Utils.sm3AndSm2EncryptRP(PublicKey,this.videoCloudUser.secret,'|')
          this.videoCloudUserAdd.fCloudPass= '{crypto}' + smtool.Sm3Utils.sm3AndSm2EncryptRP(PublicKey,this.videoCloudUser.fCloudPass,'|')
          
            addVideoAccout(this.videoCloudUserAdd).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '添加失败')
              }
            })
          } else if (this.excuteStatus === 'update') {
            
             this.videoCloudUserEdit=JSON.parse(JSON.stringify(this.videoCloudUser))
             if(this.videoCloudUser.secret==='{crypto}')
              {
                  this.videoCloudUserEdit.secret=this.infostrs
              }
              else {
                 this.videoCloudUserEdit.secret= '{crypto}' + smtool.Sm3Utils.sm3AndSm2EncryptRP(PublicKey,this.videoCloudUser.secret,'|')
              }
              if(this.videoCloudUser.fCloudPass==='{crypto}')
              {
                  this.videoCloudUserEdit.fCloudPass=this.infostrp
              }
              else {
                 this.videoCloudUserEdit.fCloudPass= '{crypto}' + smtool.Sm3Utils.sm3AndSm2EncryptRP(PublicKey,this.videoCloudUser.fCloudPass,'|')
              }

            updateVideo(this.videoCloudUserEdit).then(res => {
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
    }},

    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
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
div /deep/.el-drawer{
overflow:auto
}
</style>
