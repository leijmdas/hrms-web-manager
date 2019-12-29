<template>
  <div>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">

      <el-form-item label="地锁编号" prop="code" >
        <el-input :disabled="true" v-model="entity.lockerInfo.code" ></el-input>
      </el-form-item>       
      
      <el-form-item label="所属停车场" prop="parkId" class="el-v1" :rules="[{ required: true,message:'不能为空'}]">
        <park-select  :disabled="disables" v-model="entity.parkId" :merchantId="entity.merchantId"></park-select>
      </el-form-item>
       
      <!--<el-form-item label="是否有车" prop="onstatus" class="el-v1" :rules="[{ required: true,message:'不能为空'}]">
        <el-select  :disabled="disables" v-model="entity.onstatus">
          <el-option v-for="item in $dict.store.ONSTATUSS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
      </el-form-item> 
       <el-form-item label="设备状态" prop="lockerDeviceStatus" class="el-v1" >
        <el-select  :disabled="disables" v-model="entity.lockerInfo.lockerDeviceStatus">
          <el-option v-for="item in $dict.store.LOCKERDEVICESTATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
      </el-form-item>  
       <el-form-item label="电压" prop="pressure" >
        <el-input :disabled="disables" v-model="entity.lockerInfo.pressure" ></el-input>
      </el-form-item>    
       <el-form-item label="预约状态" prop="assignStatus" class="el-v1" :rules="[{ required: true,message:'不能为空'}]">
        <el-select  :disabled="disables" v-model="entity.assignStatus">
          <el-option v-for="item in $dict.store.ASSIGNSTATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
      </el-form-item>  
       <el-form-item label="综合状态" prop="lockerIntegratedStatus" class="el-v1">
        <el-select  :disabled="disables" v-model="entity.lockerInfo.lockerIntegratedStatus">
          <el-option v-for="item in $dict.store.LOCKERINTEGRATEDSTATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
      </el-form-item> 
      <el-form-item label="摆臂状态" prop="lockerStatus" class="el-v1">
        <el-select  :disabled="disables" v-model="entity.lockerInfo.lockerStatus">
          <el-option v-for="item in $dict.store.LOCKERSTATUS" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
      </el-form-item> 
           

       <el-form-item label="最后更新时间" prop="lastCommunicationTime" >             
          <el-date-picker
          :disabled="disables"        
            v-model="entity.lockerInfo.lastCommunicationTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>    
      </el-form-item>  -->
      
      
    </el-form>
  </div>
</template>
<style lang="less" scoped>
.el-upload-dragger {
  img {
    width: 300px;
    height: 300px;
  }
}
.el-v1 {
  display:inline-block
}
</style>

<script>
import ParkSelect from '@/components/widgets/ParkSelect'
import MerchantSelect from '@/components/widgets/MerchantSelect'
import PortSelect from '@/components/widgets/PortSelect'
const defaultEntity = {
  id: null,
  code: "",
  name: "",
  parkId:null,
  merchantId:null,
  orderNo:null,
  status: 1,
  remark: ""
};
export default {
  components: { ParkSelect,MerchantSelect,PortSelect },
  props:{
    disables:Boolean,
    default:false,
    required:Boolean
  },
  data() {
    return {
      //
      entity: _.cloneDeep(defaultEntity),
      entity:{
          lockerInfo:{}
      },
      types:[],
      rules: {
        
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 128,
            message: "长度在 1 到 128 个字符",
            trigger: "blur"
          }
        ],
        status: [
          {
            type: "number",
            required: true,
            message: "请选择状态",
            trigger: "change"
          }
        ]
      },
      selectData:''
    };
  },
  methods: {
    getSelect(data){
      return data
    },
    selectLocation() {
      this.$refs.mapDiag.show({ address: this.entity.address });
    },
    onLocationClick(l) {
      this.entity.lng = l.lng;
      this.entity.lat = l.lat;
      this.$refs.mapDiag.hide();
    },
    setValues(vals) {
      this.resetEntity = _.cloneDeep(vals);
      this.entity = _.cloneDeep(this.resetEntity);
    },
    submitForm() {
      this.$refs["form"].validate((valid, err) => {
        if (valid) {
          this.$api.ipark.ParkPortService.save(this.entity).then(rsp => {
            this.$emit("saved", rsp);
          });
        }
      });
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
    init(option) {
      this.resetForm();
      console.log(option.orderNo);
      if(!option.orderNo) return;
      this.$api.ipark.BookingOrderService.findOrderNo(option.orderNo).then(r => {
        this.entity = r;
      });

    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>