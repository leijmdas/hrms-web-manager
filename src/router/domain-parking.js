//动态路由
import Layout from '../pages/layout';

let router0 = [
    {
        path: '/m',
        component: Layout,
        meta: {title: '商家管理', icon: 'finance', group: 'parking'},
        children: [
            {
                path: 'businessInfo/manage',
                component: require('@/pages/app/businessInfo/Manage.vue'),
                name: 'businessInfo:manage',
                meta: {title: '商家信息', perm: 'userGrade:manage'}
            },
            {
                path: 'checkMerchant/manage',
                component: require('@/pages/app/checkMerchant/Manage.vue'),
                name: 'checkMerchant:manage',
                meta: {title: '商家审核', perm: 'userGrade:manage'}
            },
            {
                path: 'merchantOrder/manage',
                component: require('@/pages/app/merchantOrder/Manage.vue'),
                name: 'merchantOrder:manage',
                meta: {title: '商家订单', perm: 'userGrade:manage'}
            }]
    },
    {
        path: '/park',
        component: Layout,
        meta: {title: '停车场', icon: 'parking', group: 'parking'},
        children: [
            {
                path: 'parkBusiness/link',
                //component: require('@/pages/app/businessInfo/Manage.vue'),
                component: require('@/pages/app/parkBusiness/Manage.vue'),
                name: 'parkBusiness:link',
                meta: {title: '停车场商圈', perm: 'userGrade:manage'}
            }
        ]
    },
    {
    path: '/base0',
    component: Layout,
    meta: {title: '用户管理', icon: 'user', group: 'parking'},
    children: [{
        path: 'userInfo/manage',
        component: require('@/pages/app/userInfo/Manage.vue'),
        name: 'userInfo:manage',
        meta: {title: '车主信息', perm: 'user:manage'}
    }, {
        path: 'userInfo/userGrade',
        component: require('@/pages/app/userGrade/Manage.vue'),
        name: 'userGrade:manage',
        meta: {title: '用户配置', perm: 'userGrade:manage'}
    },
    // {
    //     path: 'userGrade/manage',
    //     component: require('@/pages/app/userGrade/Manage.vue'),
    //     name: 'userGrade:manage',
    //     meta: {title: '用户等级', perm: 'userGrade:manage'}
    // },
    {
        path: 'userInfo/recharge',
        component: require('@/pages/app/userInfo/Manage.vue'),
        name: 'recharge:manage',
        meta: {title: '充值记录', perm: 'user:recharge'}
    }
        //     {
        //     path: 'invoice/manage',
        //     component: require('@/pages/app/invoice/Manage.vue'),
        //     name: 'invoice:manage',
        //     meta: {title: '发票配置', perm: 'invoice:manage'}
        // }
    ]
},
    /*{
      path: '/act',
      component: Layout,
      meta: { title: '活动优惠', icon: 'promotion', group: 'parking' },
      children: [{
        path: 'promotion/manage',
        component: require('@/pages/app/act/promotionInfo/Manage.vue'),
        name: 'promotion:manage',
        meta: { title: '券类型管理' }
      }, {
        path: 'coupon/manage',
        component: require('@/pages/app/act/promotionCoupon/Manage.vue'),
        name: 'coupon:manage',
        meta: { title: '优惠券管理' }
      }]
    }, */

    {
        path: '/i',
        component: Layout,
        meta: {title: '邀请码', icon: 'dashboard', group: 'parking'},
        children: [
            {
                path: 'inviteCode/manage',
                component: require('@/pages/app/inviteCode/Manage.vue'),
                name: 'inviteCode:manage',
                meta: {title: '邀请码列表', perm: 'userGrade:manage'}
            },
             {
                 path: 'merchantInviteCode/manage',
                     component: require('@/pages/app/merchantInviteCode/Manage.vue'),
                 name: 'businessCode:manage',
                 meta: {title: '商家邀请码', perm: 'userGrade:manage'}
             },
{
                path: 'parkCode/manage',
                component: require('@/pages/app/parkInviteCode/Manage.vue'),
                name: 'parkCode:manage',
                meta: {title: '停车场邀请码', perm: 'userGrade:manage'}
            },
            {
                path: 'checkCode/manage',
                component: require('@/pages/app/checkInviteCode/Manage.vue'),
                name: 'checkCode:manage',
                meta: {title: '停车场邀请码审核', perm: 'userGrade:manage'}
            },

        ]
    },
    {
        path: '/act',
        component: Layout,
        meta: {title: '活动管理', icon: 'promotion', group: 'parking'},
        children: [{
            path: 'activityRules/manage',
            component: require('@/pages/app/act/activityRules/Manage.vue'),
            name: 'activityRules:manage',
            meta: {title: '活动规则', perm: 'activityRules:manage' }
        }, {
            path: 'promotion/manage',
            component: require('@/pages/app/act/promotionInfo/Manage.vue'),
            name: 'promotion:manage',
            meta: {title: '优惠券模板', perm: 'promotion:manage'}
        }, {
            path: 'couponBatch/manage',
            component: require('@/pages/app/act/promotionCouponBatch/Manage.vue'),
            name: 'couponBatch:manage',
            meta: {title: '优惠券派发', perm: 'couponBatch:manage'}
        }, {
            path: 'coupon/manage',
            component: require('@/pages/app/act/promotionCoupon/Manage.vue'),
            name: 'coupon:manage',
            meta: {title: '优惠券', perm: 'coupon:manage'}
        },  {
            path: 'promotionGroup/manage',
            component: require('@/pages/app/act/promotionGroup/Manage.vue'),
            name: 'promotionGroup/manage',
            meta: {title: '发放统计', perm: 'coupon:report'}
        }]
    },
    {
        path: '/r',
        component: Layout,
        meta: {title: '订单管理', icon: 'account', group: 'parking'},
        children: [
            {
                path: 'bookingOrder/manage',
                component: require('@/pages/app/bookingOrder/Manage.vue'),
                name: 'bookingOrder:manage',
                meta: {title: '预约订单', perm: 'bookingOrder:manage'}
            },
            {
                path: 'parkingOrder/manage',
                component: require('@/pages/app/parkingOrder/Manage.vue'),
                name: 'parkingOrder:manage',
                meta: {title: '停车订单', perm: 'parkingOrder:manage'}
            }, {
                path: 'accessInfo/manage',
                component: require('@/pages/app/accessInfo/Manage.vue'),
                name: 'acessInfo:manage',
                meta: {title: '停车记录', perm: 'access:manage'}
            }, {
                path: 'walletOrder/manage',
                component: require('@/pages/app/walletOrder/Manage.vue'),
                name: 'walletOrder:manage',
                meta: {title: '账单记录', perm: 'walletOrder:manage'}
            }]
    }, {
        path: '/f',
        component: Layout,
        meta: {title: '支付结算', icon: 'finance', group: 'parking'},
        children: [{
            path: 'settleAccount/manage',
            component: require('@/pages/app/settleAccount/Manage.vue'),
            name: 'settleAccount:manage',
            meta: {title: '账户管理', perm: 'settleAccount:manage'}
        }, {
            path: 'payOrder/manage',
            component: require('@/pages/app/payOrder/Manage.vue'),
            name: 'payOrder:manage',
            meta: {title: '支付记录', perm: 'payOrder:manage'}
        }, {
            path: 'invoiceInfo/manage',
            component: require('@/pages/app/invoiceInfo/Manage.vue'),
            name: 'invoiceInfo:manage',
            meta: {title: '发票记录', perm: 'invoice:manage'}
        }, {
            path: 'settlePeriodMake/balanceTask',
            component: require('@/pages/app/settlePeriodMake/Manage.vue'),
            name: 'settlePeriodMake:balanceTask',
            meta: {title: '帐单生成', perm: 'settlePeriod:balanceTask'}
        }, {
            path: 'settlePeriod/manage',
            component: require('@/pages/app/settlePeriod/Manage.vue'),
            name: 'settlePeriod:manage',
            meta: {title: '帐单查询', perm: 'settlePeriod:manage'}
        }, {
            path: 'settlePeriod/takeoutAudit',
            component: require('@/pages/app/settlePeriod/TakeoutAudit.vue'),
            name: 'settlePeriod:takeoutAudit',
            meta: {title: '提现审核', perm: 'settlePeriod:takeoutAudit'}
        }]
    }
];

export default router0;
