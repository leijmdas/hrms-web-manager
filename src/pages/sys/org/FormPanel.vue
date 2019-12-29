<template>
  <fieldset>
    <legend :action-type="entity.id ? 2 : 1">信息编辑</legend>
      <el-form :model="entity" :rules="rules" ref="form" label-width="100px" >
        <el-form-item label="企业名称" prop="corpId" class="displayField">
          <corp-select v-model="entity.corpId" disabled style="width: 100%"></corp-select>
        </el-form-item>
        <el-form-item label="名称" prop="orgName">
          <el-input v-model="entity.orgName"></el-input>
        </el-form-item>
        <el-form-item label="父级组织" prop="pid">
          <org-tree ref="orgTree" v-model="entity.pid" :corp-id="corpId" style="width: 100%;"></org-tree>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="entity.status">
            <el-radio v-for="item in $dict.store.STATUSS" :key="item[0]" :label="item[0]">{{item[1]}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="entity.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" >保存</el-button>
          <el-button  @click="resetForm" >重置</el-button>
        </el-form-item>
      </el-form>
  </fieldset>
</template>
<script>
  import CorpSelect from '../../../components/widgets/CorpSelect'
  import OrgTree from '../../../components/widgets/OrgTree'

  import {auth, fetch} from '@/utils'

  const defaultEntity = {
    id:undefined,
    corpId: auth.getCurrentCorpId(),
    pid:0,
    status:1,
    remark:''
  }
  export default {
    components:{ CorpSelect, OrgTree},
    data() {
      return {
        entity: _.cloneDeep(defaultEntity),
        types:[],
        rules: {
          pid: [
            { required: true, message: '请选择父级机构', trigger: 'change' }
          ],
          orgName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
          ],
          status:[
            { type: 'number',required: true, message: '请选择状态', trigger: 'change' }
          ]
        },
        corpId: auth.getCurrentCorpId()
      };
    },
    methods: {
      setValues(vals){
        this.resetEntity = _.cloneDeep(vals);
        this.entity = _.cloneDeep(this.resetEntity)
      },
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$api.sys.Org.save(this.entity).then((rsp)=>{
              this.$refs.orgTree.refresh()
              this.$emit('saved',rsp)
            })
          } else {
            this.$message.error('请输入正确数据')
            return false;
          }
        });
      },
      resetForm() {
        this.$refs['form'].resetFields()
        this.resetEntity = _.cloneDeep(defaultEntity)
        this.entity = _.cloneDeep(this.resetEntity)
      },
      init(options){
        this.resetForm()
        if(options.id){
          this.$api.sys.Org.get(options.id).then(rsp=>{
            this.entity = rsp
          })
        } else {
          this.entity.pid = options.pid
        }
      }
    }
  }
</script>
