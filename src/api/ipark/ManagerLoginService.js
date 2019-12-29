import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/manager_login/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/manager_login/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/manager_login/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/manager_login/delete/'+id,
      method: 'POST'
    })
  }
}
