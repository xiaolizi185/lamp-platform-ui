/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout'

const smartLight = {
  path: '/smartLighting',
  component: Layout,
  name: '告警',
  redirect: '/smartLighting/list',
  alwaysShow: true,
  meta: {
    title: '告警处理',
    icon: 'message',
    roles: ['/smartLighting']
  },
  children: [
    {
      path: '/smartLighting/list',
      component: () => import('@/views/smartLighting/smartLighting.vue'),
      name: 'index',
      meta: {
        title: '报警处理',
        roles: ['/smartLighting/list']
      }
    }
  ]
}
export default smartLight
