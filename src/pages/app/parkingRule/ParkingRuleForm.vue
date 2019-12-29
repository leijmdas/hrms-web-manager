<!--计费规则
import ParkSelectVue from '../../../components/widgets/ParkSelect.vue';
根据实际规则模板，定制视图

-->
<template>
  <div>
    <el-form :model="entity" :rules="rules" ref="form" label-width="140px">
        <el-alert v-if="!entity.id" title="计费规则尚未保存！" show-icon type="warning" :closable="false" style="margin-bottom:10px">
        </el-alert>
      <el-form-item label="计费模板" prop="ruleTplCode">
        <el-select v-model="entity.ruleTplCode" @change="onTplChange">
          <el-option v-for="item in ruleTpls" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="免费时长" :prop="`props.freeMinutes`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }">
        <el-input v-model="entity.props['freeMinutes']" v-numberInt="0">
          <template slot="append">分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="封顶费用" :prop="`props.dayMaxAmount`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }">
        <el-input v-model="entity.props['dayMaxAmount']" placeholder="24小时封顶费用（0表示不封顶）" v-numberInt="2">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <template v-if="entity.ruleTplCode=='parking:timelong'">
        <el-form-item label="标准费用" :required="true" class="standardFeeItem" style="width:400px">
          <el-col :span="11">
            <el-form-item :prop="`props.standardAmount`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }">
              <el-input v-model="entity.props['standardAmount']" placeholder="" v-numberInt="2">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-form-item :prop="`props.standardUnit`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }">
              <el-input v-model="entity.props['standardUnit']" placeholder="" v-numberInt="0">
                <template slot="append">分</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-alert title="时段费用" :closable="false" style="margin-bottom:10px">
          <el-button type="text" @click="addItem">添加</el-button>

        </el-alert>

        <el-row v-for="(item,index) in entity.props['billLevels']" :key="index">
          <el-col :span="2">
            <el-form-item label="序号">{{index+1}}
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时段长度" prop="timeLong">
              <el-input v-model="item.minutes" placeholder="" v-numberInt="0">
                <template slot="append">分</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="费用" prop="timeLong">
              <el-input v-model="item.amount" placeholder="" v-numberInt="2">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="padding-left:10px">
            <el-button type="text" @click="deleteItem(row,index)">删除</el-button>
          </el-col>
        </el-row>

      </template>
      <template v-if="entity.ruleTplCode=='parking:frequency'">
        <el-form-item label="标准费用" :prop="`props.perAmount`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }" class="standardFeeItem">
          <el-input placeholder="" v-model="entity.props.perAmount" v-numberInt="2">
            <template slot="append">元/次</template>
          </el-input>
        </el-form-item>
      </template>
      <template v-if="entity.ruleTplCode=='parking:timerange'">
        <el-form-item label="标准费用" prop="timeLong" class="standardFeeItem" style="width:400px" :required="true">
          <el-col :span="11">
            <el-form-item :prop="`props.standardAmount`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }">
              <el-input placeholder="" v-model="entity.props['standardAmount']" v-numberInt="2">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">/</el-col>
          <el-col :span="11">
            <el-form-item :prop="`props.standardUnit`" :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }">
              <el-input placeholder="" v-model="entity.props['standardUnit']" v-numberInt="0">
                <template slot="append">分</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-alert title="时段费用" :closable="false" style="margin-bottom:10px">
          <el-button type="text" @click="addItem">添加</el-button>

        </el-alert>
        <el-row v-for="(item,index) in entity.props['billLevels']" :key="index">
          <el-col :span="2">
            <el-form-item label="序号">{{index+1}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时段" prop="timeLong">
              <el-col :span="12">
                <el-time-select placeholder="起始" v-model="item.startTime" :picker-options="{
      start: '00:00',
      step: '00:15',
      end: '24:00'
    }" style="width:100px">
                </el-time-select>
              </el-col>
              <el-col :span="12">
                <el-time-select placeholder="结束" v-model="item.endTime" :picker-options="{
      start: '00:00',
      step: '00:15',
      end: '24:00',
      minTime: item.startTime
    }" style="width:100px">
                </el-time-select>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="费用" prop="timeLong">
              <el-input placeholder="" v-model.number="item.amount" v-numberInt="2">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="padding-left:10px">
            <el-button type="text" @click="deleteItem(row,index)">删除</el-button>
          </el-col>
        </el-row>
      </template>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="entity.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="less" scoped>
.standardFeeItem {
  .el-input {
    width: 120px;
  }
}
.line {
  text-align: center;
}
</style>

<script>
const defaultEntity = {
  id: null,
  code: "",
  name: "",
  ruleTplCode: "parking:timelong",
  props: {},
  status: 1,
  remark: ""
};
export default {
  components: {},
  data() {
    return {
      timeLongFees: [], //时段长度
      entity: _.cloneDeep(defaultEntity),
      ruleType:2,
      types: [],
      ruleTpls: [
        ["parking:timelong", "按时长计费"],
        ["parking:frequency", "按次计费"],
        ["parking:timerange", "按时段计费"]
      ],
      rules: {
        ruleTplCode: [
          { required: true, message: "请选择计费模板", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    onTplChange(newV) {
      let defaultProps = {},_props={};
      switch (newV) {
        case "parking:timelong":
          defaultProps = {
            dayMaxAmount: 35,
            freeMinutes: 15,
            standardAmount: 10,
            standardUnit: 60
          };
          _props = Object.assign(defaultProps,this.entity.props);
          this.$set(this.entity, "props",_props );
          break;
        case "parking:frequency":
          defaultProps = {
            dayMaxAmount: 35,
            freeMinutes: 15,
            perAmount: 10
          }
          _props = Object.assign(defaultProps,this.entity.props);
          this.$set(this.entity, "props",_props );
          break;
        case "parking:timerange":
          defaultProps = {
            dayMaxAmount: 35,
            freeMinutes: 15,
            standardAmount: 10,
            standardUnit: 60
          };
          _props = Object.assign(defaultProps,this.entity.props);
          this.$set(this.entity, "props",_props);
          break;
      }
    },
    addItem() {
      let billLevels = this.entity.props["billLevels"];
      if (!billLevels) {
        this.$set(this.entity.props, "billLevels", []);
      }
      this.entity.props["billLevels"].push({ minutes: 30, amount: 5 });
    },
    deleteItem(row, index) {
      let billLevels = this.entity.props["billLevels"];
      billLevels.splice(index, 1);
    },
    preHandleProps(props) {
      let _r = {};
      for (let attr in props) {
        let val = props[attr];
        if (val instanceof Array) {
          let rs = val || [];
          for (let i = 0; i < rs.length; i++) {
            let rVal = rs[i];
            for (let rAttr in rVal) {
              _r[attr + "[" + i + "]." + rAttr] = rVal[rAttr];
            }
          }
        } else {
          _r[attr] = val;
        }
      }
      return _r;
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
       //保存计费规则
      let p = Object.assign({}, this.entity);
      p.parkId = this.parkId;
      p.type = this.ruleType;
      //数组处理
      //let _props = this.preHandleProps(p.props);
      //p.props = _props;
      p.ruleParams = JSON.stringify(p.props);
      this.$refs["form"].validate((valid, err) => {
        if (valid) {
          this.$api.ipark.ParkingRuleService.save(p).then(id => {
            this.entity.id = id;
            this.$message('保存成功!')
          });
        }
      });
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
    init(options) {
      this.resetForm();
      this.parkId = options.parkId;
      if (this.parkId) {
        //loadData
        this.$api.ipark.ParkingRuleService.findRule(this.parkId,this.ruleType).then(r => {
          let _r = _.cloneDeep(defaultEntity);
          if(r){
            _r =r;
          }
          if(_r.ruleParams){
            _r.props = JSON.parse(_r.ruleParams);
          }
          this.entity = _r;
          this.onTplChange(_r.ruleTplCode);//默认
        });
      }
      //初始化之后，动态赋值必填项目
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>
