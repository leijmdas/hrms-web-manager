<template>
  <div>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">

      <el-form-item label="停车场" prop="ParkName">
        <el-input :rows="2" type="textarea" v-model="entity.parkName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="商户名称" prop="name">
        <el-input  v-model="entity.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="纳税人识别号">
        <el-input v-model="entity.merchantInvoiceInfoDTO.taxpayerRegistrationNumber"></el-input>
      </el-form-item>
      <el-form-item label="销售方银行" prop="bank">
        <el-input v-model="entity.merchantInvoiceInfoDTO.bank"></el-input>
      </el-form-item>
      <el-form-item label="银行账号" prop="bankAccount">
        <el-input v-model="entity.merchantInvoiceInfoDTO.bankAccount"></el-input>
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
  components: {  },
  data() {
    return {
      entity: {
        merchantInvoiceInfoDTO:{
         
        }
      },
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
          this.$api.ipark.InvoiceService.save(this.entity).then(rsp => {
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
        this.$api.ipark.InvoiceService.get(options.id).then(r => {
          this.entity = r;
          
        });
      }
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>