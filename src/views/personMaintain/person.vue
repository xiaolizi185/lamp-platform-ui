<template>
  <div>
    <el-scrollbar style="height: 100%;">
      <component :is="currentComponent" />
    </el-scrollbar>
  </div>
</template>

<script>
import List from './components/list.vue'
export default {
  components: {
    List
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

  }
}
</script>
