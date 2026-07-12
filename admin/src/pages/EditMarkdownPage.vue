<template>
  <main class="edit-markdown">
    <h1>Markdowns</h1>


    <div>
      <div
        v-for="(pages, lang) in markdown"
        :key="lang"
        class="lang-block"
      >
        <h2>{{ lang }}</h2>

        <ul>
          <li
            v-for="(url, page) in pages"
            :key="page"
          >
            <strong @click="view(lang, page)">{{ page }}</strong>
            <br />
          </li>
        </ul>
      </div>
    </div>
    <div v-if="viewer" class="side-panel">
        <div class="side-panel-header">
          <h2>{{ viewer.page }} ({{ viewer.lang }})</h2>

          <div>
            <button @click="editing = !editing">
              {{ editing ? "Preview" : "Edit" }}
            </button>

            <button @click="closeViewer">Close</button>
          </div>
        </div>

      <div v-if="!editing" v-html="viewer.text"></div>

      <textarea
        v-else
        v-model="viewer.text"
        class="side-panel-editor"
      />
    </div>
  </main>
</template>

<script setup lang="ts">

import { computed , ref , onMounted } from "vue";
import { cms } from "@shared/state/cms";
import { markdown } from "@/state/markdown";
import { render } from "@shared/render/render.ts"
import { marked } from "marked";
import DOMPurify from "dompurify";

async function loadAllMarkdown() {
  const result: any = {};

  for (const [lang, pages] of Object.entries(cms.data.markdown)) {
    result[lang] = {};

    for (const [page, url] of Object.entries(pages as any)) {
      const res = await fetch(url);
      const text = await res.text() ;
      const html = render(text);
      result[lang][page] = html ;
    }
  }

  markdown.value = result;
}
onMounted(() => {
  loadAllMarkdown();
});

const viewer = ref<null | {
  lang: string;
  page: string;
  text: string;
}>(null);

function view(lang: string, page: string) {
  viewer.value = {
    lang,
    page,
    text: markdown.value?.[lang]?.[page] ?? ""
  };
}
function closeViewer() {
  viewer.value = null;
}

const editing = ref(false);
</script>

<style scoped>
.side-panel {
  position: fixed;
  top: 0;
  right: 0;

  width: 40vw;
  height: 100vh;

  background: white;
  border-left: solid black 1px;

  overflow: auto;

  z-index: 9999;
}

.side-panel-body {
  white-space: pre-wrap;
}
.side-panel-header {
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.25rem;
}
.side-panel-editor {
  width: 100%;
  height: calc(100vh - 60px); /* almost full panel */
  padding: 1rem;

  border: none;
  outline: none;

  font-family: monospace;

  resize: none;

  box-sizing: border-box;
}
</style>