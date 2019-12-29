<!--客户资料管理-->
<template>
  <div class="panel panel-default">
      <form-panel ref="formPanel" @saved="onFormSave"></form-panel>
    </div>
    
</template>
<style rel="stylesheet/less" scoped lang="less">
  
</style>
<script>
  import FormPanel from './FormPanel.vue'
  import {fetch} from '@/utils'
  
  export default{
    components:{FormPanel},
    data(){
      return{
        
      }
    },
    computed: {
     
    },
    
    methods: {
      onFormSave(){
        this.$message('保存成功！')
      }
    },
    created(){

    },
    mounted(){
      this.$refs.formPanel.init({})
      
    }
  }
</script>
