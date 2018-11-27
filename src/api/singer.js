import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  // 把公共参数和其他参数合并
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'eu_team_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    g_tk: 450152082,
    platform: 'yqq',
    needNewCode: 0,
    format: 'jsonp'
  })
  return jsonp(url, data, options)
}

// export function getSongUrlPrev(songmid,filename) {
//   const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
//   // 把公共参数和其他参数合并
//   const data = Object.assign({}, commonParams, {
//     g_tk: 5381,
//     loginUin: 0,
//     hostUin: 0,
//     format: 'json',
//     inCharset: 'utf8',
//     outCharset: 'utf-8',
//     notice: 0,
//     platform: 'yqq',
//     needNewCode: 0,
//     cid: 205361747,
//     uin: 0,
//     songmid: songmid,
//     filename: filename,
//     guid: 6347090065
//   })
//   return jsonp(url, data, options)
// }



export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  // 把公共参数和其他参数合并
  const data = Object.assign({}, commonParams, {
    singermid: singerId,
    loginUin: 0,
    hostUin: 0,
    g_tk: 5381,
    platform: 'yqq',
    needNewCode: 0,
    format: 'jsonp',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1
  })
  return jsonp(url, data, options)
}
