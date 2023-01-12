import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout.vue')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index.vue')
const SubCategory = () => import('@/views/category/sub.vue')
const Goods = () => import('@/views/goods/index')

const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '/',
        component: Home
      },
      {
        path: '/category/:id',
        component: TopCategory
      },
      {
        path: '/category/sub/:id',
        component: SubCategory
      },
      {
        path: 'product/:id',
        component: Goods
      }
    ]
  }, {
    path: '/login',
    component: () => import('@/views/login/index')
  }
]

const router = createRouter({
  // 使用hash的路由模式
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})

export default router
