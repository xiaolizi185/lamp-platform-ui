/** When your routing table is too long, you can split it into small modules **/
import Layout from '@/layout'

const handlePerson = {
  path: '/handlePerson',
  component: Layout,
  name: '运维管理',
  redirect: '/handlePerson/needDeal',
  alwaysShow: true,
  meta: {
    title: '运维管理',
    icon: 'user',
    roles: ['/handlePerson']
  },
  children: [
    {
      path: '/handlePerson/list',
      component: () => import('@/views/personMaintain/person.vue'),
      name: 'index',
      meta: {
        title: '运维人员',
        roles: ['/handlePerson/list']
      }
    },
    {
      path: '/handlePerson/personAlert',
      component: () => import('@/views/personMaintain/personAlert.vue'),
      name: 'index',
      meta: {
        title: '异常监测',
        roles: ['/handlePerson/personAlert']
      }
    },
    {
      path: '/handlePerson/needDeal',
      component: () => import('@/views/personMaintain/needDeal.vue'),
      name: 'index',
      meta: {
        title: '运维待办',
        roles: ['/handlePerson/needDeal']
      }
    },
    {
      path: '/handlePerson/needDealAudit',
      component: () => import('@/views/personMaintain/needDealAudit.vue'),
      name: 'index',
      meta: {
        title: '待办审核',
        roles: ['/handlePerson/needDealAudit']
      }
    }
  ]
}
export default handlePerson
