import request from '@/utils/request';

export default {
    /**
     * 查询加地锁条件
     */
    queryLeft(data) {
        return request({
            url: '/ipark/park_port/queryLeft',
            method: 'POST',
            data
        });
    },
    /**
     * 查询
     */
    query(data) {
        return request({
            url: '/ipark/park_port/query',
            method: 'POST',
            data
        });
    },
    queryLeft(data) {
    return request({
      url: '/ipark/park_port/queryLeft',
      method: 'POST',
      data
    });
  },
  querylockorder(data) {
    return request({
      url: '/ipark/park_port/querylockorder',
      method: 'POST',
      data
    });
  },
  save(data) {
    return request({
      url: '/ipark/park_port/save',
      method: 'POST',
      data
    });
  },
  get(id) {
    return request({
      url: '/ipark/park_port/get/'+id,
      method: 'GET'
    });
  },
  delete(id) {
    return request({
      url: '/ipark/park_port/delete/'+id,
      method: 'POST'
    });
  },
  scanQr(id) { //扫码支付二维码
    return request({
      url: '/ipark/park_port/scanQr/'+id,
      method: 'POST'
    });
  },
  bindCorp(id,params){ //绑定企业关系
    return request({
      url: '/ipark/park_port/bindCorp/'+id,
      method: 'POST',
      data:params
    });
  }
};
