import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store/userStore/index';
import { toast } from 'vue3-toastify';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: 'dashboard' */ '../views/DashboardView.vue'),
    beforeEnter: checkUserLoggedIn,
  },
  {
    path: '/:action?',
    name: 'home',
    component: () => import(/* webpackChunkName: 'home' */ '../views/HomeView.vue'),
    props: true,
  },
  {
    path: '/site-admin',
    name: 'site-admin',
    component: () => import(/* webpackChunkName: 'site-admin' */ '../views/SiteAdminView.vue'),
    beforeEnter: checkSuperAdmin,
  },
  {
    path: '/sudoku/:action?',
    name: 'sudoku',
    component: () => import(/* webpackChunkName: 'sudoku' */ '../views/SudokuView.vue'),
    props: true,
  },
  {
    path: '/user-profile',
    name: 'user-profile',
    component: () => import(/* webpackChunkName: 'user' */ '../views/UserProfileView.vue'),
    beforeEnter: checkUserLoggedIn,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

function checkUserLoggedIn (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const user = useUserStore().getUser;
  if (user.isLoggedIn) {
    next();
  } else {
    toast('You must be logged in to view this page.', {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
    next("/");
  }
}

function checkSuperAdmin (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
  const user = useUserStore().getUser;
  if (user.isSuperUser) {
    next();
  } else {
    toast('You must be a super user to access this page.', {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
    next("/");
  }
}

export default router
