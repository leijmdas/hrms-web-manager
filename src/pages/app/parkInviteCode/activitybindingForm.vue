<template>
  <div>
    <v-table ref="table" :page="page" :table-minheight="250">
        <el-table-column prop="seq"  label="序号">
          <template slot-scope="scope"><span>{{scope.$index + 1}} </span></template>
        </el-table-column>
        <el-table-column prop="code" label="活动类型"></el-table-column>
        <el-table-column prop="name" label="活动名称"></el-table-column>
        <el-table-column prop="startOn" label="编号">
        </el-table-column>
        <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>
        </template>
      </el-table-column>
      </v-table>
  </div>
</template>
<style lang="less" scoped>
.el-upload-dragger {
  img {
    width: 300px;
    height: 300px;
  }
}
</style>

<script>
const defaultEntity = {
  id: null,
  code: "",
  name: "",
  
  status: 1,
  remark: ""
};
export default {
   props:{
    disables:Boolean,
    default:false
  },
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      types: [],
      page: {
        query: {
          orderBys: 'id|desc',
          param: {
            subjectId: undefined,
            isDeleted: false
          }
        },
        getData: this.$api.ipark.PromotionInfoService.query
      }
    };
  },
  methods: {
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
    resetForm() {
      // this.$refs["form"].resetFields();
    },
    init(options) {
      this.resetForm();
      if (options.id) {
        //loadData
        this.$api.ipark.UserInfoService.get(options.id).then(r => {
          this.entity = r;
        });
      }else{
        this.entity = {}
      }
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>