<template>
    <div class="role-form">
      <el-form ref="form" label-width="80px" v-loading="showLoading">
        <fieldset>
          <legend>{{[, '功能角色', '数据角色'][roleType]}}</legend>
          <el-checkbox-group v-model="values">
            <el-checkbox v-for="item in roles" :label="item.id" :key="item.id" :disabled="!item.status">{{item.roleName}}[{{item.roleCode}}]</el-checkbox>
          </el-checkbox-group>
        </fieldset>
      </el-form>
    </div>
</template>
<style rel="stylesheet/less" lang="less">
  .role-form .el-checkbox-group .el-checkbox {
    margin-left: 0;
    margin-right: 5%;
    width: 45%;
  }
  .role-form .nsrg-sr {
    padding: 10px 0 0 24px;
  }
</style>

<script type="text/ecmascript-6">
  import { auth, fetch } from "@/utils";

  const defaultEntity = {
  }

  export default {
    components: {},
    data () {
      return {
        roleType: 1,
        corpId: auth.getCurrentCorpId(),
        showLoading: false,
        entity: {},
        roles: [],
        values: []
      }
    },
    methods: {
      submit (callback) {
        // this.$refs['form'].validate(valid => {
        //   if (valid) {
            // if (this.entity.id) {
        this.$api.sys.User.assignRoles(this.entity.id, this.roleType, this.values).then(callback)
            // } else {
            //   RoomAreaService.save(this.entity).then(callback)
            // }
        //     console.log(this.resources)
        //   } else {
        //     this.$message.error('请输入正确数据')
        //   }
        //   return valid
        // })
      },
      resetForm() {
        this.$refs['form'].resetFields()
        this.resetEntity = _.cloneDeep(defaultEntity)
        this.entity = _.cloneDeep(this.resetEntity)
        this.roles = []
        this.values = []
      },
      init(roleType, options){
        this.roleType = roleType
        this.resetForm()
        if (options.id) {
          this.entity.id = options.id
          this.showLoading = true
          let roleLoading = true, valueLoading =true
          this.$api.sys.Role.query({param: {corpId: this.corpId, type: roleType}}).then(rsp => {
            this.roles = rsp.data
            roleLoading = false
            this.showLoading = roleLoading || valueLoading
          })
          this.$api.sys.User.findRoleIds(options.id, roleType).then(rsp => {
            this.values = rsp
            valueLoading = false
            this.showLoading = roleLoading || valueLoading
          })
        }
      }
    }
  }
</script>
