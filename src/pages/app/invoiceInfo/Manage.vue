<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
          <el-form-item label="子公司">
              <branch-company-select v-model="page.query.param.branchCompanyId" :clearable="true"></branch-company-select>
          </el-form-item>
          <el-form-item label="状态">
              <el-select v-model="page.query.param.status" :clearable="true">
                  <el-option v-for="item in $dict.store.INVOICE_STATUS" :key="item[0]" :value="item[0]"
                             :label="item[1]"></el-option>
              </el-select>
          </el-form-item>

        <!--<el-form-item>-->
          <!--<div slot="label">-->
            <!--<el-select :disabled="true" v-model="dateRangeType" style="width:120px" class="formitem-label" :clearable="true">-->
              <!--<el-option value="applyTime" label="开票时间"></el-option>-->
            <!--</el-select>-->
          <!--</div>-->
           <!--<el-date-picker-->
            <!--v-model="dateRange"-->
            <!--type="daterange"-->
            <!--range-separator="至"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--value-format="yyyy-MM-dd"-->
          <!--&gt;</el-date-picker>-->
        <!--</el-form-item>-->
          <el-form-item label="开票时间"/>
          <el-form-item>

              <el-date-picker
                  v-model="dateRangeStart"
                  type="date"
                  placeholder="开始日期"
                  value-format="yyyy-MM-dd" >
              </el-date-picker>
              <el-form-item label=" 至"/>
              <el-date-picker
                  v-model="dateRangeEnd"
                  type="date"
                  placeholder="结束日期"
                  value-format="yyyy-MM-dd"
              ></el-date-picker>
          </el-form-item>

          <!--<el-form-item label="开票时间"/>-->
          <!--<el-form-item>-->

          <!--<el-date-picker-->
          <!--v-model="dateRange"-->
          <!--type="date"-->
          <!--placeholder="开始日期"-->
          <!--value-format="yyyy-MM-dd HH:mm:ss"-->
          <!--&gt;</el-date-picker>-->
          <!--<el-date-picker-->
          <!--v-model="dateRange"-->
          <!--type="date"-->
          <!--placeholder="结束日期"-->
          <!--value-format="yyyy-MM-dd HH:mm:ss"-->
          <!--&gt;</el-date-picker>-->
          <!--</el-form-item>-->


        <el-form-item label="用户名">
          <el-input v-model="page.query.param.viewBase.userName" :clearable="true"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
            <el-button
                @click="cancel" >取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
        <el-table-column prop="seq" label="序号" width="60">

            <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>

        </el-table-column>



        <el-table-column prop="branchCompanyId" width="120" label="子公司">
            <template slot-scope="scope" v-if="scope.row.viewBase">{{scope.row.viewBase.branchCompanyName}}</template>
        </el-table-column>
        <el-table-column prop="userId" width="120" label="用户">
            <template slot-scope="scope" v-if="scope.row.viewBase">{{scope.row.viewBase.userName}}</template>

        </el-table-column>

        <el-table-column prop="code" label="发票编码" width="100">
            <template slot-scope="scope">  {{scope.row.code||scope.row.id}}  </template>
        </el-table-column>
        <el-table-column prop="title" label="发票抬头" width="120"></el-table-column>
        <el-table-column prop="taxNo" width="160" label="税号"></el-table-column>

        <el-table-column prop="titleType" width="60" label="类型">
            <template slot-scope="scope">  {{scope.row.titleType==1?'个人':'公司'}}
            </template>
        </el-table-column>

        <el-table-column prop="content" width="150" label="发票内容"></el-table-column>
        <el-table-column prop="amount" width="80" label="发票金额"></el-table-column>
        <el-table-column prop="orderNumber" width="60" label="单数"></el-table-column>
        <el-table-column prop="receiverMail" width="160" label="接收邮件"></el-table-column>
        <el-table-column prop="contact" width="100" label="联系方式"></el-table-column>
        <el-table-column prop="applyTime" width="140" label="申请时间"></el-table-column>
        <el-table-column prop="status" width="80" label="状态">

            <template slot-scope="scope"> {{$dict.getText(scope.row.status,$dict.store.INVOICE_STATUS)}}
            </template>

        </el-table-column>


        <el-table-column prop="opOn" width="140" label="开票时间"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>

        <el-table-column prop="invoiceUrl" :fixed="'right'" label="发票地址">
            <template slot-scope="scope">
                <a :href="scope.row.invoiceUrl" v-if="scope.row.invoiceUrl">下载</a>
                <a :href="scope.row.imageUrl" v-if="scope.row.imageUrl" target="_blank">预览</a>
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
<style     >
    /*.el-table .cell{*/
        /*!*overflow: auto;*!*/
        /*!*text-overflow: clip;*!*/
        /*white-space: pre-wrap;*/
    /*}*/

</style>
<script>
    import CorpSelect from '@/components/widgets/CorpSelect.vue';
    import BranchCompanySelect from '@/components/widgets/BranchCompanySelect.vue';
    import FormPanel from './Form';

    const queryIni = {
        orderBys: 'id|desc',
        param: {
            isDeleted: false,
            viewBase: {}
        }
    };

    export default {
        components: {CorpSelect, FormPanel, BranchCompanySelect},
        data() {
            return {
                formStatus: 1,
                dateRangeStart: '',
                dateRangeEnd: '',
                dateRange: [],
                dateRangeType: 'applyTime',
                qrCode: {},
                page: {
                    query: _.cloneDeep(queryIni),

                    getData: this.$api.ipark.InvoiceService.query
                },

                tableActions: [
                    {
                        name: '编辑',
                        handle: this.edit
                    },
                    {
                        name: '删除',
                        handle: this.del,
                        style: 'color:red'
                    }
                ]
            };
        },
        computed: {},

        methods: {
            cancel() {
                this.dateRange = [];
                this.dateRangeStart = '';
                this.dateRangeEnd = '';

                this.page.query = _.cloneDeep(queryIni);
                this.search();
            },
            flushQrCode(row) {
                this.$refs.qrDiag.show();
                this.$nextTick(() => {
                    this.$api.ipark.ParkInfoService.scanQr(row.id).then(r => {
                        this.qrCode = r;
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
      return '-';
    },
    edit(row) {
      this.$refs.formDiag.show({ id: row.id });
    },
    del(row) {
      this.$confirm('确定删除此条记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$api.ipark.InvoiceService.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: 'success',
            message: '删除成功!'
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
      this.page.query.dateRanges = {};
        //if (this.dateRangeType != null && this.dateRange.length > 0) {
        if (this.dateRangeStart != '' && this.dateRangeEnd != '') {
            this.page.query.dateRanges['applyTime'] = {
                startDate: this.dateRangeStart + ' 00:00:00',
                endDate:   this.dateRangeEnd + ' 23:59:59'
            };
        }

        this.$refs.table.load();
        this.$nextTick(() => {
            console.table(this.$refs.table.getTableData() );
        });
    }
        },
        created() {
        },
        mounted() {
    this.$on('init', this.init);
  }
};
</script>
