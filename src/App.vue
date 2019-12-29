<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
  @import "variables";
  @import "base";
  html,
  body {
    height: 100%;
     ::-webkit-scrollbar-track-piece {
      //滚动条凹槽的颜色，还可以设置边框属性
      background-color: #f8f8f8;
    }
     ::-webkit-scrollbar {
      //滚动条的宽度
      width: 6px;
      height: 6px;
    }
     ::-webkit-scrollbar-thumb {
      //滚动条的设置
      background-color: #dddddd;
      background-clip: padding-box;
      min-height: 28px;
    }
     ::-webkit-scrollbar-thumb:hover {
      background-color: #bbb;
    }
  }
  
  #app {
    height: 100%;
  }
</style>
<script>
  import {
    KeyCode,
    // fetch,
    bus,
    auth,
    Consts
  } from './utils';
  import router, {
    routers
  } from './router';
  
  // function getPermissionRouters (allRouters, resGroups) {}
  export default {
    name:'app',
    provide(){
        return{
          reload:this.reload
        }
    },
    data () {
      return {       
        isRouterAlive:true
      }
    },
    methods: {
      keysEvent (e) {
        const code = KeyCode.getKeyCode(e)
        if (code) {
          let el = document.querySelector('[keycode=' + code + ']');
  
          if (el) {
            el.click()
          }
        }
      },
      reload(){
        this.isRouterAlive=false;
        this.$nextTick(function(){
          this.isRouterAlive=true
        })
      }
    },
    beforeDestroy () {
      document.removeEventListener('keyup', this.keysEvent)
    },
    mounted () {
      // 登陆成功处理
      bus.$on('app:logged', () => {
        this.$router.push('/');
      });
      bus.$on('app:logout', () => {
        auth.removeToken();
        router.app.isLogged = false;
        router.app.user = null;
        window.location.href = Consts.LOGOUT_URL
        // this.$nextTick(() => {
        //   this.$router.push("/login");
        // });
      });
      // 获取授权信息成功
      bus.$on('app:user:set', () => {});

      document.addEventListener('keyup', this.keysEvent)

      // 错误提示(后期去Jquery)
  
      $(document).on('mouseover', '.el-form-item', function (event) {
        let $this = $(this);
        let flag = $this.hasClass('is-error');
        if (flag) {
          $('.el-form-item__error', $this).show();
        } else {
          $('.el-form-item__error', $this).hide();
        }
      })
      $(document).on('focus', '.el-form-item', function (event) {
        let $this = $(this);
        let flag = $this.hasClass('is-error');
        if (flag) {
          $('.el-form-item__error', $this).hide();
        }
      })
      $(document).on('mouseout', '.el-form-item', function (el) {
        let $this = $(this);
        $('.el-form-item__error', $this).hide();
      })
    }
  };
</script>
