<!--商家邀请码管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="商家名称">
              <!--<user-select v-model="page.query.param.userId" :clearable="true"></user-select>-->
            <el-input v-model="page.query.param.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="批次号">
          <el-input v-model="page.query.param.mobileNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="page.query.param.mobileNo" clearable></el-input>
        </el-form-item>
         <el-form-item  label="状态" prop="testFlag">
          <el-select :clearable="true" v-model="page.query.param.status" style="width:100px">
            <el-option v-for="item in $dict.store.PROMOTION_STATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="活动名称" prop="userGradeId" >
          <el-input v-model="page.query.param.mobileNo" clearable></el-input>
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
      <el-table-column prop="seq"  label="序号">
        <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
      </el-table-column>
      <el-table-column prop="username"  label="商家名称" width="180"></el-table-column>
      <el-table-column prop="username"  label="商家类型" width="80"></el-table-column>
      <el-table-column prop="username"  label="批次号" width="100"></el-table-column>
      <el-table-column prop="username"  label="邀请码类型" width="100"></el-table-column>

      <el-table-column prop="username"  label="邀请码总量/已邀请/未邀请" width="180"></el-table-column>
      <el-table-column prop="status"  label="状态" width="80">
        <template slot-scope="{row}">
              {{$dict.getText(row.status,$dict.store.PROMOTION_STATUS)}}
          </template>
      </el-table-column>
      <el-table-column prop="username"  label="备注" width="80"></el-table-column>
      <el-table-column prop="username"  label="创建时间" width="140"></el-table-column>
      <el-table-column prop="username"  label="活动数量" width="80"></el-table-column>
      <!-- 
      <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="{row}">
              {{$dict.getText(row.status,$dict.store.STATUSS)}}
          </template>
      </el-table-column>
      <el-table-column prop="carNumber" label="车牌号" width="320">
        <template slot-scope="{row}">{{(row.carownerInfo||{}).carNumber}}</template>
      </el-table-column>
      <el-table-column prop="name" label="等级名称" width="120">
        <template slot-scope="{row}">{{(row.userGrade||{}).name}}</template>
      </el-table-column>
      <el-table-column prop="testFlag" label="用户标识" width="80">
          <template slot-scope="{row}">
              {{$dict.getText(row.testFlag,$dict.store.TESTFLAG)}}
          </template>
      </el-table-column> -->

      <el-table-column width="140" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="上/下架" @click="putAway(scope.row)" v-if="scope.row.status != 2">
              <i class="el-icon-upload2" v-show="scope.row.status==0"></i>
              <i class="el-icon-download" v-show="scope.row.status==1"></i>
          </el-button>
          <el-button type="text" title="详情" @click="edit(scope.row)">
            <!-- <i class="el-icon-edit"></i> -->详情
          </el-button>
          <el-button type="text" @click="binding(scope.row)">
            <!-- <i class="el-icon-edit"></i> -->活动绑定
          </el-button>
        </template>
      </el-table-column>
    </v-table>
    <v-dialog title="邀请码详情"  ref="formDiag">
      <form-panel @saved="onFormSaved" :disables="disable"></form-panel>
    </v-dialog>
    <v-dialog title="活动绑定"  ref="bindingFormDiag">
      <binding-form-panel @saved="onFormSaved"></binding-form-panel>
      <!-- <div slot="footer">
        <el-button type="primary" @click="$refs.bindingFormDiag.dispatch('submit')">保存</el-button>
        <el-button @click="()=>{this.$refs.bindingFormDiag.hide();}">取消</el-button>
      </div> -->
    </v-dialog>
    <v-dialog title="新增"  ref="createFormDiag">
      <create-form-panel @saved="onFormSaved"></create-form-panel>
      <div slot="footer">
        <el-button type="primary" @click="$refs.createFormDiag.dispatch('submit')">保存</el-button>
        <el-button @click="()=>{this.$refs.createFormDiag.hide();}">取消</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import FormPanel from "./detailForm";
import bindingFormPanel from "../parkInviteCode/activitybindingForm";
import createFormPanel from "./createForm";

export default {
  components: { FormPanel, bindingFormPanel, createFormPanel },
  data() {
    return {
      formStatus: 1,
      qrCode:{},
      titles:"",
      page: {
        query: {
          sortBys: "id|asc",
          param: { isDeleted: false }
        },
        getData: this.$api.ipark.UserInfoService.findCarInfo
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
    create() {
      this.$refs.createFormDiag.show({});
      this.disable=false;
    },
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
    edit(row) {
      // this.$refs.formDiag.show({ id: row.id });
      this.$refs.formDiag.show();
    },
    binding(row) {
      this.$refs.bindingFormDiag.show({ id: row.id });
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.UserInfoService.delete(row.id).then(rsp => {
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
