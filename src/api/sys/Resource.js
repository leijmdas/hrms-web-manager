// 会员
import request from '@/utils/request'
export default {
  query(data){
    return request({
      url: '/api/sys/resource/query',
      method: 'POST',
      data
    })
  },
  get(id){
    return request({
      url: '/api/sys/resource/get/' + id,
      method: 'GET'
    })
  },
  save(data){
    return request({
      url: '/api/sys/resource/save',
      method: 'POST',
      data
    })
  },
  delete (id) {
    return request({
      url: '/api/sys/resource/delete/' + id,
      method: 'POST'
    })
  },
  queryGroupAndResources () {
    return request({
      url: '/api/sys/resource/queryGroupAndResources',
      method: 'POST'
    })
  },
}
