<!--停车场管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <!-- <el-form-item label="商户">
                  <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
                </el-form-item> -->
                <el-form-item label="业务类型" prop="bizType">
                    <el-select v-model="page.query.param.bizType" @change="page.query.param.subjectId = undefined"
                               clearable>
                        <el-option v-for="item in $dict.store.BUSINESSTYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="主体类型" prop="subjectType">
                    <el-select v-model="page.query.param.subjectType" @change="page.query.param.subjectId = undefined"
                               clearable>
                        <el-option v-for="item in $dict.store.ACCOUNT_SUBJECT_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="子公司" prop="merchantId" v-if="page.query.param.subjectType == 1">
                    <branch-company-select v-model="page.query.param.subjectId" clearable></branch-company-select>
                </el-form-item>
                <el-form-item label="物业" prop="merchantId" v-if="page.query.param.subjectType == 2">
                    <merchant-select v-model="page.query.param.subjectId" clearable></merchant-select>
                </el-form-item>

                <el-form-item label="编码" prop="code">
                    <el-input v-model="page.query.param.code" clearable></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="page.query.param.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select :clearable="true" v-model="page.query.param.status" style="width:100px">
                        <el-option v-for="item in $dict.store.PROMOTION_STATUS" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="cancel">取消</el-button>

                </el-form-item>
                <!--<el-form-item>-->
                    <!--<div style="color:red;margin-left:30px">一旦上线，优惠规则不可改变！</div>-->
                <!--</el-form-item>-->
            </el-form>
        </div>
        <v-toolbar title="数据列表" type="alert">
            <span style="color:red;margin-left:30px">一旦上线，优惠规则不可改变！</span>
            <el-button type="primary" plain @click="create">新增</el-button>
        </v-toolbar>
        <v-table ref="table" :page="page" :table-minheight="450" @dataloaded="onDataloaded">
            <el-table-column prop="bizType" label="业务类型" width="100">
                <template slot-scope="{row}">
                    {{$dict.getText(row.bizType,$dict.store.BUSINESSTYPE)}}
                </template>
            </el-table-column>
            <el-table-column prop="code" label="编码" width="120"></el-table-column>
            <el-table-column prop="name" label="名称" width="200"></el-table-column>
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
            <el-table-column prop="startOn" label="开始时间" width="150">
            </el-table-column>
            <el-table-column prop="endOn" label="结束时间" width="150">
            </el-table-column>
            <el-table-column prop="effectDays" label="有效期" width="80">
                <template slot-scope="{row}">
                    {{row.effectTimes !=0 ? row.effectTimes: '不限'}} {{row.effectTimes !=0?
                    $dict.getText(row.effectTimeUnit,$dict.store.PROMOTION_EFFECT_TIMEUNIT): ''}}
                </template>
            </el-table-column>
            <el-table-column prop="visibility" label="可见性" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.visibility,$dict.store.PROMOTION_VISIBILITY)}}
                </template>
            </el-table-column>
            <el-table-column prop="tip" label="优惠">
                <template slot-scope="{row}">
                    {{row.discountValue}} <span v-show="row.discountType==1">元</span>
                </template>
            </el-table-column>
            <el-table-column prop="tip" label="总量/发放/使用" width="100">
                <template slot-scope="{row}">
                    {{row.limitTotalNum != -1?row.limitTotalNum:'不限'}} / {{
                    (summaryMap[row.id]||{instanceNum:0}).instanceNum}} / {{ (summaryMap[row.id]||{usedNum:0}).usedNum}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.status,$dict.store.PROMOTION_STATUS)}}
                </template>
            </el-table-column>
            <el-table-column prop="createOn" width="140" label="创建时间">
                <template slot-scope="{row}">
                    {{row.createOn}}
                </template>
            </el-table-column>
            <el-table-column width="100" label="操作" :fixed="'right'">
                <template slot-scope="scope">
                    <!-- 主体类型为商户时不暂时任何操作按钮 -->
                    <el-button type="text" title="上/下架" @click="toggleStatus(scope.row)" >
                        <i class="el-icon-upload2" v-show="scope.row.status==0||scope.row.status==2"></i>
                        <i class="el-icon-download" v-show="scope.row.status==1"></i>
                    </el-button>
                    <el-button type="text" title="编辑" @click="edit(scope.row)"  >
                        <i class="el-icon-edit"></i>
                    </el-button>
                     <el-button type="text" @click="del(scope.row,scope.$index)" title="删除" v-if="scope.row.status==0">
                      <i class="el-icon-delete red"></i>
                    </el-button>
                </template>
            </el-table-column>
        </v-table>
        <v-dialog ref="formDiag" title="信息编辑">
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
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import FormPanel from './Form';

    export default {
        components: {FormPanel, MerchantSelect, BranchCompanySelect},
        data() {
            return {
                formStatus: 1,
                orderDateRange: [],
                summaryMap: {},
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            subjectId: undefined,
                            isDeleted: false
                        }
                    },
                    getData: this.$api.ipark.PromotionInfoService.query
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
                if (rsp.total < 1) return;
                let promotionIds = rsp.data.map(r => r.id);
                this.$api.ipark.PromotionInfoService.summaryGroupByPromotionId(promotionIds).then(rs => {
                    let _rs = rs || [];
                    this.summaryMap = {}
                    _rs.forEach(r => {
                        this.summaryMap[r.promotionId] = r;
                    })
                })
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
                this.$refs.table.load();
            },
            cancel() {
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
