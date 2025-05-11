import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', name: 'homePage', component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/main', name: 'home', component: () => import('../views/Home.vue'), children: [
        { path: 'dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue') },
        { path: 'data-visualization', name: 'data-visualization', component: () => import('../views/DataVisualization.vue') },
        {
          path: '/product/:id', name: 'product-detail', component: () => import('../views/Products.vue'),props: true
        },
        {
          path: '/category/:category?',name: 'category',component: () => import('../views/Category.vue'),props: true
        },
        
      ]
    },
    
    
  ],
})

export default router
