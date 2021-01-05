<template>
  <div class="app-container">
    <div name="buttonGroup">
      <el-row>
        <el-col :span="10">
          <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="add()">新增</el-button>
          <el-button type="primary" style="background-color: #f48a60;border-color: #f48a60" @click="deleteMulti()">删除</el-button>
          <!--
            <el-button type="primary" >同步设备</el-button>
            <el-button type="primary" icon="el-icon-refresh-right">同步视频</el-button> -->
          <!-- <el-button type="primary" >...更多</el-button> -->
        </el-col>
        <el-col :span="10">
          <el-input v-model="alias" :maxlength="30" clearable placeholder="请输入设备名称" />
        </el-col>
        <el-col :span="4" style="padding-left:5px ;">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button type="primary" @click="reset()">重置</el-button>
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
        <el-table-column show-overflow-tooltip prop="alias" label="垃圾桶名称" sortable />
        <el-table-column show-overflow-tooltip prop="imei" label="序列号" sortable />
        <el-table-column show-overflow-tooltip prop="projName" label="所属项目" />
        <!-- <el-table-column show-overflow-tooltip prop="f_OnlineTime" label="上下线时间" /> -->
        <el-table-column show-overflow-tooltip prop="fullState" label="满空状态" :formatter="formatFS" />
        <el-table-column show-overflow-tooltip prop="powerState" label="电量状态" :formatter="formatP" />
        <!-- <el-table-column show-overflow-tooltip prop="batteryValue" label="电池电量" />
        <el-table-column show-overflow-tooltip prop="batteryVoltage" label="电池电压" /> -->
        <!-- <el-table-column show-overflow-tooltip prop="temperature" label="温度" /> -->
        <el-table-column show-overflow-tooltip prop="tiltAngle" label="倾角" :formatter="formatangle" />
        <!-- <el-table-column show-overflow-tooltip prop="rsrp" label="信号功率" />
        <el-table-column show-overflow-tooltip prop="remarks" label="备注" /> -->
        <el-table-column show-overflow-tooltip prop="cName" label="创建人" />
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" />
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

        <el-form ref="form" :rules="model.rules" :model="trashCan" label-width="100px">
          <el-form-item v-show="excuteStatus != 'getToken'" label="设备名称:" prop="alias" class="form-item" :rules="model.rules.alias">
            <el-input v-model="trashCan.alias" :maxlength="16" clearable placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="imei号:" prop="imei" class="form-item" :rules="model.rules.imei">
            <el-input v-model="trashCan.imei" :maxlength="16" clearable placeholder="请输入imei号" />
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="项目:" prop="projectId" class="form-item" :rules="model.rules.projectId">
            <el-select v-model="trashCan.projectId" placeholder="请选择">
              <el-option
                v-for="pj in projectList"
                :key="pj.fID.toString()"
                :label="pj.fName"
                :value="pj.fID.toString()"
              />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="经度:" class="form-item" prop="longitude" :rules="model.rules.longitude">
                <el-input v-model="trashCan.longitude" :maxlength="30" clearable placeholder="请输入" @click.native="selectMap" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度:" class="form-item" prop="latitude" :rules="model.rules.latitude">
                <el-input v-model="trashCan.latitude" :maxlength="30" clearable placeholder="请输入" @click.native="selectMap" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="地址:" prop="address" class="form-item" :rules="model.rules.address">
            <el-input v-model="trashCan.address" :maxlength="16" clearable placeholder="请输入地址" @click.native="selectMap" />
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="备注:" prop="remarks" class="form-item" :rules="model.rules.remarks">
            <el-input
              v-model="trashCan.remarks"
              type="textarea"
              maxlength="200"
              show-word-limit
              clearable
              placeholder="请输入相关备注信息"
            />
          </el-form-item>
        </el-form>
        <el-drawer
          ref="innerMapDrawer"
          size="80%"
          :append-to-body="true"
          :visible.sync="innerDrawer"
        >
          <map-drawer :drawer="innerMapDrawer1" @saveMapInfo="saveMapInfo" />
        </el-drawer>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="drawer=false">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { gettrashCan, addtrashCan, updatetrashCan, deletetrashCan } from '@/views/trashCan/trashCan.js'
import { queryProject } from '@/views/videoMonitor/videoAccount/videoM.js'
import mapDrawer from '@/views/websiteManage/components/mapDrawer'
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
export default {
  components: {
    mapDrawer
  },
  filters: {

  },
  data() {
    return {
      innerMapDrawer1: this.$refs,
      alias: '',
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: true,
        dataList: []
      },
      selObj: {},
      selectList: [],
      projectList: [],
      trashCan: {},
      excuteStatus: 'add',
      drwTitle: '新增呼叫设备',
      drawer: false,
      model: {
        rules: {
          alias: [
            { required: true, message: '请输入设备编号。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          imei: [
            { required: true, message: '请输入设备编号。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              required: true, message: '不能输入特殊字符',
              trigger: 'change' }
          ],
          projectId: [
            { required: true, message: '请选择项目。', trigger: 'change' }
          ],
          longitude: [
            {
              required: true,
              message: '请输入经度。',
              trigger: 'change'
            }
          ],
          latitude: [
            {
              required: true,
              message: '请输入维度。',
              trigger: 'change'
            }
          ],
          address: [
            {
              required: true,
              message: '请输入地址。',
              trigger: 'change'
            }
          ]
        }
      },
      innerDrawer: false
	  }
  },
  computed: {
	 xuhao() {
	   return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
	 }
  },
  created() {
    this.selectProject()
    this.queryTable()
	  },
  methods: {
    search() {
      this.queryTable()
    },
    selectProject() {
      queryProject().then(res => {
        if (res.data.code === 20000) {
          this.projectList = res.data.data
        }
      })
    },
    saveMapInfo(mapInfo) {
      this.trashCan.longitude = mapInfo.lng
      this.trashCan.latitude = mapInfo.lat
      this.trashCan.address = mapInfo.address
    },
    formatFS(row, column, cellValue) {
      if (cellValue === 1) {
        return '满'
      } else   if (cellValue === 0){
        return '未满'
      }
       else{ return '未知'}
    },

    formatP(row, column, cellValue) {
      if (cellValue === 1) {
        return '低电量'
      } else  if (cellValue === 0){
        return '正常'
      }
       else{ return '未知'}
    },
    formatangle(row, column, cellValue) {
      if (cellValue === null) {
        return '0'
      } else {
        return cellValue
      }
    },
    queryTable() {
      var tempObj = {
        delState: true,
        alias: this.alias,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      gettrashCan(tempObj, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.rows
          this.tableData.total = res.data.total
          this.tableData.listLoading = false
        }
      })
    },
    add() {
      this.trashCan = {}
      this.drwTitle = '呼叫设备添加'
      this.drawer = true
      this.excuteStatus = 'add'
    },
    update(row) {
      this.selObj = row
      this.drwTitle = '修改'
      this.drawer = true
      this.excuteStatus = 'update'
      this.trashCan = { ...row }
    },
    deleteMulti() {
      var deleteStr = ''
      for (let i = 0; i < this.selectList.length; i++) {
        deleteStr += this.selectList[i].fId + ','
      }
      deleteStr = deleteStr.substring(0, deleteStr.length - 1)
      deletetrashCan(deleteStr).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.drawer = false
          this.queryTable()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
    },
    reset() {

      this.alias=''
      this.queryTable()
    },
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.excuteStatus === 'add') {
            this.trashCan.createId = Vue.getAcloudProvider().getUserInfo().id
            addtrashCan(this.trashCan).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '添加失败')
              }
            })
          } else if (this.excuteStatus === 'update') {
            this.trashCan.id = this.trashCan.fId;
            delete this.trashCan.fId;
            updatetrashCan(this.trashCan).then(res => {
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
