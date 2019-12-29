// 会员
import request from '@/utils/request'
export default {
  query(data){
    return request({
      url: '/api/sys/role/query',
      method: 'POST',
      data
    })
  },
  get(id){
    return request({
      url: '/api/sys/role/get/' + id,
      method: 'GET'
    })
  },
  save(data){
    return request({
      url: '/api/sys/role/save',
      method: 'POST',
      data
    })
  },
  delete (id) {
    return request({
      url: '/api/sys/role/delete/' + id,
      method: 'POST'
    })
  },
  findResourceIds (id) {
    return request({
      url: '/api/sys/role/findResourceIds/' + id,
      method: 'GET'
    })
  },
  assignRoleResources (id, data) {
    return request({
      url: '/api/sys/role/assignRoleResources/' + id,
      method: 'POST',
      data
    })
  },
  microList (data) {
    return request({
      url: '/api/sys/role/microList/',
      method: 'POST',
      data
    })
  },
}
