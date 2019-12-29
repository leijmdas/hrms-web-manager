<template>
    <el-select v-model="currentValue" placeholder="请选择" :loading="loading" :clearable="clearable" :disabled="disabled" 
                @change="handleChange"  filterable>
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
        </el-option>
    </el-select>
</template>

<script>
  
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
      accountType: {
        type: Number
      },
      type: {
        type: Number
      },
      disabled: {
        type: Boolean
      },
      emptyLabel: {
        required: false
      },
      lockerIds: {
      }
    },
    computed: {
      currentValue: {
        get () {
          let value = parseInt(this.value)
          return isNaN(value) ? this.value : value
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    },
    watch: {
      accountType: {
          handler: function(newVal, oldVal) {
            this.refresh();
          },
          deep: true
      },
      type: {
          handler: function(newVal, oldVal) {
              this.refresh();
          },
          deep: true
      }
    },
    methods: {
      handleChange (val) {
        this.$emit('change', val)
      },
      refresh (options) {
        this.loading = true
        this.$api.ipark.SettleAccountService.query({
            orderBys: 'id|desc',
            param: {
                type: this.type,
                accountType: this.accountType,
                isDeleted: false
            }
        }).then(rsp => {
            this.options = rsp.data
            this.loading = false
        })
      },
     remoteSearch(query) {
         query = (query || "").replace(/\[.*\]/g, "");
         query = query.replace(/^\s+|\s+$/gm, "");
         let p = { keywords: query };
         this.load(p);
     }
    },
    mounted() {
       this.refresh();
    }

  }
</script>
