<!--停车场管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="用户名">
              <!--<user-select v-model="page.query.param.userId" :clearable="true"></user-select>-->
            <el-input v-model="page.query.param.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="page.query.param.mobileNo" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户等级" prop="userGradeId" >
          <userGrade-select  v-model="page.query.param.userGradeId" :clearable="true"></userGrade-select>
        </el-form-item>
         <el-form-item  label="用户标识" prop="testFlag">
            <el-select v-model="page.query.param.testFlag" clearable>
                <el-option v-for="item in $dict.store.TESTFLAG" :key="item[0]" :value="item[0]"
                            :label="item[1]"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="邀请码">
          <el-input v-model="page.query.param.mobileNo" clearable></el-input>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
            <el-button  @click="page.query.param = {}; search();" >取消</el-button>
        </el-form-item>
      </el-form>
    </div>
   <!-- <v-toolbar title="数据列表" type="alert">
      <el-button type="primary" plain @click="create">新增</el-button>
    </v-toolbar>-->
    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">

      <el-table-column prop="username"  label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="mobileNo" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="mobileNo" label="邀请码" width="80">
      </el-table-column>
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
      </el-table-column>
      <!--
         <el-table-column prop="amount" label="账户余额" width="100">
        <template slot-scope="{row}">{{(row.wallet||{}).amount}}</template>
      </el-table-column>
       -->

      <el-table-column prop="remark"  label="备注"></el-table-column>

      <el-table-column prop="createOn" width="140" label="创建时间">
        <template slot-scope="{row}">
          {{row.createOn}}
        </template>
      </el-table-column>

      <el-table-column width="140" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="查看" @click="share(scope.row)">
            <i class="el-icon-share"></i>
          </el-button>
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <!--<el-button style="color: red" type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>-->
        </template>
      </el-table-column>
    </v-table>
    <v-dialog :title="titles"  ref="formDiag">
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
import ParkSelect from '@/components/widgets/ParkSelect'
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import UserGradeSelect from '@/components/widgets/UserGradeSelect';
import FormPanel from "./Form";

export default {
  components: { FormPanel, MerchantSelect,ParkSelect,UserGradeSelect },
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
      this.shares=true;
      this.disable=false;
    },
    share(row) {
      this.$refs.formDiag.show({ id: row.id });
      this.shares=false;
      this.disable=true;
      this.titles="信息查看";
    },
    edit(row) {
      this.$refs.formDiag.show({ id: row.id });
      this.shares=true;
      this.disable=false;
      this.titles="信息编辑";
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
