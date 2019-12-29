<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="120px" >
    
      <el-form-item label="选择券种" prop="promotionCode">
        <el-input v-model="(entity.promotionInfo||{}).name" style="width:300px"></el-input>
        <el-button type="text" icon="el-icon-search" @click="showSearchDiag"></el-button>
      </el-form-item>
      

      <el-form-item label="生成数量" prop="genNum">
        <el-input v-model.number="entity.genNum"></el-input>
      </el-form-item>
       <!--<el-form-item label="渠道" prop="dispatchChannelId">
        <promotion-dispatch-channel-select v-model="entity.dispatchChannelId"></promotion-dispatch-channel-select>
      </el-form-item>-->
      
      <v-dialog ref="searchDiag" :appendToBody="true" title="查询活动">
        
        <promotion-info-search @row-dblclick="onItemSelected"></promotion-info-search>
      </v-dialog>
  </el-form>
</template>
<style lang="less" >

</style>

<script>
import PromotionInfoSearch from '../promotionInfo/Search';
const defaultEntity = {
  id: null,
  promotionInfo:null,
  remark: ""
};
export default {
  components: { PromotionInfoSearch },
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      rules: {
        genNum: [
          {
            type: "number",
            required: true,
            message: "生成数量不能为空",
            trigger: "blur"
          }
        ],
        promotionCode: [
          {
            required: true,
            message: "请选择活动",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    onItemSelected(row){
      this.entity.promotionInfo = row;
      this.entity.promotionCode = row.code;
      this.$refs.searchDiag.hide()
    },
    showSearchDiag(){
      this.$refs.searchDiag.show({param:{status:1}});//过滤已上线
    },
    init(options={}){

    },
    submitForm(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = Object.assign({},this.entity);
          
          this.$api.ipark.PromotionInfoService.genCoupons(params).then(r => {
            this.$emit("saved", r);
          });
        }
      });
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>
