<template>
  <div>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">

       <el-form-item v-if="entity.id!=null" label="id" prop="id" :rules="[{ required: true}]">
        <el-input :disabled="true" v-model="entity.id" ></el-input>
      </el-form-item>
      <el-form-item label="组名" prop="groupName" >
        <el-input :disabled="disables" v-model="entity.groupName"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input :disabled="disables" type="textarea" v-model="entity.remark"></el-input>
      </el-form-item>
      <!-- <el-form-item label="创建人" prop="createBy">
        <el-input :disabled="disables" type="textarea" v-model="entity.createBy"></el-input>
      </el-form-item> -->
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
// import MerchantSelect from '@/components/widgets/MerchantSelect'
const defaultEntity = {
  id: null,
  code: "",
  name: "",
  
  status: 1,
  remark: ""
};
export default {
  // components: {MerchantSelect  },
   props:{
    disables:Boolean,
    default:false
  },
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      types: [],
      rules: {
        
        groupName: [
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
          this.$api.sys.SysGroupJob.save(this.entity).then(rsp => {
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
        this.$api.sys.SysGroupJob.get(options.id).then(r => {
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