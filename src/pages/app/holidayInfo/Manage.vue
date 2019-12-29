<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="物业">
          <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="page.query.param.name" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
            <el-button  @click="page.query.param = {}; search();" >取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <v-toolbar title="数据列表" type="alert">
      <el-button type="primary" plain @click="create">新增</el-button>
    </v-toolbar>
    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
      <el-table-column prop="name" label="物业" width="160">
        <template slot-scope="{row}">{{(row.merchantInfo||{}).name}}</template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="startDate" label="开始时间" width="140"></el-table-column>
      <el-table-column prop="endDate" label="结束时间" width="140"></el-table-column>
      <el-table-column prop="status" width="80" label="状态">
        <template slot-scope="scope">{{scope.row.status===1?'启用':'禁用'}}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="查看" @click="share(scope.row)">
            <i class="el-icon-share"></i>
          </el-button>
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button style="color: red" type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>
        </template>
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
import CorpSelect from "@/components/widgets/CorpSelect.vue";
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import FormPanel from "./Form";

export default {
  components: { CorpSelect, FormPanel, MerchantSelect,ParkSelect },
  data() {
    return {
      formStatus: 1,
      qrCode:{},
      page: {
        query: {
          sortBys: "id|desc",
          param: { isDeleted: false }
        },
        getData: this.$api.ipark.HolidayInfoService.query
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
        this.$api.ipark.HolidayInfoService.delete(row.id).then(rsp => {
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
