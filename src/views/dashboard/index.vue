<template>
  <div class="app-wrapper">
    <navbar :type="'dashboard'" />
    <div class="notified">
      <img style="height:100%" src="../../assets/dashboard_images/notice.png" alt="">
      <div style="width: 100%">
        <marquee behavior="scroll" direction="left" bgcolor="#28507c" loop="-1">智慧路灯应用平台智慧路灯应用平台智慧路灯应用平台...</marquee>
      </div>
    </div>
    <div class="dashboard_container">
      <div class="left_nav">
        <div style="width:100%;height:100%">
          <div style="height:65%;display: flex;">
            <img class="imgMg" style="width: calc(22% - 10px);" src="../../assets/dashboard_images/light.png" alt="照明设备维护" srcset="" @click="$router.push({path: '/websiteManage/index'})">
            <img class="imgMg" style="width: calc(38% - 10px);" src="../../assets/dashboard_images/2.png" alt="灯杆管理" srcset="" @click="$router.push({path: '/lightingPoleManage/lightMapMonitor'})">
            <div style="width: calc(20% - 10px);" class="imgMg">
              <img class="imgMg" style="width: calc(255% - 10px);height: calc(50% - 0px);" src="../../assets/dashboard_images/display.png" alt="显示屏" srcset="" @click="$router.push({path: '/displayGIS'})">
              <img style="width:calc(100% - 8px);height: calc(50% - 10px);margin-top:-5px;" src="../../assets/dashboard_images/well.png" alt="井盖监测" srcset="" @click="$router.push({path: '/welllidDevices/welllidDevicesMap'})">
            </div>
          </div>
          <div style="height:35%;display: flex;">
            <img class="imgMg" style="width: calc(22% - 10px);" src="../../assets/dashboard_images/face.png" alt="人脸识别" srcset="" @click="$router.push({path: '/faceRecognition/index'})">
            <img class="imgMg" style="width: calc(38% - 10px);;" src="../../assets/dashboard_images/video.png" alt="安防监控" srcset="" @click="$router.push({path: '/hkvideoMap/list'})">
            <img class="imgMg" style="width: calc(19% - 10px);" src="../../assets/dashboard_images/trash.png" alt="垃圾监测" srcset="" @click="$router.push({path: '/trashCan/trashCanMap'})">
            <!-- <img class="imgMg" style="height:183%;position: relative;top: -90%;width: 100%;overflow: hidden" src="../../assets/dashboard_images/11.png" alt="传--="" @click="$router.push({path: 'trashCan/trashCan'})">-->
          </div>
        </div>
        <div style="width:25%;height: calc(100% - 16px);position: relative;top: 33%;left: -16.5%;" class="imgMg">
          <img style="height:67%;width:110%" src="../../assets/dashboard_images/user.png" alt="运维管理" srcset="" @click="$router.push({path: '/handlePerson/list'})">
        </div>
      </div>
      <div class="rightNav" style="width: 20%;padding: 4%;">
        <div class="time" >{{ time }}</div>
        <div style="text-align: center;color: #94bcdb;margin-bottom: 40%;cursor: pointer">{{ date }}</div>
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="日期查看">
        </el-date-picker>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from '../../layout/components/Navbar.vue'
import defaultSettings from '@/settings'
import { clearInterval } from 'timers'

const { title } = defaultSettings

export default {
  components: {
    Navbar
  },
  data() {
    return {
      time: '',
      date: '',
      value1: '',
      timer: null,
      message: '欢迎使用' + title
    }
  },
  created() {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.getDate()
    }, 1000 * 1)
  },
  methods: {
    getDate() {
      const d = new Date()
      const o = {
        'Y+': d.getFullYear(), // 年
        'M+': d.getMonth() + 1, // 月
        'd+': d.getDate(), // 日
        'W+': d.getDay(), // 星期
        'h+': d.getHours() % 12 === 0 ? 12 : d.getHours() % 12, // 小时
        'H+': d.getHours() < 10 ? ('0' + d.getHours()) : d.getHours(), // 小时
        'm+': d.getMinutes() < 10 ? ('0' + d.getMinutes()) : d.getMinutes(), // 分
        's+': d.getSeconds(), // 秒
        'q+': Math.floor((d.getMonth() + 3) / 3) // 季度
      }
      const week = {
        '0': '\u65e5',
        '1': '\u4e00',
        '2': '\u4e8c',
        '3': '\u4e09',
        '4': '\u56db',
        '5': '\u4e94',
        '6': '\u516d'
      }
      this.time = o['H+'] + ':' + o['m+'] + ':' + o['s+']
      this.date = o['Y+'] + '年' + o['M+'] + '月' + o['d+'] + '日 ' + ' 星期' + week[o['W+']]
    }
  }

}
</script>
<style scoped>
  .dashboard_container{
    display: flex;
    position: absolute;
    width: 100%;
    height: calc(100% - 85px);
    background-image: linear-gradient(#3a6999, #2a537e, #18395d);
    margin-bottom: 0px;
    overflow-y: hidden;

  }
  .notified{
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #6eb0ddb8;
    background: #28507c;
    /* font-size: 14px; */
  }
  .left_nav{
    width: 80%;
    display: flex;
    padding: 8%;
    margin-left:80px;

  }
  .rightNav{
    background-image: url('../../assets/dashboard_images/right_bg.png');
    background-size: 100% 100%
  }
  .rightButton{
    text-align: center;
    padding: 10px 20px;
    border-radius: 50px;
    color: #bde5ff;
    border: 1px solid #95d5ff;
    margin-bottom: 20%;
  }
  .rightButton:hover{
    cursor: pointer;
    color: #fff;
    background-image: linear-gradient(#63aee5, #46a2de, #2696d7);
  }
  .rightNav .time{
    font-size: 2.5rem;
    text-align: center;
    color: #fff;
    margin-bottom: 15px;
    cursor:pointer;
  }
  .imgMg{
    margin: 0 10px 10px 0;
    cursor: pointer;
  }
  .imgMg:hover {
    transform: scale(1.05);
    -ms-transform: scale(1.05);  /* IE 9 */
    -moz-transform: scale(1.05);  /* Firefox */
    -webkit-transform: scale(1.05); /* Safari 和 Chrome */
    -o-transform: scale(1.05);

  }

</style>

