<!--生成帐单-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true" label-width="60px">
                <el-form-item label="帐期">
                    <balance-period-select v-model="page.query.param.periodId"
                                           :clearable="true"></balance-period-select>
                </el-form-item>
                <el-form-item label="物业">
                    <merchant-select ref="merchantSelect" v-model="page.query.param.merchantId"
                                     :clearable="true"></merchant-select>
                </el-form-item>
                <el-form-item>

                    <el-button @click="make" type="primary">生成物业帐单</el-button>
                    <el-button @click="makeAll">生成帐期帐单</el-button>

                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="page.query.param.status" :clearable="true">
                        <el-option v-for="item in $dict.store.BALANCE_STATUS" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="page.query.param = {}; search();">取消</el-button>
                    <!--<el-button type="warning" @click="flushAll">刷新全部</el-button>-->
                    <!--<el-button @click="make">生成商户帐单</el-button>-->
                    <!--<el-button @click="makeAll">生成帐期帐单</el-button>-->

                </el-form-item>
            </el-form>
        </div>
        <v-table ref="table" :page="page" :table-minheight="450">

            <el-table-column prop="seq" label="序号" width="60">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column prop="periodId" label="账期" width="100">
                <template slot-scope="{row}">
                    {{row.periodId}}
                </template>
            </el-table-column>

            <el-table-column prop="periodStartDate" label="开始日期" width="120">
                <template slot-scope="{row}">
                    {{row.viewBase.periodStartDate.substring(0,10)}}
                </template>
            </el-table-column>
            <el-table-column prop="periodEndDate" label="结束日期" width="120">
                <template slot-scope="{row}">
                    {{row.viewBase.periodEndDate.substring(0,10)}}
                </template>
            </el-table-column>
            <!--:class="row.status==2?'bg-blue':''"-->


            <el-table-column prop="name" label="物业" width="200">
                <template slot-scope="{row}">
                    {{row.viewBase.merchantName}}
                </template>
            </el-table-column>


            <el-table-column prop="status" label="状态" width="160">
                <template slot-scope="{row}">
                   <span :style="row.status===2?'color: blue;font-weight:bold':''">
                             {{$dict.getText(row.status,$dict.store.BALANCE_STATUS)}}
                   </span>
                </template>
            </el-table-column>


            <el-table-column prop="balanceTime"  label="生成时间">
                <template slot-scope="{row}">
                    {{row.balanceTime}}
                </template>
            </el-table-column>

            <el-table-column  label=" ">

            </el-table-column>

            <el-table-column width="120" label="操作" :fixed="'right'" >
                <template slot-scope="{row}">
                    <el-button type="primary" :disabled="row.status==2" @click="remake(row)">
                        <!--<i class="el-icon-delete red"></i>-->
                        重新生成
                    </el-button>
                </template>
            </el-table-column>


        </v-table>
    </div>
</template>

<style scoped>
    .bg-blue:hover {
        background-color: #03b6fd;
    }
</style>

<script>
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import BalancePeriodSelect from '@/components/widgets/BalancePeriodSelect.vue';

    export default {
        components: {MerchantSelect, BalancePeriodSelect},
        data() {
            return {

                formStatus: 1,
                orderDateRange: [],
                page: {
                    query: {
                        orderBys: 'periodId|desc,mechantId|asc',
                        param: {
                            isDeleted: false
                        }
                    },
                    getData: this.$api.ipark.SettlementPeriodService.queryBalanceLog
                }

            };
        },
        computed: {},

        methods: {
            remake(row) {


                let merchantName = this.findMerchantName(row.merchantId);

                this.$api.ipark.SettlementPeriodService.execMerchantTask(row.periodId, row.merchantId).then(
                    rsp => this.$message({
                        type: 'success',
                        message: '商户' + merchantName + ' 帐期:' + row.periodId + ' 帐单生成中，请稍候查询!'
                    }));
            },
        make() {
                if (this.page.query.param.periodId === undefined
                    || this.page.query.param.merchantId === undefined) {
                    this.$message({
                        type: 'warning',
                        message: '请选择帐期和商户!'
                    });
                    return;
                }

                let merchantName = this.findMerchantName(this.page.query.param.merchantId);

                this.$api.ipark.SettlementPeriodService.execMerchantTask(this.page.query.param.periodId,
                    this.page.query.param.merchantId).then(
                    rsp => this.$message({
                        type: 'success',
                        message: '商户' + merchantName + ' 帐期:' + this.page.query.param.periodId + ' 帐单生成中，请稍候查询!'
                    }));

            },
            makeAll() {
                if (this.page.query.param.periodId === undefined) {
                    this.$message({
                        type: 'warning',
                        message: '请选择帐期 !'
                    });
                    return;
                }
                this.$api.ipark.SettlementPeriodService.execTask(this.page.query.param.periodId).then(
                    rsp => this.$message({
                        type: 'success',
                        message: '所有商户,帐期:' + this.page.query.param.periodId + ' 帐单生成中，请稍候查询!'
                    }));

            },
            findMerchantName(id) {

                let merchantList = this.$refs.merchantSelect.options;
                //alert(JSON.stringify(merchantList));
                for (var i = 0; i < merchantList.length; i++) {
                    if (merchantList[i].id == id) {
                        return merchantList[i].name;
                    }
                }
                return '';
            },
            flushAll() {
                // this.$api.ipark.SettlementPeriodService.flushAll().then(r=>{
                //   this.$message('操作成功');
                //   this.search();
                // });
            },
            init(options = {}) {
                this.search();
            },
            search() {
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


