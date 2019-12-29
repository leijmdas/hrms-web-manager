import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/invoice_order/query',
      method: 'POST',
      data
    })
  },
  queryInvoice(data) {
    return request({
      url: '/ipark/invoice_configuration/queryInvoice',
      method: 'POST',
      data
    })
  },
  save(data) {
    return request({
      url: '/ipark/invoice_configuration/save',
      method: 'POST',
      data
    })
  },
  get(id) {
    return request({
      url: '/ipark/invoice_configuration/get/'+id,
      method: 'GET'
    })
  },
  changeS(id,status) {
    return request({
      data:{
        id,
        status
      },
      url: '/ipark/invoice_configuration/changeS/',
      method: 'POST'
    })
  },
  delete(id) {
    return request({
      url: '/ipark/invoice_configuration/delete/'+id,
      method: 'POST'
    })
  }
}
