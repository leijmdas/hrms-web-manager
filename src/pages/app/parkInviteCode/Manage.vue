<!--停车场邀请码管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="子公司" prop="username">
          <el-input v-model="page.query.param.username" clearable></el-input>
        </el-form-item> 
        <el-form-item label="物业" prop="username">
          <el-input v-model="page.query.param.username" clearable></el-input>
        </el-form-item> 
        <el-form-item label="停车场" prop="username">
          <el-input v-model="page.query.param.username" clearable></el-input>
        </el-form-item> 
        <el-form-item label="编码" prop="username">
          <el-input v-model="page.query.param.username" clearable></el-input>
        </el-form-item> 
        <el-form-item label="邀请码" prop="username">
          <el-input v-model="page.query.param.username" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
            <el-button  @click="page.query.param = {}; search();" >取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">
      <el-table-column prop="seq"  label="序号">
        <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
      </el-table-column>
      <el-table-column prop="username"  label="子公司" width="180"></el-table-column>
      <el-table-column prop="username"  label="物业" width="180"></el-table-column>
      <el-table-column prop="username"  label="停车场编码" width="150"></el-table-column>
      <el-table-column prop="username"  label="停车场名称" width="180"></el-table-column>
      <el-table-column prop="username"  label="邀请码" width="80" ></el-table-column><!-- show-overflow-tooltip -->
      <el-table-column prop="username"  label="类型" width="80"></el-table-column>
      <el-table-column prop="username"  label="邀请码总数/已邀请/未邀请" width="180"></el-table-column>
      <el-table-column prop="username"  label="活动数量"></el-table-column>
      <el-table-column width="180" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="发放" @click="issue(scope.row)">
            <!-- <i class="el-icon-share"></i> -->发放
          </el-button>
          <el-button type="text" title="发放明细" @click="detail(scope.row)">
            <!-- <i class="el-icon-share"></i> -->发放明细
          </el-button>
          <el-button type="text" title="活动绑定" @click="binding(scope.row)">
            <!-- <i class="el-icon-edit"></i> -->活动绑定
          </el-button>
        </template>
      </el-table-column>
    </v-table>
    <v-dialog title="发放"  ref="issueFormDiag">
      <issue-form @saved="onFormSaved" :disables="disable"></issue-form>
      <div slot="footer">
        <el-button type="primary" @click="$refs.issueFormDiag.dispatch('submit')">确定</el-button>
        <el-button @click="()=>{this.$refs.issueFormDiag.hide();}">取消</el-button>
      </div>
    </v-dialog>
    <v-dialog title="发放明细"  ref="detailFormDiag">
      <detail-form @saved="onFormSaved" :disables="disable"></detail-form>
      <div slot="footer">
        <el-button type="primary" @click="$refs.detailFormDiag.dispatch('submit')">确定</el-button>
        <el-button @click="()=>{this.$refs.detailFormDiag.hide();}">取消</el-button>
      </div>
    </v-dialog>
    <v-dialog title="活动绑定"  ref="activitybindingFormDiag">
      <activitybinding-form @saved="onFormSaved" :disables="disable"></activitybinding-form>
      <!-- <div slot="footer">
        <el-button type="primary" @click="$refs.activitybindingFormDiag.dispatch('submit')">保存</el-button>
        <el-button @click="()=>{this.$refs.activitybindingFormDiag.hide();}">取消</el-button>
      </div> -->
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import ParkSelect from '@/components/widgets/ParkSelect'
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import UserGradeSelect from '@/components/widgets/UserGradeSelect';
import issueForm from "./issueForm";
import detailForm from "./detailForm";
import activitybindingForm from "./activitybindingForm";

export default {
  components: { issueForm, detailForm, activitybindingForm, MerchantSelect,ParkSelect,UserGradeSelect },
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
    issue() {
      this.$refs.issueFormDiag.show();
    },
    detail() {
      this.$refs.detailFormDiag.show();
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
    binding(row) {
      // this.$refs.formDiag.show({ id: row.id });
      this.$refs.activitybindingFormDiag.show();
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
