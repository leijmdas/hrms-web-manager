<template>
    <el-form :model="entity" :rules="rules" ref="form" label-width="150px">
        <el-row>
            <el-col :span="16">
                <el-form-item label="结算类型" prop="type">
                    <el-select v-model="entity.type">
                        <el-option
                            v-for="item in $dict.store.SETTLEMENT_TYPE"
                            :key="item[0]"
                            :value="item[0]"
                            :label="item[1]"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预约提成比例(%)" prop="merchantPercent">
                    <el-input v-model.number="entity.merchantPercent"></el-input>
                </el-form-item>
                <el-form-item label="续约提成比例(%)" prop="reMerchantPercent">
                    <el-input v-model.number="entity.reMerchantPercent"></el-input>
                </el-form-item>
                <el-form-item label="结算日" prop="day">
                    <el-input v-model.number="entity.day"></el-input>
                </el-form-item>
                <el-form-item label="提现最低金额(元)" prop="minAmount">
                    <el-input v-model="entity.minAmount"></el-input>
                </el-form-item>
                <el-form-item label="银行名称" prop="bankName">
                    <el-input v-model="entity.bankName"></el-input>
                </el-form-item>
                <el-form-item label="银行帐号" prop="bankAccountId">
                    <el-input v-model="entity.bankAccountId"></el-input>
                </el-form-item>
                <el-form-item label="银行户主" prop="bankAccountOwner">
                    <el-input v-model="entity.bankAccountOwner"></el-input>
                </el-form-item>
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
    const defaultEntity = {
        id: null,
        merchantId: 0,
        merchantPercent: 0,
        reMerchantPercent: 0,
        day: 0,
        type: 1,
        minAmount: 100,
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
                    type: [
                        {
                            type: 'number',
                            required: true,
                            message: '请选择结算类型',
                            trigger: 'change'
                        }
                    ],
                    day: [
                        {
                            message: '结算日不能为空',
                            required: true,
                            trigger: 'blur'
                        }
                    ],
                    minAmount: [
                        {
                            message: '最低金额不能为空',
                            required: true,
                            trigger: 'blur'
                        }
                    ],merchantPercent: [
                        {
                            message: '提现比例不能为空',
                            required: true,
                            trigger: 'blur'
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
                debugger
                if(this.entity.merchantPercent<0||this.entity.merchantPercent>100){
                    this.$message("提成百分比在0-100之间");
                    return;
                }
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.$api.ipark.SettlementService.save(this.entity).then(rsp => {
                            this.entity.id = rsp;
                            this.$emit('saved', rsp);
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
                    this.entity.merchantId = options.id;
                    // loadData
                    this.$api.ipark.SettlementService.findByMerchantId(options.id).then(
                        r => {
                            if (r) {
                                this.entity = r;
                            }
                        }
                    );
                }
            }
        },
        mounted() {
            this.$on('init', this.init);
            this.$on('submit', this.submitForm);
        }
    };
</script>
