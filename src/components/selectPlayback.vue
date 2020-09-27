<template>
  <div>
    <el-select v-model="value" placeholder="请选择" @change="displayRealplay(value)">
      <el-option
        v-for="item in allDevInfor"
        :key="item.devID"
        :label="item.devName"
        :value="item.devName"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      allDevInfor: [],
      currentDevInfor: {}
    };
  },
  mounted() {
    this.getDevInfoFromMysql();
  },
  methods: {
    getDevInfoFromMysql() {
      this.$http.post("/api/user/selectDevInfor").then(response => {
        this.allDevInfor = response.data;
      });
    },
    displayRealplay(item) {
      this.$emit("displayAllChannels", item);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>