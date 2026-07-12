import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { ensureCMSLoaded } from "@shared/state/load";

async function bootstrap() {
  await ensureCMSLoaded();

  const app = createApp(App);
  app.use(router);
  app.mount("#app");
}

bootstrap();