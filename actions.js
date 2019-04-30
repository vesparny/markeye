const { dialog } = require('electron')
const fs = require('fs')
const path = require('path')

let watched = []

function unwatchAll () {
  watched.forEach(fs.unwatchFile)
}

function loadAndWathcFileForChanges (filePath, win) {
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

module.exports = {
  openFile: (menuItem, browserWindow) => {
    dialog.showOpenDialog(
      {
        properties: ['openFile'],
        filters: [{ name: 'markdown', extensions: ['md', 'markdown'] }]
      },
      paths => {
        loadAndWathcFileForChanges(paths[0], browserWindow)
      }
    )
  },
  loadAndWathcFileForChanges
}
