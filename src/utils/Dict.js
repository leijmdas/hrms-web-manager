import Vue from 'vue';

let Dict = {

    store: {

        // MANAGER_LOGIN_TYPE: [[100, '分公司管理员'], [200, '商户管理员'], [300, '停车场保安']],
        MANAGER_LOGIN_TYPE: [[200, '商户管理员'], [300, '停车场保安']],

        INVOICE_STATUS: [[0, '申请'], [1, '已开票'], [2, '失败']],
        CHARGE_STATUS: [[0, '正常'], [1, '低电量'], [2, '缺电']],

        BILL_APPLY_STATUS: [[1, '未申请'], [2, '待审核'], [3, '审核通过'], [4, '审核不通过'], [5, '已结算']],
        SERVICE_TYPE: [[1, '临停'], [2, '预约']],
        // INVOICE_STATUS: [[1, '停用'], [0, '运行中']],
        TYPE: [[1, '预约型'], [2, '混合型']],
        PARK_PORT_TYPE: [[1, '燃油车'], [2, '新能源']],
        TYPES: [[1, '充值'], [2, '消费'], [3, '退款'], [4, '赠送'], [5, '收益'], [6, '提现']],
        // 帐单生成状态,已经审核不能重新计算了
        BALANCE_STATUS: [[0, '未生成'], [1, '已生成'], [2, '已审核']],
        TESTFLAG: [[0, '正常'], [1, '测试']],
        STTATUS: [[1, '正常'], [0, '异常']],
        STATUSS: [[1, '启用'], [0, '禁用']],
        PUBLISH_STATUS: [[0, '禁用'], [1, '启用'], [2, '预发布']],
        PLATFORM: [[0, 'Ios'], [1, 'Android']],
        ISFORCE: [[false, '否'], [true, '是']],
        APPVERSION: [[0, '东兴旺']],
        STATUSSSS: [[1, '开启'], [0, '关闭']],
        ONSTATUSS: [[1, '有车'], [0, '无车']],
        LOCKERDEVICESTATUS: [[0, '运行正常'], [1, '断线异常']],
        ONLIANSTATUS: [[1, '联网'], [0, '断网']],
        ASSIGNSTATUS: [[1, '已预约'], [0, '未预约']],
        UNASSIGNABLE: [[true, '是'], [false, '否']],
        ISNAVIGATION: [[true, '有'], [false, '无']],
        ROLE_TYPE: [[1, '功能角色'], [2, '数据角色']],
        CORP_TYPE: [[1, '有限责任公司'], [2, '个人独资'], [3, '合伙企业'], [4, '集体所有制企业'], [5, '个体工商户'], [0, '其它']], // 企业类型
        LOCKERINTEGRATEDSTATUS: [[1, '断线异常'], [2, '地锁阻挡异常'], [3, '地磁异常'], [4, '雷达异常'], [0, '正常']],
        LOCKERSTATUS: [[0, '已下降（可预约）'], [1, '下降中'], [2, '已上升'], [3, '上升中']],
        LOCKSTATUS: [[1, '已上升'], [2, '已下降']],
        BIZTYPE: [[0, '钱包'], [1, '停车费'], [2, '预约费']],
        PAY_TYPE: [[0, '钱包'], [1, '微信'], [2, '支付宝'], [3, '好收'], [4, '威富通']],
        ACCOUNT_TYPE: [[1, '普通商户'], [2, '服务商'], [3, '子商户']],

        ACCOUNT_SUBJECT_TYPE: [ [0, '平台'], [1, '子公司'], [2, '物业'], [3, '停车场'], [4, '商家'] ],

        PAY_WAY: [[0, '钱包'], [1, '微信'], [2, '支付宝']],
        GATE_TYPE: [[1, '传统道闸'], [2, '无道闸']],
        PARK_CHANNELTYPE: [[1, '入口'], [2, '出口']], // 停车场通道
        BILL_WAY: [[1, '线下（不算钱）'], [2, '线上（算钱）']], // 计费方式
        PAY_ORDER_STATUS: [[1, '未支付'], [2, '支付成功'], [3, '支付失败'], [4, '转入退款'], [5, '已关闭'], [6, '已冲正'], [7, '已撤销']],
        PARKING_ORDER_STATUS: [[1, '未支付'], [2, '支付成功'], [3, '支付失败'], [0, '已取消'], [4, '已超时'], [5, '已完结']],
        MERCHANT_TYPE: [[1, '普通商户'], [2, '特约商户']],
        PROMOTION_EFFECT_TIMEUNIT: [['day', '天'], ['hour', '小时']],
        PROMOTION_VISIBILITY: [['public', '公开'], ['private', '私有']],
        PROMOTION_STATUS: [[0, '草稿'], [1, '已上架'], [2, '已下架']],
        COUPON_STATUS: [[0, '未使用'], [1, '使用中'], [2, '已使用']],
        SETTLEMENT_TYPE: [[1, '月结'], [2, '周结']],
        // BOOKING_ORDER_STATUS: [[1, '待付款'], [2, '已付款'], [3, '未履约'], [4, '履约中'], [5, '已完结'], [0, '已取消']],
        BOOKING_ORDER_STATUS: [[1, '待付款'], [2, '已付款'], [3, '已降锁'], [5, '已完结'], [0, '已取消']],
        BUSINESSTYPE: [[1, '临停'], [2, '预约'], [3, '联名']],
        PAYWAY: [[-1, '未支付'], [0, '钱包'], [1, '微信'], [2, '支付宝']],
        RIGHTTYPE: [[0, '其它'], [1, '餐饮'], [2, '电影(演出)'], [3, '酒店(住宿)'], [4, '休闲娱乐']],
        ACTIVITY_TYPE: [[100, '邀请码注册送券(新注册用户)'], [101, '老用户邀请(新用户注册)'], [102, '老用户邀请(新用户首次使用)'],
            [103, '预约送券'],
            [201, 'BANNER图1'],
            [202, 'BANNER图2'],
            [203, 'BANNER图3'],
            [204, 'BANNER图4'],
            [205, 'BANNER图5']
        ]
    },
        getEntry: function (key, storeArr) {
            let arr = storeArr || [];
            return arr.find((entry) => entry[0] == key);
        },
        getText: function (key, storeArr) {
            let tmp = this.getEntry(key, storeArr);
            return tmp ? tmp[1] : '-';
        }
    };
Vue.prototype.$dict = Dict;
export default Dict;
