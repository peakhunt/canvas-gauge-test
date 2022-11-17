'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const sqlite3 = require('sqlite3').verbose()
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')

const dbPath = path.join(app.getPath('userData'), 'app.db')
console.log(dbPath)
var sqlite3DB = null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    appQuit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        appQuit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      appQuit()
    })
  }
}

////////////////////////////////////////////////////////////////////////////////
//
// application specific functions
// mostly SQLITE3 database related
//
////////////////////////////////////////////////////////////////////////////////
function appQuit() {
  if (sqlite3DB) {
    sqlite3DB.close(() => {
      console.log('closing database')
      app.quit()
    })
  } else {
    app.quit()
  }
}

function initDB() {
  const dbPath = path.join(app.getPath('userData'), 'app.db')
  console.log(`### appDB:init ${dbPath}`)
  return new Promise((resolve, reject) => {
    sqlite3DB = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.log(`### initDB failed in Database() ${dbPath}`)
        reject(err)
      }
      console.log(`### initDB Database() success ${dbPath}`)
      resolve()
    })
  })
}

function createTables() {
  return new Promise((resolve, reject) => {
    console.log(`### createTables creating table`)
    sqlite3DB.run('create table if not exists datalog (time text primary key, value number not null)', (err) => {
      if (err) {
        console.log(`### createTables creating table failed ${err}`)
        reject(err)
      }
      console.log(`### createTables creating table success`)
      resolve()
    })
  })
}

function cleanDBLogs() {
  return new Promise((resolve, reject) => {
    sqlite3DB.run('delete from datalog', (err) => {
      if (err) {
        console.log(`### cleaning datalog failed ${err}`)
        reject(err)
      }
      console.log(`### database cleanup success`)
      resolve()
    })
  })
}

function addLogToDB(log) {
  return new Promise((resolve, reject) => {
    sqlite3DB.run('insert into datalog(time, value) values (?, ?)',  [log.time, log.value], (err) => {
      if (err) {
        console.log(`insert into datalog failed ${err}`)
        reject(err)
      }
      resolve()
    })
  })
}

function getLogsFromDB() {
  return new Promise((resolve, reject) => {
    sqlite3DB.all('select * from datalog', (err, rows) => {
      if (err) {
        console.log(`select from datalog failed ${err}`)
        reject({ error: err, rows: undefined })
      }
      resolve( { error: undefined, rows })
    })
  })
}

ipcMain.handle('appDB:init', async (event) => {
  return initDB()
  .then(() => {
    return createTables()
  })
  .then(() => {
    return cleanDBLogs()
  })
})

ipcMain.handle('appDB:cleanLogs', async (event) => {
  return cleanDBLogs()
})

ipcMain.handle('appDB:addLog', async (event, data) => {
  return addLogToDB(data)
})

ipcMain.handle('appDB:getLogs', async (event) => {
  return getLogsFromDB()
})
