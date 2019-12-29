<!--停车场管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true" label-width="80px">
                <el-form-item label="帐期">
                    <balance-period-select v-model="page.query.param.periodId"
                                           :clearable="true"></balance-period-select>
                </el-form-item>
                <el-form-item label="物业">
                    <merchant-select ref="merchantSelect" v-model="page.query.param.merchantId"
                                     :clearable="true"></merchant-select>
                </el-form-item>
                <el-form-item label="业务类型" width="160">
                    <el-select @onchange="search" v-model="page.query.param.bizType" :clearable="true"
                               style="width:100px">
                        <el-option v-for="item in $dict.store.SERVICE_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" width="160">
                    <el-select @onchange="search" v-model="page.query.param.status" :clearable="true"
                               style="width:100px">
                        <el-option v-for="item in $dict.store.BILL_APPLY_STATUS" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="page.query.param = {}; search();">取消</el-button>
                    <el-button type="warning" @click="flushAll">刷新全部</el-button>

                </el-form-item>
            </el-form>
        </div>
        <v-table ref="table" :page="page" :table-minheight="450">
            <el-table-column prop="seq" label="序号" width="60">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column prop="type" label="账期" width="80">
                <template slot-scope="{row}">
                    {{row.periodId}}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="开始日期 -> 结束日期" width="170">
                <template slot-scope="{row}">
                    {{row.startDate}} -> {{row.endDate}}
                </template>
            </el-table-column>

            <el-table-column prop="merchantName" label="物业" width="200">
                <template slot-scope="{row}">
                    {{row.viewBase.merchantName}}
                </template>
            </el-table-column>
            <el-table-column prop="parkId" label="停车场" width="200">
                <template slot-scope="{row}">
                    {{ row.viewBase.parkName }}
                </template>
            </el-table-column>
            </el-table-column>
            <el-table-column prop="bizType" label="业务类型" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.bizType,$dict.store.SERVICE_TYPE)}}

                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.status,$dict.store.BILL_APPLY_STATUS)}}
                </template>
            </el-table-column>

            <el-table-column prop="totalAmount" label="总金额" width="120">
                <template slot-scope="{row}">
                    {{row.totalAmount}}
                </template>
            </el-table-column>
            <el-table-column prop="discountAmount" label="优惠金额" width="120">
                <template slot-scope="{row}">
                    {{row.discountAmount}}
                </template>
            </el-table-column>
            <el-table-column prop="actualAmount" label="实收金额" width="120">
                <template slot-scope="{row}">
                    {{row.actualAmount}}
                </template>
            </el-table-column>
            <el-table-column prop="checkAmount" label="核算金额" width="120">
                <template slot-scope="{row}">
                    {{row.checkAmount}}
                </template>
            </el-table-column>

            <el-table-column prop="createOn" width="140" label="更新时间">
                <template slot-scope="{row}">
                    {{row.opOn}}
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" :fixed="'right'">
                <template slot-scope="{row}">
                    {{row.remark}}
                </template>
            </el-table-column>

        </v-table>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import BalancePeriodSelect from '@/components/widgets/BalancePeriodSelect.vue';


    export default {
        components: {MerchantSelect, BalancePeriodSelect},
        data() {
            return {
                merchantList: [],
                formStatus: 1,
                orderDateRange: [],
                page: {
                    query: {
                        orderBys: 'periodId|desc,merchantId|asc,parkId|asc,createOn|asc',
                        param: {
                            //isDeleted:false
                        }
                    },
                    getData: this.$api.ipark.SettlementPeriodService.query
                }

            };
        },
        computed: {},

        methods: {
            findMerchantName(id) {
                for (let i = 0; i < this.merchantList.length; i++) {

                    if (this.merchantList[i].id == id) {
                        return this.merchantList[i].name;
                    }
                    return '';
                }
            },
            flushAll() {
                this.$api.ipark.SettlementPeriodService.flushAll().then(r => {
                    this.$message('操作成功');
                    this.search();
                });
            },
            init(options = {}) {
                this.search();
            },
            search() {
                this.merchantList = this.$refs.merchantSelect.options;
                //alert(JSON.stringify(this.merchantList))
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
