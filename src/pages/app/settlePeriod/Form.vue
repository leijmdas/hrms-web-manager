<template>
    <el-form :model="entity" :rules="rules" ref="form" label-width="100px">
        <fieldset>
            <legend>审核状态</legend>
            <el-row>
                <el-radio-group style="font-size: 30px "
                                v-model="auditStatus">
                    <div>
                        <el-radio key="3" label="3">通过</el-radio>
                    </div>
                    <div></div>
                    <div>
                        <el-radio key="4" label="4">未通过</el-radio>
                    </div>
                </el-radio-group>

            </el-row>
            <el-row>

                <el-input type="textarea" rows="6"
                          v-model="entity.auditRemark"  :clearable="true" placeholder="审核意见">

                </el-input>

            </el-row>
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
const  moment = require('moment');


const defaultEntity = {
  status: '3',
  remark: ''
};
export default {
    //components: { MerchantSelect },
    data() {
        return {
            auditStatus: '3',
            entity: _.cloneDeep(defaultEntity),
            types: [],
            rules: {
                remark: [
                    {required: true, message: '中文名称不能为空', trigger: 'blur'},
                    {
                        min: 1,
                        max: 128,
                        message: '长度在 1 到 128 个字符',
                        trigger: 'blur'
                    }
                ]

            }
        };
    },
  methods: {
    resetProps() {


    },
    setValues(vals) {
      this.resetEntity = _.cloneDeep(vals);
      this.entity = _.cloneDeep(this.resetEntity);
    },
      formatDate(now) {
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hour = now.getHours();
          var minute = now.getMinutes();
          var second = now.getSeconds();
          return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
      },
      submitForm() {
            //alert( moment().format("YYYY"));
          this.entity.auditDate = this.formatDate(new Date());
          this.entity.status = this.auditStatus;
          this.$api.ipark.SettlementPeriodService.updateTakeout(this.entity).then(
              ret => {
                  this.$api.ipark.SettlementPeriodService.updateStatusById(
                      this.entity.settlementPeriodId, this.entity.status).then(
                      rsp => {
                          this.$emit('saved', rsp);
                          this.$message('审核完成！');
                      }
                  );
              });


      },
      resetForm() {
          this.$refs['form'].resetFields();
          this.entity = _.cloneDeep(defaultEntity);
      },
      init(options) {

          // this.resetForm();
          this.entity = options;
      }
  },
    mounted() {

    this.$on('init', this.init);
    this.$on('submit', this.submitForm);
  }
};
</script>
