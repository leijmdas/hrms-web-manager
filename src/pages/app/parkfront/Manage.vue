<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">  
         <el-form-item label="停车场">
            <park-select v-model="page.query.param.parkId" :clearable="true"></park-select>
        </el-form-item>       
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
   
    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">          
         
      <el-table-column prop="parkName" label="车场名称" width="300"></el-table-column> 
      <el-table-column prop="reportTime" label="上报时间" width="300"></el-table-column>
     
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">{{scope.row.state===0?'正常':'异常'}}</template>
      </el-table-column>         
    </v-table>
    <v-dialog title="信息编辑" ref="formDiag">
      <form-panel @saved="onFormSaved" :disables="disable"></form-panel>
      <div slot="footer">
        <el-button v-if="shares==true" type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
        <el-button @click="()=>{this.$refs.formDiag.hide();}">取消</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import ParkSelect from '@/components/widgets/ParkSelect'

export default {
  components: { ParkSelect },
  data() {
    return {
      formStatus: 1,
      qrCode:{},
      page: {
        query: {
          sortBys: "id|desc",
          param: { isDeleted: false }
        },
        getData: this.$api.ipark.ParkFrontService.queryFind
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
      ],
      shares:true,
      disable:false
    };
  },
  computed: {},

  methods: {
    flushQrCode(row) {
      this.$refs.qrDiag.show()
      this.$nextTick(()=>{
        this.$api.ipark.ParkInfoService.scanQr(row.id).then(r => {
          this.qrCode = r
        });
      });
    },
    getCorpInfo(row, type) {
      let rts = row.corpRelations || [];
      let arr = [];
      for (let i = 0; i < rts.length; i++) {
        let c = rts[i].corpInfo || {};
        return c.name;
      }
      return "-";
    },
    create() {
      this.$refs.formDiag.show({});
      this.shares=true;
      this.disable=false;
    },
    share(row) {
      this.$refs.formDiag.show({ id: row.id });
      this.shares=false;
      this.disable=true;
    },
    edit(row) {
      this.$refs.formDiag.show({ id: row.id });
      this.shares=true;
      this.disable=false;      
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.ParkFrontService.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    bindCorp(row) {
      this.$refs.corpDiag.show({
        parkInfo: row
      });
    },
    onFormSaved() {
      this.$refs.formDiag.hide();
      this.$nextTick(this.search);
    },
    onBindCorpFormSaved() {
      this.$refs.corpDiag.hide();
      this.$nextTick(this.search);
    },
    init(options = {}) {
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
