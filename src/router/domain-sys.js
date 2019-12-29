//动态路由
import Layout from '../pages/layout'
// ---------- 系统管理 -------------

let sysRouter = [{
  path: '/sys',
  component: Layout,
  meta: {
    title: '系统管理',icon:'system',group:'sys'
  },
  children: [{
    path: 'corp/manage',
    name: 'sys:corp:manage',
    component: require('@/pages/sys/corp/ManagePanel.vue'),
    meta: {
      title: '企业信息',perm:'corp:manage'
    },
    hidden:true
  }, {
    path: 'org/manage',
    name: 'sys:org:manage',
    component: require('@/pages/sys/org/ManagePanel.vue'),
    meta: {
      title: '组织结构',
      perm:'sysOrg:manage'

    }
  }, {
    path: 'user/manage',
    name: 'sys:user:manage',
    component: require('@/pages/sys/user/ManagePanel.vue'),
    meta: {
      title: '用户管理',
      perm:'sysUser:manage'
    }
  }, {
    path: 'role/manage',
    name: 'sys:role:manage',
    component: require('@/pages/sys/role/ManagePanel.vue'),
    meta: {
      title: '角色管理',
      perm:'sysRole:manage'
    }
  }, {
    path: 'dict',
    name: 'sys:dict:manage',
    component: require('@/pages/sys/dict/ManagePanel.vue'),
    meta: {
      title: '字典管理',
      perm:'sysDict:manage'
    }
  }, {
    path: 'jobgroup',
    name: 'sys:jobgroup:manage',
    component: require('@/pages/sys/jobgroup/ManagePanel.vue'),
    meta: {
      title: '任务分组',
      perm:'sysJobGroup:manage'
    }
  }, {
    path: 'httpjob',
    name: 'sys:httpjob:manage',
    component: require('@/pages/sys/HttpJob/Manage.vue'),
    meta: {
      title: '任务管理',
      perm:'sysHttpJob:manage'
    }
  },
  {
      path: 'appVersion/manage',
      component: require('@/pages/app/appVersion/Manage.vue'),
      name: 'appVersion:manage',
      meta: {title: 'APP版本升级',perm: 'appVersion:manage'}
  },
      {
          path: 'datadict/manage',
          component: require('@/pages/datadict/Manage.vue'),
          name: 'datadict:manage',
          meta: {title: '元数据管理',perm: 'sysRole:manage'}
      }


  ]
}]
export default sysRouter;
