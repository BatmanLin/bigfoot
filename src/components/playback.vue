<template>
  <div>
    <div v-show="H5YSFlag">
      <div id="H5video" class="video-area" :style="videoStyle">
        <video id="h5sVideo1" class="play-back-video"></video>
        <!-- 全屏按钮 -->
        <el-button
          icon="el-icon-full-screen"
          size="mini"
          class="full-screen-button"
          type="text"
          @click="fullScreen"
        ></el-button>
        <div class="controlItems">
          <el-button
            @click="togglePR"
            class="plackbackButton"
            icon="el-icon-caret-right"
            circle
            size="mini"
          ></el-button>
          <el-slider
            class="playbackSlider"
            v-model="currentVideoTime"
            :max="videoTime"
            :marks="H5marks"
            @change="timeSeek(currentVideoTime)"
          ></el-slider>
        </div>
      </div>
      <div class="block">
      </div>
    </div>
    <div v-show="!H5YSFlag">
      <div class="border_l" :style="videoStyle">
        <!-- 历史回放 -->
        <div id="outside" class="playback-box" style="width:100%;height:100%;">
          <!-- 回放视频 -->
          <div id="historyPlay" class="historyPlayBack"></div>
          <!-- 全屏按钮 -->
          <el-button
            icon="el-icon-full-screen"
            size="mini"
            class="full-screen-button"
            type="text"
            @click="fullScreen"
          ></el-button>
          <div class="controlItems">
            <!-- 回放播放按钮 -->
            <el-button
              class="plackbackButton"
              circle
              size="mini"
              icon="el-icon-caret-right"
              :disabled="!playbackButtonFlag"
              @click="controlPlayback"
            ></el-button>
            <!-- 回放进度条 -->
            <el-slider
              v-model="value"
              class="playbackSlider"
              :disabled="sliderFlag"
              :max="86400"
              :format-tooltip="formatTooltip"
              :marks="marks"
              range
              @change="changeTime"
            ></el-slider>
          </div>
        </div>
        <!-- <div>
          <el-date-picker v-model="dataValue" type="date" placeholder="选择日期" @change="changeDate"></el-date-picker>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/js/adapter";

import EZUIKit from "../static/ezuikit.js";
import moment from "moment";
import {
  H5sPlayerWS,
  H5sPlayerHls,
  H5sPlayerRTC,
  H5sPlayerAudBack
} from "../assets/js/h5splayer.js";
import { H5siOS, H5sPlayerCreate } from "../assets/js/h5splayerhelper.js";
// import YsPlayback from "./YsPlayback";
// import H5streamPlaybcak from "./H5streamPlayback";
export default {
  props: {
    targetToken: {
      type: String,
      required: true
    },
    targetDeviceSerial: {
      type: String,
      required: true
    },
    targetDisplayType: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: "800"
    },
    height: {
      type: String,
      default: "400"
    },
    dateStyle: {
      type: String,
      default: ""
    },
    historyDate: {
      type: Date
    }
  },
  data() {
    return {
      videoStyle: "width: " + this.width + "px;height:" + this.height + "px;",
      H5YSFlag: true,
      v1: [],
      conf: {
        videoid: "h5sVideo1",
        rootpath: "/", // '/'
        hlsver: "v1", //v1 is for ts, v2 is for fmp4
        session: "c1782caf-b670-42d8-ba90-2244d0b0ee83"
      },
      H5marks: {
        0: "0",
        10800: "3",
        21600: "6",
        32400: "9",
        43200: "12",
        54000: "15",
        64800: "18",
        75600: "21",
        86400: "24"
      },
      displayc: "", //实时时间
      rowstarf: "", //跟进进度条开始时间
      rowend: "", //进度条结束时间
      h5value: "", // value[0]回放开始时间  value[1] 回放结束时间 中国时间格式
      starTime: "", // 回放开始时间 h5stream时间格式 "YYYY-MM-DDTHHmmSS+08"
      h5streamEndTime: "", // 回放结束时间 h5stream时间格式 "YYYY-MM-DDTHHmmSS+08"
      videoTime: 0, // 回放视频的全部时间
      currentTime: "", // 当前回放视频播放的时间 中国时间格式
      currentVideoTime: 0, // 当前回放视频播放的时间 秒 进度条滑块
      playFlag: true,
      // 设备名字
      deviceName: "",
      // 历史回放的flage
      playbackFlag: true,
      // 历史回放中圆形的控制播放的flag
      playbackButtonFlag: false,
      // hls
      hls: "",
      // 回放信息
      playbackInfo: {},
      sliderFlag: true,
      // 回放对象
      decoder: null,
      // 控制历史画面button的flag
      decoderFlag: false,
      // 控制回放播放的flag
      controlPlaybackFlag: true,
      url: "",
      accessToken:
        "at.7e4ntd215yibkcajaptr4z4g2sfvkqa2-7avf5dnlsk-1yfw605-vbclh3hce",
      // picker查询的日期
      dataValue: null,
      // 日期 格式为
      // date: null,
      beginTime: null,
      endTime: null,
      value: [0, 86400],
      marks: {
        0: "0",
        10800: "3",
        21600: "6",
        32400: "9",
        43200: "12",
        54000: "15",
        64800: "18",
        75600: "21",
        86400: "24"
      }
    };
  },
  watch: {
    targetToken(newV, oldV) {
      if (this.v1.length !== 0) {
        this.Stop();
        console.log(33333, this.v1);
      } else {
        if (this.decoder !== null) {
          console.log(44444, this.decoder);
          this.decoder.stop();
          this.decoder = null;
        }
      }
      if (this.targetDisplayType === "H5stream") {
        this.H5YSFlag = true;
      } else {
        this.H5YSFlag = false;
        // this.starPlayBack();
      }
    },
    historyDate(newV, oldV) {
      if (this.targetDisplayType === "H5stream") {
        this.timeFormTranslate();
      } else {
        this.changeDate();
      }
    }
  },
  mounted() {},

  beforeDestroy() {
    if (this.targetDisplayType === "H5stream") {
      console.log(1111);
      this.Stop();
    } else if (this.targetDisplayType === "YSCloud") {
      console.log(2222);
      if (this.decoder !== null) {
        this.decoder.stop();
        this.decoder = null;
      }
    } else {
      console.log(3333);
    }
  },

  components: {
    // H5streamPlaybcak,
    // YsPlayback
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
          (this.currentTime.getTime() - this.h5value.getTime()) / 1000;
        if (this.currentVideoTime === this.videoTime) {
          this.Stop();
        }
      }
    },

    // 连接源地址
    connectSrc() {
      this.conf.token = this.targetToken;
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

    // changeChannels() {
    //   this.conf.token = this.targetToken;
    // },

    Stop() {
      if (this.v1 == "") {
        return;
      }
      this.v1.disconnect();
      delete this.v1;
      this.v1 = "";
      this.h5value = "";
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
      this.h5value = this.historyDate;
      if (this.v1.length !== 0) {
        this.v1.disconnect();
        delete this.v1;
        this.v1 = "";
      }
      this.starTime = moment(this.h5value).format("YYYY-MM-DDTHHmmSS+08");
      console.log(this.starTime);
      this.h5streamEndTime = this.starTime.replace(/T000000/g, "T235959");
      // console.log(this.h5streamEndTime);
      this.videoTime = 86400;
      // console.log(this.videoTime);
      this.connectSrc();
    },

    // 滑块拖动视频
    timeSeek(currentVideoTime) {
      if (this.v1 == "") {
        return;
      }
      this.v1.seek(currentVideoTime);
    },
    // 切换回放播放
    playbackVideo() {
      // this.playbackFlag = true;
      this.decoderFlag = true;
      this.starPlayBack();
    },
    // 播放回放
    starPlayBack() {
      this.decoder = new EZUIKit.EZUIPlayer({
        id: "historyPlay",
        autoplay: true,
        url: this.url,
        accessToken:
          "at.7e4ntd215yibkcajaptr4z4g2sfvkqa2-7avf5dnlsk-1yfw605-vbclh3hce",
        decoderPath: "/libs/replay",
        height: 320
      });
      console.log(999999, this.decoder);
    },
    // button控制回放播放
    controlPlayback() {
      if (this.controlPlaybackFlag) {
        this.controlPlaybackFlag = false;
        if (this.decoder !== null) {
          this.decoder.stop();
          this.decoder = null;
        }
      } else {
        this.controlPlaybackFlag = true;
        this.playbackButtonFlag = false;
        this.sliderFlag = true;
        this.starPlayBack();
        const _this = this;
        setTimeout(function() {
          _this.sliderFlag = false;
          _this.playbackButtonFlag = true;
        }, 3500);
      }
    },
    // 获取回放设备的信息
    // getPlaybackInfo() {},
    formatBit(val) {
      val = +val;
      return val > 9 ? val : "0" + val;
    },
    // 将秒转化为时间
    formatTooltip(val) {
      if (val === 86400) {
        val = 86399;
      }
      const min = Math.floor(val % 3600);
      const time =
        this.formatBit(Math.floor(val / 3600)) +
        ":" +
        this.formatBit(Math.floor(min / 60)) +
        ":" +
        this.formatBit(val % 60);
      // console.log(time);
      return time;
    },
    // 改变slider时间
    changeTime() {
      if (this.decoder !== null) {
        this.decoder.stop();
        this.decoder = null;
      }
      const begin = this.formatTooltip(this.value[0]).replace(/:/g, "");
      const end = this.formatTooltip(this.value[1]).replace(/:/g, "");
      this.beginTime = this.day + begin;
      this.endTime = this.day + end;

      console.log(3333, this.targetToken);
      const yschannelNo = this.targetToken.split("--")[1];

      const url =
        "ezopen://open.ys7.com/" +
        this.targetDeviceSerial +
        "/" +
        yschannelNo +
        ".rec";
      this.url = url + "?begin=" + this.beginTime + "&end=" + this.endTime;
      this.playbackButtonFlag = false;
      this.sliderFlag = true;
      const _this = this;
      this.starPlayBack();
      setTimeout(function() {
        _this.sliderFlag = false;
        _this.playbackButtonFlag = true;
      }, 3500);
    },
    // 改变date-picker日期
    changeDate() {
      this.dataValue = this.historyDate;
      this.day = this.toDate(this.dataValue).replace(/-/g, "");
      if (this.dataValue != null) {
        this.sliderFlag = false;
      } else {
        this.sliderFlag = true;
      }
    },
    toDate(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    // 回放全屏显示
    fullScreen() {
      if (this.targetDisplayType === "H5stream") {
        var element = document.getElementById("H5video");
      } else {
        var element = document.getElementById("outside");
      }
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
        }
      }
    }
  }
};
</script>
<style lang="less">
.video-area {
  width: 100%;
  position: relative;
}

.play-back-video {
  width: 100%;
  height: 100%;
  background-color: #4c4b4b;
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

.bor_b {
  font-size: 14px;
  border-bottom: 2px solid rgba(72, 255, 255, 0.1);
}

.border_l {
  position: relative;
  color: #eee;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.playback-box {
  position: relative;
  background-color: #4c4b4b;
}
.historyPlayBack {
  width: 100% !important;
  height: 100% !important;
}
.parent-wnd div {
  margin: 0 0px;
  width: 100% !important;
  height: 100% !important;
}
.parent-wnd canvas {
  margin: 0 auto;
  width: 100% !important;
  height: 100% !important;
}
.controlItems {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 5px;
  width: 100%;
  height: 50px;
}
.controlItems .playbackSlider {
  bottom: 5px;
  width: 80%;
}
.el-slider__marks-text {
  margin-top: 10px;
}
.plackbackButton {
  bottom: 10px;
  margin-right: 10px;
}
.loading-container {
  display: absolute;
  width: 338px !important;
  height: 220.99px !important;
  left: 50% !important;
  transform: translateX(-50%)!important;
  // top: 50%;
  // transform: translateY(50%);
  margin: auto 0;
}
.loading {
  // display: none !important;
}
.loading-item {
  // display: none !important;
  width: 338px !important;
  height: 220.99px !important;
}
.full-screen-button {
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 15px;
}
.full-screen-button .el-icon-full-screen {
  color: #c0c4cc;
  font-weight: 1000;
}
.device-selector {
  width: 50px;
}
.device-selector .el-input__inner {
  border: 0;
}
.device-selector .el-input {
  margin: 4px 0;
}
</style>