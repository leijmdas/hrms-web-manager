import Vue from 'vue';

let DongxwDict = {

    store: {

        MONEY_TYPE: [[100, '人民币'], [200, '美元'], [300, '港币']],
        PLAN_STATUS: [[0, '草稿'], [10, '进行中'], [20, '完成'], [30, '取消']],
        STATUS: [[1, '启用'], [0, '禁用']],
        ORDER_STATUS: [[0, '草稿'], [1, '下单'], [2, '在生产'], [3, '生产完成'], [4, '发货完成'], [5, '收款完成']],


    },
    getEntry: function (key, storeArr) {
        let arr = storeArr || [];
        return arr.find((entry) => entry[0] == key);
    },
    getText: function (key, storeArr) {
        let tmp = this.getEntry(key, storeArr);
        return tmp ? tmp[1] : '-';
    },
    viewDate: function ( d ) {
        return d ? d.substr(0,10) : '-';

    },

    formatDatetime: function(now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
    },

    formatDate: function (now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        return year + '-' + month + '-' + date;
    },
    formatDateZero: function (now) {
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        return year + '-' + month + '-' + date + ' 00:00:00';
    }

};
Vue.prototype.$dongxwDict = DongxwDict;
export default DongxwDict;
