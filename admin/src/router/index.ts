import { createRouter, createWebHistory } from "vue-router";
import ClickCounts from "../pages/ClickCounts.vue" ;
import EditPage from "../pages/EditPage.vue" ;
import EditMarkdownPage from "../pages/EditMarkdownPage.vue" ;
import EditMetadataPage from "../pages/EditMetadataPage.vue" ;
import MarkdownEditPage from "../pages/MarkdownEditPage.vue" ;
import HomePage from "../pages/HomePage.vue";
import ImagePage from "../pages/ImagePage.vue";
import MarkdownList from "../pages/MarkdownList.vue" ;
import NewsList from "../pages/NewsList.vue";
import NewsEdit from "../pages/NewsEdit.vue";

const routes = [
  { path: "/", component : HomePage } ,
  { path : "/admin/edit" , component : EditPage } ,
  { path : "/admin/edit/markup" , component : EditMarkdownPage } ,
  { path : "/admin/edit/metadata" , component : EditMetadataPage }
];

export default createRouter({
  history: createWebHistory(),
  routes
});