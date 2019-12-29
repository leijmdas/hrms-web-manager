export function getToken() {
  //return Cookies.get(TokenKey)
  let val = window.localStorage.getItem('token_val')
  if(val){
    let tokenTime = localStorage.getItem('token_time')
    let expiresIn = localStorage.getItem('token_expiresIn')
    let expiredTime = parseInt(tokenTime)+expiresIn*1000;
    if(expiredTime<=new Date().getTime()){
      
      removeToken()
      return null
    }

  }
  return val
}

export function setToken(token) {
  let corpIds = token.corpIds||[];
  window.localStorage.setItem('token_val', token.access_token);
  window.localStorage.setItem('token_expiresIn', token.expires_in);
  window.localStorage.setItem('token_time', new Date().getTime());

  return token.access_token
}
export function getCurrentCorpId(){
  return parseInt(window.localStorage.getItem('corpId_current')||1)
}
export function getCurrentUserId(){
  return window.localStorage.getItem('userId')||0
}
export function setCurrentUserId(userId){
  window.localStorage.setItem('userId',userId );
}
export function removeToken() {
  localStorage.removeItem('token_val')
  localStorage.removeItem('token_expiresIn')
  localStorage.removeItem('token_time')
  localStorage.removeItem('userId')
}

export function isLogin() {
  return !!getToken();

}
export function init() {
  let rq = getRequestQuery()
  let tokenVal = rq['access_token']
  let expiresIn = rq['expires_in']
  if (tokenVal) {
    setToken({ access_token: tokenVal, expiresIn })
    console.log('token:'+tokenVal)
  }

}

function getRequestQuery() {
  function getTheReq(str) {
    let theRequest = new Object()
    let strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
    return theRequest
  }

  if (location.search.indexOf('?') != -1) {
    var str = url.substr(1)
    return getTheReq(str)
  } else if (location.hash.indexOf('#/') > -1) {
    var str = location.hash.replace('#/', '');
    return getTheReq(str)
  }
  return new Object()
}

export default{
  init,setToken,removeToken,getToken,isLogin,getCurrentCorpId,getCurrentUserId,setCurrentUserId
}
