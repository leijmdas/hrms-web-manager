<template>
  <div>
    <v-toolbar title="数据列表" type="alert">
      <el-button type="primary" plain @click="importData">导出</el-button>
    </v-toolbar>
    <v-table ref="table" :page="page" :table-minheight="250" class="panel-main">
      <el-table-column prop="seq"  label="序号" width="50">
        <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
      </el-table-column>
      <el-table-column prop="username"  label="合作方名称"></el-table-column>
      <el-table-column prop="username"  label="类型"></el-table-column>
      <el-table-column prop="username"  label="邀请码"></el-table-column>
      <el-table-column prop="username"  label="邀请用户"></el-table-column>
      <el-table-column prop="username"  label="注册时间"></el-table-column>
    </v-table>
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
   props:{
    disables:Boolean,
    default:false
  },
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      types: [],
       page: {
        query: {
          sortBys: "id|asc",
          param: { isDeleted: false }
        },
        getData: this.$api.ipark.UserInfoService.findCarInfo
      },
    };
  },
  methods: {
    importData() {
      let params = this.getSearchParams();
      console.log(params);
      this.$api.ipark.BookingOrderService.export(params);
    },
    submitForm() {
      this.$refs["form"].validate((valid, err) => {
        if (valid) {
          this.$api.ipark.UserInfoService.save(this.entity).then(rsp => {
            this.$emit("saved", rsp);
          });
        }
      });
    },
    resetForm() {
      // this.$refs["form"].resetFields();
    },
    init(options) {
      this.resetForm();
      if (options.id) {
        //loadData
        this.$api.ipark.UserInfoService.get(options.id).then(r => {
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