<!--模板名称选择-->

<template>
    <el-select v-model="currentValue" placeholder="请选择" remote :remote-method="refresh" filterable :loading="loading" :clearable="clearable" :disabled="disabled" @change="handleChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
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
            status: {
                type: Number
            },
            disabled: {
                type: Boolean
            },
            bizId: {
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
            bizId: {
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
            refresh (query) {
                query = (query || '').replace(/\[.*\]/g, '')
                query = query.replace(/^\s+|\s+$/gm, '')
                this.loading = true
                let params = {
                    sortBys: 'id|desc',
                    keywords: query,
                    param: {
                        bizType: this.bizType,
                        status: this.status,
                        isDeleted: false
                    }
                }
                this.$api.ipark.PromotionInfoService.query(params).then(rsp => {
                    this.options = rsp.data||[]
                    this.loading = false
                })
            }
        },
        created () {
            this.refresh()
        }
    }
</script>
