<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="智慧照明" name="smartLight">智慧照明</el-tab-pane>
      <el-tab-pane label="显示屏" name="displayScreen">显示屏</el-tab-pane>
      <el-tab-pane label="安防监控" name="monitor">安防监控</el-tab-pane>
      <el-tab-pane label="井盖" name="manhole">井盖</el-tab-pane>
      <el-tab-pane label="垃圾桶" name="trash">垃圾桶</el-tab-pane>
    </el-tabs>
    <smart-light v-if="activeName === 'smartLight'" :editparams="editparams" :loaddata="loaddata" />
    <display-screen v-if="activeName === 'displayScreen'" :editparams="editparams" :loaddata="loaddata" />
    <video-monitor v-if="activeName === 'monitor'" :editparams="editparams" :loaddata="loaddata" />
    <manholeView v-if="activeName === 'manhole'" :editparams="editparams" :loaddata="loaddata" />
    <trashview v-if="activeName === 'trash'" :editparams="editparams" :loaddata="loaddata" />
  </div>
</template>
<script>
import smartLight from './smartLight'
import displayScreen from '@/views/lightingPoleManage/components/displayScreen.vue'
import videoMonitor from '@/views/lightingPoleManage/components/videoMonitor.vue'
import manholeView from '@/views/lightingPoleManage/components/manholeView.vue'
import trashview from '@/views/lightingPoleManage/components/viewTrashToLamp.vue'
export default {
  components: { smartLight, displayScreen, videoMonitor, manholeView, trashview },
  props: {
    'editparams': {
      type: Object,
      default: null
    },
    'loaddata': {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      params: null,
      activeName: 'smartLight'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.activeName = tab.name
    }
  }
}
</script>
