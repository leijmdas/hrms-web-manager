<template>
  <div>
    <v-toolbar title="计费规则" type="warning">
      <el-button-group>
        <el-button type="primary" plain @click="()=>{$bus.$emit('app:flush')}">刷新</el-button>
        <el-button @click="()=>{$bus.$emit('app:goback')}">返回</el-button>
      </el-button-group>
    </v-toolbar>
    <el-alert title="" v-if="parkInfo!=null">

      <el-form :inline="true" v-display="true">

        <el-form-item label="编码" prop="code">
          <el-input v-model="parkInfo.code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="parkInfo.name"></el-input>
        </el-form-item>
      </el-form>
    </el-alert>
    <el-tabs type="border-card" v-model="currentTab" @tab-click="handleClick">
      <el-tab-pane label="预约" name="first">
        <booking-rule-form ref="bookingRuleForm"></booking-rule-form>
      </el-tab-pane>
      <el-tab-pane label="临停" name="third">
        <parking-rule-form ref="parkingRuleForm"></parking-rule-form>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<style lang="less" >
</style>

<script>
import BookingRuleForm from "./BookingRuleForm";
import ParkingRuleForm from "./ParkingRuleForm";
export default {
  components: { BookingRuleForm,ParkingRuleForm },
  data() {
    return {
      parkInfo: null,
      id: 0,
      currentTab: "first"
    };
  },
  methods: {
    handleClick(tab) {
      let $form = null;
      if (tab.name == "first") {
        $form = this.$refs.bookingRuleForm;
      } else if (tab.name == "second") {
        $form = this.$refs.floorPanel;
      } else if (tab.name == "third") {
        $form = this.$refs.parkingRuleForm;
      }
      this.$emit("tabChange", tab.index || 0);
      $form.$emit("init", { parkId: this.parkId });
    },
    init(options = {}) {
      this.parkId = options.parkId;
      this.$api.ipark.ParkInfoService.get(options.parkId).then(r => {
        this.parkInfo = r;
      });


      this.currentTab = "first";
      this.handleClick({ name: "first" });
    },
    onFormSaved(rsp) {
      this.id = rsp;
      this.$message("保存成功");
    },
    onFormSaved2(rsp) {
      this.$message("保存成功");
    }
  },
  mounted() {
    this.$on("init", this.init);
  }
};
</script> 