<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(item,index)" v-for="(item,index) in songs" class="item">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{getDesc(item)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}(${song.album})`;
    },
    //将歌曲的点击事件派发出去
    selectItem(item, index) {
      console.log(index);
      this.$emit("selectSong", item, index);
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      }
      return "text";
    },
    getRankText(index) {
      if(index>2){
        return index++
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";
.song-list {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  font-size: $font-size-medium;
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    position: relative;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        &.icon0 {
          @include bg-image("first");
        }
        &.icon1 {
          @include bg-image("second");
        }
        &.icon2 {
          @include bg-image("third");
        }
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .hightLight {
      color: $color-theme !important;
    }
    &:after {
      position: absolute;
      height: 1px;
      content: "";
      transform: scaleY(0.2);
      width: 100%;
      top: 100%;
      left: 0;
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        width: 240px;
        color: $color-text;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .desc {
        margin-top: 4px;
        width: 240px;
        color: $color-text-g;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
