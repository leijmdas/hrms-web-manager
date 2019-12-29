import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  query(data) {
    return request({
      url: '/ipark/excel/query',
      method: 'POST',
      data
    })
  },
  queryImportRecordDetail(data) {
    return request({
      url: '/ipark/excel/queryImportRecordDetail',
      method: 'POST',
      data
    })
  },
  downloadParkPort(data){
    return request({
        url: '/ipark/excel/downloadParkPortModel',
        method: 'GET',
        responseType: 'blob',
        params:data
      })
  }
}
