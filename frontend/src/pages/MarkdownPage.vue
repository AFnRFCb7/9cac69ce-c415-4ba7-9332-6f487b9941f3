<template>
  <main class="content">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="html" />
  </main>
</template>

<script setup lang="ts">

import DOMPurify from "dompurify";
import { createApp , ref, onMounted , watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { marked } from "marked";
import SlideShow from "@/components/SlideShow.vue" ;

import { cms } from "@shared/state/cms";

const API = import.meta.env.VITE_API_BASE;

const { locale } = useI18n();
const route = useRoute();

const html = ref("");

async function loadMarkdown(page: string, lang: string) {

  const url =
    cms.data?.markdown?.[lang]?.[page];

  if(!url){
    html.value = "<p>Content not found</p>" ;
  }

  const res = await fetch(url);

  if (!res.ok) {
    html.value = "<p>Content not found</p>";
    return;
  }

  let text = await res.text();

text = text.replace(
  /:::slideshow\s*([\s\S]*?)\s*:::/g,
  (_, block) => {
    const images = block
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);

    return `<div class="slideshow" data-images="${images.join("|")}"></div>`;
  }
);

  // 1. Convert slideshow syntax → marker
  text = text.replace(
    /!\[\]\(slideshow:\/\/([^)]+)\)/g,
    (_, id) => `[[SLIDESHOW:${id}]]`
  );
  // 2. Render markdown → HTML
  const rendered = await marked.parse(text);
  html.value = DOMPurify.sanitize(rendered);


  // 3. mount slideshows AFTER DOM paint (important)
  requestAnimationFrame(() => {
    mountSlideshows();
  });

  // 4. analytics
  fetch(`${API}/api/view/${page}`, {
    method: "POST"
  }).catch(() => {});
}

function mountSlideshows() {
  document.querySelectorAll(".slideshow").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;

    const raw = el.getAttribute("data-images");

    if (!raw) return;

    const images = raw.split("|");

    createApp(SlideShow, { images }).mount(el);
  });
}

async function refresh() {
  const page =
    (route.meta.page as string) || "home";

  const lang =
    locale.value || "en";

  await loadMarkdown(page, lang);
}

onMounted(refresh);

watch(
  () => route.fullPath,
  refresh
);

watch(
  locale,
  refresh
);

</script>