import Vue from 'vue'

// --表单验证 --

const validator = {
  // 手机号验证
  isValidPhone(rule, value, callback){
    if(!value){
      if(rule.required){
        return callback(new Error('手机号不能为空'));
      }
      return callback()
      
    }
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    if(reg.test(value)){
      return callback()
    } else {
      return callback(new Error('手机号格式不正确'))
    }
  },
  isValidPositionNo(rule,value,callback){
    if(!value){
      if(rule.required){
        return callback(new Error('仓位不能为空'));
      }
      return callback()
    }
    const reg = /^[0-9A-Za-z_-]{1,64}$/;
    if(reg.test(value)){
      return callback()
    } else {
      return callback(new Error('格式不正确[仓位格式：数字、字母、-、_或其组合,最长不得超过64]'))
    }
  },
  isValidVinCode(rule,value,callback){
    if(!value){
      if(rule.required){
        return callback(new Error('VIN码不能为空'));
      }
      return callback()
    }
    const reg = /^[0-9A-Za-z_-]{17}$/;
    if(reg.test(value)){
      return callback()
    } else {
      return callback(new Error('格式不正确[格式：17位数字、字母、-、_或其组合]'))
    }
  }
}

Vue.prototype.$validator = validator
export default validator