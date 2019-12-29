<!--客户资料管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="page.query.param.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="page.query.param.realname"></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <org-tree v-model="page.query.param.orgId" :corp-id="corpId" style="width: 100%;"></org-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
          <el-button @click="create" >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-table">
      <el-row>
          <el-col :span="16">
              <v-table ref="table" :page="page" :actions="tableActions" :auto-select="true" @dataloaded="onDataloaded"
                       @row-click="edit"    @row-dblclick="edit" :table-minheight="400" action-width="100px">
                  <el-table-column prop="username" label="用户名" header-align="center" width="100">
                  </el-table-column>
                  <el-table-column prop="realname" label="姓名" header-align="center" width="120">
              <!--<template slot-scope="{row}">-->
                <!--{{row.sysAccount && row.sysAccount.realName}}-->
              <!--</template>-->
            </el-table-column>
            <!--<el-table-column prop="faultDesc" label="性别" header-align="center" width="80">-->
            <!--</el-table-column>-->
            <el-table-column prop="sysOrg.orgName" label="所属部门" header-align="center" width="140">
            </el-table-column>
            <el-table-column  label="角色" header-align="center" width="250">
              <template slot-scope="scope">
                {{formatRoles(scope.row)}}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" header-align="center" width="80">
              <template slot-scope="scope">
                {{$dict.getText(scope.row.status,$dict.store.STATUSS)}}
              </template>
            </el-table-column>
             <el-table-column prop="remark" label="备注" header-align="center" >
            </el-table-column>
          </v-table>
        </el-col>
        <el-col :span="8">
            <form-panel ref="formPanel"></form-panel>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="showForm" title="分配角色">
      <role-form ref="roleForm"></role-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showMsgSubcribe" title="消息订阅设置">
      <msg-subcribe-panel ref="msgSubcribePanel" @saved="onMsgSubscribeSaved"></msg-subcribe-panel>
      <div slot="footer" class="dialog-footer">
        <el-checkbox label="selectAll" @change="onSelectAll">全选</el-checkbox>&nbsp;&nbsp;
        <el-button type="primary" @click="submitMsgSubscribeForm()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import OrgTree from '@/components/widgets/OrgTree'
import MsgSubcribePanel from './MsgSubcribePanel.vue'
import FormPanel from "./FormPanel.vue";
import RoleForm from "./RoleForm";
import { auth, fetch } from "@/utils";

export default {
  components: { FormPanel, RoleForm, OrgTree,MsgSubcribePanel },
  data() {
    return {
      showForm: false,
      showMsgSubcribe:false,
      corpId: auth.getCurrentCorpId(),
      page: {
        query: {
          orderBys:'id|desc',
          param:{
            corpId: this.corpId,
            employeeNo: undefined,
            orgId: undefined,
            sysAccount: {
              realName: undefined
            }
          }
        },
        getData: this.$api.sys.User.query
      },
      tableActions: [
        {
          name: "功能角色",
          handle: this.assignFun
        },
        {
          name: "数据角色",
          handle: this.assignData
        },
        {
          name: "消息订阅",
          handle: this.subscribeMsg
        },
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
      accountMap: {}
    };
  },
  computed: {},

  methods: {
    formatRoles(row){
      let roles = row.sysRoles||[]
      let roleNames = []
      roles.forEach(r=>roleNames.push(r.roleName))

      return roleNames.join('、');
    },
    subscribeMsg(row){
      this.showMsgSubcribe = true;
      this.$nextTick(()=>{
        this.$refs.msgSubcribePanel.$emit('init',{userId:row.id})
      })
    },
    create() {
      this.$refs.formPanel.init({});
    },
    edit(row) {
      this.$refs.formPanel.setValues(row);
      // this.$refs.formPanel.init(row);
    },

    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {type: "warning"}).then(() => {
        this.$api.sys.User.delete(row.id).then(rsp => {
          this.search();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    },
    assignFun (row) {
      this.showForm = true
      this.$nextTick(() => {
        this.$refs['roleForm'].init(1, row)
      })
    },
    assignData (row) {
      this.showForm = true
      this.$nextTick(() => {
        this.$refs['roleForm'].init(2, row)
      })
    },
    submitForm () {
      this.$refs['roleForm'].submit(rsp => {
          this.$message({type: 'success', message: '操作成功'})
          this.showForm = false
          this.search()
      })
    },
    onSelectAll(checked){
      this.$refs.msgSubcribePanel.$emit('selectAll',checked)
    },
    //提交消息订阅表单
    submitMsgSubscribeForm(){
      this.$refs.msgSubcribePanel.$emit('submit');
    },
    onMsgSubscribeSaved(){
      this.$message('保存成功!');
      this.showMsgSubcribe = false;
    },
    onDataloaded(rsp) {
      if (rsp.total < 1) return;
      // let cfgIds = rsp.model.map(m => m.accountId);
      // cfgIds.length && fetch.sys.Account.microList({ids: cfgIds}).then(rsp2 => {
      //   (this.accountMap = {}), rsp2.data.forEach(n => (this.accountMap[n.id] = n))
      // })
    },
    search() {
      this.$refs.table.load();
    }
  },
  created() {},
  mounted() {
    this.search();
    this.$refs.formPanel.$on("saved", data => {
      this.search();
    });
  }
};
</script>
