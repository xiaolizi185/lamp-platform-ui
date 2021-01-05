<template>
  <div class="app-container">
    <div name="btnGroup">
      <el-row>
        <el-col :span="12">
          <el-button-group>
            <el-button type="primary" @click="add()">新增</el-button>
            <el-button type="primary" @click="deleteMulti()">删除</el-button>
            <el-button type="primary" @click="reset()">重置</el-button>
            <!--
               <el-button type="primary" >同步设备</el-button>
               <el-button type="primary" icon="el-icon-refresh-right">同步视频</el-button> -->
            <!-- <el-button type="primary" >...更多</el-button> -->
          </el-button-group>
        </el-col>
        <el-col :span="10">
          <el-input v-model="searchKey" :maxlength="200" clearable placeholder="请输入搜索条件" />
        </el-col>
        <el-col :span="2" style="padding-left:5px ;">
          <el-button type="primary" @click="search">查询</el-button>
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
        <el-table-column show-overflow-tooltip prop="uname" label="设备名称" sortable />
        <el-table-column show-overflow-tooltip prop="devID" label="设备id" sortable />
        <el-table-column show-overflow-tooltip prop="longitude" label="经度" />
        <el-table-column show-overflow-tooltip prop="latitude" label="纬度" />
        <el-table-column show-overflow-tooltip prop="temperature" label="温度" />
        <el-table-column show-overflow-tooltip prop="humidity" label="湿度" />
        <el-table-column show-overflow-tooltip prop="windSpeed" label="风速" />
        <el-table-column show-overflow-tooltip prop="windDirection" label="风向" />
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
      >

        <el-form ref="form" :rules="model.rules" :model="objectEntity" label-width="100px">
          <el-form-item label="设备编号:" prop="uname" class="form-item" :rules="model.rules.uname">
            <el-input v-model="objectEntity.uname" :maxlength="16" clearable placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item label="设备ID:" prop="devID" class="form-item" :rules="model.rules.devID">
            <el-input v-model="objectEntity.devID" :maxlength="16" clearable placeholder="请输入设备ID" />
          </el-form-item>
          <el-form-item label="经度:" prop="longitude" class="form-item" :rules="model.rules.longitude">
            <el-input v-model="objectEntity.longitude" :maxlength="16" clearable placeholder="请输入经度" @click.native="selectMap" />
          </el-form-item>
          <el-form-item label="纬度:" prop="latitude" class="form-item" :rules="model.rules.latitude">
            <el-input v-model="objectEntity.latitude" :maxlength="16" clearable placeholder="请输入纬度" @click.native="selectMap" />
          </el-form-item>
          <el-form-item label="地址:" prop="address" class="form-item" :rules="model.rules.address">
            <el-input v-model="objectEntity.address" :maxlength="16" clearable placeholder="请输入地址" />
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
import { getObjectEntity, addObjectEntity, updateObjectEntity, deleteObjectEntity } from '@/views/envirment/envirnment.js'
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
      searchKey: '',
      innerDrawer: false,
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: true,
        dataList: []
      },
      objectEntity: {},
      selectList: [],
      excuteStatus: 'add',
      drwTitle: '新增设备',
      drawer: false,
      model: {
        rules: {
          uname: [
            { required: true, message: '请输入设备编号。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          devID: [
            { required: true, message: '请输入设备名称。', trigger: 'change' },
            {
              required: true,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          longitude: [
            { required: true, message: '请选择经度。', trigger: 'change' }
          ],
          latitude: [
            { required: true, message: '请选择纬度。', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请选择地址。', trigger: 'change' }
          ]
        }
      }
    }
  },
  computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    }
  },
  created() {
    this.queryTable()
  },
  methods: {
    saveMapInfo(mapInfo) {
      this.objectEntity.longitude = mapInfo.lng
      this.objectEntity.latitude = mapInfo.lat
    },
    queryTable() {
      var req = {
        delState: true,
        uname: this.searchKey
      }
      getObjectEntity(req, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.rows
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        }
      })
    },
    search() {
      this.queryTable()
    },
    add() {
      this.drwTitle = '新增设备'
      this.drawer = true
      this.excuteStatus = 'add'
      this.objectEntity = {}
    },
    update(row) {
      this.drwTitle = '修改设备'
      this.drawer = true
      this.excuteStatus = 'update'
      this.objectEntity = { ...row }
    },
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.excuteStatus === 'add') {
            addObjectEntity(this.objectEntity).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '添加失败')
              }
            })
          } else if (this.excuteStatus === 'update') {
            updateObjectEntity(this.objectEntity).then(res => {
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
    deleteMulti() {
      var deleteList = []
      for (let i = 0; i < this.selectList.length; i++) {
        deleteList.push(this.selectList[i].f_ID)
      }
      deleteObjectEntity(deleteList).then(res => {
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
      this.tableData.params.currentPage = 1
      this.tableData.params.pageSize = 10
      this.searchKey = ''
      this.queryTable()
    },
    selsChange(e) {
      this.selectList = e
    },
    selectMap() {
      this.innerDrawer = true
    },
    indexMethod(index) {
      return this.xuhao + index + 1
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
      this.tableData.params.currentPage = 1
      this.queryTable()
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val
      this.queryTable()
    }
  }
}
</script>

<style scoped>

</style>
