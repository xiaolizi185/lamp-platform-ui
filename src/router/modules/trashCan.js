/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const trashCanRoute = {
  path: '/trashCan',
  component: Layout,
  redirect: '/trashCan/list',
  name: 'trashCans',
  alwaysShow: true,
  meta: {
    title: '垃圾监测',
    icon: 'chuanganqi',
    roles: ['/trashCan']
  },
  children: [
    {
      path: '/trashCan/trashCanMap',
      component: () => import('@/views/trashCan/trashCanMap.vue'),
      name: 'trashCan1',
      meta: {
        title: '垃圾监测GIS',
       roles: ['/trashCan/trashCanMap']
      }
    },
    {
      path: 'trashCanindex',
      component: () => import('@/views/trashCan/trashCan.vue'),
      name: 'trashCan',
      meta: {
        title: '设备维护',
        roles: ['/trashCanindex']
      }
    },
    {
      path: 'trashAlert',
      component: () => import('@/views/trashCan/trashAlert.vue'),
      name: 'trashCan',
      meta: {
        title: '异常检测',
        roles: ['/trashAlert']
      }
    }
  ]
}
export default trashCanRoute
