<template>
  <div>
    <user-table ref="userTable" v-bind="$attrs" />
    <div class="el-dialog__footer">
      <el-button @click="cancel">取消</el-button>
      <el-button :loading="saving" type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>
<script>
import userTable from './user-table'

export default {
  name: 'UserSelection',
  components: {
    userTable
  },
  inheritAttrs: false,
  props: {
    saving: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  activated() {},
  methods: {
    confirm() {
      this.$emit('confirm', this.$refs.userTable.getSelectionData())
    },
    cancel() {
      this.$emit('cancel')
    },
    getUserTableRef() {
      return this.$refs.userTable
    }
  }
}
</script>
