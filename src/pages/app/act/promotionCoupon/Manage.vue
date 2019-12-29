<!--停车场管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <!--<el-form-item>-->
                    <!--<div slot="label">-->
                        <!--<el-select v-model="dateRangeType" style="width:120px" class="formitem-label">-->
                            <!--<el-option value="activeOn" label="激活时间"></el-option>-->
                            <!--<el-option value="useOn" label="使用时间"></el-option>-->
                            <!--<el-option value="createOn" label="记录时间"></el-option>-->
                        <!--</el-select>-->
                    <!--</div>-->

                    <!--<el-date-picker-->
                        <!--v-model="dateRange"-->
                        <!--type="daterange"-->
                        <!--range-separator="至"-->
                        <!--start-placeholder="开始日期"-->
                        <!--end-placeholder="结束日期"-->
                        <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                    <!--&gt;</el-date-picker>-->
                <!--</el-form-item>-->
                <!-- <el-form-item label="商户">

                  <merchant-select
                    v-model="page.query.param.merchantId"
                    :clearable="true"
                  ></merchant-select>

                </el-form-item>-->
                <!--<el-form-item label="使用状态">-->
                    <!--<el-select v-model="page.query.param.useStatus" :clearable="true">-->
                        <!--<el-option-->
                            <!--v-for="item in $dict.store.COUPON_STATUS"-->
                            <!--:key="item[0]"-->
                            <!--:label="item[1]"-->
                            <!--:value="item[0]"-->
                        <!--&gt;</el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="业务类型" prop="bizType">
                    <el-select v-model="page.query.param.bizType" clearable>
                        <el-option v-for="item in $dict.store.BUSINESSTYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="批次号" prop="batchNo">
                    <el-input v-model="page.query.param.batchNo" clearable></el-input>
                </el-form-item>
                <el-form-item label="券号" prop="batchNo">
                    <el-input v-model="page.query.param.sn" clearable></el-input>
                </el-form-item>
                <el-form-item label="优惠券名称" prop="name">
                    <promotion-select v-model="page.query.param.promotionId"></promotion-select>
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
                <el-form-item label="激活KEY">
                    <div slot="label">
                        <el-select v-model="page.query.param.activeType" style="width:120px" class="formitem-label">
                            <el-option value="USERID" label="用户名"></el-option>
                            <el-option value="CARNUM" label="车牌"></el-option>
                        </el-select>
                    </div>
                    <el-input v-model="page.query.param.activeKey" v-if="page.query.param.activeType == 'CARNUM'" placeholder="请输入激活KEY" clearable></el-input>
                    <user-select v-model.number="page.query.param.activeKey" v-if="page.query.param.activeType == 'USERID'" :clearable="clearable" placeholder="请输入激活KEY"></user-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button type="success" @click="exportExcel">导出</el-button>

                </el-form-item>
            </el-form>
        </div>

        <v-table ref="table" :page="page" :table-minheight="450">
            <el-table-column prop="sn" label="券号" width="120"></el-table-column>

            <el-table-column prop="batchNo" label="批次号" width="120"></el-table-column>

            <el-table-column prop="name" label="优惠名称" show-overflow-tooltip>
                <template slot-scope="{row}">
                    {{row.promotionInfo.name}}
                    <span
                        style="color:gray"
                    >{{row.promotionInfo.tip}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="bizType" label="业务类型" width="120">
                <template slot-scope="{row}">
                    {{$dict.getText(row.bizType,$dict.store.BUSINESSTYPE)}}
                </template>
            </el-table-column>
            <el-table-column label="优惠类型" width="120">
                <template slot-scope="{row}">
                    <span v-if="row.promotionInfo.discountType == 1">金额</span>
                    <span v-if="row.promotionInfo.discountType == 2">折扣</span>
                    <span v-if="row.promotionInfo.discountType == 3">免费</span>
                    <span v-if="row.promotionInfo.discountType == 4">时长</span>
                </template>
            </el-table-column>
            <el-table-column label="优惠值" width="120">
                <template slot-scope="{row}">
                    {{(row.promotionInfo || {}).discountValue}}
                </template>
            </el-table-column>

            <el-table-column prop="startOn" label="开始时间" width="150"></el-table-column>
            <el-table-column prop="endOn" label="结束时间" width="150"></el-table-column>
            <el-table-column prop="createOn" label="派发时间" width="150"></el-table-column>
            <!--<el-table-column prop="createOn" label="派发单位" width="150"></el-table-column>-->
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
            <el-table-column prop="useType" label="使用主体" width="100">
                <template slot-scope="{row}">
                    {{$dict.getText(row.useType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
                </template>
            </el-table-column>
            <el-table-column prop="activeStatus" label="激活状态" width="120">
                <template slot-scope="{row}">
                    {{row.activeStatus==0?'未激活':'已激活'}}
                    <el-button v-show="!row.activeStatus" type="text" icon="el-icon-share" title="激活" @click="dispatch2User(row)"></el-button>
                </template>
            </el-table-column>
            <el-table-column prop="activeType" label="激活方式" width="150">
                <template slot-scope="{row}">
                    {{row.activeType}}
                </template>
            </el-table-column>
            <el-table-column prop="activeOn" label="激活时间" width="150"></el-table-column>
            <el-table-column prop="activeType" label="激活KEY" width="150">
                <template slot-scope="{row}">
                    {{row.activeType== 'USERID'? row.username : row.activeKey}}
                </template>
            </el-table-column>

            <!--<el-table-column prop="name" label="优惠编码" width="100" show-overflow-tooltip>-->
                <!--<template slot-scope="{row}">-->
                    <!--{{row.product.code}}-->
                <!--</template>-->
            <!--</el-table-column>-->

            <!--<el-table-column prop="dispatchChannelName" label="派发渠道" width="120"-->
                             <!--show-overflow-tooltip></el-table-column>-->
            <!--<el-table-column prop="activeStatus">-->
            <!--<template slot-scope="{row}">-->
                <!--{{row.activeStatus==0?'未激活':'已激活'}}-->

                <!--<el-button-->
                    <!--v-show="!row.activeStatus"-->
                    <!--type="text"-->
                    <!--icon="el-icon-share"-->
                    <!--title="激活"-->
                    <!--@click="dispatch2User(row)"-->
                <!--&gt;</el-button>-->
            <!--</template>-->
            <!--</el-table-column>-->


            <!--<el-table-column prop="status" label="使用状态" width="80">-->
                <!--<template slot-scope="{row}">{{$dict.getText(row.useStatus,$dict.store.COUPON_STATUS)}}</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="status" label="使用时间" width="140">-->
                <!--<template slot-scope="{row}">{{row.useOn}}</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="status" label="使用订单号" width="120">-->
                <!--<template slot-scope="{row}">{{row.useOrderno}}</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column prop="status" label="实际优惠金额" width="100">-->
                <!--<template slot-scope="{row}">{{(row.parkingOrder||{}).discountAmount}}</template>-->
            <!--</el-table-column>-->
        </v-table>
        <v-dialog ref="formDiag" title="生成优惠券" :width="'500px'">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
                <el-button @click="()=>$refs.formDiag.hide()">取消</el-button>
            </div>
        </v-dialog>

        <v-dialog ref="dispatchFormDiag" title="优惠券激活" width="500px">
            <dispatch-form-panel @saved="onFormSaved2"></dispatch-form-panel>
            <div slot="footer">
                <el-button type="danger" @click="$refs.dispatchFormDiag.dispatch('submit')">确定激活</el-button>
                <el-button @click="()=>$refs.dispatchFormDiag.hide()">取消</el-button>
            </div>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
    import MerchantSelect from "@/components/widgets/MerchantSelect.vue";

    import FormPanel from "./Form";
    import PromotionSelect from '@/components/widgets/PromotionSelect';
    import DispatchFormPanel from "./DispatchForm";
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import UserSelect from '@/components/widgets/UserSelect.vue';

    export default {
        components: {
            FormPanel,

            DispatchFormPanel,

            MerchantSelect,
            BranchCompanySelect,
            UserSelect,
            PromotionSelect
        },

        data() {
            return {
                dateRangeType: "createOn",
                dateRange: [],
                formStatus: 1,
                orderDateRange: [],
                summaryMap: {},
                clearable: true,
                page: {
                    query: {
                        orderBys: "id|desc",

                        param: {
                            activeType: 'USERID',
                            isDeleted: false
                        }
                    },

                    getData: this.$api.ipark.PromotionCouponService.query
                },

            };
        },

        computed: {},

        methods: {
            create() {
                this.$refs.formDiag.show();
            },

            edit(row) {
                this.$refs.formDiag.show({
                    id: row.id
                });
            },

            del(row) {
                this.$confirm("确定删除此条记录吗?", "提示", {
                    type: "warning"
                }).then(() => {
                    this.$api.ipark.MerchantInfoService.delete(row.id).then(rsp => {
                        this.search();

                        this.$message({
                            type: "success",

                            message: "删除成功!"
                        });
                    });
                });
            },

            onFormSaved(r) {
                this.$message("生成成功！批次号:" + r);

                this.$refs.formDiag.hide();

                this.$nextTick(this.search);
            },

            onFormSaved2() {
                this.$refs.dispatchFormDiag.hide();

                this.search();
            },

            dispatch2User(row) {
                this.$refs.dispatchFormDiag.show({
                    coupon: row
                });
            },

            init(options = {}) {
                console.log(options);
                Object.assign(this.page.query, options.query);
                this.search();
            },
            preQuery() {
                this.page.query.dateRanges = {};
                if (this.dateRangeType != null && this.dateRange && this.dateRange.length > 0) {

                    this.page.query.dateRanges[this.dateRangeType] = {
                        startDate: this.dateRange[0],

                        endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
                    };
                }
            },
            load(reload) {
                this.preQuery();
                this.$refs.table.load(reload);
            },
            search() {
                this.load(true);
            },
            exportExcel() {
                this.preQuery();
                this.$api.ipark.PromotionCouponService.export(this.page).then(() => {

                });
            }
        },

        created() {
        },

        mounted() {
            this.$on("init", this.init);
        }
    };
</script>
