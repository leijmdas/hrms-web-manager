<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <el-form-item label="子公司">
                    <branch-company-select v-model="page.query.param.branchCompanyId"
                                           :clearable="true"></branch-company-select>
                </el-form-item>

                <el-form-item label="物业">
                    <merchant-select v-model="page.query.param.merchantId"
                                     :clearable="true"
                                     :branchCompanyId="page.query.param.branchCompanyId"></merchant-select>
                </el-form-item>

                <el-form-item label="停车场">
                    <park-select v-model="page.query.param.parkId"
                                     :clearable="true"
                                     :merchantId ="page.query.param.merchantId"></park-select>
                </el-form-item>

                <el-form-item label="商家">
                    <merchant-select v-model="page.query.param.merchantId"
                                     :clearable="true"
                                     :branchCompanyId="page.query.param.branchCompanyId"></merchant-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="cancel">取消</el-button>
                    <!--<el-button @click="create">新增</el-button>-->
                </el-form-item>
            </el-form>
        </div>
        <v-toolbar title="数据列表" type="alert">
            <el-button type="primary" plain @click="create">新增</el-button>
        </v-toolbar>
        <v-table :page="page" ref="table" :table-minheight="450">
            <el-table-column label="序号" prop="seq" width="60px">
                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column label="子公司" prop="name" width="200px"></el-table-column>
            <!-- 100-新注册用户101--老用户邀请(新用户注册)102--老用户邀请(新用户首次使用)-->
            <el-table-column label="物业" prop="type" width="200px">
                <template slot-scope="{row}">
                   <span> {{$dict.getText(row.type,$dict.store.ACTIVITY_TYPE)}}</span>

                </template>
            </el-table-column>
            <!-- 0-平台1-子公司2-物业 -->
            <el-table-column label="停车场编码" prop="issueType" width="120px">
                <template slot-scope="{row}">
                    <span>
                         {{$dict.getText(row.issueType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="停车场名称" prop="issueType" width="200px">
                <template slot-scope="{row}">
                    <span>
                         {{$dict.getText(row.issueType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
                    </span>
                </template>
            </el-table-column>
            <!--0-全国1--子公司2--物业 -->
            <el-table-column label="商家类型" prop="sceneType" width="160px">
                <template slot-scope="{row}">
                    <span>
                         {{$dict.getText(row.sceneType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商家编码" prop="sceneType" width="120px">
                <template slot-scope="{row}">
                    <span>
                         {{$dict.getText(row.sceneType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="商家名称" prop="sceneType"  >
                <template slot-scope="{row}">
                    <span>
                         {{$dict.getText(row.sceneType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column width="80"
                             label="操作"
                             :fixed="'right'">
                <template slot-scope="scope">
                    <el-button :fixed="'right'" style="color :red;"
                               type="text"
                               @click="del(scope.row, scope.$index)"
                               title="删除">
                        <i class="el-icon-delete red"></i>
                    </el-button>
                </template>
            </el-table-column>
        </v-table>
        <v-dialog ref="formDiag" title="新增">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
                <el-button type="default" @click="()=>{$refs.formDiag.hide()}">取消</el-button>
            </div>
        </v-dialog>


    </div>
</template>

<script>
    import FormPanel from "./Form";
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import ParkSelect from '@/components/widgets/ParkSelect';

    export default {
        name: "Manage",
        components: {BranchCompanySelect, MerchantSelect, ParkSelect, FormPanel},
        data() {
            return {
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            code: "",
                            name: "",
                            status: "",
                        },
                        dateRanges: {
                            startTime: {
                                endDate: "",
                                startDate: ""
                            },
                            endTime: {
                                endDate: "",
                                startDate: ""
                            }
                        },
                    },
                    getData: this.$api.ipark.ActivityRulesService.query
                },
                dateRangeType: "start",
                dateRange: [],
            }
        },
        methods: {
            create() {
                this.$refs.formDiag.show();
            },
            onFormSaved() {
                this.$refs.formDiag.hide();
                this.$nextTick(this.search);
            },
            /**
             * 上下架操作
             */
            putAway(row) {
                console.log(row)
                // 根据状态来判断 0-草稿1-上架2-下架  已上架的只能下架  已下架的不能操作 草稿可以上架
                if (row.status == 0) {
                    let msg = '确定上架此活动吗？</br><span style="color:red">一旦上架，部分信息不允许修改!</span>';
                    this.$confirm(msg, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        dangerouslyUseHTMLString: true
                    }).then(() => {
                        this.$api.ipark.ActivityRulesService.save({id: row.id, status: 1}).then(() => {
                            this.search();
                            this.$message({
                                type: 'success',
                                message: '上架成功!'
                            });
                        })
                    });
                }
                if (row.status == 1) {
                    this.$confirm('确认下架此活动吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        this.$api.ipark.ActivityRulesService.save({id: row.id, status: 2}).then(() => {
                            this.search();
                            this.$message({
                                type: 'success',
                                message: '下架成功!'
                            });
                        })
                    });
                }
            },
            /**
             * 编辑
             */
            edit(row) {
                this.$refs.formDiag.show({id: row.id});
            },
            /**
             * 配置模板
             */
            setModel(row) {
                this.$refs.modelDialog.show({id: row.id})
            },
            init(options = {}) {
                this.search();
            },
            search() {
                if (this.dateRangeType == 'start') {
                    if (this.dateRange.length > 0) {
                        this.page.query.dateRanges = {
                            startTime: {
                                endDate: this.dateRange[1],
                                startDate: this.dateRange[0]
                            },
                            endTime: {
                                endDate: '',
                                startDate: ''
                            }
                        }
                    } else {
                        this.page.query.dateRanges = {};
                    }
                } else if (this.dateRangeType == 'end') {
                    if (this.dateRange.length > 0) {
                        this.page.query.dateRanges = {
                            startTime: {
                                endDate: '',
                                startDate: ''
                            },
                            endTime: {
                                endDate: this.dateRange[1],
                                startDate: this.dateRange[0]
                            }
                        }
                    } else {
                        this.page.query.dateRanges = {};

                    }
                }
                this.$refs.table.load();
            },
            cancel() {
                this.dateRange = [];
                this.page.query.param = {};
                this.search();
            }
        },
        mounted() {
            this.$on('init', this.init);
        }
    }
</script>

<style lang="less">
    .put-away-dialog {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 15px 0;

        .icon-jingshi {
            margin-right: 15px;
        }
    }
</style>
