import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import ConfigEdit from '@/components/ConfigEdit';
import Config from '@/components/Config';

Vue.use(Router);

const router = new Router({
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/configs/create', name: 'config-create', component: ConfigEdit },
    { path: '/configs/:config_id', name: 'config', component: Config },
    { path: '/configs/:config_id/edit', name: 'config-edit', component: ConfigEdit },
  ],
});

export default router;
