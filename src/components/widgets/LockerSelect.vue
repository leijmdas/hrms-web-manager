<template>
    <el-select v-model="currentValue" placeholder="请选择" :loading="loading" :clearable="clearable" :disabled="disabled" 
                @change="handleChange"  filterable>
        <el-option v-for="item in options" :key="item.id" :label="item.code" :value="item.id" :disabled="item.disabled">
        </el-option>
    </el-select>
</template>

<script>
  
  export default {
    data () {
      return {
        loading: false,
        options: [],
        disOpts: []
      }
    },
    props: {
      value: {
        required: true
      },
      clearable: {
        type: Boolean
      },
      parkId:{
        type:Number
      },
      disabled: {
        type: Boolean
      },
      emptyLabel: {
        required: false
      },
      lockerIds: {
      }
    },
    computed: {
      currentValue: {
        get () {
          return this.value
        },
        set (val) {
          this.$emit('input', val)
        }
      }
    },
    watch: {
      parkId:{
          handler:function(newVal,oldVal){
            this.refresh();
          },
          deep:true
        }
    },
    methods: {
      handleChange (val) {
        this.$emit('change', val)
        //console.log(val)
      },
      refresh (options) {
        this.loading = true;
        //console.log(this.lockerIds);
        if(!this.parkId) return;
        if(this.lockerIds){
          this.$api.ipark.LockerInfoService.queryids(this.parkId,this.lockerIds).then(rsp => {
          this.options = rsp.data
          this.loading = false
        })
        }else{
          console.log(this.parkId);
          if(!this.parkId) return;
          this.$api.ipark.LockerInfoService.queryid(this.parkId).then(rsp => {
          this.options = rsp.data
          this.loading = false
        })
        }
        
      }
    },
    mounted() {
       this.refresh();
    }

  }
</script>
