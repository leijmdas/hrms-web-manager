<style lang="less" >
@import "../variables";
.toolbar {
  margin: 3px 0px 3px 0;
  padding-top:3px;
  padding-bottom:3px;
  padding-right: 10px;
  line-height: 30px;
  height: 30px;

  color: #606266;

  .toolbar-title{
    font-weight: bold;
    float:left;padding-left:10px;
  }
}

.toolbar[type="success"] {
  background-color: #f0f9eb;
  color: #67c23a;
}
.toolbar[type="alert"] {
  background-color: #f4f4f5;
  color: #909399;
  .toolbar-title{
    border-color:#409eff;
  }
}
.toolbar[type="warning"] {
  background-color: #fff;
  color: #333;
}
.toolbar[type="error"] {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>
<template>
  <div class="toolbar" :type="type">
    <div class="toolbar-title">
      <span >{{title}}</span>
    </div>
    <div style="float:left">
      <slot name="tip">

      </slot>
    </div>
    <div style="float:right">
      <slot>

      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "vToolbar",
  props: {
    title: {
      type: String,
      required: false,
      default: ""
    },
    type: {
      type: String,
      required: false,
      default: "default"
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
