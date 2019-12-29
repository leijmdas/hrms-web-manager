<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item>
          <div slot="label">
            <el-select v-model="dateRangeType" style="width:120px" class="formitem-label">
              <el-option value="orderTime" label="订单时间"></el-option>

              <el-option value="createOn" label="记录时间"></el-option>
            </el-select>
          </div>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="物业">
          <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
        </el-form-item>
        <el-form-item label="停车场">
          <park-select v-model="page.query.param.parkId" :merchantId="page.query.param.merchantId" :clearable="true"></park-select>
        </el-form-item>
        <el-form-item label="用户名">
            <user-select v-model.number="page.query.param.userId" :clearable="true"></user-select>
        </el-form-item>
        <el-form-item label="车牌号" >
          <el-input v-model="page.query.param.carNum" style="width:120px" :clearable="true"></el-input>
        </el-form-item>
         <el-form-item label="订单号" >
          <el-input v-model="page.query.param.orderNo" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" >
          <el-select v-model="page.query.param.status" :clearable="true">
            <el-option v-for="item in $dict.store.PARKING_ORDER_STATUS" :key="item[0]" :value="item[0]" :label="item[1]">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button type="success" @click="exportRecords">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" class="panel-main" :table-minheight="450">
      <el-table-column prop="code" label="停车场"  width="140">
        <template slot-scope="{row}">{{row.parkInfo.name}}</template>
      </el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="140"></el-table-column>
      <el-table-column prop="orderTime" label="订单时间" width="140"></el-table-column>
      <el-table-column prop="username" label="用户名" width="120">
          <template slot-scope="{row}">{{(row.userInfo||{}).username}}</template>
      </el-table-column>
      <el-table-column prop="carNum" label="车牌号" width="80"></el-table-column>
      <el-table-column  label="地端流水号" width="140">
        <template slot-scope="{row}">{{row.accessInfo.clientSn}}</template>
      </el-table-column>
      <el-table-column prop="billStarton" label="计费起始时间" width="140"></el-table-column>
      <el-table-column prop="billEndon" label="计费结束时间" width="140"></el-table-column>

      <el-table-column  label="入场时间" width="140">
        <template slot-scope="{row}">{{row.accessInfo.entryOn}}</template>
      </el-table-column>
      <el-table-column  label="出场时间" width="140">
        <template slot-scope="{row}">{{row.accessInfo.leaveOn}}</template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="应收(元)" width="80"></el-table-column>
      <el-table-column prop="discountAmount" label="优惠(元)" width="80"></el-table-column>
      <el-table-column prop="amount" label="实收(元)" width="80"></el-table-column>
      <el-table-column prop="refundAmount" label="是否退款" width="100">
        <template slot-scope="{row}">{{!!row.refundAmount ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column prop="refundAmount" label="退款金额（元）" width="120"></el-table-column>
      <el-table-column label="合计(元)" width="80">
        <template slot-scope="{row}">{{(row.totalAmount*100 - row.discountAmount*100 - row.refundAmount*100)/100}}</template>
      </el-table-column>
      <el-table-column prop="lastPayedOn" width="80" label="订单状态">
        <template slot-scope="{row}">{{$dict.getText(row.status,$dict.store.PARKING_ORDER_STATUS)}}</template>
      </el-table-column>
      <el-table-column prop="payWay" label="支付方式" width="100">
        <template slot-scope="{row}">{{$dict.getText(row.payWay,$dict.store.PAYWAY)}}</template>
      </el-table-column>
      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">{{row.createOn}}</template>
      </el-table-column>
    </v-table>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import ParkSelect from "@/components/widgets/ParkSelect"
import UserSelect from '@/components/widgets/UserSelect.vue';
export default {
  components:{MerchantSelect,ParkSelect,UserSelect},
  data() {
    return {
      formStatus: 1,

      dateRange: [],

      dateRangeType: "createOn",

      page: {
        query: {
          orderBys: "id|desc",

          param: {merchantId:null},

          dateRanges: {}
        },

        getData: this.$api.ipark.ParkingOrderService.query
      }
    }
  },

  computed: {},

  methods: {
    create() {
      this.formStatus = 1;

      this.$refs.formPanel.init({});
    },

    edit(row) {
      this.formStatus = 2;

      this.$refs.formPanel.setValues(row);
    },

    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        fetch.base.Brand.delete(row.id).then(rsp => {
          this.search();

          this.$message({
            type: "success",

            message: "删除成功!"
          });
        });
      });
    },

    init(options = {}) {
      this.search();
    },
    getSearchParams(){
      this.page.query.dateRanges = {};
      if (this.dateRangeType != null && this.dateRange&&this.dateRange.length > 0) {

        this.page.query.dateRanges[this.dateRangeType] = {
          startDate: this.dateRange[0],

          endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
        };
      }
      return this.page.query;
    },
    search() {
      this.getSearchParams();

      this.$refs.table.load();
    },
    exportRecords(){
      let params = this.getSearchParams();
      this.$api.ipark.ParkingOrderService.export(params);
    }
  },

  created() {},

  mounted() {
    this.$on("init", this.init);
  }
};
</script>
