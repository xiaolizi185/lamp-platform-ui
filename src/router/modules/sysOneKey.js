/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const sysOneKeyRoute = {
  path: '/sysOneKey',
  component: Layout,
  redirect: '/sysOneKey/list',
  name: 'sysOneKey',
  alwaysShow: true,
  meta: {
    title: '一键呼叫',
    icon: 'onecall',
    roles: ['/sysOneKey']
  },
  children: [
    {
      path: 'sysOneKey',
      component: () => import('@/views/sysOneKey/oneKeyEquip/sysOneKey.vue'),
      name: 'sysOneKey',
      meta: {
        title: '呼叫设备',
        roles: ['/sysOneKey']
      }
    },
  ]
}
export default sysOneKeyRoute
