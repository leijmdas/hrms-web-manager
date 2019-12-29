/**
 * 活动规则
 */
import request from '@/utils/request'

export default {

    /**
     * 查询
     */
    query(data) {
        return request({
            url: '/ipark/act_master/query',
            method: 'POST',
            data
        })
    },
    /**
     * 保存
     */
    save(data) {
        return request({
            url: '/ipark/act_master/save',
            method: 'POST',
            data
        })
    },

    /**
     * 保存图片
     */
    updateImg(data) {
        return request({
            url: '/ipark/act_master/updateImg',
            method: 'POST',
            data
        })
    },
    /**
     * 根据id查询单条记录
     */
    get(id) {
        return request({
            url: `/ipark/act_master/get/${id}`,
            method: 'GET'
        })
    },
    /**
     * 删除
     */
    delete(id) {
        return request({
            url: `/ipark/act_master/delete/${id}`,
            method: 'POST'
        })
    },
    /**
     * 配置模板时的查询
     */
    queryLeft(data) {
        return request({
            url: '/ipark/ticket/queryLeft',
            method: 'POST',
            data
        })
    },
    /**
     * 保存配置模板中的优惠券
     */
    saveCoupon(data) {
        return request({
            url: '/ipark/ticket/save',
            method: 'POST',
            data
        })
    },
    /**
     * 删除配置模板中的优惠券
     */
    deleteCoupon(id) {
        return request({
            url: `/api//ipark/ticket/delete/${id}`,
            method: 'POST',
        })
    }




}
