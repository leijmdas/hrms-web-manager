<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="商户">
          <merchant-select v-model="page.query.param.id" :clearable="true"></merchant-select>
        </el-form-item>
        <el-form-item label="纳税人识别号">
          <el-input v-model="page.query.param.merchantInvoiceInfoDTO.taxpayerRegistrationNumber" :clearable="true"></el-input>
        </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="page.query.param.merchantInvoiceInfoDTO.status" :clearable="true">
          <el-option v-for="item in $dict.store.INVOICE_STATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
      </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
      <el-table-column prop="parkName" width="150" label="停车场"></el-table-column>
      <el-table-column prop="name" label="商户名称" width="150"></el-table-column>
      <el-table-column prop="companyName" label="纳税人识别号" width="150">
        <template slot-scope="{row}">{{(row.merchantInvoiceInfoDTO||{}).taxpayerRegistrationNumber}}</template>
      </el-table-column>
      <el-table-column prop="companyName" label="销售方银行" width="150">
        <template slot-scope="{row}">{{(row.merchantInvoiceInfoDTO||{}).bank}}</template>
      </el-table-column>
      <el-table-column prop="companyName" label="销售方银行账号" width="150">
        <template slot-scope="{row}">{{(row.merchantInvoiceInfoDTO||{}).bankAccount}}</template>
      </el-table-column>

      <el-table-column prop="status" width="80" label="状态">
        <template slot-scope="{row}">
          <span v-if='(row.merchantInvoiceInfoDTO||{}).status===0'>运行中</span>
　　       <span v-else-if='(row.merchantInvoiceInfoDTO||{}).status===1'>停用</span>
　　       <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="linkman" width="150" label="开票人"></el-table-column>
      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">{{row.createOn}}</template>
      </el-table-column>

      <el-table-column  label="操作" :fixed="'right'">
        <template slot-scope="{row}">

          <el-button type="text" title="编辑" @click="edit(row)">
            <i class="el-icon-edit"></i>
          </el-button>

          <el-button type="text" @click="changeStatus(row)" title="关闭">
            <i v-if='(row.merchantInvoiceInfoDTO||{}).status===0'>
            关闭
            </i>
            <i v-else>开启</i>
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
import CorpSelect from "@/components/widgets/CorpSelect.vue";
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import FormPanel from "./Form";
import { log } from 'util';

export default {
  components: { CorpSelect, FormPanel, MerchantSelect },
  data() {
    return {
      formStatus: 1,
      qrCode:{},
      page: {
        query: {
          sortBys: "id|desc",
          param: { isDeleted: false,
              merchantInvoiceInfoDTO:{
                status:'',
                taxpayerRegistrationNumber:''

              }
          }
        },
        getData: this.$api.ipark.InvoiceService.query
      },
      tableActions: [
        {
          name: "编辑",
          handle: this.edit
        },
        {
          name: "更改状态",
          handle: this.changeStatus,
          style: "color:red"
        }
      ]
    };
  },
  computed: {},

  methods: {
    edit(row) {
      this.$refs.formDiag.show({ id: row.id });
    },
    changeStatus(row) {

      this.$confirm("确定要改变状态吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.InvoiceService.changeS(row.id,row.merchantInvoiceInfoDTO.status).then(rsp => {
          this.search();

        });
      });
    },
    onFormSaved() {
      this.$refs.formDiag.hide();
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
