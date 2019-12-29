// 会员
import request from '@/utils/request'
export default {
  query(data){
    return request({
      url: '/api/sys/user/query',
      method: 'POST',
      data
    })
  },
  get(id){
    return request({
      url: '/api/sys/user/get/' + id,
      method: 'GET'
    })
  },
  save(data){
    return request({
      url: '/api/sys/user/save',
      method: 'POST',
      data
    })
  },
  delete (id) {
    return request({
      url: '/api/sys/user/delete/' + id,
      method: 'POST'
    })
  },
  findRoleIds (id, type) {
    return request({
      url: '/api/sys/user/findRoleIds/' + id + '?type=' + type,
      method: 'GET'
    })
  },
  assignRoles (id, roleType, data) {
    return request({
      url: '/api/sys/user/assignRoles/'+roleType+'/' + id,
      method: 'POST',
      data
    })
  },
  findUserByKeywords(params){
    return request({
      url: '/api/sys/user/findByKeywords',
      method: 'GET',
      params:params
    })
  },
  modifyPwd(data){ //修改密码
    return request({
      url: '/api/sys/user/modifyPassword',
      method: 'POST',
      data
    })
  }
}
