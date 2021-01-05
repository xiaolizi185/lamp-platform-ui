<template>
  <div>
    <!-- <el-table
      ref="multipleTable"
      v-loading.body="tableData.listLoading"
      :header-cell-style="getRowClass"
      :row-class-name="tableRowClassName"
      :data="tableData"
      element-loading-text="Loading"
      border
      highlight-current-row
      style="width: 100%;margin-top: 10px;cursor: pointer"
      :cell-style="changeCellStyle"
      @row-click="handleCurrentChange"
      @selection-change="selsChange"
    >
      <el-table-column label="序号" width="50" type="index" />
      <el-table-column label="启用" type="selection" width="50" />
      <el-table-column show-overflow-tooltip prop="ucode" label="编号" sortable />
      <el-table-column show-overflow-tooltip prop="uname" label="名称" sortable />
      <el-table-column show-overflow-tooltip prop="buse" label="是否使用" hidden />
      <el-table-column show-overflow-tooltip prop="autoid" label="uuid" hidden />
    </el-table> -->
    <div style="margin-left: 20px;">
      <el-button icon="el-icon-circle-plus-outline" @click="addSingle">添加</el-button>
      <el-row style="margin-top: 20px;">
        <el-col :span="12">单灯序号</el-col>
        <!-- <el-col :span="8">地址</el-col>-->
        <el-col :span="12">操作</el-col>
      </el-row>
      <el-row v-for="(item,i) in singeData" :key="i">
        <el-divider />
        <el-row>
          <el-col :span="12">
            <span>{{ item.lampIndex }}</span>
          </el-col>
          <!--  <el-col :span="8">
            <el-input v-model="item.lampAddress" style="width: 80%;" />
          </el-col>-->
          <el-col :span="12">
            <el-button type="text" @click="deleteRow(i)">删除</el-button>
          </el-col>
        </el-row>

      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    params: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      codeindex: [],
      tableChecked: [],
      deleteFlag: false, // 是否点击过删除
      tableDataById: {
        total: 0,
        listLoading: true,
        dataList: []
      },
      singleIndex: 0,
      singeData: [],
      numArray: [],
      beginlampIndex: 0
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {
  },
  methods: {
    getTableData() {
      this.tableDataById.listLoading = true
      this.$axios.get('/acloud-lighting/stationSingleLamp/findByStationNum?stationNum=' + this.params.ucode).then(res => {
        if (res.data.code === 20000) {
          this.tableDataById.dataList = res.data.data
          for (let i = 0; i < res.data.data.length; i++) {
            this.beginlampIndex++
            this.singeData.push({
              lampIndex: res.data.data[i].lampIndex
            })
          }
          this.tableDataById.listLoading = false
        } else {
          this.$message.error(res.data.message || '查询失败')
          this.tableDataById.listLoading = false
          this.tableDataById.dataList = []
          return
        }
      }).catch((e) => {
        // this.$message.error('服务器繁忙。')
      })
    },
    deleteRow(index) {
      this.deleteFlag = true
      this.singeData.splice(index, 1)
      /* for (let i = 0; i < this.singeData.length; i++) {
        if (this.singeData[i].lampIndex > (index + 1)) {
          this.singeData[i].lampIndex--
        }x
      }*/
      if (this.singeData.length === 0) {
        this.singleIndex = 0
      } else {
        this.singleIndex--
      }
    },
    handleCurrentChange(row, event, column) {
      this.$refs.multipleTable.toggleRowSelection(row, true) // 点击选中
    },
    // selsChange(val) {
    //   this.tableChecked = val
    //   this.$emit('selectedTableData', this.tableChecked)
    // },
    subSingle() {
      this.$emit('selectedTableData', this.singeData)
    },
    addSingle() {
      this.beginlampIndex++
      this.singleIndex++
      if (this.singleIndex > 4) {
        this.singleIndex = 4
        this.$message.error('最多只能添加四个!')
        return
      }
      if (this.singeData.length !== 0 && this.deleteFlag === true) {
        this.numArray = []
        for (let i = 0; i < this.singeData.length; i++) {
          this.numArray.push(this.singeData[i].lampIndex)
        }
        if (this.numArray.indexOf(1) === -1) {
          this.singeData.push({
            lampIndex: 1
          })
          return
        } else if (this.numArray.indexOf(2) === -1) {
          this.singeData.push({
            lampIndex: 2
          })
          return
        } else if (this.numArray.indexOf(3) === -1) {
          this.singeData.push({
            lampIndex: 3
          })
          return
        } else if (this.numArray.indexOf(4) === -1) {
          this.singeData.push({
            lampIndex: 4
          })
          return
        }
      }
      if (this.singeData.length !== 0) {
        this.numArray = []
        for (let i = 0; i < this.singeData.length; i++) {
          this.numArray.push(this.singeData[i].lampIndex)
        }
        this.singleIndex = this.numArray.length
        if (this.singleIndex > 4) {
          this.singleIndex = 4
          this.$message.error('最多只能添加四个!')
          return
        }
        if (this.numArray.indexOf(1) === -1) {
          this.singeData.push({
            lampIndex: 1
          })
          this.singleIndex++
          return
        } else if (this.numArray.indexOf(2) === -1) {
          this.singeData.push({
            lampIndex: 2
          })
          this.singleIndex++
          return
        } else if (this.numArray.indexOf(3) === -1) {
          this.singeData.push({
            lampIndex: 3
          })
          return
        } else if (this.numArray.indexOf(4) === -1) {
          this.singeData.push({
            lampIndex: 4
          })
          this.singleIndex++
          return
        }
      }
      this.singeData.push({
        lampIndex: this.singleIndex
      })
    },
    handleSelectionChange(val) {
      this.tableChecked = val
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      } else {
        return ''
      }
    },
    // 修改表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    uuid() {
      const s = []
      const hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'
      var uuid = s.join('')
      return uuid
    }
  }
}
</script>
