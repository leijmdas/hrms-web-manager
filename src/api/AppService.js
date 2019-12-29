import request from '@/utils/request'
export default {

  /**
   * 获取认证信息
   */
  authorization() {
    return request({
      url: '/api/sys/user/authorization',
      method: 'POST'
    })
  },
  login(params) {
    return request({
      url: '/api/auth/login',
      method: 'POST',
      params:params
    })
  },
}
