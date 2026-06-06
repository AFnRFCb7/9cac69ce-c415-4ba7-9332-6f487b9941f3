<template>
<section class="card" aria-labelledby="imm-news-title">
  <h2 id="imm-news-title">🧭 {{ t("Immigration News") }}</h2>

  <article v-for="item in immigrationNews" :key="item.title" class="news-card">
    <h3>
      <a :href="item.url" target="_blank">
        {{ item.title[locale] }}
      </a>
    </h3>

    <p>{{ item.summary[locale] }}</p>
  </article>
</section>
</template>
<script setup lang="ts">
const immigrationNews = [
  {
    title: {
      en: "Scotland fans 'heartbroken' as travel permits to World Cup withdrawn last minute",
      es: "Aficionados escoceses 'desconsolados' por la retirada de permisos de viaje al Mundial",
      zh: "苏格兰球迷因世界杯旅行许可临时撤销而‘心碎’"
    },

    summary: {
      en: "Travel permits were withdrawn unexpectedly, disrupting fan travel plans.",
      es: "Los permisos de viaje fueron retirados inesperadamente, interrumpiendo los planes de los aficionados.",
      zh: "旅行许可被意外撤销，打乱了球迷的行程安排。"
    }
    url: "https://www.bbc.com/news/articles/cwy2yleex87o"
  }
];
import { useI18n } from "vue-i18n";
const { t , locale } = useI18n();
</script>
