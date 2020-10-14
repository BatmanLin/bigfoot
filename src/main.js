import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './assets/global.css'
import axios from 'axios'
// import 'vue-google-maps/dist/vue-googlemaps.css'
// import VueGoogleMaps from 'vue2-google-maps'
// Vue.use(VueGoogleMaps, {
//   load: {
// //apikey
//     apiKey: 'AIzaSyDWRGeaGrDDtnb1flKsFxoO2xRXE7XqAPQ',
//     libraries: '3.26',
//     useBetaRenderer: false,
//   },
// })

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
