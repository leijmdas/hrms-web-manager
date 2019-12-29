<template>
  <div>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="编码" prop="code">
        <el-input v-model="entity.code" placeholder="不填写则由系统生成"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="entity.name"></el-input>
      </el-form-item>
      <el-form-item label="所属停车场" prop="parkId">
        <el-input v-model.number="entity.parkId">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="entity.status">
          <el-option v-for="item in $dict.store.STATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="entity.remark"></el-input>
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
    selectLocation() {
      this.$refs.mapDiag.show({ address: this.entity.address });
    },
    onLocationClick(l) {
      this.entity.lng = l.lng;
      this.entity.lat = l.lat;
      this.$refs.mapDiag.hide();
    },
    setValues(vals) {
      this.resetEntity = _.cloneDeep(vals);
      this.entity = _.cloneDeep(this.resetEntity);
    },
    submitForm() {
      this.$refs["form"].validate((valid, err) => {
        if (valid) {
          this.$api.ipark.CheckRecordService.save(this.entity).then(rsp => {
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
        this.$api.ipark.CheckRecordService.get(options.id).then(r => {
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
