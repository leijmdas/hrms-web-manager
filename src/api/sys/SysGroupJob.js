// 会员
import request from '@/utils/request'
export default {
  query(data){
    return request({
      url: '/api/sys/jopgroup/query',
      method: 'POST',
      data
    })
  },
  get(id){
    return request({
      url: '/api/sys/jopgroup/get/' + id,
      method: 'GET'
    })
  },
  
  save (item) {
    return request({
      url: '/api/sys/jopgroup/save',
      method: 'POST',
      data:item
    })
  },
  deleteItem (id) {
    return request({
      url: '/api/sys/dict/deleteItem/'+id,
      method: 'POST'
    })
  },
  findByCode(code){
    return request({
      url: '/api/sys/dict/findByCode?code='+code,
      method: 'GET'
    })
  }
  
}
