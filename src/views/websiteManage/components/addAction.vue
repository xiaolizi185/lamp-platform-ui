<template>
  <div>
    <el-form
      ref="form"
      :model="sizeForm"
      label-width="80px"
      :rules="sizeForm.rules"
    >
      <div v-if="rtuType === 'A566EF12-3F1F-4E2F-A6AC-9A5E90D2C4ED' || rtuType ==='E43EC3CB-EB15-4429-9BF8-94BA92E08403' || rtuType==='经纬度策略' ||rtuType==='普通策略'">
        <el-form-item
          label="执行动作"
          prop="actiontype"
          :rules="sizeForm.rules.actiontype"
        >
          <el-select
            v-model="sizeForm.actiontype"
            prop="actiontype"
            placeholder="请选择执行动作"
            clearable
            style="width: 400px"
          >
            <el-option
              v-for="item in actionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div v-if="rtuType === 'A566EF12-3F1F-4E2F-A6AC-9A5E90D2C4ED' || rtuType==='经纬度策略'">
        <el-form-item
          label="时间类型"
          prop="timetype"
          :rules="sizeForm.rules.timetype"
        >
          <el-select
            v-model="sizeForm.timetype"
            placeholder="请选择执行时间"
            clearable
            style="width: 400px"
          >
            <el-option
              v-for="item in dateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div v-if="rtuType === 'E43EC3CB-EB15-4429-9BF8-94BA92E08403' || rtuType==='普通策略'">
        <el-form-item
          label="执行时间"
          prop="exectime"
          :rules="sizeForm.rules.exectime"
        >
          <!-- <div class="block">
            <el-time-picker
              v-model="sizeForm.exectime"
              style="width: 400px"
              start-placeholder="执行时间"
            />
          </div> -->
          <el-time-select
            v-model="sizeForm.exectime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00'
            }"
            placeholder="选择时间"
          />
        </el-form-item>
      </div>
      <!--      <div v-if="rtuType === '483045FD-E278-4EEB-AFE9-53836FCF6B27' || rtuType==='人流量策略'">
        <el-form-item label="人流量" prop="personnum" :rules="sizeForm.rules.personnum">
          <el-input v-model="sizeForm.personnum" clearable placeholder="请输入人流量" style="width: 400px" />
        </el-form-item>
      </div>-->
      <div v-if="sizeForm.actiontype===3">
        <el-form-item
          label="调光值"
          prop="lampsmask"
          :rules="sizeForm.rules.lampsmask"
        >
          <el-slider v-model="sizeForm.lampsmask" />
        </el-form-item>
      </div>
      <el-form-item
        label="单灯"
        prop="execloop"  
      >
        <el-checkbox-group
          v-model="checkedLoops"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="loop in loops"
            :key="loop"
            :label="loop"
          >{{ loop }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div style="text-align: center">
        <el-button
          style="margin-top: 12px;margin-rigt: 5px"
          type="primary"
          @click="addloop()"
        >确认添加</el-button>
        <el-button
          style="margin-top: 12px;margin-right: 5px"
          type="cancel"
          @click="cancelloop()"
        >取消添加</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import aTool from '@acloud/acloud-atool-js'
const loopOptions = ['1', '2', '3', '4']
export default {
  props: {
    drawer: {
      type: Object,
      default: null
    },
    rtuType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      checkAll: false,
      checkedLoops: [],
      checkedLoopsBy: null,
      loops: loopOptions,
      itemkey: '',
      isIndeterminate: true,
      parentTableData: [],
      sizeForm: {
        actiontype: '',
        exectime: '',
        execloop: '',
        lampsmask: '',
        personnum: '',
        rules: {
          actiontype: [
            { required: true, message: '请选择策略。', trigger: 'change' }
          ],
          timetype: [
            { required: true, message: '请选择时间类型。', trigger: 'change' }
          ],
          exectime: [
            { required: true, message: '请选择开始时间。', trigger: 'change' }
          ]
          
        }
      },
      actionList: [
        {
          value: 1,
          label: '开灯'
        },
        {
          value: 2,
          label: '关灯'
        },
        {
          value: 3,
          label: '调光'
        }
      ],
      dateList: [
        {
          value: 1,
          label: '日落时间'
        },
        {
          value: 2,
          label: '日出时间'
        }
      ]
    }
  },
  created() {},
  mounted() {},
  methods: {
    addloop() {
      this.$refs.form.validate((v) => {
       
        if (v) {
           if(this.checkedLoopsBy===null)
          {
           this.$message.error('请选择单灯')
           return
          }
          var parentTableData = {
            actiontype: this.sizeForm.actiontype,
            lampsmask: this.sizeForm.lampsmask,
            exectime: this.sizeForm.exectime,
            execloop: this.checkedLoopsBy,
            timetype: this.sizeForm.timetype
          }
          this.$emit('parentTableData', parentTableData)
          this.drawer.actionDrawer.hide()
        }
      })
    },
    cancelloop() {
      this.drawer.actionDrawer.hide()
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.checkedLoopsBy = value
      this.checkAll = checkedCount === this.loops.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.loops.length
    }
  }
}
</script>
<style scoped lang="scss">
/deep/.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-bottom: 10px;
}
</style>
