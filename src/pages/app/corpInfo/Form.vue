<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
    <el-row>
      <el-col :span="16">
        <el-form-item label="名称" prop="name">
          <el-input v-model="entity.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="entity.type">
            <el-option v-for="item in $dict.store.CORP_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contactor">
          <el-input v-model="entity.contactor"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel">
          <el-input v-model="entity.tel"></el-input>
        </el-form-item>
        <el-form-item label="网址" prop="website">
          <el-input v-model="entity.website"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="entity.email"></el-input>
        </el-form-item>

      </el-col>
      <el-col :span="8">
        <div style="margin:10px"  class="corpLogo">
          <v-image-uploader :form-data="{}" v-model="entity.logo">

          </v-image-uploader>
          <div style="text-align:center">
            企业LOGO
          </div>
        </div>
      </el-col>
    </el-row>
    <el-form-item label="地址" prop="address">
      <el-input v-model="entity.address"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input type="textarea" v-model="entity.remark"></el-input>
    </el-form-item>
  </el-form>
</template>
<style lang="less">
.corpLogo {
  img {
    height: 200px !important;
  }
}
</style>

<script>
const defaultEntity = {
  id: null,
  logo: "",

  status: 1,
  remark: ""
};
export default {
  components: {},
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      types: [],
      rules: {
        code: [
          { required: true, message: "编码不能为空", trigger: "blur" },
          { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "中文名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 128,
            message: "长度在 1 到 128 个字符",
            trigger: "blur"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择类型",
            trigger: "change"
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
    setValues(vals) {
      this.resetEntity = _.cloneDeep(vals);
      this.entity = _.cloneDeep(this.resetEntity);
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$api.ipark.CorpInfoService.save(this.entity).then(rsp => {
            this.$emit("saved", rsp);
          });
        }
      });
    },
    resetForm() {
      this.$refs['form'].resetFields();
      this.entity = _.cloneDeep(this.resetEntity);
    },
    init(options) {
      this.resetEntity = _.cloneDeep(defaultEntity);
      this.resetForm();
      if (options.id) {
        //loadData
        this.$api.ipark.CorpInfoService.get(options.id).then(r=>{
          this.entity = r;
        })
      }
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>