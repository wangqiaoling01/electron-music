/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-03 11:21:46
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-03 18:54:07
 */
const Store = require('electron-store')
const UUID = require('uuid')
const path = require('path')
module.exports = class MusicDataStore extends Store {
  constructor(settings) {
    super(settings)
    this.tracks = this.get('tracks') || []
  }
  saveTracks() {
    this.set('tracks', this.tracks)
    return this
  }
  getTracks() {
    return this.get('tracks') || []
  }
  // 添加音乐
  addTracks(tracks) {
    const trackWithProps = tracks
      .map((track) => {
        // 对当前音乐进行封装，添加 id 等
        return {
          id: UUID.v4(),
          path: track,
          fileName: path.basename(track),
        }
      })
      .filter((track) => {
        // 过滤，避免重复添加
        const currentTracksPath = this.getTracks().map((track) => track.path)
        return currentTracksPath.indexOf(track.path) < 0
      })
    this.tracks = [...this.tracks, ...trackWithProps]
    return this.saveTracks()
  }
  deleteTrack(deleteId) {
    this.tracks = this.tracks.filter((item) => item.id !== deleteId)
    return this.saveTracks()
  }
}
