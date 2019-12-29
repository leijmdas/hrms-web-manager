<template>
    <el-select v-model="currentValue" placeholder="请选择" :loading="loading" :clearable="clearable" :disabled="disabled" @change="handleChange" filterable>
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
      floorId:{
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
     floorId:{
          handler:function(newVal,oldVal){
            this.refresh();
             if(this.num!=1){
              this.currentValue=''
            }else if(this.num=1){
              this.num++
            }else{
              this.num=1
            }
          },
          deep:true
        }
    },
    methods: {
      handleChange (val) {
        this.$emit('change', val)
        console.log(val)
      },
      refresh () {
        this.loading = true
        this.$api.ipark.ParkAreaService.query({param: {floorId:this.floorId,isDeleted:false}}).then(rsp => {
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
