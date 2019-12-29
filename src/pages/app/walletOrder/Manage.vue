<!--钱包记录-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true">
                <el-form-item label="类型">
                    <el-select v-model="page.query.param.type" :clearable="true">
                        <el-option v-for="item in $dict.store.TYPES" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="交易编号">
                    <el-input v-model="page.query.param.tradeNo" :clearable="true"></el-input>
                </el-form-item>
                <!--<el-form-item label="用户名">
                     <user-select v-model="page.query.param.userId" :clearable="true"></user-select>
                 </el-form-item>
                 <el-form-item label="用户名">
                   <el-input v-model="page.query.param.userName" :clearable="true"></el-input>
                 </el-form-item>-->
                <el-form-item label="用户名">
                    <user-select v-model.number="page.query.param.userId" :clearable="true"></user-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="invest">赠送</el-button>
                </el-form-item>


                <el-collapse accordion v-model="activeNames">
                    <el-collapse-item name="1">
                        <el-form ref="form" :model="entity">
                            <el-form-item label="用户名" prop="userId" :rules="{type: 'number', required: true, message: '请选择用户', trigger: 'change'}">
                                <user-select v-model="entity.userId" :clearable="true"></user-select>
                            </el-form-item>
                            <el-form-item label="赠送金额">
                                <el-input v-model="entity.amount" v-numberInt="2"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="ascertian" :clearable="true">确定</el-button>
                            </el-form-item>
                            <div style="color:#909399">
                                备注：赠送金额为赠送用户的金额/（测试人员充值金额），赠送金额充值成功便会在用户的账户余额显示。
                            </div>
                        </el-form>
                    </el-collapse-item>
                </el-collapse>


            </el-form>
        </div>
        <v-table ref="table" :page="page" :table-minheight="450">
            <el-table-column prop="tradeNo" label="交易编号" width="240">
            </el-table-column>
            <el-table-column prop="companyName" label="用户名" width="130">
                <template slot-scope="{row}">{{(row.userInfoDTO||{}).username}}</template>
            </el-table-column>
            <el-table-column prop="walletTotalAmount" label="账户总余额" width="100">
            </el-table-column>
            <el-table-column prop="type" width="80" label="支付类型">
                <template slot-scope="{row}">
                    <span v-if='row.type===1'>充值</span>
                    　　 <span v-else-if='row.type===2'>消费</span>
                    <span v-else-if='row.type===3'>退款</span>
                    <span v-else-if='row.type===4'>赠送</span>
                    <span v-else-if='row.type===5'>收益</span>
                    <span v-else-if='row.type===6'>提现</span>
                    　　 <span v-else></span>
                </template>
            </el-table-column>

            <el-table-column prop="amount" label="订单金额" width="80">
            </el-table-column>
            <el-table-column prop="orderTime" label="订单时间" width="160">
            </el-table-column>
            <el-table-column prop="status" width="100" label="支付状态">
                <template slot-scope="{row}">
                    <span v-if='row.status===-1'>支付失败</span>
                    　　 <span v-else-if='row.status===0'>未支付</span>
                    <span v-else-if='row.status===1'>支付成功</span>
                    　　 <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
            </el-table-column>
            <el-table-column prop="createOn" width="140" label="创建时间">
                <template slot-scope="{row}">
                    {{row.createOn}}
                </template>
            </el-table-column>
            <!-- <el-table-column width="80" label="操作" :fixed="'right'">
              <template slot-scope="scope">
                <el-button type="text" title="编辑" @click="edit(scope.row)">
                  <i class="el-icon-edit"></i>
                </el-button>
                <el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
                  <i class="el-icon-delete red"></i>
                </el-button>
              </template>
            </el-table-column> -->
        </v-table>
    </div>
</template>
<style rel="stylesheet/less" lang="less">
    .el-collapse-item__header {
        display: none;
    }

    .el-collapse-item__content {
        padding-bottom: 0;
    }
</style>
<script>
    import {fetch} from '@/utils';
    import UserSelect from '@/components/widgets/UserSelect.vue';

    const defaultEntity = {
        userId: null,
        amount: null
    };
    export default {
        components: {UserSelect},
        inject: ['reload'],
        data() {
            return {
                entity: _.cloneDeep(defaultEntity),
                activeNames: '',
                formStatus: 1,
                orderDateRange: [],
                page: {
                    query: {
                        param: {
                            userId: undefined,
                            userInfoDTO: {
                                username: ''
                            }
                        }
                    },
                    getData: this.$api.ipark.WalletOrder.queryWAndUser
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
                amount: [
                    {
                        type: 'number'
                    }
                ]
            };
        },
        computed: {},

        methods: {
            create() {
                this.formStatus = 1;
                this.$refs.formPanel.init({});
            },
            ascertian() {
                this.$refs['form'].validate((valid, err) => {
                    if (valid) {
                        this.$api.ipark.WalletOrder.giveAmount(this.entity).then(rsp => {
                            // this.$emit('saved', rsp);
                            this.entity = _.cloneDeep(this.defaultEntity);
                            this.reload();
                            this.$message({
                                message: '赠送成功',
                                type: 'success'
                            });
                        });
                    }
                });
            },
            edit(row) {
                this.formStatus = 2;
                this.$refs.formPanel.setValues(row);
            },
            del(row) {
                this.$confirm('确定删除此条记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    fetch.base.Brand.delete(row.id).then(rsp => {
                        this.search();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                });
            },
            onDataloaded(rsp) {
                if (rsp.total < 1) return;
                let cfgIds = rsp.model.map(m => m.workTypeId);
                console.log(cfgIds);
                //按ID加载
            },
            init(options = {}) {
                this.search();
            },
            search() {
                this.$refs.table.load();
            },
            invest() {
                this.activeNames = this.activeNames ? '' : '1';
            }
        },
        created() {
        },
        mounted() {
            this.$on('init', this.init);
        }
    };
</script>
