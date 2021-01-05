/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout'

const lightPoleRouter = {
  path: '/lightingPoleManage',
  component: Layout,
  name: '杆体综合管理',
  redirect: '/lightingPoleManage/index',
  alwaysShow: true,
  meta: {
    title: '杆体综合管理',
    icon: 'star',
    roles: ['/lightingPoleManage']
  },
  children: [
    {
      path: '/lightingPoleManage/lightMapMonitor',
      component: () => import('@/views/lightingPoleManage/lightMapMonitor.vue'),
      name: 'index',
      meta: {
        title: '杆体GIS ',
        roles: ['/lightingPoleManage/lightMapMonitor']
      }
    },
    {
      path: '/projectInfoManage/index',
      component: () => import('@/views/projectInfoManage/index.vue'),
      name: 'projectInfoManage',
      meta: {
        title: '项目管理',
        roles: ['/lightingPoleManage/index']
      }
    },
    {
      path: '/lightingPoleManage/lightPoleType',
      component: () => import('@/views/lightingPoleManage/lightPoleType.vue'),
      name: 'index',
      meta: {
        title: '杆体资源',
        roles: ['/lightingPoleManage/lightPoleType']
      }
    },
    {
      path: '/lightingPoleManage/index',
      component: () => import('@/views/lightingPoleManage/index.vue'),
      name: 'index',
      meta: {
        title: '设备维护',
        roles: ['/lightingPoleManage/index']
      }
    }
  ]
}
export default lightPoleRouter
