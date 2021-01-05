<template>
  <div>
    <div id="left" class="ptz">
      <div class="PTZOperator">
        <div class="ptz-name ng-binding">云台</div>
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
          <div class="ptz-ctrl-r">
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
          </div>
          <div @click="actionImg()">抓怕图片</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {

  },
  filters: {

  },
  data() {
    return {
      currentComponent: 'List'
	  }
  },
  computed: {

  },
  created() {

	  },
  methods: {
    actionImg() {},
    actionStart(vType) {
      setTimeout('actionStop()', 1000)
      var url = 'https://open.ys7.com/api/lapp/device/ptz/start'

      var vParam = {
        accessToken: vivw.accessToken,
        deviceSerial: vivw.deviceSerial,
        channelNo: 1, // vivw.channelNo,
        direction: vType,
        speed: 1
      }
      console.log('vivw.accessToken', vivw.accessToken)
      console.log('vivw.deviceSerial', vivw.deviceSerial)
      console.log('vivw.channelNo', vivw.channelNo)
      ysPost(url, vParam)
    },
    ysPost(url, vParam) {
      // this.$axios.post(url,)
    }

  }
}
</script>

<style scoped lang="scss">
  //@import url("./yuntai.scss");
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
      float: left;
  }

  .ptz-name {
      height: 35px;
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
