<template>
  <acloud-audit-report />
</template>
<script>
import AcloudAuditReport from '@acloud/acloud-audit-ui/src/components/Report'
export default {
  components: { AcloudAuditReport }
}
</script>
<style scoped>
  /deep/ .el-dialog__header{
    background-color: #00a2ff;
  }
</style>
