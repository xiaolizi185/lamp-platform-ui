<template>
  <div>
    <el-form ref="form" :rules="model.rules" :model="model" label-width="100px">
      <el-form-item label="人脸图片" prop="imgurl" class="form-item" :rules="model.rules.imgurl">
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
        >
          <img v-if="model.imgurl" :src="model.imgurl" class="avatar" style="height: 180px">
          <i v-else class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2M</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="相似度" prop="matchingDegree" class="form-item">
        <el-input v-model="model.matchingDegree" :maxlength="16" clearable placeholder="请输入0~1" />
      </el-form-item>
      <el-form-item label="比对范围" prop="date" class="form-item" :rules="model.rules.date">
        <el-date-picker
          v-model="model.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
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
export default {
  props: {
    'drawer': {
      type: Object,
      default: null
    },
    'loaddata': {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      formData: new FormData(),
      doUpload: false,
      upload_name: 'files', // 图片上传的后端接受图片文件的 key
      dialogImageUrl: '', // 上传后的图片地址
      file_list: [],
      localFile: {},
      model: {
        icon: '',
        imgurl: '',
        rules: {
          imgurl: [
            { required: true, message: '请上传图片。', trigger: 'change' }
          ],
          matchingDegree: [
            { required: true, message: '请输入相似度。', trigger: 'change' }
            // {
            //   pattern: aTool.RegexHelper.constants.number.value,
            //   message: '不能输入特殊字符。',
            //   trigger: 'change'
            // }
          ],
          date: [
            { required: true, message: '请输入时间范围。', trigger: 'change' }
          ]
        }
      }
    }
  },
  methods: {
    beforeUpload(file) {
      this.formData.append('file', file)
      const that = this
      const fileType = file.type // 获取文件类型
      const isImage = fileType.indexOf('image') !== -1 // 判断是否是图片类型
      const file_url = that.$refs.uploadxls.uploadFiles[0].url
      var isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        // 判断大小s
        this.$message.error('上传图片的大小不能超过 2MB。')
        that.$refs.uploadxls.uploadFiles = [] // 不符合就清空已选择的图片
        this.model.imgurl = ''
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
      this.model.imgurl = file.url
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
      this.model.imgurl = null
      this.model.matchingDegree = null
      this.model.date = null
    },
    saveType() {
      if (this.formData === null || this.formData === undefined) {
        this.$message.error('请上传图片。')
        return
      }
      this.$refs.form.validate(v => {
        if (v) {
          let startdate = ''
          let enddate = ''
          console.log(Object.prototype.toString.call(this.model.date) + '-----')
          for (let i = 0; i < this.model.date.length; i++) {
            startdate = new Date(this.model.date[0]).getTime()
            enddate = new Date(this.model.date[1]).getTime()
          }

          this.$axios
            .post('/acloud-file-center/file/oper/upload', this.formData)
            .then((res) => {
              if (res.status === 200) {
                debugger
                var objectEntity = res.data
                //this.formData.append('imgurl', objectEntity.fileId)
                this.$axios.post('/acloud-file/faceInfo/compareFaces?imgurl='+objectEntity.fileId+'&matchingDegree=' + this.model.matchingDegree + '&startDate=' + startdate + '&endDate=' + enddate, {
                  headers: { 'Content-Type': 'multipart/form-data' }
                }).then(res => {
                  this.$refs.uploadxls.submit() // 提交时触发before-upload的函数
                  if (res.data.code === 20000) {
                    this.$message.success(res.data.message)
                    this.loaddata()
                    this.drawer.addFaceCompare.hide()
                    return
                  } else {
                    this.formData = new FormData()
                    this.$message.error(res.data.message || '添加失败。')
                    this.loaddata()
                    this.drawer.addFaceCompare.hide()
                  }
                })
              }
            }
            )
        }
      }
      )
    }
  }
}
</script>
