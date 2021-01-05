<template>
  <div>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  data() {
    return {
      data: [],
      children: [],
      checkNode: [],
      projectData: {
        total: 0,
        projectList: []
      },
      lampPoleData: {
        total: 0,
        lampPoleList: []
      }

    }
  },
  created() {
    // this.getTableData()
    this.getTableDatas()
  },
  methods: {
    getTableDatas() {
      this.$axios.get('/acloud-lamppost/project/getProjectAndStation').then(res => {
        if (res.data.code === 20000) {
          var dateList = res.data.data
          for (let i = 0; i < dateList.length; i++) {
            var tempChild = {
              'id': dateList[i].fId,
              'label': dateList[i].fName,
              children: []
            }
            if (dateList[i].children.length > 0) {
              for (let j = 0; j < dateList[i].children.length; j++) {
                tempChild.children.push({
                  'id': dateList[i].children[j].fId,
                  'label': dateList[i].children[j].fName,
                  children: [{
                    label: '智慧照明'
                  }, {
                    label: '显示屏'
                  }, {
                    label: '安防监控'
                  }, {
                    label: '井盖'
                  }, {
                    label: '垃圾桶'
                  }]
                })
              }
            }
            this.children.push(tempChild)
          }
          this.data.push({
            label: '资产管理',
            children: this.children
          })
        } else {
          this.$message.error(res.data.message || '查询失败')
          return
        }
      })
    },
    handleNodeClick(data, e) {
      this.checkNode = []
      if (e.level === 1) {
        this.checkNode.push({
          'childNode': '资产管理'
        })
        this.$emit('getTreeInfo', this.checkNode)
      }
      if (e.level === 2) {
        this.checkNode.push({
          'childNode': '项目',
          'parentNode': data.id
        })
        this.$emit('getTreeInfo', this.checkNode)
      } else if (e.level === 3) {
        this.checkNode.push({
          'childNode': '灯杆',
          'parentNode': data.id
        })
        this.$emit('getTreeInfo', this.checkNode)
      } else if (e.level === 4) {
        this.checkNode.push({
          'childNode': data.label,
          'parentNode': e.parent.data.id,
          'grandparentNode': e.parent.parent.data.id
        })
        this.$emit('getTreeInfo', this.checkNode)
      }

      if (e.level === 2) {
        var params = {
          'fId': data.id,
          'createId': Vue.getAcloudProvider().getUserInfo().id
        }
        this.$axios.post('/acloud-lamppost/project/search?page=' + 1 + '&size=' + 20, params).then(res => {
          if (res.data.code === 20000) {
            this.projectData.projectList = res.data.data.rows
          }
        })
      } else if (e.level === 3) {
        const params1 = {
          'fId': data.id,
          'createId': Vue.getAcloudProvider().getUserInfo().id
        }
        this.$axios.post('/acloud-lighting/lampPole/search?page=' + 1 + '&size=' + 20, params1).then(res => {
          if (res.data.code === 20000) {
            this.lampPoleData.lampPoleList = res.data.data.rows
          }
        })
      }
      // console.log(this.checkNode);
      // this.$emit('getTreeInfo', this.checkNode)
    }
  }
}
</script>
