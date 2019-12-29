<template>
    <el-cascader v-model="currentValue" :options="options" :props="props" placeholder="请选择" :loading="loading" :clearable="clearable" :disabled="disabled"
                 @active-item-change="handleItemChange" @change="handleChange">
    </el-cascader>
</template>

<script>
  
  export default {
    data () {
      return {
        loading: false,
        options: [],
        props: {
          label: 'name',
          value: 'code'
        }
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
      }
    },
    computed: {
      currentValue: {
        get () {
          if (this.value) {
            const v = [Math.floor(this.value / 10000) * 10000 + '', Math.floor(this.value / 100) * 100 + '', this.value]
            !this.loading && this.initItem([v[0], v[1]])
            return v
          }
          return undefined
        },
        set (val) {
          this.$emit('input', val.length ? val[2] : undefined)
        }
      }
    },
    methods: {
      handleChange (val) {
        this.$emit('change', val)
      },
      handleItemChange (val) {
        this.initItem(val)
      },
      refresh () {
        this.loading = true
        this.getAreasByParentCode('000000').then(rsp => {
          rsp.data.map(n => (n.children = []))
          this.options = rsp.data
          this.loading = false
        })
      },
      getAreasByParentCode (parentCode) {
        return this.$api.ipark.AreaInfoService.microList({limit:-1,param: {parentCode},_openLoading:false})
      },
      initItem (codes, options = this.options) {
        codes = codes.concat()
        const c = codes.shift()
        const area = options.filter(i => i.code == c)[0]
        if (area.children.length) {
          codes.length && this.initItem(codes, area.children)
        } else {
          this.getAreasByParentCode(area.code).then(rsp => {
            if (rsp.data.length) {
              rsp.data.forEach(n => n.code % 100 || (n.children = []))
              area.children = rsp.data
              codes.length && this.initItem(codes, area.children)
            }
          })
        }
      }
    },
    created () {
      this.refresh()
    }
  }
</script>
