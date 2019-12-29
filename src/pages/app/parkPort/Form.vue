<template>
    <div>
        <el-form :model="entity" :rules="rules" ref="form" label-position="right"  label-width="100px">
            <el-row :span="16">

                <el-col :span="8">
                    <el-form-item label="泊位号" prop="code">
                        <el-input :disabled="disables" v-model="entity.code" placeholder="不填写则由系统生成"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">

                    <el-form-item label="发布状态" prop="publishStatus">
                        <!--<el-input :disabled="disables" v-model="entity.publishStatus" ></el-input>-->
                        <el-select v-model="entity.publishStatus" :clearable="true">
                            <el-option v-for="item in $dict.store.PUBLISH_STATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :span="16">
                <el-col :span="8">
                    <el-form-item label="分公司">
                        <branch-company-select :disabled="disables" v-model="entity.branchCompanyId"
                                               :clearable="true"></branch-company-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商户">
                        <merchant-select :disabled="disables" ref="merchantSelect" v-model="entity.merchantId"
                                         :branchCompanyId="entity.branchCompanyId"
                                         :clearable="true"></merchant-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <el-row :span="16">
                <el-col :span="8">
                    <el-form-item label="停车场" prop="" class="el" :rules="[{ required: true,message:'不能为空'}]">
                        <park-select :merchantId="entity.merchantId" :disabled="disables"
                                     v-model="entity.parkId"></park-select>
                    </el-form-item>
                </el-col>


            </el-row>
            <el-row :span="16">
                <el-col :span="8">
                    <el-form-item label="楼层" prop="" class="el" :rules="[{ required: true,message:'不能为空'}]">
                        <floor-select :disabled="disables" v-model="entity.floorId"
                                      :parkId="entity.parkId"></floor-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">

                    <el-form-item label="区域" prop="" class="el" :rules="[{ required: true,message:'不能为空'}]">
                        <area-select :disabled="disables" v-model="entity.areaId"
                                     :floorId="entity.floorId"></area-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="16">
                <el-col :span="8">
                    <el-form-item label="用户等级" prop="userGradeId">
                         <user-grade  v-model="entity.userGradeId"  ></user-grade>
                    </el-form-item>

                </el-col>

                <el-col :span="8">
                    <el-form-item label="车位类型" prop="portType" class="ell" :rules="[{ required: true,message:'不能为空'}]">
                        <el-select :disabled="disables" v-model="entity.portType">
                            <el-option v-for="item in $dict.store.PARK_PORT_TYPE" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :span="16">
                <el-col :span="8">

                    <el-form-item label="地锁编号" prop="lockerId" class="el" :rules="[{ required: true,message:'不能为空'}]">
                        <locker-select ref='lockerSelect' :disabled="disables" :lockerIds="locker"
                                       v-model="entity.lockerId" :parkId="entity.parkId"></locker-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item v-if="yinchang" label="地磁状态" prop="status" class="ell"
                                  :rules="[{ required: true,message:'不能为空'}]">
                        <el-select :disabled="true" v-model="entity.status">
                            <el-option v-for="item in $dict.store.STTATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>



            <el-row :span="16">
                <el-col :span="8">

                    <el-form-item v-if="yinchang" label="分配状态" prop="assignStatus" class="ell"
                                  :rules="[{ required: true,message:'不能为空'}]">
                        <el-select :disabled="true" v-model="entity.assignStatus">
                            <el-option v-for="item in $dict.store.ASSIGNSTATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item v-if="yinchang" label="网络状态" prop="onlineStatus" class="ell"
                                  :rules="[{ required: true,message:'不能为空'}]">
                        <el-select :disabled="true" v-model="entity.onlineStatus">
                            <el-option v-for="item in $dict.store.ONLIANSTATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="16">
                <el-col :span="8">
                    <el-form-item v-if="yinchang" label="在位状态" prop="onstatus" class="ell"
                                  :rules="[{ required: true,message:'不能为空'}]">
                        <el-select :disabled="true" v-model="entity.onstatus">
                            <el-option v-for="item in $dict.store.ONSTATUSS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">

                    <el-form-item v-if="yinchang" label="摆臂状态" prop="lockerStatus" class="ell"
                                  :rules="[{ required: true,message:'不能为空'}]">
                        <el-select :disabled="true" v-model="entity.lockerStatus">
                            <el-option v-for="item in $dict.store.LOCKSTATUS" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="16">
                <el-col :span="16">
                    <el-form-item label="备注" prop="remark">
                        <el-input rows="4" :disabled="disables" type="textarea" v-model="entity.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-form-item label="预约订单id" prop="currentOrderId" >
               <el-input :disabled="true" type="textarea" v-model="moren"></el-input>
             </el-form-item>-->
        </el-form>
    </div>
</template>
<style lang="less" scoped>
    .el-upload-dragger {

    img {
        width: 300px;
        height: 300px;
    }

    }

    .el {
        display: inline-block
    }

    .ell {
        display: inline-block
    }
</style>

<script>
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';

    import ParkSelect from '@/components/widgets/ParkSelect';
    import FloorSelect from '@/components/widgets/FloorSelect';
    import LockerSelect from '@/components/widgets/LockerSelect';
    import AreaSelect from '@/components/widgets/AreaSelect';

    import UserGrade from '@/components/widgets/UserGradeSelect';

    const defaultEntity = {
        id: null,
        code: '',
        name: '',
        parkId: null,
        floorId: null,

        status: 0,
        lockerStatus: 2,
        onstatus: 0,
        onlineStatus: 0,
        assignStatus: 0,

        currentCarnum: '',
        electricQuantity: '0',
        currentParkingId: '11',
        publishStatus: 2,
        userGradeId: 0,
        portType: 1,

        unassignable: false,
        remark: '',
    };
    export default {
        components: {BranchCompanySelect, UserGrade,MerchantSelect, ParkSelect, FloorSelect, LockerSelect, AreaSelect},
        props: {

            disables: {
                type: Boolean,
                default: false
            },
            locker: {}
        },
        data() {
            return {
                entity: _.cloneDeep(defaultEntity),
                moren: 0,
                types: [],
                yinchang: false,
                createTime: '',
                rules: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'},
                        {
                            min: 1,
                            max: 128,
                            message: '长度在 1 到 128 个字符',
                            trigger: 'blur'
                        }
                    ],
                    status: [
                        {
                            type: 'number',
                            required: true,
                            message: '请选择状态',
                            trigger: 'change'
                        }
                    ]
                }
            };
        },
        methods: {
            selectLocation() {
                this.$refs.mapDiag.show({address: this.entity.address});
            },
            onLocationClick(l) {
                this.entity.lng = l.lng;
                this.entity.lat = l.lat;
                this.$refs.mapDiag.hide();
            },
            setValues(vals) {
                this.resetEntity = _.cloneDeep(vals);
                this.entity = _.cloneDeep(this.resetEntity);
            },
            myrefresh() {
                this.$refs.lockerSelect.refresh();
            },
            submitForm() {
                this.$refs['form'].validate((valid, err) => {
                    if (valid) {
                        // if (this.entity.lockerInfo == null) {
                        //     console.log(JSON.stringify(this.entity));
                        //     alert("地锁不存在需要人工干预！");
                        // }
                        this.$api.ipark.ParkPortService.save(this.entity).then(rsp => {
                            this.$emit('saved', rsp);
                            this.$refs.lockerSelect.refresh();
                        });
                    }
                });
            },
            resetForm() {
                this.$refs['form'].resetFields();
                this.yinchang = false;
            },
            init(options) {
                this.resetForm();
                if (options.id) {
                    // loadData
                    this.yinchang = true;
                    this.$api.ipark.ParkPortService.get(options.id).then(r => {
                        this.entity = r;

                        this.$refs.lockerSelect.refresh();
                    });
                } else {
                    this.entity = _.cloneDeep(defaultEntity);
                }
            }
        },
        created() {
            this.$on('init', this.init);
            this.$on('submit', this.submitForm);
        }

    };
</script>
