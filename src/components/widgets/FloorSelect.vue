<template>
    <el-select v-model="currentValue" placeholder="请选择" :loading="loading" :clearable="clearable" :disabled="disabled" 
              @change="handleChange" filterable>
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled">
        </el-option>
    </el-select>
</template>

<script>
  
  export default {
    data () {
      return {
        loading: false,
        options: [],
        disOpts: [],
        num:1
        
      }
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
      },
      parkId:{
        type:Number
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
            if(this.num!=1){
              this.currentValue=''
            }
          },
          deep:true
        }
    },
    methods: {
      handleChange (val) {
        this.$emit('change', val)
        // console.log(val)
        console.log(111)
      },
      refresh () {
        this.loading = true
        this.$api.ipark.ParkFloorService.query({param: {parkId:this.parkId,isDeleted:false}}).then(rsp => {
          this.options = rsp.data
          this.loading = false
        })
      }
    },
    created () {
      this.refresh()
      
    }
  }
</script>
