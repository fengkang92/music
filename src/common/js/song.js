import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'


export default class Song{
  constructor({id,mid,singer,name,album,duration,image,url}){
    this.id=id,
    this.mid=mid,
    this.singer=singer,
    this.name=name,
    this.album=album,
    this.duration=duration,
    this.image=image,
    this.url=url
  }

  getLyric(){
    if(this.lyric){
      return Promise.resolve(this.lyric)
    }


    return new Promise((resolve,reject)=>{
      getLyric(this.mid).then((res)=>{
        if(res.retcode===ERR_OK){
          this.lyric=Base64.decode(res.lyric)
          resolve(this.lyric)
        }else{
          reject('no lyric')
        }
      })
    })

  }
}



// export function creatSong(musicData){
//   return new Song({
//     id:musicData.songid,
//     mid:musicData.songmid,
//     singer:filtersSinger(musicData.singer),
//     name:musicData.songname,
//     album:musicData.albumname,
//     duration:musicData.interval,
//     image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
//     url:` http://220.181.91.152/amobile.music.tc.qq.com/C400${musicData.strMediaMid}.m4a?vkey=${musicData.strMediaMid}&guid=1819638027&uid=0&formtag=66`
//   })
// }

export function creatSong(musicData) {
  return new Song({
    id: musicData.songmid,
    mid: musicData.songmid,
    singer: filtersSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://220.181.91.152/amobile.music.tc.qq.com/C400${musicData.songid}.m4a?fromtag=46`
  })
}



export function filtersSinger(singer){
  let ret=[]
  if(!singer){
    return ''
  }
  singer.forEach((s)=>{
    ret.push(s.name)
  })
  return ret.join('/')
}