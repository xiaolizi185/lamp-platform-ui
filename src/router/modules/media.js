/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const mediaRoute = {
  path: '/media',
  component: Layout,
  redirect: '/media/list',
  name: 'media',
  alwaysShow: true,
  meta: {
    title: '广播管理',
    icon: 'onecall',
    roles: ['/media']
  },
  children: [
    {
      path: 'media',
      component: () => import('@/views/media/media.vue'),
      name: 'media',
      meta: {
        title: '媒体库',
        roles: ['/media']
      }
    },
  ]
}
export default mediaRoute
