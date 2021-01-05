<!--suppress ALL -->
<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="80px">

      <el-divider content-position="left" style="margin-top: -20px;">网关</el-divider>
      <el-table :data="tableData" @selection-change="selsChange">
        <el-table-column type="selection" width="50" />
        <el-table-column show-overflow-tooltip prop="name" label="单灯名称" />
        <el-table-column show-overflow-tooltip prop="data" label="单灯序号">
          <!--<template>
            <el-checkbox-group v-model="checkedLoops" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="loop in childMenu" :key="loop.id" :label="loop.menu">{{ loop.menu }}</el-checkbox>
            </el-checkbox-group>
          </template>-->
        </el-table-column>
      </el-table>
      <el-divider content-position="left" style="margin-top: -20px;">动作</el-divider>
      <div style="margin-top: 20px">
        <el-form-item label="动作">
          <el-radio-group v-model="actionradio" size="mini" @change="changeHandler">
            <el-radio label="1" border>开灯</el-radio>
            <el-radio label="2" border>关灯</el-radio>
            <el-radio label="3" border>调光</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item v-if="actionradio === '3'" label="调光值" prop="lampsmask">
        <el-slider :step="5" style="width: 50%;" v-model="sizeForm.lampsmask" />
      </el-form-item>
      <div style="text-align: center">
        <el-button style="margin-top: 12px;margin-rigt: 5px" type="primary" @click="addloop()">执行动作</el-button>
        <el-button style="margin-top: 12px;margin-right: 5px" type="cancel" @click="cancelcontroller()">取消</el-button>
      </div>
    </el-form>
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
    'loopSorts': {
      type: String,
      default: null
    },
    'checkedValue': {
      type: Array,
      default: null
    },
    'loaddata': {
      type: Function,
      default: null
    },

  },
  data() {
    return {
      checkAll: false,
      checkedLoops: [],
      checkedLoopsBy: null,
      loops: [],
      ids: '',
      selectIds: '',
      loopOptions: [],
      isIndeterminate: true,
      parentTableData: [],
      tableData: [],
      tableChecked: [],
      actionradio: '1',
      sizeForm: {
        actiontype: '',
        exectime: '',
        execloop: '',
        lampsmask: 50,
        personnum: '',
        timetype: '',
        rules: {
          actiontype: [
            { required: true, message: '请选择策略。', trigger: 'change' }
          ],
          timetype: [
            { required: true, message: '请选择时间类型。', trigger: 'change' }
          ],
          exectime: [
            { required: true, message: '请选择开始时间。', trigger: 'change' }
          ],
          execloop: [
            { required: true, message: '请选择回路。', trigger: 'change' }
          ],
          personnum: [
            { required: true, message: '请输入人流量。', trigger: 'change' },
            {
              pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
              message: '不能输入特殊字符。',
              trigger: 'change'
            },
            {
              pattern: aTool.RegexHelper.constants.positiveInteger.value,
              message: '只能输入正整数。',
              trigger: 'change'
            }
          ]
        }
      },
      actionList: [{
        'value': 1,
        'label': '开灯'
      }, {
        'value': 2,
        'label': '关灯'
      }, {
        'value': 3,
        'label': '调光'
      }],
      dateList: [{
        'value': 1,
        'label': '日落时间'
      }, {
        'value': 2,
        'label': '日出时间'
      }]
    }
  },
  mounted() {
    this.$axios.get("/acloud-lighting/stationSingleLamp/findByStationNum?stationNum="+this.loopSorts).then(res => {
              if(res.data.code == 20000){
                  var list = res.data.data;
                  this.tableData = [];
                  for(let i=0;i<list.length;i++){
                     this.tableData.push({name:"单灯"+list[i].lampIndex,data:list[i].lampIndex});
                  }
              }
          })

    // const ucode = null
    // if (this.checkedValue != null && this.checkedValue !== '') {
    //   for (let i = 0; i < this.checkedValue.length; i++) {
    //     if (this.checkedValue.length === 1) {
    //       this.ids = this.checkedValue[i].autoid
    //     } else if (this.checkedValue.length > 1) {
    //       this.ids += this.checkedValue[i].autoid + ','
    //     }
    //     this.loopOptions = []
    //     this.loops = ''
    //     this.ucode = this.checkedValue[i].autoid
    //     if (this.checkedValue[i].loopsorts !== null && this.checkedValue[i].loopsorts !== '') {
    //       const loop = this.checkedValue[i].loopsorts.split(',')
    //       for (let j = 0; j < loop.length; j++) {
    //         this.loops +=  '回路-' + loop[j]+','
    //        /* this.loopOptions.push({
    //           value
    //         })*/
    //       }
    //      /* this.loops = this.loopOptions
    //       console.log(typeof this.loops.constructor === Array + '---')*/
    //       this.tableData.push({
    //         'ucode': this.ucode,
    //         'loops': this.loops
    //       })
    //     }
    //   }
    // }
  },
  methods: {
    addloop() {
      if(this.tableChecked.length === 0) {
        this.$message.error('请选择单灯。')
        return
      }
      var list = [];
      for(let i=0;i < this.tableChecked.length;i++){
         list.push(this.tableChecked[i].data)
      }
      var acts = [];
      if(this.actionradio === "1"){
          acts.push(100);
          acts.push(10);
          acts.push(100);
      }else if(this.actionradio === "2"){
          acts.push(0);
          acts.push(10);
          acts.push(100);
      }else{
          acts.push(this.sizeForm.lampsmask);
          acts.push(10);
          acts.push(100);
      }
      var req = {
        id: this.loopSorts,
        nodes: list,
        acts: acts
      }
      this.$axios.post("acloud-lighting/wxserver/onOffLamp",req).then(res => {
        if (res.data.code === 20000) {
          this.$message.success('执行动作成功。')
          this.loaddata()
          this.drawer.controlltimeDrawer.hide()
        } else {
          this.$message.error(res.data.message)
          this.loaddata()
          this.drawer.controlltimeDrawer.hide()
          return
        }
      }).catch(() => {
        //this.$message.error('服务器繁忙。')
      })
    },
    changeHandler(val) {
      this.actionradio = val

    },
    cancelcontroller() {
      this.drawer.controlltimeDrawer.hide()
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkedLoopsBy = value
      this.checkAll = checkedCount === this.loops.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.loops.length
    },
    selsChange(val) {
      this.tableChecked = val
    }

  }
}
</script>
<style scoped lang="scss">
  /deep/.el-checkbox.is-bordered+.el-checkbox.is-bordered{
    margin-bottom: 10px;
  }

</style>
