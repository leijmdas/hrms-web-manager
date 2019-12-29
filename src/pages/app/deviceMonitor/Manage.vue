<!--设备告警管理-->
<template>
  <div>
    <div class="panel panel-default panel-search">
      <el-form :inline="true">
        <el-form-item label="停车场">
          <park-select v-model="page.query.param.parkId" :clearable="true"></park-select>
        </el-form-item>       
        <el-form-item label="地锁编号">
          <el-input v-model="page.query.param.lockerInfo.code" :clearable="true" ></el-input>
        </el-form-item>
        <el-form-item label="车位状态">
          <el-select v-model="page.query.param.onstatus" :clearable="true">
          <el-option v-for="item in $dict.store.ONSTATUSS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备状态">
          <el-select v-model="page.query.param.lockerInfo.lockerDeviceStatus" :clearable="true">
          <el-option v-for="item in $dict.store.LOCKERDEVICESTATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>        
        <el-form-item label="预约状态">
          <el-select v-model="page.query.param.assignStatus" :clearable="true">
          <el-option v-for="item in $dict.store.ASSIGNSTATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="综合状态">
          <el-select v-model="page.query.param.lockerInfo.lockerIntegratedStatus" :clearable="true">
          <el-option v-for="item in $dict.store.LOCKERINTEGRATEDSTATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摆臂状态">
          <el-select v-model="page.query.param.lockerInfo.lockerStatus" :clearable="true">
          <el-option v-for="item in $dict.store.LOCKERSTATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search" v-keycode="'ENTER'">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--<v-toolbar title="数据列表" type="alert">
      <el-button type="primary" plain @click="create">新增</el-button>
    </v-toolbar>-->
    <v-table ref="table" :page="page" :table-minheight="450" class="panel-main">       
      <el-table-column prop="code" label="地锁编号" width="140">
        <template slot-scope="{row}">{{(row.lockerInfo||{}).code}}</template>
      </el-table-column>               
      <el-table-column prop="companyName" label="所属停车场" width="120">
        <template slot-scope="{row}">{{(row.parkInfo||{}).name}}</template>
      </el-table-column>
      <el-table-column prop="code" width="120" label="泊位编号"></el-table-column>      
       <el-table-column prop="electricQuantity" width="60" label="电量"></el-table-column>
      <el-table-column prop="onstatus" width="80" label="是否有车">
        <template slot-scope="scope">{{scope.row.onstatus===1?'有车':'无车'}}</template>
      </el-table-column>     
      <el-table-column prop="lockerDeviceStatus" width="80" label="设备状态">
        <template slot-scope="{row}">
          <span v-if='(row.lockerInfo||{}).lockerDeviceStatus===0'>运行正常</span>
　　      <span v-else-if='(row.lockerInfo||{}).lockerDeviceStatus===1'>断线异常</span>
　　      <span v-else></span>
        </template>
      </el-table-column>  
       
      <el-table-column prop="lockerVoltageStatus" width="70" label="电压状态">
        <template slot-scope="{row}">
          <span v-if='(row.lockerInfo||{}).lockerVoltageStatus===0'>正常</span>
　　      <span v-else-if='(row.lockerInfo||{}).lockerVoltageStatus===1'>low</span>
          <span v-else-if='(row.lockerInfo||{}).lockerVoltageStatus===2'>lost</span>          
　　      <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="assignStatus" width="80" label="预约状态">
        <template slot-scope="scope">{{scope.row.assignStatus===1?'已预约':'未预约'}}</template>
      </el-table-column> 
      
      <el-table-column prop="lockerIntegratedStatus" width="100" label="综合状态">
        <template slot-scope="{row}">
          <span v-if='(row.lockerInfo||{}).lockerIntegratedStatus===0'>正常</span>
　　      <span v-else-if='(row.lockerInfo||{}).lockerIntegratedStatus===1'>断线异常</span>
          <span v-else-if='(row.lockerInfo||{}).lockerIntegratedStatus===2'>地锁阻挡异常</span>
          <span v-else-if='(row.lockerInfo||{}).lockerIntegratedStatus===3'>地磁异常</span>
          <span v-else-if='(row.lockerInfo||{}).lockerIntegratedStatus===4'>雷达异常</span>
　　      <span v-else></span>
        </template>
      </el-table-column>

      <el-table-column width="100" label="设备告警状态">
        <template slot-scope="scope">{{scope.row.assignStatus===1 && (scope.row.lockerInfo||{}).lockerDeviceStatus===1?'告警':'未告警'}}</template>
      </el-table-column> 

      <el-table-column prop="lockerStatus" width="80" label="摆臂状态">
        <template slot-scope="{row}">
          <span v-if='(row.lockerInfo||{}).lockerStatus===0'>已下降</span>　　    
          <span v-else-if='(row.lockerInfo||{}).lockerStatus===2'>已上升</span>          
　　      <span v-else></span>
        </template>
      </el-table-column>  
      <el-table-column prop="version" label="地锁版本型号" width="60">
        <template slot-scope="{row}">{{(row.lockerInfo||{}).version}}</template>
      </el-table-column>    
      <el-table-column prop="lastCommunicationTime" label="最后更新时间" >
        <template slot-scope="{row}">{{(row.lockerInfo||{}).lastCommunicationTime}}</template>
      </el-table-column> 
      
     <!-- <el-table-column width="100" label="操作" :fixed="'right'">
        <template slot-scope="scope">        
           <el-button type="text" title="查看" @click="share(scope.row)">
            <i class="el-icon-share"></i>
          </el-button> 
          <el-button type="text" title="编辑" @click="edit(scope.row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="text" @click="del(scope.row,scope.$index)" title="删除">
            <i class="el-icon-delete red"></i>
          </el-button>
        </template>
      </el-table-column>-->
    </v-table>
    <v-dialog  :title="xianshi" ref="formDiag">
      <form-panel @saved="onFormSaved" :disables="disable"></form-panel>
      <div slot="footer">
        <el-button type="primary" v-if="shares==true" @click="$refs.formDiag.dispatch('submit')">保存</el-button>
        <el-button @click="()=>{this.$refs.formDiag.hide();}">取消</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<style rel="stylesheet/less" scoped lang="less">
</style>
<script>
import ParkSelect from '@/components/widgets/ParkSelect'
import CorpSelect from "@/components/widgets/CorpSelect.vue";
import MerchantSelect from "@/components/widgets/MerchantSelect.vue";
import FormPanel from "./Form";

export default {
  components: { CorpSelect, FormPanel, MerchantSelect,ParkSelect },
  data() {
    return {
      formStatus: 1,
      qrCode:{},
      xianshi:"新增地锁",
      page: {
        query: {
          sortBys: "id|desc",
          param: { isDeleted: false,
            parkInfo:{
              name:''
            },
            lockerInfo:{
              lockerDeviceStatus:'',
              code:'',
              lockerIntegratedStatus:'',
              pressure:'',
              lastCommunicationTime:''
            }
           }
        },
        getData: this.$api.ipark.ParkPortService.queryLeft
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
       this.xianshi="新增地锁";
      this.$refs.formDiag.show({});
      this.shares=true; 
      this.disable=false 
    },
    share(row) {
      this.$refs.formDiag.show({ id: row.id }); 
      this.shares=false; 
      this.disable=true    
    },
    edit(row) {
       this.xianshi="信息编辑";
      this.$refs.formDiag.show({ id: row.id });
      this.shares=true; 
      this.disable=false 
    },
    del(row) {
      this.$confirm("确定删除此条记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.$api.ipark.ParkPortService.delete(row.id).then(rsp => {
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
