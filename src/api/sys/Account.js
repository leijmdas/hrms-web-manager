// 企业信息
import request from '@/utils/request'
export default {
  query(data){
    return request({
      url: '/sys/account/query',
      method: 'POST',
      data
    })
  },
  get(id){
    return request({
      url: '/sys/account/get/' + id,
      method: 'GET'
    })
  },
  save(data){
    return request({
      url: '/sys/account/save',
      method: 'POST',
      data
    })
  },
  microList(data){
    return request({
      url: '/sys/account/microList',
      method: 'POST',
      data
    })
  },
  modifyPwd(data){ //修改密码
    return request({
      url: '/sys/account/modifyPwd',
      method: 'POST',
      data
    })
  }
}
