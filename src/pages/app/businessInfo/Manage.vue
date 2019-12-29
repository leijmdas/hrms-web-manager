<!--商家信息-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="商家名称">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="商家类型">
          <el-select v-model="page.query.param.name" clearable>
              <el-option v-for="item in $dict.store.ACCOUNT_SUBJECT_TYPE" :key="item[0]" :value="item[0]" :label="item[1]">
              </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="经营人">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
         <el-form-item label="电话">
          <el-input v-model="page.query.param.name" clearable></el-input>
        </el-form-item>
         <el-form-item label="商家状态">
          <el-select v-model="page.query.param.name" clearable>
              <el-option v-for="item in $dict.store.ACCOUNT_SUBJECT_TYPE" :key="item[0]" :value="item[0]" :label="item[1]">
              </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="审核状态">
          <el-select v-model="page.query.param.name" clearable>
              <el-option v-for="item in $dict.store.ACCOUNT_SUBJECT_TYPE" :key="item[0]" :value="item[0]" :label="item[1]">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          
        </el-form-item>
      </el-form>
    </div>
    <v-toolbar title="数据列表" type="alert">
        <el-button plain type="primary" @click="create">新增</el-button>
    </v-toolbar>
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
      <el-table-column prop="status" label="审核状态" width="80">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
      </el-table-column>
      <el-table-column width="120" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="上/下架" @click="putAway(scope.row)" v-if="scope.row.status != 2">
              <i class="el-icon-upload2" v-show="scope.row.status==0"></i>
              <i class="el-icon-download" v-show="scope.row.status==1"></i>
          </el-button>
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button style="color: red;" type="text" title="删除" @click="del(scope.row)">
            <i class="el-icon-delete red"></i>
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
import FormPanel from "./Edit";

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
      putAway(row) {
      // 根据状态来判断 0-草稿1-上架2-下架  已上架的只能下架  已下架的不能操作 草稿可以上架
      if (row.status == 0) {
          let msg = '确定上架此活动吗？</br><span style="color:red">一旦上架，部分信息不允许修改!</span>';
          this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              dangerouslyUseHTMLString: true
          }).then(() => {
              this.$api.ipark.ActivityRulesService.save({id: row.id, status: 1}).then(() => {
                  this.search();
                  this.$message({
                      type: 'success',
                      message: '上架成功!'
                  });
              })
          });
      }
      if (row.status == 1) {
          this.$confirm('确认下架此活动吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
          }).then(() => {
              this.$api.ipark.ActivityRulesService.save({id: row.id, status: 2}).then(() => {
                  this.search();
                  this.$message({
                      type: 'success',
                      message: '下架成功!'
                  });
              })
          });
      }
    },
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
