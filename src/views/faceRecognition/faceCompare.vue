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
            <el-button type="primary" @click="faceCompare" style="background-color: #53c5a1;border-color: #53c5a1">人脸比对</el-button>
            <!--<el-button type="primary" @click="deleteType">删除</el-button>-->
          </el-form-item>
          <el-form-item prop="status" label="状态" style="font-family: 宋体">
            <el-select v-model="tableData.params.status" prop="status" placeholder="请选择状态" clearable>
              <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
         <!-- <el-form-item label="比对范围" prop="date" class="form-item">
            <el-date-picker
              v-model="tableData.params.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="queryAll()">查询</el-button>
            <el-button type="primary" style="margin-top:3px" @click="resetQuery()">重置</el-button>
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
      <el-table-column show-overflow-tooltip prop="similarity" label="预期匹配值" sortable />

      <!-- <el-table-column show-overflow-tooltip prop="starttime" label="搜索开始" sortable :formatter="formatCreateDate" />
      <el-table-column show-overflow-tooltip prop="endtime" label="搜索结束" sortable :formatter="formatCreateDate" />
      <el-table-column show-overflow-tooltip prop="imgurl" label="图片路径" /> -->
      <el-table-column show-overflow-tooltip prop="imgurl" label="预览">
        <template slot-scope="scope">
          <img v-image-preview  v-bind:src="geturl(scope.row.imgurl)" min-width="50" height="50">
        </template>
      </el-table-column>
       <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" sortable :formatter="formatCreateDate" />
      <el-table-column show-overflow-tooltip prop="status" label="任务状态" sortable :formatter="formateStatus" />
      <el-table-column show-overflow-tooltip label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="viewDetail(scope.row)">查看比对详情</el-button>
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

    <!----- 添加对比------->
    <el-drawer
      v-if="drawer"
      ref="addFaceCompare"
      title="比对详情"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="drawer"
      size="50%"
      :direction="direction"
      :before-close="handleClose"
      destroy-on-close="true"
      :modal="false"
    >
      <add-face-compare :drawer="addFaceCompare1" :loaddata="getTableData" />
    </el-drawer>

    <!----- 查看详情------->
    <el-drawer
      v-if="drawer1"
      ref="viewFaceCompare"
      title="比对详情"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="drawer1"
      size="50%"
      :direction="direction"
      :before-close="handleClose"
      destroy-on-close="true"
      :modal="false"
    >
      <view-face-compare :drawer="viewFaceCompare1" :loaddata="getTableData" :params="viewparams" />
    </el-drawer>

  </div>
</template>
<script>
import dateTool from '@/utils/date-tool'
import aTool from '@acloud/acloud-atool-js'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
import addFaceCompare from './components/addFaceCompare'
import viewFaceCompare from './components/viewFaceCompare'
import { mapGetters } from "vuex";
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
  components: { viewFaceCompare, addFaceCompare },
  data() {
    return {
      fileImgUrl: process.env.VUE_APP_FILE_URI,
      drawer: false,
      viewFaceCompare1: this.$refs,
      addFaceCompare1: this.$refs,
      drawer1: false,
      tableChecked: [],
      viewparams: '',
      statusList: [{
        'label': '未开始',
        'value': 0
      }, {
        'label': '正在计算',
        'value': 1
      }, {
        'label': '结束',
        'value': 2
      }],
      tableData: {
        params: {
          status: '',
          currentPage: 1,
          pageSize: 10,
          date: ''
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
  computed: {
    ...mapGetters(["token"]),
  },
  // 查询分页信息
  methods: {
     geturl(id) {
      var s = this.fileImgUrl + id + "&access_token=" + this.token;
      return s;
    },
    getTableData() {
      this.tableData.listLoading = true
      const params = {
        'status': this.tableData.params.status
      }
      this.$axios.post('/acloud-file/faceTask/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
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
      if (row.columnIndex === 3 && row.row.status === 2) {
        return 'color: #009578;'
      } else if (row.columnIndex === 3 && row.row.status === 0) {
        return 'color: red;'
      } else if (row.columnIndex === 3 && row.row.status === 1) {
        return 'color: orange;'
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
    faceCompare() {
      this.drawer = true
    },
    viewDetail(row) {
      this.drawer1 = true
      this.viewparams = row
    },
    formateStatus(cellValue) {
      switch (parseInt(cellValue.status)) {
        case 0:
          return '未开始'
        case 1:
          return '正在计算'
        case 2:
          return '结束'
      }
    },
    deleteType() {
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
        this.$axios.post('/acloud-lighting/LampPoleType/delete?auotId=' + delParams).then(res => {
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
  .parent{
    display: table-cell;
    text-align: center;
    vertical-align: middle;
  }

  .child{
    display: inline-block;
  }
</style>
