/*
 * @Description: Description
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-03 10:09:43
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-03 13:31:04
 */
const { ipcRenderer } = require('electron')
const { $ } = require('./helper')
const path = require('path')
let musicFilesPath = []
$('select-music').addEventListener('click', () => {
  ipcRenderer.send('open-music-file')
})

const renderListHtml = (pathes) => {
  const musicList = $('musicList')
  const musicItemsHTML = pathes.reduce((html, music) => {
    html += `<li class="list-group-item">${path.basename(music)}</li>`
    return html
  }, '')
  musicList.innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`
}

ipcRenderer.on('selected-files', (event, fileObj) => {
  console.log('selected-files', fileObj)

  const { filePaths } = fileObj
  if (Array.isArray(filePaths)) {
    renderListHtml(filePaths)
    musicFilesPath = filePaths
  }
})

$('add-music').addEventListener('click', () => {
  console.log('add-music click')
  musicFilesPath.length
    ? ipcRenderer.send('add-tracks', musicFilesPath)
    : alert('还未添加歌曲')
  // 添加验证 如果为空 则给出提醒
})
