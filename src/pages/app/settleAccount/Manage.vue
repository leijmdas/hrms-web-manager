<!--停车场管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true" label-width="100px">
                <el-form-item label="主体类型" prop="subjectType">
                    <el-select v-model="page.query.param.subjectType" @change="page.query.param.merchantId = undefined" clearable>
                        <el-option v-for="item in $dict.store.ACCOUNT_SUBJECT_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属分公司" prop="merchantId" v-if="page.query.param.subjectType == 1">
                    <branch-company-select v-model="page.query.param.merchantId" clearable></branch-company-select>
                </el-form-item>
                <el-form-item label="所属商户" prop="merchantId" v-if="page.query.param.subjectType == 2">
                    <merchant-select v-model="page.query.param.merchantId" clearable></merchant-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="page.query.param = {}; search();">取消</el-button>
                    <el-button @click="create">新增</el-button>

                </el-form-item>
            </el-form>
        </div>
        <v-table ref="table" :page="page" :table-minheight="450">
            <el-table-column prop="seq" label="序号" width="60">
                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="200">
            </el-table-column>
            <el-table-column prop="type" label="支付类型" width="120">
                <template slot-scope="{row}">
                    {{$dict.getText(row.type,$dict.store.PAY_TYPE)}}
                </template>
            </el-table-column>
            <el-table-column prop="accountType" label="账户类型" width="120">
                <template slot-scope="{row}">
                    {{$dict.getText(row.accountType,$dict.store.ACCOUNT_TYPE)}}
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
            <el-table-column prop="status" label="状态" width="80">
                <template slot-scope="{row}">
                    {{$dict.getText(row.status,$dict.store.STATUSS)}}
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>

            <el-table-column prop="createOn" width="140" label="创建时间">
                <template slot-scope="{row}">
                    {{row.createOn}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140" :fixed="'right'">
                <template slot-scope="{row, $index}">
                    <el-button v-if="row.type == 2 && row.accountType == 3" type="text" title="阿里APP授权二维码" @click="alipayAuthScanQr(row)">
                        <icon name="qrcode"></icon>
                    </el-button>
                    <el-button type="text" title="编辑" @click="edit(row)">
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button style="color: red;" type="text" @click="del(row,$index)" title="删除">
                        <i class="el-icon-delete red"></i>
                    </el-button>
                </template>
            </el-table-column>
        </v-table>
        <v-dialog ref="formDiag" title="信息编辑">
            <form-panel @saved="onFormSaved"></form-panel>
            <div slot="footer">
                <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
            </div>
        </v-dialog>
        <v-dialog title="阿里商户授权二维码" ref="qrDiag" width="400px">
            <el-alert :title="qrCode.accountName + ' 授权链接'" type="warning" :description="qrCode.content" style="word-break: break-all;" :closable="false">
                <p class="el-alert__description">
                    <a :href="qrCode.content" target="_blank" style="color: #e6a23c;">{{qrCode.content}}</a>
                </p>
            </el-alert>
            <div class="panel panel-default" style="text-align:center;padding:10px">
                <img :src="qrCode.imgUrl"/>
            </div>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>

<script>
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';

    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import FormPanel from './Form';

    export default {
        components: {FormPanel, BranchCompanySelect, MerchantSelect},
        data() {
            return {
                formStatus: 1,
                orderDateRange: [],
                qrCode: {},
                page: {
                    query: {
                        orderBys: 'id|desc',
                        param: {
                            isDeleted: false,
                            merchantId: null
                        }
                    },
                    getData: this.$api.ipark.SettleAccountService.query
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
                    this.$api.ipark.SettleAccountService.delete(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                });
            },
            alipayAuthScanQr(row) {
                this.$refs.qrDiag.show();
                this.qrCode = {
                    accountName: row.name
                };
                this.$nextTick(() => {
                    this.$api.ipark.SettleAccountService.alipayAuthScanQr(row.id).then(r => {
                        this.qrCode = r;
                        this.qrCode.accountName = row.name
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
