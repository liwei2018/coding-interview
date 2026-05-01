import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', redirect: '/pc/detail?id=1' },
  { path: '/pc/detail', component: () => import('@/views/pc/Detail.vue') },
  { path: '/pc/cart', component: () => import('@/views/pc/Cart.vue') },
  { path: '/mobile/detail', component: () => import('@/views/mobile/Detail.vue') },
  { path: '/mobile/cart', component: () => import('@/views/mobile/Cart.vue') },
];

export default createRouter({ history: createWebHashHistory(), routes });
