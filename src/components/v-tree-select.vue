<template>
    <el-select ref="select" :value="currentValuet" :loading="loading" :clearable="clearable" @clear="clearData">
        <el-option :value="0" :label="currentLabel" class="dropdown__tree">
            <el-tree ref="tree" :data="treeData" :props="defaultProps" node-key="id" highlight-current accordion
                     :default-expanded-keys="[pid]" @node-click="handleNodeClick"></el-tree>
        </el-option>
    </el-select>
</template>

<script type="text/ecmascript-6">

  export default {
    components: {},
    name: "vTreeSelect",
    props: {
      value: {
        required: true
      },
      loading: {
        type: Boolean
      },
      clearable: {
        type: Boolean
      },
      treeData: {
        required: true,
        type: Array
      },
      onlyChild: {
        type: Boolean,
        default:false
      }
      
    },
    data () {
      return {
        currentLabel: undefined,
        pid: undefined,
        defaultProps: {
          children: 'children',
          label: 'text'
        }
      }
    },
    computed: {
      currentValuet () {
        this.pid = ''
        // 默认选中节点
        if (this.value !== null && this.value !== undefined) {
          const result = this.currentNode(this.treeData, this.value)
          this.pid = result === true || result === undefined ? '' : result
          return 0
        } else {
          this.pid = ''
          return undefined
        }
      }
    },
    methods: {
      currentNode (data, value) {
        for (let i in data) {
          if (data[i].id === value + '') {
            this.selectNode(data[i])
            return true
          } else if (data[i].children && data[i].children.length > 0) {
            const result = this.currentNode(data[i].children, value)
            if (result !== undefined) {
              return result === true ? data[i].id : result
            }
          }
        }
      },
      handleNodeClick (data) {

        return (this.onlyChild ? (!data.children || data.children.length === 0) : true) && this.$emit('input', parseInt(data.id))

      },
      selectNode (data) {
        this.$nextTick(() => {
          this.$refs['tree'].setCurrentKey(data.id)
        })
        this.$refs['select'].visible = false
        this.currentLabel = data.text
      },
      clearData () {
        this.$emit('input', undefined)
      }
    },
    mounted () {
    }
  }
</script>
<style>
    .dropdown__tree {
        height: auto;
        padding: 0;
    }

    .dropdown__tree.selected.hover {
        background-color: #fff;
    }

    .dropdown__tree.selected {
        color: #48576a;
    }

    .el-tree {
        border: none;
    }
</style>
