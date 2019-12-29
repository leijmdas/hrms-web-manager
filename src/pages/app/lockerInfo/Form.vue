<template>
    <div>
        <el-form ref="form" :model="entity" :rules="rules" label-position="right" label-width="100px">

            <el-form-item label="设备编号" prop="code">
                <el-input :disabled="disables" v-model="entity.code" placeholder="不填写则由系统生成"></el-input>
            </el-form-item>

            <!-- <el-form-item label="名称"  prop="name" :rules="[{ required: true}]">
               <el-input :disabled="disables"  v-model="entity.name"></el-input>
             </el-form-item> -->
            <el-row>
                <el-form-item label="分公司">
                    <branch-company-select :disabled="disables" v-model="entity.branchCompanyId"
                                           :clearable="true"></branch-company-select>
                </el-form-item>
                <el-form-item label="所属商户" prop="merchantId" class="el-v1" :rules="[{ required: true,message:'不能为空'}]">
                    <merchant-select :branchCompanyId="entity.branchCompanyId" :disabled="disables"
                                     v-model="entity.merchantId"></merchant-select>
                </el-form-item>

                <el-form-item label="所属停车场" prop="parkId" class="el-v1" :rules="[{ required: true,message:'不能为空'}]">
                    <park-select :merchantId="entity.merchantId" :disabled="disables"
                                 v-model="entity.parkId"></park-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="类型" prop="type" class="el-v1" :rules="[{ required: true,message:'不能为空'}]">
                    <el-select :disabled="disables" v-model="entity.type">
                        <el-option v-for="item in $dict.store.TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status" class="el-v1" :rules="[{ required: true,message:'不能为空'}]">
                    <el-select :disabled="disables" v-model="entity.status">
                        <el-option v-for="item in $dict.store.STATUSS" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <!--<el-form-item label="泊位号" prop="portId" class="el-v1" :rules="[{ required: true}]">
              <port-select  :disabled="disables" v-model="entity.portId"></port-select>
            </el-form-item>-->
            <div>
                <el-form-item label="硬件版本" prop="version" :rules="[{ required: true,message:'不能为空'}]">
                    <el-input :disabled="disables" type="textarea" v-model="entity.version"></el-input>
                </el-form-item>
            </div>
            <!--<el-form-item label="电压"  prop="pressure">
              <el-input :disabled="disables"  v-model="entity.pressure"></el-input>
            </el-form-item>
            <el-form-item label="警报电压"  prop="alarmvoltage">
              <el-input :disabled="disables"  v-model="entity.alarmvoltage"></el-input>
            </el-form-item> -->

            <div>
                <el-form-item label="安装时间" prop="createTime" :rules="[{ required: true,message:'不能为空'}]">
                    <el-date-picker
                        :disabled="disables"
                        v-model="entity.createTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="报废时间" prop="scropTime">
                    <el-date-picker
                        :disabled="disables"
                        v-model="entity.scropTime"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </div>
            <el-form-item label="备注" prop="remark">
                <el-input :disabled="disables" type="textarea" v-model="entity.remark"></el-input>
            </el-form-item>
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
    .el-v1 {
        display: inline-block
    }
</style>

<script>
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import MerchantSelect from '@/components/widgets/MerchantSelect';
    import ParkSelect from '@/components/widgets/ParkSelect';
    import PortSelect from '@/components/widgets/PortSelect';

    const defaultEntity = {
        id: null,
        code: '',
        name: '',
        branchCompanyId: null,
        merchantId: null,
        parkId: null,
        status: 1,
        remark: ''
    };
    export default {
        components: {BranchCompanySelect, ParkSelect, MerchantSelect, PortSelect},
        props: {
            disables: Boolean,
            default: false,
            required: Boolean
        },
        data() {
            return {
                entity: _.cloneDeep(defaultEntity),
                types: [],
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
                },
                selectData: ''
            };
        },
        methods: {
            getSelect(data) {
                return data;
            },
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
                this.entity.code = this.entity.code===undefined?this.entity.code:this.entity.code.replace(/\s*/g, '');
                this.$refs['form'].validate((valid, err) => {
                    if (valid) {
                        this.$api.ipark.LockerInfoService.save(this.entity).then(rsp => {
                            this.$emit('saved', rsp);
                            this.isDisabled = true;
                            this.$api.ipark.LockerInfoService.get(rsp).then(r => {
                                this.entity = r;
                            });
                        });
                    }
                });
            },
            resetForm() {
                this.$refs['form'].resetFields();
            },
            init(options) {
                this.resetForm();
                if (options.id) {
                    //loadData
                    this.$api.ipark.LockerInfoService.get(options.id).then(r => {
                        this.entity = r;
                    });
                } else {
                    this.entity = {};
                }
            }
        },
        mounted() {
            this.$on('init', this.init);
            this.$on('submit', this.submitForm);
        }
    };
</script>
