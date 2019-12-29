<!-- 预约订单管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <!--<el-row>-->
                    <!--<el-col :span="6">-->
                        <el-form-item label="订单创建时间">
                            <div slot="label">
                                <el-select v-model="dateRangeType" style="width:120px" class="formitem-label">
                                    <el-option value="createOn" label="下单时间"></el-option>
                                    <el-option value="orderTime" label="预约时间"></el-option>
                                </el-select>
                            </div>
                            <el-date-picker
                                v-model="dateRange"
                                type="daterange"
                                :default-time="['00:00:00', '23:59:59']"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                            ></el-date-picker>
                        </el-form-item>
                    <!--</el-col>-->
                    <el-form-item label="物业名称">
                        <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
                    </el-form-item>
                    <el-form-item label="停车场">
                        <park-select :merchantId="page.query.param.merchantId" v-model="page.query.param.parkId"
                                     :clearable="true"></park-select>
                    </el-form-item>
                <!--</el-row>-->
                <!--<el-row>-->
                    <!--<el-col :span="6">-->
                        <el-form-item label="订单编号">
                            <el-input v-model="page.query.param.orderNo"></el-input>
                        </el-form-item>
                    <!--</el-col>-->
                    <el-form-item label="泊位编码">
                        <!--<port-select v-model="page.query.param.parkingPortId" :clearable="true"></port-select>-->
                        <el-input v-model="page.query.param.portCode"></el-input>
                    </el-form-item>
                    <el-form-item label="车位锁编码">
                        <el-input v-model="page.query.param.lockCode"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="车牌号">-->
                    <!--<el-input v-model="page.query.param.plateNumber" style="width:120px"></el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item label="用户名">
                        <user-select v-model.number="page.query.param.userId" :clearable="true"></user-select>
                    </el-form-item>
                    <el-form-item label="订单状态" >
                        <el-select v-model="page.query.param.status" :clearable="true">
                            <el-option v-for="item in $dict.store.BOOKING_ORDER_STATUS" :key="item[0]" :value="item[0]" :label="item[1]">
                            </el-option>
                        </el-select>
                    </el-form-item>
                <el-form-item>
                        <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                        <el-button @click="cancel">取消</el-button>
                        <el-button type="success" @click="exportRecords">导出</el-button>
                    </el-form-item>
                <!--</el-row>-->
            </el-form>
        </div>
        <v-table ref="table" :page="page" class="panel-main" :table-minheight="450">
            <el-table-column prop="orderNo" label="订单编码" width="140"></el-table-column>
            <el-table-column prop="username" label="用户名" width="120">
                <template slot-scope="{row}">{{(row.userInfo||{}).username}}</template>
            </el-table-column>
            <el-table-column prop="plateNumber" label="车牌号" width="100"></el-table-column>
            <el-table-column prop="name" label="物业名称" width="140">
                <template slot-scope="{row}">{{(row.merchantInfo||{}).name}}</template>
            </el-table-column>
            <el-table-column prop="parkInfoName" label="停车场" width="180">
                <template slot-scope="{row}">{{(row.parkInfo||{}).name}}</template>
            </el-table-column>
            <el-table-column prop="portCode" label="泊位编码" width="120">
                <!--<template slot-scope="{row}">{{(row.parkPort||{}).code}}</template>-->
            </el-table-column>
            <el-table-column prop="lockCode" label="车位锁编码" width="120"></el-table-column>
            <el-table-column prop="parkingStartOn" label="预约到达时间" width="140"></el-table-column>
            <!--<el-table-column prop="parkingEndOn" label="结束时间" width="140"></el-table-column>
            <el-table-column prop="parkingPortId" label="车位编号" width="140"></el-table-column>-->
            <el-table-column prop="timeLong" label="预约时长（分钟）" width="120"></el-table-column>
            <el-table-column label="预计停车时长（分钟）" width="150">
                <!-- 根据parkingStartOn和parkingEndOn计算出预计停车时长 -->
                <template slot-scope="{row}">{{getTimeStamp(row.parkingEndOn, row.parkingStartOn)}}</template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="应收预约费（元）" width="120"></el-table-column>
            <el-table-column prop="discountAmount" label="优惠金额（元）" width="120"></el-table-column>
            <el-table-column prop="actualAmount" label="实收预约费（元）" width="120"></el-table-column>
            <el-table-column prop="prepaymentAmount" label="预付停车费（元）" width="150"></el-table-column>
            <el-table-column prop="isPrepaymentRefund" label="是否退款" width="100">
                <template slot-scope="{row}">{{!!row.isPrepaymentRefund ? '是' : '否'}}</template>
            </el-table-column>
            <el-table-column prop="isPrepaymentRefund" label="退款金额（元）" width="120">
                <template slot-scope="{row}"><span v-if="row.isPrepaymentRefund">{{row.prepaymentAmount}}</span></template>
            </el-table-column>
            <el-table-column prop="status" width="80" label="订单状态">
                <template slot-scope="{row}">{{$dict.getText(row.status,$dict.store.BOOKING_ORDER_STATUS)}}</template>
            </el-table-column>
            <el-table-column prop="createOn" width="140" label="下单时间">
                <template slot-scope="{row}">{{row.createOn}}</template>
            </el-table-column>
            <el-table-column prop="payWay" label="支付方式" width="100">
                <template slot-scope="{row}">{{$dict.getText(row.payWay,$dict.store.PAYWAY)}}</template>
            </el-table-column>
            <el-table-column label="操作" :fixed="'right'">
                <template slot-scope="scope">
                    <el-button type="text" title="详情" @click="openDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </v-table>
        <v-dialog title="订单详情" ref="detailDiag" width="800px">
            <form-panel></form-panel>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
    import ParkSelect from '@/components/widgets/ParkSelect';
    import PortSelect from '@/components/widgets/PortSelect';
    import FormPanel from './Form';
    import MerchantSelect from '@/components/widgets/MerchantSelect';
    import UserSelect from '@/components/widgets/UserSelect.vue';

    export default {
        components: {ParkSelect, PortSelect, FormPanel, MerchantSelect,UserSelect},
        data() {
            return {
                formStatus: 1,
                dateRange: [],
                dateRangeType: 'createOn',
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            isdelete: false,
                            plateNumber: '',
                            orderNo: '',
                            userId: '',
                            creatingStartOn: '',
                            creatingEndOn: '',
                            parkingEndOn: '',
                            parkingStartOn: '',
                            merchantId: '',
                            lockCode: '',
                            parkingPortId: ''
                        }
                    },
                    getData: this.$api.ipark.BookingOrderService.query
                }
            };
        },

        computed: {},

        methods: {
            create() {
                this.formStatus = 1;
                this.$refs.formPanel.init({});
            },
            openDetail(row) {
                this.formStatus = 2;
                this.$refs.detailDiag.show(row);
            },
            init() {
                this.search();
                // this.$refs.table.load();
            },
            cancel() {
                this.dateRange = [];
                this.page.query = {
                    orderBys: 'id|desc',
                    param: {
                        isdelete: false
                    }
                };
                this.search();
            },
            /**
             * 查询
             */
            search() {
                // console.log(this.dateRange)
                // console.log(this.dateRangeType)
                if (this.dateRangeType == 'createOn') {
                    if (this.dateRange != null) {
                        if (this.dateRange.length > 0) {
                            this.page.query.param.creatingStartOn = this.dateRange[0];
                            this.page.query.param.creatingEndOn = this.dateRange[1];
                            this.page.query.param.parkingStartOn = '';
                            this.page.query.param.parkingEndOn = '';
                            // this.page.query.dateRanges = {};
                            // this.page.query.dateRanges[this.dateRangeType] = {
                            //   parkingStartOn: this.page.query.param.dateRange[0],
                            //   parkingEndOn: this.page.query.param.dateRange.length > 1 ? this.page.query.param.dateRange[1] : null
                            // };
                            // this.$refs.table.load();
                        }
                    } else {
                        this.page.query.param.creatingStartOn = '';
                        this.page.query.param.creatingEndOn = '';
                        // this.$refs.table.load();
                    }
                } else if (this.dateRangeType == 'orderTime') {
                    if (this.dateRange != null) {
                        if (this.dateRange.length > 0) {
                            this.page.query.param.parkingStartOn = this.dateRange[0];
                            this.page.query.param.parkingEndOn = this.dateRange[1];
                            this.page.query.param.creatingStartOn = '';
                            this.page.query.param.creatingEndOn = '';
                        }
                    } else {
                        this.page.query.param.parkingStartOn = '';
                        this.page.query.param.parkingEndOn = '';
                        // this.$refs.table.load();
                    }
                }
                this.$refs.table.load();
            },
            /**
             * 时间转化为时间戳
             */
            getTimeStamp(end, start) {
                let endTime = new Date(end);
                let startTime = new Date(start);
                let time = ((endTime - startTime) / 1000 / 60).toFixed();
                return time + '分钟';
            },
            /*
            导出
             */
            exportRecords() {
                let params = this.getSearchParams();
                console.log(params);
                this.$api.ipark.BookingOrderService.export(params);
            },
            getSearchParams() {
                  this.page.query.dateRanges = {};
                  if (this.dateRangeType != null && this.dateRange&&this.dateRange.length > 0) {
                    this.page.query.dateRanges[this.dateRangeType] = {
                      startDate: this.dateRange[0],
                      endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
                    };
                  }
                  return this.page.query;
            }
        },
        created() {
        },
        mounted() {
            this.$on('init', this.init);
        }
    };
</script>
