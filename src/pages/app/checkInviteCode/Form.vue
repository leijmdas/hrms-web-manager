<template>
  <div>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">  
      <el-form-item label="审核" prop="count">
        <el-radio-group v-model="result">
          <div class="block-radio">
            <el-radio :label="1">
              <span class="title-text">通过</span>
              <el-input v-model="entity.count" placeholder="请输入同意发放的数量"></el-input>
            </el-radio>
          </div>
          <div class="block-radio">
            <el-radio :label="0">
               <span class="title-text">不通过</span><br>
              <el-input type="textarea" v-model="entity.count" placeholder="审核意见"></el-input>
            </el-radio>
          </div>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="less" scoped>
  .title-text{
    display: inline-block;
    margin-bottom: 20px
  }
</style>

<script>
const defaultEntity = {
  id: null,
  code: "",
  name: "",
  count: 1,
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
      result: 1,
      rules: {
        
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