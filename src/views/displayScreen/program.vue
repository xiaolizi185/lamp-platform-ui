<template>
  <div class="app-container">
    <div name="btnGroup">
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
            <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="add()">增加</el-button>
            <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34" @click="del()">删除</el-button>
            <!--
          <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34" @click="passAudit()">审核</el-button>
          <el-button type="primary" style="background-color: #f48a60;border-color: #f48a60;margin-left: 10px" @click="cancelAudit()">取消审核</el-button> -->
          </el-form-item>
          <el-form-item prop="searchName">
            <el-input v-model="tableData.params.searchName" :maxlength="200" clearable placeholder="请输入搜索条件" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="query()">查询</el-button>
            <el-button type="primary" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form></el-row>
    </div>
    <div>
      <el-table
        v-loading="tableData.listLoading"
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
        <el-table-column show-overflow-tooltip prop="fName" label="节目名称" />

        <!-- <el-table-column show-overflow-tooltip prop="fAudit" label="是否审核">
          <template slot-scope="scope">
            {{ scope.row.fAudit ? "已审核" : "未审核" }}
          </template>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip prop="fCreateName" label="创建人" />
        <el-table-column show-overflow-tooltip prop="fCreateTime" label="创建时间" />
        <el-table-column show-overflow-tooltip prop="fRemarks" label="备注" />
        <!-- <el-table-column show-overflow-tooltip prop="fUpdateTime" label="修改时间" /> -->
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="updateRow(scope.row)">修改</el-button>
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
      <el-drawer :title="drwTitle" size="50%" :visible.sync="drawer" :destroy-on-close="true">
        <el-form ref="form" :rules="model.rules" :model="objectEntity" label-width="100px">
          <el-form-item label="节目名称:" prop="fName" class="form-item">
            <el-input v-model="objectEntity.fName" :maxlength="16" clearable placeholder="请输入节目名称" />
          </el-form-item>
          <el-form-item label="节目素材:" class="form-item">
            <el-button icon="el-icon-plus" @click="addMaterial()">添加素材</el-button>
          </el-form-item>
          <el-form-item class="form-item">
            <div>
              <el-table
                :header-cell-style="getRowClass"
                :row-class-name="tableRowClassName"
                :data="materialList"
                element-loading-text="Loading"
                border
                highlight-current-row
                style="width: 100%;margin-top: 10px;cursor: pointer"
                :cell-style="changeCellStyle"
              >
                <el-table-column show-overflow-tooltip prop="name" label="文件名" />
                <el-table-column show-overflow-tooltip prop="filesize" label="大小" :formatter="formatSize" />
                <el-table-column show-overflow-tooltip prop="type" label="类型">
                  <template slot-scope="scope">
                    <span>{{ scope.row.type | judgeType }}</span>
                    <span>
                      <img v-if="scope.row.type == 2" v-bind:src="geturl(scope.row.url)"  min-width="50" height="50">
                      <video v-if="scope.row.type == 3" v-bind:src="geturl(scope.row.url)" min-width="50" height="50" />
                    </span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="deleteMt(scope.row)">删除</el-button>
                    <!-- <el-button type="text" @click="selectP(scope.row)">选择参数</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="备注:" prop="fRemarks" class="form-item">
            <el-input v-model="objectEntity.fRemarks" type="textarea" :maxlength="16" clearable placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <el-drawer
          title="文件选择"
          size="50%"
          :append-to-body="true"
          :visible.sync="innerDrawer"
        >
          <programChild @materialInfo="materialInfo" />
          <div>
            <el-button style="margin-top: 12px;float: left;margin-left: 20px" type="primary" @click="innerDrawer=false">返回</el-button>
          </div>
        </el-drawer>
        <el-drawer
          title="参数选择"
          size="85%"
          :append-to-body="true"
          :visible.sync="selectDrawer"
        >
          <select-param :select-material="selectMaterial" @confirm="confirm" @back="back" />
        </el-drawer>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="drawer=false">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import programChild from '@/views/displayScreen/programChild.vue'
import selectParam from '@/views/displayScreen/selectParm.vue'
import { addProgram, updateProgram, getProgram, auditMultiply, selectMaterial } from '@/views/displayScreen/program.js'
const paramFormRules = {
  searchName: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: {
    programChild,
    selectParam
  },
  filters: {
    judgeType(param) {
      if (param == undefined || param == null || param == '') {
        return
      }
      if (param == 1) {
        return '文本'
      } else if (param == 2) {
        return '图片'
      } else if (param == 3) {
        return '视频'
      } else {
        return '其他'
      }
    }
  },
  data() {
    return {
      fileImgUrl: process.env.VUE_APP_FILE_URI,
		  tableData: {
		    params: {
		      currentPage: 1,
		      pageSize: 10,
          searchName: ''
		    },
        paramFormRules,
		    total: 0,
		    listLoading: false,
		    dataList: []
		  },
      selectMaterial: {},
      objectEntity: {
        ledPlayNode: []
      },
      selectList: [],
      drwTitle: '添加节目',
      excuteStatus: 'add',
      drawer: false,
      innerDrawer: false,
      selectDrawer: false,
      materialList: [],
      LEDMaterialExtends: [],
      ledPlayNode: {},
      model: {
        rules: {
          fName: [
            {
              required: true,
              message: '请输入节目名称。',
              trigger: 'change'
            },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }],
          fRemarks: [{
            pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }]
        }
      }
	  }
  },
   computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    },
    ...mapGetters([
      'token'
    ])
  },
  created() {
    this.queryTable()
	 },
  methods: {
     geturl(id){
      var s=this.fileImgUrl+id+'&access_token='+this.token
      return s
    },
    selsChange(val) {
      this.selectList = []
      if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          this.selectList.push(val[i])
        }
      }
    },
    query() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.queryTable()
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
            delList.push(this.selectList[i].fId.toString())
          }
        }
        const params = {
          createId: Vue.getAcloudProvider().getUserInfo().id,
          list: delList
        }

        this.$axios.post('/acloud-display/LedPlayList/deleteMul', params).then(res => {
          if (res.data.code === 20000) {
            this.$message.success('删除成功。')
            this.queryTable()
            this.selectList = []
          } else {
            this.$message.error('删除失败')
            return
          }
        }).catch(() => {
          this.$message.error('服务器繁忙。')
        })
      }
    },
    reset() {
      this.tableData.params.searchName = ''
      this.queryTable()
    },
    formatSize(row, column, fileSize) {
      if (fileSize < 1024) {
        return fileSize + 'B'
      } else if (fileSize < (1024 * 1024)) {
        var temp = fileSize / 1024
        temp = temp.toFixed(2)
        return temp + 'KB'
      } else if (fileSize < (1024 * 1024 * 1024)) {
        var temp = fileSize / (1024 * 1024)
        temp = temp.toFixed(2)
        return temp + 'MB'
      } else {
        var temp = fileSize / (1024 * 1024 * 1024)
        temp = temp.toFixed(2)
        return temp + 'GB'
      }
    },
    queryTable() {
      var searchparams = {
        'fName': this.tableData.params.searchName,
        'createId': Vue.getAcloudProvider().getUserInfo().id,
        'delstate': true
      }
      console.log(searchparams)
       getProgram(searchparams,this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
      // this.$axios.post('/acloud-display/LedPlayList/getLEDMaterial?page=' + this.tableData.params.currentPage +
      //     '&size=' + this.tableData.params.pageSize, searchparams).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        } else {
          this.$message.error(res.data.message || '查询失败')
          this.tableData.listLoading = false
          this.tableData.dataList = []
          return
        }
      })
    },
    search() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.queryTable()
        }
      })
    },
    passAudit() {
      if (this.selectList.length < 1) {
        this.$message.error('请只选中一行或多行来操作')
        return
      }
      var deleteList = []
      for (let i = 0; i < this.selectList.length; i++) {
        deleteList.push(this.selectList[i].fId)
      }
      const req = {
        fAudit: 1,
        deleteList: deleteList
      }
      auditMultiply(req).then(res => {
        if (res.data.code == 20000) {
          this.$message.success(res.data.message)
          this.queryTable()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
    },
    cancelAudit() {
      if (this.selectList.length < 1) {
        this.$message.error('请只选中一行或多行来操作')
        return
      }
      var deleteList = []
      for (let i = 0; i < this.selectList.length; i++) {
        deleteList.push(this.selectList[i].fId)
      }
      const req = {
        fAudit: 0,
        deleteList: deleteList
      }
      auditMultiply(req).then(res => {
        if (res.data.code == 20000) {
          this.$message.success(res.data.message)
          this.queryTable()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
    },
    add() {
      this.objectEntity = {
        ledPlayNode: []
      }
      this.materialList = []
      this.drwTitle = '添加节目'
      this.drawer = true
      this.excuteStatus = 'add'
    },
    updateRow(row) {
      this.drwTitle = '修改节目'
      this.drawer = true
      this.excuteStatus = 'update'
      this.objectEntity = {
        fId: row.fId,
        fName: row.fName,
        fRemarks: row.fRemarks,
        fAudit: row.fAudit,
        fCreateID: row.fCreateID,
        fCreateName: row.fCreateName,
        ledPlayNode: []
      }
      var ledMaterialExtends = row.ledPlayNode[0].ledMaterialList
      const req = {
        fId: row.fId,
        fAudit: row.fAudit
      }
      selectMaterial(req).then(res => {
        if (res.data.code == 20000) {
          this.materialList = res.data.data
          // 这里是和字符串反解出来的文件名对比
          for (let i = 0; i < this.materialList.length; i++) {
            for (let j = 0; j < ledMaterialExtends.length; j++) {
              if (this.materialList[i].name === ledMaterialExtends[j].name) {
                this.materialList[i].materialStatus = ledMaterialExtends[j].materialStatus
              }
            }
          }
        }
      })
    },
    materialInfo(info) {
      this.innerDrawer = false
      this.materialList.push(info)
    },
    confirm(info, row) {
      this.selectDrawer = false
      for (let i = 0; i < this.materialList.length; i++) {
        if (this.materialList[i].id == row.id) {
          this.materialList[i].materialStatus = info
          break
        }
      }
    },
    back() {
      this.selectDrawer = false
    },
    deleteMt(row) {
      var temp = -1
      for (let i = 0; i < this.materialList.length; i++) {
        if (this.materialList[i].id == row.id) {
          temp = i
          break
        }
      }
      this.materialList.splice(temp, 1)
    },
    selectP(row) {
      this.selectDrawer = true
      this.selectMaterial = row
    },
    addMaterial() {
      this.innerDrawer = true
    },
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.excuteStatus === 'add') {
            this.ledPlayNode.stayTime = 100
            this.ledPlayNode.ledMaterialExtends = this.materialList
            this.objectEntity.ledPlayNode[0] = this.ledPlayNode
            this.objectEntity.fCreateID = Vue.getAcloudProvider().getUserInfo().id
            this.objectEntity.fCreateName = Vue.getAcloudProvider().getUserInfo().username
            addProgram(this.objectEntity).then(res => {
              if (res.data.code == 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              }
            })
          } else {
            this.ledPlayNode.stayTime = 100
            this.ledPlayNode.ledMaterialExtends = this.materialList
            this.objectEntity.ledPlayNode[0] = this.ledPlayNode
            updateProgram(this.objectEntity).then(res => {
              if (res.data.code == 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              }
            })
          }
        }
      })
    },
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
    indexMethod(index) {
      return this.xuhao + index + 1
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
