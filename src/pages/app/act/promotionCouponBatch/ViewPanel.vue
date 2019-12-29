<template>
  <div>
    <form-panel ref="form" v-display="true"></form-panel>
    <coupon-panel ref="couponPanel"></coupon-panel>
  </div>

</template>
<style lang="less" >

</style>

<script>
import FormPanel from './Form';
import CouponPanel from '../promotionCoupon/Manage';

export default {
  components: { FormPanel,CouponPanel},
  data() {
    return {
    };
  },
  methods: {
    init(options={}){
       this.$refs.form.$emit('init',{id:options.batch.id});
       this.$refs.couponPanel.$emit('init',{query:{param:{batchNo:options.batch.batchNo}}})
    },

  },
  mounted() {
    this.$on("init", this.init);
  }
};
</script>
