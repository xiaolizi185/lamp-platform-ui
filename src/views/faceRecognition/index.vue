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
            <el-button type="primary" style="background-color: #f48a60;border-color: #f48a60" @click="deleteType">删除</el-button>
          </el-form-item>
          <el-form-item prop="fName" label="搜索" style="font-family: 宋体">
            <el-input v-model="tableData.params.fName" :maxlength="10" placeholder="请输入年龄检索" clearable style="width:250px;" />
          </el-form-item>
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
      <el-table-column show-overflow-tooltip prop="deviceId" label="设备序列号" sortable />
      <el-table-column show-overflow-tooltip prop="age" label="年龄" sortable />
      <el-table-column show-overflow-tooltip prop="gender" label="性别" sortable :formatter="formategender" />
      <!-- <el-table-column show-overflow-tooltip prop="imgurl" label="图片路径" /> -->
      <el-table-column show-overflow-tooltip prop="imgurl" label="预览">
        <template slot-scope="scope">
          <img v-image-preview  v-bind:src="geturl(scope.row.imgurl)" min-width="50" height="50">
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="snapTime" label="抓拍时间" :formatter="formatCreateDate" />>
      <!-- <el-table-column show-overflow-tooltip prop="VisitCount" label="配对成功次数"  /> -->
     <el-table-column show-overflow-tooltip label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="save(scope.row)">保存</el-button>
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
</template>
<script>
import dateTool from '@/utils/date-tool'
import aTool from '@acloud/acloud-atool-js'
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
import Vue from 'vue'
import { mapGetters } from "vuex";
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
  data() {
    return {
      fileImgUrl: process.env.VUE_APP_FILE_URI,
      drawer: false,
      addTypeDrawer1: this.$refs,
      editTypeDrawer1: this.$refs,
      editdrawer: false,
      resumeTypedrawer: false,
      resumeTypeDrawer1: this.$refs,
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
      const params = {
        /* 'fName': this.tableData.params.fName,
        'fDelState': 1*/
        Age: this.tableData.params.fName
      }
      this.tableData.listLoading = true
      this.$axios.post('/acloud-file/faceInfo/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
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
    formategender(row, column, cellValue) {
      switch (parseInt(cellValue)) {
        case 0:
          return '男'
        case 1:
          return '女'
      }
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
    downloadIamge(imgsrc, name) {//下载图片地址和图片名
    var a = document.createElement("a"); // 生成一个a元素
    var event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = imgsrc; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
    },

    save(row) {
      
      // const url = this.geturl(row.imgurl)
      // // 这里是将url转成blob地址，
      // this.downloadIamge(url,row.imgurl)
    },
    deleteType() {
      const delParams = []
      var delParams2 =''
      // 删除
      if (this.tableChecked.length === 0) {
        this.$message.error('请选择删除数据。')
        return
      } else {

        for (let i = 0; i < this.tableChecked.length; i++) {
          if (this.tableChecked.length === 1) {
            delParams2 = this.tableChecked[i].imgurl
          } else {
            delParams2 += this.tableChecked[i].imgurl + ','
            const last = this.tableChecked[this.tableChecked.length - 1]
            if (last === this.tableChecked.length) {
              delParams2 = delParams2.Substring(0, delParams2.length - 1)
            }
          }
        }
        
         this.$axios
        .get(
          "/acloud-file-center/file/oper/remove?fileIds=" +
            delParams2
            // +
            // "&access_token=" +
            // this.token
        )
        .then((res) => 
        {
         debugger
          if (res.status === 200) {
            for (let i = 0; i < this.tableChecked.length; i++) 
            {
          delParams.push(this.tableChecked[i].imgurl)
            }
        const params = {
          'createId': Vue.getAcloudProvider().getUserInfo().id,
          'imgUrl': delParams
        }
        this.$axios.post('/acloud-file/faceInfo/deleteByImgUrl', params).then(res => {
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
        }}
        )

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
