// 企业信息
import request from '@/utils/request'
export default {
  get(id){
    return request({
      url: '/api/sys/org/get/' + id,
      method: 'GET'
    })
  },
  save(data){
    return request({
      url: '/api/sys/org/save',
      method: 'POST',
      data
    })
  },
  delete (id) {
    return request({
      url: '/api/sys/org/delete/' + id,
      method: 'POST'
    })
  },
  tree(corpId){
    return request({
      url: '/api/sys/org/tree?corpId=' + corpId,
      method: 'GET'
    })
  },
  microList(data){
    return request({
      url: '/api/sys/org/microList',
      method: 'POST',
      data
    })
  },
}
