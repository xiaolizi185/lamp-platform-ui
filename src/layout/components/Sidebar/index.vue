<template>
  <div style="overflow-y: auto">
    <div style="width: 300px;height: 80px;background-color: #3273ab">
      <img src="../../../assets/dashboard_images/title.png">
    </div>
   <!-- <div style="margin-left: 30%;margin-top: 10px;" >
      <el-avatar
        class="sidebar-logo"
        :size="80"
        :fit="fit"
        :src="avatarUrl + objectEntity.fileId + '&access_token=' +token"
      />
    </div>-->
    <div :class="{'has-logo':showLogo}">
      <logo v-if="showLogo" :collapse="isCollapse" />
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import Vue from 'vue'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      objectEntity: {
        fileId: Vue.getAcloudProvider().getUserInfo().photo
      },
      avatarUrl: 'http://192.168.3.25:18000/acloud-file-center/file/oper/download?fileId='
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar',
      'token'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
  }
}
</script>
<style scoped>
  img {
    transform: scale(0.3);
    -ms-transform: scale(0.3);  /* IE 9 */
    -moz-transform: scale(0.3);  /* Firefox */
    -webkit-transform: scale(0.3); /* Safari 和 Chrome */
    -o-transform: scale(0.3);
    margin-left: -80%;

  }
</style>
