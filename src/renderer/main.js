import Vue from 'vue';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faEllipsisV, faPlayCircle, faPen, faTrashAlt, faStopCircle, faBan, faCog, faTimes, faPlus, faChevronDown, faChevronUp, faCloudUploadAlt, faHourglass, faPause, faGripLines, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Notifications from 'vue-notification';
import VModal from 'vue-js-modal';
import VTooltip from 'v-tooltip';
import VueApexCharts from 'vue-apexcharts';

import App from './App';
import router from './router';
import store from './store';
import dvlt from './assets/js/core.js';
import Panel from './components/Panel';
require('./styles/master.scss');

if (!process.env.IS_WEB) {
  Vue.use(require('vue-electron'));
}

Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(Notifications);

Vue.use(VTooltip);
VTooltip.options.defaultPlacement = 'bottom';

Vue.use(VModal, { dynamic: true });

Vue.component('Icon', FontAwesomeIcon);
library.add(faSpinner, faEllipsisV, faPlayCircle, faPen, faTrashAlt, faStopCircle, faBan, faCog, faTimes, faPlus, faChevronDown, faChevronUp, faCloudUploadAlt, faHourglass, faPause, faGripLines, faFileExport);

Vue.component('Panel', Panel);

Vue.use(VueApexCharts);
Vue.component('Chart', VueApexCharts);

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
