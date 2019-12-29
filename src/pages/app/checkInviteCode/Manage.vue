<!--邀请码审核-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="子公司">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="物业">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="停车场">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="审核进度">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>        
        </el-form-item>
      </el-form>
    </div>
    
    <v-table ref="table" :page="page" :table-minheight="450">
      <el-table-column prop="seq"  label="序号">
        <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
      </el-table-column>
      <el-table-column prop="name" label="子公司" width="180">
      </el-table-column>
      <el-table-column prop="name" label="物业" width="180">
      </el-table-column>
      <el-table-column prop="name" label="停车场名称" width="180">
      </el-table-column>
      <el-table-column prop="name" label="申请数量" width="80">
      </el-table-column>
      <el-table-column prop="name" label="申请时间" width="140">
      </el-table-column>
      <el-table-column prop="name" label="审核时间" width="140">
      </el-table-column>
      <el-table-column prop="name" label="审核进度" width="80">
      </el-table-column>
      <el-table-column prop="name" label="审核意见" width="100">
      </el-table-column>
      <el-table-column prop="name" label="审核人" width="80">
      </el-table-column>
      <!-- <el-table-column prop="type" label="类型" width="120">
        <template slot-scope="{row}">
          {{$dict.getText(row.type,$dict.store.CORP_TYPE)}}
        </template>
      </el-table-column> -->
      <el-table-column width="80" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="审核" @click="edit(scope.row)">
            <!-- <i class="el-icon-edit"></i> -->审核
          </el-button>
        </template>
      </el-table-column>
    </v-table>
    <v-dialog title="审批"  ref="formDiag">
      <approval-form @saved="onFormSaved"></approval-form>
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
import approvalForm from "./Form";

export default {
  components: { approvalForm },
  data() {
    return {
      formStatus: 1,
      orderDateRange: [],
      page: {
        query: {
          sortBys:'id|desc',
          param: {
            isDeleted:false
          }
        },
        getData: this.$api.ipark.CorpInfoService.query
      }
    };
  },
  computed: {},

  methods: {
    edit(row) {
      this.$refs.formDiag.show({id:row.id});
    },
    onFormSaved(){
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
