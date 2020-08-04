/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-03 10:09:29
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-03 18:41:34
 */
const { ipcRenderer } = require('electron')
const { $, convertDuration } = require('./helper')
const path = require('path')
let musicAudio = new Audio()
let allTracks = []
let currentTrack
$('add-music-btn').addEventListener('click', () => {
  ipcRenderer.send('add-music-window')
})
ipcRenderer.on('get-tracks', (event, tracks) => {
  console.log('receive tracks', tracks)
  allTracks = tracks
  renderListHtml(tracks)
})

const renderListHtml = (tracks) => {
  const tracksListHtml = tracks.reduce((html, track) => {
    html += `<li class="row music-track list-group-item d-flex justify-content-between align-items-center">
      <div class="col-10">
        <i class="fa fa-music mr-2 text-secondary" aria-hidden="true"></i>
        <b>${track.fileName}</b>
      </div>
      <div class="col-2">
      <i class="fa fa-play mr-3" data-id="${track.id}"></i>
      <i class="fa fa-trash" data-id="${track.id}"></i>
      </div>
    </li>`
    return html
  }, '')
  $('tracksList').innerHTML = tracks.length
    ? `<ul class="list-group">${tracksListHtml}</ul>`
    : '<div class="alert alert-primary">还没有添加任何音乐</div>'
}
const renderPlayerHtml = (name, duration) => {
  const player = $('player-status')
  const html = `<div class="col font-weight-bold">
                  正在播放：${name}
                </div>
                <div class="col">
                  <span id="current-seeker">00:00</span> / ${convertDuration(
                    duration
                  )}
                </div>`
  player.innerHTML = html
}
const updateProgressHtml = (currentTime, duration) => {
  $('current-seeker').innerHTML = convertDuration(currentTime)
  // 计算 progress
  const progress = Math.floor((currentTime / duration) * 100)
  // console.log(process + '%')
  // console.log(progress.toString())

  const bar = $('player-progress')
  bar.innerHTML = progress.toString() + '%'
  bar.style.width = progress.toString() + '%'
}

musicAudio.addEventListener('loadedmetadata', () => {
  // 开始渲染播放器状态
  renderPlayerHtml(currentTrack.fileName, musicAudio.duration)
})
musicAudio.addEventListener('timeupdate', () => {
  // 更新播放器状态
  updateProgressHtml(musicAudio.currentTime, musicAudio.duration)
})
$('tracksList').addEventListener('click', (event) => {
  event.preventDefault()
  const { dataset, classList } = event.target
  const id = dataset && dataset.id
  if (id && classList.contains('fa-play')) {
    // 开始播放
    // 判断是否为当前播放的音乐
    if (currentTrack && currentTrack.id === id) {
      // 继续播放当前的歌曲
      musicAudio.play()
    } else {
      // 播放新的歌曲，还原之前的图标
      currentTrack = allTracks.find((track) => track.id === id)
      musicAudio.src = currentTrack.path
      musicAudio.play()
      const resetIconEle = document.querySelector('.fa-pause')
      if (resetIconEle) {
        resetIconEle.classList.replace('fa-pause', 'fa-play')
      }
    }
    classList.replace('fa-play', 'fa-pause')
  } else if (id && classList.contains('fa-pause')) {
    // 暂停播放
    musicAudio.pause()
    classList.replace('fa-pause', 'fa-play')
  } else if (id && classList.contains('fa-trash')) {
    // 发送删除该条音乐事件
    ipcRenderer.send('delete-track', id)
  }
})
