import {playMode} from 'common/js/config'

const state = {
    singer:{},      //歌手
    playing:false,      //播放状态
    fullScreen:false,   //是否全屏
    playlist:[],        //歌曲列表
    sequenceList:[],    //播放列表
    mode:playMode.sequence,     //播放模式
    currentIndex:-1,    //当前播放歌曲索引
}

export default state