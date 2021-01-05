<template>
  <!--地图容器-->
  <div>
    <div class="mapheader">
      <div>
        <el-row style="height: 50px;">
          <!-- <span class="themetitle">地图主题:</span>
         <el-button size="mini" round style="background-color: black;color: #fff;" @click="changetheme('dark')">黑夜</el-button>
         <el-button size="mini" round @click="changetheme('normal')">默认</el-button>
         <el-button size="mini" round style="background-color: #DAFFFD;color: black" @click="changetheme('googlelite')">精简</el-button>
         <el-button size="mini" round style="background-color: #0A2f48;color: #fff" @click="changetheme('midnight')">深蓝</el-button>
         <el-button size="mini" round style="background-color: #B7CA93;color: black" @click="changetheme('grassgreen')">浅绿</el-button>
         -->
          <span
            class="choosestation"
            @click="chooseStation('dark')"
          >选择摄像头:<img src="../../../icons/video/video.jpg" style="height: 32px;height: 32px;margin-left: 10px"></span>
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
      title="选择摄像头"
      style="font-weight: 600;font-size: 14px;"
      :visible.sync="stationdrawer"
      :direction="direction"
      size="60%"
      :destroy-on-close="true"
    >
      <choose-website
        :drawer="stationdrawer1"
        :params="editParams"
        :loaddata="getTableData"
        @getStationInfo="getStationInfo"
      />
    </el-drawer>

    <div>
      <el-drawer
        :title="videoTitle"
        size="80%"
        :visible.sync="drawerVideo"
        :destroy-on-close="true"
      >
        <div class="hello-ezuikit-js">
          <el-row>
            <el-col
              :span="12"
              :offset="3"
            >
              <div
                id="video-container"
                style="width:600px;height:500px"
              />
            </el-col>
            <el-col :span="9">
              <div
                id="left"
                class="ptz"
              >
                <div class="PTZOperator">
                  <div class="ptz-name ng-binding"></div>
                  <div class="ptz-ctrl">
                    <div class="ptz-ctrl-l">
                      <span
                        class="direction"
                        @click="actionStart(4, true)"
                      ><i class="icon-ptz-left-up" /></span>
                      <span
                        class="direction"
                        @click="actionStart(0, true)"
                      ><i class="icon-ptz-up" /></span>
                      <span
                        class="direction"
                        @click="actionStart(6, true)"
                      ><i class="icon-ptz-right-up" /></span>
                      <span
                        class="direction"
                        @click="actionStart(2, true)"
                      ><i class="icon-ptz-left" /></span>
                      <span
                        class="direction"
                        @click="actionStart(14, true)"
                      ><i class="icon-ptz-auto" /></span>
                      <span
                        class="direction"
                        @click="actionStart(3, true)"
                      ><i class="icon-ptz-right" /></span>
                      <span
                        class="direction"
                        @click="actionStart(5, true)"
                      ><i class="icon-ptz-left-down" /></span>
                      <span
                        class="direction"
                        @click="actionStart(1, true)"
                      ><i class="icon-ptz-down" /></span>
                      <span
                        class="direction"
                        @click="actionStart(7, true)"
                      ><i class="icon-ptz-right-down" /></span>
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
            <el-button
              type="primary"
              @click="closeVideo"
            >确 定</el-button>
          </el-row>

        </div>
      </el-drawer>
    </div>

  </div>

</template>
<script>
import chooseWebsite from "@/views/videoMonitor/videoMap/hkchooseWebsite.vue";
import $ from "jquery";
import Vue from "vue";
import axios from "axios";
import request from "@/utils/request";
import EZUIKit from "ezuikit-js";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { getVideoEquipment } from "@/views/videoMonitor/videoEquepment/videoE.js";
Vue.prototype.axios = request;
export default {
  components: {
    chooseWebsite,
  },
  data() {
    return {
      stationdrawer: false,
      stationdrawer1: this.$refs,
      ZoomNum: "1",
      markerArr: [], // 需要标点的数据
      value: "",
      isOpen: 0,
      actionradio: "", // 选择执行的动作
      lampsmask: "", // 调光值
      finalUcode: "",
      markers: [],
      markerdic: {},
      iws: {},
      icon: {
        w: 50,
        h: 70,
        l: 0,
        t: 0,
        x: 6,
        lb: 5,
      },
      searchKey: "",
      videoTitle: "监控视频",
      drawerVideo: false,
      player: {},
    };
  },
  watch: {
    markerArr(val) {
      // 监听当获取到值的时候再调用方法
      this.value = this.markerArr;
      this.createMap(); // 创建地图
      this.setMapEvent(); // 设置地图事件
      this.addMapControl(); // 向地图添加控件
      this.addMarker(); // 向地图中添加marker
    },
    deep: true,
  },
  created() {
    this.getVideoHkInfo();
  },
  // 创建地图函数：
  methods: {
    getVideoHkInfo() {
      getVideoEquipment(this.searchKey, 1, 20).then((res) => {
        if (res.data.code === 20000) {
          this.markerArr = res.data.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.data.message || "查询失败");
        }
      });
    },
    createMap() {
      // 创建Map实例
      var map = new BMap.Map("XSDFXPage");
      // 初始化地图,设置中心点坐标
      var point = new BMap.Point(104.404, 30.915); // 创建点坐标
      map.centerAndZoom('成都', 12);
      // 添加鼠标滚动缩放
      map.enableScrollWheelZoom();
      window.map = map;
      map.addEventListener("zoomend", function (e) {
        this.ZoomNum = map.getZoom();
      });
      map.setMapStyle({
        styleJson: [
          {
            featureType: "building",
            elementType: "all",
            stylers: {
              visibility: "off",
            },
          },
        ],
      });
    },
    // 地图事件设置函数：
    setMapEvent() {
      map.enableDragging(); // 启用地图拖拽事件，默认启用(可不写)
      map.enableScrollWheelZoom(); // 启用地图滚轮放大缩小
      map.enableDoubleClickZoom(); // 启用鼠标双击放大，默认启用(可不写)
      map.enableKeyboard(); // 启用键盘上下左右键移动地图
    },
    // 地图控件添加函数：
    addMapControl() {
      // 向地图中添加缩放控件
      var ctrl_nav = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        type: BMAP_NAVIGATION_CONTROL_LARGE,
      });
      map.addControl(ctrl_nav);
      // 向地图中添加缩略图控件
      var ctrl_ove = new BMap.OverviewMapControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        isOpen: 1,
      });
      map.addControl(ctrl_ove);
      // 向地图中添加比例尺控件
      var ctrl_sca = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_BOTTOM_LEFT,
      });
      map.addControl(ctrl_sca);
    },
    // 创建marker
    addMarker() {
      var that = this;
      for (var i = 0; i < that.markerArr.length; i++) {
        var p0 = that.markerArr[i].videoHkInfo.fLatitude;
        var p1 = that.markerArr[i].videoHkInfo.fLongitude;
        var point = new BMap.Point(p0, p1);
        var iconImg = that.createIcon(that.icon);
        var marker = new BMap.Marker(point, {
          icon: iconImg,
        });
        var iw = that.createInfoWindow(i);
        var label = new BMap.Label(that.markerArr[i].videoHkInfo.address, {
          offset: new BMap.Size(that.icon.lb - that.icon.x + 5, -20),
        });
        marker.setLabel(label);
        this.$set(this.markerdic, that.markerArr[i].videoHkInfo.fId, marker);
        label.setStyle({
          borderColor: "#808080",
          color: "#333",
          cursor: "pointer",
        });
        this.markers.push(marker);
        that.createwindow(i, marker, label, that.markerArr[i]);
        var markerClusterer = new BMapLib.MarkerClusterer(map, {
          markers: that.markers,
        });
      }
    },
    createwindow(i, marker, label, row) {
      var index = i;
      var _iw = this.createInfoWindow(i);
      var _marker = marker;
      this.$set(this.iws, row.videoHkInfo.fId, _iw);
      var that = this;
      _marker.addEventListener("infowindowopen", function () {
        if (document.getElementById("downaction")) {
          document
            .getElementById("downaction")
            .addEventListener("click", function () {
              that.drawerVideo = true;
              that.monitor(that.markerArr[i]);
            });
        }
      });
      _marker.addEventListener("click", function () {
        this.openInfoWindow(_iw);
      });
      if (this.isOpen) {
        label.hide();
        _marker.openInfoWindow(_iw);
      }
    },
    // 创建InfoWindow
    createInfoWindow(i) {
      var json = this.markerArr[i];
      this.finalUcode = this.markerArr[i].ucode;
      var iw = new BMap.InfoWindow(
        "设备名称:<b class='iw_poi_title'>" +
          json.videoHkInfo.fName +
          "</b>" +
          "<div></br></div>" +
          "<div>所属项目:" +
          json.sysProject.fName +
          "</div>" +
          "<div></br></div>" +
          "<div>序列号:" +
          json.videoHkInfo.fSerial +
          "</div>" +
          "<div></br></div>" +
          "<div>经度:" +
          json.videoHkInfo.fLatitude +
          "</div>" +
          "<div></br></div>" +
          "<div>纬度:" +
          json.videoHkInfo.fLongitude +
          "</div>" +
          "<div></br></div>" +
          "<div>地址:" +
          json.videoHkInfo.address +
          "</div>" +
          "<div></br></div>" +
          '<div style="height:40px">' +
          "<div> </br></div>" +
          '<div><button style="background-color:#304156;border-color:#304156;color:#fff;cursor:pointer;z-index：100;height: 20px;width: 100%" id="downaction" >云播放</button></div>'
      );
      return iw;
    },
    // 创建一个Icon
    createIcon(json) {
      var icon = new BMap.Icon(
        require("../../../icons/video/video.jpg"),
        new BMap.Size(50, 50),
        {
          imageOffset: new BMap.Size(-json.l, -json.t),
          infoWindowOffset: new BMap.Size(json.lb + 5, 1),
          offset: new BMap.Size(json.x, json.h),
        }
      );
      return icon;
    },
    changetheme(val) {
      map.setMapStyle({
        style: val,
      });
    },
    chooseStation() {
      this.stationdrawer = true;
    },
    videoClound(row) {
      console.log(row);
    },
    getStationInfo(row) {
      // 创建Map实例
      // var map = new BMap.Map('XSDFXPage')
      // 初始化地图,设置中心点坐标
      var point = new BMap.Point(
        row.videoHkInfo.fLatitude,
        row.videoHkInfo.fLongitude
      ); // 创建点坐标
      map.centerAndZoom(point, 17);
      // 添加鼠标滚动缩放
      /* map.enableScrollWheelZoom()
      window.map = map*/
      // this.addOneMarker(row)
      for (var m in this.markerdic) {
        for (var key in this.iws) {
          if (key === m) {
            this.markerdic[m].openInfoWindow(this.iws[key]);
          }
        }
      }
    },
    returnIndex(row) {
      var index = -1;
      for (let i = 0; i < this.markerArr.length; i++) {
        if (row.videoHkInfo.fId === this.markerArr[i].videoHkInfo.fId) {
          index = i;
          break;
        }
      }
      return index;
    },
    addOneMarker(row) {
      var p0 = row.videoHkInfo.fLatitude;
      var p1 = row.videoHkInfo.fLongitude;
      var point = new BMap.Point(p0, p1);
      var iconImg = this.createIcon(this.icon);
      var marker = new BMap.Marker(point, {
        icon: iconImg,
      });
      var iw = this.createInfoWindow(0);
      var label = new BMap.Label(row.videoHkInfo.address, {
        offset: new BMap.Size(this.icon.lb - this.icon.x + 5, -20),
      });
      marker.setLabel(label);
      map.addOverlay(marker);
      label.setStyle({
        borderColor: "#808080",
        color: "#333",
        cursor: "pointer",
      });
      this.createwindow(this.returnIndex(row), marker, label, row);
    },
    actionStart(vType) {
      // setTimeout("actionStop()", 1000);
      var url = "https://open.ys7.com/api/lapp/device/ptz/start";
      // var url = '/videoapi/api/lapp/device/ptz/start'
      var vParam = {
        accessToken: this.selectOneRow.videoCloudUser.accessToken,
        deviceSerial: this.selectOneRow.videoHkInfo.fSerial,
        channelNo: 1, // vivw.channelNo,
        direction: vType,
        speed: 1,
      };
      this.ysPost(url, vParam);
    },
    ysPost(url, vParam) {
      var that = this;
      url = this.concatUrl(url, vParam);
      axios
        .post(url, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((res) => {
          if (res.data.code === 200) {
            setTimeout(function () {
              var urlStop = "https://open.ys7.com/api/lapp/device/ptz/stop";
              urlStop = that.concatUrl(urlStop, vParam);
              axios
                .post(urlStop, {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                })
                .then((res) => {});
            }, 1000);
          } else if (res.data.code === 60005) {
            that.$message.error(res.data.msg);
          } else if (res.data.code === 60004) {
            that.$message.error(res.data.msg);
          } else if (res.data.code === 60000) {
            that.$message.error(res.data.msg);
          } else if (res.data.code === 60003) {
            that.$message.error(res.data.msg);
          } else if (res.data.code === 60002) {
            that.$message.error(res.data.msg);
          } else if (res.data.code === 60006) {
            that.$message.error(res.data.msg);
          } else if (res.data.code === 4) {
            that.$message.error(res.data.msg);
          }
        });
    },
    concatUrl(url, vParam) {
      var tempUrl = "";
      for (const item in vParam) {
        tempUrl = tempUrl + item + "=" + vParam[item] + "&";
      }
      url = url + "?" + tempUrl.substring(0, tempUrl.length - 1);
      return url;
    },
    closeVideo() {
      this.player.stop();
      this.drawerVideo = false;
    },
    monitor(row) {
      this.drawerVideo = true;
      this.selectOneRow = row;

      if (JSON.stringify(this.player) !== "{}") {
        this.$nextTick(() => {
          this.player.play();
        });
        return;
      }
      // dom执行完之后，再运行里面的回调函数
      this.$nextTick(function () {
        this.player = new EZUIKit.EZUIKitPlayer({
          autoplay: true,
          id: "video-container",
          accessToken: row.videoCloudUser.accessToken,
          url: "ezopen://open.ys7.com/" + row.videoHkInfo.fSerial + "/1.live",
          template: "standard", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；
          // 视频上方头部控件
          header: ["capturePicture", "save", "zoom"], // 如果templete参数不为simple,该字段将被覆盖
          // plugin: ['talk'],                       // 加载插件，talk-对讲
          // 视频下方底部控件
          // footer: ["talk", "broadcast", "hd", "fullScreen"], // 如果template参数不为simple,该字段将被覆盖
          audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
          openSoundCallBack: (data) => console.log("开启声音回调", data),
          closeSoundCallBack: (data) => console.log("关闭声音回调", data),
          startSaveCallBack: (data) => console.log("开始录像回调", data),
          stopSaveCallBack: (data) => console.log("录像回调", data),
          // capturePictureCallBack: data => console.log("截图成功回调", data),
          // fullScreenCallBack: data => console.log("全屏回调", data),
          // getOSDTimeCallBack: data => console.log("获取OSDTime回调", data),
          width: 600,
          height: 400,
        });
        // this.player.play();
      });
    },
  },
};
</script>
<style scoped>
/*html,body,#XSDFXPage{*/
/*width: 50%;*/
/*height: 50%;*/
/*overflow: hidden;*/
/*margin: 0px auto;*/
/*font-family: "微软雅黑";*/
/*}*/
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

.PTZOperator > div {
  margin-left: 60px;
  float: left;
}

.ptz-name {
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #e2e2e2;
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
  background-image: url();
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
  background-image: url();
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
</style>
