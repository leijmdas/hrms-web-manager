<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <el-form-item label="活动类型" prop="bizType">
                    <el-select v-model="page.query.param.type" @change="page.query.param.subjectId = undefined"
                               clearable>
                        <el-option v-for="item in $dict.store.ACTIVITY_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="编号">
                    <el-input v-model="page.query.param.code" clearable></el-input>
                </el-form-item>
                <el-form-item label="活动名称">
                    <el-input v-model="page.query.param.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="有效期限">
                    <div slot="label">
                        <el-select v-model="dateRangeType" style="width:120px" class="formitem-label">
                            <el-option value="start" label="开始时间"></el-option>
                            <el-option value="end" label="结束时间"></el-option>
                        </el-select>
                    </div>
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        :default-time="['00:00:00', '23:59:59']"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="page.query.param.status" style="width:120px" clearable>
                        <el-option value="0" label="草稿"></el-option>
                        <el-option value="1" label="已上架"></el-option>
                        <el-option value="2" label="已下架"></el-option>
                    </el-select>
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
            <el-table-column label="编号" prop="code"></el-table-column>
            <el-table-column label="活动名称" prop="name" width="200px"></el-table-column>
            <!-- 100-新注册用户101--老用户邀请(新用户注册)102--老用户邀请(新用户首次使用)-->
            <el-table-column label="活动类型" prop="type" width="200px">
                <template slot-scope="{row}">
                   <span> {{$dict.getText(row.type,$dict.store.ACTIVITY_TYPE)}}</span>

                </template>
            </el-table-column>
            <!-- 0-平台1-子公司2-物业 -->
            <el-table-column label="主体类型" prop="issueType">
                <template slot-scope="{row}">
                    <span>
                         {{$dict.getText(row.issueType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
                    </span>
                </template>
            </el-table-column>
            <!--0-全国1--子公司2--物业 -->
            <el-table-column label="适用场景" prop="sceneType">
                <template slot-scope="{row}">
                    <span>
                         {{$dict.getText(row.sceneType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="轮播图（数量）" prop="imgNumber"></el-table-column>
            <el-table-column label="开始时间" prop="startTime"></el-table-column>
            <el-table-column label="结束时间" prop="endTime"></el-table-column>
            <el-table-column label="规则说明" prop="ruleRemark"></el-table-column>
            <el-table-column label="模板总额" prop="ticketMoney"></el-table-column>
            <!-- 0-草稿1-上架2-下架 -->r
            <el-table-column label="状态" prop="status">
                <template slot-scope="{row}">
                    <span>
                         {{$dict.getText(row.status,$dict.store.PROMOTION_STATUS)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" title="上/下架" @click="putAway(scope.row)" v-if="scope.row.status != 2">
                        <i class="el-icon-upload2" v-show="scope.row.status==0"></i>
                        <i class="el-icon-download" v-show="scope.row.status==1"></i>
                    </el-button>
                    <el-button type="text" title="编辑" @click="edit(scope.row)">
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button type="text" v-if="scope.row.status==0" title="配置模板" @click="setModel(scope.row)">
                        <i class="el-icon-circle-plus-outline"></i>
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

        <v-dialog ref="modelDialog" title="模板">
            <model-panel></model-panel>
        </v-dialog>

    </div>
</template>

<script>
    import FormPanel from "./Form";
    import ModelPanel from "./Model";

    export default {
        name: "Manage",
        components: {FormPanel, ModelPanel},
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
