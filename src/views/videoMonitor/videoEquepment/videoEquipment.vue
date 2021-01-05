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
          <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="addVideoHK">新增</el-button>
          <el-button type="primary" style="background-color: #f48a60;border-color: #f48a60" @click="updateVideoHk">编辑</el-button>
          <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34" @click="deleteVideoHk">删除</el-button>
          <!-- <el-button type="primary">获取通道</el-button>
            <el-button type="primary">开启直播</el-button>
            <el-button type="primary">关闭直播</el-button>
            <el-button type="primary">删除状态</el-button> -->
          </el-form-item>
        <el-form-item prop="searchKey">
          <el-input v-model="tableData.params.searchKey" :maxlength="200" clearable placeholder="请输入搜索条件" />
        </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div>
      <el-row>
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
          <el-table-column show-overflow-tooltip prop="videoHkInfo.fName" label="设备名称" sortable />
          <el-table-column show-overflow-tooltip prop="sysProject.fName" label="所属项目" sortable />
          <el-table-column show-overflow-tooltip prop="videoCloudUser.fName" label="视频账户" />
          <el-table-column show-overflow-tooltip prop="videoHkInfo.fSerial" label="序列号" />
          <el-table-column show-overflow-tooltip prop="videoHkInfo.validatecode" label="验证码" />
          <el-table-column show-overflow-tooltip prop="videoHkInfo.fDeviceaccount" label="设备账号" />
<!--          <el-table-column show-overflow-tooltip prop="videoHkInfo.fDevicepass" label="设备密码" />-->
<!--          <el-table-column show-overflow-tooltip prop="videoHkInfo.devicestatus" label="设备状态" >-->
<!--            <template slot-scope="scope">-->
<!--              {{}}-->
<!--            </template>-->
<!--          </el-table-column>-->
<!--          <el-table-column show-overflow-tooltip prop="videoHkInfo.livestatus" label="直播状态" />-->
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="monitor(scope.row)">监控</el-button>
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
      </el-row>
    </div>
    <div>
      <el-drawer
        :title="drawerObj.drwTitle"
        size="50%"
        :visible.sync="drawerObj.drawer"
        :destroy-on-close="true"
        :before-close="handleClose"
      >

        <el-form ref="form" :rules="model.rules" :model="videoHkInfo" label-width="100px">
          <el-form-item v-show="excuteStatus != 'getToken'" label="名称:" prop="fName" class="form-item" :rules="model.rules.fName">
            <el-input v-model="videoHkInfo.fName" :maxlength="16" clearable placeholder="设备名称" />
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="所属项目:" prop="fProjectid" class="form-item" :rules="model.rules.fProjectid">
            <el-select v-model="videoHkInfo.fProjectid" placeholder="请选择">
              <el-option v-for="item in projectList" :key="item.fID" :label="item.fName" :value="item.fID" />
            </el-select>
          </el-form-item>
          <el-form-item v-show="excuteStatus != 'getToken'" label="视频账号:" prop="videocloudId" class="form-item" :rules="model.rules.secomEquipmentTypeIDx">
            <el-select v-model="videoHkInfo.videocloudId" placeholder="请选择">
              <el-option v-for="item in videoCloudUserList" :key="item.fID" :label="item.fName" :value="item.fID" />
            </el-select>
          </el-form-item>
          <el-form-item label="序列号:" prop="fSerial" class="form-item" :rules="model.rules.fSerial">
            <el-input v-model="videoHkInfo.fSerial" :maxlength="10" clearable placeholder="请输入9位设备序列号" />
          </el-form-item>
          <el-form-item label="验证码:" prop="validatecode" class="form-item" :rules="model.rules.validatecode">
            <el-input v-model="videoHkInfo.validatecode" :maxlength="200" clearable placeholder="设备验证码,设备机身上六位大写字母" />
          </el-form-item>
          <el-form-item label="备注:" class="form-item">
            <el-input v-model="videoHkInfo.fRemarks" :maxlength="200" clearable placeholder="请输入" />
          </el-form-item>
        </el-form>

        <el-drawer
          ref="innerMapDrawer"
          size="80%"
          :append-to-body="true"
          :visible.sync="innerDrawer"
        >
          <map-drawer :drawer="innerMapDrawer1" @saveMapInfo="saveMapInfo" />
        </el-drawer>

        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="drawerObj.drawer=false">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
      </el-drawer>
    </div>
    <div>
      <el-drawer :title="videoTitle" size="80%" :visible.sync="drawerVideo" :destroy-on-close="true">
        <div class="hello-ezuikit-js">
          <el-row>
            <el-col :span="12" :offset="3">
              <div id="video-container" style="width:600px;height:500px;float: left;" />
            </el-col>
            <el-col :span="9">
              <div id="left" class="ptz">
                <div class="PTZOperator">
                  <div class="ptz-name ng-binding"></div>
                  <div class="ptz-ctrl">
                    <div class="ptz-ctrl-l">
                      <span class="direction" @click="actionStart(4, true)"><i class="icon-ptz-left-up" /></span>
                      <span class="direction" @click="actionStart(0, true)"><i class="icon-ptz-up" /></span>
                      <span class="direction" @click="actionStart(6, true)"><i class="icon-ptz-right-up" /></span>
                      <span class="direction" @click="actionStart(2, true)"><i class="icon-ptz-left" /></span>
                      <span class="direction" @click="actionStart(14, true)"><i class="icon-ptz-auto" /></span>
                      <span class="direction" @click="actionStart(3, true)"><i class="icon-ptz-right" /></span>
                      <span class="direction" @click="actionStart(5, true)"><i class="icon-ptz-left-down" /></span>
                      <span class="direction" @click="actionStart(1, true)"><i class="icon-ptz-down" /></span>
                      <span class="direction" @click="actionStart(7, true)"><i class="icon-ptz-right-down" /></span>
                    </div>
                    <!-- <div class="ptz-ctrl-r">
                      <span class="operation">
                        <i class="icon-ptz-zoomout" title="调焦 -" @click="actionStart(8,false)" />
                        <i class="icon-ptz-zoomin" title="调焦 +" @click="actionStart(9, false)" />
                      </span>
                      <span class="operation">
                        <i class="icon-ptz-focusout" title="聚焦 -" @click="actionStart(10, false)" />
                        <i class="icon-ptz-focusin" title="聚焦 +" @click="actionStart(11, false)" />
                      </span>
                      <span class="operation">
                        <i class="icon-ptz-irisout" title="光圈 -" @click="actionStart(12, false)" />
                        <i class="icon-ptz-irisin" title="光圈 +" @click="actionStart(13, false)" />
                      </span>
                    </div> -->
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row style="text-align: center;">
            <el-button type="primary" @click="closeVideo">确 定</el-button>
          </el-row>

        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import VideoComp from './videoComp.vue'
import EZUIKit from 'ezuikit-js'
import mapDrawer from '../../websiteManage/components/mapDrawer'
import {
  getVideoEquipment,
  addVideoHkInfo,
  deleteVideoHKInfo,
  updateVideoHkInfo
} from './videoE.js'
import {
  queryProject,
  queryVideoCloudUserAll
} from '@/views/videoMonitor/videoAccount/videoM.js'
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
const paramFormRules = {
  searchKey: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: {
    mapDrawer
  },
  filters: {

  },
  data() {
    return {
      innerMapDrawer1: this.$refs,
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10,
          searchKey: ''
        },
        paramFormRules,
        total: 0,
        listLoading: true,
        dataList: []
      },
      selectList: [],
      videoHkInfo: {},
      drawerObj: {
        drwTitle: '',
        drawer: false
      },
      excuteStatus: '',
      projectList: [],
      videoCloudUserList: [],
      model: {
        rules: {
          fName: [{
            required: true,
            message: '请输入视频账号名称。',
            trigger: 'change'
          },
          {
            pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }
          ],
          fProjectid: [{
            required: true,
            message: '请选择所属项目。',
            trigger: 'change'
          },
          {
            required: true,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }
          ],
          videocloudId: [{
            required: true,
            message: '选择视频账号。',
            trigger: 'change'
          }],
          fSerial: [{
            required: true,
            message: '请输入序列号。',
            trigger: 'change'
          },
          {
            pattern: '^[a-zA-Z0-9]{9}$',
            message: '请输入9位序列号(数字和字母)',
            trigger: 'change'
          }
          ],
          validatecode: [{
            required: true,
            message: '请输入验证码。',
            trigger: 'change'
          },
          {
            pattern: '^[A-Z]{6}$',
            message: '请输入6位大写字母',
            trigger: 'change'
          }
          ]
        }
      },
      videoTitle: '监控视频',
      drawerVideo: false,
      player: {},
      selectOneRow: {},
      innerDrawer: false
    }
  },
  computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    }
  },
  created() {
    this.getTableData()
    this.selectProject()
    this.selectVideoCloudUserAll()
  },

  methods: {
    search() {
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.getTableData()
        }
      })
    },
    reset() {
      this.tableData.params.searchKey = ''
      this.tableData.params.currentPage = 1
      this.tableData.params.pageSize = 10
      this.getTableData()
    },
    selectProject() {
      queryProject().then(res => {
        if (res.data.code === 20000) {
          this.projectList = res.data.data
        }
      })
    },
    selectVideoCloudUserAll() {
      queryVideoCloudUserAll().then(res => {
        if (res.data.code === 20000) {
          this.videoCloudUserList = res.data.data
        }
      })
    },
    getTableData() {
      getVideoEquipment(this.tableData.params.searchKey, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.total
          this.tableData.listLoading = false
        } else {
          this.$message.error(res.data.message || '查询失败')
        }
      })
    },
    addVideoHK() {
      this.videoHkInfo = {}
      this.drawerObj.drwTitle = '新增设备'
      this.drawerObj.drawer = true
      this.excuteStatus = 'add'
    },
    updateVideoHk() {
      if (this.selectList.length !== 1) {
        this.$message.error('请只选中一行来操作')
        return
      }
      this.drawerObj.drwTitle = '海康设备修改'
      this.drawerObj.drawer = true
      this.excuteStatus = 'update'
      console.log(this.selectList[0].videoHkInfo)
      this.videoHkInfo = { ...this.selectList[0].videoHkInfo
      }
    },
    deleteVideoHk() {
      if (this.selectList.length < 1) {
        this.$message.error('请选中一个或多个选项。。。')
        return
      }
      var deleteList = []
      for (let i = 0; i < this.selectList.length; i++) {
        deleteList.push(this.selectList[i].videoHkInfo.fId)
      }
      deleteVideoHKInfo(deleteList).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.getTableData()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
    },
    monitor(row) {
      this.drawerVideo = true
      this.selectOneRow = row

      if (JSON.stringify(this.player) !== '{}') {
        this.$nextTick(() => {
          this.player.play()
        })
        return
      }
      // dom执行完之后，再运行里面的回调函数
      this.$nextTick(function() {
        this.player = new EZUIKit.EZUIKitPlayer({
          autoplay: true,
          id: 'video-container',
          accessToken: row.videoCloudUser.accessToken,
          url: 'ezopen://open.ys7.com/' + row.videoHkInfo.fSerial + '/1.live',
          template: 'standard', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
          // 视频上方头部控件
          header: ['capturePicture', 'save', 'zoom'], // 如果templete参数不为simple,该字段将被覆盖
          // plugin: ['talk'],                       // 加载插件，talk-对讲
          // 视频下方底部控件
          // footer: ["talk", "broadcast", "hd", "fullScreen"], // 如果template参数不为simple,该字段将被覆盖
          audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
          openSoundCallBack: data => console.log('开启声音回调', data),
          closeSoundCallBack: data => console.log('关闭声音回调', data),
          startSaveCallBack: data => console.log('开始录像回调', data),
          stopSaveCallBack: data => console.log('录像回调', data),
          // capturePictureCallBack: data => console.log("截图成功回调", data),
          // fullScreenCallBack: data => console.log("全屏回调", data),
          // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
          width: 600,
          height: 400
        })
        // this.player.play();
      })
    },

    closeVideo() {
      this.player.stop()
      this.drawerVideo = false
    },
    selectMap() {
      this.innerDrawer = true
    },
    saveMapInfo(mapInfo) {
      this.videoHkInfo.fLongitude = mapInfo.lng
      this.videoHkInfo.fLatitude = mapInfo.lat
      this.videoHkInfo.address = mapInfo.address
    },
    actionStart(vType) {
      // setTimeout("actionStop()", 1000);
      var url = 'https://open.ys7.com/api/lapp/device/ptz/start'
      // var url = '/videoapi/api/lapp/device/ptz/start'
      var vParam = {
        accessToken: this.selectOneRow.videoCloudUser.accessToken,
        deviceSerial: this.selectOneRow.videoHkInfo.fSerial,
        channelNo: 1, // vivw.channelNo,
        direction: vType,
        speed: 1
      }
      this.ysPost(url, vParam)
    },
    ysPost(url, vParam) {
      var that = this
      url = this.concatUrl(url, vParam)
      axios.post(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(res => {
        if (res.data.code == 200) {
          setTimeout(function() {
            var urlStop = 'https://open.ys7.com/api/lapp/device/ptz/stop'
            urlStop = that.concatUrl(urlStop, vParam)
            axios.post(urlStop, {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }).then(res => {

            })
          }, 1000)
        } else if (res.data.code == 60005) {
          that.$message.error(res.data.msg)
        } else if (res.data.code == 60004) {
          that.$message.error(res.data.msg)
        } else if (res.data.code == 60000) {
          that.$message.error(res.data.msg)
        } else if (res.data.code == 60003) {
          that.$message.error(res.data.msg)
        } else if (res.data.code == 60002) {
          that.$message.error(res.data.msg)
        } else if (res.data.code == 60006) {
          that.$message.error(res.data.msg)
        } else if (res.data.code == 4) {
          that.$message.error(res.data.msg)
        }
      })
    },
    concatUrl(url, vParam) {
      var tempUrl = ''
      for (const item in vParam) {
        tempUrl = tempUrl + item + '=' + vParam[item] + '&'
      }
      url = url + '?' + tempUrl.substring(0, tempUrl.length - 1)
      return url
    },

    confirmSave() {
      this.$refs.form.validate(v => {
        if (v) {
          if (this.excuteStatus === 'add') {
            addVideoHkInfo(this.videoHkInfo).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawerObj.drawer = false
                this.getTableData()
              } else {
                this.$message.error(res.data.message || "添加失败")
              }
            })
          } else if (this.excuteStatus === 'update') {
            updateVideoHkInfo(this.videoHkInfo).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawerObj.drawer = false
                this.getTableData()
              } else {
                this.$message.error(res.data.message)
              }
            })
          } else {

          }
        }
      })
    },
    selsChange(val) {
      this.selectList = val
    },
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
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {})
    },
    indexMethod(index) {
      return this.xuhao + index + 1
    },
    handleSizeChange(val) {
      this.tableData.params.pageSize = val
      this.tableData.currentPage = 1
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val
      this.getTableData()
    }
  }
}
</script>

<style scoped>
  #all {
    width: 920px;
    height: 685px;
    margin: auto;
  }

  #left {
    float: left;
    height: 100%;
    width: 710px;
  }

  #right {
    background: #e6e6e6;
    height: 100%;
    width: 200px;
    float: right;
  }

  #openclose {
    float: right;
    display: block;
    padding: 0px;
    margin-top: 220px;
    overflow: hidden;
    text-align: center;
    font-size: 1px;
    cursor: pointer;
    z-index: 1;
    visibility: visible;
    height: 50px;
    width: 10px;
  }

  .open {
    background: url("./res/expand.png") 0 0 no-repeat;
  }

  .closed {
    background: url("./res/expand.png") -10px 0 no-repeat;
  }

  .PTZOperator>div {
    margin-left: 60px;
    float: left;
  }

  .ptz-name {
    height: 35px;
    margin-left: 50px;
    line-height: 35px;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #E2E2E2;
  }

  .ptz-ctrl {
    height: 130px;
  }

  .ptz-ctrl-l {
    float: left;
    margin-top: 10px;
    width: 115px;
  }

  .ptz-ctrl-r {
    float: left;
    margin-top: 10px;
    text-align: right;
    width: 75px;
  }

  .ptz-ctrl-l .direction {
    float: left;
    width: 32px;
    height: 32px;
    margin: 0 4px 4px 0;
    cursor: pointer;
    background-image: url(./res/ptz-icons.png);
    background-color: #ffffff;
    background-position: 0 -90px;
  }

  .ptz-ctrl-l i {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin: 1px 1px;
    background: url(./res/ptz-icons.png) no-repeat;
  }

  .ptz-ctrl-l i:hover {
    background-image: url(./res/ptz-icons-on.png);
  }

  .ptz i.icon-ptz-left-up {
    background-position: 0 0;
  }

  .ptz i.icon-ptz-up {
    background-position: -30px 0px;
  }

  .ptz i.icon-ptz-right-up {
    background-position: -60px 0px;
  }

  .ptz i.icon-ptz-left {
    background-position: 0 -30px;
  }

  .ptz i.icon-ptz-auto {
    background-position: -30px -30px;
  }

  .ptz i.icon-ptz-auto-sel {
    background-position: -126px -90px;
  }

  .ptz i.icon-ptz-right {
    background-position: -60px -30px;
  }

  .ptz i.icon-ptz-left-down {
    background-position: 0px -60px;
  }

  .ptz i.icon-ptz-down {
    background-position: -30px -60px;
  }

  i.icon-ptz-right-down {
    background-position: -60px -60px;
  }

  .ptz-ctrl-r .operation {
    float: left;
    width: 75px;
    height: 32px;
    margin-bottom: 4px;
    cursor: pointer;
    background-image: url(./res/ptz-icons.png);
    background-color: #ffffff;
    background-position: -32px -90px;
  }

  .ptz-ctrl-r i {
    float: left;
    width: 36px;
    height: 30px;
    margin: 1px 0 1px 1px;
    background: url(./res/ptz-icons.png) no-repeat;
  }

  .ptz-ctrl-r i:hover {
    float: left;
    width: 36px;
    height: 30px;
    margin: 1px 0 1px 1px;
    background: url(./res/ptz-icons-on.png) no-repeat;
  }

  .ptz-ctrl-r i.icon-ptz-zoomout {
    background-position: -90px 0;
  }

  .ptz-ctrl-r i.icon-ptz-zoomin {
    background-position: -126px 0;
  }

  .ptz-ctrl-r i.icon-ptz-focusout {
    background-position: -90px -30px;
  }

  .ptz-ctrl-r i.icon-ptz-focusin {
    background-position: -126px -30px;
  }

  .ptz-ctrl-r i.icon-ptz-irisout {
    background-position: -90px -60px;
  }

  .ptz-ctrl-r i.icon-ptz-irisin {
    background-position: -126px -60px;
  }

  .ptz-slider {
    width: 190px;
  }

  .ptz-ctrl-bottom {
    width: 190px;
    height: 59px;
    margin: 10px 0 10px 0;
    background-image: url(./res/ptz-icons.png);
    background-position: 0 -212px;
  }

  .ptz-ctrl-bottom i {
    float: left;
    width: 37px;
    height: 28px;
    margin: 1px 0 1px 1px;
    background-image: url(./res/ptz-icons.png);
    cursor: pointer;
  }

  .ptz-ctrl-bottom i:hover {
    float: left;
    width: 37px;
    height: 28px;
    margin: 1px 0 1px 1px;
    background-image: url(./res/ptz-icons-on.png);
    cursor: pointer;
  }

  .ptz-ctrl-bottom i.icon-ptz-light {
    background-position: -162px 0;
  }

  .ptz-ctrl-bottom i.icon-ptz-light-on {
    /*background-image: url();*/
  }

  .ptz-ctrl-bottom i.icon-ptz-light-disabled {
    background-image: url(./res/ptz-icons.png);
    background-position: -199px -90px;
    cursor: default;
  }

  .ptz-ctrl-bottom i.icon-ptz-wiper {
    background-position: -162px -30px;
  }

  .ptz-ctrl-bottom i.icon-ptz-wiper-on {
    /*background-image: url();*/
  }

  .ptz-ctrl-bottom i.icon-ptz-wiper-disabled {
    background-image: url(./res/ptz-icons.png);
    background-position: -199px -120px;
    cursor: default;
  }

  .ptz-ctrl-bottom i.icon-ptz-auxfocus {
    background-position: -199px 0;
  }

  .ptz-ctrl-bottom i.icon-ptz-auxfocus-disabled {
    background-image: url(./res/ptz-icons.png);
    background-position: -199px -210px;
    cursor: default;
  }

  .ptz-ctrl-bottom i.icon-ptz-lensinit {
    background-position: -199px -30px;
  }

  .ptz-ctrl-bottom i.icon-ptz-lensinit-disabled {
    background-image: url(./res/ptz-icons.png);
    background-position: -199px -240px;
    cursor: default;
  }

  .ptz-ctrl-bottom i.icon-ptz-menu {
    background-position: -162px -90px;
  }

  .ptz-ctrl-bottom i.icon-ptz-menu-disabled {
    background-image: url(./res/ptz-icons.png);
    background-position: -198px -270px;
    cursor: default;
  }

  .ptz-ctrl-bottom i.icon-ptz-manualtrack {
    background-position: -162px -60px;
  }

  .ptz-ctrl-bottom i.icon-ptz-manualtrack-on {
    background-image: url(./res/ptz-icons-on.png);
    background-position: -162px -60px;
  }

  .ptz-ctrl-bottom i.icon-ptz-manualtrack-disabled {
    background-image: url(./res/ptz-icons.png);
    background-position: -236px -210px;
    cursor: default;
  }

  .ptz-ctrl-bottom i.icon-ptz-zoom3d {
    background-position: -199px -60px;
  }

  .ptz-ctrl-bottom i.icon-ptz-zoom3d-on {
    background-image: url(./res/ptz-icons-on.png);
    background-position: -199px -60px;
  }

  .ptz-ctrl-bottom i.icon-ptz-zoom3d-disabled {
    background-image: url(./res/ptz-icons.png);
    background-position: -236px -240px;
    cursor: default;
  }

  .ptz-ctrl-bottom i.icon-ptz-ctrl {
    background-position: -236px -270px;
  }

  .ptz-ctrl-bottom i.icon-ptz-manual-trace {
    background-position: -266px -211px;
    background-repeat: no-repeat;
  }

  .ptz-ctrl-bottom i.icon-ptz-manual-trace-disabled {
    background-position: -266px -240px;
    background-repeat: no-repeat;
  }

  .ptz-ctrl-bottom i.icon-ptz-manual-trace-on {
    background-image: url(./res/ptz-icons-on.png);
    background-position: -266px -211px;
  }

  .ptz-ctrl-bottom i.icon-ptz-ctrl-on {
    background-image: url(./res/ptz-icons-on.png);
    background-position: -236px -270px;
  }

  .ptz-ctrl-bottom i.icon-ptz-ctrl-disabled {
    background-image: url(./res/ptz-icons.png);
    background-position: -266px -270px;
    cursor: default;
  }

  .ptz-ctrl-bottom i.icon-ptz-cruise {
    background-position: -231px -150px;
  }

  .ptz-ctrl-bottom i.icon-ptz-cruise-on {
    background-image: url(./res/ptz-icons-on.png);
    background-position: -231px -150px;
  }

  .ptz-ctrl-bottom i.icon-ptz-parkaction {
    background-position: -261px -150px;
  }

  .ptz-ctrl-bottom i.icon-ptz-parkaction-on {
    background-image: url(./res/ptz-icons-on.png);
    background-position: -261px -150px;
  }
  div /deep/.el-drawer{
overflow:auto
}
</style>
