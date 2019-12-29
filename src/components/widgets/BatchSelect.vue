<!--模板名称选择-->

<template>
    <el-select v-model="currentValue" placeholder="请选择" filterable :loading="loading" :clearable="clearable" :disabled="disabled" @change="handleChange">
        <el-option v-for="item in options" :key="item.id" :label="item.batchNo" :value="item.id" :disabled="item.disabled">
        </el-option>
    </el-select>
</template>

<script>
    import { fetch } from "@/utils";

    export default {
        data () {
            return {
                loading: false,
                options: [],
                disOpts: []
            }
        },
        props: {
            value: {
                required: true
            },
            clearable: {
                type: Boolean
            },
            disabled: {
                type: Boolean
            },
            modelId: {
                //type: Number
            }
        },
        computed: {
            currentValue: {
                get () {
                    return this.value
                },
                set (val) {
                    this.$emit('input', val)
                }
            }
        },
        watch: {
            modelId: {
                handler: function(newVal, oldVal) {
                    this.value = ''
                    this.currentValue = ''
                    this.refresh();
                },
                deep: true
            }
        },
        methods: {
            handleChange (val) {
                this.$emit('change', val)
            },
            refresh () {
                this.loading = true
                this.$api.ipark.PromotionCouponBatchService.query({param: {promotionId: this.modelId,isDeleted:false}}).then(rsp => {
                    this.options = rsp.data
                    this.loading = false
                })
            }
        },
        created () {
            this.refresh()
        }
    }
</script>
