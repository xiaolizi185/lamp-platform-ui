<template>
  <div class="app-container" style="margin-top: -20px">
    <el-row>
      <el-col span="6">
        <el-autocomplete
          v-model="mapLocation.address"
          :fetch-suggestions="querySearch"
          placeholder="请输入详细地址"
          style="width: 100%"
          :trigger-on-focus="false"
          @select="handleSelect"
        />
      </el-col>
      <el-col span="6"><el-input v-model="formData.address"><span slot="prepend">地址：</span></el-input></el-col>
      <el-col span="4"><el-input v-model="formData.lng" disabled><span slot="prepend">经度：</span></el-input></el-col>
      <el-col span="4"><el-input v-model="formData.lat" disabled><span slot="prepend">纬度：</span></el-input></el-col>
      <el-col span="1" gutter="2"><el-button type="primary" style="margin-left: 10px;height: 34px" @click="mapselected()">确定</el-button></el-col>
    </el-row>
    <div style="margin-top: 10px">
      <baidu-map class="bm-view" :center="mapCenter" :zoom="mapZoom" :scroll-wheel-zoom="true" ak="baidu-ak" @ready="handlerBMap" />
    </div>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
export default {
  name: 'BaiduMapDemo',
  components: {
    BaiduMap
  },
  props: {
    drawer: {
      type: Object,
      default: null
    },
    maplongitude: {
      type: String,
      default: null
    },
    maplatitude: {
      type: Number,
      default: null
    },
    address: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      mapZoom: 15,
      mapinfo: {},
      formData: {
        'address': '',
        'lng': '',
        'lat': ''
      },
      mapCenter: { lng: 0, lat: 0 },
      mapLocation: {
        address: undefined,
        coordinate: undefined
      }
    }
  },
  mounted() {
    this.formData.address = this.address
    this.formData.lng = this.maplongitude
    this.formData.lat = this.maplatitude
  },
  methods: {
    mapselected() {
      console.log(this.drawer + '222qq')
      this.mapinfo.address = this.formData.address
      this.mapinfo.lng = this.formData.lng
      this.mapinfo.lat = this.formData.lat
      this.$emit('saveMapInfo', this.mapinfo)
      this.drawer.innerMapDrawer.hide()
    },
    handlerBMap({ BMap, map }) {
      const t = this
      t.BMap = BMap
      t.map = map
      if (t.mapLocation.coordinate && t.mapLocation.coordinate.lng) {
        t.mapCenter.lng = t.mapLocation.coordinate.lng
        t.mapCenter.lat = t.mapLocation.coordinate.lat
        t.mapZoom = 15
        map.addOverlay(new t.BMap.Marker(t.mapLocation.coordinate))
      } else {
        if (this.maplongitude === '' || this.maplongitude === null) {
          t.mapCenter.lng = 104.07
          t.mapCenter.lat = 30.67
          t.mapZoom = 15
        } else {
          t.mapCenter.lng = this.maplongitude
          t.mapCenter.lat = this.maplatitude
          t.mapZoom = 15
        }
      }
      map.addEventListener('click', function(e) {
        var myGeo = new BMap.Geocoder()
        myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function(res) {
          var title = res.title ? res.title : ''
          t.formData.address = res.address + title
          // 经纬度
          t.formData.lng = res.point.lng
          t.formData.lat = res.point.lat
        })
      })
    },
    querySearch(queryString, cb) {
      var that = this
      var myGeo = new this.BMap.Geocoder()
      myGeo.getPoint(queryString, function(point) {
        if (point) {
          that.mapLocation.coordinate = point
          that.makerCenter(point)
        } else {
          that.mapLocation.coordinate = null
        }
      }, this.locationCity)
      var options = {
        onSearchComplete: function(results) {
          if (local.getStatus() === 0) {
            // 判断状态是否正确
            var s = []
            for (var i = 0; i < results.getCurrentNumPois(); i++) {
              var x = results.getPoi(i)
              var item = { value: x.address + x.title, point: x.point }
              s.push(item)
              cb(s)
            }
          } else {
            cb()
          }
        }
      }
      var local = new this.BMap.LocalSearch(this.map, options)
      local.search(queryString)
    },
    handleSelect(item) {
      var { point } = item
      this.mapLocation.coordinate = point
      this.makerCenter(point)
    },
    makerCenter(point) {
      if (this.map) {
        this.map.clearOverlays()
        this.map.addOverlay(new this.BMap.Marker(point))
        this.mapCenter.lng = point.lng
        this.mapCenter.lat = point.lat
        this.mapZoom = 15
      }
    }
  }
}
</script>

<style>
  .bm-view {
    width: 100%;
    height: 700px;
  }
</style>
