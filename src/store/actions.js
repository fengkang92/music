import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/utl'
import { saveSearch } from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)

  if (state.mode === playMode.random) {
    let randomlist = shuffle(list)
    commit(types.SET_PLAY_LIST, randomlist)
    index = findIndex(randomlist, list[index])
  } else {
    commit(types.SET_PLAY_LIST, list)
  }

  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomlist = shuffle(list)
  commit(types.SET_PLAY_LIST, randomlist)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}


//搜索结果，点击插入歌曲
export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  //记录当前歌曲
  let currentSong = playlist[currentIndex]
  //查找当前列表中是否有待插入歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  //因为是插入歌曲，所以索引+1
  currentIndex++
  //插入这首歌到当前索引
  playlist.splice(currentIndex, 0, song)

  if (fpIndex > -1) {
    //已经包含这首歌，找到fpIndex的这首歌，并将其删掉
    if (currentIndex > fpIndex) {
      //如果插入后的索引大于原先索引,直接删除前面的歌曲，并且由于数组长度-1,currentIndex对应的也要-1
      playlist.split(fpIndex, 1)
      currentIndex--
    } else {
      //如果插入后的索引小于原先索引,直接删除后面的歌曲，并且由于数组长度+1,要删除的歌曲的索引fpIndex+1
      playlist.split(fpIndex + 1, 1)
    }
  }

  let currentSIndex=findIndex(sequenceList,currentSong)+1

  let fsIndex=findIndex(sequenceList,song)
  sequenceList.splice(currentSIndex,0,song)
  if(fsIndex>-1){
    if(currentSIndex>fsIndex){
      sequenceList.splice(fsIndex,1)
    }else{
      sequenceList.splice(fsIndex+1,1)
    }
  }

  commit(types.SET_PLAY_LIST,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

//搜索结果，点击保存vuex并将数据保存到本地缓存
export const saveSearchHistory = function({commit},query){
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
