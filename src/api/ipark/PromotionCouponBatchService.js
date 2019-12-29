import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/promotion/couponBatch/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/promotion/couponBatch/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/promotion/couponBatch/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/promotion/couponBatch/delete/'+id,
      method: 'POST'
    })
  },
  summaryGroupByBatchNos(idArr){ //按ID统计发送、已用
    return request({
      url: '/ipark/promotion/couponBatch/summaryGroupByBatchNos',
      method: 'POST',
      data:idArr
    })
  },
  receiveCoupon(id, params) {
    return request({
      url: '/ipark/promotion/couponBatch/receiveCoupon/'+id,
      method: 'POST',
      params
    })
  },
  genCoupons(id){
    return request({
      url: '/ipark/promotion/couponBatch/genCoupons/'+id,
      method: 'POST'
    })
  }
}
