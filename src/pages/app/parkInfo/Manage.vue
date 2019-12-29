<!--停车场管理-->
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


                <el-form-item label="用户等级">
                    <user-grade v-model="page.query.param.userGradeId"
                                :clearable="true" ></user-grade>
                </el-form-item>

                <el-form-item label="编码">
                    <el-input v-model="page.query.param.code"
                              :clearable="true"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="page.query.param.name"
                              :clearable="true"></el-input>
                </el-form-item>
                <!-- <el-form-item label="停车场名称">
                   <park-select v-model="page.query.param.parkId"  :clearable="true"></park-select>
                 </el-form-item>-->
                <el-form-item label="发布状态">
                    <el-select v-model="page.query.param.status"
                               :clearable="true">
                        <el-option v-for="item in $dict.store.PUBLISH_STATUS"
                                   :key="item[0]"
                                   :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary"
                               @click="search"
                               v-keycode="'ENTER'">查询</el-button>
                    <el-button @click="page.query.param = {}; search();">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <v-toolbar title="数据列表"
                   type="alert">
            <el-button type="primary" plain
                       @click="create">新增</el-button>
            <el-button type="danger" plain
                       @click.stop="editBillRule">设定计费规则</el-button>
            <el-button type="danger" plain
                       @click="syncToBase">同步楼层区域至中间库</el-button>
            <el-button type="danger" plain
                       @click="syncToCBase">同步车位至中间库</el-button>

        </v-toolbar>
        <v-table ref="table"
                 :page="page"
                 :table-minheight="450"
                 class="panel-main">
            <el-table-column prop="seq"
                             label="序号"
                             width="60">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column prop="branchCompanyName"
                             label="子公司"
                             width="140">
                <template slot-scope="{row}">{{(row.viewBase||{}).branchCompanyName||'请设定分公司'}}</template>
            </el-table-column>
            <el-table-column prop="name"
                             label="物业"
                             width="150">
                <template slot-scope="{row}">{{(row.merchantInfo||{}).name}}</template>
            </el-table-column>

            <el-table-column prop="code"
                             width="120"
                             label="停车场编码"></el-table-column>
            <el-table-column prop="name"
                             width="120"
                             label="停车场名称"></el-table-column>
            <el-table-column prop="status"
                             width="80"
                             label="发布状态">
                <template slot-scope="{row}">
                <span :style="(row.viewBase || {}).parkState === 1 ? 'color: green' : ''">
                     {{$dict.getText(row.status,$dict.store.PUBLISH_STATUS)}}
                </span>
                </template>
            </el-table-column>
            <el-table-column prop="userGradeId"
                             width="80"
                             label="用户等级">
                <template slot-scope="{row}">{{findUserGradeName(row.userGradeId)}}</template>
            </el-table-column>
            <el-table-column prop="parkSatate"
                             label="车场心跳"
                             width="80">
                <template slot-scope="{row}">
                <span :style="(row.viewBase || {}).parkState === 1 ? 'color: red' : ''">
                    {{displayParkState(row)}}
                </span>
                </template>
            </el-table-column>
            <el-table-column prop="isNavigation"
                             width="120"
                             label="室内导航">
                <template slot-scope="scope">{{scope.row.isNavigation?'有':'无'}}</template>
            </el-table-column>
            <el-table-column prop="totalNum"
                             width="80"
                             label="车位总数"></el-table-column>
            <el-table-column prop="openBookNum"
                             width="100"
                             label="开放预约数"></el-table-column>

            <el-table-column prop="freeMinutes"
                             width="100"
                             label="免费时长(分)"></el-table-column>
            <el-table-column prop="address"
                             label="地址"></el-table-column>


            <el-table-column prop="createOn"
                             width="140"
                             label="创建时间">
                <template slot-scope="{row}">{{row.createOn}}</template>
            </el-table-column>

            <el-table-column width="100"
                             label="操作"
                             :fixed="'right'">
                <template slot-scope="scope">
                    <!-- <el-button type="text" title="绑定企业" @click="bindCorp(scope.row)">
                      <i class="el-icon-share"></i>
                    </el-button> -->
                    <el-button type="text"
                               title="扫码支付二维码"
                               @click="flushQrCode(scope.row)">
                        <icon name="qrcode"></icon>
                    </el-button>
                    <el-button type="text"
                               title="编辑"
                               @click="edit(scope.row)">
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button style="color :red;"
                               type="text"
                               @click="del(scope.row, scope.$index)"
                               title="删除">
                        <i class="el-icon-delete red"></i>
                    </el-button>
                </template>
            </el-table-column>
        </v-table>
        <!-- <v-dialog title="信息编辑" ref="formDiag" :appendToBody="true">
          <edit-panel @tabChange="onEditTabChange"></edit-panel>
          <div slot="footer" v-show="currentFormIndex==0">
            <el-button type="primary" @click="$refs.formDiag.dispatch('submit')"> 保存</el-button>
            <el-button @click="()=>{this.$refs.formDiag.hide();}">取消</el-button>
          </div>
        </v-dialog> -->

        <v-dialog title="绑定企业"
                  ref="corpDiag"
                  width="400px">
            <bind-corp-panel @saved="onBindCorpFormSaved"></bind-corp-panel>
            <div slot="footer">
                <el-button type="primary"
                           @click="$refs.corpDiag.dispatch('submit')">确定</el-button>
            </div>
        </v-dialog>
        <v-dialog title="扫码支付二维码"
                  ref="qrDiag"
                  width="400px">
            <el-alert title="链接"
                      type="warning"
                      :description="qrCode.content"
                      :closable="false"></el-alert>
            <div class="panel panel-default"
                 style="text-align:center;padding:10px">
                <img :src="qrCode.imgUrl"/>
            </div>
        </v-dialog>
    </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import UserGrade from '@/components/widgets/UserGradeSelect.vue';
    import CorpSelect from '@/components/widgets/CorpSelect.vue';
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import ParkSelect from '@/components/widgets/ParkSelect';
    import BindCorpPanel from './BindCorp';

    export default {
        components: {CorpSelect,UserGrade, BranchCompanySelect, BindCorpPanel, MerchantSelect, ParkSelect},
        data() {
            return {
                userGradeArray: [],
                formStatus: 1,
                currentFormIndex: 0,
                qrCode: {},
                page: {
                    query: {
                        orderBys: 'merchantId|asc,id|asc',
                        param: {isDeleted: false}
                    },
                    getData: this.$api.ipark.ParkInfoService.query
                }
            };
        },
        computed: {},

        methods: {

            displayParkState(row) {
                let parkState = (row.viewBase || {}).parkState;
                if (parkState === null || parkState === 2) {
                    return '未开放';
                }
                return parkState === 0 ? '正常' : '异常';
            },

            editBillRule() {
                let rows = this.$refs.table.getSelectedRows();
                if (rows.length < 1) {
                    this.$message('请选择一条记录');
                    return;
                }
                this.$router.push({name: 'parkingRule:edit', query: {parkId: rows[0].id}});
            },
            onEditTabChange(index) {
                this.currentFormIndex = index;
            },
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
            syncToBase(row) {
                let rows = this.$refs.table.getSelectedRows();
                if (rows.length < 1) {
                    this.$message('请选择一条记录');
                    return;
                }
                this.$api.ipark.ParkInfoService.syncToBase(this.$refs.table.selectRows[0].code).then(r => {
                    console.log(r);
                    this.$message('同步楼层区域至中间库成功！');

                });

            },
            syncToCBase(row) {
                let rows = this.$refs.table.getSelectedRows();
                if (rows.length < 1) {
                    this.$message('请选择一条记录');
                    return;
                }
                this.$api.ipark.ParkInfoService.syncToCBase(this.$refs.table.selectRows[0].code).then(r => {
                    console.log(r);
                    this.$message('同步车位至中间库成功！' );
                });

            },
            create() {
                //this.$refs.formDiag.show({});
                this.$router.push({name: 'park:edit'});
                //this.$router.push({name:'park:edit' ,query:{branchCompanyId:this.page.query.param.branchCompanyId}});
            },
            edit(row) {
                if (row.merchantInfo == null) {
                    row.merchantInfo = {
                        branchCompanyId: 0,
                        id: row.merchantId
                    };
                };

                console.log(row);

                this.$router.push({
                    name: 'park:edit',
                    query: {id: row.id,
                        branchCompanyId: row.merchantInfo.branchCompanyId}
                });
            },
            del(row) {
                this.$confirm('确定删除此条记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$api.ipark.ParkInfoService.delete(row.id).then(rsp => {
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

            findUserGradeName(userGradeId) {

                if (this.userGradeArray == null) {
                    return '-';
                }
                let ret = this.userGradeArray.find(item => item.id === userGradeId);
                return (ret || {name:'默认'}).name;
            },
            queryUserGrade() {

                this.$api.ipark.UserGradeService.query({limit:-1}).then(r => {
                   this.userGradeArray = r.data;
                });

            },
            init(options = {}) {
                this.queryUserGrade();
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
