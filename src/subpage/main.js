// import Vue from 'vue'
// Vue.config.productionTip = false

// new Vue({
//   render: h => h('div', 'Welcome to the second page!')
// }).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Bus from "@/services/bus"
import electron from 'electron'

Vue.prototype.$bus = Bus;
Vue.prototype.$electron= electron

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


