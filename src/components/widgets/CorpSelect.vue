<template>
    <el-select v-model="currentValue" placeholder="请选择" :loading="loading" :clearable="clearable" :disabled="disabled" @change="handleChange">
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
        this.$emit('change', val)
      },
      refresh () {
        this.loading = true
        // this.$api.ipark.CorpInfoService.query({param: {isDeleted:false}}).then(rsp => {
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
