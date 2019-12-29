<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
       <!-- <el-form-item label="id">
          <el-input v-model="page.query.param.id" :clearable="true"></el-input>
        </el-form-item> -->
        <el-form-item label="任务名">
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
      <el-table-column prop="groupName" width="140" label="任务组名称">
      <template slot-scope="{row}">{{(row.sysJobGroup||{}).groupName}}</template>
      </el-table-column>
      <el-table-column prop="name" label="任务名称" width="120"></el-table-column>
      <el-table-column prop="expression" label="表达式" width="80"></el-table-column>
      <el-table-column prop="url" label="url地址" width="310"></el-table-column>
      <el-table-column prop="status" width="70" label="任务状态">
      <template slot-scope="scope">{{scope.row.status===1?'正常':'关闭'}}</template>
      </el-table-column>
      <el-table-column prop="createOn" label="创建时间" width="140"></el-table-column>
      <el-table-column prop="opOn" label="开启时间" width="140"></el-table-column>
      <el-table-column prop="remark" label="备注" ></el-table-column>
    <el-table-column width="100" label="操作" :fixed="'right'">
      <template slot-scope="scope">
        <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <!--<el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>   -->
        <el-button type="text" @click="stop(scope.row)" v-if="scope.row.status==1">暂停</el-button>
         <el-button type="text" @click="begin(scope.row)" v-if="scope.row.status!=1">开启</el-button>
      </template>
    </el-table-column>
    </v-table>

     <v-dialog :title="infoTitle" ref="formDiag">
      <form-panel @saved="onFormSaved" :disables="disable"></form-panel>
      <div slot="footer">
        <el-button v-if="shares==true" type="primary" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
        <el-button @click="$refs.formDiag.hide();">取消</el-button>
      </div>
    </v-dialog>

  </div>
  <!-- 新增 -->

</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import GroupSelect from '@/components/widgets/GroupSelect'
import FormPanel from "./Form";
export default {
  components: {  FormPanel,GroupSelect },
  data() {
    return {
      statusMap:{1:'正常',0:'暂停'},
       dataSource: [],
      formStatus: 1,
      infoTitle: '新增',
      currentDict:{id:0},
      page: {
        query: {
          sortBys: "id|desc",
          param: {  }
        },
        getData: this.$api.sys.HttpJob.query
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
     save(row) {
      this.$api.sys.HttpJob.save(row).then(data => {
      this.loadDictItems(row.dictId);
          });
      this.$refs.table.load();
    },
    create() {
      this.$refs.formDiag.show({});
      this.infoTitle='新增';
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
      this.infoTitle='编辑';
      this.shares=true;
      this.disable=false;
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.sys.HttpJob.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
     stop(row){
       console.log(row);
        this.$api.sys.HttpJob.pause(row.id).then(rsp => {
          this.search();
        });
     },
     begin(row){
        this.$api.sys.HttpJob.resume(row.id).then(rsp => {
          this.search();
        });
     },
    onFormSaved() {
      this.$refs.formDiag.hide();
      this.$nextTick(this.search);
    },
     onFormSaved1() {
      this.$refs.formDiag1.hide();
      this.$nextTick(this.search);
    },
    init(options = {}) {
      this.search();
    },
    search() {
      this.$refs.table.load();
    }
  },
  created() {

  },
  mounted() {
    this.$on("init", this.init);
  },


};
</script>
