import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:action?',
    name: 'home',
    component: () => import(/* webpackChunkName: 'home' */ '../views/HomeView.vue'),
    props: true,
  },
  {
    path: '/sudoku/:action?',
    name: 'sudoku',
    component: () => import(/* webpackChunkName: 'sudoku' */ '../views/SudokuView.vue'),
    props: true,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
