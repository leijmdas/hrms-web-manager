<template>
<el-form :model="entity" :rules="rules" ref="form" label-width="100px" >
  <el-form-item label="企业编码" prop="corpCode" class="displayField">
    <el-input v-model="entity.corpCode" readonly></el-input>
  </el-form-item>
  <el-form-item label="企业名称" prop="corpName">
    <el-input v-model="entity.corpName"></el-input>
  </el-form-item>
  <el-form-item label="联系人" prop="contactMan">
    <el-input v-model="entity.contactMan"></el-input>
  </el-form-item>
   <el-form-item label="联系电话" prop="contactNo">
    <el-input v-model="entity.contactNo"></el-input>
  </el-form-item>
  <el-form-item label="地址" prop="address">
    <el-input v-model="entity.address"></el-input>
  </el-form-item>
  <el-form-item label="网址" prop="website">
    <el-input v-model="entity.website"></el-input>
  </el-form-item>
  <el-form-item label="备注" prop="remark">
    <el-input type="textarea" v-model="entity.remark"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm" v-keycode="'altS'">保存(S)</el-button>
    <el-button  @click="resetForm" v-keycode="'altR'">重置(R)</el-button>
  </el-form-item>
</el-form>
</template>
<script>
  import {fetch} from '@/utils'

  const defaultEntity = {
    id:null,
    corpCode:null,
    corpName:null,
    status:null,
    contactMan:null,
    contactNo:null,
    address:null,
    website:null,
    remark:''
  }
  export default {
    data() {
      return {
        entity: _.cloneDeep(defaultEntity),
        types:[],
        rules: {
          corpCode: [
            { required: true, message: '请输入编码', trigger: 'blur' },
            { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ],
          corpName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
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
            fetch.sys.Corp.save(this.entity).then((rsp)=>{
              this.$emit('saved',rsp)
            })
          } else {
            this.$message.error('请输入正确数据')
            return false;
          }
        });
      },
      resetForm() {
         this.entity = _.cloneDeep(this.resetEntity)
      },
      init(options){

        this.resetEntity = _.cloneDeep(defaultEntity)
        this.entity = _.cloneDeep(this.resetEntity)

        fetch.sys.Corp.get().then(rsp=>{

          this.entity = rsp
          this.resetEntity = _.cloneDeep(rsp)

        })
      }
    }
  }
</script>
