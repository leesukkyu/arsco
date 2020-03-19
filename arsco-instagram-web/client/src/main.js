// 설정
window.ARSCO_CONFIG = {
  ARSCO_ID: process.env.VUE_APP_ARSCO_ID,
  ARSCO_MEDIA_SERVER:
  process.env.VUE_APP_ARSCO_MEDIA_SERVER,
  IP_DOMAIN: process.env.VUE_APP_IP_DOMAIN,
  DNS_DOMAIN: process.env.VUE_APP_DNS_DOMAIN,
};

import Vue from 'vue';
import './plugins/axios';
import App from './App.vue';
import VueMasonry from 'vue-masonry-css';
import VueCalendar from 'v-calendar';

import '../public/css/reset.css'
import '../public/css/index.css'
import '../public/css/magic-check.css'

Vue.use(VueMasonry);
Vue.use(VueCalendar);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
