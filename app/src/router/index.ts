import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router';
import { toast } from 'vue3-toastify';
import { useGlobalStore } from '@/stores/globalStore';
import { useSignUpFormStore } from '@/stores/formStores/signUpFormStore';
import { useUserStore } from '@/stores/userStore';
import { StoreType } from '@/enums/storeTypes';
import commonUtilities from '@/utilities/common';

//#region Routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: 'dashboard' */ '../views/DashboardView.vue'),
  },
  {
    path: '/confirm-email/:token?',
    name: 'confirm-email',
    component: () => import(/* webpackChunkName: 'dashboard' */ '../views/ConfirmEmailView.vue'),
    props: true,
  },
  {
    path: '/:action?',
    name: 'home',
    component: () => import(/* webpackChunkName: 'home' */ '../views/HomeView.vue'),
    props: true,
  },
  {
    path: '/reset-password/:token?',
    name: 'reset-password',
    component: () => import(/* webpackChunkName: 'dashboard' */ '../views/ResetPasswordView.vue'),
    props: true,
  },
  {
    path: '/site-admin',
    name: 'site-admin',
    component: () => import(/* webpackChunkName: 'site-admin' */ '../views/SiteAdminView.vue'),
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
  },
];
//#endregion

//#region Methods
const refreshToken = (from: RouteLocationNormalized, next: NavigationGuardNext): void => {
  const user = useUserStore().getUser;
  if (user.isLoggedIn && !user.isLoggingIn) {
    const { clearStores } = commonUtilities();
    clearStores();
  }
  user.isLoggingIn = true;
  useUserStore().updateUser(user);
  toast('The authorization token has expired, please sign in again', {
    position: toast.POSITION.TOP_CENTER,
    type: toast.TYPE.WARNING,
  });
  next(`/login`);
};

const applyUserLoggedInGuardRail = (next: NavigationGuardNext): void => {
  const user = useUserStore().getUser;
  if (user.isLoggedIn) {
    next();
  } else {
    toast('You must be logged in to view this page', {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
    next('/');
  }
};

const applySuperAdminGuardRail = (next: NavigationGuardNext): void => {
  const user = useUserStore().getUser;
  if (user.isSuperUser) {
    next();
  } else {
    toast('You must be a super user to access this page', {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
    next('/');
  }
};
//#endregion

//#region CreateRouter
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
//#endregion

//#region BeforeEach guard rails
router.beforeEach(async (to, from, next) => {
  if (
    (to.name === undefined || to.name?.toString().toLowerCase() === 'home') &&
    to.path.toLowerCase() !== '/' &&
    to.path.toLowerCase() !== '/login' &&
    to.path.toLowerCase() !== '/signup'
  ) {
    // Handle invalid routes
    toast('Invalid route requested', {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
    next('/');
  } else if (to.name === 'home' || to.name === 'sudoku') {
    // Handle requests to home and sudoku and process the action prop
    const { updateAppProcessingAsync } = commonUtilities();

    updateAppProcessingAsync(() => {
      if (to.params.action.toString().toLowerCase() === 'login') {
        useUserStore().updateUserIsLoggingIn(true);
        useUserStore().updateUserIsSigningUp(false);
      }
      if (to.params.action.toString().toLowerCase() === 'signup') {
        useUserStore().updateUserIsLoggingIn(false);
        useUserStore().updateUserIsSigningUp(true);
      }
      next();
    });
  } else if (to.name === 'confirm-email' || to.name === 'reset-password') {
    // Handle requests to confirm-email and reset-password and process the token prop
    const { displaySuccessfulToast, displayFailedToastAsync, updateAppProcessingAsync } =
      commonUtilities();

    updateAppProcessingAsync(async () => {
      if (
        /^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$/.test(
          to.params.token.toString(),
        )
      ) {
        let result = true;

        if (to.name === 'confirm-email') {
          result = await useUserStore().confirmEmailAsync(to.params.token.toString());
        } else {
          useSignUpFormStore().updatePasswordToken(to.params.token.toString());
        }

        if (result) {
          displaySuccessfulToast(StoreType.USERSTORE);
          if (useUserStore().getUserIsLoggedIn) {
            await useUserStore().getUserAsync();
            useUserStore().updateServiceMessage();
            if (to.name === 'confirm-email') {
              router.push('/user-profile');
            } else {
              router.push('/');
            }
          } else {
            router.push('/');
          }
        } else {
          displayFailedToastAsync(undefined, undefined);
          router.push('/');
        }
      } else {
        toast('The token you submitted is not valid', {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.ERROR,
        });
        router.push('/');
      }
      next();
    });
  } else {
    /* Handle protected routes by first checking if the auth token has expired and if not
       apply check super admin and user logged in guard rails */
    const { updateAppProcessingAsync } = commonUtilities();

    updateAppProcessingAsync(() => {
      if (useGlobalStore().isTokenExpired()) {
        refreshToken(from, next);
      }

      if (to.name === 'site-admin') {
        applySuperAdminGuardRail(next);
      } else {
        applyUserLoggedInGuardRail(next);
      }
    });
  }
});
//#endregion

export default router;
