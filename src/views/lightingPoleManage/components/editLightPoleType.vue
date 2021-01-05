<template>
  <div>
    <el-form ref="form" :rules="model.rules" :model="model" label-width="100px">
      <el-form-item label="灯杆图标" prop="fImg" class="form-item" :rules="model.rules.fImg">
        <el-upload
          ref="uploadxls"
          class="upload-demo"
          drag
          action=""
          accept="image/jpeg,image/jpg,image/png"
          list-type="picture"
          :show-file-list="true"
          :name="upload_name"
          :on-remove="handleRemove"
          :on-exceed="handleExceed"
          :on-change="handlePictureCardPreview"
          :limit="1"
          :before-upload="beforeUpload"
          :file-list="file_list"
        >
          <!--<img v-if="resultImg && changeFlag === 'false'" :src="'data:image/png;base64,' + resultImg" class="avatar" style="height: 180px">-->
          <img v-if="resultImg && changeFlag === 'false'" v-bind:src="geturl(resultImg)" class="avatar" style="height: 180px">
          <img v-else :src="model.fImg" class="avatar" style="height: 180px">
          <i v-if="resultImg === '' && changeFlag === 'true'" class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="类型名称" prop="fName" class="form-item" :rules="model.rules.fName">
        <el-input v-model="model.fName" :maxlength="16" clearable placeholder="请输入类型名称" />
      </el-form-item>
      <el-form-item label="备注" prop="fRemark" class="form-item" :rules="model.rules.fRemark">
        <el-input v-model="model.fRemark" :maxlength="200" clearable placeholder="请输入备注信息" />
      </el-form-item>
    </el-form>
    <div>
      <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="cancel" @click="resetType">重置</el-button>
      <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="saveType">提交</el-button>
    </div>
  </div>
</template>
<script>
import aTool from '@acloud/acloud-atool-js'
import Vue from 'vue'
import { mapGetters } from "vuex";
export default {
  props: {
    'drawer1': {
      type: Object,
      default: null
    },
    'loaddata': {
      type: Function,
      default: null
    },
    'editParams': {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      resultImg: '',
      changeFlag: 'false',
      formData: new FormData(),
      doUpload: false,
      upload_name: 'files', // 图片上传的后端接受图片文件的 key
      dialogImageUrl: '', // 上传后的图片地址
      file_list: [],
      localFile: {},
      fileImgUrl: process.env.VUE_APP_FILE_URI,
      model: {
        fImg: '',
        fName: '',
        fRemark: '',
        rules: {
          fRemark: [
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fName: [
            { required: true, message: '请输入灯杆类型名称。', trigger: 'change' },
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
  created() {
    this.init()
  },
   computed: {
    ...mapGetters(["token"]),
  },
  methods: {
    geturl(id) {
      var s = this.fileImgUrl + id + "&access_token=" + this.token;
      return s;
    },
    init() {
      this.resultImg = this.editParams.fImg
      this.model.fName = this.editParams.fName
      this.model.fRemark = this.editParams.fRemark
    },
    beforeUpload(file) {
      this.changeFlag = 'true'
      this.formData.append('file', file)
      const that = this
      const fileType = file.type // 获取文件类型
      const isImage = fileType.indexOf('image') !== -1 // 判断是否是图片类型
      const file_url = that.$refs.uploadxls.uploadFiles[0].url
      var isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        // 判断大小
        this.$message.error('上传图片的大小不能超过 2MB。')
        that.$refs.uploadxls.uploadFiles = [] // 不符合就清空已选择的图片
        this.model.fImg = ''
        return
      }
      if (!isImage) {
        // 文件格式
        this.$message.error('请选择图片文件。')
        that.$refs.uploadxls.uploadFiles = [] // 不符合就清空已选择的图片
        return
      }
      if (isImage) {
        var img = new Image()
        img.src = file_url
      }
      return false
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.model.fImg = file.url
      this.resultImg = file.url
      this.doUpload = true
      this.$refs['form'].validateField('file')
    },
    // 文件超出个数限制时的钩子【判断上传的图片是否超过限制，超过提醒删除再进行上传】
    handleExceed() {
      this.$alert('图片最多上传一张，请删除再重新上传！', '', {
        showConfirmButton: false,
        callback: action => {}
      })
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.dialogImageUrl = ''
    },
    resetType() {
      this.model.fImg = null
      this.model.fName = null
      this.model.fRemark = null
    },
    saveType() {
      if (this.resultImg === null || this.resultImg === undefined) {
        this.$message.error('请上传图片。')
        return
      }
      if (this.changeFlag === 'false') {
        this.formData.append('file', this.resultImg)
      }
      if (this.formData === null || this.formData === undefined) {
        this.$message.error('请上传图片。')
        return
      }
      this.$refs.form.validate(v => {
        if (v) {
      this.$axios
        .post("/acloud-file-center/file/oper/upload", this.formData)
        .then((res) => {
          if (res.status === 200) {
          var entityobj=res.data
          this.formData.delete("file")
           this.$axios
            .post('/acloud-file/file/update?fImg='+entityobj.fileId+'&changeFlag=' + this.changeFlag + '&fId=' + this.editParams.fId + '&fName=' + this.model.fName + '&fRemark=' + this.model.fRemark + '&fCreateId=' + Vue.getAcloudProvider().getUserInfo().id, this.formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(res => {
              this.$refs.uploadxls.submit() // 提交时触发before-upload的函数
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.loaddata()
                this.drawer1.editTypeDrawer.hide()
                return
              } else {
                this.formData = new FormData()
                this.$message.error(res.data.message || '修改失败。')
                this.loaddata()
                this.drawer1.editTypeDrawer.hide()
              }
            })
          }
          else{
               this.$message.error('修改失败。')
          }
        })
         
      }
      })
    }
  }
}
</script>
