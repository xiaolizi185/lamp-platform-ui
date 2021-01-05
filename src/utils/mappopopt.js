// 百度地图API功能

// 如果经纬度没有给个默认值
var longitude = 121.374001
var latitude = 31.23706

var map = new BMap.Map('allmap')
map.setDefaultCursor('allmap')
map.enableScrollWheelZoom()
var point = new BMap.Point(longitude, latitude)
map.centerAndZoom(point, 13)
var gc = new BMap.Geocoder()
map.addControl(new BMap.NavigationControl())
map.addControl(new BMap.OverviewMapControl())
map.addControl(new BMap.ScaleControl())
map.addControl(new BMap.MapTypeControl())
map.addControl(new BMap.CopyrightControl())
var marker = new BMap.Marker(point)

map.addOverlay(marker)

marker.addEventListener('click', function(e) {
  document.getElementById('lonlat').value = e.point.lng
  document.getElementById('lonlat2').value = e.point.lat
})
marker.enableDragging()

marker.addEventListener('dragend', function(e) {
  gc.getLocation(e.point,
    function(rs) {
      showLocationInfo(e.point, rs)
    })
})

function showLocationInfo(pt, rs) {
  var opts = {
    width: 250,
    height: 150,
    title: '当前位置'
  }
  var addComp = rs.addressComponents
  var addr = '当前位置：' + addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber + '<br/>'
  addr += '纬度: ' + pt.lat + ', ' + '经度：' + pt.lng
  var infoWindow = new BMap.InfoWindow(addr, opts)
  marker.openInfoWindow(infoWindow)
}

map.addEventListener('click', function(e) {
  // document.getElementById("lonlat").value = e.point.lng;
  // document.getElementById("lonlat2").value = e.point.lat;
  //    $("#F_Longitude").val(e.point.lng);
  //    $("#F_Latitude").val(e.point.lat);

  var pt = e.point
  gc.getLocation(pt, function(rs) {
    // addressComponents对象可以获取到详细的地址信息
    var addComp = rs.addressComponents
    var site = addComp.province + '' + addComp.city + '' + addComp.district + '' + addComp.street + '' + addComp.streetNumber
    // 将对应的HTML元素设置值
    // $("#site").val(site);
    document.getElementById('lonlat').value = e.point.lng
    document.getElementById('lonlat2').value = e.point.lat
    document.getElementById('where').value = site

    // 站点界面使用
    $('#F_Longitude').val(e.point.lng)
    $('#F_Latitude').val(e.point.lat)
    $('#Address').val(site)

    // 分组界面使用
    $('#Long').val(e.point.lng)
    $('#Lat').val(e.point.lat)
  })
})

var traffic = new BMap.TrafficLayer()
map.addTileLayer(traffic)

function iploac(result) {
  var cityName = result.name
}

var myCity = new BMap.LocalCity()
myCity.get(iploac)

function sear(result) {
  var local = new BMap.LocalSearch(map, {
    renderOptions: {
      map: map
    }
  })
  local.search(result)
}

// function G(id) {
//    return document.getElementById(id);
// }

// // 百度地图API功能
// var map = new BMap.Map("allmap");
// map.centerAndZoom("上海", 12);

// var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
//		{
//		    "input": "suggestId"
//		, "location": map
//		});

// var point = new BMap.Point(121.374082, 31.236589);
// map.centerAndZoom(point, 15);

// ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
//    var str = "";
//    var _value = e.fromitem.value;
//    var value = "";
//    if (e.fromitem.index > -1) {
//        value = _value.province + _value.city + _value.district + _value.street + _value.business;
//    }
//    str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

//    value = "";
//    if (e.toitem.index > -1) {
//        _value = e.toitem.value;
//        value = _value.province + _value.city + _value.district + _value.street + _value.business;
//    }
//    str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
//    G("searchResultPanel").innerHTML = str;
// });

// var myValue;
// ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
//    var _value = e.item.value;
//    myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
//    G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

//    setPlace();
// });

// var marker = new BMap.Marker(point);  // 创建标注
// map.addOverlay(marker);               // 将标注添加到地图中
// marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

// //单击获取点击的经纬度
// map.addEventListener("click", function (e) {
//    var F_Longitude = e.point.lng;
//    var F_Latitude = e.point.lat;
//    $("#F_Longitude").val(F_Longitude);
//    $("#F_Latitude").val(F_Latitude);
// });

// //百度地图API功能
// map.centerAndZoom(point, 8);
// setTimeout(function () {
//    map.setZoom(14);
// }, 2000);  //2秒后放大到14级
// map.enableScrollWheelZoom(true);

// function setPlace() {
//    map.clearOverlays();    //清除地图上所有覆盖物
//    function myFun() {
//        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
//        map.centerAndZoom(pp, 18);
//        map.addOverlay(new BMap.Marker(pp));    //添加标注
//    }
//    var local = new BMap.LocalSearch(map, { //智能搜索
//        onSearchComplete: myFun
//    });
//    local.search(myValue);
// }
