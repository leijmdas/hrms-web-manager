import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/branch_company/query',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/branch_company/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/branch_company/get/'+id,
      method: 'GET'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/branch_company/delete/'+id,
      method: 'POST'
    })
  },
}
