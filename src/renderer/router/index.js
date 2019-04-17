import Vue from 'vue';
import Router from 'vue-router';
import HomeView from '@/views/HomeView';
import TestEditView from '@/views/TestEditView';
import TestView from '@/views/TestView';

Vue.use(Router);

const router = new Router({
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/tests/create', name: 'test-create', component: TestEditView },
    { path: '/tests/:test_id', name: 'test', component: TestView },
    { path: '/tests/:test_id/edit', name: 'test-edit', component: TestEditView },
  ],
});

export default router;
