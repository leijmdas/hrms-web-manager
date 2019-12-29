/**
 * 停车订单服务
 */
import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/parking_order/query',
      method: 'POST',
      data
    })
  },
  export(data) {
    return request({
      url: '/ipark/parking_order/export',
      method: 'POST',
      data,
      responseType: 'blob'
    })
  }
}
