import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/park_info/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/park_info/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/park_info/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/park_info/delete/'+id,
      method: 'POST'
    })
  },
  scanQr(id) { //扫码支付二维码
    return request({
      url: '/ipark/park_info/scanQr/'+id,
      method: 'POST'
    })
  },
  bindCorp(id,params){ //绑定企业关系
    return request({
      url: '/ipark/park_info/bindCorp/'+id,
      method: 'POST',
      data:params
    })
  },
  syncToBase(code){ //同步至中间库
    return request({
      url: '/ipark/park_info/syncToBase/'+code,
      method: 'POST',
    })
  },
  syncToCBase(code){ //同步中间库到厂库
    return request({
      url: '/ipark/park_info/syncToCBase/'+code,
      method: 'POST',
    })
  },
}
