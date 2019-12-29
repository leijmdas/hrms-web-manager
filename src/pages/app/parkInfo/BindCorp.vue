<template>
  <div>
    <el-alert title="停车场 " type="success" :closable="false" >
      {{parkInfo.name}}[{{parkInfo.code}}]
    </el-alert>
    <div style="height:20px"></div>
    <el-form :rules="rules" ref="form" :model="entity" label-width="100px">

      <el-form-item label="所属企业" prop="corpId1">
        <corp-select v-model="entity.corpId1"></corp-select>
      </el-form-item>
      <el-form-item label="物业" prop="corpId2">
        <corp-select v-model="entity.corpId2"></corp-select>
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
import CorpSelect from "@/components/widgets/CorpSelect.vue";
const defaultEntity = {
  corpId2:null,
  corpId1:null,
};
export default {
  components: { CorpSelect },
  data() {
    return {
      parkInfo: {},
      entity: _.cloneDeep(defaultEntity),
      rules: {
        corpId1: [
          {
           type: "number",
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        corpId2: [
          {
            type: "number",
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = []
          params.push({
            relationType:1,
            corpId:this.entity.corpId1,
          })
          params.push({
            relationType:2,
            corpId:this.entity.corpId2,
          })
          this.$api.ipark.ParkInfoService.bindCorp(this.parkInfo.id,params).then(rsp => {
            this.$emit("saved", rsp);
          });
        }
      });
    },
    init(options = {}) {
      this.entity = {};

      this.parkInfo = options.parkInfo;
      let corpRelations = this.parkInfo.corpRelations||[]
      for(let i=0;i<corpRelations.length;i++){
        let r = corpRelations[i];
        if(r.relationType == 1){
          this.entity.corpId1 = r.corpId;
        } else {
          this.entity.corpId2 = r.corpId;
        }
      }
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>