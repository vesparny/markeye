const { app, Menu, shell } = require('electron')
const windowStateKeeper = require('electron-window-state')
const w = require('electron-window')
const createMenu = require('./create-menu')
const actions = require('./actions')
let fileToLaod = null

app.on('open-file', (event, path) => {
  if (app.isReady()) {
    createWindow(path)
  } else {
    fileToLaod = path
  }
})

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

function openExternal (e, url) {
  e.preventDefault()
  shell.openExternal(url)
}

function ready () {
  createWindow(fileToLaod)
}

function createWindow (file) {
  const menu = Menu.buildFromTemplate(createMenu(app))
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  })
  // eslint-disable-next-line
  const win = new w.createWindow({
    webPreferences: {
      nodeIntegration: true
    },
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  })
  win.showUrl(`${__dirname}/index.html`, () => {
    if (file) {
      actions.loadAndWathcFileForChanges(file, win)
    } else {
      win.setTitle('Markeye')
    }
    Menu.setApplicationMenu(menu)
    mainWindowState.manage(win)
    win.webContents.on('new-window', openExternal)
    win.webContents.on('will-navigate', openExternal)
  })

  return win
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (Object.keys(w.windows).length === 0) {
    createWindow()
  }
})

app.on('ready', ready)
