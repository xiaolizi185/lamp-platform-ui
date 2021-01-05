<template>
  <acloud-audit-logs />
</template>
<script>
import AcloudAuditLogs from '@acloud/acloud-audit-ui/src/components/Logs'
export default {
  components: { AcloudAuditLogs }
}
</script>
<style scoped>
  /deep/ .el-dialog__header{
    background-color: #00a2ff;
  }
</style>
