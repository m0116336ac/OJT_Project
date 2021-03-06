import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false

Vue.prototype.$http = (url, opts) => fetch(url,opts)
Vue.use(VModal);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
