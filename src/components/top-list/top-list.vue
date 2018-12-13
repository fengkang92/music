// 排行--列表组件


<template>
  <transition name="slide">
    <music-list :songs="songs" :rank="rank" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from "cpnts/music-list/music-list";
import { mapGetters } from "vuex";
import { getMusicList } from "api/rank";
import { ERR_OK } from "api/config";
import { creatSong } from 'common/js/song'
export default {
  data() {
    return {
      songs: [],
      rank:true
    };
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return '';
    },

    ...mapGetters(["topList"])
  },
  created() {
    if(!this.topList.id){
      this.$router.push('/rank')
      return
    }
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      getMusicList(this.topList.id).then(res => {
        console.log(res);
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist);
        }
      });
    },
    _normalizeSongs(list){
      let ret= []
      list.forEach(item => {
        const musicData=item.data
        if(musicData.songid&&musicData.albumid){
          ret.push(creatSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
};
</script>

<style lang="scss" scoped>
@import "common/scss/variable.scss";
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
