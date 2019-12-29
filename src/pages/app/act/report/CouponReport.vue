<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">

          <el-form-item label="批次号" prop="batchNo">
              <el-input v-model="page.query.param.batchNo" clearable></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
              <el-input v-model="page.query.param.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="主体类型" prop="subjectType">
              <el-select v-model="page.query.param.subjectType" @change="page.query.param.subjectId = undefined" clearable>
                  <el-option v-for="item in $dict.store.ACCOUNT_SUBJECT_TYPE" :key="item[0]" :value="item[0]"
                             :label="item[1]"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="所属分公司" prop="merchantId" v-if="page.query.param.subjectType == 1">
              <branch-company-select v-model="page.query.param.subjectId" clearable></branch-company-select>
          </el-form-item>
          <el-form-item label="所属商户" prop="merchantId" v-if="page.query.param.subjectType == 2">
              <merchant-select v-model="page.query.param.subjectId" clearable></merchant-select>
          </el-form-item>
          <!--<el-form-item label="状态" prop="status">-->
              <!--<el-select :clearable="true" v-model="page.query.param.status" style="width:100px">-->
                  <!--<el-option v-for="item in $dict.store.PROMOTION_STATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>-->
              <!--</el-select>-->
          <!--</el-form-item>-->


        <!--<el-form-item>-->
          <!--<div slot="label">-->
            <!--<el-select v-model="dateRangeType" style="width:120px" class="formitem-label">-->
              <!--<el-option value="activeOn" label="激活时间"></el-option>-->

              <!--<el-option value="useOn" label="使用时间"></el-option>-->

              <!--<el-option value="createOn" label="记录时间"></el-option>-->
            <!--</el-select>-->
          <!--</div>-->

          <!--<el-date-picker-->
            <!--v-model="dateRange"-->
            <!--type="daterange"-->
            <!--range-separator="至"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--value-format="yyyy-MM-dd HH:mm:ss"-->
          <!--&gt;</el-date-picker>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="统计维度">-->
          <!--<el-checkbox-group v-model="page.query.dimensions" @change="search">-->
            <!--<el-checkbox v-for="item in dimensionOptions" :key="item[1]" :label="item[1]" >{{item[0]}}</el-checkbox>-->

          <!--</el-checkbox-group>-->
        <!--</el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
        </el-form-item>
      </el-form>
    </div>



    <v-table ref="table" :page="page" :table-minheight="450" :page-size="-1">

        <el-table-column prop="batchNo" label="批次号" width="120"></el-table-column>

        <el-table-column prop="promotionName" label="优惠券名称" show-overflow-tooltip></el-table-column>

        <el-table-column prop="totalNum" label="总量" width="80"></el-table-column>

        <el-table-column prop="activeNum" label="激活量" width="80"></el-table-column>

        <el-table-column prop="useNum" label="使用量" width="80"></el-table-column>

        <el-table-column label="优惠金额" width="120">
            <template slot-scope="{row}">
                {{(row.promotionInfo || {}).discountValue}}
            </template>
        </el-table-column>

        <el-table-column prop="subjectType" label="主体类型" width="120">
            <template slot-scope="{row}">
                {{$dict.getText(row.subjectType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
            </template>
        </el-table-column>
        <el-table-column prop="name" label="主体名称" width="200">
            <template slot-scope="{row}">
                {{([,row.branchCompany, row.merchantInfo][row.subjectType]||{name:'-'}).name}}
            </template>
        </el-table-column>

        <el-table-column width="100" label="操作" :fixed="'right'">
            <template slot-scope="scope">
                <el-button type="text" @click="detail(scope.row)">查看详情</el-button>
            </template>
        </el-table-column>



      <!--<el-table-column prop="username" label="优惠券" >-->
        <!--<template slot-scope="{row}">{{row.promotionName}}</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column prop="username" label="派发渠道" v-if="hasDimension('dispatchChannelId')">-->
        <!--<template slot-scope="{row}">{{row.dispatchChannelName}}</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column prop="username" label="激活日期" width="150" v-if="hasDimension('activeOn')">-->
        <!--<template slot-scope="{row}">{{row.activeOn}}</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column prop="username" label="使用日期" width="150" v-if="hasDimension('useOn')">-->
        <!--<template slot-scope="{row}">{{row.useOn}}</template>-->
      <!--</el-table-column>-->



    </v-table>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import { fetch } from "@/utils";
import MerchantSelect from '@/components/widgets/MerchantSelect.vue';
import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
export default {
    components: {MerchantSelect, BranchCompanySelect},
  data() {
    return {
      formStatus: 1,
      dimensionOptions: [['激活日期','activeOn'],['使用日期','useOn'],['派发渠道','dispatchChannelId']],
      dateRangeType: "activeOn",

      dateRange: [],
      page: {
        query: {
          dimensions:[],
          param: {}
        },

        getData: this.$api.ipark.ReportService.findCouponReport
      }
    };
  },

  computed: {},

  methods: {
    hasDimension(d){
        return this.page.query.dimensions.filter(opt=>opt==d).length>0;
    },
    init(options = {}) {
      this.search();
    },
      detail(row) {
        console.log(row)
      },
    search() {
      this.page.query.param = {};

      // if (this.dateRangeType != null && this.dateRange&&this.dateRange.length>0) {
      //   this.page.query.params[this.dateRangeType] = {
      //     startDate: this.dateRange[0],
      //
      //     endDate: this.dateRange ? this.dateRange[1] : null
      //   };
      // }

      this.$refs.table.load();
    }
  },

  created() {},

  mounted() {
    this.$on("init", this.init);
  }
};
</script>
