<!--规则定义 -->
<template>
  <el-select
    v-model="currentValue"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="handleChange"
    clearable
  >
    <el-option v-for="item in options" :key="item.id" :label="'['+item.code+'] '+item.name" :value="item.id">
       <span style="float: left">{{ item.name }} [{{item.code}}]</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.discountCondition}}</span>
        <div style="clear:both">{{item.startOn}} ~ {{item.endOn}}</div>
    </el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      options: [],
      disOpts: []
    };
  },
  props: {
    value: {
      required: true
    },
    clearable: {
      type: Boolean
    },
    bizType: {
      type: Number
    },
      status: {
        type: Number
      },
    disabled: {
      type: Boolean
    }

  },
  computed: {
    currentValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    bizType(newV,oldV){
      this.remoteMethod();
    },
      status(newV,oldV) {
          this.remoteMethod();
      }
  },
  methods: {
      handleChange(val) {
          this.$emit('change', val, this.options)
      },
    remoteMethod(query) {
      let params = {
          sortBys: 'id|desc',
          keywords: query,
          param: {
            bizType: this.bizType,
            status: this.status,
            isDeleted: false
          }
        }
      this.$api.ipark.PromotionInfoService.query(params).then(rsp=>{
        this.options = rsp.data||[]
      });
    }
  },
  created() {
    this.remoteMethod();
  }
};
</script>
