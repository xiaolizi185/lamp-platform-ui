/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const auditRouter = {
  path: '/audit',
  component: Layout,
  redirect: '/audit/logs',
  name: 'Audit',
  alwaysShow: true,
  meta: {
    title: '审计管理',
    icon: 'table'
  },
  children: [
    {
      path: 'logs',
      component: () => import('@/views/audit/logs/index'),
      name: 'Logs',
      meta: {
        title: '日志查询',
        // roles: ['/audit/logs']
      }
    },
    {
      path: '/audit/report',
      component: () => import('@/views/audit/report/index'),
      name: 'report',
      meta: {
        title: '日志报表',
        // roles: ['/audit/report']
      }
    }
  ]
}
export default auditRouter
