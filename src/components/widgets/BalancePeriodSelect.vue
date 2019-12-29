<template>
  <el-select v-model="currentValue" placeholder="请选择" :loading="loading" :clearable="clearable" :disabled="disabled" @change="handleChange" :filterable="true" >
    <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled" >
    </el-option>
  </el-select>
</template>

<style rel="stylesheet/less" lang="less">
    .el-select-dropdown__item{
        max-width: 250px;
    }
</style>
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
    disabled: {
      type: Boolean
    },
    emptyLabel: {
      required: false
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
  watch: {},
  methods: {
    handleChange(val) {
      this.$emit("change", val);
    },

    load(params = {}) {
      this.options = [];
      params._openLoading = false;
      // params.param={isDeleted:false};
      // params.limit=-1;
        this.$api.ipark.SettlementPeriodService.queryPeriod(params).then(page => {
        this.options = page.data || [];
      });
    },
    remoteSearch(query) {
      query = (query || "").replace(/\[.*\]/g, "");
      query = query.replace(/^\s+|\s+$/gm, "");
      let p = { keywords: query };
      this.load(p);
    }
  },
  created() {
    this.load();
  }
};
</script>
