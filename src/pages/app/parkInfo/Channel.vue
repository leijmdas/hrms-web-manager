<template>
  <div>
    <el-alert title="" type="info" :closable="false">
      <el-button type="primary" @click="addItem">添加</el-button>
    </el-alert>
    <v-table :page-size="0" :table-minheight="200" :table-data="tableData">
      <el-table-column prop="code" label="编码" width="150">
        <template slot-scope="{row}">
          <el-input placeholder="字母、数字、下划线" v-model="row.code" v-if="row.editable"></el-input>
          <span v-else>{{row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200">
        <template slot-scope="{row}">
          <el-input placeholder="请输入名称" v-model="row.name" v-if="row.editable"></el-input>
          <span v-else>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="{row}">
        <el-select  v-model="row.type" v-if="row.editable" >
          <el-option v-for="item in $dict.store.PARK_CHANNELTYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
        <span v-else>{{$dict.getText(row.type,$dict.store.PARK_CHANNELTYPE)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" >
         <template slot-scope="{row}">
          <el-input placeholder="备注" v-model="row.remark" v-if="row.editable" ></el-input>
          <span v-else>{{row.remark}}</span>
         </template>
      </el-table-column>
       <el-table-column label="操作" width="80" >
         <template slot-scope="scope">
           <el-button type="text" v-show="scope.row.id" title="扫码支付二维码" @click="flushQrCode(scope.row)">
            <icon name="qrcode"></icon>
          </el-button>
          <el-button type="text" title="保存" @click="save(scope.row)" v-if="scope.row.editable">
            <i class="el-icon-circle-check"></i>
          </el-button>
          <el-button type="text" title="编辑" @click="edit(scope.row)" v-else>
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>
        </template>
      </el-table-column>
    </v-table>

    <v-dialog title="通道二维码" ref="qrDiag" width="600px">
      <el-alert title="链接" type="warning" :description="qrCode.content" :closable="false"></el-alert>
      <div class="panel panel-default" style="text-align:center;padding:10px">
        <img :src="qrCode.imgUrl"/>
      </div>
    </v-dialog>
  </div>
</template>
<style lang="less">

</style>

<script>
import FormPanel from "./Form";
const defaultLicense = {};
export default {
  components: { FormPanel },
  data() {
    return {
      id: null,
      qrCode:{},
      tableData:[]
    };
  },
  methods: {
    addItem(){
      this.tableData.push({
        id:null,
        code:'',
        name:'',
        type:1,
        status:1,
        remark:'',
        editable:true
      })
    },
    edit(row){
      row.editable =true;
    },
    del(row,index){
      this.$confirm('确认删除此通道吗?','确认').then(r=>{
        this.$api.ipark.ParkChannelService.delete(row.id).then(()=>{
          this.tableData.splice(index,1);
        });
      })
    },
    save(row) {
      let params = Object.assign({},row);
      params.parkId = this.parkId;
      this.$api.ipark.ParkChannelService.save(params).then(rsp=>{
        this.search();
        this.$message('操作成功!');
      });
    },
    search(){
       this.$api.ipark.ParkChannelService.query({param:{parkId:this.parkId,isDeleted:false}}).then(rsp => {
        let _rs = rsp.data||[];
        _rs.forEach(r=>r.editable=false);
        this.tableData = _rs;
      });
    },
    flushQrCode(row) {
      this.$refs.qrDiag.show()
      this.$nextTick(()=>{
        this.$api.ipark.ParkChannelService.scanQr(row.id).then(r => {
          this.qrCode = r||{}
        });
      });
    },
    init(options = {}) {
      this.parkId = options.id;
     
      if(this.parkId){
        this.search()
      }
    }
  },

  created() {
    this.$on("init", this.init);
  }
};
</script>