<template>
  <div>

    <div class="panel panel-default panel-search">
      <el-form :inline="true">

        <el-form-item>
          <div slot="label">
            <el-select v-model="dateRangeType" style="width:120px" class="formitem-label" :clearable="true">

              <el-option value="entryOn" label="进场时间"></el-option>

              <el-option value="leaveOn" label="出场时间"></el-option>


            </el-select>
          </div>

          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>

        <!--<el-form-item label="停车场">
          <el-input v-model="page.query.param.parkInfo.name" :clearable="true"></el-input>
        </el-form-item>-->
        <el-form-item label="停车场">
          <park-select v-model="page.query.param.parkId"  :clearable="true"></park-select>
        </el-form-item>

        <!--<el-form-item label="用户名">
          <el-input v-model="page.query.param.userName" :clearable="true"></el-input>
        </el-form-item>-->
          <el-form-item label="用户名">
              <user-select v-model="page.query.param.userId" :clearable="true"></user-select>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          </el-form-item>
      </el-form>
    </div>

      <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
          <el-table-column prop="sn" width="200" label="流水号"></el-table-column>
          <el-table-column prop="parkName" label="停车场" width="150">
              <template slot-scope="{row}">{{(row.parkInfo||{}).name}}</template>
          </el-table-column>
          <el-table-column prop="userName" label="用户名" width="150"></el-table-column>
          <el-table-column prop="carNum" label="车牌号" width="120"></el-table-column>

          <el-table-column prop="parkingType" label="停车类型">
              <template slot-scope="scope">{{scope.row.parkingType===true?'包月':'临停'}}</template>

          </el-table-column>
          <el-table-column prop="entryOn" label="入场时间" width="150"></el-table-column>
          <el-table-column prop="leaveOn" width="150" label="出场时间"></el-table-column>
          <el-table-column prop="hourMinute" width="150" label="停车时长"></el-table-column>
          <el-table-column prop="amount" width="100" label="结算费用"></el-table-column>
          <el-table-column prop="entryChannel" label="入口通道" width="100"></el-table-column>
          <el-table-column prop="exportChannel" label="出口通道" width="100"></el-table-column>
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
    import ParkSelect from '@/components/widgets/ParkSelect';
    import UserSelect from '@/components/widgets/UserSelect.vue';

    export default {
  components: { ParkSelect,UserSelect },
  data() {
    return {
      formStatus: 1,

      dateRange: [],

      dateRangeType: 'entryOn',
     page: {
        query: {
          sortBys: 'id|desc',
          param: { isDeleted: false,
             parkInfo:{}
          }
        },
        getData: this.$api.ipark.AccessInfoService.queryAccess
      }
    };
  },
  methods: {
    init(options = {}) {

      this.search();

    },
    search() {
      this.page.query.dateRanges = {};
      if (this.dateRangeType != null && this.dateRange && this.dateRange.length > 0) {

        this.page.query.dateRanges[this.dateRangeType] = {
          startDate: this.dateRange[0],

          endDate: this.dateRange.length > 1 ? this.dateRange[1] : null
        };
      }

      this.$refs.table.load();
    }

  },
  mounted() {
    this.$on('init', this.init);
  }
};
</script>
