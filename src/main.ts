import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store/store'
import KeyCloaker from './lib/KeyCloaker'

Vue.config.productionTip = false

KeyCloaker.initKeyCloaker(true) //set false if no server exists

//console.log('MAIN.TS KEYCLOKER: ' + JSON.stringify(globalThis.keyCloaker))
if (globalThis.keyCloaker == null)
  new Vue({
    vuetify,
    store,
    render: (h) => h(App),
  }).$mount('#app')
else {
  //console.log('TRYING')
  globalThis.keyCloaker
    .init({ onLoad: 'login-required', flow: 'implicit' })
    .then((auth) => {
      if (!auth) {
        window.location.reload()
      } else {
        Vue.set(store, 'token', globalThis.keyCloaker.token)
        new Vue({
          vuetify,
          store,
          render: (h) => h(App),
        }).$mount('#app')
      }

      //Token Refresh
      setInterval(() => {
        globalThis.keyCloaker
          .updateToken(70)
          .then((refreshed) => {
            //Vue.$log.error("Refreshed token");
           // console.log('Refreshed token')
          })
          .catch(() => {
            //Vue.$log.error("Failed to refresh token");
            //console.log('Failed to refresh token')
          })
      }, 6000)
    })
    .catch(() => {
      //Vue.$log.error("Authenticated Failed");
      console.log('Authenticated Failed')
    })
}
