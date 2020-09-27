<template>
  <div>
    <div class="video-area">
      <video id="h5sVideo1" class="play-back-video"></video>
      <div>
        <el-slider
          class="time-slider"
          v-model="currentVideoTime"
          :max="videoTime"
          :marks="H5marks"
          @change="timeSeek(currentVideoTime)"
        ></el-slider>
      </div>
      <el-button @click="togglePR" class="video-control" icon="el-icon-caret-right" circle></el-button>
    </div>
    <!-- <el-input type="text" v-model="displayc" disabled /> -->
    <div class="block">
      <el-date-picker
        id="datePicker"
        v-model="value"
        type="date"
        placeholder="开始日期"
        @change="timeFormTranslate"
      ></el-date-picker>
      <el-button @click="connectSrc">查找</el-button>
      <el-button @click="Stop">停止</el-button>
    </div>
  </div>
</template>

<script>
import "../assets/js/adapter";

import moment from "moment";
import {
  H5sPlayerWS,
  H5sPlayerHls,
  H5sPlayerRTC,
  H5sPlayerAudBack
} from "../assets/js/h5splayer.js";
import { H5siOS, H5sPlayerCreate } from "../assets/js/h5splayerhelper.js";
export default {
  props: {
    currentToken: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      v1: [],
      conf: {
        videoid: "h5sVideo1",
        rootpath: "/", // '/'
        hlsver: "v1", //v1 is for ts, v2 is for fmp4
        session: "c1782caf-b670-42d8-ba90-2244d0b0ee83"
      },
      H5marks: {
        0: '00:00:00',
        10800: '03:00:00',
        21600: '06:00:00',
        32400: '09:00:00',
        43200: '12:00:00',
        54000: '15:00:00',
        64800: '18:00:00',
        75600: '21:00:00',
        86399: '23:59:59',
      },
      displayc: "", //实时时间
      rowstarf: "", //跟进进度条开始时间
      rowend: "", //进度条结束时间
      value: "", // value[0]回放开始时间  value[1] 回放结束时间 中国时间格式
      starTime: "", // 回放开始时间 h5stream时间格式 "YYYY-MM-DDTHHmmSS+08"
      h5streamEndTime: "", // 回放结束时间 h5stream时间格式 "YYYY-MM-DDTHHmmSS+08"
      videoTime: 0, // 回放视频的全部时间
      currentTime: "", // 当前回放视频播放的时间 中国时间格式
      currentVideoTime: 0, // 当前回放视频播放的时间 秒 进度条滑块
      playFlag: true
    };
  },
  mounted() {
    this.changeChannels();
  },
  methods: {
    PlaybackCB(event, userdata) {
      var msgevent = JSON.parse(event);
      if (msgevent.type === "H5S_EVENT_PB_TIME") {
        // 当前视频时间进度
        this.displayc = msgevent.pbTime.strTime;

        // "2020-05-01T00:00:03+08:00"
        // 提取年月日时分秒
        const year = this.displayc.slice(0, 4);
        const month = this.displayc.slice(5, 7) - 1;
        const day = this.displayc.slice(8, 10);
        const hour = this.displayc.slice(11, 13);
        const minute = this.displayc.slice(14, 16);
        const second = this.displayc.slice(17, 19);

        this.currentTime = new Date(year, month, day, hour, minute, second);

        this.currentVideoTime =
          (this.currentTime.getTime() - this.value.getTime()) / 1000;

        if (this.currentVideoTime === this.videoTime) {
          this.Stop();
        }
      }
    },

    // 连接源地址
    connectSrc() {
      this.conf.token = this.currentToken;
      var pbconf1 = {
        begintime: this.starTime,
        endtime: this.h5streamEndTime,
        autoplay: "true",
        showposter: "true", //'true' or 'false' show poster
        callback: this.PlaybackCB,
        userdata: this // user data
      };
      this.conf.protocol = window.location.protocol;
      this.conf.host = "localhost:6060";
      this.conf.pbconf = pbconf1;
      this.v1 = new H5sPlayerRTC(this.conf);
      this.v1.connect();
    },

    changeChannels() {
      this.conf.token = this.currentToken;
    },

    Stop() {
      if (this.v1 == "") {
        return;
      }
      this.v1.disconnect();
      delete this.v1;
      this.v1 = "";
      this.value = "";
      this.currentTime = "";
      this.currentVideoTime = 0;
      this.displayc = "";
    },

    togglePR() {
      if (this.v1 == "") {
        return;
      }
      if (this.playFlag) {
        this.v1.pause();
        this.playFlag = false;
      } else {
        this.v1.resume();
        this.playFlag = true;
      }
    },

    Pause() {
      if (this.v1 == "") {
        return;
      }
      this.v1.pause();
    },

    Resume() {
      if (this.v1 == "") {
        return;
      }
      this.v1.resume();
    },

    // 转换时间格式
    // Thu May 07 2020 00:00:00 GMT+0800 (中国标准时间)
    timeFormTranslate() {
      if (this.v1 != "") {
        this.Stop();
      }
      this.starTime = moment(this.value).format("YYYY-MM-DDTHHmmSS+08");
      console.log(this.starTime);
      this.h5streamEndTime = this.starTime.replace(/T000000/g, 'T235959');
      console.log(this.h5streamEndTime);
      
      this.videoTime = 86399;
      console.log(this.videoTime);
    },

    // 滑块拖动视频
    timeSeek(currentVideoTime) {
      if (this.v1 == "") {
        return;
      }
      this.v1.seek(currentVideoTime);
    },
  },

  beforeDestroy() {
    console.log(333333);

    this.Stop();
  }
};
</script>

<style lang="less" scoped>
.video-area {
  width: 100%;
  position: relative;
}

.play-back-video {
  width: 100%;
  border: 1px solid black;
}

.time-slider {
  position: absolute;
  bottom: 5%;
  left: 5%;
  width: 90%;
}

.video-control {
  position: absolute;
  left: 1%;
  bottom: 5%;
}
</style>