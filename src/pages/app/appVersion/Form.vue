<template>
  <div>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
      
      <el-form-item label="版本编号" prop="buildId" :rules="[{ required: true}]">
        <el-input :disabled="disables" v-model="entity.buildId"></el-input>
      </el-form-item>
      <el-form-item label="版本名称" prop="versionName" :rules="[{ required: true}]">
        <el-input :disabled="disables" v-model="entity.versionName"></el-input>
      </el-form-item>
      <el-form-item label="版本介绍" prop="introduce" :rules="[{ required: true}]">
        <el-input :disabled="disables" v-model="entity.introduce"></el-input>
      </el-form-item>
      <el-form-item label="app简介链接" prop="appUrl" :rules="[{ required: true}]">
        <el-input :disabled="disables" v-model="entity.appUrl"></el-input>
      </el-form-item>
      <el-form-item label="app下载地址" prop="downUrl" :rules="[{ required: true}]">
        <el-input :disabled="disables" v-model="entity.downUrl"></el-input>
      </el-form-item>

     <el-form-item  label="平台" prop="platform" 
                    :rules="[{ required: true,message:'不能为空'}]">
          <el-select :disabled="disables" v-model="entity.platform">
              <el-option v-for="item in $dict.store.PLATFORM" :key="item[0]" :value="item[0]"
                          :label="item[1]"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item  label="是否强制升级" prop="isForce" 
                    :rules="[{ required: true,message:'不能为空'}]">
          <el-select :disabled="disables" v-model="entity.isForce">
              <el-option v-for="item in $dict.store.ISFORCE" :key="item[0]" :value="item[0]"
                          :label="item[1]"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item  label="类型" prop="type" 
                    :rules="[{ required: true,message:'不能为空'}]">
          <el-select :disabled="disables" v-model="entity.type">
              <el-option v-for="item in $dict.store.APPVERSION" :key="item[0]" :value="item[0]"
                          :label="item[1]"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="api版本" prop="apiVersion">
        <el-input :disabled="disables" v-model="entity.apiVersion"></el-input>
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
const defaultEntity = {
  id: null,
  code: '',
  name: '',
  status: 1,
  apiVersion: ''
};
export default {
  components: {},
   props: {
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
          this.$api.ipark.AppVersionService.save(this.entity).then(rsp => {
            this.$emit("saved", rsp);
          });
        }
      });
    },
    resetForm() {
      this.$refs['form'].resetFields();
    },
    init(options) {
      this.resetForm();
      if (options.id) {
        //loadData
        this.$api.ipark.AppVersionService.get(options.id).then(r => {
          this.entity = r;
        });
      } else {
        this.entity = _.cloneDeep(defaultEntity);
      }
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>
