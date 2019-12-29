<!--客户资料管理-->
<template>
  <div class="role-manage-panel">
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item prop="type" label="角色类型">
          <el-select v-model="page.query.param.type" label="请选择" clearable>
            <el-option v-for="item in $dict.store.ROLE_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="page.query.param.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="page.query.param.roleName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" >查询</el-button>
          <el-button @click="create">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-table">
      <el-row>
        <el-col :span="16">
          <v-table ref="table" :page="page" :actions="tableActions" :auto-select="true" @dataloaded="onDataloaded" @row-dblclick="this.edit" :table-minheight="400">

            <el-table-column prop="roleCode" label="编码" header-align="center" width="200">
            </el-table-column>
            <el-table-column prop="roleName" label="名称" header-align="center" width="150">
            </el-table-column>
            <el-table-column prop="type" label="类型" header-align="center" width="80">
              <template slot-scope="scope">
                {{$dict.getText(scope.row.type,$dict.store.ROLE_TYPE)}}
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
    <el-dialog :visible.sync="showForm" title="授权资源">
      <resource-form ref="resourceForm"></resource-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style rel="stylesheet/less" lang="less">
</style>
<script>
import FormPanel from "./FormPanel";
import ResourceForm from "./ResourceForm";
import { auth, fetch } from "@/utils";

export default {
  components: { FormPanel, ResourceForm },
  data() {
    return {
      showForm: false,
      corpId: auth.getCurrentCorpId(),
      page: {
        query: {
          param: {
            corpId: this.corpId,
            roleCode: undefined,
            roleName: undefined
          }
        },
        getData: this.$api.sys.Role.query
      },
      tableActions: [{
          name: "授权资源",
          handle: this.assign
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
      ]
    };
  },
  computed: {},

  methods: {
    create() {
      this.$refs.formPanel.init({});
    },
    edit(row) {
      this.$refs.formPanel.setValues(row);
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.sys.Role.delete(row.id).then(rsp => {
          this.search();
          this.$message({type: "success", message: "删除成功!"});
        });
      });
    },
    assign (row) {
      this.showForm = true
      this.$nextTick(() => {
        this.$refs['resourceForm'].init(row)
      })
    },
    submitForm () {
      this.$refs['resourceForm'].submit(rsp => {
        this.$message({type: 'success', message: '操作成功'})
        this.showForm = false
        this.search()
      })
    },
    onDataloaded(rsp) {
      if (rsp.total < 1) return;
      // let cfgIds = rsp.model.map(m => m.workTypeId);
      //按ID加载
    },
    search() {
      this.$refs.table.load();
    }
  },
  created() {},
  mounted() {
    this.search();
    this.$refs.formPanel.$on("saved", () => {
      this.search();
    });
  }
};
</script>
