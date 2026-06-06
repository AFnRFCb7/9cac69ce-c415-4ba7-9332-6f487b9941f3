import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/auth";

import HomePage from "@/pages/HomePage.vue";
import MainLayout from "@/components/MainLayout.vue";
import LoginPage from "@/pages/LoginPage.vue"
import NewsPage from "@/pages/NewsPage6.vue"
import MarkdownPage from "@/pages/MarkdownPage.vue";
import ChatPage from "@/pages/ChatPage.vue";
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
                component : MarkdownPage ,
                meta : {
                    page : "home"
                }
            } ,
            {
              path: "/apply",
              component: ToDo ,
              meta : { requiresAuth : true }
            },
            {
              path: "/chat",
              component: ChatPage ,
              meta : { requiresAuth : true }
            },
            {
              path: "/citizenship",
              component: MarkdownPage,
              meta : {
                  page : "citizenship"
              }
            },
            {
                path : "/news",
                component: NewsPage
            },
            {
              path: "/status",
              component: ToDo ,
              meta : { requiresAuth : true }
            },
            {
              path: "/privacy",
              component: MarkdownPage,
              meta : {
                  page : "support"
              }
            },
            {
              path: "/support",
              component: MarkdownPage,
              meta : {
                  page : "chat"
              }
            },
            {
              path: "/terms",
              component: MarkdownPage,
              meta : {
                  page : "terms"
              }
            },
            {
              path: "/visa",
              component: MarkdownPage,
              meta : {
                  page : "visa"
              }
            },
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