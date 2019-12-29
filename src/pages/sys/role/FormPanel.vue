<template>
  <fieldset>
    <legend :action-type="entity.id ? 2 : 1">信息编辑</legend>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">

      <el-form-item v-if="!!entity.id" label="编码" prop="roleCode">
        <el-input v-model="entity.roleCode" ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="roleName">
        <el-input v-model="entity.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色类型" prop="type">
        <el-select v-model="entity.type" label="请选择" style="width: 100%;" clearable>
          <el-option v-for="item in $dict.store.ROLE_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
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
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </fieldset>
</template>
<script>

  import {fetch} from '@/utils'

  const defaultEntity = {
    id:undefined,
    realName: undefined,
    telNo: undefined,
    status:1,
    remark:''
  }
  export default {
    components:{},
    data() {
      return {
        entity: _.cloneDeep(defaultEntity),
        types:[],
        rules: {
          roleCode: [
            { required: true, message: '请输入编码', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ],
          roleName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          status:[
            { type: 'number',required: true, message: '请选择状态', trigger: 'change' }
          ]
        }
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
            this.$api.sys.Role.save(this.entity).then((rsp)=>{
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
          //loadData
        }
      }
    }
  }
</script>
