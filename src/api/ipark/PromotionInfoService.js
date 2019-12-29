import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/promotion_info/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/promotion_info/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/promotion_info/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/promotion_info/delete/'+id,
      method: 'POST'
    })
  },
  getRuleDefs(params){ //查询规则定义
    return request({
      url: '/ipark/promotion_info/ruleDefs',
      method: 'GET'
    })
  },
  summaryGroupByPromotionId(idArr){ //按ID统计发送、已用
    return request({
      url: '/ipark/promotion_info/summaryGroupByPromotionId',
      method: 'POST',
      data:idArr
    })
  },
  genCoupons(data){
    return request({
      url: '/ipark/promotion_info/genCoupons',
      method: 'POST',
      data
    })
  },
  updateStatus(id,status){
    return request({
      url: '/ipark/promotion_info/updateStatus/'+id+'/'+status,
      method: 'POST'
    })
  }
}
