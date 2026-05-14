import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/auth";

import HomePage from "@/pages/HomePage.vue";
import MainLayout from "@/components/MainLayout.vue";
import LoginPage from "@/pages/LoginPage.vue"
import PrivacyPage from "@/pages/PrivacyPage.vue";
import ToDo from "@/components/ToDo.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainLayout,
      children :
        [
            {
                path : "" ,
                name : "homePage" ,
                component : HomePage
            } ,
            {
              path: "/apply",
              component: ToDo ,
              meta : { requiresAuth : true }
            },
            {
              path: "/status",
              component: ToDo ,
              meta : { requiresAuth : true }
            },
            {
              path: "/support",
              component: ToDo
            },
            {
              path: "/privacy",
              component: PrivacyPage,
              meta : {
                  page : "privacy"
              }
            },
            {
              path: "/terms",
              component: ToDo
            }
        ]
    },
    {
        path : "/login" ,
        component : LoginPage
    }
  ],
});
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !auth.user) {
    return "/login";
  }
});