import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'

const state = {
    singer:{},      //歌手
    playing:false,      //播放状态
    fullScreen:false,   //是否全屏
    playlist:[],        //歌曲列表
    sequenceList:[],    //播放列表
    mode:playMode.sequence,     //播放模式
    currentIndex:-1,    //当前播放歌曲索引
    disc: {},            //歌单对象
    topList:{},            //排行榜歌单详情
    searchHistory:loadSearch(),       //搜索历史
}

export default state