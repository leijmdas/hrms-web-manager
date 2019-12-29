<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="商户">
          <merchant-select v-model="page.query.param.merchantId" :clearable="true"></merchant-select>
        </el-form-item>
        <el-form-item label="parkId">
          <el-input v-model="page.query.param.parkId" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="page.query.param.code" :clearable="true" ></el-input>
        </el-form-item>

        <el-form-item label="名称">
          <el-input v-model="page.query.param.name" :clearable="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <v-toolbar title="数据列表" type="alert">
      <el-button type="primary" plain @click="create">新增</el-button>
    </v-toolbar>
    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
      <el-table-column prop="seq" width="80" label="排序"></el-table-column>
      <el-table-column prop="code" width="120" label="编码"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="companyName" label="所属停车场" width="250">
        <template slot-scope="{row}">{{(row.parkInfo||{}).name}}</template>
      </el-table-column>
      <el-table-column prop="status" width="80" label="状态">
        <template slot-scope="scope">{{scope.row.status===1?'启用':'禁用'}}</template>
      </el-table-column>
      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">{{row.createOn}}</template>
      </el-table-column>
      
      <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <!-- <el-button type="text" title="绑定企业" @click="bindCorp(scope.row)">
            <i class="el-icon-share"></i>
          </el-button> -->
          <el-button type="text" title="扫码支付二维码" @click="flushQrCode(scope.row)">
            <icon name="qrcode"></icon>
          </el-button>
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <!--<el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>-->
        </template>
      </el-table-column>
    </v-table>
    <v-dialog title="信息编辑" ref="formDiag" :appendToBody="true">
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
import CorpSelect from "@/components/widgets/CorpSelect.vue";
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import FormPanel from "./Form";

export default {
  components: { CorpSelect, FormPanel, MerchantSelect },
  data() {
    return {
      formStatus: 1,
      qrCode:{},
      page: {
        query: {
          seq: 'seq|asc',
          param: { isDeleted: false }
        },
        getData: this.$api.ipark.ParkFloorService.query
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
    edit(row) {
      this.$refs.formDiag.show({ id: row.id });
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.ParkInfoService.delete(row.id).then(rsp => {
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
