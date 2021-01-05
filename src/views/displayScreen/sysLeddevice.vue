<template>
  <div class="app-container">
    <div name="buttonGroup">
      <el-row>
        <el-form
          ref="paramForm"
          :model="tableData.params"
          :rules="tableData.paramFormRules"
          inline
          label-position="right"
          label-width="80px"
          class="query-form"
          style="margin-top: 10px"
        >
          <el-form-item>
            <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1" @click="add()">新增</el-button>
            <el-button type="primary" style="background-color: #f48a60;border-color: #f48a60;margin-left: 10px" @click="deleteMulti()">删除</el-button>
            <el-button type="primary" style="background-color: #f0bc34;border-color: #f0bc34;margin-left: 10px" @click="sendPlayList()">发送节目</el-button>
            <el-button type="primary" style="background-color: #f0b347;border-color: #f0b347" @click="sendLocalUpdate()">发送字幕</el-button>
            <el-button type="primary" style="background-color: #f0a890;border-color: #f0a890" @click="closeLocalUpdate()">关闭字幕</el-button>
            <!-- <el-button type="primary" style="background-color: #7ff0b8;border-color: #7ff0b8" @click="playsetTime()">定时播放</el-button> -->
            <!--
            <el-button type="primary" >同步设备</el-button>
            <el-button type="primary" icon="el-icon-refresh-right">同步视频</el-button> -->
            <!-- <el-button type="primary" >...更多</el-button> -->

            <el-dropdown @command="handleCommand">
              <el-button type="primary">
                更多菜单<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="setTimePlay">定时播放</el-dropdown-item>
                <!-- <el-dropdown-item command="memorySize">查看设备内存</el-dropdown-item> -->
                <el-dropdown-item command="timeList">查看定时开关屏</el-dropdown-item>
                <el-dropdown-item command="setTimeList">设置定时开关屏</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item prop="searchName">
            <el-input v-model="tableData.params.searchName" :maxlength="200" clearable placeholder="请输入搜索条件" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>

    <div>
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
      >
        <el-table-column label="序号" width="50" type="index" :index="indexMethod" />
        <el-table-column type="selection" width="50" />
        <el-table-column show-overflow-tooltip prop="deviceId" label="设备id" sortable />
        <el-table-column show-overflow-tooltip prop="name" label="名称" sortable />
        <el-table-column show-overflow-tooltip prop="ip" label="IP地址" />

        <el-table-column show-overflow-tooltip prop="projectName" label="所属项目" sortable />
        <!-- <el-table-column show-overflow-tooltip prop="width" label="宽度" />
        <el-table-column show-overflow-tooltip prop="height" label="高度" />
        <el-table-column show-overflow-tooltip prop="light" label="亮度" />
        <el-table-column show-overflow-tooltip prop="volnme" label="音量" /> -->
        <el-table-column show-overflow-tooltip prop="address" label="地址" />
        <el-table-column show-overflow-tooltip prop="username" label="创建人" />
        <!-- <el-table-column show-overflow-tooltip prop="status" label="状态" /> -->
        <el-table-column show-overflow-tooltip prop="createTime" label="创建时间" />
        <!-- <el-table-column show-overflow-tooltip prop="remark" label="备注" /> -->
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="update(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :total="tableData.total"
        :current-page="tableData.params.currentPage"
        :page-sizes="[10,20,30,40,50]"
        :page-size="tableData.params.pageSize"
        layout="total,sizes,prev,next"
        style="float: right;margin-top:10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <div>
      <el-drawer :title="drwTitle" size="50%" :visible.sync="drawer" :destroy-on-close="true">
        <el-form ref="addform" :rules="model.rules" :model="sysLeddevice" label-width="100px">
          <el-form-item label="设备名称:" prop="name" class="form-item" :rules="model.rules.name">
            <el-input v-model="sysLeddevice.name" :maxlength="16" clearable placeholder="请输入设备名称" />
          </el-form-item>

          <el-form-item label="项目名称" prop="projectID" class="form-item" :rules="model.rules.projectID">
            <el-select v-model="sysLeddevice.projectID" placeholder="请选择项目" style="width: 100%">
              <el-option
                v-for="item in projectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="deviceId号:" prop="deviceId" class="form-item" :rules="model.rules.deviceId">
            <el-input v-model="sysLeddevice.deviceId" :maxlength="16" clearable placeholder="请输入设备号" />
          </el-form-item>
          <el-form-item label="ip地址:" prop="ip" class="form-item" :rules="model.rules.ip">
            <el-input v-model="sysLeddevice.ip" :maxlength="50" clearable placeholder="请输入IP地址" />
          </el-form-item>
          <el-form-item label="宽:" prop="width" class="form-item" :rules="model.rules.width">
            <el-input v-model="sysLeddevice.width" :maxlength="16" clearable placeholder="请输入宽度" />
          </el-form-item>
          <el-form-item label="高:" prop="height" class="form-item" :rules="model.rules.height">
            <el-input v-model="sysLeddevice.height" :maxlength="16" clearable placeholder="请输入高度" />
          </el-form-item>
          <el-form-item label="音量:" prop="volnme" class="form-item" :rules="model.rules.volnme">
            <el-input v-model="sysLeddevice.volnme" :maxlength="16" clearable placeholder="请输入音量" />
          </el-form-item>
          <el-form-item label="亮度:" prop="light" class="form-item" :rules="model.rules.light">
            <el-input v-model="sysLeddevice.light" :maxlength="16" clearable placeholder="请输入亮度" />
          </el-form-item>
          <el-form-item label="经度:" prop="latitude" class="form-item" :rules="model.rules.latitude">
            <el-input v-model="sysLeddevice.latitude" :maxlength="16" clearable placeholder="请输入宽度" @click.native="selectMap" />
          </el-form-item>
          <el-form-item label="纬度:" prop="longitude" class="form-item" :rules="model.rules.longitude">
            <el-input v-model="sysLeddevice.longitude" :maxlength="16" clearable placeholder="请输入高度" @click.native="selectMap" />
          </el-form-item>
          <el-form-item label="地址:" prop="address" class="form-item">
            <el-input v-model="sysLeddevice.address" :maxlength="100" clearable placeholder="请输入地址" @click.native="selectMap" />
          </el-form-item>
          <el-form-item label="备注:" prop="remark" class="form-item" >
            <el-input v-model="sysLeddevice.remark" :maxlength="200" clearable placeholder="请输入备注" />
          </el-form-item>
        </el-form>
        <el-drawer
          ref="innerMapDrawer"
          size="80%"
          :append-to-body="true"
          :visible.sync="innerDrawer"
        >
          <map-drawer :drawer="innerMapDrawer1" @saveMapInfo="saveMapInfo" />
        </el-drawer>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="drawer=false">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="confirmSave()">提交</el-button>
      </el-drawer>
    </div>

    <div>
      <el-drawer title="节目列表" size="80%" :visible.sync="playListDrawer" :destroy-on-close="true">
        <el-table
          v-loading.body="playListData.listLoading"
          :header-cell-style="getRowClass"
          :row-class-name="tableRowClassName"
          :data="playListData.dataList"
          element-loading-text="Loading"
          border
          highlight-current-row
          style="width: 100%;margin-top: 10px;cursor: pointer"
          :cell-style="changeCellStyle"
        >
          <el-table-column label="序号" width="50" type="index" :index="indexMethod1" />
          <el-table-column show-overflow-tooltip prop="fName" label="节目名称" sortable />
          <!-- <el-table-column show-overflow-tooltip prop="materialName" label="绑定素材名称" /> -->
          <!-- <el-table-column show-overflow-tooltip prop="materialName" label="预览">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.materialUrl" :key="index">
                <img v-if="scope.row.types[index] == 2" :src="fileImgUrl +'/'+item" min-width="50" height="50">
                <video v-if="scope.row.types[index] == 3" :src="fileImgUrl +'/'+item" min-width="50" height="50" />
              </span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column show-overflow-tooltip prop="fAudit" label="是否审核" /> -->
          <el-table-column show-overflow-tooltip prop="fUpdateTime" label="修改时间" />
          <el-table-column show-overflow-tooltip label="操作">
            <template slot-scope="scope">
              <el-button type="text" style="color: #13CE66;" @click="confirmSend(scope.row)">发送节目</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :total="playListData.total"
          :current-page="playListData.params.currentPage"
          :page-sizes="[10,20,30,40,50]"
          :page-size="playListData.params.pageSize"
          layout="total,sizes,prev,next"
          style="float: right;margin-top:10px"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
        />
      </el-drawer>
    </div>

    <div>
      <el-drawer title="发送字幕" size="50%" :visible.sync="subtitleDrawer" :destroy-on-close="true">
        <el-form ref="form" :rules="modelSub.rules" :model="subtitleObj" label-width="100px">
          <el-form-item label="显示位置:" prop="yAxis" class="form-item" :rules="modelSub.rules.yAxis">
            <el-select
              v-model="subtitleObj.yAxis"
              default-first-option
              placeholder="请选择显示位置"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="滚动速度:" prop="speedSpecial" class="form-item" :rules="modelSub.rules.speedSpecial">
            <el-select
              v-model="subtitleObj.speedSpecial"
              default-first-option
              placeholder="请选择滚动速度"
            >
              <el-option
                v-for="item in speedOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="循环次数:" prop="playTimes" class="form-item" :rules="modelSub.rules.playTimes">
            <el-input-number v-model="subtitleObj.playTimes" controls-position="right" :min="1" :max="255" />
          </el-form-item>
          <el-form-item label="文字颜色:" prop="foregroundColor" class="form-item" :rules="modelSub.rules.foregroundColor">
            <el-select
              v-model="subtitleObj.foregroundColor"
              default-first-option
              placeholder="请选择文字颜色"
            >
              <el-option
                v-for="item in colorOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="字幕内容:" prop="content" class="form-item" :rules="modelSub.rules.content">
            <el-input v-model="subtitleObj.content" type="textarea" :maxlength="500" clearable placeholder="请输入字幕" />
          </el-form-item>
        </el-form>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="subtitleDrawer=false">返回</el-button>
        <el-button style="margin-top: 12px;float: right;margin-right: 5px" type="primary" @click="titleSubmit()">提交</el-button>
      </el-drawer>
    </div>

    <el-drawer title="节目列表" size="60%" :visible.sync="programtDrawer" :destroy-on-close="true">
      <el-table
        v-loading.body="programListData.listLoading"
        :header-cell-style="getRowClass"
        :row-class-name="tableRowClassName"
        :data="programListData.dataList"
        element-loading-text="Loading"
        border
        highlight-current-row
        style="width: 100%;margin-top: 10px;cursor: pointer"
        :cell-style="changeCellStyle"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column show-overflow-tooltip prop="fName" label="节目名称" sortable />
        <el-table-column show-overflow-tooltip prop="materialName" label="绑定素材名称" />
        <el-table-column show-overflow-tooltip prop="materialName" label="预览">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.materialUrl" :key="index">
              <img v-if="scope.row.types[index] == 2" :src="fileImgUrl +'/'+item" min-width="50" height="50">
              <video v-if="scope.row.types[index] == 3" :src="fileImgUrl +'/'+item" min-width="50" height="50" />
            </span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="fAudit" label="是否审核" />
        <el-table-column show-overflow-tooltip prop="fUpdateTime" label="修改时间" />
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button type="text" style="color: #13CE66;" @click="confirmSend(scope.row)">发送节目</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :total="playListData.total"
        :current-page="playListData.params.currentPage"
        :page-sizes="[10,20,30,40,50]"
        :page-size="playListData.params.pageSize"
        layout="total,sizes,prev,next"
        style="float: right;margin-top:10px"
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
      />
    </el-drawer>

    <div name="mutiFunction">
      <el-drawer :title="mutiTitle" size="60%" :visible.sync="mutitDrawer" :destroy-on-close="true">
        <div v-if="mutiCommand == 'setTimePlay'" name="定时播放模块" style="margin-left: 2%;">
          <el-row style="margin-bottom: 10px;">
            <el-col :span="8">
              <span>节目编号：</span>
              <el-select
                v-model="projectId"
                default-first-option
                placeholder="节目单号"
              >
                <el-option
                  v-for="item in mutiPlayArray"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-col>
          </el-row>
          <div class="block">
            <span class="demonstration">屏幕开启：</span>
            <el-date-picker
              v-model="playTimeParam"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="dateChange"
            />
            <el-button @click="continueAdd">继续添加</el-button>
          </div>
          <div style="margin-top: 40px;">
            <el-table
              :data="playTimeList"
              :header-cell-style="getRowClass"
              :row-class-name="tableRowClassName"
              highlight-current-row
              style="width: 100%;margin-top: 10px;cursor: pointer"
              stripe
            >
              <el-table-column prop="id" label="节目编号" />
              <el-table-column prop="start" label="开始时间" />
              <el-table-column prop="end" label="结束时间" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin:20px ;">
            <el-button type="primary" style="float: left;" @click="conPlayTime">提交</el-button>
            <el-button type="primary" style="float: left;" @click="playTimeBack">返回</el-button>
          </div>
        </div>

        <div v-if="mutiCommand == 'memorySize'" name="获取设备内存模块" style="margin-left: 2%;">
          <el-row>
            <el-col :span="8">设备名称：</el-col>
            <el-col :span="16">{{ memorySize.name }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">ip地址：</el-col>
            <el-col :span="16">{{ memorySize.ip }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">总空间大小：</el-col>
            <el-col :span="16">{{ memorySize.totolSize }}MB</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">剩余空间大小：</el-col>
            <el-col :span="16">{{ memorySize.remainSize }}MB</el-col>
          </el-row>
        </div>

        <div v-if="mutiCommand == 'timeList'" name="查看定时开关屏" style="margin-left: 2%;">
          <div style="margin-top: 40px;">
            <el-table
              :data="openTimeList"
              :header-cell-style="getRowClass"
              :row-class-name="tableRowClassName"
              highlight-current-row
              style="width: 100%;margin-top: 10px;cursor: pointer"
              stripe
            >
              <el-table-column prop="start" label="开始时间" />
              <el-table-column prop="end" label="结束时间" />
            </el-table>
          </div>
          <div style="margin:20px ;">
            <el-button type="primary" style="float: left;" @click="openTimeBack">返回</el-button>
          </div>
        </div>

        <div v-if="mutiCommand == 'setTimeList'" name="设置定时开关屏" style="margin-left: 2%;">
          <div class="block">
            <span class="demonstration">开屏时间：</span>
            <el-date-picker
              v-model="openTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="openTimeChange"
            />
            <el-button @click="continueOpen">继续添加</el-button>
          </div>
          <div style="margin-top: 40px;">
            <el-table
              :data="openTimeList"
              :header-cell-style="getRowClass"
              :row-class-name="tableRowClassName"
              highlight-current-row
              style="width: 100%;margin-top: 10px;cursor: pointer"
              stripe
            >
              <el-table-column prop="start" label="开始时间" />
              <el-table-column prop="end" label="结束时间" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteRowOpen(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="margin:20px ;">
            <el-button type="primary" style="float: left;" @click="conOpenTime">提交</el-button>
            <el-button type="primary" style="float: left;" @click="openTimeBack">返回</el-button>
          </div>
        </div>

      </el-drawer>
    </div>

  </div>
</template>

<script>
import {
  queryProject
} from '@/views/videoMonitor/videoAccount/videoM.js'
import { getSysLeddevice, deletesysLeddevice, addsysLeddevice,
  updatesysLeddevice, remoteSend, sendLocal, removeLocalUpdate, getplayList,
  setPlayTimeList, getDeviceMemorySize, setRunOrStop, getDevicePowerTimeList } from '@/views/displayScreen/sysLeddevice.js'
import { getProgram } from '@/views/displayScreen/program.js'
import aTool from '@acloud/acloud-atool-js'
import dateTool from '@/utils/date-tool'
import { dateFormat } from '@/utils/publicMethod.js'
import mapDrawer from '@/views/websiteManage/components/mapDrawer'
import Vue from 'vue'
const paramFormRules = {
  searchName: [
    {
      pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
      message: '不能输入特殊字符。',
      trigger: 'change'
    }
  ]
}
export default {
  components: {
    mapDrawer
  },
  filters: {

  },
  data() {
    return {
      innerMapDrawer1: this.$refs,
      innerDrawer: false,
      fileImgUrl: process.env.VUE_APP_FILE_URI,

      tableData: {
        params: {
          currentPage: 1,
          pageSize: 10,
          searchName: ''
        },
        paramFormRules,
        total: 0,
        listLoading: false,
        dataList: []
      },
      searchKey: '',
      playListData: {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: false,
        dataList: []
      },
      programListData: {
        params: {
          currentPage: 1,
          pageSize: 10
        },
        total: 0,
        listLoading: false,
        dataList: []
      },
      sysLeddevice: {},
      selectList: [],
      projectList: [],
      excuteStatus: 'add',
      drwTitle: '新增呼叫设备',
      drawer: false,
      playListDrawer: false,
      subtitleDrawer: false,
      programtDrawer: false,
      subtitleObj: {
        playTimes: 1
      },
      mutiTitle: '',
      mutitDrawer: false,
      mutiCommand: '',
      playTimeParam: [],
      playTimeList: [],
      mutiPlayArray: [],
      memorySize: {},
      openTime: [],
      openTimeList: [],
      projectId: '',
      materialStatus: {},
      options: [
        { label: '顶部', value: '0' },
        { label: '底部', value: '112' }
      ],
      speedOpt: [
        { label: '最慢', value: '1' },
        { label: '较慢', value: '2' },
        { label: '常速', value: '3' },
        { label: '较快', value: '4' },
        { label: '最快', value: '5' }
      ],
      colorOpt: [
        { label: '红色', value: '1' },
        { label: '绿色', value: '2' },
        { label: '蓝色', value: '3' },
        { label: '黄色', value: '4' },
        { label: '紫色', value: '5' },
        { label: '青色', value: '6' },
        { label: '白色', value: '7' },
        { label: '黑色', value: '8' }
      ],
      model: {
        rules: {
          name: [{
            required: true,
            message: '请输入设备编号。',
            trigger: 'change'
          },
          {
            pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }
          ],
          deviceId: [{
            required: true,
            message: '请输入设备号',
            trigger: 'change'
          }, {
            pattern: aTool.RegexHelper.constants.chnEngNumAndUnderline.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }
          ],
          projectID: [
            { required: true, message: '请选择所在项目。', trigger: 'blur' }
          ],
          ip: [{
            required: true,
            message: '请输入ip地址',
            trigger: 'change'
          }, {
            pattern: aTool.RegexHelper.constants.ip.value,
            message: '请输入正确的IP地址。',
            trigger: 'change'
          }
          ],
          width: [{
            required: true,
            message: '请输入宽度。',
            trigger: 'change'
          },
          {
            pattern: aTool.RegexHelper.constants.nonnegativeFloat.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }],
          height: [{
            required: true,
            message: '请输入高度。',
            trigger: 'change'
          },
          {
            pattern: aTool.RegexHelper.constants.nonnegativeFloat.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }],
          latitude: [{
            required: true,
            message: '请输入经度。',
            trigger: 'change'
          }],
          longitude: [{
            required: true,
            message: '请输入纬度。',
            trigger: 'change'
          }],
          light: [{
            required: true,
            message: '请输入亮度。',
            trigger: 'change'
          },
          {
            pattern: aTool.RegexHelper.constants.nonnegativeInteger.value,
            message: '请输入数字类型。',
            trigger: 'change'
          }],
          volnme: [{
            required: true,
            message: '请输入音量。',
            trigger: 'change'
          }, {
            pattern: aTool.RegexHelper.constants.nonnegativeInteger.value,
            message: '请输入数字类型。',
            trigger: 'change'
          }]
        }
      },
      modelSub: {
        rules: {
          yAxis: [{
            required: true,
            message: '请选择显示位置。',
            trigger: 'change'
          }
          ],
          speedSpecial: [{
            required: true,
            message: '请选择播放速度',
            trigger: 'change'
          }, {
            pattern: aTool.RegexHelper.constants.positiveInteger.value,
            message: '不能输入特殊字符。',
            trigger: 'change'
          }],
          playTimes: [{
            required: true,
            message: '请输入循环次数。',
            trigger: 'change'
          }],
          foregroundColor: [{
            required: true,
            message: '请选择字体颜色。',
            trigger: 'change'
          }],
          content: [{
            required: true,
            message: '请输入字幕内容。',
            trigger: 'change'
          }]
        }
      }

    }
  },
  computed: {
    xuhao() {
      return (this.tableData.params.currentPage - 1) * this.tableData.params.pageSize
    },
    xuhao1() {
      return (this.playListData.params.currentPage - 1) * this.playListData.params.pageSize
    }
  },
  created() {
    this.mutiPlayArrayCal()
    this.queryTable()
    this.queryPlayList()
    this.getProjectInfo()
  },
  methods: {
    selectOne() {
      if (this.selectList.length !== 1) {
        this.$message.error('请只选择一行！')
        return false
      } else {
        return true
      }
    },
    changeProject(projectId) {
      this.model.projectID = projectId
    },
    getProjectInfo() {
      const params = {
        'fDelState': true,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      this.$axios.post('/acloud-lamppost/project/search?page=' + this.tableData.params.currentPage + '&size=' + this.tableData.params.pageSize, params).then(res => {
        if (res.data.code === 20000) {
          for (let i = 0; i < res.data.data.rows.length; i++) {
            this.projectList.push({
              'label': res.data.data.rows[i].fName,
              'value': res.data.data.rows[i].fId
            })
          }
        } else {
          this.$message.error(res.data.message || '查询失败')
          return
        }
      }).catch(() => {
        this.$message.error('服务器繁忙。')
      })
    },
    continueAdd() {
      this.playTimeParam = []
    },
    continueOpen() {
      this.openTime = []
    },
    mutiPlayArrayCal() {
      for (let i = 1; i <= 100; i++) {
        this.mutiPlayArray.push(i)
      }
    },
    deleteRow(row) {
      for (let i = 0; i < this.playTimeList.length; i++) {
        if (this.playTimeList[i] === row) {
          this.playTimeList.splice(i, 1)
          break
        }
      }
    },
    deleteRowOpen(row) {
      for (let i = 0; i < this.openTimeList.length; i++) {
        if (this.openTimeList[i] === row) {
          this.openTimeList.splice(i, 1)
          break
        }
      }
    },
    dateChange(data) {
      this.playTimeList.push({
        id: this.projectId,
        start: dateFormat('YYYY-mm-dd HH:MM:SS', data[0]),
        end: dateFormat('YYYY-mm-dd HH:MM:SS', data[1])
      })
    },
    openTimeChange(data) {
      this.openTimeList.push({
        start: dateFormat('YYYY-mm-dd HH:MM:SS', data[0]),
        end: dateFormat('YYYY-mm-dd HH:MM:SS', data[1])
      })
    },
    playTimeBack() {
      this.playTimeList = []
      this.projectId = ''
      this.playTimeParam = []
      this.mutitDrawer = false
    },
    openTimeBack() {
      this.openTime = []
      this.openTimeList = []
      this.mutitDrawer = false
    },
    selectMap() {
      this.innerDrawer = true
    },
    saveMapInfo(mapInfo) {
      this.sysLeddevice.latitude = mapInfo.lng
      this.sysLeddevice.longitude = mapInfo.lat
      this.sysLeddevice.address = mapInfo.address
    },
    conPlayTime() {
      if (this.playTimeList.length < 1) {
        this.$message.error('选择一项或多项')
        return
      }
      var req = {
        paramList: this.playTimeList,
        createId: Vue.getAcloudProvider().getUserInfo().id,
        ip: this.selectList[0].ip,
        port: this.selectList[0].port
      }
      setPlayTimeList(req).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.mutitDrawer = false
        } else {
          this.$message.error(res.data.message)
          this.mutitDrawer = false
        }
      })
    },
    conOpenTime() {
      if (this.openTimeList.length < 1) {
        this.$message.error('选择一项或多项')
        return
      }
      var req = {
        paramList: this.openTimeList,
        createId: Vue.getAcloudProvider().getUserInfo().id,
        ip: this.selectList[0].ip,
        port: this.selectList[0].port
      }
      setRunOrStop(req).then(res => {
        if (res.data.code === 20000) {
          this.mutitDrawer = false
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },

    handleCommand(command) {
      if (!this.selectOne()) {
        return
      }

      switch (command) {
        case 'setTimePlay':
          this.mutitDrawer = true
          this.mutiTitle = '设置定时播放列表'
          this.mutiCommand = command
          break
        case 'memorySize':
          var req = {
            ledDevice: this.selectList[0],
            createId: Vue.getAcloudProvider().getUserInfo().id
          }
          getDeviceMemorySize(req).then(res => {
            if (res.data.code === 20000) {
              this.memorySize = res.data.data
              this.memorySize.ip = this.selectList[0].ip
              this.memorySize.name = this.selectList[0].name
              this.mutitDrawer = true
              this.mutiTitle = '查看设备内存'
              this.mutiCommand = command
            } else {
              this.$message.error(res.data.message)
            }
          })
          break
        case 'timeList':
          var req = {
            ledDevice: this.selectList[0],
            createId: Vue.getAcloudProvider().getUserInfo().id
          }
          getDevicePowerTimeList(req).then(res => {
            if (res.data.code === 20000) {
              this.openTimeList = res.data.data
              this.mutitDrawer = true
              this.mutiTitle = '查看定时开关屏'
              this.mutiCommand = command
            } else {
              this.$message.error(res.data.message)
            }
          })
          break
        case 'setTimeList':
          this.mutitDrawer = true
          this.mutiTitle = '设置定时开关屏'
          this.mutiCommand = command
          break
      }
    },
    search() {
      this.$refs.paramForm.validate(v => {
          if (v) {
          this.queryTable()
        }
      })
    },
    queryTable() {
      this.tableData.listLoading = true
      var tempObj = {
        delState: true,
        'name': this.tableData.params.searchName,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }
      getSysLeddevice(tempObj, this.tableData.params.currentPage, this.tableData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.tableData.dataList = res.data.data.list
          this.tableData.total = res.data.total
          this.tableData.listLoading = false
        } else {
          this.$message.error('查询失败' || res.data.message)
          this.tableData.listLoading = false
          return
        }
      })
    },
    queryPlayList() {
      let temp =
      {
        'fName': this.tableData.params.searchName,
        'createId': Vue.getAcloudProvider().getUserInfo().id
      }

      getProgram(temp, this.playListData.params.currentPage, this.playListData.params.pageSize).then(res => {
        if (res.data.code === 20000) {
          this.playListData.dataList = res.data.data.list
          this.playListData.total = res.data.total
        }
      })
    },
    add() {
      this.sysLeddevice = {}
      this.drwTitle = '设备添加'
      this.drawer = true
      this.excuteStatus = 'add'
    },
    update(row) {
      console.log(row)
      this.drwTitle = '设备修改'
      this.drawer = true
      this.excuteStatus = 'update'
      this.sysLeddevice = { ...row }
      this.sysLeddevice.width = row.width.toString()
      this.sysLeddevice.height = row.height.toString()
      this.sysLeddevice.volnme = row.volnme.toString()
      this.sysLeddevice.light = row.light.toString()
    },
    deleteMulti() {
      if (this.selectList.length <= 0) {
        this.$message.error('请选择一行或多行')
        return
      }
      var deleteStr = ''
      for (let i = 0; i < this.selectList.length; i++) {
        deleteStr += this.selectList[i].id + ','
      }
      deleteStr = deleteStr.substring(0, deleteStr.length - 1)
      deletesysLeddevice(deleteStr).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
          this.drawer = false
          this.queryTable()
        } else {
          this.$message.error(res.data.message || '删除失败')
        }
      })
    },
    closeLocalUpdate() {
      if (this.selectList.length < 0) {
        this.$message.error('请选择一行或多行')
        return
      }
      removeLocalUpdate(this.selectList).then(res => {
        if (res.data.code === 20000) {
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    sendPlayList() {
      if (this.selectList.length <= 0) {
        this.$message.error('请选择一行或多行')
        return
      }
      this.playListDrawer = true
    },
    sendLocalUpdate() {
      if (this.selectList.length < 1) {
        this.$message.error('请选择一行或多行')
        return
      }
      this.subtitleDrawer = true
    },
    playsetTime() {
      if (this.selectList.length != 1) {
        this.$message.error('请选择一行或多行')
        return
      }
      getplayList(this.selectList[0]).then(res => {

      })
    },
    titleSubmit() {
      this.$refs.form.validate(v => {
        if (v) {
          var req = {
            materialStatus: this.subtitleObj,
            devices: this.selectList
          }
          sendLocal(req).then(res => {
            if (res.data.code == 20000) {
              this.$message.success(res.data.message)
              this.subtitleDrawer = false
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    confirmSend(row) {
      var req = {
        createId: Vue.getAcloudProvider().getUserInfo().id,
        playListId: row.fId,
        content: row.fContent,
        list: this.selectList
      }
      remoteSend(req).then(res => {
        if (res.data.code == 20000) {
          this.playListDrawer = false
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
          this.playListDrawer = false
        }
      })
    },
    confirmSave() {
      this.$refs.addform.validate(v => {
        if (v) {
          if (this.excuteStatus === 'add') {
            this.sysLeddevice.createId = Vue.getAcloudProvider().getUserInfo().id
            addsysLeddevice(this.sysLeddevice).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '添加失败')
              }
            })
          } else if (this.excuteStatus === 'update') {
            updatesysLeddevice(this.sysLeddevice).then(res => {
              if (res.data.code === 20000) {
                this.$message.success(res.data.message)
                this.drawer = false
                this.queryTable()
              } else {
                this.$message.error(res.data.message || '修改失败')
              }
            })
          }
        }
      })
    },
    reset() {
      this.tableData.params.searchName = ''
      this.tableData.params.currentPage = 1
      this.tableData.params.pageSize = 10
      this.queryTable()
    },
    // 表格颜色
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
    handleClose(done) {
      this.$confirm('确认关闭？').then(_ => {
        done()
      }).catch(_ => {})
    },
    selsChange(val) {
      this.selectList = val
    },
    changeCellStyle(row, columnIndex) {
      if (row.columnIndex === 1) {
        return 'color: #009578;text-decoration: underline'
      }
    },
    indexMethod(index) {
      return this.xuhao + index + 1
    },
    indexMethod1(index) {
      return this.xuhao1 + index + 1
    },
    handleSizeChange(val) {
      this.tableData.params.pageSize = val
      this.tableData.currentPage = 1
      this.queryTable()
    },
    handleCurrentChange(val) {
      this.pagtation.currentPage = val
      this.queryTable()
    },
    handleSizeChange1(val) {
      this.playListData.params.pageSize = val
      this.playListData.currentPage = 1
      this.queryPlayList()
    },
    handleCurrentChange1(val) {
      this.playListData.currentPage = val
      this.queryPlayList()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-drawer{
overflow:auto
}
</style>
