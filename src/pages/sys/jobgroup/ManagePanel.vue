<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">  
       <!-- <el-form-item label="id">
          <el-input v-model="page.query.param.id" :clearable="true"></el-input>
        </el-form-item> -->
        <el-form-item label="组名">
          <el-input v-model="page.query.param.groupName" :clearable="true"></el-input>
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
      <el-table-column prop="id" label="id" width="160">
    
      </el-table-column>     
      <el-table-column prop="groupName" label="组名"></el-table-column> 
      <el-table-column prop="remark" label="备注" width="140"></el-table-column>
      <el-table-column prop="createOn" label="创建时间" width="140"></el-table-column>
      <el-table-column prop="createBy" width="80" label="创建人">
        
      </el-table-column> 
      <el-table-column prop="updateOn" label="更新时间"></el-table-column> 
       <el-table-column prop="updateBy" label="更新人"></el-table-column>
       <el-table-column prop="isDeleted" label="是否被删除"></el-table-column>  
      <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">         
          <!-- <el-button type="text" title="查看" @click="share(scope.row)">
            <i class="el-icon-share"></i>
          </el-button> -->
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <!-- <el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button> -->
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
  <!-- 新增 -->
  
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
// import ParkSelect from '@/components/widgets/ParkSelect'
// import CorpSelect from "@/components/widgets/CorpSelect.vue";
// import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import FormPanel from "./Form";
//import FormPane1 from "./Form1";

export default {
  // components: { CorpSelect, FormPanel, MerchantSelect,ParkSelect },
   components: {FormPanel},
  data() {
    return {
       dataSource: [],
      formStatus: 1,
      
      currentDict:{id:0},
      page: {
        query: {
          sortBys: "id|desc",
          param: {  }
        },
        getData: this.$api.sys.SysGroupJob.query
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
      this.$api.sys.SysGroupJob.save(row).then(data => {
      this.loadDictItems(row.dictId);
          });
      this.$refs.table.load();
    },
    create() {
      this.$refs.formDiag.show({});
      this.$refs.formDiag.title='新增';
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
      this.$refs.formDiag.title='编辑';
      this.shares=true;
      this.disable=false;      
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.sys.SysGroupJob.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
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
  created() {},
  mounted() {
    this.$on("init", this.init);
  },
  
 
};
</script>
