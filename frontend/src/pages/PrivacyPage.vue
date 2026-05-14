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
import { marked } from "marked"; // markdown parser

const { locale } = useI18n();

const html = ref("");

async function loadMarkdown(path: string) {
  const res = await fetch(path);
  const text = await res.text();
  html.value = DOMPurify.sanitize(marked.parse(text));
}

const FILES: Record<string, string> = {
  en: "/content/privacy.en.md",
  zh: "/content/privacy.zh.md",
  es: "/content/privacy.es.md",
};

watchEffect(() => {
  const file = FILES[locale.value] ?? FILES.en;
  loadMarkdown(file);
});
</script>