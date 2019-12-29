<template>
    <v-tree-select ref="treeSelect" v-model="currentValue" :loading="loading" :clearable="clearable" :only-child="onlyChild" :tree-data="treeData"></v-tree-select>
</template>

<script>
  import vTreeSelect from '../v-tree-select'

  export default {
    name: 'OrgTree',
    components: {vTreeSelect},
    props: {
      value: {
        required: true
      },
      corpId: {
        required: true
      },
      clearable: {
        type: Boolean
      },
      onlyChild: {
        type: Boolean
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
    data () {
      return {
        loading: false,
        treeData: []
      }
    },
    methods: {
      refresh () {
        this.loading = true
        this.$api.sys.Org.tree(this.corpId).then(rsp => {
          this.treeData = [
            {
              children: [rsp],
              id: '0',
              text: '组织结构根'
            }
          ]
          this.loading = false
        })
      }
    },
    created () {
      this.refresh()
    },
    mounted () {
      this.$refs['treeSelect'].$on('nodeClick', (val) => {
        this.$emit('nodeClick', val)
      })
    }
  }
</script>
