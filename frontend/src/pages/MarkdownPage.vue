<template>
  <main class="content">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="html" />
  </main>
</template>

<script setup lang="ts">
import DOMPurify from "dompurify";
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { marked } from "marked";

const API = import.meta.env.VITE_API_BASE;

const { locale } = useI18n();
const route = useRoute();

const html = ref("");

async function loadMarkdown(page: string, lang: string) {
  const res = await fetch(
    `${API}/api/content/${page}?lang=${lang}`
  );

  if (!res.ok) {
    html.value = "<p>Content not found</p>";
    return;
  }

  const text = await res.text();

  html.value = DOMPurify.sanitize(await marked.parse(text));
}

watchEffect(() => {
  const page = (route.meta.page as string) || "home";
  const lang = locale.value || "en";

  loadMarkdown(page, lang);
});
</script>