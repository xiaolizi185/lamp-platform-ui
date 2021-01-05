<template>
	<div class="app-container">
      <el-row class="rowStyle">
        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">X坐标：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.xAxis" controls-position="right" :min="0" :max="10000"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">显示宽度：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.showWidth" controls-position="right" :min="0" :max="10000"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6" v-if="selectMaterial.type == 1">
          <el-row>
            <el-col :span="8" class="title" >前景颜色：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.foregroundColor" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optionsColor"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6" v-if="selectMaterial.type == 1">
          <el-row>
            <el-col :span="8" class="title">播放时长：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.playTimeLength" controls-position="right" :min="0" :max="2147483647"></el-input-number>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="rowStyle">
        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">Y坐标：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.yAxis" controls-position="right" :min="0" :max="10000"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">显示高度：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.showHeight" controls-position="right" :min="0" :max="2147483647"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6" v-if="selectMaterial.type == 1">
          <el-row>
            <el-col :span="8" class="title">背景颜色：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.backgroundColor" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optionsBackColor"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6" v-if="selectMaterial.type == 1 || selectMaterial.type == 3">
          <el-row>
            <el-col :span="8" class="title">播放次数：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.playTimes" controls-position="right" :min="1" :max="255"></el-input-number>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="rowStyle" v-if="selectMaterial.type == 1">
        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">字体：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.font" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optionsFont"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">字号：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.fontSize" controls-position="right" :min="0" :max="10"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">字体风格：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.fontStyle" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optFontStyle"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="rowStyle" v-if="selectMaterial.type == 1">
        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">行距：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.rowPitch" controls-position="right" :min="0" :max="100"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">字距：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.wordPitch" controls-position="right" :min="0" :max="100"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">水平对齐：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.horizontal" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optionsHorizontal"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">垂直对齐：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.vertical" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optionsVertical"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="rowStyle" v-if="selectMaterial.type == 1">
        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">播放特效：</el-col>
            <el-col :span="16">
               <el-select v-model="materialStatus.playSpecial" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optPlaySpecial"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">特效速度：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.speedSpecial" filterable placeholder="请选择">
                 <el-option
                   v-for="item in optSpeedSpecial"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
                 </el-option>
               </el-select>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">播放文字：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.playWord" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optPlayWord"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">同步播放：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.synPlay" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optSynPlay"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="rowStyle" v-if="selectMaterial.type == 1">
        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">音量：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.voice" controls-position="right" :min="0" :max="9"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">语速：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.wordSpeed" controls-position="right" :min="0" :max="9"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">音调：</el-col>
            <el-col :span="16">
              <el-input-number v-model="materialStatus.tone" controls-position="right" :min="0" :max="9"></el-input-number>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row>
            <el-col :span="8" class="title">发音人：</el-col>
            <el-col :span="16">
              <el-select v-model="materialStatus.reader" filterable placeholder="请选择">
                  <el-option
                    v-for="item in optReader"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row >
        <el-col :span="12">
          <el-row v-if="selectMaterial.type == 2 || selectMaterial.type == 3">
            <el-col :span="4" class="title">文件名称：</el-col>
            <el-col :span="20">
              <el-input v-model="materialStatus.content"></el-input>
            </el-col>
          </el-row>
          <el-row v-if="selectMaterial.type == 1">
            <el-col :span="4" class="title">文件内容：</el-col>
            <el-col :span="20">
              <el-input v-model="materialStatus.content"></el-input>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
          <el-button style="margin-top: 12px;float: left;margin-left: 20px" type="primary" @click="confirm">确定</el-button>
          <el-button style="margin-top: 12px;float: left;margin-left: 20px" type="primary" @click="back">返回</el-button>
      </el-row>
  </div>
</template>

<script>

export default {
  props:{
    selectMaterial :{
      type: Object,
      required: true
    }
  },
  components: {

  },
  computed:{

  },
  data(){
      return {
       materialStatus: {},
		   materialStatus1: {
         xAxis: '0',
         showWidth: '0',
         foregroundColor: '1',
         playTimeLength: '100',
         yAxis: '0',
         showHeight: '0',
         backgroundColor: '8',
         playTimes: '1',
         font: '1',
         fontSize: '1616',
         fontStyle: '0',
         rowPitch: '1',
         wordPitch: '0',
         horizontal: '0',
         vertical: '0',
         playSpecial: '0',
         speedSpecial: '2',
         playWord: '0',
         synPlay: '0',
         voice: '5',
         wordSpeed: '5',
         tone: '5',
         reader: '0'
       },
       materialStatus2:{
         xAxis: '0',
         yAxis: '0',
         content: '',
         showWidth: '128',
         showHeight: '128',
         playTimeLength: '100'
       },
       materialStatus3:{
         xAxis: '0',
         yAxis: '0',
         content: '',
         showWidth: '128',
         showHeight: '128',
         playTimes: '1'
       },
       optionsColor: [
         {value: '0',label: '红色'},
         {value: '1',label: '绿色'},
         {value: '2',label: '蓝色'},
         {value: '3',label: '黄色'},
         {value: '4',label: '紫色'},
         {value: '5',label: '青色'},
         {value: '6',label: '白色'},
         {value: '7',label: '黑色'}
       ],
       optionsBackColor:[
         {value: '0',label: '红色'},
         {value: '1',label: '绿色'},
         {value: '2',label: '蓝色'},
         {value: '3',label: '黄色'},
         {value: '4',label: '紫色'},
         {value: '5',label: '青色'},
         {value: '6',label: '白色'},
         {value: '7',label: '黑色'}
       ],
       optionsFont:[
         {value: '0',label: '黑体'},
         {value: '1',label: '楷体'},
         {value: '2',label: '宋体'},
         {value: '3',label: '仿宋'},
         {value: '4',label: '隶书'}
       ],
       optFontStyle:[
         {value: '0',label: '常规'},
         {value: '1',label: '加粗'},
         {value: '2',label: '倾斜'},
         {value: '4',label: '下划线'},
         {value: '8',label: '中划线'}
       ],
       optionsHorizontal:[
         {value: '0',label: '左对齐'},
         {value: '1',label: '右对齐'},
         {value: '2',label: '居中'}
       ],
       optionsVertical:[
         {value: '0',label: '左对齐'},
         {value: '1',label: '右对齐'},
         {value: '2',label: '居中'}
       ],
       optPlaySpecial:[
         {value: '0',label: '无特效'},
         {value: '1',label: '立即显示'},
         {value: '2',label: '上展'},
         {value: '3',label: '下展'},
         {value: '4',label: '左展'},
         {value: '5',label: '右展'},
         {value: '6',label: '上移'},
         {value: '7',label: '下移'},
         {value: '8',label: '左移'},
         {value: '9',label: '淡入淡出'},
         {value: '255',label: '随机'},
         {value: '12',label: '从右往左滚动'},
         {value: '13',label: '从左往右滚动'},
         {value: '14',label: '从下往上滚动'},
         {value: '15',label: '从上往下滚动'}
       ],
       optSpeedSpecial:[
         {value: '0',label: '最慢'},
         {value: '1',label: '较慢'},
         {value: '2',label: '常速'},
         {value: '3',label: '较快'},
         {value: '4',label: '最快'}
       ],
       optPlayWord:[
         {value: '0',label: '不播报'},
         {value: '1',label: '播报'}
       ],
       optSynPlay:[
         {value: '0',label: '不同步'},
         {value: '1',label: '同步'}
       ],
       optReader:[
         {value: '0',label: '普通女声'},
         {value: '1',label: '普通男声'},
         {value: '2',label: '特别男声'},
         {value: '3',label: '情感男声'},
         {value: '4',label: '情感儿童声'}
       ]

	  }
  },
	created(){
        if(this.selectMaterial.type == 1){

          if(this.selectMaterial.materialStatus != undefined && this.selectMaterial.materialStatus != null ){
            this.materialStatus = this.selectMaterial.materialStatus
          }else{
            this.materialStatus = this.materialStatus1;
          }
        }else if(this.selectMaterial.type == 2){

          if(this.selectMaterial.materialStatus != undefined && this.selectMaterial.materialStatus != null ){
            this.materialStatus = this.selectMaterial.materialStatus
          }else{
            this.materialStatus = this.materialStatus2;
          }
          this.materialStatus.content = this.selectMaterial.name;
        }else if(this.selectMaterial.type == 3){
          if(this.selectMaterial.materialStatus != undefined && this.selectMaterial.materialStatus != null ){
            this.materialStatus = this.selectMaterial.materialStatus
          }else{
            this.materialStatus = this.materialStatus3;
          }
          this.materialStatus.content = this.selectMaterial.name;
        }
	  },
  watch:{
    selectMaterial(val,oldValue){
        if(val.type == 1){
          if(this.selectMaterial.materialStatus != undefined && this.selectMaterial.materialStatus != null ){
            this.materialStatus = this.selectMaterial.materialStatus
          }else{
            this.materialStatus = this.materialStatus1;
          }
        }else if(val.type == 2){
          if(this.selectMaterial.materialStatus != undefined && this.selectMaterial.materialStatus != null ){
            this.materialStatus = this.selectMaterial.materialStatus
          }else{
            this.materialStatus = this.materialStatus2;
          }
          this.materialStatus.content = this.selectMaterial.name;
        }else if(val.type == 3){
         if(this.selectMaterial.materialStatus != undefined && this.selectMaterial.materialStatus != null ){
           this.materialStatus = this.selectMaterial.materialStatus
         }else{
           this.materialStatus = this.materialStatus3;
         }
         this.materialStatus.content = this.selectMaterial.name;
        }
    }
  },
	methods:{
    confirm(){
        this.$emit('confirm',this.materialStatus,this.selectMaterial);
    },
    back(){
      this.$emit('back');
    }
	},
	filters:{

	}
}
</script>

<style scoped>
.title{
  text-align: right;
  margin-top: 7px;
}
.rowStyle{
  margin-bottom: 20px;
}
</style>
