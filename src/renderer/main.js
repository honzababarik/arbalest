import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faCoffee, faSignOutAlt, faPlus, faClock, faPlane, faPlaneDeparture, faPlaneArrival, faBed, faChevronLeft, faMapPin } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

library.add(faCoffee, faSignOutAlt, faSpinner, faPlus, faPlane, faClock, faPlaneDeparture, faPlaneArrival, faBed, faChevronLeft, faMapPin);

Vue.component('font-awesome-icon', FontAwesomeIcon);

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
