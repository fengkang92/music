// 首页歌手组件


<template>
  <div class="singer" ref="singer">
    <listview @select="selectSinger" ref="list" :data="singers"></listview>
    <router-view></router-view>
  </div>
</template>
<script>
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/singer";
import Listview from "base/listview/listview";
import { playlistMixin } from "common/js/mixin";

import { mapMutations } from "vuex";

const HOT_NAME = "热门";
const HOT_LENGTH = 10;

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    };
  },
  components: {
    Listview
  },
  created() {
    this._getSingerLsst();
  },
  methods: {
    // mixins里面定义要实现的方法
    handlePlaylist(list){
      const bottom = list.length>0?'60px':''
      this.$refs.singer.style.bottom=bottom
      this.$refs.list.refresh();
    },
    //跳转到歌手详情
    selectSinger(item) {
      console.log(item)
      this.$router.push({
        path: `/singer/${item.singerId}`
      });
      this.setSinger(item);
    },
    _getSingerLsst() {
      getSingerList().then(res => {
        if (res.code == ERR_OK) {
          this.singers = this._sortSinger(res.data.list);
        }
      });
    },
    //将歌手数据变成我要的数据
    _sortSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };

      list.forEach((item, index) => {
        //热门数据
        if (index < HOT_LENGTH) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_id,
              name: item.Fsinger_name,
              avatar: item.Fsinger_mid,
              singerId: item.Fsinger_mid
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_id,
            name: item.Fsinger_name,
            avatar: item.Fsinger_mid,
            singerId: item.Fsinger_mid
          })
        );
      });

      //为了得到有序列表，需要处理map
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },

    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
};
</script>
<style lang="scss" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>