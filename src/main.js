import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import { ipcRenderer } from 'electron'

const log = require('electron-log')

Vue.config.productionTip = false;

//
// initialize sqlite3 database
//
(async () => {
  log.info('appDB:init')
  let err = await ipcRenderer.invoke('appDB:init')

  if (err) {
    log.error(`error appDB:init ${err}`)
  }
  log.info('appDB:init done')
})()

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
