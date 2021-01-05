<template>
  <div class="app-container">
    <div>
      <el-button type="primary" style="background-color: #53c5a1;border-color: #53c5a1">开始选取</el-button>
      <el-button type="primary" @click="check" style="background-color: #f0bc34;border-color: #f0bc34">开始检测</el-button>
    </div>
    <canvas id="canvas" width="1000" height="500" />
  <!--  <div name="forCanvas">
      <el-row>
        <el-col :span="20">
          <canvas id="canvas" width="1000" height="1000"></canvas>
        </el-col>
        <el-col :span="4"></el-col>
      </el-row>
    </div> -->
  </div>
</template>

<script>
export default {
  components: {

  },
  filters: {

  },
  data() {
    return {
      canvas: null,
      ctx: null,
      huaban: {
        type: 'none',
        isDraw: false,
        beginX: 0,
        beginY: 0,
        imageDate: null
      },
      pointList: []
    }
  },
  computed: {

  },
  mounted() {
    this.canvasInit()
  },
  created() {

  },
  methods: {
    canvasInit() {
      /**
             * pageX: 是一个由MouseEvent接口返回的相对于整个文档的x（水平）坐标以像素为单位的只读属性。
             * offsetWitdth:
             */
      var that = this
      that.canvas = document.querySelector('#canvas')
      console.log(that.canvas)
      that.ctx = that.canvas.getContext('2d')
      that.canvas.setAttribute('width', that.canvas.offsetWidth)
      that.canvas.setAttribute('height', that.canvas.offsetHeight)
      // var img = new Image();
      // img.src = "../../../public/static/pic/renqun.png";
      // img.onload = function(){
      //   ctx.drawImage(img,0,0);
      // }

      // 监听鼠标按下事件
      this.canvas.onmousedown = function(e) {
        that.huaban.isDraw = true
        console.log(that.canvas.offsetLeft)
        console.log(that.canvas.offsetTop)
        console.log(e.pageX)
        const x = e.pageX - that.canvas.offsetLeft
        const y = e.pageY - that.canvas.offsetTop
        that.huaban.beginX = x
        that.huaban.beginY = y
      }

      // 监听鼠标抬起事件
      this.canvas.onmouseup = function(e) {
        that.huaban.imageDate = that.ctx.getImageData(0, 0, that.canvas.offsetWidth, that.canvas.offsetHeight)
        that.huaban.isDraw = false
        const x = e.pageX - that.canvas.offsetLeft
        const y = e.pageY - that.canvas.offsetTop

        console.log('point1 ->' + 'x:' + that.huaban.beginX + ',' + 'y:' + that.huaban.beginY)
        console.log('point2 ->' + 'x:' + x + ',' + 'y:' + that.huaban.beginY)
        console.log('point3 ->' + 'x:' + x + ',' + 'y:' + y)
        console.log('point4 ->' + 'x:' + that.huaban.beginX + ',' + 'y:' + y)
        var pointStr = that.huaban.beginX + ',' + that.huaban.beginY + ',' + x + ',' + that.huaban.beginY + ',' + x +
                              ',' + y + ',' + that.huaban.beginX + ',' + y + ';'
        that.pointList.push(pointStr)
        console.log(that.pointList)
      }

      // 监听鼠标移动事件
      this.canvas.onmousemove = function(e) {
        if (that.huaban.isDraw) {
          that.rectFn(e)
        }
      }
    },
    rectFn(e) {
      var that = this
      const x = e.pageX - that.canvas.offsetLeft
      const y = e.pageY - that.canvas.offsetTop
      that.ctx.clearRect(0, 0, that.canvas.offsetWidth, that.canvas.offsetHeight)
      if (that.huaban.imageDate != null) {
        that.ctx.putImageData(that.huaban.imageDate, 0, 0, 0, 0, that.canvas.offsetWidth, that.canvas.offsetHeight)
      }
      that.ctx.beginPath()
      that.ctx.rect(that.huaban.beginX, that.huaban.beginY, x - that.huaban.beginX, y - that.huaban.beginY)
      that.ctx.stroke()
      that.ctx.closePath()
    },
    check() {
      this.$axios.post('/acloud-lighting/', this.pointList).then(res => {

      })
    }

  }
}
</script>

<style scoped>
 #canvas {
   border: 1px solid #001528;
  }
</style>
