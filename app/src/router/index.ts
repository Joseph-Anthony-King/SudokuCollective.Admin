import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";
import { toast } from "vue3-toastify";
import { useAppStore } from "@/store/appStore";
import { useUserStore } from "@/store/userStore";
import commonUtitlities from "@/utilities/common";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import(/* webpackChunkName: 'dashboard' */ "../views/DashboardView.vue"),
  },
  {
    path: "/confirm-email/:token?",
    name: "confirm-email",
    component: () =>
      import(/* webpackChunkName: 'dashboard' */ "../views/ConfirmEmailView.vue"),
    props: true,
  },
  {
    path: "/:action?",
    name: "home",
    component: () =>
      import(/* webpackChunkName: 'home' */ "../views/HomeView.vue"),
    props: true,
  },
  {
    path: "/reset-password/:token?",
    name: "resetPassword",
    component: () =>
      import(/* webpackChunkName: 'dashboard' */ "../views/ResetPasswordView.vue"),
    props: true,
  },
  {
    path: "/site-admin",
    name: "site-admin",
    component: () =>
      import(/* webpackChunkName: 'site-admin' */ "../views/SiteAdminView.vue"),
  },
  {
    path: "/sudoku/:action?",
    name: "sudoku",
    component: () =>
      import(/* webpackChunkName: 'sudoku' */ "../views/SudokuView.vue"),
    props: true,
  },
  {
    path: "/user-profile",
    name: "user-profile",
    component: () =>
      import(/* webpackChunkName: 'user' */ "../views/UserProfileView.vue"),
  },
];

const refreshToken = (
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void => {
  const user = useUserStore().getUser;
  if (user.isLoggedIn && !user.isLoggingIn) {
    const { clearStores } = commonUtitlities();
    clearStores();
  }
  user.isLoggingIn = true;
  useUserStore().updateUser(user);
  toast("The authorization token has expired, please sign in again", {
    position: toast.POSITION.TOP_CENTER,
    type: toast.TYPE.WARNING,
  });
  next(`/login`);
};

const checkUserLoggedIn = (next: NavigationGuardNext): void => {
  const user = useUserStore().getUser;
  if (user.isLoggedIn) {
    next();
  } else {
    toast("You must be logged in to view this page", {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
    next("/");
  }
};

const checkSuperAdmin = (next: NavigationGuardNext): void => {
  const user = useUserStore().getUser;
  if (user.isSuperUser) {
    next();
  } else {
    toast("You must be a super user to access this page", {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
    next("/");
  }
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if ((to.name === undefined || to.name?.toString().toLowerCase()  === "home") && to.path.toLowerCase()  !== "/" && to.path.toLowerCase()  !== "/login" && to.path.toLowerCase()  !== "/signup") {
    toast("Invalid route requested", {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
    next("/");
  } else if (to.name === "home" || to.name === "sudoku") {
    if (to.params.action.toString().toLowerCase() === "login") {
      useUserStore().updateUserIsLoggingIn(true);
      useUserStore().updateUserIsSigningUp(false);
    }
    if (to.params.action.toString().toLowerCase() === "signup") {
      useUserStore().updateUserIsLoggingIn(false);
      useUserStore().updateUserIsSigningUp(true);
    }
    next();
  } else if (to.name === "confirm-email" || to.name === "reset-password") {
    next();
  }  else {
    if (useAppStore().isTokenExpired()) {
      refreshToken(from, next);
    }

    if (to.name === "site-admin") {
      checkSuperAdmin(next);
    } else {
      checkUserLoggedIn(next);
    }
  }
});

export default router;
