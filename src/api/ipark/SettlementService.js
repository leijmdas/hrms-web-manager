import request from '@/utils/request'
export default {

  save(data) {
    return request({
      url: '/ipark/settlement/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/settlement/get/'+id,
      method: 'GET'
    })
  },
  findByMerchantId(id) {
    return request({
      url: '/ipark/settlement/merchant/'+id,
      method: 'GET'
    })
  },
}
