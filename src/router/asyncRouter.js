//动态路由
import Layout from '../pages/layout'

let router0=[{
  path: '/a',
  component: Layout,
  meta:{title:'会员及商户',icon:'user'},
  children: [{
    path: 'userInfo/manage',
    component: require('@/pages/app/userInfo/Manage.vue'),
    name: 'userInfo:manage',
    meta: { title:'用户管理' }
  },{
    path: 'merchant/manage',
    component: require('@/pages/app/merchantInfo/Manage.vue'),
    name: 'merchant:manage',
    meta: { title:'商户管理' }
  },{
    path: 'corp/manage',
    component: require('@/pages/app/corpInfo/Manage.vue'),
    name: 'corp:manage',
    meta: { title:'企业管理' }
  }],
},{
  path: '/p',
  component: Layout,
  meta:{title:'停车管理',icon:'parking'},
  children: [{
    path: 'park/manage',
    component: require('@/pages/app/parkInfo/Manage.vue'),
    name: 'park:manage',
    meta: { title:'停车场管理' }
  },{
    path: 'accessInfo/manage',
    component: require('@/pages/app/accessInfo/Manage.vue'),
    name: 'acessInfo:manage',
    meta: { title:'停车流水' }
  }],
},{
  path: '/f',
  component: Layout,
  meta:{title:'支付结算',icon:'finance'},
  children: [{
    path: 'settleAccount/manage',
    component: require('@/pages/app/settleAccount/Manage.vue'),
    name: 'settleAccount:manage',
    meta: { title:'结算账户管理' }
  },{
    path: 'payOrder/manage',
    component: require('@/pages/app/payOrder/Manage.vue'),
    name: 'payOrder:manage',
    meta: { title:'支付记录' }
  }]
},{
  path: '/act',
  component: Layout,
  meta:{title:'活动及营销',icon:'promotion'},
  children: [/*{
    path: 'promotionDispatchChannel/manage',
    component: require('@/pages/app/act/promotionDispatchChannel/Manage.vue'),
    name: 'promotionDispatchChannel:manage',
    meta: { title:'商户管理' }
  },*/{
    path: 'promotion/manage',
    component: require('@/pages/app/act/product/Manage.vue'),
    name: 'promotion:manage',
    meta: { title:'优惠管理' }
  },{
    path: 'couponBatch/manage',
    component: require('@/pages/app/act/promotionCouponBatch/Manage.vue'),
    name: 'couponBatch:manage',
    meta: { title:'优惠券派发' }
  },{
    path: 'coupon/manage',
    component: require('@/pages/app/act/promotionCoupon/Manage.vue'),
    name: 'coupon:manage',
    meta: { title:'优惠券' }
  },{
    path: 'coupon/report',
    component: require('@/pages/app/act/report/CouponReport.vue'),
    name: 'coupon:report',
    meta: { title:'优惠券统计' }
  }]
},{
  path: 'c',
  component: Layout,
  meta:{title:'订单及报表',icon:'cart'},
  children: [{
    path: 'order/manage',
    component: require('@/pages/index.vue'),
    name: 'order:manage',
    meta: { title:'订单管理' }
  },{
    path: 'coupon/manage',
    component: require('@/pages/index.vue'),
    name: 'coupon:manage',
    meta: { title:'订单报表' }
  }],
}]

export const asyncRouter = [].concat(router0)
// export const asyncRouter = sysRouter
