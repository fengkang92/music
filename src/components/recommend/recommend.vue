// 首页推荐组件


<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="diskList">
      <div class="wrapper">
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImg" :src="item.picUrl" alt>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="title">热门歌曲推荐</h1>
          <ul>
            <li class="item" @click="selectItem(item)" v-for="item in diskList">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60" :src="item.imgurl" alt>
              </div>
              <div class="text">
                <div class="name" v-html="item.dissname"></div>
                <div class="desc" v-html="item.introduction"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!diskList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import { getRecommend, getDiskList } from "api/recommend";
import { ERR_OK } from "api/config";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { playlistMixin } from "common/js/mixin";

import {mapMutations} from 'vuex';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      diskList: []
    };
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getRecommend();
    this._getDiskList();
  },
  methods: {
    // mixins里面定义要实现的方法
    handlePlaylist(list) {
      const bottom = list.length > 0 ? "60px" : "";
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    selectItem(item){
      this.$router.push({
        path:`/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    //获取轮播图
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    //获取歌单
    _getDiskList() {
      // setTimeout(() => {
      getDiskList().then(res => {
        if (res.code === ERR_OK) {
          this.diskList = res.data.list;
        }
      });
      // }, 300000);
    },
    //图片加载完成
    loadImg() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },

    ...mapMutations({
      setDisc:'SET_DISC'
    })
  }
};
</script>
<style lang="scss" scoped>
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  z-index: 100;
  .recommend-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      width: 96%;
      margin: 0 auto;
      border-radius: 5px;
      overflow: hidden;
    }
    .recommend-list {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: $font-size-medium;
        font-weight: bold;
        color: $color-text;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          .gradients {
            position: absolute;
            top: 0;
            width: 100%;
            height: 35px;
            border-radius: 3px;
            background: linear-gradient(
              rgba(109, 109, 109, 0.4),
              rgba(255, 255, 255, 0)
            );
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
        .play-count {
          position: absolute;
          top: 5px;
          right: 8px;
          font-size: $font-size-small-s;
          color: $color-text-l;
        }
        .text {
          float: left;
          line-height: 16px;
          text-align: left;
          height: 40px;
          line-height: 16px;
          overflow: hidden;
          margin-bottom: 10px;
          font-size: $font-size-small;
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
    .recommend-song {
      margin-top: -20px;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: $font-size-medium;
        font-weight: bold;
        color: $color-text;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
        .text {
          line-height: 16px;
          text-align: left;
          height: 16px;
          @include no-wrap();
          font-size: $font-size-small;
        }
        .singer {
          line-height: 16px;
          margin-bottom: 10px;
          text-align: left;
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-g;
        }
      }
    }
  }
}
</style>