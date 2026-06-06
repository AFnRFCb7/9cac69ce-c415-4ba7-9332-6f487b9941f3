import { createRouter, createWebHistory } from "vue-router";
import NewsList from "../pages/NewsList.vue";
import NewsEdit from "../pages/NewsEdit.vue";

const routes = [
  { path: "/", redirect: "/news" },
  { path: "/news", component: NewsList },
  { path: "/news/new", component: NewsEdit },
  { path: "/news/:id", component: NewsEdit }
];

export default createRouter({
  history: createWebHistory(),
  routes
});