/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const updateLogRoute = {
  path: '/updateLog',
  component: Layout,
  redirect: '/updateLog/list',
  name: 'updateLog',
  alwaysShow: true,
  hidden: true,
  meta: {
    title: '更新日志',
    icon: 'onecall'
  },
  children: [
    {
      path: 'updateLog',
      component: () => import('@/views/updateLog/index.vue'),
      name: 'updateLog',
      hidden: true,
      meta: {
        title: '更新日志'
      }
    }
  ]
}
export default updateLogRoute
