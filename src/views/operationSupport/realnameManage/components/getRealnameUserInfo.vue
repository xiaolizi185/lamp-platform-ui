<template>
  <div class="app-container" style="margin-top:10px">
    <el-divider />
    <el-row>
      <el-col :span="24">
        <el-input
          v-model="textarea"
          type="textarea"
          autosize
          clearable
          readonly
          style="border-color: #15aabf;background-color:rgb(228, 228, 228)"
        />
      </el-col>
    </el-row>
    <el-table
      v-loading.body="relationData.listLoading"
      :header-cell-style="getRowClass"
      :data="relationData.dataList"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%; margin-top:10px;"
    >
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column show-overflow-tooltip prop="name" label="应用名称" />
      <el-table-column show-overflow-tooltip prop="accName" label="帐号" />
    </el-table>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  props: {
    params: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      textarea:
        '根据用户在所使用的应用中的实名制信息进行关联，推导出该用户关联的所有应用',
      relationData: {
        total: 0,
        dataList: []
      }
    }
  },
  created() {
    this.getRelationApplication()
  },
  methods: {
    getRelationApplication() {
      const reqparams = {
        createId: Vue.getAcloudProvider().getUserInfo().id,
        eid: this.params.eid
      }
      this.$axios
        .post('/sgid-out-user/user/getAppByUser', reqparams)
        .then(res => {
          if (res.data.code === '100001') {
            this.relationData.dataList = res.data.data
            this.relationData.listLoading = false
            if (res.data.data !== null) {
              this.relationData.total = res.data.data.total
              this.$emit('getTotal', res.data.data.length)
            }
          } else {
            this.$message.error(res.data.message || '查询失败')
            this.relationData.listLoading = false
            this.$emit('getTotal', 0)
            this.relationData.dataList = []
            return
          }
        })
        .catch(() => {
          this.$message.error('服务器繁忙。')
        })
    },
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    }
  }
}
</script>
<style scoped>
.el-icon-search {
  background: transparent !important;
  color: #fff !important;
}
.el-input-group--append .el-input__inner {
  height: 35px !important;
}
.el-drawer__header {
  margin-bottom: 0px;
}
.el-input__icon {
  line-height: 31px;
}
.el-divider--horizontal {
  margin-top: -30px;
}
</style>
