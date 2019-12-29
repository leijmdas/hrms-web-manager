<template>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
        <el-row>
            <el-col :span="16">
                <el-form-item label="编码" prop="code" v-display="entity.id">
                    <el-input v-model="entity.code" placeholder="不填写则由系统生成"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="entity.name"></el-input>
                </el-form-item>
                <el-form-item label="归属子公司" prop="branchCompanyId">
                    <branch-company-select v-model="entity.branchCompanyId"></branch-company-select>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="entity.type">
                        <el-option v-for="item in $dict.store.MERCHANT_TYPE" :key="item[0]" :value="item[0]"
                                   :label="item[1]"></el-option>
                    </el-select>
                    <div style="float:right">特约商户的结算帐户只属于平台</div>
                </el-form-item>
                <el-form-item label="管理密码" prop="passwd">
                    <el-input v-model="entity.passwd" type="password"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="linkman">
                    <el-input v-model="entity.linkman"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="entity.tel"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="entity.email"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="entity.address"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <div style="margin:10px" class="merchantLogo">
                    <v-image-uploader :form-data="{}" v-model="entity.logo">

                    </v-image-uploader>
                    <div style="text-align:center">
                        LOGO
                    </div>
                </div>
            </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="entity.remark"></el-input>
        </el-form-item>
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
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect';

    const defaultEntity = {
        id: null,
        logo: '',
        branchCompanyId: null,
        passwd: '111111',
        status: 1,
        remark: ''
    };
    export default {
        components: { BranchCompanySelect },
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
                    type: [
                        {
                            required: true,
                            message: '请选择商户类型',
                            trigger: 'change'
                        }
                    ],
                    branchCompanyId: [
                        {
                            required: true,
                            message: '归属分公司',
                            trigger: 'change'
                        }
                    ],
                    passwd: [{
                        required: true, message: '密码不能为空', trigger: 'blur'
                    }],
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
                        this.$api.ipark.MerchantInfoService.save(this.entity).then(rsp => {
                            this.$emit('saved', rsp);
                            this.$api.ipark.MerchantInfoService.get(rsp).then(r => {
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
                    this.$api.ipark.MerchantInfoService.get(options.id).then(r => {
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
