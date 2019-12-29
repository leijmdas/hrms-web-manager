import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/check_record/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/check_record/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/check_record/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/check_record/delete/'+id,
      method: 'POST'
    })
  },
  scanQr(id) { //扫码支付二维码
    return request({
      url: '/ipark/check_record/scanQr/'+id,
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
