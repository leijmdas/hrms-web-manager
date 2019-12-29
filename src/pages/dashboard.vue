<template>
    <div>
        <div class="panel panel-default processPanel" >
            <span class="title">
                <i class="el-icon-menu"></i>我的流程</span>
            <el-button-group>
                <!-- TODO 需要绑定到菜单权限上。即v-perm指令 -->
                <el-button type="primary" @click="toLink('vehicle:order:edit')" v-perm="''">采购</el-button>
                <el-button type="danger">维修</el-button>
                <el-button type="primary">仓储入库</el-button>
                <el-button type="danger">仓储出库</el-button>
            </el-button-group>
        </div>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>
                    <i class="el-icon-time">待办事项</i>
                </span>
                <el-button style="float: right; padding: 3px 0" type="text">更多</el-button>
            </div>
            <ul class="todoUL">
                <el-alert type="info" :closable="false" v-show="todoList.length<1" title="">暂无待办事项</el-alert>
                <li v-for="item in todoList" :key="item.id">
                    <el-button type="text" @click="handle(item)">{{item.procDefName}} - {{item.name}}[{{item.procName}}]</el-button>
                    <span>
                        <label>{{item.createTime}}</label>
                        <el-button type="text" @click="handle(item)">处理</el-button>    
                    </span>
                </li>
            </ul>
        </el-card>
    </div>
</template>
<style lang="less" scoped>
.todoUL {
  li {
    list-style-type: disc;
        list-style-type: disc;
    line-height: 30px;
    background: #f9f9f9;
    margin-top: 3px;
    padding: 0px 10px;
    span {
      float: right;
    }
  }
}
.box-card {
  margin-bottom: 5px;
}
.processPanel{
    margin-bottom: 5px;
        padding: 10px;
    background: #fffbea;
    color: #545c64;
    .title{
        margin-right:20px;
    }
}
</style>

<script>
import { fetch } from "@/utils";
export default {
  name: "index",
  props: {},
  data() {
    return {
      todoList: []
    };
  },
  methods: {
    toLink(view){
        this.$router.push({name:view})
    },
    loadTodo() {
      fetch.customer.user.findTodo().then(rsp => {
        console.log(rsp);
        this.todoList = rsp.data || [];
      });
    },
    handle(item){
        switch(item.procDefKey){
            case 'PURCHASE_ORDER':this.$router.push({name:'vehicle:order:handle',query:{id:item.businessKey}});break;
            case 'PURCHASE_PAY_ORDER':this.$router.push({name:'finance:purchasePayOrder:handle',query:{id:item.businessKey}});
        }
    },
    init(options = {}) {}
  },
  created() {
    this.$on("init", this.init);
  },
  mounted() {
    this.loadTodo();
  }
};
</script>
