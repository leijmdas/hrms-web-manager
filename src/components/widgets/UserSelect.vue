<template>
    <el-select v-model="currentValue" placeholder="请选择" remote :remote-method="loadData" :loading="loading" :clearable="clearable"
               :disabled="disabled" @change="handleChange" filterable>
        <el-option v-for="item in options" :key="item.id" :label="item.username" :value="item.id" :disabled="item.disabled">
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
      disabled: {
        type: Boolean
      },
      emptyLabel: {
        required: false
      },
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

    },
    methods: {
      handleChange (val) {
        this.$emit('change', val)
      },
        loadData (query) {
            query = (query || '').replace(/\[.*\]/g, '')
            query = query.replace(/^\s+|\s+$/gm, '')
            if (query) {
                this.loading = true
                this.$api.ipark.UserInfoService.query({param: {isDeleted: false, username: query}}).then(rsp => {
                    this.options = rsp.data
                    this.loading = false
                })
            } else {
                this.options = []
            }
        },
      refresh () {
        // this.loading = true
        // this.$api.ipark.UserInfoService.query({param: {isDeleted:false}}).then(rsp => {
        //   this.options = rsp.data
        //   this.loading = false
        // })
      }
    },
    created () {
      this.refresh()
    }
  }
</script>
