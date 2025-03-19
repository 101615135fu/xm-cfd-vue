import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', redirect: '/main/dashboard'
    },
    {
      path: '/main', name: 'home', component: () => import('../views/Home.vue'), children: [
        { path: 'dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue') },
        // { path: 'discover', name: 'discover', component: () => import('../views/Discover.vue') },
        // { path: 'analysis', name: 'analysis', component: () => import('../views/Analysis.vue') },
      ]
    },
  ],
})

export default router
