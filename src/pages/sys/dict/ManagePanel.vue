<template>
  <div>
    <el-row>
      <!-- <el-col :span="16">
        <div class="panel panel-default config-category" style="width:80%">
          <ul>
            <li v-for="item in options" :key="item.id" :class="{'active': item.active}" @click="selectOption(item)">
              <span>{{item.name}}</span>
            </li>
          </ul> 
          
        </div>
        
      </el-col> -->
      <div class="panel panel-default panel-search">
      <el-form :inline="true">
        
        <el-form-item label="关键字">
          <el-input v-model="dictPage.query.keywords" placeholder="编码或名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
      <el-col :span="24">
        <v-table :page="dictPage" ref="dictTable" :table-height="300" :auto-select="true" @row-dblclick="onRowSelect">
          <el-table-column prop="id" label="编码" width="200">
            <template slot-scope="{row}">
              <span>{{row.dictCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="baseConfigId" label="名称" >
            <template slot-scope="{row}">
              <span>{{row.dictName}}</span>
            </template>
          </el-table-column>
        </v-table>
        <div class="panel panel-default">
          <el-alert type="info" :closable="false" title="">
           <el-button type="primary" :disabled="!currentDict.id" @click="addItem">新增</el-button>
           <span style="margin-left:10px">当前选中[{{currentDict.dictName}}]</span>
          </el-alert>
         
        </div>
        <v-table ref="configTable" :page-size="-1" :table-data="dataSource" >
          <el-table-column prop="id" label="ID" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="编码" width="180">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editable" v-model="scope.row.code"></el-input>
              <span v-if="!scope.row.editable">{{scope.row.code}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="值" width="200">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editable" v-model="scope.row.name"></el-input>
              <span v-if="!scope.row.editable">{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="排序号" width="80">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editable" v-model="scope.row.orderNum"></el-input>
              <span v-if="!scope.row.editable">{{scope.row.orderNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template slot-scope="scope">
              <el-input v-if="scope.row.editable" v-model="scope.row.remark"></el-input>
              <span v-if="!scope.row.editable">{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" :fixed="'right'">
            <template slot-scope="scope">
              <el-button type="text" v-if="!scope.row.editable"  @click="scope.row.editable=true">
                <i class="el-icon-edit"></i>
              </el-button>
              <el-button type="text" v-if="scope.row.editable" @click="save(scope.row)">
                <i class="el-icon-circle-check">
                </i>
              </el-button>
              <el-button type="text" @click="del(scope.row,scope.$index)">
                <i class="el-icon-delete red"></i>
              </el-button>
            </template>
          </el-table-column>
        </v-table>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped rel="stylesheet/less" lang="less">

</style>
<script>
export default {
  data() {
    return {
      dataSource: [],
      page: {},
      currentDict:{id:0},
      dictPage:{
        query:{
          param:{
            dictType:1
          }
        },
        getData:this.$api.sys.Dict.query
      }
    };
  },
  mounted() {
    this.$on('init',this.init);
  },

  methods: {
    init(options={}){
      this.search();
    },
    search(){
      
      this.$refs.dictTable.load();
    },
    onRowSelect(row){
      this.currentDict = row;
      //选择
      this.loadDictItems(row.id);
    },
    loadDictItems(id){
      this.$api.sys.Dict.get(id)
        .then(r => {
          let rs = r.items||[];
          rs.forEach(r => (r.editable = false));
          this.dataSource = rs;
        });
    },
    addItem() {
      this.dataSource.push({
        id: null,
        name: "",
        code: "",
        orderNum:0,
        status:1,
        remark: "",
        dictId: this.currentDict.id,
        editable: true
      });
    },
    save(row) {
      this.$api.sys.Dict.saveItem(row).then(data => {
        this.loadDictItems(row.dictId);
      });
    },
    del(row,index) {
      if(!row.id){
        this.dataSource.splice(index,1)
        return ;
      }
      this.$confirm("确认删除此记录吗?", "提示", {}).then(() => {
        this.$api.sys.Dict.deleteItem(row.id).then(()=>{
          this.dataSource.splice(index,1)
        });
      });
    }
  }
};
</script>
