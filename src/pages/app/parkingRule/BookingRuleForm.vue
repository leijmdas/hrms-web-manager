<template>
    <div>
        <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
            <el-alert v-if="!entity.id" title="计费规则尚未保存！" show-icon type="warning" :closable="false" style="margin-bottom:10px">
            </el-alert>
            <el-form-item label="计费模板" prop="ruleTplCode">
                <el-select v-model="entity.ruleTplCode" @change="onTplChange">
                    <el-option v-for="item in [['booking:timelong','按时长计费']]" :key="item[0]" :value="item[0]"
                               :label="item[1]"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="免费时长" :prop="`props.freeMinutes`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }">
                <el-input v-model="entity.props['freeMinutes']" v-numberInt="0">
                    <template slot="append">分</template>
                </el-input>
            </el-form-item>
            <el-form-item label="标准费用" :required="true" class="standardFeeItem" style="width:400px">
                <el-col :span="11">
                    <el-form-item :prop="`props.standardAmount`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }">
                        <el-input v-model="entity.props['standardAmount']" v-numberInt="2" placeholder="">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col class="line" :span="2">/</el-col>
                <el-col :span="11">
                    <el-form-item :prop="`props.standardUnit`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }">
                        <el-input v-model="entity.props['standardUnit']" v-numberInt="0" placeholder="">
                            <template slot="append">分</template>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="entity.remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">保存</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style lang="less" scoped>
    .el-upload-dragger {
        img {
            width: 300px;
            height: 300px;
        }
    }
</style>

<script>
    const defaultEntity = {
        id: null,
        code: '',
        name: '',
        ruleTplCode: 'booking:timelong',
        props: {},
        status: 1,
        remark: '预约服务费___元/___分钟，不满___分钟按___分钟计算'
    };
    export default {
        components: {},
        data() {
            return {
                entity: _.cloneDeep(defaultEntity),
                types: [],
                ruleType: 1,
                rules: {
                    ruleTplCode: {required: true, message: '请选择计费模板', trigger: 'change'},
                    remark: {required: true, message: '请填写备注信息', trigger: 'blur'}
                }
            };
        },
        methods: {

            onTplChange(newV) {
                let defaultProps = {}, _props = {};
                switch (newV) {
                case 'booking:timelong':
                    defaultProps = {
                        freeMinutes: 0,
                        standardAmount: 6,
                        standardUnit: 30
                    };
                    _props = Object.assign(defaultProps, this.entity.props);
                    this.$set(this.entity, 'props', _props);
                    break;

                }
            },
            setValues(vals) {
                this.resetEntity = _.cloneDeep(vals);
                this.entity = _.cloneDeep(this.resetEntity);
            },
            submitForm() {
                let p = Object.assign({}, this.entity);
                p.parkId = this.parkId;
                p.type = this.ruleType;
                p.status = 1;
                // 数组处理
                // let _props = this.preHandleProps(p.props);
                // p.props = _props;
                p.ruleParams = JSON.stringify(p.props);
                this.$refs['form'].validate((valid, err) => {
                    if (valid) {
                        this.$api.ipark.ParkingRuleService.save(p).then(id => {
                            this.entity.id = id;
                            this.$message('保存成功!');
                        });
                    }
                });
            },
            resetForm() {
                this.$refs['form'].resetFields();
            },
            init(options = {}) {
                this.resetForm();
                this.parkId = options.parkId;
                if (this.parkId) {
                    // loadData
                    this.$api.ipark.ParkingRuleService.findRule(this.parkId, this.ruleType).then(r => {
                        let _r = _.cloneDeep(defaultEntity);
                        if (r) {
                            _r = r;
                        }
                        _r.ruleTplCode = _r.ruleTplCode || 'booking:timelong';
                        if (_r.ruleParams) {
                            _r.props = JSON.parse(_r.ruleParams);
                        }
                        this.entity = _r;
                        this.onTplChange(_r.ruleTplCode);// 默认
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
