<template>
  <div>
    <el-tree
      ref="orgTree"
      node-key="id"
      :data="tree.data"
      :props="tree.defaultProps"
      :highlight-current="highlight"
      v-bind="$attrs"
      @node-click="handleNodeClick"
    />
  </div>
</template>
<script>
export default {
  name: 'OrgTree',
  inheritAttrs: false,
  props: {
    highlight: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tree: {
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        data: [],
        currentNode: null
      }
    }
  },
  mounted() {
    this.queryTreeData()
  },
  activated() {},
  methods: {
    queryTreeData(callback) {
      this.$axios
        .get('/acloud-organization/orgs/tree')
        .then(res => {
          if (res.data) {
            this.tree.data = res.data
            this.$nextTick(() => callback && callback())
          } else {
            this.$message.error('组织机构树查询失败。')
          }
        })
    },
    handleNodeClick(node) {
      this.tree.currentNode = node
      this.$emit('node-click', node)
    },
    confirm() {
      this.$emit('confirm', this.tableData.selection)
    },
    cancel() {
      this.$emit('cancel')
    },
    getTreeRef() {
      return this.$refs.orgTree
    },
    setCurrentOrg(nodeId) {
      this.getTreeRef().setCurrentKey(nodeId)
    },
    forceRefreshTreeData(callback) {
      this.tree.data = []
      this.queryTreeData(callback)
    }
  }
}
</script>
