<template>
  <div>
    <el-select v-model="value" placeholder="请选择" @change="getTargetDevChannels(value)">
      <el-option
        v-for="(item, index) in allDevName"
        :key="index"
        :label="item.devName"
        :value="item.devName"
      ></el-option>
    </el-select>
    <el-button
      v-for="(item, index) in channelsInfor"
      :key="index"
      @click="getTargetChannel(item.devID,item.devSerial,item.displayType)"
    >{{ channelsInfor[index].channelName }}</el-button>
    <el-date-picker 
      v-model="dateValue" 
      type="date" 
      placeholder="开始日期" 
    ></el-date-picker>
    <Plackback
      :targetToken="targetToken"
      :targetDeviceSerial="targetDeviceSerial"
      :targetDisplayType="targetDisplayType"
      width="800"
      height= "400"
      :historyDate="dateValue"
    ></Plackback>
  </div>
</template>

<script>
import Plackback from "./playback";
export default {
  components: {
    Plackback
  },
  data() {
    return {
      value: "",
      targetToken: "",
      targetDeviceSerial: "",
      targetDisplayType: "",
      channelName: "",
      allDevName: [],
      channelsInfor: [],
      dateValue: null
    };
  },
  mounted() {
    this.getAllDevName();
  },
  methods: {
    async getAllDevName() {
      const { data: allDevName } = await this.$http.post(
        "/api/user/select_devname"
      );
      this.allDevName = allDevName;
      // console.log(this.allDevName);
    },
    async getTargetDevChannels(devName) {
      const { data: channelsInfor } = await this.$http.post(
        "/api/user/selectChannel",
        {
          devName: devName
        }
      );
      this.channelsInfor = channelsInfor;
    },
    async getTargetChannel(token, devSerial, displayType) {
      this.targetToken = token + "";
      this.targetDeviceSerial = devSerial + "";
      this.targetDisplayType = displayType + "";
    },
  }
};
</script>

<style lang="scss" scoped>
</style>