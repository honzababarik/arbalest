import Vue from 'vue';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faEllipsisV, faPlayCircle, faPen, faTrashAlt, faStopCircle, faBan, faCog, faTimes, faPlus, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Notifications from 'vue-notification';
import VModal from 'vue-js-modal';

import App from './App';
import router from './router';
import store from './store';
import dvlt from './assets/js/core.js';
import Panel from './components/Panel';

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'));
}
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(Notifications);
Vue.use(VModal, { dynamic: true });

library.add(faSpinner, faEllipsisV, faPlayCircle, faPen, faTrashAlt, faStopCircle, faBan, faCog, faTimes, faPlus, faChevronDown, faChevronUp);

Vue.component('Icon', FontAwesomeIcon);
Vue.component('Panel', Panel);
Vue.use({
  install() {
    Vue.prototype.$dvlt = dvlt;
  },
});

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
