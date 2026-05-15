import { createI18n } from "vue-i18n";

import en from "../locales/en.json";
import es from "../locales/es.json";
import zh from "../locales/zh.json";

const savedLocale = localStorage.getItem("locale") ?? "en";

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: "en",
  messages: {
    en,
    es,
    zh,
  },
});