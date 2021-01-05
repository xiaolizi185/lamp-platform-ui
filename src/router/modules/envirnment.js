/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const envirnmentRoute = {
  path: '/envirnmentDev',
  component: Layout,
  redirect: '/envirnmentDev/list',
  name: 'envirnmentDev',
  alwaysShow: true,
  meta: {
    title: '环境监测',
    icon: 'size'
  },
  children: [
    {
      path: 'envirnmentDev',
      component: () => import('@/views/envirment/envirmentdev.vue'),
      name: 'envirnmentDev',
      meta: {
        title: '环境设备',
        roles: ['/envirnmentDev']
      }
    },
  ]
}
export default envirnmentRoute
