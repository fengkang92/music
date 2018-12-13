<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="back"></i>
      <h1 class="title" v-html="title"></h1>
    </div>

    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <div class="play-wrapper" ref="playBtn">
        <div @click="_randomAll" class="play" v-show="songs.length>0">
          <i class="icon-danquxunhuan"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      :data="songs"
      @scroll="scroll"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list @selectSong="selectItem" :songs="songs" :rank="rank"></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import SongList from "base/songlist/songlist";
import { prefixStyle } from "common/js/dom";
import Loading from "base/loading/loading";

import { mapActions } from "vuex";
import { playlistMixin } from "common/js/mixin";

const TOPBAR_HRIGHT = 40;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  mixins: [playlistMixin],
  props: {
    songs: {
      type: Array,
      default: []
    },
    bgImage: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    rank:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + TOPBAR_HRIGHT;
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`;
  },
  methods: {
    // mixins里面定义要实现的方法
    handlePlaylist(list){
      const bottom = list.length>0?'60px':''
      this.$refs.list.$el.style.bottom=bottom
      this.$refs.list.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    //处理子组件传递过来的点击事件
    selectItem(item, index) {
      console.log(1);
      //提交muations，封装action
      this.selectPlay({
        list: this.songs,
        index: index
      });
    },
    //随机播放全部
    _randomAll() {
      this.randomPlay({
        list: this.songs
      });
    },
    //使用mapActions
    ...mapActions(["selectPlay", "randomPlay"])
  },
  watch: {
    scrollY(newY) {
      //newY和minTranslateY为负数

      let zIndex = 0; //背景图片默认z-index
      let scale = 1; //背景图片默认放大倍数
      let blur = 0; //上滑时背景图片高斯模糊值
      let percent = Math.abs(newY / this.imageHeight); //下拉距离除以图片高度，计算放大的比例

      let translateY = Math.max(this.minTranslateY, newY);
      //translateY为newY和minTranslateY中间较大的数，即layer层最大上滑高度

      //当列表上下滑动时，根据值使列表后面的遮罩上下移动
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;

      if (newY > 0) {
        //下拉时图片放大
        //图片z-index设置为高
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20); //模糊最大值为20
      }
      if (newY < this.minTranslateY) {
        //当列表上滑时超过图片高度时，动态改变背景图片的z-index使其高于列表，并将背景图片高度改为导航条高度
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = `0`;
        this.$refs.bgImage.style.height = `${TOPBAR_HRIGHT}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        //列表上滑距离没有超过图片高度，或者下拉时，图片维持原样
        this.$refs.bgImage.style.paddingTop = `70%`;
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style.zIndex = zIndex; //根据值设置图片zindex

      //图片放大
      this.$refs.bgImage.style[transform] = `scale(${scale})`; //根据值设置图片放大倍数

      //根据值设置图片放大倍数
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
};
</script>

<style lang="scss" scoped>
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 0px;
    z-index: 150;
    display: flex;
    width: 100%;
    flex-direction: row;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-text-g;
    }
    .title {
      flex: 1;
      text-align: left;
      height: 40px;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.2);
    }
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
      .play {
        box-sizing: border-box;
        width: 120px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        background-color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
          color: #f1f1f1;
        }
      }
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }
  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
