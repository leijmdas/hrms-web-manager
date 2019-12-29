<!--邀请码管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="邀请码">
              <!--<user-select v-model="page.query.param.userId" :clearable="true"></user-select>-->
            <el-input v-model="page.query.param.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="邀请人">
          <el-input v-model="page.query.param.mobileNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="邀请渠道" prop="userGradeId" >
          <el-select v-model="page.query.param.testFlag" clearable>
                <el-option v-for="item in $dict.store.TESTFLAG" :key="item[0]" :value="item[0]"
                            :label="item[1]"></el-option>
            </el-select>
        </el-form-item>
         <el-form-item  label="类型" prop="testFlag">
            <el-select v-model="page.query.param.testFlag" clearable>
                <el-option v-for="item in $dict.store.TESTFLAG" :key="item[0]" :value="item[0]"
                            :label="item[1]"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
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
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
            <el-button  @click="page.query.param = {}; dateRange=[]; search();" >取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
      <el-table-column prop="seq"  label="序号" width="50">
        <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
      </el-table-column>
      <el-table-column prop="username"  label="邀请码"></el-table-column>
      <el-table-column prop="username"  label="邀请码最大次数"></el-table-column>
      <el-table-column prop="username"  label="邀请渠道"></el-table-column>
      <el-table-column prop="username"  label="类型"></el-table-column>
      <el-table-column prop="username"  label="邀请人"></el-table-column>
      <el-table-column prop="username"  label="已邀请人数"></el-table-column>
      <el-table-column prop="username"  label="注册时间"></el-table-column>
      <!-- 
      <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="{row}">
              {{$dict.getText(row.status,$dict.store.STATUSS)}}
          </template>
      </el-table-column>
      <el-table-column prop="carNumber" label="车牌号" width="320">
        <template slot-scope="{row}">{{(row.carownerInfo||{}).carNumber}}</template>
      </el-table-column>
       -->
       <el-table-column  label="活动详情" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="查看明细" @click="detail(scope.row)">
            <!-- <i class="el-icon-share"></i> -->查看明细
          </el-button>
        </template>
      </el-table-column>
    </v-table>
    <v-dialog title="明细"  ref="formDiag">
      <form-panel></form-panel>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import FormPanel from "./Form";
export default {
  components: {FormPanel},
  data() {
    return {
      formStatus: 1,
      qrCode:{},
      titles:"",
      dateRange: [],
      page: {
        query: {
          sortBys: "id|asc",
          param: { isDeleted: false }
        },
        getData: this.$api.ipark.UserInfoService.findCarInfo
      },
      shares:true,
      disable:false
    };
  },
  computed: {},

  methods: {
    detail(row) {
      this.$refs.formDiag.show({row});
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
