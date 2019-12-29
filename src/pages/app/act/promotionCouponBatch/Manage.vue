<!--优惠券派发-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <!-- <el-form-item label="商户">
                  <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
                </el-form-item> -->
                <el-form-item label="业务类型" prop="subjectType">
                    <el-select v-model="page.query.param.bizType" clearable>
                        <el-option v-for="item in $dict.store.BUSINESSTYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="批次号" prop="batchNo">
                    <el-input v-model="page.query.param.batchNo" clearable></el-input>
                </el-form-item>
                <el-form-item label="优惠券名称" prop="name">
                    <el-input v-model="page.query.param.name" clearable></el-input>
                </el-form-item>

                <el-form-item label="主体类型" prop="subjectType">
                    <el-select v-model="page.query.param.subjectType" @change="page.query.param.subjectId = undefined" clearable>
                        <el-option v-for="item in $dict.store.ACCOUNT_SUBJECT_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属分公司" prop="merchantId" v-if="page.query.param.subjectType == 1">
                    <branch-company-select v-model="page.query.param.subjectId" clearable></branch-company-select>
                </el-form-item>
                <el-form-item label="所属商户" prop="merchantId" v-if="page.query.param.subjectType == 2">
                    <merchant-select v-model="page.query.param.subjectId" clearable></merchant-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="create">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <v-table ref="table" :page="page" :table-minheight="450" @dataloaded="onDataloaded">
            <el-table-column prop="bizType" label="业务类型" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.bizType,$dict.store.BUSINESSTYPE)}}
                </template>
            </el-table-column>
            <el-table-column prop="batchNo" label="批次号" width="120">
            </el-table-column>
            <el-table-column prop="name" label="优惠券名称">
                <template slot-scope="{row}">
                    [{{row.promotionInfo.name}}]-{{row.promotionInfo.discountCondition}}
                    <span
                        style="color:gray"
                    >{{row.promotionInfo.tip}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createOn" width="140" label="开始时间">
                <template slot-scope="{row}">
                    {{(row.promotionInfo || {}).startOn}}
                </template>
            </el-table-column>
            <el-table-column prop="createOn" width="140" label="结束时间">
                <template slot-scope="{row}">
                    {{(row.promotionInfo || {}).endOn}}
                </template>
            </el-table-column>
            <el-table-column prop="tip" label="总量/发放/使用" width="150">
                <template slot-scope="{row}">
                    {{row.expectNum != 0?row.expectNum:'不限'}} / {{ (summaryMap[row.batchNo]||{instanceNum:0}).instanceNum}} /  {{ (summaryMap[row.batchNo]||{usedNum:0}).usedNum}}
                </template>
            </el-table-column>
            <el-table-column prop="status" width="140" label="状态">
                <template slot-scope="{row}">
                    {{['未上架','已上架','已下架'][(row.promotionInfo || {}).status]}}
                </template>
            </el-table-column>
            <el-table-column prop="subjectType" label="主体类型" width="120">
                <template slot-scope="{row}">
                    {{$dict.getText(row.subjectType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="主体名称" width="200">
                <template slot-scope="{row}">
                    {{([,row.branchCompany, row.merchantInfo][row.subjectType]||{name:'-'}).name}}
                </template>
            </el-table-column>

            <el-table-column prop="createOn" width="140" label="创建时间">
                <template slot-scope="{row}">
                    {{row.createOn}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" :fixed="'right'">
                <template slot-scope="scope">
                    <!--<div v-show="!scope.row.actualNum">-->
                    <!--<el-button type="text" title="生成" @click="genCoupons(scope.row)">-->
                    <!--<i class="el-icon-tickets"></i>-->
                    <!--</el-button>-->

                    <!--<el-button type="text" title="编辑" @click="edit(scope.row)" v-if="!scope.row.actualNum">-->
                    <!--<i class="el-icon-edit"></i>-->
                    <!--</el-button>-->
                    <!--<el-button type="text" @click="del(scope.row,scope.$index)" title="删除" v-if="!scope.row.actualNum">-->
                    <!--<i class="el-icon-delete red"></i>-->
                    <!--</el-button>-->
                    <!--</div>-->
                    <!--<el-button type="text" title="查看" @click="view(scope.row)">-->
                    <!--<i class="el-icon-view"></i>-->
                    <!--</el-button>-->
                    <el-button type="text" @click="QRView(scope.row)">
                        二维码派券
                    </el-button>
                    <el-button type="text" @click="activeByPeo(scope.row)">
                        人工派券
                    </el-button>
                </template>
            </el-table-column>
        </v-table>
        <v-dialog ref="formDiag" title="信息编辑" :width="'500px'">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
                <el-button @click="()=>$refs.formDiag.hide()">取消</el-button>
            </div>
        </v-dialog>
        <v-dialog ref="formDiagView" title="信息查看">
            <view-panel></view-panel>
        </v-dialog>
        <v-dialog ref="PeoFormDiag" title="优惠券激活">
            <dispatch-form-panel @saved="onFormSaved2"></dispatch-form-panel>
            <div slot="footer">
                <el-button type="danger" @click="$refs.PeoFormDiag.dispatch('submit')">派发优惠券</el-button>
                <el-button  @click="()=>$refs.PeoFormDiag.hide()">取消</el-button>
            </div>
        </v-dialog>
        <v-dialog ref="QRFormDiag" title="二维码派发" width="450px">
           <div style="min-height: 300px">该功能暂时不做</div>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
    import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
    import FormPanel from "./Form";
    import ViewPanel from "./ViewPanel";
    import DispatchFormPanel from "./DispatchForm";
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    export default {
        components: {FormPanel, ViewPanel, MerchantSelect, DispatchFormPanel, BranchCompanySelect},
        data() {
            return {
                formStatus: 1,
                orderDateRange: [],
                summaryMap: {},
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            isDeleted: false
                        }
                    },
                    getData: this.$api.ipark.PromotionCouponBatchService.query
                }
            };
        },
        computed: {},

        methods: {
            onDataloaded(rsp){
                if(rsp.total<1) return ;
                let batchNos = rsp.data.map(r=>r.batchNo);
                this.$api.ipark.PromotionCouponBatchService.summaryGroupByBatchNos(batchNos).then(rs=>{
                    let _rs = rs||[];
                    this.summaryMap = {}
                    _rs.forEach(r=>{
                        this.summaryMap[r.batchNo]=r;
                    })
                })
            },
            //展示管理用户
            showDispatchUserManage(row) {
                this.$refs.userDiag.show({dispatchChannelId: row.id});
            },
            create() {
                this.$refs.formDiag.show();
            },
            edit(row) {
                this.$refs.formDiag.show({id: row.id});
            },
            view(row) {
                this.$refs.formDiagView.show({batch: row});
            },
            /**
             * 二维码派券
             * */
            QRView(row) {
                this.$refs.QRFormDiag.show({row: row});
            },
            /**
             * 人工派券
             */
            activeByPeo(row) {
                this.$refs.PeoFormDiag.show({coupon: row});
            },
            onFormSaved2() {
                this.$refs.PeoFormDiag.hide();
                this.search();
            },
            del(row) {
                this.$confirm("确定删除此条记录吗?", "确认", {
                    type: "warning"
                }).then(() => {
                    this.$api.ipark.PromotionCouponBatchService.delete(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    });
                });
            },
            genCoupons(row) {
                this.$confirm("确定生成优惠券吗?", "确认", {
                    type: "warning"
                }).then(() => {
                    this.$api.ipark.PromotionCouponBatchService.genCoupons(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: "success",
                            message: "生成成功!"
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
            }
        },
        created() {
        },
        mounted() {
            this.$on("init", this.init);
        }
    };
</script>
