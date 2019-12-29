<template>
    <!--<el-form-item label="登录名" prop="loginName" v-display="entity.loginName">-->
    <!--<el-input v-model="entity.loginName" placeholder=" "></el-input>-->
    <!--</el-form-item>-->

    <el-form :model="entity" :rules="rules" ref="form" label-width="120px"  width="380px">


        <el-row :span="24">
            <el-col :span="8">
                <el-form-item label="分公司" prop="branchCompanyId" :rules="[{ required: true,message:'不能为空'}]">
                    <branch-company-select  :disabled="disabled"  v-model="entity.branchCompanyId"
                                           :clearable="true"></branch-company-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">

                <el-form-item label="商户" prop="merchantId" :rules="[{ required: true,message:'不能为空'}]">
                    <merchant-select  :disabled="disabled"  v-model="entity.merchantId"
                                      :branchCompanyId="entity.branchCompanyId"    :clearable="true"></merchant-select>
                </el-form-item>
            </el-col>

        </el-row>
        <el-row :span="24">
            <el-col :span="8">
                <el-form-item label="停车场" prop="parkId"  >
                    <park-select    :merchantId="entity.merchantId"
                                    :disabled="disabled"  v-model="entity.parkId" :clearable="true"></park-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="用户类型" prop="userType">
                    <el-select disabled="disabled" v-model="entity.userType" :clearable="true">
                        <el-option v-for="item in $dict.store.MANAGER_LOGIN_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>

            </el-col>
        </el-row>

            <el-row :span="24">

            <el-col :span="8">
                <el-form-item label="状态" prop="status">
                    <el-select v-model="entity.status" :clearable="true">
                        <el-option v-for="item in $dict.store.STATUSS" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
                <el-col :span="8">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="entity.email"></el-input>

                    </el-form-item>

                </el-col>
        </el-row>
        <el-row>
        <el-col :span="16">
            <el-form-item label="登录名" prop="loginName">
                <el-input v-model="entity.loginName"></el-input>
            </el-form-item>
            <el-form-item label="实名" prop="realName">
                <el-input v-model="entity.realName"></el-input>
            </el-form-item>

            <el-form-item label="电话" prop="mobile">
                <el-input v-model="entity.mobile"></el-input>
            </el-form-item>
            <el-form-item v-if="entity.id==null" label="密码" prop="password">
                <el-input type="password" v-model="entity.password"></el-input>
            </el-form-item>


        </el-col>

        </el-row>


        <el-form-item>
            <el-button type="primary" @click="submitForm">保存</el-button>
        </el-form-item>
    </el-form>
</template>
<style lang="less">
    .merchantLogo .el-upload-dragger {

    img {
        height: 180px !important;
    }

    }
</style>

<script>
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import ParkSelect from '@/components/widgets/ParkSelect';

    const defaultEntity = {
        id: null,
        createBy : 0 ,
        parkId : 0,
        status: 1,
        userType: 300
    };
    export default {
        components: { BranchCompanySelect,
            MerchantSelect,
            ParkSelect},
        data() {
            return {
                disabled : false,
                entity: _.cloneDeep(defaultEntity),
                types: [],
                rules: {
                    loginName: [
                        {required: true, message: '登录名不能为空', trigger: 'blur'},
                        {
                            min: 1,
                            max: 64,
                            message: '长度在 1 到 64 个字符',
                            trigger: 'blur'
                        }
                    ],

                    password: [
                        {required: true, message: '密码', trigger: 'blur'},
                        {
                            min: 1,
                            max: 64,
                            message: '长度在 1 到 64 个字符',
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
            setValues(vals) {
                this.resetEntity = _.cloneDeep(vals);
                this.entity = _.cloneDeep(this.resetEntity);
            },
            submitForm() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        //this.entity.opTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                        this.entity.opTime = this.$moment().format('YYYY-MM-DD HH:mm:ss');

                        if (this.entity.createTime == null) {
                            //this.entity.createTime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                            this.entity.createTime = this.$moment().format('YYYY-MM-DD HH:mm:ss');
                            if(this.entity.password===''){
                                this.entity.password='123456';
                            }
                            this.entity.password = this.$md5(this.entity.password);
                        }
                        this.$api.ipark.ManagerLoginService.save(this.entity).then(rsp => {
                            console.log(rsp);
                            this.$emit('saved', rsp.data);
                            this.$api.ipark.ManagerLoginService.get(rsp.data).then(r => {
                                this.entity = r;
                            });
                        });
                    }
                });
            },
            resetForm() {
                this.entity = _.cloneDeep(this.resetEntity);
            },
            init(options) {
                this.$refs['form'].resetFields();
                this.entity = _.cloneDeep(defaultEntity);
                if (options.id) {
                    // loadData
                    this.$api.ipark.ManagerLoginService.get(options.id).then(r => {
                        this.entity = r;
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
