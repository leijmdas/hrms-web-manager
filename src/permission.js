import router, { routers } from './router'
import Vue from 'vue'
import { Message } from 'element-ui'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'// progress bar style

import { getToken,setCurrentUserId,init as authInit } from '@/utils/auth' // getToken from cookie
import { fetch,bus } from '@/utils'
import AppService from '@/api/AppService'

NProgress.configure({ showSpinner: false });

const whiteList = ['/login','/401','/404']// no redirect whitelist

// permissiom judge function
//资源控制（最小粒度）
function hasPermission(resCode) {
  
  if(!resCode){ //如果未编码，放行
    return true
  }
  let resGroups = router.app.resGroups||[]
  for(let i=0,len = resGroups.length;i<len;i++){
    let reslist = resGroups[i].sysResources||[]
    
    let tmp = reslist.filter(r=>r.resCode==resCode)
    if(tmp.length>0){
      return true
    }
  }
  return false;
}
function hasRole(roleCode){
  let roles = router.app.roles||[]
  
  let tmp = roles.filter(r=>r.roleCode==roleCode)
  return tmp.length>0
}
Vue.prototype.$hasPermission =  hasPermission
Vue.prototype.$hasRole =  hasRole

function gotoNext(to, next) {
  if (to.path === '/login') {
    next({ path: '/' })
    return;
  }
  if(to.path.indexOf('/access_token')>-1){
    next({ path: '/' })
    return ;
  }
  let _m = to.meta||{}
  if (hasPermission(_m.perm)) {
    next()
  } else {
    next({ path: '/401', replace: true, query: { noGoBack: true } })
  }
}

export default {
  init() {
    let asyncRouteLoaded = false;
    authInit();
    router.beforeEach((to, from, next) => {
      const app = router.app

      NProgress.start() // start progress bar
      if (app.isLogged) { //如果登陆了
        gotoNext(to, next)
        return;
      }
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
        return;
      }
      if (getToken()) { // determine if there has token
        /* has token*/

        if (!!app.user) {
          gotoNext(to, next)
          return;
        }
        AppService.authorization(getToken()).then(r => {
       
          app.corp = r.sysCorp
          app.user = r.sysUser
          app.roles = r.sysRoles||[]
          app.resGroups = r.sysResourceGroups||[]
          
          setCurrentUserId(r.sysUser.id)
          gotoNext(to, next)
          bus.$emit('app:user:set')
        }).catch((err) => {
          console.log(err)
          Message.error('认证失败，请重新登陆！')
          //next({ path: '/login' })
        })
      } else {

        next('/login') // 否则全部重定向到登录页
        //next()
        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it

      }
    })

    router.afterEach((to, from) => {
      NProgress.done() // finish progress bar
    })

  }
}
