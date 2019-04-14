import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import TestEdit from '@/components/TestEdit';
import Test from '@/components/Test';

Vue.use(Router);

const router = new Router({
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/tests/create', name: 'test-create', component: TestEdit },
    { path: '/tests/:config_id', name: 'test', component: Test },
    { path: '/tests/:config_id/edit', name: 'test-edit', component: TestEdit },
  ],
});

export default router;
