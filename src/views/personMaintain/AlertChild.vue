<template>
	<div class="app-container">
       <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="照明" name="lighting"></el-tab-pane>
          <el-tab-pane label="摄像头" name="camel"></el-tab-pane>
          <el-tab-pane label="井盖" name="jingai"></el-tab-pane>
          <el-tab-pane label="垃圾桶" name="trush"></el-tab-pane>
        </el-tabs>

        <el-row>
          <el-table
            v-loading.body="tableData.listLoading"
            :header-cell-style="getRowClass"
            :row-class-name="tableRowClassName"
            :data="tableData.dataList"
            element-loading-text="Loading"
            border
            highlight-current-row
            style="width: 100%;margin-top: 10px;cursor: pointer"
            :cell-style="changeCellStyle"
            @selection-change="selsChange"
            @row-click="showRow"
          >
            <el-table-column align="center" width="65">
              <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.$index+1" />
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="100" prop="stationAlert.parentid" label="设备id" sortable />
            <el-table-column show-overflow-tooltip min-width="100" prop="stationAlert.createtime" label="报警时间" sortable />
            <el-table-column show-overflow-tooltip min-width="100" prop="stationAlert.varname" label="预警值" />
            <el-table-column show-overflow-tooltip min-width="100" prop="stationAlert.alarmContent" label="报警内容" />
            <!-- <el-table-column show-overflow-tooltip prop="stationAlert.updatetime" label="处理时间" :formatter="formatCreateDate" /> -->
            <!-- <el-table-column show-overflow-tooltip prop="stationAlert.remarks" label="备注" /> -->
          </el-table>
          <el-pagination
            v-show="tableData.total > 0"
            background
            :total="tableData.total"
            :current-page="tableData.params.currentPage"
            :page-sizes="[10,20,30,40,50]"
            :page-size="tableData.params.pageSize"
            layout="total,sizes,prev,pager,next"
            style="float: right;margin-top:10px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
        <el-row>
          <el-button type="primary" @click="selectCon">确定</el-button>
        </el-row>
  </div>
</template>

<script>
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import Vue from 'vue'
export default {
  components: {

  },
  computed:{
    xuhao() {
    	   return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize;
    	 }
  },
  data(){
      return {
        activeName:"lighting",
        radio: '',
        tableData: {
          params: {
            uname: '',
            rtutype: '',
            currentPage: 1,
            pageSize: 10
          },
          total: 0,
          listLoading: true,
          dataList: []
        },
       searchObj:{},
       rowInfo:{}
	  }
  },
	created(){
    this.getTableData();
	  },
	methods:{
    getTableData() {
      if(this.activeName == "lighting"){
         this.searchObj.alertDev = 1
      }else if(this.activeName == "camel"){
        this.searchObj.alertDev = 2
      }else if(this.activeName == "jingai"){
        this.searchObj.alertDev = 4
      }else if(this.activeName == "trush"){
        this.searchObj.alertDev = 5
      }
      this.$axios.post('/acloud-lighting/stationAlert/getStationAlert?page=' + this.tableData.params.currentPage +
        '&size=' + this.tableData.params.pageSize, this.searchObj).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.data.total
          this.tableData.listLoading = false
        } else {
          console.log(res.data.message)
          this.$message.error(res.data.message || '查询失败')
          this.tableData.listLoading = false
          this.tableData.dataList = []
          return
        }
      })
    },
    selectCon(){
      this.$emit("getAlert",this.rowInfo);
    },
    showRow(row) {
      this.rowInfo = row
    },
		handleClick(tab, event) {
          this.getTableData();
      },
    // 修改表格头部颜色
    getRowClass({
      rowIndex
    }) {
      if (rowIndex === 0) {
        return 'background:rgb(228, 228, 228)'
      } else {
        return ''
      }
    },
    tableRowClassName({
      rowIndex
    }) {
      if (rowIndex % 2 !== 0) {
        return 'success-row'
      } else {
        return ''
      }
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
    },
    selsChange(val) {
      this.selectList = []
      if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          this.selectList.push(val[i])
        }
      }
    },
    formatCreateDate(row, column, cellValue) {
      return dateTool.formatDateTime(cellValue)
    },
    indexMethod(index) {
      return this.xuhao + index + 1
    },
    handleSizeChange(val) {
      this.tableData.params.pageSize = val
      this.tableData.params.currentPage = 1
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.tableData.params.currentPage = val
      this.getTableData()
    }
	},
	filters:{

	}
}
</script>

<style scoped>

</style>
