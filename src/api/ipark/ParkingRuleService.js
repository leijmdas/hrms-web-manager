import request from '@/utils/request'
export default {

  save(data) {
    return request({
      url: '/ipark/parking_rule/save',
      method: 'POST',
      data
    })
  },
  findRule(parkId,type){ //获取计费规则
    return request({
      url: '/ipark/parking_rule/rule/'+parkId+'/'+type,
      method: 'GET'
    })
  }
}
