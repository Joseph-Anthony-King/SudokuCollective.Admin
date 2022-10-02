import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: 'home' */ '../views/HomeView.vue')
  },
  {
    path: '/sudoku',
    name: 'sudoku',
    component: () => import(/* webpackChunkName: 'sudoku' */ '../views/SudokuView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
