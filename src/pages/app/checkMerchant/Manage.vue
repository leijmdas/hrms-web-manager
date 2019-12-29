<!--商家审核-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="商家名称">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="商家类型">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
         <el-form-item label="经营人">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
         <el-form-item label="电话">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
         <el-form-item label="商家状态">
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
      <el-table-column prop="name" label="商家名称" width="200">
      </el-table-column>
      <el-table-column prop="type" label="商家类型" width="120">
        <template slot-scope="{row}">
          {{$dict.getText(row.type,$dict.store.CORP_TYPE)}}
        </template>
      </el-table-column>
       <el-table-column prop="email" label="经营人" width="80">
      </el-table-column>
       <el-table-column prop="email" label="电话" width="120">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="120">
      </el-table-column>
      <el-table-column prop="contactor" label="商家地址" width="150">
      </el-table-column>
      <el-table-column prop="tel" label="商家状态" width="80">
      </el-table-column>
      <el-table-column prop="status" label="审核进度" width="80">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column width="80" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="审核" @click="edit(scope.row)">
            <!-- <i class="el-icon-edit"></i> -->审核
          </el-button>
        </template>
      </el-table-column>
    </v-table>
    <v-dialog ref="formDiag" title="信息编辑">
      <form-panel @saved="onFormSaved"></form-panel>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import FormPanel from "./Form";

export default {
  components: { FormPanel },
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
    create() {
      this.$refs.formDiag.show();
    },
    edit(row) {
      this.$refs.formDiag.show({id:row.id});
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.CorpInfoService.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
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
