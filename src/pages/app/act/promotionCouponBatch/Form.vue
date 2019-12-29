<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="120px" >

      <el-form-item label="选择优惠" prop="promotionId">
         <promotion-select v-model="entity.promotionId" @change="resetProps" :status="status" style="width:80%"></promotion-select>
      </el-form-item>
      <!--<el-form-item label="渠道" prop="dispatchChannelId">
        <promotion-dispatch-channel-select v-model="entity.dispatchChannelId" style="width:80%"></promotion-dispatch-channel-select>
      </el-form-item>-->
      <el-form-item label="数量" prop="expectNum">
          <el-input-number v-model="entity.expectNum" :min="1" :max="limitNum" label="描述文字"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="entity.remark"></el-input>
      </el-form-item>
  </el-form>
</template>
<style lang="less" >

</style>

<script>
import PromotionInfoSearch from '../promotionInfo/Search';
import PromotionSelect from '@/components/widgets/PromotionSelect';
const defaultEntity = {
  id: null,
  promotionInfo:null,
  remark: ""
};
export default {
  components: { PromotionInfoSearch,PromotionSelect },
  data() {
    return {
        status: 1,
      entity: _.cloneDeep(defaultEntity),
      rules: {
        expectNum: [
          {
            type: "number",
            required: true,
            message: "生成数量不能为空",
            trigger: "blur"
          }
        ],
        promotionId: [
          {
            type: "number",
            required: true,
            message: "请选择活动",
            trigger: "change"
          }
        ]
      },
        limitNum: 150 // 限制优惠券数量 （根据上一个下拉框选择的数据来获取）
    };
  },
  methods: {
    resetForm() {
      this.$refs["form"].resetFields();
      this.entity = _.cloneDeep(defaultEntity);
    },
    init(options={}){
        this.resetForm();
      if (options.id) {
        //loadData
        this.$api.ipark.PromotionCouponBatchService.get(options.id).then(r => {
          this.entity = r;
        });
      }
    },
    submitForm(){
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = Object.assign({},this.entity);
          this.$api.ipark.PromotionCouponBatchService.save(params).then(r => {
            this.$emit("saved", r);
          });
        }
      });
    },
      resetProps(val, data) {
          _.forEach(data, (i) => {
              if (i.id == val) {
                  this.limitNum = i.limitTotalNum > 0 ? i.limitTotalNum : Number.MAX_VALUE
              }
          })
      }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>
