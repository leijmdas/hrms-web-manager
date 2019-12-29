<template>
    <el-form :model="entity" :rules="rules" ref="form" label-width="120px">
        <el-row>
            <el-col :span="16">
                <el-form-item label="编码" prop="code" v-display="entity.id">
                    <el-input v-model="entity.code" placeholder="不填写则由系统生成"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="entity.name"></el-input>
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
                <el-form-item label="发票名称" prop="invoiceName">
                    <el-input v-model="entity.invoiceName"></el-input>
                </el-form-item>
                <el-form-item label="纳税人识别号" prop="taxId">
                    <el-input v-model="entity.taxId"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="bankName">
                    <el-input v-model="entity.bankName"></el-input>
                </el-form-item>
                <el-form-item label="银行帐户" prop="bankAccount">
                    <el-input v-model="entity.bankAccount"></el-input>
                </el-form-item>
                <el-form-item label="开票人" prop="invoiceBy">
                    <el-input v-model="entity.invoiceBy"></el-input>
                </el-form-item>
                <el-form-item label="收款人" prop="receiver">
                    <el-input v-model="entity.receiver"></el-input>
                </el-form-item>
                <el-form-item label="复核人" prop="reviewBy">
                    <el-input v-model="entity.reviewBy"></el-input>
                </el-form-item>


            </el-col>

        </el-row>


        <el-form-item label="地址" prop="address">
            <el-input type="textarea" v-model="entity.address"></el-input>
        </el-form-item>
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
    const defaultEntity = {
        id: null,
        status: 1,
        remark: ''
    };
    export default {
        components: {},
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
                    invoiceName: [
                        {required: true, message: '发票名称', trigger: 'blur'},
                        {
                            min: 1,
                            max: 128,
                            message: '长度在 1 到 32 个字符',
                            trigger: 'blur'
                        }
                    ],
                    taxId: [
                        {required: true, message: '纳税人识别号', trigger: 'blur'},
                        {
                            min: 1,
                            max: 128,
                            message: '长度在 1 到 32 个字符',
                            trigger: 'blur'
                        }
                    ],

                    bankName: [
                        {required: true, message: '开户行', trigger: 'blur'},
                        {
                            min: 1,
                            max: 128,
                            message: '长度在 1 到 32 个字符',
                            trigger: 'blur'
                        }
                    ],
                    bankAccount: [
                        {required: true, message: '银行帐户', trigger: 'blur'},
                        {
                            min: 1,
                            max: 128,
                            message: '长度在 1 到 32 个字符',
                            trigger: 'blur'
                        }
                    ],
                    invoiceBy: [
                        {required: true, message: '开票人', trigger: 'blur'},
                        {
                            min: 1,
                            max: 128,
                            message: '长度在 1 到 24 个字符',
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
                        this.$api.ipark.BranchCompanyService.save(this.entity).then(rsp => {
                            this.$emit('saved', rsp);
                            this.$api.ipark.BranchCompanyService.get(rsp).then(r => {
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
                    this.$api.ipark.BranchCompanyService.get(options.id).then(r => {
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
