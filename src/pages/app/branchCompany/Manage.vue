<!--停车场管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <el-form-item label="名称">
                    <el-input v-model="page.query.param.name" clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button  @click="page.query.param = {}; search();" >取消</el-button>
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
            <el-table-column prop="code" label="编码" width="90">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="200">
            </el-table-column>
            <el-table-column prop="linkman" label="联系人" width="150">
            </el-table-column>
            <el-table-column prop="tel" label="联系电话" width="150">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="150">
            </el-table-column>
            <el-table-column prop="invoiceName" label="发票名称" width="150">
            </el-table-column>
            <el-table-column prop="taxId" label="纳税人识别号" width="150">
            </el-table-column>
            <el-table-column prop="bankName" label="开户行" width="150">
            </el-table-column>
            <el-table-column prop="bankAccount" label="银行帐户" width="150">
            </el-table-column>
            <el-table-column prop="invoiceBy" label="开票人" width="80">
            </el-table-column>
            <el-table-column prop="receiver" label="收款人" width="80">
            </el-table-column>
            <el-table-column prop="reviewBy" label="复核人" width="80">

            </el-table-column>
            <el-table-column prop="address" label="联系地址">
            </el-table-column>



            <el-table-column prop="status" label="状态" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.status,$dict.store.STATUS)}}
                </template>
            </el-table-column>

            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column prop="createOn" width="140" label="创建时间">
                <template slot-scope="{row}">
                    {{row.createOn}}
                </template>
            </el-table-column>
            <el-table-column width="80" label="操作" :fixed="'right'">
                <template slot-scope="scope">
                    <el-button type="text" title="编辑" @click="edit(scope.row)">
                        <i class="el-icon-edit"></i>
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

    export default {
        components: {FormPanel},
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
                    getData: this.$api.ipark.BranchCompanyService.query
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
                    this.$api.ipark.BranchCompanyService.delete(row.id).then(rsp => {
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
