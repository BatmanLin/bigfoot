<template>
  <div class="home">
    <el-container class="home_main_container">
      <el-header class="home_header">视频接入管理系统</el-header>
      <el-container class="home_sup_container">
        <!-- 导航栏 -->
        <el-aside class="home_aside">
          <!-- 在导航菜单栏启用router -->
          <el-menu>
            <el-menu-item index="1" @click="routerToRealplay">直播</el-menu-item>
            <el-menu-item index="2" @click="routerToPlayback">回放</el-menu-item>
            <el-menu-item index="3" @click="routerToSetting">设置</el-menu-item>
          </el-menu>
          <!-- <el-button @click="getAllOfTheDevToken">aaaa</el-button> -->
        </el-aside>
        <el-main class="home_main">
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  methods: {
    routerToSetting() {
      this.$router.push('/setting')
    },
    routerToRealplay() {
      this.$router.push('/realtime')
    },
    routerToPlayback() {
      this.$router.push('/historyplayback')
    }
  },
};
</script>
<style lang="less" scoped>
.home {
  height: 100%;
}

.home_main_container {
  height: 100%;
}

.home_header {
  font-size: 20px;
  font-wei
  background-color: #373d41;
}

.home_aside {
  background-color: #333744;
  height: 100%;
  width: 100%;
}

.home_main {
  background-color: #dddddd;
  height: 100%;
}

.home_sup_container {
  height: 100%;
}
</style>