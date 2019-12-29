<!--停车场管理-->
<template>
    <div>
        <div class="panel panel-default panel-search">
            <el-form :inline="true" label-position="right" label-width="70px">

                <div>

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

                    <el-form-item label="泊位号">
                        <el-input v-model="page.query.param.code" :clearable="true"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="发布状态">
                        <el-select v-model="page.query.param.publishStatus" :clearable="true">
                            <el-option v-for="item in $dict.store.PUBLISH_STATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="用户等级">
                        <user-grade v-model="page.query.param.userGradeId" :clearable="true" ></user-grade>
                    </el-form-item>
                    <el-form-item label="车位类型">
                        <el-select v-model="page.query.param.portType" :clearable="true">
                            <el-option v-for="item in $dict.store.PARK_PORT_TYPE" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="网络状态">
                        <el-select v-model="page.query.param.onlineStatus" :clearable="true">
                            <el-option v-for="item in $dict.store.ONLIANSTATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>

                    <el-form-item label="预约状态">
                        <el-select v-model="page.query.param.assignStatus" :clearable="true">
                            <el-option v-for="item in $dict.store.ASSIGNSTATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>


                    <el-form-item label="地锁状态">
                        <el-select v-model="page.query.param.status" :clearable="true">
                            <el-option v-for="item in $dict.store.STTATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电压状态">
                        <el-select v-model="page.query.param.lockerInfo.lockerVoltageStatus" :clearable="true">
                            <el-option v-for="item in $dict.store.CHARGE_STATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label=" ">
                        <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
                        <!--<el-button  @click="page.query.param = {}; search();" >取消</el-button>-->
                        <el-button @click="cancel" v-keycode="'ENTER'">取消</el-button>
                    </el-form-item>


                </div>
            </el-form>
        </div>

        <v-toolbar title="数据列表" type="alert">
            <el-button type="primary" plain @click="create">新增</el-button>
            <!-- <el-button type="danger" plain @click="create">导入</el-button>

             <el-button type="danger" plain @click="create">导出</el-button>-->
        </v-toolbar>

        <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
            <el-table-column prop="seq" label="序号" width="50">

                <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

            </el-table-column>
            <el-table-column prop="code" width="120" label="泊位号"></el-table-column>
            <el-table-column prop="companyName" width="130" label="停车场">
                <template slot-scope="{row}">{{(row.parkInfo||{}).name}}</template>
            </el-table-column>
            <el-table-column prop="" label="楼层" width="80">
                <template slot-scope="{row}">{{(row.parkFloor||{}).name}}</template>
            </el-table-column>
            <el-table-column prop="" label="区域" width="80">
                <template slot-scope="{row}">{{(row.parkArea||{}).name}}</template>
            </el-table-column>
            <!--<el-table-column prop="lockerId" width="80" label="设备号"></el-table-column>    -->

            <el-table-column prop="publishStatus" width="80" label="发布状态">
                <template slot-scope="scope">
                    <span :style="scope.row.publishStatus==1?'color: green':'color: #ffa200'">
                        {{$dict.getText(scope.row.publishStatus,$dict.store.PUBLISH_STATUS)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="userGradeId" width="70" label="用户等级">
                <template slot-scope="scope">{{findUserGradeName(scope.row.userGradeId)}}</template>

            </el-table-column>

            <el-table-column prop="portType" width="80" label="车位类型">
                <template slot-scope="scope">
                    <span :style="scope.row.portType==2?'color: green':'color: dodgerblue'">
                        {{$dict.getText(scope.row.portType,$dict.store.PARK_PORT_TYPE)}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="onlineStatus" width="80" label="网络状态">
                <template slot-scope="scope">
                    <span :style="scope.row.onlineStatus===1?'color: green':'color: red;font-weight:bold'">
                        {{scope.row.onlineStatus===1?'联网':'断网'}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="assignStatus" width="80" label="预约状态">
                <template slot-scope="scope">
                    <span :style="scope.row.assignStatus==1?'color: #ffa200':'color: green'">
                        {{scope.row.assignStatus===1?'已预约':'未预约'}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="onstatus" label="是否有车">
                <template slot-scope="scope">
                    <span :style="scope.row.onstatus==1?'color: #ffa200':'color: green'">
                        {{scope.row.onstatus==1?'有车':'无车 '}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="" label="地锁编码" width="140">
                <template slot-scope="{row}">{{(row.lockerInfo||{}).code}}</template>
            </el-table-column>
            <el-table-column prop="status" width="80" label="地磁状态">
                <template slot-scope="scope" >
                <span :style="scope.row.status===1?'color: green':'color: red;font-weight:bold'">
                    {{scope.row.status===1?'正常':'异常'}}
                </span>
                </template>
            </el-table-column>

            <!--(1: 已上升, 2: 已下降)-->
            <el-table-column prop="lockerStatus" label="摆臂状态">
                <template slot-scope="{row}">
                    <span :style="!row.lockerInfo?'color: #ffa200':
                     (row.lockerInfo.type==row.lockerStatus==1 || row.lockerInfo.type==row.lockerStatus==2)?'color: green':'color: #ffa200'">
                        {{$dict.getText(row.lockerStatus,$dict.store.LOCKSTATUS)}}
                    </span>
                </template>
            </el-table-column>


            <el-table-column prop="lockerVoltageStatus" width="80" label="电压状态">
                <template slot-scope="scope" v-if="scope.row.lockerInfo">
                    <span :style="scope.row.lockerInfo.lockerVoltageStatus===0?'color: green':
                             scope.row.lockerInfo.lockerVoltageStatus===1?
                             'color: #ffa200;font-weight:bold':
                             'color: red;font-weight:bold'">
                    {{$dict.getText((scope.row.lockerInfo||{}).lockerVoltageStatus,$dict.store.CHARGE_STATUS)}}
                    </span>
                </template>
            </el-table-column>


            <el-table-column prop="electricQuantity" width="60" label="电压">
                <template slot-scope="scope" v-if="scope.row.lockerInfo">
                             <span :style="scope.row.lockerInfo.lockerVoltageStatus===0?'color: green':
                             scope.row.lockerInfo.lockerVoltageStatus===1?
                             'color: #ffa200;font-weight:bold':
                             'color: red;font-weight:bold'">
                                 {{   scope.row.electricQuantity  }}

                             </span>
                </template>

            </el-table-column>
            <el-table-column prop="opOn" width="140" label="操作时间">
            </el-table-column>
            <el-table-column prop="unassignable" label="可否分配">
                <template slot-scope="scope">
                    <span :style="scope.row.unassignable?'color: #ffa200':'color: green'">
                        {{scope.row.unassignable===true?'不可分配':'可分配'}}
                    </span>
                </template>
            </el-table-column>

            <el-table-column width="60" label="操作" :fixed="'right'">
                <template slot-scope="scope">
                    <!-- <el-button type="text" title="查看" @click="share(scope.row)">
                       <i class="el-icon-share"></i>
                     </el-button>   -->
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
            <form-panel ref="formData" @saved="onFormSaved" :disables="disable" :locker="locker"></form-panel>
            <div slot="footer" align="center">
                <el-button v-if="shares==true" type="primary" @click="saved">保存</el-button>
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
    import AreaSelect from '@/components/widgets/AreaSelect.vue';
    import UserGrade from '@/components/widgets/UserGradeSelect.vue';

    import FormPanel from './Form';

    export default {
        components: {BranchCompanySelect,UserGrade, CorpSelect, FormPanel, MerchantSelect, ParkSelect, AreaSelect},
        data() {
            return {
                userGradeArray : [],
                formStatus: 1,
                qrCode: {},
                xianshi: '新增泊位',
                locker: '',
                page: {
                    query: {
                        orderBys: 'parkId|asc,parkFloor.name|asc,parkArea.name|asc,code|asc',
                        param: {
                            isDeleted: false,
                            parkInfo: {
                                //name: ''
                            },
                            lockerInfo: {
                                //lockerVoltageStatus: null,
                                //status: null
                            }


                        }
                    },
                    getData: this.$api.ipark.ParkPortService.query
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
                this.locker = '';
                this.xianshi = '新增泊位';
                this.$refs.formDiag.show({});
                this.disable = false;
                this.shares = true;
                console.log(this.$refs.formDiag);
            },
            edit(row) {
                this.xianshi = '信息编辑';
                if (row.lockerInfo == null) {
                    console.log(JSON.stringify(row));
                    this.$message("地锁不存在表中！请人工处理异常数据！");
                }
                this.$refs.formDiag.show({id: row.id});
                this.disable = false;
                this.shares = true;
                this.locker = row.lockerId;
            },
            share(row) {
                this.$refs.formDiag.show({id: row.id});
                this.shares = false;
                this.disable = true;
            },
            del(row) {
                this.$confirm('确定删除此条记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$api.ipark.ParkPortService.delete(row.id).then(rsp => {
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
                return (ret || {name:"默认"}).name;
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
                //debugger;
                this.$refs.table.load();

            },
            cancel() {
                this.page.query.param = {
                    isDeleted: false,
                        parkInfo: {
                            // name: ''
                        },
                    lockerInfo: {
                        //lockerVoltageStatus: null,
                        //status: null
                    }

                };
                this.search();
            },

            saved() {

                this.$refs.formDiag.dispatch('submit');
            }
        },
        mounted() {
            this.$on('init', this.init);
        }
    };
</script>
