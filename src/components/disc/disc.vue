// 歌单详情组件

<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from "cpnts/music-list/music-list";
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { ERR_OK } from "api/config";
import { creatSong } from "common/js/song";

export default {
  data() {
    return {
      songs: []
    };
  },
  components: {
    MusicList
  },
  computed: {
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
    ...mapGetters(["disc"])
  },
  created() {
    if (!this.disc.dissid) {
      this.$router.push("/recommend");
    }
    this._getSongList();
  },
  methods: {
    _getSongList() {
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(musicData => {
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
// .singer-detail {
//   position: fixed;
//   z-index: 100;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: @color-background;
// }
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
