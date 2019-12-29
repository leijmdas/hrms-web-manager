// 动态路由
import Layout from '../pages/layout';

let router0 = [{
    path: '/base',
    component: Layout,
    meta: {title: '基础信息', icon: 'parking', group: 'maintenance'},
    children: [{
        path: 'branchCompany/manage',
        component: require('@/pages/app/branchCompany/Manage.vue'),
        name: 'branchCompany:manage',
        meta: {title: '子公司', perm: 'branchCompany:manage'}
    }, {
        path: 'merchantInfo/manage',
        component: require('@/pages/app/merchantInfo/Manage.vue'),
        name: 'merchant:manage',
        meta: {title: '物业', perm: 'merchant:manage'}
    }, {
        path: 'park/manage',
        component: require('@/pages/app/parkInfo/Manage.vue'),
        name: 'park:manage',
        meta: {title: '停车场', perm: 'park:manage'}
    }, {
        path: 'park/edit',
        component: require('@/pages/app/parkInfo/Edit.vue'),
        name: 'park:edit',
        meta: {title: '停车场编辑'},
        hidden: true
    }, {
        path: 'parkingRule/edit',
        component: require('@/pages/app/parkingRule/Edit.vue'),
        name: 'parkingRule:edit',
        meta: {title: '停车场计费规则'},
        hidden: true
    }, {
        path: 'parkPort/manage',
        component: require('@/pages/app/parkPort/Manage.vue'),
        name: 'parkPort:manage',
        meta: {title: '泊位管理', perm: 'partPort:manage'}
    }, {
        path: 'parkPort/parkInfo',
        component: require('@/pages/app/parkInfo/ParkInfo.vue'),
        name: 'parkPort:parkInfo',
        meta: {title: '泊位信息', perm: 'partPort:viewport'}
    },
    {
        path: 'holidayInfo/manage',
        component: require('@/pages/app/holidayInfo/Manage.vue'),
        name: 'holidayInfo:manage',
        meta: {title: '节假日信息', perm: 'holiday:manage'}
    },
    // {
    //     path: 'userGrade/manage',
    //     component: require('@/pages/app/userGrade/Manage.vue'),
    //     name: 'userGrade:manage',
    //     meta: {title: '用户等级', perm: 'userGrade:manage'}
    // },
    {
        path: 'managerLogin/manage',
        component: require('@/pages/app/managerLogin/Manage.vue'),
        name: 'managerLogin:manage',
        meta: {title: '物业端用户', perm: 'managerLogin:manage'}
    }
    ]
}, {
    path: '/base1',
    component: Layout,
    meta: {title: '设备管理', icon: 'parking', group: 'maintenance'},
    children: [
      //{
       // path: 'lockerInfo/manage',
       // component: require('@/pages/app/lockerInfo/Manage.vue'),
       // name: 'lockerInfo:manage',
       // meta: {title: '片区管理'}
   // },
    {
        path: 'lockerInfo/manage',
        component: require('@/pages/app/lockerInfo/Manage.vue'),
        name: 'lockerInfo:manage',
        meta: {title: '车位锁管理', perm: 'locker:manage'}
    },{
        path: 'importInfo/manage',
        component: require('@/pages/app/importInfo/Manage.vue'),
        name: 'importInfo:manage',
        meta: {title: '批量导入',perm: 'importInfo:manage'}
    }]
}, {
    path: '/warning',
    component: Layout,
    meta: {title: '告警管理', icon: 'parking', group: 'maintenance'},
    children: [{
        path: 'deviceMonitor/manage',
        component: require('@/pages/app/deviceMonitor/Manage.vue'),
        name: 'deviceMonitor:manage',
        meta: {title: '设备告警管理', perm: 'deviceMonitor:manage'}
    }, {
        path: 'orderInfor/manage',
        component: require('@/pages/app/orderInfor/Manage.vue'),
        name: 'orderInfor:manage',
        meta: {title: '预约订单异常', perm: 'orderInfor:manage'}
    },{
        path: 'parkfront/manage',
        component: require('@/pages/app/parkfront/Manage.vue'),
        name: 'parkfront:manage',
        meta: {title: '前置告警', perm: 'parkfront:manage'}
    }]
}];

export default router0;
