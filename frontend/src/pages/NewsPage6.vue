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
import { ref, onMounted } from "vue";

const immigrationNews = ref([]);

onMounted(async () => {
  const res = await fetch("${import.meta.env.VITE_API_BASE}/api/immigration-news");
  immigrationNews.value = await res.json();
});
import { useI18n } from "vue-i18n";
const { t , locale } = useI18n();
</script>