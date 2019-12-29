import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/park_channel/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/park_channel/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/park_channel/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/park_channel/delete/'+id,
      method: 'POST'
    })
  },
  scanQr(id) { //二维码
    return request({
      url: '/ipark/park_channel/scanQr/'+id,
      method: 'POST'
    })
  },
}
