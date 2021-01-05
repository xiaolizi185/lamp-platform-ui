<template>
  <div>
    <el-row>
      <el-col v-if="!hiddenOrgTree" :span="5" style="overflow-x: auto; overflow-y: hidden;">
        <org-tree ref="orgTree" @node-click="handleNodeClick" />
      </el-col>
      <el-col :span="hiddenOrgTree ? 24 : 19">
        <el-form
          v-if="!hiddenParam"
          ref="paramForm"
          :model="tableData.params"
          inline
          label-position="right"
          label-width="70px"
          class="query-form"
          :rules="tableData.paramFormRules"
        >
          <el-form-item label="用户名称" prop="nameLike">
            <el-input v-model="tableData.params.nameLike" placeholder="用户名称" />
          </el-form-item>
          <el-form-item label="用户帐号" prop="usernameLike">
            <el-input v-model="tableData.params.usernameLike" placeholder="用户名称" />
          </el-form-item>
          <el-form-item>
            <el-button :disabled="tableData.listLoading" type="primary" @click="queryTable()">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetQuery()">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="multiple ? 20 : 24">
            <el-table
              ref="userTable"
              v-loading="tableData.listLoading"
              :data="tableData.dataList"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
              style="width: 100%"
              v-bind="$attrs"
              @current-change="onCurrentChange"
              @selection-change="handleSelectionChange"
            >
              <el-table-column show-overflow-tooltip v-if="multiple" type="selection" width="36" />
              <el-table-column show-overflow-tooltip prop="name" label="用户名称" />
              <el-table-column show-overflow-tooltip prop="username" label="用户帐号" />
            </el-table>
            <pagination
              v-show="tableData.total > 0"
              :total="tableData.total"
              :page.sync="tableData.params.currentPage"
              :limit.sync="tableData.params.pageSize"
              @pagination="getTableData"
            />
          </el-col>
          <el-col v-if="multiple" :span="4">
            <el-table
              ref="userSelectionTable"
              :data="selectionTableData.dataList"
              border
              fit
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column show-overflow-tooltip label="选择的用户" >
                <template slot-scope="scope">
                  <el-button icon="el-icon-delete" type="text" @click="deleteSelectionUser(scope.row)" />
                  {{ scope.row.name }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import orgTree from '../org/orgTree'
import Pagination from '@/components/Pagination'

const paramFormRules = {
  nameLike: [
    {
      pattern: '^[\\u4E00-\\u9FA5A-Za-z0-9_]+$',
      message: '由中文,英文,数字和下划线组成',
      trigger: 'blur'
    }
  ],
  usernameLike: [
    {
      pattern: '^[\\u4E00-\\u9FA5A-Za-z0-9_]+$',
      message: '由中文,英文,数字和下划线组成',
      trigger: 'blur'
    }
  ]
}

export default {
  name: 'UserTable',
  components: { orgTree, Pagination },
  props: {
    hiddenOrgTree: {
      type: Boolean,
      default: false
    },
    hiddenParam: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    uri: {
      type: String,
      default: '/acloud-user/users/desensitize/page'
    },
    customParam: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      tree: {
        currentNode: null
      },
      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10,
          nameLike: null,
          usernameLike: null
        },
        queryParams: {},
        paramFormRules,
        total: 0,
        dataList: [],
        selection: null,
        listLoading: false
      },
      selectionTableData: {
        dataList: []
      }
    }
  },
  mounted() {
    this.getTableData()
  },
  activated() {},
  methods: {
    resetQuery() {
      this.$refs.paramForm.resetFields()
      this.$refs.orgTree && this.$refs.orgTree.queryTreeData()
      this.tableData.params.currentPage = 1
      this.tableData.params.pageSize = 10
      this.tableData.queryParams = {}
      this.tree.currentNode = null
      this.getTableData()
    },
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
    getTableData() {
      const param = Object.assign({}, this.tableData.queryParams, this.customParam, {
        pageNum: this.tableData.params.currentPage,
        pageSize: this.tableData.params.pageSize
      })
      if (!this.hiddenOrgTree && this.tree.currentNode) {
        param.orgId = this.tree.currentNode.id
      }
      this.tableData.listLoading = true
      this.$axios.get(this.uri, { params: param }).then(res => {
        this.tableData.dataList = res.data.list
        this.tableData.total = res.data.total
        this.tableData.listLoading = false
      })
    },
    handleNodeClick(node) {
      this.tree.currentNode = node
      this.getTableData()
    },
    onCurrentChange(selection) {
      if (!this.multiple) {
        this.tableData.selection = selection
      }
    },
    handleSelectionChange(val) {
      if (this.multiple) {
        this.selectionTableData.dataList = val
      }
    },
    getOrgTreeComponent() {
      return this.$refs.orgTree
    },
    getUserTable() {
      return this.$refs.userTable
    },
    setCurrentUser(row) {
      this.getUserTable().setCurrentRow(row)
    },
    getSelectionData() {
      return this.multiple ? this.selectionTableData.dataList : this.tableData.selection
    },
    deleteSelectionUser(row) {
      console.dir(row)
    }
  }
}
</script>
