export default class Singer {
  constructor ({id, name,avatar,singerId}) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${avatar}.jpg?max_age=2592000`
    this.singerId=singerId
  }
}
