import request from '@/utils/request'
export default {

  /**
   * 查询
   */
  findCouponReport(data) {
    return request({
      url: '/ipark/report/findCouponReport',
      method: 'POST',
      data
    })
  },
  /**
   * 查询停车报表
   * @param {*} data
   */
  findParkingReport(data) {
    return request({
      url: '/ipark/report/findParkingReport',
      method: 'POST',
      data
    })
  },
  findCurrentDayParkingReport() {
    return request({
      url: '/ipark/report/findCurrentDayParkingReport',
      method: 'POST'
    })
  }
}
