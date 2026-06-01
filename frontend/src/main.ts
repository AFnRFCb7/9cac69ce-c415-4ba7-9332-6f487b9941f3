import "./socket";
import { createApp } from "vue";

import App from "./App.vue";
import { router } from "./router";
import { i18n } from "./i18n";
import "@/assets/global.css";

import { loadUser } from "@/auth";

async function bootstrap() {
  await loadUser();

  createApp(App)
    .use(router)
    .use(i18n)
    .mount("#app");
    console.log("BOOT LOCALE", i18n.global.locale.value);
    console.log("LOCALSTORAGE locale =", localStorage.getItem("locale"));
}

bootstrap();