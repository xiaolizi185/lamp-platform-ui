export default {
  // 如果 混入 生命周期函数，并且组件中也书写了生命周期函数，则两个都会执行，不会覆盖
  // created() {
  //   console.log('mixins created -> ')
  //   this.formDialog.visible = false
  //   this.resetQuery()
  // },
  // activated() {
  //   console.log('mixins activated -> ')
  //   this.resetQuery()
  // },
  // deactivated() {
  //   console.log('mixins deactivated -> ')
  //   this.formDialog.visible = false
  // },
  methods: {
    queryTable() {
      // 按钮点击查询
      this.$refs.paramForm.validate(v => {
        if (v) {
          this.tableData.params.currentPage = 1 // 点击搜索按钮，默认查询第一页
          // 实际查询的参数使用queryParams属性
          this.tableData.queryParams = Object.assign({}, this.tableData.params)
          this.getTableData()
        }
      })
    },
    resetQuery() {
      this.$refs.paramForm && this.$refs.paramForm.resetFields()
      this.tableData.params.currentPage = 1
      this.tableData.params.pageSize = 10
      this.tableData.queryParams = {}
      this.getTableData()
    },
    getTableData() {
      const data = Object.assign({}, this.tableData.queryParams, {
        pageNum: this.tableData.params.currentPage,
        pageSize: this.tableData.params.pageSize
      })
      this.tableData.listLoading = true
      this.$axios
        .get(this.tableData.uri, { params: data })
        .then(res => {
          this.tableData.dataList = res.data.list
          this.tableData.total = res.data.total
        })
        .finally(() => (this.tableData.listLoading = false))
    },
    getTableDataAfterDelete() {
      this.tableData.params.currentPage = 1
      this.getTableData()
    }
  }
}
