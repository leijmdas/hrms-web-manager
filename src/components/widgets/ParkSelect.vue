<template>
    <el-select v-model="currentValue" placeholder="请选择" remote :remote-method="loadData" :loading="loading" :clearable="clearable" :disabled="disabled"
               @change="handleChange" filterable>
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
        </el-option>
    </el-select>
</template>

<script>

    export default {
        data() {
            return {
                loading: false,
                options: [],
                disOpts: [],
                num: 1
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
            merchantId: {
                //type: Number
            }
        },
    computed: {
      currentValue: {
        get () {
          return this.value;
        },
        set (val) {
          this.$emit('input', val);
        }
      }
    },
      watch: {
          merchantId: {
              handler: function(newVal, oldVal) {
                  this.refresh();
                  if (this.num != 1) {
                      this.currentValue = '';
                  }
              },
              deep: true
          }
      },
        methods: {
            handleChange(val) {
                this.$emit('change', val);
            },
            loadData (query) {
                query = (query || '').replace(/\[.*\]/g, '')
                query = query.replace(/^\s+|\s+$/gm, '')
                if (query) {
                    this.loading = true
                    this.$api.ipark.ParkInfoService.query({
                        param: {merchantId: this.merchantId, name: query, isDeleted: false},
                        _openLoading: false
                    }).then(rsp => {
                        this.options = rsp.data
                        this.loading = false
                    })
                } else {
                    this.options = []
                    this.refresh()
                }
            },
            refresh() {
                this.loading = true;
                this.$api.ipark.ParkInfoService.query({
                    param: {merchantId: this.merchantId, isDeleted: false},
                    _openLoading: false
                }).then(rsp => {
                    this.options = rsp.data;
                    this.loading = false;
                });
            }
        },
        created() {
            this.refresh();

      }
  };
</script>
