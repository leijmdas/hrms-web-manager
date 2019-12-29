<template>
  <el-select v-model="currentValue" placeholder="请选择" remote :remote-method="loadData" :loading="loading" :clearable="clearable" :disabled="disabled"
             @change="handleChange" filterable >
    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled" >
    </el-option>
  </el-select>
</template>

<style rel="stylesheet/less" lang="less">
    .el-select-dropdown__item{
        max-width: 250px;
    }
</style>
<script>
export default {
    data() {
        return {
            loading: false,
            options: [],
            disOpts: []

        };
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
        emptyLabel: {
            required: false
        },
        branchCompanyId: {
            //type: Number
        }
    },
    computed: {
        currentValue: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    },
    watch: {
        branchCompanyId: {
            handler: function(newVal, oldVal) {
                this.refresh();
            },
            deep: true
        }
    },
    methods: {
    handleChange(val) {
      this.$emit('change', val);
    },
        loadData (query) {
            query = (query || '').replace(/\[.*\]/g, '');
            query = query.replace(/^\s+|\s+$/gm, '');
            if (query) {
                this.loading = true;
                this.$api.ipark.MerchantInfoService.query({
                    param: {branchCompanyId: this.branchCompanyId, name: query, isDeleted: false},
                    _openLoading: false
                }).then(rsp => {
                    this.options = rsp.data;
                    this.loading = false;
                });
            } else {
                this.options = [];
                this.refresh();
            }
        },
        refresh(params = {}) {
            this.loading = true;
            this.options = [];
            this.$api.ipark.MerchantInfoService.query({
                limit: this.branchCompanyId == null ? 20 : 1000,
                param: {
                    branchCompanyId: this.branchCompanyId,
                    isDeleted: false
                },
                _openLoading: false
            }).then(page => {
                this.options = page.data || [];
                this.loading = false;
            });
        }
    },
    created() {
    this.refresh();
  }
};
</script>
