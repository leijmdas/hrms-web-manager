<!--商家订单-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="商家名称">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="商家类型">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
         <el-form-item label="优惠名称">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
         <el-form-item label="批次号">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
         <el-form-item label="券号">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
         <el-form-item label="消费时间">
           <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dateRange=[]; search()" v-keycode="'ENTER'">查询</el-button>
          
        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450">
      
      <el-table-column prop="name" label="商家名称" width="200">
      </el-table-column>
      <el-table-column prop="type" label="商家类型" width="100">
        <template slot-scope="{row}">
          {{$dict.getText(row.type,$dict.store.CORP_TYPE)}}
        </template>
      </el-table-column>
       <el-table-column prop="email" label="优惠名称">
      </el-table-column>
       <el-table-column prop="email" label="批次号" width="80">
      </el-table-column>
      <el-table-column prop="email" label="券号" width="80">
      </el-table-column>
      <el-table-column prop="contactor" label="消费用户" width="120">
      </el-table-column>
      <el-table-column prop="tel" label="金额" width="80">
      </el-table-column>
      <el-table-column prop="status" label="消费时间" width="140">
      </el-table-column>

      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">
          {{row.createOn}}
        </template>
      </el-table-column>
    </v-table>
    <v-dialog ref="formDiag" title="信息编辑">
      <form-panel @saved="onFormSaved"></form-panel>
      <div slot="footer">
        <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import FormPanel from "./Form";

export default {
  components: { FormPanel },
  data() {
    return {
      formStatus: 1,
      orderDateRange: [],
      dateRange: [],
      page: {
        query: {
          sortBys:'id|desc',
          param: {
            isDeleted:false
          }
        },
        getData: this.$api.ipark.CorpInfoService.query
      },
      tableActions: [
        {   
          name: "编辑",
          handle: this.edit
        },
        {
          name: "删除",
          handle: this.del,
          style: "color:red"
        }
      ]
    };
  },
  computed: {},

  methods: {
    onFormSaved(){
      this.$refs.formDiag.hide();
      this.$nextTick(this.search);
    },
    init(options = {}) {
      this.search();
    },
    search() {
      this.page.query.dateRanges = {};
      if (this.dateRangeType != null && this.dateRange.length > 0) {
          this.page.query.dateRanges[this.dateRangeType] = {
              startDate: this.dateRange[0],
              endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
          };
      }
      this.$refs.table.load();
    }
  },
  created() {},
  mounted() {
    this.$on("init", this.init);
  }
};
</script>
