/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const welllidDevices = {
  path: '/welllidDevices',
  component: Layout,
  redirect: '/welllidDevices/list',
  name: 'welllidDevices',
  alwaysShow: true,
  meta: {
    title: '井盖监测',
    icon: 'well',
    roles: ['/welllidDevices']
  },
  children: [
    {
      path: 'welllidDevicesMap',
      component: () => import('@/views/jingai/jingGaiMap.vue'),
      name: 'welllidDevicesMap',
      meta: {
        title: '井盖GIS',
        roles: ['/welllidDevicesMap']
      }
    },
    {
      path: 'welllidDevicesindex',
      component: () => import('@/views/jingai/wellliddevice.vue'),
      name: 'welllidDevices',
      meta: {
        title: '设备维护 ',
        roles: ['/welllidDevicesindex']
      }
    }, {
      path: 'welllidDevicesAlert',
      component: () => import('@/views/jingai/jingGaiAlert.vue'),
      name: 'welllidDevicesMap',
      meta: {
        title: '异常检测',
        roles: ['/welllidDevicesAlert']
      }
    }
  ]
}
export default welllidDevices
