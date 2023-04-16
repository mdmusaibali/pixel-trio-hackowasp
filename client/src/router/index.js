import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./../views/LoginView.vue";
import HomeView from "./../views/HomeView.vue";
import DashboardView from "./../views/Home/DashboardView.vue";
import ServicesView from "./../views/Home/ServicesView.vue";
import SettingsView from "./../views/Home/SettingsView.vue";
import { store } from "../store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      redirect: "/home/dashboard",
      meta: {
        needAuth: true,
      },
      children: [
        {
          path: "/home/dashboard",
          name: "dashboard",
          component: DashboardView,
        },
        {
          path: "/home/services",
          name: "services",
          component: ServicesView,
        },
        {
          path: "/home/settings",
          name: "settings",
          component: SettingsView,
        },
      ],
    },
  ],
});

router.beforeEach(function (to, from, next) {
  if (to.meta.needAuth) {
    if (store.getters["user/isLoggedIn"]) {
      next();
    } else {
      next("/");
    }
  } else {
    next();
  }
});

export default router;
