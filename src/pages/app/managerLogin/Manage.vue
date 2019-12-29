<!--停车场管理-->
<template>
    <div>

        <div class="panel panel-default panel-search">

            <el-form :inline="true">

                <el-form-item label="子公司">
                    <branch-company-select v-model.number="page.query.param.branchCompanyId"
                                           :clearable="true"></branch-company-select>
                </el-form-item>

                <el-form-item label="物业">
                    <merchant-select ref="merchantSelect" v-model="page.query.param.merchantId"
                                     :branchCompanyId="page.query.param.branchCompanyId"
                                     :clearable="true"></merchant-select>
                </el-form-item>

                <el-form-item label="停车场">
                    <park-select ref="parkSelect" v-model="page.query.param.parkId"
                                 :merchantId="page.query.param.merchantId" :clearable="true"></park-select>
                </el-form-item>
                <el-form-item label="用户类型">
                    <el-select v-model="page.query.param.userType" :clearable="true">
                        <el-option v-for="item in $dict.store.MANAGER_LOGIN_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登录名">
                    <el-input v-model="page.query.param.loginName" clearable></el-input>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="page.query.param = {}; search();">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <v-toolbar title="数据列表" type="alert">
            <el-button plain type="primary" @click="create">新增</el-button>
        </v-toolbar>
        <v-table ref="table" :page="page" :table-minheight="450">
            <el-table-column prop="seq" label="序号" width="60">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column prop="userType" label="用户类型" width="120">
                <template slot-scope="{row}">
                    {{$dict.getText(row.userType,$dict.store.MANAGER_LOGIN_TYPE)}}
                </template>
            </el-table-column>

            <el-table-column prop="loginName" label="登录名" width="90">
            </el-table-column>
            <el-table-column prop="realName" label="实名" width="200">
            </el-table-column>

            <el-table-column prop="mobile" label="联系电话" width="150">
            </el-table-column>
            <el-table-column prop="viewBase.branchCompanyName" label="子公司" width="150">
            </el-table-column>
            <el-table-column prop="viewBase.merchantName" label="物业名称" width="150">
            </el-table-column>
            <el-table-column prop="viewBase.parkName" label="停车场" width="150">
            </el-table-column>


            <el-table-column prop="status" label="状态" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.status,$dict.store.STATUSS)}}
                </template>
            </el-table-column>

            <el-table-column prop="email" label="邮箱">
            </el-table-column>

            <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="{row}">
                    {{row.createTime}}
                </template>
            </el-table-column>
            <el-table-column width="160" label="操作" :fixed="'right'">
                <template slot-scope="scope">
                    <el-button type="text" title="编辑" @click="edit(scope.row)">
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button v-if="false" type="text" title="修改密码">
                        修改密码
                    </el-button>
                    <el-button style="color: red" type="text" @click="del(scope.row,scope.$index)" title="删除">
                        <i class="el-icon-delete red"></i>
                    </el-button>

                </template>
            </el-table-column>
        </v-table>
        <v-dialog ref="formDiag" title="信息编辑">
            <form-panel @saved="onFormSaved"></form-panel>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
    import FormPanel from './Form';

    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import ParkSelect from '@/components/widgets/ParkSelect';

    export default {
        components: {
            FormPanel,
            BranchCompanySelect,
            MerchantSelect,
            ParkSelect
        },

        data() {
            return {
                formStatus: 1,
                orderDateRange: [],
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            isDeleted: false
                        }
                    },
                    getData: this.$api.ipark.ManagerLoginService.query
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
                this.$refs.formDiag.show();
            },
            edit(row) {
                this.$refs.formDiag.show({id: row.id});
            },
            del(row) {
                this.$confirm('确定删除此条记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$api.ipark.ManagerLoginService.delete(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
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
            this.$on('init', this.init);
        }
    };
</script>
