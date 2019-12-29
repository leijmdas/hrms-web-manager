// 会员
import request from '@/utils/request'
export default {
  query(data){
    return request({
      url: '/api/sys/httpjob/query',
      method: 'POST',
      data
    })
  },
  get(id){
    return request({
      url: '/api/sys/httpjob/get/' + id,
      method: 'GET'
    })
  },  
  save (item) {
    return request({
      url: '/api/sys/httpjob/save',
      method: 'POST',
      data:item
    })
  },
  pause (id) {
    return request({
      url: '/api/sys/httpjob/pause/' + id,
      method: 'POST'
    })
  },
  resume (id) {
    return request({
      url: '/api/sys/httpjob/resume/' + id,
      method: 'POST'
    })
  }
  
}
