import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/user_info/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/user_info/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/user_info/get/'+id,
      method: 'GET'
    })
  },
  findCarInfo(data) {
    return request({
      url: '/ipark/user_info/findCarInfo',
      method: 'POST',
      data
    })
  },
}
