// 发票记录
import request from '@/utils/request'
export default {
  query(data){
    return request({
      url: '/sys/invoice_configuration/query',
      method: 'POST',
      data
    })
  }
}
