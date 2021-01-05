<template>
  <!--地图容器-->
  <div>
    <div class="mapheader">
      <div>
        <el-row>
          <!-- <span class="themetitle">地图主题:</span>
          <el-button
            size="mini"
            round
            style="background-color: black;color: #fff;"
            @click="changetheme('dark')"
          >黑夜</el-button>
          <el-button
            size="mini"
            round
            @click="changetheme('normal')"
          >默认</el-button>
          <el-button
            size="mini"
            round
            style="background-color: #DAFFFD;color: black"
            @click="changetheme('googlelite')"
          >精简</el-button>
          <el-button
            size="mini"
            round
            style="background-color: #0A2f48;color: #fff"
            @click="changetheme('midnight')"
          >深蓝</el-button>
          <el-button
            size="mini"
            round
            style="background-color: #B7CA93;color: black"
            @click="changetheme('grassgreen')"
          >浅绿</el-button> -->
          <span
            class="choosestation"
            @click="chooseStation()"
          >选择井盖:<img src="https://developer.baidu.com/map/jsdemo/img/fox.gif"></span>
        </el-row>
      </div>
    </div>
    <div
      id="XSDFXPage"
      class="XSDFXPage"
    />
    <!-------------------选择站点---------------------->
    <el-drawer
      v-if="stationdrawer"
      ref="stationdrawer"
      title="选择井盖"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="stationdrawer"
      :direction="direction"
      size="60%"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <choose-website
        :drawer="stationdrawer1"
        :params="editParams"
        :loaddata="getTableData"
        @getStationInfo="getStationInfo"
      />
    </el-drawer>

  </div>

</template>
<script>
import { getWelllidDevice} from '@/views/jingai/wellliddevice.js'
import chooseWebsite from './components/chooseManhole'
import $ from 'jquery'
import Vue from 'vue'
import request from '../../utils/request'
import { getToken, setToken, removeToken } from '@/utils/auth'
Vue.prototype.axios = request
export default {
  components: { chooseWebsite },
  data() {
    return {
      stationdrawer: false,
      stationdrawer1: this.$refs,
      ZoomNum: '1',
      markerArr: [], // 需要标点的数据
      tableChecked: [],
      lightIndex: [],
      markers: [],
      markerdic: {},
      iws: {},
      value: '',
      isOpen: 0,
      actionradio: '', // 选择执行的动作
      lampsmask: '', // 调光值
      finalUcode: '',
      icon: { w: 50, h: 70, l: 0, t: 0, x: 6, lb: 5 }
    }
  },
  watch: {
    ZoomNum: function(val, oldval) {
      this.value = this.ZoomNum
      this.addMarker()
    },
    markerArr(val) {
      // 监听当获取到值的时候再调用方法
      this.value = this.markerArr
      this.createMap() // 创建地图
      this.setMapEvent() // 设置地图事件
      this.addMapControl() // 向地图添加控件
      this.addMarker() // 向地图中添加marker
    },
    deep: true
  },
  created() {
   
  
      var req = {
        fAlias: '',
        fDelState: 0,
        createId : Vue.getAcloudProvider().getUserInfo().id
      }
      getWelllidDevice(req, 1, 20)
      .then((res) => {
        if (res.data.code === 20000) {
          this.markerArr = res.data.data.list
        } else {
          this.$message.error(res.data.message || '查询失败')
          return
        }
      })
      .catch(() => {
        this.$message.error('服务器繁忙。')
      })
  },
  // 创建地图函数：
  methods: {
    createMap() {
      // 创建Map实例
      var map = new BMap.Map('XSDFXPage')
      // 初始化地图,设置中心点坐标
      var point = new BMap.Point(104.404, 30.915) // 创建点坐标
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
      map.enableDragging() // 启用地图拖拽事件，默认启用(可不写)
      map.enableScrollWheelZoom() // 启用地图滚轮放大缩小
      map.enableDoubleClickZoom() // 启用鼠标双击放大，默认启用(可不写)
      map.enableKeyboard() // 启用键盘上下左右键移动地图
    },
    // 地图控件添加函数：
    addMapControl() {
      // 向地图中添加缩放控件
      var ctrl_nav = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE
      })
      map.addControl(ctrl_nav)
      // 向地图中添加缩略图控件
      var ctrl_ove = new BMap.OverviewMapControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        isOpen: 1
      })
      map.addControl(ctrl_ove)
      // 向地图中添加比例尺控件
      var ctrl_sca = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })
      map.addControl(ctrl_sca)
    },
    // 创建marker
    addMarker() {
      var that = this
      for (var i = 0; i < that.markerArr.length; i++) {
        var p0 = that.markerArr[i].longitude
        var p1 = that.markerArr[i].latitude
        var point = new BMap.Point(p0, p1)
        var iconImg = that.createIcon(
          
        )
        var marker = new BMap.Marker(point, {
          icon: iconImg
        })

        var iw = that.createInfoWindow(i)
        var label = new BMap.Label(that.markerArr[i].fImei, {
          offset: new BMap.Size(that.icon.lb - that.icon.x + 5, -20)
        })

        marker.setLabel(label)
        this.$set(this.markerdic, that.markerArr[i].fImei, marker)
        // map.addOverlay(marker)
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
    createwindow(i, marker, label, row) {
      var index = i
      var _iw = this.createInfoWindow(i)
      var _marker = marker
      this.$set(this.iws, row.fImei, _iw)
      var that = this
      // _marker.addEventListener('infowindowopen', function() {
      //   $('input[type=radio][name=radio]').change(function() {
      //     if (this.value === '3') {
      //       $('#rangelight').show()
      //     } else {
      //       $('#rangelight').css('display', 'none')
      //     }
      //     that.actionradio = this.value
      //   })
      //   if (document.getElementById('range')) {
      //     document
      //       .getElementById('range')
      //       .addEventListener('click', function() {
      //         // 简单的测试方法,修改了createTime
      //         that.lampsmask = $('#range').val()
      //       })
      //   }
      //   if (document.getElementById('downaction')) {
      //     document
      //       .getElementById('downaction')
      //       .addEventListener('click', function() {
      //         if (that.actionradio === '' || that.actionradio === null) {
      //           that.$message.error('请选择执行动作。')
      //           return
      //         }
      //         var list = []
      //         list.push(row.lampIndexs)
      //         var acts = []
      //         if (that.actionradio === '1') {
      //           acts.push(100)
      //           acts.push(10)
      //           acts.push(100)
      //         } else if (that.actionradio === '2') {
      //           acts.push(0)
      //           acts.push(10)
      //           acts.push(100)
      //         } else {
      //           acts.push(that.lampsmask)
      //           acts.push(10)
      //           acts.push(100)
      //         }
      //         var req = {
      //           id: row.ucode,
      //           nodes: list,
      //           acts: acts
      //         }
      //         that.$axios
      //           .post('acloud-lighting/wxserver/onOffLamp', req)
      //           .then((res) => {
      //             if (res.data.code === 20000) {
      //               that.$message.success('动作执行成功。')
      //               $('.BMap_pop').css('display', 'none')
      //               $('.BMap_shadow').css('display', 'none')
      //             } else {
      //               that.$message.error('动作执行失败。')
      //               $('.BMap_pop').css('display', 'none')
      //               $('.BMap_shadow').css('display', 'none')
      //               return
      //             }
      //           })
      //           .catch(() => {
      //             that.$message.error('服务器繁忙。')
      //           })
      //       })
      //   }
      // })
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
        if (row.fImei === this.markerArr[i].fImei) {
          index = i
          break
        }
      }
      return index
    },
    // 创建InfoWindow
    createInfoWindow(i) {
      var json = this.markerArr[i]
      this.finalUcode = this.markerArr[i].fImei
      var performmode = null
      var ws='正常'
      if(json.fManholeCoverPositionState===1)
      {
        ws='移动'
      }
      var ps='正常'
       if(json.fWaterLevelState===1)
      {
        ps='水满'
      }
      var iw = new BMap.InfoWindow(
        '<div>' +
          "名称：<b class='iw_poi_title'>" +
          json.fAlias +
          '</b>' +
          '</b>' +
          '<div style="margin-top:5px">编号：' +
          json.fImei +
          '</div>' +
          '<div style="margin-top:5px">地址：' +
          json.address +
          '</div>' +
          '<div style="margin-top:5px"><span>井盖状态:' +
          ps +
          '</span> &nbsp;&nbsp;<span>水位状态:' +
          ws +
          
          '</div>' +
          '<div style="margin-top:5px">倾斜角度:' +
          json.fLeanAngle +
          '</div>' +
          '<div style="height:40px">' +
          '<div> </hr></div>' +
          
          '<div> </hr></div>' +
          '</div>' +
         
          '</div>'
      )
      return iw
    },

    // 创建一个Icon
    createIcon() {
      {
        var icon = new BMap.Icon(
          require('../../icons/manhole/manhole.png'),
          new BMap.Size(32, 32),
          {
            offset: new BMap.Size(32, 32)
          }
        )
        return icon
      }
    },
    changetheme(val) {
      map.setMapStyle({ style: val })
    },
    chooseStation() {
      this.stationdrawer = true
    },
    getStationInfo(row) {
      // 创建Map实例
      // var map = new BMap.Map("XSDFXPage");
      // 初始化地图,设置中心点坐标
      var point = new BMap.Point(row.longitude, row.latitude) // 创建点坐标
      map.centerAndZoom(point, 17)
      for (var m in this.markerdic) {
        for (var key in this.iws) {
          if (key === m) {
            this.markerdic[m].openInfoWindow(this.iws[key])
          }
        }
      }
    },
    addOneMarker(row) {
      // 获取单灯情况
      var p0 = row.longitude
      var p1 = row.latitude
      var point = new BMap.Point(p0, p1)
      var iconImg = this.createIcon(
        
      )
      var marker = new BMap.Marker(point, { icon: iconImg })
      var iw = this.createInfoWindow(0)
      var label = new BMap.Label(row.address, {
        offset: new BMap.Size(this.icon.lb - this.icon.x + 5, -20)
      })
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
#XSDFXPage {
  width: 100%;
  height: 750px;
  z-index: 100;
}
#btnprimary {
  background-color: #009578 !important;
  color: #fff;
  border-color: #009578;
}
.mapheader {
  position: absolute;
  z-index: 101;
  width: 100%;
  height: auto;
  padding: 5px;
  background: rgba(0, 0, 0, 0.6);
}
.themetitle {
  color: #ffb800;
  font-size: 16px;
}
.choosestation {
  margin-left: 150px;
  font-size: 16px;
  color: #ffb800;
  cursor: pointer;
}
img {
  position: relative;
  margin-left: -20px;
  height: 40px;
  top: 10px;
}
button {
  cursor: pointer;
}

* {
  font-family: "Work Sans", sans-serif;
}

html,
body {
  height: 100%;
  color: #1a1b1c;
}
body {
  background-color: #ffffff;
}
label,
a {
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  display: inline-block;
  color: inherit;
  transition: border 0.2s;
  border-bottom: 5px solid rgba(142, 68, 173, 0.2);
  padding: 3px 2px;
}
label:hover,
a:hover {
  border-bottom-color: #9b59b6;
}

.layout {
  display: grid;
  height: 100%;
  width: 100%;
  overflow: hidden;
  grid-template-rows: 50px 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  background: #8e44ad;
}

input[type="radio"] {
  display: none;
}

label.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 2px solid #8e44ad;
  background: #ecf0f1;
  user-select: none;
  transition: background 0.4s, padding-left 0.2s;
  padding-left: 0;
}
input[type="radio"]:checked + .page + label.nav {
  background: #9b59b6;
  color: #ffffff;
  padding-left: 20px;
}
input[type="radio"]:checked + .page + label.nav span {
  padding-left: 20px;
}
input[type="radio"]:checked + .page + label.nav svg {
  opacity: 1;
}
label.nav span {
  padding-left: 0px;
  position: relative;
}
label.nav svg {
  left: 0;
  top: -3px;
  position: absolute;
  width: 15px;
  opacity: 0;
  transition: opacity 0.2s;
}

.page {
  grid-column-start: 1;
  grid-row-start: 2;
  grid-column-end: span 3;
  padding: 0px 20px;
  display: flex;
  align-items: center;
}

.page-contents > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.2s, transform 0.2s;
}
.page-contents > *:nth-child(1) {
  transition-delay: 0.4s;
}
.page-contents > *:nth-child(2) {
  transition-delay: 0.6s;
}
.page-contents > *:nth-child(3) {
  transition-delay: 0.8s;
}
.page-contents > *:nth-child(4) {
  transition-delay: 1s;
}
.page-contents > *:nth-child(5) {
  transition-delay: 1.2s;
}
.page-contents > *:nth-child(6) {
  transition-delay: 1.4s;
}
.page-contents > *:nth-child(7) {
  transition-delay: 1.6s;
}
.page-contents > *:nth-child(8) {
  transition-delay: 1.8s;
}
.page-contents > *:nth-child(9) {
  transition-delay: 2s;
}
.page-contents > *:nth-child(10) {
  transition-delay: 2.2s;
}
.page-contents > *:nth-child(11) {
  transition-delay: 2.4s;
}
.page-contents > *:nth-child(12) {
  transition-delay: 2.6s;
}
.page-contents > *:nth-child(13) {
  transition-delay: 2.8s;
}
.page-contents > *:nth-child(14) {
  transition-delay: 3s;
}
.page-contents > *:nth-child(15) {
  transition-delay: 3.2s;
}
.page-contents > *:nth-child(16) {
  transition-delay: 3.4s;
}
.page-contents > *:nth-child(17) {
  transition-delay: 3.6s;
}
.page-contents > *:nth-child(18) {
  transition-delay: 3.8s;
}
.page-contents > *:nth-child(19) {
  transition-delay: 4s;
}
.page-contents > *:nth-child(20) {
  transition-delay: 4.2s;
}

input[type="radio"] + .page {
  transition: transform 0.2s;
  transform: translateX(100%);
}

input[type="radio"]:checked + .page {
  transform: translateX(0%);
}
input[type="radio"]:checked + .page .page-contents > * {
  opacity: 1;
  transform: translateY(0px);
}

.page-contents {
  max-width: 100%;
  width: 500px;
  margin: 0 auto;
}
</style>

