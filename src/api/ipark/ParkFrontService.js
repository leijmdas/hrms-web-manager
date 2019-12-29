import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/park_front/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/park_front/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/park_front/get/'+id,
      method: 'GET'
    })
  },
  queryFind(data) {
    return request({
      url: '/ipark/park_front/queryFind',
      method: 'POST',
      data
    })
  },
  delete(id) {
    return request({
      url: '/ipark/park_front/delete/'+id,
      method: 'POST'
    })
  },
  scanQr(id) { //扫码支付二维码
    return request({
      url: '/ipark/park_front/scanQr/'+id,
      method: 'POST'
    })
  },
  bindCorp(id,params){ //绑定企业关系
    return request({
      url: '/ipark/park_front/bindCorp/'+id,
      method: 'POST',
      data:params
    })
  }
}
