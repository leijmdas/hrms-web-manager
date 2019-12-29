<template>
    <el-form class="dialog-form" :model="entity" :rules="rules" ref="form" label-width="120px">
        <fieldset>
            <legend>活动规则</legend>

                    <el-form-item label="名称" prop="name">
                        <el-input v-model="entity.name" :disabled="isDisabled"></el-input>
                    </el-form-item>

            <el-row :span="24">
                <el-col :span="10">
                    <el-form-item label="活动类型" prop="type">
                        <el-select v-model="entity.type" placeholder="请选择" :disabled="isDisabled">
                            <!--<el-option v-for="item in $dict.store.ACTIVITY_TYPE" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
                            <el-option v-for="item in $dict.store.ACTIVITY_TYPE" :key="item[0]" :value="item[0]"
                                       :label="item[1]"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="活动时间" required>
                        <el-date-picker v-model="timeValue" type="datetimerange" range-separator="至"
                                        start-placeholder="开始日期" end-placeholder="结束日期" @change="getSTime"
                                        :disabled="isDisabled"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="主体类型" prop="issueType">
                <el-radio-group v-model="entity.issueType" :disabled="isDisabled">
                    <el-radio :label="0">东兴旺平台</el-radio>
                    <br>
                    <el-radio :label="1">
                        <span class="title-text">子公司</span>
                        <branch-company-select v-if="entity.issueType==1" v-model="entity.branchCompanyId"
                                               :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                    </el-radio>
                    <br>
                    <el-radio :label="2"><span class="title-text">物业</span>
                        <branch-company-select v-if="entity.issueType==2" v-model="entity.branchCompanyId"
                                               :clearable="true" :disabled="isDisabled"></branch-company-select>
                        <merchant-select v-if="entity.issueType==2" v-model="entity.merchantId" :clearable="true"
                                         :branchCompanyId="entity.branchCompanyId"
                                         :disabled="isDisabled"></merchant-select>
                    </el-radio>
                    <br>
                    <el-radio :label="3"><span class="title-text">停车场</span>
                        <branch-company-select v-if="entity.issueType==3" v-model="entity.branchCompanyId"
                                               :clearable="true" :disabled="isDisabled"></branch-company-select>
                        <merchant-select v-if="entity.issueType==3" v-model="entity.merchantId" :clearable="true"
                                         :branchCompanyId="entity.branchCompanyId"
                                         :disabled="isDisabled"></merchant-select>
                        <park-select v-if="entity.issueType==3" v-model="entity.parkId" :clearable="true"
                                     :merchantId="entity.merchantId"
                                     :disabled="isDisabled"></park-select>
                    </el-radio>
                    <br>
                    <el-radio :label="4"><span class="title-text">商家</span>
                        <branch-company-select v-if="entity.issueType==4" v-model="entity.branchCompanyId"
                                               :clearable="true" :disabled="isDisabled"></branch-company-select>
                        <business-select v-if="entity.issueType==4" v-model="entity.merchantId" :clearable="true"
                                         :branchCompanyId="entity.branchCompanyId"
                                         :disabled="isDisabled"></business-select>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="使用主体" prop="issueType">
                <el-radio-group v-model="entity.issueType" :disabled="isDisabled">
                    <el-radio :label="0">东兴旺平台</el-radio>
                    <br>
                    <el-radio :label="1">
                        <span class="title-text">子公司</span>
                        <branch-company-select v-if="entity.issueType==1" v-model="entity.branchCompanyId"
                                               :clearable="true"
                                               :disabled="isDisabled"></branch-company-select>
                    </el-radio>
                    <br>
                    <el-radio :label="2"><span class="title-text">物业</span>
                        <branch-company-select v-if="entity.issueType==2" v-model="entity.branchCompanyId"
                                               :clearable="true" :disabled="isDisabled"></branch-company-select>
                        <merchant-select v-if="entity.issueType==2" v-model="entity.merchantId" :clearable="true"
                                         :branchCompanyId="entity.branchCompanyId"
                                         :disabled="isDisabled"></merchant-select>
                    </el-radio>
                    <br>
                    <el-radio :label="3"><span class="title-text">停车场</span>
                        <branch-company-select v-if="entity.issueType==3" v-model="entity.branchCompanyId"
                                               :clearable="true" :disabled="isDisabled"></branch-company-select>
                        <merchant-select v-if="entity.issueType==3" v-model="entity.merchantId" :clearable="true"
                                         :branchCompanyId="entity.branchCompanyId"
                                         :disabled="isDisabled"></merchant-select>
                        <park-select v-if="entity.issueType==3" v-model="entity.parkId" :clearable="true"
                                     :merchantId="entity.merchantId"
                                     :disabled="isDisabled"></park-select>
                    </el-radio>
                    <br>
                    <el-radio :label="4"><span class="title-text">商家</span>
                        <branch-company-select v-if="entity.issueType==4" v-model="entity.branchCompanyId"
                                               :clearable="true" :disabled="isDisabled"></branch-company-select>
                        <business-select v-if="entity.issueType==4" v-model="entity.merchantId" :clearable="true"
                                         :branchCompanyId="entity.branchCompanyId"
                                         :disabled="isDisabled"></business-select>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="规则明细" prop="ruleRemark">
                <el-input type="textarea" v-model="entity.ruleRemark" :disabled="isDisabled"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="entity.remark" :disabled="isDisabled"></el-input>
            </el-form-item>
            <el-row :span="24">
                <el-col :span="12">
                    <el-form-item v-if="entity.type>=200 && entity.type<300" label="跳转类型" prop="urlType"
                                  :disabled="isDisabled">
                        <el-select v-model="entity.urlType" placeholder="请选择" :disabled="isDisabled">
                            <el-option v-for="item in urlTypes" :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>

                </el-col>
                <el-col :span="12">
                    <el-form-item v-if="entity.urlType=='h5' && entity.type>=200 && entity.type<300" label="H5页面"
                                  prop="urlH5" :disabled="isDisabled">
                        <el-input v-model="entity.urlH5"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col :span="12">

                    <el-form-item v-if="entity.urlType=='app' && entity.type>=200 && entity.type<300" label="安桌APP页面"
                                  prop="urlAndroid" :disabled="isDisabled">
                        <el-input v-model="entity.urlAndroid"></el-input>

                    </el-form-item>
                </el-col>
                <el-col :span="12">

                    <el-form-item v-if="entity.urlType=='app'" label="苹果APP页面" prop="urlIos" :disabled="isDisabled">
                        <el-input v-model="entity.urlIos">

                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </fieldset>
    </el-form>
</template>
<style lang="less">
    .dialog-form {
        .el-radio-group {
            .el-radio {
                display: flex;
                align-items: center;
            }

            label {
                height: 40px;
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
    import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
    import BusinessSelect from '@/components/widgets/BusinessSelect.vue';
    import ParkSelect from '@/components/widgets/ParkSelect.vue';

    const defaultEntity = {
        id: null,
        name: '', // 活动名称
        type: '', // 活动类型
        branchCompanyId: null, //  分公司ID
        merchantId: null, // 商户ID
        issueType: 0, // 派发单位类型
        sceneType: 0, // 使用场景
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        ruleRemark: '', // 规则说明
        remark: '' // 备注
    };

    export default {
        components: {BranchCompanySelect, MerchantSelect, BusinessSelect, ParkSelect},
        data() {
            return {
                entity: _.cloneDeep(defaultEntity),
                isDisabled: false,
                timeValue: ['', ''],
                rules: {
                    name: [
                        {
                            type: "string",
                            required: true,
                            message: "名称不能为空",
                            trigger: "blur"
                        }
                    ],
                    issueType: [
                        {
                            required: true,
                        }
                    ],
                    type: [
                        {
                            required: true,
                            message: "请选择活动",
                            trigger: "blur"
                        }
                    ],
                    ruleRemark: [
                        {
                            required: true,
                            message: "请填写规则说明",
                            trigger: "blur"
                        }
                    ]
                },
                urlTypes: [
                    {value: '', label: '无'},
                    {value: 'h5', label: '网页'},
                    {value: 'app', label: 'APP页面'}
                ],
                // typeOptions: [
                //     {value: 100, label: '新注册用户'},
                //     {value: 101, label: '老用户邀请(新用户注册)'},
                //     {value: 102, label: '老用户邀请(新用户首次使用)'},
                //     {value: 103, label: '预约送券'},
                //     {value: 201, label: 'BANNER图1'},
                //     {value: 202, label: 'BANNER图2'},
                //     {value: 203, label: 'BANNER图3'},
                //     {value: 204, label: 'BANNER图4'},
                //     {value: 205, label: 'BANNER图5'}
                // ]
            };
        },
        methods: {
            saveForm() {
                console.log(this.timeValue)
                if (!(this.timeValue[0] && this.timeValue[1])) {
                    this.$message('请选择开始和结束时间')
                }
                this.entity.startTime = this.dateFormat(this.timeValue[0]);
                this.entity.endTime = this.dateFormat(this.timeValue[1]);
                let params = Object.assign({}, this.entity);

                this.$refs["form"].validate((valid, err) => {
                    if (valid) {
                        this.$api.ipark.ActivityRulesService.save(params).then((res) => {
                            this.$emit("saved", res);
                            // this.$message({
                            //     type: 'success',
                            //     message: '上架成功!'
                            // });
                        })
                    }
                });
            },
            /**
             * 处理时间
             */
            dateFormat(date) {
                var date = new Date(date);
                var map = {
                    "Y": date.getFullYear(),
                    "M": ((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1), //月份
                    "d": (date.getDate() < 10) ? '0' + date.getDate() : date.getDate(), //日
                    "h": (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(), //小时
                    "m": (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(), //分
                    "s": (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds(), //秒
                };
                return map.Y + '-' + map.M + '-' + map.d + ' ' + map.h + ':' + map.m + ':' + map.s;
            },

            resetForm() {
                this.$refs['form'].resetFields();
                this.entity = _.cloneDeep(defaultEntity);
            },
            init(options) {
                console.log(options)
                this.isDisabled = false;
                this.resetForm();
                if (options.id) {
                    this.$api.ipark.ActivityRulesService.get(options.id).then(r => {
                        this.entity = r;
                        this.timeValue = [new Date(this.entity.startTime), new Date(this.entity.endTime)]

                        if (this.entity.status != 0) { // 草稿都能编辑  下架或者上架的都不能编辑
                            this.isDisabled = true;
                        } else {
                            this.isDisabled = false;
                        }
                    })
                }
            },
            closed() {
                this.entity = _.cloneDeep(defaultEntity);
                this.timeValue = ['', ''];
            },
            getSTime(val) {
                this.timeValue = val
            }
        },
        mounted() {
            this.$on('init', this.init);
            this.$on('submit', this.saveForm);
            this.$on('closed', this.closed)
        }
    };
</script>
