// / <reference path="../../PlugIn/zTree_v3/js/jquery.ztree.core.min.js" />
// / <reference path="Com.js" />
// / <reference path="../../PlugIn/vue-dev/dist/vue.min.js" />
// / <reference path="../../PlugIn/zTree_v3/js/jquery.ztree.core.min.js" />

// 加载配置文件

// https://www.cnblogs.com/HCJJ/p/6611669.html
require.config({
  baseUrl: '/Res/JS/',
  paths: {
    async: '/Res/JS/requirejs-plugins-master/src/async', // 异步加载js
    'jquery': 'jquery-3.3.1.min', // jquery插件
    'ztree': '/Res/PlugIn/zTree_v3/js/jquery.ztree.core', // ztree插件
    'bootstrap': '/Res/PlugIn/bootstrap-3.3.7-dist/js/bootstrap.min', // bootstrap
    'BMap': 'http://api.map.baidu.com/api?v=3.0&ak=S33s77ZdR0qbbUwmv62GMGaSUbnuG4FG', // 百度地图js
    // , "BMap": "http://api.map.baidu.com/api?v=2.0&ak=CRQGMBZMzkD2TGweORtp5FxDRIXDHM9O"
    'noUiSlider': '/Res/PlugIn/noUiSlider/distribute/nouislider.min', // 滑块插件
    'bsSuggest': '../../Res/PlugIn/bootstrap-suggest/src/bootstrap-suggest', // 下拉搜索插件
    'Com': 'Visual/Com', // 可视化 公用库
    'common': '/Res/JS/common',
    'layer': '/Res/PlugIn/layer/layer/layer',
    'Led': 'Visual/Led',
    'Video': 'Visual/Video',
    'Wifi': 'Visual/Wifi',
    'Milieu': 'Visual/Milieu',
    'OneKey': 'Visual/OneKey',
    'WellLid': 'Visual/WellLid',
    'Broadcast': 'Visual/Broadcast',
    'FaceRecognition': 'Visual/FaceRecognition'
    // , "ezuikit": "https://open.ys7.com/sdk/js/1.4/ezuikit.js"
    // , 'videojs': '/Res/PlugIn/videojs/dist/video.min'
    //, "Visual": "Visual"
  },
  shim: {
    'BMap': { exports: 'BMap' },
    'bootstrap': ['jquery'],
    'bsSuggest': ['jquery'],
    'noUiSlider': ['jquery'],
    'common': ['jquery'],
    'layer': ['jquery']
    //, "ezuikit": { exports: 'ezuikit' }
    //, 'Vue': ['Vue']
  }
})

define(['jquery', 'bootstrap', 'bsSuggest', 'Com', 'common', 'layer', 'Led', 'Video', 'Wifi', 'Milieu', 'OneKey', 'WellLid', 'Broadcast', 'FaceRecognition', 'ztree', 'async!BMap'], function($, bootstrap, bsSuggest, Com, common, layer, Led, Video, Wifi, Milieu, OneKey, WellLid, Broadcast, FaceRecognition, ztree) {
  // 全局变量
  var mainClass = {
    // 默认地图 经度
    Longitude: 116.404,
    // 默认地图 纬度
    Latitude: 39.915,
    // 地图缩放级别
    Zoom: 15,
    // 地图样式
    Style: 'dark',
    // 当前拥有的项目
    ProjectList: null,
    // 默认项目ID
    defProjectID: null,
    // 用户灯杆
    UserLampPoleData: null,
    // 点击灯杆，地图灯杆数据
    lampData: null,
    // 点击灯杆，地图数据
    thisMarkerData: null,

    video_apen_width: null,
    video_apen_height: null,
    // 当前默认选中的模块,默认照明
    ModularType: 'zm',
    API: {
      ip: '',
      port: '',
      account: '',
      password: ''
    }

  }

  var markerMap = new Map() // 存放灯杆marker
  var lampPoleMap = new Map() // 存放灯杆开关状态
  var map_icon_interval // 地图灯杆定时器
  var map = new BMap.Map('container') // 创建地图实例

  // 加载公用库
  var commonjs = require('Com')
  var Ledjs = require('Led')
  var Videojs = require('Video')
  var Wifijs = require('Wifi')
  var Milieujs = require('Milieu')
  var OneKeyjs = require('OneKey')
  var WellLidjs = require('WellLid')
  var Broadcastjs = require('Broadcast')
  var FaceRecognitionjs = require('FaceRecognition')

  $(function() {
    // Load_LampPole(ids);

    // 更新全局变量数据  默认定位到用户设置的经度纬度
    if (commonjs.CommonClass.UserInfo != null) {
      // 初始化经度
      mainClass.Longitude = commonjs.CommonClass.UserInfo.F_Longitude
      // 初始化纬度
      mainClass.Latitude = commonjs.CommonClass.UserInfo.F_Latitude
      // 初始化缩放级别
      mainClass.Zoom = commonjs.CommonClass.UserInfo.F_centerAndZoom
      // 初始化默认项目id
      mainClass.defProjectID = commonjs.CommonClass.UserInfo.F_ProjectID
    }

    // 加载地图相关配置信息
    Load_MapPoin()

    // console.log("commonjs-", commonjs.CommonClass.ListDeviceNum);
    // 加载设备相关信息
    Load_ListDeviceNum()

    // 初始化项目控件
    Load_ProjectList()

    // 加载灯杆data
    // load_LampPoleMap();
    Load_LampPole()

    // 加载灯杆（公用库已默认加载用户设置的默认灯杆data）
    Load_LampPoleMap()

    // //事件
    // $("#action-center-module .action-object-back").click(function () {
    //    var pval = $(this).attr("pval");
    //    console.log(pval);
    // })

    // $("#action-center-module .action-object-back").click(function () {
    //    var pval = $(this).attr("pval");
    //    console.log(pval);
    // })

    // 灯杆模块点击事件
    $('#action-center-module .action-object-back').on({
      click: function() {
        var clickthis = $(this)
        var pval = clickthis.attr('pval')
        var pbool = clickthis.attr('pbool')

        // 图标样式切换
        $('.action-object-back').attr('pbool', '0')
        clickthis.attr('pbool', '1')
        $('.action-object-back').each(function() {
          var suval = $(this).attr('pval')
          if ($(this).attr('pbool') == '1') {
            $(this).css({ 'background': "url('/Res/img/action/click-" + suval + ".png') no-repeat" })
          } else {
            $(this).css({ 'background': "url('/Res/img/action/state-" + suval + ".png') no-repeat" })
          }
        })

        $('.action-Div-com').hide()
        $('.action-Div-' + pval + '').slideToggle('slow')

        switch (pval) {
          case 'zm':
            Load_getStation(mainClass.lampData.StationID)
            break
          case 'led':
            Ledjs.Load_LedInfo(mainClass.lampData.LedID)
            break
          case 'jk':
            Videojs.Load_Video(mainClass.lampData.VideoID)
            break
          case 'wifi':
            Wifijs.Load_Wifiinfo(mainClass.lampData.WifiID)
            break
          case 'hjjc':
            Milieujs.Load_MilieuInfo(mainClass.lampData.LedID)
            break
          case 'yjhj':
            OneKeyjs.Load_OnkeyInfo(mainClass.lampData.OneKeyID)
            break
          case 'jg':
            WellLidjs.Load_JGInfo(mainClass.lampData.WellLidID)
            break
          case 'gb':
            Broadcastjs.Load_BoradcastInfo(mainClass.lampData.BroadID, commonjs.CommonClass.UserInfo.F_ip, commonjs.CommonClass.UserInfo.F_port, commonjs.CommonClass.UserInfo.account, commonjs.CommonClass.UserInfo.password)
            break
          case 'rlsb':
            FaceRecognitionjs.Load_FaceRecognitionInfo(mainClass.lampData.FaceID)
            break
        }

        mainClass.ModularType = pval
      },
      mouseenter: function() { // 进入
        var pval = $(this).attr('pval')
        var pbool = $(this).attr('pbool')
        if (pbool == '0') {
          $(this).css({ 'background': "url('/Res/img/action/hover-" + pval + ".png') no-repeat" })
        }
        // console.log("进入", pval, pbool);
      },
      mouseleave: function() { // 离开
        var pval = $(this).attr('pval')
        var pbool = $(this).attr('pbool')
        if (pbool == '0') {
          $(this).css({ 'background': "url('/Res/img/action/state-" + pval + ".png') no-repeat" })
        }
        // console.log("离开", pval, pbool);
      }
    })
  })

  // 获取照明调光轮滑的值
  singleSlider = document.getElementById('action-slider')
  singleSlider.noUiSlider.on('update', function(values, handle, val) {
    values = values[handle]
    var _volume = Math.ceil(values)
    // if (_volume >= 1) {

    // }
  })

  // 获取广播音量轮滑的值
  singleSliderGbVolume = document.getElementById('action-gb-volume-slider')
  singleSliderGbVolume.noUiSlider.on('update', function(values, handle, val) {
    values = values[handle]
    var _volume = Math.ceil(values)
    if (_volume >= 1) {
      Broadcastjs.set_broadcast_volume(_volume)
    }
  })

  // 获取LED调光轮滑的值
  singleSliderLedlight = document.getElementById('action-led-light-slider')
  singleSliderLedlight.noUiSlider.on('update', function(values, handle, val) {
    values = values[handle]
    mainClass.light = Math.ceil(values)
    if (mainClass.light >= 1) {
      Ledjs.set_luminance(mainClass.light)
    }
  })

  // 获取LED调音轮滑的值
  singleSliderLedVolume = document.getElementById('action-led-volume-slider')
  singleSliderLedVolume.noUiSlider.on('update', function(values, handle, val) {
    values = values[handle]
    mainClass.volume = Math.ceil(values)
    if (mainClass.light >= 1) {
      Ledjs.set_volume(mainClass.volume)
    }
  })

  // 第一步 加载当前用户拥有的项目集合data
  function Load_ProjectList() {
    // console.log("commonjs", commonjs);
    $('#action-ProjectIDs').bsSuggest('init', {
      data: commonjs.CommonClass.ProjectListData,
      idField: 'F_ID',
      keyField: 'F_Name',
      effectiveFields: ['F_Name', 'F_Remark'], // 有效显示于列表中的字段，非有效字段都会过滤，默认全部有效。 , "F_CreateTime", "F_CreateID"
      effectiveFieldsAlias: { 'F_Name': '项目名称', 'F_Remark': '备注' } // 有效字段的别名对象，用于 header 的显示
      // , "F_CreateTime": "创建时间", "F_CreateID": "创建人",
      // listHoverStyle: 'background: #02d0d0; color:#fff', // 提示框列表鼠标悬浮的样式
    }).on('onDataRequestSuccess', function(e, result) {
      console.log('onDataRequestSuccess: ', result)
    }).on('onSetSelectValue', function(e, keyword, data) {
      // console.log("onSetSelectValue", data)
      // videoPause();

      $('#action-center-open').hide()
      $('.action-Div-com').hide()

      // 图标样式切换
      $('.action-object-back').attr('pbool', '0')
      $('.action-object-back').each(function() {
        var suval = $(this).attr('pval')
        $(this).css({ 'background': "url('/Res/img/action/state-" + suval + ".png') no-repeat" })
      })

      $('#faceinfo_div').html('')
      // 更新经度纬度
      mainClass.Longitude = data.F_Longitude
      mainClass.Latitude = data.F_Latitude
      mainClass.Zoom = commonjs.CommonClass.UserInfo.F_centerAndZoom
      // 更改项目切换的同时  修改默认id值，（定时器调用）
      mainClass.defProjectID = data.F_ID
      Load_MapPoin()
      Load_LampPole()
      Load_LampPoleMap()// 加载灯杆

      // 加载设备信息
      Com_Load(data.F_ID)
      // console.log(data);
      $('#action-ProjectIDs-select').hide()
      $('#action-ProjectIDs-text').empty().text(data.F_Name)
    })
  }

  // 第二步 加载用户项目下的灯杆list
  // 默认加载：用户下面的默认项目灯杆
  function Load_LampPole() {
    // console.log("_ids", _ids);
    $.ajax({
      url: '/Statistics/StatisticsView/QueryLampByProject',
      type: 'post',
      dataType: 'json',
      async: false,
      data: { projectID: mainClass.defProjectID },
      success: function(obj) {
        //  console.log("Load_LampPole", obj)
        if (obj.code == 0 && obj.data.length > 0) {
          mainClass.UserLampPoleData = obj.data
        }
      },
      error: function() {
        toastr.error('出错了，请检查或联系管理员！')
      }
    })
  }

  // 第三步 加载灯杆 icon
  function Load_LampPoleMap() {
    // 清除图层覆盖物
    map.clearOverlays()
    // 清除定时器
    if (map_icon_interval != null) {
      clearInterval(map_icon_interval)
    }
    // 清空map
    markerMap.clear()
    lampPoleMap.clear()

    var lamp = mainClass.UserLampPoleData

    if (lamp == null) {
      return '请先给当前用户配置一个默认项目'
    }
    // 循环建立标注点
    for (var i = 0; i < lamp.length; i++) {
      var point = new BMap.Point(lamp[i].F_Longitude, lamp[i].F_Latitude) // 将标注点转化成地图上的点

      var gif = ''
      var state = false
      if (lamp[i].DtuOnLine == false) {
        gif = '/Res/img/close.png'
        state = false
      } else {
        if (lamp[i].State1.indexOf('1') != -1) {
          gif = '/Res/img/open.png'
          state = true
        } else {
          gif = '/Res/img/close.png'
          state = false
        }
      }

      var lampIcon = new BMap.Icon(gif, new BMap.Size(75, 127))
      var marker = new BMap.Marker(point, { icon: lampIcon, title: lamp[i].F_Name })
      map.addOverlay(marker) // 将标注点添加到地图上

      // 记录当前灯杆开关状态 (key：灯杆ID+站点ID)
      lampPoleMap.set(lamp[i].F_ID + '_' + lamp[i].StationID, state)
      // 保存maker
      markerMap.set(lamp[i].F_ID + '_' + lamp[i].StationID, marker);

      // 添加监听事件
      (function() {
        var thePoint = lamp[i]
        marker.addEventListener('click',
          function() {
            click_LampPoleInfo(this, thePoint)
          })
      })()
    }

    // 如果地图上有灯杆 开启定时器
    if (markerMap.size > 0) {
      map_icon_interval = setInterval(SetCtrIcon, 5000)
      map_icon_interval = setInterval(SetCtrImg, 8000)
      // SetCtrImg();
    }
  }

  // 最左边 加载公共设备信息
  function Load_ListDeviceNum() {
    if (commonjs.CommonClass.ListDeviceNum != null) {
      var _data = commonjs.CommonClass.ListDeviceNum
      // console.log(_data.Lighting);

      $('#count_Lighting').text(_data.Lighting)
      $('#count_Led').text(_data.Led)
      $('#count_Video').text(_data.Video)
      $('#count_Wifi').text(_data.Wifi)
      $('#count_Environment').text(_data.Environment)
      $('#count_Help').text(_data.Help)
      $('#count_Broadcast').text(_data.Broadcast)
      $('#count_WellLidDevice').text(_data.WellLidDevice)
    }
  }

  // 定时刷新灯杆图标
  function SetCtrIcon() {
    //  console.log(mainClass.defProjectID);
    if (markerMap != null && markerMap.size > 0) {
      $.ajax({
        url: '/Statistics/StatisticsView/QueryLampStateByProject',
        type: 'post',
        dataType: 'json',
        data: { projectID: mainClass.defProjectID },
        success: function(obj) {
          if (obj.code == 0 && obj.data.length > 0) {
            var gif = ''
            // 判断本次刷新是否有灯杆有变化
            var now_lamp_change = false

            for (var i = 0; i < obj.data.length; i++) {
              var status = false
              if (obj.data[i].DtuOnLine == false) {
                gif = '/Res/img/close.png'
                status = false
              } else {
                if (obj.data[i].State1.indexOf('1') != -1) {
                  gif = '/Res/img/open.png'
                  status = true
                } else {
                  gif = '/Res/img/close.png'
                  status = false
                }
              }
              // 图标
              var LightIcon = new BMap.Icon(gif, new BMap.Size(75, 127))
              // 更新灯杆图标（只有灯杆状态改变才会更换图标）
              if (markerMap != null) {
                markerMap.forEach(function(value, key, map) {
                  // 当前灯杆
                  if (key != null && key != null && key.indexOf(obj.data[i].StationID) != -1) {
                    if ((status == true && lampPoleMap.get(key) == false) || (status == false && lampPoleMap.get(key) == true)) {
                      // console.log(map[0] + "  图片改变啦...");
                      lampPoleMap.set(key, status)
                      value.setIcon(LightIcon)
                      if (status) {
                        station_open++
                        station_close--
                      } else {
                        station_open--
                        station_close++
                      }
                      now_lamp_change = true
                    }
                  }
                })
              }
            }

            // 如果灯杆状态有变化 则更新照明统计
            // if (now_lamp_change) {
            //    // 更新照明统计
            //    load_lightView();
            // }
          }
        }
      })
    }
  }

  // var deviceId = "";
  var lastDivId = ''
  var startTime = ''
  var faceInfoIndex = new Array()
  var faceInfoIndexMax = 10 // 最多显示多少图片
  var faceInfo_setTime

  // 定时刷新人脸识别信息
  function SetCtrImg() {
    for (var i = 0; i < mainClass.UserLampPoleData.length; i++) {
      if (mainClass.UserLampPoleData[i].FaceID != '' && mainClass.UserLampPoleData[i].FaceID != undefined) {
        $.ajax({
          url: '/Face/FaceInfo/QueryFaceInfoByTime',
          type: 'POST',
          data: { deviceId: mainClass.UserLampPoleData[i].FaceID, startTime: startTime },
          dataType: 'json',
          async: false,
          success: function(obj) {
            if (obj.code == 0 && obj.data != null && obj.data.length > 0) {
              startTime = obj.msg
              for (var i = 0; i < obj.data.length; i++) {
                faceInfoIndex[faceInfoIndex.length] = obj.data[i].F_ID

                var pifu = ''
                if (obj.data[i].Race == 1) {
                  pifu = '黄种人'
                } else if (obj.data[i].Race == 2) {
                  pifu = '黑种人'
                } else if (obj.data[i].Race == 3) {
                  pifu = '白种人'
                }
                var html = ''
                html += '<div id="' + obj.data[i].F_ID + '" style="float:left;width:10%;height:33%;display: -webkit-flex; display: flex;flex-direction:column;align-items:center;justify-content:flex-start">'
                html += '<img src="' + obj.data[i].img + '" style="width:120px;height:120px;display:flex;  max-width: 80%;margin-top: 5px;border-radius: 50%;" />'

                html += '<font style="font-size:13px;color:#5FB878;height:18px;">性别：' + (obj.data[i].Gender == 1 ? '男' : '女') + ' &nbsp;&nbsp;年龄：' + obj.data[i].Age + '</font>'
                html += '<span style="font-size:13px;color:#5FB878;height:18px;">戴眼镜：' + (obj.data[i].Glasses == 0 ? '否' : '是') + ' &nbsp;&nbsp;皮肤：' + pifu + '</span>'
                html += '<span style="font-size:13px;color:#5FB878;height:18px;">人脸质量：' + obj.data[i].FaceQuality + '</span>'
                html += '<span style="font-size:13px;color:#5FB878;height:18px;">' + obj.data[i].CaptureTime + '</span>'
                // if (obj.data[i].WBMode == 1) {
                //    html += '<span style="font-size:13px;color:#FFB6C1;">【黑名单，' + obj.data[i].VisitCount + '次】</span>';
                //    html += '<span style="font-size:13px;color:#FFB6C1;">相似度：' + (obj.data[i].CompareResult * 100).toFixed(2) + '%</span>';
                // } else if (obj.data[i].WBMode == 2) {
                //    html += '<span style="font-size:13px;color:#AFEEEE;">【白名单，' + obj.data[i].VisitCount + '次】</span>';
                //    html += '<span style="font-size:13px;color:#FFB6C1;">相似度：' + (obj.data[i].CompareResult * 100).toFixed(2) + '%</span>';
                // } if (obj.data[i].WBMode == 3) {
                //    html += '<span style="font-size:13px;color:#FFFFE0;">【VIP名单，' + obj.data[i].VisitCount + '次】</span>';
                //    html += '<span style="font-size:13px;color:#FFB6C1;">相似度：' + (obj.data[i].CompareResult * 100).toFixed(2) + '%</span>';
                // }
                html += '</div>'
                if (lastDivId != '') {
                  $('#' + lastDivId).before(html)
                } else {
                  $('#faceinfo_div').html(html)
                }

                lastDivId = obj.data[i].F_ID

                // 判断是否大于设定的最大长度
                if (faceInfoIndex.length > faceInfoIndexMax) {
                  var tempArr = new Array()
                  var tempIndex = 0
                  for (var j = 0; j < faceInfoIndex.length; j++) {
                    // 删除超出的
                    if (j < (faceInfoIndex.length - faceInfoIndexMax)) {
                      $('#' + faceInfoIndex[j]).remove()

                      // 没超出的保存到缓存
                    } else {
                      tempArr[tempIndex] = faceInfoIndex[j]
                      tempIndex++
                    }
                  }
                  // 更新数组
                  faceInfoIndex = tempArr
                }
              }
            }
            // faceInfo_setTime = setTimeout(queryFaceInfoByTime, 2000);
          }
        })
      }
    }
  }

  // 加载设备信息
  // function Load_ListDeviceNum() { }

  // 切换地图显示位置
  // 返回 point
  function Load_MapPoin() {
    var point = new BMap.Point(mainClass.Longitude, mainClass.Latitude) // 创建点坐标
    map.centerAndZoom(point, mainClass.Zoom) // 初始化地图，设置中心点坐标和地图级别
    // map.setMapStyle({ style: mainClass.Style }); //配置风格
    //  map.setMapStyle({ style: commonjs.CommonClass.UserInfo.F_MapColor }); //配置风格

    map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
  }

  // 刷新时，公用加载方法
  // id 项目id
  function Com_Load(_id) {
    commonjs.Load_ListDeviceNum(_id)

    // 加载设备信息
    Load_ListDeviceNum()
    // vueapp._data.count_Lighting = 1212;

    // console.log("vueapp ", vueapp)
  }

  /*
   操作交互
  */
  // 灯杆点击
  function click_LampPoleInfo(thisMarker, lamp) {
    // btnclick(lamp);
    $('#action-center-open').slideToggle('slow')
    mainClass.lampData = lamp
    mainClass.thisMarkerData = thisMarker
    // console.log("click_LampPoleInfo", lamp)
    // 加载 照明详细信息
    $('#LampPoleInfo-Div-Name').empty().text(thisMarker.K.title)

    // switch (mainClass.ModularType) {
    //    case "zm":
    //        Load_getStation(lamp.StationID);
    //        break;
    //    case "":
    //        Load_getVideo(lamp.VideoID)
    //        break;
    //    default:

    // }

    //  alert(1);
  }

  // 关闭 操作弹框
  $('#action-center-close').click(function() {
    // alert(1212);
    $('#action-center-open').slideToggle()
  })

  /*

  数据查询

  */

  //
  /* 网关 第一步
  name:查询网关信息
  _id：网关ID
  */
  function Load_getStation(_id) {
    console.log('Station', _id)
    $.ajax({
      url: '/Visual/Action/Map_QuerySingleStation',
      type: 'post',
      dataType: 'json',
      data: { AutoId: _id },
      success: function(obj) {
        // console.log(obj);

        if (obj.code == 0 && obj.data.length > 0) {
          //  console.log(obj.data[0].UName);

          var DtuOnLine = obj.data[0].DtuOnLine
          var Rtutop = obj.data[0].Rtutop
          var State1 = obj.data[0].State1

          // 回路状态
          var loopsStr = State1
          var loopIcon = '&nbsp;'
          if (loopsStr != null) {
            loopsStr = loopsStr.substring(0, loopsStr.length - 1)
            var arr = loopsStr.split(',')
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] == 1) {
                loopIcon += "<img style='' src='/Res/img/station/open.png'>"
                if (i == 3) {
                  loopIcon += '&nbsp;&nbsp;'
                }
              }
              if (arr[i] == 0) {
                loopIcon += "<img style='' src='/Res/img/station/close.png'>"
                if (i == 3) {
                  loopIcon += '&nbsp;&nbsp;'
                }
              }
            }
          }

          // 在线离线
          if (DtuOnLine == 'true' || DtuOnLine == true) {
            DtuOnLine = '<img src="/Res/img/station/open.png" />'
          } else {
            DtuOnLine = '<img src="/Res/img/station/off-line.png" />'
          }

          // 站点状态
          var rtustateStr = ''
          if (Rtutop == 'AA') {
            rtustateStr = '<label style="color:#FF5722;">&nbsp;停用&nbsp;</label>'
            //  class="layui-btn layui-btn-sm layui-btn-radius layui-btn-danger"
          } else if (Rtutop == '00') {
            rtustateStr = '<label style="color:#009688;">&nbsp;启用&nbsp;</label>'
          } else {
            rtustateStr = '<label style="color:#FFB80;">&nbsp;未知&nbsp;</label>'
          }
          $('#Lighting-UName').empty().text(obj.data[0].UName)
          $('#Lighting-DtuOnLine').empty().html(DtuOnLine)
          $('#Lighting-State1').empty().html(loopIcon)
          $('#Lighting-RtuState').empty().html(rtustateStr)
          // var OnLineDate = rtcommon.FormatDateTime({ val: obj.data[0].OnLineDate, fmt: 'MM-dd hh:mm' });
          $('#Lighting-LinkDate').empty().text(com_JsonToTime(obj.data[0].OnLineDate))
          $('#Lighting-Comment').empty().text(obj.data[0].Comment)
          $('#Lighting-Address').empty().text(obj.data[0].Address)
          $('#Lighting-ElectricCurrentA').empty().text(obj.data[0].ElectricCurrentA)
          $('#Lighting-ElectricCurrentB').empty().text(obj.data[0].ElectricCurrentB)
          $('#Lighting-ElectricCurrentC').empty().text(obj.data[0].ElectricCurrentC)
          $('#Lighting-VoltageA').empty().text(obj.data[0].VoltageA)
          $('#Lighting-VoltageB').empty().text(obj.data[0].VoltageB)
          $('#Lighting-VoltageC').empty().text(obj.data[0].VoltageC)

          var LoopInfo = obj.data[0].LoopInfo
          if (LoopInfo != '' && LoopInfo != null && LoopInfo != undefined) {
            var looplen1 = LoopInfo.split(',')
            if (looplen1.length > 0) {
              var strHtml = ''
              for (var i = 0; i < (looplen1.length - 1); i++) {
                // console.log("looplen1[i]", looplen1[i]);
                var looplen2 = looplen1[i].split('-')
                strHtml = strHtml + '<label class="checkbox-inline"> <input type="checkbox" style="" pid="' + looplen2[0] + '" pval="' + looplen2[1] + '" checked> ' + looplen2[1] + ' </label>'
              }
              $('#Lighting-Div-Loop').empty().append(strHtml)
            }
          }

          // 获取照明调光轮滑的值
          singleSlider = document.getElementById('action-slider')
          singleSlider.noUiSlider.set()

          action_Lighting_Event(_id, obj.data[0].UCode)
          click_ABCMap(_id)
        } else {
          var myChart = echarts.init(document.getElementById('his-zm-view'))
          myChart.clear()
          $('#Lighting-UName').empty().text('')
          $('#Lighting-DtuOnLine').empty().html('')
          $('#Lighting-State1').empty().html('')
          $('#Lighting-RtuState').empty().html('')
          $('#Lighting-LinkDate').empty().text('')
          $('#Lighting-Comment').empty().text('')
          $('#Lighting-Address').empty().text('')
          $('#Lighting-ElectricCurrentA').empty().text('')
          $('#Lighting-ElectricCurrentB').empty().text('')
          $('#Lighting-ElectricCurrentC').empty().text('')
          $('#Lighting-VoltageA').empty().text('')
          $('#Lighting-VoltageB').empty().text('')
          $('#Lighting-VoltageC').empty().text('')
          $('#Lighting-Div-Loop').empty().append('')
          layer.msg('请配置站点!', { icon: 5, time: 1000 })
        }
      }
    })
  }

  /*
  name:查询视频信息
  */
  function Load_getVideo(_id) {
    console.log('video', _id)
  }

  // 事件

  /* 网关 第二步
  name:根据网关信息 查询出来回路信息 绑定开关灯操作
  defLightingID:网关ID
  defLightingCode：网关编号
  */
  function action_Lighting_Event(defLightingID, defLightingCode) {
    // 加载事件
    $('.Lighting-Div-Input input').click(function() {
      var LoopSort = ''

      $.each($('#Lighting-Div-Loop input'), function(i, o) {
        if ($(this).prop('checked')) {
          LoopSort = LoopSort + $(this).attr('pid') + '-true' + '-' + $(this).attr('pval') + ','
        } else {
          LoopSort = LoopSort + $(this).attr('pid') + '-false' + '-' + $(this).attr('pval') + ','
        }
        //
      })
      LoopSort = LoopSort.substring(0, LoopSort.length - 1)
      console.log(LoopSort)
      // LoopSort: "1-true-第1回路,2-true-第2回路,3-true-第3回路,4-true-第4回路"
      var model = { AutoId: defLightingID, LoopSort: LoopSort, UCode: defLightingCode }
      var pid = $(this).attr('pid')
      var TaskName = 'map可视化' + com_getDateInt()
      console.log(TaskName)

      action_Lighting_onoff(model, pid, TaskName)
    })
  }

  // 数据操作

  /* 照明
  name:开.关.读. 操作方法
  model：站点对象
  ExecAction:执行动作
  TaskName:任务名称
  */
  function action_Lighting_onoff(model, ExecAction, TaskName) {
    console.log('model', model)
    $.ajax({
      url: '/Light/ArcCtmOnOffTimeNew/Add',
      type: 'POST',
      data: { model: [model], ExecAction: ExecAction, TaskName: TaskName },
      datatype: 'json',
      success: function(obj) {
        console.log(obj)
        if (obj.code === '1') {
          layer.msg('指令已发送', { icon: 6, shade: [0.6] })
        } else {
          layer.msg('指令发送失败：' + obj.msg + '', { icon: 6, shade: [0.6] })
        }
      }
    })
  }

  // 加载模块图标
  function btnclick(lamp) {
    $('#events_zm').css('pointer-events', 'none')
    $('#events_led').css('pointer-events', 'none')
    $('#events_jk').css('pointer-events', 'none')
    $('#events_wifi').css('pointer-events', 'none')
    $('#events_hjjc').css('pointer-events', 'none')
    $('#events_yjhj').css('pointer-events', 'none')
    $('#events_gb').css('pointer-events', 'none')
    $('#events_jg').css('pointer-events', 'none')
    $('#events_rlsb').css('pointer-events', 'none')
    // $('#events_zm').show();
    // $('#events_led').show();
    // $('#events_jk').show();
    // $('#events_wifi').show();
    // $('#events_hjjc').show();
    // $('#events_yjhj').show();
    // $('#events_gb').show();
    // $('#events_jg').show();
    // $('#events_rlsb').show();
    $.ajax({
      url: '/Visualization/MainPage/LampMenuInfo',
      type: 'post',
      dataType: 'json',
      data: { id: lamp.F_ID },
      success: function(obj) {
        if (obj.code == 0) {
          for (var i = 0; i < obj.data.length; i++) {
            if (obj.data[i].F_Name == '智慧照明') {
              $('#events_zm').css('pointer-events', 'visible')
              // $('#events_zm').show();
            } else if (obj.data[i].F_Name == '显示屏') {
              $('#events_led').css('pointer-events', 'visible')
              // $('#events_led').show();
            } else if (obj.data[i].F_Name == '视频监控') {
              $('#events_jk').css('pointer-events', 'visible')
              // $('#events_jk').show();
            } else if (obj.data[i].F_Name == 'WIFI') {
              $('#events_wifi').css('pointer-events', 'visible')
              // $('#events_wifi').show();
            } else if (obj.data[i].F_Name == '环境监测') {
              $('#events_hjjc').css('pointer-events', 'visible')
              // $('#events_hjjc').show();
            } else if (obj.data[i].F_Name == '一键呼叫') {
              $('#events_yjhj').css('pointer-events', 'visible')
              // $('#events_yjhj').show();
            } else if (obj.data[i].F_Name == '广播管理') {
              $('#events_gb').css('pointer-events', 'visible')
              // $('#events_gb').show();
            } else if (obj.data[i].F_Name == '井盖管理') {
              $('#events_jg').css('pointer-events', 'visible')
              // $('#events_jg').show();
            } else if (obj.data[i].F_Name == '人脸识别') {
              $('#events_rlsb').css('pointer-events', 'visible')
              // $('#events_rlsb').show();
            }
          }
        }
      },
      error: function() {
        toastr.error('出错了，请检查或联系管理员！')
        classAction.object.map.centerAndZoom('上海', 11)
      }
    })
  }

  // 当天
  var Date1 = new Date()
  // 前一天
  var Date2 = new Date(Date1.getTime() - 24 * 60 * 60 * 1000)
  // 前两天
  var Date3 = new Date(Date1.getTime() - 48 * 60 * 60 * 1000)
  // 前三天
  var Date4 = new Date(Date1.getTime() - 72 * 60 * 60 * 1000)
  // 前四天
  var Date5 = new Date(Date1.getTime() - 96 * 60 * 60 * 1000)
  // 前五天
  var Date6 = new Date(Date1.getTime() - 120 * 60 * 60 * 1000)
  // 前六天
  var Date7 = new Date(Date1.getTime() - 144 * 60 * 60 * 1000)

  // 平均电压图形展示
  function click_ABCMap(auid) {
    var dataTime = [formatDate(Date1), formatDate(Date2), formatDate(Date3), formatDate(Date4), formatDate(Date5), formatDate(Date6), formatDate(Date7)]
    var dianliuA = new Array()
    var dianliuB = new Array()
    var dianliuC = new Array()
    var dianyaA = new Array()
    var dianyaB = new Array()
    var dianyaC = new Array()

    $.ajax({
      url: '/Visual/Action/tb_LampStationACBInfo',
      type: 'post',
      dataType: 'json',
      data: { AutoId: auid },
      success: function(obj) {
        if (obj.code == 0) {
          for (var i = 0; i < obj.data.length; i++) {
            // dataTime[i] = obj.data[i].CrtTime;
            dianliuA[i] = obj.data[i].ElectricCurrentA.toFixed(2)
            dianliuB[i] = obj.data[i].ElectricCurrentB.toFixed(2)
            dianliuC[i] = obj.data[i].ElectricCurrentC.toFixed(2)
            dianyaA[i] = obj.data[i].VoltageA.toFixed(2)
            dianyaB[i] = obj.data[i].VoltageB.toFixed(2)
            dianyaC[i] = obj.data[i].VoltageC.toFixed(2)
          }
          ABC_show(dataTime, dianliuA, dianliuB, dianliuC, dianyaA, dianyaB, dianyaC)
        }
      }
    })
  }

  function ABC_show(dataTime, dianliuA, dianliuB, dianliuC, dianyaA, dianyaB, dianyaC) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('his-zm-view'))

    myChart.clear()
    option = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['电流A', '电流B', '电流C', '电压A', '电压B', '电压C'],
        textStyle: {
          color: '#FFFAFA'
        },
        top: '3%'
      },
      grid: {
        top: '25%',
        left: '8%',
        right: '8%',
        bottom: '3%',

        containLabel: true
      },
      color: ['#63B8FF', '#9AFF9A', '#FF6347', '#FFA74D', '#CDB79E', '#8B008B'],
      xAxis: {
        // name: '日期',
        type: 'category',
        boundaryGap: false,
        data: dataTime,
        splitLine: {
          show: false
        },
        axisLine: {
          lineStyle: {
            color: '#FFFAFA'
          }
        }
      },
      yAxis: {
        name: '平均值',
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#FFFAFA'
          }
        }
      },
      series: [
        {
          name: '电流A',
          type: 'line',
          data: dianliuA
        },
        {
          name: '电流B',
          type: 'line',
          data: dianliuB
        },
        {
          name: '电流C',
          type: 'line',
          data: dianliuC
        },
        {
          name: '电压A',
          type: 'line',
          data: dianyaA
        },
        {
          name: '电压B',
          type: 'line',
          data: dianyaB
        },
        {
          name: '电压C',
          type: 'line',
          data: dianyaC
        }
      ]
    }
    myChart.setOption(option)
  }

  function formatDate(dt) {
    var year = dt.getFullYear()
    var month = dt.getMonth() + 1
    var date = dt.getDate()
    var hour = dt.getHours()
    var minute = dt.getMinutes()
    var second = dt.getSeconds()
    return year + '-' + month + '-' + date
  }
})

