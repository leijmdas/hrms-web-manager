import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/pay_order/query',
      method: 'POST',
      data
    })
  },

  get(id) {
    return request({
      url: '/ipark/pay_order/get/'+id,
      method: 'GET'
    })
  },

}
