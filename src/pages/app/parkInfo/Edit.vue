<template>
  <div>
    <v-toolbar title="停车场信息" type="warning">
      <div v-if="park!=null" slot="tip" style="margin-left:10px">
        编码:{{park.code}}
      </div>
      <el-button-group>
        <el-button type="primary" plain @click="()=>{$bus.$emit('app:flush')}">刷新</el-button>
        <el-button  @click="()=>{$bus.$emit('app:goback')}">返回</el-button>
      </el-button-group>
    </v-toolbar>
    <el-tabs type="border-card" v-model="currentTab" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="first">
        <form-panel @saved="onFormSaved" @loaded="onFormLoaded" ref="formPanel"></form-panel>
      </el-tab-pane>

      <el-tab-pane label="楼层信息" name="second" :disabled="!id">
        <area-manage-panel ref="floorPanel"></area-manage-panel>
      </el-tab-pane>
      <el-tab-pane label="通道信息" name="channel" :disabled="!this.id">
        <channel-panel ref="channelPanel"></channel-panel>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<style lang="less" >
</style>

<script>
    import FormPanel from './Form';
    import AreaManagePanel from './AreaManage';
    import ChannelPanel from './Channel';

    export default {
  components: { FormPanel, AreaManagePanel,ChannelPanel },
  data() {
    return {
      id: 0,
      currentTab: 'first',
      park:null
    };
  },
  methods: {
    handleClick(tab) {
      let $form = null;
      if (tab.name == 'first') {
        $form = this.$refs.formPanel;
      } else if (tab.name == 'second') {
        $form = this.$refs.floorPanel;
      } else if(tab.name=='channel'){
        $form = this.$refs.channelPanel;
      }
      this.$emit('tabChange', tab.index || 0);
      $form.$emit('init', { id: this.id });
    },
      onFormLoaded(park) {
          this.park = park;
      },
      init(options = {}) {
          this.id = options.id;
          this.currentTab = 'first';
          this.handleClick({name: 'first'});
      },
    onFormSaved(rsp) {
      this.id = rsp;
      this.$message('保存成功');
    },
    onFormSaved2(rsp) {
      this.$message('保存成功');
    }
  },
  mounted() {
    this.$on('init', this.init);
  }
};
</script>
