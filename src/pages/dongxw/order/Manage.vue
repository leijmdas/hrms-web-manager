<!--订单管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">

                <el-form-item label="日期">

                    <div slot="label">
                        <el-select v-model="dateRangeType" filterable clearable style="width:120px" class="formitem-label">
                            <el-option value="orderDate" label="下单日期"></el-option>
                            <el-option value="customerIssueDate" label="客户交货日期"></el-option>
                            <el-option value="checkDate" label="验货日期"></el-option>
                            <el-option value="factroyIssueDate" label="工厂交货日期"></el-option>
                        </el-select>
                    </div>

                    <el-date-picker v-model="dateRange" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd">

                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select :clearable="true" v-model="page.query.param.status" style="width:100px">
                        <el-option v-for="item in $dongxwDict.store.ORDER_STATUS" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="客户" prop="subjectType">
                    <customer-select v-model="page.query.param.customerId" :clearable="true"></customer-select>

                </el-form-item>


                <el-form-item label="客户订单号" prop="customerOrderCode">
                    <el-input v-model="page.query.param.customerOrderCode" clearable></el-input>
                </el-form-item>
                <el-form-item label="EP订单号" prop="epOrderCode">
                    <el-input v-model="page.query.param.epOrderCode" clearable></el-input>
                </el-form-item>

                <el-form-item label="业务员" prop="businessBy"  >
                    <el-input v-model="page.query.param.businessBy" clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="cancel">取消</el-button>

                </el-form-item>

            </el-form>
        </div>
        <v-toolbar title="数据列表" type="alert">

            <el-button plain @click="exportRecords">导出 XLS</el-button>
            <el-button type="primary" plain @click="create">新增</el-button>
        </v-toolbar>
        <v-table ref="table" :page="page" :table-minheight="450" @dataloaded="onDataloaded">

            <el-table-column prop="seq" label="序号" width="50">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column prop="customerId" label="客户" width="120">
                <template slot-scope="{row}">
                    {{ row.customer?row.customer.custName:'-'}}
                 </template>
            </el-table-column>

            <!--0-草稿1-下单2-在生产-3-生产完成4&#45;&#45;发货完成5-收款完成',-->
            <el-table-column prop="status" label="订单状态" width="80">
                <template slot-scope="{row}">
                    {{$dongxwDict.getText(row.status,$dongxwDict.store.ORDER_STATUS)}}
                </template>
            </el-table-column>

            <el-table-column prop="customerOrderCode" label="客户订单号" width="120"></el-table-column>
            <el-table-column prop="epOrderCode" label="EP订单号" width="120"></el-table-column>
            <el-table-column prop="invoiceNo" label="发票编号" width="120"></el-table-column>


            <el-table-column prop="businessBy" label="业务员" width="100"></el-table-column>

            <el-table-column prop="orderDate" label="下单日期" width="100">
                <template slot-scope="{row}">
                {{ $dongxwDict.viewDate(row.orderDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="customerIssueDate" label="客户交货日期" width="100">
                <template slot-scope="{row}">
                    {{ $dongxwDict.viewDate(row.customerIssueDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="checkDate" label="验货日期" width="100">
                <template slot-scope="{row}">
                    {{ $dongxwDict.viewDate(row.checkDate)}}
                </template>
            </el-table-column>
            <el-table-column prop="factroyIssuseDate" label="工厂交货日期" width="100">
                <template slot-scope="{row}">
                    {{ $dongxwDict.viewDate(row.factroyIssuseDate)}}
                </template>
            </el-table-column>

            <!--material_remark      '主料描述 ',-->
            <el-table-column  prop="customerOrderImg" label="订单图片" width="80">
                <template slot-scope="scope">
                    <!--<a :href="scope.row.customerOrderImg" v-if="scope.row.customerOrderImg">下载</a>-->
                    <a :href="scope.row.customerOrderImg" v-if="scope.row.customerOrderImg" target="_blank">预览</a>
                </template>
            </el-table-column>
            <!--<el-table-column prop="supplyId" label="供应商" width="120"></el-table-column>-->
            <el-table-column prop="remark" label="备注"></el-table-column>

            <el-table-column width="130" label="操作" :fixed="'right'">
                <template slot-scope="scope">

                    <el-button type="text" title="编辑" @click="edit(scope.row)">
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button type="success" @click="edit(scope.row)" round size="mini">产品</el-button>

                    <el-button type="text" @click="del(scope.row,scope.$index)" title="删除" v-if="scope.row.status==0">
                        <i class="el-icon-delete red"></i>
                    </el-button>

                </template>
            </el-table-column>

        </v-table>
        <v-dialog ref="formDiag" title="信息编辑" :width="'600px'">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
                <el-button type="default" @click="()=>{$refs.formDiag.hide()}">取消</el-button>
            </div>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
    import CustomerSelect from '@/components/widgets/dongxw/CustomerSelect.vue';
    import FormPanel from './Form';

    export default {
        components: {FormPanel, CustomerSelect   },
        data() {
            return {
                dateRangeType: null,
                formStatus: 1,
                dateRange: [],
                summaryMap: {},
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            customerId: undefined,
                            isDeleted: false
                        }
                    },
                    getData: this.$api.dongxw.OrderMaster.query
                },
                tableActions: [
                    {
                        name: "编辑",
                        handle: this.edit
                    },
                    {
                        name: "删除",
                        handle: this.del,
                        style: "color:red"
                    }
                ]
            };
        },
        computed: {},

        methods: {
            onDataloaded(rsp) {
                // if (rsp.total < 1) return;
                // let promotionIds = rsp.data.map(r => r.id);
                // this.$api.ipark.PromotionInfoService.summaryGroupByPromotionId(promotionIds).then(rs => {
                //     let _rs = rs || [];
                //     this.summaryMap = {}
                //     _rs.forEach(r => {
                //         this.summaryMap[r.promotionId] = r;
                //     })
                // })
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
            },
            /*
            导出
            */
            exportRecords() {
                let params = this.getSearchParams();
                console.log(params);
                this.$api.dongxw.OrderMaster.export(params);
            },
            create() {
                this.$refs.formDiag.show();
            },
            edit(row) {
                this.$refs.formDiag.show({id: row.id});
            },
            toggleStatus(row) {
                let status = row.status;
                let msg = '确定上架此活动吗？</br><span style="color:red">一旦上架，部分信息不允许修改!</span>';
                if (status == 1) {
                    msg = '确定下架此活动吗？</br><span style="color:red">一旦下架，已派发的优惠券无法使用!</span>';
                }
                this.$confirm(msg, "确认", {
                    type: "warning",
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.$api.ipark.PromotionInfoService.updateStatus(row.id, status == 1 ? 2 : 1).then(rsp => {
                        this.search();
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
                });
            },
            del(row) {
                this.$confirm("确定删除此条记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    this.$api.dongxw.OrderMaster.deleteById(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    });
                });
            },
            onFormSaved() {
                this.$refs.formDiag.hide();
                this.$nextTick(this.search);
            },
            init(options = {}) {
                this.search();
            },
            search() {
                this.$refs.table.load();
            },
            cancel() {
                this.dateRangeType=null;
                this.dateRange = [];
                this.page.query.param = {};
                this.search();
            }
        },
        created() {
        },
        mounted() {
            this.$on("init", this.init);
        }
    };
</script>
