<!--用户等级-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">   
        <el-form-item label="平台类型">
            <el-select v-model="page.query.param.platform" :clearable="true">
                <el-option v-for="item in $dict.store.PLATFORM" :key="item[0]" :value="item[0]"
                            :label="item[1]"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="版本编号">
          <el-input v-model="page.query.param.buildId" :clearable="true"></el-input>
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

    <el-table-column prop="platform" label="平台" width="80">
          <template slot-scope="{row}">
              {{$dict.getText(row.platform,$dict.store.PLATFORM)}}
          </template>
      </el-table-column> 
      
      <el-table-column prop="buildId" label="版本编号" width="120"></el-table-column>
      <el-table-column prop="versionName" label="版本名称" width="100"></el-table-column>
      <el-table-column prop="introduce" label="版本介绍" min-width="200"></el-table-column>
      <el-table-column prop="appUrl" label="app简介链接" width="200" ></el-table-column>
      <el-table-column prop="downUrl" label="app下载地址" width="200" ></el-table-column>
     
      <el-table-column prop="isForce" label="强制升级" width="80">
          <template slot-scope="{row}">
              {{$dict.getText(row.isForce,$dict.store.ISFORCE)}}
          </template>
      </el-table-column> 

      <el-table-column prop="type" label="类型" width="80">
          <template slot-scope="{row}">
              {{$dict.getText(row.type,$dict.store.APPVERSION)}}
          </template>
      </el-table-column>   
      <el-table-column prop="apiVersion" label="api版本" width="120"></el-table-column>
      
      <el-table-column width="140" label="操作" :fixed="'right'">
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

import FormPanel from "./Form";

export default {
  components: { FormPanel},
  data() {
    return {
      formStatus: 1,
      qrCode:{},
      page: {
        query: {
          sortBys: "id|desc",
          param: { isDeleted: false }
        },
        getData: this.$api.ipark.AppVersionService.query
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
        this.$api.ipark.AppVersionService.scanQr(row.id).then(r => {
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
       console.log(row.id );
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
        this.$api.ipark.AppVersionService.delete(row.id).then(rsp => {
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
