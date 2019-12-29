import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  queryWAndUser(data) {
    return request({
      url: '/ipark/wallet_order/queryWAndUser',
      method: 'POST',
      data
    })
  },
  giveAmount(data) {
    return request({
      url: '/ipark/wallet/giveAmount',
      method: 'POST',
      data
    })
  },
}
