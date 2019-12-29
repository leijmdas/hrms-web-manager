//动态路由
import Layout from '../pages/layout'

let router0 = [{
  path: '/base0',
  component: Layout,
  meta: { title: '财务报表', icon: 'parking', group: 'report' },
  children: [{
    path: 'userInfo/manage',
    component: require('@/pages/app/userInfo/Manage.vue'),
    name: 'userInfo:manage',
    meta: { title: '对帐记录' }
  }, {
    path: 'userInfo/manage',
    component: require('@/pages/app/userInfo/Manage.vue'),
    name: 'userInfo:manage',
    meta: { title: '提现记录' }
  }, {
    path: 'userInfo/manage',
    component: require('@/pages/app/userInfo/Manage.vue'),
    name: 'userInfo:manage',
    meta: { title: '发票记录' }
  }]
}]

export default router0;
