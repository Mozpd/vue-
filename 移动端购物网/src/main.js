import Vue from 'vue'
import router from './router/router.js'
import store from './store/store.js'
import axios from 'axios'
import App from './App' // eslint-disable-line
Vue.prototype.$http = axios

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
Vue.config.productionTip=false
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: { App },// eslint-disable-line
  render: h => h(App)// eslint-disable-line
}).$mount('#app')

