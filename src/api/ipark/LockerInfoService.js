import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/locker_info/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/locker_info/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/locker_info/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/locker_info/delete/'+id,
      method: 'POST'
    })
  },
  scanQr(id) { //扫码支付二维码
    return request({
      url: '/ipark/locker_info/scanQr/'+id,
      method: 'POST'
    })
  },
  bindCorp(id,params){ //绑定企业关系
    return request({
      url: '/ipark/locker_info/bindCorp/'+id,
      method: 'POST',
      data:params
    })
  },
  queryid(id) {
    return request({
      url: '/ipark/locker_info/queryid/' +  id,
      method: 'POST',
    })
  },
  queryids(parkId,lockerIds) {
    return request({
      url: '/ipark/locker_info/queryids/' + parkId+ '/' + lockerIds,
      method: 'POST',
    })
  }
}
