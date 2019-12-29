import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/user_grade/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/user_grade/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/user_grade/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/user_grade/delete/'+id,
      method: 'POST'
    })
  },
  scanQr(id) { //扫码支付二维码
    return request({
      url: '/ipark/user_grade/scanQr/'+id,
      method: 'POST'
    })
  },
  bindCorp(id,params){ //绑定企业关系
    return request({
      url: '/ipark/user_grade/bindCorp/'+id,
      method: 'POST',
      data:params
    })
  }
}
