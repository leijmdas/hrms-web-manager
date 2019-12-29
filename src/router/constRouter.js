// const _import = require('./_import_' + process.env.NODE_ENV)

/* Layout */
import Layout from '../pages/layout/index'

/** note: submenu only apppear when children.length>=1
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouter = [
  {path: '/login', component: require('@/pages/layout/login.vue'), hidden: true},
  {path: '/authredirect', component: require('@/pages/layout/login.vue'), hidden: true},
  {path: '/404', component: require('@/pages/errorPage/404.vue'), hidden: true},
  {path: '/401', component: require('@/pages/errorPage/401.vue'), hidden: true},
  {
    path: '',
    component: Layout,
    hidden: true,
    children: [{
      path: '/',
      redirect: '/index',
      meta: {closable: false}
    }, {
      path: '/dashboard',
      name: 'dashboard',
      redirect: '/index'
    }, {
      path: '/index',
      component: require('@/pages/index.vue'),
      name: 'index',
      meta: {icon: 'dashboard', noCache: true, title: '东兴旺', closable: true}
    }]
  }, {
    path: '*',
    redirct: '/404',
    component: require('@/pages/errorPage/404.vue'),
  }]
