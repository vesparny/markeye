const { app, Menu, dialog, BrowserWindow, shell } = require('electron')
const windowStateKeeper = require('electron-window-state')
const w = require('electron-window')
const fs = require('fs')
const path = require('path')

let fileToLaod = null

function loadAndWathcFileForChanges(filePath, win) {
  fs.readFile(filePath, 'utf-8', (err, file) => {
    if (err) return cb(err)
    win.setTitle('Markeye - ' + filePath)
    win.webContents.send('M::file-loaded', {
      file,
      filePath,
      basePath: path.dirname(filePath)
    })
    unwatchAll()
    watched.push(filePath)
    fs.watchFile(filePath, { interval: 100 }, () => {
      loadAndWathcFileForChanges(filePath, win)
    })
  })
}

app.on('open-file', (event, path) => {
  if (app.isReady()) {
    createWindow(path)
  } else {
    fileToLaod = path
  }
})

let watched = []
// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

function openExternal(e, url) {
  e.preventDefault()
  shell.openExternal(url)
}

function unwatchAll() {
  watched.forEach(fs.unwatchFile)
}

function ready() {
  createWindow(fileToLaod)
}

var showOpen = function(menuItem, browserWindow) {
  dialog.showOpenDialog(
    {
      properties: ['openFile'],
      filters: [{ name: 'markdown', extensions: ['md', 'markdown'] }]
    },
    paths => {
      loadAndWathcFileForChanges(paths[0], browserWindow)
    }
  )
}

var template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: showOpen
      },
      {
        label: 'Quit',
        accelerator: 'Cmd+Q',
        role: 'quit'
      }
    ]
  }
]

function createWindow(file) {
  const menu = Menu.buildFromTemplate(template)
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  })
  const win = new w.createWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  })
  win.showUrl(`${__dirname}/index.html`, () => {
    if (file) {
      loadAndWathcFileForChanges(file, win)
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
