import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store/store'
import Keycloak from 'keycloak-js'

Vue.config.productionTip = false
//Vue.config.silent = true

let initOptions = {
  url: 'https://auth.cern.ch/auth', realm: 'cern', clientId: 'cms-hlt-gui-test'
}

let keycloak = Keycloak(initOptions);

keycloak.init({ onLoad: 'login-required', flow: 'implicit' }).then((auth) => {
    if (!auth) {
       window.location.reload();
    } else {
      Vue.set(store,'token',keycloak.token)
      new Vue({
            vuetify,
            store,
            render: (h)	=> h(App, { props: { keycloak: keycloak } }) 
      }).$mount('#app')

  }

  //Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      //Vue.$log.error('Refreshed token');	 
    }).catch(() => {
      //Vue.$log.error('Failed to refresh token');
    });
  }, 6000)

  }).catch(() => {
  //Vue.$log.error("Authenticated Failed");
});


