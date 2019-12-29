<template>
    <div  class="dispatchForm">
        <el-form :model="entity" :rules="rules" ref="form" label-width="120px">
            <el-alert :title="'优惠券'" :closable="false"></el-alert>
            <el-form-item label="激活方式" prop="activeType">
                <el-radio-group v-model="entity.activeType" @change="entity.activeKey = undefined">
                    <el-radio label="USERID">用户名</el-radio>
                    <el-radio label="CARNUM" v-if="coupon.bizType == 1">车牌号</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="激活KEY" prop="activeKey">
                <user-select v-if="entity.activeType == 'USERID'" v-model.number="entity.activeKey" placeholder="用户名"></user-select>
                <el-input v-else v-model.number="entity.activeKey" placeholder="车牌号"></el-input>
            </el-form-item>
        </el-form>
    </div>

</template>
<style lang="less">
    .dispatchForm {
        .el-form-item__content {
            width: 168px;
        }
    }
</style>

<script>
    import UserSelect from '@/components/widgets/UserSelect.vue';

    const defaultEntity = {
        couponId:null,
        activeKey:null,

        activeType: 'USERID',
        remark: ""
    };
    export default {
        components: { UserSelect },
        data() {
            return {
                entity: _.cloneDeep(defaultEntity),
                coupon:{},
                rules: {
                    activeType:[{
                        required: true,
                        message: "请选择激活方式",
                        trigger: "blur"
                    }],
                    activeKey: [
                        {
                            required: true,
                            message: "不能为空",
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        methods: {
            resetForm() {
                this.$refs['form'].resetFields();
            },
            init(options = {}) {
                this.resetForm();
                console.log(options)
                this.coupon = options.coupon;
            },
            submitForm() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.$api.ipark.PromotionCouponBatchService.receiveCoupon(this.coupon.id, {...this.entity}).then(r => {
                            this.entity.activeKey= null;
                            this.$message({
                                type: 'success',
                                message: '派券成功!'
                            });
                        });
                    }
                });
            }
        },
        mounted() {
            this.$on("init", this.init);
            this.$on("submit", this.submitForm);
        }
    };
</script>
