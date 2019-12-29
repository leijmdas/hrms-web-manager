<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="预约信息" name="first">
                <div class="content">
                    <div><span>订单编号：</span> <span>{{entity.orderNo}}</span></div>
                    <div><span>用户名：</span> <span>{{entity.userInfo.username}}</span></div>
                    <div><span>车牌号：</span> <span>{{entity.plateNumber}}</span></div>
                    <div><span>物业名称：</span> <span>{{entity.merchantInfo.name}}</span></div>
                    <div><span>停车场名称：</span> <span>{{entity.parkInfo.name}}</span></div>
                    <div><span>泊位编码：</span> <span>{{entity.portCode}}</span></div>
                    <div><span>车位锁编码：</span> <span>{{entity.lockCode}}</span></div>
                    <div><span>预约达到时间：</span> <span>{{entity.parkingStartOn}}</span></div>
                    <div><span>预计离场时间：</span> <span>{{entity.parkingEndOn}}</span></div>
                    <div><span>预约时长：</span> <span>{{entity.timeLong}}</span></div>
                    <div><span>预约费用：</span> <span>{{entity.totalAmount}}元</span></div>
                    <div><span>状态：</span> <span>{{$dict.getText(entity.status,$dict.store.BOOKING_ORDER_STATUS)}}</span></div>
                    <div><span>创建时间：</span> <span>{{entity.createOn}}</span></div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="泊位信息" name="second">
                <div class="content">
                    <div><span>泊位编码：</span> <span>{{entity.portCode}}</span></div>
                    <div><span>停车场：</span> <span>{{entity.parkInfo.name}}</span></div>
                    <div class="falseInput">
                        <span>楼层：</span>
                        <floor-select :disabled="disabled" v-model="entity.floorId" :parkId="entity.parkId"></floor-select>
                    </div>
                    <div class="falseInput">
                        <span>区域：</span>
                        <area-select :disabled="disabled" v-model="entity.areaId" :floorId="entity.floorId"></area-select>
                    </div>
                    <div><span>当前状态：</span> <span>{{$dict.getText(entity.currentStatus,$dict.store.STTATUS)}}</span></div>
                    <div><span>电量状态：</span> <span>{{entity.electricQuantity}}</span></div>
                    <div><span>分配状态：</span> <span>{{$dict.getText(entity.assignStatus,$dict.store.ASSIGNSTATUS)}}</span></div>
                    <div><span>网络状态：</span> <span>{{$dict.getText(entity.onlineStatus,$dict.store.ONLIANSTATUS)}}</span></div>
                    <div><span>是否可分配：</span> <span>{{$dict.getText(!entity.unassignable,$dict.store.UNASSIGNABLE)}}</span></div>
                    <div><span>在位状态：</span> <span>{{$dict.getText(entity.onstatus,$dict.store.ONSTATUSS)}}</span></div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style rel="stylesheet/less" lang="less">
    .content {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        &>div{
            width: 50%;
            line-height: 40px;
            span:first-child{
                display: inline-block;
                width: 120px;
                text-align: right;
                color: #333;
            }
            span:last-child{
                color: #999;
            }
        }
        .falseInput {
            .el-input__inner{
                padding-left: 0;
                background: #fff;
                color: #999;
                border: none;
                font-size: 14px;
            }
            .el-select__caret.el-input__icon.el-icon-arrow-up{
                display: none;
            }
        }
    }
</style>
<script>
    import FloorSelect from '@/components/widgets/FloorSelect'
    import AreaSelect from '@/components/widgets/AreaSelect'

    const defaultEntity = {
        orderNo: '', // 订单编号
        userInfo: {}, // 用户信息
        plateNumber: '', // 车牌号
        parkingStartOn: '', // 开始时间
        parkingEndOn: '', // 结束时间
        timeLong: '', // 预约时长
        totalAmount: 0, // 预约费用
        status: 0, // 订单状态
        createOn: '', // 创建时间
        parkingPortId: '', // 泊位编码
        lockCode: '', // 车位锁编码
        parkingLocation: '', // 楼层
        merchantInfo: {}, // 商户信息
        parkInfo: {} // 停车场信息
    };
    export default {
        components: {FloorSelect, AreaSelect},
        name: 'Form',
        data() {
            return {
                disabled: true,
                activeName: 'first',
                entity: _.cloneDeep(defaultEntity)
            };
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
                this.$api.ipark.ParkPortService.get(this.entity.parkingPortId).then(rsp => {
                    this.$set(this.entity, 'electricQuantity', rsp.electricQuantity);
                    this.$set(this.entity, 'floorId', rsp.floorId);
                    this.$set(this.entity, 'onlineStatus', rsp.onlineStatus);
                    this.$set(this.entity, 'assignStatus', rsp.assignStatus);
                    this.$set(this.entity, 'areaId', rsp.areaId);
                    this.$set(this.entity, 'currentStatus', rsp.status);
                    this.$set(this.entity, 'unassignable', rsp.unassignable);
                    this.$set(this.entity, 'onstatus', rsp.onstatus);
                });
            },
            // 获取传入弹框数据
            init(options) {
                this.activeName = 'first';
                this.entity = options
            }
        },
        mounted() {
            this.$on('init', this.init);
        }
    }
</script>

