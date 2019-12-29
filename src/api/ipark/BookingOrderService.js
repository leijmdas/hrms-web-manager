/**
 *  预约订单查询
 */
import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/booking_order/query',
      method: 'POST',
      data
    })
  },
  queryorder(data) {
    return request({
      url: '/ipark/booking_order/queryorder',
      method: 'POST',
      data
    })
  },
  findOrderNo(orderNo) {
    return request({
      url: '/ipark/booking_order/findOrderNo/'+orderNo,
      method: 'GET'
    })
  },
  export(data) {
    return request({
      url: '/ipark/booking_order/export',
      method: 'POST',
      data,
      responseType: 'blob'
    })
  }
}
