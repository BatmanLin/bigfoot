<template>
  <div>
    <slot name="cameraPostion"></slot>
    <video id="realplay" controls :width="width + 'px'" :height="height + 'px'" autoplay></video>
  </div>
</template>

<script>
import Hls from "hls.js";
import EZUIKIT from "../static/ezuikit";
import "../assets/js/adapter";
import SelectRealplay from "./selectRealplay";
import {
  H5sPlayerWS,
  H5sPlayerHls,
  H5sPlayerRTC,
  H5sPlayerAudBack
} from "../assets/js/h5splayer.js";
import { H5siOS, H5sPlayerCreate } from "../assets/js/h5splayerhelper.js";
export default {
  props: {
    devID: {
      type: String,
      required: true
    },
    displayType: {
      type: String,
      required: true
    },
    devName: {
      type: String,
      required: true
    },
    channelName: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      conf: {},
      h5stream: null,
      hls: null
    };
  },
  watch: {
    devID(newV, oldV) {
      console.log(newV, oldV);
      this.destroyVideo();
      this.playVideo();
    }
  },
  mounted() { 
  },
  beforeDestroy() {
    this.destroyVideo();
  },
  methods: {
    destroyVideo() {
      if (this.h5stream !== null) {
        this.h5stream.disconnect();
        delete this.h5stream;
        this.h5stream = null;
      } else if (this.hls !== null) {
        this.hls.destroy();
        this.hls = null;
      }
    },
    playVideo() {
      console.log(1111);
      console.log(this.devID);
      
      if (this.displayType === "H5stream") {
        this.playH5stream(this.devID);
      } else {
        this.playYSVideo(this.source);
      }
    },
    playH5stream(token) {
      this.conf = {
        videoid: "realplay",
        protocol: window.location.protocol,
        host: "localhost:6060",
        rootpath: "/",
        token: token,
        hlsver: "v1",
        session: "c1782caf-b670-42d8-ba90-2244d0b0ee83"
      };
      this.h5stream = new H5sPlayerWS(this.conf);
      this.h5stream.connect();
    },
    playYSVideo(source) {
      this.hls = new Hls();
      this.hls.loadSource(source);
      const videoid = "realplay";
      const video = document.getElementById(videoid);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {});
    }
  }
};
</script>

<style lang="less" scoped>
</style>