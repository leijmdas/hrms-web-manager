<!--优惠查询-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <!-- <el-form-item label="商户">
          <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
        </el-form-item> -->
        <el-form-item label="名称">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>

        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450" @dataloaded="onDataloaded" @row-dblclick="onRowDbclick">
      
      <el-table-column prop="code" label="编码" width="120">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200">
      </el-table-column>
      <!-- <el-table-column prop="type" label="商户" width="150">
        <template slot-scope="{row}">
          {{(row.merchantInfo||{name:'-'}).name}}
        </template>
      </el-table-column> -->
      <el-table-column prop="startOn" label="开始时间" width="150">
      </el-table-column>
      <el-table-column prop="endOn" label="结束时间" width="150">
      </el-table-column>
      <el-table-column prop="effectDays" label="有效期" width="80">
        <template slot-scope="{row}">
          {{row.effectTimes}} {{$dict.getText(row.effectTimeUnit,$dict.store.PROMOTION_EFFECT_TIMEUNIT)}}
        </template>
      </el-table-column>
      <el-table-column prop="visibility" label="可见性" width="80">
        <template slot-scope="{row}">
          {{$dict.getText(row.visibility,$dict.store.PROMOTION_VISIBILITY)}}
        </template>
      </el-table-column>
      <el-table-column prop="tip" label="优惠提示">
      </el-table-column>
       <el-table-column prop="tip" label="总量/发放/使用" width="100">
        <template slot-scope="{row}">
          {{row.limitTotalNum?row.limitTotalNum:'不限'}} / {{ (summaryMap[row.id]||{instanceNum:0}).instanceNum}} /  {{ (summaryMap[row.id]||{usedNum:0}).usedNum}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="{row}">
          {{$dict.getText(row.status,$dict.store.PROMOTION_STATUS)}}
        </template>
      </el-table-column>
      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">
          {{row.createOn}}
        </template>
      </el-table-column>
      
    </v-table>
    
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import FormPanel from "./Form";

export default {
  components: { FormPanel,MerchantSelect },
  data() {
    return {
      formStatus: 1,
      orderDateRange: [],
      summaryMap:{},
      page: {
        query: {
          sortBys:'id|desc',
          param: {
            isDeleted:false
          }
        },
        getData: this.$api.ipark.PromotionInfoService.query
      }
    };
  },
  computed: {},

  methods: {
    onRowDbclick(row){
      this.$emit('row-dblclick',row);
    },
    onDataloaded(rsp){
      if(rsp.total<1) return ;
      let promotionIds = rsp.data.map(r=>r.id);
      this.$api.ipark.PromotionInfoService.summaryGroupByPromotionId(promotionIds).then(rs=>{
        rs.forEach(r=>{
          this.summaryMap[r.promotionId]=r;
        })
      })
    },
    
    init(options = {}) {
      Object.assign(this.page.query.param,options.param);
      this.search();
    },
    search() {
      this.$refs.table.load();
    }
  },
  created() {},
  mounted() {
    this.$on("init", this.init);
  }
};
</script>
