<template>
  <div>
    <!-- <Realplay :allDevInfor="allDevInfor"></Realplay> -->
    <el-select v-model="value" placeholder="请选择" @change="getTargetInforFromMysql(value)">
      <el-option
        v-for="(item, index) in channelsID"
        :key="index"
        :label="item.channelName"
        :value="item.devID"
      ></el-option>
    </el-select>
    <Realplay2
      :devID="devID"
      :displayType="displayType"
      :devName="devName"
      :channelName="channelName"
      :source="source"
      dateStyle=""
      width="600"
      height="300"
    ></Realplay2>
  </div>
</template>

<script>
import Realplay2 from './realplay2'
export default {
  data() {
    return {
      channelsID: [],
      targetDevInform: [],
      devID: '',
      displayType: '',
      devName: '',
      channelName: '',
      source: '',
      value: ''
    };
  },
  components: {
    Realplay2
  },
  mounted() {
    this.getChannelsIDFromMysql();
  },
  methods: {
    async getChannelsIDFromMysql() {
      const { data:channelsID } = await this.$http.post("/api/user/select_all_channelsID");
      // console.log(channelsID);
      this.channelsID = channelsID
    },

    async getTargetInforFromMysql(devID) {
      const { data: targetDevInform } = await this.$http.post(
        "/api/user/select_target_channel",
        {
          devID: devID
        } 
      );
      this.devID = targetDevInform[0].devID;
      this.displayType = targetDevInform[0].displayType;
      this.devName = targetDevInform[0].devName;
      this.channelName = targetDevInform[0].channelName;
      this.source = targetDevInform[0].ysRealplayChannel + '';
      // console.log(this.$refs.realplay);
    }
  }
};
</script>

<style lang="less" scoped>
</style>