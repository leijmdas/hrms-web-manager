<template>
    <div>
        <div id="mapContainer" class="map"></div>
        <div id="searchPanel"></div>
    </div>
</template>
<style lang="less" scoped>
.map {
  width: 100%;
  height: 100%;
}
#searchPanel {
  position: absolute;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 80px;
  right: 10px;
  width: 280px;
}
</style>

 <script type="text/javascript" src="http://cache.amap.com/lbs/static/addToolbar.js"></script>       
<script>
export default {
  data() {
    return {
      loading: false,
      options: [],
      disOpts: []
    };
  },
  props: {},
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
  methods: {},
  created() {},
  mounted() {
    let self = this;
    var map = new AMap.Map("mapContainer", {
      resizeEnable: true
    });
    //为地图注册click事件获取鼠标点击出的经纬度坐标
    map.on("click", function(e) {
      console.log(e);
      self.$emit('location-click',{lng:e.lnglat.getLng(),lat: e.lnglat.getLat()});
    });
    map.plugin(["AMap.ToolBar"], function() {
      map.addControl(new AMap.ToolBar());
    });
    var placeSearch = null;
    AMap.service(["AMap.PlaceSearch"], function() {
      //构造地点查询类
      placeSearch =  new AMap.PlaceSearch({
        pageSize: 5, // 单页显示结果条数
        pageIndex: 1, // 页码
        map: map, // 展现结果的地图实例
        panel: "searchPanel", // 结果列表将在此容器中进行展示。
        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
      });
      
    });

    var auto = new AMap.Autocomplete({
      input: "tipinput"
    });
    AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
    function select(e) {
      if (e.poi && e.poi.location) {
        map.setZoom(15);
        map.setCenter(e.poi.location);
      }
    }

    this.$on('init',params=>{
      if(params&&params.address){
        placeSearch.search(params.address);
      }
    })
  }
};
</script>
