<template>
  <div>
    <!-- 选择播放 -->
    <el-select v-model="value" placeholder="请选择" @change="realplayVideo(value)">
      <el-option
        v-for="item in allDevInfor"
        :key="item.devID"
        :label="item.devName"
        :value="item.devName"
      ></el-option>
    </el-select>
    <!-- 切换播放模式 -->
    <el-button @click="switchDisplayWindow">切换播放窗口模式</el-button>
    <!-- 多窗口模式 -->
    <div v-show="displayWindowFlag">
      <!-- H5stream直播 -->
      <el-button @click="playVideo">play</el-button>
      <div v-show="h5streamFlag">
        <video v-for="(item, index) in allChannels" :key="item.strToken" :id="index" controls></video>
      </div>
      <!-- 萤石云直播 -->
      <div v-show="YSflag">
        <video v-for="(item, index) in hlsAddress" :key="index" :id="'ys'+index" controls autoplay></video>
      </div>
    </div>
    <!-- 单窗口模式 -->
    <div v-show="!displayWindowFlag">
      <div v-show="h5streamFlag">
        <video id="h5stream" controls></video>
      </div>
      <div v-show="YSflag">
        <div id="singleYS"></div>
      </div>
      <el-button
        v-for="(item, index) in allMysqlChannels"
        :key="index"
        @click="singleRealplay(item.devID, item.displayType)"
      >{{ item.channelName }}</el-button>
    </div>
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
    allDevInfor: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      hlsAddress: [],
      value: "",
      allChannels: [],
      targetDevInform: {},
      v: [],
      singlev: {},
      conf: [],
      singconf: {},
      accessToken: "",
      decoder: [],
      allMysqlChannels: [],
      targetChannel: [],
      displayWindowFlag: true,
      h5streamFlag: true,
      YSflag: false,
      hls: [],
      hlsxxx: '',
    };
  },

  components: {
    SelectRealplay
  },

  mounted() {
    this.getAccessToken();
  },

  methods: {
    switchDisplayWindow() {
      this.displayWindowFlag = !this.displayWindowFlag;
    },
    async realplayVideo(data) {
      const {
        data: information
      } = await this.$http.post("/api/user/selectTargetDev", { devName: data });
      this.targetDevInform = information[0];
      if (this.targetDevInform.displayType === "H5stream") {
        this.getAllH5streamDevChannel(
          this.targetDevInform.devID,
          this.targetDevInform.devName
        );
        this.h5streamFlag = true;
        this.YSflag = false;
      } else {
        this.getAllYsDevChannel(
          this.targetDevInform.devSerial,
          this.targetDevInform.devName
        );
        this.h5streamFlag = false;
        this.YSflag = true;
      }
    },

    playVideo() {
      if (this.targetDevInform.displayType === "H5stream") {
        this.playH5sVideo();
      } else {
        this.playYSVideo(this.allChannels);
      }
    },

    playH5sVideo() {
      for (let index = 0; index < this.allChannels.length; index++) {
        const element = this.allChannels[index];
        this.conf[index] = {
          videoid: index,
          protocol: window.location.protocol,
          host: "localhost:6060",
          rootpath: "/",
          token: element.strToken,
          hlsver: "v1",
          session: "c1782caf-b670-42d8-ba90-2244d0b0ee83"
        };
        this.v[index] = new H5sPlayerWS(this.conf[index]);
        this.v[index].connect();
      }
    },

    async getAllH5streamDevChannel(token, devName) {
      const { data: allChannels } = await this.$http.get(
        "http://localhost:6060/api/v1/GetDeviceSrc?token=" +
          token +
          "&getonline=true&session=3db6e64e-eb7f-413d-9fe0-415c79f1b6f1"
      );
      this.allChannels = allChannels.src;
      const { data: allMysqlChannels } = await this.$http.post(
        "/api/user/selectChannel",
        {
          devName: devName
        }
      );
      this.allMysqlChannels = allMysqlChannels;
      console.log(333, allMysqlChannels);
    },

    async getAllYsDevChannel(devSerial, devName) {
      const { data: channels } = await this.$http.post(
        "https://open.ys7.com/api/lapp/device/camera/list?accessToken=" +
          this.accessToken +
          "&deviceSerial=" +
          devSerial
      );
      this.allChannels = channels;

      const { data: allMysqlChannels } = await this.$http.post(
        "/api/user/selectChannel",
        {
          devName: devName
        }
      );
      this.allMysqlChannels = allMysqlChannels;
      const allchannels = this.allChannels.data;
      var source = "";
      for (let index = 0; index < allchannels.length; index++) {
        const element = allchannels[index];
        source = source + element.deviceSerial + ":" + element.channelNo + ",";
      }
      source = source.substring(0, source.length - 1);
      console.log(source);
      const {
        data: { data: realplayAddress }
      } = await this.$http.post(
        "https://open.ys7.com/api/lapp/live/address/get?accessToken=" +
          this.accessToken +
          "&source=" +
          source  
      );
      this.hlsAddress = realplayAddress;
    },

    async getAccessToken() {
      const { data: accessToken } = await this.$http.post(
        "https://open.ys7.com/api/lapp/token/get?appKey=249fd56f266444af86c83ecb4ed40bbc&appSecret=cd6cdff3fd093209a7fdcb1c8cbc43ed"
      );
      this.accessToken = accessToken.data.accessToken;
    },

    async playYSVideo() {
      for (let index = 0; index < this.hlsAddress.length; index++) {
        const element = this.hlsAddress[index];
        if (element.hls !== null) {
          this.hls[index] = new Hls();
          this.hls[index].loadSource(element.hls);
          console.log(element.hls);          
          const videoid = "ys" + index;          
          const video = document.getElementById(videoid);
          this.hls[index].attachMedia(video);
          this.hls[index].on(Hls.Events.MANIFEST_PARSED, () => {});
        }
      }
    },

    singleRealplay(devID, displayType) {
      if (displayType === "H5stream") {
        this.singconf = {
          videoid: "h5stream",
          protocol: window.location.protocol,
          host: "localhost:6060",
          rootpath: "/",
          token: devID,
          hlsver: "v1",
          session: "c1782caf-b670-42d8-ba90-2244d0b0ee83"
        };
        this.singlev = new H5sPlayerWS(this.singconf);
        this.singlev.connect();
      } else {
        const token = devID.split("--");
        const url =
          "ezopen://open.ys7.com/" +
          this.targetDevInform.devSerial +
          "/" +
          token[1] +
          ".live";
        const decoder = new EZUIKIT.EZUIPlayer({
          id: "singleYS",
          autoplay: true,
          url: url,
          accessToken: this.accessToken,
          decoderPath: "/libs/replay"
        });
      }
    },
  }
};
</script>

<style lang="less" scoped>
</style>