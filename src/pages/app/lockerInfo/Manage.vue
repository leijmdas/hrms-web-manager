<!--停车场管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form label-position="right" label-width="100px" :inline="true">
                <el-row>

                    <el-form-item label="子公司">
                        <branch-company-select v-model="page.query.param.branchCompanyId"
                                               :clearable="true"></branch-company-select>
                    </el-form-item>

                    <el-form-item label="物业">
                        <merchant-select v-model="page.query.param.merchantId" :clearable="true"
                                         :branchCompanyId="page.query.param.branchCompanyId"></merchant-select>
                    </el-form-item>

                    <el-form-item label="停车场">
                        <park-select v-model="page.query.param.parkId"
                                     :merchantId="page.query.param.merchantId" :clearable="true"></park-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="电压状态">
                        <!--<el-input v-model="page.query.param.electricQuantity" :clearable="true"></el-input>-->
                        <el-select v-model="page.query.param.lockerVoltageStatus" :clearable="true">
                            <el-option v-for="item in $dict.store.CHARGE_STATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车位锁编码">
                        <el-input v-model="page.query.param.code" :clearable="true"></el-input>
                    </el-form-item>
                    <el-form-item label="车位锁状态">
                        <el-select v-model="page.query.param.status" :clearable="true">
                            <el-option v-for="item in $dict.store.STATUSS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                        <el-button @click="page.query.param = {}; search();">取消</el-button>
                        <!--<el-button  @click="cancelFilter" >取消</el-button>-->
                    </el-form-item>
                </el-row>

            </el-form>
        </div>
        <v-toolbar title="数据列表" type="alert">
            <el-button type="primary" plain @click="create">新增</el-button>
        </v-toolbar>
        <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
            <el-table-column prop="seq" label="序号" width="60">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column prop="code" width="160" label="设备编号"></el-table-column>
            <el-table-column prop="" label="物业" width="160">
                <template slot-scope="{row}">{{(row.merchantInfo||{}).name}}</template>
            </el-table-column>
            <el-table-column prop="companyName" label="停车场" width="120">
                <template slot-scope="{row}">{{(row.parkInfo||{}).name}}</template>
            </el-table-column>

            <el-table-column prop="status" width="80" label="状态">
                <template slot-scope="scope">{{scope.row.status===1?'启用':'禁用'}}</template>
            </el-table-column>
            <el-table-column prop="version" label="硬件版本" width="80"></el-table-column>

            <el-table-column prop="lockerVoltageStatus" width="100" label="电压状态">
                <template slot-scope="{row}">
                <span :style="row.lockerVoltageStatus===0?'':
                             row.lockerVoltageStatus===1?
                             'color: #ffa200;font-weight:bold':
                             'color: red;font-weight:bold'">
                    {{$dict.getText(row.lockerVoltageStatus,$dict.store.CHARGE_STATUS)}}
                </span>
                </template>

            </el-table-column>

            <el-table-column prop="pressure" label="电压" width="80"></el-table-column>

            <el-table-column prop="createTime" label="安装时间" width="140"></el-table-column>

            <!--<el-table-column prop="scropTime" label="报废时间" width="140"></el-table-column>-->
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column width="100" label="操作" :fixed="'right'">
                <template slot-scope="scope">
                    <el-button type="text" title="查看" @click="share(scope.row)">
                        <i class="el-icon-share"></i>
                    </el-button>
                    <el-button type="text" title="编辑" @click="edit(scope.row)">
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button style="color: red" type="text" @click="del(scope.row,scope.$index)" title="删除">
                        <i class="el-icon-delete red"></i>
                    </el-button>
                </template>
            </el-table-column>
        </v-table>
        <v-dialog :title="xianshi" ref="formDiag">
            <form-panel @saved="onFormSaved" :disables="disable"></form-panel>
            <div slot="footer">
                <el-button type="primary" v-if="shares==true" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
                <el-button @click="()=>{this.$refs.formDiag.hide();}">取消</el-button>
            </div>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
    import CorpSelect from '@/components/widgets/CorpSelect.vue';
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import ParkSelect from '@/components/widgets/ParkSelect';
    import FormPanel from './Form';


    export default {
        components: {CorpSelect, FormPanel, BranchCompanySelect, MerchantSelect, ParkSelect},
        data() {
            return {
                formStatus: 1,
                qrCode: {},
                xianshi: '新增地锁',
                page: {
                    query: {
                        orderBys: 'merchantId|asc,parkId|asc,code|asc',
                        param: {
                            isDeleted: false,
                            parkInfo: {
                                name: ''
                            }
                        }
                    },
                    getData: this.$api.ipark.LockerInfoService.query
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
                ],
                shares: true,
                disable: false

            };
        },
        computed: {},

        methods: {
            flushQrCode(row) {
                this.$refs.qrDiag.show();
                this.$nextTick(() => {
                    this.$api.ipark.ParkInfoService.scanQr(row.id).then(r => {
                        this.qrCode = r;
                    });
                });
            },
            getCorpInfo(row, type) {
                let rts = row.corpRelations || [];
                let arr = [];
                for (let i = 0; i < rts.length; i++) {
                    let c = rts[i].corpInfo || {};
                    return c.name;
                }
                return '-';
            },
            create() {
                this.xianshi = '新增地锁';
                this.$refs.formDiag.show({});
                this.shares = true;
                this.disable = false;
            },
            share(row) {
                this.xianshi = '信息查看';
                this.$refs.formDiag.show({id: row.id});
                this.shares = false;
                this.disable = true;
            },
            edit(row) {
                this.xianshi = '信息编辑';
                this.$refs.formDiag.show({id: row.id});
                this.shares = true;
                this.disable = false;
            },
            del(row) {
                this.$confirm('确定删除此条记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$api.ipark.LockerInfoService.delete(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                });
            },
            bindCorp(row) {
                this.$refs.corpDiag.show({
                    parkInfo: row
                });
            },
            onFormSaved() {
                this.$refs.formDiag.hide();
                this.$nextTick(this.search);
            },
            onBindCorpFormSaved() {
                this.$refs.corpDiag.hide();
                this.$nextTick(this.search);
            },
            init(options = {}) {
                this.search();
            },
            cancelFilter() {
                this.page.query.param.branchCompanyId = null;
                this.page.query.param.merchantId = null;
                this.page.query.param.parkId = null;
                this.page.query.param.code = null;
                this.page.query.param.status = null;

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
