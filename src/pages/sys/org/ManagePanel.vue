<!--客户资料管理-->
<template>
  <div>
    <el-row>
      <el-col :span="10" >
        <fieldset>
          <legend>组织结构树</legend>
        <el-tree ref="tree" :data="data" :props="defaultProps" node-key="id" highlight-current
                 :default-expanded-keys="[currentId]" @node-click="handleNodeClick" style="min-height:300px">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text"  icon="el-icon-circle-plus-outline" @click.stop="append(data)">
              </el-button>
              <el-button type="text"  icon="el-icon-delete" style="color:red" @click.stop="remove(node, data)">
              </el-button>
            </span>
          </span>
        </el-tree>
        </fieldset>
      </el-col>
      <el-col :span="14" >
        <form-panel ref="formPanel"></form-panel>
      </el-col>
    </el-row>
  </div>

</template>
<style rel="stylesheet/less" scoped lang="less">
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
<script>
import FormPanel from "./FormPanel.vue"
import {auth, fetch} from '@/utils'

export default {
  components: { FormPanel },
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "text"
      },
      currentId: '',
      corpId: auth.getCurrentCorpId()
    };
  },
  computed: {

  },

  methods: {
    handleNodeClick (data) {
      this.$refs.formPanel.init(data)
    },
    append (data) {
      this.$refs.formPanel.init({pid: data.id})
    },
    remove (node, data) {
      this.$confirm('确定删除此条记录吗？', '提示', {type: 'warning'}).then(() => {
        this.$api.sys.Org.delete(data.id).then(rsp => {
          this.currentId = data.parentId
          this.init()
          this.$refs.formPanel.init({})
        })
      })
    },
    init() {
      this.$api.sys.Org.tree(this.corpId).then(rsp=>{
        this.data = [rsp]
        if (this.currentId) {
          this.$nextTick(() => {
            this.$refs['tree'].setCurrentKey(this.currentId)
          })
        } else {
          this.currentId = rsp ? rsp.id + '' : ''
        }
      })
    }
  },
  created() {},
  mounted() {
    this.init()
    this.$refs.formPanel.$on("saved", data => {
      this.currentId = data.id + ''
      this.init()
    });
  }
};
</script>
