import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import VueMasonry from 'vue-masonry-css'
import VueCalendar from 'v-calendar'

Vue.use(VueMasonry);
Vue.use(VueCalendar)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
