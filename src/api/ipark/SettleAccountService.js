import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/settle_account/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/settle_account/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/settle_account/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/settle_account/delete/'+id,
      method: 'POST'
    })
  },
  alipayAuthScanQr(id) {
    return request({
      url: '/ipark/settle_account/alipayAuthScanQr/' + id,
      method: 'GET'
    })
  }
}
