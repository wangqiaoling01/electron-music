/*
 * @Description: 渲染进程：可以使用node api、DOM api
 * @Version: 1.0
 * @Autor: WangQiaoLing
 * @Date: 2020-07-03 09:18:41
 * @LastEditors: WangQiaoLing
 * @LastEditTime: 2020-07-03 09:56:58
 */

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
// alert(process.versions.node)
const { ipcRenderer } = require('electron')
window.addEventListener('DOMContentLoaded', () => {
  // render 发送消息 message
  ipcRenderer.send('message', 'hello from render')
  // main 接收消息方式1 reply
  ipcRenderer.on('reply', (event, arg) => {
    document.getElementById('message').innerHTML = arg
  })
})
