<template>
    <div>
        <el-form :model="entity" :rules="rules" ref="form" label-width="120px" class="dialog-form">
            <!--<div style="margin:10px" class="merchantLogo">-->
                <!--<v-image-uploader :form-data="{}" :multiple=true v-model="ppp">-->

                <!--</v-image-uploader>-->
                <!--<div style="text-align:center">-->
                    <!--LOGO-->
                <!--</div>-->
            <!--</div>-->
            <el-row :span="24" style="margin-top: 10px" >
                <el-col :span="12">
                <el-form-item label="产品类型" prop="productTypeId" :rules="[{ required: true}]">
                    <product-type-select v-model="entity.productTypeId" :clearable="true"></product-type-select>
                </el-form-item>
                </el-col>
                <el-col :span="12">

                    <el-form-item label="状态" prop="moneyType">
                        <el-select v-model="entity.status" :disabled="isDisabled">
                            <el-option v-for="item in $dongxwDict.store.STATUS" :key="item[0]"
                                       :value="item[0]" :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="EP款号" prop="epCode">
                <el-input placeholder="EP款号" v-model="entity.epCode"></el-input>
            </el-form-item>
            <el-form-item label="客款号" prop="code">
                <el-input placeholder="客款号" v-model="entity.code"></el-input>
            </el-form-item>

            <el-form-item label="产品描述" prop="remark">
                <el-input placeholder="产品描述" v-model="entity.remark"></el-input>
            </el-form-item>
            <el-form-item label="颜色" prop="color">
                <el-input placeholder="颜色" v-model="entity.color"></el-input>
            </el-form-item>
            <el-form-item label="尺寸" prop="size">
                <el-input placeholder="尺寸" v-model="entity.size"></el-input>
            </el-form-item>

            <el-form-item label="条码" prop="barCode">
                <el-input placeholder="条码" v-model="entity.barCode"></el-input>
            </el-form-item>

            <!--<el-form-item label="图片" prop="picUrl">-->
                <!--<el-input placeholder="图片" v-model="entity.picUrl"></el-input>-->
            <!--</el-form-item>-->

            <el-form-item label="UPC-A" prop="upcA">
                <el-input placeholder="UPC-A" v-model="entity.upcA"></el-input>
            </el-form-item>

            <el-form-item label="备注" prop="memo">
                <el-input placeholder="备注" v-model="entity.memo"></el-input>
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

    import ProductTypeSelect from '@/components/widgets/dongxw/ProductTypeSelect.vue';
    const defaultEntity = {
        id: null,
        epCode: null,
        code: null,
        status : 1,
        remark : '',
        color : '',
        size : '',
        barCode : '',
        picUrl : null ,
        upcA : '',
        memo : '',
        createBy: 0
    };


    export default {
        components: {ProductTypeSelect},
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
                    epCode: [
                        {required: true, message: "编号不能为空", trigger: "blur"},
                        {
                            min: 1,
                            max: 32,
                            message: "长度在 1 到 32 个字符",
                            trigger: "blur"
                        }
                    ],
                    code: [
                        {required: true, message: "编号不能为空", trigger: "blur"},
                        {
                            min: 1,
                            max: 32,
                            message: "长度在 1 到 32 个字符",
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

                        this.$api.dongxw.ProductService.save(params).then(rsp => {
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

                    this.$api.dongxw.ProductService.findById(options.id).then(r => {
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
