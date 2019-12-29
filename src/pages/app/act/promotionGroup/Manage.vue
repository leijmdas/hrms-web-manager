<template>
    <div>
      <div class="panel panel-default panel-search">
        <el-form :inline="true">
          <el-form-item>
            <div slot="label">
              <el-select v-model="dateRangeType" style="width:120px" class="formitem-label">
                <el-option value="activeOn" label="激活时间"></el-option>
                <el-option value="useOn" label="使用时间"></el-option>
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
          <el-form-item label="业务类型" prop="bizType">
            <el-select v-model="page.query.param.bizType" clearable>
              <el-option v-for="item in $dict.store.BUSINESSTYPE" :key="item[0]" :value="item[0]"
                         :label="item[1]"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="券名称">
            <promotion-select v-model="page.query.param.promotionId" :bizType="page.query.param.bizType" style="width:80%"></promotion-select>
          </el-form-item>
          <el-form-item label="批次号">
            <el-input v-model="page.query.param.batchNo" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form :inline="true" style="height: 40px; padding-top: 10px;padding-left: 20px;">
          <el-form-item>
            <el-radio-group v-model="page.query.groupType" @change="search">
              <el-radio label="1">按月</el-radio>
              <el-radio label="2">按天</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <v-table ref="table" :page="page" :table-minheight="250">
          <el-table-column prop="genOn" label="生成时间" width="150"></el-table-column>
          <el-table-column prop="bizType" label="业务类型" width="120">
            <template slot-scope="{row}">
              {{$dict.getText(row.bizType,$dict.store.BUSINESSTYPE)}}
            </template>
          </el-table-column>
          <el-table-column prop="promotionInfo.code" label="编码" width="120"></el-table-column>
          <el-table-column prop="name" label="券名称" min-width="250" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{row.promotionInfo.name}}
              <span
                style="color:gray"
              >{{row.promotionInfo.tip}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="subjectType" label="主体类型" width="120">
            <template slot-scope="{row}">
              {{$dict.getText(row.subjectType,$dict.store.ACCOUNT_SUBJECT_TYPE)}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="主体名称" width="200">
            <template slot-scope="{row}">
              {{([,(row.promotionInfo||{}).branchCompany, (row.promotionInfo||{}).merchantInfo][row.subjectType]||{name:'-'}).name}}
            </template>
          </el-table-column>
          <el-table-column prop="totalNum" label="总量"></el-table-column>
          <el-table-column prop="activeNum" label="激活数量"></el-table-column>
          <el-table-column prop="useNum" label="使用数量"></el-table-column>
          <el-table-column prop="discountAmount" label="已优惠金额"></el-table-column>
        </v-table>
      </div>
      <div class="detail">
        <el-form :inline="true" style="height: 40px; padding-top: 10px;padding-left: 20px;">
          <el-form-item label="发放详情">
            <el-button type="success" @click="exportExcel">导出</el-button>
          </el-form-item>
        </el-form>
        <v-table ref="detailTable" :page="detailPage" :table-minheight="250">
          <el-table-column prop="status" label="激活状态" width="100">
            <template slot-scope="{row}">
              {{row.activeStatus==0?'未激活':'已激活'}}
            </template>
          </el-table-column>
          <el-table-column prop="sn" label="券号" width="120"></el-table-column>

          <el-table-column prop="name" label="券名称" min-width="250" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{row.promotionInfo.name}}
              <span
                style="color:gray"
              >{{row.promotionInfo.tip}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="promotionInfo.code" label="优惠编码" width="100" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{row.promotionInfo.code}}
            </template>
          </el-table-column>
          <el-table-column prop="activeOn" label="激活时间" width="150"></el-table-column>
          <el-table-column prop="activeType" label="激活方式" width="150"></el-table-column>
          <el-table-column prop="activeKey" label="激活KEY" width="150">
              <template slot-scope="{row}">
                  {{row.activeType== 'USERID'? row.username : row.activeKey}}
              </template>
          </el-table-column>
          <el-table-column prop="useOn" label="使用时间" width="140"></el-table-column>
          <el-table-column prop="status" label="实际优惠金额" width="100">
            <template slot-scope="{row}">{{[,(row.parkingOrder||{}),(row.bookingOrder||{})][row.bizType].discountAmount}}</template>
          </el-table-column>
        </v-table>
      </div>
    </div>
</template>

<script>
  import PromotionSelect from "@/components/widgets/PromotionSelect.vue";

  export default {
    components: {PromotionSelect},

    data() {
      return {
        dateRangeType: "createOn",
        dateRange: [],
        formStatus: 1,
        orderDateRange: [],
        summaryMap: {},
        page: {
          query: {
            orderBys: "id|desc",
            groupType: "1",
            param: {
              bizType: undefined,
              isDeleted: false
            }
          },
          getData: this.$api.ipark.PromotionCouponService.queryGroup
        },

      };
    },
    computed: {
      detailPage() {
        return {query: this.page.query, getData: this.$api.ipark.PromotionCouponService.query}
      }
    },
    methods: {
      init(options = {}) {
        console.log(options);
        Object.assign(this.page.query,options.query);
        this.search();
      },
      preQuery(){
        this.page.query.dateRanges = {};
        if (this.dateRangeType != null && this.dateRange&&this.dateRange.length>0) {

          this.page.query.dateRanges[this.dateRangeType] = {
            startDate: this.dateRange[0],

            endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
          };
        }
      },
      load(reload){
        this.preQuery();
        this.$refs.table.load(reload);
        this.$refs.detailTable.load(reload);
      },
      search() {
        this.load(true);
      },
      exportExcel(){
        this.preQuery();
        this.$api.ipark.PromotionCouponService.export(this.page.query).then(()=>{

        });
      }
    },

    created() {},

    mounted() {
      this.$on("init", this.init);
    }
  };
</script>

<style lang="less">
  .search-condition{
    height: 30px;
    line-height: 30px;
  }
  .condition{
    height: 50px;
    line-height: 50px;
  }
  .title{
    font-size: 20px;
    font-weight: bold;
    color: #606266;
  }
  .detail{
    .el-form-item__label {
      font-weight: bold !important;
    }
  }

</style>
