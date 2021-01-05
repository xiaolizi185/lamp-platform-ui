<template>
  <div class="app-container">
    <!--------------------------------------------------搜索栏--------------------------------------------------------------->
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
            <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="drawer=true">添加</el-button>
            <el-button type="primary" style="background-color: #f48a60;border-color: #f48a60" @click="deleteLightInfo">删除</el-button>
            <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34" @click="resumeInfoDrawer=true">恢复</el-button>
          </el-form-item>
          <el-form-item prop="fName" label="类型名称" style="font-family: 宋体">
            <el-input v-model="tableData.params.fName" :maxlength="20" placeholder="请输入类型名称进行检索" clearable style="width:250px;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="background-color: #00a2ff;border-color: #00a2ff" @click="queryAll()">查询</el-button>
            <el-button type="primary" style="margin-top:3px;background-color: #00a2ff;border-color: #00a2ff" @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
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
      <!-- <el-table-column show-overflow-tooltip prop="fid" label="编号" sortable /> -->
      <el-table-column show-overflow-tooltip prop="fname" label="灯杆名称" />
      <el-table-column show-overflow-tooltip prop="projectName" label="所属项目" />
      <el-table-column show-overflow-tooltip prop="lampTypeName" label="灯杆类型" />
      <el-table-column show-overflow-tooltip prop="finstallAddress" label="安装地址" />
      <el-table-column show-overflow-tooltip prop="flongitude" label="经度" :formatter="numfilter"/>
      <el-table-column show-overflow-tooltip prop="f_Latitude" label="纬度" :formatter="numfilter"/>
      <!-- <el-table-column show-overflow-tooltip prop="fbUse" label="是否启用">
        <template slot-scope="scope">
          <span v-if="scope.row.fbUse === true"><el-button type="success" round>启用</el-button></span>
          <span v-else><el-button v-if="scope.row.fbUse === false" type="danger" round>禁用</el-button></span>
        </template>
      </el-table-column> -->
      <el-table-column show-overflow-tooltip prop="fremark" label="备注" />
      <el-table-column show-overflow-tooltip prop="fcreateTime" label="创建时间" :formatter="formatCreateDate" sortable />>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" @click="deviceConfig(scope.row)">设备配置</el-button>
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
    <!--------------------------------------------------添加灯杆信息----------------------------------------------->
    <el-drawer
      v-if="drawer"
      ref="addLightPoleDrawer"
      title="添加灯杆信息"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="drawer"
      size="50%"
      :direction="direction"
      :before-close="handleClose"
      destroy-on-close="true"
      :modal="false"
    >
      <add-light-pole-info :drawer="addLightPoleDrawer1" :loaddata="getTableData" />
    </el-drawer>
    <!-----------------------------------------------恢复灯杆类型---------------------------------------------------->
    <el-drawer
      v-if="resumeInfoDrawer"
      ref="resumeInfoDrawer1"
      title="恢复灯杆类型"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="resumeInfoDrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <resume-light-pole-info :drawer2="resumeInfoDrawer2" :loaddata="getTableData" />
    </el-drawer>
    <!-----------------------------------------------修改灯杆信息---------------------------------------------------->
    <el-drawer
      v-if="editdrawer"
      ref="editInfoDrawer"
      title="修改灯杆"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="editdrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
      :modal="false"
    >
      <editLightPoleInfo :drawer="editInfoDrawer1" :editparams="editParams" :loaddata="getTableData" />
    </el-drawer>

    <!-----------------------------------------------设备配置---------------------------------------------------->
    <el-drawer
      v-if="deviceConfigdrawer"
      ref="deviceConfigdrawer1"
      title="设备配置"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="deviceConfigdrawer"
      :direction="direction"
      size="65%"
      :before-close="handleClose"
      :destroy-on-close="true"
      :modal="false"
    >
      <deviceConfig :drawer="deviceConfigDrawer1" :editparams="editParams" :loaddata="getTableData" />
    </el-drawer>
  </div>
</template>
<script>
import dateTool from '@/utils/date-tool'
import aTool from '@acloud/acloud-atool-js'
import addLightPoleInfo from './components/addLightPoleInfo'
import resumeLightPoleInfo from './components/resumeLightPoleInfo'
import editLightPoleInfo from './components/editLightPoleInfo'
import deviceConfig from './components/deviceConfig'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
import Vue from 'vue'
Vue.use(VueDirectiveImagePreviewer)
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
  components: { addLightPoleInfo, resumeLightPoleInfo, editLightPoleInfo, deviceConfig },
  data() {
    return {
      drawer: false,
      addLightPoleDrawer1: this.$refs,
      editInfoDrawer1: this.$refs,
      editdrawer: false,
      resumeInfoDrawer: false,
      resumeInfoDrawer2: this.$refs,
      deviceConfigdrawer: false,
      deviceConfigDrawer1: this.$refs,
      editParams: '',
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
    getTableData() {
      const params = {
        'fName': this.tableData.params.fName,
        'createId': Vue.getAcloudProvider().getUserInfo().id,
        'fDelState': 1
      }
      this.tableData.listLoading = true
      this.$axios.post('/acloud-lighting/lampPole/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.rows
          for (let i = 0; i < res.data.data.rows.length; i++) {
            console.log(res.data.data.rows[i].fProjectId + '-----')
          }
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
    numfilter(row, column, cellValue){
        return parseFloat(cellValue).toFixed(2);
    },
    // 重置
    resetQuery() {
      this.tableData.params.fName = null
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
    edit(row) {
      this.editParams = row
      this.editdrawer = true
    },
    deviceConfig(row) {
      this.editParams = row
      this.deviceConfigdrawer = true
    },
    deleteLightInfo() {
      let delParams = ''
      // 删除
      if (this.tableChecked.length === 0) {
        this.$message.error('请选择删除数据。')
        return
      } else {

        
        for (let i = 0; i < this.tableChecked.length; i++) {
          if (this.tableChecked.length === 1) {
            delParams = this.tableChecked[i].fid
          } else {
            delParams += this.tableChecked[i].fid + ','
            const last = this.tableChecked[this.tableChecked.length - 1]
            if (last === this.tableChecked.length) {
              delParams = delParams.Substring(0, delParams.length - 1)
            }
          }
        }
        this.$axios.post('/acloud-lighting/lampPole/delete?autoId=' + delParams).then(res => {
          if (res.data.code === 20000) {
            this.$message.success('删除成功。')
            this.getTableData()
          } else {
            this.$message.error(res.data.message || '删除失败')
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
</style>
