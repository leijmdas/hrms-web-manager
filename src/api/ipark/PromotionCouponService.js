import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/promotion_coupon/query',
      method: 'POST',
      data
    })
  },
  queryGroup(data) {
    return request({
      url: '/ipark/promotion_coupon/queryGroup',
      method: 'POST',
      data
    })
  },
  export(data) {
    return request({
      responseType: 'blob',
      url: '/ipark/promotion_coupon/export',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/promotion_coupon/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/promotion_coupon/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/promotion_coupon/delete/'+id,
      method: 'POST'
    })
  },
  dispatch2User(data){
    return request({
      url: '/ipark/promotion_coupon/dispatch2User',
      method: 'POST',
      data
    })
  }
}
