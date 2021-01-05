<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="异常监测" name="exception"></el-tab-pane>
      <el-tab-pane label="任务操作日志" name="log"></el-tab-pane>
    </el-tabs>
    <List v-if="activeName === 'exception'" />
    <Log  v-if="activeName === 'log'"></Log>
    <!-- <el-scrollbar style="height: 100%;">
      <component :is="currentComponent" v-if="activeName === 'exception'" />
    </el-scrollbar>-->
  </div>
</template>

<script>
import List from './components/list.vue'
import Log from './components/log.vue'
export default {
  components: {
    List, Log
  },
  filters: {

  },
  data() {
    return {
      currentComponent: 'List',
      activeName: 'exception'
    }
  },
  computed: {

  },
  created() {

  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }

  }
}
</script>
