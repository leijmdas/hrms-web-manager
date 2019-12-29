<template>
    <div>
        <el-form :model="entity" :rules="rules" ref="form"   label-width="120px" class="dialog-form">


        <el-form-item label="客户编号" prop="custNo">
            <el-input placeholder="客户编号" v-model="entity.custNo"></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="custName">
            <el-input placeholder="客户名称" v-model="entity.custName"></el-input>
        </el-form-item>
        <el-form-item label="客户详细名称" prop="custSname">
            <el-input placeholder="客户详细名称" v-model="entity.custSname"></el-input>
        </el-form-item>
        <el-form-item label="国家" prop="country">
            <el-input placeholder="国家" v-model="entity.country"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
            <el-input placeholder="地址" v-model="entity.addr"></el-input>
        </el-form-item>
        <el-form-item label="结算币种" prop="moneyType">
            <el-select v-model="entity.moneyType" :disabled="isDisabled">
                <el-option v-for="item in $dongxwDict.store.MONEY_TYPE" :key="item[0]"
                           :value="item[0]" :label="item[1]"></el-option>
            </el-select>
        </el-form-item>
            <el-form-item label="公司电子邮箱" prop="email">
                <el-input placeholder="公司电子邮箱" v-model="entity.email"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contact">
            <el-input placeholder="联系人" v-model="entity.contact"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="tel">
            <el-input placeholder="联系人电话" v-model="entity.tel"></el-input>
        </el-form-item>


    </el-form>
    </div>
</template>
<style lang="less" scoped>
    .merchantLogo .el-upload-dragger {
        img {
            height: 200px !important;
        }
    }

    .dialog-form {
        .el-radio-group {
            .el-radio {
                display: flex;
                align-items: center;
            }

            label {
                height: 40px;
            }
            .group-text {
                display: inline-block;
                width: 100px;
            }
            .title-text {
                display: inline-block;
                width: 120px;
            }
        }

    }
</style>

<script>

    //import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    const defaultEntity = {
        id: null,
        custNo: null,
        custName: '',
        custSname: '',
        addr: '',
        tel: '',
        email: '',
        moneyType: 100,
        createDate: '',
        contact: '',
        country: '',
        createBy: 0
    };


    export default {
        components: {},
        data() {
            return {
                ppp: '',

                ruleTpl: {when: null, then: null},
                entity: _.cloneDeep(defaultEntity),
                dateRange: [],
                oldProps: [],
                ruleDefs: [],
                isDisabled: false,
                limitTotal: false,
                rules: {
                    custNo: [
                        {required: true, message: "编号不能为空", trigger: "blur"},
                        {
                            min: 1,
                            max: 32,
                            message: "长度在 1 到 32 个字符",
                            trigger: "blur"
                        }
                    ],
                    custName: [
                        {required: true, message: "名称不能为空", trigger: "blur"},
                        {
                            min: 1,
                            max: 64,
                            message: "长度在 1 到 64 个字符",
                            trigger: "blur"
                        }
                    ],
                    startOn: [
                        {
                            required: true,
                            message: "请选择开始时间",
                            trigger: "blur"
                        }
                    ],
                    merchantId: [
                        {
                            type: "number"
                        }
                    ],
                    status: [
                        {
                            type: "number",
                            required: true,
                            message: "请选择状态",
                            trigger: "change"
                        }
                    ],
                    discountType: [
                        {
                            type: "number",
                            required: true,
                            message: "请选择优惠类型",
                            trigger: "change"
                        }
                    ],

                }
            };
        },
        methods: {
            getProps(scope) {
                return this.entity.props.filter(p => p.propScope == scope);
            },
            onRuleDefsLoaded(opts) {
                this.ruleDefs = opts || [];
                this.resetProps();
            },
            onDiscountTypeChange(val) {
                if (val == 3) {
                    //次数只能一次
                    this.entity.discountValue = 1;
                }
            },
            resetProps() {


            },
            setValues(vals) {
                this.resetEntity = _.cloneDeep(vals);
                this.entity = _.cloneDeep(this.resetEntity);
            },
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        let params = Object.assign({}, this.entity);

                        this.$api.dongxw.CustomerService.save(params).then(rsp => {
                            this.$emit("saved", rsp);
                        });
                    }
                });
            },
            resetForm() {
                //this.$refs["form"].resetFields();
                this.entity = _.cloneDeep(defaultEntity);
                if (!this.entity.id) {

                    this.entity.createDate = this.$dongxwDict.formatDateZero(new Date())
                }
            },
            init(options) {
                this.resetForm();
                if (options.id) {
                    console.log(JSON.stringify(this.entity));
                    //this.isDisabled = true;//this.entity.status > 0;

                    this.$api.dongxw.CustomerService.findById(options.id).then(r => {
                        console.log(JSON.stringify(r))
                        this.entity = r.data;
                    });
                } else {
                    this.isDisabled = false;
                }
            }
        },
        mounted() {
            this.$on("init", this.init);
            this.$on("submit", this.submitForm);
        }
    };
</script>
