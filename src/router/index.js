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
        { path: 'data-visualization', name: 'data-visualization', component: () => import('../views/DataVisualization.vue') },
        {
          path: '/product/:id', name: 'product-detail', component: () => import('../views/Products.vue'),props: true
        },
        {
          path: '/category/:category?',name: 'category',component: () => import('../views/Category.vue'),props: true
        }
      ]
    },
    // 添加产品详情页路由
    
    
  ],
})

export default router
