// 歌手详情组件


<template>
    <transition name="slide">
        <music-list :songs="songsList" :title="title" :bg-image="bgImage"></music-list>
    </transition>

</template>


<script>
import { mapGetters } from "vuex";

import { getSingerDetail } from "api/singer";
import { processSongsUrl } from 'api/handlesongurl';

import { ERR_OK } from "api/config";

import { creatSong } from "common/js/song";

import MusicList from "cpnts/music-list/music-list";

export default {
  data() {
    return {
      songsList: []
    };
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  created() {
    this._getDetail();
  },
  methods: {
    _getDetail() {
      if (!this.singer.singerId) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.singerId).then(res => {
        if (res.code == ERR_OK) {
          this.songsList = this._changeListSongs(res.data.list);
          processSongsUrl(this._normalizeSongs(res.data.list)).then(songs => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(creatSong(musicData))
        }
      })

      return ret
    },
    //处理数据
    //将列表中的musicData数据处理为一个新的数组,数组里面每一个项都是一个SONG的对象
    _changeListSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albumid) {
          ret.push(creatSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>


<style lang="scss" scoped>
@import "common/scss/variable.scss";
@import "common/scss/mixin.scss";

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
