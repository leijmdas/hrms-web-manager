<template>
  <el-form :model="entity" :rules="rules" ref="form" label-width="110px">
    <fieldset>
      <legend>基本信息</legend>

      <el-form-item label="名称" prop="name">
        <el-input v-model="entity.name"></el-input>
      </el-form-item>
        <el-row>
          <el-col :span="8">
              <el-form-item label="支付类型" prop="type">
            <el-select v-model="entity.type" @change="resetProps" style="width: 100%">
              <el-option v-for="item in $dict.store.PAY_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
            </el-select>
              </el-form-item>
          </el-col>
            <el-col :span="8">
                <el-form-item label="账户类型" prop="accountType">
                    <el-select v-model="entity.accountType" @change="resetProps" style="width: 100%">
                        <el-option v-for="item in $dict.store.ACCOUNT_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
          <el-col :span="8" v-show="entity.type==3"> <!--好收-->
              <el-checkbox label="支持支付宝支付" v-model="entity.supportAli"></el-checkbox>
              <el-checkbox label="支持微信支付" v-model="entity.supportWeixin" ></el-checkbox>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="主体类型" prop="subjectType">
                    <el-select v-model="entity.subjectType" @change="entity.merchantId = entity.subjectType == 0 ? 0 : undefined" style="width: 100%">
                        <el-option v-for="item in $dict.store.ACCOUNT_SUBJECT_TYPE" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
      <!-- <el-form-item label="商户帐户">
        <el-switch v-model="entity.isMerchant" active-text="是" inactive-text="">
        </el-switch>
      </el-form-item> -->
              <el-form-item label="所属分公司" prop="merchantId" v-if="entity.subjectType == 1">
                  <branch-company-select v-model="entity.merchantId" style="width: 100%"></branch-company-select>
              </el-form-item>
              <el-form-item label="所属商户" prop="merchantId" v-if="entity.subjectType == 2">
                  <merchant-select v-model="entity.merchantId" style="width: 100%"></merchant-select>
              </el-form-item>
            </el-col>
        </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="entity.remark"></el-input>
      </el-form-item>
    </fieldset>
    <fieldset v-if="entity.props.length">
      <legend>帐户属性</legend>
      <el-form-item v-for="(item, index) in entity.props" :key="item.propName" :label="item.propName" :prop="'props.'+index+'.propValue'" :rules="{
        required: item.required, message: '不能为空', trigger: 'blur'
      }">
        <settle-account-select v-if="item.type == 'vMchSel'"  v-model="item.propValue" :type="entity.type" :accountType="2" />
        <el-input v-else v-model="item.propValue"></el-input>
      </el-form-item>
    </fieldset>

  </el-form>
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
import MerchantSelect from "@/components/widgets/MerchantSelect";
import SettleAccountSelect from "@/components/widgets/SettleAccountSelect";
import BranchCompanySelect from "@/components/widgets/BranchCompanySelect";
import { defines, getPropFields } from "./SettleAccountPropDefine";

const defaultEntity = {
  id: null,
  type: 0,
  status: 1,
  accountType: 3,
  merchantId: null,
  subjectType: 2,
  props: [],
  supportAli:false,
  supportWeixin:false,
  remark: ""
};
export default {
  components: { MerchantSelect, SettleAccountSelect, BranchCompanySelect },
  data() {
    return {
      entity: _.cloneDeep(defaultEntity),
      types: [],
      rules: {
        name: [
          { required: true, message: "中文名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 32,
            message: "长度在 1 到 3 个字符",
            trigger: "blur"
          }
        ],
        type: [
          {
            type: "number",
            required: true,
            message: "请选择类型",
            trigger: "change"
          }
        ],
        accountType: [
          {
            type: "number",
            required: true,
            message: "请选择账户类型",
            trigger: "change"
          }
        ],
        subjectType: [
          {
            type: "number",
            required: true,
            message: "请选择主体类型",
            trigger: "change"
          }
        ],
        merchantId: [
          {
            type: "number",
            required: true,
            message: "请选择主体",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    resetProps() {
      let type = this.entity.type;
      if (type == null) {
        this.$message("请选择帐户类型");
        return;
      }

      let items = getPropFields(type);

      let props = this.entity.props || [];
      let propsMap = {};
      for (let i = 0; i < props.length; i++) {
        let p = props[i];
        propsMap[p.propKey] = p;
      }
      props.splice(0, props.length);
      for (let i = 0; i < items.length; i++) {
        let r = items[i];
        if (!r.accountType.includes(this.entity.accountType)) {
          continue;
        }
        props.push({
          propName: r.name,
          propKey: r.key,
          type: r.type,
          propValue: propsMap[r.key] == null ? (r.defaultValue || '') : propsMap[r.key].propValue,
          id: propsMap[r.key] == null ? "" : propsMap[r.key].id,
          required: !!r.required
        });
      }
      this.entity.props = props;
    },
    setValues(vals) {
      this.resetEntity = _.cloneDeep(vals);
      this.entity = _.cloneDeep(this.resetEntity);
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let params = this.entity;
          if (this.entity.subjectType == 0) {
            params.merchantId = 0;
          }
          this.$api.ipark.SettleAccountService.save(params).then(rsp => {
            this.$emit("saved", rsp);
          });
        }
      });
    },
    resetForm() {
      this.$refs["form"].resetFields();
      this.entity = _.cloneDeep(defaultEntity);
    },
    init(options) {

      this.resetForm();
      if (options.id) {
        //loadData
        this.$api.ipark.SettleAccountService.get(options.id).then(r => {
          this.entity = r;
          this.entity.props = r.props || [];
          this.resetProps();
        });
      }
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("submit", this.submitForm);
  }
};
</script>
