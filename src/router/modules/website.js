/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout'

const websiteRouter = {
  path: '/websiteManage',
  component: Layout,
  name: '站点',
  redirect: '/websiteManage/index',
  alwaysShow: true,
  meta: {
    title: '智能照明',
    icon: 'light',
    roles: ['/websiteManage']
  },
  children: [
    {
      path: '/websiteManage/map',
      component: () => import('@/views/websiteManage/websiteMap.vue'),
      name: 'map',
      meta: {
        title: '照明GIS',
        roles: ['/websiteManage/map']
      }
    },
    {
      path: '/websiteManage/index',
      component: () => import('@/views/websiteManage/index.vue'),
      name: 'index',
      meta: {
        title: '设备维护',
        roles: ['/websiteManage/index']
      }
    },
    {
      path: '/websiteManage/policy',
      component: () => import('@/views/websiteManage/policy.vue'),
      name: 'policy',
      meta: {
        title: '策略管理',
        roles: ['/websiteManage/policy']
      }
    },
    {
      path: '/websiteManage/stationReport',
      component: () => import('@/views/stationReport/stationReport.vue'),
      name: 'stationReport',
      meta: {
        title: '用能计量',
        roles: ['/websiteManage/stationReport']
      }
    },
    {
      path: '/smartLighting/list',
      component: () => import('@/views/smartLighting/smartLighting.vue'),
      name: 'index',
      meta: {
        title: '异常监测',
        roles: ['/smartLighting/list']
      }
    }
  ]
}
export default websiteRouter
