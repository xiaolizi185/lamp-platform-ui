<template>
  <div class="app-container">
    <div class="leftdiv box-card">
      <el-card class="posHigh">
        <el-tree :data="treeList" node-key="id" @node-click="handleNodeClick" />
      </el-card>
    </div>
    <div class="rightdiv box-card">
      <el-card>
        <div>
          <el-row>
            <el-col :span="4.8">
              <el-row>照明总数量: {{ dataTotal.lightTotal }}</el-row>
            </el-col>
            <!-- <el-col :span="6">
              <el-row>总能耗: {{ dataTotal.powerTotal }}</el-row>
            </el-col>-->
            <el-col :span="5" style="margin-left: 3px">
              <el-row>运行时电压: {{ dataTotal.VoltageMax }}(V)</el-row>
            </el-col>
            <el-col :span="5" style="margin-left: 15px">
            <el-row>运行时电流: {{ dataTotal.currentMax }}(A) </el-row>
          </el-col>

            <el-col :span="5" style="margin-left: 15px">
              <el-row>运行时功率: {{ dataTotal.powerA  }}(W) </el-row>
            </el-col>

          </el-row>
          <el-row>
             <el-col :span="5" style="margin-left: 1px">
            <el-row>当前站点累积耗电量: {{runpower  }} kW·H</el-row>
          </el-col>
          <el-col :span="5" style="margin-left: 20px">
            <el-row>当前站点运行时长: {{ runnum }} 天</el-row>
          </el-col>
          </el-row>
        </div>
        <div style="margin: 10px;">
          <el-button-group>
            <el-button type="primary" @click="changeAvgdata('current')">电流曲线</el-button>
            <el-button type="primary" @click="changeAvgdata('voltage')">电压曲线</el-button>
            <el-button type="primary" @click="changeAvgdata('power')">功率曲线</el-button>
            <!--<el-button type="primary" @click="changeAvgdata('powerTotal')">总功率曲线</el-button>-->
            <el-button type="primary" @click="selectTime">选择时间</el-button>
            <el-button type="primary" icon="el-icon-refresh-right" />
          </el-button-group>
        </div>
        <div style="margin: 10px;">
          <span>【站点:</span>
          <span>{{ currentStation.uname }}</span>
          <span>/时间段:</span>
          <span>{{ currentStation.createtime }}</span>
          <span>至</span>
          <span>{{ currentStation.updatetime }}</span>
          <span>】</span>
        </div>
        <div id="mycharts" style="height: 550px;width: 800px;" />
      </el-card>
    </div>
    <div>
      <el-dialog title="时间选择" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="开始时间:" :label-width="formLabelWidth">
            <el-date-picker
              v-model="reqObj.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
          <el-form-item label="结束时间:" :label-width="formLabelWidth">
            <el-date-picker
              v-model="reqObj.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center;">
          <el-button type="primary" @click="selectAvg">查询</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { dateFormat } from '@/utils/publicMethod.js'
export default {
  components: {

  },
  filters: {

  },
  data() {
    return {
      treeList: [{
        id: 1,
        label: '所有站点',
        children: []
      }],
      dataList: [],
      currentStation: {},
      reqObj: {
        arcId: '020f5fcf-7268-42d3-ad4a-39e7ed7e8c72',
        startTime: '2020-01-01',
        endTime: '2020-10-01'
      },
      currentType: 'current',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      dataTotal: {},
      runnum:'',
      runpower:''
    }
  },
  computed: {

  },
  created() {
    this.getAllStation()
    this.getTotalData()
  },
  methods: {
    getAllStation() {
      this.$axios.get('/acloud-lighting/station/findAll').then(res => {
        if (res.data.code === 20000) {
          var list = res.data.data
          // this.reqObj.arcId = list[0].autoid;
          this.currentStation = list[0]
          var temp = []
          for (let i = 0; i < list.length; i++) {
            var obj = {}
            // obj.id = list[i].autoid
            obj.id = list[i].ucode
            // obj.label = list[i].uname
            obj.label = list[i].uname + ' ' + list[i].ucode
            temp.push(obj)
          }
          this.treeList[0].children = temp
          var tempTime = this.getLastHalfYear()
          var req = {
            arcId: this.treeList[0].children[0].id,
            startTime: tempTime.last,
            endTime: tempTime.now
          }
          this.getElectricCurrent(req)
        } else {
          this.$message.error(res.data.message || '查询失败')
        }
      })
    },
    getTotalData() {
      this.$axios.get('/acloud-lighting/stationReport/getTotalData').then(res => {
        if (res.data.code === 20000) {
          this.dataTotal = res.data.data[0]
        }
      })
    },
    handleNodeClick(data) {
      this.runnum='0'
      this.runpower='0'


      // 点击节点时切换数据
      var tempTime = this.getLastHalfYear()
      this.currentStation.createtime = tempTime.last
      this.currentStation.updatetime = tempTime.now
      this.currentStation.uname = data.label
      this.reqObj.arcId = data.id
      this.reqObj.startTime = tempTime.last
      this.reqObj.endTime = tempTime.now
      if (this.currentType === 'current') {
        this.getElectricCurrent(this.reqObj)
      } else if (this.currentType === 'voltage') {
        this.getValtaget(this.reqObj)
      } else if (this.currentType === 'power') {
        this.getPowerFactor(this.reqObj)
      }
    },
    getLastHalfYear() {
      var now = new Date()
      var year = now.getFullYear()
      // 0-11表示1-12月
      var month = now.getMonth() + 1
      var day = now.getDate()
      var dateObj = {}
      dateObj.now = year + '-' + month + '-' + day
      // 当前月的总天数
      var nowMonthDay = new Date(year, month, 0).getDate()
      // 如果是1、2、3,4,5,6月，年数往前推一年
      if (month - 6 <= 0) {
        // 6个月前所在月的总天数
        var last3MonthDay = new Date((year - 1), (12 - (6 - parseInt(month))), 0).getDate()
        // 6个月前所在月的总天数小于现在的天日期
        if (last3MonthDay < day) {
          dateObj.last = (year - 1) + '-' + (12 - (6 - month)) + '-' + last3MonthDay
        } else {
          dateObj.last = (year - 1) + '-' + (12 - (6 - month)) + '-' + day
        }
      } else {
        // 6个月前所在月的总天数
        var last3MonthDay = new Date(year, (parseInt(month) - 6), 0).getDate()
        // 6个月前所在月的总天数小于现在的天日期
        if (last3MonthDay < day) {
          // 当前天日期小于当前月总天数,2月份比较特殊的月份
          if (day < nowMonthDay) {
            dateObj.last = year + '-' + (month - 6) + '-' + (last3MonthDay - (nowMonthDay - day))
          } else {
            dateObj.last = year + '-' + (month - 6) + '-' + last3MonthDay
          }
        } else {
          dateObj.last = year + '-' + (month - 6) + '-' + day
        }
      }
      return dateObj
    },
    getValtaget(req) {
      this.$axios.post('/acloud-lighting/stationReport/getAvgData', req).then(res => {
        this.dataList = res.data.data
        var tempTime = []
        var valtaget = []
        var voltagetAList = []
        var voltageBList = []
        var voltageCList = []
        for (let i = 0; i < this.dataList.length; i++) {
          tempTime.push(this.dataList[i].creatTime)
          if (this.dataList[i].voltagetA === undefined || this.dataList[i].voltagetA === null) {
            voltagetAList.push(0)
          } else {
            voltagetAList.push(this.dataList[i].voltagetA)
          }

          if (this.dataList[i].electricCurrentS === undefined || this.dataList[i].electricCurrentS == null) {
            valtaget.push(0)
          } else {
            valtaget.push(this.dataList[i].electricCurrentS)
          }

          if (this.dataList[i].voltageB === undefined || this.dataList[i].voltageB == null) {
            voltageBList.push(0)
          } else {
            voltageBList.push(this.dataList[i].voltageB)
          }

          if (this.dataList[i].voltageC === undefined || this.dataList[i].voltageC == null) {
            voltageCList.push(0)
          } else {
            voltageCList.push(this.dataList[i].voltageC)
          }
        }

        var mycharts = this.$echarts.init(document.getElementById('mycharts'))
        var option = {
          legend: {
            // data: ['总电压', '电压A', '电压B', '电压C']
            data: ['电压A']
          },
          xAxis: {
            name: '日期',
            type: 'category',
            data: tempTime
          },
          yAxis: {
            name: '平均值(V)',
            type: 'value'
          },
          series: [
            /* {
              name: '总电压',
              data: valtaget,
              type: 'line'
            },*/
            {
              name: '电压A',
              data: voltagetAList,
              type: 'line'
            }
            /* {
              name: '电压B',
              data: voltageBList,
              type: 'line'
            },
            {
              name: '电压C',
              data: voltageCList,
              type: 'line'
            }*/
          ]
        }
        mycharts.setOption(option)
      })
    },
    getElectricCurrent(req) {

      this.$axios.post('/acloud-lighting/stationReport/getElectricCurrent', req).then(res => {
        this.dataList = res.data.data
        var tempTime = []
        var electricCurrentList = []
        var electricCurrentAList = []
        var electricCurrentBList = []
        var electricCurrentCList = []
        for (let i = 0; i < this.dataList.length; i++) {
          tempTime.push(this.dataList[i].creatTime)
          if (this.dataList[i].electricCurrentA === undefined || this.dataList[i].electricCurrentA === null) {
            electricCurrentAList.push(0)
          } else {
            electricCurrentAList.push(this.dataList[i].electricCurrentA)
          }

          if (this.dataList[i].electricCurrent === undefined || this.dataList[i].electricCurrent === null) {
            electricCurrentList.push(0)
          } else {
            electricCurrentList.push(this.dataList[i].electricCurrent)
          }

          if (this.dataList[i].electricCurrentB === undefined || this.dataList[i].electricCurrentB === null) {
            electricCurrentBList.push(0)
          } else {
            electricCurrentBList.push(this.dataList[i].electricCurrentB)
          }

          if (this.dataList[i].electricCurrentC === undefined || this.dataList[i].electricCurrentC === null) {
            electricCurrentCList.push(0)
          } else {
            electricCurrentCList.push(this.dataList[i].electricCurrentC)
          }
        }

        if(tempTime!=null)
        {
          var date2=new Date()
          var date1=new Date(Date.parse(tempTime[0].replace(/-/g,"/")))
          this.runnum=parseInt(Math.abs(date2.getTime()-date1.getTime())/1000/60/60/24)
          this.runpower=parseFloat(this.runnum*24*this.dataTotal.powerA/1000).toFixed(2).toString()
        }
        else
        {
          this.runnum=0
        }
        var mycharts = this.$echarts.init(document.getElementById('mycharts'))
        var option = {
          legend: {
            // data: ['总电流', '电流A', '电流B', '电流C']
            data: ['电流A']
          },
          xAxis: {
            name: '日期',
            type: 'category',
            data: tempTime
          },
          yAxis: {
            name: '平均值(A)',
            type: 'value'
          },
          series: [
            /* {
              name: '总电流',
              data: electricCurrentList,
              type: 'line'
            },*/
            {
              name: '电流A',
              data: electricCurrentAList,
              type: 'line'
            }
            /* {
              name: '电流B',
              data: electricCurrentBList,
              type: 'line'
            },
            {
              name: '电流C',
              data: electricCurrentCList,
              type: 'line'
            }*/
          ]
        }


        mycharts.setOption(option)

      })
    },
    getPowerFactor(req) {
      this.$axios.post('/acloud-lighting/stationReport/getPowerFactor', req).then(res => {
        this.dataList = res.data.data
        var tempTime = []
        var powerFactorSList = []
        var powerFactorAList = []
        var powerFactorBList = []
        var powerFactorCList = []
        for (let i = 0; i < this.dataList.length; i++) {
          tempTime.push(this.dataList[i].creatTime)
          if (this.dataList[i].powerFactorA === undefined || this.dataList[i].powerFactorA === null) {
            powerFactorAList.push(0)
          } else {
            powerFactorAList.push(this.dataList[i].powerFactorA)
          }

          if (this.dataList[i].powerFactorS === undefined || this.dataList[i].powerFactorS === null) {
            powerFactorSList.push(0)
          } else {
            powerFactorSList.push(this.dataList[i].powerFactorS)
          }

          if (this.dataList[i].powerFactorB === undefined || this.dataList[i].powerFactorB === null) {
            powerFactorBList.push(0)
          } else {
            powerFactorBList.push(this.dataList[i].powerFactorB)
          }

          if (this.dataList[i].powerFactorC === undefined || this.dataList[i].powerFactorC === null) {
            powerFactorCList.push(0)
          } else {
            powerFactorCList.push(this.dataList[i].powerFactorC)
          }
        }

        var mycharts = this.$echarts.init(document.getElementById('mycharts'))
        var option = {
          legend: {
            // data: ['总功率', '功率A', '功率B', '功率C']
            data: ['功率A']
          },
          xAxis: {
            name: '日期',
            type: 'category',
            data: tempTime
          },
          yAxis: {
            name: '平均值(W)',
            type: 'value'
          },
          series: [
            /* {
              name: '总功率',
              data: powerFactorSList,
              type: 'line'
            },*/
            {
              name: '功率A',
              data: powerFactorAList,
              type: 'line'
            }
            /* {
              name: '功率B',
              data: powerFactorBList,
              type: 'line'
            },
            {
              name: '功率C',
              data: powerFactorCList,
              type: 'line'
            }*/
          ]
        }
        mycharts.setOption(option)
      })
    },
    changeAvgdata(type) {
      this.currentType = type
      switch (type) {
        case 'current':
          this.getElectricCurrent(this.reqObj)
          break
        case 'voltage':
          this.getValtaget(this.reqObj)
          break
        case 'power':
          this.getPowerFactor(this.reqObj)
          break
        default:
          break
      }
    },
    selectTime() {
      this.dialogFormVisible = true
    },
    selectAvg() {
      this.currentStation.createtime = this.reqObj.startTime
      this.currentStation.updatetime = this.reqObj.endTime
      switch (this.currentType) {
        case 'current':
          this.getElectricCurrent(this.reqObj)
          break
        case 'voltage':
          this.getValtaget(this.reqObj)
          break
        case 'power':
          this.getPowerFactor(this.reqObj)
          break
        default:
          break
      }
      this.dialogFormVisible = false
    }

  }
}
</script>

<style scoped>
  .leftdiv {
    float: left;
    width: 20%;
    margin-right: 20px;
  }

  .posHigh {
    width: 100%;
    height: 690px;
  }

  .rightdiv {
    float: left;
  }
  div /deep/.el-dialog__header {
    background: #00a2ff;
  }
</style>
