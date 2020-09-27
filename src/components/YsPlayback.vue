/* eslint-disable vue/require-prop-types */
<template>
  <div>
    <div class="border_l" style="width:620px;height:270px;margin-top:35px;">
      <!-- 历史回放 -->
      <div
        v-show="playbackFlag"
        id="outside"
        class="playback-box"
        style="width:100%;height:221px;margin:11px 0px 0 7px;"
      >
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
      <div>
        <!-- 回放日期 -->
        <el-date-picker v-model="dataValue" type="date" placeholder="选择日期" @change="changeDate"></el-date-picker>
        <el-button :disabled="decoderFlag" @click="playbackVideo">搜索</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import EZUIKit from "../static/ezuikit.js";
export default {
  components: {},
  props: {
    currentChannelNo: {
      type: String,
      required: true
    },
    currentSerial: {
      type: String,
      required: true
    }
  },
  data() {
    return {
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
        "at.51abz0499yjkschn4sqez1sg6gmy4emi-2a3ax1g5bq-0cmnlji-rem6m78ht",
      // picker查询的日期
      dataValue: null,
      // 日期 格式为
      date: null,
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

  mounted() {},
  beforeDestroy() {},
  methods: {
    // 清空播放  测试
    destroyVideo(id) {
      this.hls.detachMedia();
      this.hls.destroy();
    },
    // 切换回放播放
    playbackVideo() {
      this.playbackFlag = true;
      this.decoderFlag = true;
      this.starPlayBack();
    },
    // 播放回放
    starPlayBack() {
      this.decoder = new EZUIKit.EZUIPlayer({
        id: "historyPlay",
        autoplay: true,
        url: this.url,
        accessToken: 'at.db7zzae12e9b8rwba82h4hcg91deezgq-173ma3uz82-00t5jvz-gde3y4pqr',
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
    getPlaybackInfo() {},
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
      const url =
        "ezopen://open.ys7.com/" +
        this.currentSerial +
        "/" +
        this.currentChannelNo +
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
      const element = document.getElementById("outside");
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
<style>
.bor_b {
  font-size: 14px;
  border-bottom: 2px solid rgba(72, 255, 255, 0.1);
}
.el-dialog__footer {
  padding: 10px 40px 30px 0;
}
.border_l {
  position: relative;
  color: #eee;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.playback-box {
  position: relative;
}
.historyPlayBack {
  width: 100% !important;
  height: 100% !important;
}
.parent-wnd > div {
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
  bottom: 0;
  width: 100%;
  height: 50px;
}
.date-picker {
  position: absolute;
  width: 140px !important;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: #eee;
  /* width: 50px; */
}
.date-picker > .el-input__inner {
  border: 0;
}
.playbackSlider {
  bottom: 5px;
  width: 80%;
}
.playbackSlider .el-slider__marks-text {
  margin-top: 10px;
}
.plackbackButton {
  bottom: 10px;
  margin-right: 10px;
}
#loading-id-0 {
  width: 338px !important;
  height: 220.99px !important;
  left: 50% !important;
  transform: translateX(-50%);
  margin: auto 0;
}
.loading-item {
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