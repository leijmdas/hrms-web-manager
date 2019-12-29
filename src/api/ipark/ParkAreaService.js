import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/park_area/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/park_area/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/park_area/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/park_area/delete/'+id,
      method: 'POST'
    })
  },
  scanQr(id) { //扫码支付二维码
    return request({
      url: '/ipark/park_area/scanQr/'+id,
      method: 'POST'
    })
  },
  bindCorp(id,params){ //绑定企业关系
    return request({
      url: '/ipark/park_area/bindCorp/'+id,
      method: 'POST',
      data:params
    })
  }
}
