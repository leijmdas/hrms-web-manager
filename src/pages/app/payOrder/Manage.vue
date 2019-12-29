<!--停车场管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true" label-width="80px">
                <div>
                    <el-form-item label="子公司">
                        <branch-company-select v-model="page.query.param.branchCompanyId"
                                               :clearable="true"></branch-company-select>
                    </el-form-item>


                    <el-form-item label="物业">
                        <merchant-select :branchCompanyId="page.query.param.branchCompanyId"
                                         v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
                    </el-form-item>
                    <el-form-item>
                        <div slot="label">
                            <el-select v-model="dateRangeType" style="width:120px" class="formitem-label"
                                       :clearable="true"
                                       :disabled="true">
                                <el-option value="payTime" label="支付时间"></el-option>
                            </el-select>
                        </div>
                        <el-date-picker
                            v-model="dateRange"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                </div>
                <div>

                    <el-form-item label="业务类型">
                        <el-select v-model="page.query.param.bizType" :clearable="true">
                            <el-option v-for="item in $dict.store.BIZTYPE" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="支付状态">
                        <el-select v-model="page.query.param.status" :clearable="true">
                            <el-option v-for="item in $dict.store.PAY_ORDER_STATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="支付方式">
                        <el-select v-model="page.query.param.payWay" :clearable="true">
                            <el-option v-for="item in $dict.store.PAY_WAY" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>


                    <el-form-item>
                        <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                        <el-button @click="page.query.param = {};dateRange=[]; search();">取消</el-button>

                    </el-form-item>
                </div>
            </el-form>
        </div>
        <v-table ref="table" :page="page" class="panel-main" :table-minheight="450">
            <el-table-column prop="seq" label="序号" width="50">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>

            <el-table-column prop="carNum" label="物业" width="200">
                <template slot-scope="{row}">
                    {{row.merchantId==0?'平台':(row.merchantInfo||{}).name}}
                </template>
            </el-table-column>
            <el-table-column prop="bizType" label="业务类型" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.bizType,$dict.store.BIZTYPE)}}
                </template>
            </el-table-column>


            <el-table-column prop="amount" label="交易金额(元)" width="100">
            </el-table-column>
            <el-table-column prop="type" label="退付款" width="60">
                <template slot-scope="{row}">
                    {{row.type||1==1?"付款":"退款"}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="支付状态" width="80">
                <template slot-scope="{row}">
                    <span
                        :class="'status_'+row.status">{{$dict.getText(row.status,$dict.store.PAY_ORDER_STATUS)}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="payTime" label="支付时间" width="140">
            </el-table-column>

            <el-table-column prop="stayTime" label="支付方式" width="90">
                <template slot-scope="{row}">
                    {{$dict.getText(row.payWay,$dict.store.PAY_WAY)}}
                </template>
            </el-table-column>
            <el-table-column prop="payChannel" label="支付渠道" width="140">
            </el-table-column>
            <el-table-column prop="bizOrderNo" label="业务单号" width="140">
            </el-table-column>

            <el-table-column prop="tradeNo" label="交易编号" width="240">
            </el-table-column>

            <el-table-column prop="voucherNo" label="收款方账户"  >
                <template slot-scope="{row}">
             <span v-if="row.payeeAccountInfo">
            [{{$dict.getText(row.payeeAccountInfo.type,$dict.store.PAY_TYPE)}}]{{row.payeeAccountInfo.name}}
            </span>
                </template>
            </el-table-column>
            <el-table-column prop="createOn" width="140" label="创建时间">
                <template slot-scope="{row}">
                    {{row.createOn}}
                </template>
            </el-table-column>

            <!--<el-table-column prop="remark" label="备注">-->
            <!--</el-table-column>-->


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
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';

    export default {
        components: {BranchCompanySelect, MerchantSelect},
        data() {
            return {
                formStatus: 1,
                dateRange: [],
                dateRangeType: 'payTime',
                page: {
                    query: {

                        orderBys: 'payTime|desc,merchantId|asc',

                        param: {}
                    },
                    getData: this.$api.ipark.PayOrderService.query
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
            create() {
                this.formStatus = 1;
                this.$refs.formPanel.init({});
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
            init(options = {}) {
                this.search();
            },
            search() {
                this.page.query.dateRanges = {};
                if (this.dateRangeType != null && this.dateRange.length > 0) {

                    this.page.query.dateRanges[this.dateRangeType] = {
                        startDate: this.dateRange[0],

                        endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
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
