<template>
  <div class="app-wrapper">
    <navbar :type="'dashboard'" />
    <div class="notified">
      <img style="height:100%" src="../../assets/dashboard_images/notice.png" alt="">
      <div>
        智慧路灯应用平台智慧路灯应用平台智慧路灯应用平台...
        <el-button type="text" style="color: #6eb0dd;margin: 0 10px">展开<i class="el-icon-d-arrow-right el-icon--right" /></el-button>
      </div>
    </div>
    <div class="dashboard_container">
      <div class="left_nav">
        <div style="width:80%;height:100%">
          <div style="height:65%;display: flex;">
            <img class="imgMg" style="width: calc(22% - 10px);" src="../../assets/dashboard_images/1.png" alt="照明设备维护" srcset="" @click="$router.push({path: '/websiteManage/index'})">
            <img class="imgMg" style="width: calc(38% - 10px);" src="../../assets/dashboard_images/2.png" alt="灯杆管理" srcset="" @click="$router.push({path: '/lightingPoleManage/index'})">
            <div style="width: calc(20% - 10px);" class="imgMg">
              <img style="width: 100%;height: calc(50% - 4px);margin-bottom: 6px;" src="../../assets/dashboard_images/3.png" alt="环境监测" srcset="" @click="$router.push({path: 'envirnmentDev/envirnmentDev'})">
              <img style="width: 100%;height: calc(50% - 4px);" src="../../assets/dashboard_images/4.png" alt="显示屏" srcset="" @click="$router.push({path: 'sysLeddevice'})">
            </div>
            <img class="imgMg" style="width: calc(20% - 5px);" src="../../assets/dashboard_images/5.png" alt="视频监控" srcset="" @click="$router.push({path: '/videoMonitor/list'})">
          </div>
          <div style="height:35%;display: flex;">
            <img class="imgMg" style="width: calc(22% - 10px);" src="../../assets/dashboard_images/7.png" alt="一键呼叫" srcset="" @click="$router.push({path: 'sysOneKey/sysOneKey'})">
            <img class="imgMg" style="width: calc(19% - 10px);" src="../../assets/dashboard_images/8.png" alt="广播管理" srcset="" @click="$router.push({path: 'media/media'})">
            <img class="imgMg" style="width: calc(19% - 10px);;" src="../../assets/dashboard_images/9.png" alt="人员" srcset="" @click="$router.push({path: '/handlePerson/list'})">
            <img class="imgMg" style="width: calc(40% - 10px);" src="../../assets/dashboard_images/10.png" alt="井盖管理" srcset="" @click="$router.push({path: 'welllidDevices/welllidDevices'})">
          </div>
        </div>
        <div style="width:20%;height: calc(100% - 10px);overflow: hidden;">
          <img class="imgMg" style="height:33%" src="../../assets/dashboard_images/6.png" alt="人脸识别" srcset="" @click="$router.push({path: '/faceRecognition/index'})">
          <img style="height:67%" src="../../assets/dashboard_images/11.png" alt="传感器" srcset="" @click="$router.push({path: 'trashCan/trashCan'})">
        </div>
      </div>
      <div class="rightNav" style="width: 20%;padding: 4%;">
        <div class="time">{{ time }}</div>
        <div style="text-align: center;color: #94bcdb;margin-bottom: 40%;">{{ date }}</div>
        <div class="rightButton" @click="$router.push({path: '/lightingPoleManage/lightMapMonitor'})">灯杆地图监控</div>
        <div class="rightButton" @click="$router.push({path: '/lightingPoleManage/index'})">灯杆信息</div>
        <div class="rightButton" @click="$router.push({path: '/lightingPoleManage/lightPoleType'})">灯杆资源种类</div>
        <div class="rightButton" @click="$router.push({path: '/projectInfoManage/index'})">资产管理</div>
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
      this.time = o['H+'] + ':' + o['m+']
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
    padding: 8%
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
  }
  .imgMg{
    margin: 0 10px 10px 0;
    cursor: pointer;
  }

</style>

