<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="所属停车场" prop="parkId">
          <park-select  v-model="page.query.param.parkId"></park-select>
        </el-form-item>
        <el-form-item label="泊位号">
          <el-input v-model="page.query.param.name" :clearable="true"></el-input>
        </el-form-item> 
        <el-form-item label="日期"> 
          <el-date-picker
            v-model="value4"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车牌">
          <el-input v-model="page.query.param.name" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="page.query.param.name" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
        </el-form-item>
      </el-form>
    </div>    
    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
      <el-table-column prop="companyName" label="所属停车场" width="100">
        <template slot-scope="{row}">{{(row.parkInfo||{}).name}}</template>
      </el-table-column>
     <el-table-column prop="createTime" label="开始时间" width="100"></el-table-column> 
     <el-table-column prop="createTime" label="结束时间" width="100"></el-table-column>
     <el-table-column prop="createTime" label="车牌号码" width="100"></el-table-column>
     <el-table-column prop="createTime" label="预约费用" width="80"></el-table-column>
     <el-table-column prop="createTime" label="包月费用" width="80"></el-table-column>
     <el-table-column prop="createTime" label="临停费用" width="80"></el-table-column>
     <el-table-column prop="createTime" label="合计费用" width="80"></el-table-column>
     <el-table-column prop="createTime" label="状态" width="80"></el-table-column>
     <el-table-column prop="createTime" label="提现状态" width="80"></el-table-column>
     <el-table-column prop="createTime" label="备注" width="180"></el-table-column>


      <el-table-column width="100" label="金额是否正确" :fixed="'right'">
        <template slot-scope="scope">          
          <el-button type="text" title="查看" @click="share(scope.row)">
            <i class="el-icon-share"></i>
          </el-button> 
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>
        </template>
      </el-table-column>
    </v-table>
    <v-dialog title="信息编辑" ref="formDiag">
      <form-panel @saved="onFormSaved"></form-panel>
      <div slot="footer">
        <el-button type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
        <el-button @click="()=>{this.$refs.formDiag.hide();}">取消</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import ParkSelect from '@/components/widgets/ParkSelect'
import PortSelect from '@/components/widgets/PortSelect'
import FormPanel from "./Form";

export default {
  components: {ParkSelect,FormPanel,PortSelect},
  data() {
    return {
      formStatus: 1,
      qrCode:{},
      page: {
        query: {
          sortBys: "id|desc",
          param: { isDeleted: false }
        },
        getData: this.$api.ipark.CheckRecordService.query
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
    },
    share(row) {
      this.$refs.formDiag.show({ id: row.id });
    },
    edit(row) {
      this.$refs.formDiag.show({ id: row.id });
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.CheckRecordService.delete(row.id).then(rsp => {
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
