import './assets/css/reset.css'
// import 'material-design-lite/dist/material.indigo-blue.min.css'
import './assets/css/easyzoom.css'

import './element-variables.scss'
import './assets/font/iconfont.css';
import Vue from 'vue'
import ElementUI from 'element-ui'
import echarts from 'echarts' // 引入echarts
import md5 from 'md5'
import moment from 'moment-mini'

Vue.prototype.$moment = moment; // 引入组件
Vue.prototype.$md5 = md5; // 引入组件
Vue.prototype.$echarts = echarts; // 引入组件

import Icon from 'vue-svg-icon/Icon.vue';

Vue.component('icon', Icon);

import router from './router'
import permission from './permission'
import './directives'
import vueFilter from './filter'
import api from './api'
import _ from 'lodash'

import './components'
import App from './App'
import {
  KeyCode,
  bus
} from './utils'
import VueDirectiveImagePreviewer from './directives/imagePreview'
import './mock' // simulation data
Vue.use(ElementUI, {
  size: 'mini'
})

Vue.use(vueFilter)

import axios from 'axios'

Vue.prototype.$http = axios
Vue.prototype.$bus = bus
Vue.prototype.$api = api

permission.init();
const app = new Vue({
  el: '#app-wrap',
  router,
  ...App
});

