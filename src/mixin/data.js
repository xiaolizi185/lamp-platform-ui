export default {
  data() {
    return {
      tableData: {
        total: 0,
        uri: null,
        dataList: [],
        params: {
          currentPage: 1,
          pageSize: 10
        },
        queryParams: {},
        paramFormRules: null,
        listLoading: false
      },
      formDialog: {
        title: '',
        visible: false,
        saving: false,
        savingStatusDelay: 500,
        editMode: false,
        readOnlyMode: false,
        data: {},
        formRules: null
      }
    }
  }
}
