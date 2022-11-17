import { app, ipcMain } from 'electron'
const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(app.getPath('userData'), 'app.db');
let sqlite3DB = null;

function initDB() {
  const dbPath = path.join(app.getPath('userData'), 'app.db')
  console.log(`### appDB:init ${dbPath}`)
  return new Promise((resolve, reject) => {
    sqlite3DB = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.log(`### initDB failed in Database() ${dbPath}`)
        return reject(err)
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
        return reject(err)
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
        return reject(err)
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
        return reject(err)
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

export default {
  init() {
    ipcMain.handle('appDB:init', async (event) => {
      return initDB()
        .then(() => {
          return createTables()
        })
        .then(() => {
          return cleanDBLogs()
        })
        .then(() => {
          return
        })
        .catch((err) => {
          return err
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
  },
  deinit() {
    return new Promise((resolve, reject) => {
      if (sqlite3DB != null) {
        return resolve();
      }

      sqlite3DB.close(() => {
        resolve();
      });
    });
  }
}