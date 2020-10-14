<template>
  <div class="dialog">
      <div class="dialog-cover back"  v-if="isShow"  @click="closeMyself"></div>
      <transition name="drop">
        <div class="dialog-content" :style="{top:topDistance+'%',width:widNum+'%',left:leftSite+'%'}"  v-if="isShow">
          <!-- <div class="dialog_head back ">
              <slot name="header"></slot>
          </div> -->
          <div v-if="!addOrRemove" class="dialog_main" :style="{paddingTop:pdt+'px',paddingBottom:pdb+'px'}">
            <div>Do you want to mark BIGFOOT?</div>
            <div>
                <button @click="addMark">yes</button>
                <button @click="closeMyself">no</button>
            </div>
          </div>
          <div v-if="addOrRemove" class="dialog_main" :style="{paddingTop:pdt+'px',paddingBottom:pdb+'px'}">
            <div>Do you want to remove this mark?</div>
            <div>
                <button @click="removeMark">yes</button>
                <button @click="closeMyself">no</button>
            </div>
          </div>
          <!-- <div  class="foot_close" @click="closeMyself">
          </div> -->
        </div>
    </transition>
  </div>
</template> 

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
      required: true
    },
    addOrRemove: {
      type: Boolean,
      default: true,
    },
    widNum: {
      type: Number,
      default: 30
    },
    leftSite: {
      type: Number,
      default: 35
    },
    topDistance: {
      type: Number,
      default: 35
    },
    pdt: {
      type: Number,
      default: 22
    },
    pdb: {
      type: Number,
      default: 47
    }
  },
  methods: {
    closeMyself() {
      this.$emit("on-close", 'close');
    },
    addMark() {
      this.$emit("on-close", 'add');
    },
    removeMark() {
      this.$emit("on-close", 'remove');
    }
  }
};
</script>
<style lang="scss" scoped>
.drop-enter-active {
  transition: all 0.5s ease;
}
.drop-leave-active {
  transition: all 0.3s ease;
}
.drop-enter {
  transform: translateY(-500px);
}
.drop-leave-active {
  transform: translateY(-500px);
}
.dialog {
  position: relative;
  color: #2e2c2d;
  font-size: 16px;
  width: 100%;
  height: 100%;
}
.dialog-cover {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  z-index: 200;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dialog-content {
  position: fixed;
  min-width: 380px;
  top: 35%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 300;
  .dialog_head {
    width: 86.5%;
    height: 43px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .dialog_main {
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 86.5%;
    padding: 22px 0 47px 0;
    border-radius: 10px 10px 10px 10px;
  }
  .foot_close {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fcca03;
    display: flex;
    justify-content: center;
    align-content: center;
    margin-top: -25px;
    .close_img {
      width: 42px;
      height: 42px;
    }
  }
}
</style>