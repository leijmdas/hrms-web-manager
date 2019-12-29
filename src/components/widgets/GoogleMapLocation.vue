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
    let map = new google.maps.Map(document.getElementById("mapContainer"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  }
};
</script>
