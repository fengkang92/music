// 搜索出来的列表组件


<template>
  <scroll
    class="suggest"
    ref="suggest"
    :beforeScrollStart="beforeScroll"
    @beforeScroll="listScroll"
    :pullMoreLoad="pullUp"
    @pullMoreLoad="searchMore"
    :data="result"
  >
    <div class="suggest-list-wrap">
      <ul class="suggest-list">
        <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)"></p>
          </div>
        </li>
        <loading v-show="hasMore"></loading>
      </ul>
      <div class="no-result-wrapper" v-show="!hasMore&&!result.length">
        <no-result :title="noTitle"></no-result>
      </div>
    </div>
  </scroll>
</template>

<script>
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { creatSong } from "common/js/song";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import Singer from "common/js/singer";
import NoResult from "base/no-result/no-result";

import { mapMutations, mapActions } from "vuex";

const TYPE_SINGER = "singer";
const PERPAGE = 20;
export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullUp: true,
      hasMore: true,
      noTitle: "暂无结果",
      beforeScroll:true
    };
  },
  watch: {
    query() {
      //请求数据
      this._search();
    }
  },
  methods: {
    //加载搜索结果
    _search() {
      this.hasMore = true;
      //将scroll组件滚动到顶部
      this.page = 1;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, PERPAGE).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._getResult(res.data);
          this._chenkMore(res.data);
        }
      });
    },
    // 上拉加载更多数据
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, PERPAGE).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._getResult(res.data));
          this._chenkMore(res.data);
        }
      });
    },
    //判断有没有更多
    _chenkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * PERPAGE >= song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    //将搜索结果中的歌手和歌曲处理成一个数组
    _getResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    //根据歌手还是歌曲，加上不同小图标
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    //根据歌手还是歌曲，处理歌手名字和歌曲名字
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    // 将搜索的歌曲数据处理为一个歌曲对象
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(element => {
        if (element.songid && element.albumid) {
          ret.push(creatSong(element));
        }
      });
      return ret;
    },
    //搜索列表点击事件
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername,
          avatar: item.singermid,
          singerId: item.singermid
        });
        this.$router.push({
          path: `/search/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      //点击之后派发一个事件，用来做保存搜索记录，因为suggest这个组件本身做的不是保存记录，只是显示列表，所以要派发出去，在
      //别的组件去保存
      this.$emit('select',item)
    },
    //接收scroll组件传过来的列表开始滚动事件
    listScroll(){
      //suggest组件并不需要做什么东西，应该派发到search组件去做
      this.$emit('listScroll')
    },

    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>


<style lang="scss" scoped>
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list-wrap {
    min-height: 100%;
    box-sizing: border-box;
    padding-block-end: 44px;
    position: relative;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: #999;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: #999;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }

    .load-more-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 44px;
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
