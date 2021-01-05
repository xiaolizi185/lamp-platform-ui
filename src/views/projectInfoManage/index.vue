<template>
  <div class="app-container">
    <!--------------------------------------------------搜索栏--------------------------------------------------------------->
    <el-row>
      <el-col :span="4" style="margin-right: 20px">
        <assets-tree @getTreeInfo="getTreeInfo" />
      </el-col>
      <div id="station">
        <el-col class="table-content" :span="19">
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
              <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="drawer=true">添加项目</el-button>
              <el-button type="primary" style="background-color: #f48a60;border-color: #f48a60" @click="deleteProject">删除</el-button>
              <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34" @click="resumedrawer=true">恢复</el-button>
            </el-form-item>
            <el-form-item prop="fName" label="项目名称" style="font-family: 宋体">
              <el-input v-model="tableData.params.fName" :maxlength="20" placeholder="请输入项目名称进行检索" clearable style="width:250px;" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="background-color: #00a2ff;border-color: #00a2ff" @click="queryAll()">查询</el-button>
              <el-button type="primary" style="background-color: #00a2ff;border-color: #00a2ff" @click="resetQuery()">重置</el-button>
            </el-form-item>
          </el-form>
          <!---------------------------------------------表格------------------------------------------------------------------->
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
            <el-table-column show-overflow-tooltip prop="fName" label="项目名称" />
            <!-- <el-table-column show-overflow-tooltip prop="fDelState" label="删除状态" :formatter="formatDelState" /> -->
            <el-table-column show-overflow-tooltip prop="fLongitude" label="经度" />
            <el-table-column show-overflow-tooltip prop="fLatitude" label="纬度" />
            <el-table-column show-overflow-tooltip prop="fRemark" label="备注" />
            <el-table-column show-overflow-tooltip prop="fCreateTime" label="创建时间" :formatter="formatCreateDate" />
            <el-table-column show-overflow-tooltip label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="edit(scope.row)">修改</el-button>
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
        </el-col>
      </div>
      <!----------------------------------------------智慧照明-------------------------------------------------------->
      <el-col class="tab-content" :span="19">
        <div id="smartLight" style="display: none">
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
            <el-table-column show-overflow-tooltip prop="buse" label="策略状态" :formatter="formatPolicy">
              <!-- <template slot-scope="scope">
          <el-switch
            v-model="scope.row.buse"
            active-color="#13ce66"
            inactive-color="#dddddd"
            :active-value="1"
            :inactive-value="0"
            @change="changeSwitch(scope.row)"
          />
        </template> -->
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
      </el-col>
      <!---------------------------------------------灯杆信息-------------------------------------------------------->
      <el-col class="table-content" :span="19">
        <div id="light" style="display: none">
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
            <el-table-column show-overflow-tooltip prop="fname" label="灯杆名称" />
            <el-table-column show-overflow-tooltip prop="projectName" label="所属项目" />
            <el-table-column show-overflow-tooltip prop="lampTypeName" label="灯杆类型" />
            <el-table-column show-overflow-tooltip prop="finstallAddress" label="安装地址" />
            <el-table-column show-overflow-tooltip prop="flongitude" label="经度" :formatter="numfilter" />
            <el-table-column show-overflow-tooltip prop="f_Latitude" label="纬度" :formatter="numfilter" />
            <el-table-column show-overflow-tooltip prop="fremark" label="备注" />
            <el-table-column show-overflow-tooltip prop="fcreateTime" label="创建时间" :formatter="formatCreateDate" sortable />>
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
      </el-col>
      <!---------------------------------------------显示屏-------------------------------------------------------->
      <el-col class="table-content" :span="19">
        <div id="sysLeddevice" style="display: none">
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
            <el-table-column show-overflow-tooltip prop="deviceId" label="设备id" sortable />
            <el-table-column show-overflow-tooltip prop="name" label="名称" sortable />
            <el-table-column show-overflow-tooltip prop="ip" label="IP地址" />

            <el-table-column show-overflow-tooltip prop="projectName" label="所属项目" sortable />
            <!-- <el-table-column show-overflow-tooltip prop="width" label="宽度" />
        <el-table-column show-overflow-tooltip prop="height" label="高度" />
        <el-table-column show-overflow-tooltip prop="light" label="亮度" />
        <el-table-column show-overflow-tooltip prop="volnme" label="音量" /> -->
            <el-table-column show-overflow-tooltip prop="address" label="地址" />
            <el-table-column show-overflow-tooltip prop="username" label="创建人" />
            <!-- <el-table-column show-overflow-tooltip prop="status" label="状态" /> -->
            <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" />
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
      </el-col>
      <!---------------------------------------------垃圾桶-------------------------------------------------------->
      <el-col class="table-content" :span="19">
        <div id="trash" style="display: none">
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

            <el-table-column show-overflow-tooltip prop="alias" label="垃圾桶名称" sortable />
            <el-table-column show-overflow-tooltip prop="imei" label="序列号" sortable />
            <!-- <el-table-column show-overflow-tooltip prop="projectId" label="所属项目" :formatter="formatproj"/> -->
            <!-- <el-table-column show-overflow-tooltip prop="f_OnlineTime" label="上下线时间" /> -->
            <el-table-column show-overflow-tooltip prop="fullState" label="满空状态" :formatter="formatFS" />
            <el-table-column show-overflow-tooltip prop="powerState" label="电量状态" :formatter="formatP" />
            <!-- <el-table-column show-overflow-tooltip prop="batteryValue" label="电池电量" />
        <el-table-column show-overflow-tooltip prop="batteryVoltage" label="电池电压" /> -->
            <!-- <el-table-column show-overflow-tooltip prop="temperature" label="温度" /> -->
            <el-table-column show-overflow-tooltip prop="tiltAngle" label="倾角" :formatter="formatangle" />
            <!-- <el-table-column show-overflow-tooltip prop="rsrp" label="信号功率" />
        <el-table-column show-overflow-tooltip prop="remarks" label="备注" /> -->
            <el-table-column show-overflow-tooltip prop="createId" label="创建人" />
            <el-table-column show-overflow-tooltip prop="updateTime" label="创建时间" />
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
      </el-col>
      <!---------------------------------------------视频监控-------------------------------------------------------->
      <el-col class="table-content" :span="19">
        <div id="video" style="display: none">
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
            <el-table-column show-overflow-tooltip prop="videoHkInfo.fName" label="设备名称" sortable />
            <el-table-column show-overflow-tooltip prop="sysProject.fName" label="所属项目" sortable />
            <el-table-column show-overflow-tooltip prop="videoCloudUser.fName" label="视频账户" />
            <el-table-column show-overflow-tooltip prop="videoHkInfo.fSerial" label="序列号" />
            <el-table-column show-overflow-tooltip prop="videoHkInfo.validatecode" label="验证码" />
            <el-table-column show-overflow-tooltip prop="videoHkInfo.fDeviceaccount" label="设备账号" />
            <!-- <el-table-column show-overflow-tooltip prop="videoHkInfo.fDevicepass" label="设备密码" /> -->
            <!-- <el-table-column show-overflow-tooltip prop="videoHkInfo.devicestatus" label="设备状态" /> -->
            <!-- <el-table-column show-overflow-tooltip prop="videoHkInfo.livestatus" label="直播状态" /> -->
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
      </el-col>
      <!---------------------------------------------井盖管理-------------------------------------------------------->
      <el-col class="table-content" :span="19">
        <div id="wellliddevice" style="display: none">
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

            <el-table-column show-overflow-tooltip prop="fAlias" label="设备别名" sortable />
            <el-table-column show-overflow-tooltip prop="fImei" label="IMEI" sortable />
            <el-table-column show-overflow-tooltip prop="fProjectId" label="所属项目" />
            <el-table-column show-overflow-tooltip prop="fManholeCoverPositionState" label="井盖位置状态" :formatter="formatp" />
            <el-table-column
              show-overflow-tooltip
              prop="fLeanAngle"
              label="井盖倾斜角度"
              :formatter="formatangle"
            />
            <el-table-column show-overflow-tooltip prop="fWaterLevelState" label="水位状态" :formatter="formatw" />
            <el-table-column show-overflow-tooltip prop="fCreateTime" label="创建时间" />
            <el-table-column show-overflow-tooltip prop="fCreateID" label="创建人" />
            <el-table-column show-overflow-tooltip prop="address" label="地址" />
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
      </el-col>

      <el-col class="table-content" :span="19">
        <div id="project" style="display: none">
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
            <el-table-column show-overflow-tooltip prop="fName" label="项目名称" />
            <!-- <el-table-column show-overflow-tooltip prop="fDelState" label="删除状态" :formatter="formatDelState" /> -->
            <el-table-column show-overflow-tooltip prop="fLongitude" label="经度" />
            <el-table-column show-overflow-tooltip prop="fLatitude" label="纬度" />
            <el-table-column show-overflow-tooltip prop="fRemark" label="备注" />
            <el-table-column show-overflow-tooltip prop="fCreateTime" label="创建时间" :formatter="formatCreateDate" />
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
      </el-col>

    </el-row>
    <!--------------------------------------------------添加项目----------------------------------------------->
    <el-drawer
      v-if="drawer"
      ref="addProject"
      title="添加项目"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="drawer"
      size="50%"
      :direction="direction"
      :before-close="handleClose"
      destroy-on-close="true"
    >
      <add-project :drawer1="projectDrawer" :loaddata="getTableData" />
    </el-drawer>
    <!-----------------------------------------------恢复项目---------------------------------------------------->
    <el-drawer
      v-if="resumedrawer"
      ref="resumeProject1"
      title="恢复项目"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="resumedrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <resume-project :drawer="resumeProject" :loaddata="getTableData" />
    </el-drawer>
    <!-----------------------------------------------修改项目---------------------------------------------------->
    <el-drawer
      v-if="editdrawer"
      ref="editProjectDrawer"
      title="修改项目"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="editdrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
      :modal="false"
    >
      <edit-project :drawer="editProjectDrawer" :editparams="editParams" :loaddata="getTableData" />
    </el-drawer>
  </div>
</template>
<script>
import dateTool from '@/utils/date-tool'
import aTool from '@acloud/acloud-atool-js'
import addProject from './components/addProject'
import resumeProject from './components/resumeProject'
import editProject from './components/editProject'
import assetsTree from './components/assetsTree'
import $ from 'jquery'
import Vue from 'vue'
const paramFormRules = {
  fName: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: { resumeProject, addProject, editProject, assetsTree },
  data() {
    return {
      drawer: false,
      projectDrawer: this.$refs,
      resumedrawer: false,
      resumeProject: this.$refs,
      editProjectDrawer: this.$refs,
      editdrawer: false,
      editParams: '',
      projectId: '',
      tableChecked: [],
      tableData: {
        params: {
          fName: '',
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: true,
        dataList: [],
        paramFormRules
      }
    }
  },
  created() {
    this.getTableData()
  },
  // 查询分页信息
  methods: {
    formatp(row, column, state) {
      if (state === 0) { return '正常' } else { return '移动' }
    },
    formatw(row, column, state) {
      if (state === 0) { return '正常' } else { return '水满' }
    },
    formatFS(row, column, cellValue) {
      if (cellValue === 1) {
        return '满'
      } else {
        return '未满'
      }
    },

    formatP(row, column, cellValue) {
      if (cellValue === 1) {
        return '低电量'
      } else {
        return '正常'
      }
    },
    formatangle(row, column, cellValue) {
      if (cellValue === null) {
        return '0'
      } else {
        return cellValue
      }
    },
    getTableData() {
      const params = {
        'fName': this.tableData.params.fName,
        'fDelState': true,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      this.tableData.listLoading = true
      this.$axios.post('/acloud-lamppost/project/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.rows
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
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
    selsChange(val) {
      this.tableChecked = val
    },

    formatPolicy(row, column, cellValue) {
      if (cellValue === 1) {
        return '启用'
      } else {
        return '禁用'
      }
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    queryAll() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.tableData.params.currentPage = 1
          this.getTableData()
        }
      })
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
    formatp(row, column, state) {
      if (state === 0) { return '正常' } else { return '移动' }
    },
    formatw(row, column, state) {
      if (state === 0) { return '正常' } else { return '水满' }
    },

    formatangle(row, column, state) {
      if (state === null) { return '0' } else { return state }
    },
    // 重置
    resetQuery() {
      this.tableData.params.uname = null
      this.$refs.paramForm.resetFields()
      this.tableData.params.ccurrentPageurrentPage = 1
      this.tableData.params.pageSize = 10
      this.getTableData()
    },
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    },
    formatDelState(cellValue) {
      if (cellValue.fDelState === false) {
        return '已删除'
      } else {
        return '未删除'
      }
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
        if (rowIndex == 0) { // eslint-disable-line
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
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
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      } else {
        return ''
      }
    },
    getTreeInfo(checkNode) {
      this.projectId = checkNode[0].parentNode
      if (checkNode[0].childNode === '智慧照明') {
        this.tableData.dataList = []
        $('#smartLight').css('display', 'block')
        $('#station').css('display', 'none')
        $('#light').css('display', 'none')
        $('#sysLeddevice').css('display', 'none')
        $('#trash').css('display', 'none')
        $('#video').css('display', 'none')
        $('#wellliddevice').css('display', 'none')
        $('#project').css('display', 'none')
        this.tableData.listLoading = true
        const params = {
          'delstate': 1,
          'createId': Vue.getAcloudProvider().getUserInfo().id
        }
        this.tableData.listLoading = true
        let total = 0
        this.$axios.post('/acloud-lighting/station/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
          if (res.data.code === 20000) {
            for (let i = 0; i < res.data.data.rows.length; i++) {
              if (res.data.data.rows[i].projectID === checkNode[0].grandparentNode + '') {
                this.tableData.dataList = res.data.data.rows
                total = total + 1
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
              this.tableData.total = total
              this.tableData.listLoading = false
              this.loopSorts = res.data.data.rows
            }
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.tableData.listLoading = false
            this.tableData.dataList = []
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      } else if (checkNode[0].childNode === '灯杆') {
        this.tableData.dataList = []
        $('#light').css('display', 'block')
        $('#smartLight').css('display', 'none')
        $('#station').css('display', 'none')
        $('#sysLeddevice').css('display', 'none')
        $('#trash').css('display', 'none')
        $('#onecall').css('display', 'none')
        $('#video').css('display', 'none')
        $('#wellliddevice').css('display', 'none')
        $('#project').css('display', 'none')
        const params = {
          'fId': checkNode[0].parentNode,
          'createId': Vue.getAcloudProvider().getUserInfo().id
        }
        const url = '/acloud-lighting/lampPole/search?page=' + 1 + '&size=' + 10
        this.tableData.listLoading = true
        this.$axios.post(url, params).then(res => {
          if (res.data.code === 20000) {
            this.tableData.dataList = res.data.data.rows
            this.tableData.listLoading = false
            this.tableData.total = res.data.data.total
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.tableData.listLoading = false
            this.tableData.dataList = []
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      } else if (checkNode[0].childNode === '显示屏') {
        this.tableData.dataList = []
        $('#sysLeddevice').css('display', 'block')
        $('#smartLight').css('display', 'none')
        $('#station').css('display', 'none')
        $('#light').css('display', 'none')
        $('#trash').css('display', 'none')
        $('#video').css('display', 'none')
        $('#wellliddevice').css('display', 'none')
        $('#project').css('display', 'none')
        const params = {
          'delState': true,
          'name': this.searchName,
          'createId': Vue.getAcloudProvider().getUserInfo().id
        }
        this.tableData.listLoading = true
        let total = 0
        this.$axios.post('/acloud-display/LEDDevice/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
          if (res.data.code === 20000) {
            for (let i = 0; i < res.data.data.list.length; i++) {
              if (checkNode[0].grandparentNode === res.data.data.list[i].projectID) {
                this.tableData.dataList.push(res.data.data.list[i])
                total = total + 1
              }
              this.tableData.total = total
            }
            this.tableData.listLoading = false
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.tableData.listLoading = false
            this.tableData.dataList = []
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      } else if (checkNode[0].childNode === '垃圾桶') {
        this.tableData.dataList = []
        $('#trash').css('display', 'block')
        $('#smartLight').css('display', 'none')
        $('#station').css('display', 'none')
        $('#light').css('display', 'none')
        $('#sysLeddevice').css('display', 'none')
        $('#video').css('display', 'none')
        $('#wellliddevice').css('display', 'none')
        $('#project').css('display', 'none')
        this.tableData.listLoading = true
        const params = {
          delState: true,
          'createId': Vue.getAcloudProvider().getUserInfo().id
        }
        let total = 0
        this.$axios.post('/acloud-trash/trashSensorDevice/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
          if (res.data.code === 20000) {
            for (let i = 0; i < res.data.data.rows.length; i++) {
              if (checkNode[0].grandparentNode + '' === res.data.data.rows[i].projectId) {
                this.tableData.dataList.push(res.data.data.rows[i])
                total = total + 1
              }
            }
            this.tableData.total = total
            this.tableData.listLoading = false
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.tableData.listLoading = false
            this.tableData.dataList = []
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      } else if (checkNode[0].childNode === '安防监控') {
        this.tableData.dataList = []
        $('#video').css('display', 'block')
        $('#trash').css('display', 'none')
        $('#station').css('display', 'none')
        $('#smartLight').css('display', 'none')
        $('#light').css('display', 'none')
        $('#sysLeddevice').css('display', 'none')
        $('#wellliddevice').css('display', 'none')
        $('#project').css('display', 'none')
        this.tableData.listLoading = true
        let total = 0
        this.$axios.get('/acloud-lighting/VideoHkInfo/getVideoHkInfo?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize).then(res => {
          if (res.data.code === 20000) {
            for (let i = 0; i < res.data.data.list.length; i++) {
              if (checkNode[0].grandparentNode === res.data.data.list[i].sysProject.fID) {
                this.tableData.dataList.push(res.data.data.list[i])
                total = total + 1
              }
            }
            this.tableData.total = total
            this.tableData.listLoading = false
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.tableData.listLoading = false
            this.tableData.dataList = []
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      } else if (checkNode[0].childNode === '井盖') {
        this.tableData.dataList = []
        $('#wellliddevice').css('display', 'block')
        $('#video').css('display', 'none')
        $('#station').css('display', 'none')
        $('#trash').css('display', 'none')
        $('#smartLight').css('display', 'none')
        $('#light').css('display', 'none')
        $('#sysLeddevice').css('display', 'none')
        $('#project').css('display', 'none')
        let total = 0
        this.tableData.listLoading = true
        const req = {
          fDelState: 0,
          createId: Vue.getAcloudProvider().getUserInfo().id
        }
        this.$axios.post('/acloud-lighting/WelllidDevice/getWelllidDevice?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, req).then(res => {
          if (res.data.code === 20000) {
            for (let i = 0; i < res.data.data.list.length; i++) {
              if (checkNode[0].grandparentNode + '' === res.data.data.list[i].fProjectId) {
                this.tableData.dataList.push(res.data.data.list[i])
                total = total + 1
              }
            }
            this.tableData.total = total
            this.tableData.listLoading = false
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.tableData.listLoading = false
            this.tableData.dataList = []
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      } else if (checkNode[0].childNode === '项目') {
        this.tableData.dataList = []
        $('#wellliddevice').css('display', 'none')
        $('#video').css('display', 'none')
        $('#station').css('display', 'none')
        $('#trash').css('display', 'none')
        $('#smartLight').css('display', 'none')
        $('#light').css('display', 'none')
        $('#sysLeddevice').css('display', 'none')
        $('#project').css('display', 'block')
        const params = {
          'fId': checkNode[0].parentNode,
          'createId': Vue.getAcloudProvider().getUserInfo().id
        }
        this.$axios.post('/acloud-lamppost/project/search?page=' + 1 + '&size=' + 20, params).then(res => {
          if (res.data.code === 20000) {
            this.tableData.dataList = res.data.data.rows
            this.tableData.listLoading = false
            this.tableData.total = res.data.data.total
          }
        })
      } else if (checkNode[0].childNode === '资产管理') {
        this.tableData.dataList = []
        $('#station').css('display', 'block')
        $('#wellliddevice').css('display', 'none')
        $('#video').css('display', 'none')
        $('#trash').css('display', 'none')
        $('#smartLight').css('display', 'none')
        $('#light').css('display', 'none')
        $('#sysLeddevice').css('display', 'none')
        $('#project').css('display', 'none')
        const params = {
          'fName': this.tableData.params.fName,
          'fDelState': true,
          'createId': Vue.getAcloudProvider().getUserInfo().id
        }
        this.tableData.listLoading = true
        this.$axios.post('/acloud-lamppost/project/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
          if (res.data.code === 20000) {
            this.tableData.dataList = res.data.data.rows
            this.tableData.total = res.data.data.total
            this.tableData.listLoading = false
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.tableData.listLoading = false
            this.tableData.dataList = []
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      }
    },
    edit(row) {
      this.editParams = row
      this.editdrawer = true
    },
    deleteProject() {
      let delParams = ''
      // 删除
      if (this.tableChecked.length === 0) {
        this.$message.error('请选择删除数据。')
        return
      } else {
        for (let i = 0; i < this.tableChecked.length; i++) {
          if (this.tableChecked.length === 1) {
            delParams = this.tableChecked[i].fId
          } else {
            delParams += this.tableChecked[i].fId + ','
            const last = this.tableChecked[this.tableChecked.length - 1]
            if (last === this.tableChecked.length) {
              delParams = delParams.Substring(0, delParams.length - 1)
            }
          }
        }
        this.$axios.post('/acloud-lamppost/project/delete?autoId=' + delParams).then(res => {
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
    }
  }
}
</script>
<style scoped lang="scss">
  /deep/.el-table .success-row{
    background:rgb(228, 228, 228);
  }
  /deep/.el-dialog__close.el-icon.el-icon-close{
    color:black
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
