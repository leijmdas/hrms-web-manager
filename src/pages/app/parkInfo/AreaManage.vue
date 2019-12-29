<!--停车场管理-->
<template>
  <div>
    <el-alert title="" type="warning" :closable="false">
      <el-button type="primary" plain @click="create">添加楼层</el-button>
    </el-alert>
    <v-table ref="table" :page-size="-1" :table-data="tableData" :table-minheight="200" class="panel-main" @row-dblclick="onSelectFloor" :auto-select="true">
        <el-table-column prop="code" width="100" label="排序">
            <template slot-scope="{row}">
                <el-input-number type="text" placeholder="只能为数字" v-model="row.seq" v-if="row.editable"controls-position="right" :precision="0" style="width:80px"></el-input-number>
                <span v-else>{{row.seq}}</span>
            </template>
        </el-table-column>
      <el-table-column prop="code" width="140" label="编码">
        <template slot-scope="{row}">

          <el-input-number type="text" placeholder="只能为数字" v-model="row.code" v-if="row.editable"controls-position="right" :precision="0"></el-input-number>
          <span v-else>{{row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot-scope="{row}">
          <el-input type="text" placeholder="名称" v-model="row.name" v-if="row.editable"></el-input>
          <span v-else>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isNavigation" label="是否有室内导航">
        <template slot-scope="{row}">
          <el-select v-model="row.isNavigation" v-if="row.editable">
            <el-option :value="true" label="有"></el-option>
            <el-option :value="false" label="无"></el-option>
          </el-select>
          <span v-else>{{row.isNavigation ? '有' : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="{row}">
          <el-input type="text" placeholder="备注" v-model="row.remark" v-if="row.editable"></el-input>
          <span v-else>{{row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="保存" @click="save(scope.row)" v-if="scope.row.editable">
            <i class="el-icon-success"></i>
          </el-button>
          <el-button type="text" title="编辑" @click="edit(scope.row)" v-if="!scope.row.editable">
            <i class="el-icon-edit"></i>
          </el-button>
          <!--<el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>-->
        </template>
      </el-table-column>
    </v-table>
    <el-alert title="" type="success" :closable="false">
      <el-button type="primary" plain @click="createArea" :disabled="currentFloor==null">添加区域</el-button>
      <span v-if="currentFloor">
        {{currentFloor.name}} 【{{currentFloor.code}}】
      </span>
    </el-alert>
    <v-table ref="table" :page-size="-1" :table-data="tableDataArea" :table-minheight="200" class="panel-main" >
      <el-table-column prop="code" width="140" label="编码">
        <template slot-scope="{row}">

          <el-input-number type="text" placeholder="只能为数字" v-model="row.code" v-if="row.editable" :precision="0"></el-input-number>
          <span v-else>{{row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称">
        <template slot-scope="{row}">
          <el-input type="text" placeholder="名称" v-model="row.name" v-if="row.editable"></el-input>
          <span v-else>{{row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注">
        <template slot-scope="{row}">
          <el-input type="text" placeholder="备注" v-model="row.remark" v-if="row.editable"></el-input>
          <span v-else>{{row.remark}}</span>
        </template>
      </el-table-column>

      <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">
          <el-button type="text" title="保存" @click="saveArea(scope.row)" v-if="scope.row.editable">
            <i class="el-icon-success"></i>
          </el-button>
          <el-button type="text" title="编辑" @click="editArea(scope.row)" v-if="!scope.row.editable">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="text" @click="delArea(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>
        </template>
      </el-table-column>
    </v-table>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import ParkSelect from "@/components/widgets/ParkSelect";
import ParkFloorSelect from "@/components/widgets/ParkFloorSelect";
export default {
  components: { ParkSelect, ParkFloorSelect },
  data() {
    return {
      parkId: null,
      currentFloor: null,
      tableData: [],
      tableDataArea: []
    };
  },
  computed: {},

  methods: {
    create() {
      this.tableData.push({
        id: null,
        seq: 0,
        code: 0,
        name: "",
        status: 1,
        remark: "",
        isnavigation:"",
        editable: true
      });
    },
    save(row) {
      let param = _.cloneDeep(row);
      if (param.code === "") {
        this.$message("编码不能为x空");
        return;
      }
      if (param.name == "") {
        this.$message("名称不能为空");
        return;
      }
      param.parkId = this.parkId;
      this.$api.ipark.ParkFloorService.save(param).then(id => {
        row.id = id;
        row.editable = false;
        this.search();
      });
    },
    edit(row) {
      row.editable = true;
    },
    del(row, index) {
      if (!row.id) {
        this.tableData.splice(index, 1);
        return;
      }
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.ParkFloorService.delete(row.id).then(rsp => {
          this.search();
        });
      });
    },
    onSelectFloor(row){
      this.currentFloor = row;
      this.tableDataArea = [];
      this.$api.ipark.ParkAreaService.query({
        param: { parkId: this.parkId, floorId: this.currentFloor.id, deleted: false },
        orderBys: 'id|desc',
        limit: -1,
        start: 0,
        _openLoading: false
      }).then(rsp => {
        let rs = rsp.data || [];
        rs.forEach(r => (r.editable = false));
        this.tableDataArea = rs;
      });
    },
    createArea() {
      this.tableDataArea.push({
        id: null,
        code: 0,
        floorId: this.currentFloor.id,
        name: "",
        status: 1,
        remark: "",
        editable: true
      });
    },
    saveArea(row) {
      let param = _.cloneDeep(row);
      if (param.code === "") {
        this.$message("编码不能为x空");
        return;
      }
      if (param.name == "") {
        this.$message("名称不能为空");
        return;
      }
      param.parkId = this.parkId;
      param.floorId = this.currentFloor.id;
      this.$api.ipark.ParkAreaService.save(param).then(id => {
        row.id = id;
        row.editable = false;
      });
    },
    editArea(row) {
      row.editable = true;
    },
    delArea(row, index) {
      if (!row.id) {
        this.tableDataArea.splice(index, 1);
        return;
      }
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.ParkAreaService.delete(row.id).then(rsp => {
          this.tableDataArea.splice(index, 1);
        });
      });
    },
    init(options = {}) {
      this.parkId = options.id;
      this.search();
    },
    search() {
      this.$api.ipark.ParkFloorService.query({
        param: { parkId: this.parkId, deleted: false },
        orderBys: 'seq|desc,id|desc',
        limit: -1,
        start: 0,
        _openLoading: false
      }).then(rsp => {
        let rs = rsp.data || [];
        rs.forEach(r => (r.editable = false));
        this.tableData = rs;
      });
    }
  },
  created() {},
  mounted() {
    this.$on("init", this.init);
  }
};
</script>
