<template>
    <div>
        <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
            <el-row>
                <el-col :span="16">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="子公司" prop="branchCompanyId">
                                <branch-company-select v-model="branchCompanyId" :disabled="isDisabled"></branch-company-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="物业" prop="merchantId">
                                <merchant-select :branchCompanyId='branchCompanyId' v-model="entity.merchantId" :disabled="isDisabled"></merchant-select>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-form-item label="编码" prop="code">
                        <el-input v-model="entity.code" placeholder="不填写则由系统生成"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="entity.name"></el-input>
                    </el-form-item>


                    <el-form-item label="所在区域" prop="areaCode">
                        <area-cascader v-model="entity.areaCode" style="width:100%"></area-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address">
                        <el-input v-model="entity.address"></el-input>
                    </el-form-item>
                    <el-form-item label="地理位置" required>
                        <el-col :span="6">
                            <el-form-item label="" prop="lng">
                                <el-input placeholder="经度" v-model.number="entity.lng"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1" style="text-align:center">-</el-col>
                        <el-col :span="6">
                            <el-form-item label="" prop="lat">
                                <el-input placeholder="维度" v-model.number="entity.lat"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3" style="padding:0 5px">
                            <el-button type="text" class="el-icon-location" title="选择位置"
                                       @click="selectLocation"></el-button>
                        </el-col>
                    </el-form-item>

                    <el-row>

                        <el-col :span="8">

                            <el-form-item label="发布状态" prop="status">
                                <el-select v-model="entity.status" :disabled="!entity.id">
                                    <el-option v-for="item in $dict.store.PUBLISH_STATUS" :key="item[0]"
                                               :value="item[0]"
                                               :label="item[1]"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户等级" prop="userGradeId">
                                <!--<el-input v-model="entity.userGradeId"></el-input>-->
                                <user-grade  v-model="entity.userGradeId"  ></user-grade>
                            </el-form-item>


                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="道闸类型" prop="gateType">
                                <el-select v-model="entity.gateType">
                                    <el-option v-for="item in $dict.store.GATE_TYPE" :key="item[0]" :value="item[0]"
                                               :label="item[1]"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-col>

                <el-col :span="8">
                    <div style="margin:10px">
                        <v-image-uploader :form-data="{}" v-model="entity.logo" :multiple="bool">

                        </v-image-uploader>
                        <div style="text-align:center">
                            LOGO
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">

                    <el-col :span="8">
                        <el-form-item label="室内导航" prop="isNavigation">
                            <el-select v-model="entity.isNavigation">
                                <el-option v-for="item in $dict.store.ISNAVIGATION" :key="item[0]" :value="item[0]"
                                           :label="item[1]"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="导航切换距离" prop="navigationDistance">
                            <el-input v-model.number="entity.navigationDistance">
                                <template slot="append">米</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="16">
                    <el-col :span="8">
                        <el-form-item label="免费时长" prop="freeMinutes">
                            <el-input v-model.number="entity.freeMinutes">
                                <template slot="append">分钟</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="每小时资费" prop="unitTimeFee">
                            <el-input v-model.number="entity.unitTimeFee" v-numberInt="2">
                                <template slot="append">元</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item style="color:gray">仅供参考</el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-col :span="8">
                        <el-form-item label="车位总数" prop="totalNum">
                            <el-input-number v-model="entity.totalNum" :controls="false">

                            </el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开放预约总数" prop="openBookNum">
                            <el-input-number v-model="entity.openBookNum" :controls="false"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="开放预约时长" prop="openBookMinuteSpan">

                            <el-input v-model.number="entity.openBookMinuteSpan">
                                <template slot="append">分钟</template>
                            </el-input>
                        </el-form-item>
                    </el-col>

                </el-col>

            </el-row>
            <el-col :span="16">

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="平台可收费" prop="chargeable">

                            <el-switch v-model="entity.chargeable" active-text="是" inactive-text="">
                            </el-switch>

                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="计费方式" prop="billWay" >
                            <el-select v-model="entity.billWay" :disabled="!entity.chargeable">
                                <el-option v-for="item in $dict.store.BILL_WAY" :key="item[0]" :value="item[0]"
                                           :label="item[1]"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="释放时间(秒)" prop="parkingTime">
                            <el-input v-model.number="entity.parkingTime">
                                <template slot="append">秒</template>
                            </el-input>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-form-item label="计费描述" prop="billRemark">
                    <el-input type="textarea" v-model="entity.billRemark" :rows="5"></el-input>
                </el-form-item>


                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="entity.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">保存</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>

            </el-col>


        </el-form>

        <v-dialog ref="mapDiag" title="选择位置" :append-to-body="true">
            <a-map-location style="width:100%;height:500px" @location-click="onLocationClick"></a-map-location>
        </v-dialog>
    </div>
</template>
<style lang="less" scoped>
    .el-upload-dragger {
        img {
            width: 300px;
            height: 300px;
        }
    }
</style>

<script>
    import AreaCascader from '@/components/widgets/AreaCascader';
    import AMapLocation from '@/components/widgets/AMapLocation';
    import CorpSelect from '@/components/widgets/CorpSelect.vue';
    import UserGrade from '@/components/widgets/UserGradeSelect.vue';
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';

    const defaultEntity = {
        id: null,
        logo: '',
        code: '',
        name: '',
        // branchCompanyId : null,
        merchantId: null,
        chargeable: false,
        totalNum: 0,
        openBookNum: 0,
        billWay: 1,
        isNavigation:true,
        unitTimeFee: null,
        areaCode: '',
        address: '',
        lng: null,
        lat: null,
        openBookMinuteSpan: 30,
        parkingTime:180,
        navigationDistance: 30,
        freeMinutes: 15,
        gateType: 1,
        status: 0,
        remark: '此停车场附近有_____，_____，_____，预约停车可享受导航，反向寻车等服务。',
        billRemark: ''
    };
    export default {
        components: {AreaCascader, UserGrade, AMapLocation, CorpSelect, BranchCompanySelect, MerchantSelect},
        data() {
            return {
                bool: true,
                isDisabled: false,
                branchCompanyId: null,
                entity: _.cloneDeep(defaultEntity),
                types: [],
                rules: {
                    freeMinutes: [
                        {
                            type: 'number',
                            required: true,
                            message: '免费时长不能为空，必须大于0',
                            trigger: 'blur',
                            min: 1
                        }
                    ],
                    areaCode: [
                        {
                            required: true,
                            message: '请选择区域',
                            trigger: 'change'
                        }
                    ],
                    lng: [
                        {
                            type: 'number',
                            required: true,
                            message: '经维度不能为空',
                            trigger: 'blur'
                        }
                    ],
                    lat: [
                        {
                            type: 'number',
                            required: true,
                            message: '经维度不能为空',
                            trigger: 'blur'
                        }
                    ],
                    address: [
                        {required: true, message: '详细地址不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '中文名称不能为空', trigger: 'blur'},
                        {
                            min: 1,
                            max: 128,
                            message: '长度在 1 到 128 个字符',
                            trigger: 'blur'
                        }
                    ],
                    gateType: [
                        {
                            type: 'number',
                            required: true,
                            message: '请选择道闸类型',
                            trigger: 'change'
                        }
                    ],
                    billWay: [
                        {
                            type: 'number',
                            required: true,
                            message: '请选择计费方式',
                            trigger: 'change'
                        }
                    ],
                    unitTimeFee: [
                        {
                            type: 'number',
                            required: true,
                            message: '每小时资费不能为空',
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
                    ],
                    chargeable: [
                        {
                            required: true
                        }
                    ],
                    merchantId: [
                        {
                            required: true,
                            message: '请选择商户',
                            trigger: 'change'
                        }
                    ],
                    remark: [
                        {
                            required: true,
                            message: '请填写备注信息',
                            trigger: 'blur'
                        }
                    ],
                    billRemark: [
                        {
                            required: true,
                            message: '请填写计费描述',
                            trigger: 'blur'
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
            submitForm() {
                this.$refs['form'].validate((valid, err) => {
                    if (valid) {
                        this.$api.ipark.ParkInfoService.save(this.entity).then(rsp => {
                            this.$emit('saved', rsp);
                            // 保存成功之后拿到code回显出来，防止重复提交。 拿到id 去查code 保存成功之后商户不允许修改
                            this.isDisabled = true;
                            this.$api.ipark.ParkInfoService.get(rsp).then(r => {
                                this.entity = r;
                            });
                        });
                    }
                });
            },
            resetForm() {
                this.$refs['form'].resetFields();
            },
            findBranchCompany(merchantId) {
                this.$api.ipark.MerchantInfoService.get(merchantId).then(r => {
                    this.branchCompanyId = r.branchCompanyId;

                });
            },
            init(options) {
                this.resetForm();
                if (options.id) {
                    this.isDisabled = true;
                    this.$api.ipark.ParkInfoService.get(options.id).then(r => {
                        this.entity = r;
                        // this.entity.branchCompanyId = options.branchCompanyId,

                        this.$emit('loaded', r);
                        this.findBranchCompany(r.merchantId);

                    });
                }
            }
        },
        mounted() {
            this.$on('init', this.init);
            this.$on('submit', this.submitForm);
        }
    };
</script>
