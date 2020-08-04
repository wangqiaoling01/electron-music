const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const pagePath = path.resolve(__dirname, 'render')
const DataStore = require('./MusicDataStore')
const myStore = new DataStore({ name: 'Music Data' })

class createWindow extends BrowserWindow {
  constructor(config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    }
    const finalConfig = { ...basicConfig, ...config }
    super(finalConfig)
    this.loadFile(fileLocation)
    // 优化
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}
// 主进程
app.on('ready', () => {
  const mainWindow = new createWindow({}, path.join(pagePath, 'index.html'))
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('did-finish-load')
    mainWindow.send('get-tracks', myStore.tracks)
  })
  ipcMain.on('add-music-window', () => {
    // const addMusicWindow =
    new createWindow(
      {
        width: 500,
        height: 400,
        parent: mainWindow,
      },
      path.join(pagePath, 'add.html')
    )
  })
  ipcMain.on('open-music-file', (event) => {
    // console.log('open-music-file')
    dialog
      .showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Music', extensions: ['mp3'] }],
      })
      .then((result) => {
        console.log('result = ', result)

        if (result) {
          event.sender.send('selected-files', result)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
  ipcMain.on('add-tracks', (event, tracks) => {
    console.log('ipcMain add-tracks', tracks)
    const updateTracks = myStore.addTracks(tracks).getTracks()
    console.log('updateTracks', updateTracks)
    mainWindow.send('get-tracks', updateTracks)
  })
  ipcMain.on('delete-track', (event, id) => {
    const updateTracks = myStore.deleteTrack(id).getTracks()
    mainWindow.send('get-tracks', updateTracks)
  })
})
