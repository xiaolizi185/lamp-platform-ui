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
            <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="addDevice">新增设备</el-button>
            <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34" @click="downPolicy">配置策略</el-button>
            <el-button type="primary" @click="timeController">站点控制</el-button>
            <el-button type="primary" style="background-color: #f48a60;border-color: #f48a60" @click="deleteStation">删除设备</el-button>
            <!-- <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34" @click="resumedrawer=true">删除恢复</el-button> -->
            <!--<el-button type="primary" style="background-color: #9CF4EC;border-color: #9CF4EC" @click="lightManage()">关联监控识别</el-button>-->
          </el-form-item>
          <el-form-item prop="uname" label="关键字" style="font-family: 宋体">
            <el-input v-model="tableData.params.uname" :maxlength="20" placeholder="请输入站点名称进行检索" clearable style="width:250px;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryAll()">查询</el-button>
            <el-button type="primary" style="margin-top:3px" @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

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
      <el-table-column show-overflow-tooltip prop="ucode" label="编号" sortable />
      <el-table-column show-overflow-tooltip prop="projName" label="所属项目" sortable />
      <el-table-column show-overflow-tooltip prop="uname" label="站点名称" />
      <el-table-column show-overflow-tooltip prop="rtuType" label="产品型号" :formatter="formatRtuType" />
      <el-table-column show-overflow-tooltip prop="cname" label="创建人" />
      <el-table-column show-overflow-tooltip label="单灯状态">
        <template slot-scope="scope">

          <span v-for="(i,item) in scope.row.lampStates" :key="item">
            <el-tooltip placement="top">
              <div slot="content">序号：{{ scope.row.lampIndexs[item] }}<br>亮度:{{ i }}%</div>
              <span v-if="i == 0" class="circleGray" />
              <span v-else class="circleGreen" />
            </el-tooltip>
          </span>

        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" :formatter="formatCreateDate" />
      <el-table-column show-overflow-tooltip prop="remarks" label="备注" />
      <el-table-column show-overflow-tooltip prop="buse" label="策略状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.buse"
            active-color="#13ce66"
            inactive-color="#dddddd"
            :active-value="1"
            :inactive-value="0"
            @change="changeSwitch(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" @click="viewPolicy(scope.row)">策略查看</el-button>
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

    <el-drawer
      title="站点基本信息"
      :visible.sync="drawer"
      size="50%"
      :destroy-on-close="true"
    >
      <div>
        <el-steps :active="active" finish-status="success">
          <el-step title="网关信息" />
          <el-step title="单灯控制器" />
        </el-steps>
        <!--网关信息--->
        <div v-if="active===0" class="gatewayInfo">
          <!--<div style="margin-bottom: 10px"><span style="font-size: 16px">创建一个站点:</span><span style="font-size: 14px;color:#d0d0d0">请填写你的站点基本信息</span></div>-->
          <el-form ref="form" :rules="rules" :model="model" label-width="100px">
            <el-form-item label="站点名称" prop="uname" class="form-item">
              <el-input v-model="model.uname" :maxlength="16" clearable placeholder="请输入站点名称" />
            </el-form-item>
            <el-form-item label="项目名称" prop="projectid" class="form-item">
              <el-select v-model="model.projectid" placeholder="请选择项目" style="width: 100%" @change="changeProject(model.projectid)">
                <el-option
                  v-for="item in projectList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="集控类型" prop="rtutype" class="form-item">
              <el-select v-model="model.rtutype" placeholder="请选择集控类型" style="width: 100%" @change="changeRtuType(model.rtutype)">
                <el-option
                  v-for="item in rtuList"
                  :key="item.value"
                  :label="item.lable"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="编号" prop="ucode" class="form-item">
              <el-input v-model="model.ucode" :maxlength="200" clearable placeholder="请输入集控编号" @blur="checkUcode" />
            </el-form-item>
            <el-form-item label="经度" prop="maplongitude" class="form-item">
              <el-input v-model="model.maplongitude" :maxlength="200" clearable placeholder="请输入经度" @click.native="selectMap" />
            </el-form-item>
            <el-form-item label="纬度" prop="maplatitude" class="form-item">
              <el-input v-model="model.maplatitude" :maxlength="200" clearable placeholder="请输入纬度" @click.native="selectMap" />
            </el-form-item>
            <el-form-item label="安装地址" prop="address" class="form-item">
              <el-input
                v-model="model.address"
                type="textarea"
                maxlength="200"
                show-word-limit
                clearable
                placeholder="请输入地址"
              />
            </el-form-item>
            <!--<el-form-item label="摄像头设备" class="form-item">
              <el-select v-model="model.hkInfoId" placeholder="请选择">
                <el-option
                  v-for="item in hKInfoList"
                  :key="item.fId"
                  :label="item.fName"
                  :value="item.fId"
                />
              </el-select>
            </el-form-item>-->
            <el-form-item
              label="备注"
              prop="remarks"
              class="form-item"
            >
              <el-input
                v-model="model.remarks"
                type="textarea"
                maxlength="200"
                show-word-limit
                clearable
                placeholder="请输入相关备注信息"
              />
            </el-form-item>
          </el-form>
        </div>
        <div v-if="active===1" class="gatewayInfo">
          <!--回路信息-->
          <loop ref="childLoop" @selectedTableData="selectedTableData" />
        </div>
        <el-button v-if="active===1" style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
        <el-button v-if="active===1" style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="prev">上一步</el-button>
        <el-button v-if="active===0" style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="next">下一步</el-button>
      </div>
      <div>
        <!---嵌套的选择地图层-->
        <el-drawer
          ref="innerMapDrawer"
          size="80%"
          :append-to-body="true"
          :before-close="handleClose"
          :visible.sync="innerDrawer"
          :destroy-on-close="true"
        >
          <map-drawer :drawer="innerMapDrawer" @saveMapInfo="saveMapInfo" />
        </el-drawer>
      </div>
    </el-drawer>
    <!-----------------------------------------------修改站点---------------------------------------------------->
    <el-drawer
      v-if="editdrawer"
      ref="editStationDrawer"
      title="修改站点"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="editdrawer"
      :direction="direction"
      size="40%"
      :destroy-on-close="true"
    >
      <edit-web-site-drawer :drawer="editStationDrawer" :params="editParams" :loaddata="getTableData" :project-list="projectList" />
    </el-drawer>

    <!-----------------------------------------------恢复站点---------------------------------------------------->
    <el-drawer
      v-if="resumedrawer"
      ref="resumeStationDrawer1"
      title="恢复站点"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="resumedrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <resume-w-ebsite-drawer :drawer="resumeStationDrawer" :params="editParams" :loaddata="getTableData" />
    </el-drawer>
    <!-----------------------------------------------下发策略---------------------------------------------------->
    <el-drawer
      v-if="downPolicyDrawer"
      ref="downPolicyDrawer"
      title="下发策略"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="downPolicyDrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <down-policy :drawer="downPolicyDrawer1" :loaddata="getTableData" :checked-value="tableChecked" />
    </el-drawer>
    <!-----------------------------------------------实时控制---------------------------------------------------->
    <el-drawer
      v-if="controllDrawer"
      ref="controlltimeDrawer"
      title="实时控制"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="controllDrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <controllintime :drawer="controlltimeDrawer" :loaddata="getTableData" :loop-sorts="loopSorts" :checked-value="tableChecked" />
    </el-drawer>
    <el-drawer
      v-if="viewDrawer"
      ref="viewPolicyDrawer"
      title="策略查看"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="viewDrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <view-policy :drawer="viewPolicyDrawer" :loaddata="getTableData" :params="editParams" />
    </el-drawer>
    <!--------------------------------------------照明策略管理---------------------------------------------------->
    <!--<el-drawer
      v-if="lightManageFlag"
      ref="lightManageDrawer"
      title="关联监控识别"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="lightManageFlag"
      size="60%"
      :destroy-on-close="true"
    >
      <lightManage :drawer="lightManageDrawer" :loop-sorts="loopSorts" :checked-value="tableChecked" />
    </el-drawer>-->
  </div>
</template>
<script>
import dateTool from '@/utils/date-tool'
import aTool from '@acloud/acloud-atool-js'
import mapDrawer from './components/mapDrawer'
import resumeWEbsiteDrawer from './components/resumeWebsite'
import loop from './components/loop'
import editWebSiteDrawer from './components/editWebSite'
import downPolicy from './components/downPolicy'
import controllintime from './components/controllintime'
import viewPolicy from './components/viewPolicy'
/* import lightManage from '@/views/websiteManage/components/lightManage.vue'*/
import Vue from 'vue'
const paramFormRules = {
  uname: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: { mapDrawer, loop, editWebSiteDrawer, resumeWEbsiteDrawer, downPolicy, controllintime, viewPolicy },
  data() {
    return {
      tableChecked: [], // 被选中的记录数
      selecteTabelData: [], // 子组件传回来的数据
      innerMapDrawer: this.$refs,
      drawer: false,
      resumedrawer: false,
      innerDrawer: false,
      downPolicyDrawer: false,
      controllDrawer: false,
      lightManageFlag: false,
      viewDrawer: false,
      stationdrawer: this.$refs,
      editStationDrawer: this.$refs,
      resumeStationDrawer: this.$refs,
      downPolicyDrawer1: this.$refs,
      controlltimeDrawer: this.$refs,
      viewPolicyDrawer: this.$refs,
      lightManageDrawer: {},
      loopSorts: '',
      editdrawer: false,
      selectedRtuType: '',
      rtuList: [],
      projectList: [],
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
      hKInfoList: [],
      active: 0,
      mapDrawer1: this.$refs,
      mapDrawer: false,
      model: {
        uname: '',
        projectid: '',
        rtutype: '',
        ucode: '',
        maplongitude: '',
        maplatitude: '',
        address: ''
      },
      rules: {
        uname: [
          { required: true, message: '请输入站点名称。', trigger: 'change' },
          {
            pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }
        ],
        ucode: [
          { required: true, message: '请输入编号。', trigger: 'change' },
          {
            pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          },
          {
            pattern: aTool.RegexHelper.constants.number.value,
            message: '只能输入数字。',
            trigger: 'change'
          }
        ],
        address: [
          { required: true, message: '请输入安装地址。', trigger: 'change' }
        ],
        remarks: [
          {
            pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }
        ],
        projectid: [
          { required: true, message: '请选择所在项目。', trigger: 'change' }
        ],
        rtutype: [
          { required: true, message: '请选择集控类型。', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getTableData()
    this.getRtuTypeList()
    this.getProjectInfo()
    this.getHkInfo()
  },
  methods: {
    addDevice(){

        this.drawer=true

    },
    // 查询分页信息
    getTableData() {
      const params = {
        'uname': this.tableData.params.uname,
        'ucode': this.tableData.params.ucode,
        'rtutype': this.tableData.params.rtutype,
        'delstate': 1,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      this.tableData.listLoading = true
      this.$axios.post('/acloud-lighting/station/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.rows
          for (let i = 0; i < this.tableData.dataList.length; i++) {
            var temp = []
            if (this.tableData.dataList[i].lampStates != null && this.tableData.dataList[i].lampStates !== undefined) {
              temp = this.tableData.dataList[i].lampStates.split(',')
            }
            this.tableData.dataList[i].lampStates = temp
            var temp1 = []
            if (this.tableData.dataList[i].lampIndexs != null && this.tableData.dataList[i].lampIndexs !== undefined) {
              temp1 = this.tableData.dataList[i].lampIndexs.split(',')
            }
            this.tableData.dataList[i].lampIndexs = temp1
          }
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
          this.loopSorts = res.data.data.rows
        } else {
          this.$message.error(res.data.message || '查询失败')
          this.tableData.listLoading = false
          this.tableData.dataList = []
          return
        }
      }).catch(() => {
        this.$message.error('服务器繁忙。')
      })
    },
    // 检查集控编号是否存在
    checkUcode() {
      this.$axios.get('/acloud-lighting/station/findByUCode?uCode=' + this.model.ucode).then(res => {
        if (res.data.code !== 20000) {
          this.$message.error(res.data.message)
          this.model.ucode = ''
          return
        }
      })
    },
    getHkInfo() {
      this.$axios.get('/acloud-lighting/VideoHkInfo/getAll').then(res => {
        this.hKInfoList = res.data.data
      })
    },
    refreshState() {
      if (this.tableChecked.length !== 1) {
        this.$message.error('请只选择一行')
        return
      }
      this.$axios.get('/acloud-lighting/stationSingleLamp/findByStationNum?stationNum=' + this.tableChecked[0].ucode).then(res => {
        if (res.data.code === 20000) {
          var temp1 = res.data.data[0]
          for (let i = 0; i < this.tableData.dataList.length; i++) {
            if (this.tableData.dataList[i] === this.tableChecked[0]) {
              var index = []
              index.push(temp1.lampIndex)
              var state = []
              state.push(temp1.lux)
              this.tableData.dataList[i].lampIndexs = index
              this.tableData.dataList[i].lampStates = state
              break
            }
          }
          this.$forceUpdate()
        }
      })
    },
    queryAll() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.tableData.params.currentPage = 1
          this.getTableData()
        }
      })
    },
    /*  lightManage() {
      if (this.tableChecked.length !== 1) {
        this.$message.error('请只选中一行处理')
        return
      }
      this.lightManageDrawer = this.tableChecked[0]
      this.lightManageFlag = true
    },*/
    getProjectInfo() {
      const params = {
        'fDelState': true,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      this.$axios.post('/acloud-lamppost/project/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
        if (res.data.code === 20000) {
          for (let i = 0; i < res.data.data.rows.length; i++) {
            this.projectList.push({
              'label': res.data.data.rows[i].fName,
              'value': res.data.data.rows[i].fId
            })
          }
        } else {
          this.$message.error(res.data.message || '查询失败')
          return
        }
      }).catch(() => {
        this.$message.error('服务器繁忙。')
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    },
    // 重置
    resetQuery() {
      this.tableData.params.uname = null
      this.$refs.paramForm.resetFields()
      this.tableData.params.ccurrentPageurrentPage = 1
      this.tableData.params.pageSize = 10
      this.getTableData()
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    tableRowClassName({ rowIndex }) {
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
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val
      this.getTableData()
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    formatRtuType(row, column, cellValue) {
      if (cellValue === '003') {
        return '单灯'
      } else if (cellValue === '002') {
        return 'T212'
      } else if (cellValue === '001') {
        return 'G608'
      } else {
        return '智能盒'
      }
    },
    selsChange(val) {
      this.tableChecked = val
    },
    changeRtuType(rtutype) {
      this.model.rtutype = rtutype
    },
    changeProject(projectId) {
      this.model.projectid = projectId
    },
    downPolicy() {
      if (this.tableChecked.length === 0) {
        this.$message.error('请选择数据')
        return
      } else {
        this.downPolicyDrawer = true
      }
    },
    deleteStation() {
      let delParams = ''
      // 删除
      if (this.tableChecked.length === 0) {
        this.$message.error('请选择删除数据。')
        return
      } else {
        for (let i = 0; i < this.tableChecked.length; i++) {
          if (this.tableChecked.length === 1) {
            delParams = this.tableChecked[i].autoId
          } else {
            delParams += this.tableChecked[i].autoId + ','
            const last = this.tableChecked[this.tableChecked.length - 1]
            if (last === this.tableChecked.length) {
              delParams = delParams.Substring(0, delParams.length - 1)
            }
          }
        }

        debugger
        this.$axios.post('/acloud-lighting/station/delete?autoId=' +delParams).then(res => {
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

    prev() {
      --this.active
      if (this.active < 0) this.active = 0
    },
    next() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.active++ > 2) this.active = 0
        }
      })
    },
    // 获取产品型号
    getRtuTypeList() {
      this.$axios.get('/acloud-lighting/userdisk/findAll').then(res => {
        if (res.data.code === 20000) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].itemtype === 'Rtu类型') {
              this.rtuList.push({
                'value': res.data.data[i].ucode,
                'lable': res.data.data[i].uname
              })
            }
          }
        } else {
          this.rtuList = []
          return
        }
      })
    },
    // 选择经纬度
    selectMap() {
      this.innerDrawer = true
    },
    saveMapInfo(mapInfo) {
      this.model.maplongitude = mapInfo.lng
      this.model.maplatitude = mapInfo.lat
      this.model.address = mapInfo.address
    },
    selectedTableData(selectedTableData) {
      this.selecteTabelData = selectedTableData
    },
    // 保存站点基本信息
    confirmSave() {
      // 调取子组件的方法 subSingle()
      this.$refs.childLoop.subSingle()
      console.log(this.selecteTabelData)
      this.$refs.paramForm.validate(v => {
        if (v) {
          const finalSelectedData = this.selecteTabelData[0]
          const station = {
            'projectid': this.model.projectid,
            'ucode': this.model.ucode,
            'uname': this.model.uname,
            'rtutype': this.model.rtutype,
            'address': this.model.address,
            'maplongitude': this.model.maplongitude,
            'maplatitude': this.model.maplatitude,
            'createid': Vue.getAcloudProvider().getUserInfo().id,
            'createtime': new Date().getTime(),
            'remarks': this.model.remarks,
            'delstate': 1,
            'buse': 1
          }
          const params = {
            'station': station,
            'stationSingleLampList': this.selecteTabelData
          }
          this.$axios.post('/acloud-lighting/station/add', params).then(res => {
            if (res.data.code === 20000) {
              this.$message.success('添加成功')
              this.getTableData()
              this.drawer = false
            } else {
              this.$message.error(res.data.message)
              this.drawer = false
              return
            }
          }).catch(() => {
            this.$message.error('添加失败。')
            this.drawer = false
            return
          })
        }
      })
    },
    edit(rows) {
      // 修改页面
      this.editdrawer = true
      this.editParams = rows
    },
    viewPolicy(rows) {
      this.viewDrawer = true
      this.editParams = rows
    },
    formatState(row) {
      const str = row.loopstates
      if (str !== '' && str !== null) {
        if (str.indexOf('0') !== -1 && str.indexOf('1') !== -1 && str.indexOf('2') !== -1) {
          return '关闭,开启，故障'
        } else if (str.indexOf('0') !== -1 && str.indexOf('1') !== -1) {
          return '关闭,开启'
        } else if (str.indexOf('0') !== -1 && str.indexOf('2') !== -1) {
          return '关闭,故障'
        } else if (str.indexOf('1') !== -1 && str.indexOf('2') !== -1) {
          return '开启,故障'
        } else if (str.indexOf('1') !== -1) {
          return '开启'
        } else if (str.indexOf('0') !== -1) {
          return '关闭'
        } else if (str.indexOf('2') !== -1) {
          return '故障'
        }
      }
    },
    timeController() {
      if (this.tableChecked.length !== 1) {
        this.$message.error('请只选择一行数据。')
        return
      } else {
        var temp = this.tableChecked[0].ucode
        this.loopSorts = temp
        this.controllDrawer = true
      }
    },
    changeSwitch(data) {
      if (data.buse === 0) {
        this.$confirm('策略使用中，禁用后将不再对外提供服务，是否继续禁用？', '提示', {
          confirmButtonText: '禁用',
          cancelButtonText: '取消',
          type: 'info',
          callback: action => {
            if (action === 'confirm') {
              this.$axios.post('/acloud-lighting/stationsetlist/update?autoId=' + data.autoId).then(res => {
                if (res.data.code === 20000) {
                  this.$message.success('策略禁用成功。')
                  this.getTableData()
                  return
                } else {
                  this.$message.error(res.data.message)
                  return
                }
              })
            } else {
              this.getTableData()
            }
          }
        })
      } else {
        this.tableData.listLoading = true
        this.$axios.post('/acloud-lighting/stationsetlist/update?autoId=' + data.autoId).then(res => {
          if (res.data.code === 20000) {
            this.$message.success('策略启用成功。')
            this.tableData.listLoading = false
            this.getTableData()
            return
          } else {
            this.$message.error(res.data.message)
            this.tableData.listLoading = false
            this.getTableData()
            return
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/.el-table .success-row{
    background:rgb(228, 228, 228);
  }
  .el-loading-mask {
    left:210px !important;
  }
  /deep/.el-dialog__close.el-icon.el-icon-close{
    color:black
  }
  /deep/.el-table .success-row{
    background:rgb(228, 228, 228);
  }
  .red-point{
    position: relative;
  }
  .red-point::before{
    content: "关闭 ";
    border: 5px solid red;/*设置红色*/
    border-radius:3px;/*设置圆角*/
    position: absolute;
    z-index: 1000;
    right: 0;
    margin-right: -8px;
  }
  .circleGray {
    height: 10px;
    width: 10px;
    display: inline-block;
    border-radius: 5px;
    background-color: gray;
  }
  .circleGreen {
    height: 10px;
    width: 10px;
    display: inline-block;
    border-radius: 5px;
    background-color: green;
  }

</style>
