<!-审核管理-->
<template>
    <div>

        <v-dialog ref="formDiag" title="审核" style="margin-left:20%;width:60%">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
                <el-button @click="()=>{this.$refs.formDiag.hide();}">取消</el-button>
            </div>
        </v-dialog>
        <div class="panel panel-default panel-search">

            <el-form :inline="true" label-width="80px">
                <el-form-item label="帐期" width="160">
                    <el-select v-model="page.query.param.periodId" :clearable="true" style="width:100px">
                        <el-option v-for="item in periodsData" :key="item.id" :value="item.id"
                                   :label="item.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item ref="mechantSelect" label="物业">
                    <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
                </el-form-item>

                <el-form-item label="业务类型" width="160">
                    <el-select :disabled="true" @onchange="search" v-model="page.query.param.bizType" :clearable="true"
                               style="width:100px">
                        <el-option v-for="item in $dict.store.SERVICE_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="进度" width="160">
                    <el-select @onchange="search" v-model="page.query.param.status" :clearable="true"
                               style="width:100px">
                        <el-option v-for="item in $dict.store.BILL_APPLY_STATUS" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="cancel">取消</el-button>

                </el-form-item>
            </el-form>
        </div>
        <v-table ref="table" :page="page" class="panel-main" :table-minheight="450">
            <el-table-column prop="seq" label="序号" width="60">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <!--<el-table-column prop="id" label="提现单号" width="100">-->
            <!--<template slot-scope="{row}">-->
            <!--<span :title="row.id">{{row.id}}</span>-->
            <!--</template>-->

            </el-table-column>
            <el-table-column prop="type" label="账期" width="80">
                <template slot-scope="{row}">
                    {{row.periodId}}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="开始日期 -> 结束日期" width="170">
                <template slot-scope="{row}">
                    {{findPeriodName(row.periodId)}}
                </template>
            </el-table-column>


            <el-table-column prop="merchantId" label="物业" width="200">
                <template slot-scope="{row}">
                    {{findMerchantName(row.merchantId)}}
                </template>
            </el-table-column>
            <el-table-column prop="parkId" label="停车场" width="200">
                <template slot-scope="{row}">
                    {{findParkName(row.parkId)}}
                </template>

            </el-table-column>

            <el-table-column prop="bizType" label="业务类型" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.bizType,$dict.store.SERVICE_TYPE)}}
                </template>
            </el-table-column>


            <el-table-column prop="amount" label="提现金额(元)" width="100">
                <template slot-scope="{row}">
                 <span :style="row.status===2&&row.bizType==2?'color: green;font-weight:bold':''">
                           {{ row.amount }}
                   </span>
                </template>

            </el-table-column>

            <!--merchantId-->
            <!--<el-table-column prop="bankName" label="银行名称" width="160">-->
            <!--</el-table-column>-->

            <!--<el-table-column prop="cardNo" label="卡号" width="160">-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="cardOwner" label="持卡人" width="140">-->
            <!--</el-table-column>-->
            <el-table-column prop="status" label="进度" width="100">
                <template slot-scope="{row}">
                    {{row.bizType==1?'已结算':$dict.getText(row.status, $dict.store.BILL_APPLY_STATUS)}}
                </template>
            </el-table-column>


            <el-table-column prop="payChannel" label="渠道类型" width="80">
            </el-table-column>

            <el-table-column prop="applyDate" label="申请时间" width="140">
            </el-table-column>
            <!--<el-table-column prop="remark" label="申请备注" width="140">-->
            <!--</el-table-column>-->

            <el-table-column prop="auditDate" label="审核时间" width="140">
            </el-table-column>
            <el-table-column prop="auditRemark" label="审核意见">
            </el-table-column>


            <el-table-column label="操作" width="80" :fixed="'right'">
                <template slot-scope="{row}">
                    <el-button v-show="row.status==2&&row.bizType==2" type="primary" @click="audit(row)" v-keycode="'ENTER'">审核
                    </el-button>
                </template>

            </el-table-column>

        </v-table>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
    .status_1 {
        color: gray;
    }

    .status_2 {
        color: blue;
    }
</style>
<script>
    import {fetch} from '@/utils';
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import FormPanel from './Form';


    export default {
        components: {MerchantSelect, FormPanel},
        data() {
            return {
                loading: false,
                seq: 0,
                // 帐期列表
                periodsData: [],
                // 车场列表
                parkList: [],
                merchantList: [],
                orderDateRange: [],
                page: {
                    query: {
                        orderBys: 'periodId|desc,applyDate|desc',
                        param: {
                            bizType : 2
                        }
                    },
                    getData: this.$api.ipark.SettlementPeriodService.queryTakeout
                },
                tableActions: [
                    {
                        name: '编辑',
                        handle: this.edit
                    },
                    {
                        name: '删除',
                        handle: this.del,
                        style: 'color:red'
                    }
                ]
            };
        },
        computed: {},

        methods: {

            audit(row) {
                // this.$refs.auditDialog.show(row);
                this.$refs.formDiag.show(row);

            },
            create() {
                this.formStatus = 1;
                this.$refs.formPanel.init({});
            },
            onFormSaved() {
                this.$refs.formDiag.hide();
                this.$nextTick(this.search);
            },
            edit(row) {
                this.formStatus = 2;
                this.$refs.formPanel.setValues(row);
            },
            del(row) {
                this.$confirm('确定删除此条记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    fetch.base.Brand.delete(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                });
            },

            findPeriodName(id) {

                for (var i = 0; i < this.periodsData.length; i++) {
                    if (this.periodsData[i].id == id) {
                        return this.periodsData[i].startDate.substring(0, 10) + ' -> ' + this.periodsData[i].endDate.substring(0, 10);
                    } // console.log(i,"类型："+typeof i,arr[i]);
                }
                return id;
            },
            findParkName(parkId) {
                for (var i = 0; i < this.parkList.length; i++) {
                    if (this.parkList[i].id == parkId) {
                        return this.parkList[i].name;
                    } // console.log(i,"类型："+typeof i,arr[i]);
                }
                return parkId;
            },
            findMerchantName(id) {
                for (var i = 0; i < this.merchantList.length; i++) {
                    if (this.merchantList[i].id == id) {
                        return this.merchantList[i].name;
                    }
                }
                return id;
            },
            init(options = {}) {
                // let query = {
                //     orderBys: 'periodId|desc',
                //     param: {}
                // };
                //查询帐期
                this.$api.ipark.SettlementPeriodService.queryPeriod().then(rsp => {
                    this.periodsData = rsp.data;
                    //console.log(JSON.stringify(rsp));
                });
                //查询 停车场 列表

                this.loading = true;
                this.$api.ipark.ParkInfoService.query({
                    param: {isDeleted: false},
                    _openLoading: false,
                    limit: 2000
                }).then(rsp => {
                    this.parkList = rsp.data;
                    this.loading = false;
                });

                this.merchantList = [];
                let params = {};
                params._openLoading = false;
                params.param = {isDeleted: false};
                params.limit = -1;
                this.$api.ipark.MerchantInfoService.query(params).then(page => {
                    this.merchantList = page.data || [];
                });

                this.search();
            },
            cancel() {

                this.page.query.param = {bizType:2};
                this.search();
            },
            search() {
                this.seq = 0;
                this.page.query.dateRanges = {};

                if (this.orderDateRange != null && this.orderDateRange.length > 0) {
                    this.page.query.dateRanges['payTime'] = {
                        startDate: this.orderDateRange[0],

                        endDate: this.orderDateRange.length > 1 ? this.orderDateRange[1] : null
                    };
                }
                this.$refs.table.load();
            }
        },
        created() {
        },
        mounted() {
            this.$on('init', this.init);
        }
    };
</script>
