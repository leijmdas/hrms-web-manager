<template>

<el-form :model="entity" status-icon :rules="rules" ref="form" label-width="100px" >
  <el-form-item label="旧密码" prop="oldPass">
    <el-input type="password" v-model="entity.oldPass"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="newPass">
    <el-input type="password" v-model="entity.newPass" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="entity.checkPass" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item >
  <el-button type="primary" @click="submit">确 定</el-button>
  </el-form-item>
</el-form>
    
</template>

<script>
import { bus, auth,fetch } from "@/utils";
  export default {
    data() {
      
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.entity.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.entity.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        entity: {
          pass: '',
          checkPass: '',
          oldPass: ''
        },
        rules: {
            oldPass: [
            { required:true, trigger: 'blur' }
          ],
          newPass: [
            { required:true,validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required:true,validator: validatePass2, trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
      submit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$api.sys.User.modifyPwd(this.entity).then(rsp=>{
                this.$emit('saved')
            })
          } 
        });
      }
    }
  }
</script>
