<template>
    <el-form class="dialog-form" ref="form" label-width="120px">
        <fieldset>
            <legend>优惠券模板</legend>
            <el-form-item label="业务类型" required>
                <el-select  style="width:152px">
                    <el-option>预约</el-option>
                    <el-option>临停</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" required>
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="时间范围" required>
                <el-date-picker
                    v-model="value1"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="激活后有效期">
                <el-col :span="5">
                    <el-switch active-text="限制" inactive-text="不限">
                    </el-switch>
                </el-col>
                <el-col :span="6">
                    <el-input placeholder="">
                        <template slot="append">
                            <el-select  style="width:80px">
                                <el-option>天</el-option>
                                <el-option>小时</el-option>
                            </el-select>
                        </template>
                    </el-input>
                </el-col>

            </el-form-item>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="可见性">
                        <el-select>
                            <el-option>公开</el-option>
                            <el-option>私有</el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="用户限次">
                        <el-input placeholder="限制用户参与次数(0表示不限制)"></el-input>

                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="总量" required>
                        <el-input placeholder=""></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="优惠类型">
                <el-row>
                    <el-col :span="6">
                        <el-select v-model="entity.discountType" placeholder="请选择" :disabled="entity.status==1">
                            <el-option key="money" label="金额" :value="1">
                            </el-option>
                            <el-option key="discount" label="折扣" :value="2">
                            </el-option>
                            <el-option key="time" label="时长" :value="4">
                            </el-option>
                            <el-option key="free" label="免费" :value="3">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <el-input placeholder="优惠值" v-model="entity.discountValue" :disabled="entity.discountType==3||entity.status==1" >
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
                    </el-col>
                    <el-col :span="5" :offset="2">
                        <span style="color:red">不可修改</span>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="派发单位" required>
                <el-radio-group v-model="resource">
                    <el-radio :label="3">东兴旺平台</el-radio>
                    <br>
                    <el-radio :label="4"><span class="title-text">子公司</span>
                        <el-select v-model="value" filterable placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-radio>
                    <br>
                    <el-radio :label="5"><span class="title-text">物业公司</span>
                        <el-select v-model="value" filterable placeholder="请选择分公司">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="value" filterable placeholder="请选择物业公司">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="优惠门槛" required>
                <el-input type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea"></el-input>
            </el-form-item>
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
    export default {
        data() {
            return {
                entity: {
                    discountType: 1,
                    status: 1
                },
                value1: '',
                value0: '',
                resource: 4,
                resource1: 3,
                // ci: [2, 3]
                radio: 4,
                options: [{
                    value: '选项1',
                    label: '深圳'
                }, {
                    value: '选项2',
                    label: '北京'
                }, {
                    value: '选项3',
                    label: '上海'
                }, {
                    value: '选项4',
                    label: '重庆'
                }, {
                    value: '选项5',
                    label: '成都'
                }, {
                    value: '选项6',
                    label: '广州'
                }, {
                    value: '选项7',
                    label: '天津'
                }],
                value: ''
            };
        },
        methods: {},
        mounted() {
        }
    };
</script>
