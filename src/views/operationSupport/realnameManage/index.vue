<template>
  <div class="app-container2">
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户实名库" name="userRealname">
        <realnameUserTab />
      </el-tab-pane>
      <!-- <el-tab-pane label="企业实名库" name="orgRealname">
        <realnameOrgTab />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import realnameUserTab from '@/views/operationSupport/realnameManage/components/realnameUserTab'
export default {
  components: { realnameUserTab },
  data() {
    return {
      activeName: 'userRealname'
    }
  },
  methods: {
  }
}
</script>
<style>
.app-container2{
  padding-right: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
}
.el-loading-mask{
  left:210px !important;
}
/deep/.el-table .cell.el-tooltip{
  max-height: 25px;
}
</style>

