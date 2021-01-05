/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const sysLeddeviceRoute = {
  path: '/sysLeddevice',
  component: Layout,
  redirect: '/sysLeddevice/list',
  name: 'sysLeddevice',
  alwaysShow: true,
  meta: {
    title: '显示屏管理',
    icon: 'led',
    roles: ['/sysLeddevice']
  },
  children: [
    {
      path: '/displayGIS',
      component: () => import('@/views/displayScreen/displayGIS.vue'),
      name: 'displayGIS',
      meta: {
        title: '显示屏GIS',
        roles: ['/displayGIS']
      }
    },
    {
      path: '/sysLeddevicelist',
      component: () => import('@/views/displayScreen/sysLeddevice.vue'),
      name: 'sysLeddevice',
      meta: {
        title: '设备维护',
        roles: ['/sysLeddevicelist']
      }
    },
    {
      path: '/sysledmaterial',
      component: () => import('@/views/displayScreen/sysledmaterial.vue'),
      name: 'sysledmaterial',
      meta: {
        title: '资源管理',
        roles: ['/sysledmaterial']
      }
    },
    {
      path: '/syslematerialAudit',
      component: () => import('@/views/displayScreen/syslematerialAudit.vue'),
      name: 'syslematerialAudit',
      meta: {
        title: '素材审核',
        roles: ['/syslematerialAudit']
      }
    },
    {
      path: '/program',
      component: () => import('@/views/displayScreen/program.vue'),
      name: 'program',
      meta: {
        title: '发布计划',
        roles: ['/program']
      }
    },
    {
      path: 'ledlog',
      component: () => import('@/views/displayScreen/sysLeddeviceLog.vue'),
      name: 'ledlog',
      meta: {
        title: '操作日志',
         roles: ['/ledlog']
      }
    }
  ]
}
export default sysLeddeviceRoute
