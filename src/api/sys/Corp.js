// 企业信息
import request from '@/utils/request'
export default {
  get(){
    return request({
      url: '/api/sys/corp/get',
      method: 'GET'
    })
  },
  save(data){
    return request({
      url: '/api/sys/corp/save',
      method: 'POST',
      data
    })
  },
  microList(data){
    return request({
      url: '/api/sys/corp/microList',
      method: 'POST',
      data
    })
  },
}
