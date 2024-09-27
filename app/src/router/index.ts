import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteRecordRaw,
} from 'vue-router';
import { toast } from 'vue3-toastify';
import { useGlobalStore } from '@/stores/globalStore';
import { useSignUpFormStore } from '@/stores/formStores/signUpFormStore';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/models/domain/user';
import { StoreType } from '@/enums/storeTypes';
import commonUtilities from '@/utilities/common';

//#region Routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/confirm-email/:token?',
    name: 'confirm-email',
    component: () => import('../views/ConfirmEmailView.vue'),
    props: true,
  },
  {
    path: '/:action?',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    props: true,
  },
  {
    path: '/reset-password/:token?',
    name: 'reset-password',
    component: () => import('../views/ResetPasswordView.vue'),
    props: true,
  },
  {
    path: '/site-admin',
    name: 'site-admin',
    component: () => import('../views/SiteAdminView.vue'),
  },
  {
    path: '/sudoku/:action?',
    name: 'sudoku',
    component: () => import('../views/SudokuView.vue'),
    props: true,
  },
  {
    path: '/user-profile',
    name: 'user-profile',
    component: () => import('../views/UserProfileView.vue'),
  },
];
//#endregion

//#region Methods
const refreshToken = (
  next: NavigationGuardNext,
  user: User,
  updateUser: (param: User) => void,
): void => {
  if (user.isLoggedIn && !user.isLoggingIn) {
    const { clearStores } = commonUtilities();
    clearStores();
  }
  user.isLoggingIn = true;
  updateUser(user);
  toast('The authorization token has expired, please sign in again', {
    position: toast.POSITION.TOP_CENTER,
    type: toast.TYPE.WARNING,
  });
  next(`/login`);
};

const applyUserLoggedInGuardRail = (next: NavigationGuardNext, user: User): void => {
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

const applySuperAdminGuardRail = (next: NavigationGuardNext, user: User): void => {
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
  //#region Destructure Assignments
  const { isTokenExpired } = useGlobalStore();
  const { updatePasswordToken } = useSignUpFormStore();
  const {
    getUser,
    getUserIsLoggedIn,
    getUserAsync,
    confirmEmailAsync,
    setServiceMessage: setUserStoreServiceMessage,
    updateUserIsLoggingIn,
    updateUserIsSigningUp,
    updateUser,
  } = useUserStore();
  const { displaySuccessfulToast, displayFailedToastAsync, updateAppProcessingAsync } =
    commonUtilities();
  //#endregion
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
    updateAppProcessingAsync(() => {
      if (to.params.action.toString().toLowerCase() === 'login') {
        updateUserIsLoggingIn(true);
        updateUserIsSigningUp(false);
      }
      if (to.params.action.toString().toLowerCase() === 'signup') {
        updateUserIsLoggingIn(false);
        updateUserIsSigningUp(true);
      }
      next();
    });
  } else if (to.name === 'confirm-email' || to.name === 'reset-password') {
    updateAppProcessingAsync(async () => {
      if (
        /^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$/.test(
          to.params.token.toString(),
        )
      ) {
        let result = true;

        if (to.name === 'confirm-email') {
          result = await confirmEmailAsync(to.params.token.toString());
        } else {
          updatePasswordToken(to.params.token.toString());
        }

        if (result) {
          displaySuccessfulToast(StoreType.USERSTORE);
          if (getUserIsLoggedIn) {
            await getUserAsync();
            setUserStoreServiceMessage();
            router.push('/user-profile');
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
    updateAppProcessingAsync(() => {
      if (isTokenExpired()) {
        refreshToken(next, getUser, updateUser);
      }

      if (to.name === 'site-admin') {
        applySuperAdminGuardRail(next, getUser);
      } else {
        applyUserLoggedInGuardRail(next, getUser);
      }
    });
  }
});
//#endregion

export default router;
