/**
 * 访问记录
 */
import request from '@/utils/request'

export default {

    /**
     * 查询
     */
    query(data) {
        return request({
            url: '/ipark/access_info/query',
            method: 'POST',
            data
        })
    },
    queryAccess(data) {
        return request({
            url: '/ipark/access_info/queryAccess',
            method: 'POST',
            data
        })
    },
    getEchartsOut(parkId, date) {
        return request({
            url: '/ipark/access_info/getChu?parkId=' + parkId + '&leaveOn=' + date,
            method: 'GET'
        })
    },
    getEchartsIn(parkId, date) {
        return request({
            url: '/ipark/access_info/getRu?parkId=' + parkId + '&entryOn=' + date,
            method: 'GET'
        })
    }
}
