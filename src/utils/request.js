import axios from 'axios'
import router from "@/router";
import {auth,bus } from '@/utils'

let currentLoadingCount = 0;
function incrLoadRequest(config,incr){
  
  if(config.openLoading===undefined){
    config.openLoading = (config.data||{})._openLoading;
  }
  if(config.openLoading === undefined){
    config.openLoading = true;
  }
  if(incr>0){
    bus.$emit('request:start',config);
  } else {
    bus.$emit('request:end',config)
  }
  if(config.openLoading){
    currentLoadingCount = currentLoadingCount+incr;
  }
  if(currentLoadingCount<1){
    currentLoadingCount = 0;
    bus.$emit('request:allCompleted',config);
  }
}
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 20000// request timeout
})
service.interceptors.request.use(config => {
  // Do something before request is sent
  let token = auth.getToken()
  
  if (token) {
    config.headers['Access-Token'] = token 
  }
 
  if (!config.headers['Content-Type'] && config.params) {
    config.data = '';
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  incrLoadRequest(config,1);
  return config
}, error => {
  incrLoadRequest(config,-1);
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    let {config} = response;
    incrLoadRequest(config,-1);
    if (response.headers && (response.headers['content-type'] === 'application/x-msdownload' || response.headers['content-type'] === 'application/msexcel')) {
      
      downloadUrl(response)
      return Promise.resolve(response.data)
    }
    return Promise.resolve(response.data)
  },
  error => {
    const { config, response } = error
    incrLoadRequest(config,-1);
    let msg = ''
    let code = -1
    let statusCode
    if (response && response instanceof Object) {
      // const {msg: errMsg, code: errCode} = (response.data || {msg: '', code: ''}).data
      const { msg: errMsg, code: errCode } = response.data
      statusCode = response.status
      code = errCode
      msg = errMsg

    } else {
      statusCode = 600
      msg = error.msg || 'Network Error'
    }
    let wrapError = new RequestError(statusCode, code, msg)
    //默认处理
    if (!config.autoHandleError) {
      defaultHandler(wrapError)
    }
    return Promise.reject(wrapError);
  })
function defaultHandler(reqError) {
  console.log(reqError)
  let msg = '';
  switch (reqError.httpCode) {
    case 400: msg = '请求错误(400)'; break;
    case 401: msg = '未授权，请重新登录(401)';bus.$emit("app:logout"); break;
    case 403: msg = '拒绝访问(403)'; break;
    case 404: msg = '请求出错(404)'; break;
    case 408: msg = '请求超时(408)'; break;
    case 500: msg = '服务器错误(500)'; break;
    case 501: msg = '服务未实现(501)'; break;
    case 502: msg = '网络错误(502)'; break;
    case 503: msg = '服务不可用(503)'; break;
    case 504: msg = '网络超时(504)'; break;
    case 505: msg = 'HTTP版本不受支持(505)'; break;
    case 418: msg = reqError.msg;break;
    default: msg = `连接出错(${reqError.httpCode})!`;
  }
  msg = reqError.msg||msg;
  router.app.$message({ message: msg, type: 'warning' })
}
//使用iframe框架下载文件
const downloadUrl = res => {

  const content = res.data
  const blob = new Blob([content])
  // const dis = res.headers['attache-disposition']||'';
  // let fm = /filename=[^;]*/.exec(dis);
  //let filename = fm[0].substring("filename=".length);
  let filename = decodeURIComponent(res.headers['attachment-name']||'undefined');
  if ('download' in document.createElement('a')) { // 非IE下载
    const elink = document.createElement('a')
    elink.download = filename
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else { // IE10+下载
    navigator.msSaveBlob(blob, filename)
  }
}
function RequestError(httpCode, code, msg) {
  this.httpCode = httpCode
  this.code = code
  this.msg = msg
  this.name = 'RequestError'
}

RequestError.prototype = new Error()
RequestError.prototype.constructor = RequestError
export default service
