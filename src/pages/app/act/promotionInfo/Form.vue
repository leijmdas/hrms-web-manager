<template>
    <el-form :model="entity" :rules="rules" ref="form" label-width="120px" class="dialog-form">
        <fieldset align="bottom">
            <el-row>
                <el-col :span="14">

                    <el-form-item label="名称" prop="name">
                        <el-input v-model="entity.name" :disabled="isDisabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="业务类型" prop="bizType">

                        <el-select v-model="entity.bizType" :disabled="isDisabled">
                            <el-option v-for="item in $dict.store.BUSINESSTYPE" :key="item[0]"
                                       :value="item[0]" :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-row>
            <!-- <el-form-item label="类型" prop="type">
                <el-select v-model="entity.type">
                  <el-option v-for="item in $dict.store.MERCHANT_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
                </el-select>
              </el-form-item> -->
            <el-row>
                <el-form-item label="绝对有效期" required>
                    <el-col :span="6">
                        <el-form-item prop="startOn">
                            <el-date-picker type="datetime" placeholder="选择时间" v-model="entity.startOn"
                                            style="width: 100%;" :disabled="isDisabled"
                                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="1" style="text-align:center">至</el-col>
                    <el-col :span="6">
                        <el-form-item prop="endOn">
                            <el-date-picker type="datetime" placeholder="选择时间" v-model="entity.endOn"
                                            style="width: 100%;"
                                            :disabled="isDisabled" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7"><span style="color:red;margin-left:20px">注：一旦上线，优惠规则不可改变！</span>
                    </el-col>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="16">
                <el-row>

                <el-col :span="10">
                    <el-form-item label="相对有效期" prop="limitDays">
                        <el-switch v-model="entity.limitDays" active-text="限制" inactive-text="不限">
                        </el-switch>

                    </el-form-item>
                </el-col>
                <el-col :span="10" v-show="entity.limitDays">
                    <el-input v-model.number="entity.effectTimes" placeholder="">
                        <template slot="append">
                            <el-select v-model="entity.effectTimeUnit" style="width:80px">
                                <el-option v-for="item in $dict.store.PROMOTION_EFFECT_TIMEUNIT" :key="item[0]"
                                           :value="item[0]" :label="item[1]"></el-option>
                            </el-select>
                        </template>
                    </el-input>
                </el-col>

            </el-row>

            <!-- <el-form-item label="商户活动" prop="isMerchant" v-display="entity.status!=0">
              <el-col :span="4">
                <el-switch v-model="entity.isMerchant" active-text="是" inactive-text="">
                </el-switch>
              </el-col>
              <el-col :span="20">
                <merchant-select v-model="entity.merchantId" v-show="entity.isMerchant"></merchant-select>
              </el-col>
            </el-form-item> -->
            <el-row>
                <el-col :span="10">
                    <el-form-item label="可见性" prop="visibility">
                        <el-select v-model="entity.visibility">
                            <el-option v-for="item in $dict.store.PROMOTION_VISIBILITY" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="用户限次" prop="limitPermanTimes">
                        <el-input v-model="entity.limitPermanTimes" placeholder="限制用户参与次数(0表示不限制)"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="总量" prop="limitTotalNum">
                        <el-switch v-model="limitTotal" active-text="限制" inactive-text="不限"></el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="10" v-show="limitTotal">
                    <el-input v-model="entity.limitTotalNum" placeholder=""></el-input>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="7">
                    <el-form-item label="优惠类型" prop="discountType">
                        <el-select v-model="entity.discountType" placeholder="请选择" @change="onDiscountTypeChange"
                                   :disabled="isDisabled">
                            <el-option key="money" label="金额" :value="1">
                            </el-option>
                            <el-option key="discount" label="折扣" :value="2">
                            </el-option>
                            <el-option key="free" label="免费" :value="3"  v-if="entity.bizType!=3">
                            </el-option>
                            <el-option key="time" label="时长" :value="4"  v-if="entity.bizType!=3">
                            </el-option>
                            <el-option key="right" label="单品" :value="5" v-if="entity.bizType==3">
                            </el-option>

                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单品类型" prop="rightType" v-show="entity.discountType==5">
                        <el-select v-model="entity.rightType" :disabled="isDisabled">
                            <el-option v-for="item in $dict.store.RIGHTTYPE" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>

                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="优惠值" prop="discountValue">
                        <el-input placeholder="优惠值" v-model.number="entity.discountValue" :disabled="isDisabled">
                            <template slot="append" v-if="entity.discountType==1">
                                <span>元</span>
                            </template>
                            <template slot="append" v-else-if="entity.discountType==2">
                                <span>折（100）</span>
                            </template>
                            <template slot="append" v-else-if="entity.discountType==3">
                                <span>次</span>
                            </template>
                            <template slot="append" v-else-if="entity.discountType==4">
                                <span>分钟</span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <!--<el-col :span="5" :offset="2">-->
                <!--<span style="color:red">不可修改</span>-->
                <!--</el-col>-->
            </el-row>
                    <el-row>
                        <el-col>
                            <el-form-item label="状态" prop="status">
                                {{$dict.getText(entity.status,$dict.store.PROMOTION_STATUS)}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="8">
                    <div style="margin:10px" class="merchantLogo">
                        <v-image-uploader :form-data="{}" v-model="entity.icon">

                        </v-image-uploader>
                        <div style="text-align:center">
                            优惠券图标
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-form-item label="发放主体" required>
                <el-radio-group v-model="entity.subjectType" :disabled="isDisabled">
                    <el-radio :label="0">东兴旺平台</el-radio>
                    <br>
                    <el-radio :label="1">
                        <span class="group-text">子公司</span>
                        <branch-company-select v-if="entity.subjectType==1" v-model="entity.subjectId"
                                               :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                    </el-radio>
                    <br>
                    <el-radio :label="2">
                        <span class="group-text">物业</span>
                        <branch-company-select v-if="entity.subjectType==2" v-model="entity.subjectId"
                                               :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                        <MerchantSelect v-if="entity.subjectType==2" v-model="entity.mainMerchant" :clearable="true"
                                        :branchCompanyId="entity.subjectId" :disabled="isDisabled"></MerchantSelect>

                    </el-radio>
                    <br>

                    <el-radio :label="3">
                        <span class="group-text">停车场</span>
                        <branch-company-select v-if="entity.subjectType==3" v-model="entity.subjectId"
                                               :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                        <MerchantSelect v-if="entity.subjectType==3" v-model="entity.mainMerchant" :clearable="true"
                                        :branchCompanyId="entity.subjectId" :disabled="isDisabled"></MerchantSelect>
                        <ParkSelect v-if="entity.subjectType==3" v-model="entity.mainPark" :clearable="true"
                                    :merchantId="entity.mainMerchant" :disabled="isDisabled"></ParkSelect>

                    </el-radio>

                    <br>
                    <el-radio :label="4">
                        <span class="group-text">商家</span>
                        <branch-company-select v-if="entity.subjectType==4" v-model="entity.subjectId"
                                               :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                        <BusinessSelect v-if="entity.subjectType==4" v-model="entity.mainMerchant" :clearable="true"
                                        :branchCompanyId="entity.subjectId" :disabled="isDisabled"></BusinessSelect>
                        <!--<el-input placeholder="商家名称"></el-input>-->
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="使用主体" required>
                <el-radio-group v-model="entity.useType" :disabled="isDisabled">
                    <el-radio :label="0">东兴旺平台</el-radio>
                    <br>
                    <el-radio :label="1">
                        <span class="group-text">子公司</span>
                        <branch-company-select v-if="entity.useType==1" v-model="entity.useCompany" :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                    </el-radio>
                    <br>
                    <el-radio :label="2">
                        <span class="group-text">物业</span>
                        <branch-company-select v-if="entity.useType==2" v-model="entity.useCompany" :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                        <MerchantSelect v-if="entity.useType==2" v-model="entity.useMerchant" :clearable="true"
                                        :branchCompanyId="entity.useCompany" :disabled="isDisabled"></MerchantSelect>
                    </el-radio>
                    <br>

                    <el-radio :label="3">
                        <span class="group-text">停车场</span>
                        <branch-company-select v-if="entity.useType==3" v-model="entity.useCompany" :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                        <MerchantSelect v-if="entity.useType==3" v-model="entity.useMerchant" :clearable="true"
                                        :branchCompanyId="entity.useCompany" :disabled="isDisabled"></MerchantSelect>
                        <ParkSelect v-if="entity.useType==3" v-model="entity.usePark" :clearable="true"
                                    :merchantId="entity.useMerchant" :disabled="isDisabled"></ParkSelect>

                        <!--<el-input placeholder="停车场名称"></el-input>-->
                    </el-radio>

                    <br>
                    <el-radio :label="4">
                        <span class="group-text">商家</span>
                        <branch-company-select v-if="entity.useType==4" v-model="entity.useCompany" :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                        <BusinessSelect v-if="entity.useType==4" v-model="entity.useMerchant" :clearable="true"
                                        :branchCompanyId="entity.useCompany" :disabled="isDisabled"></BusinessSelect>
                    </el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="优惠门槛" prop="dicountCondition">
                <el-input placeholder="优惠门槛说明（如: 无任何门槛）" v-model="entity.discountCondition"></el-input>
            </el-form-item>
            <el-form-item label="优惠规则" prop="ruleTplCode" v-display="entity.status!=0" v-show="false">
                <promotion-rule-def-select v-model="entity.ruleTplCode" :discountType="entity.discountType"
                                           @change="resetProps" @loaded="onRuleDefsLoaded"></promotion-rule-def-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="entity.remark"></el-input>
            </el-form-item>
            <!--<legend >一旦上线，优惠规则不可改变！</legend>-->
        </fieldset>
        <!-- <fieldset v-if="ruleTpl.when||ruleTpl.then" v-display="entity.status!=0">
          <legend>活动规则参数</legend>

          <div v-if="ruleTpl.when">

            <el-alert title="条件" description=""><span style="margin-left:20px">限定规则适用条件参数</span></el-alert>
            <el-form-item v-for="(item, index) in getProps('when')" :key="item.propkey" :label="item.propName" :prop="'props.'+index+'.propValue'" :rules="{
            required: item.required, message: '不能为空', trigger: 'blur'
          }">
              <el-input v-model="item.propValue" :placeholder="item.remark"></el-input>
            </el-form-item>

          </div>
          <div v-if="ruleTpl.then">

            <el-alert type="warning" title="结果"><span style="margin-left:20px">设置结果参数</span>
              <div>{{ruleTpl.then.description}}
              </div>
            </el-alert>
            <el-form-item v-for="(item, index) in getProps('then')" :key="item.propkey" :label="item.propName" :prop="'props.'+index+'.propValue'" :rules="{
            required: item.required, message: '不能为空', trigger: 'blur'
          }">
              <el-input v-model="item.propValue" :placeholder="item.remark"></el-input>
            </el-form-item>

          </div>
        </fieldset> -->

    </el-form>
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

    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
    import ParkSelect from "@/components/widgets/ParkSelect.vue";

    import BusinessSelect from "@/components/widgets/BusinessSelect.vue";
    import PromotionRuleDefSelect from "@/components/widgets/PromotionRuleDefSelect.vue";

    const defaultEntity = {
        id: null,
        type: 2, //优惠券
        isMerchant: false,
        limitDays: false,
        visibility: "public",
        effectTimes: null,
        effectTimeUnit: "day",
        ruleTplCode: "",
        discountCondition: "无任何门槛",
        discountValue: 0,
        limitTotalNum: '',
        limitPermanTimes: '',
        props: [],
        effectRange: [],
        discountType: 1,
        status: 0,
        tip: "",
        remark: "",
        bizType: 2, // 业务类型
        subjectType: 0,
        subjectId: 0,
        useType: 0,
        useCompany: 0,
        usePark: 0,
        useMerchant: 0,
        itemType: 0,
        mainPark: 0,
        mainMerchant: 0,

    };
    export default {
        components: {BusinessSelect,ParkSelect, MerchantSelect, PromotionRuleDefSelect, BranchCompanySelect},
        data() {
            return {
                ruleTpl: {when: null, then: null},
                entity: _.cloneDeep(defaultEntity),
                dateRange: [],
                oldProps: [],
                ruleDefs: [],
                isDisabled: false,
                limitTotal: false,
                rules: {
                    bizType: [{
                        required: true
                    }],
                    name: [
                        {required: true, message: "名称不能为空", trigger: "blur"},
                        {
                            min: 1,
                            max: 128,
                            message: "长度在 1 到 128 个字符",
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
                    // discountValue: [
                    //     {type: 'number', required: true, message: '请输入优惠值', trigger: 'change'},
                    //     {type: 'number', min: 1, message: '优惠值必须大于1', trigger: 'change'}
                    // ],
                    limitDays: [
                        {
                            required: false
                        }
                    ],
                    limitTotalNum: [
                        {
                            required: false
                        }
                    ],
                    isMerchant: [
                        {
                            required: true
                        }
                    ],
                    tip: [
                        {
                            required: true,
                            message: "活动提示不能为空",
                            trigger: "blur"
                        }
                    ],
                    limitPermanTimes: [
                        {
                            required: true,
                            message: "限次不能为空",
                        }
                    ],
                    visibility: [
                        {
                            required: false,
                        }
                    ],
                    // ruleTplCode: [
                    //   {
                    //     required: true,
                    //     message: "请选择活动规则",
                    //     trigger: "change"
                    //   }
                    // ],
                    effectRange: [
                        {
                            required: true,
                            message: "请选择活动时间"
                        }
                    ]
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
                let ruleCode = this.entity.ruleTplCode;
                if (!ruleCode) {
                    return;
                }
                if (!this.ruleDefs) {
                    return;
                }
                let opt = this.ruleDefs.filter(tmp => tmp.code == ruleCode)[0];
                if (!opt) return;
                this.ruleTpl = opt;
                let whenFields = opt.when == null ? [] : opt.when.fields;
                let thenFields = opt.then == null ? [] : opt.then.fields;
                let oldProps = this.oldProps || [];

                function field2Props(fields, type) {
                    let rs = [];
                    fields.forEach(f => {
                        let tmpOlds = oldProps.filter(
                            p => p.propKey == f.prop && p.propScope == type
                        );
                        let tmpOld = tmpOlds.length > 0 ? tmpOlds[0] : null;
                        rs.push({
                            propKey: f.prop,
                            propName: f.name,
                            propValue: tmpOld == null ? "" : tmpOld.propValue,
                            remark: f.remark,
                            required: !!f.required,
                            propScope: type
                        });
                    });
                    return rs;
                }

                let whenProps = field2Props(whenFields || [], "when");
                let thenProps = field2Props(thenFields || [], "then");
                this.entity.props = [];
                this.entity.props = this.entity.props.concat(whenProps).concat(thenProps);
            },
            setValues(vals) {
                this.resetEntity = _.cloneDeep(vals);
                this.entity = _.cloneDeep(this.resetEntity);
            },
            submitForm() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        let params = Object.assign({}, this.entity);
                        if (!params.isMerchant) {
                            params.merchantId = 0;
                        }
                        if (!params.limitDays) {
                            params.effectTimes = 0;
                        }
                        if (this.limitTotal) {
                            params.limitTotalNum = this.entity.limitTotalNum
                        } else {
                            params.limitTotalNum = -1
                        }
                        // params.startOn = this.entity.effectRange[0];
                        // params.endOn = this.entity.effectRange[1];

                        this.$api.ipark.PromotionInfoService.save(params).then(rsp => {
                            this.$emit("saved", rsp);
                        });
                    }
                });
            },
            resetForm() {
                this.$refs["form"].resetFields();
                this.entity = _.cloneDeep(defaultEntity);
            },
            init(options) {
                this.resetForm();
                if (options.id) {
                    console.log(JSON.stringify(this.entity));
                    this.isDisabled = true;//this.entity.status > 0;
                    this.$api.ipark.PromotionInfoService.get(options.id).then(r => {
                        this.isDisabled = r.status > 0;
                        r.limitDays = !!r.effectTimes;
                        r.isMerchant = !!r.merchantId;
                        this.entity = r;
                        if (this.entity.limitTotalNum == -1) {
                            this.limitTotal = false
                            this.entity.limitTotalNum = ''
                        } else {
                            this.limitTotal = true
                        }
                        //this.oldProps = r.props || [];
                        //this.resetProps();
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
