<template>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
        <el-row>
            <el-col>
                <el-form-item label="审核结果" prop="result">                
                    <el-radio-group v-model="entity.result">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="0">不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
        </el-row>
        <div>
            注意事项：<br>
            运营将审核意见请以邮件/电话的方式给用户回执。<br>
            通过：电话为商户助手账户；<br>
            审核通过的商家信息纳入商家信息状态为已上架。<br>
            不通过：让用户重新提交信息。
        </div>
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
        remark: '',
        result: 1
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
