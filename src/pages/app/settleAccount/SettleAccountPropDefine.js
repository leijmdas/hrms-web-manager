//商户属性定义

let def0 = {
    type:0,
    name:'微信',
    fields:[]
}

let def1 = {
    type:1,
    name:'微信',
    fields:[{
        name:'公众号APPID',
        key:'app.id',
        accountType:[2],
        required:true
    },{
        name:'商户ID',
        key:'mch.id',
        accountType:[1,2],
        required:true
    },{
        name:'商户KEY',
        key:'mch.key',
        accountType:[1,2],
        required:true
    },{
        name:'服务商',
        key:'vMch.id',
        type: 'vMchSel',
        accountType:[3],
        required:true
    },{
        name:'子商户ID',
        key:'subMch.id',
        accountType:[3],
        required:true
    }]
}

let def2 = {
    type:2,
    name:'支付宝',
    fields:[{
        name:'APPID',
        key:'appId',
        accountType:[1,2],
        required:true
    },{
        name:'私钥',
        key:'privateKey',
        accountType:[1,2],
        required:true
    },{
        name:'公钥',
        key:'publicKey',
        accountType:[1,2],
        required:true
    },{
        name:'签名类型',
        key:'signType',
        accountType:[1,2],
        defaultValue: 'RSA2'
    },{
        name:'AES密钥',
        key:'aesKey',
        accountType:[1,2],
        required:true
    },{
        name:'服务商',
        key:'vMchId',
        type: 'vMchSel',
        accountType:[3],
        required:true
    },{
        name:'商户ID',
        key:'sellerId',
        accountType:[3],
        required:true
    },{
        name:'AUTH_TOKEN',
        key:'appAuthToken',
        accountType:[3],
        required:false
    },{
        name:'REF_TOKEN',
        key:'appRefreshToken',
        accountType:[3],
        required:false
    }]
}

let def3 = {
    type:3,
    name:'好收',
    fields:[{
        name:'APPID',
        key:'app.id',
        accountType:[3],
        required:true
    },{
        name:'门店ID',
        key:'store.id',
        accountType:[3],
        required:true
    }]
}

let def4 = {
    type:4,
    name:'威富通',
    fields:[{
        name:'商户ID',
        key:'mch.id',
        accountType:[3],
        required:true
    },{
        name:'商户KEY',
        key:'mch.key',
        accountType:[3],
        required:true
    }]
}
let defs = []
defs.push(def0,def1,def2,def3,def4);

export function getPropFields(type){
    let rs = defs.filter(d=>d.type==type);
    if(rs.length<1) return []
    return rs[0].fields;
}
export const defines = defs
