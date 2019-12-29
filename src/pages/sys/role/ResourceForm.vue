<template>
    <div class="resource-form">
      <el-form ref="form" label-width="80px" v-loading="showLoading">
        <fieldset v-for="(srg, index) in srgs">
          <legend>{{srg.groupName}}</legend>
          <ul class="menu-ul">
            <li v-for="sr in srg.sysResources">
              <el-alert title="" type="info" :closable="false">
                <el-checkbox v-model="values" :label="sr.id" @change="handleCheckAllChange(sr)">{{sr.resName}}</el-checkbox>
              </el-alert>
              <div v-if="!!sr.nsrg" class="nsrg-sr">
                <el-checkbox-group v-model="values" @change="handleCheckedCitiesChange(sr)">
                  <el-checkbox v-for="item in sr.nsrg.sysResources" :label="item.id" :key="item.id" :disabled="!item.status">{{item.resName}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
          </ul>
        </fieldset>
        <fieldset v-if="!!nsrgs.length">
          <legend>其他按钮</legend>
          <div v-for="nsrg in nsrgs" class="nsrg-sr">
            <el-checkbox-group v-model="values">
              <el-checkbox v-for="item in nsrg.sysResources" :label="item.id" :key="item.id" :disabled="!item.status">{{item.resName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </fieldset>
      </el-form>
    </div>
</template>
<style rel="stylesheet/less" lang="less">
  .resource-form .el-checkbox-group .el-checkbox {
    margin-left: 0;
    margin-right: 5%;
    width: 20%;
  }
  .resource-form .nsrg-sr {
    padding: 10px 0 0 24px;
  }
  .resource-form .menu-ul li {
    border: 1px solid gainsboro;
    margin: 3px 0;
  }
</style>

<script type="text/ecmascript-6">
  import { fetch } from "@/utils";

  const defaultEntity = {
  }

  export default {
    components: {},
    data () {
      return {
        showLoading: false,
        entity: {},
        srgs: [],
        nsrgs: [],
        values: []
      }
    },
    methods: {
      handleCheckAllChange (sr) {
        if (!sr.nsrg) return
        let x = sr.id, y = (sr.nsrg.sysResources || []).map(sr => sr.id)
        let hasX = this.values.includes(x)
        let hasY = this.values.some(r => y.includes(r))
        !hasX && hasY && y.forEach(n => this.values.includes(n) && this.values.splice(this.values.indexOf(n), 1))
      },
      handleCheckedCitiesChange (sr) {
        let x = sr.id, y = (sr.nsrg.sysResources || []).map(sr => sr.id)
        let hasX = this.values.includes(x)
        let hasY = this.values.some(r => y.includes(r))
        !hasX && hasY && this.values.push(x)
      },
      submit (callback) {
        // this.$refs['form'].validate(valid => {
        //   if (valid) {
            // if (this.entity.id) {
        this.$api.sys.Role.assignRoleResources(this.entity.id, this.values).then(callback)
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
        this.srgs = []
        this.nsrgs = []
        this.values = []
      },
      init(options){
        this.resetForm()
        if (options.id) {
          this.entity.id = options.id
          this.showLoading = true
          let srgLoading = true, valueLoading =true
          this.$api.sys.Resource.queryGroupAndResources().then(rsp => {
            // 所有菜单分组
            let srgs = rsp.filter(srg => srg.groupType == 1)
            // 所有按钮分组
            let nsrgs = rsp.filter(srg => srg.groupType == 2)
            srgs.forEach(srg => {
                srg.sysResources.forEach(nsr => {
                  // 菜单资源对应的按钮分组
                  let tmp = nsrgs.filter(nsrg => nsrg.groupName == nsr.resCode)
                  // 资源下最多有一个按钮分组
                  if (tmp.length) {
                    nsr.nsrg = tmp[0]
                    nsrgs.splice(nsrgs.indexOf(tmp[0]), 1)
                  }
                })
            })
            this.srgs = srgs
            this.nsrgs = nsrgs
            srgLoading = false
            this.showLoading = srgLoading || valueLoading
          })
          this.$api.sys.Role.findResourceIds(options.id).then(rsp => {
            this.values = rsp
            valueLoading = false
            this.showLoading = srgLoading || valueLoading
          })
        }
      }
    }
  }
</script>
