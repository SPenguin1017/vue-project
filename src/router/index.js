import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import SecondPage from '../components/SecondPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/second',
    name: 'SecondPage',
    component: SecondPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
