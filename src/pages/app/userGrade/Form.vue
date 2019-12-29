<template>
  <div>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
      
      <el-form-item label="编码" prop="code" :rules="[{ required: true}]">
        <el-input :disabled="disables" v-model="entity.code"></el-input>
      </el-form-item>
      <el-form-item label="等级名称" prop="name">
        <el-input :disabled="disables" v-model="entity.name"></el-input>
      </el-form-item>
      <el-form-item label="预约数" prop="bookingNumber" :rules="[{ required: true}]">
        <el-input :disabled="disables" v-model="entity.bookingNumber"></el-input>
      </el-form-item>
      <el-form-item label="代预约数" prop="repplaceBookingNumber" :rules="[{ required: true}]">
        <el-input :disabled="disables" v-model="entity.repplaceBookingNumber"></el-input>
      </el-form-item>
      <el-form-item label="邀请码数" prop="repplaceBookingNumber" :rules="[{ required: true}]">
        <el-input :disabled="disables" v-model="entity.repplaceBookingNumber"></el-input>
      </el-form-item>
      <!--<el-form-item label="开始时间" prop=""  :rules="[{ required: true}]">             
          <el-date-picker  
          :disabled="disables"               
            v-model="entity.startDate"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>    
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
import MerchantSelect from '@/components/widgets/MerchantSelect'
const defaultEntity = {
  id: null,
  code: "",
  name: "",
  
  status: 1,
  remark: ""
};
export default {
  components: {MerchantSelect  },
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
          this.$api.ipark.UserGradeService.save(this.entity).then(rsp => {
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
      if (options.id || options.id === 0) {
        //loadData
        this.$api.ipark.UserGradeService.get(options.id).then(r => {
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