<template>

<el-form :model="entity" ref="form" label-width="100px" class="displayForm">
         <el-form-item label="工号" prop="employeeNo">
         {{entity.employeeNo}}
        </el-form-item>
        <el-form-item label="姓名" >
           {{entity.realName}}
        </el-form-item>
        <el-form-item label="所属部门" prop="orgId">
            {{(entity.sysOrgDTO||{}).orgName}}
        </el-form-item>
        <el-form-item label="联系电话" prop="sysAccount.telNo">
           {{entity.telNo}}
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          {{entity.email}}
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          {{entity.remark}}
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
        entity:{
            sysAccount:{}
        },
      };
    },
    methods: {
      init(options){
          this.userId = options.userId;
          fetch.customer.user.currentUser().then(r=>{
              this.entity = r;
          })
      }
    },
    mounted(){
        this.$on('init',this.init)
    }
  }
</script>
