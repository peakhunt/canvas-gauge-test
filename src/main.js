import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import { ipcRenderer } from 'electron'

Vue.config.productionTip = false;

//
// initialize sqlite3 database
//
(async () => {
  console.log('appDB:init')
  let err = await ipcRenderer.invoke('appDB:init')

  if (err) {
    console.log(`error appDB:init ${err}`)
  }
  console.log('appDB:init done')
})()

console.log('proceeding')

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
