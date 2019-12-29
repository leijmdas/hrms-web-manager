<template>
  <div>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="批次号" prop="username" :rules="[{ required: true}]">
        <el-input v-model="entity.username"></el-input>
      </el-form-item> 
      <el-form-item label="商家类型" prop="username" :rules="[{ required: true}]">
        <el-input v-model="entity.username"></el-input>
      </el-form-item>
      <el-form-item label="商家名称" prop="username" :rules="[{ required: true}]">
        <el-input v-model="entity.username"></el-input>
      </el-form-item>
      <el-form-item label="邀请码数量" prop="username" :rules="[{ required: true}]">
        <el-input v-model="entity.username"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="username">
        <el-input v-model="entity.username"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="less" scoped>
.el-upload-dragger {
  img {
    width: 300px;
    height: 300px;
  }
}
</style>

<script>
const defaultEntity = {
  id: null,
  code: "",
  name: "",
  
  status: 1,
  remark: ""
};
export default {
   props:{
    disables:Boolean,
    default:false
  },
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      types: [],
      rules: {
        
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 128,
            message: "长度在 1 到 128 个字符",
            trigger: "blur"
          }
        ],
        status: [
          {
            type: "number",
            required: true,
            message: "请选择状态",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs["form"].validate((valid, err) => {
        if (valid) {
          this.$api.ipark.UserInfoService.save(this.entity).then(rsp => {
            this.$emit("saved", rsp);
          });
        }
      });
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
    init(options) {
      this.resetForm();
      if (options.id) {
        //loadData
        this.$api.ipark.UserInfoService.get(options.id).then(r => {
          this.entity = r;
        });
      }else{
        this.entity = {}
      }
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>