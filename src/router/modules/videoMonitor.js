/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout'

const videoMonitor = {
  path: '/videoMonitor',
  component: Layout,
  name: '告警',
  redirect: '/videoMonitor/list',
  alwaysShow: true,
  meta: {
    title: '安防监控',
    icon: 'video',
    roles: ['/videoMonitor']
  },
  children: [
    {
      path: '/hkvideoMap/list',
      component: () => import('@/views/videoMonitor/videoMap/hkvideoMap.vue'),
      name: 'hkvideoMap',
      meta: {
        title: '监控GIS',
        roles: ['/hkvideoMap/list']
      }
    },
    {
      path: '/videoEquipment/list',
      component: () => import('@/views/videoMonitor/videoEquepment/videoEquipment.vue'),
      name: 'videoEquipment',
      meta: {
        title: '设备维护',
        roles: ['/videoEquipment/list']

      }
    },
    {
      path: '/videoMonitor/list',
      component: () => import('@/views/videoMonitor/videoAccount/videoAccount.vue'),
      name: 'index',
      meta: {
        title: '监控云用户',
        roles: ['/videoMonitor/list']
      }
    },
    {
      path: '/videoAlert',
      component: () => import('@/views/videoMonitor/videoAlert.vue'),
      name: 'videoAlert',
      meta: {
        title: '异常监控',
        roles: ['/videoAlert']
      }
    }
    
  ]
}
export default videoMonitor
