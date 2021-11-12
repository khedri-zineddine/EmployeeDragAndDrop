import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Main from '../views/Main.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/editor",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: '/editor',
        name: 'App',
        component: Main
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
