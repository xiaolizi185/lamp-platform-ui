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
            <el-button-group>
              <el-dropdown @command="handleCommand">
                <el-button type="primary">
                  上传素材<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="text">
                    <!-- <el-button size="small" type="text" @click="uploadtext()">文本上传</el-button> -->
                    <el-upload
                      class="upload-demo"
                      action=""
                      accept=".txt"
                      list-type="text"
                      :on-change="handleChangeText"
                      :before-upload="beforeUploadtxt"
                      :limit="1"
                    >
                      <el-button
                        size="small"
                        type="text"
                      >上传文本</el-button>
                    </el-upload>
                  </el-dropdown-item>
                  <el-dropdown-item command="picture">
                    <el-upload
                      class="upload-demo"
                      action=""
                      accept="image/jpeg,image/jpg,image/png"
                      list-type="picture"
                      :show-file-list="true"
                      :on-change="handleChangeText"
                      :before-upload="beforeUploadImg"
                      :file-list="fileList2"
                    >
                      <el-button
                        size="small"
                        type="text"
                      >上传图片</el-button>
                    </el-upload>
                  </el-dropdown-item>
                  <el-dropdown-item command="video">
                    <el-upload
                      ref="uploadxlVideo"
                      class="upload-demo"
                      action=""
                      list-type="picture"
                      :show-file-list="true"
                      :on-change="handleChangeText"
                      :before-upload="beforeUploadVideo"
                      :file-list="fileList3"
                    >
                      <el-button
                        size="small"
                        type="text"
                      >上传视频</el-button>
                    </el-upload>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button-group>
          </el-form-item>
          <el-form-item prop="searchName">
            <el-input
              v-model="tableData.params.searchName"
              :maxlength="200"
              clearable
              placeholder="请输入搜索条件"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="search"
            >查询</el-button>
            <el-button
              type="primary"
              style="margin-right:10px"
              @click="reset()"
            >重置</el-button>
          </el-form-item>
        </el-form>
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
        <el-table-column
          label="序号"
          width="50"
          type="index"
          :index="indexMethod"
        />
        <el-table-column
          type="selection"
          width="50"
        />
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="文件名"
          sortable
        />
        <el-table-column
          show-overflow-tooltip
          prop="type"
          label="文件类型"
          sortable
        >
          <template slot-scope="scope">
            {{ scope.row.type | typeJudge }}
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="ip"
          label="预览"
        >
          <template slot-scope="scope">
            <img
              v-if="scope.row.type == 2"
              v-image-preview
              v-bind:src="geturl(scope.row.url)"
              min-width="50"
              height="50"
            >
            <div v-if="scope.row.type == 3"> <video
                v-bind:src="geturl(scope.row.url)"
                min-width="50"
                height="50"
              /></div>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="filesize"
          label="文件大小"
          :formatter="formatSize"
        />
        <el-table-column
          show-overflow-tooltip
          prop="videoTime"
          label="时长"
        />
        <el-table-column
          show-overflow-tooltip
          prop="username"
          label="创建人"
        />
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="创建时间"
        />
        <el-table-column
          show-overflow-tooltip
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="updateMaterial(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="deleteMaterial(scope.row)"
            >删除</el-button>
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

    <el-drawer
      v-if="drawer"
      ref="addtext"
      title="上传文本信息"
      style="font-weight: 600;font-size: 14px; "
      :visible.sync="drawer"
      size="50%"
      :direction="direction"
      :before-close="handleClose"
      destroy-on-close="true"
      :modal="false"
    >
      <upload-text ref="drawer1" />
    </el-drawer>

    <el-drawer
      title="修改"
      style="font-weight: 600;font-size: 14px; "
      :visible.sync="updateDrawer"
      size="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="paramForm1"
        :model="tempName"
        :rules="model.rules"
        label-position="right"
        label-width="80px"
        class="query-form"
        style="margin-top: 10px"
      >
        <el-form-item
          label="文件名:"
          prop="first"
          :rules="model.rules.name"
        >
          <el-input
            v-model="tempName.first"
            :maxlength="200"
            clearable
            style="width: 60%"
          />
          <span>{{tempName.last}}</span>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="updateCom()"
          >提交</el-button>
          <el-button
            type="primary"
            @click="updateDrawer = false"
          >返回</el-button>
        </el-form-item>
      </el-form>

    </el-drawer>

  </div>
</template>

<script>
import {
  uploadFile,
  addFile,
  getSysledmaterial,
  deletesysLeddevice,
  deleteMatObj,
  updateMaObj,
} from "@/views/displayScreen/sysledmaterial.js";
import Vue from "vue";
import uploadText from "./components/uploadText";
import VueDirectiveImagePreviewer from "vue-directive-image-previewer";
import "vue-directive-image-previewer/dist/assets/style.css";
import aTool from "@acloud/acloud-atool-js";
import { mapGetters } from "vuex";
Vue.use(VueDirectiveImagePreviewer);
const paramFormRules = {
  searchName: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: "不能输入特殊字符。",
      trigger: "change",
    },
  ],
};
export default {
  components: {
    uploadText,
  },
  filters: {
    typeJudge(param) {
      if (param == undefined || param == null || param == "") {
        return;
      }
      var temp = "";
      switch (param) {
        case 1:
          temp = "文本";
          break;
        case 2:
          temp = "图片";
          break;
        case 3:
          temp = "视频";
          break;
        default:
          temp = "其他";
          break;
      }
      return temp;
    },
  },
  data() {
    return {
      fileImgUrl: process.env.VUE_APP_FILE_URI,
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10,
          searchName: "",
        },
        paramFormRules,
        total: 0,
        listLoading: false,
        dataList: [],
      },
      drawer: false,
      updateDrawer: false,
      drawer1: this.$refs,
      sysLeddevice: {},
      fileList1: [],
      fileList2: [],
      fileList3: [],
      objEntity: {},
      tempName: { first: "", last: "" },
      model: {
        rules: {
          name: [
            {
              required: true,
              message: "请输入文件名。",
              trigger: "change",
            },
          ],
        },
      },
    };
  },
  computed: {
    xuhao() {
      return (
        (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
      );
    },

    ...mapGetters(["token"]),
  },
  created() {
    this.queryTable();
  },
  methods: {
    geturl(id) {
      var s = this.fileImgUrl + id + "&access_token=" + this.token;
      return s;
    },
    search() {
      this.$refs.paramForm.validate((v) => {
        if (v) {
          this.queryTable();
        }
      });
    },
    queryTable() {
      var tempObj = {
        delState: true,
        name: this.tableData.params.searchName,
      };
      getSysledmaterial(
        tempObj,
        this.tableData.params.currentPage,
        this.tableData.params.pageSize
      ).then((res) => {
        if (res.data.code == 20000) {
          this.tableData.dataList = res.data.data.list;
          this.tableData.total = res.data.data.total;
          this.tableData.listLoading = false;
        }
      });
    },
    handleCommand(command) {
      if (command === "text") {
      } else if (command === "picture") {
      } else if (command === "video") {
      }
    },
    handleChangeText(file, fileList) {},
    formatSize(row, column, fileSize) {
      if (fileSize < 1024) {
        return fileSize + "B";
      } else if (fileSize < 1024 * 1024) {
        var temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + "KB";
      } else if (fileSize < 1024 * 1024 * 1024) {
        var temp = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return temp + "MB";
      } else {
        var temp = fileSize / (1024 * 1024 * 1024);
        temp = temp.toFixed(2);
        return temp + "GB";
      }
    },
    beforeUpload(file) {
      var that = this;
      const file_url = this.$refs.uploadxls.uploadFiles[0].url;
      console.log(file_url);
      var videoEle = new Audio(file_url);
      var duration;
      videoEle.addEventListener("loadedmetadata", function (_event) {
        duration = videoEle.duration;
        console.log("duration");
        console.log(duration); // 单位：秒
      });

      var formData = new FormData();

      const fileType = 1;
      const fileName = file.name;

      const fileSize = file.size;
      const fileTime = 0;
      var isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        // 判断大小
        this.$message.error("上传图片的大小不能超过 2MB。");
        that.$refs.uploadxls.uploadFiles = []; // 不符合就清空已选择的图片
        return;
      }
      formData.append("name", fileName);
      formData.append("type", fileType);
      formData.append("fileSize", fileSize);
      // formData.append("videoTime",fileTime);
      formData.append("createId", Vue.getAcloudProvider().getUserInfo().id);
      formData.append("file", file);

      addFile(formData).then((res) => {
        if (res.data.code == 20000) {
          this.$message.success(res.data.message);
          this.queryTable();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    beforeUploadtxt(file) {
      var ss = this.token;
      const fileType = 1;
      const fileName = file.name;
      const fileSize = file.size;
      const fileTime = 0;
      var isLt2M = file.size < 2048;
      if (!isLt2M) {
        // 判断大小
        this.$message.error("上传文本的大小不能超过 2KB。");
        that.$refs.uploadxls.uploadFiles = []; // 不符合就清空已选择的图片
        return;
      }

      var that = this;
      var formData = new FormData();
      formData.append("file", file);
      this.$axios
        .post("/acloud-file-center/file/oper/upload", formData)
        .then((res) => {
          if (res.status === 200) {
            var objectEntity = res.data;
            var formData2 = new FormData();
            formData2.append("name", fileName);
            formData2.append("type", fileType);
            formData2.append("fileSize", fileSize);
            formData2.append("url", objectEntity.fileId);
            formData2.append(
              "createId",
              Vue.getAcloudProvider().getUserInfo().id
            );
            addFile(formData2).then((res) => {
              if (res.data.code == 20000) {
                this.$message.success(res.data.message);
                queryTable();
              } else {
                this.$message.error(res.data.message);
              }
            });
          } else {
            this.$message.error(res.statusText);
          }
        });
    },
    beforeUploadImg(file) {
      const fileType = 2;
      const fileName = file.name;
      const fileSize = file.size;
      const fileTime = 0;
      var isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        // 判断大小
        this.$message.error("上传图片的大小不能超过 2MB。");
        that.$refs.uploadxls.uploadFiles = []; // 不符合就清空已选择的图片
        return;
      }
      var that = this;
      var formData = new FormData();
      formData.append("file", file);
      this.$axios
        .post("/acloud-file-center/file/oper/upload", formData)
        .then((res) => {
          if (res.status === 200) {
            var objectEntity = res.data;
            var formData2 = new FormData();
            formData2.append("name", fileName);
            formData2.append("type", fileType);
            formData2.append("fileSize", fileSize);
            formData2.append("url", objectEntity.fileId);
            formData2.append(
              "createId",
              Vue.getAcloudProvider().getUserInfo().id
            );
            addFile(formData2).then((res) => {
              if (res.data.code == 20000) {
                this.$message.success(res.data.message);
                queryTable();
              } else {
                this.$message.error(res.data.message);
              }
            });
          } else {
            this.$message.error(res.statusText);
          }
        });
    },
    beforeUploadVideo(file) {
      var that = this;
      const file_url = this.$refs.uploadxlVideo.uploadFiles[0].url;
      var videoEle = new Audio(file_url);

      var formData = new FormData();
      const fileType = 3;
      const fileName = file.name;
      const fileSize = file.size;
      var isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        // 判断大小
        this.$message.error("上传图片的大小不能超过 20MB。");
        this.$refs.uploadxls.uploadFiles = []; // 不符合就清空已选择的图片
        return;
      }
      var formData = new FormData();
      formData.append("file", file);

      videoEle.addEventListener("loadedmetadata", function (_event) {
        uploadFile(formData).then((res) => {
          if (res.status === 200) {
            var objectEntity = res.data;
            var duration = videoEle.duration;
            var formData2 = new FormData();
            formData2.append("name", fileName);
            formData2.append("type", fileType);
            formData2.append("fileSize", fileSize);
            formData2.append("url", objectEntity.fileId);
            formData2.append(
              "createId",
              Vue.getAcloudProvider().getUserInfo().id
            );
            formData.append("videoTime", duration);
            addFile(formData2).then((res2) => {
              if (res2.data.code == 20000) {
                that.$message.success(res2.data.message);
                that.queryTable();
              } else {
                that.$message.error(res2.data.message);
              }
            });
          } else {
            that.$message.error(res.statusText);
          }
        });
      });
    },
    updateMaterial(row) {
      // updateMaObj().then(res => {
      //
      // })
      this.objEntity = { ...row };
      let lastIndex = this.objEntity.name.lastIndexOf(".");
      this.tempName.last = this.objEntity.name.substring(
        lastIndex,
        this.objEntity.name.length
      );
      this.tempName.first = this.objEntity.name.substring(0, lastIndex);
      this.updateDrawer = true;
    },
    deleteMaterial(row) {
      this.$axios
        .get(
          "/acloud-file-center/file/oper/remove?fileIds=" +
            row.url 
            // +
            // "&access_token=" +
            // this.token
        )
        .then((res) => {
          if (res.status === 200) {
            deleteMatObj(row).then((res) => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message);
                this.queryTable();
              } else {
                this.$message.success(res.data.message || "删除失败");
              }
            });
          } else {
          }
        });
    },
    updateCom() {
      this.$refs.paramForm1.validate((v) => {
        if (v) {
          this.objEntity.name = this.tempName.first + this.tempName.last;
          delete this.objEntity.username;
          updateMaObj(this.objEntity).then((res) => {
            if (res.data.code === 20000) {
              this.$message.success(res.data.message);
              this.updateDrawer = false;
              this.queryTable();
            } else {
              this.$message.error(res.data.message || "更新失败");
            }
          });
        }
      });
    },
    add() {
      this.sysLeddevice = {};
      this.drwTitle = "添加";
      this.drawer = true;
      this.excuteStatus = "add";
    },
    update() {
      console.log("hhhh");
      if (this.selectList.length != 1) {
        this.$message.error("请只选中一行来操作");
        return;
      }
      this.drwTitle = "修改";
      this.drawer = true;
      this.excuteStatus = "update";
      this.sysLeddevice = { ...this.selectList[0] };
    },
    deleteMulti() {
      var deleteStr = "";
      for (let i = 0; i < this.selectList.length; i++) {
        deleteStr += this.selectList[i].id + ",";
      }
      deleteStr = deleteStr.substring(0, deleteStr.length - 1);
      deletesysLeddevice(deleteStr).then((res) => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message);
          this.drawer = false;
          this.queryTable();
        } else {
          this.$message.error(res.data.message || "删除失败");
        }
      });
    },
    // 表格颜色
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return "background:rgb(228, 228, 228)";
      } else {
        return "";
      }
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return "success-row";
      } else {
        return "";
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    selsChange(val) {
      this.selectList = val;
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return "color: #009578;text-decoration: underline";
      }
    },
    indexMethod(index) {
      return this.xuhao + index + 1;
    },
    handleSizeChange(val) {
      this.tableData.params.pageSize = val;
      this.tableData.params.currentPage = 1;
      this.queryTable();
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val;
      this.queryTable();
    },
    uploadtext() {
      this.drawer = true;
    },
    reset() {
      this.tableData.params.searchName = null;
      this.$refs.paramForm.resetFields();
      this.tableData.params.ccurrentPageurrentPage = 1;
      this.tableData.params.pageSize = 10;
      this.queryTable();
    },
  },
};
</script>

<style scoped>
div /deep/.el-drawer {
  overflow: auto;
}
</style>
