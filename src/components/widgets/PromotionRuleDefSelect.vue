<!--规则定义 -->
<template>
    <el-select v-model="currentValue" placeholder="请选择" :loading="loading" :clearable="clearable" :disabled="disabled" @change="handleChange">
        <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code" :disabled="item.disabled">
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
      // corpId: function () {
      //   this.refresh()
      // }
    },
    methods: {
      handleChange (val) {
        this.$emit('change', val,this.options)
      },
      refresh () {
        this.loading = true
        this.$api.ipark.PromotionInfoService.getRuleDefs({}).then(rs => {
          this.options = rs
          this.loading = false
          this.$emit('loaded',rs)
        })
      }
    },
    created () {
      this.refresh()
    }
  }
</script>
