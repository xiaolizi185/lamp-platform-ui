<!--suppress ALL -->
<template>
  <!--地图容器-->
  <div>
    <div class="mapheader">
      <div>
        <el-row>
          <span class="themetitle">地图主题:</span>
          <el-button size="mini" round style="background-color: black;color: #fff;" @click="changetheme('dark')">黑夜</el-button>
          <el-button size="mini" round @click="changetheme('normal')">默认</el-button>
          <el-button size="mini" round style="background-color: #DAFFFD;color: black" @click="changetheme('googlelite')">精简</el-button>
          <el-button size="mini" round style="background-color: #0A2f48;color: #fff" @click="changetheme('midnight')">深蓝</el-button>
          <el-button size="mini" round style="background-color: #B7CA93;color: black" @click="changetheme('grassgreen')">浅绿</el-button>
          <span class="choosestation" @click="chooseStation('dark')">选择灯杆:<img src="../../icons/video/denggan.png" style="margin-left: 5px"></span>
        </el-row>
      </div>
    </div>
    <div id="XSDFXPage" class="XSDFXPage" />
    <!-------------------------选择站点----------------------------->
    <el-drawer
      v-if="poledrawer"
      ref="poleLightdrawer"
      title="选择灯杆"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="poledrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <choosePole :drawer="poledrawer1" :params="editParams" :loaddata="getTableData" @getStationInfo="getStationInfo" />
    </el-drawer>
    <!-----------------------模态对话框-------------------------------->
    <div  id="action-center-open" class="container-fluid action-center action-back" style="width:50%;left:25%; display:none;">
      <div class="row action-title actionDivCenter-top" style="line-height:40px;">
        <div id="LampPoleInfo-Div-Name" class="col-md-12" style="font-size:20px; text-align:center;"><span id="lightname">智慧灯杆</span></div>
        <div id="action-center-close" class="col-md-1" style="font-size:22px; cursor:pointer;position:absolute;top:6px;right:20px">X</div>
      </div>
      <div class="row"><hr></div>
      <!--模块-->
      <div id="action-center-module" class="row action-center-module" style="margin-left: 80px;cursor: pointer">
        <div id="events_zm" class="col-md-1 action-object-back action-object-zm" pval="zm" pbool="1" />
        <div id="events_led" class="col-md-1 action-object-back action-object-led " pval="led" pbool="0" />
        <div id="events_jk" class="col-md-1 action-object-back action-object-jk" pval="jk" pbool="0" />
        <div id="events_hjjc" class="col-md-1 action-object-back action-object-hjjk" pval="hjjc" pbool="0" />
        <div id="events_jg" class="col-md-1 action-object-back action-object-jg" pval="jg" pbool="0" />
        <div class="pswp__preloader__icn">
          <div class="pswp__preloader__cut">
            <div class="pswp__preloader__donut" />
          </div>
        </div>
        <!-- <div id="events_wifi" class="col-md-1 action-object-back action-object-wifi" pval="wifi" pbool="0" />
        <div id="events_hjjc" class="col-md-1 action-object-back action-object-hjjk" pval="hjjc" pbool="0" />
        <div id="events_yjhj" class="col-md-1 action-object-back action-object-yjhj" pval="yjhj" pbool="0" />-->
        <!--<div id="events_gb" class="col-md-1 action-object-back action-object-gb" pval="gb" pbool="0" />-->
      </div>
      <!--照明-->
      <div class="row action-Div-com action-Div-zm" hidden>
        <div class="row action-center-module-actioninfo">
          <div style="margin-bottom: 3px">站点:</div>
          <div id="Lighting-Div-Loop" class="col-md-10">
            <el-radio-group v-model="nameradio" @change="getRadioVal">
              <el-radio-button v-for="item in stationNameList" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="row action-center-module-actioninfo">
            <div style="margin-bottom: 3px">控制:</div>
            <el-button id="onlight" type="primary" value="开灯" pid="13">开灯</el-button>
            <el-button id="offlight" type="primary" value="关灯" pid="13">关灯</el-button>
            <el-button id="changelight" type="primary" value="调光">调光</el-button>
          </div>
          <div class="row action-center-module-actioninfo1" hidden>
            <div class="col-md-1">调光</div>
            <div id="action-slider" class="col-md-10" style="padding:0px;margin-left:0px;" />
            <el-slider v-model="lampsmask" />
          </div>
        </div>
      </div>
      <!--显示屏led-->
      <div class="row action-Div-com action-Div-led" hidden>
        <div class="row action-center-module-actioninfo">
          <div style="margin-bottom: 3px">显示屏:</div>
          <div class="col-md-10">
            <el-radio-group v-model="displaynameradio" @change="getDisplayRadioVal">
              <el-radio-button v-for="item in displaynameList" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
            </el-radio-group>
          </div>
          <!-- <div class="col-md-1">调光</div>
          <div id="action-led-light-slider" class="col-md-10" style="padding:0px;margin-left:0px;" />
          <el-slider v-model="displaylampsmask" />-->
        </div>
        <div class="row action-center-module-actioninfo">
          <div style="margin-bottom: 3px">控制:</div>
          <el-button id="led_open" type="primary" value="开灯" pid="13">开屏</el-button>
          <el-button id="led_close" type="primary" value="关灯" pid="13">关屏</el-button>
          <!--<el-button id="change_led" type="primary" value="调光">调光</el-button>-->
        </div>
      </div>
      <!--摄像头-->
      <div class="row action-Div-com action-Div-jk" hidden>
        <div class="row action-center-module-actioninfo">
          <!-- <div style="margin-bottom: 3px">控制:</div>
          <el-button id="cloudPlay" type="primary" value="云 播 放" pid="13">云 播 放</el-button>-->
          <div style="margin-bottom: 3px">摄像头:</div>
          <div class="col-md-10">
            <el-radio-group v-model="videonameradio" @change="getVideoRadioVal">
              <el-radio-button v-for="item in videonameList" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <!--垃圾桶-->
      <div class="row action-Div-com action-Div-hjjc" hidden>
        <div class="row action-center-module-actioninfo">
          <div style="margin-bottom: 3px">垃圾桶:</div>
          <div class="col-md-10">
            <el-radio-group v-model="trashnameradio" @change="getTrashRadioVal">
              <el-radio-button v-for="item in trashnameList" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <!--井盖-->
      <div class="row action-Div-com action-Div-jg" hidden>
        <div class="row action-center-module-actioninfo">
          <div style="margin-bottom: 3px">井盖:</div>
          <div class="col-md-10">
            <el-radio-group v-model="wellnameradio" @change="getWellRadioVal">
              <el-radio-button v-for="item in wellnameList" :key="item.value" :label="item.value">{{ item.label }}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="row"><hr></div>

      <!--照明-->
      <div v-if="isReloadData" class="row action-Div-com action-Div-zm" hidden>
        <el-row>
          <el-col>编号：<label id="Lighting-Ucode" /></el-col>
        </el-row>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="12">经度：<label id="Lighting-long" /></el-col>
          <el-col :span="12">纬度：<label id="Lighting-lat" class="contentText" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="10">更新时间：<label id="Lighting-LinkDate" /></el-col>
          <el-col :span="14">安装地址：<label id="Lighting-Address" class="contentText" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <!-- <el-col :span="6">回路：<label id="Lighting-State1" /></el-col>
          <el-col :span="6">状态：<label id="Lighting-RtuState" /></el-col> -->
          <el-col :span="6">运行功率：<label id="Lighting-gonglv" /></el-col>
          <el-col :span="6">运行电流：<label id="Lighting-dianneng" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="6">运行电压：<label id="Lighting-VoltageA" /></el-col>
          <!-- <el-col :span="4">电压B：<label id="Lighting-VoltageB" /></el-col>
          <el-col :span="4">电压C：<label id="Lighting-VoltageC" /></el-col> -->
          <!-- <el-col :span="6">运行功率：<label id="Lighting-ElectricCurrentA" /></el-col> -->
          <!-- <el-col :span="4">功率B：<label id="Lighting-ElectricCurrentB" /></el-col>
          <el-col :span="4">功率C：<label id="Lighting-ElectricCurrentC" /></el-col> -->
        </div>
      </div>
      <!--显示屏-->
      <div v-if="isReloadData" class="row action-Div-com action-Div-led" hidden>
        <div class="row">
          <el-col :span="8" class="contentText">设备名称：<label id="led-DeviceName" /></el-col>
          <el-col :span="8" class="contentText">设备ID：<label id="led-DeviceID" /></el-col>
          <el-col :span="8" class="contentText">IP地址：<label id="led-DeviceIp" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="8" class="contentText">宽度：<label id="led-DeviceWidth" /></el-col>
          <el-col :span="8" class="contentText">高度：<label id="led-DeviceHeight" /></el-col>
          <el-col :span="8" class="contentText">音亮：<label id="led-DeviceVolume" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="8" class="contentText">设备状态：<label id="led-DeviceStatus" /></el-col>
          <el-col :span="8" class="contentText">创建时间：<label id="led-DeviceCreateTime" /></el-col>
          <!-- <el-col :span="8" class="contentText">上线时间：<label id="led-DeviceOnlineTIme" /></el-col> -->
        </div>
      </div>

      <!--视频-->
      <div class="row action-Div-com action-Div-jk" hidden>
        <div class="row">
          <el-row>
            <el-col :span="8" class="contentText">设备名称：<label id="Video-Name" /></el-col>
            <el-col :span="8" class="contentText">设备序列号：<label id="Video-ser" /></el-col>
          </el-row>
          <el-row>
            <el-col :span="38" class="contentText">安装地址：<label id="Video-address" /></el-col>
          </el-row>
        </div>
      </div>
      <!--环境监测-->
      <div class="row action-Div-com action-Div-hjjc" hidden>
        <div class="row">
          <el-col :span="8" class="contentText">设备名称：<label id="hjjc-Name" /></el-col>
          <el-col :span="8" class="contentText">IMEI：<label id="hjjc-Imei" /></el-col>
          <el-col :span="8" class="contentText">是否在线：<label id="hjjc-Online" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="8" class="contentText">经度：<label id="hjjc-Longitude" /></el-col>
          <el-col :span="8" class="contentText">纬度：<label id="hjjc-Latitude" /></el-col>
          <el-col :span="8" class="contentText">安装地址：<label id="hjjc-address" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="8" class="contentText">电量情况：<label id="hjjc-PoserState" /></el-col>
          <!-- <el-col :span="8" class="contentText">电压值：<label id="hjjc-Voltage" /></el-col>
          <el-col :span="8" class="contentText">电量值：<label id="hjjc-Value" /></el-col> -->
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="8" class="contentText">满空状态：<label id="hjjc-FullState" /></el-col>
          <el-col :span="8" class="contentText">倾倒状态：<label id="hjjc-IncellState" /></el-col>
          <el-col :span="8" class="contentText">信号功率：<label id="hjjc-Rsrp" /></el-col>
        </div>
      </div>

      <!-- 井盖 -->
      <div class="row action-Div-com action-Div-jg" hidden>
        <div class="row">
          <el-col :span="8" class="contentText">设备名称：<label id="jg-Name" /></el-col>
          <el-col :span="8" class="contentText">IMEI：<label id="jg-imei" /></el-col>
          <el-col :span="8" class="contentText">电量状态：<label id="jg-PoweState" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="8" class="contentText">经度：<label id="jg-Longitude" /></el-col>
          <el-col :span="8" class="contentText">纬度：<label id="jg-Latitude" /></el-col>
          <el-col :span="8" class="contentText">安装地址：<label id="jg-address" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="8" class="contentText">温度：<label id="jg-temp" /></el-col>
          <el-col :span="8" class="contentText">硬件版本：<label id="jg-hardwareVer" /></el-col>
          <el-col :span="8" class="contentText">软件版本：<label id="jg-softVer" /></el-col>
        </div>
        &nbsp;&nbsp;
        <div class="row">
          <el-col :span="8" class="contentText">在线状态：<label id="jg-online" /></el-col>
          <el-col :span="8" class="contentText">PCI：<label id="jg-pci" /></el-col>
          <el-col :span="8" class="contentText">创建时间：<label id="jg-time" /></el-col>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import choosePole from './components/choosePole'
import $ from 'jquery'
import Vue from 'vue'
import request from '../../utils/request'
import {
  getViewLedToLamp, getStationByLampId, openOrclose, getViewVideoToLamp, getTrashToLamp, getManholeToLamp
} from '@/views/lightingPoleManage/lightMapMonitorApi.js'
Vue.prototype.axios = request
export default {
  components: { choosePole },
  data() {
    return {
      poledrawer: false,
      poledrawer1: this.$refs,
      fileImgUrl: process.env.VUE_APP_FILE_URI,
      nameradio: '',
      displaynameradio: '',
      displaynameList: [], // 显示名称数组
      chooseDisplay: [],
      videonameradio: '',
      videonameList: [],
      trashnameradio: '',
      trashnameList: [],
      wellnameradio: '',
      wellnameList: [],
      chooseVideo: [],
      ZoomNum: '1',
      stationNameList: [], // 站点名称数组
      markerArr: [], // 需要标点的数据
      markerdic: {},
      markers: [],
      iws: {},
      value: '',
      isOpen: 0,
      actionradio: '', // 选择执行的动作
      lampsmask: 50, // 调光值
      displaylampsmask: 50, // 调光值
      finalUcode: '',
      lampId: '',
      icon: { w: 50, h: 70, l: 0, t: 0, x: 6, lb: 5 },
      isReloadData: true //刷新标志

    }
  },
  watch: {
    markerArr(val) {
      // 监听当获取到值的时候再调用方法
      this.value = this.markerArr
      this.createMap()// 创建地图
      this.setMapEvent()// 设置地图事件
      this.addMarker() // 向地图中添加marker
    },
    deep: true
  },
  created() {
    const params = {
      'fDelState': true,
      'createId': Vue.getAcloudProvider().getUserInfo().id
    }
    this.$axios.post('/acloud-lighting/lampPole/search?page=' + 1 + '&size=' + 20, params).then(res => {
      if (res.data.code === 20000) {
        this.markerArr = res.data.data.rows
      } else {
        this.$message.error(res.data.message || '查询失败')
        return
      }
    }).catch(() => {
      this.$message.error('服务器繁忙。')
    })
  },
   computed: {
    ...mapGetters(["token"]),
  },
  // 创建地图函数：
  methods: {
    geturl(id) {
      var s = this.fileImgUrl + id + "&access_token=" + this.token;
      return s;
    },
    createMap() {
      // 创建Map实例
      var map = new BMap.Map('XSDFXPage')
      // 初始化地图,设置中心点坐标
      var point = new BMap.Point(104.404, 30.915)// 创建点坐标
      map.centerAndZoom('成都', 12)
      // 添加鼠标滚动缩放
      map.enableScrollWheelZoom()
      window.map = map
      map.addEventListener('zoomend', function(e) {
        this.ZoomNum = map.getZoom()
      })
      map.setMapStyle({
        styleJson: [
          {
            featureType: 'building',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          }
        ]
      })
    },
    // 地图事件设置函数：
    setMapEvent() {
      map.enableDragging()// 启用地图拖拽事件，默认启用(可不写)
      map.enableScrollWheelZoom()// 启用地图滚轮放大缩小
      map.enableDoubleClickZoom()// 启用鼠标双击放大，默认启用(可不写)
      map.enableKeyboard()// 启用键盘上下左右键移动地图
    },
    // 创建marker
    addMarker() {
      var that = this
      for (var i = 0; i < that.markerArr.length; i++) {
        var p0 = that.markerArr[i].flongitude
        var p1 = that.markerArr[i].f_Latitude
        var point = new BMap.Point(p0, p1)
        var iconImg = that.createIcon(that.icon, that.markerArr[i].imgurl)
        var marker = new BMap.Marker(point, { icon: iconImg })
        var iw = that.createInfoWindow(i)
        var label = new BMap.Label(that.markerArr[i].fname, { 'offset': new BMap.Size(that.icon.lb - that.icon.x + 5, -20) })
        marker.setLabel(label)
        this.$set(this.markerdic, that.markerArr[i].fname, marker)
        map.addOverlay(marker)
        label.setStyle({
          borderColor: '#808080',
          color: '#333',
          cursor: 'pointer'
        })
        this.markers.push(marker)
        that.createwindow(i, marker, label, that.markerArr[i])
      }
      var markerClusterer = new BMapLib.MarkerClusterer(map, {
        markers: that.markers
      })
    },
    // 获取站点名字
    getRadioVal() {
      const params = {
        'lampId': this.lampId,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      getStationByLampId(1, 10, params).then(res => {
        if (res.data.code === 20000) {
          for (let j = 0; j < res.data.data.rows.length; j++) {
            if (this.nameradio === res.data.data.rows[j].autoId) {
              $('#Lighting-Ucode').text(res.data.data.rows[j].ucode)
              $('#Lighting-gonglv').text(parseFloat(res.data.data.rows[j].powerA).toFixed(2))
              $('#Lighting-RtuState').text(res.data.data.rows[j].loopstates)
              $('#Lighting-dianneng').text(parseFloat(res.data.data.rows[j].elecs).toFixed(2))
              $('#Lighting-VoltageA').text(parseFloat(res.data.data.rows[j].va).toFixed(2))
              $('#Lighting-VoltageB').text(res.data.data.rows[j].vb)
              $('#Lighting-VoltageC').text(res.data.data.rows[j].vc)
              $('#Lighting-ElectricCurrentA').text(res.data.data.rows[j].powera)
              $('#Lighting-ElectricCurrentB').text(res.data.data.rows[j].powerb)
              $('#Lighting-ElectricCurrentC').text(res.data.data.rows[j].powerc)
              $('#Lighting-LinkDate').text(res.data.data.rows[j].updatetime)
              $('#Lighting-Address').text(res.data.data.rows[j].address)
              $('#Lighting-long').text(res.data.data.rows[j].mapLongitude)
              $('#Lighting-lat').text(res.data.data.rows[j].mapLatitude)
            }
          }
        } else {
          this.$message.error(res.data.message || '查询失败')
          this.tableData.listLoading = false
          this.tableData.dataList = []
          return
        }
      }).catch(() => {
        this.$message.error('服务器繁忙。')
      })
    },
    // 点击显示屏名字切换
    getDisplayRadioVal() {
      const params = {
        'lampId': this.lampId,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      getViewLedToLamp(1, 10, params).then(res => {
        if (res.data.code === 20000) {
          for (let j = 0; j < res.data.data.rows.length; j++) {
            if (this.displaynameradio === res.data.data.rows[j].fId) {
              $('#led-DeviceName').text(res.data.data.rows[j].fName)
              $('#led-DeviceID').text(res.data.data.rows[j].fDeviceID)
              $('#led-DeviceIp').text(res.data.data.rows[j].fIp)
              $('#led-DeviceWidth').text(res.data.data.rows[j].fWidth)
              $('#led-DeviceHeight').text(res.data.data.rows[j].fHeight)
              $('#led-DeviceVolume').text(res.data.data.rows[j].fVolnme)
              $('#led-DeviceStatus').text(res.data.data.rows[j].fStatus === 1 ? '在线' : '离线')
              $('#led-DeviceCreateTime').text(res.data.data.rows[j].fCreateTime)
              $('#led-DeviceOnlineTIme').text(res.data.data.rows[j].fOnlineTime)
            }
          }
        }
      })
    },
    // 点击摄像头名字切换
    getVideoRadioVal() {
      const params = {
        'lampId': this.lampId,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      getViewVideoToLamp(1, 10, params).then(res => {
        if (res.data.code === 20000) {
          for (let j = 0; j < res.data.data.rows.length; j++) {
            if (this.displaynameradio === res.data.data.rows[j].fId) {
              $('#Video-Name').text(res.data.data.list[j].fName)
              $('#Video-ser').text(res.data.data.list[j].fSerial)
              $('#Video-address').text(res.data.data.list[j].address)
            }
          }
        }
      })
    },

    // 点击垃圾桶名字切换
    getTrashRadioVal() {
      const params = {
        'lampId': this.lampId,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      getTrashToLamp(1, 10, params).then(res => {
        if (res.data.code === 20000) {
          for (let j = 0; j < res.data.data.rows.length; j++) {
            if (this.trashnameradio === res.data.data.rows[j].id) {
              $('#hjjc-Name').text(res.data.data.rows[j].alias)
              $('#hjjc-Imei').text(res.data.data.rows[j].imei)
              $('#hjjc-Online').text(res.data.data.rows[j].online === 'true' ? '在线' : '离线')
              $('#hjjc-Longitude').text(res.data.data.rows[j].longitude)
              $('#hjjc-Latitude').text(res.data.data.rows[j].latitude)
              $('#hjjc-address').text(res.data.data.rows[j].address)
              $('#hjjc-PoserState').text(res.data.data.rows[j].powerState === null ? '未知' : (res.data.data.rows[j].powerState === 0 ? '正常' : '低电量'))
              $('#hjjc-temperature').text(res.data.data.rows[j].temperature)
              $('#hjjc-tiltangle').text(res.data.data.rows[j].tiltAngle)
              $('#hjjc-FullState').text(res.data.data.rows[j].fullState === null ? '未知' : (res.data.data.rows[j].fullState === 0 ? '空' : '已满'))
              $('#hjjc-IncellState').text(res.data.data.rows[j].inclineState === null ? '未知' : (res.data.data.rows[j].fullState === 0 ? '正常' : '倾倒'))// (res.data.data.rows[j].inclineState === 0 ? '正常' : '倾倒')
              $('#hjjc-Rsrp').text(res.data.data.rows[j].rsrp)
            }
          }
        }
      })
    },
    // 点击井盖名字切换
    getWellRadioVal() {
      const params = {
        'lampId': this.lampId,
        'userId': Vue.getAcloudProvider().getUserInfo().id
      }
      getManholeToLamp(1, 10, params).then(res => {
        if (res.data.code === 20000) {
          for (let j = 0; j < res.data.data.rows.length; j++) {
            if (this.wellnameradio === res.data.data.rows[j].id) {
              $('#jg-Name').text(res.data.data.rows[j].alias)
              $('#jg-imei').text(res.data.data.rows[j].imei)
              $('#jg-PoweState').text(res.data.data.rows[j].manholeCoverPositionState === null ? '未知' : (res.data.data.rows[j].manholeCoverPositionState === 0 ? '正常' : '移动'))
              $('#jg-Longitude').text(res.data.data.rows[j].longitude)
              $('#jg-Latitude').text(res.data.data.rows[j].latitude)
              $('#jg-address').text(res.data.data.rows[j].address)
              $('#jg-temp').text(res.data.data.rows[j].temperature)
              $('#jg-hardwareVer').text(res.data.data.rows[j].hardwareVer)
              $('#jg-softVer').text(res.data.data.rows[j].softVer)
              $('#jg-online').text(res.data.data.rows[j].online === 'true' ? '在线' : '离线')
              $('#jg-pci').text(res.data.data.rows[j].pci)
              $('#jg-time').text(res.data.data.rows[j].createTime)
            }
          }
        }
      })
    },
    // 刷新div
    reload () {
      this.isReloadData = false
      this.$nextTick(() => {
        this.isReloadData = true
      })
    },
    createwindow(i, marker, label, row) {
      var _iw = this.createInfoWindow(i)
      var _marker = marker
      this.$set(this.iws, row.fname, _iw)
      var that = this
      that.stationNameList = []
      const params = {
        'lampId': that.markerArr[i].fid,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      _marker.addEventListener('infowindowopen', function() {
        // 开始进来自动触发一次，以免一直等待
        //$('#events_zm').trigger("click");
        that.$message.error('请选择具体的设备信息查看。')
        $('#action-center-open').css('display', 'block')
        $('.BMap_pop').css('display', 'none')
        $('.action-Div-com').hide()
        $('#action-center-close').click(function() {
          $('#action-center-open').fadeOut()
        })
        // 站点调光
        $("#changelight").off("click").on("click",function(){
          $('.action-center-module-actioninfo1').css('display', 'block')
          if (that.lampsmask === 0 || that.lampsmask === null || that.lampsmask === undefined) {
            that.$message.error('请滑动调光值。')
            return
          }
          var list = []
          list.push(1)
          var acts = []
          acts.push(that.lampsmask)
          acts.push(10)
          acts.push(100)
          var req = {
            id: row.fname,
            nodes: list,
            acts: acts
          }
          that.$axios
            .post('acloud-lighting/wxserver/onOffLamp', req).then(res => {
              if (res.data.code === 20000) {
                that.$message.success('调光执行成功')
                $('#action-center-open').css('display', 'none')
                $('.BMap_pop').css('display', 'none')
                $('.BMap_shadow').css('display', 'none')
                return
              } else {
                that.$message.error('调光执行失败')
                $('#action-center-open').css('display', 'none')
                $('.BMap_pop').css('display', 'none')
                $('.BMap_shadow').css('display', 'none')
                return
              }
            }).catch(() => {
              return
            })
        })
        // 站点关灯
        $("#offlight").off("click").on("click",function(){
          $('.action-center-module-actioninfo1').css('display', 'none')
          var list = []
          list.push(1)
          var acts = []
          acts.push(0)
          acts.push(10)
          acts.push(100)
          var req = {
            id: row.fname,
            nodes: list,
            acts: acts
          }
          that.$axios
            .post('acloud-lighting/wxserver/onOffLamp', req)
            .then((res) => {
              if (res.data.code === 20000) {
                that.$message.success('关灯执行成功')
                $('#action-center-open').css('display', 'none')
                $('.BMap_pop').css('display', 'none')
                $('.BMap_shadow').css('display', 'none')
                return
              } else {
                that.$message.error('关灯执行失败')
                $('#action-center-open').css('display', 'none')
                $('.BMap_pop').css('display', 'none')
                $('.BMap_shadow').css('display', 'none')
                return
              }
            }).catch(() => {
              return
            })
        })
        // 站点开灯
          $("#onlight").off("click").on("click",function(){
          $('.action-center-module-actioninfo1').css('display', 'none')
          var list = []
          list.push(1)
          var acts = []
          acts.push(100)
          acts.push(10)
          acts.push(100)
          var req = {
            id: row.fname,
            nodes: list,
            acts: acts
          }
          that.$axios
            .post('acloud-lighting/wxserver/onOffLamp', req).then((res) => {
              if (res.data.code === 20000) {
                that.$message.success('开灯执行成功')
                $('#action-center-open').css('display', 'none')
                $('.BMap_pop').css('display', 'none')
                return
              } else {
                that.$message.error('开灯执行失败')
                $('#action-center-open').css('display', 'none')
                $('.BMap_pop').css('display', 'none')
                return
              }
            }).catch(() => {
              return
            })
          return
        })

        // 显示屏开屏
          $("#led_open").off("click").on("click",function(){
          if (that.displaynameradio === '') {
            that.$message.error('请选择显示屏。')
            return
          }
          var row = {}
          for (let i = 0; i < that.chooseDisplay.length; i++) {
            if (that.chooseDisplay[i][i].fId === that.displaynameradio) {
              row = that.chooseDisplay[i][i]
            }
          }
          var req = {
            ledDevice: row,
            isOpen: true
          }
          openOrclose(req).then(res => {
            if (res.data.code === 20000) {
              that.$message.success(res.data.message)
            } else {
              that.$message.error(res.data.message || '执行失败')
            }
          })
        })
        // 显示屏关屏
          $("#led_close").off("click").on("click",function(){
          if (that.displaynameradio === '') {
            that.$message.error('请选择显示屏。')
            return
          }
          var row = {}
          for (let i = 0; i < that.chooseDisplay.length; i++) {
            if (that.chooseDisplay[i][i].fId === that.displaynameradio) {
              row = that.chooseDisplay[i][i]
            }
          }
          var req = {
            ledDevice: row,
            isOpen: false
          }
          openOrclose(req).then(res => {
            if (res.data.code === 20000) {
              that.$message.success(res.data.message)
            } else {
              that.$message.error(res.data.message || '执行失败')
            }
          })
        })

        // 照明点击事件
          $("#events_zm").off("click").on("click",function(){
          getStationByLampId(1, 10, params).then(res => {
            if (res.data.code === 20000) {
              $('.pswp__preloader__icn').css('display', 'none')
              $('.action-Div-zm').show()
              $('.action-Div-led').hide()
              $('.action-Div-jk').hide()
              $('.action-Div-hjjc').hide()
              that.stationNameList = []
              if(res.data.data.rows.length === 0) {
                $('#Lighting-Ucode').text('')
                $('#Lighting-gonglv').text('')
                $('#Lighting-RtuState').text('')
                $('#Lighting-dianneng').text('')
                $('#Lighting-VoltageA').text('')
                $('#Lighting-VoltageB').text('')
                $('#Lighting-VoltageC').text('')
                $('#Lighting-ElectricCurrentA').text('')
                $('#Lighting-ElectricCurrentB').text('')
                $('#Lighting-ElectricCurrentC').text('')
                $('#Lighting-LinkDate').text('')
                $('#Lighting-Address').text('')
                $('#Lighting-long').text('')
                $('#Lighting-lat').text('')
              } else {
                for (let j = 0; j < res.data.data.rows.length; j++) {
                  // 查找灯杆ID是否有关联上
                  if (res.data.data.rows[j].flag === true) {
                    that.stationNameList.push({
                      'label': res.data.data.rows[j].uname,
                      'value': res.data.data.rows[j].autoId
                    })
                    $('#Lighting-Ucode').text(res.data.data.rows[j].ucode)
                    $('#Lighting-gonglv').text(res.data.data.rows[j].powerA === null ? '0' : parseFloat(res.data.data.rows[j].powerA).toFixed(2) + 'W')
                    $('#Lighting-RtuState').text(res.data.data.rows[j].loopstates)
                    $('#Lighting-dianneng').text(res.data.data.rows[j].elecS === null ? '0' : parseFloat(res.data.data.rows[j].elecS).toFixed(2) + 'A')
                    $('#Lighting-VoltageA').text(res.data.data.rows[j].va === null ? '0' : parseFloat(res.data.data.rows[j].va).toFixed(2) + 'V')
                    $('#Lighting-VoltageB').text(res.data.data.rows[j].vb === null ? '0' : res.data.data.rows[j].vb)
                    $('#Lighting-VoltageC').text(res.data.data.rows[j].vc === null ? '0' : res.data.data.rows[j].vc)
                    $('#Lighting-ElectricCurrentA').text(res.data.data.rows[j].powerA === null ? '0' : res.data.data.rows[j].powerA)
                    $('#Lighting-ElectricCurrentB').text(res.data.data.rows[j].powerB === null ? '0' : res.data.data.rows[j].powerB)
                    $('#Lighting-ElectricCurrentC').text(res.data.data.rows[j].powerC === null ? '0' : res.data.data.rows[j].powerC)
                    $('#Lighting-LinkDate').text(res.data.data.rows[j].updateTime)
                    $('#Lighting-Address').text(res.data.data.rows[j].address)
                    $('#Lighting-long').text(res.data.data.rows[j].mapLongitude)
                    $('#Lighting-lat').text(res.data.data.rows[j].mapLatitude)
                  }
                }
              }
            } else {
              that.$message.error(res.data.message || '查询失败')
              that.tableData.listLoading = false
              that.tableData.dataList = []
              return
            }
          }).catch(() => {
            that.$message.error('服务器繁忙。')
          })
        })
        // 显示屏点击事件
          $("#events_led").off("click").on("click",function(){
          $('.action-object-led-click').css('display', 'block')
          getViewLedToLamp(1, 10, params).then(res => {
            if (res.data.code === 20000) {
              $('.pswp__preloader__icn').css('display', 'none')
              $('.action-Div-led').show()
              $('.action-Div-zm').hide()
              $('.action-Div-jk').hide()
              $('.action-Div-hjjc').hide()
              $('.action-Div-jg').hide()
              that.displaynameList = []
              that.chooseDisplay.push(res.data.data.rows)
              if(res.data.data.rows.length === 0) {
                $('#led-DeviceName').text('')
                $('#led-DeviceID').text('')
                $('#led-DeviceIp').text('')
                $('#led-DeviceWidth').text('')
                $('#led-DeviceHeight').text('')
                $('#led-DeviceVolume').text('')
                $('#led-DeviceStatus').text('')
                $('#led-DeviceCreateTime').text('')
                $('#led-DeviceOnlineTIme').text('')

              }else{
                for (let j = 0; j < res.data.data.rows.length; j++) {
                // 查找灯杆ID是否有关联上
                if (res.data.data.rows[j].flag === true) {
                  that.displaynameList.push({
                    'label': res.data.data.rows[j].fName,
                    'value': res.data.data.rows[j].fId
                  })
                  $('#led-DeviceName').text(res.data.data.rows[j].fName)
                  $('#led-DeviceID').text(res.data.data.rows[j].fDeviceID)
                  $('#led-DeviceIp').text(res.data.data.rows[j].fIp)
                  $('#led-DeviceWidth').text(res.data.data.rows[j].fWidth)
                  $('#led-DeviceHeight').text(res.data.data.rows[j].fHeight)
                  $('#led-DeviceVolume').text(res.data.data.rows[j].fVolnme)
                  $('#led-DeviceStatus').text(res.data.data.rows[j].fStatus === 1 ? '在线' : '离线')
                  $('#led-DeviceCreateTime').text(res.data.data.rows[j].fCreateTime)
                  $('#led-DeviceOnlineTIme').text(res.data.data.rows[j].fOnlineTime)
                }
              }
              }
            } else {
              that.$message.error(res.data.message || '查询失败')
              return
            }
          }).catch(() => {
            that.$message.error('服务器繁忙。')
          })
        })
        // 摄像头点击事件
          $("#events_jk").off("click").on("click",function(){
            getViewVideoToLamp(1, 10, params).then(res => {
              if (res.data.code === 20000) {
                $('.pswp__preloader__icn').css('display', 'none')
                $('.action-Div-jk').show()
                $('.action-Div-led').hide()
                $('.action-Div-zm').hide()
                $('.action-Div-hjjc').hide()
                $('.action-Div-jg').hide()
                that.videonameList = []
                that.chooseVideo.push(res.data.data.list)
                if(res.data.data.list.length === 0) {
                  $('#Video-Name').text('')
                  $('#Video-ser').text('')
                  $('#Video-address').text('')
                }else {
                  for (let j = 0; j < res.data.data.list.length; j++) {
                    // 查找灯杆ID是否有关联上
                    if (res.data.data.list[j].flag === true) {
                      that.videonameList.push({
                        'label': res.data.data.list[j].fName,
                        'value': res.data.data.list[j].fId
                      })
                      $('#Video-Name').text(res.data.data.list[j].fName)
                      $('#Video-ser').text(res.data.data.list[j].fSerial)
                      $('#Video-address').text(res.data.data.list[j].address)
                    }
                  }
                }
              } else {
                that.$message.error(res.data.message || '查询失败')
                return
              }
            }).catch(() => {
              that.$message.error('服务器繁忙。')
            })
          })
        // 垃圾桶点击事件
          $("#events_hjjc").off("click").on("click",function(){
          getTrashToLamp(1, 10, params).then(res => {
            if (res.data.code === 20000) {
              $('.pswp__preloader__icn').css('display', 'none')
              $('.action-Div-hjjc').show()
              $('.action-Div-jk').hide()
              $('.action-Div-led').hide()
              $('.action-Div-zm').hide()
              $('.action-Div-jg').hide()
              that.trashnameList = []
              if(res.data.data.rows.length === 0) {
                $('#hjjc-Name').text('')
                $('#hjjc-Imei').text('')
                $('#hjjc-Online').text('')
                $('#hjjc-Longitude').text('')
                $('#hjjc-Latitude').text('')
                $('#hjjc-address').text('')
                $('#hjjc-PoserState').text('')
                $('#hjjc-temperature').text('')
                $('#hjjc-tiltangle').text('')
                $('#hjjc-FullState').text('')
                $('#hjjc-IncellState').text('')
                $('#hjjc-Rsrp').text('')
              }else{
              for (let j = 0; j < res.data.data.rows.length; j++) {
                // 查找灯杆ID是否有关联上
                if (res.data.data.rows[j].flag === true) {
                  that.trashnameList.push({
                    'label': res.data.data.rows[j].alias,
                    'value': res.data.data.rows[j].id
                  })
                  $('#hjjc-Name').text(res.data.data.rows[j].alias)
                  $('#hjjc-Imei').text(res.data.data.rows[j].imei)
                  $('#hjjc-Online').text(res.data.data.rows[j].online === 'true' ? '在线' : '离线')
                  $('#hjjc-Longitude').text(res.data.data.rows[j].longitude)
                  $('#hjjc-Latitude').text(res.data.data.rows[j].latitude)
                  $('#hjjc-address').text(res.data.data.rows[j].address)
                  $('#hjjc-PoserState').text(res.data.data.rows[j].powerState === null ? '未知' : (res.data.data.rows[j].powerState === 0 ? '正常' : '低电量'))
                  $('#hjjc-temperature').text(res.data.data.rows[j].temperature)
                  $('#hjjc-tiltangle').text(res.data.data.rows[j].tiltAngle)
                  $('#hjjc-FullState').text(res.data.data.rows[j].fullState === null ? '未知' : res.data.data.rows[j].fullState === 0 ? '空' : '已满')
                  $('#hjjc-IncellState').text(res.data.data.rows[j].inclineState === null ? '未知' : res.data.data.rows[j].inclineState === 0 ? '正常' : '倾倒')
                  $('#hjjc-Rsrp').text(res.data.data.rows[j].rsrp)
                }
              }
              }
            } else {
              that.$message.error(res.data.message || '查询失败')
              return
            }
          }).catch(() => {
            that.$message.error('服务器繁忙。')
          })
        })
        // 井盖点击事件
          $("#events_jg").off("click").on("click",function(){
          getManholeToLamp(1, 10, params).then(res => {
            if (res.data.code === 20000) {
              $('.pswp__preloader__icn').css('display', 'none')
              $('.action-Div-jg').show()
              $('.action-Div-hjjc').hide()
              $('.action-Div-jk').hide()
              $('.action-Div-led').hide()
              $('.action-Div-zm').hide()
              that.wellnameList = []
              if(res.data.data.rows.length === 0) {
                $('#jg-Name').text('')
                $('#jg-imei').text('')
                $('#jg-PoweState').text('')
                $('#jg-Longitude').text('')
                $('#jg-Latitude').text('')
                $('#jg-address').text('')
                $('#jg-temp').text('')
                $('#jg-hardwareVer').text('')
                $('#jg-softVer').text('')
                $('#jg-online').text('')
                $('#jg-pci').text('')
                $('#jg-time').text('')
              }else{
              for (let j = 0; j < res.data.data.rows.length; j++) {
                // 查找灯杆ID是否有关联上
                if (res.data.data.rows[j].flag === true) {
                  that.wellnameList.push({
                    'label': res.data.data.rows[j].alias,
                    'value': res.data.data.rows[j].id
                  })
                  $('#jg-Name').text(res.data.data.rows[j].alias)
                  $('#jg-imei').text(res.data.data.rows[j].imei)
                  $('#jg-PoweState').text(res.data.data.rows[j].manholeCoverPositionState)
                  $('#jg-Longitude').text(res.data.data.rows[j].longitude)
                  $('#jg-Latitude').text(res.data.data.rows[j].latitude)
                  $('#jg-address').text(res.data.data.rows[j].address)
                  $('#jg-temp').text(res.data.data.rows[j].temperature)
                  $('#jg-hardwareVer').text(res.data.data.rows[j].hardwareVer)
                  $('#jg-softVer').text(res.data.data.rows[j].softVer)
                  $('#jg-online').text(res.data.data.rows[j].online === 'true' ? '在线' : '离线')
                  $('#jg-pci').text(res.data.data.rows[j].pci)
                  $('#jg-time').text(res.data.data.rows[j].createTime)
                }
              }
              }
            } else {
              that.$message.error(res.data.message || '查询失败')
              return
            }
          }).catch(() => {
            that.$message.error('服务器繁忙。')
          })
        })
        // 图标样式切换
        $('#action-center-module .action-object-back').on({
          click: function() {
            var clickthis = $(this)
            var pval = clickthis.attr('pval')
            var pbool = clickthis.attr('pbool')
            $('.action-object-back').attr('pbool', '0')
            clickthis.attr('pbool', '1')
            $('.action-object-back').each(function() {
              var suval = $(this).attr('pval')
              const publicPath = process.env.NODE_ENV === 'development' ? '/' : ''
              if ($(this).attr('pbool') === '1') {
                //$(this).css({ 'background': 'url(' + publicPath + "'public/static/action/click-" + suval + ".png') no-repeat" })
              } else {
                //$(this).css({ 'background': 'url(' + publicPath + "'public/static/action/state-" + suval + ".png') no-repeat" })
              }
            })
            $('.action-Div-com').hide()
            // 这里有判断是否处于动画
            if (!$('.action-Div-' + pval + '').is(':animated')) {
              $('.action-Div-' + pval + '').slideToggle('slow')
            }
          }
        })
      })
      _marker.addEventListener('click', function() {
        this.openInfoWindow(_iw)
      })
      if (this.isOpen) {
        label.hide()
        _marker.openInfoWindow(_iw)
      }
    },
    returnIndex(row) {
      var index = -1
      for (let i = 0; i < this.markerArr.length; i++) {
        if (row.fid === this.markerArr[i].fid) {
          index = i
          break
        }
      }
      return index
    },
    // 创建InfoWindow
    createInfoWindow(i) {
      var iw = new BMap.InfoWindow() // 创建信息窗口对象
      return iw
    },
    // 创建一个Icon
    createIcon(json, imgurl) {
     console.log(this.geturl(imgurl))
      var icon = new BMap.Icon(this.geturl(imgurl),
        new BMap.Size(160, 160),
        {
          offset: new BMap.Size(-10, -20)
        })
      return icon
    },
    changetheme(val) {
      map.setMapStyle({ style: val })
    },
    chooseStation() {
      this.poledrawer = true
    },
    getStationInfo(row) {
      var point = new BMap.Point(row.flongitude, row.f_Latitude)// 创建点坐标
      map.centerAndZoom(point, 17)
    },
    addOneMarker(row) {
      var p0 = row.flongitude
      var p1 = row.f_Latitude
      var point = new BMap.Point(p0, p1)
      var iconImg = this.createIcon(this.icon, row.imgurl)
      var marker = new BMap.Marker(point, { icon: iconImg })
      var iw = this.createInfoWindow(0)
      var label = new BMap.Label(row.fname, { 'offset': new BMap.Size(this.icon.lb - this.icon.x + 5, -20) })
      marker.setLabel(label)
      map.addOverlay(marker)
      label.setStyle({
        borderColor: '#808080',
        color: '#333',
        cursor: 'pointer'
      })
      this.createwindow(this.returnIndex(row), marker, label, row)
    }
  }
}
</script>
<style scoped>
  #XSDFXPage{
    width: 100%;
    height: 780px;
    z-index: 100;
    overflow-y: hidden;
  }
  .mapheader{
    position: absolute;
    z-index: 101;
    width: 100%;
    height: 70px;
    padding: 5px;
    background: rgba(0,0,0,0.6);
  }
  .themetitle{
    color: #FFB800;
    font-size: 16px;
  }
  .choosestation{
    margin-left: 150px;
    font-size: 16px;
    color: #FFB800;
    cursor: pointer;
  }
  img{
    position: relative;
    margin-left: -20px;
    height: 40px;
    top: 10px;
  }
  button{
    cursor: pointer;
  }

  .anchorBL {
    display: none;
  }

  html {
    height: 100%;
  }

  body, #container {
    height: 100%;
    margin: 0px;
    padding: 0px;
    margin: 0px;
  }

  .action-back {
    background: url('../../icons/action/action-back.png') no-repeat;
    background-size: 100% 100%;
    background-position: center;
    height: 100%;
    color: #f3eeee;
    top: 10%;
    position: absolute;
    z-index: 2;
    height: auto;
  }

  .action-back2 {
    /*color:white;*/
    /*background-color:rgba(220,38,38,0.2);*/
    background-size: 100% 100%;
    background-position: center;
    height: 100%;
    top: 10%;
    position: absolute;
    z-index: 2;
    height: auto;
  }

  .action-top {
    width: 100%;
    background: url('../../icons/action/top11.png') repeat;
    background-size: 100% 100%;
    background-position: center;
    height: 66px;
    top: 0;
    position: absolute;
    z-index: 2;
    width: 100%;
  }

  .action-title {
    height: 40px;
  }

  .action-top .action-top-center {
    width: 100%;
    background: url('../../icons/action/action-top2.png') no-repeat;
    background-size: 100% 100%;
    background-position: center;
    height: 80px;
    position: absolute;
    z-index: 3;
    width: 25%;
    left: 37%;
  }

  .action-left, .action-center {
    padding: 20px;
    margin: 0;
  }

  .action-leftdiv {
    padding: 0px;
    margin: 0px;
  }

  .action-leftdiv div {
    padding: 0;
    margin: 0;
    padding: 20px 0 20px 0;
  }

  .action-center {
    padding: 20px 45px 45px 45px;
  }

  .action-center-module {
    display: inline-flex;
    padding: 20px 0 20px 0;
  }

  .action-center-module div {
    text-align: center;
    width: 55px;
    height: 55px;
  }

  .action-object-back {
    margin: 10px 30px 10px 0px;
    padding: 0px;
    overflow-y: auto;
  }

  .action-object-zm {
    background: url('../../icons/action/state-zm.png') no-repeat;
  }

  .action-object-led {
    background: url('../../icons/action/state-led.png') no-repeat;
  }

  .action-object-jk {
    background: url('../../icons/action/state-jk.png') no-repeat;
  }

  .action-object-wifi {
    background: url('../../icons/action/state-wifi.png') no-repeat;
  }

  .action-object-hjjk {
    background: url('../../icons/action/state-hjjc.png') no-repeat;
  }

  .action-object-gb {
    background: url('../../icons/action/state-gb.png') no-repeat;
  }

  .action-object-yjhj {
    background: url('../../icons/action/state-yjhj.png') no-repeat;
  }

  .action-object-jg {
    background: url('../../icons/action/state-jg.png') no-repeat;
  }

  .action-object-zm:hover {
    background: url('../../icons/action/click-zm.png') no-repeat;
  }

  .action-object-zm-click {
    background: url('../../icons/action/click-zm.png') no-repeat;
  }
  .action-object-led-click {
    background: url('../../icons/action/click-led.png') no-repeat;
  }
  .action-object-led:hover {
    background: url('../../icons/action/click-led.png') no-repeat;
  }
  .action-object-jk:hover {
    background: url('../../icons/action/click-jk.png') no-repeat;
  }
  .action-object-hjjk:hover {
    background: url('../../icons/action/click-hjjc.png') no-repeat;
  }
  .action-object-jg:hover {
    background: url('../../icons/action/click-jg.png') no-repeat;
  }
  .action-center-module-actioninfo {
    padding: 20px 0px 20px 0px;
  }

  .action-select {
    color: #02d0d0;
    font-size: 22px;
    background: url('../../icons/action/bottonhr.png') no-repeat;
    /*background-size: 100% 100%;*/
    background-position: 50% 92%;
  }
  .row {
    margin: 0;
  }
  .contentText {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /*改变boostrap默认风格*/
  .col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {
    padding-left: 0px;
    padding-right: 0px;
  }

  /* 动画css */
  .pswp__preloader__icn {
    opacity:0.75;
    width: 24px;
    height: 24px;
    -webkit-animation: clockwise 500ms linear infinite;
    animation: clockwise 500ms linear infinite;
    margin-top: 100px;
    margin-left: -200px;
    display: block;
  }

  /* The idea of animating inner circle is based on Polymer loading indicator by Keanu Lee https://blog.keanulee.com/2014/10/20/the-tale-of-three-spinners.html */
  .pswp__preloader__cut {
    position: relative;
    width: 12px;
    height: 24px;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
  }

  .pswp__preloader__donut {
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    border: 2px solid #000;
    border-radius: 50%;
    border-left-color: transparent;
    border-bottom-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    background: none;
    margin:0;
    -webkit-animation: donut-rotate 1000ms cubic-bezier(.4,0,.22,1) infinite;
    animation: donut-rotate 1000ms cubic-bezier(.4,0,.22,1) infinite;
  }

  @-webkit-keyframes clockwise {
    0% { -webkit-transform: rotate(0deg) }
    100% { -webkit-transform: rotate(360deg) }
  }
  @keyframes clockwise {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }
  @-webkit-keyframes donut-rotate {
    0% { -webkit-transform: rotate(0) }
    50% { -webkit-transform: rotate(-140deg) }
    100% { -webkit-transform: rotate(0) }
  }
  @keyframes donut-rotate {
    0% { transform: rotate(0) }
    50% { transform: rotate(-140deg) }
    100% { transform: rotate(0) }
  }
</style>
