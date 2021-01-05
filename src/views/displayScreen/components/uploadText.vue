<template>
  <div>
    <el-form ref="form" :rules="model.rules" :model="model" label-width="100px">
      <el-form-item label="素材名称" prop="materialname" class="form-item" :rules="model.rules.materialname">
        <el-input v-model="model.materialname" :maxlength="200" clearable placeholder="请输入X坐标" />
      </el-form-item>
      <el-form-item label="素材文本" prop="materialtext" class="form-item" :rules="model.rules.materialtext">
        <el-input
          v-model="model.materialtext"
          :maxlength="200"
          type="textarea"
          clearable
          placeholder="请输入素材文本"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="X坐标" prop="coordinateX" class="form-item" :rules="model.rules.coordinateX">
        <el-input v-model="model.coordinateX" :maxlength="200" clearable placeholder="请输入X坐标" />
      </el-form-item>
      <el-form-item label="Y坐标" prop="coordinateY" class="form-item" :rules="model.rules.coordinateY">
        <el-input v-model="model.coordinateY" :maxlength="200" clearable placeholder="请输入Y坐标" />
      </el-form-item>
      <el-form-item label="字体" prop="fontweight" class="form-item" :rules="model.rules.fontweight">
        <el-select v-model="model.fontweight" placeholder="请选择字体" style="width: 100%" @change="changeRtuType(model.fontweight)">
          <el-option
            v-for="item in fontweightList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字号" prop="fontsizes" class="form-item" :rules="model.rules.fontsizes">
        <el-input v-model="model.fontsizes" :maxlength="200" clearable placeholder="请输入字号" />
      </el-form-item>
      <el-form-item label="前景颜色" prop="frontcolor" class="form-item" :rules="model.rules.frontcolor">
        <el-select v-model="model.frontcolor" placeholder="请选择前景颜色" style="width: 100%">
          <el-option
            v-for="item in frontColorList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="背景颜色" prop="behandcolor" class="form-item" :rules="model.rules.behandcolor">
        <el-select v-model="model.behandcolor" placeholder="请选择背景颜色" style="width: 100%">
          <el-option
            v-for="item in behandColorList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="闪烁" prop="twinkling" class="form-item" :rules="model.rules.twinkling">
        <el-input v-model="model.twinkling" :maxlength="20" clearable placeholder="请输入闪烁" />
      </el-form-item>
      <el-form-item label="显示区域宽度" prop="displaywidth" class="form-item" :rules="model.rules.displaywidth">
        <el-input v-model="model.displaywidth" :maxlength="20" clearable placeholder="请输入显示区域宽度" />
      </el-form-item>
      <el-form-item label="显示区域高度" prop="displayheight" class="form-item" :rules="model.rules.displayheight">
        <el-input v-model="model.displayheight" :maxlength="20" clearable placeholder="请输入显示区域高度" />
      </el-form-item>
      <el-form-item prop="fontstyle" label="字体风格">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="常规" value="0" />
          <el-checkbox label="加粗" value="1" />
          <el-checkbox label="倾斜" value="2" />
          <el-checkbox label="下划线" value="4" />
          <el-checkbox label="中划线" value="8" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="字符间距"
        prop="letterspace"
        class="form-item"
        :rules="model.rules.letterspace"
      >
        <el-input
          v-model="model.letterspace"
          maxlength="20"
          placeholder="请输入字符间距"
        />
      </el-form-item>
      <el-form-item
        label="排列方式"
        prop=""
        class="form-item"
        :rules="model.rules.borehole"
      >
        <el-input
          v-model="model.borehole"
          maxlength="20"
          placeholder="请输入排列方式：0横向1竖向"
        />
      </el-form-item>
    </el-form>
    <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
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
      active: 0,
      rtuList: [],
      checkList: [],
      selecteTabelData: [],
      fontweightList: [{
        'label': '黑体',
        'value': '1'
      }, {
        'label': '楷体',
        'value': '2'
      }, {
        'label': '宋体',
        'value': '3'
      }, {
        'label': '仿宋',
        'value': '4'
      }, {
        'label': '隶书',
        'value': '5'
      }, {
        'label': '隶书',
        'value': '5'
      }],
      frontColorList: [{
        'label': '红色',
        'value': '1',
        'backgroundColor': '#980000'
      }, {
        'label': '绿色',
        'value': '2',
        'backgroundColor': '#44ff00'
      }, {
        'label': '蓝色',
        'value': '3',
        'backgroundColor': '#009aff'
      }, {
        'label': '黄色',
        'value': '4',
        'backgroundColor': '#fcff32'
      }, {
        'label': '紫色',
        'value': '5',
        'backgroundColor': '#8b25ff'
      }, {
        'label': '青色',
        'value': '6',
        'backgroundColor': '#1aff98'
      }, {
        'label': '白色',
        'value': '7',
        'backgroundColor': '#ffffff'
      },
      {
        'label': '黑色',
        'value': '7',
        'backgroundColor': '#000000'
      }],
      behandColorList: [{
        'label': '红色',
        'value': '1',
        'backgroundColor': '#980000'
      }, {
        'label': '绿色',
        'value': '2',
        'backgroundColor': '#44ff00'
      }, {
        'label': '蓝色',
        'value': '3',
        'backgroundColor': '#009aff'
      }, {
        'label': '黄色',
        'value': '4',
        'backgroundColor': '#fcff32'
      }, {
        'label': '紫色',
        'value': '5',
        'backgroundColor': '#8b25ff'
      }, {
        'label': '青色',
        'value': '6',
        'backgroundColor': '#1aff98'
      }, {
        'label': '白色',
        'value': '7',
        'backgroundColor': '#ffffff'
      },
      {
        'label': '黑色',
        'value': '7',
        'backgroundColor': '#000000'
      }],
      projectList: [],
      lightType: [],
      model: {
        materialtext: '',
        coordinateX: '',
        coordinateY: '',
        fontweight: '',
        fontsizes: '',
        frontcolor: '',
        behandcolor: '',
        twinkling: '',
        displaywidth: '',
        displayheight: '',
        fontstyle: '',
        letterspace: '',
        borehole: '',
        materialname: '',
        rules: {
          materialname: [
            { required: true, message: '请输入素材名称。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          materialtext: [
            { required: true, message: '请输入素材内容。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          coordinateX: [
            { required: true, message: '请输入X坐标。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.positiveInteger.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          coordinateY: [
            { required: true, message: '请输入Y坐标。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.positiveInteger.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          fontsizes: [
            { required: true, message: '请输入字号。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.positiveInteger.value,
              message: '请输入字号。',
              trigger: 'change'
            }
          ],
          frontcolor: [
            { required: true, message: '请选择前景色。', trigger: 'change' }
          ],
          behandcolor: [
            { required: true, message: '请选择后景色。', trigger: 'change' }
          ],
          displaywidth: [
            { required: true, message: '请输入显示器宽度', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.positiveInteger.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          displayheight: [
            { required: true, message: '请输入显示器高度', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.positiveInteger.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          letterspace: [
            { required: true, message: '请输入字符间距', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.positiveInteger.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ],
          borehole: [
            { required: true, message: '请输入排列方式', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.positiveInteger.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            }
          ]
        }
      }
    }
  },
  created() {
    this.getProjectInfo()
    this.getLightPoleyType()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {
      })
    },
    changeProject(projectId) {
      this.model.fProjectId = projectId
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      } else {
        return ''
      }
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    selectedTableData(selectedTableData) {
      this.selecteTabelData[0] = selectedTableData
    },
    // 保存站点基本信息
    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          const txtN = this.model.coordinateX + ',' + this.model.coordinateY + ',' + this.model.fontweight + ',' + this.model.fontsizes +
                      ',' + this.model.frontcolor + ',' + this.model.behandcolor + ',' + this.model.twinkling + ',' +
              this.model.materialtext + ',' + this.model.displaywidth + ',' + this.model.displayheight + ',' + this.model.fontstyle
          const params = {
            'name': this.model.materialname,
            'type': 1,
            'filesize': 1,
            'createdid': Vue.getAcloudProvider().getUserInfo().id,
            'txt': txtN,
            'txtParam': this.model.letterspace + ',' + this.model.borehole
          }
          this.$axios.post('/acloud-lighting/file/LEDMaterialAdd', params).then(res => {
            if (res.data.code === 20000) {
              this.$message.success('上传成功。')
              this.loaddata()
              this.drawer.addLightPoleDrawer.hide()
            } else {
              this.$message.error(res.data.message || '上传成功')
              this.drawer.addtext.hide()
              return
            }
          }).catch(() => {
            this.drawer.addtext.hide()
            return
          })
        }
      })
    }
  }
}
</script>
<style type="text/css">
  .gatewayInfo{
    margin-top: 10px;
  }
  div /deep/.el-dialog__close.el-icon.el-icon-close{
    color:black
  }
  div /deep/.el-table .success-row{
    background:rgb(228, 228, 228);
  }
  div /deep/.el-drawer{
overflow:auto
}
</style>
