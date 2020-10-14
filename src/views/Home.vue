<template>
  <div class="container">
    <h2 class="text-center text-secondary pb-2">bigfoot</h2>
    <div class="map-box">
      <mark-dialog :is-show="dialog" :add-or-remove="removeDialog" @on-close="close" class="dialog-bar"></mark-dialog>
      <div class="google-map" id="map"></div>
    </div>
  </div>
</template>
<script>
import MarkDialog from '../components/MarkDialog'
export default {
  components:{
    MarkDialog,
  },
  data() {
    return {
      map: null,
      lng: 151.200362,
      lat: -33.883115,
      dialog: false,
      ifMark: false,
      posittion: {},
      locationArray: [],
      length: 0,
      removeDialog: false,
      removeID: '',
      targetMarker: ''
    };
  },
  async mounted() {
    this.initMap();
    await this.queryMarks();
    this.setMarker();
  },
  watch: {
    ifMark(val) {
      if (val) {
        const id = Date.parse(new Date());
        this.$http.post("/api/user/add_location", {
          id: id,
          lat: this.position.lat(),
          lng: this.position.lng()
        }).then(response => {
          var marker = new google.maps.Marker({
            id: id,
            position: this.position,
            map: this.map
          });
          const _this = this;
          google.maps.event.addListener(marker, 'click', function () {
              _this.dialog = true;
              _this.removeDialog = true;
              _this.removeID = marker.id;
              _this.targetMarker = marker;
          });
          this.queryMarks();
        })
      }
      this.ifMark = false;
    }
  },
  methods: {
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: this.lat, lng: this.lng },
        zoom: 15,
        maxZoom: 20,
        minZoom: 3,
        streetViewControl: false,
        mapTypeControl: false
      });
      google.maps.event.addListener(this.map, 'click', function (event) {
        this.dialog = true;
        this.removeDialog = false;
        this.position = event.latLng;
      }.bind(this))
    },

    async queryMarks() {
      this.locationArray = (await this.$http.post("/api/user/select_location")).data;
      console.log(123, this.locationArray);
      this.length = this.locationArray.length;
    },

    setMarker() {
      console.log(this.locationArray);
      this.locationArray.forEach( el => {
        const marker = new google.maps.Marker({
          position: { lat: el.lat, lng: el.lng },
          map: this.map,
          id: el.id
        });
        const _this = this;
        google.maps.event.addListener(marker, 'click', function () {
            _this.dialog = true;
            _this.removeDialog = true;
            _this.removeID = marker.id;
            _this.targetMarker = marker;
        });
      })
    },
    removeClose() {
      this.removeDialog = false;
    },
    async close(val) {
      if (val === "close") {
        console.log(22222);
      } else if (val === "add") {
        this.ifMark = true;
      } else if (val === "remove") {
        console.log(this.removeID);
        console.log(this.targetMarker);
        await this.$http.post("/api/user/delete_location", { id: this.removeID }, {})
        this.targetMarker.setMap(null);
      }
      this.dialog = false;
    }
  }
};
</script>
<style scoped>
.google-map {
  width: 100%;
  height: 800px;
  z-index: 1;
}
.map-box {
  position: relative;
  width: 100%;
  height: 800px;
}
.dialog-bar {
  position: absolute;
}
</style>