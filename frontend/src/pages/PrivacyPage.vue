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

const { locale } = useI18n();
const route = useRoute();

const html = ref("");

async function loadMarkdown(path: string) {
  const res = await fetch(path);
  const text = await res.text();
  html.value = DOMPurify.sanitize(await marked.parse(text));
}

watchEffect(() => {
  const page = route.meta.page as string;

  const file =
    `/content/${page}.${locale.value}.md`;

  loadMarkdown(file);
});
</script>