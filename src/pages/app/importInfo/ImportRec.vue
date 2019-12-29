<template>
  <div>

    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input type="hidden" v-model="page.query.param.importRecordId" :clearable="true"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main" :fit="true">
      
      <el-table-column prop="parkPortCode" width="120" label="泊位号" v-if="parkPortCodeboolean">
        <template slot-scope="scope">
          <p v-if="parkPortCodeboolean=scope.row.parkPortCode===null?false:true">
                    {{scope.row.parkPortCode}}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="parkingCode" width="120" label="停车场编号" v-if="parkPortCodeboolean"></el-table-column>
      <el-table-column prop="floorCode" width="120" label="楼层编号" v-if="parkPortCodeboolean"></el-table-column>
      <el-table-column prop="areaCode" width="120" label="区域编号" v-if="parkPortCodeboolean"></el-table-column>
      <el-table-column prop="lockerCode" width="150" label="车位锁编号"></el-table-column>
      <el-table-column prop="lockerVersion" width="120" label="硬件版本" v-if="!parkPortCodeboolean"></el-table-column>
      <el-table-column prop="portType" width="150" label="车位类型（燃油车：1，新能源：2）" v-if="parkPortCodeboolean"></el-table-column>
      <el-table-column prop="lockerType" width="120" label="类型(预约、混合)" v-if="!parkPortCodeboolean"></el-table-column>
      <el-table-column prop="lockerStatus" width="120" label="状态（禁用、启用）" v-if="!parkPortCodeboolean"></el-table-column>
      <el-table-column prop="merchant" width="120" label="商户" v-if="!parkPortCodeboolean"></el-table-column>
      <el-table-column prop="installTime" width="120" label="安装时间" v-if="!parkPortCodeboolean"></el-table-column>
      <el-table-column prop="parkingName" width="120" label="停车场" v-if="!parkPortCodeboolean"></el-table-column>
      <el-table-column prop="parkingName" width="1" label="停车场" v-if="!parkPortCodeboolean"></el-table-column>
      <el-table-column prop="status" width="120" label="导入状态" >
        <template slot-scope="scope">{{scope.row.status===1?'失败':'正常'}}</template>
      </el-table-column>
      <el-table-column prop="causeOfFailure" width="150" label="失败原因"></el-table-column>
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
export default {
  components: { },
  data() {
    return {
      parkPortCodeboolean:true,
     page: {
        query: {
          sortBys: "id|desc",
          param: { isDeleted: false,
             importRecordId:''
 
          }
        },
        getData: this.$api.ipark.ImportRecordService.queryImportRecordDetail
      }
    };
  },
  methods: {
    init(options = {}) {
        this.page.query.param.importRecordId = options.id;
        this.search();

    },
    search() {
       
      this.$refs.table.load();
    },

  },
  mounted() {
    this.$on("init", this.init); 
  }
};
</script>

<style>


</style>
