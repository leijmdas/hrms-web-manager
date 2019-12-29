<!--cust管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <el-form-item label="日期">

                    <div slot="label">
                        <el-select v-model="dateRangeType" filterable clearable style="width:160px" class="formitem-label">
                            <el-option value="orderDate" label="接单日期"></el-option>
                            <el-option value="issueDate" label="要求交期"></el-option>
                            <el-option value="preItemDate" label="物料到位日期"></el-option>
                            <el-option value="prePackageDate" label="包装到位日期"></el-option>
                            <el-option value="planOnlineDate" label="计划上线"></el-option>
                            <el-option value="planFinishDate" label="计划完成"></el-option>
                            <el-option value="planOnlineDate" label="实际上线"></el-option>
                            <el-option value="planFinishDate" label="实际完成"></el-option>
                        </el-select>
                    </div>

                    <el-date-picker v-model="dateRangeOrder" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd">

                    </el-date-picker>
                </el-form-item>
                <el-form-item style="color: rebeccapurple" label="状态">
                    <el-select v-model="page.query.param.status" :clearable="true">
                        <el-option v-for="item in $dongxwDict.store.PLAN_STATUS" :key="item[0]" :value="item[0]"
                                   :label="item[1]+' :'+item[0]">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="客户">
                    <customer-select v-model="page.query.param.custId" :clearable="true"></customer-select>
                </el-form-item>
                <el-form-item label="订单">
                    <customer-select v-model="page.query.param.custId" :clearable="true"></customer-select>
                </el-form-item>
                <el-form-item label="款号">
                    <customer-select v-model="page.query.param.custId" :clearable="true"></customer-select>
                </el-form-item>


                <!--<el-form-item label="接单日期">-->
                    <!--<el-date-picker v-model="dateRangeOrder" type="daterange" range-separator="至"-->
                                    <!--start-placeholder="开始日期" end-placeholder="结束日期"-->
                                    <!--value-format="yyyy-MM-dd"></el-date-picker>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="要求交期">-->
                    <!--<el-date-picker v-model="dateRangeOrder" type="daterange" range-separator="至"-->
                                    <!--start-placeholder="开始日期" end-placeholder="结束日期"-->
                                    <!--value-format="yyyy-MM-dd"></el-date-picker>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="物料到位日期">-->
                    <!--<el-date-picker v-model="dateRangeOrder" type="daterange" range-separator="至"-->
                                    <!--start-placeholder="开始日期" end-placeholder="结束日期"-->
                                    <!--value-format="yyyy-MM-dd"></el-date-picker>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="包装到位日期">-->
                    <!--<el-date-picker v-model="dateRangeOrder" type="daterange" range-separator="至"-->
                                    <!--start-placeholder="开始日期" end-placeholder="结束日期"-->
                                    <!--value-format="yyyy-MM-dd"></el-date-picker>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="计划上线">-->
                    <!--<el-date-picker v-model="dateRangeOrder" type="daterange" range-separator="至"-->
                                    <!--start-placeholder="开始日期" end-placeholder="结束日期"-->
                                    <!--value-format="yyyy-MM-dd"></el-date-picker>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="计划完成">-->
                    <!--<el-date-picker v-model="dateRangeOrder" type="daterange" range-separator="至"-->
                                    <!--start-placeholder="开始日期" end-placeholder="结束日期"-->
                                    <!--value-format="yyyy-MM-dd"></el-date-picker>-->
                <!--</el-form-item>-->

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="cancel">取消</el-button>

                </el-form-item>
            </el-form>
        </div>
        <v-toolbar title="数据列表" type="alert">
            <el-button plain @click="exportRecords">导出 XLS</el-button>
            <el-button type="primary" plain @click="create">新增单品</el-button>
            <el-button type="primary" plain @click="create">按订单新增</el-button>
        </v-toolbar>


        <v-table ref="table" :page="page" :table-minheight="450" @dataloaded="onDataloaded">
            <el-table-column prop="seq" label="序号" width="50">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
                        <template slot-scope="{row}">
                            {{$dongxwDict.getText (row.status,$dongxwDict.store.PLAN_STATUS)}}
                        </template>
            </el-table-column>
            <el-table-column  prop="custId" label="客户" width="120"></el-table-column>
            <el-table-column prop="orderId" label="订单号" width="120"></el-table-column>

            <el-table-column prop="productId" label="款号" width="245">      </el-table-column>

            <el-table-column prop="qty" label="数量" width="80">            </el-table-column>
            <el-table-column prop="color" label="颜色" width="80">            </el-table-column>


            <el-table-column prop="orderDate" label="接单日期" width="100">
                <template slot-scope="{row}">
                    {{row.orderDate.substr(0,10)}}
                </template>
            </el-table-column>
            <el-table-column prop="issueDate" label="要求交期" width="100">
                <template slot-scope="{row}">
                   <span style="color:red"> {{row.issueDate.substr(0,10)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="preItemDate" label="物料到位日期" width="100">
                <template slot-scope="{row}">
                    {{row.preItemDate.substr(0,10)}}
                </template>
            </el-table-column>
            <el-table-column prop="prePackageDate" label="包装到位日期" width="100">
                <template slot-scope="{row}">
                    {{row.prePackageDate.substr(0,10)}}
                </template>
            </el-table-column>
            <el-table-column prop="planOnlineDate" label="计划上线" width="100">
                <template slot-scope="{row}">
                    {{row.planOnlineDate.substr(0,10)}}
                </template>
            </el-table-column>
            <el-table-column prop="planFinishDate" label="计划完成" width="100">
                <template slot-scope="{row}">
                    {{row.planFinishDate.substr(0,10)}}
                </template>
            </el-table-column>
            <el-table-column prop="planOnlineDate" label="实际上线" width="100">
                <template slot-scope="{row}">
                    <span style="color: darkgreen"> {{row.planOnlineDate.substr(0,10)}} </span>
                </template>
            </el-table-column>
            <el-table-column prop="planFinishDate" label="实际完成" width="100">
                <template slot-scope="{row}">
                    {{row.planFinishDate.substr(0,10)}}
                </template>
            </el-table-column>

            <el-table-column prop="remark" label="备注"  >
            </el-table-column>

            <el-table-column width="80" label="操作" :fixed="'right'">
                <template slot-scope="scope">

                    <el-button type="text" title="编辑" @click="edit(scope.row)"  >
                        <i class="el-icon-edit"></i>
                    </el-button>
                     <el-button type="danger" @click="del(scope.row,scope.$index)" title="删除" v-if="scope.row.status==0">
                      <i class="el-icon-delete red"></i>
                    </el-button>
                </template>
            </el-table-column>
        </v-table>
        <v-dialog ref="formDiag" :width="'600px'" title="信息编辑">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
                <el-button type="default" @click="()=>{$refs.formDiag.hide()}">取消</el-button>
            </div>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">

    .status_green {
        color: green;
    }
</style>

<script>
    import CustomerSelect from '@/components/widgets/dongxw/CustomerSelect.vue';
    import FormPanel from './Form';

    export default {
        components: {FormPanel ,CustomerSelect},
        data() {
            return {
                dateRangeType: "orderDate",
                dateRangeOrder : [],
                formStatus: 1,
                //orderDateRange: [],
                summaryMap: {},
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            isDeleted: false
                        }
                    },
                    getData : this.$api.dongxw.MakePlan.query

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
            /*
            导出
             */
            exportRecords() {
                let params = this.getSearchParams();
                this.$api.dongxw.MakePlan.export(params);
            },
            getSearchParams() {
                this.page.query.dateRanges = {};
                if (this.dateRangeType != null && this.dateRangeOrder&&this.dateRangeOrder.length > 0) {
                    this.page.query.dateRanges[this.dateRangeType] = {
                        startDate: this.dateRangeOrder[0],
                        endDate: this.dateRangeOrder.length > 1 ? this.dateRangeOrder[1] : null
                    };
                }
                return this.page.query;
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
                    this.$api.ipark.PromotionInfoService.delete(row.id).then(rsp => {
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
                this.getSearchParams();
                this.$refs.table.load();
            },
            cancel() {
                this.dateRangeType = null;
                this.dateRangeOrder = [];
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
