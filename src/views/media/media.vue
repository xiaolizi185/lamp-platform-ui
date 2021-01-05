<template>
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-tree :data="treeData" @node-click="handleNodeClick" />
      </el-col>

      <!-- audio/*	接受所有的声音文件。
               video/*	接受所有的视频文件。
               image/*	接受所有的图像文件。 -->
      <el-col :span="20">
        <div>
          <el-row>
            <el-col :span="2">
              <el-upload
                ref="uploadxls"
                accept="audio/*"
                class="upload-demo"
                action=""
                list-type="picture"
                :show-file-list="true"
                :before-upload="beforeUpload"
              >
                <el-button type="primary">上传音频</el-button>
              </el-upload>
            </el-col>
            <el-col :span="22">
              <el-button-group>
                <el-button type="primary" @click="add()">新增目录</el-button>
                <el-button type="primary" @click="update()">修改目录</el-button>
                <el-button type="primary" @click="deletes()">删除目录</el-button>
                <el-button type="primary" @click="reset()">重置</el-button>
              </el-button-group>
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
            <!-- <el-table-column show-overflow-tooltip prop="" label="文件编号" sortable /> -->
            <el-table-column show-overflow-tooltip prop="fileName" label="文件名称" sortable />
            <el-table-column show-overflow-tooltip prop="fileSize" label="文件大小" />
            <el-table-column show-overflow-tooltip prop="type" label="文件类型" />
            <el-table-column show-overflow-tooltip prop="duration" label="文件时长" />
            <el-table-column show-overflow-tooltip label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteFile(scope.row)">删除</el-button>
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
      </el-col>
    </el-row>
    <el-drawer
      :title="drwTitle"
      size="50%"
      :visible.sync="drawer"
      :destroy-on-close="true"
    >
      <el-form ref="form" :rules="model.rules" :model="objectEntity" label-width="100px">
        <el-form-item label="目录名称:" prop="dirName" class="form-item" :rules="model.rules.dirName">
          <el-input v-model="objectEntity.dirName" :maxlength="16" clearable placeholder="目录名称" />
        </el-form-item>
      </el-form>
      <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="drawer=false">返回</el-button>
      <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
    </el-drawer>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
import { getObjectEntity, addObjectEntity, updateObjectEntity, deleteObjectEntity, getFileList, fileDelete } from '@/views/media/mediaApi.js'
export default {
  components: {

  },
  filters: {

  },
  data() {
    return {
      searchKey: '',
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: false,
        dataList: []
      },
      treeData: [{
        'id': 1,
        'label': '全部',
        'children': []
      }],
      selectList: [],
      selectEntity: {},
      drawer: false,
      drwTitle: '添加目录',
      objectEntity: {},
      executeState: 'add',
      model: {
        rules: {
          dirName: [
            { required: true, message: '请输入目录名称。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
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
    // this.queryTable();
    this.querytrees()
	  },
  methods: {
    querytrees() {
      getObjectEntity().then(res => {
        if (res.data.code === 20000) {
          const tempList = res.data.data
          var children = []
          if (tempList != undefined && tempList.length > 0) {
            for (let i = 0; i < tempList.length; i++) {
              children.push({
                'id': tempList[i].fid,
                'label': tempList[i].dirName
              })
            }
            this.treeData[0].children = children
            this.selectEntity = children[0]
            this.queryTable()
          }
        }
      })
    },
    queryTable() {
      var req = {
        'nodeId': this.selectEntity.id,
        'fileName': this.searchKey,
        'delState': true
      }
      getFileList(this.tableData.params.currentPage, this.tableData.params.pageSize, req).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.rows
          this.tableData.total = res.data.data.total
        } else {
          this.$message.error(res.data.message || '查询失败')
        }
      })
    },
    handleNodeClick(data, e) {
      if (e.level == 2) {
        this.selectEntity = data
        console.log(this.selectEntity)
        this.queryTable()
      }
    },
    add() {
      this.drwTitle = '添加目录'
      this.drawer = true
      this.executeState = 'add'
      this.objectEntity = {}
    },
    update() {
      if (JSON.stringify(this.selectEntity) == '{}') {
        this.$message.error('请选中左边一行目录')
        return
      }
      this.drwTitle = '添加目录'
      this.drawer = true
      this.executeState = 'update'
      this.objectEntity = {
        'dirName': this.selectEntity.label,
        'fid': this.selectEntity.id
      }
    },
    deletes() {
      if (JSON.stringify(this.selectEntity) == '{}') {
        this.$message.error('请选中左边一行目录')
        return
      }
      deleteObjectEntity(this.selectEntity.id).then(res => {
        if (res.data.code == 20000) {
          this.$message.success(res.data.message)
          this.drawer = false
          this.queryTable()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
    },
    deleteFile(row) {
      fileDelete(row.fid).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    reset() {},

    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.executeState === 'add') {
            this.objectEntity.createId = Vue.getAcloudProvider().getUserInfo().id
            addObjectEntity(this.objectEntity).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '添加失败')
              }
            })
          } else if (this.executeState === 'update') {
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
    beforeUpload(file) {
      var that = this
      const file_url = this.$refs.uploadxlVideo.uploadFiles[0].url
      var videoEle = new Audio(file_url)
      var duration
      videoEle.addEventListener('loadedmetadata', function(_event) {
        duration = videoEle.duration
        var formData = new FormData()
        const fileType = 3
        const fileName = file.name
        const fileSize = file.size
        var isLt2M = file.size / 1024 / 1024 < 50
        if (!isLt2M) {
          // 判断大小
          this.$message.error('上传图片的大小不能超过 20MB。')
          that.$refs.uploadxls.uploadFiles = [] // 不符合就清空已选择的图片
          return
        }
        formData.append('fileName', fileName)
        formData.append('type', fileType)
        formData.append('fileSize', fileSize)
        formData.append('videoTime', duration)
        formData.append('createId', Vue.getAcloudProvider().getUserInfo().id)
        formData.append('nodeId', this.selectEntity.id)
        formData.append('file', file)

        addFile(formData).then(res => {
          if (res.data.code == 20000) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
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
    indexMethod(index) {
      return this.xuhao + index + 1
    },
    selsChange(val) {
      this.selectList = val
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
