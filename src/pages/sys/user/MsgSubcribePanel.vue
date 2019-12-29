<template>
  <div>
    <div v-for="g in msgTypeGroups" :key="g.code" class="panel panel-default group">
      <el-alert :title="g.name" :closable="false">&nbsp;&nbsp;
        <el-checkbox v-model="g.checked" :indeterminate="g.indeterminate" @change="(val)=>onCheckAll(val,g)"></el-checkbox>
        <el-checkbox-group v-model="g.checkedCodes" @change="(vals
        )=>onCheckItem(vals,g)">
          <el-checkbox v-for="t in g.bizTypes" :label="t.code" :key="t.groupCode+'$'+t.code">{{t.name}}</el-checkbox>
        </el-checkbox-group>
      </el-alert>

    </div>
  </div>
</template>
<style rel="stylesheet/less" lang="less" scoped>
.group {
  margin-bottom: 10px;

  .bizTypes {
    margin: 5px 30px;
  }
}
</style>
<script>
import { fetch } from "@/utils";

const defaultEntity = {};
export default {
  components: {},
  data() {
    return {
      msgTypeGroups: [],
      subscribes:[],//已订阅
    };
  },
  methods: {
    onCheckAll(checked, group) {
      group.indeterminate = false;
      if (!checked) {
        group.checkedCodes = [];
        return;
      }
      let types = group.bizTypes || [];
      let codes = [];
      types.forEach(t => codes.push(t.code));
      group.checkedCodes = codes;
    },
    onCheckItem(vals, group) {
      let types = group.bizTypes || [];
      group.indeterminate = vals.length > 0 && vals.length != types.length;
      group.checked = types.length == vals.length;
    },
    selectAll(checked) {
      this.msgTypeGroups.forEach(g => {
        g.checked = checked;
        this.onCheckAll(checked, g);
      });
    },
    init(options={}) {
      this.userId = options.userId;
      fetch.base.MsgSubscribe.listAllTypes().then((rs = []) => {
        rs.forEach(r => {
          r.checked = false;
          r.indeterminate = false;
          r.checkedCodes = [];
          let types = r.bizTypes || [];

          types.forEach(t => (t.groupCode = r.code));
        });
        this.msgTypeGroups = rs;

        this.initSubscribes()
      });

      //获取用户订阅
      fetch.base.MsgSubscribe.getUserSubscribe(this.userId).then(rs=>{
        this.subscribes = rs;
        this.initSubscribes()
      })
    },
    initSubscribes(){
      this.msgTypeGroups.forEach(g=>{
        let rs = this.subscribes.filter(r=>r.groupCode==g.code);
        g.checkedCodes = rs.map(r=>r.subjectCode);
        this.onCheckItem(g.checkedCodes,g)
      })
    },
    submit(){
      let res = [];
      this.msgTypeGroups.forEach(g=>{
        let typeCodes = g.checkedCodes;
        typeCodes.forEach(code=>{
          res.push({
            groupCode:g.code,
            subjectCode:code
          })
        })
      })
      fetch.base.MsgSubscribe.assignUserSubscribe(this.userId,res).then(()=>{
        this.$emit('saved');
      })
    }
  },
  mounted() {
    this.$on("init", this.init);
    this.$on("selectAll", this.selectAll);
    this.$on('submit',this.submit);
  }
};
</script>
