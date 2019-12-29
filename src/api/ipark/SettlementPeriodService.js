import request from '@/utils/request'


export default {
    /**
     * 查询结算日志
     */
    queryBalanceLog(data) {
        return request({
            url: '/ipark/settlement_period/queryBalanceLog',
            method: 'POST',
            data
        })
    },
    /**
     * 单帐期单个商户统计
     */
    execMerchantTask(periodId, merchantId) {
        return request({
            url: '/ipark/settlement_period/execMerchantTask?periodId=' + periodId + "&merchantId=" + merchantId,
            method: 'GET'
        })
    },
    /**
     * 单帐期所有商户统计
     */
    execTask(periodId) {
        return request({
            url: '/ipark/settlement_period/execTask?periodId=' + periodId,
            method: 'GET'
        })
    },

    /**
     * 查询
     */
    query(data) {
        return request({
            url: '/ipark/settlement_period/query',
            method: 'POST',
            data
        })
    },
    flushAll() {
        return request({
            url: '/ipark/settlement_period/flushAll',
            method: 'POST'
        })
    },
    /**
     * 查询结算周期
     */
    queryPeriod() {
        return request({
            url: '/ipark/takeout_apply/queryPeriod',
            method: 'POST'
        })
    },
    /**
     * 查询提现审核记录
     */
    queryTakeout(data) {
        return request({
            url: '/ipark/takeout_apply/query',
            method: 'POST',
            data
        })
    },
    /**
     * 保存提现审核记录
     */
    updateTakeout(data) {
        return request({
            url: '/ipark/takeout_apply/update',
            method: 'POST',
            data
        })
    },

    /**
     * 保存帐单状态
     */
    updateStatusById(id,status) {
        return request({
            url: '/ipark/takeout_apply/updateStatusById?id='+id+"&status="+status,
            method: 'POST'
        })
    }



}
