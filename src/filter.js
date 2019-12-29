/**
 * Created by yejunqin on 2016/6/23.
 * vue过滤器
 */
export default {
  install(Vue){
    //过滤为数字，并保留两位小数，可为负
    Vue.filter('decimal', (val) => {
      val = + val
      return val ? val.toFixed(2) : '0.00'
    })
    
    //转换为大写字母
    Vue.filter('upper', {
      read: val => {
        return val
      },
      write: val => {
        return val.toUpperCase()
      }
    })
    //过滤整数以外
    Vue.filter('integer', {
      read: val => {
        return +val ? +val : 0
      },
      write: val => {
        let number = +val.replace(/[^\d\-]/g, '')
        return isNaN(number) ? 0 : parseInt(number)
      }
    })
    //过滤数字、字母以外
    Vue.filter('letterAndNum', {
      read: val => {
        return val
      },
      write: val => {
        return val.replace(/[^a-zA-Z0-9]/g, '')
      }
    })
    //过滤数字以外
    Vue.filter('number', {
      read: val => {
        return val
      },
      write: val => {
        return val.replace(/[^0-9]/g, '')
      }
    })
    //过滤数字和逗号以外
    Vue.filter('numberAndComma', {
      read: val => {
        return val
      },
      write: val => {
        return val.replace(/[^0-9,]/g, '')
      }
    })
    //过滤字母以外
    Vue.filter('letter', {
      read: val => {
        return val.toUpperCase()
      },
      write: val => {
        return val.replace(/[^a-zA-Z]/g, '')
      }
    })
    //时间格式化
    Vue.filter('dateFormat', (date, format) => {
      if(!date){
        return '';
      }
      var date = new Date(date);
      var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
      };
      format = format.replace(/([yMdhmsqS])+/g, function(all, t){
        var v = map[t];
        if(v !== undefined){
          if(all.length > 1){
            v = '0' + v;
            v = v.substr(v.length-2);
          }
          return v;
        }
        else if(t === 'y'){
          return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
      });
      return format;
    })
    // 特殊字符
    Vue.filter('specialChar', (string, format) => {
      if(!string){
        return '';
      }
      if (format === 'ok') {
        return '√'
      }
    })
  }
}
