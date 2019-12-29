// import ParkInfoService from './ParkInfoService'
// import CorpInfoService from './CorpInfoService'
// import AccessInfoService from './AccessInfoService'
// import UserInfoService from './UserInfoService'
// import AreaInfoService from './AreaInfoService'
// import SettleAccountService from './SettleAccountService'
// import MerchantInfoService from './MerchantInfoService'
// import PromotionInfoService from './PromotionInfoService'
// import PromotionCouponService from './PromotionCouponService'
// import PayOrderService  from './PayOrderService'
// import ParkingOrderService  from './ParkingOrderService'
// export default {
//     ParkInfoService,
//     CorpInfoService,
//     AccessInfoService,
//     UserInfoService,
//     AreaInfoService,
//     SettleAccountService,
//     MerchantInfoService,
//     PromotionInfoService,
//     PromotionCouponService,
//     PayOrderService,
//     ParkingOrderService
// }

var context = require.context('./', false,/\.js$/);
let services = context
  .keys()
  .filter(item => item !== './index.js')

let serviceMap = {}
var reg = new RegExp( '(\.\/)|(\.js)' , "g" )
services.forEach(s => {
    serviceMap[s.replace(reg,'')] = context(s).default;
});
export default serviceMap;