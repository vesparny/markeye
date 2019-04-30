const { shell } = require('electron')
const actions = require('./actions')

module.exports = app => {
  return [
    {
      label: 'Markeye',
      submenu: [
        {
          label: 'About markeye',
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide markeye',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: app.quit
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: actions.openFile
        },
        {
          type: 'separator'
        },
        {
          label: 'Export As HTML',
          enabled: false,
          click: () => {}
        },
        {
          label: 'Export As PDF',
          enabled: false,
          click: () => {}
        },
        {
          type: 'separator'
        },
        {
          label: 'Print',
          accelerator: 'CmdOrCtrl+P',
          click: () => {}
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: function () {
            shell.openExternal('https://github.com/vesparny/markeye#readme')
          }
        },
        {
          label: 'Report Issue',
          click: function () {
            shell.openExternal('https://github.com/vesparny/markeye/issues')
          }
        },
        {
          label: 'Source Code on GitHub',
          click: function () {
            shell.openExternal('https://github.com/vesparny/markeye')
          }
        },
        {
          label: 'Changelog',
          click: () => {
            shell.openExternal(
              'https://github.com/vesparny/markeye/blob/master/CHANGELOG.md'
            )
          }
        },
        {
          label: 'Markdown syntax',
          click: () => {
            shell.openExternal(
              'https://daringfireball.net/projects/markdown/syntax'
            )
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Follow @vesparny on Twitter',
          click: () => {
            shell.openExternal('https://twitter.com/vesparny')
          }
        }
      ]
    }
  ]
}
